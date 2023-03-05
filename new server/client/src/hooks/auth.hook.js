import { useState, useEffect, useCallback } from "react";

export function useAuth () {
  const [token, setToken] = useState(0);
  const [userId, setUserId] = useState(0);
  const [isReady, setIsReady] = useState(false);
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
      login(data.token, data.userId);
      console.log(data.token)
      const decode = JSON.parse(atob(data.token.split('.')[1]));
      console.log(decode.exp * 1000);
      console.log(new Date().getTime())
      if (decode.exp * 1000 < new Date().getTime()) {
        console.log('Time Expired');
        logout()
    }
    }
    setIsReady(true)
  }, [login]);

  return { login, logout, token, userId, isReady };
};
