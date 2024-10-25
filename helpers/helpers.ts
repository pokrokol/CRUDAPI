import { validate as uuidValidate } from "uuid";

import { IncomingMessage } from "http";





export const isValidUuid = (uuid: string): boolean => {
  return uuidValidate(uuid);
};



export const parseRequestBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      let requestBody = "";
      req.on("data", (chunk) => {
        requestBody += chunk.toString();
      });
      req.on("end", () => {
        resolve(JSON.parse(requestBody));
      });
    } catch (error) {
      reject(error);
    }
  });
};
