import { useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  ChatCollectionId,
  client,
  database,
  databaseId,
} from "../config/AppConfig";
import { AppwriteException, ID, Models } from "appwrite";
import { toast } from "react-toastify";
import { messageStore } from "../data/Chat";
import { Loading } from "../components/Index";
import { communitiesStore } from "../data/communitiesStore";
import { useAuth } from "../hooks/useAuth";

const Chat = () => {
  const params = useParams();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [heading, setHeading] = useState("");
  const isFetch = useRef(false);
  const myRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [submit, setSubmit] = useState(false);

  const { user } = useAuth();

  const messageData = messageStore();
  const communityData = communitiesStore();

  const executeScroll = () => myRef.current.scrollIntoView();
  // run this function from an event handler or an effect to execute scroll
  useEffect(() => {
    executeScroll();
  });

  useEffect(() => {
    setSubmit(!submit);
    const a = communityData.communities?.find((f) => f.$id === params.id);
    setHeading(a?.Name);

    if (!isFetch.current) {
      FetchMasseage();
      setLoading(true);

      // for realtime Updates

      client.subscribe(
        `databases.${databaseId}.collections.${ChatCollectionId}.documents`,
        (res) => {
          const payload = res.payload as Models.Document;

          if (
            res.events.includes("databases.*.collections.*.documents.*.create")
          )
            if (user?.$id !== payload.user_id) {
              messageData.addSingleMessage(payload);
            } else if (
              res.events.includes(
                "databases.*.collections.*.documents.*.delete"
              )
            ) {
              messageData.DeleteMessage(payload.$id);
            }
        }
      );
    }
    isFetch.current = true;
    setLoading(false);
  }, []);

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(!submit);
    database
      .createDocument(databaseId, ChatCollectionId, ID.unique(), {
        communities_id: params.id,
        masseage: message,
        name: user?.name,
        user_id: user?.$id,
      })
      .then((res) => {
        messageData.addSingleMessage(res);
      })
      .catch((err: AppwriteException) => {
        toast.error(err.message, { theme: "colored" });
      });
    setMessage("");
  };

  const FetchMasseage = () => {
    setLoading(true);
    database
      .listDocuments(databaseId, ChatCollectionId)
      .then((res) => {
        messageData.addAllMessage(res.documents);
      })
      .catch((err: AppwriteException) => {
        toast.error(err.message, { theme: "colored" });
      });
  };

  const deleteFun = (id: string) => {
    database
      .deleteDocument(databaseId, ChatCollectionId, id)
      .then(() => {
        messageData.DeleteMessage(id);
        toast.success("Your message was deleted");
      })
      .catch((err: AppwriteException) => {
        toast.error(err.message, { theme: "colored" });
      });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="bg-black h-screen w-screen">
      <AppNavbar />
      <div className="flex flex-col w-screen custom-height gap-2 ">
        <div className="flex justify-center items-center bg-blue-Toastify--animate ">
          <p className="font-bold text-2xl fontss  text-gray-500">
            {heading} <span className="text-xl"> {` key ~${params.id}`}</span>
          </p>
        </div>
        {/* this div for display message */}
        <div className="flex flex-col mx-2 sm:mx-10 overflow-scroll custom-scrollbar mb-5 custom-height-2 ">
          {messageData.chats?.map((item) => {
            return item.user_id === user?.$id ? (
              params.id === item.communities_id.$id ? (
                <div key={item.$id} className=" sm:mx-7 mb-3 flex justify-end">
                  <p className=" mr-1 my-2 text-base relative max-w-[75%] sm:max-w-[60%] rounded-xl  p-3  bg-purple-400">
                    <span className="font-bold text-xs absolute pb-0.5  top-0 ">
                      {item.name}
                    </span>{" "}
                    {item.masseage}
                  </p>
                  <button
                    title="del"
                    onClick={() => deleteFun(item.$id)}
                    className="flex justify-end items-end mb-3 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2 text-red-600 flex justify-end"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              ) : (
                ""
              )
            ) : params.id === item.communities_id.$id ? (
              <div className="flex sm:mx-7 mb-3 justify-start" key={item.$id}>
                <p
                  className="ml-1 my-2 relative max-w-[75%] sm:max-w-[60%]  
                           rounded-xl p-3  bg-green-400"
                >
                  {" "}
                  <span className="font-bold text-xs absolute pb-0.5  top-0 ">
                    {item.name}
                  </span>
                  {item.masseage}
                </p>
              </div>
            ) : (
              ""
            );
          })}
          <div ref={myRef} className="" />
        </div>

        {/* this div for input */}
        <div className="">
          <form onSubmit={handlerSubmit} className=" fixed bottom-1">
            <label htmlFor="chat" className="sr-only">
              Your message
            </label>
            <div className="flex w-screen items-center px-3 py-2 rounded-lg bg-black dark:bg-gray-700">
              <button
                type="button"
                className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 18"
                >
                  <path
                    fill="currentColor"
                    d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                  />
                </svg>
                <span className="sr-only">Upload image</span>
              </button>
              <button
                disabled={message.length < 0}
                type="button"
                className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <svg
                  className="w-5 h-5"
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
                    d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                  />
                </svg>
                <span className="sr-only">Add emoji</span>
              </button>
              <input
                onChange={(e) => setMessage(e.target.value)}
                id="chat"
                type="text"
                className="block sm:mx-4 outline-none p-2.5 w-full text-sm text-gray-300 bg-black rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your message..."
                value={message}
              />
              <button
                type="submit"
                className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
              >
                <svg
                  className="w-5 h-5 rotate-90 rtl:-rotate-90"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                </svg>
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
