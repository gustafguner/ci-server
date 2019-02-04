const compileCode = require('./../src/index.ts');

test('Test successfull compilation', () => {
  var result = compileCode("./dummy-code/src/MainSuccess.java");
    expect(result.success).toBe(true);
    expect(result.type).toBe("compilation");
    expect(result.message).toBe("");
});

test('Test unsuccessfull compilation', () => {
  var result = compileCode("./dummy-code/src/MainFail.java");
    expect(result.success).toBe(false);
    expect(result.type).toBe("compilation");
    expect(result.message).toBe("class Main is public, should be declared in a file named Main.java public class Main {");
});