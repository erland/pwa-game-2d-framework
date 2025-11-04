import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }
  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'GAME OVER', { color: '#f33' }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('menu'));
  }
}
