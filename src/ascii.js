export const GRID_COLUMNS = 46;
export const GRID_ROWS = 30;
const COVERAGE_THRESHOLD = 0.35;
const MID_THRESHOLD = 0.15;

export function canvasToAscii(canvas) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas 2D is unavailable in this browser.");
  }

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLUMNS).fill(" "));
  let minColumn = GRID_COLUMNS;
  let maxColumn = -1;
  let minRow = GRID_ROWS;
  let maxRow = -1;

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let column = 0; column < GRID_COLUMNS; column += 1) {
      let coveredPixels = 0;
      const startX = Math.floor((column * canvas.width) / GRID_COLUMNS);
      const endX = Math.floor(((column + 1) * canvas.width) / GRID_COLUMNS);
      const startY = Math.floor((row * canvas.height) / GRID_ROWS);
      const endY = Math.floor(((row + 1) * canvas.height) / GRID_ROWS);

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const pixelIndex = (y * canvas.width + x) * 4;
          const alpha = data[pixelIndex + 3] / 255;
          if (alpha === 0) {
            continue;
          }

          const red = data[pixelIndex];
          const green = data[pixelIndex + 1];
          const blue = data[pixelIndex + 2];
          const luminance = (red + green + blue) / (3 * 255);

          if (luminance <= 0.8) {
            coveredPixels += 1;
          }
        }
      }

      const cellArea = Math.max(1, (endX - startX) * (endY - startY));
      const coverage = coveredPixels / cellArea;

      if (coverage > COVERAGE_THRESHOLD) {
        grid[row][column] = "$";
        minColumn = Math.min(minColumn, column);
        maxColumn = Math.max(maxColumn, column);
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
      }
      else if (coverage > MID_THRESHOLD) {
        grid[row][column] = "/";
        minColumn = Math.min(minColumn, column);
        maxColumn = Math.max(maxColumn, column);
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
      }
    }
  }

  if (maxColumn < 0) {
    throw new Error("No grid cells passed the coverage threshold.");
  }

  const outputRows = [];

  for (let row = minRow; row <= maxRow; row += 1) {
    outputRows.push(grid[row].slice(minColumn, maxColumn + 1).join(""));
  }

  return outputRows.join("\n");
}
