document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Enviando login con:', email, password);

  try {
    const API_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/auth/login'
      : 'https://administraciondecine-gestion-de-cine.up.railway.app/auth/login';

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    console.log('Respuesta del servidor:', data);

    if (res.ok) {
      alert(`Login exitoso. ID Usuario: ${data.userId}`);
      window.location.href = 'https://senzacine.netlify.app/views/admin/home';
    } else {
      alert(data.error || 'Credenciales incorrectas');
    }

  } catch (error) {
    console.error('Error en fetch:', error);
    alert('No se pudo conectar al servidor');
  }
});
