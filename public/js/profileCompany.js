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

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/public/html/home.html";
    });

    editarBtn.addEventListener("click", () => {
        inputs.forEach((input) => input.disabled = false);
        salvarBtn.disabled = false;
        editarBtn.disabled = true;
    });

    async function carregarEmpresa() {
        try {
            const response = await fetch("http://localhost:3000/api/company/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Erro ao buscar empresa");
            }

            const empresa = await response.json();

            nameInput.value = empresa.name || '';
            cnpjInput.value = empresa.cnpj || '';
            emailInput.value = empresa.email || '';
            phoneInput.value = empresa.phone || '';
            addressInput.value = empresa.address || '';
        } catch (error) {
            console.error("Erro ao carregar empresa:", error);
            alert(error.message || "Erro ao carregar perfil.");

            if (error.message.includes("Token inválido") || error.message.includes("não autenticado")) {
                window.location.href = "/public/html/login.html";
            }
        }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedCompany = {
            name: nameInput.value,
            cnpj: cnpjInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
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

    if (token) {
        carregarEmpresa();
    } else {
        alert("Empresa não autenticada. Redirecionando para login.");
        window.location.href = "/public/html/login.html";
    }
});