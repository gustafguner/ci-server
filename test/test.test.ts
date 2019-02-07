import * as java from '../src/java';

test('Test successfull test', async () => {
  await java.compileCode('./test/dummy-code/test/');
  const result: any = await java.testCode('./test/dummy-code/test/', [
    'TestMainTrue',
  ]);
  expect(result.success).toBe(true);
});

test('Test successfull compile and test', async () => {
  const result: any = await java.compileAndTest('./test/dummy-code/test/', [
    'TestMainTrue',
  ]);
  expect(result.success).toBe(true);
});

test('Test unsuccessfull test', async () => {
  await java.compileCode('./test/dummy-code/test/');
  const result: any = await java.testCode('./test/dummy-code/test/', [
    'TestMainFalse',
  ]);
  expect(result.success).toBe(false);
  expect(result.type).toBe('test');
});
