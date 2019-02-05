const java = require('./../src/java');

test('Test successfull test', async () => {
  await java.compileCode("./dummy-code/test/");
  const result = await java.testCode("./dummy-code/test/", "TestMainTrue");
  expect(result.success).toBe(true);
});

test('Test unsuccessfull compilation', async () => {
  await java.compileCode("./dummy-code/src/TestMainFalse.java");
  const result = await java.testCode("./dummy-code/src/", "TestMainFalse");
  expect(result.success).toBe(false);
  expect(result.type).toBe("test");
  expect(result.message).toBe("");
});