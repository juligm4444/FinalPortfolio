# V3 — reporte del bloque J

Rama `v3` (sale de `acabado`, que va por delante de `master`; ver "Decisiones"). Un commit por bloque A–J. Sin merge.

Capturas: `shots/v3-j/` (las 9 rutas a 1440×900 y 390×844: `__fold`, `__mid`, `__full`) y los estados interactivos en la misma carpeta. Capturas intermedias por bloque: `shots/v3-a` … `shots/v3-h`.

Comprobaciones en verde: `npm run build`, `npm run lint` (0 errores, 13 avisos que ya estaban), `npm run check:tokens`, `npm run check:contrast`, `npm run test:vine`, `npm run test:deck`.

## A–H punto por punto

| Punto | Estado | Prueba |
|---|---|---|
| A.1 Tokens de concreto frío, `--lichen-300`, fuera `--veil` | cumple | `src/styles/index.css`; `npm run check:contrast` (todos los pares ≥ 4.5) |
| A.2 Textura de concreto por script, < 60 KB, losa con multiply, canto 3 px, brillo 1 px, radio 2 px | cumple (47 KB) | `scripts/make-concrete.mjs`; `es-about__1440__mid.png` |
| A.3 Sin menta ni beige en cajas | cumple | todas las capturas |
| B.1 Fuera `Surface` y cajas | cumple | `Surface.jsx` borrado; `es-about__1440__fold.png` |
| B.2 Niebla por scroll, peor caso ≥ 4.5 | cumple: 5.44 Home, 6.17 About, 6.27 Projects al 18 %; 5.58 / 5.74 en la primera pantalla de rutas sin hero (32 %) | `npm run check:contrast` |
| B.3 Nav: logo, tres enlaces, retícula 2×3 de redes, idioma; fuera `Dock` | cumple | `es__1440__fold.png` |
| B.4 Redes como Plush Tile real de 44 px, pelo moss-700 con puntas moss-400, logo en mist | cumple | `loseta-hover.png`, `src/assets/fur/plush-*-44.webp` |
| B.5 Móvil: barra superior mist sólida, redes en fila al pie como imagen, sin WebGL | cumple | `es__390__full.png` |
| B.6 Transición de 350 ms sin desenfoque ni pantalla de carga | cumple (sin captura: es movimiento) | `AppShell.jsx` |
| B regla de rendimiento | cumple | ver "Contextos WebGL" |
| C.1 Velour como primario, uno por pantalla | cumple | `es__1440__fold.png`, `es__1440__full.png` |
| C.2 Mohair en todos los demás botones | cumple, con una decisión (etiqueta) y una excepción (abajo) | `mohair-hover.png`, `es-projects__1440__full.png` |
| C.3 Fuera el botón de losa plana | cumple | CSS `.slab` borrado |
| D H1/H2 con Botanical al pasar el cursor, texto plano en reposo, un canvas, 15 % flores, nada en móvil | cumple | `titulo-hover.png`, `shots/v3-d/titulo-hover.png` |
| D Quitar la caja menta del H1 de Home | cumple | `es__1440__fold.png` |
| E.1 Hero según el prototipo | cumple | `es__1440__fold.png` frente a `docs/ref/hero-prototipo.png`; `es__390__fold.png` |
| E.2 Mini bio sobre la niebla, Mohair "Más sobre mí" | cumple | `es__1440__mid.png` |
| E.3 Herbario: losas 3:4 TiltCard, imagen flotando, etiqueta impresa, duotono, color y pasto al pasar, 3×2 / 2×3 | cumple (en móvil el formato pasa a imagen cuadrada + etiqueta, ver decisiones) | `herbario-hover.png`, `es__390__full.png` |
| F.1 Ocobo fijo al lado del relato, sin marco | cumple en disposición; **acabado mejorable** (abajo) | `es-about__1440__fold.png` |
| F.2 Enredadera 3D que crece con el scroll y une los 9 hitos, flor en Diseño, hoja que se dobla; SVG en móvil; prueba automática | cumple | `enredadera-50.png`, `enredadera-50__390.png`, `npm run test:vine` |
| F.3 Credenciales como TiltCard, IBM primero | cumple sin el año (no hay dato) | `es-about__1440__full.png` |
| G.1 Deck con la lógica original, sin marcos, solo el nombre del frente, lista para lectores, prueba de 6 clics, lámina de concreto sin captura | cumple (rueda y táctil ajustados después, a petición) | `deck-3-clics.png`, `npm run test:deck` |
| G.2 Muro de losas con filtros Mohair y reacomodo animado | cumple | `es-projects__1440__full.png` |
| G.3 Herramientas como Plush Tile de 88 px con `simple-icons` | cumple (SQL con glifo propio) | `es-projects__1440__full.png` |
| H Casos sin cajas, niebla, Mohair, títulos, losas con material | cumple (excepto los controles internos de Bloom) | `shots/v3-h/`, `shots/v3-j/es-projects-*` |

## Contextos WebGL vivos por ruta (`npm run states`)

| Ruta | En reposo | Máximo con cursor sobre un título y una pieza de pelo |
|---|---|---|
| /es | 1 (busto) | 3 |
| /es/about | 1 (ocobo) | 3 |
| /es/projects | 0 | 2 |
| cada caso (6) | 0 | 2 |

Nunca más de 3. Las piezas de pelo en reposo son imágenes; solo la que tiene el cursor o el foco está viva, y suelta su contexto al quedarse quieta.

## Peso de la página de inicio

3 190 KB transferidos al cargar `/es` (Chrome, sin caché): 1 982 KB el modelo `hero-bust.glb` con Draco, 469 KB JS, 369 KB fuentes, 338 KB imágenes, 11 KB CSS, 10 KB HTML. El modelo es la mitad del peso: candidato a recortar (texturas o malla) si hace falta.

## Decisiones tomadas por mi cuenta

1. **Rama desde `acabado`, no desde `master`.** `master` está 61 commits por detrás y no tiene nada de lo que V3 corrige (ni `Surface`, ni `Dock`, ni los originales de `vendor/`). Partir de `master` habría sido rehacer ACABADO entero.
2. **Ports generados, no a mano.** `scripts/port-vendor.mjs` toma cada original de `vendor/` sin tocarlo, le quita los tipos y aplica una lista corta de parches que deben coincidir exactamente. PlushTile, MohairCapsule, VelourBolster, BotanicalText y Tumble Deck salen así. `3d-card` es corto y lleva lucide y Tailwind: lo porté a mano como `TiltCard`, con la misma física.
3. **Etiqueta de Mohair como texto real encima del pelo**, no teñida en el pelo como hace el original. A 44–56 px las letras teñidas se deshilachaban y no se leían (`shots/v3-c/` antes del cambio). Velour sí pinta su etiqueta en la tela.
4. **Imagen de reposo por instantánea.** Cada pieza se dibuja una vez con el componente real en un canvas fuera de pantalla. Las fijas (6 redes, 12 herramientas) van horneadas en archivos (`npm run bake:fur`) para que en móvil no haya WebGL. Los botones, cuyo texto cambia con el idioma, se fotografían al cargar; hasta entonces se ve una píldora plana en sus colores.
5. **Rutas sin hero empiezan al 32 % de fondo**, no al 100 %, porque su texto está en la primera pantalla y al 100 % no da 4.5:1. Home sí empieza al 100 %.
6. **Cara del deck que se desvanece al caer.** La lógica de movimiento es la original; solo se apaga la imagen de la lámina entre 20° y 55°, para que ninguna aterrice al revés (ACABADO §5 sigue vigente en eso).
7. **Herbario en móvil**: en dos columnas de ~170 px la etiqueta no cabe en el tercio inferior de una losa 3:4; ahí la imagen es cuadrada y la etiqueta toma su alto.
8. **Ocobo**: se queda la adaptación actual de Moonlit Petals (no está en la lista de originales a reportar).
9. **Foco de teclado en títulos**: los H1/H2 no son enfocables; el efecto se dispara cuando el foco cae en un enlace dentro de un título.
10. **Precarga de rutas**: todas las rutas van en el paquete principal, así que no existe `fallback` que esconder; no hubo nada que precargar.
11. **Emisor de las credenciales** ("IBM SkillsBuild", "Cisco Networking Academy") sacado de los comentarios del propio código y del texto "insignias de IBM y Cisco".
12. **Nuevas claves de texto**: `projects.wallTitle`, `filterLabel`, `filterAll`, `about.certIssuers` (es/en).

## Lo que no alcanzó buen acabado (con captura)

- **Ocobo** (`shots/v3-j/es-about__1440__fold.png`): el árbol en vivo está compuesto en apaisado y, en la columna cuadrada con la máscara circular, se ve medio árbol con forma de luna. Fundido sí, pero no se lee como árbol entero.
- ~~**Rueda sobre el deck**~~ — resuelto tras la revisión, a petición del dueño: el deck solo toma la rueda con foco; en táctil, el gesto vertical hace scroll de la página y el arrastre horizontal pasa láminas. `npm run test:deck` lo comprueba.
- **Botones al cargar**: durante ~1 s se ve la píldora plana antes de que llegue la imagen de pelo.
- **Bloom (caso)**: los selectores del explorador de taxonomía y del visor de wireframes siguen con su estilo propio; convertirlos en Mohair tocaba la pieza interactiva del contenido.

## Contenido que falta (no inventado)

- Año de cada una de las ocho credenciales.
- Capturas de "Proyecto freelance" y "adidas × Milo J": hoy son láminas de concreto con nombre y estado.
- Logo de SQL: no existe genérico en `simple-icons` (solo productos como MySQL); va un cilindro propio.

## Componente externo que podría hacer mejor el muro (no implementado)

[Muuri](https://muuri.dev/): retícula con filtrado, ordenación y reacomodo animado de piezas de tamaños distintos, con soporte de arrastre. Haría más fluido el muro asimétrico que hoy hago con CSS Grid y `layout` de framer-motion. No lo instalé, como pide V3.
