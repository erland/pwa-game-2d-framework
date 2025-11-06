import { FixedStepper } from '../time';

describe('FixedStepper', () => {
  it('accumulates delta and emits fixed steps at target Hz', () => {
    const stepper = new FixedStepper(10); // 10 Hz => 100ms per step
    let ticks = 0;
    stepper.tick(50, () => ticks++);   // +0.5 step
    stepper.tick(60, () => ticks++);   // +0.6 step => should fire 1, carry 0.1
    expect(ticks).toBe(1);
  });
});