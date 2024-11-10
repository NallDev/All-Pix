export const mockLogin = async (username: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (
        username.toLowerCase() === "admin" &&
        password.toLocaleLowerCase() === "admin"
      ) {
        resolve({
          message: "Login success",
          token: "46995434-fed867429c3f7ffb7541aa4eb",
        });
      } else {
        resolve({
          message: "Login failed, please check username & password",
          token: null,
        });
      }
    }, 1000);
  });
};
