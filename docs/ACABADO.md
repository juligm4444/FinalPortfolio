# ACABADO.md — reglas de acabado de juligm4.com

Va en `docs/ACABADO.md`. Complementa a `docs/REDESIGN.md`. Si se contradicen, **manda este archivo**. Por encima está **`docs/V3.md`** y, por encima de todo, **`docs/V4.md`** ("open air"). Lo que V3 y V4 revocaron ya está retirado de aquí: cajas detrás del texto, dock, deck de sitios, Botanical que oculta el título, niebla que apaga el fondo, columna central de ancho fijo, logo y etiquetas sobre los títulos.

## 0. Qué cambia respecto a REDESIGN.md

1. **Se anula la "regla híbrida" de casos de estudio** (REDESIGN §5). Los casos usan la paleta y tipografía del sitio. Sin paleta por proyecto, sin tipografía display por proyecto. La identidad de cada proyecto aparece solo dentro de sus imágenes.
2. **Se anula "mini bio: se conserva el hilo actual"**. La mini bio se reescribe (texto en §6).
3. **Nada de la versión anterior sobrevive por defecto.** Si un componente, texto, color o imagen viene de antes del rediseño, se rehace o se borra.

## 1. Narrativa: una sola idea

"Estructura que algo vivo reclama." Concreto = lo que sostiene (ingeniería). Planta = lo que crece (diseño). Grieta = el cambio.

Prueba para cada elemento visible: ¿es concreto, planta o grieta? Si no es ninguno, sobra.

Prohibido en todo el sitio: personajes 3D tipo caricatura, vidrio esmerilado, neón, degradados morados, íconos hexagonales, teclas negras o rosadas, sellos de herramientas de terceros ("Built with …"). Las certificaciones propias (insignias de IBM, Cisco) no son sellos de herramientas: se quedan.

## 2. Paleta: solo tokens

- Único origen de color: las variables de `src/styles/index.css` (`--mist`, `--white`, `--concrete-*`, `--moss-*`, `--bloom*`, `--flower-*`).
- `--white` solo para íconos dibujados en el pelo. `--flower-pink/yellow/violet/white` solo dentro de flores y pétalos, nunca en la interfaz. `--bloom-ink` es el énfasis de texto (negrita del relato).
- **Cero hex fuera de ese archivo.** Excepción única: datos dentro de un canvas WebGL que lean los tokens al iniciar.
- Se eliminan los alias heredados de Tailwind (`black`, `pink`, `gray`, `white`) y las variables `--fg`, `--fg-soft`, `--fg-muted`.
- `--bloom` es acento escaso: como máximo un elemento rosa por pantalla visible. Nunca como relleno de bloques grandes ni como color dominante de un título. El límite aplica al color de interfaz, no a imágenes de contenido (insignias, fotos de proyecto, las flores del busto).
- Imágenes de proyecto: sobre losa de concreto (material V3 §A) o como dibujo del pelo; nunca a sangre con su propio fondo de color.

## 3. Texto siempre legible

- Sin cajas pequeñas detrás del texto. El contenido vive sobre **muros de concreto** del tamaño de la sección (V4 §1), con plantas en los bordes; entre muros se ve la escena. El texto sobre muro es `--concrete-900` o `--concrete-500`; `npm run check:contrast` lo verifica.
- Tamaños mínimos: cuerpo 16 px, texto secundario 14 px, etiquetas 12 px. Nada por debajo.
- Ancho de línea del cuerpo: entre 45 y 75 caracteres, por columnas dentro de una composición ancha; nunca estrechando la página (V4 §B).
- Contraste AA verificado por cálculo, no a ojo.
- H1, H2 y la línea de rol del hero: el texto real nunca desaparece. Botanical Text crece solo alrededor del cursor (≈ una altura de mayúscula), queda 1,2 s y se marchita; cubre como mucho ~55 % de cada letra; flores ≤ 20 % en los cuatro colores de flor (V4 §E). En móvil y táctil, nunca. `npm run test:botanical` lo mide.

## 4. Shell

- **Escena:** el fondo de ruta (archivos `bg-*-sharp`) se ve todo el scroll en todas las rutas, desenfoque leve, velo ≤ 15 %, parallax ≤ 40 px, niebla y pétalos lentos (fuera con `prefers-reduced-motion`). Casos y Toolkit usan la escena de Proyectos.
- **Nav:** botones Velour (Inicio, Sobre mí, Proyectos, Herramientas); la página actual, hundida y con pelo más claro. Debajo, las seis redes en una columna (`clamp(52px, 8.5vh, 88px)`, íconos en `--white`); el idioma abajo. Sin logo. Cabe entera en 768 px de alto.
- **Móvil:** barra superior compacta con botón de menú; el menú es una hoja de altura completa con los botones y las redes en 3 × 2.
- **Ancho:** el área de contenido es la ventana menos el nav; padding lateral `clamp(16px, 4vw, 96px)`; rejillas `auto-fit`; tipografía escala hasta 2560. `npm run check:layout` revisa los ocho tamaños.

## 5. Componentes: listos o fuera

Un componente se considera terminado solo si cumple todo:

1. Usa solo tokens.
2. Se ve bien a 1440 y a 390. Sin desbordes, sin texto cortado, sin elementos encimados.
3. Funciona con teclado y con dedo. Ninguna instrucción dice "pasa el puntero" en pantallas táctiles.
4. Tiene estado de reposo digno sin WebGL.
5. No muestra contenido espejado, repetido ni de relleno.
6. Se entiende qué es sin leer una explicación.

Si no llega a cumplirlo en la sesión, **se retira del sitio** y se deja la versión simple en losa. Mejor menos piezas bien hechas.

Específicos:

- **Botones:** solo dos tipos. Velour (tipo 1: "Ver proyectos", "Todos los proyectos", nav; la etiqueta brilla al pasar el cursor) y Mohair (tipo 2: todo lo demás; pelo `--moss-200`, etiqueta teñida en el pelo). Ningún tercer estilo.
- **Proyectos destacados (Home):** Bloom, Licorímetro, Candelaria. Losa con la imagen a color; al pasar el cursor la tarjeta entera se vuelve peluche.
- **Proyectos:** una celosía de concreto irregular (sembrada) donde cada proyecto es una parcela; sin caso, tierra con un brote y su estado, sin enlace. Los filtros marchitan en su sitio, nada se mueve.
- **Herramientas (Toolkit):** losetas de pelo de 88 px, todas iguales, en manchas de musgo agrupadas; credenciales en su propio muro.
- **Línea de tiempo:** piedras de tamaños, desplazamientos y giros distintos (≤ 2°); la enredadera pasa por delante de unas, por detrás de otras y agrieta algunas, y toca los nueve hitos en orden (`npm run test:vine`).
- **Ocobo:** a la derecha, a toda la altura, ramas hacia la izquierda, dibujado directo sobre la escena; sin máscara ni marco.

## 6. Textos corregidos

Mini bio de Home (reemplaza la actual; sale del relato aprobado del About):

- ES: "Estudio Diseño en la Universidad de los Andes después de nueve semestres de Ingeniería de Sistemas. Hoy lo que más disfruto es estructurar un producto y construir todo su apartado estético y funcional: identidad, componentes, funcionalidad y sensación."
- EN: "I study Design at Universidad de los Andes after nine semesters of Systems Engineering. Today what I enjoy most is structuring a product and building its whole aesthetic and functional side: identity, components, functionality and feel."

Se borra la frase "Cada línea de código que escribo busca unir la funcionalidad con la expresión creativa": contradice el About ("ya no programo línea por línea").

Todo texto heredado de la versión anterior se revisa contra el relato del About. Lo que lo contradiga se corrige o se borra, y se lista para Julián.

## 7. Casos de estudio: una plantilla

Todos los casos usan el mismo componente y el mismo orden:

1. Encabezado: título y una línea de resumen (sin etiqueta encima, V4 §F).
2. Ficha: rol, fechas, equipo, herramientas (texto, sin íconos hexagonales).
3. Secciones numeradas: problema, proceso, decisiones, resultado.
4. Enlaces (sitio, repositorio) como botones del sitio.
5. Siguiente caso.

El contenido (textos e imágenes del proyecto) se conserva. Cambia el contenedor.

## 8. Cómo se da por terminada una sesión

Build y lint en verde no bastan. Antes de cada commit:

1. Correr `npm run shots` (capturas de cada ruta afectada a 1440×900 y 390×844, primera pantalla y página completa).
2. **Abrir y mirar las capturas.** Revisarlas contra §2 a §5.
3. Corregir lo que falle y repetir.
4. Entregar a Julián las capturas finales y la lista de lo que no se pudo cumplir.

Una sesión que no muestra capturas no está terminada.
