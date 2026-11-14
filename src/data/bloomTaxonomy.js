/**
 * Bloom's content taxonomy, as delivered: three versions of the same five
 * categories. Tags stay in Spanish on purpose — they are the client's working
 * vocabulary, not portfolio copy, so translating them would misrepresent the
 * artefact. Category names are translated through `bloom.categories`, in this
 * same order.
 */

export const CATEGORY_KEYS = ['cuerpo', 'mente', 'relaciones', 'sexo', 'cultura']

// Category markers, in site tokens (ACABADO §2).
export const CATEGORY_COLORS = {
  cuerpo: 'var(--concrete-300)',
  mente: 'var(--concrete-900)',
  relaciones: 'var(--moss-400)',
  sexo: 'var(--concrete-500)',
  cultura: 'var(--moss-700)',
}

export const VERSIONS = [
  {
    key: 'v1',
    count: 75,
    tags: {
      cuerpo: [
        'ciclo menstrual', 'higiene menstrual', 'dolores menstruales', 'flujos vaginales', 'vulva',
        'clítoris', 'suelo pélvico', 'anticonceptivos hormonales', 'anticonceptivos no hormonales',
        'anticoncepción masculina', 'embarazo', 'pruebas embarazo', 'síntomas embarazo',
        'alimentación embarazo', 'parto', 'postparto', 'lactancia', 'ovulación',
        'reproducción asistida', 'infertilidad', 'menopausia', 'endometriosis',
        'ovarios poliquísticos', 'cáncer de mama', 'ITS', 'hormonas', 'nutrición', 'deporte',
        'cuidado de piel', 'cuidados íntimos', 'sexo en menopausia', 'ginecólogo', 'ser madre',
      ],
      mente: [
        'ansiedad', 'estrés', 'autoestima', 'autoconocimiento', 'salud mental', 'depresión', 'TCA',
        'terapia', 'gestión emocional', 'imagen corporal', 'dolores menstruales', 'red flags',
        'soltera no sola', 'gestión emocional en pareja',
      ],
      relaciones: [
        'familia', 'amigas', 'no sola', 'soltera no sola', 'crianza', 'educar hijos', 'ser madre',
        'nuevas masculinidades', 'relaciones abiertas', 'relaciones tóxicas', 'red flags',
        'gestión emocional con amigos',
      ],
      sexo: [
        'sexo en menopausia', 'sexualidad', 'prácticas sexuales', 'masturbación', 'deseo sexual',
        'orgasmo', 'educación sexual', 'LGTBIQ+', 'problemas en el sexo',
      ],
      cultura: [
        'activismo', 'referentes feministas', 'entretenimiento', 'podcast', 'teen', 'ginecólogo',
        'LGTBIQ+',
      ],
    },
  },
  {
    key: 'v2',
    count: 46,
    tags: {
      cuerpo: [
        'ciclo menstrual', 'menstruación', 'anticonceptivos', 'embarazo', 'fertilidad', 'menopausia',
        'endometriosis', 'ovarios poliquísticos', 'ITS', 'hormonas', 'suelo pélvico', 'anatomía',
        'nutrición', 'cuidado personal', 'parto', 'postparto', 'lactancia', 'imagen corporal',
        'deseo sexual', 'maternidad', 'ginecólogo',
      ],
      mente: [
        'ansiedad', 'estrés', 'autoestima', 'autoconocimiento', 'salud mental', 'depresión', 'TCA',
        'terapia', 'gestión emocional', 'imagen corporal', 'hormonas', 'red flags', 'postparto',
        'gestión emocional en pareja',
      ],
      relaciones: [
        'pareja', 'familia', 'amigas', 'maternidad', 'crianza', 'relaciones tóxicas', 'LGTBIQ+',
        'comunidad', 'nuevas masculinidades', 'red flags', 'postparto', 'gestión emocional',
      ],
      sexo: [
        'sexualidad', 'deseo sexual', 'placer', 'masturbación', 'educación sexual',
        'prácticas sexuales', 'orgasmo', 'hormonas', 'LGTBIQ+', 'identidad',
      ],
      cultura: [
        'feminismo', 'activismo', 'referentes', 'entretenimiento', 'teen', 'ginecólogo', 'podcast',
        'recomendaciones', 'LGTBIQ+', 'identidad',
      ],
    },
  },
  {
    key: 'v3',
    count: 28,
    recommended: true,
    tags: {
      cuerpo: [
        'menstruación', 'anticonceptivos', 'embarazo', 'fertilidad', 'menopausia', 'endometriosis',
        'ITS', 'cuidado personal', 'hormonas', 'maternidad', 'deseo sexual', 'ginecología',
      ],
      mente: [
        'ansiedad', 'autoestima', 'salud mental', 'depresión', 'autoconocimiento', 'hormonas',
        'gestión emocional',
      ],
      relaciones: [
        'pareja', 'familia', 'maternidad', 'comunidad', 'relaciones tóxicas', 'gestión emocional',
        'LGTBIQ+',
      ],
      sexo: ['sexualidad', 'deseo sexual', 'educación sexual', 'LGTBIQ+', 'hormonas'],
      cultura: ['feminismo', 'teen', 'entretenimiento', 'ginecología', 'LGTBIQ+'],
    },
  },
]

/** Tag → the categories it appears in, for one version. */
export function membership(version) {
  const map = new Map()
  for (const cat of CATEGORY_KEYS) {
    for (const tag of version.tags[cat]) {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag).push(cat)
    }
  }
  return map
}

/** The worked example from the specification: three pieces, two bridges. */
export const CASES = [
  {
    category: 'cuerpo',
    title: 'Menopausia, hormonas y bienestar emocional',
    tags: ['menopausia', 'hormonas', 'deseo sexual', 'cuidado personal'],
  },
  {
    category: 'mente',
    title: 'Ansiedad y gestión emocional: cómo empezar',
    tags: ['ansiedad', 'hormonas', 'gestión emocional', 'autoestima'],
  },
  {
    category: 'relaciones',
    title: 'Maternidad y pareja: no perderse en el camino',
    tags: ['maternidad', 'pareja', 'gestión emocional', 'familia'],
  },
]
