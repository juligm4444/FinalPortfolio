# ACABADO.md — reglas de acabado de juligm4.com

Va en `docs/ACABADO.md`. Complementa a `docs/REDESIGN.md`. Si se contradicen, **manda este archivo**: corrige decisiones de REDESIGN que produjeron mezcla con la versión vieja.

## 0. Qué cambia respecto a REDESIGN.md

1. **Se anula la "regla híbrida" de casos de estudio** (REDESIGN §5). Los casos usan la paleta y tipografía del sitio. Sin paleta por proyecto, sin tipografía display por proyecto. La identidad de cada proyecto aparece solo dentro de sus imágenes.
2. **Se anula "mini bio: se conserva el hilo actual"**. La mini bio se reescribe (texto en §6).
3. **Nada de la versión anterior sobrevive por defecto.** Si un componente, texto, color o imagen viene de antes del rediseño, se rehace o se borra.

## 1. Narrativa: una sola idea

"Estructura que algo vivo reclama." Concreto = lo que sostiene (ingeniería). Planta = lo que crece (diseño). Grieta = el cambio.

Prueba para cada elemento visible: ¿es concreto, planta o grieta? Si no es ninguno, sobra.

Prohibido en todo el sitio: personajes 3D tipo caricatura, vidrio esmerilado, neón, degradados morados, íconos hexagonales, teclas negras o rosadas, cualquier insignia de terceros ("Built with …").

## 2. Paleta: solo tokens

- Único origen de color: las variables de `src/styles/index.css` (`--mist`, `--concrete-*`, `--moss-*`, `--bloom*`).
- **Cero hex fuera de ese archivo.** Excepción única: datos dentro de un canvas WebGL que lean los tokens al iniciar.
- Se eliminan los alias heredados de Tailwind (`black`, `pink`, `gray`, `white`) y las variables `--fg`, `--fg-soft`, `--fg-muted`.
- `--bloom` es acento escaso: como máximo un elemento rosa por pantalla visible. Nunca como relleno de bloques grandes ni como color dominante de un título.
- Imágenes de proyecto: se muestran sobre losa `--concrete-100`, nunca a sangre con su propio fondo de color.

## 3. Texto siempre legible

- Todo texto que pise el fondo fotográfico va sobre **losa** (`--concrete-100`) o **velo** (`--veil`). Nunca directo sobre la foto.
- Tamaños mínimos: cuerpo 16 px, texto secundario 14 px, etiquetas 12 px. Nada por debajo.
- Ancho de línea del cuerpo: entre 45 y 75 caracteres.
- Contraste AA verificado por cálculo, no a ojo.
- H1 con Botanical Text: debe leerse a 390 px de un vistazo. Follaje verde (`--moss-*`) domina; flores rosa no pasan del 15 % de las partículas. Si no se lee, se usa el H1 de texto plano. El mismo tratamiento en las tres páginas, incluida Home.

## 4. Shell

- **Dock:** nunca tapa contenido. Lleva detrás un degradado a `--mist` de borde a borde y el contenido termina antes. En móvil ocupa una sola fila compacta.
- **Nav móvil:** barra con fondo sólido de velo. El contenido no se ve pasar por debajo de las letras.
- **Fondo:** la foto vive en la primera pantalla y en los márgenes. Las secciones de contenido tienen su propia superficie.
- **Logo:** una sola tinta, `--concrete-900`. Sin hexágono rosa.

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

- **Herbario:** seis especímenes. Todas las imágenes con el mismo tratamiento (mismo encuadre, mismo fondo de losa, mismo margen). Etiqueta taxonómica: `Gen.` disciplina, especie = proyecto, año y rol.
- **Deck de sitios:** mínimo cuatro tarjetas. Ninguna cara se ve al revés ni espejada. Si no hay captura de un sitio en curso, lleva una tarjeta de losa diseñada con el nombre y "en curso".
- **Keyscape:** teclas de concreto (`--concrete-100/300/500`). Una tecnología por tecla, sin repetidas. Solo la tecla central lleva acento.
- **Objetos:** las dos piezas con el mismo tipo de imagen (recorte sobre losa) y el mismo pedestal.
- **Línea de tiempo:** cada hito es una losa. La enredadera se ve con claridad y une los hitos.
- **Ocobo:** se funde con el fondo, sin borde rectangular duro.

## 6. Textos corregidos

Mini bio de Home (reemplaza la actual; sale del relato aprobado del About):

- ES: "Estudio Diseño en la Universidad de los Andes después de nueve semestres de Ingeniería de Sistemas. Hoy lo que más disfruto es estructurar un producto y construir todo su apartado estético y funcional: identidad, componentes, funcionalidad y sensación."
- EN: "I study Design at Universidad de los Andes after nine semesters of Systems Engineering. Today what I enjoy most is structuring a product and building its whole aesthetic and functional side: identity, components, functionality and feel."

Se borra la frase "Cada línea de código que escribo busca unir la funcionalidad con la expresión creativa": contradice el About ("ya no programo línea por línea").

Todo texto heredado de la versión anterior se revisa contra el relato del About. Lo que lo contradiga se corrige o se borra, y se lista para Julián.

## 7. Casos de estudio: una plantilla

Todos los casos usan el mismo componente y el mismo orden:

1. Encabezado: etiqueta, título, una línea de resumen.
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
