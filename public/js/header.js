function toggleMenu() {
  const navContainer = document.getElementById('navContainer');
  navContainer.classList.toggle('active');
}

// Controle de sessão e perfil
function updateHeader() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  if (isLoggedIn && token) {
    document.getElementById('noLogin').style.display = 'none';
    document.getElementById('loggedInNav').style.display = 'block';

    // Define o link correto para o perfil
    const profileLink = document.getElementById('profileLink');
    profileLink.href = userType === 'user' ? 'profileUser.html' : 'profileCompany.html';
  } else {
    document.getElementById('noLogin').style.display = 'block';
    document.getElementById('loggedInNav').style.display = 'none';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userType');
  localStorage.removeItem('token');
  updateHeader();
  window.location.href = 'home.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  updateHeader();

  // Evento de logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Verificar token em páginas protegidas (opcional)
  const protectedPages = ['profileUser.html', 'profileCompany.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage)) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Acesso não autorizado');
      window.location.href = 'selectLogin.html';
    }
  }
});