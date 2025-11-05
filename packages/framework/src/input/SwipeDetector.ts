import Phaser from "phaser";
import { Dir4 } from "./Dir4";

export type SwipeOptions = {
  /** px, default 24 (before DPR) */
  minDistance?: number;
  /** default 180 ms (taps under this are ignored) */
  maxTapTimeMs?: number;
  /** scale minDistance by devicePixelRatio (default true) */
  scaleWithDPR?: boolean;
};

/** A single swipe sample returned by `consume()` / `peek()`. */
export type SwipeSample = {
  dx: number;       // horizontal delta (+ right, - left)
  dy: number;       // vertical delta (+ down, - up)
  absX: number;     // |dx|
  absY: number;     // |dy|
  duration: number; // ms between pointer down and up
  dir: Dir4;        // dominant axis direction
};

/** Very small swipe detector; exposes both an event-style `emit(dir)` and a pull API (`consume()`). */
export class SwipeDetector {
  private scene: Phaser.Scene;
  private minDistance: number;
  private maxTapTimeMs: number;
  private start?: { x: number; y: number; t: number; id: number };

  // Small FIFO so consumers can poll in their own loop
  private queue: SwipeSample[] = [];

  constructor(scene: Phaser.Scene, opts: SwipeOptions = {}) {
    this.scene = scene;
    const dpr =
      typeof window !== "undefined" && window.devicePixelRatio
        ? window.devicePixelRatio
        : 1;
    const base = opts.minDistance ?? 24;
    this.minDistance = (opts.scaleWithDPR ?? true) ? Math.round(base * dpr) : base;
    this.maxTapTimeMs = opts.maxTapTimeMs ?? 180;

    // listeners
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this);

    // auto-clean on scene shutdown/destroy
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
    scene.events.once(Phaser.Scenes.Events.DESTROY, this.destroy, this);
  }

  public destroy() {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    this.clear();
  }

  private onDown(pointer: Phaser.Input.Pointer) {
    this.start = { x: pointer.x, y: pointer.y, t: performance.now(), id: pointer.id };
  }

  private onUp(pointer: Phaser.Input.Pointer) {
    if (!this.start || this.start.id !== pointer.id) return;

    const dt = performance.now() - this.start.t;
    const dx = pointer.x - this.start.x;
    const dy = pointer.y - this.start.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    this.start = undefined;

    // Ignore taps / very short motion.
    // Qualify as a swipe if either axis exceeds threshold; short taps under maxTapTimeMs are ignored.
    const qualifies = ax >= this.minDistance || ay >= this.minDistance;
    const isShortTap = dt <= this.maxTapTimeMs && ax < this.minDistance && ay < this.minDistance;
    if (!qualifies || isShortTap) return;

    const dir: Dir4 = ax > ay ? (dx > 0 ? Dir4.Right : Dir4.Left) : (dy > 0 ? Dir4.Down : Dir4.Up);

    // Enqueue for polling consumers
    this.queue.push({ dx, dy, absX: ax, absY: ay, duration: dt, dir });
    if (this.queue.length > 4) this.queue.shift(); // keep tiny

    // Fire optional event hook for push-style consumers
    this.emit?.(dir);
  }

  /** Returns and removes the oldest swipe, or `null` if none. */
  public consume(): SwipeSample | null {
    return this.queue.length ? this.queue.shift()! : null;
  }

  /** Returns the oldest swipe without removing it, or `null` if none. */
  public peek(): SwipeSample | null {
    return this.queue.length ? this.queue[0] : null;
  }

  /** Clears any pending swipes. */
  public clear(): void {
    this.queue.length = 0;
  }

  /** Hook injected by controller: called when a swipe is detected. */
  public emit?: (dir: Dir4) => void;
}