// URLs needed to get data from API
const AGENTS_URL = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
const SKINS_URL = "https://bymykel.github.io/CSGO-API/api/en/skins.json";

// Arrays to store the data of agents and weapons
let agentsArray = [];

let ctWeaponsArray = [];
let tWeaponsArray = [];

let isActive = false;

// Function to send HttpRequest
function sendHttpRequest(url, callbackFunction) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open("GET", url, false);

    httpRequest.onload = () => {
        callbackFunction(httpRequest.responseText);
    }

    httpRequest.onerror = () => {
        alert("Basic Request Failed!!!");
    }

    httpRequest.send();
}

// Calling Request Function to get Agents
sendHttpRequest(AGENTS_URL, (response) => {
    agentsArray = JSON.parse(response);
});

// Calling Request Function to get Skins
sendHttpRequest(SKINS_URL, (response) => {
    allSkinsArray = JSON.parse(response);

    for(let i=0; i<allSkinsArray.length; i++) {
        if(allSkinsArray[i].weapon !== null) {
            if(allSkinsArray[i].pattern !== null) {
                if(allSkinsArray[i].category !== null) {
                    if(allSkinsArray[i].team !== null) {
                        if(allSkinsArray[i].image !== null) {
                            var min;
                            var max;

                            let weapon = {
                                name: allSkinsArray[i].weapon.name,
                                skin: allSkinsArray[i].pattern.name,
                                category: allSkinsArray[i].category.name,
                                team: allSkinsArray[i].team.id,
                                imgURL: allSkinsArray[i].image
                            };

                            if(weapon.category === "Pistols") {
                                let randomPrice = assignPrice(200, 700);
                                weapon.price = randomPrice;
                            } else if(weapon.category === "SMGs") {
                                let randomPrice = assignPrice(1000, 1500);
                                weapon.price = randomPrice;
                            } else if(weapon.category === "Rifles") {
                                let randomPrice = assignPrice(1500, 3500);
                                weapon.price = randomPrice;
                            } else if(weapon.category === "Heavy") {
                                let randomPrice = assignPrice(2500, 4500);
                                weapon.price = randomPrice;
                            } else if(weapon.category === "Knives") {
                                let randomPrice = assignPrice(100, 500);
                                weapon.price = randomPrice;
                            } else if(weapon.category === "Gloves") {
                                let randomPrice = assignPrice(100, 500);
                                weapon.price = randomPrice;
                            }

                            if(allSkinsArray[i].team.id === "both") {
                                ctWeaponsArray.push(weapon);
                                tWeaponsArray.push(weapon);
                            } else if(allSkinsArray[i].team.id === "counter-terrorists") {
                                ctWeaponsArray.push(weapon);
                            } else if(allSkinsArray[i].team.id === "terrorists") {
                                tWeaponsArray.push(weapon);
                            }
                        } else {
                            continue;
                        }
                    }
                }
            }
        }
    }

    console.log(ctWeaponsArray);
    console.log(tWeaponsArray);
});

// Function to assign random Price
function assignPrice(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 50) * 50;
}

// Function to assign Counter-Terrorist as Team
function assignCounterTerrorist() {
    let selectedTeam = "Counter-Terrorist";

    localStorage.setItem('selectedTeam', selectedTeam);

    window.location.href = 'agent-select.html';
}

// Function to assign Terrorist as Team
function assignTerrorist() {
    let selectedTeam = "Terrorist";

    localStorage.setItem('selectedTeam', selectedTeam);

    window.location.href = 'agent-select.html';
}

// Function to randomly assign team
function assignRandomTeam() {
    let randomNumber = Math.random();

    let roundedRandomNumber = Math.round(randomNumber) + 1;

    if(roundedRandomNumber == 1) {
        assignCounterTerrorist();
    } else if(roundedRandomNumber == 2) {
        assignTerrorist();
    } else {
        console("Error!");
    }
}

// Function to display heading on Agents Page based on selection
function displayAllAgents() {
    let selectedTeam = localStorage.getItem('selectedTeam');

    let headerText = document.getElementById("headerText");
    headerText.innerText = selectedTeam;

    // Display all agents from the selected team
    let agentsContainer = document.getElementById("agentsContainer");

    // Just for Reference
    // Number of Counter-Terrorists => 29
    // Number of Terrorist => 34

    for(let i=0; i<agentsArray.length; i++) {
        if(agentsArray[i].team.name === selectedTeam) {
            let tileAgentImg = document.createElement("img");
            tileAgentImg.src = agentsArray[i].image;

            let tileAgentName = document.createElement("p");
            tileAgentName.classList.add("agent-name");
            tileAgentName.innerText = agentsArray[i].name;

            let agentTile = document.createElement("div");
            agentTile.classList.add("agent-tile");

            agentTile.appendChild(tileAgentImg);
            agentTile.appendChild(tileAgentName);

            agentsContainer.appendChild(agentTile);
        }
    }

    let allAgents = document.querySelectorAll(".agent-tile");

    for(let i=0; i<allAgents.length; i++) {
        allAgents[i].addEventListener("click", function() {
            if(allAgents[i].classList.contains("active")) {
                allAgents[i].classList.remove("active");
                isActive = false;
            } else if(isActive == false) {
                for(let j=0; j<allAgents.length; j++) {
                    allAgents[j].classList.remove("active");
                }
                allAgents[i].classList.add("active");
                isActive = true;
                let selectedAgent = allAgents[i].innerText;
                localStorage.setItem('selectedAgent', selectedAgent);
            } else if(isActive == true) {
                for (let j=0; j<allAgents.length; j++) {
                    allAgents[j].classList.remove("active");
                }
                allAgents[i].classList.add("active");
                let selectedAgent = allAgents[i].innerText;
                localStorage.setItem('selectedAgent', selectedAgent);
            }
        });
    }
}

// Function to select Agent and set Name of User
function setAgentAndName() {
    let username = document.getElementById("userName").value;
    let noOfWords = username.trim().split(/\s+/);
    let flagAgent = 0;
    let flagName = 0;

    if(isActive == false) {
        alert("Please select an agent to continue!");
        flagAgent = 0;
    } else {
        flagAgent = 1;
    }

    if(username === "") {
        alert("Name cannot be empty!");
        flagName = 0;
    } else if(username.length > 20) {
        alert("Name cannot exceed 20 characters!");
        flagName = 0;
    } else if(noOfWords.length > 2) {
        alert("Name cannot be more than 2 words!");
        flagName = 0;
    } else {
        localStorage.setItem('userName', username);
        flagName = 1;
    }

    if(flagAgent == 1 && flagName == 1) {
        window.location.href = 'weapon-select.html';
    }
}

// Function to Load all Skins and allow Selection
function displayAllWeapons() {
    let selectedTeam = localStorage.getItem('selectedTeam');

    let totalMoney = 9000;
}