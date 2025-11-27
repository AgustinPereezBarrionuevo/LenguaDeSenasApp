document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("logout");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault();

     
        localStorage.removeItem("usuario");

        
        window.location.href = "login.html";
    });
});