import { NativeMarket } from '@capacitor-community/native-market';

/**
 * Servicio para solicitar In-App Review de Google Play Store
 * Usa el plugin @capacitor-community/native-market
 */
export const appReviewService = {
  /**
   * Abre la página de la app en Play Store/App Store
   * Permite al usuario dejar una reseña
   */
  async requestReview(): Promise<void> {
    try {
      // Determina el appId según la plataforma
      let appId = 'com.aaronarias.impostor'; // Android

      // Abre la página de la app en la tienda
      await NativeMarket.openStoreListing({
        appId: appId
      });
    } catch (error) {
      console.error('Error al abrir la tienda:', error);
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
