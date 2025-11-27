console.log("Página visitante cargada correctamente.");

document.addEventListener("DOMContentLoaded", () => {

    const usuarioStr = localStorage.getItem("usuario");
    const loginBtn = document.getElementById("btnLogin");
    const registerBtn = document.getElementById("btnRegister");
    const perfilBtn = document.getElementById("btnPerfil");

    if (usuarioStr) {
    
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";

        if (perfilBtn) perfilBtn.style.display = "block";

        perfilBtn.addEventListener("click", () => {
            const usuario = JSON.parse(usuarioStr);

            switch (usuario.rol) {
                case "Admin":
                    window.location.href = "dashboard-admin.html";
                    break;
                case "Docente":
                    window.location.href = "dashboard-docente.html";
                    break;
                default:
                    window.location.href = "dashboard-alumno.html";
                    break;
            }
        });

    } else {
     
        if (loginBtn) loginBtn.style.display = "block";
        if (registerBtn) registerBtn.style.display = "block";

  
        if (perfilBtn) perfilBtn.style.display = "none";
    }
});
