import { useEffect, useState, useRef } from "react";
import {
  Player, Earth, Alien, polarToCartesian,
  CANVAS_HEIGHT, CANVAS_WIDTH, resolveCollisions
} from "./GameUtils";
import { timer } from "d3-timer"

const SPRITE_SHEET_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAEACAYAAAADRnAGAAACGUlEQVR42u3aSQ7CMBAEQIsn8P+/hiviAAK8zFIt5QbELiTHmfEYE3L9mZE9AAAAqAVwBQ8AAAD6THY5CgAAAKbfbPX3AQAAYBEEAADAuZrC6UUyfMEEAIBiAN8OePXnAQAAsLcmmKFPAQAAgHMbm+gbr3Sdo/LtcAAAANR6GywPAgBAM4D2JXAAABoBzBjA7AmlOx8AAEAzAOcDAADovTc4vQim6wUCABAYQG8QAADd4dPd2fRVYQAAANQG0B4HAABAawDnAwAA6AXgfAAAALpA2uMAAABwPgAAgPoAM9Ci/R4AAAD2dmqcEQIAIC/AiQGuAAYAAECcRS/a/cJXkUf2AAAAoBaA3iAAALrD+gIAAADY9baX/nwAAADNADwFAADo9YK0e5FMX/UFACA5QPSNEAAAAHKtCekmDAAAAADvBljtfgAAAGgMMGOrunvCy2uCAAAACFU6BwAAwF6AGQPa/XsAAADYB+B8AAAAtU+ItD4OAwAAAFVhAACaA0T7B44/BQAAANALwGMQAAAAADYO8If2+P31AgAAQN0SWbhFDwCAZlXgaO1xAAAA1FngnA8AACAeQPSNEAAAAM4CnC64AAAA4GzN4N9NSfgKEAAAAACszO26X8/X6BYAAAD0Anid8KcLAAAAAAAAAJBnwNEvAAAA9Jns1ygAAAAAAAAAAAAAAAAAAABAQ4COCENERERERERERBrnAa1sJuUVr3rsAAAAAElFTkSuQmCC";

function createBulletSrc(): string {
  const bulletCanvas = document.createElement("canvas");
  bulletCanvas.width = 4;
  bulletCanvas.height = 4;
  const ctx = bulletCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  return bulletCanvas.toDataURL();
}

const earth = new Earth();

const TOTAL_ALIENS = 36;
var ALIEN_BOTTOM_ROW = [
  { x: 0, y: 0, w: 51, h: 34 },
  { x: 0, y: 102, w: 51, h: 34 },
];
var ALIEN_MIDDLE_ROW = [
  { x: 0, y: 137, w: 50, h: 33 },
  { x: 0, y: 170, w: 50, h: 34 },
];
var ALIEN_TOP_ROW = [
  { x: 0, y: 68, w: 50, h: 32 },
  { x: 0, y: 34, w: 50, h: 32 },
];
let alienCount = 0;
const ALIEN_RADIUS = 300;
function setupAlienFormation() {
  const aliens = [];
  alienCount = 0;
  const angleStep = 36;
  const numberPerRow = 6;
  for (var i = 0; i < TOTAL_ALIENS; i++) {
    // handles some logic for getting them from the sprite sheet
    var gridY = Math.floor(i / 5);
    var clipRects;
    switch (gridY) {
      case 0:
      case 1:
        clipRects = ALIEN_BOTTOM_ROW;
        break;
      case 2:
      case 3:
        clipRects = ALIEN_MIDDLE_ROW;
        break;
      case 4:
        clipRects = ALIEN_TOP_ROW;
        break;
    }
    const angle = (360 / angleStep) * i;
    // TODO: handle multiple layers (different radiuses)
    const radius = ALIEN_RADIUS - 30 * (i % numberPerRow);
    const { x, y } = polarToCartesian(radius, angle).translateToCenter();
    aliens.push(new Alien(clipRects, x, y, radius, angle));
    alienCount++;
  }
  return aliens;
}
let wave = 1;
function updateAliens(aliens, dt) {
  for (var i = aliens.length - 1; i >= 0; i--) {
    var alien = aliens[i];
    if (!alien.alive) {
      aliens.splice(i, 1);
      alien = null;
      alienCount--;
      if (alienCount < 1) {
        wave++;
        setupAlienFormation();
      }
      return;
    }

    alien.stepDelay = (alienCount * 20 - wave * 10) / 1000;
    if (alien.stepDelay <= 0.05) {
      alien.stepDelay = 0.05;
    }
    alien.update(dt);

    if (alien.doShoot) {
      alien.doShoot = false;
      alien.shoot();
    }
  }
}

export default function Game() {
  const [player, setPlayer] = useState(null);
  const [aliens, setAliens] = useState([]); // TODO setup formation
  let time = 0; // for animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function keyDownHandler(e) {
    if (!player) return;
    switch (e.code) {
      case "ArrowLeft":
      case "ArrowUp":
      case "KeyJ":
        player.setSpeed(-.5);
        break;
      case "ArrowRight":
      case "ArrowDown":
      case "KeyK":
        player.setSpeed(0.5);
        break;
      case "Space":
      case "KeyX":
        player.shoot();
        break;
    }
  }

  function animate(elapsed: number, ctx: CanvasRenderingContext2D): void {
    const dt = elapsed - time;
    time = elapsed;

    // background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    earth.draw(ctx);

    // player
    player.update(dt);
    player.draw(ctx);

    // // 3 update aliens
    updateAliens(aliens, dt);
    for (var i = 0; i < aliens.length; i++) {
      var alien = aliens[i];
      alien.draw(ctx);
    }

    resolveCollisions(player, aliens, earth);
  }


  useEffect(() => {
    // setup canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Could not get canvas");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    ctx.imageSmoothingEnabled = false;

    // setup images
    const spriteSheetImg = new Image()
    spriteSheetImg.src = SPRITE_SHEET_SRC;
    const bulletImg = new Image();
    bulletImg.src = createBulletSrc();

    const player = new Player();
    player.setImage(spriteSheetImg, bulletImg);
    setPlayer(player);

    const aliens = setupAlienFormation();
    aliens.forEach(a => a.setImage(spriteSheetImg, bulletImg));
    setAliens(aliens);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Could not get canvas");
    }
    const ctx = canvas.getContext("2d");

    // start game
    if (!player) return;
    if (!aliens.length) return;
    const t = timer((elapsed: number) => animate(elapsed, ctx));
    // cleanup
    return () => t.stop();
  }, [player, aliens])

  return (
    <div id="game-context">
      <canvas
        tabIndex={0}
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        // fix onKeyDown event type. what is the correct type for keyDownHandler?
        onKeyDown={keyDownHandler}
      />
    </div>
  );
}
