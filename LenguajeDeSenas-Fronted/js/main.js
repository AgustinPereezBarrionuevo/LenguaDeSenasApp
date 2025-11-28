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

    // ===========================
    // MOBILE MENU TOGGLE
    // ===========================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    const body = document.body;
    
    // Create mobile overlay
    let mobileOverlay = document.querySelector('.mobile-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.classList.add('mobile-overlay');
        body.appendChild(mobileOverlay);
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        });

        // Close menu when clicking nav links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }
});
