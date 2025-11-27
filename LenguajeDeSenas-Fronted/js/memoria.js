import { guardarProgreso, obtenerIdUsuarioLogueado, actividadYaCompletada } from "./utils.js";

const CLOUD_NAME = 'dtmgalzz4';
const BASE_URL_IMAGENES = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

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

// ================================
// 🔵 GENERAMOS EL ARRAY IMAGES AUTOMÁTICAMENTE
// ================================
const IMAGES = Object.keys(PUBLIC_IDS_EXAMEN).map(letra => ({
    id: letra,
    type: "img",
    label: letra,
    src: `${BASE_URL_IMAGENES}/${PUBLIC_IDS_EXAMEN[letra]}.png`
}));



// Estado
let board = document.getElementById('board');
let attemptsEl = document.getElementById('attempts');
let matchesEl = document.getElementById('matches');
let timerEl = document.getElementById('timer');
let messageArea = document.getElementById('messageArea');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let totalPairs = 8;
let timerInterval = null;
let startTime = null;

// Utilidades
function shuffleArray(a){
  // Fisher-Yates
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(pairsCount){
  // choose N items from IMAGES
  const chosen = IMAGES.slice(0); // shallow copy
  shuffleArray(chosen);
  const selected = chosen.slice(0,pairsCount);
  const deck = [];

  // For each item, create two cards:
  // - one with the image
  // - one with the text label (la "pareja")
  selected.forEach(item=>{
    const cardImg = {
      id: item.id,
      side: 'img',
      content: item.src,
      label: item.label
    };
    const cardText = {
      id: item.id,
      side: 'text',
      content: item.label,
      label: item.label
    };
    deck.push(cardImg, cardText);
  });

  return shuffleArray(deck);
}

function formatTime(ms){
  const s = Math.floor(ms/1000);
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  return `${mm}:${ss}`;
}

function startTimer(){
  startTime = Date.now();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    const elapsed = Date.now() - startTime;
    timerEl.textContent = formatTime(elapsed);
  }, 500);
}

function stopTimer(){
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function buildBoard(){
  board.innerHTML = '';
  attempts = 0; matches = 0;
  attemptsEl.textContent = attempts;
  matchesEl.textContent = matches;
  messageArea.textContent = "¡A jugar!";
  stopTimer();

  // determine number of columns by pairs
  const cols = (totalPairs <= 6) ? 3 : (totalPairs <= 8) ? 4 : 6;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  const deck = createDeck(totalPairs);
  deck.forEach((cardData, index)=>{
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.setAttribute('data-id', cardData.id);
    card.setAttribute('data-side', cardData.side);
    card.setAttribute('aria-label', 'Carta sin voltear');
    card.setAttribute('data-index', index);

    // back face (visible antes de voltear)
    const back = document.createElement('div');
    back.className = 'face back';
    back.innerHTML = `<div style="text-align:center;font-weight:700">?</div>`;
    // front face (lo que se muestra al voltear)
    const front = document.createElement('div');
    front.className = 'face front';

    if(cardData.side === 'img'){
      const img = document.createElement('img');
      img.src = cardData.content;
      img.alt = `Seña ${cardData.label}`;
      front.appendChild(img);
    } else {
      // texto: mostrar label grande
      const span = document.createElement('div');
      span.style.fontSize='34px';
      span.style.fontWeight='800';
      span.textContent = cardData.content;
      front.appendChild(span);
    }

    card.appendChild(back);
    card.appendChild(front);

    card.addEventListener('click', onCardClick);

    board.appendChild(card);
  });

  // start timer on first user interaction
}


function chequearProgresoInicial() {
    // Usaremos el mismo ID y actividad que finishGame
    const alumnoId = obtenerIdUsuarioLogueado();
    const actividadId = 'memoria'; 
    
    if (!alumnoId) return false;

    const claveProgreso = `progresoLSA_${alumnoId}`;
    const progresoAlumno = JSON.parse(localStorage.getItem(claveProgreso)) || {};
    
    const completado = progresoAlumno[actividadId] && progresoAlumno[actividadId].completada;
    
    if (completado) {
        // Opcional: Si quieres mostrar algún mensaje o estado visual al inicio
        messageArea.textContent = "¡Juego de Memoria Completado! Puedes reiniciar para mejorar tu puntaje.";
        console.log(`Juego de Memoria ya completado por el usuario ${alumnoId}.`);
    }
    return completado;
}

function onCardClick(e){
  if(lockBoard) return;
  const card = e.currentTarget;
  if(card.classList.contains('matched')) return;

  // start timer
  if(!timerInterval){
    startTimer();
  }

  // Evitar doble clic sobre la misma carta
  if(card === firstCard) return;

  card.classList.add('flip');

  if(!firstCard){
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const id1 = firstCard.getAttribute('data-id');
  const id2 = secondCard.getAttribute('data-id');

  const side1 = firstCard.getAttribute('data-side');
  const side2 = secondCard.getAttribute('data-side');

  attempts++;
  attemptsEl.textContent = attempts;

  // MATCH válido: misma letra pero lados distintos (img ↔ text)
  if(id1 === id2 && side1 !== side2){

    matches++;
    matchesEl.textContent = matches;

    // Evitar más clics en cartas ya acertadas
    firstCard.removeEventListener('click', onCardClick);
    secondCard.removeEventListener('click', onCardClick);

    firstCard.setAttribute('aria-label','Pareja encontrada');
    secondCard.setAttribute('aria-label','Pareja encontrada');

    const cardA = firstCard;
    const cardB = secondCard;

    // animación para marcar que están matcheadas
    setTimeout(()=>{
      cardA.classList.add('matched');
      cardB.classList.add('matched');
      resetTurn(); // AHORA SÍ VA AQUÍ
    }, 600);

    if(matches >= totalPairs){
      finishGame();
    } else {
      messageArea.textContent = "¡Bien! Encontraste una pareja.";
    }

  } else {

    messageArea.textContent = "No coincide, intentá de nuevo.";

    // no match → volver a tapar
    setTimeout(()=>{
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetTurn();
    }, 900);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}



function showAllTemporary(duration = 2000) {
  const cards = document.querySelectorAll('.card');

  // Mostrar todas
  cards.forEach(card => {
    card.classList.add('flip');
  });

  // Luego ocultarlas, excepto las ya matcheadas
  setTimeout(() => {
    cards.forEach(card => {
      if (!card.classList.contains('matched')) {
        card.classList.remove('flip');
      }
    });
  }, duration);
}

async function finishGame(){ 
    stopTimer();
    const elapsed = Date.now() - startTime;
    
    // 1. Obtener el ID del usuario logueado
    const alumnoId = obtenerIdUsuarioLogueado(); 

    if (alumnoId !== null) {
        // 2. Guardar el progreso con el ID único
        // 💡 CAMBIO: Ahora pasamos el alumnoId como primer argumento
       if (!actividadYaCompletada(alumnoId, "memoria")) {
    guardarProgreso(alumnoId, "memoria");
            console.log("Progreso guardado por PRIMERA vez.");
        } else {
            console.log("El usuario ya había completado esta actividad. No se vuelve a guardar.");
        }
        console.log(`Progreso de memoria guardado para el usuario: ${alumnoId}`);
    } else {
        console.warn("No se pudo guardar el progreso de memoria: ID de usuario no encontrado.");
    }

    // Texto para el modal
    document.getElementById("finishStats").innerHTML =
      `Terminaste en <strong>${attempts}</strong> intentos.<br>
      Tiempo: <strong>${formatTime(elapsed)}</strong>`;

    // Mostrar modal
    document.getElementById("finishModal").classList.remove("modal-hidden");
}

function reiniciarJuego() {
    stopTimer();
    timerEl.textContent = "00:00";
    attempts = 0;
    matches = 0;
    attemptsEl.textContent = 0;
    matchesEl.textContent = 0;

    totalPairs = parseInt(document.getElementById('level').value,10);
    buildBoard();
}




// UI bindings
document.getElementById('restart').addEventListener('click', ()=>{
  totalPairs = parseInt(document.getElementById('level').value,10);
  buildBoard();
  chequearProgresoInicial();
});
document.getElementById('level').addEventListener('change', (e)=>{
  totalPairs = parseInt(e.target.value,10);
  buildBoard();
});
document.getElementById('show-all').addEventListener('click', ()=> showAllTemporary(1800));

// iniciar con el valor por defecto
totalPairs = parseInt(document.getElementById('level').value,10);
buildBoard();