const TOKEN = 'token_key'

function saveToken(token) {
  setKey(true, TOKEN, token);
}

function getToken() {
  return getKey(true, TOKEN);
}

function getKey(isLocal, key) {
  return JSON.parse(getStorage(isLocal).getItem(key) || "null");
}
function getStorage(isLocal) {
  return isLocal ? window.localStorage : window.sessionStorage;
}
function setKey(isLocal, key, data) {
  getStorage(isLocal).setItem(key, JSON.stringify(data || null));
}
function removeKey(isLocal, key) {
  getStorage(isLocal).removeItem(key);
}

export{
  saveToken,
  getToken,
  getKey,
  setKey,
  removeKey
}