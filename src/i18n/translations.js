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
    },
    about: {
      title: 'About',
      lead:
        'I design and build interfaces that feel intentional. I move between the editorial calm of typography and the energy of motion, between the rigor of backend logic and the warmth of brand.',

      infoKicker: 'Information',
      infoTitle: 'A designer who codes — a developer who designs',
      infoPara1:
        'I\'m Julián Galindo, a Design student at Universidad de los Andes, focused on video games, interfaces and digital experiences. I\'m graduating in 2028, and I enjoy anything that involves creating, exploring and understanding how people interact with what they use.',
      infoPara2:
        'I like observing, questioning and analyzing why something works the way it does. I think in systems — how things connect, and how good design can make an experience clearer, more pleasant and more human. I\'m a mix of the technical and the sensitive: structure and aesthetics, logic and emotion.',
      infoPara3:
        'Films, video games and music shape the way I see design — as a way to tell something, build atmospheres and create moments that feel genuine.',
      infoMediaCaption: 'Snapshot · 2025',

      educationKicker: 'Education',
      educationTitle: 'Where I learned to think in systems',
      educationItems: [
        {
          period: '2025-2 — 2028 (expected)',
          title: 'Bachelor\'s in Design',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'The career change, told straight: I design and build on top of the engineering foundation. Expected graduation: 2028.',
        },
        {
          period: '2021-1 — 2025-1',
          title: 'Systems & Computer Engineering',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'Nine semesters: algorithms, data structures, software architecture, and mobile + web development. Option in Visual Computing: completed.',
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
      experienceTitle: 'Where I\'ve been building',
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
          period: '2025 — 2026',
          role: 'Brand & website · research hub (semillero)',
          company: 'Candelaria · university solar vehicle team',
          bullets: [
            'Brand identity and website for the Candelaria research hub (semillero).',
          ],
        },
        {
          period: '2025',
          role: 'Freelance · UX research, information architecture, wireframing',
          company: 'Bloom / BeBloomers',
          bullets: [
            'UX research, information architecture and wireframing.',
          ],
        },
        {
          period: 'TODO: dates',
          role: 'Teaching assistant (monitor) · TODO: course',
          company: 'Universidad de los Andes',
          bullets: [
            'TODO: dates and course to be completed.',
          ],
        },
      ],

      focusKicker: 'Focus',
      focusTitle: 'Game-inspired interfaces, structurally solid',
      focusPara1:
        'I specialize in crafting intuitive, game-inspired interfaces with modern frontend technologies like React. My background in systems engineering and mobile development lets me build experiences that are visually engaging and structurally solid.',
      focusPara2:
        'I\'m passionate about blending creativity with logic — from playful prototypes in Figma to dynamic functionality with backend tools. Always learning, I thrive at the intersection of design and code, building digital experiences that connect with people.',
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
      placeholder: 'Case study coming soon.',
      caseStudy: 'Student Research Group · Academic project →',
      caseStudyShort: 'View case study →',
      visitSite: 'Visit website',
      viewCode: 'GitHub repository',
      category: {
        desarrollo: 'Development',
        marcaux: 'Brand & UX',
        producto: 'Product',
      },
    },
    // Discipline labels for the showcase panels. Proper nouns and universally
    // borrowed terms (React, 3D, Branding) stay identical across locales â
    // translating them would make them harder to recognise, not easier.
    tags: {
      js: 'Js',
      react: 'React',
      django: 'Django',
      fullstack: 'Full-stack Development',
      android: 'Android',
      java: 'Java',
      ocr: 'OCR',
      mobile: 'Mobile',
      uxResearch: 'UX Research',
      ia: 'Information Architecture',
      wireframing: 'Wireframing',
      threeD: '3D',
      furniture: 'Furniture',
      productDesign: 'Product Design',
      wearable: 'Wearable',
      concept: 'Concept Development',
      brandDesign: 'Brand Design',
      visualIdentity: 'Visual Identity',
      artDirection: 'Art Direction',
      brandIdentity: 'Brand Identity',
      speculative: 'Speculative Design',
      motion: 'Motion',
    },
    works: {
      candelariaWebsite: {
        kicker: 'Web · Full-stack',
        title: 'Candelaria Website',
        desc: 'Website for the Candelaria research group. Member management, database and public archive.',
      },
      licorimetro: {
        kicker: 'Mobile · OCR',
        title: 'Licorimetro',
        desc: 'Android app that reads a label and turns it into a shared record of what you are drinking.',
      },
      bloom: {
        kicker: 'UX · Information Architecture',
        title: 'Bloom',
        desc: 'Wireframes and a rebuilt content taxonomy for a women’s health platform: 75 tags down to 28.',
      },
      humbral: {
        kicker: 'Furniture · Modular',
        title: 'El Humbral',
        desc: 'Coffee table of two interchangeable modules, drawn from pre-Columbian engraving and geometry.',
      },
      sensewaveProduct: {
        kicker: 'Wearable · Speculative',
        title: 'SenseWave',
        desc: 'Sense Eco glasses and a two-chip system that turns a donated sensation into neural signal.',
      },
      candelariaBrand: {
        kicker: 'Identity · Research Group',
        title: 'Candelaria',
        desc: 'Research group building a solar-powered car. Condor mark, division system and art direction.',
      },
    },
    licorimetro: {
      tag: 'Academic Project · Mobile App',
      title: 'Licorímetro',
      subtitle:
        'Discover, understand and share the world of alcohol from a single social experience.',
      role: 'Product Architecture · UX/UI Design · Mobile Development',
      period: '2023',
      status: 'Academic project',
      sectionRoleLabel: 'Role',
      sectionTimelineLabel: 'Timeline',

      summaryKicker: 'Overview',
      summaryTitle: 'A social ecosystem built around uncertainty',
      summaryParas: [
        'Licorímetro was born from a simple truth: when people come of age, alcohol becomes completely unfamiliar territory. What to drink. How much it costs. What it tastes like. What experiences it creates. The app proposed a single platform combining <<camera recognition>>, contextual information, community reviews, <<gamification>> and social discovery for any type of alcoholic beverage.',
        'Unlike platforms limited to wine or beer, Licorímetro envisioned a broader scope — any beverage, any social context, any level of experience. The project combined <<architecture thinking>>, UX/UI design and mobile development built almost entirely solo within a week of intensive work.',
      ],

      problemKicker: 'Problem',
      problemTitle: 'Alcohol as a fragmented information system',
      problemLead:
        'The experience of discovering alcohol is full of <<uncertainty and friction>>. Information is scattered, reviews are unreliable, and no existing platform addresses the full spectrum of alcoholic beverages with a <<social-first approach>>.',
      problemBullets: [
        'Information dispersed across unrelated platforms.',
        'No visual recognition for beverages beyond wine.',
        'Reviews limited to premium segments.',
        'Buying decisions based on guesswork.',
        'No social layer for discovery and sharing.',
        'Existing apps siloed by category — wine only, beer only.',
        'Young users completely underserved.',
      ],

      featuresKicker: 'Features',
      featuresTitle: 'A social network built around discovery',
      features: [
        {
          title: 'OCR Scanner',
          body: 'Camera-based beverage recognition. Point at a label and instantly access product information, reviews and community data.',
        },
        {
          title: 'Community Reviews',
          body: 'Ratings on quality, flavor, price and experience. Every review enriches the shared knowledge base for the entire community.',
        },
        {
          title: 'Your Cellar',
          body: 'A personal digital cellar — public or private. Save favorites, build collections and curate playlists of beverages by occasion.',
        },
        {
          title: 'Badge System',
          body: 'Gamification based on discovery milestones: categories explored, reviews submitted, community participation and engagement.',
        },
        {
          title: 'Social Playlists',
          body: 'Curated beverage collections by occasion, mood and event type. Shareable across the community and discoverable by others.',
        },
        {
          title: 'Smart Recommendations',
          body: 'Personalized suggestions based on favorites, past interactions and community behavior — a discovery engine for new experiences.',
        },
        {
          title: 'Community Pricing',
          body: 'A collaborative system to estimate real market prices, detect overcharging and help buyers make more informed decisions.',
        },
      ],

      ocrKicker: 'Technical Challenge',
      ocrTitle: 'Building computer vision without mobile experience',
      ocrParas: [
        'One of the greatest technical challenges of the project was the <<OCR system>>. The original plan relied on third-party visual recognition APIs — but during production, that solution stopped working.',
        'With very little prior experience in mobile development, the system had to be <<rebuilt manually from scratch>>, using bitmap analysis and basic image processing. The result was a functional prototype capable of identifying beverages whose labels contained clear, readable text.',
        'More than technical precision, the process represented <<accelerated learning>>, autonomous research and problem-solving under pressure — all within a week of continuous development.',
      ],
      ocrBullets: [
        'Third-party API failed mid-production.',
        'Rebuilt using bitmap map analysis.',
        'Basic image processing without ML frameworks.',
        'Functional prototype identifying text-label beverages.',
        'Built within a single week of intensive development.',
      ],

      processKicker: 'User Flow',
      processTitle: 'From discovery to community',
      processSteps: [
        {
          n: '01',
          title: 'Discover & Scan',
          intro:
            'The user encounters an unfamiliar beverage and opens the app. The camera module activates for instant scanning or manual search from the discovery feed.',
          bullets: [
            'Central camera access in main navigation.',
            'OCR scanning for text-label recognition.',
            'Browse recommendations and trending items.',
            'Search by name, category or occasion.',
          ],
        },
        {
          n: '02',
          title: 'Learn & Explore',
          intro:
            'After recognition, the product page surfaces contextual information: origin, alcohol content, flavor profile, price range and a community-built knowledge base.',
          bullets: [
            'Detailed product profile page.',
            'Community reviews and ratings.',
            'Price estimates from collaborative data.',
            'Related products and discovery suggestions.',
          ],
        },
        {
          n: '03',
          title: 'Experience & Share',
          intro:
            'After the experience, the user contributes back to the ecosystem: writing reviews, rating quality and flavor, and publishing to their social Bodega.',
          bullets: [
            'Review submission with multi-dimensional ratings.',
            'Add to personal Bodega — public or private.',
            'Create or add to social playlists.',
            'Share experiences to the community feed.',
          ],
        },
        {
          n: '04',
          title: 'Earn & Belong',
          intro:
            'Consistent contribution unlocks badges, improves reputation and builds community standing — creating a feedback loop of discovery and engagement.',
          bullets: [
            'Badge system for discovery milestones.',
            'Reputation score based on reviews and activity.',
            'Unlock new content as expertise grows.',
            'Community leaderboards and social following.',
          ],
        },
      ],

      architectureKicker: 'Architecture',
      architectureTitle: 'Thinking like a startup before building one',
      architectureParas: [
        'Although the final prototype was limited, the <<conceptual architecture>> of Licorímetro contemplated a much broader ecosystem. The system included authentication, profiles, reputation, gamification, smart recommendations, social storage, community interaction — and potential marketplace integrations.',
        'Even from an academic stage, the project already contemplated <<retention strategies>>, commercial partnerships, monetization models and scalability. The thinking was product-first: not a school project that happened to have features, but a <<startup MVP that happened to be built in class>>.',
      ],
      architectureBullets: [
        'Full authentication and profile system.',
        'Reputation and gamification engine.',
        'Smart recommendations based on behavior.',
        'Social storage (Tu Bodega) with sharing.',
        'Potential external marketplace integrations.',
        'Monetization and commercial partnership model.',
        'Scalability considered from day one.',
      ],

      whatChangedKicker: 'Evolution',
      whatChangedTitle: 'What I\'d build differently today',
      whatChangedHeader: ['Aspect', 'Then (2023)', 'Now'],
      whatChangedRows: [
        ['Recognition', 'Bitmap OCR', 'Computer vision + AI'],
        ['Architecture', 'Academic MVP', 'Production-scale system'],
        ['Recommendations', 'Manual logic', 'ML-based personalization'],
        ['Design system', 'Custom ad-hoc', 'Full design system'],
        ['Testing', 'Manual QA', 'Automated test coverage'],
        ['Data modeling', 'Basic schema', 'Scalable relational model'],
      ],

      reflectionsKicker: 'Reflections',
      reflectionsTitle: 'More than a university app',
      reflectionsParas: [
        'Licorímetro never became a real startup. But it represented something more important: the ability to <<transform an everyday need into a complex digital system>> — combining product thinking, UX design and engineering within a single cohesive idea.',
        'It marked the <<first contact with mobile development>>, the first experience with OCR, and one of the earliest real exercises in product architecture. More than the technical result, the project proved that <<curiosity, resilience and learning speed>> can turn a university idea into a vision with genuine potential.',
      ],

      stackKicker: 'Tools used',
      stackTitle: 'Built with',

      ctaCode: 'View on GitHub',
    },
    candelaria: {
      tag: 'Student Research Group · Academic project',
      title: 'Candelaria Website',
      subtitle:
        'Design leader and sole developer of the full digital system for a university solar vehicle research team.',
      faceDigital: 'A React and Django site built end to end — the team\'s public face, its sponsor pitch and its archive in one system.',
      faceVisual: 'The visual identity underneath it: condor mark, division system and the rules that keep eight sub-teams looking like one.',
      role: 'Design Lead · Product Engineering · Full-stack',
      period: '2025 – 2026',
      status: 'In development',
      sectionRoleLabel: 'Role',
      sectionTimelineLabel: 'Timeline & Status',
      heroTagline: 'Defy the limits of the sun',
      brandPage: {
        tag: 'Student Research Group · Brand Identity',
        title: 'Candelaria',
        subtitle:
          'Design lead behind the visual identity of a university solar vehicle research team: the condor mark, a logo system for seven divisions and the brand manual the whole team works from.',
        role: 'Design Lead · Brand Identity · Art Direction',
        roleTitle: 'Leading the design team.',
        ctaInstagram: 'Follow on Instagram',
        ctaWebsite: 'See the website case study',
        closingTitle: 'Follow the team on Instagram',
      },

      teamsKicker: 'The Team',
      teamsTitle: 'Seven areas. One condor.',
      teamsIntro:
        'Candelaria is an interdisciplinary seedbed. Each area carries its own condor — the same silhouette, a different color — because every team owns a distinct responsibility inside the mission.',
      teamsNote:
        'The mark is rendered in brushed metal as a nod to the automotive world the vehicle competes in.',
      teamsCredit: 'Condor logo system designed by me and the Candelaria design team.',
      teams: [
        { name: 'Batteries', role: 'Energy storage & power management' },
        { name: 'Solar Cells', role: 'Photovoltaic capture & solar array' },
        { name: 'Chassis', role: 'Structure, chassis & aerodynamics' },
        { name: 'Committee', role: 'Steering board — faculty & department leads' },
        { name: 'Design', role: 'Brand, UX & visual identity' },
        { name: 'Logistics', role: 'Operations, events & logistics' },
        { name: 'Human Resources', role: 'People, recruitment & culture' },
      ],

      summaryKicker: 'Overview',
      summaryTitle: 'A team\'s digital home, not a portfolio',
      summaryParas: [
        'Candelaria is the <<complete digital presence>> of a university engineering competition team. The site goes beyond a static portfolio: it integrates <<member management>>, publications, memberships, donations, a <<merchandise shop>> and a <<gamification system>> for followers, all under a kinetic, high-contrast visual identity.',
        'The project was born out of the need to <<centralize the team\'s communications>>, make external support easy, and offer a user experience that matches the team\'s technical level. From database architecture to color palette, every decision was made with <<product and engineering criteria>>.',
      ],

      myRoleKicker: 'Two roles, one project',
      myRoleTitle: 'Design lead. Solo developer.',
      myRoleParas: [
        'Candelaria is an interdisciplinary research seedbed focused on developing a solar-powered vehicle, combining technological innovation, sustainability and design applied to mobility.',
        'I lead the design team, coordinating five people and steering the visual, conceptual and UX direction across deliverables. I plan and supervise design tasks, build interfaces and digital prototypes, support the visualization of technical information, and craft communication and brand materials around the vehicle and its systems.',
        'I also designed and built the entire website solo: architecture, backend, frontend, integrations and deployment. My hybrid profile across design, UX/UI and frontend lets me act as a bridge between technical decisions and the way they are communicated, understood and experienced by different stakeholders.',
      ],

      brandKicker: 'Design Direction',
      brandTitle: 'Building Candelaria\'s visual language from scratch',
      brandIntro: 'My work inside Candelaria extends well beyond the website. As design team leader, I established the visual foundations the entire team operates from and continue producing the communication materials that represent the initiative publicly.',
      brandArtifacts: [
        {
          title: 'Brand Manual',
          body: 'Established the complete color system (15-shade palette across 5 families: gold, deep purple, violet, lavender, gray), typography rules (Sansation for display, Helvetica Now for body), and usage guidelines for all official and digital formats.',
        },
        {
          title: 'Design System',
          body: 'Component library and design tokens in Figma (Neon Velocity), shared across the design team for consistent visual output and directly translated into the website\'s Tailwind CSS implementation.',
        },
        {
          title: 'Visual Assets',
          body: 'Member profile cards for Instagram (3:4) and LinkedIn (1:1), convocatory posters for new member recruitment, fundraising pieces including the Gran Rifa Candelaria, and ongoing social media content.',
        },
        {
          title: 'Team Coordination',
          body: 'Planning and supervising a 5-person design team: delegating production tasks, reviewing visual quality, and aligning design decisions with the seedbed\'s engineering and communication strategy.',
        },
      ],
      brandPaletteLabel: 'Brand palette',

      problemKicker: 'Problem',
      problemTitle: 'Beyond a PDF and a donations link',
      problemLead:
        'University competition teams usually settle for <<partial solutions>>: an Instagram account, a PDF with their achievements, and a generic donations link. Candelaria needed <<something different>>.',
      problemBullets: [
        'A platform that reflects the team\'s technical and visual identity.',
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
            "'Neon Velocity' design system in Figma: typography, palette, components and 6 screens with mobile-first cinematic scroll.",
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
            'PostgreSQL data model with Django 4.2 + DRF: 13+ models, dual JWT auth for internal and external users, Supabase for gamification.',
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
            'React 19 SPA with Vite 7, full i18n (ES/EN) and dual-provider checkout — Stripe and PayU — verified via HMAC-SHA256.',
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
            'ORM query optimization (select_related, prefetch_related), vite-plugin-imagemin compression and monolithic Vercel deployment.',
          bullets: [
            'Query optimization with select_related(), prefetch_related() and .only().',
            'Image compression with vite-plugin-imagemin.',
            'Media served via Supabase Storage.',
            'Monolithic deployment on Vercel: frontend at /, backend at /api/*.',
          ],
        },
      ],

      featuresKicker: 'Features',
      featuresTitle: 'What\'s inside the platform',
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
        'Candelaria is the project that forced me to think like a <<product engineer>>, not just a developer. Architectural decisions about when to use Django vs Supabase, how to model the tier system, and how to abstract two payment providers required reasoning about <<real trade-offs>>, not just shipping features.',
        'The biggest lesson was designing for <<two completely different audiences>>: an external follower who wants to support with one click, and a team leader who needs to manage people and publish content. Building a single platform that serves both without either feeling the interface wasn\'t made for them was the most interesting design challenge of the project.',
        'Carrying both the <<design leadership>> and the <<technical development>> simultaneously revealed a clear advantage: when you set the brand rules and implement them in code, every inconsistency surfaces immediately. The cost is that you carry every inconsistency alone.',
      ],

      stackKicker: 'Tools used',
      stackTitle: 'Built solo with',
      stackHint: 'Hover the badges',

      ctaVisit: 'Visit the website',
      ctaCode: 'View on GitHub',
    },
    sensewave: {
      title: 'SenseWave',
      subtitle: 'A speculative neurotechnology brand exploring direct neural interfaces for restoring human sensation.',

      // One project, three faces — the lane it appears in decides which.
      faceProduct: 'The Sense Eco glasses and a two-chip system: hardware that turns another person\'s recorded sensation into neural signal.',
      faceDigital: 'The interface layer that curates a donated sensory library and hands the recipient control over what they feel, and when.',
      faceVisual: 'A brand system built on empathy rather than spectacle — identity, language and motion for technology that has to feel trustworthy.',

      heroPeriod: 'Sensewave · Speculative Design · 2024',
      heroH1: 'What if memories',
      heroH2: 'could be felt',
      heroHAccent: 'again?',
      heroSub: 'A speculative neurotechnology brand designing emotional reconnection through immersive sensory experience, for people who have lost access to the activities that once defined them.',
      heroTags: ['Speculative Design', 'Neurotechnology', 'Brand Identity', 'UX Strategy'],

      s2: 'The Human Problem',
      s3: 'The Technology',
      s4: 'The Donor System',
      s5: 'Brand System',
      s6: 'Digital Experience',
      s7: 'Physical Product',
      s8: 'Design Process',
      s9: 'Exhibition & Recognition',

      problemQuote: 'Every day, thousands of people live with the memory of sensations they can no longer feel.',
      problemP1: 'Not the event. The feeling. The cold rush of a mountain descent. The weightlessness of open water. The rhythm of a run through morning fog.',
      problemP2: 'Physical disability, acquired or degenerative, severs more than mobility. It severs the language the body once used to speak.',
      statA: { value: '1.3B', label: 'People living with significant disability globally' },
      statB: { value: '70%', label: 'Report sensory loss as their most defining deprivation' },

      techH1: 'Sense Eco.',
      techHAccent: 'A system,',
      techH2: 'not a device.',
      techP: 'SenseWave combines two technologies working in concert. The Sense Eco glasses serve as the interface layer. A proprietary chip system bridges the digital signal with neural memory.',
      chips: [
        { name: 'Chill Chip', tagline: 'Ambient Sensation Layer', desc: 'Processes low-intensity sensory data: temperature shifts, wind, ambient pressure. Translates continuous environmental context into background neural signal.' },
        { name: 'Complex Chip', tagline: 'Dynamic Experience Layer', desc: 'Handles high-fidelity multi-sensory data: proprioception, kinesthetic feedback, muscle memory replay. The difference between awareness and lived experience.' },
      ],

      donorH1: 'Experiences donated.',
      donorHAccent: 'Memories shared.',
      donorP: 'What makes SenseWave unique is not the technology. It is the source. Real individuals voluntarily recording and sharing their sensory experiences, not as data, but as gifts.',
      donorTransfer: 'Experience Transfer',
      donorLabel: 'Donor',
      recipientLabel: 'Recipient',
      donorCards: [
        { symbol: '○', title: 'The Donor', desc: 'An athlete, a dancer, a swimmer: anyone with a meaningful sensory experience they wish to share with someone who has lost access to it.' },
        { symbol: '◇', title: 'The Exchange', desc: 'Experiences are recorded through the Sense Eco system, verified for quality, and anonymized before entering the library.' },
        { symbol: '●', title: 'The Recipient', desc: 'Receives a curated sensory library. Not simulation: a genuine imprint from a real person, freely given.' },
      ],

      brandH1: 'Identity built',
      brandHPre: 'on',
      brandHAccent: 'empathy.',
      brandP: 'SenseWave\'s visual language is intentionally quiet. The brand steps back, allowing the human story, not the technology, to take center stage. Every element serves the emotional narrative.',
      colorLabel: 'Color System',
      typoLabel: 'Typography · Display',
      typoDisplay: 'Feel it again.',
      typoSub: 'Emotional reconnection through design.',
      typoRoles: [
        { role: 'Display', name: 'Libre Baskerville' },
        { role: 'UI / Body', name: 'Roboto Mono' },
      ],

      digitalH1: 'An interface',
      digitalHAccent: 'as quiet',
      digitalH2: 'as the experience.',
      digitalP: 'The SenseWave digital product is designed to disappear. The UI serves the narrative, not the technology, drawing users into the experience rather than the interface.',

      physicalH1: 'Objects that',
      physicalHAccent: 'carry memory.',

      processH1: 'Process rooted',
      processHPre: 'in',
      processHAccent: 'empathy.',
      processSteps: [
        { phase: '01', title: 'Research & Empathy', desc: 'Interviews and observation with people living with physical disabilities. Identifying the emotional gap, not the functional one.' },
        { phase: '02', title: 'Concept Development', desc: 'Speculative technology framework. Defining the donor system concept. Brand positioning and narrative strategy.' },
        { phase: '03', title: 'Visual Identity', desc: 'Logo system exploration. Typography pairing. Color strategy tested across dark and ambient environments.', highlight: true },
        { phase: '04', title: 'Digital & Physical', desc: 'Simultaneous design of the digital interface and physical product language. Coherence across all touchpoints.' },
        { phase: '05', title: 'Exhibition Preparation', desc: 'Adapting the narrative for academic and design audiences. Physical artifacts and presentation materials.' },
      ],

      exhibPeriod: 'Universidad de los Andes · 2024',
      exhibTitle: 'Selected for the Annual Design Exhibition',
      exhibP: 'SenseWave was selected among the cohort\'s standout projects for visual consistency, emotional clarity, and the strength of its speculative design framework.',
      exhibTags: ['Visual Consistency', 'Branding Cohesion', 'Speculative Design'],

      reflLabel: 'Final Reflection',
      reflQuote: 'The most powerful technology is the one that makes you forget it\'s there.',
      reflP1: 'SenseWave taught me that speculative design is most powerful when it asks human questions, not technological ones. The brand is not about what the technology can do: it\'s about what it means to someone who has been waiting to feel alive again.',
      reflP2: 'This project reshaped how I think about emotional design: that the interface should serve the moment of connection, not interrupt it.',
      reflTags: ['Emotional Design', 'Speculative Futures', 'Branding Systems', 'Experiential Interfaces', 'Human-Centered Technology'],
    },
    humbral: {
      tag: 'Academic Project · Furniture',
      title: 'El Humbral',
      subtitle:
        'A modular coffee table built from two interchangeable modules, where the user decides which face is the top.',
      faceProduct: 'Two identical structures, two different surfaces. Swap which one sits on top and the table changes character — no tools, no hardware.',
      faceVisual: 'A pattern drawn from the study of pre-Columbian geometry and Antonio Grass\'s work, rewritten to the table\'s own grid.',

      metaRole: 'Role',
      metaDimensions: 'Dimensions',
      metaStatus: 'Status',
      metaContext: 'Context',
      dimsShort: '410 × 410 × 310 mm',
      role: 'Product Design · Digital Fabrication',
      period: '2026',
      status: '1:5 prototype',
      course: 'Design memoir · 2026-408',

      heroKicker: 'El Humbral · Modular coffee table · 2026',
      heroH1: 'There is no',
      heroH2: 'correct side.',
      heroSub: 'A coffee table that starts from a simple idea: the piece changes depending on which face you choose to show.',
      heroTags: ['Furniture', 'Product Design', '3D', 'Materials', 'Laser Cutting'],

      s1: 'Concept',
      s2: 'The Pattern',
      s3: 'Construction',
      s4: 'Views & Dimensions',
      s5: 'Configurations',
      s6: 'In Use',
      s7: 'Physical Prototype',

      conceptQuote: 'There is no correct configuration. The table changes depending on which face you want to bring forward.',
      conceptP1: 'El Humbral is a modular coffee table made of two modules that can swap places. Both share the same structure, but each presents a different surface: one carries a pattern engraved into the wood, the other a circular opening filled with glass.',
      conceptP2: 'The intent was to work with reversibility. Rather than fixing one correct way to use the table, the two modules can be exchanged to produce two configurations — which element ends up on top is the user\'s decision.',
      conceptP3: 'The project was developed as a 1:5 scale model in MDF, laser cut and engraved, from a 3D model where dimensions, joints and contact points were verified before fabrication.',

      thresholdTitle: 'The threshold between wood and glass',
      thresholdP1: 'The name comes from the idea of a threshold as a point of transition between two spaces: a place that belongs fully to neither, but connects them.',
      thresholdP2: 'That idea reaches the object through two faces. One relates to wood, texture and the travel of the pattern; the other to glass, transparency and emptiness. With the pattern on top the table reads as solid and closed; with the glass on top, open and light.',
      thresholdP3: 'The reference to the lagoons and to Muisca culture is a connection to territory: in the Cundiboyacense highlands the lagoons held an important place in belief and ritual, and Guatavita is tied to the offerings that later gave rise to the El Dorado myth. The project does not represent those rituals — it takes from them the idea of passage between two worlds.',

      stepsTitle: 'The project in four steps',
      steps: [
        { n: '01', title: 'Pattern study', desc: 'Digitising the graphic derived from Antonio Grass and fitting it to a 0.5 cm grid.' },
        { n: '02', title: '3D modelling', desc: 'Verifying dimensions, joints, frame centring and the stacking of both modules.' },
        { n: '03', title: 'Cut and engrave', desc: 'MDF parts laid out on tabloid format; laser cut and engraved in a single pass.' },
        { n: '04', title: 'Assembly and test', desc: 'Gluing frame and legs, checking the stops and both configurations.' },
      ],

      patternTitle: 'Reference to Antonio Grass',
      patternP1: 'The pattern on the wooden face comes from exploring geometries associated with pre-Columbian graphics and with Antonio Grass\'s work. He studied and reinterpreted forms present in pre-Columbian iconography, carrying them into contemporary geometric compositions.',
      patternP2: 'No specific piece was copied for El Humbral. The intent was to study resources — lines, modules, repetitions, steps and geometries — in order to build an original pattern.',
      patternP3: 'That study produced three engravings. The first two were tested directly on MDF: one orthogonal, one radial. The third, refined, is the one that stayed on the final piece.',
      patternP4: 'The radial version had a more direct relationship to some pre-Columbian forms, but was discarded because it did not speak to the orthogonal structure of the table.',

      patternFig1: 'First engraving on MDF: orthogonal layout derived from the study of Grass\'s graphics.',
      patternFig2: 'Second engraving on MDF: radial composition, discarded against the geometry of the table.',
      patternFig3: 'Final engraving: the refined orthogonal layout on a 16 × 16 cell grid.',

      gridTitle: 'From sketch to grid',
      gridP1: 'The main lines were identified first and the drawing organised on a grid. From that base the paths and repetitions were adjusted until the composition came out cleaner.',
      gridP2: 'The final pattern works at 0.5 and 1 cm on the model — 25 and 50 mm on the real product — and holds right angles throughout.',
      gridSpecs: 'Grid 16 × 16 cells · Cell 0.5 cm model / 25 mm real · Area 8 × 8 cm / 400 × 400 mm',

      adaptTitle: 'From first engraving to final',
      adaptP1: 'The final engraving starts from the first (Fig. 2.1), but rewritten onto the geometry of the furniture itself: line width was taken to the thickness of the supports and legs — 60 mm on the real product, 1.2 cm on the model — and the breaks were aligned to the same grid that orders the frame and the stops.',
      adaptP2: 'That change in thickness also solved a fabrication problem: the thin lines of the first version burned unevenly on MDF, while the wide stroke engraves clean and reads from a distance. The pattern stops being a drawing applied to the surface and becomes an extension of the measurement system the table is built with.',

      constructTitle: 'Construction system',
      constructP1: 'Each module works as an independent piece, made of a top board, a lower frame and four legs.',
      constructP2: 'The board measures 410 × 410 mm with 45 mm thickness. Below it sits the frame — the «madre» — at 430 × 430 mm, which receives the four legs. Each leg has a 60 × 60 mm section and a height of 110 mm.',
      constructP3: 'The structure was designed so the legs stay contained within the frame without significant displacement. Parts are joined by gluing, avoiding visible hardware.',
      constructP4: 'To stack the two modules, small stops were added at the corners of the upper face. These stops reproduce the space that exists inside the lower frame: when a module is placed on top, its legs fall into that space and both bodies stay centred.',
      constructP5: 'The joint between modules does not need to be permanent: it relies on weight, fit and the geometry of the parts.',

      logicTitle: 'System logic',
      logic: [
        '1 · Board — defines the visible surface of each module: engraved pattern on one, glass window on the other.',
        '2 · Frame — works as structure, receives the legs and keeps a rigid joint with the board.',
        '3 · Legs and stops — let the module rest on the floor and receive the second module on top, without hardware.',
      ],
      logicNote: 'The two modules are practically identical in structure and differ only in the surface they present.',

      partsTitle: 'Parts of one module, top to bottom',
      parts: '8 corner stops · 60 × 60 × 15 mm\n1 glass · Ø 300 mm\n1 upper ring · Ø 300 / Ø 270 mm\n1 lower ring · Ø 300 / Ø 270 mm\n1 board · 410 × 410 × 45 mm\n1 «madre» frame · 430 × 430 × 15 mm\n4 legs · 60 × 60 × 110 mm',
      partsNote: 'The two rings are glued one on top of the other inside the board\'s opening and form the platform the glass rests on, flush with the upper face.',

      stackNote: 'Stacking works because the geometry repeats: the corner gap of the frame below and the pair of stops above have exactly the same measure as the leg section (60 × 60 mm).',

      viewsIntro: 'The views on this sheet are drawn at 1:5 over the verified 3D model: each part occupies on paper exactly what it occupies on the model. Dimensions indicate real product measures, in millimetres.',
      viewTop: 'Top view',
      viewBottom: 'Bottom view',
      viewSide: 'Side view',
      viewIso: 'Isometric perspective',

      dimsTitle: 'General dimensions · real product',
      dims: 'Board — 410 × 410 × 45 mm\nFrame («madre») — 430 × 430 × 15 mm\nLegs — 60 × 60 × 110 mm\nCorner stops — 60 × 60 × 15 mm\nWindow — Ø 300 mm (inner ring Ø 270 mm)',
      dimsHeight: 'Height of one module — 155 mm\nTotal height, two modules stacked — 310 mm',

      notesTitle: 'Notes',
      note1: 'The model was built at 1:5 scale in MDF, with 4.5 mm boards and 1.5 mm fine parts, equivalent to 45 and 15 mm on the real product.',
      note2: 'The legs stay contained in the corner gap of the frame; the upper stops repeat that same gap on the board to receive the module stacked above.',

      configIntro: 'The two modules are interchangeable. Changing which one is on top does not modify the structure or require tools: you lift one module and rest it on the other, fitting the legs into the corner stops. Each configuration changes the character of the table and the kind of use it favours.',
      configATitle: 'Configuration A · pattern on top',
      configAP1: 'The module with the engraved pattern sits on top. The surface is continuous and wooden, with greater visual presence, and the whole reads as more solid and closed.',
      configAP2: 'It favours use as a permanent resting surface: trays, books, cups or a remote. The lower level, with the window, stays as visible storage.',
      configBTitle: 'Configuration B · glass on top',
      configBP1: 'The module with the circular window sits on top. The opening becomes the main element, reveals the lower level and visually lightens the whole.',
      configBP2: 'It works when the table acts as a display case: whatever is stored below is exposed through the glass. The surface is also easier to clean.',

      useIntro: 'Both configurations set with everyday objects for a coffee table: books, tray, cup and a small plant. The scenes were built with the same 3D model and at the same scale, to check the relationship between the furniture and the objects it holds.',
      useFig1: 'Pattern on top: a continuous surface for resting and reading, with the lower level free for storage.',
      useFig2: 'Glass on top: whatever is stored on the lower level stays in view through the window.',

      protoTitle: 'Physical prototype',
      protoP1: 'The prototype made it possible to physically verify the decisions taken during digital modelling.',
      protoP2: 'Cutting and assembly allowed a review of the frame dimensions, leg position, how the stops perform and the relationship between the two modules.',
      protoP3: 'It also helped identify adjustments before defining the final version: the exact position of the stops was corrected from what the model revealed.',

      verifyTitle: 'What was verified',
      verify: 'Leg fit in the corner gap of the frame\nFrame centring against the board\nStacking and centring of both modules\nLegibility of the engraving on MDF\nStability of the assembled whole',
      verifySpecs: '1:5 scale model · 4.5 and 1.5 mm MDF · laser cut and engraved · glued joints.',

      protoFig1: 'Stacked assembly: the window module over the engraved module.',
      protoFig2: 'The two modules seen from above: engraved surface and window.',
      protoFig3: 'Window module and «madre» frame before assembly.',
      protoFig4: 'Top view of the assembly: the lower module\'s engraving seen through the window.',

      photoNoteTitle: 'On the photographic record',
      photoNote: 'The original shots were taken in the workshop, on the cutting table and with measuring instruments in frame. For this memoir they were processed digitally: background and extraneous elements were removed, and the four photographs were brought to a single neutral surface and a single lighting. The aim is to be able to compare the parts and read the construction system without distraction.',

      specsTitle: 'Project data',
      specs: 'Typology — Modular coffee table\nMaterials — MDF · glass / acrylic\nDimensions — 410 × 410 × 310 mm\nModules — 2, interchangeable\nFabrication — Laser cut and engraved · glued joints\nModel — 1:5 scale',
    },
    bloom: {
      tag: 'Client Work · Information Architecture',
      title: 'Bloom',
      subtitle:
        'Rebuilding the content taxonomy behind a women\'s health platform — from 75 loose tags to 28 that a phone can actually hold.',

      metaRole: 'Role',
      metaClient: 'Client',
      metaTeam: 'Team',
      role: 'UX Research · Information Architecture · Wireframing',
      period: '2025',
      status: 'Delivered',
      client: 'Bloom / BeBloomers',
      collaboration: 'In collaboration with another designer',

      heroKicker: 'Bloom · Information architecture · 2025',
      heroH1: 'Seventy-five tags',
      heroH2: 'nobody could use.',
      heroSub: 'My first real client project: a full redesign of how Bloom classifies every article, podcast and workshop it publishes.',
      heroTags: ['UX Research', 'Information Architecture', 'Wireframing', 'Taxonomy'],

      s1: 'The Brief',
      s2: 'The Problem',
      s3: 'Three Versions',
      s4: 'The System in Use',
      s5: 'Wireframes',
      s6: 'Reflection',

      briefP1: 'Bloom — BeBloomers — publishes articles, podcasts, workshops and guides on women\'s health and wellbeing. The team brought in two designers to rebuild the website from the ground up.',
      briefP2: 'I worked on two fronts: full wireframes and small prototypes for the new site, and a complete reclassification of the tags and categories behind every digital product they publish.',
      briefP3: 'This page covers both: the taxonomy first, because it changed how the product works, and then the wireframes, where that structure turns into screens.',

      problemQuote: 'A taxonomy is not a list of words. It is the shape of what a reader is allowed to find.',
      problemP1: 'The original system had accumulated 75 unique tags. Tags had been added as content was published, never pruned, and never checked against each other — so several described the same thing at different levels of specificity.',
      problemP2: 'The consequence was not untidiness, it was reach: with a tag list that long, filtering stops being a shortcut and becomes a second search problem. Most Bloom readers arrive on a phone, where a filter row that scrolls forever is simply not used.',

      versionsIntro: 'Rather than propose one answer, I built three, each a defensible position on the same axis: how much can you compress a taxonomy before it stops being able to describe the content?',
      v1Title: 'V1 · Recategorised original',
      v1Count: '75 tags',
      v1Desc: 'The existing tags reorganised under five categories — Body, Mind, Relationships, Sex, Culture — with duplicates removed. This version proves the categories hold, but keeps the volume problem.',
      v2Title: 'V2 · Logical grouping',
      v2Count: '46 tags',
      v2Desc: 'Tags collapsed into concepts rather than phrasings. Sharp enough for Bloom AI to make precise recommendations, still heavy for a mobile filter row.',
      v3Title: 'V3 · Simplified access',
      v3Count: '28 tags',
      v3Desc: 'The recommendation. Under 40% of the original count, balanced across the five categories, and short enough that the whole filter fits on a phone screen.',
      v3Badge: 'Sweet spot',

      tradeoffTitle: 'The trade-off, stated plainly',
      tradeoffP1: 'V3 is not free. Condensing tags makes Bloom AI\'s recommendations less precise than V2 — fewer distinctions to reason over. I recommended it anyway, and said so in the deliverable, because the mobile reality outweighs the loss: a filter nobody opens produces no recommendations at all.',
      tradeoffP2: 'I also marked the floor. Reducing below 28 would leave tags so general they stop discriminating between pieces, and the system would degrade from simplified to useless.',

      bridgeTitle: 'Shared tags as bridges',
      bridgeP1: 'The most useful decision was not reduction, it was overlap. Six tags deliberately live in more than one category — hormones, motherhood, sexual desire, emotional management, LGBTIQ+, gynaecology.',
      bridgeP2: 'Those shared tags are what let Bloom AI connect an article filed under Body with a podcast filed under Mind. A reader looking at menopause and hormones can be pointed to anxiety and emotional management, because the taxonomy itself encodes the relationship.',
      bridgeP3: 'The tinting that shows this overlap exists only in the specification. To the reader on the site, the bridge is invisible — it just feels like the recommendations understand them.',

      structureTitle: 'Final structure · 28 tags across 5 categories',
      categories: [
        { name: 'Body', count: '12', tags: 'menstruation · contraceptives · pregnancy · fertility · menopause · endometriosis · STIs · personal care · hormones · motherhood · sexual desire · gynaecology' },
        { name: 'Mind', count: '7', tags: 'anxiety · self-esteem · mental health · depression · self-knowledge · hormones · emotional management' },
        { name: 'Relationships', count: '7', tags: 'partner · family · motherhood · community · toxic relationships · emotional management · LGBTIQ+' },
        { name: 'Sex', count: '5', tags: 'sexuality · sexual desire · sex education · LGBTIQ+ · hormones' },
        { name: 'Culture', count: '5', tags: 'feminism · teen · entertainment · gynaecology · LGBTIQ+' },
      ],

      caseTitle: 'How a piece lives in the system',
      caseIntro: 'Every piece carries one category plus two to five tags. Marked tags are shared — they appear in content from other categories, and Bloom AI reads them as bridges for cross-recommendation. Point at one to see what it connects.',

      explorerLabel: 'Taxonomy explorer',
      explorerHint: 'Switch versions to watch the taxonomy compress. Point at any tag to find every category it lives in.',
      explorerTags: 'tags',
      explorerShared: 'Shared across categories',
      explorerLang: 'Tags appear in Spanish, as they were delivered to the client.',
      caseFormats: ['Article', 'Podcast', 'Guide'],
      caseBridge: 'Bridge',

      wfTitle: 'Every screen was drawn for a phone first',
      wfStat: '80%+',
      wfStatLabel: 'of Bloom\'s users were already reading from a phone or mobile device, according to the analytics reviewed before the work began.',
      wfP1: 'That number set the canvas. Every wireframe was built at 390 px wide, so hierarchy, tap targets and the length of each scroll were decided where most readers actually are — not scaled down from a desktop layout afterwards.',
      wfP2: 'It is also why the taxonomy had to fit on one screen: the filters, the content grid and Bloom AI all share the same narrow column.',
      wfViewerHint: 'Scroll inside the phone, or let it run.',
      wfScreens: [
        { key: 'home', name: 'Home', desc: 'The full front page: value proposition, direct access to Bloom AI, and content grouped by format.' },
        { key: 'article', name: 'Article', desc: 'Long-form reading with key terms marked in the text, related content mid-read and topic personalisation at the end.' },
        { key: 'program', name: 'Podcast', desc: 'A programme page: hosts, episodes filterable by season, guest or tag, and a sign-up for new episodes.' },
        { key: 'ia', name: 'Bloom AI', desc: 'The assistant\'s landing: what it is, the evidence behind its answers and how a question becomes one.' },
        { key: 'community', name: 'Community', desc: 'Events, WhatsApp groups and Bloom House — the part of Bloom that happens off the screen.' },
      ],
      wfFlowTitle: 'Reading an article, step by step',
      wfFlow: [
        'The article, with key terms marked.',
        'The global menu, one tap away.',
        'Tapping a term offers a Bloom AI explanation.',
        'Bloom AI answers with the article as context.',
        'Keep exploring: related content by format.',
      ],

      reflLabel: 'Reflection',
      reflQuote: 'The best argument I made on this project was for the version that performed worse on paper.',
      reflP1: 'Working with a real client taught me that a recommendation is only useful if it comes with its cost attached. Presenting three versions rather than one turned the conversation from «do you like it» into «which trade-off do you want», and that is a conversation a client can actually take part in.',
      reflP2: 'It also taught me that information architecture is design work with the highest leverage and the lowest visibility. Nobody will ever compliment a tag list. But every recommendation the platform makes runs through it.',
      reflTags: ['Information Architecture', 'Taxonomy Design', 'Client Communication', 'Mobile-First Constraints'],
    },
    contact: {
      title: 'Contact',
      lead: 'Let\'s build something that lasts. I read every message.',
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
          period: '2025-2 — 2028 (previsto)',
          title: 'Pregrado en Diseño',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'El cambio de carrera, contado de frente: diseño y construyo sobre la base de la ingeniería. Grado previsto: 2028.',
        },
        {
          period: '2021-1 — 2025-1',
          title: 'Ingeniería de Sistemas y Computación',
          subtitle: 'Universidad de los Andes · Bogotá',
          detail:
            'Nueve semestres: algoritmos, estructuras de datos, arquitectura de software y desarrollo móvil y web. Opción en Computación Visual: terminada.',
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
          period: '2025 — 2026',
          role: 'Marca y sitio web · semillero de investigación',
          company: 'Candelaria · equipo universitario de vehículo solar',
          bullets: [
            'Identidad de marca y sitio web del semillero de investigación Candelaria.',
          ],
        },
        {
          period: '2025',
          role: 'Freelance · investigación UX, arquitectura de información, wireframing',
          company: 'Bloom / BeBloomers',
          bullets: [
            'Investigación UX, arquitectura de información y wireframing.',
          ],
        },
        {
          period: 'TODO: fechas',
          role: 'Monitor · TODO: curso',
          company: 'Universidad de los Andes',
          bullets: [
            'TODO: fechas y curso por completar.',
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
      placeholder: 'Caso de estudio próximamente.',
      caseStudy: 'Semillero · Proyecto Académico →',
      caseStudyShort: 'Ver caso de estudio →',
      visitSite: 'Visitar el sitio',
      viewCode: 'Repositorio GitHub',
      category: {
        desarrollo: 'Desarrollo',
        marcaux: 'Marca y UX',
        producto: 'Producto',
      },
    },
    // Etiquetas de disciplina de los paneles. Los nombres propios y los
    // términos prestados (React, 3D, Branding) no se traducen: hacerlo los
    // volvería más difíciles de reconocer, no más claros.
    tags: {
      js: 'Js',
      react: 'React',
      django: 'Django',
      fullstack: 'Desarrollo FullStack',
      android: 'Android',
      java: 'Java',
      ocr: 'OCR',
      mobile: 'Móvil',
      uxResearch: 'Investigación UX',
      ia: 'Arquitectura de Información',
      wireframing: 'Wireframing',
      threeD: '3D',
      furniture: 'Mobiliario',
      productDesign: 'Diseño de Producto',
      wearable: 'Wearable',
      concept: 'Desarrollo de Concepto',
      brandDesign: 'Diseño de Marca',
      visualIdentity: 'Identidad Visual',
      artDirection: 'Dirección de Arte',
      brandIdentity: 'Identidad de Marca',
      speculative: 'Diseño Especulativo',
      motion: 'Motion',
    },
    works: {
      candelariaWebsite: {
        kicker: 'Web · Full-stack',
        title: 'Candelaria Website',
        desc: 'Website asociado al grupo de investigación Candelaria. Control de miembros, base de datos y archivo público.',
      },
      licorimetro: {
        kicker: 'Móvil · OCR',
        title: 'Licorímetro',
        desc: 'App Android que lee una etiqueta y la convierte en un registro compartido de lo que estás tomando.',
      },
      bloom: {
        kicker: 'UX · Arquitectura de Información',
        title: 'Bloom',
        desc: 'Wireframes y taxonomía de contenido rehecha para una plataforma de salud femenina: de 75 tags a 28.',
      },
      humbral: {
        kicker: 'Mobiliario · Modular',
        title: 'El Humbral',
        desc: 'Coffee Table compuesta de dos módulos inspirada en grabados y elementos precolombinos.',
      },
      sensewaveProduct: {
        kicker: 'Wearable · Especulativo',
        title: 'SenseWave',
        desc: 'Gafas Sense Eco y un sistema de dos chips que convierte una sensación donada en señal neural.',
      },
      candelariaBrand: {
        kicker: 'Identidad · Semillero',
        title: 'Candelaria',
        desc: 'Grupo de investigación enfocado en la elaboración de un auto potenciado por energía solar.',
      },
    },
    licorimetro: {
      tag: 'Proyecto Académico · App Móvil',
      title: 'Licorímetro',
      subtitle:
        'Descubrir, entender y compartir el mundo del alcohol desde una sola experiencia social.',
      role: 'Arquitectura de Producto · Diseño UX/UI · Desarrollo Móvil',
      period: '2023',
      status: 'Proyecto académico',
      sectionRoleLabel: 'Rol',
      sectionTimelineLabel: 'Cronología',

      summaryKicker: 'Resumen',
      summaryTitle: 'Un ecosistema social construido alrededor de la incertidumbre',
      summaryParas: [
        'Licorímetro nació de una verdad simple: cuando la gente llega a la mayoría de edad, el alcohol se convierte en un territorio completamente desconocido. Qué tomar. Cuánto cuesta. Qué sabor tiene. Qué experiencias genera. La app propuso una sola plataforma que combinara <<reconocimiento por cámara>>, información contextual, reviews comunitarias, <<gamificación>> y descubrimiento social para cualquier tipo de bebida alcohólica.',
        'A diferencia de plataformas limitadas a vinos o cervezas, Licorímetro contemplaba un alcance más amplio — cualquier bebida, cualquier contexto social, cualquier nivel de experiencia. El proyecto combinó <<pensamiento de arquitectura>>, diseño UX/UI y desarrollo móvil construido casi en su totalidad en solitario en una semana de trabajo intensivo.',
      ],

      problemKicker: 'Problema',
      problemTitle: 'El alcohol como sistema de información fragmentado',
      problemLead:
        'La experiencia de descubrir el alcohol está llena de <<incertidumbre y fricción>>. La información está dispersa, las reseñas son poco confiables y ninguna plataforma existente aborda el espectro completo de bebidas alcohólicas con un <<enfoque social>>.',
      problemBullets: [
        'Información dispersa en plataformas no relacionadas.',
        'Sin reconocimiento visual para bebidas más allá del vino.',
        'Reseñas limitadas a segmentos premium.',
        'Decisiones de compra basadas en suposiciones.',
        'Sin capa social para el descubrimiento y la comunidad.',
        'Apps existentes fragmentadas por categoría — solo vinos, solo cervezas.',
        'Usuarios jóvenes completamente desatendidos.',
      ],

      featuresKicker: 'Características',
      featuresTitle: 'Una red social construida alrededor del descubrimiento',
      features: [
        {
          title: 'Scanner OCR',
          body: 'Reconocimiento de bebidas mediante la cámara. Apunta a una etiqueta y accede instantáneamente a la información del producto, reseñas y datos comunitarios.',
        },
        {
          title: 'Reviews comunitarias',
          body: 'Calificaciones de calidad, sabor, precio y experiencia. Cada reseña enriquece la base de conocimiento compartida para toda la comunidad.',
        },
        {
          title: 'Tu Bodega',
          body: 'Una bodega digital personal — pública o privada. Guarda favoritos, crea colecciones y arma playlists de bebidas por ocasión.',
        },
        {
          title: 'Sistema de insignias',
          body: 'Gamificación basada en hitos de descubrimiento: categorías exploradas, reseñas enviadas, participación comunitaria y engagement.',
        },
        {
          title: 'Playlists sociales',
          body: 'Colecciones de bebidas curadas por ocasión, ambiente y tipo de evento. Compartibles y descubribles por la comunidad.',
        },
        {
          title: 'Recomendaciones inteligentes',
          body: 'Sugerencias personalizadas basadas en favoritos, interacciones pasadas y comportamiento comunitario — un motor de descubrimiento de nuevas experiencias.',
        },
        {
          title: 'Precio comunitario',
          body: 'Sistema colaborativo para estimar precios reales de mercado, detectar sobrecostos y ayudar a compradores a tomar decisiones más informadas.',
        },
      ],

      ocrKicker: 'Reto Técnico',
      ocrTitle: 'Construir visión computacional sin experiencia móvil',
      ocrParas: [
        'Uno de los mayores retos técnicos del proyecto fue el <<sistema OCR>>. El plan original contemplaba el uso de APIs externas de reconocimiento visual — pero durante la producción, esa solución dejó de funcionar.',
        'Con muy poca experiencia previa en desarrollo móvil, el sistema tuvo que ser <<reconstruido manualmente desde cero>>, usando análisis de mapas de bits y procesamiento básico de imagen. El resultado fue un prototipo funcional capaz de identificar bebidas cuyos logotipos contenían texto claro y legible.',
        'Más allá de la precisión técnica, el proceso representó <<aprendizaje acelerado>>, investigación autónoma y resolución de problemas bajo presión — todo dentro de una semana de desarrollo continuo.',
      ],
      ocrBullets: [
        'La API de terceros falló a mitad de la producción.',
        'Reconstruido usando análisis de mapa de bits.',
        'Procesamiento de imagen básico sin frameworks de ML.',
        'Prototipo funcional para bebidas con etiquetas de texto.',
        'Construido en una sola semana de desarrollo intensivo.',
      ],

      processKicker: 'Flujo de Usuario',
      processTitle: 'Del descubrimiento a la comunidad',
      processSteps: [
        {
          n: '01',
          title: 'Descubrir y Escanear',
          intro:
            'El usuario encuentra una bebida desconocida y abre la app. El módulo de cámara se activa para escaneo instantáneo o búsqueda manual desde el feed de descubrimiento.',
          bullets: [
            'Acceso central a la cámara en la navegación principal.',
            'Escaneo OCR para reconocimiento de etiquetas de texto.',
            'Explorar recomendaciones y elementos en tendencia.',
            'Buscar por nombre, categoría u ocasión.',
          ],
        },
        {
          n: '02',
          title: 'Aprender y Explorar',
          intro:
            'Tras el reconocimiento, la página de producto muestra información contextual: origen, contenido alcohólico, perfil de sabor, rango de precios y una base de conocimiento construida por la comunidad.',
          bullets: [
            'Página de perfil detallado del producto.',
            'Reseñas y calificaciones de la comunidad.',
            'Estimados de precio de datos colaborativos.',
            'Productos relacionados y sugerencias de descubrimiento.',
          ],
        },
        {
          n: '03',
          title: 'Vivir y Compartir',
          intro:
            'Después de la experiencia, el usuario contribuye de vuelta al ecosistema: escribiendo reseñas, calificando calidad y sabor, y publicando en su Bodega social.',
          bullets: [
            'Envío de reseñas con calificaciones multidimensionales.',
            'Agregar a Bodega personal — pública o privada.',
            'Crear o agregar a playlists sociales.',
            'Compartir experiencias al feed comunitario.',
          ],
        },
        {
          n: '04',
          title: 'Ganar y Pertenecer',
          intro:
            'La contribución constante desbloquea insignias, mejora la reputación y construye posicionamiento comunitario — creando un ciclo de descubrimiento y engagement.',
          bullets: [
            'Sistema de insignias por hitos de descubrimiento.',
            'Puntuación de reputación basada en reseñas y actividad.',
            'Desbloquear nuevo contenido a medida que crece la experiencia.',
            'Rankings comunitarios y seguimiento social.',
          ],
        },
      ],

      architectureKicker: 'Arquitectura',
      architectureTitle: 'Pensar como startup antes de construir una',
      architectureParas: [
        'Aunque el prototipo final fue limitado, la <<arquitectura conceptual>> de Licorímetro contemplaba un ecosistema mucho más amplio. El sistema incluía autenticación, perfiles, reputación, gamificación, recomendaciones inteligentes, almacenamiento social, interacción comunitaria — e integraciones potenciales con marketplaces externos.',
        'Incluso desde una etapa académica, el proyecto ya contemplaba <<estrategias de fidelización>>, alianzas comerciales, modelos de monetización y escalabilidad. El pensamiento era product-first: no un proyecto escolar que resultó tener features, sino un <<MVP de startup que resultó construirse en clase>>.',
      ],
      architectureBullets: [
        'Sistema completo de autenticación y perfiles.',
        'Motor de reputación y gamificación.',
        'Recomendaciones inteligentes basadas en comportamiento.',
        'Almacenamiento social (Tu Bodega) con sharing.',
        'Potenciales integraciones con marketplaces externos.',
        'Modelo de monetización y alianzas comerciales.',
        'Escalabilidad considerada desde el día uno.',
      ],

      whatChangedKicker: 'Evolución',
      whatChangedTitle: 'Qué construiría diferente hoy',
      whatChangedHeader: ['Aspecto', '2023', 'Hoy'],
      whatChangedRows: [
        ['Reconocimiento', 'OCR por bitmap', 'Computer vision + IA'],
        ['Arquitectura', 'MVP académico', 'Sistema a escala productiva'],
        ['Recomendaciones', 'Lógica manual', 'Personalización con ML'],
        ['Design system', 'Componentes ad-hoc', 'Sistema de diseño completo'],
        ['Testing', 'QA manual', 'Cobertura automatizada'],
        ['Modelo de datos', 'Schema básico', 'Modelo relacional escalable'],
      ],

      reflectionsKicker: 'Reflexiones',
      reflectionsTitle: 'Más que una aplicación universitaria',
      reflectionsParas: [
        'Licorímetro nunca se convirtió en una startup real. Pero representó algo más importante: la capacidad de <<transformar una necesidad cotidiana en un sistema digital complejo>> — combinando pensamiento de producto, diseño UX e ingeniería en una sola idea coherente.',
        'Marcó el <<primer contacto con el desarrollo móvil>>, la primera experiencia con OCR y uno de los primeros ejercicios reales de arquitectura de producto. Más allá del resultado técnico, el proyecto demostró que <<curiosidad, resiliencia y velocidad de aprendizaje>> pueden convertir una idea universitaria en una visión con potencial real.',
      ],

      stackKicker: 'Herramientas usadas',
      stackTitle: 'Construido con',

      ctaCode: 'Ver en GitHub',
    },
    candelaria: {
      tag: 'Semillero · Proyecto Académico',
      title: 'Candelaria Website',
      subtitle:
        'Líder de diseño y desarrollador único de la presencia digital completa de un equipo universitario de investigación en vehículos solares.',
      faceDigital: 'Un sitio en React y Django construido de punta a punta — la cara pública del equipo, su pitch a patrocinadores y su archivo en un solo sistema.',
      faceVisual: 'La identidad visual que lo sostiene: marca del cóndor, sistema de divisiones y las reglas que hacen que ocho subequipos se vean como uno.',
      role: 'Líder de Diseño · Ingeniería de Producto · Full-stack',
      period: '2025 – 2026',
      status: 'En desarrollo',
      sectionRoleLabel: 'Rol',
      sectionTimelineLabel: 'Cronología y Estado',
      heroTagline: 'Desafía los límites del sol',
      brandPage: {
        tag: 'Semillero · Identidad de Marca',
        title: 'Candelaria',
        subtitle:
          'Líder de diseño detrás de la identidad visual de un semillero universitario de vehículos solares: la marca del cóndor, un sistema de logos para siete áreas y el manual de marca con el que trabaja todo el equipo.',
        role: 'Líder de Diseño · Identidad de Marca · Dirección de Arte',
        roleTitle: 'Liderando al equipo de diseño.',
        ctaInstagram: 'Seguir en Instagram',
        ctaWebsite: 'Ver el caso del website',
        closingTitle: 'Sigue al equipo en Instagram',
      },

      teamsKicker: 'El Equipo',
      teamsTitle: 'Siete áreas. Un cóndor.',
      teamsIntro:
        'Candelaria es un semillero interdisciplinario. Cada área lleva su propio cóndor — la misma silueta, un color distinto — porque cada equipo tiene una responsabilidad diferente dentro de la misión.',
      teamsNote:
        'La marca está resuelta en metal cepillado como guiño al mundo automotriz en el que compite el vehículo.',
      teamsCredit: 'Sistema de logos del cóndor diseñado por mí y el equipo de diseño de Candelaria.',
      teams: [
        { name: 'Baterías', role: 'Almacenamiento de energía y gestión de potencia' },
        { name: 'Celdas Solares', role: 'Captación fotovoltaica y arreglo solar' },
        { name: 'Chasis', role: 'Estructura, chasis y aerodinámica' },
        { name: 'Comité', role: 'Junta directiva — profesores y jefes de área' },
        { name: 'Diseño', role: 'Marca, UX e identidad visual' },
        { name: 'Logística', role: 'Operaciones, eventos y logística' },
        { name: 'Recursos Humanos', role: 'Personas, reclutamiento y cultura' },
      ],

      summaryKicker: 'Resumen',
      summaryTitle: 'La casa digital de un equipo, no un portafolio',
      summaryParas: [
        'Candelaria es la <<presencia digital completa>> de un equipo universitario de ingeniería de competición. El sitio va más allá de un portafolio estático: integra <<gestión de miembros>>, publicaciones, membresías, donaciones, <<tienda de merchandise>> y un <<sistema de gamificación>> para seguidores, todo bajo una identidad visual cinética y de alto contraste.',
        'El proyecto nació de la necesidad de <<centralizar la comunicación del equipo>>, facilitar el apoyo externo y ofrecer una experiencia de usuario a la altura del nivel técnico del equipo. Desde la arquitectura de base de datos hasta la paleta de color, cada decisión fue tomada con <<criterio de producto y de ingeniería>>.',
      ],

      myRoleKicker: 'Dos roles, un proyecto',
      myRoleTitle: 'Líder de diseño. Desarrollador único.',
      myRoleParas: [
        'Candelaria es un semillero interdisciplinario enfocado en el desarrollo de un vehículo impulsado por energía solar, combinando innovación tecnológica, sostenibilidad y diseño aplicado a movilidad.',
        'Soy líder del equipo de diseño, coordinando un grupo de 5 personas y guiando la dirección visual, conceptual y de UX en los distintos entregables. Planifico y superviso tareas de diseño, desarrollo interfaces y prototipos digitales, apoyo la visualización de información técnica y construyo materiales de comunicación e identidad visual relacionados con el vehículo y sus sistemas.',
        'También diseñé y construí el sitio web completo de forma individual: arquitectura, backend, frontend, integraciones y despliegue. Mi perfil híbrido entre diseño, UX/UI y frontend me permite actuar como puente entre decisiones técnicas y la forma en que se comunican, entienden y se experimentan por los distintos usuarios.',
      ],

      brandKicker: 'Dirección de Diseño',
      brandTitle: 'Construyendo el lenguaje visual de Candelaria desde cero',
      brandIntro: 'Mi trabajo dentro de Candelaria va mucho más allá del sitio web. Como líder del equipo de diseño, establecí las bases visuales desde las que opera todo el equipo y continúo produciendo los materiales de comunicación que representan públicamente a la iniciativa.',
      brandArtifacts: [
        {
          title: 'Manual de Marca',
          body: 'Establecí el sistema de color completo (paleta de 15 tonos en 5 familias: dorado, púrpura profundo, violeta, lavanda, gris), reglas tipográficas con Sansation para display y Helvetica Now para cuerpo, y lineamientos de uso para todos los formatos oficiales y digitales.',
        },
        {
          title: 'Sistema de Diseño',
          body: 'Librería de componentes y tokens de diseño en Figma (Neon Velocity), compartida con el equipo de diseño para una producción visual consistente y directamente traducida a la implementación en Tailwind CSS del sitio.',
        },
        {
          title: 'Piezas Visuales',
          body: 'Perfiles de miembros para Instagram (3:4) y LinkedIn (1:1), piezas de convocatoria para nuevos integrantes, materiales de recaudación incluyendo la Gran Rifa Candelaria, y contenido de redes sociales.',
        },
        {
          title: 'Coordinación del Equipo',
          body: 'Planificación y supervisión de un equipo de diseño de 5 personas: delegación de tareas de producción, revisión de calidad visual y alineación de decisiones de diseño con la estrategia de ingeniería y comunicación del semillero.',
        },
      ],
      brandPaletteLabel: 'Paleta de marca',

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
            "Sistema de diseño 'Neon Velocity' en Figma: tipografía, paleta, componentes y 6 pantallas con scroll cinematográfico mobile-first.",
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
            'Modelo de datos en PostgreSQL con Django 4.2 + DRF: 13+ modelos, auth dual con JWT para usuarios internos y externos, Supabase para gamificación.',
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
            'SPA en React 19 con Vite 7, i18n completo (ES/EN) y checkout dual — Stripe y PayU — con verificación HMAC-SHA256.',
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
            'Optimización de queries (select_related, prefetch_related), compresión con vite-plugin-imagemin y despliegue monolítico en Vercel.',
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
        'Candelaria fue el proyecto que me obligó a pensar como <<product engineer>>, no solo como desarrollador. Decisiones de arquitectura como cuándo usar Django vs Supabase, cómo modelar el sistema de tiers o cómo abstraer dos proveedores de pago requirieron razonar sobre <<trade-offs reales>>, no solo implementar features.',
        'El mayor aprendizaje fue diseñar para <<dos audiencias completamente distintas>>: un seguidor externo que quiere apoyar con un clic, y un líder de equipo que necesita administrar personas y publicar contenido. Construir una sola plataforma que sirva a ambos sin que ninguno sienta que la interfaz no fue pensada para él fue el reto de diseño más interesante del proyecto.',
        'Sostener al mismo tiempo el <<liderazgo de diseño>> y el <<desarrollo técnico>> reveló una ventaja concreta: cuando eres quien establece las reglas de marca y quien las implementa en código, cualquier inconsistencia aparece de inmediato. El costo es que también cargas con cada inconsistencia solo.',
      ],

      stackKicker: 'Herramientas usadas',
      stackTitle: 'Construido en solitario con',
      stackHint: 'Pasa el cursor sobre los badges',

      ctaVisit: 'Visitar el sitio',
      ctaCode: 'Ver en GitHub',
    },
    sensewave: {
      title: 'SenseWave',
      subtitle: 'Una marca especulativa de neurotecnología que explora interfaces neurales directas para restaurar la sensación humana.',

      // Un proyecto, tres caras — la franja en la que aparece decide cuál.
      faceProduct: 'Las gafas Sense Eco y un sistema de dos chips: el hardware que convierte la sensación grabada de otra persona en señal neural.',
      faceDigital: 'La capa de interfaz que cura una biblioteca sensorial donada y le da al receptor control sobre qué siente y cuándo.',
      faceVisual: 'Un sistema de marca construido sobre la empatía y no sobre el espectáculo — identidad, lenguaje y movimiento para una tecnología que debe inspirar confianza.',

      heroPeriod: 'Sensewave · Diseño Especulativo · 2024',
      heroH1: '¿Y si los recuerdos',
      heroH2: 'pudieran volver a',
      heroHAccent: 'sentirse?',
      heroSub: 'Una marca especulativa de neurotecnología que diseña la reconexión emocional a través de experiencias sensoriales inmersivas, para personas que han perdido el acceso a las actividades que alguna vez las definieron.',
      heroTags: ['Diseño Especulativo', 'Neurotecnología', 'Identidad de Marca', 'Estrategia UX'],

      s2: 'El Problema Humano',
      s3: 'La Tecnología',
      s4: 'El Sistema de Donación',
      s5: 'Sistema de Marca',
      s6: 'Experiencia Digital',
      s7: 'Producto Físico',
      s8: 'Proceso de Diseño',
      s9: 'Exhibición y Reconocimiento',

      problemQuote: 'Cada día, miles de personas viven con el recuerdo de sensaciones que ya no pueden sentir.',
      problemP1: 'No el evento. La sensación. El frío de un descenso en montaña. La ingravidez del agua abierta. El ritmo de una carrera entre la niebla matutina.',
      problemP2: 'La discapacidad física, adquirida o degenerativa, corta más que la movilidad. Corta el lenguaje que el cuerpo usaba para hablar.',
      statA: { value: '1.3B', label: 'Personas viviendo con discapacidad significativa a nivel global' },
      statB: { value: '70%', label: 'Reportan la pérdida sensorial como su privación más definitoria' },

      techH1: 'Sense Eco.',
      techHAccent: 'Un sistema,',
      techH2: 'no un dispositivo.',
      techP: 'SenseWave combina dos tecnologías trabajando en conjunto. Las gafas Sense Eco son la capa de interfaz. Un sistema de chips propietario conecta la señal digital con la memoria neural.',
      chips: [
        { name: 'Chill Chip', tagline: 'Capa de Sensación Ambiental', desc: 'Procesa datos sensoriales de baja intensidad: cambios de temperatura, viento, presión ambiental. Traduce el contexto ambiental continuo en señal neural de fondo.' },
        { name: 'Complex Chip', tagline: 'Capa de Experiencia Dinámica', desc: 'Maneja datos multisensoriales de alta fidelidad: propiocepción, retroalimentación cinestésica, reproducción de memoria muscular. La diferencia entre conciencia y experiencia vivida.' },
      ],

      donorH1: 'Experiencias donadas.',
      donorHAccent: 'Recuerdos compartidos.',
      donorP: 'Lo que hace único a SenseWave no es la tecnología. Es la fuente. Personas reales que voluntariamente graban y comparten sus experiencias sensoriales, no como datos, sino como regalos.',
      donorTransfer: 'Transferencia de Experiencia',
      donorLabel: 'Donante',
      recipientLabel: 'Receptor',
      donorCards: [
        { symbol: '○', title: 'El Donante', desc: 'Un atleta, un bailarín, un nadador: cualquier persona con una experiencia sensorial significativa que desea compartir con alguien que ha perdido el acceso a ella.' },
        { symbol: '◇', title: 'El Intercambio', desc: 'Las experiencias se graban a través del sistema Sense Eco, se verifican en calidad y se anonimizan antes de ingresar a la biblioteca.' },
        { symbol: '●', title: 'El Receptor', desc: 'Recibe una biblioteca sensorial curada. No es simulación: es una huella genuina de una persona real, entregada libremente.' },
      ],

      brandH1: 'Identidad construida',
      brandHPre: 'sobre la',
      brandHAccent: 'empatía.',
      brandP: 'El lenguaje visual de SenseWave es intencionalmente silencioso. La marca da un paso atrás, permitiendo que la historia humana, no la tecnología, sea el centro. Cada elemento sirve a la narrativa emocional.',
      colorLabel: 'Sistema de Color',
      typoLabel: 'Tipografía · Display',
      typoDisplay: 'Vuélvelo a sentir.',
      typoSub: 'Reconexión emocional a través del diseño.',
      typoRoles: [
        { role: 'Display', name: 'Libre Baskerville' },
        { role: 'UI / Cuerpo', name: 'Roboto Mono' },
      ],

      digitalH1: 'Una interfaz',
      digitalHAccent: 'tan silenciosa',
      digitalH2: 'como la experiencia.',
      digitalP: 'El producto digital de SenseWave está diseñado para desaparecer. La interfaz sirve a la narrativa, no a la tecnología, llevando a los usuarios a la experiencia en lugar de a la interfaz.',

      physicalH1: 'Objetos que',
      physicalHAccent: 'cargan con la memoria.',

      processH1: 'Proceso arraigado',
      processHPre: 'en la',
      processHAccent: 'empatía.',
      processSteps: [
        { phase: '01', title: 'Investigación y Empatía', desc: 'Entrevistas y observación con personas que viven con discapacidades físicas. Identificar la brecha emocional, no la funcional.' },
        { phase: '02', title: 'Desarrollo del Concepto', desc: 'Marco tecnológico especulativo. Definición del concepto de sistema de donación. Posicionamiento de marca y estrategia narrativa.' },
        { phase: '03', title: 'Identidad Visual', desc: 'Exploración del sistema de logo. Selección tipográfica. Estrategia de color probada en entornos oscuros y ambientales.', highlight: true },
        { phase: '04', title: 'Digital y Físico', desc: 'Diseño simultáneo de la interfaz digital y el lenguaje de producto físico. Coherencia en todos los puntos de contacto.' },
        { phase: '05', title: 'Preparación para la Exhibición', desc: 'Adaptación de la narrativa para audiencias académicas y de diseño. Artefactos físicos y materiales de presentación.' },
      ],

      exhibPeriod: 'Universidad de los Andes · 2024',
      exhibTitle: 'Seleccionado para la Exhibición Anual de Diseño',
      exhibP: 'SenseWave fue seleccionado entre los proyectos destacados de la cohorte por su consistencia visual, claridad emocional y la solidez de su marco de diseño especulativo.',
      exhibTags: ['Consistencia Visual', 'Cohesión de Marca', 'Diseño Especulativo'],

      reflLabel: 'Reflexión Final',
      reflQuote: 'La tecnología más poderosa es aquella que te hace olvidar que está ahí.',
      reflP1: 'SenseWave me enseñó que el diseño especulativo es más poderoso cuando hace preguntas humanas, no tecnológicas. La marca no trata sobre lo que puede hacer la tecnología: trata sobre lo que significa para alguien que ha estado esperando volver a sentirse vivo.',
      reflP2: 'Este proyecto cambió la forma en que pienso sobre el diseño emocional: que la interfaz debe servir al momento de conexión, no interrumpirlo.',
      reflTags: ['Diseño Emocional', 'Futuros Especulativos', 'Sistemas de Marca', 'Interfaces Experienciales', 'Tecnología Centrada en el Ser Humano'],
    },
    humbral: {
      tag: 'Proyecto Académico · Mobiliario',
      title: 'El Humbral',
      subtitle:
        'Una mesa de centro modular compuesta por dos módulos intercambiables, donde el usuario decide cuál cara queda arriba.',
      faceProduct: 'Dos estructuras idénticas, dos superficies distintas. Cambiar cuál queda arriba transforma el carácter de la mesa — sin herramientas ni herrajes.',
      faceVisual: 'Un patrón que parte del estudio de la geometría precolombina y del trabajo de Antonio Grass, reescrito sobre la propia cuadrícula de la mesa.',

      metaRole: 'Rol',
      metaDimensions: 'Dimensiones',
      metaStatus: 'Estado',
      metaContext: 'Contexto',
      dimsShort: '410 × 410 × 310 mm',
      role: 'Diseño de Producto · Fabricación Digital',
      period: '2026',
      status: 'Prototipo 1:5',
      course: 'Memoria de diseño · 2026-408',

      heroKicker: 'El Humbral · Mesa de centro modular · 2026',
      heroH1: 'No existe una',
      heroH2: 'cara correcta.',
      heroSub: 'Una mesa de centro que parte de una idea sencilla: la pieza cambia según qué cara elijas mostrar.',
      heroTags: ['Mobiliario', 'Diseño de Producto', '3D', 'Materiales', 'Corte Láser'],

      s1: 'Concepto',
      s2: 'El Patrón',
      s3: 'Sistema Constructivo',
      s4: 'Vistas y Dimensiones',
      s5: 'Configuraciones',
      s6: 'La Mesa en Uso',
      s7: 'Prototipo Físico',

      conceptQuote: 'No existe una configuración correcta. La mesa cambia dependiendo de qué cara se quiera destacar.',
      conceptP1: 'El Humbral es una mesa de centro modular compuesta por dos módulos que pueden cambiar de posición. Ambos tienen la misma estructura, pero cada uno presenta una superficie diferente: uno incorpora un patrón grabado en madera y el otro una abertura circular con vidrio.',
      conceptP2: 'La intención principal fue trabajar con la idea de reversibilidad. En lugar de definir una única forma de usar la mesa, los dos módulos pueden intercambiarse y generar dos configuraciones diferentes: la decisión de qué elemento queda arriba es del usuario.',
      conceptP3: 'El proyecto se desarrolló como maqueta a escala 1:5 en MDF, cortada y grabada con láser, a partir de un modelo 3D en el que se verificaron dimensiones, encajes y puntos de contacto antes de fabricar.',

      thresholdTitle: 'El umbral entre la madera y el vidrio',
      thresholdP1: 'El nombre viene de la idea de un umbral como punto de transición entre dos espacios: un lugar que no pertenece por completo a ninguno de los dos, sino que funciona como conexión entre ellos.',
      thresholdP2: 'Esta idea se lleva al objeto mediante dos caras. Una está relacionada con la madera, la textura y el recorrido del patrón; la otra con el vidrio, la transparencia y el vacío. Con el patrón arriba la mesa se percibe más sólida y cerrada; con el vidrio arriba, más abierta y ligera.',
      thresholdP3: 'La referencia a las lagunas y a la cultura muisca aparece como una conexión con el territorio: en el altiplano cundiboyacense las lagunas tuvieron un papel importante dentro de las creencias y los rituales, y la de Guatavita está asociada a ofrendas que más adelante dieron origen al mito de El Dorado. El proyecto no representa esos rituales: toma de ellos la idea de tránsito entre dos mundos.',

      stepsTitle: 'El proyecto en cuatro pasos',
      steps: [
        { n: '01', title: 'Estudio del patrón', desc: 'Digitalización de la gráfica derivada de Antonio Grass y ajuste sobre una malla de 0.5 cm.' },
        { n: '02', title: 'Modelado 3D', desc: 'Verificación de dimensiones, encajes, centrado del marco y apilado de los dos módulos.' },
        { n: '03', title: 'Corte y grabado', desc: 'Piezas en MDF distribuidas en formato tabloide; corte y grabado láser en una sola pasada.' },
        { n: '04', title: 'Ensamble y prueba', desc: 'Pegado de marco y patas, comprobación de los topes y de las dos configuraciones.' },
      ],

      patternTitle: 'Referencia a Antonio Grass',
      patternP1: 'El patrón de la cara de madera parte de una exploración de geometrías asociadas a la gráfica precolombina y al trabajo de Antonio Grass. Su obra estudió y reinterpretó formas presentes en la iconografía precolombina, llevándolas a composiciones geométricas contemporáneas.',
      patternP2: 'Para El Humbral no se tomó una pieza específica como copia. La intención fue estudiar recursos como líneas, módulos, repeticiones, escalonados y geometrías para construir un patrón propio.',
      patternP3: 'De ese estudio salieron tres grabados. Los dos primeros se probaron directamente sobre MDF: uno de trazado ortogonal y otro de composición radial. El tercero, ya depurado, es el que quedó en la pieza final.',
      patternP4: 'La versión radial tenía una relación más directa con algunas formas precolombinas, pero terminó descartándose porque no dialogaba con la estructura ortogonal de la mesa.',

      patternFig1: 'Primer grabado sobre MDF: trazado ortogonal derivado del estudio de la gráfica de Grass.',
      patternFig2: 'Segundo grabado sobre MDF: composición radial, descartada frente a la geometría de la mesa.',
      patternFig3: 'Grabado definitivo: el trazado ortogonal depurado sobre una cuadrícula de 16 × 16 celdas.',

      gridTitle: 'Del boceto a la malla',
      gridP1: 'Primero se identificaron las líneas principales y se organizó el dibujo sobre una cuadrícula. A partir de esa base se ajustaron los recorridos y las repeticiones hasta conseguir una composición más limpia.',
      gridP2: 'El patrón final trabaja con medidas de 0.5 y 1 cm en la maqueta —25 y 50 mm en el producto real— y mantiene ángulos rectos en todo el recorrido.',
      gridSpecs: 'Malla 16 × 16 celdas · Celda 0.5 cm maqueta / 25 mm real · Área 8 × 8 cm / 400 × 400 mm',

      adaptTitle: 'Del primer grabado al definitivo',
      adaptP1: 'El grabado final parte del primero (Fig. 2.1), pero reescrito sobre la geometría del propio mueble: el ancho de las líneas se llevó al grosor de los soportes y las patas —60 mm en el producto real, 1.2 cm en la maqueta— y los quiebres se alinearon con la misma cuadrícula que ordena el marco y los topes.',
      adaptP2: 'Ese cambio de espesor también resolvió un problema de fabricación: las líneas delgadas de la primera versión se quemaban de forma irregular sobre el MDF, mientras que el trazo ancho se graba limpio y se lee desde lejos. El patrón deja de ser un dibujo aplicado sobre la superficie y pasa a ser una extensión del sistema de medidas con el que está construida la mesa.',

      constructTitle: 'Sistema constructivo',
      constructP1: 'Cada módulo funciona como una pieza independiente. Está compuesto por un tablero superior, un marco inferior y cuatro patas.',
      constructP2: 'El tablero mide 410 × 410 mm, con 45 mm de espesor. Debajo va el marco o «madre», de 430 × 430 mm, que recibe las cuatro patas. Cada pata tiene una sección de 60 × 60 mm y una altura de 110 mm.',
      constructP3: 'La estructura se diseñó para que las patas queden contenidas dentro del marco y no tengan desplazamientos importantes. Las piezas se unen por pegado, evitando herrajes visibles.',
      constructP4: 'Para apilar los dos módulos se agregaron pequeños topes en las esquinas de la cara superior. Estos topes reproducen el espacio que existe dentro del marco inferior: al colocar un módulo encima, sus patas caen dentro de ese espacio y los dos cuerpos quedan centrados.',
      constructP5: 'La unión entre módulos no necesita ser permanente: se basa en el propio peso, el encaje y la geometría de las piezas.',

      logicTitle: 'Lógica del sistema',
      logic: [
        '1 · Tablero — define la superficie visible de cada módulo: patrón grabado en uno, ventana de vidrio en el otro.',
        '2 · Marco — funciona como estructura, recibe las patas y mantiene la unión rígida con el tablero.',
        '3 · Patas y topes — permiten apoyar el módulo en el piso y recibir el segundo módulo encima, sin herrajes.',
      ],
      logicNote: 'Los dos módulos son prácticamente iguales en estructura y distintos solo en la superficie que presentan.',

      partsTitle: 'Piezas de un módulo, de arriba abajo',
      parts: '8 topes de esquina · 60 × 60 × 15 mm\n1 vidrio · Ø 300 mm\n1 anillo superior · Ø 300 / Ø 270 mm\n1 anillo inferior · Ø 300 / Ø 270 mm\n1 tablero · 410 × 410 × 45 mm\n1 marco «madre» · 430 × 430 × 15 mm\n4 patas · 60 × 60 × 110 mm',
      partsNote: 'Los dos anillos se pegan uno sobre otro dentro del hueco del tablero y forman la plataforma sobre la que apoya el vidrio, que queda a ras de la cara superior.',

      stackNote: 'El apilado funciona porque la geometría se repite: el hueco de esquina del marco, abajo, y el par de topes, arriba, tienen exactamente la misma medida que la sección de la pata (60 × 60 mm).',

      viewsIntro: 'Las vistas de esta lámina están dibujadas a escala 1:5 sobre el modelo 3D verificado: cada pieza ocupa en el papel exactamente lo mismo que en la maqueta. Las cotas indican las medidas reales del producto, en milímetros.',
      viewTop: 'Vista superior',
      viewBottom: 'Vista inferior',
      viewSide: 'Vista lateral',
      viewIso: 'Perspectiva isométrica',

      dimsTitle: 'Dimensiones generales · producto real',
      dims: 'Tablero — 410 × 410 × 45 mm\nMarco («madre») — 430 × 430 × 15 mm\nPatas — 60 × 60 × 110 mm\nTopes de esquina — 60 × 60 × 15 mm\nVentana — Ø 300 mm (anillo interior Ø 270 mm)',
      dimsHeight: 'Altura de un módulo — 155 mm\nAltura total, dos módulos apilados — 310 mm',

      notesTitle: 'Notas',
      note1: 'La maqueta se construyó a escala 1:5 en MDF, con tableros de 4.5 mm y piezas finas de 1.5 mm, equivalentes a 45 y 15 mm en el producto real.',
      note2: 'Las patas quedan contenidas en el hueco de esquina del marco; los topes superiores repiten ese mismo hueco sobre el tablero para recibir el módulo que se apila encima.',

      configIntro: 'Los dos módulos son intercambiables. Cambiar cuál queda arriba no modifica la estructura ni requiere herramientas: se levanta un módulo y se apoya sobre el otro, encajando las patas en los topes de esquina. Cada configuración cambia el carácter de la mesa y el tipo de uso que favorece.',
      configATitle: 'Configuración A · patrón arriba',
      configAP1: 'El módulo con el patrón grabado queda en la parte superior. La superficie es continua y de madera, con mayor presencia visual, y el conjunto se percibe más sólido y cerrado.',
      configAP2: 'Favorece el uso como superficie de apoyo permanente: bandejas, libros, tazas o control remoto. El nivel inferior, con la ventana, queda como espacio de guardado a la vista.',
      configBTitle: 'Configuración B · vidrio arriba',
      configBP1: 'El módulo con la ventana circular queda arriba. La abertura se convierte en el elemento principal, deja ver el nivel inferior y aligera visualmente el conjunto.',
      configBP2: 'Funciona cuando la mesa actúa como vitrina: lo que se guarda abajo queda expuesto a través del vidrio. La superficie también resulta más fácil de limpiar.',

      useIntro: 'Ambientación de las dos configuraciones con objetos de uso cotidiano en una mesa de centro: libros, bandeja, taza y una planta pequeña. Las escenas se construyeron con el mismo modelo 3D y a la misma escala, para comprobar la relación entre el mueble y los objetos que sostiene.',
      useFig1: 'Configuración con el patrón arriba: superficie continua para apoyo y lectura, con el nivel inferior libre para guardar.',
      useFig2: 'Configuración con el vidrio arriba: lo que se guarda en el nivel inferior queda a la vista a través de la ventana.',

      protoTitle: 'Prototipo físico',
      protoP1: 'El prototipo permitió comprobar físicamente las decisiones tomadas durante el modelado digital.',
      protoP2: 'A través del corte y el ensamblaje fue posible revisar las dimensiones del marco, la posición de las patas, el funcionamiento de los topes y la relación entre los dos módulos.',
      protoP3: 'También sirvió para identificar ajustes antes de definir la versión final: la posición exacta de los topes se corrigió a partir de lo observado en la maqueta.',

      verifyTitle: 'Qué se verificó',
      verify: 'Encaje de la pata en el hueco de esquina del marco\nCentrado del marco respecto al tablero\nApilado y centrado de los dos módulos\nLegibilidad del grabado sobre MDF\nEstabilidad del conjunto armado',
      verifySpecs: 'Maqueta a escala 1:5 · MDF de 4.5 y 1.5 mm · corte y grabado láser · uniones pegadas.',

      protoFig1: 'Conjunto apilado: el módulo con ventana sobre el módulo grabado.',
      protoFig2: 'Los dos módulos vistos desde arriba: superficie grabada y ventana.',
      protoFig3: 'Módulo con ventana y marco «madre» antes del ensamblaje.',
      protoFig4: 'Vista superior del conjunto: el grabado del módulo inferior visto a través de la ventana.',

      photoNoteTitle: 'Sobre el registro fotográfico',
      photoNote: 'Las tomas originales se hicieron en el taller, sobre la mesa de corte y con instrumentos de medición a la vista. Para esta memoria se procesaron digitalmente: se retiraron el fondo y los elementos ajenos, y las cuatro fotografías se llevaron a una misma superficie neutra y a una misma iluminación. El objetivo es poder comparar las piezas entre sí y leer el sistema constructivo sin distracciones.',

      specsTitle: 'Datos del proyecto',
      specs: 'Tipología — Mesa de centro modular\nMateriales — MDF · vidrio / acrílico\nDimensiones — 410 × 410 × 310 mm\nMódulos — 2, intercambiables\nFabricación — Corte y grabado láser · uniones pegadas\nMaqueta — Escala 1:5',
    },
    bloom: {
      tag: 'Trabajo con Cliente · Arquitectura de Información',
      title: 'Bloom',
      subtitle:
        'Rehacer la taxonomía de contenido de una plataforma de salud femenina — de 75 tags sueltos a 28 que caben en un teléfono.',

      metaRole: 'Rol',
      metaClient: 'Cliente',
      metaTeam: 'Equipo',
      role: 'Investigación UX · Arquitectura de Información · Wireframing',
      period: '2025',
      status: 'Entregado',
      client: 'Bloom / BeBloomers',
      collaboration: 'En colaboración con otro diseñador',

      heroKicker: 'Bloom · Arquitectura de información · 2025',
      heroH1: 'Setenta y cinco tags',
      heroH2: 'que nadie podía usar.',
      heroSub: 'Mi primer trabajo real con cliente: el rediseño completo de cómo Bloom clasifica cada artículo, podcast y taller que publica.',
      heroTags: ['Investigación UX', 'Arquitectura de Información', 'Wireframing', 'Taxonomía'],

      s1: 'El Encargo',
      s2: 'El Problema',
      s3: 'Tres Versiones',
      s4: 'El Sistema en Uso',
      s5: 'Wireframes',
      s6: 'Reflexión',

      briefP1: 'Bloom —BeBloomers— publica artículos, podcasts, talleres y guías sobre salud y bienestar femenino. El equipo convocó a dos diseñadores para rehacer el sitio web desde cero.',
      briefP2: 'Trabajé en dos frentes: wireframes completos y pequeños prototipos del nuevo sitio, y la reclasificación completa de los tags y categorías de todos los productos digitales que publican.',
      briefP3: 'Esta página recorre ambos: primero la taxonomía, porque cambió cómo funciona el producto, y después los wireframes, donde esa estructura se vuelve pantallas.',

      problemQuote: 'Una taxonomía no es una lista de palabras. Es la forma de lo que a un lector se le permite encontrar.',
      problemP1: 'El sistema original había acumulado 75 tags únicos. Se habían ido agregando a medida que se publicaba contenido, nunca se podaron y nunca se contrastaron entre sí — así que varios describían lo mismo con distintos niveles de especificidad.',
      problemP2: 'La consecuencia no era desorden, era alcance: con una lista de tags tan larga, filtrar deja de ser un atajo y se convierte en un segundo problema de búsqueda. La mayoría de lectoras de Bloom llegan desde un teléfono, donde una fila de filtros que se desplaza sin fin sencillamente no se usa.',

      versionsIntro: 'En lugar de proponer una respuesta, construí tres, cada una una postura defendible sobre el mismo eje: ¿cuánto se puede comprimir una taxonomía antes de que deje de poder describir el contenido?',
      v1Title: 'V1 · Original recategorizado',
      v1Count: '75 tags',
      v1Desc: 'Los tags existentes reorganizados bajo cinco categorías —Cuerpo, Mente, Relaciones, Sexo, Cultura— y sin duplicados. Esta versión demuestra que las categorías se sostienen, pero conserva el problema de volumen.',
      v2Title: 'V2 · Agrupación lógica',
      v2Count: '46 tags',
      v2Desc: 'Tags condensados en conceptos y no en formulaciones. Lo bastante precisa para que Bloom AI recomiende con exactitud, todavía pesada para una fila de filtros en móvil.',
      v3Title: 'V3 · Acceso simplificado',
      v3Count: '28 tags',
      v3Desc: 'La recomendación. Menos del 40% del conteo original, balanceada entre las cinco categorías, y lo bastante corta para que el filtro completo quepa en una pantalla de teléfono.',
      v3Badge: 'Sweet spot',

      tradeoffTitle: 'El trade-off, dicho sin rodeos',
      tradeoffP1: 'V3 no es gratis. Condensar los tags hace que las recomendaciones de Bloom AI sean menos precisas que en V2 — hay menos distinciones sobre las cuales razonar. La recomendé igual, y lo dejé escrito en el entregable, porque la realidad móvil pesa más que esa pérdida: un filtro que nadie abre no produce ninguna recomendación.',
      tradeoffP2: 'También marqué el piso. Reducir por debajo de 28 dejaría tags tan generales que dejan de discriminar entre piezas, y el sistema pasaría de simplificado a inútil.',

      bridgeTitle: 'Tags compartidos como puentes',
      bridgeP1: 'La decisión más útil no fue la reducción, fue el solapamiento. Seis tags viven deliberadamente en más de una categoría — hormonas, maternidad, deseo sexual, gestión emocional, LGTBIQ+, ginecología.',
      bridgeP2: 'Esos tags compartidos son los que permiten que Bloom AI conecte un artículo archivado en Cuerpo con un podcast archivado en Mente. A quien lee sobre menopausia y hormonas se le puede señalar ansiedad y gestión emocional, porque la taxonomía misma codifica esa relación.',
      bridgeP3: 'El tinte que muestra ese solapamiento existe solo en la especificación. Para quien lee el sitio, el puente es invisible — simplemente siente que las recomendaciones la entienden.',

      structureTitle: 'Estructura final · 28 tags en 5 categorías',
      categories: [
        { name: 'Cuerpo', count: '12', tags: 'menstruación · anticonceptivos · embarazo · fertilidad · menopausia · endometriosis · ITS · cuidado personal · hormonas · maternidad · deseo sexual · ginecología' },
        { name: 'Mente', count: '7', tags: 'ansiedad · autoestima · salud mental · depresión · autoconocimiento · hormonas · gestión emocional' },
        { name: 'Relaciones', count: '7', tags: 'pareja · familia · maternidad · comunidad · relaciones tóxicas · gestión emocional · LGTBIQ+' },
        { name: 'Sexo', count: '5', tags: 'sexualidad · deseo sexual · educación sexual · LGTBIQ+ · hormonas' },
        { name: 'Cultura', count: '5', tags: 'feminismo · teen · entretenimiento · ginecología · LGTBIQ+' },
      ],

      caseTitle: 'Cómo vive un contenido en el sistema',
      caseIntro: 'Cada pieza tiene una categoría más dos a cinco tags. Los tags marcados son mixtos — aparecen en contenidos de otras categorías, y Bloom AI los lee como puentes para recomendación cruzada. Pasa el cursor sobre uno para ver qué conecta.',

      explorerLabel: 'Explorador de taxonomía',
      explorerHint: 'Cambia de versión para ver cómo se comprime la taxonomía. Pasa el cursor sobre un tag para encontrar todas las categorías donde vive.',
      explorerTags: 'tags',
      explorerShared: 'Compartido entre categorías',
      explorerLang: 'Los tags aparecen tal como se entregaron al cliente.',
      caseFormats: ['Artículo', 'Podcast', 'Guía'],
      caseBridge: 'Puente',

      wfTitle: 'Cada pantalla se dibujó primero para un celular',
      wfStat: '+80%',
      wfStatLabel: 'de los usuarios de Bloom ya leían desde un celular o dispositivo móvil, según las analíticas revisadas antes de empezar el trabajo.',
      wfP1: 'Ese dato definió el lienzo. Todos los wireframes se construyeron a 390 px de ancho, así que la jerarquía, las zonas táctiles y el largo de cada scroll se decidieron donde de verdad están las lectoras — no se adaptaron después desde un diseño de escritorio.',
      wfP2: 'También es la razón por la que la taxonomía tenía que caber en una pantalla: los filtros, la grilla de contenido y Bloom IA comparten la misma columna angosta.',
      wfViewerHint: 'Haz scroll dentro del celular, o déjalo correr.',
      wfScreens: [
        { key: 'home', name: 'Inicio', desc: 'La portada completa: propuesta de valor, acceso directo a Bloom IA y el contenido agrupado por formato.' },
        { key: 'article', name: 'Artículo', desc: 'Lectura larga con términos clave marcados en el texto, contenido relacionado a mitad de lectura y personalización de temas al final.' },
        { key: 'program', name: 'Podcast', desc: 'La ficha de un programa: presentadoras, episodios filtrables por temporada, invitada o tag, y suscripción a novedades.' },
        { key: 'ia', name: 'Bloom IA', desc: 'La landing del asistente: qué es, la evidencia detrás de sus respuestas y cómo una pregunta se vuelve una respuesta.' },
        { key: 'community', name: 'Comunidad', desc: 'Eventos, grupos de WhatsApp y Bloom House — la parte de Bloom que pasa fuera de la pantalla.' },
      ],
      wfFlowTitle: 'Leer un artículo, paso a paso',
      wfFlow: [
        'El artículo, con términos clave marcados.',
        'El menú global, a un toque.',
        'Tocar un término ofrece la explicación de Bloom IA.',
        'Bloom IA responde con el artículo como contexto.',
        'Sigue explorando: contenido relacionado por formato.',
      ],

      reflLabel: 'Reflexión',
      reflQuote: 'El mejor argumento que di en este proyecto fue a favor de la versión que rendía peor sobre el papel.',
      reflP1: 'Trabajar con un cliente real me enseñó que una recomendación solo sirve si viene con su costo adjunto. Presentar tres versiones en lugar de una convirtió la conversación de «¿te gusta?» a «¿cuál trade-off quieres?», y esa es una conversación en la que un cliente sí puede participar.',
      reflP2: 'También me enseñó que la arquitectura de información es el trabajo de diseño con más apalancamiento y menos visibilidad. Nadie va a elogiar jamás una lista de tags. Pero cada recomendación que hace la plataforma pasa por ahí.',
      reflTags: ['Arquitectura de Información', 'Diseño de Taxonomías', 'Comunicación con Cliente', 'Restricciones Mobile-First'],
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
