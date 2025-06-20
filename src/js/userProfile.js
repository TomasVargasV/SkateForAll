//logout
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token"); // remove o token
            window.location.href = "/html/homeScreen.html";
        });
    }})

//aaa

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("profile-form");
    const editarBtn = document.getElementById("editar");
    const salvarBtn = document.getElementById("salvar");
    const inputs = form.querySelectorAll("input");
  
    editarBtn.addEventListener("click", function () {
      // Habilita campo
      inputs.forEach((input) => {
        input.disabled = false;
      });
  
      salvarBtn.disabled = false;
      editarBtn.disabled = true;
    })})

    //Mudar dados usuario
