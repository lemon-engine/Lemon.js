import { roundNumber } from '@math';

describe('test roundNumber', () => {
  test('use the default round function', () => {
    expect(roundNumber(0, 0)).toEqual(0);
    expect(roundNumber(0.4, 0)).toEqual(0);
    expect(roundNumber(0.5, 0)).toEqual(1);
    expect(roundNumber(1.5, 0)).toEqual(2);
    expect(roundNumber(1.5, 4)).toEqual(1.5);
    expect(roundNumber(1.52, 4)).toEqual(1.52);
    expect(roundNumber(1.523, 4)).toEqual(1.523);
    expect(roundNumber(1.5442, 4)).toEqual(1.5442);
    expect(roundNumber(1.5555, 4)).toEqual(1.5555);
    expect(roundNumber(1.55555, 4)).toEqual(1.5556);
    expect(roundNumber(1.555555555, 4)).toEqual(1.5556);
    expect(roundNumber(1.55552, 4)).toEqual(1.5555);
    expect(roundNumber(0.55555, 4)).toEqual(0.5556);
    expect(roundNumber(0.555555555, 4)).toEqual(0.5556);
    expect(roundNumber(0.55552, 4)).toEqual(0.5555);
  });

  test('use the Math.ceil round function', () => {
    expect(roundNumber(0, 0, Math.ceil)).toEqual(0);
    expect(roundNumber(0.4, 0, Math.ceil)).toEqual(1);
    expect(roundNumber(0.5, 0, Math.ceil)).toEqual(1);
    expect(roundNumber(1.5, 0, Math.ceil)).toEqual(2);
    expect(roundNumber(1.5, 4, Math.ceil)).toEqual(1.5);
    expect(roundNumber(1.52, 4, Math.ceil)).toEqual(1.52);
    expect(roundNumber(1.523, 4, Math.ceil)).toEqual(1.523);
    expect(roundNumber(1.5442, 4, Math.ceil)).toEqual(1.5442);
    expect(roundNumber(1.5555, 4, Math.ceil)).toEqual(1.5556);
    expect(roundNumber(1.55555, 4, Math.ceil)).toEqual(1.5556);
    expect(roundNumber(1.555555555, 4, Math.ceil)).toEqual(1.5556);
    expect(roundNumber(1.55552, 4, Math.ceil)).toEqual(1.5556);
    expect(roundNumber(0.55555, 4, Math.ceil)).toEqual(0.5556);
    expect(roundNumber(0.555555555, 4, Math.ceil)).toEqual(0.5556);
    expect(roundNumber(0.55552, 4, Math.ceil)).toEqual(0.5556);
  });

  test('use the Math.floor round function', () => {
    expect(roundNumber(0, 0, Math.floor)).toEqual(0);
    expect(roundNumber(0.4, 0, Math.floor)).toEqual(0);
    expect(roundNumber(0.5, 0, Math.floor)).toEqual(0);
    expect(roundNumber(1.5, 0, Math.floor)).toEqual(1);
    expect(roundNumber(1.5, 4, Math.floor)).toEqual(1.5);
    expect(roundNumber(1.52, 4, Math.floor)).toEqual(1.52);
    expect(roundNumber(1.523, 4, Math.floor)).toEqual(1.523);
    expect(roundNumber(1.5442, 4, Math.floor)).toEqual(1.5442);
    expect(roundNumber(1.5555, 4, Math.floor)).toEqual(1.5555);
    expect(roundNumber(1.55555, 4, Math.floor)).toEqual(1.5555);
    expect(roundNumber(1.555555555, 4, Math.floor)).toEqual(1.5555);
    expect(roundNumber(1.55552, 4, Math.floor)).toEqual(1.5555);
    expect(roundNumber(0.55555, 4, Math.floor)).toEqual(0.5555);
    expect(roundNumber(0.555555555, 4, Math.floor)).toEqual(0.5555);
    expect(roundNumber(0.55552, 4, Math.floor)).toEqual(0.5555);
  });
});
