import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context";
import Login from "./auth/Login";
import Register from "./auth/Register";
import PrivateRoutes from "./routes/PrivateRoutes";
import {
  AppNavbar,
  CommunityList,
  Logout,
  ErrorPage,
  Access,
} from "./components/Index";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <div className="custom-scrollbar  bgpc w-screen h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoutes />}>
              <Route path="logout" element={<Logout />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/access" element={<Access />} />
              <Route
                path="/"
                element={
                  <>
                    <AppNavbar />
                    <div className="flex custom-height justify-center items-center sm:items-end sm:pr-36 flex-col">
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
