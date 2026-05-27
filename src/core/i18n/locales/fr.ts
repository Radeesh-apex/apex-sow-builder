import type { Translations } from './en'

export const fr: Translations = {
  common: {
    save: 'Enregistrer', cancel: 'Annuler', reset: 'Réinitialiser', submit: 'Soumettre',
    close: 'Fermer', loading: 'Chargement...', search: 'Rechercher',
    confirm: 'Confirmer', back: 'Retour', next: 'Suivant', finish: 'Terminer',
    required: 'Requis', optional: 'Optionnel', actions: 'Actions',
  },
  nav: { brand: 'Apex Starter', home: 'Accueil', services: 'Services', contact: 'Contact', registration: 'Inscription', settings: 'Paramètres' },
  home: { title: 'Bienvenue sur Apex Starter', subtitle: 'Un boilerplate React prêt pour la production.', dashboard: 'Tableau de bord', overview: 'Bienvenue! Voici un aperçu rapide.' },
  services: { title: 'Nos Services', subtitle: 'Tout ce dont vous avez besoin pour développer votre entreprise.' },
  contact: { title: 'Contactez-nous', subtitle: 'Une question? Envoyez-nous un message.', name: 'Nom', email: 'E-mail', subject: 'Sujet', message: 'Message', send: 'Envoyer', sending: 'Envoi…', success: 'Message envoyé!' },
  registration: { title: 'Créer votre compte', subtitle: 'Entrez vos informations pour vous inscrire.', firstName: 'Prénom', lastName: 'Nom', email: 'Adresse e-mail', password: 'Mot de passe', confirmPassword: 'Confirmer le mot de passe', role: 'Rôle', department: 'Département', agreeTerms: "J'accepte les conditions d'utilisation", subscribeUpdates: 'Recevoir les mises à jour', createAccount: 'Créer un compte', signingUp: 'Inscription…' },
  errors: { required: 'Ce champ est obligatoire', invalidEmail: 'Entrez une adresse e-mail valide', passwordMismatch: 'Les mots de passe ne correspondent pas', passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères', mustAgreeTerms: 'Vous devez accepter les conditions' },
  login: {
    title: 'Bon retour',
    subtitle: 'Connectez-vous à votre compte Apex',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion...',
    noAccount: "Pas de compte?",
    createOne: 'En créer un',
    invalidCredentials: 'E-mail ou mot de passe invalide.',
  },
  settings: { title: 'Paramètres', theme: 'Thème', language: 'Langue' },
}
