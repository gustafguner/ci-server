const suma = require('./math');

test('Adding 1 + 1 equals 2', () => {
  expect(suma(1, 1)).toBe(2);
});