
import { guardarProgreso, obtenerIdUsuarioLogueado, actividadYaCompletada } from "./utils.js";

const CLOUD_NAME = 'dtmgalzz4';
const VIDEO_PUBLIC_ID = 'Abecedario_en_LSA___Alfabeto_Dactilológico___Lengua_de_Señas_Argentina_d76sip';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload`;
const BASE_URL_IMAGEN_EXAMEN = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;



const TIEMPOS_LETRAS = {
  "A": { start: 8, duration: 4 },
  "B": { start: 12, duration: 3 },
  "C": { start: 15, duration: 3 },
  "CH":{ start: 18, duration: 3 },
  "D": { start: 21, duration: 3 },
  "E": { start: 24, duration: 3 },
  "F": { start: 27, duration: 4 },
  "G": { start: 31, duration: 3 },
  "H": { start: 34, duration: 3 },
  "I": { start: 38, duration: 3 },
  "J": { start: 42, duration: 3 },
  "K": { start: 45, duration: 4 },
  "L": { start: 49, duration: 3 },
  "M": { start: 51, duration: 4 },
  "N": { start: 55, duration: 4 },
  "Ñ": { start: 58, duration: 4 },
  "O": { start: 62, duration: 4 },
  "P": { start: 65, duration: 7 },
  "Q": { start: 72, duration: 3 },
  "R": { start: 76, duration: 2 },
  "S": { start: 79, duration: 3 },
  "T": { start: 82, duration: 3 },
  "U": { start: 85, duration: 3 },
  "V": { start: 89, duration: 3 },
  "W": { start: 93, duration: 3 },
  "X": { start: 97, duration: 3 },
  "Y": { start: 100, duration: 3 },
  "Z": { start: 103, duration: 3 }
};



const letras = "A,B,C,CH,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
//const rutaVideos = "assets/videos/"; // carpeta donde guardás los mp4

let indice = 0;
let examenEnCurso = false;
let indicePreguntaExamen = 0;
let respuestasCorrectas = 0;
const totalPreguntas = 10;
let preguntasExamen = [];



// **MAPA DE PUBLIC IDs para las IMÁGENES del EXAMEN**
// ¡DEBES REEMPLAZAR estos valores de ejemplo por los IDs públicos reales de tus imágenes!
const PUBLIC_IDS_EXAMEN = {
  "A": "A_jz9lej", 
  "B": "B_h4scyj", 
  "C": "C_fdr5jq",
  "CH": "CH_zwy13l",
  "D": "D_afysgl",
  "E": "E_iy1kfx",
  "F": "F_dmqrku",
  "G": "G_yff2z8",
  "H": "H_kxrn1i",
  "I": "I_snrwjl",
  "J": "J_id8axm",
  "K": "K_fjjpci",
  "L": "L_zvpjpr",
  "M": "M_aiex6m",
  "N": "N_dpcc0g",
  "Ñ": "Ñ_kjkuw6",
  "O": "O_dzkanr",
  "P": "P_fxecgl",
  "Q": "Q_enxmv3",
  "R": "R_d3g3zd",
  "S": "S_h4zieg",
  "T": "T_cr9ff9",
  "U": "U_jmsuls",
  "V": "V_jmovfj",
  "W": "W_qw6wku",
  "X": "X_bwkglp",
  "Y": "Y_jinofq",
  "Z": "Z_pgtrb9"
};

// ==============================================
// 2. ELEMENTOS DEL DOM (Definidos aquí para que 'DOMContentLoaded' los encuentre)
// ==============================================

// Aprendizaje
let tituloLetra;
let videoLetra;
let btnAnt;
let btnRep;
let btnSig;

// Examen y Control
let examenBtn;
let quizSection;
let quizPregunta;
let quizVideo; // Debería ser un <img> en el HTML corregido
let quizOpciones;
let quizResultado;
let aprendizajeCard;

// Modal
let modalOverlay;
let modalTitulo;
let modalMensaje;
let modalPuntaje;
let btnReintentar;
let btnVolver;
let btnVolverPractica;

// ==============================================
// 3. FUNCIONES PRINCIPALES
// ==============================================

// --- Aprendizaje: Carga el segmento de video recortado de Cloudinary ---
function mostrarLetra() {
    const letra = letras[indice];
    const tiempos = TIEMPOS_LETRAS[letra];

    // Crea la transformación: so_X,du_Y (start_offset, duration)
    const transformacion = `so_${tiempos.start},du_${tiempos.duration}`;

    // Construye la URL del VIDEO RECORTADO
    const videoURL = `${BASE_URL}/${transformacion}/${VIDEO_PUBLIC_ID}.mp4`;
    
    tituloLetra.textContent = letra;
    videoLetra.src = videoURL;
    
    videoLetra.load(); 
    videoLetra.play().catch(() => {});
}

// --- Examen: Lógica de preguntas ---
function iniciarExamenFinal() {
    examenEnCurso = true;
    respuestasCorrectas = 0;
    indicePreguntaExamen = 0;
    
    preguntasExamen = generarPreguntasExamen();

    examenBtn.classList.add("hidden")

    aprendizajeCard.classList.add("hidden");
    quizSection.classList.remove("hidden");
    
    mostrarPreguntaExamen();
}

function generarPreguntasExamen() {
    const copia = [...letras];
    copia.sort(() => Math.random() - 0.5);
    return copia.slice(0, totalPreguntas);
}

// --- Examen: Muestra la pregunta usando la imagen de Cloudinary ---
function mostrarPreguntaExamen() {
    quizResultado.textContent = "";
    quizOpciones.innerHTML = "";

    const letraCorrecta = preguntasExamen[indicePreguntaExamen];

    // **UTILIZANDO LA IMAGEN SEPARADA DE CLOUDINARY**
    const imagePublicId = PUBLIC_IDS_EXAMEN[letraCorrecta]; 
    const imageURL = `${BASE_URL_IMAGEN_EXAMEN}/${imagePublicId}.png`; // Asumiendo extensión .png
    
    quizPregunta.textContent =
        `Pregunta ${indicePreguntaExamen + 1} de ${totalPreguntas}: ¿Qué letra corresponde a esta seña?`;

    // Asigna la URL de la IMAGEN al elemento <img> del quiz
    quizVideo.src = imageURL; 

    // Generación de opciones de respuesta (incluye la 'CH')
    const opciones = new Set([letraCorrecta]);
    while (opciones.size < 4) opciones.add(letras[Math.floor(Math.random() * letras.length)]);

    Array.from(opciones)
        .sort(() => Math.random() - 0.5)
        .forEach(op => {
            const btn = document.createElement("button");
            btn.textContent = op;
            btn.onclick = () => seleccionarRespuestaExamen(op, letraCorrecta);
            quizOpciones.appendChild(btn);
        });
}


function seleccionarRespuestaExamen(opcion, correcta) {
    if (opcion === correcta) respuestasCorrectas++;
    indicePreguntaExamen++;

    if (indicePreguntaExamen >= totalPreguntas) finalizarExamen();
    else mostrarPreguntaExamen();
}


async function finalizarExamen() {
    const porcentaje = Math.round((respuestasCorrectas / totalPreguntas) * 100);

    const notaMinima = 80;
    let mensaje = "";
    if (porcentaje >= notaMinima) {
        mensaje = "¡Excelente! Dominaste todas las señas 🎉";
        
        // 1. Obtener el ID del usuario logueado
        const alumnoId = obtenerIdUsuarioLogueado(); 
        
        // 2. Verificar que el ID exista antes de guardar
        if (alumnoId !== null) {
           
          if (!actividadYaCompletada(alumnoId, "abecedario")) {
            guardarProgreso(alumnoId, "abecedario");
            console.log("Progreso guardado por primera vez.");
        } else {
            console.log("El examen ya estaba completado. No se vuelve a guardar.");
        }
        
    } else if (porcentaje >= 50) {
        mensaje = "Buen intento. ¡Seguí practicando! 💪";
    } else {
        mensaje = "No te preocupes, con práctica lo vas a lograr 🙏";
    }
}

    modalTitulo.textContent = "Examen finalizado";
    modalMensaje.textContent = mensaje;
    modalPuntaje.textContent = `Resultado: ${respuestasCorrectas} / ${totalPreguntas} (${porcentaje}%)`;

    modalOverlay.classList.remove("hidden");

    quizSection.classList.add("hidden");
}



function chequearProgresoInicial(actividadId) {
    const alumnoId = obtenerIdUsuarioLogueado();
    if (!alumnoId) return false;

    // Usamos la misma lógica de clave única para leer
    const claveProgreso = `progresoLSA_${alumnoId}`;
    const progresoAlumno = JSON.parse(localStorage.getItem(claveProgreso)) || {};
    
    const completado = progresoAlumno[actividadId] && progresoAlumno[actividadId].completada;
    
    // Si la actividad está completa, puedes actualizar el DOM
    if (completado) {
        // Por ejemplo, deshabilitar el botón de examen o mostrar un mensaje
        if (examenBtn) {
            examenBtn.textContent = "¡Completado! Repetir Examen";
            examenBtn.classList.add("completado"); // Agrega una clase CSS visual
        }
        console.log(`Actividad ${actividadId} ya completada por el usuario ${alumnoId}.`);
    }
    return completado;
}

// ==============================================
// 4. INICIALIZACIÓN Y EVENT LISTENERS
// ==============================================

// **SOLUCIÓN AL ERROR DE REFERENCIA (DOM NO CARGADO)**
// Esto asegura que la lógica se ejecute solo cuando todos los elementos HTML existan.
document.addEventListener('DOMContentLoaded', () => {

    // **ASIGNACIÓN REAL DE LOS ELEMENTOS DEL DOM**
    // Se asignan los valores a las variables declaradas con 'let' arriba.
    
    // Aprendizaje
    tituloLetra = document.getElementById("letra-titulo");
    videoLetra = document.getElementById("video-letra");
    btnAnt = document.getElementById("btn-anterior");
    btnRep = document.getElementById("btn-repetir");
    btnSig = document.getElementById("btn-siguiente");
    
    // Examen y Control
    chequearProgresoInicial('abecedario');
    examenBtn = document.getElementById("btn-examen");
    quizSection = document.getElementById("quiz-section");
    quizPregunta = document.getElementById("quiz-pregunta");
    quizVideo = document.getElementById("quiz-video"); 
    quizOpciones = document.getElementById("quiz-opciones");
    quizResultado = document.getElementById("quiz-resultado");
    aprendizajeCard = document.getElementById("aprendizaje-card");

    // Modal
    modalOverlay = document.getElementById("modal-overlay");
    modalTitulo = document.getElementById("modal-titulo");
    modalMensaje = document.getElementById("modal-mensaje");
    modalPuntaje = document.getElementById("modal-puntaje");
    btnReintentar = document.getElementById("btn-reintentar");
    btnVolver = document.getElementById("btn-volver");
    btnVolverPractica = document.getElementById("btn-volver-practica");


    // Asignación de Event Listeners
    examenBtn.addEventListener("click", iniciarExamenFinal);

    btnSig.onclick = () => {
        indice = (indice + 1) % letras.length;
        mostrarLetra();
    };

    btnAnt.onclick = () => {
        indice = (indice - 1 + letras.length) % letras.length;
        mostrarLetra();
    };

    btnRep.onclick = () => {
        // Debemos verificar si videoLetra es null antes de usarlo
        if (videoLetra) {
            videoLetra.currentTime = 0;
            videoLetra.play();
        }
    };

    btnReintentar.onclick = () => {
        modalOverlay.classList.add("hidden");
        iniciarExamenFinal();
    };

    btnVolver.onclick = () => {
        modalOverlay.classList.add("hidden");
        quizSection.classList.add("hidden");
        aprendizajeCard.classList.remove("hidden");
        examenBtn.classList.remove("hidden");
    };
    
    if (btnVolverPractica) {
        btnVolverPractica.onclick = () => {
            examenEnCurso = false; 
            quizSection.classList.add("hidden");
            aprendizajeCard.classList.remove("hidden");
            examenBtn.classList.remove("hidden"); 
            mostrarLetra(); 
        };
    }

    // Llamada de inicialización
    mostrarLetra(); 
});