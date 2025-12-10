    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    async function restablecer() {
        const codigo = document.getElementById("codigo").value;
        const nueva = document.getElementById("nuevaPass").value;
        const msg = document.getElementById("msg");

        if (!codigo || !nueva) {
            msg.innerText = "Completá todos los campos.";
            return;
        }

        const response = await fetch("https://localhost:7061/api/auth/restablecer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                codigo: parseInt(codigo),
                nuevaContrasena: nueva
            })
        });

        if (response.ok) {
            msg.style.color = "green";
            msg.innerText = "Contraseña actualizada. Redirigiendo...";
            setTimeout(() => window.location.href = "login.html", 1500);
        } else {
            msg.innerText = "Código incorrecto o expirado.";
        }
    }