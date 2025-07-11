// document.addEventListener("DOMContentLoaded", function () {
//     const logoutBtn = document.getElementById("logoutBtn");
//     const form = document.getElementById("profile-form");
//     const editarBtn = document.getElementById("editar");
//     const salvarBtn = document.getElementById("salvar");
//     const inputs = form.querySelectorAll("input");

//     const nameInput = document.getElementById("name-input");
//     const cnpjInput = document.getElementById("cnpj-input");
//     const emailInput = document.getElementById("email-input");
//     const phoneInput = document.getElementById("phone-input");
//     const addressInput = document.getElementById("address-input");

//     const token = localStorage.getItem("token");

//     logoutBtn.addEventListener("click", () => {
//         localStorage.removeItem("token");
//         window.location.href = "/public/html/home.html";
//     });

//     editarBtn.addEventListener("click", () => {
//         inputs.forEach((input) => input.disabled = false);
//         salvarBtn.disabled = false;
//         editarBtn.disabled = true;
//     });

//     async function carregarEmpresa() {
//         try {
//             const response = await fetch("http://localhost:3000/api/company/me", {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 }
//             });

//             if (!response.ok) {
//                 const errorResponse = await response.json();
//                 throw new Error(errorResponse.message || "Erro ao buscar empresa");
//             }

//             const empresa = await response.json();

//             nameInput.value = empresa.name || '';
//             cnpjInput.value = empresa.CNPJ || '';
//             emailInput.value = empresa.email || '';
//             phoneInput.value = empresa.phone || '';
//             addressInput.value = empresa.BusinessAddress || '';
//         } catch (error) {
//             console.error("Erro ao carregar empresa:", error);
//             alert(error.message || "Erro ao carregar perfil.");

//             if (error.message.includes("Token inválido") || error.message.includes("não autenticado")) {
//                 window.location.href = "/public/html/login.html";
//             }
//         }
//     }

//     async function carregarSorteiosDaEmpresa() {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 console.error('Token não encontrado');
//                 return;
//             }

//             const response = await fetch('http://localhost:3000/api/company/me', {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Erro ao carregar sorteios');
//             }

//             const empresa = await response.json();
//             renderizarSorteios(empresa.draws);
//         } catch (error) {
//             console.error('Erro ao carregar sorteios:', error);
//             document.getElementById('drawsContainer').innerHTML = '<p class="error">Erro ao carregar sorteios</p>';
//         }
//     }

//     let listaSorteios = [];
//     function renderizarSorteios(sorteios) {
//         listaSorteios = [...sorteios];
//         const container = document.getElementById('drawsContainer');

//         if (!sorteios || sorteios.length === 0) {
//             container.innerHTML = '<p>Nenhum sorteio criado ainda</p>';
//             return;
//         }

//         container.innerHTML = sorteios.map((sorteio, index) => `
//         <div class="draw-card" data-id="${sorteio.id || index}">
//             ${sorteio.image ? `<img src="${sorteio.image}" alt="${sorteio.title}">` : ''}
//             <h3>${sorteio.title}</h3>
//             <span class="enrolled-count">Inscritos: ${sorteio.enrolledUsers?.length || 0}</span>
//             <span class="status ${sorteio.isActive ? 'active' : 'inactive'}">${sorteio.isActive ? 'Ativo' : 'Inativo'}</span>
//         </div>
//     `).join('');
//         adicionarEventosCards();
//     }

//     function adicionarEventosCards() {
//         const cards = document.querySelectorAll('.draw-card');
//         cards.forEach(card => {
//             card.addEventListener('click', function () {
//                 const id = this.getAttribute('data-id');
//                 const sorteio = listaSorteios.find(s => s.id == id || s.id === id);
//                 if (sorteio) {
//                     abrirModal(sorteio);
//                 }
//             });
//         });
//     }

//     document.addEventListener('DOMContentLoaded', () => {
//         const container = document.getElementById('drawsContainer');

//         container.addEventListener('click', (event) => {
//             const card = event.target.closest('.draw-card.clickable');
//             if (!card) return;

//             const id = card.dataset.id;
//             const sorteio = sorteiosAtuais.find(s => s.id === id || s.id == id);

//             if (sorteio) {
//                 abrirModalSorteio(sorteio);
//             }
//         });
//     });

//     function abrirModal(sorteio) {
//         const modal = document.getElementById('sorteioModal');
//         const modalContent = document.getElementById('modalContent');

//         // Botão com ícone SVG para alternar status
//         modalContent.innerHTML = `
//         <div class="modal-header">
//             ${sorteio.image ? `<img src="${sorteio.image}" alt="${sorteio.title}" class="modal-image">` : ''}
//             <h2 class="modal-title">${sorteio.title}</h2>
//         </div>
//         <div class="modal-body">
//             <p><strong>Descrição:</strong> ${sorteio.description || 'Sem descrição'}</p>
//             <p><strong>Inscritos:</strong> ${sorteio.enrolledUsers?.length || 0}</p>
//             <p><strong>Status atual:</strong> <span class="status ${sorteio.isActive ? 'active' : 'inactive'}" id="modalStatus">${sorteio.isActive ? 'Ativo' : 'Inativo'}</span></p>
//             <p><strong>Data de Criação:</strong> ${sorteio.creationDate || 'Não informada'}</p>
//         </div>
//         <div class="modal-footer">
//             <button id="btnToggleStatus" class="btn-toggle-status">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M8 12L12 16L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                 </svg>
//                 ${sorteio.isActive ? 'Desativar Sorteio' : 'Ativar Sorteio'}
//             </button>
//             <button class="btn-close-modal">Fechar</button>
//         </div>
//     `;

//         modal.style.display = 'block';

//         // Fecha o modal
//         document.querySelector('.modal-close').addEventListener('click', fecharModal);
//         document.querySelector('.btn-close-modal').addEventListener('click', fecharModal);
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) fecharModal();
//         });

//         // Adiciona evento ao botão de toggle
//         document.getElementById('btnToggleStatus').addEventListener('click', async () => {
//             const novoStatus = !sorteio.isActive;
//             const idSorteio = sorteio.id;

//             // Desabilita o botão durante a requisição
//             const toggleButton = document.getElementById('btnToggleStatus');
//             toggleButton.disabled = true;
//             const originalText = toggleButton.innerHTML;
//             toggleButton.innerHTML = 'Carregando...';

//             try {
//                 // Atualiza no banco de dados
//                 const updatedDraw = await atualizarStatusSorteio(idSorteio, novoStatus);

//                 // Atualiza localmente após sucesso
//                 sorteio.isActive = novoStatus;

//                 // Atualiza a interface
//                 const statusElement = document.getElementById('modalStatus');
//                 statusElement.textContent = novoStatus ? 'Ativo' : 'Inativo';
//                 statusElement.className = 'status ' + (novoStatus ? 'active' : 'inactive');

//                 toggleButton.innerHTML = `
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M8 12L12 16L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//             </svg>
//             ${novoStatus ? 'Desativar Sorteio' : 'Ativar Sorteio'}
//         `;

//                 // Atualiza o card correspondente
//                 atualizarCard(sorteio);
//             } catch (error) {
//                 console.error('Erro na atualização:', error);
//                 alert('Erro ao atualizar o status: ' + error.message);

//                 // Reverte visualização em caso de erro
//                 toggleButton.innerHTML = originalText;
//             } finally {
//                 toggleButton.disabled = false;
//             }
//         });
//     }

//     function atualizarCard(sorteioAtualizado) {
//         const card = document.querySelector(`.draw-card[data-id="${sorteioAtualizado.id}"]`);
//         if (card) {
//             const statusSpan = card.querySelector('.status');
//             statusSpan.textContent = sorteioAtualizado.isActive ? 'Ativo' : 'Inativo';
//             statusSpan.className = 'status ' + (sorteioAtualizado.isActive ? 'active' : 'inactive');
//         }
//     }

//     function fecharModal() {
//         document.getElementById('sorteioModal').style.display = 'none';
//     }

//     async function atualizarStatusSorteio(id, novoStatus) {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch(`http://localhost:3000/api/draws/${id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({ isActive: novoStatus })
//             });

//             if (!response.ok) {
//                 throw new Error('Falha ao atualizar o status do sorteio');
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Erro:', error);
//             throw error;
//         }
//     }

//     form.addEventListener("submit", async function (event) {
//         event.preventDefault();

//         const updatedCompany = {
//             name: nameInput.value,
//             CNPJ: cnpjInput.value,
//             email: emailInput.value,
//             phone: phoneInput.value,
//             BusinessAddress: addressInput.value,
//         };

//         try {
//             const response = await fetch("http://localhost:3000/api/company/me", {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: JSON.stringify(updatedCompany)
//             });

//             if (!response.ok) {
//                 const errorResponse = await response.json();
//                 throw new Error(errorResponse.message || "Erro ao atualizar empresa");
//             }

//             await carregarEmpresa();
//             alert("Empresa atualizada com sucesso!");

//             inputs.forEach(input => input.disabled = true);
//             salvarBtn.disabled = true;
//             editarBtn.disabled = false;

//         } catch (error) {
//             console.error("Erro ao enviar alterações:", error);
//             alert(error.message || "Erro na requisição.");
//         }
//     });

//     if (token) {
//         carregarEmpresa();
//         carregarSorteiosDaEmpresa()
//     } else {
//         alert("Empresa não autenticada. Redirecionando para login.");
//         window.location.href = "/public/html/login.html";
//     }
// });

// document.getElementById('cadastro-sorteio').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const fd = new FormData();
//     fd.append('title', document.getElementById('title').value);
//     fd.append('subtitle', document.getElementById('subtitle').value);
//     fd.append('includedItems', document.getElementById('includedItems').value);
//     fd.append('winnerCount', document.getElementById('winnerCount').value);
//     fd.append('videoUrl', document.getElementById('videoUrl').value);
//     const checkbox = document.getElementById('isActiveCheckbox');
//     const isActive = checkbox.checked ? 'true' : 'false';
//     fd.append('isActive', isActive);
//     const file = document.getElementById('image').files[0];
//     if (file) fd.append('image', file);

//     try {
//         const token = localStorage.getItem('token');
//         const res = await fetch('http://localhost:3000/api/draws', {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}` },
//             body: fd
//         });
//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.error || "Erro ao criar sorteio");
//         }
//         const json = await res.json();
//         console.log("Sorteio criado:", json);
//         carregarSorteiosDaEmpresa();
//         e.target.reset();
//         fileInputLabel.innerHTML = `...`;
//     } catch (err) {
//         console.error('Erro na requisição:', err);
//     }
// });

// const imageInput = document.getElementById('image');
// const fileInputLabel = document.getElementById('fileInputLabel');

// imageInput.addEventListener('change', function (e) {
//     if (this.files && this.files[0]) {
//         const reader = new FileReader();

//         reader.readAsDataURL(this.files[0]);

//         // Atualizar o texto do label
//         fileInputLabel.innerHTML = `
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#4CAF50"/>
//                     </svg>
//                     <p>Imagem selecionada: ${this.files[0].name}</p>
//                 `;
//     } else {
//         previewContainer.classList.remove('active');
//         fileInputLabel.innerHTML = `
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#aaa"/>
//                     </svg>
//                     <p>Arraste e solte uma imagem ou clique para selecionar</p>
//                 `;
//     }
// });

// // Permitir arrastar e soltar imagens
// const dropArea = document.querySelector('.file-input-container');

// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//     dropArea.addEventListener(eventName, preventDefaults, false);
// });

// function preventDefaults(e) {
//     e.preventDefault();
//     e.stopPropagation();
// }

// ['dragenter', 'dragover'].forEach(eventName => {
//     dropArea.addEventListener(eventName, highlight, false);
// });

// ['dragleave', 'drop'].forEach(eventName => {
//     dropArea.addEventListener(eventName, unhighlight, false);
// });

// function highlight() {
//     dropArea.style.borderColor = 'red';
//     dropArea.style.backgroundColor = '#222';
// }

// function unhighlight() {
//     dropArea.style.borderColor = '#444';
//     dropArea.style.backgroundColor = 'transparent';
// }

// dropArea.addEventListener('drop', handleDrop, false);

// function handleDrop(e) {
//     const dt = e.dataTransfer;
//     const files = dt.files;

//     if (files.length) {
//         imageInput.files = files;
//         const event = new Event('change');
//         imageInput.dispatchEvent(event);
//     }
// }

// // Script para o checkbox
// const checkbox = document.getElementById('isActiveCheckbox');
// const customCheckbox = document.querySelector('.custom-checkbox');

// checkbox.addEventListener('change', function () {
//     if (this.checked) {
//         customCheckbox.style.backgroundColor = 'red';
//     } else {
//         customCheckbox.style.backgroundColor = '#333';
//     }
// });

// // Simular dados do perfil
// document.getElementById('editar').addEventListener('click', function () {
//     document.querySelectorAll('#profile-form input:not([type="hidden"])').forEach(input => {
//         input.disabled = false;
//     });
//     document.getElementById('salvar').disabled = false;
// });

// document.getElementById('salvar').addEventListener('click', function (e) {
//     e.preventDefault();
//     alert('Alterações salvas com sucesso!');
//     document.querySelectorAll('#profile-form input:not([type="hidden"])').forEach(input => {
//         input.disabled = true;
//     });
//     this.disabled = true;
// });

// document.getElementById('cadastro-sorteio').addEventListener('submit', function (e) {
//     e.preventDefault();
//     alert('Sorteio criado com sucesso!');
//     this.reset();
//     previewContainer.classList.remove('active');
//     fileInputLabel.innerHTML = `
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#aaa"/>
//                 </svg>
//                 <p>Arraste e solte uma imagem ou clique para selecionar</p>
//             `;
// });

document.addEventListener("DOMContentLoaded", function () {
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

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/public/html/home.html";
    });

    editarBtn.addEventListener("click", () => {
        inputs.forEach((input) => input.disabled = false);
        salvarBtn.disabled = false;
        editarBtn.disabled = true;
    });

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
                <span class="status ${sorteio.isActive ? 'active' : 'inactive'}">${sorteio.isActive ? 'Ativo' : 'Inativo'}</span>
            </div>
        `).join('');
        adicionarEventosCards();
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
        modalContent.innerHTML = `
            <div class="modal-header">
                ${sorteio.image ? `<img src="${sorteio.image}" alt="${sorteio.title}" class="modal-image">` : ''}
                <h2 class="modal-title">${sorteio.title}</h2>
            </div>
            <div class="modal-body">
                <p><strong>Descrição:</strong> ${sorteio.description || 'Sem descrição'}</p>
                <p><strong>Inscritos:</strong> ${sorteio.enrolledUsers?.length || 0}</p>
                <p><strong>Status atual:</strong> <span class="status ${sorteio.isActive ? 'active' : 'inactive'}" id="modalStatus">${sorteio.isActive ? 'Ativo' : 'Inativo'}</span></p>
                <p><strong>Data de Criação:</strong> ${sorteio.creationDate || 'Não informada'}</p>
            </div>
            <div class="modal-footer">
                <button id="btnToggleStatus" class="btn-toggle-status">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12L12 16L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${sorteio.isActive ? 'Desativar Sorteio' : 'Ativar Sorteio'}
                </button>
                <button class="btn-close-modal">Fechar</button>
            </div>
        `;

        modal.style.display = 'block';
        document.querySelector('.modal-close').addEventListener('click', fecharModal);
        document.querySelector('.btn-close-modal').addEventListener('click', fecharModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal() });

        document.getElementById('btnToggleStatus').addEventListener('click', async () => {
            const novoStatus = !sorteio.isActive;
            const toggleButton = document.getElementById('btnToggleStatus');
            toggleButton.disabled = true;
            const originalText = toggleButton.innerHTML;
            toggleButton.innerHTML = 'Carregando...';

            try {
                await atualizarStatusSorteio(sorteio.id, novoStatus);
                sorteio.isActive = novoStatus;
                document.getElementById('modalStatus').textContent = novoStatus ? 'Ativo' : 'Inativo';
                document.getElementById('modalStatus').className = 'status ' + (novoStatus ? 'active' : 'inactive');
                toggleButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12L12 16L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${novoStatus ? 'Desativar Sorteio' : 'Ativar Sorteio'}
                `;
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

    function atualizarCard(sorteioAtualizado) {
        const card = document.querySelector(`.draw-card[data-id="${sorteioAtualizado.id}"]`);
        if (card) {
            const statusSpan = card.querySelector('.status');
            statusSpan.textContent = sorteioAtualizado.isActive ? 'Ativo' : 'Inativo';
            statusSpan.className = 'status ' + (sorteioAtualizado.isActive ? 'active' : 'inactive');
        }
    }

    function fecharModal() {
        document.getElementById('sorteioModal').style.display = 'none';
    }

    async function atualizarStatusSorteio(id, novoStatus) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/draws/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: novoStatus })
            });

            if (!response.ok) throw new Error('Falha ao atualizar o status do sorteio');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }

    if (token) {
        carregarEmpresa();
        carregarSorteiosDaEmpresa();
    } else {
        alert("Empresa não autenticada. Redirecionando para login.");
        window.location.href = "/public/html/login.html";
    }
});

document.getElementById('cadastro-sorteio').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', document.getElementById('title').value);
    fd.append('subtitle', document.getElementById('subtitle').value);
    fd.append('includedItems', document.getElementById('includedItems').value);
    fd.append('winnerCount', document.getElementById('winnerCount').value);
    fd.append('videoUrl', document.getElementById('videoUrl').value);
    fd.append('isActive', document.getElementById('isActiveCheckbox').checked ? 'true' : 'false');

    const file = document.getElementById('image').files[0];
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
        carregarSorteiosDaEmpresa();
        e.target.reset();
        document.getElementById('fileInputLabel').innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H8L12 1L16 5H13Z" fill="#aaa"/>
            </svg>
            <p>Arraste e solte uma imagem ou clique para selecionar</p>
        `;
    } catch (err) {
        console.error('Erro na requisição:', err);
    }
});

const formSorteio = document.getElementById('cadastro-sorteio');
const imageInput = document.getElementById('image');
const fileInputLabel = document.getElementById('fileInputLabel');
const dropArea = document.querySelector('.file-input-container');
const checkbox = document.getElementById('isActiveCheckbox');
const customCheckbox = document.querySelector('.custom-checkbox');

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

checkbox.addEventListener('change', function () {
    customCheckbox.style.backgroundColor = this.checked ? 'red' : '#333';
});