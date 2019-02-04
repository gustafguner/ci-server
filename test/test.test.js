const testCode = require('./../src/index.ts');

test('Test successfull test', () => {
  var result = testCode("./dummy-code/src/TestMainTrue");
    expect(result.success).toBe(true);
    expect(result.type).toBe("test");
    // expect(result.message).toBe("");
});

test('Test unsuccessfull compilation', () => {
  var result = testCode("./dummy-code/src/TestMainFalse");
    expect(result.success).toBe(false);
    expect(result.type).toBe("test");
    // expect(result.message).toBe("");
});