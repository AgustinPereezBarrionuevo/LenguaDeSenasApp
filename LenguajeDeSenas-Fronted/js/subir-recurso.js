import { obtenerIdDocenteLogueado } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {

    const formRecurso = document.getElementById("formRecurso");


    if (formRecurso) {
        formRecurso.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idDocenteReal = await obtenerIdDocenteLogueado();
            if (!idDocenteReal) {
                alert("Error: No se pudo verificar el ID de docente. La creación fallará.");
                return;
            }
            

            const recurso = {
                titulo: document.getElementById("titulo").value,
                descripcion: document.getElementById("descripcion").value,
                urlRecurso: document.getElementById("url").value,
                idDocente: idDocenteReal
            };
            
   
            try {
                const res = await fetch("https://localhost:7061/api/RecursosDidacticos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(recurso)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    alert("Error al subir el recurso: " + (errorData.mensaje || res.statusText)); 
                    return;
                }

                alert("Recurso creado correctamente");
                window.location.href = "mis-recursos.html";
            } catch (error) {
                alert("Error de red al subir el recurso.");
                console.error("Error en POST:", error);
            }
        });
    } else {
         console.error("El elemento 'formRecurso' no se encontró en esta página. Revise el HTML.");
    }
});

 const btn = document.getElementById('toggleMenu');
  const aside = document.querySelector('.sidebar');

  btn.addEventListener('click', () => {
    aside.classList.toggle('open');
  });