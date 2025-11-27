

/**
 * Obtiene el IdUsuario del usuario logueado almacenado en localStorage.
 * @returns {number|null} El IdUsuario como número, o null si no hay sesión.
 */
export function obtenerIdUsuarioLogueado() {
    const usuarioJson = localStorage.getItem("usuario");
    
    if (usuarioJson) {
        try {
            const usuario = JSON.parse(usuarioJson);
            // Aseguramos que idUsuario existe y es un número
            if (usuario && typeof usuario.idUsuario === 'number') {
                return usuario.idUsuario;
            }
        } catch (e) {
            console.error("Error al parsear el usuario de localStorage:", e);
        }
    }
    return null;
}







export async function obtenerIdDocenteLogueado() {
    
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
    const idUsuario = usuarioLogueado ? usuarioLogueado.idUsuario : null;


    if (usuarioLogueado) {
        console.log("ID de Usuario encontrado (de LS):", usuarioLogueado.id);
    }


    if (!idUsuario) {
        alert("Error: No se pudo identificar al usuario.");
        window.location.href = 'login.html'; 
        return null;
    }  

    try {
        const res = await fetch(`https://localhost:7061/api/Docentes/PorUsuario/${idUsuario}`);
        if (!res.ok) {
            console.error("Usuario no es un docente activo o API falló.");
            return null;
        }
        
        const docente = await res.json();
        

        console.log("ID de DOCENTE obtenido de la API:", docente.idDocente); 
        
        return docente.idDocente; 
        
    } catch (error) {
        console.error("Error al obtener datos del docente:", error);
        return null;
    }
}




/**
 * Guarda el progreso de una actividad en localStorage,
 * asociándolo al ID único del alumno.
 * * @param {string} alumnoId - El ID único del alumno logueado.
 * @param {string} actividadId - El ID de la actividad (ej. 'memoria').
 */
export function guardarProgreso(alumnoId, actividadId) {
    
    // 1. Crear la clave de almacenamiento UNICA para este alumno
    const claveProgreso = `progresoLSA_${alumnoId}`;
    
    // 2. Cargar el objeto completo de progreso del alumno
    const progresoAlumno = JSON.parse(localStorage.getItem(claveProgreso)) || {};

    // 3. Marcar la actividad actual como completada
    progresoAlumno[actividadId] = {
        completada: true,
        fecha: new Date().toISOString() // Usamos formato ISO para fácil comparación
    };

    // 4. Guardar el objeto de vuelta en localStorage con la clave UNICA
    localStorage.setItem(claveProgreso, JSON.stringify(progresoAlumno));
    
    console.log(`Progreso guardado para: ${actividadId} del alumno: ${alumnoId}`);
}

/**
 * Función auxiliar para obtener el progreso de un alumno.
 * La necesitarás para leer el progreso en otras partes de la app.
 * * @param {string} alumnoId - El ID único del alumno logueado.
 * @returns {object} El objeto de progreso del alumno.
 */
export function obtenerProgreso(alumnoId) {
    const claveProgreso = `progresoLSA_${alumnoId}`;
    return JSON.parse(localStorage.getItem(claveProgreso)) || {};
}

export function actividadYaCompletada(alumnoId, actividadId) {
    const claveProgreso = `progresoLSA_${alumnoId}`;
    const progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {};

    return progreso[actividadId]?.completada === true;
}