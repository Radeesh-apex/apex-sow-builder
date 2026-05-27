import type { Translations } from './en'

export const es: Translations = {
  common: {
    save: 'Guardar', cancel: 'Cancelar', reset: 'Restablecer', submit: 'Enviar',
    close: 'Cerrar', loading: 'Cargando...', search: 'Buscar',
    confirm: 'Confirmar', back: 'Atrás', next: 'Siguiente', finish: 'Finalizar',
    required: 'Requerido', optional: 'Opcional', actions: 'Acciones',
  },
  nav: { brand: 'Apex Starter', home: 'Inicio', services: 'Servicios', contact: 'Contacto', registration: 'Registro', settings: 'Configuración' },
  home: { title: 'Bienvenido a Apex Starter', subtitle: 'Un boilerplate de React listo para producción.', dashboard: 'Panel', overview: '¡Bienvenido! Aquí tienes un resumen rápido.' },
  services: { title: 'Nuestros Servicios', subtitle: 'Todo lo que necesitas para construir tu negocio.' },
  contact: { title: 'Contáctanos', subtitle: '¿Tienes una pregunta? Envíanos un mensaje.', name: 'Nombre', email: 'Correo', subject: 'Asunto', message: 'Mensaje', send: 'Enviar mensaje', sending: 'Enviando…', success: '¡Mensaje enviado!' },
  registration: { title: 'Crea tu cuenta', subtitle: 'Ingresa tus datos para registrarte.', firstName: 'Nombre', lastName: 'Apellido', email: 'Correo electrónico', password: 'Contraseña', confirmPassword: 'Confirmar contraseña', role: 'Rol', department: 'Departamento', agreeTerms: 'Acepto los términos y condiciones', subscribeUpdates: 'Envíame actualizaciones', createAccount: 'Crear cuenta', signingUp: 'Registrando…' },
  errors: { required: 'Este campo es obligatorio', invalidEmail: 'Ingresa un correo válido', passwordMismatch: 'Las contraseñas no coinciden', passwordTooShort: 'La contraseña debe tener al menos 8 caracteres', mustAgreeTerms: 'Debes aceptar los términos' },
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión en tu cuenta Apex',
    email: 'Correo electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando sesión...',
    noAccount: '¿No tienes cuenta?',
    createOne: 'Crear una',
    invalidCredentials: 'Correo o contraseña incorrectos.',
  },
  settings: { title: 'Configuración', theme: 'Tema', language: 'Idioma' },
}
