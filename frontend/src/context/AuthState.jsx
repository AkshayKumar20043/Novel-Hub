import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AuthState = (props) => {
    const API_URL = import.meta.env.VITE_API_URL;

  const [loggedUser, setLoggedUser] = useState({}); 
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = Cookies.get("token");

        if (token && token !== "") {
          const userId = jwtDecode(token).userId;
          const response = await axios.get(`${API_URL}/users/${userId}`);
          setLoggedUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [API_URL, reload]);

  const update = () => {
    setReload(!reload);
  };

  const isAuthenticated = useCallback(() => {
    const token = Cookies.get("token");
    if (token && token !== "") {
      try {
        const decoded = jwtDecode(token);
        return decoded && decoded.exp > Date.now() / 1000;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return false;
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setLoggedUser({});
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoggedUser({});
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ loggedUser, update, isAuthenticated, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
