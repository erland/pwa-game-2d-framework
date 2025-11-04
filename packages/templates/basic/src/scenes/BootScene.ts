import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }
  preload() {
    // preload assets here
  }
  create() {
    this.scene.start('menu');
  }
}
