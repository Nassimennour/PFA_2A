import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken); // Log the decoded token
      axios
        .get(`http://localhost:5000/users/${decodedToken.userId}`)
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error("An error occurred while fetching user data: ", error);
        });
    }
  }, [token]);

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, username, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
