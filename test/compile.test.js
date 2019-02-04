const compileCode = require('./../src/index.ts');

test('Test successfull compilation of source code', () => {
  var result = compileCode("./dummy-code/src/MainSuccess.java");
    expect(result.success).toBe(true);
    expect(result.type).toBe("compilation");
    expect(result.message).toBe("");
});

test('Test unsuccessfull compilationof source code', () => {
  var result = compileCode("./dummy-code/src/MainFail.java");
    expect(result.success).toBe(false);
    expect(result.type).toBe("compilation");
    expect(result.message).toBe("class Main is public, should be declared in a file named Main.java public class Main {");
});

test('Test successfull compilation of test code', () => {
  var result = compileCode("./dummy-code/src/TestMainTrue.java");
    expect(result.success).toBe(true);
    expect(result.type).toBe("compilation");
    expect(result.message).toBe("");
});
