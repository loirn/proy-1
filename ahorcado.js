// Banco enriquecido con tus 8 categorías personalizadas
const BANCO_PALABRAS = [ // Declara una constante que contiene una matriz (array) de objetos. Este dato nunca reasigna su tipo.
    // Categoría: Países
    { palabra: "COLOMBIA", categoria: "Países" }, // Un objeto literal de JS (par clave/valor). Almacena la palabra y su categoría vinculada
    { palabra: "ARGENTINA", categoria: "Países" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ALEMANIA", categoria: "Países" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "JAPON", categoria: "Países" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "CANADA", categoria: "Países" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ITALIA", categoria: "Países" }, // Repetición: Objeto literal del banco de palabras

    // Categoría: PROGRAMACION
    { palabra: "JAVASCRIPT", categoria: "PROGRAMACION" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "DATABASE", categoria: "PROGRAMACION" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "DEVELOPER", categoria: "PROGRAMACION" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "FRONTEND", categoria: "PROGRAMACION" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ALGORITMO", categoria: "PROGRAMACION" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "BACKEND", categoria: "PROGRAMACION" }, // Repetición: Objeto literal del banco de palabras

    // Categoría: ESTILOS MUSICALES
    { palabra: "ELECTRONICA", categoria: "ESTILOS MUSICALES" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "SYNTHPOP", categoria: "ESTILOS MUSICALES" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "RAP", categoria: "ESTILOS MUSICALES" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ROCK", categoria: "ESTILOS MUSICALES" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "REGGAE", categoria: "ESTILOS MUSICALES" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "HOUSE", categoria: "ESTILOS MUSICALES" }, // Repetición: Objeto literal del banco de palabras

    // Categoría: Animales
    { palabra: "LEOPARDO", categoria: "Animales" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "TIBURON", categoria: "Animales" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "PANTERA", categoria: "Animales" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ELEFANTE", categoria: "Animales" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "DELFIN", categoria: "Animales" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "AGUILA", categoria: "Animales" }, // Repetición: Objeto literal del banco de palabras

    // Categoría: Futbol
    { palabra: "DELANTERO", categoria: "Futbol" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ARBITRO", categoria: "Futbol" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ESTADIO", categoria: "Futbol" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "CAMPEON", categoria: "Futbol" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "PENALTI", categoria: "Futbol" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "FUERADEJUEGO", categoria: "Futbol" }, // Repetición: Objeto literal del banco de palabras

    // Categoría: Colores
    { palabra: "AMARILLO", categoria: "Colores" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "FUCSIA", categoria: "Colores" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "TURQUESA", categoria: "Colores" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "PUPURA", categoria: "Colores" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "CELESTE", categoria: "Colores" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "ESMERALDA", categoria: "Colores" }, // Repetición: Objeto literal del banco de palabras

    // Categoría nueva 1: Comida (Cero programación)
    { palabra: "HAMBURGUESA", categoria: "Comida" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "PIZZA", categoria: "Comida" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "LASAÑA", categoria: "Comida" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "CHOCOLATE", categoria: "Comida" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "EMPANADA", categoria: "Comida" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "PASTEL", categoria: "Comida" }, // Repetición: Objeto literal del banco de palabras

    // Categoría nueva 2: Películas (Cero programación)
    { palabra: "AVATAR", categoria: "Películas" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "TITANIC", categoria: "Películas" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "INCEPTION", categoria: "Películas" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "GLADIADOR", categoria: "Películas" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "INTERSTELLAR", categoria: "Películas" }, // Repetición: Objeto literal del banco de palabras
    { palabra: "MATRIX", categoria: "Películas" } // Repetición: Objeto literal del banco de palabras
];

let palabraSecreta = ""; // Declara una variable mutable (let) global para almacenar la palabra en juego, inicia vacía
let categoriaActual = ""; // Repetición: Variable mutable para guardar el texto de la pista actual
let letrasAdivinadas = []; // Declara una variable mutable inicializada como matriz/arreglo vacío (para empujar letras acertadas)
let letrasIncorrectas = []; // Repetición: Variable de arreglo vacío (para fallos)
let errores = 0; // Declara una variable mutable de tipo número (contador de fallos)
const MAX_ERRORES = 6; // Declara una constante numérica (tope máximo de vidas), escrita en mayúsculas por convención

let ganadas = 0; // Repetición: Variable mutable numérica (estadística)
let perdidas = 0; // Repetición: Variable mutable numérica (estadística)
let racha = 0; // Repetición: Variable mutable numérica (estadística)

// Elementos de la interfaz
const palabraDisplay = document.getElementById('palabraDisplay'); // Busca en el HTML el elemento con id="palabraDisplay" y guarda su referencia en una constante
const listaIncorrectas = document.getElementById('listaIncorrectas'); // Repetición: Guarda referencia del DOM por ID
const teclado = document.getElementById('teclado'); // Repetición: Guarda referencia del DOM por ID
const btnReiniciar = document.getElementById('btnReiniciar'); // Repetición: Guarda referencia del DOM por ID
const categoriaTexto = document.getElementById('categoria-texto'); // Repetición: Guarda referencia del DOM por ID
const canvasBox = document.getElementById('canvasBox'); // Repetición: Guarda referencia del DOM por ID

// Elementos del Modal
const modal = document.getElementById('modalResultado'); // Repetición: Guarda referencia del DOM por ID
const modalIcon = document.getElementById('modalIcon'); // Repetición: Guarda referencia del DOM por ID
const modalTitulo = document.getElementById('modalTitulo'); // Repetición: Guarda referencia del DOM por ID
const modalMensaje = document.getElementById('modalMensaje'); // Repetición: Guarda referencia del DOM por ID
const btnModalSiguiente = document.getElementById('btnModalSiguiente'); // Repetición: Guarda referencia del DOM por ID

const canvas = document.getElementById('lienzo'); // Repetición: Guarda referencia del DOM por ID (el área de dibujo)
const ctx = canvas ? canvas.getContext('2d') : null; // Operador ternario: Si 'canvas' existe (?), extrae sus herramientas de dibujo '2d'; si no (:), asigna nulo

function inicializarTeclado() { // Declara una función, un bloque de código reutilizable
    if (!teclado) return; // Validación de seguridad: Si no se encontró el contenedor del teclado, aborta la función (return) para evitar errores
    const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(""); // Crea un string con el alfabeto y lo corta (.split("")) en un arreglo de letras individuales
    teclado.innerHTML = ""; // Limpia cualquier contenido HTML previo que tuviera el contenedor del teclado
    
    letras.forEach(letra => { // Bucle (iterador): Para cada 'letra' dentro del arreglo, ejecuta la siguiente función flecha (=>)
        const btn = document.createElement('button'); // Crea dinámicamente un elemento HTML <button> en la memoria
        btn.textContent = letra; // Le asigna al botón la letra actual como texto visible
        btn.classList.add('tecla'); // Le añade la clase CSS 'tecla' para que tome los estilos visuales
        btn.id = `t-${letra}`; // Le asigna un ID único dinámico (ej. t-A, t-B) usando template literals (backticks ` `)
        btn.addEventListener('click', () => verificarLetra(letra)); // Adjunta un "escuchador de eventos". Al hacer 'click', ejecuta la función verificarLetra pasando la letra correspondiente
        teclado.appendChild(btn); // Inyecta físicamente el botón creado en memoria dentro del contenedor 'teclado' del HTML
    });
}

function comenzarNuevaPartida() { // Repetición: Declaración de función (lógica para resetear el juego)
    if (BANCO_PALABRAS.length === 0) return; // Repetición: Validación de seguridad. Si el banco está vacío (longitud 0), aborta

    const item = BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)]; // Selecciona un objeto aleatorio. Math.random() genera decimal de 0 a 0.99, lo multiplica por el total de palabras y Math.floor() redondea hacia abajo al entero más cercano (índice válido)
    palabraSecreta = item.palabra; // Extrae y guarda el valor 'palabra' del objeto seleccionado
    categoriaActual = item.categoria; // Extrae y guarda el valor 'categoria' del objeto seleccionado

    letrasAdivinadas = []; // Reinicia (vacía) el arreglo de aciertos
    letrasIncorrectas = []; // Repetición: Reinicia el arreglo de fallos
    errores = 0; // Reinicia a 0 el contador de fallos numéricos

    if (categoriaTexto) categoriaTexto.textContent = categoriaActual; // Si existe el elemento HTML para la categoría, inyecta el texto actual
    if (listaIncorrectas) listaIncorrectas.textContent = "Ninguna"; // Si existe el elemento, resetea visualmente la lista de letras malas
    if (canvasBox) canvasBox.className = "canvas-wrapper"; // Restablece limpiamente todas las clases del div del dibujo (borra colores de victoria/derrota)

    document.querySelectorAll('.tecla').forEach(b => { // Busca TODOS los elementos con clase '.tecla' y los itera con forEach
        b.disabled = false; // Vuelve a habilitar el botón para que pueda recibir clics
        b.className = 'tecla'; // Borra clases extrañas (como hit o miss) reseteándolo a solo 'tecla'
    });

    prepararLienzoEstructura(); // Llama a la función que dibuja el poste
    renderizarEspaciosPalabra(); // Llama a la función que dibuja los guiones
}

function renderizarEspaciosPalabra() { // Repetición: Declaración de función
    if (!palabraDisplay) return; // Repetición: Validación de seguridad
    palabraDisplay.innerHTML = ""; // Repetición: Limpia el contenido HTML previo
    
    palabraSecreta.split("").forEach(letra => { // Corta la palabra secreta en letras individuales y las itera
        const slot = document.createElement('div'); // Repetición: Crea elemento div en memoria
        slot.classList.add('letra-slot'); // Repetición: Añade clase CSS base al guión
        if (letrasAdivinadas.includes(letra)) { // Condicional if: Si el arreglo de letras descubiertas CONTIENE esta letra específica
            slot.textContent = letra; // Repetición: Inserta la letra en el HTML
            slot.classList.add('revelada'); // Repetición: Añade clase CSS para el efecto neón/rebote
        } else { // Si la condición anterior es falsa (la letra no se ha adivinado aún)
            slot.textContent = ""; // La deja vacía para que solo se vea el borde inferior (el guión oculto)
        }
        palabraDisplay.appendChild(slot); // Repetición: Inyecta el div-guión al HTML
    });
}

function verificarLetra(letra) { // Función principal de lógica (recibe la letra que el usuario pulsó)
    const boton = document.getElementById(`t-${letra}`); // Repetición: Busca el botón específico de esa letra en el DOM
    if (!boton || boton.disabled) return; // Validación extra: Si el botón no existe o ya fue presionado (deshabilitado), aborta

    boton.disabled = true; // Deshabilita el botón (evita trampas o doble clic accidental)

    if (palabraSecreta.includes(letra)) { // Evalúa si la palabra secreta completa incluye la letra clickeada
        boton.classList.add('hit'); // Si acertó, añade clase CSS verde
        letrasAdivinadas.push(letra); // Mete (empuja) la letra acertada dentro del arreglo de letras adivinadas
        renderizarEspaciosPalabra(); // Redibuja los guiones, ahora revelando los que coincidan con esta letra
        analizarSiGano(); // Llama a la función para ver si ya se completó el juego
    } else {
        boton.classList.add('miss'); // Si falló, añade clase CSS roja
        letrasIncorrectas.push(letra); // Mete la letra fallada en el arreglo respectivo
        if (listaIncorrectas) listaIncorrectas.textContent = letrasIncorrectas.join(", "); // Muestra las letras erróneas en HTML, unidas por comas
        errores++; // Incrementa en 1 la variable contador de errores
        
        if (canvasBox) { // Validación de existencia
            canvasBox.classList.add('shake-error'); // Añade la clase que dispara la animación CSS de temblor
            setTimeout(() => canvasBox.classList.remove('shake-error'), 400); // Crea un temporizador que remueve la clase de temblor después de 400 milisegundos, para que se pueda volver a agitar en el futuro
        }
        
        dibujarMonigotePro(errores); // Llama a la función de dibujo, pasándole el número de fallo actual
        analizarSiPerdio(); // Llama a la función que evalúa si perdimos
    }
}

function analizarSiGano() { // Repetición: Declaración de función
    const exito = palabraSecreta.split("").every(l => letrasAdivinadas.includes(l)); // Método .every(): Evalúa TODAS las letras de la palabra secreta. Si CADA UNA (l) está dentro del arreglo de acertadas, devuelve verdadero (true)
    if (exito) { // Si 'exito' es verdadero...
        ganadas++; racha++; // Incrementa en 1 la variable ganadas y racha simultáneamente
        actualizarTablerosUI(); // Llama a la función que refresca los números de stats
        if (canvasBox) canvasBox.classList.add('glow-victory'); // Repetición: Añade clase CSS brillante si ganó
        dispararModalResultado(true); // Invoca la ventana final, pasándole 'true' para avisarle que es una victoria
    }
}

function analizarSiPerdio() { // Repetición: Declaración de función
    if (errores >= MAX_ERRORES) { // Evalúa si la cantidad de errores es mayor o igual al tope (6)
        perdidas++; racha = 0; // Incrementa perdidas en 1 y formatea la racha devuelta a 0
        actualizarTablerosUI(); // Repetición: Refresca el panel numérico
        dispararModalResultado(false); // Invoca la ventana final, pasándole 'false' (derrota)
    }
}

function actualizarTablerosUI() { // Repetición: Declaración de función
    const g = document.getElementById('ganadas'); // Repetición: Búsqueda DOM
    const p = document.getElementById('perdidas'); // Repetición: Búsqueda DOM
    const r = document.getElementById('racha'); // Repetición: Búsqueda DOM
    if (g) g.textContent = ganadas; // Repetición: Si existe, inserta la variable numérica
    if (p) p.textContent = perdidas; // Repetición: Inserta variable
    if (r) r.textContent = racha; // Repetición: Inserta variable
}

function dispararModalResultado(esVictoria) { // Repetición: Función que recibe un parámetro booleano (verdadero/falso)
    if (!modal || !modalTitulo || !modalMensaje || !modalIcon) return; // Validación estricta: Si falta aunque sea un elemento del modal, aborta

    if (esVictoria) { // Evalúa si recibimos 'true' (victoria)
        modalIcon.textContent = "🏆"; // Cambia el emoji a trofeo
        modalTitulo.textContent = "¡CÓDIGO ADIVINADO!"; // Cambia el título de la ventana flotante
        modalTitulo.style.color = "var(--neon-success)"; // Cambia directamente el estilo de color del título desde JS usando la variable CSS verde
        modalMensaje.innerHTML = `Excelente trabajo. La palabra era: <span style="color:var(--neon-blue)">${palabraSecreta}</span>`; // Uso de .innerHTML para inyectar etiquetas HTML y pintar la palabra secreta dentro de la cadena (template literals)
    } else { // Si 'esVictoria' es 'false' (derrota)
        modalIcon.textContent = "💀"; // Repetición: Cambia emoji
        modalTitulo.textContent = "SISTEMA CAÍDO"; // Repetición: Cambia texto
        modalTitulo.style.color = "var(--neon-magenta)"; // Repetición: Aplica estilo directo rojo
        modalMensaje.innerHTML = `Te has quedado sin intentos. La palabra correcta era: <span style="color:white">${palabraSecreta}</span>`; // Repetición: Inyecta HTML interno
    }
    setTimeout(() => modal.classList.add('show'), 350); // Genera un pequeñísimo retraso (350ms) antes de mostrar la ventana flotante agregándole la clase 'show'
}

// --- GENERADOR DE GRÁFICOS HD NEON ---
function prepararLienzoEstructura() { // Repetición: Declaración de función (API de Canvas)
    if (!ctx) return; // Repetición: Validación de seguridad por si el contexto 2D falló al cargar
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Borra completamente toda el área del lienzo desde las coordenadas 0,0 hasta su límite ancho/alto
    ctx.lineWidth = 5; // Define el grosor del "pincel" a 5 píxeles
    ctx.strokeStyle = "#475569"; // Define el color del "pincel" (un gris azulado)
    ctx.lineCap = "round"; // Hace que los extremos de las líneas terminen redondeados en lugar de cuadrados
    ctx.lineJoin = "round"; // Hace que las uniones o codos entre líneas también sean redondeados

    ctx.beginPath(); // Indica a la API de canvas que vas a empezar un nuevo trazado independiente
    ctx.moveTo(25, 235); ctx.lineTo(105, 235); // Mueve el lápiz a X:25, Y:235 sin pintar, luego dibuja línea hasta X:105, Y:235 (Base del poste)
    ctx.moveTo(65, 235); ctx.lineTo(65, 25);   // Repetición: Mueve y dibuja (Palo vertical)
    ctx.moveTo(65, 25);  ctx.lineTo(165, 25);  // Repetición: Mueve y dibuja (Palo superior horizontal)
    ctx.moveTo(165, 25); ctx.lineTo(165, 60);  // Repetición: Mueve y dibuja (La pequeña cuerda colgante)
    ctx.stroke(); // Ejecuta realmente el dibujo: renderiza físicamente en la pantalla todos los trazos delineados arriba
}

function dibujarMonigotePro(fase) { // Función que recibe en qué número de error vamos ('fase')
    if (!ctx) return; // Repetición: Validación
    ctx.lineWidth = 5; // Repetición: Grosor de línea
    ctx.strokeStyle = "#ff0055"; // Repetición: Cambia el pincel a rojo magenta
    ctx.shadowBlur = 10; // Le añade un efecto de difuminado o sombra/brillo al trazo de 10 píxeles
    ctx.shadowColor = "#ff0055"; // Define que ese brillo del trazo sea también rojo magenta (crea el neon)

    ctx.beginPath(); // Repetición: Inicia un nuevo trazado
    switch (fase) { // Evalúa de forma estructurada qué valor tiene la variable 'fase' (del 1 al 6)
        case 1: // Si la fase (error) es exactamente 1...
            ctx.arc(165, 85, 22, 0, Math.PI * 2); // Dibuja un arco circular perfecto. Centro X:165, Centro Y:85, Radio 22, Ángulo inicial 0, Ángulo final PI*2 (Círculo completo = Cabeza)
            ctx.stroke(); // Repetición: Ejecuta el trazado de la cabeza
            break; // Rompe la evaluación del 'switch' para que no ejecute los siguientes casos
        case 2: // Cuerpo
            ctx.moveTo(165, 107); ctx.lineTo(165, 170); // Repetición: Mueve y traza línea recta vertical
            ctx.stroke(); // Repetición: Ejecuta el trazado del cuerpo
            break; // Repetición: Rompe ejecución
        case 3: // Brazo Izquierdo
            ctx.moveTo(165, 120); ctx.lineTo(135, 145); // Repetición: Mueve y traza línea diagonal
            ctx.stroke(); // Repetición
            break; // Repetición
        case 4: // Brazo Derecho
            ctx.moveTo(165, 120); ctx.lineTo(195, 145); // Repetición: Mueve y traza línea diagonal
            ctx.stroke(); // Repetición
            break; // Repetición
        case 5: // Pierna Izquierda
            ctx.moveTo(165, 170); ctx.lineTo(135, 215); // Repetición: Mueve y traza línea diagonal inferior
            ctx.stroke(); // Repetición
            break; // Repetición
        case 6: // Pierna Derecha
            ctx.moveTo(165, 170); ctx.lineTo(195, 215); // Repetición: Mueve y traza línea diagonal inferior
            ctx.stroke(); // Repetición
            break; // Repetición
    }
    ctx.shadowBlur = 0; // Tras dibujar, resetea el brillo a 0 para no afectar dibujos futuros accidentalmente
}

// Inicialización automatizada al cargar
document.addEventListener("DOMContentLoaded", () => { // Añade un escuchador al documento global (toda la web) que espera a que el evento DOMContentLoaded ocurra (es decir, cuando todo el HTML base se ha leído por completo)
    inicializarTeclado(); // Invoca la función que dibuja las teclas por primera vez
    comenzarNuevaPartida(); // Invoca la función que arranca el juego eligiendo palabra y reseteando variables

    if (btnReiniciar) btnReiniciar.addEventListener('click', comenzarNuevaPartida); // Validación de seguridad corta: Si existe el botón reiniciar inferior, al darle click, arranca nueva partida
    if (btnModalSiguiente) { // Si existe el botón oculto en la ventana modal
        btnModalSiguiente.addEventListener('click', () => { // Al darle click...
            modal.classList.remove('show'); // Remueve la clase 'show', lo que activa la transición CSS haciéndolo invisible nuevamente
            comenzarNuevaPartida(); // Repetición: Arranca nueva partida por debajo de forma invisible
        });
    }
});