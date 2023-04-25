// En este caso el evento se dispara cuando se carga completamente la pagina web.
document.addEventListener('DOMContentLoaded', ()=>{
    let intentos = 6;
    let diccionario;
    let datos;
    const BUTTON = document.getElementById('guess-button');
    const INPUT = document.getElementById("guess-input");
    const GRID = document.getElementById("grid");
    const URL = 'https://clientes.api.greenborn.com.ar/public-random-word?c=10&l=5';
    const CONTADOR = document.getElementById('intentado');
    const JUGAR = document.getElementById('jugar');
    const INICIALIZADO = document.querySelector('.inicializado');
    const ESTADOS = {
        porDefecto: 'porDefecto',
        iniciado: 'iniciado',
        pierde: 'pierde',
        gana: 'gana',
    };
    let estado = ESTADOS.porDefecto;

    JUGAR.addEventListener('click', iniciar);  

    async function obtenerDatos(callback){
        try {
            const respuesta = await fetch(URL);
            const datos = await respuesta.json();
            return datos.filter(palabra => palabra.length == 5);
          } catch (error) {
            console.error(error);
          }
    };

    function controlarEstados(estado){
        if(estado == ESTADOS['porDefecto']){
            intentos =  6;
            document.getElementById('guesses').innerHTML = '<h2>Presiona el boton jugar, para iniciar el juego!<h2>'
            INPUT.style.display = 'none';
            BUTTON.style.display = 'none';
            INICIALIZADO.style.display = 'block';
        }else if(estado == ESTADOS['iniciado']){
            document.getElementById('adivinar').style.display = 'block';
            CONTADOR.innerHTML = `Intentos: ${intentos}`
            document.getElementById('guesses').innerHTML = ''
            INICIALIZADO.style.display = 'none';
            BUTTON.setAttribute('disabled',true);
            INPUT.value = ''
            INPUT.placeholder = 'Ingrese palabra'
            INPUT.removeAttribute('disabled'); 
            INPUT.style.display = 'block';
            INPUT.focus();
            BUTTON.style.display = 'block';
        
        }else if(estado == ESTADOS['gana']){
            INPUT.value = ''
            document.getElementById('adivinar').style.display = 'none';
            document.getElementById('guesses').innerHTML = '<h2>Felicidades, haz ganado!<h2>'
            setTimeout(()=>{
                GRID.innerHTML = '';
                estado = ESTADOS.porDefecto;
                CONTADOR.innerHTML = ''
                controlarEstados(estado);
            },4000);
        }else{
            INPUT.value = ''
            CONTADOR.innerHTML = ''
            setTimeout(()=>{
                GRID.innerHTML = '';
                estado = ESTADOS.porDefecto;
                controlarEstados(estado);
                document.getElementById('adivinar').style.display = 'none';
                document.getElementById('guesses').innerHTML = '<h2>Vuelve a Intentarlo, presionando el boton jugar!<h2>'
            },2000);
        }  
    };

    controlarEstados(estado); 
    function iniciar(){
        estado = ESTADOS.iniciado;
        controlarEstados(estado);
        obtenerDatos().then(datos => {
            diccionario = datos;
            const palabra = diccionario[Math.floor(Math.random() * diccionario.length)].toUpperCase();
            console.log(palabra);

            INPUT.addEventListener('input', (event)=>{
                event.preventDefault();
                let caracteres = INPUT.value;
                if(/^[a-z]{5}$/.test(caracteres)){
                    BUTTON.removeAttribute('disabled');
                }else{
                    BUTTON.setAttribute('disabled', true)
                };   
            });

            BUTTON.addEventListener('click', intentar);

            function intentar(){
                const INTENTO = leerIntento();
                if (INTENTO === palabra ) {     
                    BUTTON.removeEventListener('click', intentar) 
                    estado = ESTADOS.gana; 
                    terminar("<h1>GANASTE!</h1>", estado);
                }
                const ROW = document.createElement('div');
                ROW.className = 'row';
                for (let i in palabra){
                    const SPAN = document.createElement('span');
                    SPAN.className = 'letter';
                    if (INTENTO[i]===palabra[i]){
                        SPAN.innerHTML = INTENTO[i];
                        SPAN.style.backgroundColor = '#79b851';
                    } else if( palabra.includes(INTENTO[i]) ) {
                        SPAN.innerHTML = INTENTO[i];
                        SPAN.style.backgroundColor = '#f3c237';
                    } else { 
                        SPAN.innerHTML = INTENTO[i];
                        SPAN.style.backgroundColor = '#dee1e9';
                    }
                    ROW.appendChild(SPAN);
                }
                GRID.appendChild(ROW);
                intentos --
                CONTADOR.innerHTML = `Intentos: ${intentos}`
                if (intentos == 0){
                    BUTTON.removeEventListener('click', intentar)
                    estado = ESTADOS.pierde;
                    terminar("<h1>PERDISTE!</h1>", estado)
                };
                
            };
            
        
            function leerIntento(){
                let intento = INPUT.value;
                intento = intento.toUpperCase(); 
                return intento;
            };
        
        
            function terminar(mensaje,estado){
                controlarEstados(estado);
                let contenedor = document.getElementById('guesses');
                contenedor.innerHTML = mensaje;
            }
        }); 
    }   
});


