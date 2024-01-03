import { makeElements } from "./makeElements.mjs";
import { setActiveScreen } from "./setActiveScreen.mjs";
import { fetchApi } from "./fetchApi.mjs";

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

let currentIndexStart = 0;
const mainContainer = document.getElementById("main-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("previous-btn");
let childElements = [];
const showArray = (array) => {
  let currentIndexEnd = currentIndexStart + 10;
  childElements.forEach((child) => {
    child.remove();
  });
  childElements = [];
  for (let i = currentIndexStart; i < currentIndexEnd; i++) {
    const arrayObjectName = makeElements("p", {
      className: "monsterName",
    });
    arrayObjectName.textContent = array[i].name;
    childElements.push(arrayObjectName);
    mainContainer.append(arrayObjectName);
  }
  setActiveScreen(mainContainer);
};

nextBtn.addEventListener("click", () => {
  currentIndexStart += 10;
  if (currentIndexStart >= allMonstersExample.count) currentIndexStart = 0;
  console.log(currentIndexStart);
  showArray(allMonstersExample.results);
});
prevBtn.addEventListener("click", () => {
  currentIndexStart -= 10;
  if (currentIndexStart < 0) currentIndexStart = allMonstersExample.count - 10;
  console.log(currentIndexStart);
  showArray(allMonstersExample.results);
});

export { showArray };
