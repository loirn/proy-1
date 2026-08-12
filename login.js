function iniciarSesion() {
    // Capturamos los valores que el usuario escribió
    const usuarioInput = document.getElementById('usuario').value.trim();
    const contrasenaInput = document.getElementById('contrasena').value.trim();
    const mensajeError = document.getElementById('mensaje-error');
    const cajaLogin = document.querySelector('.login-container');

    // --- AQUÍ DEFINIMOS LA CONTRASEÑA ÚNICA ---
    const contrasenaCorrecta = "12345678";

    // 1. Validamos que escriban CUALQUIER usuario y que la contraseña sea correcta
    if (usuarioInput !== "" && contrasenaInput === contrasenaCorrecta) {
        
        // Todo está correcto: ocultamos el error
        mensajeError.style.display = 'none';
        
        // Efecto visual: Cambiamos el botón para simular carga
        const btn = document.getElementById('btn-aceptar');
        btn.innerHTML = 'CONECTANDO... <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.style.background = 'var(--primary)';
        btn.style.color = '#000';
        btn.style.boxShadow = '0 0 20px var(--primary)';

        // Redireccionamos a la página de los juegos después de 1 segundo
        setTimeout(() => {
            window.location.href = 'tecno.html'; 
        }, 1000);

    } else {
        // 2. Si algo está mal, mostramos el mensaje de error
        mensajeError.style.display = 'block';
        
        // Cambiamos el texto del error dependiendo de qué faltó
        if (usuarioInput === "") {
            mensajeError.innerText = "ERROR: Por favor ingresa un usuario.";
        } else {
            // Si puso un usuario pero falló la clave, mostramos esto:
            mensajeError.innerText = "ERROR: Contraseña incorrecta.";
        }
        
        // Animación: hacemos que la caja tiemble
        cajaLogin.classList.add('shake');
        
        // Quitamos la clase de vibración para que pueda volver a temblar si se equivoca de nuevo
        setTimeout(() => {
            cajaLogin.classList.remove('shake');
        }, 400);
    }
}

// Permite iniciar sesión presionando la tecla "Enter" en el teclado
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        iniciarSesion();
    }
});