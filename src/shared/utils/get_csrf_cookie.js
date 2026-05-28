


export const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    if (c.trim().startsWith(name + "=")) {
      return c.split("=")[1];
    }
  }
  return null;
};







