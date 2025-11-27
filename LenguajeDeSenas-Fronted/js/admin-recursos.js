const API_URL = "https://localhost:7061/api";

document.addEventListener("DOMContentLoaded", () => {
    cargarRecursos();
});

async function cargarRecursos() {
    const contenedor = document.getElementById("listaRecursos");
    contenedor.innerHTML = "<p>Cargando recursos...</p>";

    try {
        const resp = await fetch(`${API_URL}/RecursosDidacticos`);
        const recursos = await resp.json();

        contenedor.innerHTML = "";

        recursos.forEach(r => {

            const emailDocente = r.docente?.usuario?.email ?? "Desconocido";

            const card = document.createElement("div");
            card.classList.add("recurso-card");

            card.innerHTML = `
                <h3 class="recurso-titulo">${r.titulo}</h3>
                <p class="recurso-desc">${r.descripcion}</p>

                <p class="recurso-docente">Publicado por: <b>${emailDocente}</b></p>

                <button class="btn-eliminar" onclick="eliminarRecurso(${r.idRecurso})">
                    Eliminar recurso
                </button>
            `;

            contenedor.appendChild(card);
        });

    } catch (err) {
        contenedor.innerHTML = "<p>Error cargando los recursos.</p>";
        console.error(err);
    }
}

async function eliminarRecurso(id) {
    if (!confirm("¿Seguro que deseas eliminar este recurso?")) return;
    

    try {
        const resp = await fetch(`${API_URL}/RecursosDidacticos/${id}`, {
            method: "DELETE"
        });

        if (resp.ok) {
            alert("Recurso eliminado correctamente.");
            cargarRecursos();

             if (window.actualizarDashboard) window.actualizarDashboard();
             
        } else {
            alert("No se pudo eliminar el recurso.");
        }
    } catch (err) {
        console.error(err);
        alert("Error al eliminar.");
        
    }
    
}
