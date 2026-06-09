import * as Phaser from 'phaser';
import { TEAMS } from '../data/teams.js';
import { saveProgress } from '../systems/save.js';
import { addTextButton } from '../systems/ui.js';

export class TeamSelectScene extends Phaser.Scene {
  constructor() {
    super('TeamSelectScene');
  }

  create() {
    this.add.rectangle(195, 422, 390, 844, 0xf4e1b6);
    this.add.text(195, 54, 'Pick Your Team', {
      fontSize: '34px',
      color: '#243b53',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    TEAMS.forEach((team, index) => {
      const x = index % 2 === 0 ? 105 : 285;
      const y = 168 + Math.floor(index / 2) * 220;
      this.add.rectangle(x, y, 154, 172, 0xffffff, 0.96).setStrokeStyle(4, team.colors.secondary);
      this.add.circle(x, y - 44, 42, team.colors.primary);
      this.add.rectangle(x, y - 48, 92, 20, team.colors.secondary);
      this.add.text(x, y - 2, team.name, {
        fontSize: '20px',
        color: '#243b53',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 132 }
      }).setOrigin(0.5);
      this.add.text(x, y + 47, team.motto, {
        fontSize: '13px',
        color: '#546a7b',
        align: 'center',
        wordWrap: { width: 122 }
      }).setOrigin(0.5);
      this.add.zone(x, y, 154, 172).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        saveProgress({ selectedTeamId: team.id });
        this.scene.start('CharacterSelectScene', { teamId: team.id });
      });
    });

    addTextButton(this, 195, 730, 230, 52, 'Back', () => this.scene.start('BootScene'), {
      fill: 0xffffff,
      stroke: 0x243b53
    });
  }
}
