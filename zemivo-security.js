/* =========================================================
   ZEMIVO SECURITY FOUNDATION
   Version: 1.0.0

   Purpose:
   - Firebase initialization
   - Firebase App Check
   - reCAPTCHA Enterprise
   - Authentication foundation
   - Firestore foundation
   - Realtime Database foundation
   - Storage foundation

   IMPORTANT:
   - No admin secret
   - No service-account key
   - No wallet secret
   - No AI master-database access
   - No debug App Check token
========================================================= */

import {
  initializeApp
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app-check.js";

import {
  getAuth
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getDatabase
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import {
  getStorage
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = Object.freeze({

  apiKey:
    "AIzaSyAxJUFBWm2fa0g3oxUWWqdfSTEAc-bRgfI",

  authDomain:
    "zemivo.firebaseapp.com",

  projectId:
    "zemivo",

  storageBucket:
    "zemivo.firebasestorage.app",

  messagingSenderId:
    "195335939691",

  appId:
    "1:195335939691:web:5fa5c62c53d0c0aefe732e",

  measurementId:
    "G-GNHH5S4H09"

});


/* =========================================================
   reCAPTCHA ENTERPRISE SITE KEY
========================================================= */

const RECAPTCHA_SITE_KEY =
  "6Ldd3s0tAAAAADWZVuF5nK4mifLFc944XSS-gMX-";


/* =========================================================
   BASIC ENVIRONMENT SECURITY CHECK
========================================================= */

const isLocalhost =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1";

const isHttps =
  location.protocol === "https:";

if(
  !isHttps &&
  !isLocalhost
){

  throw new Error(
    "Zemivo Security: HTTPS is required."
  );

}


/* =========================================================
   FIREBASE APP
========================================================= */

const app =
  initializeApp(
    firebaseConfig
  );


/* =========================================================
   FIREBASE APP CHECK
   MUST INITIALIZE BEFORE FIREBASE SERVICES
========================================================= */

const appCheck =
  initializeAppCheck(
    app,
    {

      provider:
        new ReCaptchaEnterpriseProvider(
          RECAPTCHA_SITE_KEY
        ),

      isTokenAutoRefreshEnabled:
        true

    }
  );


/* =========================================================
   FIREBASE SERVICES
========================================================= */

const auth =
  getAuth(
    app
  );

const db =
  getFirestore(
    app
  );

const rtdb =
  getDatabase(
    app
  );

const storage =
  getStorage(
    app
  );


/* =========================================================
   PUBLIC SECURITY OBJECT
========================================================= */

const ZemivoSecurity =
  Object.freeze({

    version:
      "1.0.0",

    app,

    appCheck,

    auth,

    db,

    rtdb,

    storage

  });


/* =========================================================
   EXPORT
========================================================= */

export {

  app,

  appCheck,

  auth,

  db,

  rtdb,

  storage,

  ZemivoSecurity

};


/* =========================================================
   GLOBAL READ-ONLY REFERENCE
   No secrets are exposed here.
========================================================= */

Object.defineProperty(
  window,
  "ZemivoSecurity",
  {

    value:
      ZemivoSecurity,

    writable:
      false,

    configurable:
      false,

    enumerable:
      false

  }
);

console.log(
  "Zemivo Security Foundation loaded.",
  "Version:",
  ZemivoSecurity.version
);
