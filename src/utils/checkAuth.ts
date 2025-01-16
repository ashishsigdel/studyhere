export const CheckAuth = () => {
  const storedKey = localStorage.getItem("authKey");

  return storedKey === process.env.NEXT_PUBLIC_AUTHKEY;
};
