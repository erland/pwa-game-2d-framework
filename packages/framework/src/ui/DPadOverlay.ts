import Phaser from "phaser";

export type DPadOptions = {
  /** Event names to emit on click/tap; defaults match the existing Snake events. */
  events?: { up?: string; down?: string; left?: string; right?: string };
  radius?: number;  // default 26
  gap?: number;     // default 10
  anchor?: "bottom-right" | "bottom-left" | "bottom-center";
  safeAreaProvider?: () => { left: number; right: number; top: number; bottom: number };
};

/**
 * Simple on-screen D-pad for touch devices. Emits scene events on presses.
 * Usage:
 *   const dpad = new DPadOverlay(this, { events: { up: "move_up", ... } });
 *   dpad.attach(); // creates and positions
 *   dpad.destroy(); // removes
 */
export class DPadOverlay {
  private scene: Phaser.Scene;
  private opts: Required<DPadOptions>;
  private nodes?: { up: Phaser.GameObjects.Container; down: Phaser.GameObjects.Container; left: Phaser.GameObjects.Container; right: Phaser.GameObjects.Container; };
  private onResize?: () => void;

  constructor(scene: Phaser.Scene, opts: DPadOptions = {}) {
    this.scene = scene;
    const defaultEvents = { up: "move_up", down: "move_down", left: "move_left", right: "move_right" };
    this.opts = {
      events: { ...defaultEvents, ...(opts.events ?? {}) },
      radius: opts.radius ?? 26,
      gap: opts.gap ?? 10,
      anchor: opts.anchor ?? "bottom-right",
      safeAreaProvider: opts.safeAreaProvider ?? (() => {
        const cs = getComputedStyle(document.documentElement);
        const px = (v: string) => parseFloat(v || "0");
        return {
          left: px(cs.getPropertyValue("--safe-left")),
          right: px(cs.getPropertyValue("--safe-right")),
          top: px(cs.getPropertyValue("--safe-top")),
          bottom: px(cs.getPropertyValue("--safe-bottom")),
        };
      }),
    };
  }

  attach(): void {
    if (this.nodes) return;

    const up = this.makeCircleButton("↑", this.opts.events.up!);
    const down = this.makeCircleButton("↓", this.opts.events.down!);
    const left = this.makeCircleButton("←", this.opts.events.left!);
    const right = this.makeCircleButton("→", this.opts.events.right!);
    this.nodes = { up, down, left, right };
    this.position();

    this.onResize = () => this.position();
    this.scene.scale.on("resize", this.onResize);
  }

  private makeCircleButton(label: string, emit: string) {
    const r = this.opts.radius;
    const g = this.scene.add.graphics();
    g.fillStyle(0xffffff, 0.12).fillCircle(0, 0, r).lineStyle(2, 0xffffff, 0.5).strokeCircle(0, 0, r);
    const t = this.scene.add.text(0, 0, label, { fontFamily: "monospace", fontSize: "18px", color: "#ffffff" }).setOrigin(0.5);
    const c = this.scene.add.container(0, 0, [g, t]).setSize(r * 2, r * 2).setInteractive({ useHandCursor: true });

    const reset = () => g
      .clear()
      .fillStyle(0xffffff, 0.12).fillCircle(0, 0, r)
      .lineStyle(2, 0xffffff, 0.5).strokeCircle(0, 0, r);

    c.on("pointerdown", () => {
      this.scene.events.emit(emit);
      g.clear();
      g.fillStyle(0xffffff, 0.24).fillCircle(0, 0, r).lineStyle(2, 0xffffff, 0.5).strokeCircle(0, 0, r);
      this.scene.time.delayedCall(80, reset);
    });
    c.on("pointerup", reset);
    c.on("pointerout", reset);

    return c;
  }

  private position() {
    if (!this.nodes) return;
    const { up, down, left, right } = this.nodes;
  
    const inset = this.opts.safeAreaProvider!();
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
  
    const r = this.opts.radius;       // button radius
    const gap = this.opts.gap;        // spacing between center and button centers
    const offset = r + gap;           // center → each button center
    const outer = Math.max(8, gap);   // keep at least a small edge margin
  
    // Half-extent from center to the outermost edge = (center-to-button-center) + button radius
    // = (r + gap) + r = 2r + gap
    const halfExtent = 2 * r + gap;
  
    // Choose a center point that's pulled in from the edges by halfExtent + outer margin
    let baseX = 0, baseY = 0;
    switch (this.opts.anchor) {
      case "bottom-right":
        baseX = w - inset.right - outer - halfExtent;
        baseY = h - inset.bottom - outer - halfExtent;
        break;
      case "bottom-left":
        baseX = inset.left + outer + halfExtent;
        baseY = h - inset.bottom - outer - halfExtent;
        break;
      case "bottom-center":
        baseX = w / 2;
        baseY = h - inset.bottom - outer - halfExtent;
        break;
    }
  
    // Place buttons at ±offset from the center (not r*2 + gap)
    up.setPosition(baseX, baseY - offset);
    down.setPosition(baseX, baseY + offset);
    left.setPosition(baseX - offset, baseY);
    right.setPosition(baseX + offset, baseY);
  }

  destroy(): void {
    if (this.onResize) {
      this.scene.scale.off("resize", this.onResize);
      this.onResize = undefined;
    }
    if (!this.nodes) return;
    try { this.nodes.up.destroy(); } catch {}
    try { this.nodes.down.destroy(); } catch {}
    try { this.nodes.left.destroy(); } catch {}
    try { this.nodes.right.destroy(); } catch {}
    this.nodes = undefined;
  }
}