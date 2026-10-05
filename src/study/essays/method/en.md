## One work per theme

Every study theme starts from a single documented work: a building, a publication, an object, a website. Its ficha cites at least two sources, at least one of them not Wikipedia. Sources are paraphrased, never quoted, and every statement carries the number of its source, the same in Spanish and in English.

## The documented and the reading

The ficha has two parts. What is documented gathers what the sources say. The reading explains what the theme takes from the work and why: it is an interpretation and is presented as one. The palette states its origin: documented, when a source names the colours; sampled, when they come from a free photograph; interpreted, when they are a reading of our own.

## Images

Photographs come from Wikimedia Commons, which accepts only free content: anyone may reuse it, change it and use it commercially, and non-commercial or no-derivatives licences are excluded [2]. The study narrows that to CC0, public domain, CC BY and CC BY-SA. Each image is resized to at most 1600 pixels and converted to AVIF, and its credit names the author, the licence and the source page. Images live on the site, not in the npm package. When a work has no free image, its page links to an archive or to the main source.

## One geometry, many themes

Every theme fills in the same token contract. Colour, type, borders, shadows and detail change; geometry does not: controls are 32, 40 or 48 pixels tall in every theme. Detail families, such as concrete or the grid, add texture without changing the size of anything, and an automatic check rejects, in each theme's own CSS, literal colours, images and any change of geometry outside pseudo-elements.

## Contrast

Every colour pair of the contract is measured in light and dark with the WCAG 2.2 formula: 4.5:1 for text and 3:1 for control boundaries and the focus indicator, the minimums the standard sets for normal text and for user interface components [1]. Pairs are measured on the textures too. A theme that fails does not ship.
