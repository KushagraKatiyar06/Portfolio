// ─────────────────────────────────────────────
//  COMMON PORTFOLIO DATABASE
//  Edit this file to update BOTH 3D and 2D sites
// ─────────────────────────────────────────────

export const profile = {
  name: 'Kushagra Katiyar',
  title: 'CS @ University of Florida · Full-Stack Developer',
  location: 'Lake Mary, Florida',
  bio: "I'm pursuing a bachelor's in Computer Science at the University of Florida. I specialize in Full-Stack development but have experience in Product Management and UI/UX Design. I've shipped real-world applications and hold leadership roles on campus demonstrating skills in teamwork, communication, and problem-solving. Outside of tech my interests include gaming, cars, and Taekwondo — and I post flute videos on TikTok, accumulating over 500,000 views.",
  avatar: '/assets/profile.jpg',
  resume: '/assets/Kushagra_Katiyar_Software_Engineering_Resume.pdf',
}

export const social = [
  { href: 'https://github.com/KushagraKatiyar06',         icon: '/assets/github_icon.svg',    label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/kushagrakatiyar/', icon: '/assets/linkedin_icon.svg',  label: 'LinkedIn' },
  { href: 'https://www.instagram.com/just_kushagra/',     icon: '/assets/instagram_icon.svg', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@just_kushagra',        icon: '/assets/tiktok_icon.svg',    label: 'TikTok' },
]

// Each skill: { label, icon } — icon is a /assets/*.svg path (or null)
export const skills = {
  Languages: [
    { label: 'Python',      icon: '/assets/python.svg' },
    { label: 'C++',         icon: '/assets/cpp.svg' },
    { label: 'JavaScript',  icon: '/assets/javascript.svg' },
    { label: 'TypeScript',  icon: '/assets/typescript.svg' },
    { label: 'HTML',        icon: '/assets/html.svg' },
    { label: 'CSS',         icon: '/assets/css.svg' },
    { label: 'Java',        icon: '/assets/java.svg' },
    { label: 'Kotlin',      icon: '/assets/kotlin.svg' },
    { label: 'MATLAB',      icon: '/assets/matlab.svg' },
  ],
  Frameworks: [
    { label: 'React',       icon: '/assets/react.svg' },
    { label: 'Next.js',     icon: '/assets/nextjs.svg' },
    { label: 'Node.js',     icon: '/assets/nodejs.svg' },
    { label: 'Flask',       icon: '/assets/flask.svg' },
    { label: 'Vite',        icon: '/assets/vite.svg' },
    { label: 'Expo',        icon: '/assets/expo.svg' },
  ],
  Databases: [
    { label: 'PostgreSQL',  icon: '/assets/postgres.svg' },
  ],
  DevOps: [
    { label: 'Docker',      icon: '/assets/docker.svg' },
    { label: 'AWS',         icon: '/assets/aws.svg' },
    { label: 'GCP',         icon: '/assets/gcp.svg' },
    { label: 'Cloudflare',  icon: '/assets/cloudflare.svg' },
  ],
  'AI / ML': [
    { label: 'OpenAI',      icon: '/assets/openai.svg' },
    { label: 'Gemini',      icon: '/assets/gemini.svg' },
    { label: 'TensorFlow',  icon: '/assets/tensorflow.svg' },
    { label: 'MediaPipe',   icon: '/assets/mediapipe.svg' },
    { label: 'OpenCV',      icon: '/assets/opencv.svg' },
  ],
  Design: [
    { label: 'Figma',       icon: '/assets/figma.svg' },
    { label: 'Framer',      icon: '/assets/framer.svg' },
    { label: 'ShadCN',      icon: '/assets/shadcn.svg' },
    { label: 'AdobeXD',     icon: '/assets/adobexd.svg' },
  ],
  Other: [
    { label: 'Socket.io',   icon: '/assets/socket.svg' },
    { label: 'FFmpeg',      icon: '/assets/ffmpeg.svg' },
    { label: 'OBS',         icon: '/assets/obs.svg' },
    { label: 'Canva',       icon: '/assets/canva.svg' },
    { label: 'Notion',      icon: '/assets/notion.svg' },
    { label: 'Crow',        icon: '/assets/crow.svg' },
  ],
}

// ─────────────────────────────────────────────
//  EXPERIENCE
//  type: 'experience' | 'leadership' | 'involvement'
// ─────────────────────────────────────────────
export const experiences = [
  {
    type: 'experience',
    org: 'Virtual Learning Lab',
    role: 'Undergraduate Research Assistant',
    duration: 'January 2026 – Present',
    location: 'University of Florida',
    logo: null,
    bullets: [
      'Building LLM evaluation pipeline to score decodable text quality across K-12 literacy dataset of 400+ stories',
      'Automated text telemetry using GPT-2 perplexity and syntactic dependency parsing',
      'Developing RAG pipeline for 100+ stories and 100,000+ characters with 90% reduction in prompt token costs',
    ],
    stack: [
      { label: 'Python',  icon: '/assets/python.svg' },
      { label: 'OpenAI',  icon: '/assets/openai.svg' },
    ],
  },
  {
    type: 'experience',
    org: 'English2Success',
    role: 'Software Engineer',
    duration: 'February 2025 – July 2025',
    location: 'Remote',
    logo: null,
    bullets: [
      'Developed full-stack Agentic AI automation using Flask and Python for 450+ global users',
      'Reduced manual administrative overhead by 8+ hours weekly',
      'Automated email pipeline using Gmail API with OAuth2, sending 50+ weekly reminders',
    ],
    stack: [
      { label: 'Python',        icon: '/assets/python.svg' },
      { label: 'Flask',         icon: '/assets/flask.svg' },
      { label: 'GCP',           icon: '/assets/gcp.svg' },
      { label: 'OpenAI',        icon: '/assets/openai.svg' },
      { label: 'Google Sheets', icon: '/assets/googlesheets.svg' },
      { label: 'Google Forms',  icon: '/assets/googleforms.svg' },
    ],
  },
  {
    type: 'leadership',
    org: 'UF GatorAI',
    role: 'Webmaster',
    duration: 'January 2026 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Contributing to full-stack development of GatorAI\'s official web platform serving 500+ members',
      'Managing 12+ officer roles across platform integrations',
      'Built with Next.js 14 frontend and Supabase PostgreSQL backend',
      'Engineered real-time search with multi-field semantic search functionality',
    ],
    stack: [
      { label: 'Next.js',      icon: '/assets/nextjs.svg' },
      { label: 'PostgreSQL',   icon: '/assets/postgres.svg' },
      { label: 'TypeScript',   icon: '/assets/typescript.svg' },
      { label: 'JavaScript',   icon: '/assets/javascript.svg' },
      { label: 'HTML',         icon: '/assets/html.svg' },
      { label: 'CSS',          icon: '/assets/css.svg' },
    ],
  },
  {
    type: 'leadership',
    org: 'UF GatorAI',
    role: 'Software Team Lead',
    duration: 'September 2025 – January 2026',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Led end-to-end software development of full-stack Agentic AI video generation platform',
      'Designed pipeline orchestrating OpenAI GPT-4o, Flux-Schnell, AWS Polly, and FFmpeg',
      'Achieved 5× cost reduction ($1 → $0.20 per minute)',
    ],
    stack: [
      { label: 'Python',      icon: '/assets/python.svg' },
      { label: 'Next.js',     icon: '/assets/nextjs.svg' },
      { label: 'PostgreSQL',  icon: '/assets/postgres.svg' },
      { label: 'Docker',      icon: '/assets/docker.svg' },
      { label: 'AWS',         icon: '/assets/aws.svg' },
      { label: 'Cloudflare',  icon: '/assets/cloudflare.svg' },
      { label: 'Figma',       icon: '/assets/figma.svg' },
      { label: 'FFmpeg',      icon: '/assets/ffmpeg.svg' },
    ],
  },
  {
    type: 'leadership',
    org: 'Computing Student Union',
    role: 'UI/UX Design Team Lead',
    duration: 'August 2025 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Managed UI/UX strategy for campus-wide portal serving 200 CS students and 25 organizations',
      'Spearheaded cross-functional team of 5 designers using Scrum',
      'Developed high-fidelity Figma prototypes with ShadCN Library, resulting in 100 new active users',
    ],
    stack: [
      { label: 'Figma',  icon: '/assets/figma.svg' },
      { label: 'ShadCN', icon: '/assets/shadcn.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'Dream Team Engineering',
    role: 'Software Engineer',
    duration: 'January 2026 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Building Android app automating Train-of-Four anesthesia testing using MediaPipe diagnostics',
      'Hit 90% diagnostic accuracy across 400+ video simulations',
    ],
    stack: [
      { label: 'Java',      icon: '/assets/java.svg' },
      { label: 'OpenCV',    icon: '/assets/opencv.svg' },
      { label: 'MediaPipe', icon: '/assets/mediapipe.svg' },
      { label: 'Kotlin',    icon: '/assets/kotlin.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'Swamp Records',
    role: 'Software Engineer',
    duration: 'January 2026 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Developing full-stack site for signed artist Alex Willow',
      'Translating Figma prototypes into reusable component library',
      'Managing 50+ monthly listeners',
    ],
    stack: [
      { label: 'HTML',       icon: '/assets/html.svg' },
      { label: 'CSS',        icon: '/assets/css.svg' },
      { label: 'JavaScript', icon: '/assets/javascript.svg' },
      { label: 'Next.js',    icon: '/assets/nextjs.svg' },
      { label: 'Vite',       icon: '/assets/vite.svg' },
      { label: 'React',      icon: '/assets/react.svg' },
      { label: 'Figma',      icon: '/assets/figma.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'Gator User Design',
    role: 'UI/UX Designer',
    duration: 'October 2025 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Executed user research for UF CSFG Lab website using qualitative analysis',
      'Architected design system and high-fidelity interactive prototypes in Figma',
      'Communicated design through user journey maps and affinity boards',
    ],
    stack: [
      { label: 'Figma', icon: '/assets/figma.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'GatorAI',
    role: 'Social Media Officer',
    duration: 'July 2025 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Boosted Instagram engagement by 2×, driving 150,000+ impressions in a single month',
      'Represented GatorAI at tabling events, bringing in 200+ attendees',
      'Designed scenes/graphics on OBS for weekly AI/ML lecture streams (900+ views/semester)',
    ],
    stack: [
      { label: 'Canva', icon: '/assets/canva.svg' },
      { label: 'OBS',   icon: '/assets/obs.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'Computing Student Union',
    role: 'Membership Director',
    duration: 'May 2025 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Organized social events for 20+ UFCSU tech team members',
      'Led recruitment workflows using Google Forms',
      'Tracked metrics in Notion and Google Sheets',
    ],
    stack: [
      { label: 'Google Forms',  icon: '/assets/googleforms.svg' },
      { label: 'Notion',        icon: '/assets/notion.svg' },
      { label: 'Google Sheets', icon: '/assets/googlesheets.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'Computing Student Union',
    role: 'UI/UX Designer',
    duration: 'January 2025 – Present',
    location: 'Gainesville, Florida',
    logo: null,
    bullets: [
      'Designed UI/UX for 3+ products serving 100+ CS students and 25+ computing clubs',
      'Integrated ShadCN components for modern industry standards',
      'Developed and iterated 3-5 Figma prototypes per product',
    ],
    stack: [
      { label: 'Figma',  icon: '/assets/figma.svg' },
      { label: 'ShadCN', icon: '/assets/shadcn.svg' },
    ],
  },
  {
    type: 'involvement',
    org: 'TikTok',
    role: 'Content Creator',
    duration: 'December 2025 – Present',
    location: 'Lake Mary, Florida',
    logo: null,
    bullets: [
      'Posts flute videos accumulating 500,000+ cumulative views',
      'Grown to 800+ followers',
    ],
    stack: [],
  },
]

// ─────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────
export const projects = {
  live: [
    {
      name: 'Riva',
      subtitle: 'Agentic AI Browser & GTM Tool',
      image: null,
      live: 'https://riva-frontend.pages.dev/',
      github: 'https://github.com/KushagraKatiyar06/Riva',
      video: 'https://youtu.be/WZFLMwTHqyA',
      figma: 'https://www.figma.com/design/k1YBhnEym2hMqIpKttI21B/Riva',
      users: '~5',
      stack: [
        { label: 'Next.js 15',   icon: '/assets/nextjs.svg' },
        { label: 'React 19',     icon: '/assets/react.svg' },
        { label: 'TypeScript',   icon: '/assets/typescript.svg' },
        { label: 'Python',       icon: '/assets/python.svg' },
        { label: 'Cloudflare',   icon: '/assets/cloudflare.svg' },
        { label: 'Gemini',       icon: '/assets/gemini.svg' },
      ],
    },
    {
      name: 'KeyFrame',
      subtitle: 'Agentic AI Slideshow Generator',
      image: null,
      live: 'https://keyframe-frontend-production.up.railway.app/',
      github: 'https://github.com/KushagraKatiyar06/KeyFrame',
      video: 'https://youtu.be/6y8f5fl7FBA',
      figma: 'https://www.figma.com/design/3hl9m1ituYwaVpuVeSLTGG/KeyFrame',
      users: '~5',
      stack: [
        { label: 'Python',      icon: '/assets/python.svg' },
        { label: 'Next.js',     icon: '/assets/nextjs.svg' },
        { label: 'PostgreSQL',  icon: '/assets/postgres.svg' },
        { label: 'AWS',         icon: '/assets/aws.svg' },
        { label: 'Cloudflare',  icon: '/assets/cloudflare.svg' },
        { label: 'OpenAI',      icon: '/assets/openai.svg' },
        { label: 'FFmpeg',      icon: '/assets/ffmpeg.svg' },
      ],
    },
    {
      name: 'Steam Search',
      subtitle: 'Game Recommendation Engine',
      image: null,
      live: 'https://steamsearch-production-622f.up.railway.app/',
      github: 'https://github.com/KushagraKatiyar06/SteamSearch',
      video: null,
      figma: 'https://www.figma.com/design/Gm8e6fNthEUQoPD2yOUdr1/Steam-Search',
      users: '~5',
      stack: [
        { label: 'C++',   icon: '/assets/cpp.svg' },
        { label: 'Crow',  icon: '/assets/crow.svg' },
        { label: 'React', icon: '/assets/react.svg' },
        { label: 'AWS',   icon: '/assets/aws.svg' },
      ],
    },
  ],
  technical: [
    {
      name: 'Buddy, Lock In!',
      subtitle: '3D Multiplayer Computer Vision Game',
      badge: 'Hackathon Winner',
      video: 'https://www.youtube.com/watch?v=SI3UrrGbyZo',
      github: 'https://github.com/NSang22/buddylockin',
      stack: [
        { label: 'React',      icon: '/assets/react.svg' },
        { label: 'Node.js',    icon: '/assets/nodejs.svg' },
        { label: 'Vite',       icon: '/assets/vite.svg' },
        { label: 'Blender',    icon: '/assets/blender.svg' },
        { label: 'Socket.io',  icon: '/assets/socket.svg' },
        { label: 'MediaPipe',  icon: '/assets/mediapipe.svg' },
        { label: 'Gemini',     icon: '/assets/gemini.svg' },
      ],
    },
    {
      name: 'UseProtechtion',
      subtitle: 'Agentic AI Malware Tracking System',
      badge: 'Hackathon Winner',
      live: 'https://useprotechtion.k-katiyar2006.workers.dev',
      github: 'https://github.com/KushagraKatiyar06/useprotech.tion',
      video: 'https://www.youtube.com/watch?v=DujEn2ixbS0&t=6s',
      stack: [
        { label: 'Python',   icon: '/assets/python.svg' },
        { label: 'Next.js',  icon: '/assets/nextjs.svg' },
        { label: 'Docker',   icon: '/assets/docker.svg' },
      ],
    },
  ],
  design: [
    {
      name: 'Not My First Swamp',
      subtitle: 'AI Powered UF Routine Builder',
      badge: 'Designathon Winner',
      live: 'https://notmyfirstswamp.framer.website/',
      video: 'https://www.youtube.com/watch?v=65fP_CaYL_U',
      stack: [
        { label: 'Framer',     icon: '/assets/framer.svg' },
        { label: 'ShadCN',     icon: '/assets/shadcn.svg' },
        { label: 'TypeScript', icon: '/assets/typescript.svg' },
        { label: 'Gemini',     icon: '/assets/gemini.svg' },
      ],
    },
    {
      name: 'Student Club Management Portal',
      subtitle: 'Computing Student Union',
      figma: 'https://www.figma.com/design/oHhMlu5Mf3uzGOKRc3q7YL/Computing-Student-Union',
      stack: [
        { label: 'Figma',  icon: '/assets/figma.svg' },
        { label: 'ShadCN', icon: '/assets/shadcn.svg' },
      ],
    },
    {
      name: 'CFSG UF Research Lab Redesign',
      subtitle: 'UI/UX Research Project',
      figma: 'https://www.figma.com/design/VDXqeQGoIH2rbVGeHfXZj0/Computing-For-Social-Good',
      stack: [
        { label: 'Figma',  icon: '/assets/figma.svg' },
        { label: 'Canva',  icon: '/assets/canva.svg' },
      ],
    },
    {
      name: 'RTS Ride Redesign',
      subtitle: 'Public Bus Tracking App',
      figma: 'https://www.figma.com/design/L88Lrfqj2GbR6ms9eAUEzm/Gainesville-RTS-Ride-Redesign',
      video: 'https://youtu.be/oSKMU-Bmg8U',
      stack: [
        { label: 'Figma',  icon: '/assets/figma.svg' },
        { label: 'ShadCN', icon: '/assets/shadcn.svg' },
        { label: 'Canva',  icon: '/assets/canva.svg' },
      ],
    },
    {
      name: 'FloridaFun',
      subtitle: 'Amusement Park Mobile & Web Screens',
      stack: [
        { label: 'AdobeXD', icon: '/assets/adobexd.svg' },
        { label: 'Canva',   icon: '/assets/canva.svg' },
      ],
    },
  ],
}
