const java = require('./../src/java');

test('Test successfull compilation of source code', async () => {
  const result = await java.compileCode("./test/dummy-code/src/whole/");
  expect(result.success).toBe(true);
  expect(result.type).toBe("Compilation");
});

test('Test unsuccessfull compilationof source code', async () => {
  const result = await java.compileCode("./test/dummy-code/src/broken/");
  console.log(result);
  expect(result.success).toBe(false);
  expect(result.type).toBe("Compilation");
});

// test('Test successfull compilation of test code', async () => {
//   const result = await java.compileCode("./test/dummy-code/src/TestMainTrue.java");
//   expect(result.success).toBe(true);
//   expect(result.type).toBe("Compilation");
// });
