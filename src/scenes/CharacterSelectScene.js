import { CHARACTERS } from '../data/characters.js';
import { TEAMS } from '../data/teams.js';
import { saveProgress } from '../systems/save.js';
import { addStatBars, addTextButton, drawKidAvatar } from '../systems/ui.js';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create(data) {
    this.team = TEAMS.find((item) => item.id === data.teamId) ?? TEAMS[0];
    this.add.rectangle(195, 422, 390, 844, 0x79c7e8);
    this.add.rectangle(195, 97, 390, 126, this.team.colors.primary);
    this.add.text(195, 55, 'Choose Slugger', {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#243b53',
      strokeThickness: 5,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(195, 100, this.team.name, { fontSize: '20px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);

    CHARACTERS.forEach((character, index) => {
      const x = index % 2 === 0 ? 105 : 285;
      const y = 230 + Math.floor(index / 2) * 170;
      this.add.rectangle(x, y, 160, 148, 0xffffff, 0.95).setStrokeStyle(3, 0x243b53);
      drawKidAvatar(this, x - 42, y - 24, character, 0.52);
      this.add.text(x + 26, y - 48, character.name, {
        fontSize: '16px',
        color: '#243b53',
        fontStyle: 'bold',
        wordWrap: { width: 78 }
      }).setOrigin(0.5);
      this.add.text(x + 26, y - 2, character.nickname, {
        fontSize: '12px',
        color: '#546a7b',
        align: 'center',
        wordWrap: { width: 78 }
      }).setOrigin(0.5);
      addStatBars(this, x - 64, y + 35, character.stats);
      this.add.zone(x, y, 160, 148).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        saveProgress({ selectedCharacterId: character.id });
        this.scene.start('ModeSelectScene', { teamId: this.team.id, characterId: character.id });
      });
    });

    addTextButton(this, 195, 766, 230, 50, 'Teams', () => this.scene.start('TeamSelectScene'));
  }
}
