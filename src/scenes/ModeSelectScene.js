import { CHARACTERS } from '../data/characters.js';
import { TEAMS } from '../data/teams.js';
import { loadSave, saveProgress } from '../systems/save.js';
import { addTextButton, drawKidAvatar } from '../systems/ui.js';

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super('ModeSelectScene');
  }

  create(data) {
    const save = loadSave();
    const teamId = data.teamId ?? save.selectedTeamId;
    const characterId = data.characterId ?? save.selectedCharacterId;
    const team = TEAMS.find((item) => item.id === teamId) ?? TEAMS[0];
    const character = CHARACTERS.find((item) => item.id === characterId) ?? CHARACTERS[0];

    this.add.rectangle(195, 422, 390, 844, 0xf4e1b6);
    this.add.rectangle(195, 92, 390, 142, team.colors.secondary);
    this.add.text(195, 52, 'Game Mode', {
      fontSize: '36px',
      color: '#ffffff',
      stroke: '#243b53',
      strokeThickness: 5,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(195, 104, `${character.name} - ${team.name}`, { fontSize: '17px', color: '#fff4c2' }).setOrigin(0.5);
    drawKidAvatar(this, 195, 230, character, 1.05);

    addTextButton(this, 195, 404, 300, 74, 'Practice Mode', () => {
      saveProgress({ lastPlayedMode: 'practice' });
      this.scene.start('DerbyScene', { teamId: team.id, characterId: character.id, mode: 'practice' });
    }, { fill: 0xffffff, stroke: 0x243b53, fontSize: '23px' });

    addTextButton(this, 195, 504, 300, 74, 'Pirchei Championship', () => {
      saveProgress({ lastPlayedMode: 'championship' });
      this.scene.start('DerbyScene', { teamId: team.id, characterId: character.id, mode: 'championship' });
    }, { fill: 0xf7b733, stroke: 0x243b53, fontSize: '22px' });

    this.add.rectangle(195, 630, 312, 92, 0xffffff, 0.85).setStrokeStyle(3, 0x243b53);
    this.add.text(195, 606, `Best: ${save.highScore} pts`, { fontSize: '19px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(195, 634, `Longest: ${save.longestHomeRun} ft`, { fontSize: '17px', color: '#243b53' }).setOrigin(0.5);
    this.add.text(195, 661, `Pirchei Titles: ${save.championshipWins}`, { fontSize: '17px', color: '#243b53' }).setOrigin(0.5);

    addTextButton(this, 195, 746, 230, 50, 'Change Slugger', () => this.scene.start('CharacterSelectScene', { teamId: team.id }));
  }
}
