//Validaciones
const showError = (message) => {
    errorMsg.classList.remove("hidden");
    errorMsg.textContent= message;
}

//Revisa si el input del usuario está vacío o si el pokemon traido es mayor a 899 (porque no tienen foto esos)
const isEmpty = (pokeNumber) => {
    let valid = true;

    if (!pokeNumber) {
        showError("It's too dangerous to go into the high grass without any Pokemon. Please select a number between 1 and 898 to continue.")
    } else if (pokeNumber >= 899 || pokeNumber <= 0 ) {
        showError(`There is no pokemon with the number ${pokeNumber}. Please enter a number between 1 and 898.`)
    } else {
        errorMsg.classList.add("hidden")
        valid = false;
    }
    return valid
}

//Revisa si el pokemon elegido está duplicado
const isDuplicated = (listaPokes, numPoke) => {
    valid = false;
        if (listaPokes.some((element) => element.id == numPoke)) {
            console.log("ok")
            return valid = true
        }
    return valid;
}

//Revisa si alguien ya llegó a los 6 puntos, y evita que se pueda volver a jguar
const scoreSix = () => {
    valid = false;
    if (Number(playerScore.textContent) >= 6 && Number(computerScore.textContent) >= 6) {
        return valid = true;
    }

    console.log(valid)
    return valid;
}

//Revisa si alguien ganó la ronda, en ese caso muestra un alert y reinicia todo
const roundOver = () => {

    if (Number(playerScore.textContent) != 6 && Number(computerScore.textContent) != 6) {
        return
    } else if (Number(playerScore.textContent) == 6) {

        const message = "Congratulations! You have won. Now you only need to win with the remaining Pokemons and you'll earn an incredible prize :). PS: It's only making the dev happy. Do you want to reset the data?"

        confirmReset(message);

    } else {

        const message = "Better luck next time! You may not have won this round, but you gained the dev's heart by playing the game <3. Keep trying until you win!. Do you want to reset the data?"

        confirmReset(message);
    }   
}

//Confirma si el usuario quiere reiniciar los datos o preferie hacerlo luego
const confirmReset = (message) => {
    if (confirm(message)) {
        resetData();
        return;
      } else {
        return;
      }
}

const resetCards = () => {
    playerContainer.innerHTML = `
        <h2>Player Selection</h2>
        <h3># - Pokemon</h3>
          <img
            src="https://static.thenounproject.com/png/774651-200.png"
            class="pokeImg"
            alt="PokeImg"
          />
        <div class="statsContainer">
            <div class="substats">
                <p class="hp">HP: ???</p>
                <p class="attack">Attack: ???</p>
                <p class="defense">Defense: ???</p>
                <p class="height">Height: ??? cm.</p>
        </div>
        <div class="substats">
            <p class="spDefense">Sp. Defense: ???</p>
            <p class="spAttack">Sp. Attack: ???</p>
            <p class="speed">Speed: ???</p>
            <p class="weight">Weight: ??? kg.</p>
        </div>
    `;

    machineContainer.innerHTML = `
        <h2>Computer Selection</h2>
        <h3># - Pokemon</h3>
        <img
        src="https://static.thenounproject.com/png/1164524-200.png"
        class="pokeImg"
        alt="PokeImg"
        />
        <div class="statsContainer">
            <div class="substats">
                <p class="hp">HP: ???</p>
                <p class="attack">Attack: ???</p>
                <p class="defense">Defense: ???</p>
                <p class="height">Height: ??? cm.</p>
            </div>
            <div class="substats">
                <p class="spDefense">Sp. Defense: ???</p>
                <p class="spAttack">Sp. Attack: ???</p>
                <p class="speed">Speed: ???</p>
                <p class="weight">Weight: ??? kg.</p>
            </div>
        </div>
    `
}

//Guardar al LS el Pokemon del Jugador y el de la PC
const saveToLS = (listaCosas, name) => {
    if (name === "Player") {
        localStorage.setItem("PokesPlayer", JSON.stringify(listaCosas))
        return;
    } else if (name === "Computer") {
        localStorage.setItem("PokesComputer", JSON.stringify(listaCosas))
        return;
    } else if (name === "Results") {
        localStorage.setItem("Results", JSON.stringify(listaCosas))
    } else if (name === "Player Points") {
        localStorage.setItem("Player Points", JSON.stringify(listaCosas))
    } else if ("Computer Points") {
        localStorage.setItem("Computer Points", JSON.stringify(listaCosas))
    }
}

const styleStat = () => {
    
    const stat = statChosen.value;
    const elements = document.querySelectorAll(`.${stat}`);
    const statArray = [...elements]

    statArray.map( (arr) => {
        arr.classList.add("selectedStat")
    })
}

//Calcula un número entero aleatorio
const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
} 

//Renombra la stat en base a un nombre mas userfriendly
const renameStat = (statOriginal) => {
    switch (statOriginal) {
        case "spAttack":
            statOriginal = "special attack"
            break;
    
        case "spDefense":
            statOriginal = "special defense"
            break;

        default:
            break;
    }

    return statOriginal.toUpperCase()
}

//Calcula las estadísticas del Pokemon, va a tener una parte random simulando los IVs y EVs (no conozco el calculo, así que lo hago aproximado) - Uso el keleven, famoso por The Office (número mágico).
const calcMaxStat = (statName, statValue) => {
    
    let maxStat = Number(statValue)
    let keleven = randomInteger(25, 51)

    switch (statName) {
        case "hp":
            maxStat = maxStat * 2 + 140 + keleven
            break;

        case "attack":
            maxStat = maxStat * 2 + 40 + keleven
            break;

        case "defense":
            maxStat = maxStat * 2 + 40 + keleven
            break;

        case "special-attack":
            maxStat = maxStat * 2 + 40 + keleven
            break;

        case "special-defense":
            maxStat = maxStat * 2 + 40 + keleven
            break;

        case "speed":
            maxStat = maxStat * 2 + 40 + keleven
            break;
        //en caso de que algo salga mal, que no haga nada
        default:
            break;
    }

    return maxStat
}

// Recorre los tipos del pokemon, y los agrega en un <p> para poder renderizarlos por separado
const renderTypes = (typesArray) => {

    const newTypesArray = typesArray.map(typeArr => {
        return `<p class="${typeArr.type.name} typeLine">${typeArr.type.name.toUpperCase()}</p>`
    }).join("");

    return newTypesArray;
}

// Muestro los resultados que ya estaban cargados en la página
const renderResultados = (listaRdos) => {
    if (listaRdos.length === 0) {
        noMatches.textContent = "Please start a fight and see the results history here.";
        noMatches.classList.remove("hidden");
        matchHistory.classList.add("hidden")
        return matchHistory.innerHTML = "";
    } else {
        noMatches.textContent = "Matches played so far:"
        matchHistory.classList.remove("hidden")
        return matchHistory.innerHTML = listaRdos.join("");
    }
}

// Muestro los puntos acumulados para cada uno
const renderPoints = (listPoints, title) => {
    if (title === "Player") {
        playerScore.textContent = Number(listPoints);
    } else if (title === "Computer") {
        computerScore.textContent = Number(listPoints); 
    }
}

//Agrega el pokemon elegido al array del jugador o la PC, para poder hacer la comparación y para que no se pueda repetir luego.
const pushPoke = (fullData, title) => {
    if (title === "Player") {
        playerPokemons.push(fullData)
        return ;
    } else if (title === "Computer") {
        computerPokemons.push(fullData);
        return;
    } else if (title === "Results") {
        resultados.push(fullData)
    }
}

// Compara las estadísticas de los Pokemon, viendo quien va ganando y actualiza el marcador en base a eso
const compareStats = () => {

    counter = playerPokemons.length - 1

    let stat = statChosen.value;
    const playerPoke = playerPokemons[`${counter}`];
    const computerPoke = computerPokemons[`${counter}`];

    //Hace la comparación, y en base a eso agrega un LI que muestra quien ganó, y en qué categoría.
    if (playerPoke[`${stat}`] >= computerPoke[`${stat}`]) {
        const points = playerScore.textContent = Number(playerScore.textContent) + 1;

        saveToLS(points, "Player Points");

        const cardRdo = matchHistory.innerHTML = `
        <li class="win"> ${counter + 1} - 
            PLAYER WINS: 
                <span class="underline"> #${playerPoke.id} - ${playerPoke.name.toUpperCase() + " "}
                </span> 
            beats 
                <span class="underline">#${computerPoke.id} - ${computerPoke.name.toUpperCase() + " "}</span>
                in <span class="underline">${renameStat(stat)}</span>
        </li>`;

        pushPoke(cardRdo, "Results");
        saveToLS(resultados, "Results");

    } else {
        const points = computerScore.textContent = Number(computerScore.textContent) + 1;

        saveToLS(points, "Computer Points");

        const cardRdo = matchHistory.innerHTML = `
        <li class="lose"> ${counter + 1} - 
            COMPUTER WINS: 
                <span class="underline"> #${computerPoke.id} - ${computerPoke.name.toUpperCase() + " "}</span> 
            beat 
                <span class="underline">#${playerPoke.id} - ${playerPoke.name.toUpperCase() + " "}</span> in <span class="underline">${renameStat(stat)}</span>
        </li>`;

        pushPoke(cardRdo, "Results")
        saveToLS(resultados, "Results");
    }

    //Actualiza la visión con las líneas nuevas del historial
    renderResultados(resultados);

}