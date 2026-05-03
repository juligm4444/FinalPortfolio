export const LOCALES = ['en', 'es']

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
      cv: 'Cv',
      lang: 'EN',
      themeLight: 'Light theme',
      themeDark: 'Dark theme',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    hero: {
      first: 'julián',
      middle: 'galindo',
      last: 'mora',
      tagline: 'Designer & Developer ',
      profileAlt: 'Julián Galindo Mora',
    },
    home: {
      bioTitle: 'About me',
      bioPara1:
        'Julián Galindo is a designer and developer of digital experiences that flow from structure to aesthetics, blending backend logic with the intuition of human-centered design.',
      bioPara2:
        'Every line of code I write aims to unite functionality with creative expression.',
      bioPill1: 'Structure',
      bioPill2: 'Aesthetics',
      bioPill3: 'Human-centered',
      featuredKicker: 'Selected work',
      featuredTitle: 'Featured projects',
      featuredCta: 'See all projects',
      followKicker: 'Stay connected',
      followTitle: 'Follow me on social',
      followLead: 'Process, work-in-progress and quieter notes — wherever you hang out.',
      featuredItems: [
        {
          title: 'Licorímetro',
          description: 'A social mobile app for discovering and reviewing alcoholic beverages with OCR recognition.',
          tag: 'Mobile · OCR',
        },
        {
          title: 'Web Portfolio',
          description: 'Personal portfolio with React, Tailwind and 3D — accessible and responsive.',
          tag: 'Frontend · Design',
        },
        {
          title: 'Atelier OS',
          description: 'Design system and frontend for a creative studio.',
          tag: 'Design System',
        },
        {
          title: 'Hidden Routes',
          description: 'Bilingual editorial platform with custom CMS.',
          tag: 'Full-stack · Editorial',
        },
      ],
    },
    about: {
      title: 'About',
      lead:
        'I design and build interfaces that feel intentional. I move between the editorial calm of typography and the energy of motion, between the rigor of backend logic and the warmth of brand.',

      infoKicker: 'Information',
      infoTitle: 'A designer who codes — a developer who designs',
      infoPara1:
        'I’m Julián Galindo, a Design student at Universidad de los Andes, focused on video games, interfaces and digital experiences. I’m graduating in 2028, and I enjoy anything that involves creating, exploring and understanding how people interact with what they use.',
      infoPara2:
        'I like observing, questioning and analyzing why something works the way it does. I think in systems — how things connect, and how good design can make an experience clearer, more pleasant and more human. I’m a mix of the technical and the sensitive: structure and aesthetics, logic and emotion.',
      infoPara3:
        'Films, video games and music shape the way I see design — as a way to tell something, build atmospheres and create moments that feel genuine.',
      infoMediaCaption: 'Snapshot · 2025',

      educationKicker: 'Education',
      educationTitle: 'Where I learned to think in systems',
      educationItems: [
        {
          period: '2021 — 2028',
          title: 'Bachelor’s in Design',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'Undergraduate thesis · Minor in Visual Computation, built on engineering coursework.',
        },
        {
          period: '2021 — 2023',
          title: 'Systems & Computer Engineering — coursework',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'Foundations in algorithms, data structures, software architecture, and mobile + web development. Transitioned to Design; credits applied toward the Minor in Visual Computation.',
        },
        {
          period: '2015 — 2020',
          title: 'High School Diploma',
          subtitle: 'Cambridge International School · La Calera',
          detail: 'IB Programme · Best Graduate, Class of 2020.',
        },
      ],
      educationMediaCaption: 'Universidad de los Andes',

      experienceKicker: 'Experience',
      experienceTitle: 'Where I’ve been building',
      experienceItems: [
        {
          period: 'Jun 2025 — Present',
          role: 'Latam CoderAI Trainer (LLM & code review)',
          company: 'Outlier',
          bullets: [
            'Reviewing and correcting AI-generated code responses to improve training data.',
            'Building 2D/3D animations and scenes with Python and JavaScript (Pygame, p5.js, WebGL).',
            'Crafting and refining prompts for user-defined functional requirements.',
          ],
        },
        {
          period: 'Jan 2023 — May 2023',
          role: 'Design & Mobile Developer · Licorímetro',
          company: 'University Project',
          bullets: [
            'Engineered a mobile app for alcoholic beverage recognition using OCR.',
            'Designed UI in Figma and architected an OOP solution to accelerate development.',
            'Launched a beta in Android Studio with Firebase and third-party APIs.',
          ],
        },
      ],

      focusKicker: 'Focus',
      focusTitle: 'Game-inspired interfaces, structurally solid',
      focusPara1:
        'I specialize in crafting intuitive, game-inspired interfaces with modern frontend technologies like React. My background in systems engineering and mobile development lets me build experiences that are visually engaging and structurally solid.',
      focusPara2:
        'I’m passionate about blending creativity with logic — from playful prototypes in Figma to dynamic functionality with backend tools. Always learning, I thrive at the intersection of design and code, building digital experiences that connect with people.',
      focusMediaCaption: 'Selected motion frame',

      stackKicker: 'Skills',
      stackTitle: 'Tech Stack',
      filters: {
        all: 'All',
        design: 'Design',
        development: 'Development',
        tools: 'Tools',
      },

      certKicker: 'Credentials',
      certTitle: 'Certifications & badges',
      certLead:
        'A growing collection of digital badges and professional certificates. New ones from Google, Adobe and Epic Games on the way.',
      certVerify: 'Verify',
      certUpcoming: 'Coming soon',
      certUpcomingLabel: 'In progress',
      certUpcomingItems: [
        { title: 'Google UX Design', issuer: 'Google · Coursera' },
        { title: 'Adobe Certified Professional', issuer: 'Adobe · Coursera' },
        { title: 'Unreal Engine Fundamentals', issuer: 'Epic Games · Coursera' },
        { title: 'Scrum Master Certification', issuer: 'Scrum.org' },
      ],
    },
    projects: {
      title: 'Projects',
      lead:
        'A selection of recent work — design, frontend and 3D experiences.',
      placeholder: 'Case study coming soon.',
      caseStudy: 'Student Research Group · Academic project →',
      visitSite: 'Visit website',
      viewCode: 'GitHub repository',
    },
    candelaria: {
      tag: 'Student Research Group · Academic project',
      title: 'Candelaria Website',
      subtitle:
        'Designing, building and shipping the full digital presence of a high-performance university competition team.',
      role: 'Product Engineering · UX/UI Design · Full-stack',
      period: '2025 – 2026',
      status: 'In development',
      sectionRoleLabel: 'Role',
      sectionTimelineLabel: 'Timeline & Status',

      summaryKicker: 'Overview',
      summaryTitle: 'A team’s digital home — not a portfolio',
      summaryParas: [
        'Candelaria is the <<complete digital presence>> of a university engineering competition team. The site goes beyond a static portfolio: it integrates <<member management>>, publications, memberships, donations, a <<merchandise shop>> and a <<gamification system>> for followers — all under a kinetic, high-contrast visual identity.',
        'The project was born out of the need to <<centralize the team’s communications>>, make external support easy, and offer a user experience that matches the team’s technical level. From database architecture to color palette, every decision was made with <<product and engineering criteria>>.',
      ],

      myRoleKicker: 'My role inside Candelaria',
      myRoleParas: [
        'Candelaria is an interdisciplinary research seedbed focused on developing a solar-powered vehicle — combining technological innovation, sustainability and design applied to mobility.',
        'I lead the design team — coordinating five people and steering the visual, conceptual and UX direction across deliverables. I plan and supervise design tasks, build interfaces and digital prototypes, support the visualization of technical information, and craft communication and brand materials around the vehicle and its systems.',
        'I take part in weekly tracking meetings, strategic planning and interdisciplinary alignment with other areas of the seedbed — making sure technical goals, user experience and project presentation stay coherent. My hybrid profile across design, UX/UI and frontend lets me act as a bridge between the technical components and the way technology is communicated, understood and used by different stakeholders.',
      ],

      problemKicker: 'Problem',
      problemTitle: 'Beyond a PDF and a donations link',
      problemLead:
        'University competition teams usually settle for <<partial solutions>>: an Instagram account, a PDF with their achievements, and a generic donations link. Candelaria needed <<something different>>.',
      problemBullets: [
        'A platform that reflects the team’s technical and visual identity.',
        'A system that lets external supporters back the team financially with real traceability.',
        'An internal panel where leaders can manage members, publications and roles without touching code.',
        'Support for two payment markets: international (Stripe) and Colombia (PayU).',
        'A long-term incentive to keep followers involved: gamification.',
      ],

      processKicker: 'Process',
      processTitle: 'Development process',
      processSteps: [
        {
          n: '01',
          title: 'Research & Design System',
          intro:
            "Definition of the 'Neon Velocity' visual system in Figma: typography, color palette, components and grids. 6 final screens (Home, Vehicle, Team, Publications, Support, About) with a mobile-first approach and cinematic vertical scroll.",
          bullets: [
            "Defined the 'Neon Velocity' design system in Figma.",
            'Designed 6 final screens with a mobile-first, cinematic-scrolling approach.',
            'Built the design system in Tailwind CSS 4 and Class Variance Authority (CVA).',
            'Component variants and layout rhythm across all main views.',
          ],
        },
        {
          n: '02',
          title: 'Architecture & Backend',
          intro:
            'Data model in PostgreSQL with Django 4.2 and Django REST Framework: 13+ models covering teams, members, publications, payments and tiers. Dual auth with djangorestframework-simplejwt for internal and external users.',
          bullets: [
            '13+ model schema in PostgreSQL with Django 4.2 and DRF.',
            'Dual auth: internal team users and external followers via JWT.',
            'Secure whitelist for leadership role assignment with manual approval and audit logging.',
            'Supabase integration for profile sync, media storage and PL/pgSQL gamification.',
          ],
        },
        {
          n: '03',
          title: 'Frontend & Integrations',
          intro:
            'SPA in React 19 with React Router DOM 7 and Vite 7. Full Spanish/English localization with i18next. Cart and checkout with Stripe and PayU, including HMAC-SHA256 webhook verification.',
          bullets: [
            'SPA in React 19 with React Router DOM 7 and Vite 7.',
            'Full Spanish/English localization with i18next.',
            'Cart and checkout flow with Stripe (international) and PayU (Colombia).',
            'HMAC-SHA256 webhook verification and real-time follower tier calculation.',
          ],
        },
        {
          n: '04',
          title: 'Performance & Deployment',
          intro:
            'Query optimization with select_related(), prefetch_related() and .only() in the Django ORM. Image compression with vite-plugin-imagemin and media via Supabase Storage. Monolithic deployment on Vercel: frontend at / and Django backend at /api/*.',
          bullets: [
            'Query optimization with select_related(), prefetch_related() and .only().',
            'Image compression with vite-plugin-imagemin.',
            'Media served via Supabase Storage.',
            'Monolithic deployment on Vercel: frontend at /, backend at /api/*.',
          ],
        },
      ],

      featuresKicker: 'Features',
      featuresTitle: 'What’s inside the platform',
      features: [
        {
          title: 'Auth & user management',
          body:
            'Dual profile system: internal users (team members) with whitelist and leadership roles, and external users (followers and buyers). Full registration, login, password recovery and profile management.',
        },
        {
          title: 'E-commerce & payments',
          body:
            'Merchandise shop (hoodie, cap, bottle), 3-tier memberships ($5 / $10 / $25 USD), open donations in COP/USD. Persistent cart, checkout with Stripe (international) and PayU (Colombia), per-user purchase history.',
        },
        {
          title: 'Gamification — follower tiers',
          body:
            'Score = total donated (COP) + months of membership × 5,000 COP. Computed in PL/pgSQL on Supabase and exposed via REST API.',
        },
        {
          title: 'Internal panel',
          body:
            'Members-only panel: member management, role assignment, publication of articles with PDFs, leader whitelist administration and transaction review.',
        },
        {
          title: 'Multilingual support',
          body:
            'Full Spanish and English support via i18next. All backend models store fields in both languages (_en / _es) and the API responds based on the language parameter.',
        },
      ],

      tiersKicker: 'Follower tiers',
      tiersTitle: 'Score model',
      tiersHeader: ['Tier', 'Minimum score'],
      tiers: [
        ['Visitor', '0'],
        ['Supporter', '1+ COP'],
        ['Bronze', '20.000 COP'],
        ['Silver', '60.000 COP'],
        ['Gold', '150.000 COP'],
        ['Core', '300.000 COP'],
      ],

      perfKicker: 'Performance',
      perfTitle: 'Performance results',
      perfHeader: ['Metric', 'Before', 'After', 'Improvement'],
      perfRows: [
        ['Publications list load', '2.5 s', '0.8 s', '68% faster'],
        ['Team page load', '1.8 s', '0.5 s', '72% faster'],
        ['Members API queries', '50', '8', '84% fewer queries'],
        ['Publications API queries', '40', '10', '75% fewer queries'],
      ],

      securityKicker: 'Security',
      securityTitle: 'Security posture',
      securityBullets: [
        'bcrypt hashing (12 rounds).',
        'Rate limiting on auth endpoints (10 req/min) and brute-force protection (8 attempts / 15 min).',
        'Webhook verification with HMAC-SHA256 and 5-minute timestamp tolerance.',
        'Idempotent payment processing to prevent double counting.',
        'Audit logging for every admin action.',
        'Security middleware: CSRF, configured CORS, security headers.',
      ],

      reflectionsKicker: 'Reflections',
      reflectionsTitle: 'What I learned',
      reflectionsParas: [
        'Candelaria is the project that forced me to think like a <<product engineer>>, not just a developer. Architectural decisions — when to use Django vs Supabase, how to model the tier system, how to abstract two payment providers — required reasoning about <<real trade-offs>>, not just shipping features.',
        'The biggest lesson was designing for <<two completely different audiences>>: an external follower who wants to support with one click, and a team leader who needs to manage people and publish content. Building a single platform that serves both — without either feeling the interface wasn’t made for them — was the most interesting design challenge of the project.',
      ],

      stackKicker: 'Tools used',
      stackTitle: 'Built solo with',
      stackHint: 'Hover the badges',

      ctaVisit: 'Visit the website',
      ctaCode: 'View on GitHub',
    },
    contact: {
      title: 'Contact',
      lead: 'Let’s build something that lasts. I read every message.',
      cta: 'julian_gm4@hotmail.com',
    },
    footer: {
      copyright: '© 2026 juligm4.com. All rights reserved.',
      backToTop: 'Back to top',
      navTitle: 'Navigate',
    },
  },

  es: {
    nav: {
      home: 'Inicio',
      about: 'Sobre mí',
      projects: 'Proyectos',
      contact: 'Contacto',
      cv: 'Cv',
      lang: 'ES',
      themeLight: 'Tema claro',
      themeDark: 'Tema oscuro',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
    },
    hero: {
      first: 'julián',
      middle: 'galindo',
      last: 'mora',
      tagline: 'Diseñador & Desarrollador ',
      profileAlt: 'Julián Galindo Mora',
    },
    home: {
      bioTitle: 'Sobre mí',
      bioPara1:
        'Julián Galindo es diseñador y desarrollador de experiencias digitales que fluyen de la estructura a la estética, mezclando la lógica del backend con la intuición del diseño centrado en la persona.',
      bioPara2:
        'Cada línea de código que escribo busca unir la funcionalidad con la expresión creativa.',
      bioPill1: 'Estructura',
      bioPill2: 'Estética',
      bioPill3: 'Centrado en la persona',
      featuredKicker: 'Trabajo seleccionado',
      featuredTitle: 'Proyectos destacados',
      featuredCta: 'Ver todos los proyectos',
      followKicker: 'Sigamos en contacto',
      followTitle: 'Sígueme en redes sociales',
      followLead: 'Proceso, work-in-progress y notas más íntimas — donde tú prefieras.',
      featuredItems: [
        {
          title: 'Licorímetro',
          description: 'App social móvil para descubrir y reseñar bebidas alcohólicas con reconocimiento por OCR.',
          tag: 'Mobile · OCR',
        },
        {
          title: 'Portafolio Web',
          description: 'Portafolio personal con React, Tailwind y 3D — accesible y responsivo.',
          tag: 'Frontend · Diseño',
        },
        {
          title: 'Atelier OS',
          description: 'Sistema de diseño y frontend para un estudio creativo.',
          tag: 'Sistema de diseño',
        },
        {
          title: 'Hidden Routes',
          description: 'Plataforma editorial bilingüe con CMS a medida.',
          tag: 'Full-stack · Editorial',
        },
      ],
    },
    about: {
      title: 'Sobre mí',
      lead:
        'Diseño y construyo interfaces con intención. Me muevo entre la calma editorial de la tipografía y la energía del movimiento, entre el rigor del backend y la calidez del branding.',

      infoKicker: 'Información',
      infoTitle: 'Diseñador que programa — desarrollador que diseña',
      infoPara1:
        'Soy Julián Galindo, estudiante de Diseño en la Universidad de los Andes, enfocado en videojuegos, interfaces y experiencias digitales. Me gradúo en 2028 y disfruto cualquier cosa que implique crear, explorar y entender cómo la gente interactúa con lo que usa.',
      infoPara2:
        'Me gusta observar, cuestionar y analizar por qué algo funciona como funciona. Pienso en sistemas — cómo las cosas se conectan y cómo un buen diseño puede hacer una experiencia más clara, agradable y humana. Soy una mezcla de lo técnico y lo sensible: estructura y estética, lógica y emoción.',
      infoPara3:
        'Las películas, los videojuegos y la música moldean cómo veo el diseño — como una forma de contar algo, construir atmósferas y crear momentos que se sientan genuinos.',
      infoMediaCaption: 'Snapshot · 2025',

      educationKicker: 'Educación',
      educationTitle: 'Donde aprendí a pensar en sistemas',
      educationItems: [
        {
          period: '2021 — 2028',
          title: 'Pregrado en Diseño',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'Tesis de pregrado · Opción en Computación Visual, construida sobre los créditos de Ingeniería de Sistemas.',
        },
        {
          period: '2021 — 2023',
          title: 'Ingeniería de Sistemas y Computación — formación',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'Bases en algoritmos, estructuras de datos, arquitectura de software y desarrollo móvil y web. Tras esos semestres me cambié a Diseño; los créditos se aplicaron a la Opción en Computación Visual.',
        },
        {
          period: '2015 — 2020',
          title: 'Bachillerato',
          subtitle: 'Cambridge International School · La Calera',
          detail: 'Programa IB · Mejor egresado, generación 2020.',
        },
      ],
      educationMediaCaption: 'Universidad de los Andes',

      experienceKicker: 'Experiencia',
      experienceTitle: 'Dónde he construido',
      experienceItems: [
        {
          period: 'Jun 2025 — Presente',
          role: 'Latam CoderAI Trainer (LLM & code review)',
          company: 'Outlier',
          bullets: [
            'Reviso y corrijo respuestas de código generadas por IA para mejorar los datos de entrenamiento.',
            'Construyo animaciones y escenas 2D/3D con Python y JavaScript (Pygame, p5.js, WebGL).',
            'Diseño y refino prompts a partir de requerimientos funcionales del usuario.',
          ],
        },
        {
          period: 'Ene 2023 — May 2023',
          role: 'Diseño & Desarrollo Móvil · Licorímetro',
          company: 'Proyecto Universitario',
          bullets: [
            'Construí una app móvil para reconocer bebidas alcohólicas con OCR.',
            'Diseñé la UI en Figma y arquitecté una solución OOP para acelerar el desarrollo.',
            'Lancé una beta en Android Studio con Firebase y APIs de terceros.',
          ],
        },
      ],

      focusKicker: 'Enfoque',
      focusTitle: 'Interfaces inspiradas en videojuegos, sólidas en estructura',
      focusPara1:
        'Me especializo en construir interfaces intuitivas e inspiradas en videojuegos con tecnologías frontend modernas como React. Mi base en ingeniería de sistemas y desarrollo móvil me permite construir experiencias visualmente atractivas y estructuralmente sólidas.',
      focusPara2:
        'Me apasiona mezclar creatividad y lógica — desde prototipos divertidos en Figma hasta funcionalidad dinámica con herramientas de backend. Siempre aprendiendo, vivo en la intersección entre diseño y código, construyendo experiencias digitales que conectan con la gente.',
      focusMediaCaption: 'Frame de motion seleccionado',

      stackKicker: 'Habilidades',
      stackTitle: 'Tech Stack',
      filters: {
        all: 'Todo',
        design: 'Diseño',
        development: 'Desarrollo',
        tools: 'Herramientas',
      },

      certKicker: 'Credenciales',
      certTitle: 'Certificaciones y badges',
      certLead:
        'Una colección creciente de badges digitales y certificados profesionales. En camino: Google, Adobe y Epic Games.',
      certVerify: 'Verificar',
      certUpcoming: 'Próximamente',
      certUpcomingLabel: 'En curso',
      certUpcomingItems: [
        { title: 'Google UX Design', issuer: 'Google · Coursera' },
        { title: 'Adobe Certified Professional', issuer: 'Adobe · Coursera' },
        { title: 'Unreal Engine Fundamentals', issuer: 'Epic Games · Coursera' },
        { title: 'Certificación Scrum Master', issuer: 'Scrum.org' },
      ],
    },
    projects: {
      title: 'Proyectos',
      lead:
        'Una selección de trabajos recientes — diseño, frontend y experiencias 3D.',
      placeholder: 'Caso de estudio próximamente.',
      caseStudy: 'Semillero · Proyecto Académico →',
      visitSite: 'Visitar el sitio',
      viewCode: 'Repositorio GitHub',
    },
    candelaria: {
      tag: 'Semillero · Proyecto Académico',
      title: 'Candelaria Website',
      subtitle:
        'Diseñar, construir y desplegar la presencia digital completa de un equipo universitario de competición de alto rendimiento.',
      role: 'Ingeniería de Producto · Diseño UX/UI · Full-stack',
      period: '2025 – 2026',
      status: 'En desarrollo',
      sectionRoleLabel: 'Rol',
      sectionTimelineLabel: 'Cronología y Estado',

      summaryKicker: 'Resumen',
      summaryTitle: 'La casa digital de un equipo — no un portafolio',
      summaryParas: [
        'Candelaria es la <<presencia digital completa>> de un equipo universitario de ingeniería de competición. El sitio va más allá de un portafolio estático: integra <<gestión de miembros>>, publicaciones, membresías, donaciones, <<tienda de merchandise>> y un <<sistema de gamificación>> para seguidores, todo bajo una identidad visual cinética y de alto contraste.',
        'El proyecto nació de la necesidad de <<centralizar la comunicación del equipo>>, facilitar el apoyo externo y ofrecer una experiencia de usuario a la altura del nivel técnico del equipo. Desde la arquitectura de base de datos hasta la paleta de color, cada decisión fue tomada con <<criterio de producto y de ingeniería>>.',
      ],

      myRoleKicker: 'Mi rol dentro de Candelaria',
      myRoleParas: [
        'Candelaria es un semillero interdisciplinario enfocado en el desarrollo de un vehículo impulsado por energía solar, combinando innovación tecnológica, sostenibilidad y diseño aplicado a movilidad.',
        'Soy líder del equipo de diseño — coordino un grupo de 5 personas y guío la dirección visual, conceptual y de experiencia de usuario en los distintos entregables. Planifico y superviso tareas de diseño, desarrollo interfaces y prototipos digitales, apoyo la visualización de información técnica y construyo materiales de comunicación e identidad visual relacionados con el vehículo y sus sistemas.',
        'Participo activamente en reuniones semanales de seguimiento, organización estratégica y alineación interdisciplinaria con otras áreas del semillero, asegurando coherencia entre objetivos técnicos, experiencia de usuario y presentación del proyecto. Mi perfil híbrido entre diseño, UX/UI y desarrollo frontend me permite actuar como puente entre los componentes técnicos y la forma en que la tecnología es comunicada, entendida e interactuada por distintos usuarios y stakeholders.',
      ],

      problemKicker: 'Problema',
      problemTitle: 'Más allá de un PDF y un link de donaciones',
      problemLead:
        'Los equipos universitarios de competición suelen quedarse con <<soluciones parciales>>: una cuenta de Instagram, un PDF con sus logros y un link de donaciones genérico. Candelaria necesitaba <<algo diferente>>.',
      problemBullets: [
        'Una plataforma que refleje la identidad técnica y visual del equipo.',
        'Un sistema que permita a seguidores externos apoyar económicamente con trazabilidad real.',
        'Un panel interno donde los líderes puedan gestionar miembros, publicaciones y roles sin tocar código.',
        'Soporte para dos mercados de pago: internacional (Stripe) y Colombia (PayU).',
        'Un incentivo de largo plazo para que los seguidores sigan involucrados: gamificación.',
      ],

      processKicker: 'Proceso',
      processTitle: 'Proceso de desarrollo',
      processSteps: [
        {
          n: '01',
          title: 'Investigación y Sistema de Diseño',
          intro:
            "Definición del sistema visual 'Neon Velocity' en Figma: tipografía, paleta de color, componentes y grids. Diseño de 6 pantallas finales (Home, Vehicle, Team, Publications, Support, About) con enfoque mobile-first y scrolling vertical cinematográfico.",
          bullets: [
            "Definición del sistema de diseño 'Neon Velocity' en Figma.",
            'Diseño de 6 pantallas finales con enfoque mobile-first y scrolling cinematográfico.',
            'Construcción del design system con Tailwind CSS 4 y Class Variance Authority (CVA).',
            'Variantes de componentes y ritmo de layout para todas las vistas principales.',
          ],
        },
        {
          n: '02',
          title: 'Arquitectura y Backend',
          intro:
            'Modelo de datos en PostgreSQL con Django 4.2 y Django REST Framework: 13+ modelos cubriendo equipos, miembros, publicaciones, pagos y tiers. Sistema de autenticación dual con djangorestframework-simplejwt para usuarios internos y externos.',
          bullets: [
            'Esquema de 13+ modelos en PostgreSQL con Django 4.2 y DRF.',
            'Sistema de auth dual: usuarios internos del equipo y seguidores externos vía JWT.',
            'Whitelist segura para asignación de roles de liderazgo con aprobación manual y audit logging.',
            'Integración con Supabase para sincronización de perfiles, almacenamiento de media y gamificación en PL/pgSQL.',
          ],
        },
        {
          n: '03',
          title: 'Frontend e Integraciones',
          intro:
            'SPA en React 19 con React Router DOM 7 y Vite 7. Internacionalización completa (español/inglés) con i18next. Carrito de compras y flujo de checkout con Stripe y PayU, incluyendo webhook handlers con verificación HMAC-SHA256.',
          bullets: [
            'SPA en React 19 con React Router DOM 7 y Vite 7.',
            'Internacionalización completa español/inglés con i18next.',
            'Carrito de compras y checkout con Stripe (internacional) y PayU (Colombia).',
            'Verificación HMAC-SHA256 de webhooks y cálculo en tiempo real de tiers de seguidores.',
          ],
        },
        {
          n: '04',
          title: 'Rendimiento y Despliegue',
          intro:
            'Optimización de queries con select_related(), prefetch_related() y .only() en Django ORM. Compresión de imágenes con vite-plugin-imagemin y servicio de media vía Supabase Storage. Despliegue monolítico en Vercel: frontend en / y backend Django en /api/*.',
          bullets: [
            'Optimización de queries con select_related(), prefetch_related() y .only().',
            'Compresión de imágenes con vite-plugin-imagemin.',
            'Servicio de media vía Supabase Storage.',
            'Despliegue monolítico en Vercel: frontend en /, backend en /api/*.',
          ],
        },
      ],

      featuresKicker: 'Características',
      featuresTitle: 'Lo que vive en la plataforma',
      features: [
        {
          title: 'Autenticación y gestión de usuarios',
          body:
            'Sistema de doble perfil: usuarios internos (miembros del equipo) con whitelist y roles de liderazgo, y usuarios externos (seguidores y compradores). Flujo completo de registro, login, recuperación de contraseña y gestión de perfil.',
        },
        {
          title: 'E-commerce y pagos',
          body:
            'Tienda de merchandise (hoodie, gorra, botella), membresías en 3 niveles ($5 / $10 / $25 USD), donaciones libres en COP/USD. Carrito persistente, checkout con Stripe (internacional) y PayU (Colombia), historial de compras por usuario.',
        },
        {
          title: 'Gamificación — tiers de seguidores',
          body:
            'Score = total donado (COP) + meses de membresía × 5.000 COP. Calculado en PL/pgSQL en Supabase y expuesto vía API REST.',
        },
        {
          title: 'Panel interno',
          body:
            'Panel exclusivo para miembros del equipo: gestión de integrantes, asignación de roles, publicación de artículos con PDFs, administración de whitelist de líderes y revisión de transacciones.',
        },
        {
          title: 'Soporte multilingüe',
          body:
            'Soporte completo en español e inglés con i18next. Todos los modelos del backend almacenan campos en ambos idiomas (_en / _es) y la API responde según el parámetro de idioma.',
        },
      ],

      tiersKicker: 'Tiers de seguidores',
      tiersTitle: 'Modelo de score',
      tiersHeader: ['Tier', 'Puntuación mínima'],
      tiers: [
        ['Visitor', '0'],
        ['Supporter', '1+ COP'],
        ['Bronze', '20.000 COP'],
        ['Silver', '60.000 COP'],
        ['Gold', '150.000 COP'],
        ['Core', '300.000 COP'],
      ],

      perfKicker: 'Rendimiento',
      perfTitle: 'Resultados de rendimiento',
      perfHeader: ['Métrica', 'Antes', 'Después', 'Mejora'],
      perfRows: [
        ['Carga de lista de publicaciones', '2.5 s', '0.8 s', '68% más rápido'],
        ['Carga de página del equipo', '1.8 s', '0.5 s', '72% más rápido'],
        ['Queries de API de miembros', '50', '8', '84% menos queries'],
        ['Queries de API de publicaciones', '40', '10', '75% menos queries'],
      ],

      securityKicker: 'Seguridad',
      securityTitle: 'Postura de seguridad',
      securityBullets: [
        'Hashing con bcrypt (12 rondas).',
        'Rate limiting en endpoints de auth (10 req/min) y brute-force protection (8 intentos / 15 min).',
        'Verificación de webhooks con HMAC-SHA256 y tolerancia de timestamp (5 min).',
        'Procesamiento idempotente de pagos para evitar doble contabilización.',
        'Audit logging de todas las acciones administrativas.',
        'Middleware de seguridad: CSRF, CORS configurado, headers de seguridad.',
      ],

      reflectionsKicker: 'Reflexiones',
      reflectionsTitle: 'Lo que aprendí',
      reflectionsParas: [
        'Candelaria fue el proyecto que me obligó a pensar como <<product engineer>>, no solo como desarrollador. Tomar decisiones de arquitectura — cuándo usar Django vs Supabase, cómo modelar el sistema de tiers, cómo abstraer dos proveedores de pago — requirió razonar sobre <<trade-offs reales>>, no solo implementar features.',
        'El mayor aprendizaje fue diseñar para <<dos audiencias completamente distintas>>: un seguidor externo que quiere apoyar con un clic, y un líder de equipo que necesita administrar personas y publicar contenido. Construir una sola plataforma que sirva a ambos sin que ninguno sienta que la interfaz no fue pensada para él fue el reto de diseño más interesante del proyecto.',
      ],

      stackKicker: 'Herramientas usadas',
      stackTitle: 'Construido en solitario con',
      stackHint: 'Pasa el cursor sobre los badges',

      ctaVisit: 'Visitar el sitio',
      ctaCode: 'Ver en GitHub',
    },
    contact: {
      title: 'Contacto',
      lead: 'Construyamos algo que perdure. Leo cada mensaje.',
      cta: 'julian_gm4@hotmail.com',
    },
    footer: {
      copyright: '© 2026 juligm4.com. Todos los derechos reservados.',
      backToTop: 'Volver al inicio',
      navTitle: 'Navegación',
    },
  },
}

export default translations
