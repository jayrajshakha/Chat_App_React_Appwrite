import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { communitiesStore } from "../data/communitiesStore";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";

export default function Access() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [key, setKey] = useState("");
  const communityData = communitiesStore();
  const navigate = useNavigate();

  const done = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    communityData.communities.forEach((i) => {
      if (i.$id === key) {
        navigate(`/chat/${key}`);
      }
    });
    setKey("");
  };
  useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <AppNavbar />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Keys
              </ModalHeader>
              <ModalBody>
                <div className="">
                  <form action="" onSubmit={done}>
                    <Input
                      className="w-full"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setKey(e.target.value)
                      }
                      label={" please add Key"}
                      type="text"
                      name="text"
                      value={key}
                    />
                    <button
                      type="submit"
                      className="bg-green-400 w-full p-2 rounded "
                    >
                      Done
                    </button>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => navigate("/")}
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
