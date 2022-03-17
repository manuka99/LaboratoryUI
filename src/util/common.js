export const FormatTXOperations = operations => {
  const newOps = [];
  for (let index = 0; index < operations.length; index++) {
    var operation = operations[index];
    operation.type = getCamelCaseArray(operation.type)
      .map(val => capitalize(val))
      .join(" ");
    operation = FormatTXValues(operation);
    newOps.push(operation);
  }
  return newOps;
};

function getCamelCaseArray(camel) {
  var reg = /([a-z0-9])([A-Z])/g;
  return camel
    .replace(reg, "$1 $2")
    .replace("_", "")
    .split(" ");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCaseToCapitalizeWords(word) {
  return getCamelCaseArray(word)
    .map(val => capitalize(val))
    .join(" ");
}

export const FormatTXValues = param => {
  if (Buffer.isBuffer(param)) return param.toString();
  else if (Array.isArray(param)) {
    var newArray = [];
    for (let index = 0; index < param.length; index++) {
      const element = param[index];
      const value = FormatTXValues(element);
      newArray.push(value);
    }
    return newArray;
  } else if (param instanceof Object) {
    var newOb = {};
    // const stringified = JSON.stringify(param);
    // const parsed = JSON.parse(stringified);
    for (let index = 0; index < Object.keys(param).length; index++) {
      const key = Object.keys(param)[index];
      const value = FormatTXValues(param[key]);
      const newKey = camelCaseToCapitalizeWords(key);
      newOb[newKey] = value;
    }
    return newOb;
  } else return param;
};
