import { obtenerIdDocenteLogueado } from './utils.js';

async function cargarMisRecursos() {
    const idDocente = await obtenerIdDocenteLogueado();
    if (!idDocente) return;

    const tablaBody = document.getElementById("tablaRecursosDocente");

    if (!tablaBody) {
        console.warn("Elemento 'tablaRecursosDocente' no encontrado.");
        return;
    }

    tablaBody.innerHTML = '<tr><td colspan="4">Cargando recursos...</td></tr>';

    try {
        const res = await fetch(`lsa-api.up.railway.app/RecursosDidacticos/PorDocente/${idDocente}`);

        if (!res.ok) {
            tablaBody.innerHTML = '<tr><td colspan="4">No se pudieron cargar los recursos.</td></tr>';
            return;
        }

        const recursos = await res.json();
        tablaBody.innerHTML = "";

        // ================================
        //   🔵 ACTUALIZAMOS LAS CARDS
        // ================================
        actualizarCards(recursos);

        // ================================
        //   TABLA DE RECURSOS
        // ================================
        if (recursos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="4">Aún no has subido recursos.</td></tr>';
            return;
        }

        recursos.forEach(r => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${r.titulo}</td>
                <td>${r.descripcion}</td>
                <td>${new Date(r.fechaPublicacion).toLocaleDateString()}</td>
                <td>
                    <button onclick="eliminarRecurso(${r.idRecurso})" class="btn-delete">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando recursos:", error);
    }
}


// ====================================================
// 🔵 FUNCIÓN PARA ACTUALIZAR LAS CARDS DEL DASHBOARD
// ====================================================
function actualizarCards(recursos) {

    // ✔ 1) Total de recursos
    const countRecursos = document.getElementById("countRecursosDocente");
    countRecursos.textContent = recursos.length;

    // ✔ 3) Recurso más reciente
    const reciente = document.getElementById("reciente");

    if (recursos.length === 0) {
        reciente.textContent = "N/A";
        return;
    }

    const ultimo = recursos.reduce((prev, curr) => {
        return new Date(prev.fechaPublicacion) > new Date(curr.fechaPublicacion) ? prev : curr;
    });

    reciente.textContent = `${ultimo.titulo} (${new Date(ultimo.fechaPublicacion).toLocaleDateString()})`;
}


// ====================================================
// 🔵 ELIMINAR RECURSO
// ====================================================
window.eliminarRecurso = async function (idRecurso) {
    if (!confirm("¿Estás seguro de eliminar este recurso?")) return;

    try {
        const res = await fetch(`https://lsa-api.up.railway.app/api/RecursosDidacticos/${idRecurso}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Recurso eliminado.");
            cargarMisRecursos();
        } else {
            alert("Error al eliminar el recurso.");
        }
    } catch (error) {
        console.error("Error en la solicitud DELETE:", error);
    }
};


// ====================================================
// 🔵 TOGGLE MENU
// ====================================================
const btn = document.getElementById('toggleMenu');
const aside = document.querySelector('.sidebar');

btn.addEventListener('click', () => {
    aside.classList.toggle('open');
});


// ====================================================
// 🔵 CARGAR TODO AL INICIAR
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
    cargarMisRecursos();
});
