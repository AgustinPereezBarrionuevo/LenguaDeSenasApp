document.addEventListener("DOMContentLoaded", () => {

    // ==============================================
    // 1. INICIALIZACIÓN Y CONFIGURACIÓN DE ROLES
    // ==============================================

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    const rol = usuario.rol ?? "Alumno";
    
    document.getElementById("nombreUsuario").textContent = usuario.nombre;

    document.getElementById("nombreUsuarioDisplay").textContent = usuario.nombre;
    document.getElementById("emailUsuarioDisplay").textContent = usuario.email;
    document.getElementById("rolUsuario").textContent = rol;

    const rolDisplay = document.getElementById("rolDisplay");
    if (rolDisplay) rolDisplay.textContent = rol;

    // Asegúrate de que estas funciones existan en tu ámbito o en utils.js
    if (typeof mostrarElementosPorRol === 'function') mostrarElementosPorRol(rol);
    if (typeof configurarNavegacionPorRol === 'function') configurarNavegacionPorRol(rol);
    
    // ==============================================
    // 2. LÓGICA DE MODALES
    // ==============================================

    const modalPerfil = document.getElementById("modalPerfil");
    const modalPassword = document.getElementById("modalPassword");

    const btnEditarPerfil = document.getElementById("btnEditarPerfil");
    const btnCambiarPassword = document.getElementById("btnCambiarPassword");
    
    const inputNombreModal = document.getElementById("inputNombreModal");
    const inputEmailModal = document.getElementById("inputEmailModal");
    
    // Función central para abrir un modal
    const abrirModal = (modal, isProfile = false) => {
        // Cierra cualquier otro modal
        modalPerfil.style.display = "none";
        modalPassword.style.display = "none";
        
        if (isProfile) {
            // Cargar datos actuales del usuario al abrir el modal de perfil
            if (inputNombreModal) inputNombreModal.value = usuario.nombre;
            if (inputEmailModal) inputEmailModal.value = usuario.email;
        } else {
            // Limpiar formulario de contraseña
            document.getElementById("formPasswordModal")?.reset();
        }
        
        modal.style.display = "block";
    };

    // Eventos de apertura
    btnEditarPerfil?.addEventListener("click", () => abrirModal(modalPerfil, true));
    btnCambiarPassword?.addEventListener("click", () => abrirModal(modalPassword, false));
    
    // Eventos de cierre (Botón X y Cancelar)
    document.querySelector(".close-perfil").onclick = () => modalPerfil.style.display = "none";
    document.querySelector(".close-password").onclick = () => modalPassword.style.display = "none";
    document.getElementById("cancelarPerfil").onclick = () => modalPerfil.style.display = "none";
    document.getElementById("cancelarPassword").onclick = () => modalPassword.style.display = "none";
    
    // Cierre al hacer clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modalPerfil) {
            modalPerfil.style.display = "none";
        }
        if (event.target == modalPassword) {
            modalPassword.style.display = "none";
        }
    };
    
    // ==============================================
    // 3. LÓGICA DE AVATARES
    // (Mantenida sin cambios)
    // ==============================================
    
    const avatarContainer = document.getElementById("avatarSelectorContainer");
    const avatarActualImg = document.querySelector(".avatar");
    const btnGuardarAvatar = document.getElementById("btnGuardarAvatar");

    const avataresDisponibles = [
        "assets/avatares/Avatar1.png", "assets/avatares/Avatar2.png", "assets/avatares/Avatar3.png", "assets/avatares/Avatar4.png", 
        "assets/avatares/Avatar5.png", "assets/avatares/Avatar6.png", "assets/avatares/Avatar7.png", "assets/avatares/Avatar8.png", 
        "assets/avatares/Avatar9.png", "assets/avatares/Avatar10.png", "assets/avatares/Avatar11.png", "assets/avatares/Avatar12.png", 
        "assets/avatares/Avatar13.png", "assets/avatares/Avatar14.png"
    ];

    let avatarSeleccionadoUrl = usuario.avatarUrl || "assets/avatares/Avatar1.png";
    avatarActualImg.src = avatarSeleccionadoUrl;

    avataresDisponibles.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.className = "avatar-option";

        if (url === avatarSeleccionadoUrl) img.classList.add("selected");

        img.addEventListener("click", () => {
            document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.remove("selected"));
            img.classList.add("selected");
            avatarSeleccionadoUrl = url;
            avatarActualImg.src = url;
        });

        avatarContainer?.appendChild(img);
    });

    btnGuardarAvatar?.addEventListener("click", async () => {
        if (avatarSeleccionadoUrl === usuario.avatarUrl) {
            alert("No has seleccionado un avatar nuevo.");
            return;
        }

        const datosActualizar = {
            IdUsuario: usuario.idUsuario, Nombre: usuario.nombre, Email: usuario.email, Rol: usuario.rol,
            FechaRegistro: usuario.fechaRegistro, Activo: usuario.activo, AvatarUrl: avatarSeleccionadoUrl
        };

        try {
            const res = await fetch(`https://localhost:7061/api/Usuarios/${usuario.idUsuario}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizar)
            });

            if (res.ok) {
                usuario.avatarUrl = avatarSeleccionadoUrl;
                localStorage.setItem("usuario", JSON.stringify(usuario));
                alert("Avatar actualizado correctamente.");
            } else {
                alert("Error al guardar el avatar.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión al servidor.");
        }
    });


    // ==============================================
    // 4. MANEJO DEL SUBMIT DE PERFIL (Desde el modal)
    // ==============================================

    document.getElementById("formPerfilModal")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevosDatos = {
            IdUsuario: usuario.idUsuario,
            Nombre: inputNombreModal.value,
            Email: inputEmailModal.value,
            Contraseña: usuario.contraseña, // Se mantiene la contraseña actual
            Rol: usuario.rol,
            FechaRegistro: usuario.fechaRegistro,
            Activo: usuario.activo,
            AvatarUrl: usuario.avatarUrl
        };
        
        if (nuevosDatos.Nombre === usuario.nombre && nuevosDatos.Email === usuario.email) {
             alert("No se detectaron cambios en el nombre o email.");
             modalPerfil.style.display = "none";
             return;
        }

        try {
            const res = await fetch(`https://localhost:7061/api/Usuarios/${usuario.idUsuario}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevosDatos)
            });

            if (res.ok) {
                usuario.nombre = nuevosDatos.Nombre;
                usuario.email = nuevosDatos.Email;
                localStorage.setItem("usuario", JSON.stringify(usuario));
                document.getElementById("nombreUsuario").textContent = nuevosDatos.Nombre;
                document.getElementById("emailUsuario").textContent = nuevosDatos.Email;

                alert("Perfil actualizado correctamente.");
                modalPerfil.style.display = "none";
            } else {
                alert("Error al actualizar el perfil.");
            }
        } catch {
            alert("Error de conexión al servidor.");
        }
    });

    // ==============================================
    // 5. MANEJO DEL SUBMIT DE PASSWORD (Desde el modal)
    // ==============================================

    document.getElementById("formPasswordModal")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const passActual = document.getElementById("inputPasswordActualModal").value;
        const passNueva = document.getElementById("inputPasswordNuevaModal").value;
        const passConfirmar = document.getElementById("inputPasswordConfirmarModal").value;

        if (passNueva !== passConfirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const datosPassword = {
            idUsuario: usuario.idUsuario,
            passwordActual: passActual,
            passwordNueva: passNueva
        };

        try {
            const res = await fetch(`https://localhost:7061/api/Usuarios/CambiarPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosPassword)
            });

            if (res.ok) {
                alert("Contraseña actualizada correctamente.");
                modalPassword.style.display = "none";
                document.getElementById("formPasswordModal").reset();
            } else {
                 const errorText = await res.text();
                 alert(`Error al cambiar la contraseña: ${errorText || res.statusText}. Verifique su contraseña actual.`);
            }
        } catch {
            alert("Error de conexión al servidor.");
        }
    });
});


// --------------------
// FUNCIONES DE ROL (Mantenidas)
// --------------------
function mostrarElementosPorRol(rol) {
    if (rol === "Docente") {
        document.querySelectorAll(".solo-docente").forEach(el => el.style.display = "block");
    } else if (rol === "Alumno") {
        document.querySelectorAll(".solo-alumno").forEach(el => el.style.display = "block");
    }
}

function configurarNavegacionPorRol(rol) {
    const enlaces = document.querySelectorAll("nav a");
    let dashboardUrl =
        rol === "Docente" ? "dashboard-docente.html" :
        rol === "Admin" ? "dashboard-admin.html" :
        "dashboard-alumno.html";

    enlaces.forEach(enlace => {
        if (enlace.textContent.includes("Panel")) enlace.href = dashboardUrl;
        if (enlace.getAttribute("href") === "dashboard.html") enlace.href = dashboardUrl;
    });
}

 const btn = document.getElementById('toggleMenu');
  const aside = document.querySelector('.sidebar');

  btn.addEventListener('click', () => {
    aside.classList.toggle('open');
  });