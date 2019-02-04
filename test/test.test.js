const java = require('./../src/java');

// Compile tests before running them
java.compileCode("./dummy-code/src/TestMainTrue.java");
java.compileCode("./dummy-code/src/TestMainFalse.java");


test('Test successfull test', () => {
  var result = java.testCode("./dummy-code/src/TestMainTrue");
    expect(result.success).toBe(true);
    expect(result.type).toBe("test");
    // expect(result.message).toBe("");
});

test('Test unsuccessfull compilation', () => {
  var result = java.testCode("./dummy-code/src/TestMainFalse");
    expect(result.success).toBe(false);
    expect(result.type).toBe("test");
    // expect(result.message).toBe("");
});