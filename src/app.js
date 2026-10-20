import { canvasToAscii } from "./ascii.js";
import { createDrawing } from "./drawing.js";

const elements = {
  editorView: document.querySelector("#editor-view"),
  loadingView: document.querySelector("#loading-view"),
  resultView: document.querySelector("#result-view"),
  canvas: document.querySelector("#drawing-canvas"),
  welcomeOverlay: document.querySelector("#welcome-overlay"),
  dismissWelcome: document.querySelector("#dismiss-welcome"),
  penTool: document.querySelector("#pen-tool"),
  eraserTool: document.querySelector("#eraser-tool"),
  submitButton: document.querySelector("#submit-button"),
  toolHint: document.querySelector("#tool-hint"),
  editorMessage: document.querySelector("#editor-message"),
  asciiArt: document.querySelector("#ascii-art"),
  restartButton: document.querySelector("#restart-button"),
};

const views = [elements.editorView, elements.loadingView, elements.resultView];

function showView(activeView) {
  for (const view of views) {
    view.hidden = view !== activeView;
  }
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function startApp() {
  elements.penTool.disabled = true;
  elements.eraserTool.disabled = true;

  let drawing;
  try {
    drawing = createDrawing(
      elements.canvas,
      { pen: elements.penTool, eraser: elements.eraserTool },
      (tool) => {
        if (!elements.toolHint) {
          return;
        }

        if (tool === "pen") {
          elements.toolHint.textContent = "Pen selected. Draw on the canvas.";
        } else if (tool === "eraser") {
          elements.toolHint.textContent = "Eraser selected. Remove marks on the canvas.";
        } else {
          elements.toolHint.textContent = "Choose a tool to begin.";
        }
      },
    );
  } catch (error) {
    elements.editorMessage.textContent = "Canvas drawing is not available in this browser.";
    elements.penTool.disabled = true;
    elements.eraserTool.disabled = true;
    elements.submitButton.disabled = true;
    console.error(error);
    return;
  }

  elements.dismissWelcome.addEventListener("click", () => {
    elements.welcomeOverlay.hidden = true;
    elements.penTool.disabled = false;
    elements.eraserTool.disabled = false;
    elements.editorMessage.textContent = "Choose a tool to begin.";
    elements.penTool.focus();
  });

  function resetToEditor() {
    window.location.reload();
  }

  elements.restartButton.addEventListener("click", resetToEditor);

  elements.submitButton.addEventListener("click", async () => {
    elements.editorMessage.textContent = "";

    try {
      if (drawing.isBlank()) {
        elements.editorMessage.textContent = "canvas cannot be blank";
        return;
      }

      showView(elements.loadingView);
      await waitForPaint();
      elements.asciiArt.textContent = canvasToAscii(elements.canvas);
      showView(elements.resultView);
    } catch (error) {
      showView(elements.editorView);
      elements.editorMessage.textContent = "could not generate art. please try again";
      console.error(error);
    }
  });

  elements.dismissWelcome.focus();
}

startApp();
