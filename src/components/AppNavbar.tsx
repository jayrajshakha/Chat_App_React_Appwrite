import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@nextui-org/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CreateCommunity, SearchIcon } from "./Index";
import { Models } from "appwrite";
import { communitiesStore } from "../data/communitiesStore";
import { useAuth } from "../hooks/useAuth";

function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AppNavbar() {
  const { user } = useAuth();

  const community = communitiesStore(
    (state) => state.communities
  ) as Array<Models.Document>;

  const [search, setSearch] = useState("");
  const [allSearch, setAllSearch] = useState();
  const [id, setId] = useState<string | undefined>();
  const nv = useNavigate();

  const communityShw = () => {
    nv(`/chat/${id}`);
  };

  const querySearch = () => {
    const a = community.find((f) => f.Name === search);
    setAllSearch(a?.Name);
    setId(a?.$id);
  };
  useEffect(() => {
    querySearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const navigate = () => {
    nv("/");
  };

  return (
    <Disclosure as="nav" className="z-[100] bg-transparent sticky top-0  ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:justify-start sm:items-stretch ">
                <div
                  onClick={navigate}
                  className="flex cursor-pointer flex-shrink-0 items-center"
                >
                  <p className="text-white font-bold text-lg">Snapgarm</p>
                </div>
                <div className="hidden sm:flex p-4 justify-center items-center ">
                  <div className=" text-center mt-1 rounded p-2  hover:border  hover:text-white text-white text-sm font-normal">
                    <CreateCommunity />
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden sm:inline-block">
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    classNames={{
                      base: "max-w-full sm:max-w-[13rem] h-10 hover:bg-blue-800  ",
                      mainWrapper: "h-full hover:bg-blue-800 ",
                      input: "text-small placeholder:text-gray-400 ",
                      inputWrapper:
                        "h-full font-normal hover:bg-blue-800  text-default-500 bg-transparent dark:bg-default-500/20",
                    }}
                    placeholder="Search communities"
                    size="sm"
                    startContent={<SearchIcon size={18} />}
                    type="search"
                  />
                  <div
                    onClick={communityShw}
                    className={`bg-white ${
                      allSearch ? " " : "hidden cursor-pointer"
                    }
                   p-2 rounded-md m-1 `}
                  >
                    <h1 className="cursor-pointer">{allSearch}</h1>
                  </div>
                </div>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 hover:border border-black rounded-full"
                        src="../../public/assets/profile.jpg"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {user?.name}
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={"/logout"}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Logout
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <div className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                <CreateCommunity />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
