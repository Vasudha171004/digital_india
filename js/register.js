document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phoneNumber = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirm = document.getElementById('confirm').value.trim();

  // 🔐 Validate password strength
  const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  if (!isStrong) {
    alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    return;
  }

  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }

  try {
    // 🌐 Backend API call
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phoneNumber, gender, dob, address, password })
    });

    const data = await res.json();

    if (res.ok) {
      // 💾 Store user details locally
      const userDetails = {
        name: fullName,
        email,
        phone: phoneNumber,
        gender: '',         // Can be updated later
        dob: '',            // Optional: Add date input if needed
        address: ''         // Will be filled during Aadhaar flow
      };
      localStorage.setItem('userDetails', JSON.stringify(userDetails));

      alert('✅ Registration successful! You can now log in.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || '❌ Registration failed');
    }
  } catch (err) {
    alert('Server error. Please try again.');
    console.error(err);
  }
});
