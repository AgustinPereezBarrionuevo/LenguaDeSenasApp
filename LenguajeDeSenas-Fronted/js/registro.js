document.getElementById("formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreUsuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("password").value.trim();
    const rol = document.getElementById("rol").value; // Admin / Docente / Alumno
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "";

    if (!nombre || !email || !contraseña) {
        mensaje.textContent = "Todos los campos son obligatorios.";
        mensaje.className = "error";
        return;
    }

    const nuevoUsuario = {
        nombre,
        email,
        contraseña,
        rol
    };

    try {
        const res = await fetch("https://localhost:7061/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (!res.ok) {
            mensaje.textContent = "Error al registrar usuario. Email ya existente.";
            mensaje.className = "error";
            return;
        }

        mensaje.textContent = "Registro exitoso. Redirigiendo...";
        mensaje.className = "exito";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {
        mensaje.textContent = "Error al conectar con el servidor.";
        mensaje.className = "error";
        console.error(error);
    }
});
