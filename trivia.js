// Banco de 10 preguntas de Música (Tema Cyberpunk/Synthwave)
const preguntas = [
    {
      p: "¿Cuál de los siguientes artistas es ampliamente conocido en la historia como el 'Rey del Pop'?",
      o: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"],
      c: 1
    },
    {
      p: "¿Qué famosa Boy Band británica-irlandesa causó un fenómeno mundial tras formarse en el programa The X Factor con éxitos como 'What Makes You Beautiful'?",
      o: ["Backstreet Boys", "One Direction", "Big Time Rush", "The Wanted"],
      c: 1
    },
    {
      p: "El famoso DJ y productor Avicii, creador de éxitos globales como 'Wake Me Up' y 'Levels', ¿de qué país era originario?",
      o: ["Suecia", "Países Bajos (Holanda)", "Noruega", "Estados Unidos"],
      c: 0
    },
    {
      p: "¿Qué canción de la boyband de K-pop 'BoyNextDoor' (BND) tiene la famosa línea de intro donde tocan a una puerta?",
      o: ["One and Only", "But I Like You", "Serenade", "Earth, Wind & Fire"],
      c: 0
    },
    {
      p: "En la teoría musical, ¿cuántas notas existen en total en la escala cromática (contando naturales y alteradas)?",
      o: ["5 notas", "7 notas", "12 notas", "10 notas"],
      c: 2
    },
    {
      p: "¿Cuál es el festival de música electrónica más grande e icónico del mundo, celebrado anualmente en Bélgica?",
      o: ["Ultra Music Festival", "Tomorrowland", "EDC Vegas", "Coachella"],
      c: 1
    },
    {
      p: "¿Quién es el artista y productor conocido por revolucionar la música electrónica de estilo melódico 'NCS' con temas ultra virales como 'Hope'?",
      o: ["Tobu", "Alan Walker", "Martin Garrix", "Marshmello"],
      c: 0
    },
    {
      p: "¿Qué grupo británico de rock hizo historia con temas legendarios como 'Bohemian Rhapsody' y 'Another One Bites the Dust'?",
      o: ["The Beatles", "Led Zeppelin", "Pink Floyd", "Queen"],
      c: 3
    },
    {
      p: "¿Quién es conocida a nivel mundial en la industria musical con el título de la 'Reina del Pop'?",
      o: ["Whitney Houston", "Britney Spears", "Madonna", "Lady Gaga"],
      c: 2
    },
    {
      p: "¿Qué cantante y compositor canadiense revolucionó las listas de éxitos con canciones masivas como 'Blinding Lights' y 'Starboy'?",
      o: ["Justin Bieber", "The Weeknd", "Shawn Mendes", "Drake"],
      c: 1
    }
  ];
  
  // Estado global de la partida
  let estado = {
    actual: 0,
    puntos: 0
  };
  
  // Función para alternar visibilidad de pantallas
  function mostrarPantalla(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  // Inicia las variables y cambia a la interfaz de juego
  function comenzar() {
    estado.actual = 0;
    estado.puntos = 0;
    document.getElementById('info-puntos').textContent = "0 pts";
    mostrarPantalla('juego');
    renderPregunta();
  }
  
  // Dibuja la pregunta actual y sus opciones en el HTML
  function renderPregunta() {
    document.getElementById('btn-siguiente').style.display = 'none';
    const data = preguntas[estado.actual];
    
    // Actualizar textos y barra de progreso de forma fluida
    document.getElementById('campo-pregunta').textContent = data.p;
    document.getElementById('info-progreso').textContent = `Pregunta ${estado.actual + 1} de ${preguntas.length}`;
    
    const pct = (estado.actual / preguntas.length) * 100;
    document.getElementById('barra').style.width = `${pct}%`;
  
    // Limpiar contenedor e inyectar botones de respuestas
    const contenedor = document.getElementById('opciones');
    contenedor.innerHTML = '';
  
    data.o.forEach((opcion, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.textContent = opcion;
      btn.onclick = () => evaluar(i, btn);
      contenedor.appendChild(btn);
    });
  }
  
  // Evalúa si la opción elegida es correcta o incorrecta
  function evaluar(seleccionado, btnClikeado) {
    const correcta = preguntas[estado.actual].c;
    const botones = document.querySelectorAll('.btn-option');
  
    // Bloquear todos los botones de opciones para evitar doble respuesta
    botones.forEach(b => b.disabled = true);
  
    if (seleccionado === correcta) {
      btnClikeado.classList.add('correct');
      estado.puntos += 100;
      document.getElementById('info-puntos').textContent = `${estado.puntos} pts`;
    } else {
      btnClikeado.classList.add('wrong');
      // Revelar visualmente cuál era la respuesta correcta con luz neón verde
      botones[correcta].classList.add('correct');
    }
  
    // Mostrar el botón para avanzar
    document.getElementById('btn-siguiente').style.display = 'block';
  }
  
  // Avanza a la siguiente pregunta o finaliza el juego
  function siguiente() {
    estado.actual++;
    if (estado.actual < preguntas.length) {
      renderPregunta();
    } else {
      finalizar();
    }
  }
  
  // Muestra la pantalla de resultados con mensajes dinámicos
  function finalizar() {
    const maxPuntos = preguntas.length * 100;
    document.getElementById('barra').style.width = `100%`;
    document.getElementById('score').textContent = `${estado.puntos} / ${maxPuntos}`;
    
    let msg = "";
    if (estado.puntos === maxPuntos) {
      msg = "⚡ ¡Perfecto! Eres una leyenda de la música, tu oído es de nivel Dios.";
    } else if (estado.puntos >= maxPuntos * 0.6) {
      msg = "🔮 ¡Espectacular! Conoces muchísimo de ritmos, bandas y grandes hits.";
    } else {
      msg = "🎧 ¡Sigue sintonizado! Hay un universo completo de beats listos para descubrir.";
    }
    
    document.getElementById('mensaje-final').textContent = msg;
    mostrarPantalla('resultado');
  }
  
  // Regresa al menú inicial
  function reiniciar() {
    mostrarPantalla('inicio');
  }