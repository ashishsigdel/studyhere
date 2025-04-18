export const localstorage = {
  setItem: (key: string, value: any, handleErrorCallback?: Function) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Localstorage Error:", error);
      handleErrorCallback?.(error);
    }
  },

  getItem: (key: string, handleErrorCallback?: Function) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log("Localstorage Error:", error);
      handleErrorCallback?.(error);
    }
  },

  removeItem: (key: string, handleErrorCallback?: Function) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log("Localstorage Error:", error);
      handleErrorCallback?.(error);
    }
  },
};
