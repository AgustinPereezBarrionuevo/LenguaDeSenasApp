import { guardarProgreso, obtenerIdUsuarioLogueado, actividadYaCompletada  } from "./utils.js";

// ==============================================
// 1. CONFIGURACIÓN DE CLOUDINARY
// ==============================================
const CLOUD_NAME = 'dtmgalzz4';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload`;
const VIDEO_PUBLIC_ID = 'Saludos_en_LSA_-_Lengua_de_Señas_Argentina_gnxtab';


// ==============================================
// 2. REFERENCIAS DEL DOM Y LÓGICA DE INICIALIZACIÓN
// ==============================================

// Nota: Las referencias se obtienen dentro de DOMContentLoaded para evitar 'null'
document.addEventListener('DOMContentLoaded', () => {

    // Referencias del DOM obtenidas cuando el HTML está listo
    const frases = document.querySelectorAll('#frasesList li');
    const videoContainer = document.getElementById('videoContainer'); // El contenedor padre
    const tituloFrase = document.getElementById('tituloFrase');

    const frasesVistas = new Set(); 
    const totalFrases = frases.length;
    const actividadId = 'frasesBasicas';

    const alumnoId = obtenerIdUsuarioLogueado();
    
    // Si no hay ID, no deberíamos permitir guardar el progreso
    if (alumnoId === null) {
        // Mejor manejar esta situación para prevenir errores
        console.error("Usuario no logueado. El progreso no se leerá ni guardará.");
    }

  let yaCompletado = actividadYaCompletada(alumnoId, actividadId);

    frases.forEach(frase => {
        frase.addEventListener('click', () => {
            
            // Lógica de clase 'activo'
            frases.forEach(f => f.classList.remove('activo'));
            frase.classList.add('activo');

            // Actualizar el título
            tituloFrase.textContent = frase.textContent;

            // Obtener los tiempos y calcular duración
            const start = parseInt(frase.dataset.start);
            const end = parseInt(frase.dataset.end);
            const duration = end - start;

            // Crear la transformación y la URL de Cloudinary
            const transformacion = `so_${start},du_${duration}`;
            const videoURL = `${BASE_URL}/${transformacion}/${VIDEO_PUBLIC_ID}.mp4`;
            
            
            // 💡 1. CREAR el nuevo elemento <video>
            const newVideoElement = document.createElement('video');
            newVideoElement.id = 'visorVideo'; // ID para aplicar estilos CSS
            newVideoElement.autoplay = true; 
            newVideoElement.muted = true;
            newVideoElement.loop = true;
            newVideoElement.controls = true;
            
            // 2. ASIGNAR el SRC al ELEMENTO RECIÉN CREADO
            newVideoElement.src = videoURL; 
            
            
            // 3. Limpiar el contenedor (elimina el placeholder o video anterior)
            if (videoContainer) {
                videoContainer.innerHTML = ''; 
                // 4. Añadir el nuevo elemento de video
                videoContainer.appendChild(newVideoElement);

                // 5. Reproducir el nuevo video
                newVideoElement.load(); 
                newVideoElement.play().catch(error => {
                    console.error("Error al intentar reproducir el video:", error);
                });

                        if (!yaCompletado && alumnoId !== null) {
                    frasesVistas.add(frase.textContent.trim());

                    if (frasesVistas.size === totalFrases) {

                        // ✔ Guardar progreso SOLO si no estaba completado antes
                        if (!actividadYaCompletada(alumnoId, actividadId)) {
                            guardarProgreso(alumnoId, actividadId);
                            console.log("Progreso guardado por primera vez.");
                        } else {
                            console.log("Actividad ya estaba completada. No se vuelve a guardar.");
                        }

                        yaCompletado = true;
                        tituloFrase.textContent = "¡Actividad Completada! ⭐";
                    }
                }
            } else {
                console.error("Error: El contenedor 'videoContainer' no se encontró.");
            }
        });
    });
});