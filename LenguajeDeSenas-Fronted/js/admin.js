document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
});

export async function cargarUsuarios() {

    const res = await fetch("https://localhost:7061/api/Usuarios");
    const usuarios = await res.json();

    renderizarUsuarios(usuarios);
}

function renderizarUsuarios(lista) {

    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = "";

    lista.forEach(u => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.rol}</td>
            <td>${formatearFecha(u.fechaRegistro)}</td>
            <td>
                <button onclick="eliminarUsuario(${u.idUsuario})" class="btn-delete">
                    Eliminar
                </button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

export async function crearUsuario() {

    const nuevo = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        contraseña: document.getElementById("password").value,
        rol: document.getElementById("rol").value
    };

    const res = await fetch("https://localhost:7061/api/Usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevo)
    });

    if (res.ok) {
        alert("Usuario creado correctamente");
        cargarUsuarios();
    } else {
        alert("Error creando usuario");
    }
}

export async function cargarDashboardAdmin() {

    const resUsuarios = await fetch("https://localhost:7061/api/Usuarios");
    const usuarios = await resUsuarios.json();

    const totalUsuarios = usuarios.length;
    const totalDocentes = usuarios.filter(u => u.rol === "Docente").length;

    const resRecursos = await fetch("https://localhost:7061/api/RecursosDidacticos");
    const recursos = await resRecursos.json();

    document.getElementById("countUsuarios").textContent = totalUsuarios;
    document.getElementById("countDocentes").textContent = totalDocentes;
    document.getElementById("countRecursos").textContent = recursos.length;
}

window.eliminarUsuario = async function (id) {

    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    const res = await fetch(`https://localhost:7061/api/Usuarios/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Usuario eliminado");
        cargarUsuarios();
        cargarDashboardAdmin();
    }
};


// ===== FORMULARIO DOCENTE =====




// ===== SIDEBAR =====
const btn = document.getElementById('toggleMenu');
const aside = document.querySelector('.sidebar');

btn.addEventListener('click', () => {
    aside.classList.toggle('open');
});


// ===== FORMATEAR FECHA =====
function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleDateString("es-AR");
}
