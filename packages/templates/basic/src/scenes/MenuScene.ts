import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }
  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'START GAME', { color: '#fff' }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('game'));
  }
}
