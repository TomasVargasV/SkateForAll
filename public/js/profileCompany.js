document.addEventListener("DOMContentLoaded", function () {
    // Elementos do perfil
    const logoutBtn = document.getElementById("logoutBtn");
    const form = document.getElementById("profile-form");
    const editarBtn = document.getElementById("editar");
    const salvarBtn = document.getElementById("salvar");
    const inputs = form.querySelectorAll("input");
    const nameInput = document.getElementById("name-input");
    const cnpjInput = document.getElementById("cnpj-input");
    const emailInput = document.getElementById("email-input");
    const phoneInput = document.getElementById("phone-input");
    const addressInput = document.getElementById("address-input");
    const token = localStorage.getItem("token");
    let listaSorteios = [];
    const formSorteio = document.getElementById('cadastro-sorteio');
    const imageInput = document.getElementById('image');
    const fileInputLabel = document.getElementById('fileInputLabel');
    const dropArea = document.querySelector('.file-input-container');
    const checkbox = document.getElementById('isActiveCheckbox');
    const customCheckbox = document.querySelector('.custom-checkbox');
    const deletarBtn = document.getElementById("deletarConta");

    if (deletarBtn) {
        deletarBtn.addEventListener("click", async () => {
          if (!companyId) {
            alert("ID da empresa não carregado. Aguarde um instante e tente novamente.");
            return;
          }
      
          const confirmacao = confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível.");
          if (!confirmacao) return;
      
          try {
            const response = await fetch(`http://localhost:3000/api/company/${companyId}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
            });
      
            if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message || "Erro ao deletar conta");
            }
      
            alert("Conta deletada com sucesso!");
            localStorage.removeItem("token");
            window.location.href = "/public/html/home.html";
          } catch (error) {
            console.error("Erro ao deletar conta:", error);
            alert("Erro ao deletar conta: " + error.message);
          }
        });
      }

    if (formSorteio) {
        formSorteio.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData();
            fd.append('title', document.getElementById('title').value);
            fd.append('subtitle', document.getElementById('subtitle').value);
            fd.append('includedItems', document.getElementById('includedItems').value);
            fd.append('winnerCount', document.getElementById('winnerCount').value);
            fd.append('videoUrl', document.getElementById('videoUrl').value);
            fd.append('isActive', document.getElementById('isActiveCheckbox').checked ? 'true' : 'false');

            const file = imageInput.files[0];
            if (file) fd.append('image', file);

            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/draws', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: fd
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Erro ao criar sorteio");
                }

                const json = await res.json();
                console.log("Sorteio criado:", json);
                document.querySelector('#drawsContainer').innerHTML = '';
                await carregarSorteiosDaEmpresa();
                formSorteio.reset();
                fileInputLabel.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#aaa"/>
                    </svg>
                    <p>Arraste e solte uma imagem ou clique para selecionar</p>
                `;
            } catch (err) {
                console.error('Erro na requisição:', err);
                alert('Erro ao criar sorteio: ' + err.message);
            }
        });
    }

    if (imageInput && fileInputLabel && dropArea) {
        imageInput.addEventListener('change', function (e) {
            if (this.files && this.files[0]) {
                fileInputLabel.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#4CAF50"/>
                    </svg>
                    <p>Imagem selecionada: ${this.files[0].name}</p>
                `;
            } else {
                fileInputLabel.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#aaa"/>
                    </svg>
                    <p>Arraste e solte uma imagem ou clique para selecionar</p>
                `;
            }
        });

        // Eventos de drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.style.borderColor = 'red';
                dropArea.style.backgroundColor = '#222';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.style.borderColor = '#444';
                dropArea.style.backgroundColor = 'transparent';
            });
        });

        dropArea.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            if (files.length) {
                imageInput.files = files;
                const event = new Event('change');
                imageInput.dispatchEvent(event);
            }
        });
    }

    if (checkbox && customCheckbox) {
        checkbox.addEventListener('change', function () {
            customCheckbox.style.backgroundColor = this.checked ? 'red' : '#333';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/public/html/home.html";
        });
    }

    if (editarBtn && salvarBtn) {
        editarBtn.addEventListener("click", () => {
            inputs.forEach((input) => input.disabled = false);
            salvarBtn.disabled = false;
            editarBtn.disabled = true;
        });
    }

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const updatedCompany = {
                name: nameInput.value,
                CNPJ: cnpjInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                BusinessAddress: addressInput.value,
            };

            try {
                const response = await fetch("http://localhost:3000/api/company/me", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedCompany)
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || "Erro ao atualizar empresa");
                }

                await carregarEmpresa();
                alert("Empresa atualizada com sucesso!");
                inputs.forEach(input => input.disabled = true);
                salvarBtn.disabled = true;
                editarBtn.disabled = false;
            } catch (error) {
                console.error("Erro ao enviar alterações:", error);
                alert(error.message || "Erro na requisição.");
            }
        });
    }

    async function carregarEmpresa() {
        try {
            const response = await fetch("http://localhost:3000/api/company/me", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Erro ao buscar empresa");
            }

            const empresa = await response.json();
            companyId = empresa.id;
            nameInput.value = empresa.name || '';
            cnpjInput.value = empresa.CNPJ || '';
            emailInput.value = empresa.email || '';
            phoneInput.value = empresa.phone || '';
            addressInput.value = empresa.BusinessAddress || '';
        } catch (error) {
            console.error("Erro ao carregar empresa:", error);
            alert(error.message || "Erro ao carregar perfil.");
            if (error.message.includes("Token inválido") || error.message.includes("não autenticado")) {
                window.location.href = "/public/html/login.html";
            }
        }
    }

    async function carregarSorteiosDaEmpresa() {
        try {
            if (!token) {
                console.error('Token não encontrado');
                return;
            }

            const response = await fetch('http://localhost:3000/api/company/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Erro ao carregar sorteios');
            const empresa = await response.json();
            renderizarSorteios(empresa.draws);
        } catch (error) {
            console.error('Erro ao carregar sorteios:', error);
            document.getElementById('drawsContainer').innerHTML = '<p class="error">Erro ao carregar sorteios</p>';
        }
    }

    function renderizarSorteios(sorteios) {
        listaSorteios = [...sorteios];
        const container = document.getElementById('drawsContainer');

        if (!sorteios || sorteios.length === 0) {
            container.innerHTML = '<p>Nenhum sorteio criado ainda</p>';
            return;
        }

        container.innerHTML = sorteios.map((sorteio, index) => `
            <div class="draw-card" data-id="${sorteio.id || index}">
                ${sorteio.image ? `<img src="${sorteio.image}" alt="${sorteio.title}">` : ''}
                <h3>${sorteio.title}</h3>
                <span class="enrolled-count">Inscritos: ${sorteio.enrolledUsers?.length || 0}</span>
                <span class="status ${getStatusClass(sorteio)}">${getStatusText(sorteio)}</span>
            </div>
        `).join('');
        adicionarEventosCards();
    }

    function getStatusClass(sorteio) {
        if (sorteio.isFinished) return 'finished';
        return sorteio.isActive ? 'active' : 'inactive';
    }

    function getStatusText(sorteio) {
        if (sorteio.isFinished) return 'Encerrado';
        return sorteio.isActive ? 'Ativo' : 'Inativo';
    }

    function adicionarEventosCards() {
        document.querySelectorAll('.draw-card').forEach(card => {
            card.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const sorteio = listaSorteios.find(s => s.id == id || s.id === id);
                if (sorteio) abrirModal(sorteio);
            });
        });
    }

    function abrirModal(sorteio) {
        const modal = document.getElementById('sorteioModal');
        const modalContent = document.getElementById('modalContent');

        // Construir conteúdo do modal
        let buttonsHTML = '';
        if (!sorteio.isFinished) {
            buttonsHTML += `
                <button id="btnToggleStatus" class="btn-toggle-status">
                    ${sorteio.isActive ? 'Desativar Sorteio' : 'Ativar Sorteio'}
                </button>
            `;

            // Adicionar botão de sorteio apenas se o sorteio estiver ativo
            if (sorteio.isActive) {
                buttonsHTML += `<button id="btnDrawWinners" class="btn-draw">Sortear Vencedores</button>`;
            }
        }

        modalContent.innerHTML = `
            <div class="modal-header">
                ${sorteio.image ? `<img src="${sorteio.image}" alt="${sorteio.title}" class="modal-image">` : ''}
                <h2 class="modal-title">${sorteio.title}</h2>
            </div>
            <div class="modal-body">
                <p><strong>Descrição:</strong> ${sorteio.description || 'Sem descrição'}</p>
                <p><strong>Inscritos:</strong> ${sorteio.enrolledUsers?.length || 0}</p>
                <p><strong>Status:</strong> <span class="status ${getStatusClass(sorteio)}">${getStatusText(sorteio)}</span></p>
                ${sorteio.winners?.length > 0 ? `
                    <p><strong>Vencedores:</strong></p>
                    <ul class="winners-list">
                        ${sorteio.winners.map(winner => `<li>${winner.name}</li>`).join('')}
                    </ul>
                ` : ''}
                <p><strong>Data de Criação:</strong> ${new Date(sorteio.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="modal-footer">
                ${buttonsHTML}
                <button class="btn-close-modal">Fechar</button>
            </div>
        `;

        modal.style.display = 'block';
        document.querySelector('.modal-close').addEventListener('click', fecharModal);
        document.querySelector('.btn-close-modal').addEventListener('click', fecharModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal() });

        // Configurar evento para botão de toggle
        const toggleButton = document.getElementById('btnToggleStatus');
        if (toggleButton) {
            toggleButton.addEventListener('click', async () => {
                const novoStatus = !sorteio.isActive;
                toggleButton.disabled = true;
                const originalText = toggleButton.innerHTML;
                toggleButton.innerHTML = 'Carregando...';

                try {
                    const response = await fetch(`http://localhost:3000/api/draws/${sorteio.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ isActive: novoStatus })
                    });

                    if (!response.ok) {
                        throw new Error('Falha ao atualizar o status do sorteio');
                    }

                    const updatedDraw = await response.json();

                    // Atualizar estado local
                    sorteio.isActive = novoStatus;

                    // Atualizar lista de sorteios
                    const index = listaSorteios.findIndex(s => s.id === sorteio.id);
                    if (index !== -1) {
                        listaSorteios[index] = { ...listaSorteios[index], isActive: novoStatus };
                    }

                    // Atualizar status no modal
                    const statusElement = modalContent.querySelector('.status');
                    if (statusElement) {
                        statusElement.textContent = getStatusText(sorteio);
                        statusElement.className = 'status ' + getStatusClass(sorteio);
                    }

                    // Atualizar botão
                    toggleButton.innerHTML = novoStatus ? 'Desativar Sorteio' : 'Ativar Sorteio';

                    // Atualizar card na lista
                    atualizarCard(sorteio);
                } catch (error) {
                    console.error('Erro na atualização:', error);
                    alert('Erro ao atualizar o status: ' + error.message);
                    toggleButton.innerHTML = originalText;
                } finally {
                    toggleButton.disabled = false;
                }
            });
        }

        // Configurar evento para botão de sorteio
        const drawButton = document.getElementById('btnDrawWinners');
        if (drawButton) {
            drawButton.addEventListener('click', async () => {
                drawButton.disabled = true;
                drawButton.innerHTML = 'Sorteando...';

                try {
                    const response = await fetch(`http://localhost:3000/api/draws/${sorteio.id}/draw-winners`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Erro ao sortear');
                    }

                    const result = await response.json();
                    alert(`Sorteio realizado! Vencedores:\n${result.winners.map(w => `- ${w.name}`).join('\n')}`);

                    // Atualizar estado local
                    sorteio.isActive = false;
                    sorteio.isFinished = true;
                    sorteio.winners = result.winners;

                    // Atualizar lista de sorteios
                    const index = listaSorteios.findIndex(s => s.id === sorteio.id);
                    if (index !== -1) {
                        listaSorteios[index] = {
                            ...listaSorteios[index],
                            isActive: false,
                            isFinished: true,
                            winners: result.winners
                        };
                    }

                    // Fechar modal e recarregar lista
                    fecharModal();
                    await carregarSorteiosDaEmpresa();
                } catch (error) {
                    console.error('Erro no sorteio:', error);
                    alert('Erro ao realizar sorteio: ' + error.message);
                    drawButton.disabled = false;
                    drawButton.innerHTML = 'Sortear Vencedores';
                }
            });
        }
    }

    function atualizarCard(sorteioAtualizado) {
        const card = document.querySelector(`.draw-card[data-id="${sorteioAtualizado.id}"]`);
        if (card) {
            const statusSpan = card.querySelector('.status');
            if (statusSpan) {
                statusSpan.textContent = getStatusText(sorteioAtualizado);
                statusSpan.className = 'status ' + getStatusClass(sorteioAtualizado);
            }
        }
    }

    function fecharModal() {
        const modal = document.getElementById('sorteioModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ============== INICIALIZAÇÃO ==============
    if (token) {
        carregarEmpresa();
        carregarSorteiosDaEmpresa();
    } else {
        alert("Empresa não autenticada. Redirecionando para login.");
        window.location.href = "/public/html/login.html";
    }
});