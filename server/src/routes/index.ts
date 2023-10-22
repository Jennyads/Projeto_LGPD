import cors = require("cors");
import { Router, Request, Response } from "express";

import product from "./product";

const routes = Router()

routes.use(cors());

routes.use("/product", product);


routes.use((req: Request, res: Response) => res.json({ error: "Requisição desconhecida" }));

export default routes;
