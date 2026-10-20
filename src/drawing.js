import { GRID_COLUMNS, GRID_ROWS } from "./ascii.js";

const PEN_WIDTH_RATIO = 0.9;
const ERASER_WIDTH_RATIO = 1.8;

export function createDrawing(canvas, toolButtons, onToolChange) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas 2D is unavailable in this browser.");
  }

  const drawingStage = canvas.parentElement;
  drawingStage.style.setProperty("--grid-column-size", `${100 / GRID_COLUMNS}%`);
  drawingStage.style.setProperty("--grid-row-size", `${100 / GRID_ROWS}%`);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  let activeTool = "none";
  let isDrawing = false;
  let previousPoint = null;

  function setTool(nextTool) {
    activeTool = nextTool;
    canvas.dataset.tool = nextTool;

    for (const [toolName, button] of Object.entries(toolButtons)) {
      const isActive = toolName === nextTool;
      button.setAttribute("aria-pressed", String(isActive));
    }

    onToolChange(nextTool);
  }

  function getPoint(event) {
    const bounds = canvas.getBoundingClientRect();
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;

    return {
      x: Math.max(0, Math.min(canvas.width, (event.clientX - bounds.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (event.clientY - bounds.top) * scaleY)),
    };
  }

  function getBrushWidth() {
    const cellWidth = canvas.width / GRID_COLUMNS;
    return cellWidth * (activeTool === "eraser" ? ERASER_WIDTH_RATIO : PEN_WIDTH_RATIO);
  }

  function prepareBrush() {
    context.strokeStyle = activeTool === "eraser" ? "#ffffff" : "#000000";
    context.fillStyle = context.strokeStyle;
    context.lineWidth = getBrushWidth();
    context.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
  }

  function drawStroke(from, to) {
    prepareBrush();

    const brushWidth = getBrushWidth();
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const distance = Math.hypot(deltaX, deltaY);
    const steps = Math.max(1, Math.ceil(distance / Math.max(1, brushWidth / 2)));

    for (let index = 0; index <= steps; index += 1) {
      const offset = index / steps;
      const x = from.x + deltaX * offset;
      const y = from.y + deltaY * offset;
      context.fillRect(x - brushWidth / 2, y - brushWidth / 2, brushWidth, brushWidth);
    }
  }

  function startDrawing(event) {
    if (activeTool === "none") {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    const point = getPoint(event);
    previousPoint = point;
    isDrawing = true;
    drawStroke(point, point);
  }

  function continueDrawing(event) {
    if (!isDrawing || !previousPoint) {
      return;
    }

    event.preventDefault();
    const currentPoint = getPoint(event);
    drawStroke(previousPoint, currentPoint);
    previousPoint = currentPoint;
  }

  function stopDrawing(event) {
    if (!isDrawing) {
      return;
    }

    isDrawing = false;
    previousPoint = null;

    if (typeof event.pointerId === "number" && canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  function resetCanvas() {
    isDrawing = false;
    previousPoint = null;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setTool("none");
  }

  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", continueDrawing);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);

  toolButtons.pen.addEventListener("click", () => setTool("pen"));
  toolButtons.eraser.addEventListener("click", () => setTool("eraser"));

  return {
    canvas,
    setTool,
    reset: resetCanvas,
    getActiveTool: () => activeTool,
    isBlank() {
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < data.length; index += 4) {
        if (data[index + 3] > 0) {
          return false;
        }
      }
      return true;
    },
  };
}
