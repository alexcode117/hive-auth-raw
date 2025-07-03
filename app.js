function login() {
  const username = document.getElementById('username').value;
  const message = `Autenticación Hive @${username} - ${Date.now()}`;
  
  window.hive_keychain.requestSignBuffer(
    username,
    message,
    'Posting',
    (response) => {
      if (response.success) {
        document.getElementById('output').textContent = JSON.stringify(response, null, 2);
        console.log('Firma válida:', response.result);
      } else {
        document.getElementById('output').textContent = "Autenticación cancelada o fallida.";
      }
    }
  );
}
