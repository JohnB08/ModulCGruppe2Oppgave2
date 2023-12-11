const fetchApi = async (url) => {
  const response = await fetch(url, {
    accept: "application/json",
  });
  const result = await response.json();
  return result;
};
const apiIndex = "https://www.dnd5eapi.co/api";

const indexExample = await fetchApi(apiIndex);

const selectedClassUrl = "https://www.dnd5eapi.co/api/classes/barbarian";

const classExample = await fetchApi(selectedClassUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

const monsterExample = await fetchApi(monsterUrl);
console.log(indexExample);
console.log(classExample);
console.log(monsterExample);

/*
 *Alle funksjoner skal ta inn eksempelobject som parameter.
 *kodestruktur: fetchMonsters(monsterExample)
 */
