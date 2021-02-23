const _ = require("lodash");
const _countryList = require("../data")();
const normalizeName = function (name) {
  return _.deburr(name)
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/(\.|\b(the|and|of|de|des|du|di|del|y|da|und|die) \b)/g, "")
    .trim();
};

const findIndex = _.transform(_countryList, function (index, country, key) {
  const addToIndex = function (name) {
    if (name) {
      index[normalizeName(name)] = key;
    }
  };
  addToIndex(country.name);
  _.forEach(country.altSpellings, addToIndex);
});
const Country = function () {
  const _returnCountry = function (country, type) {
    let key;
    if (type === "name") {
      key = findIndex[normalizeName(country)];
      return _countryList[key];
    } else if (type === "ISO3") {
      return _.find(_countryList, function (thiscountry) {
        return thiscountry.ISO.alpha3 === country;
      });
    } else if (type === "IS02") {
      return _.find(_countryList, function (thiscountry) {
        return thiscountry.ISO.alpha2 === country;
      });
    } else if (typeof type === "undefined") {
      return _.find(_countryList, function (thiscountry) {
        return thiscountry.ISO.alpha2 === country;
      });
    } else if (typeof type === "string") {
      key = findIndex[normalizeName(country)];
      let stateKey;
      const _statesList = _countryList[key].states;
      const findStateIndex = _.transform(
        _statesList,
        function (index, state, key) {
          const addToStateIndex = function (name) {
            if (name) {
              index[normalizeName(name)] = key;
            }
          };
          addToStateIndex(state.name);
          addToStateIndex(state.abbreviation);
          _.forEach(state.altSpellings, addToStateIndex);
        }
      );
      stateKey = findStateIndex[normalizeName(type)];
      return _statesList[stateKey];
    } else {
      return _.find(_countryList, function (thiscountry) {
        return thiscountry.ISO.alpha2 === country;
      });
    }
  };
  this.all = function () {
    return _countryList;
  };
  const methods = {
    name: "name",
    states: "states",
    provinces: "states",
    altSpellings: "altSpellings",
    state: null,
    province: null,
  };
  _.forEach(
    methods,
    function (property, method) {
      this[method] = function (country, type) {
        const _returnData = _returnCountry(country, type);
        if (_returnData) {
          if (property) {
            return _returnData[property];
          }
          return _returnData;
        }
      };
    }.bind(this)
  );
  return this;
};
module.exports = new Country();
