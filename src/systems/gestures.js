export class GestureDetector {
  constructor(scene, { onTap, onSwipeDown }) {
    this.scene = scene;
    this.onTap = onTap;
    this.onSwipeDown = onSwipeDown;
    this.start = null;
    this.enabled = false;
    this.handleDown = this.handleDown.bind(this);
    this.handleUp = this.handleUp.bind(this);
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;
    this.scene.input.on('pointerdown', this.handleDown);
    this.scene.input.on('pointerup', this.handleUp);
  }

  disable() {
    if (!this.enabled) return;
    this.enabled = false;
    this.scene.input.off('pointerdown', this.handleDown);
    this.scene.input.off('pointerup', this.handleUp);
    this.start = null;
  }

  handleDown(pointer) {
    this.start = { x: pointer.x, y: pointer.y, time: this.scene.time.now };
  }

  handleUp(pointer) {
    if (!this.start) return;
    const dx = pointer.x - this.start.x;
    const dy = pointer.y - this.start.y;
    const distance = Math.hypot(dx, dy);
    const duration = this.scene.time.now - this.start.time;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const isTap = distance < 24 && duration < 360;
    const isSwipeDown = distance >= 46 && angle >= 58 && angle <= 122;
    this.start = null;

    if (isSwipeDown) {
      this.onSwipeDown();
      return;
    }
    if (isTap || distance >= 24) {
      this.onTap();
    }
  }

  destroy() {
    this.disable();
  }
}
