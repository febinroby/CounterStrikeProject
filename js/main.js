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

let isAgentActive = false;
let isCategoryActive = false;
let isTypeActive = false;
let isWeaponActive = false;

let activeCategory;
let activeType;
let activeWeapon;

let sWeaponsArr = [];

let totalMoneySpent = 0;
let balance = 9000;

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

            let weaponId = document.createElement("span");
            weaponId.innerText = selectedTeamArray[i].id;

            let weaponTile = document.createElement("div");
            weaponTile.classList.add("weapon-tile");

            weaponTile.appendChild(weaponImg);
            weaponTile.appendChild(weaponName);
            weaponTile.appendChild(weaponPrice);
            weaponTile.appendChild(weaponId);

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
                activeWeapon = document.querySelector(".active-weapon span").innerHTML;
                saveWeapon(selectedTeamArray, activeWeapon);
            } else if(isWeaponActive == true) {
                for (let j=0; j<allWeapons.length; j++) {
                    allWeapons[j].classList.remove("active-weapon");
                }
                allWeapons[i].classList.add("active-weapon");
                activeWeapon = document.querySelector(".active-weapon span").innerHTML;
                saveWeapon(selectedTeamArray, activeWeapon);
            }
        });
    }
}

// Function to save weapon
let moneyText = document.getElementById("moneyText");
if(moneyText) {
    moneyText.innerText = "BALANCE: $" + balance;
}

function saveWeapon(selectedTeamArray, activeWeapon) {
    let weapon;
    totalMoneySpent = 0;

    for(let i=0; i<selectedTeamArray.length; i++) {
        if(selectedTeamArray[i].id === activeWeapon) {
            weapon = selectedTeamArray[i];
        }
    }

    if(weapon.category === "Pistols") {
        if(sWeaponsArr[0] === undefined) {
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[0] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        } else {
            balance = balance + sWeaponsArr[0].price;
            totalMoneySpent = totalMoneySpent - sWeaponsArr[0].price;
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[0] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        }
    } else if(weapon.category === "SMGs") {
        if(sWeaponsArr[1] === undefined) {
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[1] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        } else {
            balance = balance + sWeaponsArr[1].price;
            totalMoneySpent = totalMoneySpent - sWeaponsArr[1].price;
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[1] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        }
    } else if(weapon.category === "Rifles") {
        if(sWeaponsArr[2] === undefined) {
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[2] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        } else {
            balance = balance + sWeaponsArr[2].price;
            totalMoneySpent = totalMoneySpent - sWeaponsArr[2].price;
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[2] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        }
    } else if(weapon.category === "Heavy") {
        if(sWeaponsArr[3] === undefined) {
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[3] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        } else {
            balance = balance + sWeaponsArr[3].price;
            totalMoneySpent = totalMoneySpent - sWeaponsArr[3].price;
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[3] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        }
    } else if(weapon.category === "Knives") {
        if(sWeaponsArr[4] === undefined) {
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[4] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        } else {
            balance = balance + sWeaponsArr[4].price;
            totalMoneySpent = totalMoneySpent - sWeaponsArr[4].price;
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[4] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        }
    } else if(weapon.category === "Gloves") {
        if(sWeaponsArr[5] === undefined) {
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[5] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        } else {
            balance = balance + sWeaponsArr[5].price;
            totalMoneySpent = totalMoneySpent - sWeaponsArr[5].price;
            balance = balance - weapon.price;
            totalMoneySpent = totalMoneySpent + weapon.price;
            sWeaponsArr[5] = weapon;
            moneyText.innerText = "BALANCE: $" + balance;
        }
    } else {
        console.log("Weapon Category Not Found");
    }
}

// Function to show current loadout
function showCurrentLoadout() {
    let weaponsContainer = document.getElementById("weaponsContainer");
    let weaponTypesContainer = document.getElementById("weaponTypesContainer");

    moneyText.innerText = "You have spent $" + totalMoneySpent + ". You have $" + (balance) + " left.";

    let allCategories = document.querySelectorAll(".weapon-category-tile");

    let allTypes = document.querySelectorAll(".weapon-type-tile");

    for(let i=0; i<allCategories.length; i++) {
        if(allCategories[i].classList.contains("active-category")) {
            allCategories[i].classList.remove("active-category");
        }
    }

    for(let i=0; i<allTypes.length; i++) {
            if(allTypes[i].classList.contains("active-type")) {
                allTypes[i].classList.remove("active-type");
            }
    }

    weaponsContainer.innerHTML = "";
    weaponTypesContainer.innerHTML = "";
    moneyContainer.innerHTML = "";

    for(let i=0; i<sWeaponsArr.length; i++) {
        if(sWeaponsArr[i] === undefined) {
            continue;
        } else {
            let weaponImg = document.createElement("img");
            weaponImg.src = sWeaponsArr[i].imgURL;

            let weaponName = document.createElement("h3");
            weaponName.innerText = sWeaponsArr[i].skin;

            let weaponPrice = document.createElement("p");
            weaponPrice.innerText = "$ " + sWeaponsArr[i].price;

            let weaponId = document.createElement("span");
            weaponId.innerText = sWeaponsArr[i].id;

            let weaponTile = document.createElement("div");
            weaponTile.classList.add("weapon-tile");

            weaponTile.appendChild(weaponImg);
            weaponTile.appendChild(weaponName);
            weaponTile.appendChild(weaponPrice);
            weaponTile.appendChild(weaponId);

            weaponsContainer.appendChild(weaponTile);
        }
    }
}

// function to check weapons & money and go to team name select page
function goToTeamName() {
    if(sWeaponsArr.includes(null) || sWeaponsArr.length<5) {
        alert('Please make sure you select one gun from each category!');
    } else if(balance < 0) {
        alert('Please select a different loadout and stay within the limit of $9000!');
    } else {
        localStorage.setItem('selectedWeaponArray', JSON.stringify(sWeaponsArr));
        showCurrentLoadout();
        setTimeout(function() {
            window.location.href = 'team-name-select.html';
        }, 3000);
    }
}

// Function to show All Details
function showSelectedDetails() {
    let userName = localStorage.getItem('userName');
    console.log(userName);
    let selectedTeam = localStorage.getItem('selectedTeam');
    console.log(selectedTeam);
    let selectedAgent;
    let temp = localStorage.getItem('selectedAgent');
    for(let i=0; i<agentsArray.length; i++) {
        if(agentsArray[i].name === temp) {
            selectedAgent = agentsArray[i];
        }
    }
    console.log(selectedAgent);
    let selectedWeaponsArray = JSON.parse(localStorage.getItem('selectedWeaponArray'));
    console.log(selectedWeaponsArray);

    let userNameText = document.getElementById("userNameText");
    userNameText.innerText = userName;

    let agentImg = document.getElementById("agentImg");
    agentImg.src = selectedAgent.image;

    let agentName = document.getElementById("agentName");
    agentName.innerText = selectedAgent.name;

    let agentTeam = document.getElementById("agentTeam");
    agentTeam.innerText = selectedAgent.team.name;

    let weaponContainers = document.querySelectorAll(".weapon-container");
    console.log(weaponContainers);

    displayDetailsContainer.style.visibility = "hidden";

    for(let i=0; i<weaponContainers.length; i++) {
        for(let j=0; j<selectedWeaponsArray.length; j++) {
            if(weaponContainers[i].id === selectedWeaponsArray[j].category) {
                let thisWeaponContainer = document.getElementById(weaponContainers[i].id);

                let weaponImg = document.createElement("img");
                weaponImg.src = selectedWeaponsArray[i].imgURL;

                thisWeaponContainer.appendChild(weaponImg);

                let displayDetailsContainer = document.getElementById("displayDetailsContainer");

                let weaponName = document.getElementById("weaponName");
                let weaponSkin = document.getElementById("weaponSkin");
                let weaponCategory = document.getElementById("weaponCategory");
                let weaponPrice = document.getElementById("weaponPrice");

                thisWeaponContainer.addEventListener("mouseover", function() {
                    displayDetailsContainer.style.visibility = "visible";
                    displayDetailsContainer.style.backgroundColor = "rgba(255, 255, 255, .15)";
                    displayDetailsContainer.style.backdropFilter = "blur(5px)";
                    displayDetailsContainer.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";

                    weaponName.innerText = selectedWeaponsArray[j].name;
                    weaponSkin.innerText = selectedWeaponsArray[j].skin;
                    weaponCategory.innerText = selectedWeaponsArray[j].category;
                    weaponPrice.innerText = selectedWeaponsArray[j].price;
                });

                thisWeaponContainer.addEventListener("mouseout", function() {
                    displayDetailsContainer.style.visibility = "hidden";
                    displayDetailsContainer.style.backgroundColor = "none";
                    displayDetailsContainer.style.backdropFilter = "none";

                    weaponName.innerText = "";
                    weaponSkin.innerText = "";
                    weaponCategory.innerText = "";
                    weaponPrice.innerText = "";
                })
            } else {
                continue;
            }
        }
    }
}

// Function to set team name and move to next page
function setTeamName() {
    let teamName = document.getElementById("teamName").value;

    if (teamName.split(' ').length > 1) {
        alert("Team name should be a single word.");
        return;
    }
    if (teamName.length >= 15) {
        alert("Team name should be less than 15 characters.");
        return;
    }
    if (!/^[a-zA-Z]+$/.test(teamName)) {
        alert("Team name should contain only alphabetical characters.");
        return;
    }

    localStorage.setItem('teamName', teamName);
    window.location.href = 'final-screen.html';
}

// Function to set own team and random team
function setTeamAndOpp() {
    let selectedTeam = localStorage.getItem('selectedTeam');
    let selectedAgent = localStorage.getItem('selectedAgent');
    let selectedWeaponArray = JSON.parse(localStorage.getItem('selectedWeaponArray'));
    let oppositeTeam;

    let homeAgentsArray = [];
    let awayAgentsArray = [];

    let homeWeaponsArray = [];
    let awayWeaponsArray = [];

    if(selectedTeam === "Counter-Terrorist") {
        oppositeTeam = "Terrorist";

        for(let i=0; i<agentsArray.length; i++) {
            if(agentsArray[i].team.name === selectedTeam) {
                homeAgentsArray.push(agentsArray[i]);
            } else {
                awayAgentsArray.push(agentsArray[i]);
            }
        }

        homeWeaponsArray = ctWeaponsArray;
        awayWeaponsArray = tWeaponsArray;
    } else {
        oppositeTeam = "Counter-Terrorist";

        for(let i=0; i<agentsArray.length; i++) {
            if(agentsArray[i].team.name === selectedTeam) {
                homeAgentsArray.push(agentsArray[i]);
            } else {
                awayAgentsArray.push(agentsArray[i]);
            }
        }

        homeWeaponsArray = tWeaponsArray;
        awayWeaponsArray = ctWeaponsArray;
    }

    let teammates = getRandomTeammates(homeAgentsArray, selectedAgent);
    let opponents = getRandomOpponents(awayAgentsArray);

    let homeTeamArray = [];
    let awayTeamArray = [];

    for(let i=0; i<teammates.length; i++) {
        let characterObj = {
            agent: teammates[i],
            loadout: getRandomLoadout(homeWeaponsArray)
        };

        homeTeamArray.push(characterObj);
    }

    for(let i=0; i<agentsArray.length; i++) {
        if(agentsArray[i].name === selectedAgent) {
            let characterObj = {
                agent: agentsArray[i],
                loadout: selectedWeaponArray
            };
            homeTeamArray.push(characterObj);
        }
    }

    for(let i=0; i<opponents.length; i++) {
        let characterObj = {
            agent: opponents[i],
            loadout: getRandomLoadout(awayWeaponsArray)
        };

        awayTeamArray.push(characterObj);
    }

    console.log(homeTeamArray);
    console.log(awayTeamArray);
}

// Function to get random team
function getRandomTeammates(array, agent) {
    let prevIndex;
    let count = 0;
    let teammatesArray = [];
    for(let i=0; i<array.length; i++) {
        const randomIndex = Math.floor(Math.random() * (array.length));
        if(count === 3) {
            break;
        } else if(array[i].name === agent) {
            continue;
        } else if(prevIndex === randomIndex) {
            continue;
        } else {
            prevIndex = randomIndex;
            count++;
            teammatesArray.push(array[randomIndex]);
        }
    }

    return teammatesArray;  
}

// Function to get random opponents
function getRandomOpponents(array) {
    let prevIndex;
    let count = 0;
    let opponentsArray = [];
    for(let i=0; i<array.length; i++) {
        const randomIndex = Math.floor(Math.random() * (array.length));
        if(count === 4) {
            break;
        } else if(prevIndex === randomIndex) {
            continue;
        } else {
            prevIndex = randomIndex;
            count++;
            opponentsArray.push(array[randomIndex]);
        }
    }

    return opponentsArray;
}

// Function to get random gun
function getRandomLoadout(array) {
    allPistols = [];
    allRifles = [];
    allHeavy = [];
    allSMGs = [];
    allKnives = [];
    allGloves = [];

    for(let i=0; i<array.length; i++) {
        if(array[i].category === "Pistols") {
            allPistols.push(array[i]);
        } else if(array[i].category === "Rifles") {
            allRifles.push(array[i]);
        } else if(array[i].category === "Heavy") {
            allHeavy.push(array[i]);
        } else if(array[i].category === "SMGs") {
            allSMGs.push(array[i]);
        } else if(array[i].category === "Knives") {
            allKnives.push(array[i]);
        } else if(array[i].category === "Gloves") {
            allGloves.push(array[i]);
        } else {
            continue;
        }
    }

    let loadout = [
        allPistols[Math.floor(Math.random() * (allPistols.length))], 
        allSMGs[Math.floor(Math.random() * (allSMGs.length))], 
        allRifles[Math.floor(Math.random() * (allRifles.length))], 
        allHeavy[Math.floor(Math.random() * (allHeavy.length))], 
        allKnives[Math.floor(Math.random() * (allKnives.length))], 
        allGloves[Math.floor(Math.random() * (allGloves.length))]
    ];

    return loadout;
}