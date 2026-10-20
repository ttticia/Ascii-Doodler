---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn
Commit scope: Stage and commit only `Desktop/projects/dev post/` under the current Git root. The project `.gitignore` excludes `devpost/learner-profile.md` and local credential files; inspect each staged diff before committing.

## Slices

- [ ] **1. Draw, erase, and generate the ASCII doodle**
  Becomes usable: A local browser app opens to the welcome message, lets the user draw or erase on the square canvas, validates blank submissions, and generates one cropped result on a 46-column by 30-row grid. Cells above 35% coverage use `$`; cells above 15% use `/`; other cells are blank.
  Why now: This puts the unique drawing-to-ASCII idea first and tests the main technical risk—the cell coverage conversion—inside the first runnable slice. Project setup is part of this behavior, not a separate step.
  PRD ref: `prd.md > The Core Journey` (steps 1-4), `prd.md > Welcome and Editor`, `prd.md > Submit and Generate`
  Spec ref: `spec.md > Editor Canvas and Tool Controls`, `spec.md > ASCII Converter`, `spec.md > Page and Journey State`, `spec.md > File Structure`
  Build: Create the static HTML/CSS/JavaScript structure. Implement the responsive square canvas, welcome gate, pen/eraser selection and dimensions, blank-canvas validation, loading and generation-error states, and the 46-by-30 conversion grid. Keep the drawing guide and converter dimensions driven by the exported grid constants in `ascii.js`; classify coverage as `$` above 35%, `/` above 15%, and blank otherwise; crop empty outer rows and columns; show the result in a monospace preview.
  Verify (mechanical): Serve the app locally. At phone and desktop viewport widths, check square-canvas layout and no browser-console errors. Exercise blank, erased, and drawn canvases; verify the loading/error messages, 46-column by 30-row grid alignment, `$` and `/` output and their strict coverage boundaries, cropped margins, preserved basic shape, and no line wider than 46 characters.
  Learner check: Open the local app, dismiss the welcome message, draw a simple shape, erase part of it, and submit. Does the ASCII result still look like your doodle?
  Commit: `Build doodle editor and ASCII conversion`

- [ ] **2. Download the art and finish the journey**
  Becomes usable: The result view shows the generated artwork and confirmation message on phones and desktops, and its restart action reloads the app to a blank canvas.
  Why now: Once the core conversion works, this completes the user journey with the agreed result and restart flow.
  PRD ref: `prd.md > Result and Download`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Result and Text Download`, `spec.md > Important Failure Modes`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Add the responsive result layout and restart button. Restart reloads the page to restore a blank canvas; `.txt` download is intentionally omitted. Preserve the doodle after generation errors. Add the README with the local server instructions.
  Verify (mechanical): Confirm the result preview matches the generated artwork; test restart and verify the reloaded canvas is blank. Verify narrow and wide layouts and no console errors. Confirm there is no download action and no parent-folder paths or `devpost/learner-profile.md` are staged before the commit.
  Learner check: Run the app locally, draw and submit a doodle, then restart. Does the result look right, and does restart give you a clean canvas?
  Commit: `Add ASCII result and restart flow`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 1, while the conversion and editor can still be adjusted.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 2 and any agreed revisions.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [record the activity and actual code/test references after the build]
Route and stops: [record the route and stops after the wrap-up]
Edit outcome: [record tried/kept/reverted/declined/not applicable after the activity]
Reflection: [record offered/answered/declined/already covered; personal answer stays in ignored profile]
Activity mode: [record live app and editor, focused alternative, prior practice, or recap]

## Revisions
- Eraser width changed from 23% to twice the pen width (40% of a grid cell) at the learner's request; implementation and all planning references updated before continuing slice 1.
- Learner clarified final brush sizes as 30% pen and 90% eraser; implementation and product/technical specs updated to these dimensions.
- Canvas pixel rounding made a nominal 15% cell appear slightly above threshold; subtract half an 8-bit shade step before comparison so exact 15% remains blank while a 30% straight stroke qualifies.
- The converter and drawing guide now share 46-column by 30-row dimensions from `ascii.js`; the output uses `$` above 35% coverage and `/` above 15%, then crops to the artwork bounds.
- The result flow uses a restart button instead of the previously planned `.txt` download, per the learner's request to skip downloads.
