const navNoL = document.getElementById("noLogin")
const navL = document.getElementById("login")

function logged(){
    const isLogged = localStorage.getItem('token')
    if (isLogged != null){
        navNoL.style.display = 'none'
        navL.style.display = 'block'
    } else {
        navNoL.style.display = 'block'
        navL.style.display = 'none'
    }
}

logged()

// homeScreen.js

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token"); // remove o token
            location.reload(); // recarrega a página
        });
    }

    // Exibir o menu certo baseado na presença do token
    const token = localStorage.getItem("token");
    const navNoLogin = document.getElementById("noLogin");
    const navLogin = document.getElementById("login");

    if (token) {
        navNoLogin.style.display = "none";
        navLogin.style.display = "flex";
    } else {
        navNoLogin.style.display = "flex";
        navLogin.style.display = "none";
    }
});
