import * as shell from 'shelljs';

const lang = 'java';
const compileCommand = 'javac';
const testCommand = 'java org.junit.runner.JUnitCore';

const compileCode = async (path: string) => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `${compileCommand} ${path}/*.${lang}`,
      (code, stdout, stderr) => {
        if (stdout.length !== 0) {
          resolve({ success: true, type: 'Compilation', message: stdout });
        }
        reject({
          success: false,
          type: 'Compilation',
          message: { stdout, stderr },
        });
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
        if (stderr.length !== 0) {
          testResultsOut.push(stdout);
        }
        if (stderr.length !== 0) {
          testResultsErr.push(stderr);
        }
      });
    });

    if (testResultsErr.length !== 0) {
      reject({
        success: false,
        type: 'Test',
        message: `${testResultsErr.length}/${testFiles.length} succeded`,
      });
    }
    resolve({
      successs: true,
      type: 'Test',
      message: `${testResultsOut.length}/${testFiles.length} succeded`,
    });
  });
};

export { compileCode, testCode };
