import type { Translations } from './en'

export const de: Translations = {
  common: {
    save: 'Speichern', cancel: 'Abbrechen', reset: 'Zurücksetzen', submit: 'Absenden',
    close: 'Schließen', loading: 'Laden...', search: 'Suchen',
    confirm: 'Bestätigen', back: 'Zurück', next: 'Weiter', finish: 'Fertig',
    required: 'Erforderlich', optional: 'Optional', actions: 'Aktionen',
  },
  nav: { brand: 'Apex Starter', home: 'Start', services: 'Dienste', contact: 'Kontakt', registration: 'Registrierung', settings: 'Einstellungen' },
  home: { title: 'Willkommen bei Apex Starter', subtitle: 'Ein produktionsreifes React-Boilerplate.', dashboard: 'Dashboard', overview: 'Willkommen! Hier ist eine kurze Übersicht.' },
  services: { title: 'Unsere Dienstleistungen', subtitle: 'Alles, was Sie zum Aufbau Ihres Unternehmens benötigen.' },
  contact: { title: 'Kontaktieren Sie uns', subtitle: 'Haben Sie eine Frage? Senden Sie uns eine Nachricht.', name: 'Name', email: 'E-Mail', subject: 'Betreff', message: 'Nachricht', send: 'Nachricht senden', sending: 'Wird gesendet…', success: 'Nachricht gesendet!' },
  registration: { title: 'Konto erstellen', subtitle: 'Geben Sie Ihre Daten ein, um sich zu registrieren.', firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail-Adresse', password: 'Passwort', confirmPassword: 'Passwort bestätigen', role: 'Rolle', department: 'Abteilung', agreeTerms: 'Ich stimme den Nutzungsbedingungen zu', subscribeUpdates: 'Updates erhalten', createAccount: 'Konto erstellen', signingUp: 'Registrierung…' },
  errors: { required: 'Dieses Feld ist erforderlich', invalidEmail: 'Bitte gültige E-Mail eingeben', passwordMismatch: 'Passwörter stimmen nicht überein', passwordTooShort: 'Passwort muss mindestens 8 Zeichen lang sein', mustAgreeTerms: 'Sie müssen den Bedingungen zustimmen' },
  login: {
    title: 'Willkommen zurück',
    subtitle: 'Melden Sie sich bei Ihrem Apex-Konto an',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    signIn: 'Anmelden',
    signingIn: 'Anmeldung...',
    noAccount: 'Noch kein Konto?',
    createOne: 'Erstellen',
    invalidCredentials: 'Ungültige E-Mail oder Passwort.',
  },
  settings: { title: 'Einstellungen', theme: 'Thema', language: 'Sprache' },
}
