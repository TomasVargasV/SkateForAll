document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-cadastro");
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const name = document.getElementById("name").value;
      const CNPJ = document.getElementById("CNPJ").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const BusinessAddress = document.getElementById("BusinessAdress").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      const erroMsg = document.getElementById("senha-erro");
  
      if (password !== confirmPassword) {
        erroMsg.textContent = "As senhas não coincidem!";
        erroMsg.style.color = "red";
        return;
      } else {
        erroMsg.textContent = "";
      }
  
      try {
        const response = await fetch("http://localhost:3000/api/registerc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, CNPJ, email, password,phone, BusinessAddress})
        });
  
        if (response.ok) {
          alert("Empresa cadastrada com sucesso!");
          window.location.href = "../html/loginCompany.html";
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na conexao.");
      }
    });
  });
  