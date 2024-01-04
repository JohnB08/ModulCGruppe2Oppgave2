import { setActiveScreen } from "./setActiveScreen.mjs";
import { fetchApi } from "./fetchApi.mjs";
import { makeElements } from "./makeElements.mjs";
const itemInfo = document.querySelector(".itemInfo");
let itemElements = [];

const apiURL = "https://www.dnd5eapi.co";
/* Item info */

/**
 * Tar inn enten en url eller et objekt. Hvis den får et objekt som allerede er fetcha viser den det i stedet, ellers fetcher den objektet fra API.
 * @param {*} url
 * @param {*} item
 */
const displaySearchItem = async (url, item = null) => {
  itemElements.forEach((element) => element.remove());
  itemElements = [];
  const itemObject = item || (await fetchApi(apiURL + url));
  console.log(itemObject);
  const title = makeElements("h3", {
    className: "infoTitle subHeaderText darkMode",
    innerText: itemObject.name,
  });
  itemElements.push(title);
  parseItemInfo(itemObject);
  itemInfo.prepend(title);
  setActiveScreen(itemInfo);
};

let itemNameSkipVariants = [
  "variant",
  "variants",
  "url",
  "index",
  "option_type",
  "option_set_type",
];

/**
 * Tarin et objekt fra displaySearchItem og displayer inforen som står i det.
 * @param {*} itemObject
 */
const parseItemInfo = (itemObject) => {
  Object.entries(itemObject).forEach((item) => {
    let [itemName, itemValue] = item;
    if (itemNameSkipVariants.includes(itemName)) return;
    if (itemName === "name") itemName = "";
    if (itemName === "rarity") itemValue = itemObject.rarity.name;
    if (itemName === "desc") itemName = "Description:";
    if (itemName.includes("_")) itemName = itemName.split("_").join(" ");
    const itemDesc = makeElements("p", {
      className: "itemDesc buttonText darkMode",
    });
    itemName = itemName.toUpperCase();
    itemDesc.innerHTML = `<span>${itemName}</span> `;
    if (typeof itemValue === "string" || typeof itemValue === "number")
      itemDesc.innerHTML += `${itemValue}`;
    else if (Array.isArray(itemValue)) {
      itemValue.forEach((value) => {
        if (typeof value === "string") itemDesc.innerHTML += `${value}`;
        else return parseItemInfo(value);
      });
    } else {
      return parseItemInfo(itemValue);
    }
    itemElements.push(itemDesc);
    itemInfo.appendChild(itemDesc);
  });
};
export { displaySearchItem };
