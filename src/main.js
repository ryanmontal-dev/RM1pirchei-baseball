import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TeamSelectScene } from './scenes/TeamSelectScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { ModeSelectScene } from './scenes/ModeSelectScene.js';
import { DerbyScene } from './scenes/DerbyScene.js';
import { ResultsScene } from './scenes/ResultsScene.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('../service-worker.js', import.meta.url)).catch(() => {});
  });
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#79c7e8',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  render: {
    pixelArt: false,
    antialias: true,
    roundPixels: true
  },
  scene: [
    BootScene,
    TeamSelectScene,
    CharacterSelectScene,
    ModeSelectScene,
    DerbyScene,
    ResultsScene
  ]
};

new Phaser.Game(config);
