import * as Phaser from 'phaser';
import { addTextButton } from '../systems/ui.js';
import { loadSave } from '../systems/save.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const save = loadSave();
    this.drawBackyard();
    this.add.text(195, 92, 'Shkoyach', {
      fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
      fontSize: '58px',
      color: '#fff4c2',
      stroke: '#243b53',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);
    this.add.text(195, 145, 'Sluggers', {
      fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
      fontSize: '50px',
      color: '#ffffff',
      stroke: '#d94f38',
      strokeThickness: 7
    }).setOrigin(0.5);
    this.add.text(195, 214, 'Home Run Derby', {
      fontSize: '22px',
      color: '#243b53',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(195, 315, 300, 110, 0xffffff, 0.88).setStrokeStyle(3, 0x243b53);
    this.add.text(195, 287, `Best Score: ${save.highScore}`, { fontSize: '22px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(195, 323, `Longest Blast: ${save.longestHomeRun} ft`, { fontSize: '18px', color: '#243b53' }).setOrigin(0.5);
    this.add.text(195, 356, `Total Homers: ${save.totalHomeRuns}`, { fontSize: '18px', color: '#243b53' }).setOrigin(0.5);

    addTextButton(this, 195, 480, 260, 62, 'Play Ball', () => this.scene.start('TeamSelectScene'), {
      fill: 0xf7b733,
      stroke: 0x243b53,
      fontSize: '24px'
    });

    this.add.text(195, 756, 'Tap for contact. Swipe down for power.', {
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#243b53',
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  drawBackyard() {
    this.add.rectangle(195, 422, 390, 844, 0x79c7e8);
    this.add.circle(55, 82, 44, 0xffdc5e);
    this.add.rectangle(195, 695, 390, 298, 0x74b85d);
    this.add.rectangle(195, 610, 390, 62, 0xd9b16c);
    for (let x = 20; x < 390; x += 48) {
      this.add.rectangle(x, 604, 8, 86, 0xffffff);
    }
    this.add.rectangle(195, 642, 390, 8, 0xffffff);
    this.add.ellipse(195, 712, 280, 130, 0xd9a24f);
    this.add.polygon(195, 715, [0, -34, 34, 0, 0, 34, -34, 0], 0xffffff);
  }
}
