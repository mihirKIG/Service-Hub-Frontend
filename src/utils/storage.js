
export const storage = {
  setAccessToken: (token) => {
    localStorage.setItem('access_token', token);
  },

  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  setRefreshToken: (token) => {
    localStorage.setItem('refresh_token', token);
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const userString = localStorage.getItem('user');

    if (!userString || userString === 'undefined' || userString.trim() === '') {
      return null;
    }

    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data from storage:", error);
      return null;
    }
  },

  clearUser: () => {
    localStorage.removeItem('user');
  },

  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get: (key) => {
    const item = localStorage.getItem(key);

    if (!item || item === 'undefined' || item.trim() === '') {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch {
      return item; 
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};