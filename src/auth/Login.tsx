import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { Link} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";



const Login = () => {


  const {loginUser} = useAuth()

  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
     setAuth({...auth, [e.target.name] : e.target.value})
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    loginUser(auth)

  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="w-[31rem] p-2 rounded-md shadow">
        <h1 className="text-center m-2 text-3xl font-bold text-[#65b9f5]">
          {" "}
          snapgram
        </h1>
        <h1 className="text-center m-1 text-2xl font-bold text-[#98d4ff]">Login</h1>
        <p className="text-center text-white text-lg p-2">
          {" "}
          welcome back to snapgram
        </p>
        <form onSubmit={submitHandler} action="">
          <div className="m-5">
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>)=> changHandler(e)}
              label={"Email"}
              type="Email"
              name = 'email'
            />
          </div>
          <div className="m-5">
            <Input
              // onChange={(e) => setAuth({ ...auth, password: e.target.value })}
              onChange={(e: React.ChangeEvent<HTMLInputElement>)=> changHandler(e)}
              label={"Password"}
              type="Password"
              name = 'password'
            />
          </div>
          <div className="m-5">
            <Button
              disabled={loading}
              className={`${
                loading ? "bg-green-500" : "bg-[#65b9f5]"
              } text-black w-full`}
              type="submit"
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>
          <div className="w-full m-5"></div>
        </form>
        <div className="flex justify-center items-center m-5">
          <h1 className="font-semibold text-white">
            Sign up for{" "}
            <Link to={"/register"}>
              <span className="text-[#65b9f5]"> Snapgram</span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
