import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(0);
  const [userId, setUserId] = useState(0);

  const login = useCallback((jwtToken, id) => {
    console.log("Go to login");
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: id,
        token: jwtToken,
      })
    );
  }, []);

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data && data.token) {
      const decodedJwt = atob(data.token.split(".")[1])
      const expiration = new Date(decodedJwt.exp);
      const now = new Date();
      console.log("Token " + decodedJwt)
      if (expiration.getTime() - now.getTime() < 1000*20) {
        console.log("JWT has expired or will expire soon");
      }
      login(data.token, data.userId);
    }
  }, [login]);

  return { login, logout, token, userId };
};
