// Banco enriquecido con tus 8 categorías personalizadas
const BANCO_PALABRAS = [
    // Categoría: Países
    { palabra: "COLOMBIA", categoria: "Países" },
    { palabra: "ARGENTINA", categoria: "Países" },
    { palabra: "ALEMANIA", categoria: "Países" },
    { palabra: "JAPON", categoria: "Países" },
    { palabra: "CANADA", categoria: "Países" },
    { palabra: "ITALIA", categoria: "Países" },

    // Categoría: PROGRAMACION
    { palabra: "JAVASCRIPT", categoria: "PROGRAMACION" },
    { palabra: "DATABASE", categoria: "PROGRAMACION" },
    { palabra: "DEVELOPER", categoria: "PROGRAMACION" },
    { palabra: "FRONTEND", categoria: "PROGRAMACION" },
    { palabra: "ALGORITMO", categoria: "PROGRAMACION" },
    { palabra: "BACKEND", categoria: "PROGRAMACION" },

    // Categoría: ESTILOS MUSICALES
    { palabra: "ELECTRONICA", categoria: "ESTILOS MUSICALES" },
    { palabra: "SYNTHPOP", categoria: "ESTILOS MUSICALES" },
    { palabra: "RAP", categoria: "ESTILOS MUSICALES" },
    { palabra: "ROCK", categoria: "ESTILOS MUSICALES" },
    { palabra: "REGGAE", categoria: "ESTILOS MUSICALES" },
    { palabra: "HOUSE", categoria: "ESTILOS MUSICALES" },

    // Categoría: Animales
    { palabra: "LEOPARDO", categoria: "Animales" },
    { palabra: "TIBURON", categoria: "Animales" },
    { palabra: "PANTERA", categoria: "Animales" },
    { palabra: "ELEFANTE", categoria: "Animales" },
    { palabra: "DELFIN", categoria: "Animales" },
    { palabra: "AGUILA", categoria: "Animales" },

    // Categoría: Futbol
    { palabra: "DELANTERO", categoria: "Futbol" },
    { palabra: "ARBITRO", categoria: "Futbol" },
    { palabra: "ESTADIO", categoria: "Futbol" },
    { palabra: "CAMPEON", categoria: "Futbol" },
    { palabra: "PENALTI", categoria: "Futbol" },
    { palabra: "FUERADEJUEGO", categoria: "Futbol" },

    // Categoría: Colores
    { palabra: "AMARILLO", categoria: "Colores" },
    { palabra: "FUCSIA", categoria: "Colores" },
    { palabra: "TURQUESA", categoria: "Colores" },
    { palabra: "PUPURA", categoria: "Colores" },
    { palabra: "CELESTE", categoria: "Colores" },
    { palabra: "ESMERALDA", categoria: "Colores" },

    // Categoría nueva 1: Comida (Cero programación)
    { palabra: "HAMBURGUESA", categoria: "Comida" },
    { palabra: "PIZZA", categoria: "Comida" },
    { palabra: "LASAÑA", categoria: "Comida" },
    { palabra: "CHOCOLATE", categoria: "Comida" },
    { palabra: "EMPANADA", categoria: "Comida" },
    { palabra: "PASTEL", categoria: "Comida" },

    // Categoría nueva 2: Películas (Cero programación)
    { palabra: "AVATAR", categoria: "Películas" },
    { palabra: "TITANIC", categoria: "Películas" },
    { palabra: "INCEPTION", categoria: "Películas" },
    { palabra: "GLADIADOR", categoria: "Películas" },
    { palabra: "INTERSTELLAR", categoria: "Películas" },
    { palabra: "MATRIX", categoria: "Películas" }
];

let palabraSecreta = "";
let categoriaActual = "";
let letrasAdivinadas = [];
let letrasIncorrectas = [];
let errores = 0;
const MAX_ERRORES = 6;

let ganadas = 0;
let perdidas = 0;
let racha = 0;

// Elementos de la interfaz
const palabraDisplay = document.getElementById('palabraDisplay');
const listaIncorrectas = document.getElementById('listaIncorrectas');
const teclado = document.getElementById('teclado');
const btnReiniciar = document.getElementById('btnReiniciar');
const categoriaTexto = document.getElementById('categoria-texto');
const canvasBox = document.getElementById('canvasBox');

// Elementos del Modal
const modal = document.getElementById('modalResultado');
const modalIcon = document.getElementById('modalIcon');
const modalTitulo = document.getElementById('modalTitulo');
const modalMensaje = document.getElementById('modalMensaje');
const btnModalSiguiente = document.getElementById('btnModalSiguiente');

const canvas = document.getElementById('lienzo');
const ctx = canvas ? canvas.getContext('2d') : null;

function inicializarTeclado() {
    if (!teclado) return;
    const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
    teclado.innerHTML = "";
    
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.classList.add('tecla');
        btn.id = `t-${letra}`;
        btn.addEventListener('click', () => verificarLetra(letra));
        teclado.appendChild(btn);
    });
}

function comenzarNuevaPartida() {
    if (BANCO_PALABRAS.length === 0) return;

    const item = BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)];
    palabraSecreta = item.palabra;
    categoriaActual = item.categoria;

    letrasAdivinadas = [];
    letrasIncorrectas = [];
    errores = 0;

    if (categoriaTexto) categoriaTexto.textContent = categoriaActual;
    if (listaIncorrectas) listaIncorrectas.textContent = "Ninguna";
    if (canvasBox) canvasBox.className = "canvas-wrapper";

    document.querySelectorAll('.tecla').forEach(b => {
        b.disabled = false;
        b.className = 'tecla';
    });

    prepararLienzoEstructura();
    renderizarEspaciosPalabra();
}

function renderizarEspaciosPalabra() {
    if (!palabraDisplay) return;
    palabraDisplay.innerHTML = "";
    
    palabraSecreta.split("").forEach(letra => {
        const slot = document.createElement('div');
        slot.classList.add('letra-slot');
        if (letrasAdivinadas.includes(letra)) {
            slot.textContent = letra;
            slot.classList.add('revelada');
        } else {
            slot.textContent = "";
        }
        palabraDisplay.appendChild(slot);
    });
}

function verificarLetra(letra) {
    const boton = document.getElementById(`t-${letra}`);
    if (!boton || boton.disabled) return;

    boton.disabled = true;

    if (palabraSecreta.includes(letra)) {
        boton.classList.add('hit');
        letrasAdivinadas.push(letra);
        renderizarEspaciosPalabra();
        analizarSiGano();
    } else {
        boton.classList.add('miss');
        letrasIncorrectas.push(letra);
        if (listaIncorrectas) listaIncorrectas.textContent = letrasIncorrectas.join(", ");
        errores++;
        
        if (canvasBox) {
            canvasBox.classList.add('shake-error');
            setTimeout(() => canvasBox.classList.remove('shake-error'), 400);
        }
        
        dibujarMonigotePro(errores);
        analizarSiPerdio();
    }
}

function analizarSiGano() {
    const exito = palabraSecreta.split("").every(l => letrasAdivinadas.includes(l));
    if (exito) {
        ganadas++; racha++;
        actualizarTablerosUI();
        if (canvasBox) canvasBox.classList.add('glow-victory');
        dispararModalResultado(true);
    }
}

function analizarSiPerdio() {
    if (errores >= MAX_ERRORES) {
        perdidas++; racha = 0;
        actualizarTablerosUI();
        dispararModalResultado(false);
    }
}

function actualizarTablerosUI() {
    const g = document.getElementById('ganadas');
    const p = document.getElementById('perdidas');
    const r = document.getElementById('racha');
    if (g) g.textContent = ganadas;
    if (p) p.textContent = perdidas;
    if (r) r.textContent = racha;
}

function dispararModalResultado(esVictoria) {
    if (!modal || !modalTitulo || !modalMensaje || !modalIcon) return;

    if (esVictoria) {
        modalIcon.textContent = "🏆";
        modalTitulo.textContent = "¡CÓDIGO ADIVINADO!";
        modalTitulo.style.color = "var(--neon-success)";
        modalMensaje.innerHTML = `Excelente trabajo. La palabra era: <span style="color:var(--neon-blue)">${palabraSecreta}</span>`;
    } else {
        modalIcon.textContent = "💀";
        modalTitulo.textContent = "SISTEMA CAÍDO";
        modalTitulo.style.color = "var(--neon-magenta)";
        modalMensaje.innerHTML = `Te has quedado sin intentos. La palabra correcta era: <span style="color:white">${palabraSecreta}</span>`;
    }
    setTimeout(() => modal.classList.add('show'), 350);
}

// --- GENERADOR DE GRÁFICOS HD NEON ---
function prepararLienzoEstructura() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#475569"; 
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(25, 235); ctx.lineTo(105, 235); 
    ctx.moveTo(65, 235); ctx.lineTo(65, 25);   
    ctx.moveTo(65, 25);  ctx.lineTo(165, 25);  
    ctx.moveTo(165, 25); ctx.lineTo(165, 60);  
    ctx.stroke();
}

function dibujarMonigotePro(fase) {
    if (!ctx) return;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ff0055"; 
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0055";

    ctx.beginPath();
    switch (fase) {
        case 1: // Cabeza
            ctx.arc(165, 85, 22, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 2: // Cuerpo
            ctx.moveTo(165, 107); ctx.lineTo(165, 170);
            ctx.stroke();
            break;
        case 3: // Brazo Izquierdo
            ctx.moveTo(165, 120); ctx.lineTo(135, 145);
            ctx.stroke();
            break;
        case 4: // Brazo Derecho
            ctx.moveTo(165, 120); ctx.lineTo(195, 145);
            ctx.stroke();
            break;
        case 5: // Pierna Izquierda
            ctx.moveTo(165, 170); ctx.lineTo(135, 215);
            ctx.stroke();
            break;
        case 6: // Pierna Derecha
            ctx.moveTo(165, 170); ctx.lineTo(195, 215);
            ctx.stroke();
            break;
    }
    ctx.shadowBlur = 0;
}

// Inicialización automatizada al cargar
document.addEventListener("DOMContentLoaded", () => {
    inicializarTeclado();
    comenzarNuevaPartida();

    if (btnReiniciar) btnReiniciar.addEventListener('click', comenzarNuevaPartida);
    if (btnModalSiguiente) {
        btnModalSiguiente.addEventListener('click', () => {
            modal.classList.remove('show');
            comenzarNuevaPartida();
        });
    }
});