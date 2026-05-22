---
name: Theme contribution
about: Proponer un theme nuevo o variante
title: 'theme: '
labels: ['enhancement', 'theme']
---

## Nombre del theme + inspiración

<!-- Cómo se llama, qué referencias visuales lo inspiran. Adjuntá moodboard / links / screenshots. -->

## Mockups por componente

<!-- Mockups de Button, Input, Card en sus estados típicos. Pueden ser screenshots, Figma, o PNGs hechos a mano. -->

### Button
- [ ] Default
- [ ] Hover
- [ ] Focus (keyboard)
- [ ] Disabled
- [ ] Variantes (primary, secondary, danger — si aplican)

### Input
- [ ] Default
- [ ] Focus
- [ ] Disabled
- [ ] Error state

### Card
- [ ] Default
- [ ] Con header
- [ ] Variantes (si aplican)

## Token contract checklist

El theme se aplica vía `[data-theme="<name>"]` en `src/lib/themes/<name>.css`. Los tokens del contrato viven en `src/lib/tokens.css` — abajo está la lista completa.

### MUST define — sin esto el theme se ve roto

**Color**
- [ ] `--nbc-fg`
- [ ] `--nbc-fg-muted`
- [ ] `--nbc-bg`
- [ ] `--nbc-surface`
- [ ] `--nbc-surface-alt`
- [ ] `--nbc-primary` + `--nbc-primary-fg`
- [ ] `--nbc-primary-accent`
- [ ] `--nbc-secondary` + `--nbc-secondary-fg`
- [ ] `--nbc-danger` + `--nbc-danger-fg`
- [ ] `--nbc-border-color`
- [ ] `--nbc-focus`

**Typography**
- [ ] `--nbc-font-sans`
- [ ] `--nbc-font-display`
- [ ] `--nbc-font-mono`
- [ ] `--nbc-weight-label`

**Shape**
- [ ] `--nbc-border-width`
- [ ] `--nbc-radius` (o `--nbc-button-radius` + `--nbc-input-radius` por separado)

**Effects**
- [ ] `--nbc-shadow`
- [ ] `--nbc-shadow-lg`

### MAY define — sólo si el theme lo necesita

- [ ] `--nbc-label-transform` (uppercase, etc.)
- [ ] `--nbc-label-spacing`
- [ ] `--nbc-button-shadow-hover`
- [ ] `--nbc-input-shadow-error`
- [ ] `--nbc-card-header-bg`
- [ ] `--nbc-card-padding-content`
- [ ] `--nbc-rotate` (si el theme tiene tilt/skew)
- [ ] `--nbc-grid-overlay` (si tiene fondo de grid)
- [ ] `--nbc-holo-gradient` (si tiene efectos holo)
- [ ] `--nbc-hairline`

### Invariant — no redefinir

- `--nbc-space-{xs,sm,md,lg,xl,2xl}` — el sistema de spacing es compartido entre themes.
- `--nbc-fs-{xs,sm,md,lg,xl,2xl}` — la escala tipográfica es compartida.

## Fonts requeridos

<!-- Lista las familias + pesos. El consumer es responsable de cargarlas — la lib no carga fuentes (ver README.md#fonts). -->

| Familia | Pesos | Para qué |
|---------|-------|----------|
|         |       |          |

## License-compatible

- [ ] Las fuentes son de uso libre (Google Fonts, fontsource, etc.) o con licencia compatible con MIT
- [ ] Los colores / referencias visuales no infringen marca registrada

## Mantenimiento

<!-- ¿Quién mantiene este theme post-merge? ¿El autor se compromete a responder issues sobre él? -->
