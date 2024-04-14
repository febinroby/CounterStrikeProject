// URLs needed to get data from API
const AGENTS_URL = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
const SKINS_URL = "https://bymykel.github.io/CSGO-API/api/en/skins.json";

// Arrays to store the data of agents and weapons
let agentsArray = [];

let ctWeaponsArray = [];
let tWeaponsArray = [];

let allWeaponCategories = [];

let allPistolTypes = [];
let allSmgTypes = [];
let allRifleTypes = [];
let allHeavyTypes = [];
let allKnifeTypes = [];
let allGloveTypes = [];

let allPistols = [];
let allSMGs = [];
let allRifles = [];
let allHeavy = [];
let allKnives = [];
let allGloves = [];

let selectedTeamArray = [];

let selectedPistol;
let selectedSMG;
let selectedRifle;
let selectedHeavy;
let selectedKnife;
let selectedGlove;

let selectedWeaponsArray = [];

let isAgentActive = false;
let isCategoryActive = false;
let isTypeActive = false;
let isWeaponActive = false;

let activeCategory;
let activeType;
let activeWeapon;

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
                                id: allSkinsArray[i].id,
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
                isAgentActive = false;
            } else if(isAgentActive == false) {
                for(let j=0; j<allAgents.length; j++) {
                    allAgents[j].classList.remove("active");
                }
                allAgents[i].classList.add("active");
                isAgentActive = true;
                let selectedAgent = allAgents[i].innerText;
                localStorage.setItem('selectedAgent', selectedAgent);
            } else if(isAgentActive == true) {
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

    if(isAgentActive == false) {
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
function loadAllWeapons() {
    let selectedTeam = localStorage.getItem('selectedTeam');
    let totalMoneyAvailable = 9000;

    if(selectedTeam === "Counter-Terrorist") {
        selectedTeamArray = ctWeaponsArray;
        setReqWeaponVariables(selectedTeamArray);
        displayCategories(selectedTeamArray);
    } else if(selectedTeam === "Terrorist") {
        selectedTeamArray = tWeaponsArray;
        setReqWeaponVariables(selectedTeamArray);
        displayCategories(selectedTeamArray);
    }
}

// Function to set required variable
function setReqWeaponVariables(selectedTeamArray) {
    for(let i=0; i<selectedTeamArray.length; i++) {
        allWeaponCategories.push(selectedTeamArray[i].category);
    }
    allWeaponCategories = [... new Set(allWeaponCategories)];
    allWeaponCategories = removeNullValues(allWeaponCategories);

    for(let i=0; i<selectedTeamArray.length; i++) {
        if(selectedTeamArray[i].category === "Pistols") {
            allPistols.push(selectedTeamArray[i]);
        } else if(selectedTeamArray[i].category === "Rifles") {
            allRifles.push(selectedTeamArray[i]);
        } else if(selectedTeamArray[i].category === "Heavy") {
            allHeavy.push(selectedTeamArray[i]);
        } else if(selectedTeamArray[i].category === "SMGs") {
            allSMGs.push(selectedTeamArray[i]);
        } else if(selectedTeamArray[i].category === "Knives") {
            allKnives.push(selectedTeamArray[i]);
        } else if(selectedTeamArray[i].category === "Gloves") {
            allGloves.push(selectedTeamArray[i]);
        } else {
            continue;
        }
    }

    for(let i=0; i<allPistols.length; i++) {
        allPistolTypes.push(allPistols[i].name);
    }
    allPistolTypes = [... new Set(allPistolTypes)];
    allPistolTypes = removeNullValues(allPistolTypes);

    for(let i=0; i<allSMGs.length; i++) {
        allSmgTypes.push(allSMGs[i].name);
    }
    allSmgTypes = [... new Set(allSmgTypes)];
    allSmgTypes = removeNullValues(allSmgTypes);

    for(let i=0; i<allRifles.length; i++) {
        allRifleTypes.push(allRifles[i].name);
    }
    allRifleTypes = [... new Set(allRifleTypes)];
    allRifleTypes = removeNullValues(allRifleTypes);

    for(let i=0; i<allHeavy.length; i++) {
        allHeavyTypes.push(allHeavy[i].name);
    }
    allHeavyTypes = [... new Set(allHeavyTypes)];
    allHeavyTypes = removeNullValues(allHeavyTypes);

    for(let i=0; i<allKnives.length; i++) {
        allKnifeTypes.push(allKnives[i].name);
    }
    allKnifeTypes = [... new Set(allKnifeTypes)];
    allKnifeTypes = removeNullValues(allKnifeTypes);

    for(let i=0; i<allGloves.length; i++) {
        allGloveTypes.push(allGloves[i].name);
    }
    allGloveTypes = [... new Set(allGloveTypes)];
    allGloveTypes = removeNullValues(allGloveTypes);
}

// Function to remove null values from an array
function removeNullValues(ogArray) {
    for(let i=0; i<ogArray.length; i++) {
        if(ogArray[i] === null) {
            ogArray.splice(i, 1);
        }
    }

    return ogArray;
}

// Function to display weapon categories
function displayCategories(selectedTeamArray) {
    let weaponCategoriesContainer = document.getElementById("weaponCategoriesContainer");

    for(let i=0; i<allWeaponCategories.length; i++) {
        let weaponCategoryName = document.createElement("p");
        weaponCategoryName.innerText = allWeaponCategories[i];

        let weaponCategoryTile = document.createElement("div");
        weaponCategoryTile.classList.add("weapon-category-tile");

        weaponCategoryTile.appendChild(weaponCategoryName);
        weaponCategoriesContainer.appendChild(weaponCategoryTile);
    }

    let allCategories = document.querySelectorAll(".weapon-category-tile");

    for(let i=0; i<allCategories.length; i++) {
        allCategories[i].addEventListener("click", function() {
            if(allCategories[i].classList.contains("active-category")) {
                allCategories[i].classList.remove("active-category");
                isCategoryActive = false;
            } else if(isCategoryActive == false) {
                for(let j=0; j<allCategories.length; j++) {
                    allCategories[j].classList.remove("active-category");
                }
                allCategories[i].classList.add("active-category");
                isCategoryActive = true;
                activeCategory = allCategories[i].innerText;
                displayTypes(selectedTeamArray, activeCategory);
            } else if(isCategoryActive == true) {
                for (let j=0; j<allCategories.length; j++) {
                    allCategories[j].classList.remove("active-category");
                }
                allCategories[i].classList.add("active-category");
                activeCategory = allCategories[i].innerText;
                displayTypes(selectedTeamArray, activeCategory);
            }
        });
    }
}

// Function to display weapon types
function displayTypes(selectedTeamArray, activeCategory) {
    let weaponTypesContainer = document.getElementById("weaponTypesContainer");
    let weaponsContainer = document.getElementById("weaponsContainer");

    if(activeCategory === "Pistols") {
        weaponTypesContainer.innerHTML = "";
        weaponsContainer.innerHTML = "";

        for(let i=0; i<allPistolTypes.length; i++) {
            let weaponTypeName = document.createElement("p");
            weaponTypeName.innerText = allPistolTypes[i];

            let weaponTypeTile = document.createElement("div");
            weaponTypeTile.classList.add("weapon-type-tile");

            weaponTypeTile.appendChild(weaponTypeName);
            weaponTypesContainer.appendChild(weaponTypeTile);
        }
    } else if(activeCategory === "SMGs") {
        weaponTypesContainer.innerHTML = "";
        weaponsContainer.innerHTML = "";

        for(let i=0; i<allSmgTypes.length; i++) {
            let weaponTypeName = document.createElement("p");
            weaponTypeName.innerText = allSmgTypes[i];

            let weaponTypeTile = document.createElement("div");
            weaponTypeTile.classList.add("weapon-type-tile");

            weaponTypeTile.appendChild(weaponTypeName);
            weaponTypesContainer.appendChild(weaponTypeTile);
        }
    } else if(activeCategory === "Rifles") {
        weaponTypesContainer.innerHTML = "";
        weaponsContainer.innerHTML = "";

        for(let i=0; i<allRifleTypes.length; i++) {
            let weaponTypeName = document.createElement("p");
            weaponTypeName.innerText = allRifleTypes[i];

            let weaponTypeTile = document.createElement("div");
            weaponTypeTile.classList.add("weapon-type-tile");

            weaponTypeTile.appendChild(weaponTypeName);
            weaponTypesContainer.appendChild(weaponTypeTile);
        }
    } else if(activeCategory === "Heavy") {
        weaponTypesContainer.innerHTML = "";
        weaponsContainer.innerHTML = "";

        for(let i=0; i<allHeavyTypes.length; i++) {
            let weaponTypeName = document.createElement("p");
            weaponTypeName.innerText = allHeavyTypes[i];

            let weaponTypeTile = document.createElement("div");
            weaponTypeTile.classList.add("weapon-type-tile");

            weaponTypeTile.appendChild(weaponTypeName);
            weaponTypesContainer.appendChild(weaponTypeTile);
        }
    } else if(activeCategory === "Knives") {
        weaponTypesContainer.innerHTML = "";
        weaponsContainer.innerHTML = "";

        for(let i=0; i<allKnifeTypes.length; i++) {
            let weaponTypeName = document.createElement("p");
            weaponTypeName.innerText = allKnifeTypes[i];

            let weaponTypeTile = document.createElement("div");
            weaponTypeTile.classList.add("weapon-type-tile");

            weaponTypeTile.appendChild(weaponTypeName);
            weaponTypesContainer.appendChild(weaponTypeTile);
        }
    } else if(activeCategory === "Gloves") {
        weaponTypesContainer.innerHTML = "";
        weaponsContainer.innerHTML = "";

        for(let i=0; i<allGloveTypes.length; i++) {
            let weaponTypeName = document.createElement("p");
            weaponTypeName.innerText = allGloveTypes[i];

            let weaponTypeTile = document.createElement("div");
            weaponTypeTile.classList.add("weapon-type-tile");

            weaponTypeTile.appendChild(weaponTypeName);
            weaponTypesContainer.appendChild(weaponTypeTile);
        }
    }

    let allTypes = document.querySelectorAll(".weapon-type-tile");

    for(let i=0; i<allTypes.length; i++) {
        allTypes[i].addEventListener("click", function() {
            if(allTypes[i].classList.contains("active-type")) {
                allTypes[i].classList.remove("active-type");
                isTypeActive = false;
            } else if(isTypeActive == false) {
                for(let j=0; j<allTypes.length; j++) {
                    allTypes[j].classList.remove("active-type");
                }
                allTypes[i].classList.add("active-type");
                isTypeActive = true;
                activeType = allTypes[i].innerText;
                displayWeapons(selectedTeamArray, activeType);
            } else if(isTypeActive == true) {
                for (let j=0; j<allTypes.length; j++) {
                    allTypes[j].classList.remove("active-type");
                }
                allTypes[i].classList.add("active-type");
                activeType = allTypes[i].innerText;
                displayWeapons(selectedTeamArray, activeType);
            }
        });
    }
}

// Function to display weapons
function displayWeapons(selectedTeamArray, activeType) {
    let weaponsContainer = document.getElementById("weaponsContainer");

    weaponsContainer.innerHTML = "";

    for(let i=0; i<selectedTeamArray.length; i++) {
        if(selectedTeamArray[i].name === activeType) {
            let weaponImg = document.createElement("img");
            weaponImg.src = selectedTeamArray[i].imgURL;

            let weaponName = document.createElement("h3");
            weaponName.innerText = selectedTeamArray[i].skin;

            let weaponPrice = document.createElement("p");
            weaponPrice.innerText = "$ " + selectedTeamArray[i].price;

            let weaponTile = document.createElement("div");
            weaponTile.classList.add("weapon-tile");

            weaponTile.appendChild(weaponImg);
            weaponTile.appendChild(weaponName);
            weaponTile.appendChild(weaponPrice);

            weaponsContainer.appendChild(weaponTile);
        }
    }

    let allWeapons = document.querySelectorAll(".weapon-tile");

    for(let i=0; i<allWeapons.length; i++) {
        allWeapons[i].addEventListener("click", function() {
            if(allWeapons[i].classList.contains("active-weapon")) {
                allWeapons[i].classList.remove("active-weapon");
                isWeaponActive = false;
            } else if(isWeaponActive == false) {
                for(let j=0; j<allWeapons.length; j++) {
                    allWeapons[j].classList.remove("active-weapon");
                }
                allWeapons[i].classList.add("active-weapon");
                isWeaponActive = true;
                activeWeapon = document.querySelector(".active-weapon h3").innerText;
                console.log(activeWeapon);
            } else if(isWeaponActive == true) {
                for (let j=0; j<allWeapons.length; j++) {
                    allWeapons[j].classList.remove("active-weapon");
                }
                allWeapons[i].classList.add("active-weapon");
                activeWeapon = document.querySelector(".active-weapon h3").innerText;
                console.log(activeWeapon);
            }
        });
    }
}