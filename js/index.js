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

const selectedClassUrl = "https://www.dnd5eapi.co/api/monsters";

const classExample = await fetchApi(selectedClassUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

const monsterExample = await fetchApi(monsterUrl);

console.log(indexExample);
console.log(classExample);
console.log(monsterExample);

/*
 *Alle funksjoner skal ta inn ett av eksemplene som parameter.
 *kodestruktur: fetchMonsters(monsterExample)
 */
