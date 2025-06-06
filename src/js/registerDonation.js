const form = document.getElementById("donation-form");
const erroEl = document.getElementById("erro-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const item = document.getElementById("item-name").value;
  const description = document.getElementById("description").value;
  const itemStatus = document.getElementById("itemStatus").value;


  try {
    const res = await fetch("http://localhost:3000/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, description, itemStatus}),
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
