// ###################################################################
// Constants
//
// ###################################################################
export const CANVAS_HEIGHT = 600;
export const CANVAS_WIDTH = 600;
var PLAYER_CLIP_RECT = { x: 0, y: 102, w: 62, h: 32 };
const PLAYER_RADIUS = 60;
const ALIEN_RADIUS = 350;

/**
 * UTILS
 */

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function valueInRange(value, min, max) {
  return value <= max && value >= min;
}

function polarToCartesian(radius, angle) {
  // convert degrees to radians
  const toRadians = (a) => (a * Math.PI) / 180;
  var x = radius * Math.cos(toRadians(angle));
  var y = radius * Math.sin(toRadians(angle));
  return {
    x,
    y,
    translateToCenter: () => {
      return { x: x + CANVAS_WIDTH / 2, y: y + CANVAS_HEIGHT / 2 };
    },
  };
}

function cartesianToPolar(x, y) {
  var radius = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5);
  var angle = Math.atan2(y, x);
  return { radius, angle };
}

function checkRectCollision(A, B) {
  var xOverlap =
    valueInRange(A.x, B.x, B.x + B.w) || valueInRange(B.x, A.x, A.x + A.w);

  var yOverlap =
    valueInRange(A.y, B.y, B.y + B.h) || valueInRange(B.y, A.y, A.y + A.h);
  return xOverlap && yOverlap;
}

class Point2D {
  constructor(x, y) {
    this.x = typeof x === "undefined" ? 0 : x;
    this.y = typeof y === "undefined" ? 0 : y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(x, y, w, h) {
    this.x = typeof x === "undefined" ? 0 : x;
    this.y = typeof y === "undefined" ? 0 : y;
    this.w = typeof w === "undefined" ? 0 : w;
    this.h = typeof h === "undefined" ? 0 : h;
  }

  set(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

/**
 * SPRITES
 */

class BaseSprite {
  constructor(x, y) {
    this.position = new Point2D(x, y);
    this.scale = new Point2D(1, 1);
    this.doLogic = true;
  }

  update() {}

  setImage(img) {
    this.img = img;
    this.bounds = new Rect(x, y, img.width, img.height);
  }

  _updateBounds() {
    this.bounds.set(
      this.position.x,
      this.position.y,
      ~~(0.5 + this.img.width * this.scale.x),
      ~~(0.5 + this.img.height * this.scale.y)
    );
  }

  draw(ctx) {
    if (!this.img || !this.bounds) {
      throw new Error("Must set img and bounds before drawing");
    }
    this._updateBounds();
    ctx.drawImage(this.img, this.position.x, this.position.y);
  }
}

class Earth extends BaseSprite {
  constructor() {
    const size = 30;
    const x = CANVAS_WIDTH / 2 - size;
    const y = CANVAS_HEIGHT / 2 - size;
    super(x, y);
    this.size = size;
    this.bounds = new Rect(x, y, size, size);
  }
  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      this.size,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
  }
}

class SheetSprite extends BaseSprite {
  setImage(img, clipRect) {
    this.img = img;
    this.clipRect = clipRect;
    this.bounds = new Rect(
      this.position.x,
      this.position.y,
      clipRect.w,
      clipRect.h
    );
  }

  update() {}

  _updateBounds() {
    var w = ~~(0.5 + this.clipRect.w * this.scale.x);
    var h = ~~(0.5 + this.clipRect.h * this.scale.y);
    this.bounds.set(this.position.x - w / 2, this.position.y - h / 2, w, h);
  }

  draw(ctx) {
    if (!this.img) {
      throw new Error("Must set img before drawing");
    }
    ctx.fill();
    ctx.save();
    ctx.transform(
      this.scale.x,
      0,
      0,
      this.scale.y,
      this.position.x,
      this.position.y
    );
    ctx.drawImage(
      this.img,
      this.clipRect.x,
      this.clipRect.y,
      this.clipRect.w,
      this.clipRect.h,
      ~~(0.5 + -this.clipRect.w * 0.5),
      ~~(0.5 + -this.clipRect.h * 0.5),
      this.clipRect.w,
      this.clipRect.h
    );
    ctx.restore();
  }
}

class Player extends SheetSprite {
  constructor() {
    const angle = 0;
    const { x, y } = polarToCartesian(PLAYER_RADIUS, angle).translateToCenter();
    super(x, y);
    this.angle = angle;
    this.scale.set(0.6, 0.6);
    this.lives = 3;
    this.speed = 0;
    this.bullets = [];
    this.bulletDelayAccumulator = 0;
    this.score = 0;
  }

  setImage(mainImage, bulletImg) {
    this.img = mainImage;
    this.bulletImg = bulletImg;
    super.setImage(mainImage, PLAYER_CLIP_RECT);
  }

  reset() {
    this.lives = 3;
    this.score = 0;
    const { x, y } = polarToCartesian(PLAYER_RADIUS, 0).translateToCenter();
    this.position.set(x, y);
  }

  shoot() {
    const { x: directionX, y: directionY } = polarToCartesian(
      PLAYER_RADIUS,
      this.angle
    );
    var bullet = new Bullet(
      this.position.x,
      this.position.y - this.bounds.h / 2,
      directionX,
      directionY,
      0.005,
      this.bulletImg
    );
    this.bullets.push(bullet);
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  updateBullets(dt) {
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      var bullet = this.bullets[i];
      if (bullet.alive) {
        bullet.update(dt);
      } else {
        this.bullets.splice(i, 1);
        bullet = null;
      }
    }
  }

  update(dt) {
    // update time passed between shots
    this.bulletDelayAccumulator += dt;

    // apply x vel
    this.angle = (this.angle + this.speed * dt) % 360;
    const { x, y } = polarToCartesian(
      PLAYER_RADIUS,
      this.angle
    ).translateToCenter();
    this.position = new Point2D(x, y);
    this.speed = 0;

    this.updateBullets(dt);
  }

  draw(ctx) {
    super.draw(ctx);

    // draw bullets
    for (var i = 0, len = this.bullets.length; i < len; i++) {
      var bullet = this.bullets[i];
      if (bullet.alive) {
        bullet.draw(ctx);
      }
    }
  }
}

class Bullet extends BaseSprite {
  constructor(x, y, directionX, directionY, speed, img) {
    super(x, y);
    this.directionX = directionX;
    this.directionY = directionY;
    this.speed = speed;
    this.alive = true;
    this.img = img;
    this.bounds = new Rect(this.position.x, this.position.y, 4, 4);
  }

  update(dt) {
    const dy = this.speed * this.directionY * dt;
    const dx = this.speed * this.directionX * dt;
    this.position.x += dx;
    this.position.y += dy;

    if (
      this.position.y < 0 ||
      this.position.y > CANVAS_HEIGHT ||
      this.position.x < 0 ||
      this.position.x > CANVAS_WIDTH ||
      (Math.abs(this.position.y - CANVAS_HEIGHT / 2) < 50 &&
        Math.abs(this.position.x - CANVAS_WIDTH / 2) < 50)
    ) {
      this.alive = false;
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

class Alien extends SheetSprite {
  constructor(clipRects, x, y, radius, angle) {
    super(x, y);
    this.clipRects = clipRects;
    this.scale.set(0.3, 0.3);
    this.alive = true;
    this.onFirstState = true;
    this.stepDelay = 1;
    this.stepAccumulator = 0;
    this.doShoot = false;
    this.bullet = null;
    this.radius = radius;
    this.angle = angle;
  }

  setImage(mainImage, bulletImg) {
    this.img = mainImage;
    this.bulletImg = bulletImg;
    super.setImage(mainImage, this.clipRects[0]);
  }

  toggleFrame() {
    this.onFirstState = !this.onFirstState;
    this.clipRect = this.onFirstState ? this.clipRects[0] : this.clipRects[1];
  }

  shoot() {
    const { x: directionX, y: directionY } = polarToCartesian(
      this.radius,
      this.angle
    );
    this.bullet = new Bullet(
      this.position.x,
      this.position.y + this.bounds.w / 2,
      -directionX,
      -directionY,
      0.005,
      this.bulletImg
    );
  }

  update(dt) {
    this.stepAccumulator += dt / 500;

    if (this.stepAccumulator >= this.stepDelay) {
      if (this.radius < 20) {
        // TODO: show score before resetting
        this.alive = false;
        return;
        // reset();
      }

      if (getRandomArbitrary(0, 1000) <= 5 * (this.stepDelay + 1)) {
        this.doShoot = true;
      }

      this.angle = (this.angle + 1) % 360;
      if (this.angle % 45 === 0) {
        this.radius -= 25;
      }
      const { x, y } = polarToCartesian(
        this.radius,
        this.angle
      ).translateToCenter();
      this.position = new Point2D(x, y);
      this.toggleFrame();
      this.stepAccumulator = 0;
    }

    if (this.bullet !== null && this.bullet.alive) {
      this.bullet.update(dt);
    } else {
      this.bullet = null;
    }
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.bullet !== null && this.bullet.alive) {
      this.bullet.draw(ctx);
    }
  }
}

function resolveBulletAlienCollisions(player, aliens) {
  var bullets = player.bullets;

  for (var i = 0, len = bullets.length; i < len; i++) {
    var bullet = bullets[i];
    for (var j = 0, alen = aliens.length; j < alen; j++) {
      var alien = aliens[j];
      if (checkRectCollision(bullet.bounds, alien.bounds)) {
        alien.alive = bullet.alive = false;
        player.score += 25;
      }
    }
  }
}

function resolveBulletPlayerCollisions(player, aliens, earth) {
  for (var i = 0, len = aliens.length; i < len; i++) {
    var alien = aliens[i];
    if (
      alien.bullet !== null &&
      checkRectCollision(alien.bullet.bounds, player.bounds)
    ) {
      if (player.lives === 0) {
        hasGameStarted = false;
      } else {
        alien.bullet.alive = false;
        const { x, y } = polarToCartesian(
          PLAYER_RADIUS,
          player.angle
        ).translateToCenter();
        player.position.set(x, y);
        player.lives--;
        break;
      }
    }
    if (
      alien.bullet !== null &&
      checkRectCollision(alien.bullet.bounds, earth.bounds)
    ) {
      alien.bullet.alive = false;
    }
  }
}

function resolveCollisions(player, aliens, earth) {
  resolveBulletAlienCollisions(player, aliens);
  resolveBulletPlayerCollisions(player, aliens, earth);
}

export { Player, Alien, Earth, polarToCartesian, resolveCollisions };
