const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Cloud Function die automatisch afgaat zodra er een document wordt toegevoegd 
 * aan de Firestore collectie 'notificaties'.
 */
exports.sendPushNotification = onDocumentCreated("notificaties/{notificatieId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  const targetUser = data.voor ? data.voor.trim().toLowerCase() : null;
  const sender = data.van ? data.van.trim().toLowerCase() : "";

  const tokens = [];

  try {
    const db = admin.firestore();
    const membersSnap = await db.collection("leden").get();

    membersSnap.forEach((docSnap) => {
      const userData = docSnap.data();
      const fcmToken = userData.fcmToken;

      if (!fcmToken) return;

      const fullName = (userData.volledigeNaam || `${userData.voornaam || ''} ${userData.achternaam || ''}`).trim().toLowerCase();

      if (targetUser) {
        // Persoonlijke melding (bijv. voertuigaanvraag goedgekeurd)
        if (fullName === targetUser) {
          tokens.push(fcmToken);
        }
      } else {
        // Algemene melding (bijv. nieuwe voertuigaanvraag, ruilverzoek, permanentie publicatie)
        // Stuur naar iedereen BEHALVE de verzender zelf
        if (fullName !== sender) {
          tokens.push(fcmToken);
        }
      }
    });

    if (tokens.length === 0) {
      console.log("Geen geldige FCM tokens gevonden om push-bericht naar te sturen.");
      return;
    }

    // Verstuur de Push-notificaties via Firebase Cloud Messaging
    const message = {
      notification: {
        title: data.titel || "🚒 Brandweer App Melding",
        body: data.bericht || "Je hebt een nieuwe melding."
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Push-notificatie succesvol verzonden naar ${response.successCount} toestel(len).`);

  } catch (error) {
    console.error("Fout bij het versturen van FCM push-notificatie:", error);
  }
});
