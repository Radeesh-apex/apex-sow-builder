export const en = {
  common: {
    save: 'Save', cancel: 'Cancel', reset: 'Reset', submit: 'Submit',
    close: 'Close', loading: 'Loading...', search: 'Search',
    confirm: 'Confirm', back: 'Back', next: 'Next', finish: 'Finish',
    required: 'Required', optional: 'Optional', actions: 'Actions',
  },
  nav: {
    brand: 'SOW Builder',
    brandMain: 'Everforth',      
    brandSub: 'Apex Systems.',
    home: 'Home', services: 'Services', contact: 'Contact', registration: 'Register',
    settings: 'Settings',
  },
  home: {
    title: 'Welcome to Apex Starter',
    subtitle: 'A production-ready React boilerplate built on ApexUI components.',
    dashboard: 'Dashboard',
    overview: "Welcome back! Here's a quick overview.",
  },
  services: {
    title: 'Our Services',
    subtitle: 'Everything you need to build, scale, and secure your business.',
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Have a question or want to work together? Send us a message.',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
    send: 'Send Message', sending: 'Sending…', success: "Message sent! We'll get back to you soon.",
  },
  registration: {
    title: 'Create your account',
    subtitle: 'Enter your details to register.',
    firstName: 'First name', lastName: 'Last name',
    email: 'Email address', password: 'Password', confirmPassword: 'Confirm password',
    role: 'Role', department: 'Department',
    agreeTerms: 'I agree to the terms of service and privacy policy',
    subscribeUpdates: 'Send me product updates and tips',
    createAccount: 'Create account', signingUp: 'Signing up…',
  },
  errors: {
    required: 'This field is required',
    invalidEmail: 'Enter a valid email address',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    mustAgreeTerms: 'You must agree to the terms',
  },
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your Apex account',
    email: 'Email address',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    noAccount: "Don't have an account?",
    createOne: 'Create one',
    invalidCredentials: 'Invalid email or password. Please try again.',
  },
  settings: {
    title: 'Settings',
    theme: 'Theme', language: 'Language',
  },
}

export type Translations = typeof en
