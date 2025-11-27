import { obtenerIdDocenteLogueado } from './utils.js';

const API_URL = "https://localhost:7061/api";


async function cargarMisRecursos() {
    const idDocente = await obtenerIdDocenteLogueado();
    const contenedor = document.getElementById("listaMisRecursos");

    if (!idDocente) {
        contenedor.innerHTML = '<p class="info-msg">Necesita ser un docente para ver esta sección.</p>';
        return;
    }

    contenedor.innerHTML = '<p>Cargando tus recursos...</p>';

    try {
        
        const res = await fetch(`https://localhost:7061/api/RecursosDidacticos/PorDocente/${idDocente}`);
        if (!res.ok) {
            contenedor.innerHTML = '<p class="error-msg">Error al cargar los recursos.</p>';
            return;
        }

        const recursos = await res.json();
        contenedor.innerHTML = ''; 

        if (recursos.length === 0) {
            contenedor.innerHTML = '<p class="info-msg">Aún no has subido recursos didácticos.</p>';
            return;
        }

        recursos.forEach(r => {
            const card = document.createElement("div");
                card.className = 'recurso-card'; 
                card.innerHTML = `
                    <h3>${r.titulo}</h3>
                    <p>${r.descripcion}</p>
                    <div class="card-actions">
                        <a href="${r.urlRecurso}" target="_blank" class="btn-ver">Ver Recurso</a>
                        <button onclick="eliminarRecurso(${r.idRecurso})" class="btn-delete">Eliminar</button>
                    </div>
                    <small>Publicado: ${new Date(r.fechaPublicacion).toLocaleDateString()}</small>
                `;
                contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando recursos:", error);
        contenedor.innerHTML = '<p class="error-msg">Error de conexión con el servidor.</p>';
    }
}


window.eliminarRecurso = async function (idRecurso) {
    if (!confirm("¿Estás seguro de eliminar este recurso?")) return;

    try {
        const res = await fetch(`${API_URL}/RecursosDidacticos/${idRecurso}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Recurso eliminado correctamente.");
            cargarMisRecursos(); 
        } else {
            alert("Error al eliminar el recurso.");
        }
    } catch (error) {
        console.error("Error en la solicitud DELETE:", error);
    }
}

 const btn = document.getElementById('toggleMenu');
  const aside = document.querySelector('.sidebar');

  btn.addEventListener('click', () => {
    aside.classList.toggle('open');
  });


document.addEventListener("DOMContentLoaded", () => {

    cargarMisRecursos(); 
    

    document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuario");
        window.location.href = 'login.html';
    });

    document.getElementById("btnNuevoRecurso").addEventListener("click", () => {

        window.location.href = 'subir-recursos.html'; 
    });
});