
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();
const REGION = "asia-south1";

function verifyRequest(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "লগইন করতে হবে।");
  }

  if (!request.app) {
    throw new HttpsError("failed-precondition", "App Check যাচাই ব্যর্থ।");
  }

  return request.auth.uid;
}

function requireAdmin(request) {
  const uid = verifyRequest(request);

  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Admin অনুমতি প্রয়োজন।");
  }

  return uid;
}

exports.getAffiliateApplicationStatus = onCall(
  { region: REGION, enforceAppCheck: true },
  async (request) => {
    const uid = verifyRequest(request);
    const snap = await db.collection("affiliateApplications").doc(uid).get();

    if (!snap.exists) {
      return { exists: false, status: "not_submitted" };
    }

    const data = snap.data();

    return {
      exists: true,
      status: data.status || "pending",
      country: data.country || null,
      language: data.language || "bn",
      submittedAt: data.submittedAt || null
    };
  }
);

exports.submitAffiliateApplication = onCall(
  { region: REGION, enforceAppCheck: true },
  async (request) => {
    const uid = verifyRequest(request);
    const country = String(request.data?.country || "").toUpperCase();
    const language = String(request.data?.language || "bn");
    const acceptedTerms = request.data?.acceptedTerms === true;

    if (!/^[A-Z]{2}$/.test(country)) {
      throw new HttpsError("invalid-argument", "সঠিক country code দিন।");
    }

    if (!["bn", "en", "zh"].includes(language)) {
      throw new HttpsError("invalid-argument", "ভাষা সঠিক নয়।");
    }

    if (!acceptedTerms) {
      throw new HttpsError("failed-precondition", "Affiliate শর্তে সম্মতি প্রয়োজন।");
    }

    const kycRef = db.collection("affiliateKyc").doc(uid);
    const applicationRef = db.collection("affiliateApplications").doc(uid);

    await db.runTransaction(async (tx) => {
      const kycSnap = await tx.get(kycRef);
      const applicationSnap = await tx.get(applicationRef);

      if (!kycSnap.exists || kycSnap.data().status !== "approved") {
        throw new HttpsError(
          "failed-precondition",
          "Affiliate কাজ শুরুর আগে KYC অনুমোদন প্রয়োজন।"
        );
      }

      if (
        applicationSnap.exists &&
        ["pending", "approved"].includes(applicationSnap.data().status)
      ) {
        throw new HttpsError(
          "already-exists",
          "আপনার Affiliate আবেদন আগে থেকেই জমা আছে।"
        );
      }

      tx.set(applicationRef, {
        uid,
        country,
        language,
        status: "pending",
        acceptedTerms: true,
        submittedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    return { success: true, status: "pending" };
  }
);

exports.reviewAffiliateApplication = onCall(
  { region: REGION, enforceAppCheck: true },
  async (request) => {
    const adminUid = requireAdmin(request);
    const targetUid = String(request.data?.uid || "");
    const status = String(request.data?.status || "");
    const note = String(request.data?.note || "").slice(0, 500);

    if (!targetUid || !["approved", "rejected"].includes(status)) {
      throw new HttpsError("invalid-argument", "আবেদনের তথ্য সঠিক নয়।");
    }

    const applicationRef = db.collection("affiliateApplications").doc(targetUid);
    const auditRef = db.collection("auditLogs").doc();

    await db.runTransaction(async (tx) => {
      const applicationSnap = await tx.get(applicationRef);

      if (!applicationSnap.exists) {
        throw new HttpsError("not-found", "Affiliate আবেদন পাওয়া যায়নি।");
      }

      if (applicationSnap.data().status !== "pending") {
        throw new HttpsError("failed-precondition", "আবেদনটি আর Pending নেই।");
      }

      tx.update(applicationRef, {
        status,
        reviewedBy: adminUid,
        reviewedAt: FieldValue.serverTimestamp(),
        reviewNote: note,
        updatedAt: FieldValue.serverTimestamp()
      });

      tx.set(auditRef, {
        action: "affiliate_application_review",
        targetUid,
        adminUid,
        status,
        createdAt: FieldValue.serverTimestamp()
      });
    });

    return { success: true, status };
  }
);

// নিরাপত্তা ব্যবস্থা সম্পূর্ণ না হওয়া পর্যন্ত Wallet transfer বন্ধ
exports.transferAffiliateWallet = onCall(
  { region: REGION, enforceAppCheck: true },
  async () => {
    throw new HttpsError("unavailable", "Wallet transfer এখনো চালু হয়নি।");
  }
);

// নিরাপদ পেমেন্ট ব্যবস্থা প্রস্তুত না হওয়া পর্যন্ত Withdrawal বন্ধ
exports.requestAffiliateWithdrawal = onCall(
  { region: REGION, enforceAppCheck: true },
  async () => {
    throw new HttpsError("unavailable", "Withdrawal এখনো চালু হয়নি।");
  }
);
