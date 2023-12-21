const fs = require("fs");
const filePath = "../searchDatabase/searchObject.json";

const apiURL = "https://www.dnd5eapi.co";

const apiIndexUrl = "https://www.dnd5eapi.co/api";

/**
 * Funksjon som tar inn en URL og prøver å fetche et JSON objekt fra urlen.
 * @param {*} url
 * @returns
 */
const fetchApi = async (url) => {
  const response = await fetch(url, {
    //dette objektet er med fordi API må vite at vi vil ha en json fil tilbake
    accept: "application/json",
  });
  if (!response.ok) {
    return "Nothing Found!";
  } else {
    const result = await response.json();
    return result;
  }
};

/**
 * Funksjon som looper gjennom alle ting i hovedindexen og lagrer .results arrayet fra alle i en egen .data object.
 * Håpet er at søkefunksjonen kan lete i .data for å finne den URL som skal presenteres til bruker.
 * @param {*} fullIndex
 */
const fetchNextIndex = async (fullIndex) => {
  const indexes = Object.keys(fullIndex);
  for (let index of indexes) {
    if (index === "data") continue;
    else {
      let indexData = await fetchApi(apiURL + fullIndex[index]);
      fullIndex.data.push(await indexData.results);
    }
  }
  console.log("writing index to json");
  fs.writeFileSync(filePath, JSON.stringify(fullIndex, null, 2));
  console.log("write successfull");
};

/**
 * Funksjon som lager selve objektet, sender det videre til fetchNextIndex som fyller underobjektet .data
 */
const objectMaker = async () => {
  console.log("fetching index");
  let fullIndex = {};
  fullIndex = await fetchApi(apiIndexUrl);
  fullIndex.data = [];
  await fetchNextIndex(fullIndex);
};

objectMaker();

