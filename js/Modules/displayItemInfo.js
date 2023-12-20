import { setActiveScreen } from "./setActiveScreen.js";
import { fetchApi } from "./fetchApi.js";
import { makeElements } from "./makeElements.js";
const itemInfo = document.querySelector(".itemInfo");
let itemElements = [];

const apiURL = "https://www.dnd5eapi.co";
/* Item info */

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
  itemInfo.appendChild(title);
  parseItemInfo(itemObject);
  setActiveScreen(itemInfo, "info", itemObject);
};

const parseItemInfo = (itemObject) => {
  Object.entries(itemObject).forEach((item) => {
    let [itemName, itemValue] = item;
    if (itemName === "variant" && !itemObject.variant) return;
    if (itemName === "variants" && !itemObject.variant) return;
    if (itemName === "url" || itemName === "index") return;
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
        if (typeof value === "string") itemDesc.innerHTML += `<br> ${value}`;
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
