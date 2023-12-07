import { Models } from "appwrite";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type state = {
  chats: Array<Models.Document> | [];
};

type Action = {
  addSingleMessage: (data: Models.Document) => void;
  addAllMessage: (data: Array<Models.Document>) => void;
  DeleteMessage: (id: string) => void;
};

export const messageStore = create<state & Action>()(
  devtools((set) => ({
    chats: [],
    addSingleMessage: (data: Models.Document) =>
      set((state) => ({
        chats: [...state.chats, data],
      })),
    addAllMessage: (data: Array<Models.Document>) =>
      set(() => ({
        chats: data,
      })),
    DeleteMessage: (id: string) =>
      set((state) => ({
        chats: state.chats.filter((f) => f.$id !== id),
      })),
  }))
);
