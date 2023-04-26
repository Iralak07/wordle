// En este caso el evento se dispara cuando se carga completamente la pagina web.
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Aqui defino las variables iniciales, y los elementos ha ser utilizado en el programa
     */
      let diccionario;
      const BUTTON = document.getElementById("guess-button");
      const INPUT = document.getElementById("guess-input");
      const GRID = document.getElementById("grid");
      const URL = "https://clientes.api.greenborn.com.ar/public-random-word?c=10&l=5";
      const CONTADOR = document.getElementById("intentado");
      const JUGAR = document.getElementById("jugar");
      const INICIALIZADO = document.querySelector(".inicializado");
      // Esto lo realice para poder manejar los eventos, y poder asi cambiar la apriencia de mi pagina dependiendo del estado actual
      const ESTADOS = {
        porDefecto: "porDefecto",
        iniciado: "iniciado",
        pierde: "pierde",
        gana: "gana",
      };
      const BOTONGanador = document.getElementById('ganador');
      // Pongo el estado por defecto
      let estado = ESTADOS.porDefecto;
    
      // escuchamos al boton jugar para iniciar el juego
      JUGAR.addEventListener("click", iniciar);
    
      fetch(URL)
        .then((response) => response.json())
        .then((response) => {
          diccionario = response.filter((palabra) => palabra.length == 5);
          palabra =diccionario[Math.floor(Math.random() * diccionario.length)].toUpperCase();
        })
        .catch((err) => {
          console.log("Ha ocurrido un error");
        });
    
    /**
     * ste bloque de codigo es como su nombre dice controla los estados de la aplicacion
     * , para cambiar dependiento en que estado actualmente
     *  */ 
      function controlarEstados(estado) {
        // Aqui es el estado sin iniciar el juego, solo al cargar la pagina
        if (estado == ESTADOS["porDefecto"]) {
          CONTADOR.innerHTML = "";
          BOTONGanador.style.display = 'none';
          intentos = 6;
          document.getElementById("guesses").innerHTML = "<h2>Presiona el boton jugar, para iniciar el juego!<h2>";
          INPUT.style.display = "none";
          BUTTON.style.display = "none";
          INICIALIZADO.style.display = "block";
        } else if (estado == ESTADOS["iniciado"]) {
            // en este bloque inicializamos el juego, hacemos aprecer el input y el boton adivinar
          BOTONGanador.style.display = 'none';
          document.getElementById("adivinar").style.display = "block";
          CONTADOR.innerHTML = `Intentos: ${intentos}`;
          document.getElementById("guesses").innerHTML = "";
          INICIALIZADO.style.display = "none";
          INPUT.value = "";
          INPUT.removeAttribute("disabled");
          INPUT.style.display = "block";
          INPUT.focus();
          BUTTON.style.display = "block";
        } else if (estado == ESTADOS["gana"]) {
            // aqui cunado el jugador gana el juego
          CONTADOR.style.display = 'none';
          INPUT.value = "";
          INPUT.style.display = "none";
          BUTTON.style.display = "none";
          document.getElementById("adivinar").style.display = "none";
          document.getElementById("guesses").innerHTML =  `<h2>Felicidades, haz ganado!<br>En un total de ${6 - intentos} intento<h2>`;
          BOTONGanador.style.display = 'block';
          BOTONGanador.addEventListener('click',() => {
            GRID.innerHTML = "";
            estado = ESTADOS.porDefecto;
            controlarEstados(estado);
          });
        } else {
            // aqui cuando el jugador pierde el juego
          INPUT.style.display = "none";
          BUTTON.style.display = "none";
          document.getElementById("adivinar").style.display = "none";
          document.getElementById("guesses").innerHTML = `<h2>Lo lamento, haz perdido!!<br>La respuesta correcta es <span style="color: #A459D1 ">${palabra}</span>!<h2>`;
          BUTTON.setAttribute("disabled", true);
          BOTONGanador.style.display = 'block';
          CONTADOR.innerHTML = "";
          BOTONGanador.addEventListener('click',() => {
            GRID.innerHTML = "";
            estado = ESTADOS.porDefecto;
            controlarEstados(estado);
          });
        }
      }
    
      // aca llamao primeramente al la funcion para enviarle el estado por defecto
      controlarEstados(estado);
    
      // iniciamos y le cambiamos el estado
      function iniciar() {
        estado = ESTADOS.iniciado;
        controlarEstados(estado);
        palabra =diccionario[Math.floor(Math.random() * diccionario.length)].toUpperCase();
        console.log('La palabra seleccionado aleatoriamente es: ', palabra)
      }
    
      // escuchamos cuando se esta sobre el input solamento o escribiendo
      INPUT.addEventListener("input", (event) => {
        event.preventDefault();
        let caracteres = INPUT.value;
        // Encontre esta formula en internet para validar la entrada del input, que solo tenga minusculas o mayusculas igual a 5 caractes, ni mas ni menos
        // en caso de que no coicida no se puede enviar la respueta deshabilitando el boton adivinar y activandolo cuando se cumple la condicion
        if (/^[a-zA-Z]{5}$/.test(caracteres)) {
          BUTTON.removeAttribute("disabled");
        } else {
          BUTTON.setAttribute("disabled", true);
        }
      });
    
      // Aqui se escuha al boton adivinar
      BUTTON.addEventListener("click", intentar);
    
    
      // Aca verificamos los intentos, obteniendo la palabra escrita en el input y comparandolo con la palabra aleatoria de la Api
      function intentar() {
        const INTENTO = leerIntento();
        if (INTENTO === palabra) {
          intentos--
          estado = ESTADOS.gana;
          terminar(estado);
        }
        const ROW = document.createElement("div");
        ROW.className = "row";
        for (let i in palabra) {
          const SPAN = document.createElement("span");
          SPAN.className = "letter";
          if (INTENTO[i] === palabra[i]) {
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = "#79b851";
          } else if (palabra.includes(INTENTO[i])) {
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = "#f3c237";
          } else {
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = "#dee1e9";
          }
          ROW.appendChild(SPAN);
        }
        GRID.appendChild(ROW);
        intentos--;
        CONTADOR.innerHTML = `Intentos: ${intentos}`;
        if (intentos == 0) {
          estado = ESTADOS.pierde;
          terminar(estado);
        }
      }
    
      function leerIntento() {
        let intento = INPUT.value;
        intento = intento.toUpperCase();
        return intento;
      }
    
      function terminar(estado) {
        controlarEstados(estado);
      }
    });
    