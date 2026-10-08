importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Vul hier je eigen Firebase-configuratie in
firebase.initializeApp({
  apiKey: "AIzaSyD-whPB4HLBA_FZkYr5OtmJRR7ofXs_s_0",
  authDomain: "bwhnew.firebaseapp.com",
  projectId: "bwhnew",
  storageBucket: "bwhnew.firebasestorage.app",
  messagingSenderId: "822224776722",
  appId: "1:822224776722:web:ad39bec266c20a6622b2cb"
});

const messaging = firebase.messaging();

// Vang berichten op wanneer de app VOLLEDIG op de achtergrond of gesloten is
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Achtergrondbericht ontvangen: ', payload);

  const notificationTitle = payload.notification?.title || "🚒 Brandweer App";
  const notificationOptions = {
    body: payload.notification?.body || "Je hebt een nieuwe melding ontvangen.",
    icon: 'Designer.png',
    badge: 'Designer.png',
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
