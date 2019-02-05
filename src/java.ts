import { commands } from './config';
import * as shell from 'shelljs';

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
    testFiles.forEach((file, i) => {
      shell.exec(`${testCommand} ${file}`, (code, stdout, stderr) => {
        if (stdout.length !== 0) {
          testResultsOut.push(stdout);
        }
        if (stderr.length !== 0) {
          testResultsErr.push(stderr);
        }
      });
    });

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
  });
};

export { compileCode, testCode };
