const dataBaseFetcher = async () => {
  const fetchedData = await fetch("./js/searchDatabase/searchObject.json");
  const result = await fetchedData.json();
  return result;
};
export const searchDatabase = await dataBaseFetcher();
