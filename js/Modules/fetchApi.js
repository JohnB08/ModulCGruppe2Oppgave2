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

export { fetchApi };
