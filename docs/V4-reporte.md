# V4 — reporte del bloque M

Rama `v4`, sale de `master` (que ya incluía V3, fusionado en el PR #3). Un commit por bloque, A a M. Sin merge.

**Capturas.** `shots/v4-m/`: 480 imágenes. Son las 10 páginas (incluida la nueva `/toolkit`), en es y en, a 390×844, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080, 2560×1440 y 3440×1440. Por cada combinación hay tres capturas: primera pantalla (`__fold`), mitad (`__mid`) y página completa (`__full`).

**Estados.** `shots/v4-m-states/`: título con el cursor a mitad de la palabra, los dos tipos de botón con el cursor encima, red social con el cursor encima, tarjeta destacada con el cursor encima, parcela con el cursor encima, filtro "Web", línea de tiempo al 50 % (1440 y 390) y menú del móvil abierto.

**Comprobaciones en verde.** `build`, `lint` (0 errores, 11 avisos heredados), `check:tokens`, `check:contrast`, `check:keys`, `check:routes`, `check:layout` (los ocho tamaños), `test:vine` y `test:botanical`. `check:routes`, `check:layout`, `check:keys` y `test:botanical` son nuevos en V4.

## A–L punto por punto

| Bloque | Estado | Prueba |
|---|---|---|
| §1 Escena siempre visible (fondos nítidos, desenfoque ~4 px, velo 12 %, parallax 40 px, niebla y pétalos) | cumple | `v4-m/es__1440__full.png`, `es-about__1440__mid.png` |
| §1 Muros de concreto por sección con plantas en los bordes | cumple | cualquier `__full` |
| §1 Paleta V4 (sin `--lichen-300`) | cumple | `check:contrast` (bloom-ink 4.64 sobre concreto con textura) |
| A.1 Página en blanco / hidratación | cumple. La causa: el `<style>` del deck lo escapaba el servidor y el navegador lo leía crudo. Además encontré y arreglé un segundo fallo: al salir del caso Bloom la página vieja se quedaba en pantalla | `check:routes`: 20 rutas en frío y 16 clics seguidos por idioma |
| A.2 Enlaces muertos | cumple | `check:routes` revisa el destino de cada tarjeta y que las que no tienen caso no tengan cursor de enlace |
| B Diseño fluido, ocho tamaños | cumple | `check:layout`; `v4-m/*__2560x1440__*`, `*__3440x1440__*` |
| C Nav con Velour, sin logo, seis redes en columna en blanco, idioma abajo, hoja de menú en el móvil | cumple | `v4-m/es__1366x768__fold.png` (el nav cabe en 768), `menu-movil.png` |
| D Dos botones: Velour brilla al pasar el cursor; Mohair con la etiqueta teñida en el pelo | cumple | `velour-hover.png`, `mohair-hover.png` |
| E Botanical local, el texto nunca desaparece | cumple con el efecto local, sin recurrir al respaldo | `titulo-cursor.png`, `shots/v4-e/*`, `test:botanical` (≥ 99 % dentro de las letras, cada letra conserva ≥ 45 % de su tinta, 20 % de flores) |
| F Sin etiquetas sobre los títulos | cumple; 44 claves borradas por idioma | `check:keys` |
| G.1 Nombre arriba a la derecha, despejado de las ramas | cumple | `v4-m/es__1440__fold.png` |
| G.2 Línea de rol alineada a la izquierda y con efecto botánico | cumple | ídem; `shots/v4-e/home-rol.png` |
| G.3 Declaración nueva sobre un muro | cumple (textos de V4 literales) | `v4-m/es__1440__mid.png` |
| G.4 Proyectos destacados (3) que se vuelven peluche al pasar el cursor | cumple | `destacada-hover.png` |
| H.1 Ocobo a la derecha, ramas a la izquierda, sin máscara, fijo al hacer scroll | cumple en disposición, **acabado mejorable** (ver abajo) | `v4-m/es-about__1440__fold.png` |
| H.2 Frases en negrita bloom-ink | cumple, las 11 frases exactas por idioma | ídem |
| H.3 Línea de tiempo orgánica | cumple; la enredadera se ve y toca los 9 hitos | `enredadera-50.png`, `test:vine` |
| H.4 Credenciales fuera de About | cumple | — |
| I Celosía con parcelas, filtros que marchitan sin mover nada, sin caso = brote | cumple | `parcela-hover.png`, `filtro-web.png`, `v4-m/es-projects__*` |
| J Toolkit (ruta, SEO, hreflang, nav, manchas de musgo, credenciales) | cumple | `v4-m/es-toolkit__1440__full.png` |
| K Casos sobre muros | cumple | `v4-m/es-projects-*__1440__*` |
| L Limpieza y documentación | cumple | `ACABADO.md`, `CLAUDE.md` |

## Contextos WebGL vivos por ruta

| Ruta | En reposo | Máximo con cursor |
|---|---|---|
| Inicio | 1 (busto) | 3 |
| Sobre mí | 1 (ocobo) | 3 |
| Proyectos, Herramientas y cada caso | 0 | 2 |

## Peso de la página de inicio

3 398 KB transferidos al cargar `/es` sin caché. El busto (`hero-bust.glb`) pesa 1 982 KB. El resto: imágenes 574 KB (los fondos nítidos pesan más que los desenfocados de V3), JS 441 KB, fuentes 369 KB.

## Decisiones tomadas por mi cuenta

1. **Escena antes del layout.** La dirección de §1 (escena, muros, paleta) entró en el commit B, porque es la base de la que depende el ancho fluido.
2. **Enredadera 3D retirada.** La línea de tiempo ahora es SVG en todos los tamaños. V4 pide que la enredadera pase por delante y por detrás de piedras giradas y las agriete, y eso se resuelve limpio en el DOM con dos capas y un recorte. Además se libera un contexto WebGL.
3. **Plush Tile con cojín rectangular.** Añadí un parche al port (`rect`) para que parcelas y tarjetas puedan volverse peluche con su proporción real. Antes solo existía el cuadrado.
4. **Botones y nav escalan con el alto de la ventana.** A 3440×1440, con su tamaño fijo, quedaban diminutos.
5. **El hero se apila por debajo de 7:5.** En 1024×768 y en tablets verticales no cabe el nombre a la derecha sin pisar las ramas.
6. **Etiqueta Mohair más legible.** Bajé el deshilachado de las letras teñidas de 5 px a 2 px y uso letra más grande en etiquetas de tres letras o menos ("EN"). Con el valor original no se leían.
7. **Follaje del Botanical en verdes claros.** El verde más oscuro desaparecía dentro de letras casi negras.
8. **Etiquetas de sección de los casos.** El número y el nombre de cada sección (01 Problema…) siguen en el HTML para lectores de pantalla, pero no se ven.
9. **Una etiqueta que era el único título de su bloque pasó a ser su encabezado.** Así se quitan las etiquetas sin perder contenido.
10. **Herramientas.** La loseta de pelo conserva su tinta `--mist` (V4 pide no tocarla). Las redes cambiaron a `--white`.
11. **Ocobo sin cielo.** Lo dibujo directo sobre la escena con un modo `transparent` en su lienzo. La imagen fija de respaldo (sin WebGL) conserva su cielo.

## Lo que no alcanzó buen acabado

- **Ocobo** (`v4-m/es-about__1440__fold.png`, `es-about__3440x1440__fold.png`): a toda la altura y reflejado se lee como una pared de flores rosa, no como un árbol. El tronco queda fuera del encuadre y la copa ocupa toda la columna. Habría que recomponer la escena en vertical (el tronco abajo a la derecha, la copa saliendo hacia la izquierda); eso pide tocar la composición interna del componente.
- **Etiquetas teñidas en Mohair**: son legibles pero rugosas a 44 px (`mohair-hover.png`, filtros en `v4-m/es-projects__1440__fold.png`). Es el precio de que las letras se muevan con el pelo, como pide V4.
- **Parcelas sin captura**: los tres sitios sin caso se ven como tierra con un brote, como pide V4. En Proyectos ocupan mucho espacio de la primera fila.
- **Peso de Home**: 3,4 MB, la mitad es el modelo del busto.

## Contenido que falta (no inventado)

- Capturas de "Proyecto freelance" y "adidas × Milo J".
- El año de cada una de las ocho credenciales.
