# Thread data corrections, 2026-10-09

Source PDFs provided by the project owner; PDFs are not redistributed in this repository.

- ГОСТ 24705-2004, table 1, PDF pages 6–18: added 96 diameter/pitch combinations (M1–M600 range now contains 477 records). Added values checked against rendered table pages. Corrected M30×3.5 d3 to 25.706.
- ГОСТ 16093-2004, table 7, printed page 11: replaced approximate g deviation formula with tabulated micrometre values.
- ГОСТ 16093-2004, table 6, printed pages 9–10: replaced scaled/rounded degree 7/8 pitch tolerances with explicit degree columns, preserving absent values.
- ASME B1.1-2024, table 2A, printed page 30: restored 1 5/8-16 UN class 3A.
- ASME B1.1-2024, table 2B, printed pages 78–79: restored 2B/3B for 5 7/8 and 6 inch, 4/6/8/12/16 TPI.

## Conflicting source values

The supplied ГОСТ table has internally inconsistent values for M125×6 (d1/d3), M230×4 (d1) and M290×3 (d1). Corrected to 118.505/117.639, 225.670 and 286.752 respectively, using profile geometry and translation from unambiguous rows of the same pitch. These are documented corrections, not verbatim copies of the erroneous cells.

The supplied ASME table 2B, printed page 76, labels a row 5 3/8-4 while giving 5.3875 as decimal diameter (5 3/8 = 5.375). Previously imported as the spurious 5 19/49-4 record. Removed that record without merging its disputed internal limits into 5 3/8-4. The valid external record remains; internal limits remain unavailable until publisher errata or an independently validated normative calculation resolves the conflict.

Run: node tests/thread-regressions.cjs

Scope: confirmed audit findings; not a claim that all standards, coatings, engagement lengths or tolerance classes are supported. Metric sizes below M1 are outside this release.
