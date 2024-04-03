const TOKEN = 'token_key'

function saveToken(token) {
  localStorage.setItem(TOKEN,token)
}

function getToken() {
  return localStorage.getItem(TOKEN)
}
function removeToken(){
  localStorage.removeItem(TOKEN)
}

export{
  saveToken,
  getToken,
  removeToken
}