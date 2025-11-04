import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

// Example: If your framework exposes helpers, you can import them like:
// import { BoardFitter } from '@SCOPE/pwa-game-2d-framework';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene],
};

export const game = new Phaser.Game(config);
