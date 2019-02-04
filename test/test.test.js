const java = require('./../src/java');

test('Test successfull test', async () => {
  // await ava.compileCode("./dummy-code/src/TestMainTrue.java");
  // const result = await java.testCode("./dummy-code/src/", "TestMainTrue");
  // expect(result.success).toBe(true);
  // expect(result.type).toBe("test");
  // expect(result.message).toBe("");
});

test('Test unsuccessfull compilation', async () => {
  // await java.compileCode("./dummy-code/src/TestMainFalse.java");
  // const result = await java.testCode("./dummy-code/src/", "TestMainFalse");
  // expect(result.success).toBe(false);
  // expect(result.type).toBe("test");
  // expect(result.message).toBe("");
});