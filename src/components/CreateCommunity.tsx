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
import { useState } from "react";
import {
  ID,
  communityCallectionId,
  database,
  databaseId,
} from "../config/AppConfig";
import { toast } from "react-toastify";
import { AppwriteException } from "appwrite";
import { communitiesStore } from "../data/communitiesStore";

import { useAuth } from "../hooks/useAuth";
import { Checkbox } from "@nextui-org/react";

export default function CreateCommunity() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [community, setCommunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const communityState = communitiesStore();
  const { user } = useAuth();

  const handlerSubmit = () => {
    setLoading(true);

    const databasePromise = database.createDocument(
      databaseId,
      communityCallectionId,
      ID.unique(),
      {
        Name: community,
        user_id: user?.$id,
        status: isSelected,
      }
    );
    databasePromise
      .then((res) => {
        setLoading(false);

        communityState.AddCommunity(res);

        toast.success("Community Created Successfully");
      })
      .catch((err: AppwriteException) => {
        setLoading(false);
        toast.error(err.message, { theme: "colored" });
      });
    setCommunity("");
  };

  return (
    <>
      <button className="sm:inline-block sm:w-26 " onClick={onOpen}>
        Add Community
      </button>

      <Modal
        isOpen={isOpen}
        className="  mx-5 mb-5 sm:m-0 "
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {" "}
                Creating New Community
              </ModalHeader>
              <ModalBody>
                <p>
                  Create a Communities in you intrested topics and add your
                  friends in Your Community.
                </p>
                <Input
                  type="text"
                  onChange={(e) => setCommunity(e.target.value)}
                  value={community}
                  label={"Create Community"}
                />
                <div className="flex flex-col gap-2">
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                  >
                    Private
                  </Checkbox>
                  <p className="text-default-500">
                    Status : {isSelected ? "Private" : "Public"}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  onClick={handlerSubmit}
                  disabled={loading || community === ""}
                  color="primary"
                  onPress={onClose}
                >
                  {loading ? "Loading..." : "Add"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
