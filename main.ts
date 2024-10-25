import * as http from "http";
import cluster from "cluster";



import { User } from "./interfaces/user";
import { usersDB } from "./database/db";
import { routeHandler } from "./paths";

const PORT = 4000;
let data: User[] = usersDB;

export const server = http
  .createServer(async (req: any, res: http.ServerResponse): Promise<void> => {
    routeHandler(req, res);
  })
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

if (cluster.isWorker) {
  process.on("message", (workerData: User[]) => {
    data = workerData;
  });
}
