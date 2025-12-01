// LocalStorage utility functions
export const storage = {
  // Token management
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

  // User management
  setUser: (user) => {
    // নিশ্চিত করা হচ্ছে যে user অবজেক্টটি JSON স্ট্রিং হিসাবে সেভ হচ্ছে
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const userString = localStorage.getItem('user');

    // 🛑 JSON.parse ত্রুটি এড়ানোর জন্য নিরাপত্তা যোগ করা হলো
    // যদি userString null, 'undefined' স্ট্রিং, বা ফাঁকা হয়, তবে সরাসরি null ফেরত দিন
    if (!userString || userString === 'undefined' || userString.trim() === '') {
      return null;
    }

    try {
      // ডেটা parse করার চেষ্টা করুন
      return JSON.parse(userString);
    } catch (error) {
      // যদি parse ব্যর্থ হয় (যেমন, corrupted data), কনসোলে এরর দেখিয়ে null ফেরত দিন
      console.error("Error parsing user data from storage:", error);
      return null;
    }
  },

  clearUser: () => {
    localStorage.removeItem('user');
  },

  // Generic storage
  set: (key, value) => {
    // যেকোনো ভ্যালুকে JSON স্ট্রিং হিসাবে সেভ করুন
    localStorage.setItem(key, JSON.stringify(value));
  },

  get: (key) => {
    const item = localStorage.getItem(key);

    // 🛑 JSON.parse ত্রুটি এড়ানোর জন্য নিরাপত্তা যোগ করা হলো
    if (!item || item === 'undefined' || item.trim() === '') {
      return null;
    }

    try {
      // ডেটা parse করার চেষ্টা করুন
      return JSON.parse(item);
    } catch {
      // যদি parse ব্যর্থ হয়, তবে raw string ফেরত দিন (যদি parse ব্যর্থ হয়, তবে ধরে নেওয়া হচ্ছে এটি JSON ছিল না)
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