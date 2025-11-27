document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("password").value.trim();
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "";

    try {
        const respuesta = await fetch("https://localhost:7061/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, contraseña })
        });

        if (!respuesta.ok) {
            mensaje.textContent = "Credenciales incorrectas";
            mensaje.className = "error";
            return;
        }

        const usuario = await respuesta.json();
            const usuarioCompleto = {
            idUsuario: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            fechaRegistro: usuario.fechaRegistro ?? new Date().toISOString(),
            activo: usuario.activo ?? true,
            avatarUrl: usuario.avatarUrl ?? "assets/avatares/Avatar1.png"
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

        mensaje.textContent = "Ingreso exitoso";
        mensaje.className = "exito";

        setTimeout(() => {
            if (usuario.rol === "Admin") {
                window.location.href = "dashboard-admin.html";
            } else if (usuario.rol === "Docente") {
                window.location.href = "dashboard-docente.html";
            } else {
                window.location.href = "dashboard-alumno.html";
            }
        }, 800);

    } catch (error) {
        mensaje.textContent = "Error al conectar con el servidor";
        mensaje.className = "error";
        console.error(error);
    }
});
