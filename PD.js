"use strict"; // Invoca un modo más riguroso en JS. No permite usar variables no declaradas o malas prácticas ocultas, ayudando a detectar errores silenciosos.

const SENTENCES = { // Declara una constante global estructurada como objeto diccionario. Sus llaves categorizan niveles de dificultad.
  easy: [ // Array de arreglos, cada índice contiene un objeto (una oración) para el nivel fácil.
    { words: ["C", "A", "S", "A"],       hint: "Lugar donde vives." }, // Objeto literal: 'words' contiene el arreglo de letras fragmentadas (aunque el juego es "Palabras", aquí el autor fragmentó letras como "palabras"). 'hint' guarda el string descriptivo.
    { words: ["P", "E", "R", "R", "O"],         hint: "El mejor amigo del hombre." },
    { words: ["A", "G", "U", "A"],    hint: "Para la sed." },
    { words: ["L", "U", "N", "A"],        hint: "Nuestro satelite natural." },
    { words: ["P", "U", "L", "P", "O"],        hint: "Animal marino de ocho brazos" },
  ],
  medium: [ // Array de palabras medianas.
    { words: ["C", "H", "O", "C", "O", "L", "A", "T", "E"], hint: "Dulce hecho con cacao." },
    { words: ["A", "R", "C", "O", "I", "R", "I", "S"],       hint: "Colorido paisaje del cielo" },
    { words: ["J", "A", "R", "D", "I", "N"], hint: "Lugar lleno de flores" },
    { words: ["C", "I", "N", "E"], hint: "Sala para ver peliculas." },
    { words: ["B", "A", "L", "O", "N"], hint: "Juguete redondo que se patea" },
  ],
  hard: [ // Array de palabras largas o compuestas.
    { words: ["E", "S", "T", "R", "E", "L", "L", "A", "S"], hint: "Cuerpos celestes que brillan en el cielo" },
    { words: ["B", "I", "B", "L", "I", "O", "T", "E", "C", "A"], hint: "Coleccion grande de libros" },
    { words: ["C", "O", "M", "P", "U", "T", "A", "D", "O", "R"], hint: "Maquina con teclado" },
    { words: ["R", "E", "S", "P", "I", "R", "A", "C", "I", "O", "N"], hint: "Proceso donde tomamos oxigeno para vivir" },
    { words: ["V", "A", "C", "A", "C", "I", "O", "N", "E", "S"], hint: "Descanso extendido del trabajo" },
  ],
};

let state = { // Declara una variable objeto maleable ('let') llamada 'state' que funciona como un gestor de estados (Cerebro del juego). Contiene todos los números que van a cambiar en el tiempo.
  score: 0, // Puntaje actual del jugador
  lives: 3, // Intentos restantes
  level: 1, // En qué nivel global estamos (para la UI del encabezado)
  round: 0, // En qué ronda o palabra específica de un nivel estamos
  hintsLeft: 3, // Pistas sobrantes para la partida
  timerSecs: 0, // Cronómetro, segundos restantes actuales
  timerInterval: null, // Guarda el ID del reloj JavaScript para poder pararlo cuando queramos (setInterval reference)
  currentWords: [], // Arreglo (array) temporal que contiene las letras barajadas desordenadas.
  correctSentence: [], // Arreglo que contiene el orden original y puro de las letras.
  builtSentence: [], // Arreglo de las letras que el usuario ha colocado hasta el momento en la zona de juego.
  placed: [], // Arreglo de índices numéricos de las letras que el usuario ya agarró (evita clonar piezas falsamente).
  difficulty: "easy", // Clave tipo string que asocia al diccionario SENTENCES. Empieza en fácil.
};

const $ = (id) => document.getElementById(id); // Arrow function (función flecha) utilitaria. Funciona como atajo: En lugar de escribir document.getElementById() a cada rato, ahora solo escribes $('id'). Retorna directamente el elemento.
const wordBank  = $("wordBank"); // Busca y guarda la referencia constante del div principal del banco de palabras usando la función acortada.
const buildZone = $("buildZone"); // Referencia a la zona donde se sueltan las palabras.
const buildPlaceholder = $("buildPlaceholder"); // Referencia al texto en cursiva "Coloca tus palabras aquí..."

window.addEventListener("DOMContentLoaded", restartGame); // Escucha al navegador global (window). Cuando todo el HTML crudo termina de pintarse y procesarse ('DOMContentLoaded'), ejecuta automáticamente la función restartGame() para arrancar.

function restartGame() { // Función que reinicia las estadísticas de juego duro (Game Over / Inicio total).
  state.score = 0; // Sobrescribe variables numéricas del state a sus valores de fábrica.
  state.lives = 3; 
  state.level = 1;
  state.round = 0; 
  state.hintsLeft = 3; 
  state.difficulty = "easy"; // Retorna a dificultad inicial.
  updateHUD(); // Invoca la función que actualiza visualmente los marcadores del HTML (Vidas, Puntos, etc).
  hideModal("gameOverOverlay"); // Si había una ventana de muerte tapando la pantalla, la esconde.
  hideModal("modalOverlay"); // Si había una ventana de victoria flotando, la esconde.
  loadRound(); // Dispara la función creadora de la nueva ronda en base al nivel reiniciado.
}

function loadRound() { // Función encargada de estructurar el tablero de juego para una nueva palabra específica.
  const pool = SENTENCES[state.difficulty]; // Accede dinámicamente a una subsección del diccionario basado en la dificultad string (ej: SENTENCES["easy"]). Genera un arreglo temporal.
  const data = pool[state.round % pool.length]; // Operación mágica: Busca la palabra que toca en base a la ronda actual. El módulo (%), dividido por la longitud total, hace un efecto carrusel (si round es mayor que 5, vuelve cíclicamente a empezar en la palabra del index 0).

  state.correctSentence = [...data.words]; // Crea un clon idéntico del arreglo nativo esparciéndolo dentro de un nuevo arreglo [... ] ('Spread operator'). Evita sobre-escribir los datos originales de la fuente constante.
  state.currentWords    = shuffle([...data.words]); // Crea un segundo clon esparcido, PERO este lo inyecta como parámetro a una función (shuffle) para que las baraje.
  state.builtSentence   = []; // Vacía la respuesta escrita por el jugador en la ronda anterior.
  state.placed          = []; // Libera el registro numérico de posiciones usadas.

  $("hintText").textContent = "💡 " + data.hint; // Reemplaza dinámicamente el texto estático de la pista visual por la pista correcta del objeto data. (Propiedad 'hint')

  buildZone.innerHTML = ""; // Truco duro: Elimina absolutamente todo el contenido HTML (tags incluidas) en la zona de arrastre. Limpia la mesa.
  buildZone.appendChild(buildPlaceholder); // Vuelve a inyectar el texto fantasma nativo, ya que el paso anterior lo destruyó (appendChild inserta el elemento como el último hijo).
  buildPlaceholder.style.display = "inline"; // Modifica la propiedad CSS del elemento (display) para garantizar que se vea.
  buildZone.classList.remove("correct", "wrong", "drag-over"); // Purga las clases CSS antiguas que pudieron quedar de la ronda pasada (bordes rojos/verdes que la gente deja trabados al responder rápido).
  wordBank.innerHTML = ""; // Limpia radicalmente el cajón que tenía las fichitas de letras viejas.

  state.currentWords.forEach((word, i) => renderChip(word, i)); // Bucle de JavaScript. Analiza cada elemento del arreglo ya desordenado. Ejecuta una función para cada letra pasándole la letra y su posición numérica en el arreglo.
  $("hintCount").textContent = state.hintsLeft; // Escribe el contador número de pistas restantes actualizando el paréntesis visual de (3).
  updateHUD(); // Vuelve a pintar estadísticas.

  const secs = state.difficulty === "easy" ? 45 : state.difficulty === "medium" ? 35 : 25; // Operador ternario anidado (si pasa esto '?' devuelve 45, y si no ':', evalúa esto otro '?' devuelve 35, y si no ':' devuelve 25). Fija el reloj inicial.
  startTimer(secs); // Enciende el cronómetro mandando la variable calculada arriba.
}

function renderChip(word, index) { // Función encargada de crear una etiqueta <button/span> 100% de la nada en código puro. Recibe texto e índice numérico.
  const chip = document.createElement("span"); // Método del DOM. Genera un elemento tipo <span> hueco y lo guarda en memoria virtual.
  chip.textContent = word; // Altera su texto interior visible, metiendo la letra (word).
  chip.className   = "word-chip"; // Le estampa la clase maestra de CSS, volviéndolo una tarjeta amarilla visual.
  chip.dataset.idx = index; // HTML5 data-attributes. Crea un dato incrustado invisible tipo "data-idx=5" para que la ficha siempre sepa cuál es su índice de nacimiento original y rastrearla.
  chip.draggable   = true; // Propiedad API Nativas de HTML. Habilita que el navegador entienda que el usuario puede dar clic mantenido y "arrastrar" el bloque sin seleccionar texto (Drag and Drop clásico).
  chip.addEventListener("click", () => placeWord(index)); // Event Listener. Si le das clic simple corto, emite la orden placeWord apuntando su propio index original.
  
  chip.addEventListener("dragstart", (e) => { // Segundo Evento: Se activa en el microsegundo exacto donde inicia el "arrastre". Pasa el evento de movimiento (e) entero al sistema.
    e.dataTransfer.setData("text/plain", index); // Inyecta el índice numérico en el portapapeles fantasma de movimiento de arrastre (dataTransfer) con formato "texto plano".
    chip.classList.add("dragging"); // Pone la clase CSS semi-transparente de agarre.
  });
  
  chip.addEventListener("dragend", () => chip.classList.remove("dragging")); // Evento tercerizo: se activa justo cuando sueltas el click izquierdo (terminando arrastre). Borra inmediatamente la clase semitransparente que se puso al empezar.
  
  wordBank.appendChild(chip); // Inyecta la ficha finalizada e interactiva desde la memoria RAM directo al HTML del navegador. ¡Ahora es visible!
}

function placeWord(index) { // Función para mover una ficha o simularlo. Toma la posición original.
  if (state.placed.includes(index)) return; // Prevención de clonación: Pregunta al arreglo 'placed' si el número YA está listado (.includes). Si la respuesta es sí, aborta todo con un 'return' temprano. No puede robar la ficha 2 veces.
  state.placed.push(index); // Empuja (mete a la fuerza al final) ese índice al arreglo, bloqueándolo para el futuro.
  state.builtSentence.push(state.currentWords[index]); // Encuentra qué letra era según el índice arrastrado, y la guarda en la oración virtual que el usuario está creando tras de cámaras.

  const bankChip = wordBank.querySelector(`[data-idx="${index}"]`); // Función de búsqueda avanzada: Rastrea en toda la sección wordBank buscando específicamente el span que tiene el atributo data-idx exacto que estamos moviendo. 
  if (bankChip) bankChip.classList.add("placed"); // Si existía en HTML, le añade la clase que la hace miniatura y completamente invisible (pareciera que desapareció del banco).

  buildPlaceholder.style.display = "none"; // Borra definitivamente el texto "Coloca palabras aquí..." ahora que pusimos la primera ficha.

  const builtChip = document.createElement("span"); // Crea un elemento NUEVO en memoria RAM (una ficha virtual de respuesta).
  builtChip.className = "built-chip"; // Le pone la clase CSS sólida con la x chiquita y sombra profunda.
  builtChip.dataset.bankIdx = index; // Graba como un disco el índice base para saber a qué letra invisible del panel inicial corresponde esta ficha nueva (conexión de ida y vuelta).
  builtChip.innerHTML = `${state.currentWords[index]} <span class="remove-x">✕</span>`; // Inyecta la letra correspondiente y el HTML literal usando backticks (` `) interpolando un mini-botón (✕) para cancelarla.
  builtChip.addEventListener("click", () => removeWord(builtChip, index)); // Añade interactividad: Si le das clic de nuevo, llama a remover, pasándole el cuerpo de la ficha en sí y su índice.
  buildZone.appendChild(builtChip); // Inyecta la ficha de respuesta amarilla al HTML de la zona final.
}

function removeWord(builtChip, index) { // Función que deshace un movimiento.
  const bankChip = wordBank.querySelector(`[data-idx="${index}"]`); // Busca al fantasma invisible original en el panel de inicio.
  if (bankChip) bankChip.classList.remove("placed"); // Si lo halló, le retira la clase "placed". ¡La ficha original mágicamente se hace visible otra vez en el inicio!

  const pos = state.placed.indexOf(index); // Método .indexOf: Busca qué lugar exacto (qué casilla 0, 1, 2...) ocupa nuestro número original dentro del arreglo de bloques 'placed'
  if (pos > -1) {  // Si indexOf encontró algo, siempre devuelve un número 0 o mayor (-1 significa "no se halló el elemento en el arreglo").
      state.placed.splice(pos, 1); // Corta/Arranca de raíz (splice) el número intruso a partir de su posición local (pos), y elimina solo ese (1 bloque a arrancar).
      state.builtSentence.splice(pos, 1); // Hacemos exactamente el mismo borrado pero en el arreglo de las letras conformadas, de lo contrario la respuesta del JS guardaría memoria infinita e incorrecta.
  }
  builtChip.remove(); // Un método del DOM directo a la yugular: aniquila físicamente la etiqueta HTML de la ficha construida sin pasar por innerHTML="".
  if (state.builtSentence.length === 0) buildPlaceholder.style.display = "inline"; // Validar. Si el arreglo de la oración virtual quedó literalmente nulo o en 0 elementos de largo tras el borrado, volvemos a resucitar el texto fantasma inicial del panel.
}

function clearBuild() { // Función de utilidad "Limpiar Todo" anclada al botón secundario lateral.
  [...buildZone.querySelectorAll(".built-chip")].forEach(c => c.remove()); // Esparce (spread syntax ...) TODOS los resultados encontrados por "querySelectorAll" dentro de un verdadero arreglo de JS. Automáticamente los itera uno a uno, ejecutando el método destructivo 'remove()' a todas las etiquetas de respuesta.
  [...wordBank.querySelectorAll(".word-chip")].forEach(c => c.classList.remove("placed")); // Recupera visualmente al escuadrón inicial. Busca todos los spans en el banco original (incluso los invisibles) y les fuerza a borrar el atributo de clase 'placed'.
  state.builtSentence = []; // Reinicia (vacía) variable lógica vital desde cero para respuestas
  state.placed = []; // Vacía la lista de restricciones de índice 
  buildPlaceholder.style.display = "inline"; // Revive texto guía 
  buildZone.classList.remove("correct", "wrong"); // Limpia posibles halos de victoria (verde) o pérdida (roja) que pudieran estar trabando el contorno del recuadro.
}

// ----- Eventos de API para DRAG AND DROP NATIVO ----- 
buildZone.addEventListener("dragover",  (e) => { e.preventDefault(); buildZone.classList.add("drag-over"); }); // 'dragover' se dispara sin parar (60 veces x seg) MIENTRAS pases un arrastre sobre su cielo. Se añade preventDefault() OBLIGATORIO porque por norma general los navegadores web cancelan las soltadas de elementos. Activa el color 'drag-over' amarillo del fondo.
buildZone.addEventListener("dragleave", () => buildZone.classList.remove("drag-over")); // 'dragleave' se activa justo en el instante en que tu puntero sale del espacio de aire del bloque. Sirve para limpiar el halo amarillo de aviso (así no queda trabado).
buildZone.addEventListener("drop", (e) => { // Evento 'drop', salta el instante en que liberas el botón del ratón dentro del perímetro. 
  e.preventDefault(); // Detiene el comportamiento habitual (a veces Chrome abre archivos/fotos si los arrastras a la mala, este método para eso).
  buildZone.classList.remove("drag-over"); // Apaga la luz de alerta, ya cayó el paquete.
  const idx = parseInt(e.dataTransfer.getData("text/plain")); // Recupera el número del "portapapeles" fantasma ('dataTransfer.getData()') que metimos al 'dragstart', y usa parseInt para asegurar que el JS lo trate matemáticamente como Número Entero puro, no una frase.
  if (!isNaN(idx)) placeWord(idx); // isNaN (Is Not a Number). Si la variable idx verdaderamente logró convertirse en un número legítimo (su negación ! evalúa si SI es un número), dispara placeWord() forzando la lógica de arrastre para esa pieza.
});

function checkAnswer() { // Lógica estricta de evaluación al presionar 'Verificar'.
  if (state.builtSentence.length === 0) { shakeBuild(); return; } // Chequeo idiota. Si tu respuesta de largo tiene 0 elementos (está vacía), agita el recuadro quejándose y aborta el proceso 'return', sin matar el timer ni gastar vidas.

  const isCorrect = state.builtSentence.join(" ") === state.correctSentence.join(" "); // La magia dorada. El método .join() pega todos los elementos del arreglo en un texto gigante en string plano. Lo que hace es: Convertir (Respuesta Usuario) -> Evaluar Equivalencia Exacta Sensible a Mayúsculas/Espacios (===) -> Frente a Convertir (Respuesta Original Intacta). La constante guarda un True o un False.
  stopTimer(); // Pausa y quema la hora porque hay veredicto; ya no se agota tiempo extra.

  if (isCorrect) { // Evalúa de inmediato (Si es TRUE / verdad que era igual).
    const bonus = Math.ceil(state.timerSecs * 2); // Matemáticas. Math.ceil redondea forzosamente un decimal siempre hacia arriba. Genera un multiplicador (Tiempo Restante x 2) para bonificar al veloz.
    const base  = state.difficulty === "easy" ? 100 : state.difficulty === "medium" ? 200 : 350; // Otorga puntaje base variando según la dificultad extraída en estado de juego.
    state.score += base + bonus; // El operador compuesto += suma a su propio valor antiguo de (state.score) el resultado nuevo de (base + bonus).
    state.round++; // Sube una vuelta cíclica o nivel interno. 
    buildZone.classList.add("correct"); // Dispara la estela de luz verde que programamos en CSS sobre la zona final.
    setTimeout(() => showResultModal(true, state.correctSentence.join(" ")), 300); // setTimeout crea un desfasaje/retraso de 300ms antes de llamar la función creadora de ventanas emergentes para que el ojo humano pueda disfrutar el brillo verde .1s antes de que la pantalla se vuelva modal negra. Se manda una validación (true) para decir 'Gané', y la oración de triunfo total unida por el array correcto.
  } else { // Ruta alterna. Si el '.join === .join' dio False (Te equivocaste en el orden).
    state.lives--; // Resta duramente y sin piedad 1 entero del contador general de vidas. 
    buildZone.classList.add("wrong"); // Empapa de rojo sangriento el bloque (CSS).
    shakeBuild(); // Función invocada en corto, que literalmente le mete el keyframe shake de CSS haciéndolo vibrar de furia.
    setTimeout(() => { // Retraso intermedio pero compuesto
      buildZone.classList.remove("wrong"); // Lava la furia del CSS. Vuelve a color basal.
      state.lives <= 0 ? showGameOver() : showResultModal(false, state.correctSentence.join(" ")); // Ternario final. Pregunta si tus Vidas llegaron a Cero o sub-cero absoluto. Si da positivo '?': Game Over, Perdiste para siempre la pantalla oscura. Sino, es decir ':', solo fallaste el turno (Ventana de falla leve, pero muestra respuesta correcta para que aprendas).
    }, 400); // Esto ocurre tras el temblor de la falla (400 milisegundos = duración del shake de animación en css).
  }
  updateHUD(); // Vuelve a refrescar tu puntuación, nivel y, lamentablemente, tus corazones de vida (se vuelven negros visualmente).
}

function useHint() { // Sistema algorítmico super sencillo de Pistas programada (Hint System).
  if (state.hintsLeft <= 0) return; // Validación. No hay balas de plata en la cámara.
  const nextWord = state.correctSentence[state.builtSentence.length]; // Variable súper astuta que consulta al estado original (arreglo base sin tocar) qué elemento viene PRECISAMENTE en el índice en el que te has quedado frenado (Ej: Llevas [P - A - P], tu largo es de 3 elementos. Él mira state.correct[3], lo que equivale a la cuarta letra en el arreglo base que es la O. nextWord = "O" la palabra salvavidas).
  if (!nextWord) return; // Si la palabra no existe (llegaste al final antes de dar botón verificar, no gasta ayudas vacías).

  for (let i = 0; i < state.currentWords.length; i++) { // Abre un búcle cíclico tradicional 'for', va de cero hasta medir el arreglo final barajado y caótico.
    if (state.currentWords[i] === nextWord && !state.placed.includes(i)) { // Condición doble. El ciclo evalúa 1x1: "¿La palabra en la posición barajada index 'i' es IGUAL a la palabra salvavidas (nextWord) que necesito?" Y además '&&' "... ¿El índice 'i' AÚN NO (el signo '!') ha sido usado por el arreglo bloqueante 'state.placed'?"
      const chip = wordBank.querySelector(`[data-idx="${i}"]`); // Si es la ficha elegida de dios, la busca físicamente en el DOM del cajón basal.
      if (chip) { 
        chip.style.outline    = "2px solid #3cffa0"; // Le inyecta estilos INLINE de CSS directamente (Borde externo delineante que rodea el borderRadius verde).
        chip.style.background = "rgba(60,255,160,.18)"; // Pinta el fondo interno de tono verde tenue (Efecto Farol).
        setTimeout(() => { chip.style.outline = ""; chip.style.background = ""; }, 1400); // 1.4 segundos más tarde resetea las comillas vacías '' para borrar lo inyectado en Inline Styles; el farol se apaga para que la ficha recobre su amarillo normal.
      }
      state.hintsLeft--; // Consume un cartucho de la variable de estado.
      $("hintCount").textContent = state.hintsLeft; // Rebaja estéticamente a (2) (1) o (0) el span.
      break; // Fundamental: El for loop es agresivo y veloz; halló su letra gemela, así que ROMPE (break) en el acto el ciclo de iteración o sino colorearía repetidas a la vez por accidente perdiendo desempeño de RAM.
    }
  }
}

function nextRound() { // Encargada de catapultar al siguiente ciclo o de escalado (Level UP/Progression).
  hideModal("modalOverlay"); // Remueve capa flotante temporal.
  if (state.round >= 3 && state.difficulty === "easy")   { state.difficulty = "medium"; state.level = 2; state.round = 0; state.hintsLeft = 3; } // Si tu contador alcanzó la cuarta ronda superada (index 3) de modo fácil '&&' estás en facíl -> Ganas promoción: dificultad intermedia string 'medium', sumas 1 Nivel para UI 'level=2', reseteas la vuelta 'round=0', reabasteces cartuchos de ayuda '3'.
  else if (state.round >= 3 && state.difficulty === "medium") { state.difficulty = "hard"; state.level = 3; state.round = 0; state.hintsLeft = 2; } // Lo propio, pero para subir al nivel difícil final, que solo te reabastece míseras 2 pistas para aumentar el estrés al jugar.
  updateHUD(); // Vuelve a plasmar datos
  loadRound(); // Arranca en cero las mecánicas para la nueva palabra calculada.
}

function startTimer(secs) { // Motor del tiempo
  stopTimer(); // Obligatorio: quema y aniquila todo reloj previo del sistema por si acaso existía (previniendo memory leaks o relojes fantasmas solapados que aceleren todo x2).
  state.timerSecs = secs; // Aterriza la duración final (45, 35, 25).
  const timerBar = $("timerBar"); // Busca en DOM
  const timerLabel = $("timerLabel"); // Busca número
  const total = secs; // Guarda la duración inicial (techo final) como constante para la ecuación de la barra.
  
  timerBar.style.width = "100%"; // Reinicia ancho total de pista amarilla
  timerBar.classList.remove("warning"); // Apaga rojo furia
  timerLabel.textContent = secs + "s"; // Pinta string inicial numérico.
  timerLabel.style.color = "var(--accent)"; // Color amarillo basal número de tiempo.

  state.timerInterval = setInterval(() => { // API CRITICA JS nativa:setInterval. Genera una instrucción cíclica constante ligada a un ID (que grabamos en el estado general). Todo lo que esté adentro iterará cada milisegundo o segundo estipulado infinitamente (hasta pararse explícitamente).
    state.timerSecs--; // Cada iteración, se deprime la variable en 1 (-1) numérico, de 45 a 44, de 44 a 43, etc.
    timerBar.style.width = Math.max((state.timerSecs / total) * 100, 0) + "%"; // Modifica la propiedad width (ancho de css). Ecuación: Saca el porcentaje de (tiempo_actual_deprimido dividido total original) multi. por 100. Concatena '%'. Math.max asegura que el resultado JAMAS sea menos que cero, si cruza negativo, retorna 0 (protege que barra no dibuje anchos negativos bugeados).
    timerLabel.textContent = state.timerSecs + "s"; // Refresca span texto número de decremento
    if (state.timerSecs <= 10) { timerBar.classList.add("warning"); timerLabel.style.color = "var(--accent2)"; } // Alerta si baja a 10s exactos o menos (Inyecta clase roja).
    if (state.timerSecs <= 0) { stopTimer(); timeUp(); } // Ejecución de límite de tiempo. Si cruza el cero (Game Over de temporizador): Apaga y manda 'TimeUP()'.
  }, 1000); // Declara y bloquea el setInterval para un ritmo biológico universal de 1000 Milisegundos = 1 Segundo exacto Real, sin esto explotaría el ciclo for.
}

function stopTimer() { // Frenado de emergencia/fin del motor 
    clearInterval(state.timerInterval); // API JS complementaria (ClearInterval). Toma el ID de registro provisto en state, y asesina al bucle infinito generado por el SetInterval en el procesador, borrando de memoria RAM la variable.
    state.timerInterval = null; // Purifica la llave de la variable como 'nulificada' o 'nula' para dejar claro que ya no existe temporalidad que nos guíe en fondo.
}

function timeUp() { // Evento: se agota tiempo sin responder.
  state.lives--; // Resta vida inexorablemente por pasividad
  updateHUD(); // Pinta corazón marchito.
  if (state.lives <= 0) { showGameOver(); return; } // Chequea final alternativo por inanición.
  buildZone.classList.add("wrong"); // Parpadeo rojo.
  setTimeout(() => { 
    buildZone.classList.remove("wrong");
    showResultModal(false, state.correctSentence.join(" "), true); // Castigo y aprendizaje. Activa un modal de Resultado FALSO (fallaste). Muestra el join ("texto concatenado") y al final un booleano TRUE para advertir (timedOut= true) que avisa que no falló textualmente, sino de pánico/lento.
  }, 400); 
}

function showResultModal(correct, correctAnswer, timedOut = false) { // Gestor paramétrico de Modal que reacciona diferente ante: Booleano True/False (si ganaste o perdiste), Texto (Solución correcta para regaño), Booleano Adicional (timedOut) si perdiste por tiempo.
  $("modalIcon").textContent  = correct ? "🎉" : "😬"; // Si entró true de parámetro, estampa cara feliz, sino, mueca amarga
  $("modalTitle").textContent = correct ? "¡Correcto!" : (timedOut ? "¡Tiempo!" : "Incorrecto"); // Ternario anidado letal: "Si ganaste -> Di ¡Correcto!. Si fallaste (llegó falso)... Revisa si fallaste por tiempo (timedOut). Si fue por tiempo dí '¡Tiempo!'. Si fallaste por equivocado, dí 'Incorrecto'".
  $("modalBody").textContent  = correct ? "¡Muy bien! Sigue así." : (timedOut ? "Se acabó el tiempo." : "Esa no era la oración correcta."); // Lo propio de arriba, pero texto de bajada pequeño descriptivo del problema.
  $("modalAnswer").textContent = "Respuesta: " + correctAnswer; // Inyecta el gran premio, desvelando el array inalterado de correct_sentence extraído del state (convertido string).
  $("modalOverlay").classList.add("active"); // Enciende y sobrepone la clase (display:flex) oscurecedora masiva que tapa interfaz en el HTML.
}

function showGameOver() { // Falla cataclísmica o falta de corazones.
  stopTimer(); // Previene en caso rarísimo que mueras pero un fantasma del timer aún decremente tras matar todo.
  $("finalScore").textContent = state.score; // Saca a lucir en recuadro el puntaje máximo amasado (Base + Extras de tiempo de todo un run).
  $("gameOverMsg").textContent = "¡Se acabaron las vidas!"; // Expresa brutal condena de manera contundente y seca.
  $("gameOverOverlay").classList.add("active"); // Levanta de ultratumba el div exclusivo y diferenciado que programamos con la calavera estática en lugar de ventana de error (El que dice JUGAR DE NUEVO).
}

function hideModal(id) { $(id).classList.remove("active"); } // Limpiador dinámico: retira capa negra/oscura del modal paramétrico sin importar de quién o cuál sea siempre y cuando envíes string '#ID' (ej: '#modalOverlay' , '#gameOverOverlay').

function updateHUD() { // Repaint general (Interfaz del usuario 'Heads Up Display'). Modifica el DOM textualmente.
  $("scoreDisplay").textContent = state.score; // Inserta número actual.
  $("levelDisplay").textContent = state.level; // Idem nivel actual.
  $("livesDisplay").textContent = ["❤","❤","❤"].map((h,i) => i < state.lives ? "❤" : "🖤").join(" "); 
  // Magia superior de iteración de array: 1) Declara un arreglo falso de tres corazones textuales en bruto 2) Le inserta función Map (.map muta o transforma 1 a 1 ese arreglo pasando su índice i y su contenido nativo h) 3) Ternario de mapeo: Evalúa "¿El índice del corazón actual es menor a tu conteo de vidas state.lives? Si sí es menor, déjalo rojo, SI SUPERA el número (has restado a cero o a uno), conviértelo a Negro marchito 4) Por último une toda la línea mutada con método join(" ").
}

function shuffle(arr) { // Algoritmo clásico "Fisher-Yates" para Desordenar Elementos (Shuffle random array) con fiabilidad y nulo error matemático de superposición
  for (let i = arr.length - 1; i > 0; i--) { // Empieza iterando desde la ÚLTIMA casilla (-1 del total de tu largo real) hasta decrecer a cero en sentido contrario restando progresivamente
    const j = Math.floor(Math.random() * (i + 1)); // En cada paso de reversa, calcula de forma random (usando semilla del procesador Math.random) multiplicando la posición sobrante de arreglo real, limitándolo (Math.floor). Obtiene la posición (j) temporal de destino.
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Destructuración brutal (Destructuring assignment): Intercambia de golpe y en una sola línea de código el bloque real i de atrás hacia la posición azarosa de enfrente j, sustituyéndolo en cadena
  }
  return arr; // Escupe al exterior el array final de la licuadora ya 100% batido pero con valores y referencias correctas
}

function shakeBuild() { // Animación pequeña utilitaria de falla sin recarga (Agitador rojo)
  buildZone.classList.add("wrong"); // Clava la etiqueta error de CSS temporalmente de golpe sobre las letras de usuario incorrectas (activando su rojo y frame)
  setTimeout(() => buildZone.classList.remove("wrong"), 400); // 400ms después se lo retira velozmente con timer de un uso, para volver al loop base de interacción (Puro feedback del jugador fallido)
}