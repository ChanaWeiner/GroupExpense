export function onLogin(token, user) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

export function getToken() {
  return localStorage.getItem('authToken');
}

export function getUser() {
  const user = localStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
}