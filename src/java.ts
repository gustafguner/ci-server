import { commands } from './config';
import * as shell from 'shelljs';
import to from 'await-to-js';

const lang = commands.java.name;
const compileCommand = commands.java.compile;
const testCommand = commands.java.test;

const compileCode = async (path: string) => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `${compileCommand} ${path}/*.${lang}`,
      (code, stdout, stderr) => {
        if (stderr.length === 0) {
          resolve({ succes: true, type: 'Compilation', message: stdout });
        } else {
          reject({
            succes: false,
            type: 'Compilation',
            message: { stdout, stderr },
          });
        }
      },
    );
  });
};

const testCode = async (path: string, testFiles: string[]) => {
  const testResultsOut: string[] = [];
  const testResultsErr: string[] = [];

  return new Promise((resolve, reject) => {
    shell.cd(path);

    const promises = [];

    testFiles.forEach((file, i) => {
      const promise = new Promise((resolve2, reject2) => {
        shell.exec(`${testCommand} ${file}`, (code, stdout, stderr) => {
          if (stdout.length !== 0) {
            testResultsOut.push(stdout);
          }
          if (stderr.length !== 0) {
            testResultsErr.push(stderr);
          }
          resolve2();
        });
      });
      promises.push(promise);
    });

    Promise.all(promises)
      .then(() => {
        if (testResultsErr.length === 0) {
          resolve({
            success: true,
            type: 'Test',
            message: `${testResultsOut.length}/${testFiles.length} succeded`,
          });
        } else {
          reject({
            succes: false,
            type: 'Test',
            message: `${testResultsErr.length}/${testFiles.length} succeded`,
          });
        }
      })
      .catch(() => {
        reject();
      });
  });
};

const compileAndTest = async (buildPath: string, testFiles: string[]) => {
  let err;
  let output;

  [err, output] = await to(compileCode(buildPath));

  if (err) {
    return err;
  }

  [err, output] = await to(testCode(buildPath, testFiles));

  if (err) {
    return err;
  }

  return output;
};

export { compileCode, testCode, compileAndTest };
