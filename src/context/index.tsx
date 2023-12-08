import { createContext, useState, useEffect } from "react";
import { account } from "../config/AppConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import { Models } from "appwrite";
import { toast } from "react-toastify";

type valuesType = {
  user: Models.User<Models.Preferences> | undefined;
  userSession: Models.Session | undefined;
  loginUser: (userInfo: { email: string; password: string }) => void;
  registerUser: (userInfo: {
    email: string;
    password: string;
    name: string;
  }) => void;
  logoutUser: (id: string) => void;
  loading: boolean;
};

const inisialState: valuesType = {
  user: undefined,
  userSession: undefined,
  loginUser: () => {},
  registerUser: () => {},
  logoutUser: () => {},
  loading: true || false,
};

const AuthContext = createContext<valuesType>(inisialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const localStorageState = JSON.parse(localStorage.getItem("Login") || "{}");
  const localStorageSession = JSON.parse(
    localStorage.getItem("Session") || "{}"
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences | object>>(
    localStorageState ? localStorageState : {}
  );
  const [userSession, setUserSession] = useState<Models.Session>(
    localStorageSession ? localStorageSession : {}
  );

  useEffect(() => {
    //setLoading(false)
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo: { email: string; password: string }) => {
    setLoading(true);

    try {
      const a = await account.createEmailSession(
        userInfo.email,
        userInfo.password
      );
      localStorage.setItem("Session", JSON.stringify(a));
      const localStorageSessionData = JSON.parse(
        localStorage.getItem("Session") || "{}"
      );
      setUserSession(localStorageSessionData);
      const accountDetails =
        (await account.get()) as Models.User<Models.Preferences>;
      localStorage.setItem("Login", JSON.stringify(accountDetails));
      const localStorageData = JSON.parse(
        localStorage.getItem("Login") || "{}"
      );
      setUser(localStorageData);
      toast.success("You are Login Successfully", { theme: "colored" });
      navigate("/");
    } catch (error) {
      toast.error(`${error}`, { theme: "colored" });
      setLoading(false);
    }
  };

  const logoutUser = async (id: string) => {
    await account.deleteSession(id);
    localStorage.removeItem("Session");
    localStorage.removeItem("Login");

    setUser(Object);
  };

  const registerUser = async (userInfo: {
    email: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);

    try {
      await account.create(
        ID.unique(),
        userInfo.email,
        userInfo.password,
        userInfo.name
      );
      const a = await account.createEmailSession(
        userInfo.email,
        userInfo.password
      );
      setUserSession(a);
      const accountDetails =
        (await account.get()) as Models.User<Models.Preferences>;
      localStorage.setItem("Login", JSON.stringify(accountDetails));
      const localStorageData = JSON.parse(
        localStorage.getItem("Login") || "{}"
      );
      setUser(localStorageData);
      setUser(accountDetails);
      toast.success("You are SignUp Successfully", { theme: "colored" });
      navigate("/");
    } catch (error) {
      toast.error(`${error}`, { theme: "colored" });
    }

    setLoading(false);
  };

  const checkUserStatus = async () => {
    try {
      const accountDetails =
        (await account.get()) as Models.User<Models.Preferences>;
      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const contextData: valuesType = {
    user,
    userSession,
    loading,
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
