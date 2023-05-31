import { useEffect } from "react";

export default function Game() {
  // TODO: add canvas event listeners
  // TODO: draw game
  // TODO: init game state
  // TODO: start game loop
  /* Structure
    * - Classes
    * - Draw functions
    * - State management
    *   - step functions
    *   - game state
    *
    * One way: reducer pattern in loop...
   */

  useEffect(() => {
    const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    ctx.imageSmoothingEnabled = false;
  }, []);

  return (
    <div id="game-context">
      <canvas id="game-canvas" width="800" height="800" onKeyDown={e => console.log(e.code)} onKeyUp={e => console.log(e)} />
    </div>
  );
}
