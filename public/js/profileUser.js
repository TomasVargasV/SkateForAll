document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("profile-form");
  const editarBtn = document.getElementById("editar");
  const salvarBtn = document.getElementById("salvar");
  const inputs = form.querySelectorAll("input");

  const nameInput = document.getElementById("name-input");
  const emailInput = document.getElementById("email-input");
  const phoneInput = document.getElementById("phone-input");
  const addressInput = document.getElementById("address-input");

  const token = localStorage.getItem("token");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/public/html/home.html";
  });

  editarBtn.addEventListener("click", () => {
    inputs.forEach((input) => input.disabled = false);
    salvarBtn.disabled = false;
    editarBtn.disabled = true;
  });

  async function carregarUsuario() {
    try {
      const response = await fetch("http://localhost:3000/api/user/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Erro ao buscar usuário");
      }

      const user = await response.json();

      nameInput.value = user.name || '';
      emailInput.value = user.email || '';
      phoneInput.value = user.phone || '';
      addressInput.value = user.address || '';
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      alert(error.message || "Erro ao carregar perfil.");

      if (error.message.includes("Token inválido") || error.message.includes("não autenticado")) {
        window.location.href = "/public/html/login.html";
      }
    }
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedUser = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      address: addressInput.value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Erro ao atualizar usuário");
      }

      await carregarUsuario();
      alert("Usuário atualizado com sucesso!");

      inputs.forEach(input => input.disabled = true);
      salvarBtn.disabled = true;
      editarBtn.disabled = false;

    } catch (error) {
      console.error("Erro ao enviar alterações:", error);
      alert(error.message || "Erro na requisição.");
    }
  });

  if (token) {
    carregarUsuario();
  } else {
    alert("Usuário não autenticado. Redirecionando para login.");
    window.location.href = "/public/html/login.html";
  }
});