/*
  ZEMIVO LIVING 3D WORLD
  Global Content Understanding Foundation
  Version: 2.0.0

  Security:
  - No Firebase
  - No Auth
  - No Firestore
  - No RTDB
  - No Storage
  - No Admin access
  - No Wallet / ZMV access
  - No direct AI/model access

  The engine only converts validated content signals
  into a safe visual profile.
*/


/* =========================================================
   CORE
========================================================= */

const ENGINE_VERSION = "2.0.0";

const MODES = [
  "personal",
  "ocean",
  "nature",
  "music",
  "gaming",
  "automotive",
  "product",
  "space"
];

const MOODS = [
  "neutral",
  "calm",
  "happy",
  "romantic",
  "dramatic",
  "energetic",
  "luxury",
  "mysterious",
  "futuristic",
  "peaceful",
  "warm",
  "cool"
];

const MOTIONS = [
  "slow",
  "gentle",
  "flow",
  "pulse",
  "dynamic",
  "orbit",
  "wave",
  "minimal"
];


/* =========================================================
   GLOBAL VISUAL PROFILES
========================================================= */

const WORLD_PROFILES = {

  personal: {
    mode: "personal",
    mood: "neutral",
    motion: "minimal",
    primary: "#2563eb",
    secondary: "#60a5fa",
    intensity: 0.28,
    lighting: 0.75,
    depth: 0.45,
    particleDensity: 0.35,
    cameraMotion: 0.12
  },

  ocean: {
    mode: "ocean",
    mood: "calm",
    motion: "wave",
    primary: "#0284c7",
    secondary: "#38bdf8",
    intensity: 0.62,
    lighting: 0.8,
    depth: 0.8,
    particleDensity: 0.7,
    cameraMotion: 0.22
  },

  nature: {
    mode: "nature",
    mood: "peaceful",
    motion: "flow",
    primary: "#16a34a",
    secondary: "#4ade80",
    intensity: 0.58,
    lighting: 0.82,
    depth: 0.76,
    particleDensity: 0.62,
    cameraMotion: 0.18
  },

  music: {
    mode: "music",
    mood: "energetic",
    motion: "pulse",
    primary: "#9333ea",
    secondary: "#ec4899",
    intensity: 0.82,
    lighting: 0.9,
    depth: 0.68,
    particleDensity: 0.9,
    cameraMotion: 0.3
  },

  gaming: {
    mode: "gaming",
    mood: "futuristic",
    motion: "dynamic",
    primary: "#06b6d4",
    secondary: "#8b5cf6",
    intensity: 0.9,
    lighting: 0.95,
    depth: 0.86,
    particleDensity: 1,
    cameraMotion: 0.38
  },

  automotive: {
    mode: "automotive",
    mood: "luxury",
    motion: "dynamic",
    primary: "#64748b",
    secondary: "#38bdf8",
    intensity: 0.7,
    lighting: 0.86,
    depth: 0.92,
    particleDensity: 0.5,
    cameraMotion: 0.26
  },

  product: {
    mode: "product",
    mood: "luxury",
    motion: "slow",
    primary: "#f59e0b",
    secondary: "#fde68a",
    intensity: 0.52,
    lighting: 1,
    depth: 0.88,
    particleDensity: 0.28,
    cameraMotion: 0.1
  },

  space: {
    mode: "space",
    mood: "mysterious",
    motion: "orbit",
    primary: "#4f46e5",
    secondary: "#a78bfa",
    intensity: 0.76,
    lighting: 0.72,
    depth: 1,
    particleDensity: 0.95,
    cameraMotion: 0.32
  }

};


/* =========================================================
   SAFE HELPERS
========================================================= */

function clamp(value, min, max){

  const number =
    Number(value);

  if(!Number.isFinite(number)){
    return min;
  }

  return Math.min(
    max,
    Math.max(min, number)
  );

}


function safeText(value){

  if(
    typeof value !== "string"
  ){
    return "";
  }

  return value
    .normalize("NFKC")
    .slice(0, 10000);

}


function safeArray(value){

  if(!Array.isArray(value)){
    return [];
  }

  return value
    .slice(0, 100)
    .filter(
      item =>
        typeof item === "string"
    )
    .map(
      item =>
        item
          .normalize("NFKC")
          .slice(0, 300)
    );

}


function safeMode(mode){

  return MODES.includes(mode)
    ? mode
    : "personal";

}


function safeMood(mood){

  return MOODS.includes(mood)
    ? mood
    : "neutral";

}


function safeMotion(motion){

  return MOTIONS.includes(motion)
    ? motion
    : "minimal";

}


function safeColor(color){

  if(
    typeof color !== "string"
  ){
    return "#2563eb";
  }

  const value =
    color.trim();

  if(
    /^#[0-9a-fA-F]{6}$/.test(value)
  ){
    return value;
  }

  return "#2563eb";

}


/* =========================================================
   COLOR UTILITIES
========================================================= */

function hexToRgb(hex){

  const value =
    safeColor(hex)
      .replace("#","");

  return {

    r:
      parseInt(
        value.slice(0,2),
        16
      ),

    g:
      parseInt(
        value.slice(2,4),
        16
      ),

    b:
      parseInt(
        value.slice(4,6),
        16
      )

  };

}


function rgbToHex(r,g,b){

  return "#" +
    [r,g,b]
      .map(
        value =>
          Math.round(
            clamp(
              value,
              0,
              255
            )
          )
          .toString(16)
          .padStart(2,"0")
      )
      .join("");

}


function blendColors(
  colorA,
  colorB,
  amount
){

  const a =
    hexToRgb(colorA);

  const b =
    hexToRgb(colorB);

  const t =
    clamp(
      amount,
      0,
      1
    );

  return rgbToHex(

    a.r +
      (b.r - a.r) * t,

    a.g +
      (b.g - a.g) * t,

    a.b +
      (b.b - a.b) * t

  );

}


/* =========================================================
   LANGUAGE / SCRIPT DETECTION
   Language detection is only a hint.
   It does NOT decide the visual world.
========================================================= */

function detectScripts(text){

  const value =
    safeText(text);

  const result = [];

  const tests = [

    [
      "Latin",
      /[A-Za-zÀ-ÖØ-öø-ÿ]/
    ],

    [
      "Bengali",
      /[\u0980-\u09FF]/
    ],

    [
      "Arabic",
      /[\u0600-\u06FF]/
    ],

    [
      "Persian",
      /[\u067E-\u06FF]/
    ],

    [
      "Urdu",
      /[\u0600-\u06FF]/
    ],

    [
      "Devanagari",
      /[\u0900-\u097F]/
    ],

    [
      "Cyrillic",
      /[\u0400-\u04FF]/
    ],

    [
      "Greek",
      /[\u0370-\u03FF]/
    ],

    [
      "Hebrew",
      /[\u0590-\u05FF]/
    ],

    [
      "Thai",
      /[\u0E00-\u0E7F]/
    ],

    [
      "Georgian",
      /[\u10A0-\u10FF]/
    ],

    [
      "Armenian",
      /[\u0530-\u058F]/
    ],

    [
      "Ethiopic",
      /[\u1200-\u137F]/
    ],

    [
      "Hangul",
      /[\uAC00-\uD7AF]/
    ],

    [
      "CJK",
      /[\u4E00-\u9FFF]/
    ],

    [
      "Hiragana",
      /[\u3040-\u309F]/
    ],

    [
      "Katakana",
      /[\u30A0-\u30FF]/
    ]

  ];

  for(
    const test of tests
  ){

    if(
      test[1].test(value)
    ){

      result.push(
        test[0]
      );

    }

  }

  return result;

}


/* =========================================================
   GLOBAL SEMANTIC SIGNALS
========================================================= */

const SEMANTIC_SIGNAL_MAP = {

  ocean: {

    terms: [
      "ocean",
      "sea",
      "beach",
      "wave",
      "waves",
      "island",
      "diving",
      "surf",
      "marine",
      "water",
      "সমুদ্র",
      "সাগর",
      "ঢেউ",
      "পানি",
      "समुद्र",
      "समुद्रतट",
      "بحر",
      "محيط",
      "海",
      "海洋",
      "바다"
    ],

    mode:
      "ocean"

  },


  nature: {

    terms: [
      "nature",
      "forest",
      "tree",
      "trees",
      "mountain",
      "river",
      "lake",
      "flower",
      "flowers",
      "garden",
      "rain",
      "green",
      "wildlife",
      "animal",
      "animals",
      "জঙ্গল",
      "বন",
      "গাছ",
      "পাহাড়",
      "নদী",
      "ফুল",
      "বৃষ্টি",
      "प्रकृति",
      "वन",
      "पहाड़",
      "नदी",
      "طبيعة",
      "غابة",
      "جبل",
      "طبيعة",
      "自然",
      "森林",
      "山",
      "강",
      "산"
    ],

    mode:
      "nature"

  },


  music: {

    terms: [
      "music",
      "song",
      "sing",
      "singer",
      "concert",
      "beat",
      "dance",
      "dj",
      "album",
      "guitar",
      "piano",
      "drum",
      "মিউজিক",
      "গান",
      "গায়ক",
      "নাচ",
      "সুর",
      "संगीत",
      "गाना",
      "नृत्य",
      "موسيقى",
      "أغنية",
      "رقص",
      "音楽",
      "歌",
      "음악",
      "노래"
    ],

    mode:
      "music"

  },


  gaming: {

    terms: [
      "game",
      "gaming",
      "gamer",
      "play",
      "player",
      "esports",
      "console",
      "arcade",
      "battle",
      "level",
      "quest",
      "character",
      "গেম",
      "গেমিং",
      "খেলা",
      "গেমার",
      "संगीत",
      "गेम",
      "खेल",
      "لعبة",
      "ألعاب",
      "游戏",
      "遊戲",
      "게임"
    ],

    mode:
      "gaming"

  },


  automotive: {

    terms: [
      "car",
      "cars",
      "vehicle",
      "automotive",
      "motorcycle",
      "bike",
      "engine",
      "racing",
      "race",
      "speed",
      "driving",
      "truck",
      "গাড়ি",
      "মোটরসাইকেল",
      "রেস",
      "গতি",
      "वाहन",
      "कार",
      "रेस",
      "سيارة",
      "سباق",
      "سيارات",
      "車",
      "自動車",
      "자동차"
    ],

    mode:
      "automotive"

  },


  product: {

    terms: [
      "product",
      "shop",
      "shopping",
      "store",
      "sale",
      "buy",
      "sell",
      "price",
      "brand",
      "fashion",
      "clothing",
      "phone",
      "laptop",
      "watch",
      "beauty",
      "product review",
      "পণ্য",
      "দোকান",
      "কেনাকাটা",
      "বিক্রি",
      "দাম",
      "ফ্যাশন",
      "পোশাক",
      "সৌন্দর্য",
      "उत्पाद",
      "दुकान",
      "खरीद",
      "बिक्री",
      "منتج",
      "متجر",
      "شراء",
      "بيع",
      "商品",
      "购物",
      "製品",
      "제품",
      "쇼핑"
    ],

    mode:
      "product"

  },


  space: {

    terms: [
      "space",
      "planet",
      "planets",
      "galaxy",
      "galaxies",
      "universe",
      "star",
      "stars",
      "moon",
      "mars",
      "cosmos",
      "astronaut",
      "rocket",
      "nasa",
      "মহাকাশ",
      "গ্রহ",
      "নক্ষত্র",
      "চাঁদ",
      "মঙ্গল",
      "বিশ্বব্রহ্মাণ্ড",
      "अंतरिक्ष",
      "ग्रह",
      "चंद्रमा",
      "ब्रह्मांड",
      "فضاء",
      "كوكب",
      "قمر",
      "كون",
      "宇宙",
      "惑星",
      "月",
      "우주",
      "행성"
    ],

    mode:
      "space"

  }

};


/* =========================================================
   MOOD SIGNALS
========================================================= */

const MOOD_SIGNALS = {

  calm: [
    "calm",
    "peace",
    "peaceful",
    "relax",
    "relaxing",
    "quiet",
    "meditation",
    "sleep",
    "শান্ত",
    "শান্তি",
    "আরাম",
    "ধ্যান",
    "सुकून",
    "शांति",
    "هدوء",
    "سلام",
    "平静",
    "安静"
  ],

  happy: [
    "happy",
    "happiness",
    "joy",
    "fun",
    "smile",
    "laugh",
    "celebration",
    "party",
    "আনন্দ",
    "হাসি",
    "উৎসব",
    "खुशी",
    "मुस्कान",
    "فرح",
    "سعادة",
    "笑",
    "楽しい"
  ],

  romantic: [
    "love",
    "romantic",
    "romance",
    "couple",
    "wedding",
    "heart",
    "valentine",
    "ভালোবাসা",
    "প্রেম",
    "বিয়ে",
    "হৃদয়",
    "प्यार",
    "शादी",
    "حب",
    "رومانسية",
    "愛",
    "恋"
  ],

  dramatic: [
    "dramatic",
    "dark",
    "danger",
    "storm",
    "fire",
    "war",
    "tragedy",
    "ভয়",
    "ঝড়",
    "আগুন",
    "বিপদ",
    "युद्ध",
    "तूफान",
    "خطر",
    "عاصفة",
    "火",
    "嵐"
  ],

  energetic: [
    "energy",
    "energetic",
    "fast",
    "action",
    "sport",
    "football",
    "cricket",
    "fitness",
    "workout",
    "race",
    "দ্রুত",
    "শক্তি",
    "খেলাধুলা",
    "ফুটবল",
    "ক্রিকেট",
    "ऊर्जा",
    "खेल",
    "طاقة",
    "رياضة",
    "エネルギー"
  ],

  luxury: [
    "luxury",
    "premium",
    "expensive",
    "exclusive",
    "elegant",
    "royal",
    "luxurious",
    "লাক্সারি",
    "প্রিমিয়াম",
    "দামী",
    "অভিজাত",
    "विलासिता",
    "प्रीमियम",
    "فاخر",
    "راقي",
    "高級"
  ],

  futuristic: [
    "future",
    "futuristic",
    "technology",
    "tech",
    "robot",
    "ai",
    "cyber",
    "digital",
    "innovation",
    "ভবিষ্যৎ",
    "প্রযুক্তি",
    "রোবট",
    "ডিজিটাল",
    "भविष्य",
    "तकनीक",
    "روبوت",
    "تقنية",
    "未来",
    "テクノロジー"
  ],

  mysterious: [
    "mystery",
    "mysterious",
    "unknown",
    "secret",
    "space",
    "dark",
    "cosmic",
    "রহস্য",
    "অজানা",
    "গোপন",
    "महस्य",
    "रहस्य",
    "غامض",
    "سر",
    "神秘"
  ]

};


/* =========================================================
   MOTION SIGNALS
========================================================= */

const MOTION_SIGNALS = {

  slow: [
    "slow",
    "calm",
    "sleep",
    "meditation",
    "শান্ত",
    "ঘুম",
    "ধ্যান"
  ],

  gentle: [
    "soft",
    "gentle",
    "peace",
    "romantic",
    "ভালোবাসা",
    "নরম",
    "শান্তি"
  ],

  flow: [
    "river",
    "water",
    "wind",
    "cloud",
    "nature",
    "ocean",
    "নদী",
    "পানি",
    "বাতাস",
    "মেঘ",
    "সমুদ্র"
  ],

  pulse: [
    "music",
    "beat",
    "song",
    "dance",
    "মিউজিক",
    "গান",
    "নাচ"
  ],

  dynamic: [
    "gaming",
    "game",
    "race",
    "sport",
    "action",
    "fast",
    "গেম",
    "রেস",
    "খেলাধুলা",
    "দ্রুত"
  ],

  orbit: [
    "space",
    "planet",
    "galaxy",
    "cosmos",
    "মহাকাশ",
    "গ্রহ",
    "নক্ষত্র"
  ]

};


/* =========================================================
   TERM MATCHING
========================================================= */

function normalizeForMatching(text){

  return safeText(text)
    .toLocaleLowerCase()
    .replace(
      /[.,!?;:()[\]{}"'“”‘’/\\|_+=*#@~`<>-]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();

}


function scoreTerms(
  text,
  terms
){

  const normalized =
    normalizeForMatching(
      text
    );

  if(!normalized){
    return 0;
  }

  let score = 0;

  for(
    const term of terms
  ){

    const normalizedTerm =
      normalizeForMatching(
        term
      );

    if(
      !normalizedTerm
    ){
      continue;
    }

    if(
      normalized.includes(
        normalizedTerm
      )
    ){

      score +=
        normalizedTerm.length > 5
        ? 2
        : 1;

    }

  }

  return score;

}


/* =========================================================
   COLOR ANALYSIS
========================================================= */

function analyzePalette(
  dominantColors
){

  if(
    !Array.isArray(
      dominantColors
    ) ||
    dominantColors.length === 0
  ){

    return {
      primary: null,
      secondary: null,
      strength: 0
    };

  }

  const valid =
    dominantColors
      .filter(
        color =>
          typeof color === "string" &&
          /^#[0-9a-fA-F]{6}$/.test(
            color.trim()
          )
      )
      .slice(
        0,
        5
      );

  if(
    valid.length === 0
  ){

    return {
      primary: null,
      secondary: null,
      strength: 0
    };

  }

  return {

    primary:
      valid[0],

    secondary:
      valid[1] ||
      valid[0],

    strength:
      clamp(
        valid.length / 5,
        0,
        1
      )

  };

}


/* =========================================================
   VISUAL PROFILE VALIDATION
========================================================= */

function validateVisualProfile(
  profile
){

  const source =
    profile || {};

  return {

    mode:
      safeMode(
        source.mode
      ),

    mood:
      safeMood(
        source.mood
      ),

    motion:
      safeMotion(
        source.motion
      ),

    primary:
      safeColor(
        source.primary
      ),

    secondary:
      safeColor(
        source.secondary
      ),

    intensity:
      clamp(
        source.intensity,
        0.05,
        1
      ),

    lighting:
      clamp(
        source.lighting,
        0.2,
        1
      ),

    depth:
      clamp(
        source.depth,
        0.1,
        1
      ),

    particleDensity:
      clamp(
        source.particleDensity,
        0,
        1
      ),

    cameraMotion:
      clamp(
        source.cameraMotion,
        0,
        1
      )

  };

}


/* =========================================================
   THREE.JS STATE
========================================================= */

let THREE = null;

let scene = null;
let camera = null;
let renderer = null;

let core = null;
let rings = [];
let particles = [];
let stars = [];

let ambientLight = null;
let mainLight = null;
let pointLight = null;

let animationStarted = false;

let currentProfile =
  validateVisualProfile(
    WORLD_PROFILES.personal
  );

let targetProfile =
  validateVisualProfile(
    WORLD_PROFILES.personal
  );

let pointerX = 0;
let pointerY = 0;


/* =========================================================
   DOM
========================================================= */

const canvas =
  document.getElementById(
    "worldCanvas"
  );

const loading =
  document.getElementById(
    "loading"
  );

const worldName =
  document.getElementById(
    "worldName"
  );

const worldMood =
  document.getElementById(
    "worldMood"
  );

const worldMotion =
  document.getElementById(
    "worldMotion"
  );


/* =========================================================
   WORLD LABELS
========================================================= */

function updateWorldLabels(
  profile
){

  if(worldName){

    worldName.textContent =
      profile.mode
        .charAt(0)
        .toUpperCase() +
      profile.mode.slice(1);

  }

  if(worldMood){

    worldMood.textContent =
      profile.mood;

  }

  if(worldMotion){

    worldMotion.textContent =
      profile.motion;

  }

}


/* =========================================================
   THREE.JS LOADER
========================================================= */

async function loadThreeJS(){

  if(THREE){

    return THREE;

  }

  THREE =
    await import(
      "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js"
    );

  return THREE;

}


/* =========================================================
   INITIALIZE WORLD
========================================================= */

async function initializeWorld(){

  await loadThreeJS();

  if(!canvas){

    return;

  }

  scene =
    new THREE.Scene();

  scene.fog =
    new THREE.FogExp2(
      0x020617,
      0.025
    );


  camera =
    new THREE.PerspectiveCamera(
      60,
      window.innerWidth /
        window.innerHeight,
      0.1,
      100
    );

  camera.position.z =
    7;


  renderer =
    new THREE.WebGLRenderer({

      canvas:
        canvas,

      antialias:
        true,

      alpha:
        true,

      powerPreference:
        "high-performance"

    });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      1.75
    )
  );


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.outputColorSpace =
    THREE.SRGBColorSpace;


  /* LIGHTS */

  ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      0.7
    );

  scene.add(
    ambientLight
  );


  mainLight =
    new THREE.DirectionalLight(
      0xffffff,
      1.2
    );

  mainLight.position.set(
    4,
    5,
    6
  );

  scene.add(
    mainLight
  );


  pointLight =
    new THREE.PointLight(
      0x60a5fa,
      3,
      20
    );

  pointLight.position.set(
    0,
    0,
    3
  );

  scene.add(
    pointLight
  );


  createCore();
  createRings();
  createParticles();
  createStars();

  setupPointer();
  setupResize();

  animationStarted =
    true;

  animate();

  if(loading){

    loading.style.display =
      "none";

  }

}


/* =========================================================
   CORE
========================================================= */

function createCore(){

  const geometry =
    new THREE.IcosahedronGeometry(
      1.35,
      4
    );

  const material =
    new THREE.MeshPhysicalMaterial({

      color:
        currentProfile.primary,

      emissive:
        currentProfile.primary,

      emissiveIntensity:
        0.45,

      roughness:
        0.28,

      metalness:
        0.35,

      transparent:
        true,

      opacity:
        0.9

    });

  core =
    new THREE.Mesh(
      geometry,
      material
    );

  scene.add(
    core
  );

}


/* =========================================================
   RINGS
========================================================= */

function createRings(){

  for(
    let i = 0;
    i < 4;
    i++
  ){

    const geometry =
      new THREE.TorusGeometry(
        1.8 + i * 0.42,
        0.018 + i * 0.006,
        12,
        160
      );

    const material =
      new THREE.MeshBasicMaterial({

        color:
          currentProfile.secondary,

        transparent:
          true,

        opacity:
          0.55 - i * 0.08

      });

    const ring =
      new THREE.Mesh(
        geometry,
        material
      );

    ring.rotation.x =
      Math.random() *
      Math.PI;

    ring.rotation.y =
      Math.random() *
      Math.PI;

    scene.add(
      ring
    );

    rings.push(
      ring
    );

  }

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles(){

  const count =
    900;

  const geometry =
    new THREE.BufferGeometry();

  const positions =
    new Float32Array(
      count * 3
    );

  for(
    let i = 0;
    i < count;
    i++
  ){

    const radius =
      2.5 +
      Math.random() * 7;

    const angle =
      Math.random() *
      Math.PI *
      2;

    const height =
      (
        Math.random() -
        0.5
      ) *
      7;

    positions[i * 3] =
      Math.cos(angle) *
      radius;

    positions[i * 3 + 1] =
      height;

    positions[i * 3 + 2] =
      Math.sin(angle) *
      radius;

  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({

      color:
        currentProfile.secondary,

      size:
        0.035,

      transparent:
        true,

      opacity:
        0.55,

      depthWrite:
        false

    });


  const points =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(
    points
  );

  particles.push(
    points
  );

}


/* =========================================================
   STARS
========================================================= */

function createStars(){

  const count =
    450;

  const geometry =
    new THREE.BufferGeometry();

  const positions =
    new Float32Array(
      count * 3
    );

  for(
    let i = 0;
    i < count;
    i++
  ){

    positions[i * 3] =
      (
        Math.random() -
        0.5
      ) * 40;

    positions[i * 3 + 1] =
      (
        Math.random() -
        0.5
      ) * 25;

    positions[i * 3 + 2] =
      (
        Math.random() -
        0.5
      ) * 40;

  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({

      color:
        0xffffff,

      size:
        0.018,

      transparent:
        true,

      opacity:
        0.65

    });


  const starField =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(
    starField
  );

  stars.push(
    starField
  );

}


/* =========================================================
   POINTER
========================================================= */

function setupPointer(){

  window.addEventListener(
    "pointermove",
    function(event){

      pointerX =
        (
          event.clientX /
          window.innerWidth
        ) * 2 - 1;

      pointerY =
        (
          event.clientY /
          window.innerHeight
        ) * 2 - 1;

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   RESIZE
========================================================= */

function setupResize(){

  window.addEventListener(
    "resize",
    function(){

      if(
        !camera ||
        !renderer
      ){

        return;

      }

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

    }
  );

}


/* =========================================================
   APPLY VISUAL PROFILE
========================================================= */

function applyVisualProfile(
  profile,
  immediate = false
){

  targetProfile =
    validateVisualProfile(
      profile
    );

  if(immediate){

    currentProfile =
      {
        ...targetProfile
      };

    updateVisualObjects();

  }

  updateWorldLabels(
    targetProfile
  );

}


/* =========================================================
   VISUAL OBJECT UPDATE
========================================================= */

function updateVisualObjects(){

  if(!THREE){

    return;

  }


  const primary =
    new THREE.Color(
      currentProfile.primary
    );

  const secondary =
    new THREE.Color(
      currentProfile.secondary
    );


  if(core){

    core.material.color =
      primary;

    core.material.emissive =
      primary;

    core.material.emissiveIntensity =
      0.18 +
      currentProfile.intensity *
      0.55;

    core.scale.setScalar(
      0.95 +
      currentProfile.depth *
      0.18
    );

  }


  for(
    const ring of rings
  ){

    ring.material.color =
      secondary;

    ring.material.opacity =
      0.18 +
      currentProfile.intensity *
      0.5;

  }


  for(
    const particle of particles
  ){

    particle.material.color =
      secondary;

    particle.material.opacity =
      0.18 +
      currentProfile.particleDensity *
      0.55;

    particle.material.size =
      0.018 +
      currentProfile.particleDensity *
      0.035;

  }


  if(pointLight){

    pointLight.color =
      primary;

    pointLight.intensity =
      1.5 +
      currentProfile.lighting *
      2.5;

  }


  if(ambientLight){

    ambientLight.intensity =
      0.3 +
      currentProfile.lighting *
      0.7;

  }

}


/* =========================================================
   SMOOTH PROFILE TRANSITION
========================================================= */

function lerp(
  a,
  b,
  amount
){

  return (
    a +
    (b - a) *
    amount
  );

}


function updateProfileSmoothly(){

  const amount =
    0.035;

  currentProfile.intensity =
    lerp(
      currentProfile.intensity,
      targetProfile.intensity,
      amount
    );

  currentProfile.lighting =
    lerp(
      currentProfile.lighting,
      targetProfile.lighting,
      amount
    );

  currentProfile.depth =
    lerp(
      currentProfile.depth,
      targetProfile.depth,
      amount
    );

  currentProfile.particleDensity =
    lerp(
      currentProfile.particleDensity,
      targetProfile.particleDensity,
      amount
    );

  currentProfile.cameraMotion =
    lerp(
      currentProfile.cameraMotion,
      targetProfile.cameraMotion,
      amount
    );


  currentProfile.primary =
    blendColors(
      currentProfile.primary,
      targetProfile.primary,
      amount
    );

  currentProfile.secondary =
    blendColors(
      currentProfile.secondary,
      targetProfile.secondary,
      amount
    );


  currentProfile.mode =
    targetProfile.mode;

  currentProfile.mood =
    targetProfile.mood;

  currentProfile.motion =
    targetProfile.motion;


  updateVisualObjects();

}


/* =========================================================
   ANIMATION
========================================================= */

let clock =
  0;

function animate(){

  if(!animationStarted){

    return;

  }

  requestAnimationFrame(
    animate
  );

  clock +=
    0.008;

  updateProfileSmoothly();


  if(core){

    const pulse =
      1 +
      Math.sin(
        clock * (
          1.2 +
          currentProfile.intensity *
          2
        )
      ) *
      0.025 *
      currentProfile.intensity;

    core.scale.setScalar(
      pulse
    );

    core.rotation.x +=
      0.0015 +
      currentProfile.cameraMotion *
      0.002;

    core.rotation.y +=
      0.002 +
      currentProfile.intensity *
      0.003;

  }


  rings.forEach(
    function(ring,index){

      const direction =
        index % 2 === 0
        ? 1
        : -1;

      ring.rotation.x +=
        direction *
        (
          0.001 +
          currentProfile.cameraMotion *
          0.003
        );

      ring.rotation.z +=
        direction *
        0.0008;

    }
  );


  particles.forEach(
    function(points){

      points.rotation.y +=
        0.0004 +
        currentProfile.cameraMotion *
        0.0015;

      points.rotation.x +=
        0.00015;

    }
  );


  stars.forEach(
    function(star){

      star.rotation.y +=
        0.00008;

    }
  );


  if(camera){

    camera.position.x +=
      (
        pointerX *
        currentProfile.cameraMotion *
        0.6 -
        camera.position.x
      ) * 0.025;

    camera.position.y +=
      (
        -pointerY *
        currentProfile.cameraMotion *
        0.35 -
        camera.position.y
      ) * 0.025;

    camera.lookAt(
      0,
      0,
      0
    );

  }


  if(renderer){

    renderer.render(
      scene,
      camera
    );

  }

}


/* =========================================================
   MANUAL WORLD CONTROL
========================================================= */

function changeWorld(
  mode
){

  const safe =
    safeMode(
      mode
    );

  const profile =
    WORLD_PROFILES[
      safe
    ];

  applyVisualProfile(
    profile
  );

  return getCurrentProfile();

}


/* =========================================================
   GLOBAL CONTENT ANALYZER
========================================================= */

function analyzeContent(
  input = {}
){

  const data =
    input || {};


  const text =
    safeText(
      data.text
    );

  const tags =
    safeArray(
      data.tags
    );

  const context =
    safeArray(
      data.context
    );


  const combinedText =
    [
      text,
      ...tags,
      ...context
    ]
    .join(" ");


  const scripts =
    detectScripts(
      text
    );


  const contentType =
    typeof data.contentType === "string"
      ? data.contentType
          .toLowerCase()
      : "text";


  /*
    MODE SCORING
  */

  const modeScores = {

    personal: 0,
    ocean: 0,
    nature: 0,
    music: 0,
    gaming: 0,
    automotive: 0,
    product: 0,
    space: 0

  };


  for(
    const key of Object.keys(
      SEMANTIC_SIGNAL_MAP
    )
  ){

    const signal =
      SEMANTIC_SIGNAL_MAP[key];

    const score =
      scoreTerms(
        combinedText,
        signal.terms
      );

    modeScores[
      signal.mode
    ] += score;

  }


  /*
    CONTENT TYPE SIGNAL
  */

  if(
    contentType === "audio"
  ){

    modeScores.music +=
      5;

  }


  if(
    contentType === "video"
  ){

    modeScores.personal +=
      0.5;

  }


  if(
    contentType === "image"
  ){

    modeScores.product +=
      0.3;

  }


  if(
    contentType === "mixed"
  ){

    modeScores.personal +=
      0.4;

  }


  /*
    SELECT MODE
  */

  let selectedMode =
    "personal";

  let highestScore =
    0;

  for(
    const mode of Object.keys(
      modeScores
    )
  ){

    if(
      modeScores[mode] >
      highestScore
    ){

      highestScore =
        modeScores[mode];

      selectedMode =
        mode;

    }

  }


  /*
    MOOD
  */

  const moodScores = {};

  for(
    const mood of Object.keys(
      MOOD_SIGNALS
    )
  ){

    moodScores[mood] =
      scoreTerms(
        combinedText,
        MOOD_SIGNALS[mood]
      );

  }


  let selectedMood =
    "neutral";

  let highestMood =
    0;

  for(
    const mood of Object.keys(
      moodScores
    )
  ){

    if(
      moodScores[mood] >
      highestMood
    ){

      highestMood =
        moodScores[mood];

      selectedMood =
        mood;

    }

  }


  /*
    MOTION
  */

  const motionScores = {};

  for(
    const motion of Object.keys(
      MOTION_SIGNALS
    )
  ){

    motionScores[motion] =
      scoreTerms(
        combinedText,
        MOTION_SIGNALS[motion]
      );

  }


  let selectedMotion =
    "minimal";

  let highestMotion =
    0;

  for(
    const motion of Object.keys(
      motionScores
    )
  ){

    if(
      motionScores[motion] >
      highestMotion
    ){

      highestMotion =
        motionScores[motion];

      selectedMotion =
        motion;

    }

  }


  /*
    AUDIO SIGNALS
  */

  const audioEnergy =
    clamp(
      data.audioEnergy,
      0,
      1
    );

  const audioTempo =
    clamp(
      data.audioTempo,
      0,
      240
    );


  if(
    audioEnergy > 0.7
  ){

    selectedMotion =
      "pulse";

    selectedMood =
      "energetic";

  }


  if(
    audioTempo > 125
  ){

    selectedMotion =
      "pulse";

  }


  /*
    VIDEO MOTION
  */

  const motionLevel =
    clamp(
      data.motionLevel,
      0,
      1
    );


  if(
    motionLevel > 0.75
  ){

    selectedMotion =
      "dynamic";

  }


  /*
    PALETTE
  */

  const palette =
    analyzePalette(
      data.dominantColors
    );


  const baseProfile =
    WORLD_PROFILES[
      selectedMode
    ];


  let primary =
    baseProfile.primary;

  let secondary =
    baseProfile.secondary;


  if(
    palette.primary
  ){

    primary =
      blendColors(
        primary,
        palette.primary,
        0.62
      );

  }


  if(
    palette.secondary
  ){

    secondary =
      blendColors(
        secondary,
        palette.secondary,
        0.55
      );

  }


  /*
    SIGNAL STRENGTH
  */

  const semanticStrength =
    clamp(
      highestScore / 12,
      0,
      1
    );


  const visualIntensity =
    clamp(

      baseProfile.intensity *

      (
        0.72 +
        semanticStrength *
        0.28
      )

      +

      motionLevel *
      0.08

      +

      audioEnergy *
      0.08,

      0.08,
      1

    );


  /*
    GLOBAL PROFILE

    This is the important boundary:
    future AI/server systems can provide
    structured semantic signals here,
    but the visual engine itself only
    accepts validated data.
  */

  const profile =
    validateVisualProfile({

      mode:
        selectedMode,

      mood:
        selectedMood,

      motion:
        selectedMotion,

      primary:
        primary,

      secondary:
        secondary,

      intensity:
        visualIntensity,

      lighting:
        clamp(
          baseProfile.lighting +
          audioEnergy * 0.12,
          0.2,
          1
        ),

      depth:
        clamp(
          baseProfile.depth +
          semanticStrength * 0.1,
          0.1,
          1
        ),

      particleDensity:
        clamp(
          baseProfile.particleDensity +
          motionLevel * 0.15 +
          audioEnergy * 0.12,
          0,
          1
        ),

      cameraMotion:
        clamp(
          baseProfile.cameraMotion +
          motionLevel * 0.12,
          0,
          1
        )

    });


  return {

    profile:
      profile,

    analysis: {

      contentType:
        contentType,

      scripts:
        scripts,

      modeScores:
        modeScores,

      moodScores:
        moodScores,

      motionScores:
        motionScores,

      semanticStrength:
        semanticStrength,

      palette:
        palette

    }

  };

}


/* =========================================================
   AUTOMATIC VISUAL APPLICATION
========================================================= */

function applyContentVisualProfile(
  input
){

  const result =
    analyzeContent(
      input
    );

  applyVisualProfile(
    result.profile
  );

  return result;

}


/* =========================================================
   DEMO ANALYZER
========================================================= */

function analyzeContentDemo(
  text
){

  return applyContentVisualProfile({

    text:
      safeText(text),

    contentType:
      "text"

  });

}


/* =========================================================
   CURRENT PROFILE
========================================================= */

function getCurrentProfile(){

  return {
    ...currentProfile
  };

}


/* =========================================================
   CAPABILITIES
========================================================= */

function getSupportedCapabilities(){

  return {

    version:
      ENGINE_VERSION,

    globalArchitecture:
      true,

    multilingualReady:
      true,

    languageIndependentSemanticInput:
      true,

    scriptDetection:
      true,

    contentTypes: [
      "text",
      "image",
      "video",
      "audio",
      "mixed"
    ],

    visualSignals: [

      "semantic content",
      "content type",
      "dominant colors",
      "motion level",
      "audio energy",
      "audio tempo",
      "tags",
      "context"

    ],

    worlds:
      [...MODES],

    moods:
      [...MOODS],

    motions:
      [...MOTIONS],

    databaseAccess:
      false,

    authenticationAccess:
      false,

    walletAccess:
      false,

    adminAccess:
      false,

    directAIModelAccess:
      false

  };

}


/* =========================================================
   PUBLIC API
========================================================= */

window.ZemivoLivingWorld = Object.freeze({

  version:
    ENGINE_VERSION,

  changeWorld:
    changeWorld,

  analyzeContentDemo:
    analyzeContentDemo,

  analyzeContent:
    analyzeContent,

  applyContentVisualProfile:
    applyContentVisualProfile,

  getCurrentProfile:
    getCurrentProfile,

  getSupportedCapabilities:
    getSupportedCapabilities

});


/* =========================================================
   MANUAL BUTTONS
========================================================= */

document
  .querySelectorAll(
    "[data-world]"
  )
  .forEach(
    function(button){

      button.addEventListener(
        "click",
        function(){

          const mode =
            button.dataset.world;

          changeWorld(
            mode
          );

        }
      );

    }
  );


/* =========================================================
   START
========================================================= */

changeWorld(
  "personal"
);

initializeWorld()
  .catch(
    function(error){

      console.error(
        "Zemivo Living World initialization failed:",
        error
      );

      if(loading){

        loading.textContent =
          "3D World could not start.";

      }

    }
  );
