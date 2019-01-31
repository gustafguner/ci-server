import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as nodegit from 'nodegit';
import * as path from 'path';

const { c, cpp, node, python, java } = require('compile-run');

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

java.runFile(
  `${path.dirname(__dirname)}/dummy-code/Main.java`,
  {},
  (err, result) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      if (result.stderr.length !== 0) {
        console.log('Compile error');
      } else {
        console.log(result.stdout);
      }
    }
  },
);

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

  // Providing custom path in java
  await java.runFile(`./Main.java`, {}, (err, result) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('Successs result: ', result);
    }
  });

  res.status(202);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
