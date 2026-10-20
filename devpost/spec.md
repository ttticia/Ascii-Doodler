---
doc: spec
status: approved
---

# Doodle to ASCII — Technical Spec

## How This Works, In Plain Language

The app is a small set of HTML, CSS, and JavaScript files that the browser opens. A square browser drawing surface (a canvas) records the user's pen and eraser marks. JavaScript reads those marks, converts them to a grid of `#` characters and spaces, and shows the result. The browser can then package that text as a `.txt` download.

The drawing and result live only in the open browser page; refreshing or closing the tab clears them. Python is used only to serve the files locally while developing and recording the demo. There is no app server, account, database, or external service.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. Python's built-in local server serves `index.html`, `styles.css`, and the JavaScript modules to the browser.
2. The browser shows the square editor with the welcome message over it. The user closes the message; drawing remains disabled until they click the pen button.
3. `drawing.js` maps mouse, touch, or stylus movement to the square canvas. Pen and eraser buttons select the active tool. The canvas background is white; the pen paints black, and the eraser restores white.
4. When the user selects **Submit**, `app.js` checks whether any marks remain. A blank canvas stays in the editor and shows the PRD's blank-canvas error.
5. For a nonblank canvas, the app displays the loading view, then `ascii.js` measures the mark coverage in a 50-by-50 analysis grid. A cell becomes `#` only above 15% coverage; cells at or below 15% become spaces. Empty outer rows and columns are trimmed. The resulting lines stay within 50 characters.
6. The result view shows the generated text in a monospace block beside the message and download control. On narrow screens, the result and message stack while keeping the message before the art.
7. `app.js` packages the ASCII string in a text `Blob` and asks the browser to download it. It reports “image downloaded” after initiating the download, not after verifying that the browser saved it.

## Stack

- **HTML5, CSS, and plain JavaScript modules.** These match the learner's choice to use JavaScript while avoiding framework setup and dependencies.
- **Canvas 2D API.** `HTMLCanvasElement.getContext("2d")` draws on the canvas; `getImageData()` reads its pixels for blank checks and cell-coverage calculations. The learner agreed to the canvas approach. The 2D context is broadly supported in current desktop and mobile browsers.
- **Browser download APIs.** `Blob` holds the generated text, an object URL provides it to a temporary download link, and `HTMLAnchorElement.download` requests a `.txt` download. The browser controls the actual save and does not provide the page a reliable completion signal.
- **Python 3 standard library, development only.** `http.server` serves the static files locally. Python does not run the app or process the drawing.
- **No packages, frameworks, APIs, database, or deployment dependency.** No package installation or API keys are needed.

Documentation:
- [Canvas `getContext()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
- [Canvas `getImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData)
- [JavaScript `Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [Anchor `download` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download)
- [Python `http.server`](https://docs.python.org/3/library/http.server.html)

## Where It Runs and How Someone Tries It

The app runs locally in a desktop or phone browser. The current workspace has Python 3.13.9, and `python -m http.server --help` was verified here. No installation is required for the app itself.

From the project root, run:

```powershell
python -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/) in a browser. Stop the local server with `Ctrl+C`. If port 8000 is already in use, run `python -m http.server 8001` and open `http://localhost:8001/` instead.

For the hackathon submission, record a short demo video and publish the repository on GitHub. Local operation is enough for the demo; deployment is not planned.

## Look and Feel

- Keep the interface black and white, simple, homemade, and reminiscent of early drawing games such as scribble.io; do not model the interface on the ASCII example's source website.
- Use a responsive page layout. The editor canvas stays square and fits both phone and desktop viewports. Pen and eraser controls remain above the canvas; **Submit** stays below it, all outside the drawing area.
- Center the welcome message over the canvas and block drawing until it is dismissed.
- Use browser-safe fonts and no remote font or image requests. Render the ASCII preview in a monospace block so spaces and line breaks remain aligned.
- On a phone, stack the result message before the art rather than squeezing both into narrow side-by-side columns.

PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`, `prd.md > Welcome and Editor`.

## Components

### Editor Canvas and Tool Controls

`drawing.js` owns the square drawing surface and pointer input. Keep a fixed 500-by-500 logical canvas and scale its displayed size to the available viewport; translate pointer coordinates back to the logical canvas so brush sizes do not change with responsive CSS. The 50-column analysis grid therefore has 10 logical pixels per cell. The pen width is 30% of a cell (3 logical pixels); the eraser width is 90% of a cell (9 logical pixels).

The page starts with no active tool. After the welcome message is dismissed, clicking the pen activates black drawing; clicking the eraser activates white erasing. The selected button is white and inactive buttons are light grey. Use pointer events so mouse, touch, and stylus input share one interaction path. Blank validation must inspect the current canvas pixels, so erasing all marks makes the canvas blank again.

PRD ref: `prd.md > Welcome and Editor`.

### ASCII Converter

`ascii.js` reads the white-backed canvas and evaluates a 50-by-50 grid. For each grid cell, calculate the share of its area covered by black pen marks; anti-aliased edge pixels contribute according to how dark they are. Canvas pixel channels use 8-bit values, so subtract half of one shade step (`0.5 / 255`) as a rounding tolerance before comparing. Use `#` only when the adjusted coverage is strictly greater than 15%; an exact 15% cell remains a space. This lets a 30%-cell-width straight stroke crossing a cell pass the rule.

Trim empty outer rows and columns from the generated character grid without distorting its remaining shape. The analysis grid is at most 50 columns wide, so no output line may exceed 50 characters. The output contains only `#`, spaces, and line breaks. Keep conversion deterministic and local; there is one output, no external model or service.

PRD ref: `prd.md > Submit and Generate`, `prd.md > The Core Journey`.

### Page and Journey State

`app.js` connects the screens and actions. It tracks the current view (`editor`, `loading`, or `result`), whether the welcome message is open, the active tool (`none`, `pen`, or `eraser`), and the generated ASCII string. These values exist only in memory for the current page session.

On submit, reject a blank canvas with “canvas cannot be blank”. For a nonblank canvas, show “Generating art :)” and let the browser paint that view before running the small local conversion. If generation throws an app-side error, return to the editor without clearing the canvas and show “could not generate art. please try again”.

PRD ref: `prd.md > The Core Journey`, `prd.md > Submit and Generate`, `prd.md > States and Boundaries`.

### Result and Text Download

`app.js` displays the ASCII string in a `<pre>`-style monospace region. Place the message box to its left and the **Download** button below the message box on wider screens; stack the message before the art on narrow screens. Keep the exact PRD copy.

On click, construct a UTF-8 text `Blob`, create an object URL, and activate a temporary link named `ascii-doodle.txt`. Revoke the object URL after initiating the link. Show “image downloaded” after initiation. If preparing the blob or creating/activating the link raises a detectable error, show “download failed. please try again”. Do not claim to detect a browser cancellation or block after initiation.

PRD ref: `prd.md > Result and Download`, `prd.md > States and Boundaries`.

## Data Model

All data stays in the current page session:

- **Drawing pixels:** The canvas is the source of truth. Pen and eraser directly update it; blank checks and conversion read the current pixels.
- **Active tool:** One of `none`, `pen`, or `eraser`; starts as `none` and changes when a tool icon is clicked.
- **Current view:** Editor, loading, or result. Generation failure returns to the editor; success moves to the result.
- **Generated ASCII:** One string of `#`, spaces, and line breaks, held until the page closes or refreshes.

Nothing is saved between visits. There is no local storage, account, or backend.

## File Structure

```text
project/
├── index.html             # Editor, welcome message, loading, and result views
├── styles.css             # Monochrome responsive layout and square canvas sizing
├── src/
│   ├── app.js              # Screen state, validation, errors, and text download
│   ├── drawing.js          # Canvas setup, pointer input, pen and eraser
│   └── ascii.js            # Cell coverage, trimming, and ASCII string generation
├── README.md               # Setup and local demo instructions
├── agent/                  # Existing Devpost Learn skills and templates
└── devpost/                # Learner profile and planning documents
```

## External Services and Dependencies

None. The browser's built-in Canvas, Blob, and download APIs are used. Python's standard-library `http.server` is used only to preview the static project locally. No account, key, payment, or network service is involved at runtime.

## Important Failure Modes

- **Blank submission** → stay in the editor and show “canvas cannot be blank”.
- **Generation exception** → return to the editor with the doodle intact and show “could not generate art. please try again”.
- **Detectable app-side download preparation/trigger error** → show “download failed. please try again”. A browser cancellation or block after the download is initiated cannot be reliably detected.
- **Canvas API unavailable** → show a clear unsupported-browser message rather than leaving a nonworking editor; verify this fallback during the build.

## What Was Simplified and Why

- A local static browser app instead of a backend or hosted service — drawing, conversion, and download all happen on the user's device, which is enough to demonstrate the idea.
- Plain HTML/CSS/JavaScript instead of a framework — the app has one compact journey and no package installation.
- In-memory canvas instead of saving drawings — persistence is not needed for the proof of concept and would add unrelated storage behavior.
- One `#`-only render and `.txt` download instead of multiple complexity levels, image imports/exports, or clipboard support — this preserves the approved drawing-to-download boundary.

## Decisions and Open Issues

- **Learner choices:** JavaScript for browser interaction; local run for now; responsive phone and desktop layout; square canvas with controls outside it; no active tool until the pen is clicked; 30% cell-width pen and 90% cell-width eraser; `#` only when cell coverage is greater than 15%; trim empty margins; maximum 50 characters per line; no persistence.
- **Download learning moment:** The question was whether the page can confirm a file has been saved. MDN documents that the anchor `download` property cannot determine whether a download occurs. The accepted behavior is to report that the app initiated it; only detectable app-side preparation or trigger errors get the failure message. Verify the actual file content during the build.
- **Verification focus:** Check the 15% boundary with a line that crosses a cell, erase all marks and submit, confirm crop and line width, and inspect the downloaded `.txt` contents. Compare the preview at phone and desktop widths.
- **Open issues:** No product decisions block the build. The browser may block or cancel a download without notifying the page; this is an accepted platform limitation. Confirm the target browsers during build testing.
