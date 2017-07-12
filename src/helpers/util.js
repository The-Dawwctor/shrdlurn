import Hashids from "hashids"

export function setStore(name, value) {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(name, jsonValue);
}

export function getStore(name, defaultValue = "") {
  const value = localStorage.getItem(name);
  if (!value) {
    return defaultValue;
  }
  return JSON.parse(value);
}

export function resetStore() {
  localStorage.clear();
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function rand10000() {
  return Math.ceil(Math.random() * 10000)
}

export function genUid() {
  const hashids = new Hashids("our cool SHRDLURN salt")
  return hashids.encode(rand10000(), rand10000(), rand10000(), rand10000(), rand10000())
}

export function genSid() {
  const hashids = new Hashids("our cool SHRDLURN salt for sids")
  return hashids.encode(rand10000(), rand10000())
}
