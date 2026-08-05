// Lista de preguntas. 'p' es la pregunta, 'o' son las opciones y 'c' es la posición de la respuesta correcta (empezando desde 0)
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
  
  // Objeto para llevar la cuenta de en qué pregunta vamos y cuántos puntos tenemos
  let estado = {
    actual: 0,
    puntos: 0
  };
  
  // Busca todas las pantallas, las oculta quitando la clase 'active', y se la pone solo a la que queremos mostrar
  function mostrarPantalla(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  // Resetea los valores a cero, muestra la pantalla de juego y carga la primera pregunta
  function comenzar() {
    estado.actual = 0;
    estado.puntos = 0;
    document.getElementById('info-puntos').textContent = "0 pts";
    mostrarPantalla('juego');
    renderPregunta();
  }
  
  // Se encarga de poner el texto de la pregunta actual y sus opciones en la pantalla
  function renderPregunta() {
    // Ocultamos el botón de 'Siguiente' para que no hagan trampa
    document.getElementById('btn-siguiente').style.display = 'none';
    const data = preguntas[estado.actual];
    
    // Actualizamos los textos descriptivos de la parte superior
    document.getElementById('campo-pregunta').textContent = data.p;
    document.getElementById('info-progreso').textContent = `Pregunta ${estado.actual + 1} de ${preguntas.length}`;
    
    // Calculamos el porcentaje de la barra de progreso y lo aplicamos
    const pct = (estado.actual / preguntas.length) * 100;
    document.getElementById('barra').style.width = `${pct}%`;
  
    // Vaciamos la zona de respuestas para poner las de la nueva pregunta
    const contenedor = document.getElementById('opciones');
    contenedor.innerHTML = '';
  
    // Por cada opción disponible, creamos un botón HTML desde cero
    data.o.forEach((opcion, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.textContent = opcion;
      // Le decimos al botón que al hacerle clic evalúe si es la respuesta correcta
      btn.onclick = () => evaluar(i, btn);
      contenedor.appendChild(btn);
    });
  }
  
  // Revisa si la opción que tocaste coincide con la respuesta correcta almacenada
  function evaluar(seleccionado, btnClikeado) {
    const correcta = preguntas[estado.actual].c;
    const botones = document.querySelectorAll('.btn-option');
  
    // Desactivamos todos los botones para que no puedan volver a elegir
    botones.forEach(b => b.disabled = true);
  
    if (seleccionado === correcta) {
      // Si acertaste, pinta el botón de verde y suma 100 puntos
      btnClikeado.classList.add('correct');
      estado.puntos += 100;
      document.getElementById('info-puntos').textContent = `${estado.puntos} pts`;
    } else {
      // Si fallaste, pinta tu botón de rojo e ilumina de verde el que era correcto
      btnClikeado.classList.add('wrong');
      botones[correcta].classList.add('correct');
    }
  
    // Ahora sí, permitimos pasar a la siguiente pregunta
    document.getElementById('btn-siguiente').style.display = 'block';
  }
  
  // Suma 1 al contador de preguntas. Si aún quedan, las muestra; si no, termina el juego
  function siguiente() {
    estado.actual++;
    if (estado.actual < preguntas.length) {
      renderPregunta();
    } else {
      finalizar();
    }
  }
  
  // Muestra la puntuación final y un mensaje personalizado según cómo te fue
  function finalizar() {
    const maxPuntos = preguntas.length * 100;
    
    // Llenamos la barra al 100% al terminar
    document.getElementById('barra').style.width = `100%`;
    document.getElementById('score').textContent = `${estado.puntos} / ${maxPuntos}`;
    
    // Decidimos qué mensaje mostrar usando condicionales
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
  
  // Vuelve a cargar el menú inicial para jugar otra vez
  function reiniciar() {
    mostrarPantalla('inicio');
  }