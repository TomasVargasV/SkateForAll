document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("profile-form");
  const editarBtn = document.getElementById("editar");
  const salvarBtn = document.getElementById("salvar");
  const camposEditaveis = form.querySelectorAll("input, select");

  const nameInput = document.getElementById("name-input");
  const emailInput = document.getElementById("email-input");
  const phoneInput = document.getElementById("phone-input");
  const instagramInput = document.getElementById("instagram-input");
  const addressInput = document.getElementById("address-input");
  const stateInput = document.getElementById("state-input");

  const token = localStorage.getItem("token");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/public/html/home.html";
  });

  editarBtn.addEventListener("click", () => {
    camposEditaveis.forEach((input) => input.disabled = false);
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
      instagramInput.value = user.instagram || '';
      addressInput.value = user.address || '';
      stateInput.value = user.state || '';
      await carregarSorteios(token)
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      alert(error.message || "Erro ao carregar perfil.");

      if (error.message.includes("Token inválido") || error.message.includes("não autenticado")) {
        window.location.href = "/public/html/loginUser.html";
      }
    }
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedUser = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      instagram: instagramInput.value,
      address: addressInput.value,
      state: stateInput.value
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

      camposEditaveis.forEach(input => input.disabled = true);
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
    window.location.href = "/public/html/loginUser.html";
  }
});

async function carregarSorteios(userToken) {
  try {
    const response = await fetch("http://localhost:3000/api/user/my-draws", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar sorteios");
    }

    const draws = await response.json();
    const drawsList = document.getElementById("draws-list");

    if (draws.length === 0) {
      drawsList.innerHTML = '<div class="no-draws">Você ainda não está participando de nenhum sorteio</div>';
      return;
    }

    drawsList.innerHTML = draws.map(draw => `
      <div class="draw-card">
        <img src="${draw.image}" alt="${draw.title}" class="draw-image">
        <div class="draw-info">
          <h4>${draw.title}</h4>
          <p>${draw.subtitle}</p>
          <p>Empresa: ${draw.company.name}</p>
          <p>Data de inscrição: ${new Date(draw.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Erro ao carregar sorteios:", error);
    document.getElementById("draws-list").innerHTML = `
      <div class="no-draws">
        Erro ao carregar sorteios: ${error.message}
      </div>
    `;
  }
}