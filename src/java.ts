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
        if (stderr.length !== 0) {
          reject({
            success: false,
            type: 'compilation',
            message: stderr,
          });
        } else {
          resolve({ success: true, message: stdout });
        }
      },
    );
  });
};

const testCode = async (path: string, testFiles: string[]) => {
  const failingTestFiles: string[] = [];

  return new Promise((resolve, reject) => {
    shell.cd(path);

    const promises = [];

    testFiles.forEach((file, i) => {
      const promise = new Promise((resolveInner, rejectInner) => {
        shell.exec(`${testCommand} ${file}`, (code, stdout, stderr) => {
          const lines = stdout.split('\n');
          const statusLine = lines[lines.length - 3];

          if (statusLine.substring(0, 2) !== 'OK' || stderr.length !== 0) {
            failingTestFiles.push(file);
          }
          resolveInner();
        });
      });
      promises.push(promise);
    });

    Promise.all(promises)
      .then(() => {
        if (failingTestFiles.length !== 0) {
          let message = `Error: ${failingTestFiles.length}/${
            testFiles.length
          } test files failed. \n The following tests failed:\n`;

          failingTestFiles.forEach((file) => {
            message += `${file}\n`;
          });

          reject({
            success: false,
            type: 'test',
            message,
          });
        } else {
          resolve({
            success: true,
            message: 'All test files succeeded!',
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
