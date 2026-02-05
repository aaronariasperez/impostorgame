import { RateApp } from 'capacitor-rate-app';

/**
 * Servicio para solicitar In-App Review de Google Play Store
 * Usa el plugin capacitor-rate-app
 */
export const appReviewService = {
  /**
   * Solicita el In-App Review de Google Play Store
   * Muestra el diálogo nativo de reseña en dispositivos Android/iOS
   */
  async requestReview(): Promise<void> {
    try {
      await RateApp.requestReview();
    } catch (error) {
      console.error('Error al solicitar In-App Review:', error);
      // Fallback en caso de error
      this.openPlayStore();
    }
  },

  /**
   * Abre el Play Store como fallback
   * Usa market:// para Android (abre la app de Play Store)
   * Fallback a https:// si market:// no funciona
   */
  openPlayStore(): void {
    const packageId = 'com.aaronarias.impostor';
    const marketUrl = `market://details?id=${packageId}`;
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageId}`;

    // Intenta abrir con market:// primero (Android)
    const link = document.createElement('a');
    link.href = marketUrl;
    link.click();

    // Si market:// no funciona, fallback a https:// después de 1 segundo
    setTimeout(() => {
      window.open(playStoreUrl, '_blank');
    }, 1000);
  }
};
