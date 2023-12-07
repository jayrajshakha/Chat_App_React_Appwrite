import { Models } from "appwrite";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type state = {
  communities: Array<Models.Document> | [];
};

type Action = {
  AddCommunity: (data: Models.Document) => void;
  AddCommunities: (data: Array<Models.Document>) => void;
  DeleteCommunity: (id: string) => void;
};

export const communitiesStore = create<state & Action>()(
  devtools((set) => ({
    communities: [],
    AddCommunity: (data: Models.Document) =>
      set((state) => ({
        communities: [data, ...state.communities],
      })),
    AddCommunities: (data: Array<Models.Document>) =>
      set(() => ({
        communities: data,
      })),
    DeleteCommunity: (id: string) =>
      set((state) => ({
        communities: state.communities.filter((f) => f.$id !== id),
      })),
  }))
);
