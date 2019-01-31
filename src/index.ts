import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as nodegit from 'nodegit';
import * as path from 'path';
import * as shell from 'shelljs';

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.json({ success: true });
});

app.post('/ci', async (req, res) => {
  const url: string = req.body.repository.clone_url;
  const commitId: string = req.body.head_commit.id;
  const name: string = req.body.repository.name;
  const branchName: string = req.body.ref.substring(11);

  const directoryPath = `./tmp/${name}/${commitId}`;

  // Clone repository
  await nodegit.Clone.clone(url, directoryPath);

  const repo = await nodegit.Repository.open(directoryPath);

  // Checkout to branch from repository
  await repo
    .getBranch(`refs/remotes/origin/${branchName}`)
    .then((reference) => {
      return repo.checkoutRef(reference);
    });

  const srcPath = 'src';
  const testPath = 'test';

  const lang = 'java';
  const command = 'javac';

  // Compile
  await shell.exec(
    `${command} ${directoryPath}/${srcPath}/*.${lang}`,
    (code, stdout, stderr) => {
      console.log(`Code: ${code}`);
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr.length}`);
    },
  );

  res.status(202);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
