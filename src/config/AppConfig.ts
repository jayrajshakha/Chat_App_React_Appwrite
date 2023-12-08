import { Account, Client, Databases } from "appwrite";

const projectId = import.meta.env.VITE_APP_PROJECT_ID;
const endPoint = import.meta.env.VITE_APP_END_POINTS;

export const client = new Client();

client.setEndpoint(endPoint).setProject(projectId);

export const account = new Account(client);
export const database = new Databases(client);

export const databaseId = import.meta.env.VITE_APP_DATABASE_ID;
export const communityCallectionId = import.meta.env
  .VITE_APP_COMMUNITY_COLLECTION_ID;
export const ChatCollectionId = import.meta.env.VITE_APP_CHAT_COLLECTION_ID;

export { ID } from "appwrite";
