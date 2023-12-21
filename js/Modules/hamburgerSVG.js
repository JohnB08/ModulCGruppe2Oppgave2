/* Modul som lager en svg med forhåndsinstilte classer osv.s */

import { makeElements } from "./makeElements.mjs";

const hamButton = makeElements("div", { className: "hamBtn" });
const hamSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const svgAttributes = {
  width: "3em",
  height: "3em",
  viewBox: "0 0 48 48",
};
Object.entries(svgAttributes).forEach((attribute) => {
  let [attributeName, attributeValue] = attribute;
  hamSVG.setAttribute(attributeName, attributeValue);
});
const hamPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
hamPath1.setAttribute("d", "M7.94971 11.9497H39.9497");
const hamPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
hamPath2.setAttribute("d", "M7.94971 23.9497H39.9497");
const hamPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
hamPath3.setAttribute("d", "M7.94971 35.9497H39.9497");

const pathAttributes = {
  fill: "none",
  stroke: "#2f3437",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "4",
  class: "arm",
};

let armArray = [hamPath1, hamPath2, hamPath3];
armArray.forEach((arm) => {
  Object.entries(pathAttributes).forEach((attribute) => {
    let [attributeName, attributeValue] = attribute;
    arm.setAttribute(attributeName, attributeValue);
  });
  hamSVG.appendChild(arm);
});
hamButton.appendChild(hamSVG);

export { hamButton };
