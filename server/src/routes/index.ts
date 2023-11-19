import cors = require("cors");
import { Router, Request, Response } from "express";

import product from "./product";
import user from "./user";
import order from "./order";
import backup from "./backup";

const routes = Router()

routes.use(cors());

routes.use("/product", product);
routes.use("/user", user);
routes.use("/order", order);
routes.use("/backup", backup);

routes.use((req: Request, res: Response) => res.json({ error: "Requisição desconhecida" }));

export default routes;
