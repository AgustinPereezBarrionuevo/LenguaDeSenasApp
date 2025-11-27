import { obtenerIdUsuarioLogueado } from './utils.js';

// ==============================================
// 1. LÓGICA DE PROGRESO (CORREGIDA)
// ==============================================

function actualizarDashboardProgreso() {
    
    // 1. Obtener el ID del alumno logueado
    const alumnoId = obtenerIdUsuarioLogueado();

    // Si no hay ID, no podemos leer el progreso individual.
    if (!alumnoId) {
        console.warn("No se pudo obtener el ID del usuario. No se cargará el progreso individual.");
        // Opcional: Podrías resetear los valores del dashboard aquí
        return; 
    }
    
    // 2. Cargar el estado del progreso desde localStorage usando la CLAVE ÚNICA
    const claveUnica = `progresoLSA_${alumnoId}`; // <-- ¡La clave correcta!
    const progresoAlumno = JSON.parse(localStorage.getItem(claveUnica)) || {}; // <-- Se lee el progreso del alumno actual
    
    // IDs de las actividades disponibles en tu proyecto
    const actividadesTotales = [
        'memoria', 
        'abecedario', 
        'frasesBasicas'
    ];
    
    let completadas = 0;
    let ultimaFecha = null; // Usamos null para facilitar la comparación de fechas
    
    // Contar completadas y buscar la última fecha
    for (const id of actividadesTotales) {
        // Usamos el objeto de progreso del alumno actual (progresoAlumno)
        if (progresoAlumno[id] && progresoAlumno[id].completada) {
            completadas++;
            
            // Lógica para determinar la última actividad completada
            const fechaActividad = new Date(progresoAlumno[id].fecha);
            
            if (ultimaFecha === null || fechaActividad > ultimaFecha) { // Comparamos con el objeto Date directamente
                ultimaFecha = fechaActividad;
            }
        }
    }

    // Calcular el progreso
    const totalActividades = actividadesTotales.length;
    const porcentajeProgreso = totalActividades > 0 
        ? Math.round((completadas / totalActividades) * 100) 
        : 0;

    // Formatear la última fecha para mostrar
    const ultimaFechaMostrar = ultimaFecha !== null 
        ? ultimaFecha.toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
          })
        : 'N/A';
        
    // 3. Actualizar las Tarjetas (Cards)
    document.getElementById('progresoGeneral').textContent = `${porcentajeProgreso}%`;
    document.getElementById('actividadesCompletadas').textContent = completadas;
    document.getElementById('ultimaActividad').textContent = ultimaFechaMostrar;

    // 4. Actualizar la Barra de Progreso
    const barra = document.getElementById('barra');
    if (barra) {
        barra.style.width = `${porcentajeProgreso}%`;
    }
    
    console.log(`Progreso actualizado para el alumno ID ${alumnoId}: ${porcentajeProgreso}%`);
}

// ==============================================
// 2. LÓGICA DE CARGA DE RECURSOS (SIN CAMBIOS)
// ==============================================

async function cargarRecursosPublicos() {
// ... (código sin cambios)
}

function renderizarPublicos(lista) {
// ... (código sin cambios)
}

function determinarTipo(url) {
// ... (código sin cambios)
}


 const btn = document.getElementById('toggleMenu');
  const aside = document.querySelector('.sidebar');

  btn.addEventListener('click', () => {
    aside.classList.toggle('open');
  });



// ==============================================
// 3. INICIALIZACIÓN (DOMContentLoaded) - Correcto
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar el progreso (NUEVO)
    actualizarDashboardProgreso(); // <-- Se llama la función corregida
    
    // 2. Cargar los recursos públicos (EXISTENTE)
    cargarRecursosPublicos();
});