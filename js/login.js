document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailOrPhone = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login successful!');
      localStorage.setItem('token', data.token);
      window.location.href = '/html/home.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Server error. Please try again.');
    console.error(err);
  }
});
