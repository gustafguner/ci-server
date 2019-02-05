import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as nodegit from 'nodegit';
import * as fs from 'fs';
import * as glob from 'glob';
import * as dotenv from 'dotenv';
dotenv.config();
import { GithubStatus } from './status';
import * as java from './java';
import * as mongoose from 'mongoose';
import to from 'await-to-js';
import * as rimraf from 'rimraf';

import Build from './models/build';

import * as shell from 'shelljs';
import * as path from 'path';

mongoose
  .connect(process.env.MONGODB_URL, {
    auth: {
      user: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
  })
  .then(() => console.log('💻 Successfully connected to MongoDB'))
  .catch((err) =>
    console.error(
      'An error occured when connecting to the MongoDB database: ',
      err,
    ),
  );

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.json({ success: true });
});

const test = path.join(__dirname, '..');
console.log(test);

app.post('/ci', async (req, res) => {
  if (!process.env.GITHUB_TOKEN) {
    console.log(
      '⚠️  No GitHub token found, please provide one in your .env file.',
    );
    return res.status(500).json({ state: 'failure' });
  }
  const url: string = req.body.repository.clone_url;
  const commitId: string = req.body.head_commit.id;
  const name: string = req.body.repository.name;
  const fullRepoName: string = req.body.repository.full_name;
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
    return res.status(202).json({
      state: 'failure',
      description: 'Cannot find ci-config.json file',
    });
  }

  const status = new GithubStatus(fullRepoName, commitId);

  await status.pending('Build pending');

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

  const response = await java.compileAndTest(buildPath, testFiles);

  console.log(response);

  const build = new Build({
    commitId,
    timestamp: new Date(),
    response,
  });

  const [saveError] = await to(build.save());

  // Remove commitId directory when we are done
  const rootDir = path.join(__dirname, '..');
  shell.cd(rootDir);
  rimraf.sync(directoryPath);

  if (saveError) {
    console.log(`Error when saving to database: ${saveError}`);
    return res.status(500).json({ state: 'failure' });
  }

  await status.success('Build success');
  return res.status(202).json({ state: 'success' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
