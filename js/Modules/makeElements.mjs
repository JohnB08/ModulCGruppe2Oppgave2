/**
 * Funksjon som lager html element
 * @param {*} type hvilken type element du vil ha, string. f.eks "div"
 * @param {*} parameters hvilke parametere du vil gi elementet, f.eks {classname: "container"}
 */
const makeElements = (type, parameters) => {
  const element = document.createElement(type);
  Object.entries(parameters).forEach((entry) => {
    let [propertyKey, propertyValue] = entry;
    element[propertyKey] = propertyValue;
  });
  return element;
};

export { makeElements };
