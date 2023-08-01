import { createSession } from "./createSession";
import { createToken } from "./createToken";

export const getToken = async (mySessionId: string) => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};
