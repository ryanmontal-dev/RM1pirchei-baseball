export function addTextButton(scene, x, y, width, height, label, onClick, options = {}) {
  const radius = options.radius ?? 8;
  const bg = scene.add.graphics();
  const fill = options.fill ?? 0xffffff;
  const stroke = options.stroke ?? 0x243b53;
  const textColor = options.textColor ?? '#243b53';

  bg.fillStyle(fill, 1);
  bg.lineStyle(3, stroke, 1);
  bg.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
  bg.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);

  const text = scene.add.text(x, y, label, {
    fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
    fontSize: options.fontSize ?? '18px',
    color: textColor,
    align: 'center',
    wordWrap: { width: width - 18 }
  }).setOrigin(0.5);

  const zone = scene.add.zone(x, y, width, height).setInteractive({ useHandCursor: true });
  zone.on('pointerdown', () => {
    scene.tweens.add({ targets: [bg, text], scaleX: 0.97, scaleY: 0.97, duration: 70, yoyo: true });
    onClick();
  });

  return { bg, text, zone, setAlpha: (value) => [bg, text, zone].forEach((item) => item.setAlpha(value)) };
}

export function drawKidAvatar(scene, x, y, character, scale = 1) {
  const g = scene.add.graphics();
  g.setScale(scale);
  g.fillStyle(0x111111, 0.12);
  g.fillEllipse(x, y + 76, 78, 18);
  g.fillStyle(character.shirt, 1);
  g.fillRoundedRect(x - 34, y + 16, 68, 70, 16);
  g.fillStyle(character.body, 1);
  g.fillCircle(x, y - 20, 31);
  g.fillStyle(character.cap, 1);
  g.fillEllipse(x, y - 42, 72, 28);
  g.fillRoundedRect(x - 35, y - 51, 70, 18, 8);
  g.fillStyle(0x2b1d12, 1);
  g.fillCircle(x - 11, y - 22, 3);
  g.fillCircle(x + 11, y - 22, 3);
  g.lineStyle(3, 0x2b1d12, 1);
  g.beginPath();
  g.arc(x, y - 12, 13, 0.1, Math.PI - 0.1);
  g.strokePath();
  g.lineStyle(8, 0x6f4528, 1);
  g.lineBetween(x + 32, y + 20, x + 64, y - 32);
  return g;
}

export function addStatBars(scene, x, y, stats) {
  const labels = [
    ['Contact', stats.contact, 0xd94f38],
    ['Power', stats.power, 0xf7b733],
    ['Timing', stats.timing, 0x4ca66a]
  ];
  labels.forEach(([label, value, color], index) => {
    const yy = y + index * 28;
    scene.add.text(x, yy, label, { fontSize: '13px', color: '#243b53', fontStyle: 'bold' }).setOrigin(0, 0.5);
    scene.add.rectangle(x + 78, yy, 86, 10, 0xffffff).setOrigin(0, 0.5).setStrokeStyle(2, 0x243b53);
    scene.add.rectangle(x + 78, yy, 8.6 * value, 10, color).setOrigin(0, 0.5);
  });
}
