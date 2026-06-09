import * as Phaser from 'phaser';
import { CHARACTERS } from '../data/characters.js';
import { TEAMS } from '../data/teams.js';
import { Fireworks } from '../objects/Fireworks.js';
import { GestureDetector } from '../systems/gestures.js';
import { recordDerbyResult } from '../systems/save.js';
import { drawKidAvatar } from '../systems/ui.js';

const MODES = {
  practice: { swings: 12, target: 0, title: 'Practice Mode' },
  championship: { swings: 10, target: 7, title: 'Pirchei Championship' }
};

export class DerbyScene extends Phaser.Scene {
  constructor() {
    super('DerbyScene');
  }

  create(data) {
    this.mode = data.mode ?? 'practice';
    this.settings = MODES[this.mode];
    this.team = TEAMS.find((item) => item.id === data.teamId) ?? TEAMS[0];
    this.character = CHARACTERS.find((item) => item.id === data.characterId) ?? CHARACTERS[0];
    this.swingsLeft = this.settings.swings;
    this.score = 0;
    this.homeRuns = 0;
    this.longestHomeRun = 0;
    this.streak = 0;
    this.hrHistory = [];
    this.bonusGranted = false;
    this.pitchActive = false;
    this.swingLocked = false;
    this.resultText = null;
    this.fireworks = new Fireworks(this);

    this.drawField();
    this.createHud();
    this.createBatter();
    this.createControls();
    this.nextPitch();
  }

  update() {
    this.fireworks.update();
  }

  drawField() {
    this.add.rectangle(195, 422, 390, 844, 0x80cbe8);
    this.add.circle(68, 74, 39, 0xffdc5e);
    this.add.rectangle(195, 602, 390, 420, 0x65a84f);
    this.add.ellipse(195, 564, 430, 280, 0x4c8f49);
    this.add.ellipse(195, 676, 310, 150, 0xd9a24f);
    this.add.polygon(195, 694, [0, -36, 36, 0, 0, 36, -36, 0], 0xffffff);
    this.add.rectangle(195, 360, 390, 18, 0xffffff);
    for (let x = 0; x <= 390; x += 39) {
      this.add.rectangle(x, 329, 6, 66, 0xffffff);
    }
    this.add.arc(195, 690, 250, Phaser.Math.DegToRad(210), Phaser.Math.DegToRad(330), false, 0xffffff, 0.32);
    this.add.text(196, 319, '325 ft', { fontSize: '15px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
  }

  createHud() {
    this.add.rectangle(195, 41, 370, 66, 0xffffff, 0.88).setStrokeStyle(3, 0x243b53);
    this.modeLabel = this.add.text(23, 23, this.settings.title, { fontSize: '15px', color: '#243b53', fontStyle: 'bold' });
    this.scoreLabel = this.add.text(195, 23, 'HR 0', { fontSize: '22px', color: '#d94f38', fontStyle: 'bold' }).setOrigin(0.5, 0);
    this.swingsLabel = this.add.text(365, 23, `${this.swingsLeft} swings`, { fontSize: '15px', color: '#243b53', fontStyle: 'bold' }).setOrigin(1, 0);
    this.distanceLabel = this.add.text(195, 74, 'Longest: 0 ft', { fontSize: '16px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0.5);
    this.targetLabel = this.add.text(195, 99, this.mode === 'championship' ? 'Target: 7 HR' : 'Free swing practice', {
      fontSize: '13px',
      color: '#243b53',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.feedback = this.add.text(195, 142, 'Ready...', {
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#243b53',
      strokeThickness: 6,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.hrDots = this.add.graphics().setDepth(35);
    this.drawHistoryDots();
  }

  createBatter() {
    drawKidAvatar(this, 188, 616, this.character, 0.95);
    this.bat = this.add.rectangle(245, 575, 16, 88, 0x7b4f2f).setRotation(-0.65);
    this.ball = this.add.circle(195, 405, 8, 0xffffff).setStrokeStyle(2, 0xd94f38);
    this.ball.visible = false;
    this.aimRing = this.add.circle(195, 595, 26, 0xffffff, 0).setStrokeStyle(4, 0xffdc5e);
    this.aimRing.visible = false;
  }

  createControls() {
    this.gestures = new GestureDetector(this, {
      onTap: () => this.swing('contact'),
      onSwipeDown: () => this.swing('power')
    });
    this.gestures.enable();
  }

  nextPitch() {
    if (this.swingsLeft <= 0) {
      this.finishGame();
      return;
    }
    this.pitchActive = true;
    this.swingLocked = false;
    this.feedback.setText('Pitch incoming');
    this.ball.setPosition(195 + Phaser.Math.Between(-28, 28), 402);
    this.ball.visible = true;
    this.aimRing.visible = true;
    this.aimRing.setScale(1.25);
    this.pitchStart = this.time.now;
    this.pitchDuration = Phaser.Math.Between(980, 1280);
    this.pitchTween = this.tweens.add({
      targets: this.ball,
      x: 195 + Phaser.Math.Between(-16, 16),
      y: 594,
      scale: 1.25,
      duration: this.pitchDuration,
      ease: 'Sine.easeIn',
      onComplete: () => {
        if (!this.swingLocked) this.recordOut('Too Late');
      }
    });
    this.tweens.add({
      targets: this.aimRing,
      scale: 0.54,
      duration: this.pitchDuration,
      ease: 'Sine.easeIn'
    });
  }

  swing(type) {
    if (!this.pitchActive || this.swingLocked) return;
    this.swingLocked = true;
    this.pitchActive = false;
    this.swingsLeft -= 1;
    if (this.pitchTween) this.pitchTween.stop();

    this.tweens.add({
      targets: this.bat,
      rotation: type === 'power' ? 1.35 : 0.92,
      duration: 90,
      yoyo: true,
      ease: 'Quad.easeOut'
    });

    const elapsed = this.time.now - this.pitchStart;
    const sweetSpot = this.pitchDuration * 0.86;
    const timingError = Math.abs(elapsed - sweetSpot);
    const timingScore = Phaser.Math.Clamp(1 - timingError / 420, 0, 1);
    const statBonus = (this.character.stats.timing + this.character.stats.contact) / 20;
    const powerBonus = this.character.stats.power / 10;
    const swingBonus = type === 'power' ? 1.3 : 1;
    const contactPenalty = type === 'power' ? 0.13 : 0;
    const quality = Phaser.Math.Clamp(timingScore * 0.78 + statBonus * 0.22 - contactPenalty, 0, 1);
    const rawDistance = Math.round(165 + quality * 245 * swingBonus + powerBonus * 44 + Phaser.Math.Between(-14, 24));
    const isHomeRun = rawDistance >= 325;

    if (isHomeRun) {
      this.recordHomeRun(rawDistance, type);
    } else {
      this.recordOut(quality > 0.72 ? 'Warning Track' : quality > 0.43 ? 'Base Hit' : 'Out');
      this.animateBall(rawDistance, false);
    }
  }

  recordHomeRun(distance, type) {
    this.homeRuns += 1;
    this.streak += 1;
    const baseScore = distance >= 500 ? 200 : distance >= 450 ? 150 : 100;
    const streakBonus = this.streak >= 3 ? Math.round(baseScore * 0.5) : 0;
    const swingBonus = type === 'power' ? 25 : 0;
    this.score += baseScore + streakBonus + swingBonus;
    this.longestHomeRun = Math.max(this.longestHomeRun, distance);
    this.hrHistory.push('hr');
    this.updateHud();
    this.feedback.setText(this.streak >= 3 ? `x${this.streak} Shkoyach!` : `Shkoyach! ${distance} ft`);
    this.animateBall(distance, true);
    this.fireworks.launch();
    if (this.mode === 'championship' && !this.bonusGranted && this.homeRuns >= 4) {
      this.bonusGranted = true;
      this.swingsLeft += 2;
      this.feedback.setText('+2 bonus swings!');
      this.updateHud();
    }
    this.time.delayedCall(1500, () => this.nextPitch());
  }

  recordOut(label) {
    this.pitchActive = false;
    if (!this.swingLocked) {
      this.swingsLeft -= 1;
    }
    this.streak = 0;
    this.hrHistory.push(label === 'Base Hit' ? 'hit' : 'out');
    if (label === 'Base Hit') {
      this.score += 10;
      this.fireworks.quickBurst(195, 594);
    }
    this.updateHud();
    this.feedback.setText(`${label}!`);
    this.ball.visible = false;
    this.aimRing.visible = false;
    this.time.delayedCall(850, () => this.nextPitch());
  }

  animateBall(distance, isHomeRun) {
    const endY = isHomeRun ? 225 - Phaser.Math.Clamp((distance - 325) * 0.45, 0, 85) : 380;
    const endX = 195 + Phaser.Math.Between(-112, 112);
    this.ball.visible = true;
    this.aimRing.visible = false;
    this.tweens.add({
      targets: this.ball,
      x: endX,
      y: endY,
      scale: isHomeRun ? 0.58 : 0.85,
      duration: isHomeRun ? 760 : 520,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.ball.visible = false;
        this.ball.setScale(1);
      }
    });
  }

  updateHud() {
    this.scoreLabel.setText(`HR ${this.homeRuns}  PTS ${this.score}`);
    this.swingsLabel.setText(`${this.swingsLeft} swings`);
    this.distanceLabel.setText(`Longest: ${this.longestHomeRun} ft`);
    this.drawHistoryDots();
  }

  drawHistoryDots() {
    if (!this.hrDots) return;
    this.hrDots.clear();
    const total = this.settings.swings + (this.bonusGranted ? 2 : 0);
    const spacing = Math.min(20, 310 / Math.max(total - 1, 1));
    const startX = 195 - ((total - 1) * spacing) / 2;
    for (let index = 0; index < total; index += 1) {
      const x = startX + index * spacing;
      const y = 802;
      const result = this.hrHistory[index];
      if (result === 'hr') {
        this.hrDots.fillStyle(0xffdc5e, 1);
        this.hrDots.fillCircle(x, y, 7);
        this.hrDots.lineStyle(2, 0xffffff, 0.85);
        this.hrDots.strokeCircle(x, y, 7);
      } else if (result === 'hit') {
        this.hrDots.fillStyle(0x79c7e8, 1);
        this.hrDots.fillCircle(x, y, 5);
      } else if (result === 'out') {
        this.hrDots.fillStyle(0x546a7b, 1);
        this.hrDots.fillCircle(x, y, 5);
      } else {
        this.hrDots.lineStyle(2, 0xffffff, 0.6);
        this.hrDots.strokeCircle(x, y, 6);
      }
    }
  }

  finishGame() {
    this.gestures.destroy();
    this.fireworks.destroy();
    const wonChampionship = this.mode === 'championship' && this.homeRuns >= this.settings.target;
    recordDerbyResult({
      score: this.score,
      longestHomeRun: this.longestHomeRun,
      homeRuns: this.homeRuns,
      mode: this.mode,
      wonChampionship
    });
    this.scene.start('ResultsScene', {
      teamId: this.team.id,
      characterId: this.character.id,
      mode: this.mode,
      score: this.score,
      homeRuns: this.homeRuns,
      longestHomeRun: this.longestHomeRun,
      wonChampionship
    });
  }
}
