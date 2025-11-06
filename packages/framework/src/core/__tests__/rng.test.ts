import { SeqRNG } from '../rng';

test('SeqRNG emits a predictable sequence', () => {
  const rng = new SeqRNG([0.1, 0.5, 0.9]);
  expect(rng.next()).toBeCloseTo(0.1);
  expect(rng.next()).toBeCloseTo(0.5);
  expect(rng.next()).toBeCloseTo(0.9);
  expect(rng.next()).toBeCloseTo(0.1); // loops
});