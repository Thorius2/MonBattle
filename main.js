const pokeNumber = document.getElementById("pokeNumber");
const statChosen = document.getElementById("selectStat");
const btnFight = document.querySelector(".submit-btn");
const btnReset = document.querySelector(".reset-btn");
const errorMsg = document.querySelector(".error-msg");
const playerContainer = document.querySelector(".playerContainer")
const machineContainer = document.querySelector(".machineContainer")
const resultsContainer = document.querySelector(".resultsContainer")
const matchHistory = document.querySelector(".matchHistory")
const noMatches = document.querySelector(".noMatches")
let playerScore = document.querySelector(".playerScore")
let computerScore = document.querySelector(".computerScore")
const baseURL = "https://pokeapi.co/api/v2/pokemon/";

//Si hay pokemones en el LS, los trae
let playerPokemons = JSON.parse(localStorage.getItem("PokesPlayer")) || []
let computerPokemons = JSON.parse(localStorage.getItem("PokesComputer")) || []
let resultados = JSON.parse(localStorage.getItem("Results")) || []
let playerPoints = JSON.parse(localStorage.getItem("Player Points"))
let computerPoints = JSON.parse(localStorage.getItem("Computer Points")) || []

// Hace el fetch de Pokemon, en base al número ingresado como parámetro
const fetchPokemon = async (pokeNumber) => {
    try {
        const pokeURL = baseURL + Number(pokeNumber)
        const response = await fetch(pokeURL)
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(pokeNumber)
        showError(`There is no pokemon with the number ${pokeNumber}. Please enter a number between 1 and 898.`)
    }
}

//Renderiza el Pokemon en la card elegida (player o computer). Además, actualiza el título, y trae la info de los pokemon requeridos.
const renderPokemon = (pokeData, cardContainer, titleName) => {

    let pokemon = pokeData

    console.log(pokemon)

    const {id, name, sprites, stats, types, weight, height} = pokemon

    const hp = calcMaxStat(stats[0].stat.name,stats[0].base_stat)
    const attack = calcMaxStat(stats[1].stat.name,stats[1].base_stat)
    const defense = calcMaxStat(stats[2].stat.name,stats[2].base_stat)
    const heStat = height*10;
    const spDefense = calcMaxStat(stats[3].stat.name,stats[3].base_stat)
    const spAttack = calcMaxStat(stats[4].stat.name,stats[4].base_stat)
    const speed = calcMaxStat(stats[5].stat.name,stats[5].base_stat)
    const weStat = weight/10;

    const fullStats = {id, name, hp, attack, defense, height, spDefense, spAttack, speed, weight} 

    // Agrega el pokemon al array de pokes ya creado (hasta un máximo de 6)
    pushPoke(fullStats, titleName);
    
    cardContainer.innerHTML = `
        <h2>${titleName} Selection</h2>     
        <h3>#${id} - ${name.toUpperCase()}</h3>
        <img src="${sprites.front_default}" alt="PokeImg" class="pokeImg" />
        <div class="types">
            ${renderTypes(types)}
        </div>

        <div class="statsContainer">
            <div class="substats">
                <p class="hp">HP: ${hp}</p>
                <p class="attack">Attack: ${attack}</p>
                <p class="defense">Defense: ${defense}</p>
                <p class="height">Height: ${heStat} cm.</p>
            </div>
            <div class="substats">
                <p class="spDefense">Sp. Defense: ${spDefense}</p>
                <p class="spAttack">Sp. Attack: ${spAttack}</p>
                <p class="speed">Speed: ${speed}</p>
                <p class="weight">Weight: ${weStat} kg.</p>
            </div>
        </div>
        `
        styleStat()
}

//Comienza cuando se le da click al botón de Fight. Hace una validación y si todo está bien, continua el proceso.
const startFight = async (e) => {
    e.preventDefault();
    const pokeid = pokeNumber.value;
    
    if (isEmpty(pokeid) === true) { 
        return
    } else if (isDuplicated(playerPokemons,pokeid) === true) {
        return showError("That pokemon has been already chosen. Don't try to use always the same overpowered Pokemon! - Choose another one :>(")
    } else if (scoreSix() === true) {
        return showError("This round is already over! If you want to play again, click the reset button at the bottom.")
    } else {

        let randomNumber = 0
        // Esto va a evitar que la máquina elija el mismo Pokemon dos veces seguidas
        do {
            randomNumber = randomInteger(1, 899);
        } while (isDuplicated === true);

        // const randomNumber = randomInteger(1, 899);

        await fetchPokemon(pokeid)
        .then(e => renderPokemon(e, playerContainer, "Player"));

        //Actualiza el listado de pokemon del jugador
        saveToLS(playerPokemons, "Player");

        await fetchPokemon(randomNumber)
        .then(e => renderPokemon(e, machineContainer, "Computer"))

        //Actualiza el listado de pokemon de la pc en el LS
        saveToLS(computerPokemons, "Computer")
    }

    compareStats()

    roundOver()

}

//Resetea toda la info 
const resetData = () => {
    playerPokemons = []
    computerPokemons = []
    resultados = []
    playerPoints = []
    computerPoints = []

    saveToLS(playerPokemons, "Player")
    saveToLS(computerPokemons, "Computer")
    saveToLS(resultados, "Results");
    saveToLS(playerPoints, "Player Points");
    saveToLS(computerPoints, "Computer Points");

    renderResultados(resultados);;
    renderPoints(playerPoints, "Player");
    renderPoints(computerPoints, "Computer");
    resetCards();
    showError("");
}

const init = () => {
    renderResultados(resultados);
    renderPoints(playerPoints, "Player")
    renderPoints(computerPoints, "Computer")
    btnFight.addEventListener("click", startFight);
    btnReset.addEventListener("click", resetData);
};

init();
