import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as nodegit from 'nodegit';
import * as path from 'path';
import * as shell from 'shelljs';
import * as fs from 'fs';
import * as glob from 'glob';
import { commands } from './config';

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

  const directoryPath = `tmp/${name}/${commitId}`;

  // Clone repository
  await nodegit.Clone.clone(url, directoryPath);

  const repo = await nodegit.Repository.open(directoryPath);

  // Checkout to branch from repository
  await repo
    .getBranch(`refs/remotes/origin/${branchName}`)
    .then((reference) => {
      return repo.checkoutRef(reference);
    });

  if (!fs.existsSync(`${directoryPath}/ci-config.json`)) {
    return res
      .status(202)
      .json({ state: 'failure', description: 'Missing config file' });
  }

  const rawData = fs.readFileSync(`${directoryPath}/ci-config.json`, 'utf8');
  const config = JSON.parse(rawData);

  const buildPath = `${directoryPath}/__build__`;
  const srcPath = `${directoryPath}/src`;
  const testPath = `${directoryPath}/test`;

  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath);
  }

  // Keep track of the files' origin
  const srcFiles: string[] = [];
  const testFiles: string[] = [];

  await new Promise((resolve, reject) => {
    glob(`${srcPath}/*.java`, (err, files) => {
      if (err) {
        reject();
      } else {
        files.forEach((file) => {
          const fileName = file.split('/').pop();
          fs.copyFileSync(`${file}`, `${buildPath}/${fileName}`);
          srcFiles.push(fileName.split('.')[0]);
        });
        resolve();
      }
    });
  });

  await new Promise((resolve, reject) => {
    glob(`${testPath}/*.java`, (err, files) => {
      if (err) {
        reject();
      } else {
        files.forEach((file) => {
          const fileName = file.split('/').pop();
          fs.copyFileSync(`${file}`, `${buildPath}/${fileName}`);
          testFiles.push(fileName.split('.')[0]);
        });
        resolve();
      }
    });
  });

  console.log(`All files moved`);

  const lang = 'java';
  const compileCommand = 'javac';
  const testCommand = 'java org.junit.runner.JUnitCore';

  // Compile
  await new Promise((resolve, reject) => {
    shell.exec(
      `${compileCommand} ${path.join(__dirname, `../${buildPath}`)}/*.${lang}`,
      (code, stdout, stderr) => {
        resolve();
      },
    );
  });

  console.log('All .java files compiled');

  const testResult: string[] = [];

  shell.cd(buildPath);
  shell.exec('pwd');
  shell.exec('ls');

  testFiles.forEach((file) => {
    console.log(`Execute for: ${file}`);
    shell.exec(`${testCommand} ${file}`, (code, stdout, stderr) => {
      console.log(`Code: ${code}`);
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr.length}`);
      testResult.push(stdout);
    });
  });

  res.status(202);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
