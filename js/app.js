// ESPERO HASTA QUE EL HTML SEA LEIDO/CARGADO COMPLETAMENTE
window.addEventListener('load', preparativos);


// VARIABLES GLOBALES
var canvas, ctx, anchoCanvas, altoCanvas;
var comida; existe_comida = false;
var intervalo, fps = 3, intervalo_comida, intervalo_muerto;
var score = 0;
// SERPIENTE
var serpiente = new Array();
var longitudSerpiente = 2;
var cabeza;
var muerto = false;
// DIRECCION DEL MOVIMIENTO DE LA SERPIETNE
izquierda = false;
arriba = false;
derecha = false;
abajo = false;
// imgs
var img_cuadrado = new Image();
var img_comida = new Image();
var img_hazClick = new Image();
var img_gameover = new Image();
var img_body_left = new Image();
var img_body_up = new Image();
var img_body_right = new Image();
var img_body_down = new Image();



// FUNCION PARA PREPARAR EL JUEGO
function preparativos() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	canvas.style.background = 'url(images/fondo.png)';
	canvas.style.border = '2px solid black';
	
	canvas.setAttribute("width", "500");
	canvas.setAttribute("height", "500");
	
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	
	img_hazClick.src = 'images/hazClick.png';
	img_gameover.src = 'images/gameover.png';
	
	img_cuadrado.src = 'images/cuadrado.png';
	img_comida.src = 'images/comida.png';
	
	img_body_left.src = 'images/body_left.png';
	img_body_up.src = 'images/body_up.png';
	img_body_right.src = 'images/body_right.png';
	img_body_down.src = 'images/body_down.png';

	
	var x = (Math.round(Math.random()*10)) * anchoCanvas/10;
	var y = (Math.round(Math.random()*10)) * altoCanvas/10;
	while (y >= altoCanvas || x >= anchoCanvas ||x == -1 || y == -1) {
		var x = (Math.round(Math.random()*10)) * anchoCanvas/10;
		var y = (Math.round(Math.random()*10)) * altoCanvas/10;
	} 
	cabeza = new Cuadrado(x,y, anchoCanvas/10, altoCanvas/10, img_cuadrado);
	serpiente.push(cabeza);
	
	pedirClickParaIniciar();
	canvas.addEventListener('click', iniciar);
}

// FUNCION QUE ESCRIBE EN PANTALLA PARA SOLICITAR UN CLICK -> PARA QUE SE INICIE EL JUEGO
function pedirClickParaIniciar() {
	img_hazClick.onload = function() {
		ctx.drawImage(img_hazClick, anchoCanvas/10, (altoCanvas/10)*4, (anchoCanvas/10)*8, altoCanvas/10);
		ctx.stroke();
	}
	
}

// BUCLE PRINCIPAL DEL JUEGO
function frame() {
	actualizar();
	if (existe_comida) comer();
	limpiar();
	dibujar();
}

// FUNCION QUE ACTUALIZA EL ESTADO DE LOS OBJETOS
function actualizar() {
	score = longitudSerpiente * 10;
	cabeza = serpiente[0];
	if (izquierda) {
		cabeza.img = img_body_left;
	}
	if (arriba) {
		cabeza.img = img_body_up;
	}
	if (derecha) {
		cabeza.img = img_body_right;
	}
	if (abajo) {
		cabeza.img = img_body_down;
	}
	
	colisiones();

	// VOY ELIMINANDO LOS ULTIMOS CUADRADOS, PARA QUE LA SERPIENTE NO SEA INFINITA.
	if (serpiente.length > longitudSerpiente) {
		serpiente.pop();
	}
	
	
	// CAMBIO LAS COOREDENADAS DE SERPIENTE SEGUN IZQUIERDA,DERECHA,ARRIBA O ABAJO SEAN TRUE O FALSE
	if (izquierda) { 
		var x = cabeza.x - cabeza.ancho;
		var nuevaParte = new Cuadrado(x, cabeza.y, cabeza.ancho, cabeza.alto, img_cuadrado);
		serpiente.unshift(nuevaParte); // Como el push, pero al inicio del array (0) y no al final.
	}
	
	if (arriba) {
		var y = cabeza.y - cabeza.alto;
		var nuevaParte = new Cuadrado(cabeza.x, y, cabeza.ancho, cabeza.alto, img_cuadrado);
		serpiente.unshift(nuevaParte);
	}
	
	if (derecha) {
		var x = cabeza.x + cabeza.ancho;
		var nuevaParte = new Cuadrado(x, cabeza.y, cabeza.ancho, cabeza.alto, img_cuadrado);
		serpiente.unshift(nuevaParte);
	}
	
	if (abajo) {
		var y = cabeza.y + cabeza.alto;
		var nuevaParte = new Cuadrado(cabeza.x, y, cabeza.ancho, cabeza.alto, img_cuadrado);
		serpiente.unshift(nuevaParte);
	}
}

// FUNCION QUE HACE QUE SI COINCIDEN LAS COORD DE LA CABEZA CON LAS DE LA COMIDA CREZCA Y APARECE NUEVA COMIDA
function comer() {
	if (cabeza.x == comida.x && cabeza.y == comida.y) {
		longitudSerpiente += 1;
		existe_comida = false;
	}
}

// FUNCION QUE COMPRUEBA LAS COLISIONES
function colisiones() {
	
	// POR SI LA SERPIENTE SE SALE DEL CANVAS
	for (var parte of serpiente) {
		if (parte.x < 0) {
			parte.x = anchoCanvas - parte.ancho
		}

		if (parte.x > anchoCanvas - parte.ancho) {
			parte.x = 0;
		}

		if (parte.y < 0) {
			parte.y = altoCanvas - parte.alto;
		}

		if (parte.y > altoCanvas - parte.alto) {
			parte.y = 0;
		}
	}
	
	// POR SI LA SERPIENTE COCHA CONTRA SÍ MISMA
	for (var i = 1; i < serpiente.length; i++) { // Como la cabeza siempre será 0, empiezo a comprar desde el siguiente, el 1.
		if (cabeza.x == serpiente[i].x && cabeza.y == serpiente[i].y) {
			muerto = true;
		}
	}
}

// FUNCION QUE CREA LA COMIDA
function crearComida() {
	if (!existe_comida) {
		var x = -1
		var y = -1;
		while (y >= altoCanvas || x >= anchoCanvas ||x == -1 || y == -1) {
			var x = (Math.round(Math.random()*10)) * anchoCanvas/10;
			var y = (Math.round(Math.random()*10)) * altoCanvas/10;
		} 
		comida = new Cuadrado(x, y, anchoCanvas/10, altoCanvas/10, img_comida);
		existe_comida = true;
	}
}

// FUNCION QUE SE EJECUTA CUANDO SE PULSA UNA TECLA
function movimiento(event) {
	var tecla = event.which || event.keyCode;
	
	switch(tecla) {
	case 37: // MOVER HACIA IZQUIERDA [<]
		if (!derecha) { 
			izquierda = false; arriba = false; derecha = false; abajo = false;
			izquierda = true;
		}
		break;
	case 38: // MOVER HACIA ARRIBA [^]
		if (!abajo) {
			izquierda = false; arriba = false; derecha = false; abajo = false;
			arriba = true;
		}
		break;
	case 39: // MOVER HACIA DERECHA [>]
		if (!izquierda) {
			izquierda = false; arriba = false; derecha = false; abajo = false;
			derecha = true;
		}
		break;
	case 40: // MOVER HACIA ABAJO [V]
		if (!arriba) {
			izquierda = false; arriba = false; derecha = false; abajo = false;
			abajo = true;
		}
		break;
	} // FIN SWITCH
}

// FUNCION QUE CREA EL BUCLE DEL JUEGO -> INICIA LA PARTIDA
function iniciar() {
	canvas.removeEventListener("click", iniciar);
	limpiar();
	// BUCLE/INTERVALO PRINCIPAL DEL JUEGO
	intervalo = setInterval(frame, 1000/fps);
	// IMTERVALO PARA COMPROBAR LA EXISTENCIA DE LA COMIDA
	intervalo_comida = setInterval(crearComida, 1000/fps);
	// INTERVALO PARA COMPROBAR SI ESTAMOS VIVOS O NO
	intervalo_muerto = setInterval(comprobarGameOver, 1000/fps);
	window.addEventListener('keydown', movimiento);
	
	canvas.addEventListener('click', function() {
		clearInterval(intervalo);
	});
}

function comprobarGameOver() {
	if (muerto) {
		limpiar();
		clearInterval(intervalo);
		clearInterval(intervalo_comida);
		clearInterval(intervalo_muerto);
		ctx.drawImage(img_gameover, anchoCanvas/10, (altoCanvas/10)*4, (anchoCanvas/10)*8, altoCanvas/10);
		ctx.stroke();
		ctx.font = '24pt Courier';
		ctx.fillText('Puntuación: ' + score, anchoCanvas/5, (altoCanvas/10)*6);
	}
}

// FUNCION PRINCIPAL QUE LIMPIARA DIBUJOS EN EL CANVAS
function limpiar() {
	ctx.clearRect(0,0,anchoCanvas, altoCanvas);
}

// FUNCION QUE DIBUJARA EN EL CANVAS (LLAMADA POR LA FUNCION FRAME)
function dibujar() {
	dibujarInformacion();
	if (existe_comida) dibujarComida();
	dibujarSerpiente();
}

// FUNCION QUE DIBUJA LA COMIDA
function dibujarComida() {
	comida.dibujar(ctx);
}

// FUNCION QUE RECORRE EL ARRAY Y DIBUJA LAS PARTES DE LA SERPIENTE
function dibujarSerpiente() {
	for (var parte of serpiente) {
		parte.dibujar(ctx);
	}
}

// FUNCION QUE DIBUJA LA PUNTUACION
function dibujarInformacion() {
	ctx.fillStyle = 'black';
	ctx.font = '12pt Courier';
	ctx.fillText('Puntuación: ' + score, 15, 15);
	ctx.fillText('Longitud serpiente: ' + longitudSerpiente, 15, 35);
	ctx.font = '9pt Courier';
	ctx.fillText('Cabeza X: ' + cabeza.x, 350, 15);
	ctx.fillText('Cabeza Y: ' + cabeza.y, 350, 35);
	if (existe_comida) {
		ctx.fillText('Comida X: ' + comida.x, 350, 55);
		ctx.fillText('Comida Y: ' + comida.y, 350, 75);
	}

}