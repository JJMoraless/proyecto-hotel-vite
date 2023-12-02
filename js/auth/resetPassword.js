import { hotelApi } from '../api'
import { $ } from '../utils/functions'

const $btnResetPassword = $('.btn-password-reset')

$btnResetPassword.addEventListener('click', async (e) => {
  const email = localStorage.getItem('email-reset')
  const code = $('.user-codigo').value.trim()
  const password = $('.user-password').value

  try {
    if (password.length < 10) {
      alert('la contraseña debe tener al menos 10 caracteres')
      return
    }

    const response = await hotelApi.post('/auth/reset-password', {
      email,
      code,
      password,
    })

    alert('contraseña cambiada con exito')
  } catch (error) {
    console.log(
      '🚀 ~ file: resetPassword.js:31 ~ $btnResetPassword.addEventListener ~ error:',
      error,
    )
    alert('codigo incorrecto')
  }
})
