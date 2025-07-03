// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
  // Obtiene referencias a los elementos del DOM una sola vez
  const usernameInput = document.getElementById('username');
  const loginButton = document.getElementById('login-button');
  const outputElement = document.getElementById('output');

  // Comprueba si todos los elementos necesarios existen para evitar errores
  if (!usernameInput || !loginButton || !outputElement) {
    console.error('Error: No se encontraron los elementos del DOM necesarios.');
    if (outputElement) {
        outputElement.textContent = 'Error de inicialización de la aplicación. Faltan elementos HTML.';
        outputElement.classList.add('error');
    }
    return;
  }

  // Asigna la función de login al evento 'click' del botón
  loginButton.addEventListener('click', login);

  function login() {
    // Limpia y convierte a minúsculas el nombre de usuario (los usuarios de Hive no distinguen mayúsculas/minúsculas)
    const username = usernameInput.value.trim().toLowerCase();

    // Validación básica del nombre de usuario
    if (!username) {
      outputElement.textContent = 'Por favor, ingresa un nombre de usuario de Hive.';
      outputElement.className = 'error';
      return;
    }

    // Comprueba si la extensión Hive Keychain está disponible
    if (!window.hive_keychain) {
      outputElement.textContent = 'La extensión Hive Keychain no está instalada o está deshabilitada.';
      outputElement.className = 'error';
      return;
    }

    // Actualiza la UI para mostrar un estado de carga
    loginButton.disabled = true;
    loginButton.textContent = 'Firmando...';
    outputElement.textContent = 'Por favor, confirma la transacción en la extensión de Hive Keychain...';
    outputElement.className = '';

    const message = `Autenticación Hive @${username} - ${Date.now()}`;

    window.hive_keychain.requestSignBuffer(
      username,
      message,
      'Posting',
      (response) => {
        if (response.success) {
          outputElement.textContent = JSON.stringify(response, null, 2);
          outputElement.className = 'success';
          console.log('Firma válida:', response);
        } else {
          outputElement.textContent = `Error: ${response.message || 'La autenticación fue cancelada o falló.'}`;
          outputElement.className = 'error';
          console.error('Error de autenticación:', response);
        }

        // Restaura el botón a su estado original
        loginButton.disabled = false;
        loginButton.textContent = 'Autenticar con Keychain';
      }
    );
  }
});
