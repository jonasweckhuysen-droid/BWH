// ==========================================================
// BWH 2.0 - Service Worker registratie
// ==========================================================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", async () => {

    try {

      const registration =
        await navigator.serviceWorker.register(
          "./service-worker.js",
          {
            scope: "./"
          }
        );

      console.log(
        "BWH 2.0 service worker geregistreerd:",
        registration.scope
      );

      // Controleer regelmatig of er een nieuwe versie beschikbaar is
      registration.update();

    } catch (error) {

      console.error(
        "BWH 2.0 service worker kon niet worden geregistreerd:",
        error
      );

    }

  });

}
