function setupAuth() {
    const token = localStorage.getItem("token");
    const navNoLogin = document.getElementById("noLogin");
    const navLogin = document.getElementById("login");
    const logoutBtn = document.getElementById("logoutBtn");

    if (token) {
        if (navNoLogin) navNoLogin.style.display = "none";
        if (navLogin) navLogin.style.display = "flex";
    } else {
        if (navNoLogin) navNoLogin.style.display = "flex";
        if (navLogin) navLogin.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            location.reload();
        });
    }
}

document.addEventListener("DOMContentLoaded", setupAuth);