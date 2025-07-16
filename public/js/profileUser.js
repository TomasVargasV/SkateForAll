document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("profile-form");
  const editarBtn = document.getElementById("editar");
  const salvarBtn = document.getElementById("salvar");
  const deletarBtn = document.getElementById("deletar-conta");
  const camposEditaveis = form.querySelectorAll("input, select");

  const nameInput = document.getElementById("name-input");
  const emailInput = document.getElementById("email-input");
  const phoneInput = document.getElementById("phone-input");
  const instagramInput = document.getElementById("instagram-input");
  const addressInput = document.getElementById("address-input");
  const stateInput = document.getElementById("state-input");

  const token = localStorage.getItem("token");
  let listaSorteios = [];

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/public/html/home.html";
  });

  editarBtn.addEventListener("click", () => {
    camposEditaveis.forEach((input) => input.disabled = false);
    salvarBtn.disabled = false;
    editarBtn.disabled = true;
  });

  deletarBtn.addEventListener("click", deletarConta);

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

      await carregarSorteios(token);
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
      listaSorteios = draws;
      const drawsList = document.getElementById("draws-list");

      if (draws.length === 0) {
        drawsList.innerHTML = '<div class="no-draws">Você ainda não está participando de nenhum sorteio</div>';
        return;
      }

      drawsList.innerHTML = draws.map(draw => `
        <div class="draw-card" data-id="${draw.id}">
          <img src="${draw.image}" alt="${draw.title}" class="draw-image">
          <div class="draw-info">
            <h4>${draw.title}</h4>
            <p>Empresa: ${draw.company.name}</p>
            <p>Data de inscrição: ${new Date(draw.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `).join('');

      // Adicionar evento de clique aos cards
      document.querySelectorAll('.draw-card').forEach(card => {
        card.addEventListener('click', function () {
          const drawId = this.getAttribute('data-id');
          const sorteio = listaSorteios.find(d => d.id == drawId);
          if (sorteio) abrirModal(sorteio);
        });
      });
    } catch (error) {
      console.error("Erro ao carregar sorteios:", error);
      document.getElementById("draws-list").innerHTML = `
        <div class="no-draws">
          Erro ao carregar sorteios: ${error.message}
        </div>
      `;
    }
  }

  function abrirModal(sorteio) {
    const modal = document.getElementById('sorteioModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <div class="modal-header">
        ${sorteio.image ? `<img src="${sorteio.image}" alt="${sorteio.title}" class="modal-image">` : ''}
        <h2 class="modal-title">${sorteio.title}</h2>
      </div>
      <div class="modal-body">
        <p><strong>Empresa:</strong> ${sorteio.company.name}</p>
        <p><strong>Data de inscrição:</strong> ${new Date(sorteio.createdAt).toLocaleDateString()}</p>
      </div>
      <div class="modal-footer">
        
        <button id="btnDetails" data-draw-id="${sorteio.id}" class="btn-details">Ver Detalhes</button>
        
        <div class="button-group">
        <button id="btnUnenroll" class="btn-unenroll">Desinscrever-se</button>
        <button class="btn-close-modal">Fechar</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';

    // Fechar modal
    document.querySelector('.modal-close').addEventListener('click', fecharModal);
    document.querySelector('.btn-close-modal').addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal() });

    // Evento de desinscrição
    document.getElementById('btnUnenroll').addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/api/draws/${sorteio.id}/unenroll`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Erro ao desinscrever");
        }

        // Atualizar a lista de sorteios
        await carregarSorteios(token);
        fecharModal();
        alert("Desinscrito com sucesso!");
      } catch (error) {
        console.error('Erro ao desinscrever:', error);
        alert('Erro ao desinscrever: ' + error.message);
      }
    });

    document.querySelectorAll('#btnDetails').forEach(button => {
      button.addEventListener('click', function () {
        const drawId = this.getAttribute('data-draw-id')
        fecharModal();
        window.location.href = `draw.html?id=${drawId}`;
      });
    });

  }

  function fecharModal() {
    const modal = document.getElementById('sorteioModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  async function deletarConta() {
    if (!confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível e removerá todos os seus dados.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/user/me", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Erro ao deletar conta");
      }

      // Limpar dados e redirecionar
      localStorage.removeItem("token");
      alert("Conta deletada com sucesso!");
      window.location.href = "/public/html/home.html";
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      alert("Erro ao deletar conta: " + error.message);
    }
  }

  // Inicialização
  if (token) {
    carregarUsuario();
  } else {
    alert("Usuário não autenticado. Redirecionando para login.");
    window.location.href = "/public/html/loginUser.html";
  }
});