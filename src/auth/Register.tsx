import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const Register = () => {
 
  const { registerUser } = useAuth()
  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
   registerUser(auth)

  
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="w-[31rem] p-2 rounded-md shadow">
        <h1 className="text-center m-2 text-3xl font-bold text-[#65b9f5]">
          {" "}
          snapgram
        </h1>
        <h1 className="text-center m-1 text-2xl text-[#78c7ff] font-bold ">Register</h1>
        <p className="text-center text-gray-400 p-2"> welcome to snapgram</p>
        <form onSubmit={submitHandler} action="">
          <div className="m-5">
            <Input
              onChange={(e) => setAuth({ ...auth, name: e.target.value })}
              label={"Name"}
              type="text"
            />
          </div>
          <div className="m-5">
            <Input
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              label={"Email"}
              type="Email"
            />
          </div>
          <div className="m-5">
            <Input
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
              label={"Password"}
              type="Password"
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
          <Link to={"/login"}>
            <h1 className="font-semibold text-white ">Already have an account ? </h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
