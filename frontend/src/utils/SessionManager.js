// frontend/src/utils/SessionManager.js

import Swal from 'sweetalert2';

class SessionManager {
  constructor(timeoutInMinutes = 30) {
    this.timeoutInMinutes = timeoutInMinutes;
    this.timeoutId = null;
    this.events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    this.logout = this.logout.bind(this);
    this.resetTimeout = this.resetTimeout.bind(this);
    this.showWarning = this.showWarning.bind(this);
    this.warningTimeoutId = null;
    this.warningTime = 1; // Afficher l'avertissement 1 minute avant la déconnexion
  }

  init() {
    this.startTimeout();
    this.addEventListeners();
  }

  startTimeout() {
    // Définir le timeout d'avertissement
    this.warningTimeoutId = setTimeout(() => {
      this.showWarning();
    }, (this.timeoutInMinutes - this.warningTime) * 60 * 1000);

    // Définir le timeout de déconnexion
    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.timeoutInMinutes * 60 * 1000);
  }

  resetTimeout() {
    // Réinitialiser les timeouts
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningTimeoutId) clearTimeout(this.warningTimeoutId);
    
    // Redémarrer les timeouts
    this.startTimeout();
  }

  addEventListeners() {
    // Ajouter des écouteurs d'événements pour réinitialiser le timeout lors d'une activité
    this.events.forEach(event => {
      window.addEventListener(event, this.resetTimeout);
    });
  }

  removeEventListeners() {
    // Supprimer les écouteurs d'événements
    this.events.forEach(event => {
      window.removeEventListener(event, this.resetTimeout);
    });
  }

  showWarning() {
    Swal.fire({
      title: 'Attention !',
      text: `Votre session va expirer dans ${this.warningTime} minute(s). Voulez-vous rester connecté ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Rester connecté',
      cancelButtonText: 'Déconnexion',
      timer: this.warningTime * 60 * 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a cliqué sur "Rester connecté"
        this.resetTimeout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // L'utilisateur a cliqué sur "Déconnexion"
        this.logout();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        // Le timer a expiré, la déconnexion se fera automatiquement
      }
    });
  }

  logout() {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Afficher un message de déconnexion
    Swal.fire({
      title: 'Session expirée',
      text: 'Vous avez été déconnecté en raison d\'inactivité.',
      icon: 'info',
      confirmButtonText: 'OK'
    }).then(() => {
      // Rediriger vers la page de connexion
      window.location.href = '/login'; // Ajustez selon votre route de connexion
    });
  }

  cleanup() {
    // Nettoyer les timeouts et les écouteurs d'événements
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningTimeoutId) clearTimeout(this.warningTimeoutId);
    this.removeEventListeners();
  }
}

export default SessionManager;