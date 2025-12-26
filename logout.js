// Setup logout functionality
document.addEventListener('DOMContentLoaded', function () {
  // Cari semua tombol logout (tombol dengan text "Keluar")
  const logoutButtons = document.querySelectorAll('button');
  
  logoutButtons.forEach(btn => {
    if (btn.textContent.includes('Keluar')) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        handleLogout();
      });
    }
  });

  // Juga cari link logout
  const logoutLinks = document.querySelectorAll('a');
  logoutLinks.forEach(link => {
    if (link.textContent.includes('Keluar') && link.href.includes('login.html')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        handleLogout();
      });
    }
  });
});

function handleLogout() {
  // Hapus token dan user info
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect ke login
  window.location.href = 'login.html';
}
