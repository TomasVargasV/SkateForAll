document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-cadastro");
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("repetir-senha").value;
      const address = document.getElementById("address").value;
      const state = document.getElementById("itemStatus").value;
  
      const erroMsg = document.getElementById("senha-erro");
  
      if (password !== confirmPassword) {
        erroMsg.textContent = "As senhas não coincidem!";
        erroMsg.style.color = "red";
        return;
      } else {
        erroMsg.textContent = "";
      }
  
      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, phone, email, password, address, state })
        });
  
        if (response.ok) {
          alert("Usuário cadastrado com sucesso!");
          window.location.href = "../html/loginScreen.html";
        } else {
          const data = await response.json();
          alert("Erro: " + data.message);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na conxao.");
      }
    });
  });
  