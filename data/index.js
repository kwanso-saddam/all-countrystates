const bulkify = require("bulk-require");
const _ = require("lodash");

module.exports = function () {
  const totalList = [];
  const fileList = bulkify(__dirname, ["*.json"]);
  _.forEach(fileList, function (file) {
    // file.ISO[2] = file.ISO.alpha2
    // file.ISO[3] = file.ISO.alpha3
    totalList.push(file);
  });
  return totalList;
};
