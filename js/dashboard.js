function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const modules = ['aadhaar', 'digilocker', 'ehospital'];

  try {
    const profileRes = await fetch('http://localhost:3001/api/user/profile', {
      headers: getAuthHeaders()
    });

    const user = await profileRes.json();

    if (!profileRes.ok) {
      throw new Error(user.message || 'Failed to fetch user profile');
    }

    // Optional: Show welcome name
    if (user.fullName && document.getElementById('welcomeName')) {
      document.getElementById('welcomeName').textContent = user.fullName;
    }

    // Use completedModules array
    const completed = user.completedModules || [];

    for (const mod of modules) {
      const progressEl = document.getElementById(`${mod}Progress`);
      if (!progressEl) continue;

      if (completed.includes(mod)) {
        progressEl.style.width = '100%';
        progressEl.textContent = '✅ Completed';
        progressEl.classList.add('completed');
      } else {
        progressEl.style.width = '0%';
        progressEl.textContent = 'Not completed';
      }
    }

  } catch (err) {
    console.error('Dashboard load failed:', err);
    alert('Please log in again.');
    window.location.href = 'login.html';
  }
});
