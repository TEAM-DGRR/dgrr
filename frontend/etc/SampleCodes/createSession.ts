import axios from "axios";
import { APPLICATION_SERVER_URL } from "./config";

export const createSession = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "api/sessions",
    { customSessionId: sessionId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // The sessionId
};
