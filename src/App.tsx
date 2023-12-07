import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./routes/PrivateRoutes";
import AppNavbar from "./components/AppNavbar";
import CommunityList from "./components/CommunitiList";
import Logout from "./components/Logout";
import Chat from "./pages/Chat";
import ErrorPage from "./pages/Error";


const App = () => {


  return (
    <div className="custom-scrollbar bg-black w-screen h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoutes />}>
              <Route path="logout" element={<Logout />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route
                path="/"
                element={
                  
                    <>
                      <AppNavbar />
                      <div className="flex bgpc custom-height justify-center items-center flex-col">
                        <CommunityList />
                      </div>
                    </>
                  
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
