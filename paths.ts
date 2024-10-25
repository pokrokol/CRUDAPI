import { deleteUserHandler, getAllUsersHandler, getUserByIdHandler, postUserHandler, updateUserHandler } from "./controllers/controller";
import * as http from "http";


export async function routeHandler(req: any, res: http.ServerResponse): Promise<void> {
  if (req.url === "/api/users" && req.method === "GET") {
    getAllUsersHandler(req, res);
  } else if (req.url === "/api/users" && req.method === "POST") {
    postUserHandler(req, res);
  } else if (req.url.match(/\/api\/users\/\w+/) && req.method === "GET") {
    const id: string = req.url.split("/")[3];
    getUserByIdHandler(req, res, id);
  } else if (req.url.match(/\/api\/users\/\w+/) && req.method === "PUT") {
    const id: string = req.url.split("/")[3];
    updateUserHandler(req, res, id);
  } else if (req.url.match(/\/api\/users\/\w+/) && req.method === "DELETE") {
    const id: string = req.url.split("/")[3];
    deleteUserHandler(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
}
