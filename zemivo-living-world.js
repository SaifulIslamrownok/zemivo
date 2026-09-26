/* =========================================================
   ZEMIVO LIVING 3D WORLD
   Global Visual Engine
   Version: 1.0.0
   ========================================================= */


/* =========================================================
   1. BASIC SECURITY / VALIDATION
   ========================================================= */

const ENGINE_VERSION = "1.0.0";

const ALLOWED_MODES = Object.freeze([
  "personal",
  "ocean",
  "nature",
  "music",
  "gaming",
  "automotive",
  "product",
  "space"
]);

const ALLOWED_MOODS = Object.freeze([
  "calm",
  "fresh",
  "energetic",
  "premium",
  "futuristic",
  "cinematic"
]);

const ALLOWED_MOTION = Object.freeze([
  "subtle",
  "flow",
  "pulse",
  "energy",
  "orbit"
]);


/* =========================================================
   2. WORLD PROFILES
   ========================================================= */

const WORLD_PROFILES = Object.freeze({

  personal: {
    mode: "personal",
    mood: "calm",
    motion: "subtle",

    primary: "#4f8cff",
    secondary: "#8b5cf6",

    intensity: 0.35,

    name: "Personal",

    description:
      "A subtle cinematic environment designed to keep personal content as the main focus."
  },


  ocean: {
    mode: "ocean",
    mood: "fresh",
    motion: "flow",

    primary: "#087fbd",
    secondary: "#38bdf8",

    intensity: 0.75,

    name: "Ocean",

    description:
      "A flowing blue environment inspired by oceans, water and open horizons."
  },


  nature: {
    mode: "nature",
    mood: "fresh",
    motion: "flow",

    primary: "#15803d",
    secondary: "#22c55e",

    intensity: 0.68,

    name: "Nature",

    description:
      "A fresh cinematic environment inspired by forests, leaves, sky and natural landscapes."
  },


  music: {
    mode: "music",
    mood: "energetic",
    motion: "pulse",

    primary: "#a855f7",
    secondary: "#ec4899",

    intensity: 0.85,

    name: "Music",

    description:
      "An audio-inspired environment with rhythmic motion and energetic visual pulses."
  },


  gaming: {
    mode: "gaming",
    mood: "futuristic",
    motion: "energy",

    primary: "#06b6d4",
    secondary: "#7c3aed",

    intensity: 0.95,

    name: "Gaming",

    description:
      "A futuristic high-energy environment designed for gaming and interactive content."
  },


  automotive: {
    mode: "automotive",
    mood: "premium",
    motion: "orbit",

    primary: "#64748b",
    secondary: "#38bdf8",

    intensity: 0.70,

    name: "Automotive",

    description:
      "A premium metallic environment inspired by cars, speed, technology and motion."
  },


  product: {
    mode: "product",
    mood: "premium",
    motion: "subtle",

    primary: "#f59e0b",
    secondary: "#f8fafc",

    intensity: 0.55,

    name: "Product",

    description:
      "A clean premium environment designed to make products feel visually important."
  },


  space: {
    mode: "space",
    mood: "cinematic",
    motion: "orbit",

    primary: "#312e81",
    secondary: "#06b6d4",

    intensity: 0.90,

    name: "Space",

    description:
      "A deep cinematic environment inspired by space, stars, technology and the universe."
  }

});


/* =========================================================
   3. SAFE HELPERS
   ========================================================= */

function safeNumber(
  value,
  fallback,
  minimum,
  maximum
){

  const number =
    Number(value);

  if(
    !Number.isFinite(number)
  ){

    return fallback;

  }

  return Math.min(
    maximum,
    Math.max(
      minimum,
      number
    )
  );

}


function safeMode(value){

  if(
    typeof value !== "string"
  ){

    return "personal";

  }

  if(
    !ALLOWED_MODES.includes(value)
  ){

    return "personal";

  }

  return value;

}


function safeMood(value){

  if(
    typeof value !== "string"
  ){

    return "calm";

  }

  if(
    !ALLOWED_MOODS.includes(value)
  ){

    return "calm";

  }

  return value;

}


function safeMotion(value){

  if(
    typeof value !== "string"
  ){

    return "subtle";

  }

  if(
    !ALLOWED_MOTION.includes(value)
  ){

    return "subtle";

  }

  return value;

}


function safeColor(
  value,
  fallback
){

  if(
    typeof value !== "string"
  ){

    return fallback;

  }

  const validHex =
    /^#[0-9a-fA-F]{6}$/;

  if(
    !validHex.test(value)
  ){

    return fallback;

  }

  return value;

}


/* =========================================================
   4. VISUAL PROFILE VALIDATION
   ========================================================= */

function validateVisualProfile(
  input
){

  const source =
    input &&
    typeof input === "object"
      ?
    input
      :
    {};


  const mode =
    safeMode(
      source.mode
    );


  const base =
    WORLD_PROFILES[mode];


  return {

    mode:
      mode,

    mood:
      safeMood(
        source.mood ||
        base.mood
      ),

    motion:
      safeMotion(
        source.motion ||
        base.motion
      ),

    primary:
      safeColor(
        source.primary,
        base.primary
      ),

    secondary:
      safeColor(
        source.secondary,
        base.secondary
      ),

    intensity:
      safeNumber(
        source.intensity,
        base.intensity,
        0,
        1
      ),

    name:
      base.name,

    description:
      base.description

  };

}


/* =========================================================
   5. DOM ELEMENTS
   ========================================================= */

const canvas =
  document.getElementById(
    "worldCanvas"
  );

const loading =
  document.getElementById(
    "loading"
  );

const securityStatus =
  document.getElementById(
    "securityStatus"
  );

const worldName =
  document.getElementById(
    "worldName"
  );

const worldDescription =
  document.getElementById(
    "worldDescription"
  );

const controls =
  document.getElementById(
    "controls"
  );


/* =========================================================
   6. ENGINE STATE
   ========================================================= */

let THREE = null;

let renderer = null;

let scene = null;

let camera = null;

let clock = null;

let animationFrame = null;

let initialized = false;

let currentProfile =
  validateVisualProfile({
    mode: "personal"
  });


let core = null;

let innerCore = null;

let outerRing = null;

let secondRing = null;

let particleSystem = null;

let starSystem = null;

let ambientLight = null;

let mainLight = null;

let secondaryLight = null;

let pointerX = 0;

let pointerY = 0;

let targetPointerX = 0;

let targetPointerY = 0;


/* =========================================================
   7. CREATE COLOR
   ========================================================= */

function makeColor(
  hex
){

  return new THREE.Color(
    hex
  );

}


/* =========================================================
   8. LOAD THREE.JS
   ========================================================= */

async function loadThreeJS(){

  if(
    THREE
  ){

    return;

  }


  try{

    const module =
      await import(
        "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js"
      );


    THREE =
      module;


    initializeScene();


  }
  catch(error){

    console.error(
      "Zemivo 3D engine failed:",
      error
    );


    if(
      loading
    ){

      loading.textContent =
        "Zemivo 3D engine could not load.";

    }

  }

}


/* =========================================================
   9. INITIALIZE SCENE
   ========================================================= */

function initializeScene(){

  if(
    initialized
  ){

    return;

  }


  if(
    !canvas
  ){

    return;

  }


  scene =
    new THREE.Scene();


  scene.background =
    new THREE.Color(
      "#020617"
    );


  camera =
    new THREE.PerspectiveCamera(
      55,
      window.innerWidth /
      window.innerHeight,
      0.1,
      1000
    );


  camera.position.z =
    8;


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
      2
    )
  );


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  clock =
    new THREE.Clock();


  createLights();

  createCore();

  createRings();

  createParticles();

  createStars();


  window.addEventListener(
    "resize",
    handleResize,
    {
      passive:true
    }
  );


  window.addEventListener(
    "pointermove",
    handlePointerMove,
    {
      passive:true
    }
  );


  initialized =
    true;


  if(
    loading
  ){

    loading.classList.add(
      "hidden"
    );

  }


  applyVisualProfile(
    currentProfile
  );


  animate();

}


/* =========================================================
   10. LIGHTS
   ========================================================= */

function createLights(){

  ambientLight =
    new THREE.AmbientLight(
      "#ffffff",
      1.2
    );


  scene.add(
    ambientLight
  );


  mainLight =
    new THREE.PointLight(
      "#ffffff",
      18,
      30
    );


  mainLight.position.set(
    4,
    4,
    6
  );


  scene.add(
    mainLight
  );


  secondaryLight =
    new THREE.PointLight(
      "#ffffff",
      12,
      25
    );


  secondaryLight.position.set(
    -5,
    -2,
    3
  );


  scene.add(
    secondaryLight
  );

}


/* =========================================================
   11. MAIN CORE
   ========================================================= */

function createCore(){

  const geometry =
    new THREE.IcosahedronGeometry(
      1.55,
      5
    );


  const material =
    new THREE.MeshPhysicalMaterial({

      color:
        "#4f8cff",

      emissive:
        "#1d4ed8",

      emissiveIntensity:
        0.45,

      roughness:
        0.28,

      metalness:
        0.18,

      transparent:
        true,

      opacity:
        0.92

    });


  core =
    new THREE.Mesh(
      geometry,
      material
    );


  scene.add(
    core
  );


  const innerGeometry =
    new THREE.IcosahedronGeometry(
      1.05,
      3
    );


  const innerMaterial =
    new THREE.MeshBasicMaterial({

      color:
        "#ffffff",

      transparent:
        true,

      opacity:
        0.08

    });


  innerCore =
    new THREE.Mesh(
      innerGeometry,
      innerMaterial
    );


  scene.add(
    innerCore
  );

}


/* =========================================================
   12. RINGS
   ========================================================= */

function createRings(){

  const ringGeometry =
    new THREE.TorusGeometry(
      2.1,
      0.035,
      16,
      160
    );


  const ringMaterial =
    new THREE.MeshBasicMaterial({

      color:
        "#4f8cff",

      transparent:
        true,

      opacity:
        0.55

    });


  outerRing =
    new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );


  outerRing.rotation.x =
    Math.PI * 0.42;


  scene.add(
    outerRing
  );


  const secondGeometry =
    new THREE.TorusGeometry(
      2.65,
      0.018,
      12,
      140
    );


  const secondMaterial =
    new THREE.MeshBasicMaterial({

      color:
        "#8b5cf6",

      transparent:
        true,

      opacity:
        0.30

    });


  secondRing =
    new THREE.Mesh(
      secondGeometry,
      secondMaterial
    );


  secondRing.rotation.y =
    Math.PI * 0.32;


  scene.add(
    secondRing
  );

}


/* =========================================================
   13. PARTICLES
   ========================================================= */

function createParticles(){

  const count =
    900;


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
      3.2 +
      Math.random() * 5.5;


    const theta =
      Math.random() *
      Math.PI *
      2;


    const phi =
      Math.acos(
        2 *
        Math.random() -
        1
      );


    positions[
      i * 3
    ] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);


    positions[
      i * 3 + 1
    ] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);


    positions[
      i * 3 + 2
    ] =
      radius *
      Math.cos(phi);

  }


  const geometry =
    new THREE.BufferGeometry();


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
        "#ffffff",

      size:
        0.025,

      transparent:
        true,

      opacity:
        0.65,

      depthWrite:
        false

    });


  particleSystem =
    new THREE.Points(
      geometry,
      material
    );


  scene.add(
    particleSystem
  );

}


/* =========================================================
   14. STARS
   ========================================================= */

function createStars(){

  const count =
    500;


  const positions =
    new Float32Array(
      count * 3
    );


  for(
    let i = 0;
    i < count;
    i++
  ){

    positions[
      i * 3
    ] =
      (Math.random() - 0.5)
      * 80;


    positions[
      i * 3 + 1
    ] =
      (Math.random() - 0.5)
      * 80;


    positions[
      i * 3 + 2
    ] =
      (Math.random() - 0.5)
      * 80;

  }


  const geometry =
    new THREE.BufferGeometry();


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
        "#ffffff",

      size:
        0.018,

      transparent:
        true,

      opacity:
        0.45,

      depthWrite:
        false

    });


  starSystem =
    new THREE.Points(
      geometry,
      material
    );


  scene.add(
    starSystem
  );

}


/* =========================================================
   15. APPLY VISUAL PROFILE
   ========================================================= */

function applyVisualProfile(
  input
){

  const profile =
    validateVisualProfile(
      input
    );


  currentProfile =
    profile;


  if(
    worldName
  ){

    worldName.textContent =
      profile.name;

  }


  if(
    worldDescription
  ){

    worldDescription.textContent =
      profile.description;

  }


  if(
    !initialized ||
    !THREE
  ){

    return;

  }


  const primary =
    makeColor(
      profile.primary
    );


  const secondary =
    makeColor(
      profile.secondary
    );


  if(
    core
  ){

    core.material.color =
      primary;

    core.material.emissive =
      primary;

    core.material.emissiveIntensity =
      0.28 +
      profile.intensity *
      0.55;

  }


  if(
    innerCore
  ){

    innerCore.material.color =
      secondary;

  }


  if(
    outerRing
  ){

    outerRing.material.color =
      primary;

    outerRing.material.opacity =
      0.25 +
      profile.intensity *
      0.45;

  }


  if(
    secondRing
  ){

    secondRing.material.color =
      secondary;

    secondRing.material.opacity =
      0.18 +
      profile.intensity *
      0.30;

  }


  if(
    particleSystem
  ){

    particleSystem.material.color =
      primary;

    particleSystem.material.opacity =
      0.35 +
      profile.intensity *
      0.40;

  }


  if(
    mainLight
  ){

    mainLight.color =
      primary;

    mainLight.intensity =
      10 +
      profile.intensity *
      16;

  }


  if(
    secondaryLight
  ){

    secondaryLight.color =
      secondary;

    secondaryLight.intensity =
      8 +
      profile.intensity *
      12;

  }


  if(
    scene
  ){

    scene.background =
      new THREE.Color(
        "#020617"
      );

  }


  updateButtons();

}


/* =========================================================
   16. CHANGE WORLD
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

}


/* =========================================================
   17. BUTTON STATE
   ========================================================= */

function updateButtons(){

  if(
    !controls
  ){

    return;

  }


  const buttons =
    controls.querySelectorAll(
      "[data-world]"
    );


  buttons.forEach(
    function(button){

      const mode =
        button.getAttribute(
          "data-world"
        );


      button.classList.toggle(
        "active",
        mode ===
        currentProfile.mode
      );

    }
  );

}


/* =========================================================
   18. CONTENT ANALYZER
   ========================================================= */

function analyzeContentDemo(
  content
){

  const text =
    typeof content === "string"
      ?
    content.toLowerCase()
      :
    "";


  if(
    text.length === 0
  ){

    return validateVisualProfile({
      mode:
        "personal"
    });

  }


  const rules = [

    {
      mode:
        "ocean",

      words:[
        "ocean",
        "sea",
        "beach",
        "wave",
        "water",
        "underwater",
        "সমুদ্র",
        "সাগর",
        "পানি"
      ]
    },


    {
      mode:
        "nature",

      words:[
        "nature",
        "forest",
        "tree",
        "garden",
        "mountain",
        "river",
        "flower",
        "green",
        "প্রকৃতি",
        "বন",
        "গাছ",
        "ফুল"
      ]
    },


    {
      mode:
        "music",

      words:[
        "music",
        "song",
        "sing",
        "concert",
        "beat",
        "guitar",
        "piano",
        "গান",
        "সঙ্গীত"
      ]
    },


    {
      mode:
        "gaming",

      words:[
        "game",
        "gaming",
        "player",
        "level",
        "battle",
        "esports",
        "গেম",
        "গেমিং"
      ]
    },


    {
      mode:
        "automotive",

      words:[
        "car",
        "cars",
        "automotive",
        "vehicle",
        "engine",
        "racing",
        "গাড়ি",
        "গাড়ি"
      ]
    },


    {
      mode:
        "product",

      words:[
        "product",
        "shopping",
        "store",
        "sale",
        "price",
        "brand",
        "পণ্য",
        "কেনাকাটা"
      ]
    },


    {
      mode:
        "space",

      words:[
        "space",
        "planet",
        "galaxy",
        "star",
        "universe",
        "cosmos",
        "মহাকাশ",
        "গ্রহ"
      ]
    }

  ];


  for(
    const rule of rules
  ){

    for(
      const word of rule.words
    ){

      if(
        text.includes(word)
      ){

        return validateVisualProfile(
          WORLD_PROFILES[
            rule.mode
          ]
        );

      }

    }

  }


  return validateVisualProfile({
    mode:
      "personal"
  });

}


/* =========================================================
   19. POINTER
   ========================================================= */

function handlePointerMove(
  event
){

  targetPointerX =
    (
      event.clientX /
      window.innerWidth
    ) * 2 - 1;


  targetPointerY =
    (
      event.clientY /
      window.innerHeight
    ) * 2 - 1;

}


/* =========================================================
   20. RESIZE
   ========================================================= */

function handleResize(){

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


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      2
    )
  );

}


/* =========================================================
   21. ANIMATION
   ========================================================= */

function animate(){

  animationFrame =
    requestAnimationFrame(
      animate
    );


  if(
    !clock ||
    !renderer ||
    !scene ||
    !camera
  ){

    return;

  }


  const elapsed =
    clock.getElapsedTime();


  pointerX +=
    (
      targetPointerX -
      pointerX
    ) * 0.035;


  pointerY +=
    (
      targetPointerY -
      pointerY
    ) * 0.035;


  const intensity =
    currentProfile.intensity;


  if(
    core
  ){

    core.rotation.x =
      elapsed *
      0.12;


    core.rotation.y =
      elapsed *
      0.18;


    const pulse =
      1 +
      Math.sin(
        elapsed *
        (
          1.2 +
          intensity *
          2
        )
      ) *
      0.035 *
      intensity;


    core.scale.setScalar(
      pulse
    );

  }


  if(
    innerCore
  ){

    innerCore.rotation.x =
      -elapsed *
      0.16;


    innerCore.rotation.y =
      elapsed *
      0.22;

  }


  if(
    outerRing
  ){

    outerRing.rotation.z =
      elapsed *
      (
        0.10 +
        intensity *
        0.16
      );

  }


  if(
    secondRing
  ){

    secondRing.rotation.x =
      elapsed *
      (
        0.07 +
        intensity *
        0.12
      );

    secondRing.rotation.z =
      -elapsed *
      0.09;

  }


  if(
    particleSystem
  ){

    particleSystem.rotation.y =
      elapsed *
      (
        0.008 +
        intensity *
        0.022
      );

    particleSystem.rotation.x =
      pointerY *
      0.08;

  }


  if(
    starSystem
  ){

    starSystem.rotation.y =
      elapsed *
      0.003;

  }


  if(
    camera
  ){

    camera.position.x +=
      (
        pointerX *
        0.45 -
        camera.position.x
      ) * 0.025;


    camera.position.y +=
      (
        -pointerY *
        0.30 -
        camera.position.y
      ) * 0.025;


    camera.lookAt(
      0,
      0,
      0
    );

  }


  renderer.render(
    scene,
    camera
  );

}


/* =========================================================
   22. BUTTON EVENTS
   ========================================================= */

if(
  controls
){

  const buttons =
    controls.querySelectorAll(
      "[data-world]"
    );


  buttons.forEach(
    function(button){

      button.addEventListener(
        "click",
        function(){

          const mode =
            button.getAttribute(
              "data-world"
            );


          changeWorld(
            mode
          );

        }
      );

    }
  );

}


/* =========================================================
   23. PUBLIC CONTENT API
   ========================================================= */

function applyContentVisualProfile(
  visualProfile
){

  const safeProfile =
    validateVisualProfile(
      visualProfile
    );


  applyVisualProfile(
    safeProfile
  );

}


/* =========================================================
   24. PUBLIC API
   ========================================================= */

Object.freeze(

  window.ZemivoLivingWorld = {

    version:
      ENGINE_VERSION,

    changeWorld:
      changeWorld,

    analyzeContentDemo:
      analyzeContentDemo,

    applyContentVisualProfile:
      applyContentVisualProfile,

    getCurrentProfile:
      function(){

        return {
          ...currentProfile
        };

      }

  }

);


/* =========================================================
   25. START ENGINE
   ========================================================= */

if(
  securityStatus
){

  securityStatus.textContent =
    "🔒 Isolated visual engine";

}


changeWorld(
  "personal"
);


loadThreeJS();
