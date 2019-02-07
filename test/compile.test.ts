import * as java from '../src/java';

test('Test successfull compilation of source code', async () => {
  const result: any = await java.compileCode('./test/dummy-code/src/whole/');
  expect(result.success).toBe(true);
});

test('Test unsuccessfull compilation source code', async () => {
  const result: any = await java.compileCode('./test/dummy-code/src/broken/');
  expect(result.success).toBe(false);
  expect(result.type).toBe('compilation');
});

test('Test successfull compilation of test code', async () => {
  const result: any = await java.compileCode('./test/dummy-code/test/');
  expect(result.success).toBe(true);
});

test('Test compilation with no files', async () => {
  const result: any = await java.compileCode('./test/dummy-code/src/');
  expect(result.type).toBe('compilation');
  expect(result.success).toBe(false);
});

test('Test compilation of broken test file', async () => {
  const result: any = await java.compileCode(
    './test/dummy-code/test/broken-test/',
  );
  expect(result.type).toBe('compilation');
  expect(result.success).toBe(false);
});
