export function verificarAcceso(rolesPermitidos) {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Debes iniciar sesión");
        window.location.href = "login.html";
        return;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
        alert("No tenés permiso para acceder aquí");
        window.location.href = "index.html";
    }
}