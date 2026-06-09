import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters.js';
import { TEAMS } from '../data/teams.js';
import { loadSave } from '../systems/save.js';
import { addTextButton, drawKidAvatar } from '../systems/ui.js';

export class ResultsScene extends Phaser.Scene {
  constructor() {
    super('ResultsScene');
  }

  create(data) {
    const save = loadSave();
    const team = TEAMS.find((item) => item.id === data.teamId) ?? TEAMS[0];
    const character = CHARACTERS.find((item) => item.id === data.characterId) ?? CHARACTERS[0];
    const title = data.wonChampionship ? 'Pirchei Champs!' : 'Derby Complete';

    this.add.rectangle(195, 422, 390, 844, 0xf4e1b6);
    this.add.rectangle(195, 95, 390, 145, team.colors.primary);
    this.add.text(195, 58, title, {
      fontSize: '35px',
      color: '#ffffff',
      stroke: '#243b53',
      strokeThickness: 5,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(195, 108, `${character.name} - ${team.name}`, { fontSize: '17px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
    drawKidAvatar(this, 195, 242, character, 1.1);

    this.add.rectangle(195, 432, 316, 178, 0xffffff, 0.92).setStrokeStyle(4, 0x243b53);
    this.add.text(195, 372, `Home Runs: ${data.homeRuns}`, { fontSize: '25px', color: '#d94f38', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(195, 416, `Score: ${data.score}`, { fontSize: '22px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(195, 459, `Longest: ${data.longestHomeRun} ft`, { fontSize: '22px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(195, 503, `Career Best: ${save.highScore}`, { fontSize: '17px', color: '#546a7b' }).setOrigin(0.5);

    if (data.wonChampionship) {
      this.add.text(195, 564, 'The trophy goes back to the block.', {
        fontSize: '18px',
        color: '#243b53',
        align: 'center',
        wordWrap: { width: 310 }
      }).setOrigin(0.5);
      this.launchMiniFireworks();
    } else if (data.mode === 'championship') {
      this.add.text(195, 564, 'Win target: 7 home runs.', {
        fontSize: '18px',
        color: '#243b53',
        align: 'center'
      }).setOrigin(0.5);
    }

    addTextButton(this, 195, 646, 286, 62, 'Swing Again', () => {
      this.scene.start('DerbyScene', { teamId: team.id, characterId: character.id, mode: data.mode });
    }, { fill: 0xf7b733, stroke: 0x243b53, fontSize: '23px' });
    addTextButton(this, 195, 730, 286, 54, 'Mode Select', () => {
      this.scene.start('ModeSelectScene', { teamId: team.id, characterId: character.id });
    });
  }

  launchMiniFireworks() {
    for (let i = 0; i < 32; i += 1) {
      const x = 195;
      const y = 170;
      const dot = this.add.circle(x, y, 4, [0xffdc5e, 0xd94f38, 0xffffff, 0x4ca66a][i % 4]);
      const angle = (Math.PI * 2 * i) / 32;
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * Phaser.Math.Between(70, 156),
        y: y + Math.sin(angle) * Phaser.Math.Between(55, 130),
        alpha: 0,
        duration: 1100,
        repeat: 1,
        ease: 'Sine.easeOut',
        onComplete: () => dot.destroy()
      });
    }
  }
}
