export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  return true;
};
