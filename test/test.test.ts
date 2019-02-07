const java = require('./../src/java');

test('Test successfull test', async () => {
  await java.compileCode("./test/dummy-code/test/");
  const result = await java.testCode("./test/dummy-code/test/", ["TestMainTrue"]);
  expect(result.success).toBe(true);
});

test('Test successfull compile and test', async () => {
  const result = await java.compileAndTest("./test/dummy-code/test/", ["TestMainTrue"]);
  expect(result.success).toBe(true);
});

test('Test unsuccessfull test', async () => {
  await java.compileCode("./test/dummy-code/test/");
  const result = await java.testCode("./test/dummy-code/test/", ["TestMainFalse"]);
  expect(result.success).toBe(false);
  expect(result.type).toBe("test");
});
