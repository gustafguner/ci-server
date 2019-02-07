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

import { commands } from './config';

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

const style = `
  <style>
    table {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
      border-collapse: collapse;
      width: 100%;
    }

    td, th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    .success {
      background-color: lightgreen;
    }

    .fail {
      background-color: lightpink;
    }
  </style>`;

/**
 * @api {get} /build/:commitId Display specific build log
 * @apiName getBuild
 * @apiGroup Build
 * 
 * @apiDescription Create a HTML representation of a specific build's log and send it to browser for display
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} commitId Unique commit ID for a build
 * @apiParam {String} message The response message for a build 
 * @apiParam {String} success The success response or a build
 * @apiParam {String} type The type of error
 * @apiParam {String} timestamp The timestamp of a build
 * 
 * @apiSuccess (200 OK) {String} response Sends specific log information to display in browser
 * 
 * @apiError (500 Internal Server Error) {String} BuildError Returns an error response if it is unable to fetch builds from the database
 * @apiErrorExample {String} Error-Response:
 * Error fetching builds from database
 */
app.get('/build/:commitId', async (req, res) => {
  const commitId = req.params.commitId;
  const [error, result] = await to(Build.findOne({ commitId }).exec());

  if (error) {
    console.log('/builds Error: ', error);
    return res.send('Error fetching builds from database');
  }

  const message = result.response.message.replace(/\n/g, '<br>');
  let html = style;
  html += `<table>
  <tr>
    <th>Commit Id</th>
    <th>Message</th>
    <th>Success</th>
    <th>Type</th>
    <th>Timestamp</th>
  </tr>
  <tr>
    <td>${result.commitId}</td>
    <td>${result.response.message}</td>
    <td>${result.response.success}</td>
    <td>${
      typeof result.response.type === 'undefined' ? '' : result.response.type
    }</td>
    <td>${result.timestamp}</td>
  </tr>`;

  html += '</table>';

  res.send(html);
});

/**
 * @api {get} /builds Display log for all builds
 * @apiName getBuilds
 * @apiGroup Build
 * 
 * @apiDescription Create a HTML representation of all the build's logs and send it to browser for display
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} success The build's success response 
 * @apiParam {String} commitId The build's unique commit ID
 * 
 * @apiSuccess (200 OK) {String} response Sends all log information of the builds to display in browser
 * 
 * @apiError (500 Internal Server Error) {String} BuildError Returns an error response if it is unable to fetch a build from the database
 * @apiErrorExample {String} Error-Response:
 * Error fetching builds from database
 */
app.get('/builds', async (req, res) => {
  const [error, result] = await to(Build.find({}).exec());

  if (error) {
    console.log('/builds Error: ', error);
    return res.send('Error fetching builds from database');
  }
  let html = style;
  html += `
  <table>
    <tr>
      <th>Commit ID</th>
    </tr>`;

  result.reverse();

  result.forEach((build, i) => {
    const trClass = build.response.success ? 'success' : 'fail';
    html += `
        <tr class="${trClass}">
          <td>
            <a href="./build/${build.commitId}">${build.commitId}</a>
          </td>
        </tr>
      </a>
    `;
  });

  html += `</table>`;
  res.send(html);
});

/**
 * @api {post} /ci Compile and execute test for repository
 * @apiName postCI
 * @apiGroup Server
 * 
 * @apiDescription Request compilation and test execution from CI-server for a specific repository.
 * 
 * @apiVersion 1.0.0
 * @apiParam {String} commitId A unique commit ID
 * @apiParam {String} url The URL to clone repository 
 * @apiParam {String} name Name of the repository
 * @apiParam {String} fullRepoName Full name of the repository 
 * @apiParam {String} branchName Name of the repository's branch
 * @apiParam {String} GITHUB_TOKEN The token for a github repository
 * 
 * @apiSuccess (202 Accepted) {json} response The server accepts the request if the build was created succesfully. However, it will also accept requests that are missing the `ci-config.json` file or if there are compilation and/or test execution error (the `message` describes what type of error; `test` or `compilation`)
 * @apiSuccessExample {json} Success-Response: 
 * { state: 'success' }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     state: 'failure',
 *     description: 'Cannot find ci-config.json file',
 * }
 * @apiSuccessExample {json} Success-Response:
 * { state: 'failure', message: 'Type: test' }
 * 
 * @apiError (500 Internal Server Error) {json} MissingGithubToken GitHub token missing
 * @apiErrorExample {json} Error-Response:
 * { state: 'failure' }
 * 
 * @apiError (500 Internal Server Error) {json} SaveError Error when saving to database
 * @apiErrorExample {json} Error-Response:
 * { state: 'failure', messsage: 'Internal server error' }
 */
app.post('/ci', async (req, res) => {
  if (!process.env.GITHUB_TOKEN) {
    console.log(
      '⚠️  No GitHub token found, please provide one in your .env file.',
    );
    return res.status(500).json({ state: 'failure' });
  }

  if (req.body.zen) {
    return res.status(202).json({ state: 'success' });
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

  const status = new GithubStatus(fullRepoName, commitId, req.headers.host);

  // Checkout to branch from repository
  await repo
    .getBranch(`refs/remotes/origin/${branchName}`)
    .then((reference) => {
      return repo.checkoutRef(reference);
    });

  if (!fs.existsSync(`${directoryPath}/ci-config.json`)) {
    await status.error('Missing ci-config.json file');
    return res.status(202).json({
      state: 'failure',
      description: 'Cannot find ci-config.json file',
    });
  }

  await status.pending('Build pending');

  const rawData = fs.readFileSync(`${directoryPath}/ci-config.json`, 'utf8');
  const config = JSON.parse(rawData);

  const buildPath = `${directoryPath}/__build__`;
  const srcPath = `${directoryPath}/${config.path.src}`;
  const testPath = `${directoryPath}/${config.path.test}`;

  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath);
  }

  const srcFiles: string[] = [];
  const testFiles: string[] = [];

  await new Promise((resolve, reject) => {
    glob(
      `${srcPath}/*.${commands[config.language].fileExtension}`,
      (err, files) => {
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
      },
    );
  });

  await new Promise((resolve, reject) => {
    glob(
      `${testPath}/*.${commands[config.language].fileExtension}`,
      (err, files) => {
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
      },
    );
  });

  let response: any = { success: true, message: 'No files exists' };

  if (srcFiles.length > 0 && testFiles.length > 0) {
    if (config.language === 'java') {
      response = await java.compileAndTest(buildPath, testFiles);
    }
  }

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
    await status.error('Internal server error');
    return res
      .status(500)
      .json({ state: 'failure', messsage: 'Internal server error' });
  }

  if (response.success === false) {
    await status.failure(`Failure. Type: ${response.type}`);
    return res
      .status(202)
      .json({ state: 'failure', message: `Type: ${response.type}` });
  }

  await status.success('Build success');
  return res.status(202).json({ state: 'success' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
