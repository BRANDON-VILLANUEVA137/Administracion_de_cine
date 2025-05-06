document.getElementById('loginForm').addEventListener('submit', (e) => {
  // Validación simple
  const email = e.target.email.value;
  const password = e.target.password.value;

  if (!email || !password) {
    e.preventDefault();
    alert('Todos los campos son obligatorios');
  }
});
