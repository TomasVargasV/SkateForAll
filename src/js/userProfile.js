document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("profile-form");
  const editarBtn = document.getElementById("editar");
  const salvarBtn = document.getElementById("salvar");
  const inputs = form.querySelectorAll("input");

  const token = localStorage.getItem("token");

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/html/homeScreen.html";
    });
  }

  // Ativar edição
  editarBtn.addEventListener("click", function () {
    inputs.forEach((input) => {
      input.disabled = false;
    });
    salvarBtn.disabled = false;
    editarBtn.disabled = true;
  });

  // Buscar dados do usuário autenticado
  async function carregarUsuario() {
    try {
      const response = await fetch("http://localhost:3000/api/userById/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar usuário");
      }

      const user = await response.json();

      document.querySelector('input[name="nome"]').value = user.name;
      document.querySelector('input[name="email"]').value = user.email;
      document.querySelector('input[name="telefone"]').value = user.phone;
      document.querySelector('input[name="endereco"]').value = user.address;
      document.querySelector('input[name="password"]').value = user.password;
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao carregar os dados do perfil.");
    }
  }

  // Salvar alterações
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedUser = {
      name: document.querySelector('input[name="nome"]').value,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="telefone"]').value,
      address: document.querySelector('input[name="endereco"]').value,
      password: document.querySelector('input[name="password"]').value
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

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      const result = await response.json();
      alert("Perfil atualizado com sucesso!");

      // Desativa campos novamente
      inputs.forEach((input) => input.disabled = true);
      salvarBtn.disabled = true;
      editarBtn.disabled = false;

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar alterações.");
    }
  });

  // Chamar carregamento
  carregarUsuario();
});
