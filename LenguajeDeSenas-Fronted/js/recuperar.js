  async function enviarCodigo() {
        const email = document.getElementById("email").value;
        const msg = document.getElementById("msg");

        if (!email) {
            msg.innerText = "Ingresá tu email.";
            return;
        }

        const response = await fetch("https://localhost:7061/api/auth/recuperar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            msg.style.color = "green";
            msg.innerText = "Código enviado. Revisá tu correo.";
            setTimeout(() => window.location.href = "restablecer.html?email=" + email, 1500);
        } else {
            msg.innerText = "No se encontró ese email.";
        }
    }