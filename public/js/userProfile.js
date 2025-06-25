document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  
  // Elementos para exibir informações
  const nameSpan = document.getElementById("user-name");
  const emailSpan = document.getElementById("user-email");
  const phoneSpan = document.getElementById("user-phone");
  const addressSpan = document.getElementById("user-address");
  const stateSpan = document.getElementById("user-state");

  const API_URL = 'http://localhost:3000'; 

  async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/html/login.html';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar perfil');
      }

      const userData = await response.json();
      populateProfile(userData);
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao carregar perfil do usuário');
    }
  }

  // Preencher os dados na página
  function populateProfile(user) {
    nameSpan.textContent = user.name || 'Não informado';
    emailSpan.textContent = user.email || 'Não informado';
    phoneSpan.textContent = user.phone || 'Não informado';
    addressSpan.textContent = user.address || 'Não informado';
    stateSpan.textContent = user.state || 'Não informado';
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/html/homeScreen.html";
    });
  }

  // Inicialização: buscar o perfil do usuário
  fetchUserProfile();
});