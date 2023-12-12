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

console.log(indexExample);
console.log(allMonstersExample);
console.log(monsterExample);

/*
 *Alle funksjoner skal ta inn ett av eksemplene som parameter.
 *Dette gjøres ved å si først til funksjonen din når du lager den, at du vil ha et parameter
 *kodestruktur: const fetchMonsters = (parameterObject) => {
 *Så bruker du parameteret inni funksjonen
 *   console.log(parameterObject)
 *
 * }
 *
 * Når du caller på (kjører) funksjonen senere, så legger du eksempelobjektet inn i funksjonen.
 *
 * fetchMonsters(monsterExample)
 *
 *Da vil funksjonen erstatte parameterObject med monsterExample i koden du har, og kjøre koden din med monsterExample.
 *
 * I eksempelet over ender du opp med at monsterExample blir consol logget.
 *
 *
 */
