export const CheckAuth = () => {
  const user = localStorage.getItem("user");

  return user ? true : false;
};
