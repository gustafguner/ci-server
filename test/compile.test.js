const java = require('./../src/java');

test('Test successfull compilation of source code', () => {
  var result = java("./dummy-code/src/MainSuccess.java");
    expect(result.success).toBe(true);
    expect(result.type).toBe("Compilation");
});

test('Test unsuccessfull compilationof source code', () => {
  var result = java("./dummy-code/src/MainFail.java");
    expect(result.success).toBe(false);
    expect(result.type).toBe("Compilation");
});

test('Test successfull compilation of test code', () => {
  var result = java("./dummy-code/src/TestMainTrue.java");
    expect(result.success).toBe(true);
    expect(result.type).toBe("Compilation");
});
