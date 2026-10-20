---
doc: prd
status: approved
---

# Doodle to ASCII — Product Requirements

A simple doodle editor for younger people to make handmade ASCII art for texts or digital journals.
Source: `scope.md > Who It's For`, `scope.md > The Unique Kernel`.

## The Core Journey

1. The user opens the app and sees the doodle editor with a welcome message centered over the canvas. The message must be dismissed before drawing can begin.
2. The user clicks the pen icon to activate the pen, then draws on the canvas. They can click the eraser icon to erase parts of the doodle. Neither tool is active until selected.
3. The user clicks **Submit**. If the canvas is blank, the app shows “canvas cannot be blank” and stays in the editor. If it has a doodle, the app changes to a loading page that says “Generating art :)”.
4. When generation finishes, the result page shows one ASCII image beside a text box in the middle of the page. The text box is on the left of the image and says “Your ASCII doodle has been generated.” A **Download** button sits below the text box.
5. The user clicks **Download**. The app initiates a `.txt` download and then shows “image downloaded”. If the app cannot prepare or initiate the download, it shows “download failed. please try again”. The page cannot reliably detect a later browser cancellation or block.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

## Screens and Layout

- **Doodle editor:** The square drawing space fits phone and desktop browser viewports. Pen and eraser icons sit at the top of the page, outside the drawing space; the **Submit** button sits at the bottom, also outside the drawing space. A welcome message appears centered over the canvas on first entry. The icons activate their respective tools.
- **Loading page:** Appears after a nonblank canvas is submitted and displays “Generating art :)”.
- **Result page:** Centers the generated ASCII image beside the message box. The message box is to the image's left, with the **Download** button below it.

## Look and Feel

Keep the interface simple, intuitive, homemade, and black and white, drawing on the feel of early web drawing games such as scribble.io. The supplied ASCII example is a reference for the generated art, not for the interface. For this proof of concept, the visible art uses only `#` characters, has no more than 50 characters per line, and preserves the doodle's basic shape. A grid cell becomes `#` when pen coverage exceeds 15%; the 30%-cell-width pen stroke should cross that threshold.

Source: `scope.md > Inspiration & Identity`.

## Features and Behavior

### Welcome and Editor

On first entry, show this message centered over the canvas:

> Welcome to ASCII doodler! Start drawing in this editor, and when you are done, click submit to generate your image.

The drawing space is square and responsive so it fits phone and desktop browser viewports. The pen and eraser icons are at the top of the page, outside the drawing space; **Submit** is at the bottom, also outside it. The user must dismiss the message before the canvas accepts drawing. After it is dismissed, no drawing tool is active by default. The user starts by clicking the pen icon. Clicking the eraser icon activates erasing; clicking the pen icon returns to drawing. The pen draws in black at 30% of a grid cell's width. The eraser is 90% of a cell's width. The inactive tool button is light grey; the active tool button is white.

- [ ] On first entry, the welcome message is visible in the center of the canvas and drawing does not begin while it is open.
- [ ] The drawing space is square, with the tool icons above it and the **Submit** button below it, all outside the drawing space.
- [ ] The square drawing space fits phone and desktop browser viewports; tool icons remain above it and **Submit** remains below it, all outside the drawing space.
- [ ] After dismissing the message, the user must click the pen before drawing; the selected tool is visually indicated by a white button and the inactive tool by a light-grey button.
- [ ] The pen draws black marks at 30% of a grid cell's width; the eraser removes marks at 90% of a cell's width.

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

### Submit and Generate

**Submit** validates that the canvas is not blank. A blank canvas produces a pop-up that says “canvas cannot be blank”; the user remains in the editor and no result is generated. A nonblank canvas opens the loading page and displays “Generating art :)”. When generation completes, the app produces one image. Its visible mark is only `#`, each line is no more than 50 characters wide, and the arrangement should preserve the doodle's basic shape. A grid cell renders as `#` only when pen-mark coverage exceeds 15% of that cell. If generation fails, return to the editor with the doodle preserved and show “could not generate art. please try again”.

- [ ] Submitting a blank canvas shows the exact error message and does not leave the editor.
- [ ] Submitting a nonblank canvas shows the loading page and its exact message before the result appears.
- [ ] The result uses `#` as its only visible art character, retains the doodle's basic shape, has no line longer than 50 characters, and renders a cell only when pen-mark coverage exceeds 15%.
- [ ] If generation fails, the user returns to the editor with the doodle intact and sees “could not generate art. please try again”.

Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

### Result and Download

The result page places the ASCII image to the right of a message box, with both centered in the page. The message box reads “Your ASCII doodle has been generated.” The **Download** button is directly below the message box. Clicking it initiates a `.txt` download, then the app shows “image downloaded”. If the app cannot prepare or initiate the download, it shows “download failed. please try again”. A local browser page cannot reliably detect if the browser later blocks or cancels the download. Copy-to-clipboard is not part of this proof of concept.

- [ ] The result page shows the generated image to the right of the exact confirmation text, with **Download** below the text box.
- [ ] Clicking **Download** initiates a `.txt` download containing the generated ASCII art and displays “image downloaded”.
- [ ] If the app detects an error preparing or initiating the file, it displays “download failed. please try again”. Later browser cancellation or blocking may not be detectable.

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`, `scope.md > Explicitly Cut`.

## States and Boundaries

- **First use:** The welcome message overlays the canvas. Drawing is unavailable until the message is dismissed.
- **Ready to draw:** Neither tool is active initially. The user selects the pen to draw; selecting either tool updates the button states.
- **Blank canvas:** Submitting shows “canvas cannot be blank” and keeps the user in the editor.
- **Generating:** The loading page displays “Generating art :)”.
- **Generation failed:** The app returns to the editor, preserves the doodle, and shows “could not generate art. please try again”.
- **Result ready:** One `#`-based image appears with the confirmation text and download action.
- **Download initiated:** The app starts the `.txt` download and shows “image downloaded”; this does not confirm that the browser saved the file.
- **App-side download error:** If preparation or initiation fails in a way the app can detect, it shows “download failed. please try again”.

## Product Decisions

- The pen is not active by default; the user must click its icon to begin drawing.
- Pen and eraser are selected by clicking their icons. The active icon button is white and inactive icon buttons are light grey.
- Pen width is 30% of a grid cell; eraser width is 90% of a cell.
- A cell becomes `#` only when pen-mark coverage exceeds 15%, so a straight pen stroke across it qualifies.
- The proof of concept generates one result, uses `#` as the only visible art character, limits each line to 50 characters, and preserves the doodle's basic shape.
- The art example guides the output's appearance only; the app interface follows the separate early-web drawing-game direction.
- The learner chose to keep the proof of concept to a single drawing-to-download journey.

## What We're Building

A black-and-white doodle editor with a first-use welcome overlay, a 30%-cell-width black pen and 90%-cell-width eraser, blank-canvas validation, a loading page, one shape-preserving `#` ASCII result with a 15% cell-coverage threshold and 50-character line limit, and `.txt` download with an in-app confirmation.

## Deferred From the POC

- Image import and saving the source image as JPG or PNG, so the first version can focus on drawing directly in the app.
- Shape and fill tools, color selection, and adjustable pen or eraser sizes, to keep the editor small.
- Multiple render complexities, to keep the output flow to one result.
- Copying the art directly to the clipboard, since `.txt` download is the selected way to take the result away.

## Possible Later Enhancements

The deferred editor and sharing options can be reconsidered after the single drawing-to-download flow is demonstrated. No later feature is required for this proof of concept.

## Non-Goals

- Reproducing the supplied ASCII example character-for-character; it informs the output style, while the doodle supplies the actual shape.
- Using visible art characters other than `#` in this proof of concept.
- Image import, image-file export, extra drawing tools, adjustable sizes, multiple complexity options, or clipboard copy.
- Modeling the app interface on the website where the ASCII example was found.

## Open Questions

None. Browser-managed download completion cannot be confirmed; the app reports whether it initiated the download and shows an error only for detectable app-side failures.
