import { createContext, useState, useEffect } from "react";
import { account } from "../config/AppConfig";
import {useNavigate } from 'react-router-dom'
import { ID } from "appwrite";
import { Models } from "appwrite";
import { toast } from "react-toastify";


type valuesType = {
  user: Models.User<Models.Preferences> | undefined;
  loginUser: (userInfo: { email: string; password: string }) => void;
  registerUser: (userInfo: {
    email: string;
    password: string;
    name: string;
  }) => void;
  logoutUser: () => void;
  loading : boolean
};

const inisialState: valuesType = {
  user: undefined,
  loginUser: () => {},
  registerUser: () => {},
  logoutUser: () => {},
  loading : true || false
};

const AuthContext = createContext<valuesType>(inisialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const localStorageState = JSON.parse(localStorage.getItem('Login'))
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences | object>>(localStorageState ? localStorageState : {});

  useEffect(() => {
    //setLoading(false)
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo: { email: string; password: string }) => {
    setLoading(true);


    try {
       await account.createEmailSession(userInfo.email, userInfo.password);
       const accountDetails = await account.get() as Models.User<Models.Preferences>;
       localStorage.setItem('Login', JSON.stringify(accountDetails))
       const localStorageData = JSON.parse(localStorage.getItem('Login'))
      setUser(localStorageData);
      toast.success('You are Login Successfully', {theme : "colored"})
      navigate('/')
    } catch (error) {
        console.log(error);
    setLoading(false);
  }
}

  const logoutUser = async () => {
    await account.deleteSession("current");
     localStorage.removeItem('Login')
    setUser(undefined);
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
      await account.createEmailSession(userInfo.email, userInfo.password);
      const accountDetails =
        (await account.get()) as Models.User<Models.Preferences>;
        localStorage.setItem('Login', JSON.stringify(accountDetails))
        const localStorageData = JSON.parse(localStorage.getItem('Login'))
       setUser(localStorageData);
      setUser(accountDetails);
      toast.success('You are SignUp Successfully', {theme : "colored"});
      navigate("/");
    } catch (error) {
      toast.error( `${error}` , {theme : "colored"})
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
    loading,
    loginUser,
    logoutUser,
    registerUser,
  };


  return (
    <AuthContext.Provider value={contextData}>
      { children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
