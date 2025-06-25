const form = document.getElementById("login-form");
const erroEl = document.getElementById("erro-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/loginc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text(); 
    console.log("Texto bruto da resposta:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Resposta do servidor não é JSON.");
    }

    if (!res.ok) {
      throw new Error(data.message || "Erro no login (dados incorretos?)");
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/html/homeScreen.html";
  } catch (err) {
    erroEl.textContent = err.message;
    console.error("Erro detalhado:", err);
  }
});
