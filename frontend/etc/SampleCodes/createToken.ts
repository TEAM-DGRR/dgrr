import axios from "axios";
import { APPLICATION_SERVER_URL } from "./config";

export const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // The token
};
