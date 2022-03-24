export function getCamelCaseArray(camel) {
  var reg = /([a-z0-9])([A-Z])/g;
  return camel
    .replace(reg, "$1 $2")
    .replace("_", "")
    .split(" ");
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateToSL(date) {
  return new Date(date).toLocaleTimeString(
    "en-US",
    {
      timeZone: "Asia/Colombo",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    }
  );
}

export function camelCaseToCapitalizeWords(word) {
  return getCamelCaseArray(word)
    .map(val => capitalize(val))
    .join(" ");
}

//  _ to capital dog_cat => dogCat
export function toCamelCaseV1(word) {
  return word
    .split("_")
    .map((val, i) => (i == 0 ? val : capitalize(val)))
    .join("");
}
