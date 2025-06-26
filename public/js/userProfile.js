// document.addEventListener("DOMContentLoaded", function () {
//   const logoutBtn = document.getElementById("logoutBtn");

//   // Elementos para exibir informações
//   const nameSpan = document.getElementById("user-name");
//   const emailSpan = document.getElementById("user-email");
//   const phoneSpan = document.getElementById("user-phone");
//   const addressSpan = document.getElementById("user-address");
//   const stateSpan = document.getElementById("user-state");

//   const API_URL = 'http://localhost:3000'; 

//   async function fetchUserProfile() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       window.location.href = '/html/login.html';
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/user/me`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Erro ao carregar perfil');
//       }

//       const userData = await response.json();
//       populateProfile(userData);
//     } catch (error) {
//       console.error('Erro:', error);
//       alert('Falha ao carregar perfil do usuário');
//     }
//   }

//   // Preencher os dados na página
//   function populateProfile(user) {
//     nameSpan.textContent = user.name || 'Não informado';
//     emailSpan.textContent = user.email || 'Não informado';
//     phoneSpan.textContent = user.phone || 'Não informado';
//     addressSpan.textContent = user.address || 'Não informado';
//     stateSpan.textContent = user.state || 'Não informado';
//   }

//   // Logout
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", () => {
//       localStorage.removeItem("token");
//       window.location.href = "/html/homeScreen.html";
//     });
//   }

//   // Inicialização: buscar o perfil do usuário
//   fetchUserProfile();
// });













document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("profile-form");
  const editarBtn = document.getElementById("editar");
  const salvarBtn = document.getElementById("salvar");
  const inputs = form.querySelectorAll("input");

  const token = localStorage.getItem("token");

  // LOGOUT
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/public/html/homeScreen.html";
  });

  // HABILITAR CAMPOS
  editarBtn.addEventListener("click", () => {
    inputs.forEach((input) => input.disabled = false);
    salvarBtn.disabled = false;
    editarBtn.disabled = true;
  });

  // CARREGAR DADOS DO USUÁRIO
  async function carregarUsuario() {
    try {
      const response = await fetch("http://localhost:3000/api/userById/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erro ao buscar usuário");

      const user = await response.json();

      document.querySelector('input[name="nome"]').value = user.name;
      document.querySelector('input[name="email"]').value = user.email;
      document.querySelector('input[name="telefone"]').value = user.phone;
      document.querySelector('input[name="endereco"]').value = user.address;
      document.querySelector('input[name="password"]').value = user.password;
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      alert("Erro ao carregar perfil.");
    }
  }

  // SUBMETER ALTERAÇÕES
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedUser = {
      name: document.querySelector('input[name="nome"]').value,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="telefone"]').value,
      address: document.querySelector('input[name="endereco"]').value,
      password: document.querySelector('input[name=password]')
    };

    try {
      const response = await fetch("http://localhost:3000/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Erro do servidor:", result);
        alert("Erro ao atualizar usuário.");
        return;
      }

      alert("Usuário atualizado com sucesso!");

      // Trava os campos novamente
      inputs.forEach((input) => input.disabled = true);
      salvarBtn.disabled = true;
      editarBtn.disabled = false;

    } catch (error) {
      console.error("Erro ao enviar alterações:", error);
      alert("Erro na requisição.");
    }
  });

  // CHAMADA INICIAL
  carregarUsuario();
});
