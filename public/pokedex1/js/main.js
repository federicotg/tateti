/* OBJETOS DEL DOM */
//Selecciono los elementos y los guardo en una lista
const listPokemon = document.querySelectorAll('.list-item')
//Guardo los botones 
const prevButton = document.querySelector('.prev-button')
const nextButton = document.querySelector('.next-button')

//Guardo los elementos,pokemon-{name,image,type-one,type-two,weight,height} para utilizar en showPokemon()
const pokeName = document.querySelector('.pokemon-name')
const pokeImg =document.querySelector('.pokemon-image')
const pokeType1 =document.querySelector('.type-one')
const pokeType2 =document.querySelector('.type-two')
const pokeWeight = document.querySelector('.pokemon-weight')
const pokeHeight = document.querySelector('.pokemon-height')
const pokeSkill1 =document.querySelector('.skill-one')
const pokeSkill2 =document.querySelector('.skill-two')

/* FUNCIONES */
//Convierte la primer letra en mayuscula y luego uno lo que sige de la palabra con substr()
const capitalize = (str) => str[0].toUpperCase() + str.substr(1)

//uso let porque las voy a ir modificando
let prevUrl = null
let nextUrl = null

//Funcion donde busco la informacion de la pokeapi y luego la muestro en el html
const fetchPokemon = url =>{
    fetch(url)
    .then(res => res.json())
    .then(data => {
        //Guardo los valores de result, previous y next
        const {results, previous, next} = data
        //Guardo las url de la pagina siguiente y anterior
        prevUrl = previous
        nextUrl = next

        for (let i=0; i<listPokemon.length; i++){
            //Guardo los datos del pokemon
            const resultDataPokemon = results[i]
            //Me guardo el nombre y la url
            const { name, url } = resultDataPokemon
            //Separo la url de forma de obtener el id 
            const urlArray = url.split('/')
            //Guardo el id
            const id = urlArray[urlArray.length - 2]
            //Asigno texto al de la lista de pokemon
            listPokemon[i].textContent = id + '. ' + capitalize(name)
        }
    })
}

//Funcion de pagina siguiente
const prevButtonClick = () =>{
    //if la url no es null
    if (prevUrl){
        fetchPokemon(prevUrl)
    }
}

//Funcion de pagina anterior
const nextButtonClick = () =>{
    //if la url no es null
    if (nextUrl){
        fetchPokemon(nextUrl)
    }
}

//Funcion que me trae el elemento que activa al evento con e.target y sepera la id
const listItemClick = (e) =>{
    const listItem = e.target
    const idPokemon = listItem.textContent.split('.')[0]
        loadPokemon(idPokemon)
}

//funcion para mostrar los elementos por pokemon seleccionado en la lista
// se podria reutlizar para cargar los pokemons en una busqueda
const showPokemon = pokemon => {
    pokeName.textContent  = capitalize(pokemon.name)
    if ((pokemon['sprites']['other']['official-artwork']['front_default']) != null){
        pokeImg.src = pokemon['sprites']['other']['official-artwork']['front_default']
    }else{
        pokeImg.src = pokemon['sprites']['front_default']
    }
    pokeType1.textContent= capitalize(pokemon.types[0].type.name)
    if(pokemon.types[1] != undefined){
        pokeType2.textContent= capitalize(pokemon.types[1].type.name) 
        
    }else{
        pokeType2.classList.remove('type-two')//elimino sino existe
        pokeType2.classList.add('type-two') // agrego uno nuevo
        pokeType2.textContent = 'Single type'
    }
    pokeWeight.textContent = `Peso: ${pokemon.weight} gr`
    pokeHeight.textContent = `Altura: ${pokemon.height} cm`
    pokeSkill1.textContent = capitalize( pokemon.abilities[0].ability.name)
    if(pokemon.abilities[1] != undefined){
        pokeSkill2.textContent= capitalize( pokemon.abilities[1].ability.name); 
        
    }else{
        pokeSkill2.classList.remove('type-two');
        pokeSkill2.classList.add('type-two');
        pokeSkill2.textContent = 'Single ability';
    }
}

// fetch para traerme los datos por id del pokemon seleccionado
// se podria reutlizar para cargar los pokemons en una busqueda
const loadPokemon = (idPokemon) => {
    fetch(`${urlID}/${idPokemon}`) //concateno el id que me llega por parametro
        .then(resp => resp.json())
        .then(data => showPokemon(data))
}

//busca el pokemon, si esxiste muestra el pokemon
async function getPokemon(name /* = "bulbasaur" */) { 
    try{
        const res = await fetch(`${urlID}/${name}`) 
        const pokemon = await res.json()
        showPokemon(pokemon)
    }
    catch(error){
        alert("El pokemon no existe.") // y sino tira un alert con error
    }
}

// funcion de busqueda
const searchPokemon = () =>{
    const ser = document.getElementById('poke-search').value
    const x = ser.toLowerCase()
    document.getElementById('poke-search').value = '' //limpio el campo
    getPokemon(x)
}

/* EVENTOS */
prevButton.addEventListener('click', prevButtonClick)
nextButton.addEventListener('click', nextButtonClick)
//Me aseguro que en cualquier elemento de la lista que haga click se levanta el evento
for (const pokelistItem of listPokemon){
    pokelistItem.addEventListener('click', listItemClick)
}

/* CONSTANTES */
const APIurl = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
const urlID = 'https://pokeapi.co/api/v2/pokemon'

/* INICIO DE APP */
fetchPokemon(APIurl)