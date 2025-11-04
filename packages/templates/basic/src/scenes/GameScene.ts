import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }
  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'GAME RUNNING...', { color: '#0f0' }).setOrigin(0.5);
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('gameover'));
    this.time.delayedCall(3000, () => this.scene.start('gameover'));
  }
}
