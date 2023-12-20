export let activeScreen = "";
export let prevScreen = "";

/**
 * Setter hvilke div som skal vises til en hver tid.
 * @param {*} screenElement hvilket element som skal vises.
 */
const setActiveScreen = (screenElement, url = null, json = "startPage") => {
  prevScreen = activeScreen;
  if (activeScreen) activeScreen.style.display = "none";
  activeScreen = screenElement;
  activeScreen.style.display = "flex";
  history.pushState(json, "", url);
};

export { setActiveScreen };
