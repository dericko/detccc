import { useEffect, useState, useRef, SyntheticEvent } from "react";
import { Player, Earth, Alien, Bullet } from "./GameUtils";
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

const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 400;
const earth = new Earth();

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
    // 4 resolve collisions
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
    const player = new Player();
    const bulletImg = new Image();
    bulletImg.src = createBulletSrc();
    player.setImage(spriteSheetImg, bulletImg);
    setPlayer(player);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Could not get canvas");
    }
    const ctx = canvas.getContext("2d");

    // start game
    if (!player) return;
    const t = timer((elapsed: number) => animate(elapsed, ctx));
    // cleanup
    return () => t.stop();
  }, [player])

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
