const API_URL = "https://localhost:7061/api";

async function cargarTodosLosRecursos() {
    const contenedor = document.getElementById("listaRecursosAlumno");
    contenedor.innerHTML = '<p>Cargando material didáctico...</p>';

    try {
        
        const res = await fetch(`${API_URL}/RecursosDidacticos`); 
        
        if (!res.ok) {
            contenedor.innerHTML = '<p class="error-msg">No se pudo conectar con la base de datos de recursos.</p>';
            return;
        }

        const recursos = await res.json();
        contenedor.innerHTML = ''; 

        if (recursos.length === 0) {
            contenedor.innerHTML = '<p class="info-msg">Aún no hay recursos públicos disponibles.</p>';
            return;
        }

        recursos.forEach(r => {
            const card = document.createElement("div");
            card.className = 'recurso-card';
            card.innerHTML = `
                <h3>${r.titulo}</h3>
                <p>${r.descripcion.substring(0, 150)}...</p>
                <div class="card-actions">
                    <a href="${r.urlRecurso}" target="_blank" class="btn-ver">Ver Recurso</a>
                </div>
                <small>Publicado: ${new Date(r.fechaPublicacion).toLocaleDateString()}</small>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando recursos:", error);
        contenedor.innerHTML = '<p class="error-msg">Error de conexión.</p>';
    }
}


 const btn = document.getElementById('toggleMenu');
  const aside = document.querySelector('.sidebar');

  btn.addEventListener('click', () => {
    aside.classList.toggle('open');
  });

document.addEventListener("DOMContentLoaded", cargarTodosLosRecursos);