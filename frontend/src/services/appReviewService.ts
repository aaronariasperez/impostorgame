import { RateApp } from 'capacitor-rate-app';

const REVIEW_REQUESTED_KEY = 'impostor_review_requested';

/**
 * Servicio para solicitar In-App Review de Google Play Store
 * Usa el plugin capacitor-rate-app
 */
export const appReviewService = {
  /**
   * Solicita el In-App Review de Google Play Store
   * Muestra el diálogo nativo de reseña en dispositivos Android/iOS
   * Retorna true si mostró el popup, false si el usuario ya valoró previamente
   */
  async requestReview(): Promise<boolean> {
    // Verificar si el usuario ya solicitó valoración antes
    if (this.hasRequestedReview()) {
      return false;
    }

    try {
      await RateApp.requestReview();
      // Marcar que ya se solicitó la valoración
      this.markReviewAsRequested();
      return true;
    } catch (error) {
      console.error('Error al solicitar In-App Review:', error);
      // Fallback en caso de error técnico (plugin no disponible, etc.)
      this.openPlayStore();
      return true;
    }
  },

  /**
   * Verifica si el usuario ya solicitó una valoración previamente
   */
  hasRequestedReview(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      return localStorage.getItem(REVIEW_REQUESTED_KEY) === 'true';
    } catch (error) {
      console.error('Error al verificar review status:', error);
      return false;
    }
  },

  /**
   * Marca que el usuario ya solicitó una valoración
   */
  markReviewAsRequested(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      localStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
    } catch (error) {
      console.error('Error al marcar review como solicitado:', error);
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
