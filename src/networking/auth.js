window.extractToken = (hash) => {
  const match = hash.match(/access_token=([^&]+)/);
  let token = !!match && match[1];
  if (!token) {
    token = localStorage.getItem('ello_access_token');
  }
  return token;
}

window.checkAuth = () => {
  const token = window.extractToken(document.location.hash);
  if (window.history && window.history.replaceState) {
    window.history.replaceState(window.history.state, document.title, window.location.pathname)
  } else {
    document.location.hash = '' // this is a fallback for IE < 10
  }
  if (token) {
    localStorage.setItem('ello_access_token', token)
  } else {
    const url = 'https://' + ENV.AUTH_DOMAIN + '/api/oauth/authorize.html' +
      '?response_type=token' +
      '&scope=web_app' +
      '&client_id=' + ENV.AUTH_CLIENT_ID +
      '&redirect_uri=' + ENV.AUTH_REDIRECT_URI;

    window.location.href = url;
  }
}

window.resetAuth = () => {
  const token = localStorage.getItem('ello_access_token');
  if (token) {
    localStorage.removeItem('ello_access_token');
    window.checkAuth()
  }
}

window.checkAuth()
