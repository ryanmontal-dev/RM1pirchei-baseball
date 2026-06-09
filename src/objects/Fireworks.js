import * as Phaser from 'phaser';

export class Fireworks {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(60);
    this.particles = [];
    this.rockets = [];
    this.active = false;
  }

  launch(duration = 2600) {
    this.active = true;
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    [0, 160, 360, 610, 890, 1180].forEach((delay, index) => {
      this.scene.time.delayedCall(delay, () => {
        if (!this.active) return;
        this.burst(
          Phaser.Math.Between(width * 0.16, width * 0.84),
          Phaser.Math.Between(height * 0.1, height * 0.34),
          index
        );
      });
    });
    this.addShkoyachText(width / 2, height * 0.2);
    this.scene.time.delayedCall(duration, () => {
      this.active = false;
    });
  }

  quickBurst(x, y) {
    for (let i = 0; i < 14; i += 1) {
      const angle = (Math.PI * 2 * i) / 14;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * Phaser.Math.FloatBetween(1.4, 3.7),
        vy: Math.sin(angle) * Phaser.Math.FloatBetween(1.4, 3.7),
        color: [0xffdc5e, 0xffffff, 0xd94f38][i % 3],
        life: 1,
        decay: 0.045,
        size: Phaser.Math.FloatBetween(2, 4),
        gravity: 0.08
      });
    }
  }

  burst(x, y, index = 0) {
    const colors = [0xffdc5e, 0xd94f38, 0x4ca66a, 0x79c7e8, 0xffffff, 0x6b5dd3];
    this.rockets.push({
      x,
      y: this.scene.scale.height * 0.88,
      targetX: x,
      targetY: y,
      color: colors[index % colors.length],
      trail: []
    });
    this.scene.time.delayedCall(230, () => {
      const count = 24 + index * 4;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * Phaser.Math.FloatBetween(1.7, 5.5),
          vy: Math.sin(angle) * Phaser.Math.FloatBetween(1.7, 5.5),
          color: colors[(i + index) % colors.length],
          life: 1,
          decay: Phaser.Math.FloatBetween(0.018, 0.034),
          size: Phaser.Math.FloatBetween(1.6, 4.6),
          gravity: 0.075
        });
      }
    });
  }

  addShkoyachText(x, y) {
    const text = this.scene.add.text(x, y, 'SHKOYACH!', {
      fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
      fontSize: '34px',
      color: '#ffdc5e',
      stroke: '#243b53',
      strokeThickness: 7,
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(61).setScale(0.2).setAlpha(0);

    this.scene.tweens.add({
      targets: text,
      alpha: 1,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 260,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: text,
          y: y - 46,
          alpha: 0,
          scaleX: 0.82,
          scaleY: 0.82,
          duration: 1300,
          delay: 650,
          ease: 'Sine.easeIn',
          onComplete: () => text.destroy()
        });
      }
    });
  }

  update() {
    this.graphics.clear();
    this.updateRockets();
    this.updateParticles();
  }

  updateRockets() {
    for (let i = this.rockets.length - 1; i >= 0; i -= 1) {
      const rocket = this.rockets[i];
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 7) rocket.trail.shift();
      const dx = rocket.targetX - rocket.x;
      const dy = rocket.targetY - rocket.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 7) {
        this.rockets.splice(i, 1);
        continue;
      }
      rocket.x += (dx / distance) * 8;
      rocket.y += (dy / distance) * 8;
      rocket.trail.forEach((point, index) => {
        const alpha = (index + 1) / rocket.trail.length;
        this.graphics.fillStyle(rocket.color, alpha * 0.75);
        this.graphics.fillCircle(point.x, point.y, 2.2 * alpha);
      });
      this.graphics.fillStyle(rocket.color, 1);
      this.graphics.fillCircle(rocket.x, rocket.y, 3);
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      particle.life -= particle.decay;
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      particle.vy += particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.985;
      this.graphics.fillStyle(particle.color, particle.life);
      this.graphics.fillCircle(particle.x, particle.y, particle.size * particle.life);
    }
  }

  destroy() {
    this.graphics.destroy();
    this.particles = [];
    this.rockets = [];
  }
}
