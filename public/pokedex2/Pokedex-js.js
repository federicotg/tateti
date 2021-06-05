// Llamamos a la API de pokemon con Fetch

document.body.onload = cargarPokemones("https://pokeapi.co/api/v2/pokemon");

/* 
    Funcion borrar lista, borra la lista creada
    con los pokemones de la anterior pagina y crea
    una nueva vacia para que se pueda crear sin
    inconnvenientes una lista de pokemones de la
    pagina previa o siguiente.
*/
function borrarLista() {
    var listaBorrar = document.getElementById("Pokemones-lista");
    while (listaBorrar.firstChild) {
        listaBorrar.removeChild(listaBorrar.firstChild);
    }  
}
//-Falta enlazar links a cada pokemón.-

/* 
   la función obtenerDescripcion crea una lista con la
   descripcion del pokemon llamando a las funciones obtener {algun detalle}
   cada vez que se hace click sobre su nombre  

*/

function obtenerImg(datos){
    imgfrente= document.getElementById("img frente");
    imgback= document.getElementById("img back");
    imgfrente.src= datos['sprites']['front_default'];
    imgback.src= datos['sprites']['back_default'];
}

function obtenerNombre(datos, listaDet){
    nombre= document.createElement('ul');
    nombre.textContent= "Nombre: "+datos.name;
    listaDet.appendChild(nombre); 
}

function obtenerAltura(datos,listaDet){
    altura= document.createElement('ul');
    let a = parseFloat(datos.height*1/10);
    altura.textContent= "Altura: "+a+" m";
    listaDet.appendChild(altura);
}

function obtenerPeso(datos, listaDet){
    peso= document.createElement('ul');
    let p = parseFloat(datos.weight*1/10);
    peso.textContent="Peso: "+p+" kg";
    listaDet.appendChild(peso);
}

function obtenerHabilidades(datos, listaDet){
    habilidades= document.createElement('ul');
    habilidadesOcultas= document.createElement('ul');
    let abilities = datos.abilities;
    let ocultas='Vacío.';
    let hab='';
    for (let i=0; i< abilities.length ; i++) { //abilities es un array
        if (abilities[i].is_hidden == true)
            ocultas= abilities[i].ability.name;
    else
        hab= hab + '  ' + abilities[i].ability.name; 
    }
    habilidades.textContent= "Habilidades: "+hab;
    habilidadesOcultas.textContent="Habilidades ocultas: "+ocultas;
    listaDet.appendChild(habilidades);
    listaDet.appendChild(habilidadesOcultas);
}

function obtenerMovimientos(datos, listaDet){
    movimientos= document.createElement('ul');
    let moves= datos.moves;
    let mov='';
    for (let i=0;i<3; i++){ //moves es un array
        mov= mov + ' ' + moves[i].move.name;
    }
    movimientos.textContent= "Algunos movimientos: "+mov; //pusimos solo 3 porque son demasiados
    listaDet.appendChild(movimientos);
}

async function obtenerDescripcion(url){
    const datos = await fetch(url)
    .then(data => data.json())
    .catch(err => console.log(err))
    listaDet= document.getElementById("PokemonDet"); //lista donde cada detalle sera un elemento
    listaDet.textContent=" ";
    //imagenes
    obtenerImg(datos);
    //nombre
    obtenerNombre(datos, listaDet);
    //altura (se debe acomodar para que aparezca en metros o en cm)
    obtenerAltura(datos, listaDet);
    //peso (tambien se debe acomodar para que aparezca en kg o gr)
    obtenerPeso(datos, listaDet);
    //habilidades
    obtenerHabilidades(datos, listaDet);
    //movimientos
    obtenerMovimientos(datos, listaDet);
}
/*
    la funcion cargar pokemones crea una lista con los
    pokemones de la pagina indicada. Utilizamos fetch 
    y añandimos a los botones prev y sig la pagina ante-
    rior y siguiente respectivamente.
    Utilizamos fragment para mejorar el código y añadir 
    la lista al HTML una vez se cree, evitando agregar
    uno por uno en el HTML los pokemones.
*/
async function cargarPokemones(link) {
    datos = await fetch(link)
    .then(function(data){
    return data.json()})
    .catch(function(err){
    console.log(err)
    })  
    var listUL = document.getElementById("Pokemones-lista"); // UL del HTML

    for (const pokemones of datos.results) { //itera sobre cada pokemon 
        listUL.innerHTML +=  `<li onclick="obtenerDescripcion('${pokemones.url}')">${pokemones.name}</li>`
    }
    //Botón hacia atras 
    links.innerHTML = (datos.previous) ? `<button id="boton" onclick="cargarPokemones2('${datos.previous}')">Atrás</button>` : "";
    //Botón hacia adelante
    links.innerHTML += (datos.next) ? `<button id="boton" onclick="cargarPokemones2('${datos.next}')">Siguiente</button>` : "";
}
async function cargarPokemones2(link) {
    datos = await fetch(link)
    .then(function(data){
    return data.json()})
    .catch(function(err){
    console.log(err)
    })  
    borrarLista();
    var listUL = document.getElementById("Pokemones-lista"); // UL del HTML

    for (const pokemones of datos.results) { //itera sobre cada pokemon 
        listUL.innerHTML +=  `<li onclick="obtenerDescripcion('${pokemones.url}')">${pokemones.name}</li>`
    }
    //Botón hacia atras 
    links.innerHTML = (datos.previous) ? `<button id="boton" style="margin: 20px" onclick="cargarPokemones2('${datos.previous}')">Atrás</button>` : "";
    //Botón hacia adelante
    links.innerHTML += (datos.next) ? `<button id="boton" style="margin: 10px" onclick="cargarPokemones2('${datos.next}')">Siguiente</button>` : "";
}