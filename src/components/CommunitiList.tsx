import { useEffect, useRef, useState } from "react";
import { communitiesStore } from "../data/communitiesStore";
import {
  communityCallectionId,
  database,
  databaseId,
} from "../config/AppConfig";
import { AppwriteException, Models } from "appwrite";
import { CreateCommunity, Loading } from "./Index";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CommunityList = () => {
  const [loading, setLoading] = useState(false);
  const isFetch = useRef(false);
  const communityStoreData = communitiesStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deleteFunction = (id: string) => {
    database
      .deleteDocument(databaseId, communityCallectionId, id)
      .then(() => {
        communityStoreData.DeleteCommunity(id);
        toast.success("Community Deleted Succesfully", { theme: "colored" });
      })
      .catch((err: AppwriteException) => {
        toast.error(err.message, { theme: "colored" });
      });
  };

  useEffect(() => {
    setLoading(true);
    if (!isFetch.current) {
      database
        .listDocuments(databaseId, communityCallectionId)
        .then((res) => {
          communityStoreData.AddCommunities(res.documents);
          setLoading(false);
        })
        .catch((err: AppwriteException) => {
          setLoading(false);
          console.log(err);

          toast.error(err.message, { theme: "colored" });
        });
    }

    isFetch.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keysFun = (item: Models.Document) => {
    item.status === "1" && item.user_id !== user?.$id
      ? navigate("/access")
      : navigate(`/chat/${item.$id}`);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className=" overflow-scroll custom-scrollbar mx-5 my-auto sm:m-0 sm:w-full lg:w-full h- max-w-sm p-4 bg-transparent border border-gray-400 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-3 ml-4 text-base font-bold text-white md:text-xl dark:text-white">
              Communities
            </h2>
            <p className=" sm:hidden md:inline-block  p-2 text-sm font-normal text-gray-300 dark:text-gray-400">
              Connect with one of our available Community providers or create a
              new one.
            </p>

            <ul className="overflow-scroll custom-scrollbar my-4 flex justify-center items-center flex-col space-y-3">
              {communityStoreData.communities.length <= 0 ? (
                <li className="font-bold text-gray-400">
                  No Communities are here Please Create and invite your friends{" "}
                  <br />{" "}
                  <div className=" hover:bg-blue-800 hover:text-white text-center rounded p-2 my-2">
                    {" "}
                    <CreateCommunity />
                  </div>{" "}
                </li>
              ) : (
                ""
              )}
              {communityStoreData.communities.length > 0 &&
                communityStoreData.communities.map((item) => {
                  return (
                    <li
                      key={item.$id}
                      className="flex w-full items-center justify-between  h-[30px] p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <button className="w-full" onClick={() => keysFun(item)}>
                        <span className="flex-1 ms-3 whitespace-nowrap w-28">
                          {item.Name}
                        </span>
                      </button>
                      <button
                        title="del"
                        disabled={item.user_id !== user?.$id}
                        onClick={() => deleteFunction(item.$id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
            </ul>
            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center text-xs font-normal text-gray-300 hover:underline dark:text-gray-400"
              >
                <svg
                  className="w-3 h-3 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Your Privacy Our Responsibility !
              </a>
            </div>
          </div>
        </>
      )}
      <div className="fixed bottom-4  justify-center items-center">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="" className="hover:underline">
            Jay-Rajshakha™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </>
  );
};

export default CommunityList;
