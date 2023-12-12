const fetchApi = async (url) => {
  const response = await fetch(url, {
    accept: "application/json",
  });
  const result = await response.json();
  return result;
};

/* Dette er apiurlen vi legger alle andre url til inni objektet. */
const apiURL = "https://www.dnd5eapi.co";

const apiIndex = "https://www.dnd5eapi.co/api";

const indexExample = await fetchApi(apiIndex);

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

const monsterExample = await fetchApi(monsterUrl);

const cardImgContainer = document.querySelector(".card-img");

const cardTextContainer = document.querySelector(".monster-stats")

console.log(indexExample);
console.log(allMonstersExample);
console.log(monsterExample);

/*
 *Alle funksjoner skal ta inn ett av eksemplene som parameter.
 *kodestruktur: const fetchMonsters = (monsterExample) => {}
 */
const cardImage = document.createElement("img");
cardImage.src = apiURL + monsterExample.image;
cardImage.setAttribute("width", "400")
cardImage.setAttribute("height", "300")
cardImgContainer.appendChild(cardImage)
 

 console.log(apiURL + monsterExample.image);