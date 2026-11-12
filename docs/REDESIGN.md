# REDESIGN.md — juligm4.com

Brief único del rediseño. Fuente de verdad para toda sesión de trabajo. Si algo aquí contradice a `CLAUDE.md`, manda este archivo. Ubicación en el repo: `docs/REDESIGN.md`.

## 1. Concepto

"Estructura que algo vivo reclama." Brutalismo de concreto invadido por vegetación (referentes: The Last of Us, Horizon Zero Dawn).

- Concreto = Ingeniería de Sistemas, lo que sostiene.
- Planta = Diseño, lo que crece encima.
- Grieta = el cambio de carrera; por ahí entra lo vivo.

Todo componente debe poder explicarse con una de esas tres palabras. Si no, sobra.

## 2. Paleta (valores de partida, se afinan en Fase 1)

| Token | Hex | Uso |
|---|---|---|
| `--mist` | `#DDF1E9` | Fondo base (medir el valor exacto en Figma) |
| `--concrete-100` | `#D9D6CF` | Superficies claras, losas |
| `--concrete-300` | `#A9A59C` | Bordes, relieves |
| `--concrete-500` | `#6F6C66` | Texto secundario, sombras de losa |
| `--concrete-900` | `#1E1F1D` | Texto principal |
| `--moss-400` | `#4B8A10` | Musgo, CTA primario |
| `--moss-700` | `#2F5D1A` | Musgo en sombra, hover |
| `--bloom` | `#FF3D90` | Único acento (flor de ocobo). Uso escaso |
| `--bloom-deep` | `#FF0066` | Estado activo del acento |

Sin modo claro/oscuro. Eliminar `ThemeProvider` y su toggle.

## 3. Tipografía

- Display: Libre Baskerville. Cuerpo: Roboto Mono. Etiquetas, nav y botones: Space Grotesk.
- Botanical Text (OriginKit) solo para el H1 de cada página. H2 y H3 en Libre Baskerville plano.
- Todo H1 botánico lleva un `<h1>` real en el DOM (visualmente oculto) y fallback de texto plano sin WebGL o con `prefers-reduced-motion`.

## 4. Reglas técnicas (no negociables)

1. **Presupuesto WebGL:** máximo 3 contextos vivos por viewport. Todo componente WebGL se monta al entrar en viewport y se destruye al salir. Un único gestor (`src/webgl/`) lo controla.
2. **Fallback:** cada componente WebGL tiene versión estática (imagen o CSS) para móvil de gama baja, `prefers-reduced-motion` y ausencia de WebGL2.
3. **Texto:** nada hardcodeado. Todo por `translations.js` (en + es).
4. **Bilingüe:** rutas `/es/...` y `/en/...` con `hreflang`. Toggle de idioma en el nav. Ningún contenedor con ancho fijo: el texto en español es más largo.
5. **Accesibilidad:** todo control es `<a>` o `<button>` real, con foco visible. Ningún contenido depende de hover ni de scroll animado para existir en el DOM.
6. **Prerender** por ruta, con `<title>`, descripción y OG propios.
7. **Stack:** se queda en React + Vite + Tailwind, JavaScript. Los componentes OriginKit llegan en TSX: se portan a JSX o se habilita TSX sin typecheck, una sola decisión para todos.
8. **Nunca** inflar habilidades ni atribuir trabajo que Julián no hizo.

## 5. Arquitectura del sitio

Rutas: `/` · `/about` · `/projects` · `/projects/:slug`. La página `/contact` y su formulario se eliminan.

**Shell fijo en todas las rutas**
- Nav vertical a la izquierda (Home, About, Projects + toggle de idioma). Estado activo: píldora en relieve, ancho por contenido.
- Dock inferior centrado: Instagram, LinkedIn, CV, GitHub, Behance y correo (copiar al portapapeles). Losetas de piedra con logo grabado; al hover crece musgo.
- Fondo: una capa fija por ruta, paisaje brutalista invadido, con el desenfoque horneado en el archivo (no `filter: blur`). Al cambiar de ruta: enfoca un instante y vuelve a desenfocar.

**Home**
1. Hero: busto de Zeus en mármol, partido por una grieta vertical, con ramas de laurel que salen de la grieta. Modelo 3D real (R3F). El busto gira pocos grados según la posición horizontal del puntero; las hojas se doblan cerca del puntero; los textos "Julián Galindo" y "Diseñador y Desarrollador" viven en la misma cámara y se inclinan con ella.
2. Mini bio (se conserva el hilo actual).
3. Destacados: **Herbario** (ver §6).

**About**
- Relato desarrollado, en la voz de Julián.
- Línea de tiempo: enredadera que sube por una estructura brutalista con el scroll; cada hito es un brote. El contenido existe en el DOM sin animación.
- Escena de ocobo (adaptación de Moonlit Petals, de día) como cierre.
- Fila discreta de credenciales al final. Sin "futuras certificaciones".

**Projects**
- Cuatro grupos: **Web**, **Digital**, **Objeto**, **Marca**.
- Web: Flipping Website Screenshot Deck (21st.dev). Tarjetas: Candelaria Website, proyecto freelance en curso, este portafolio, adidas × Milo J.
- Digital: Licorímetro, Bloom.
- Objeto: El Umbral, SenseWave. Vista previa en pedestal de concreto con vista explotada al hover.
- Marca: Candelaria.
- Bloque "Herramientas": Citron Keyscape con teclas de concreto, una tecnología por tecla, logo de Julián en la tecla central. Única instancia en todo el sitio.

**Casos de estudio (regla híbrida)**
- Fijo: nav, dock, retícula, tipografía de cuerpo, estructura del caso.
- Propio: paleta por ruta (variables CSS), imágenes y, solo en proyectos de marca, tipografía display propia.
- Entrada: una grieta se abre e inunda el color del proyecto.

## 6. Destacados: Herbario

Cada proyecto es un espécimen prensado sobre una losa de concreto, con etiqueta taxonómica: género = disciplina, especie = proyecto, más año y rol. Todos visibles a la vez en una retícula, sin scroll obligatorio para ver el conjunto. Al hover o foco de teclado, crece pasto alrededor de la losa activa.

El pasto usa el mismo motor de pelo que el dock (PlushTile). Un solo canvas compartido para ambos.

## 7. Botones

- Primario (máximo 1 o 2 por pantalla): Velour Bolster recoloreado como cojín de musgo.
- Secundario, nav, filtros: losa de concreto en CSS, sin WebGL.
- Angora Badge: no se usa como botón general.

## 8. Datos corregidos (reemplazan lo que hoy dice el sitio)

**Educación**
- Ingeniería de Sistemas y Computación, Universidad de los Andes: 2021-1 a 2025-1 (9 semestres).
- Diseño, Universidad de los Andes: desde 2025-2. Grado previsto: 2028.
- Opción en Computación Visual: terminada.
- Bachillerato: Cambridge International School, 2015–2020.

Encuadre: el cambio se cuenta, no se esconde. La ingeniería es la base sobre la que hoy diseña y construye.

**Experiencia**
- Outlier — Latam CoderAI Trainer. Jun 2025 – presente.
- Bloom / BeBloomers — freelance: investigación UX, arquitectura de información, wireframing. 2025.
- Universidad de los Andes — monitor. *(fechas y curso: por completar)*
- Candelaria — semillero de investigación: marca y sitio web. 2025–2026. Rotulado como semillero.

Licorímetro sale de experiencia: es proyecto académico.

**Habilidades y certificaciones**
- Las habilidades se muestran por proyecto y en el bloque "Herramientas". Se elimina la sección de íconos del About.
- Certificaciones: 8 badges (IBM, Cisco) en una fila al final del About y en el CV.

## 9. Limpieza pendiente

- Sacar `src/assets/fonts/HelveticaNow/` del repo público (fuente comercial de Monotype) y sustituirla en Candelaria.
- Borrar copy muerto: `home.featuredItems`, `about.certUpcoming*`, `about.focus*` si queda sin uso.
- Confirmar los términos de OriginKit antes de subir su código a un repo público. Si no lo permiten: repo privado o carpeta fuera de git.

## 10. Componentes externos

| Componente | Origen | Destino |
|---|---|---|
| Botanical Text | OriginKit | H1 por página |
| Velour Bolster | OriginKit | CTA primario |
| Plush Tile | OriginKit | Musgo del dock y pasto del Herbario |
| Moonlit Petals | OriginKit | Ocobo en About |
| Citron Keyscape | OriginKit | Bloque Herramientas |
| Flipping Website Screenshot Deck | 21st.dev | Grupo Web |
| Angora Badge | OriginKit | En reserva |

Los archivos fuente originales van en `vendor/originkit/` sin modificar. Las adaptaciones viven en `src/components/`.

## 11. Fases

0. Rama, limpieza, datos corregidos.
1. Dirección de arte: paleta final, tokens, fondos, frames en Figma.
2. Cimientos: tokens, shell, fondo, gestor WebGL, rutas i18n, prerender.
3. Porte de componentes en `/lab`, uno por uno.
4. Hero 3D: malla y luego integración.
5. Home.
6. About.
7. Projects.
8. Casos de estudio.
9. QA y despliegue.

Cada fase termina con `npm run build` y `npm run lint` en verde y un commit propio.
