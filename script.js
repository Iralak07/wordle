// En este caso el evento se dispara cuando se carga completamente la pagina web.
document.addEventListener('DOMContentLoaded', ()=>{
    let intentos = 6;
    let diccionario;
    const BUTTON = document.getElementById("guess-button");
    const INPUT = document.getElementById("guess-input");
    INPUT.placeholder = 'Presione jugar'
    INPUT.setAttribute('disabled', true);
    const GRID = document.getElementById("grid");
    const URL = 'https://clientes.api.greenborn.com.ar/public-random-word?c=10&l=5';
    const CONTADOR = document.getElementById('intentado')
    CONTADOR.innerHTML = `Intentos: ${intentos}`
    const JUGAR = document.getElementById('jugar');

    

    JUGAR.addEventListener('click', iniciar);  

    async function obtenerDatos(callback){
        try {
            const respuesta = await fetch(URL);
            const datos = await respuesta.json();
            return datos.filter(palabra => palabra.length == 5);
          } catch (error) {
            console.error(error);
          }
    }

    function iniciar(){
        INPUT.placeholder = 'Ingrese palabra'
        INPUT.removeAttribute('disabled'); 
        INPUT.focus();
        JUGAR.setAttribute('disabled',true);
        obtenerDatos().then(datos => {
            diccionario = datos;
            const palabra = diccionario[Math.floor(Math.random() * diccionario.length)].toUpperCase();
            BUTTON.addEventListener('click', intentar);
            console.log(palabra);
        
            function intentar(){
                const INTENTO = leerIntento();
                if (INTENTO === palabra ) {
                        terminar("<h1>GANASTE!😀</h1>")
                    return
                }
                const ROW = document.createElement('div');
                ROW.className = 'row';
                for (let i in palabra){
                    const SPAN = document.createElement('span');
                    SPAN.className = 'letter';
                    if (INTENTO[i]===palabra[i]){ //VERDE
                        SPAN.innerHTML = INTENTO[i];
                        SPAN.style.backgroundColor = '#79b851';
                    } else if( palabra.includes(INTENTO[i]) ) { //AMARILLO
                        SPAN.innerHTML = INTENTO[i];
                        SPAN.style.backgroundColor = '#f3c237';
                    } else {      //GRIS
                        SPAN.innerHTML = INTENTO[i];
                        SPAN.style.backgroundColor = '#dee1e9';
                    }
                    ROW.appendChild(SPAN);
                }
                GRID.appendChild(ROW);
                intentos--
                CONTADOR.innerHTML = `Intentos: ${intentos}`
                if (intentos==0){
                    terminar("<h1>PERDISTE!😖</h1>")
                };
                
            };
            
        
            function leerIntento(){
                let intento = INPUT.value;
                intento = intento.toUpperCase(); 
                return intento;
            };
        
        
            function terminar(mensaje){
                INPUT.disabled = true;
                BUTTON.disabled = true;
                let contenedor = document.getElementById('guesses');
                contenedor.innerHTML = mensaje;
            }
        }); 
    }   
});


