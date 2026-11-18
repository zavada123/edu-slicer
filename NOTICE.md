# NOTICE

3D-друк (edu-slicer) is a fork of Kiri:Moto from [GridSpace/grid-apps](https://github.com/GridSpace/grid-apps),
commit `d138275bbe9d4e4030d8cb8b2dcf66607da9295a` (version 4.7.0).

Kiri:Moto is Copyright 2014-2018 Stewart Allen and is released under the MIT license ([license.md](license.md)).
"Kiri:Moto" and "grid.space" are the names of the original project; this fork is not affiliated with it.

Changes in this fork:

- `docs/` (the documentation site and its screenshots) is not included.
- Static build (`tools/build-static.mjs`) that runs under any path prefix; the page and its workers load
  their files by relative paths.
- Ukrainian interface (`web/kiri/lang/uk.js`, built from `tools/uk_strings.py`), on by default.
- For school use (`src/kiri/app/edu.js`, `web/kiri/edu.css`): FDM printing only, a short list of school
  printers, no help dialog with community links, no donation links, no PWA install, no cookie notice.
- Only the dependencies the slicer needs (no Electron, docs or server packages).
