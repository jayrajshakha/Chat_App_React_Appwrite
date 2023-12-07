import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col bg-black h-screen w-screen justify-center items-center">
      <h1 className="font-bold text-orange-400 text-center p-2 m-3 text-2xl ">
        {" "}
        oopssssss...
      </h1>
      <p className="text-center p-2 m-2 text-red-500 font-bold">
        {" "}
        You visited unexisted page please check you path
      </p>
      <h1 className="text-center bg-white rounded-md font-bold m-2 p-2">
        {" "}
        <Link to={"/"}> Go to Home</Link>
      </h1>
    </div>
  );
};

export default ErrorPage;
