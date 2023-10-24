import { Router } from "express";
import { UserController as UserController } from "../controllers";
const routes = Router();

routes.get('/historic', UserController.getHistoricUser);
routes.get('/specific/:uuid', UserController.getUser);

routes.post('/create', UserController.postUser);

routes.put('/modify/:uuid', UserController.putUser);

routes.delete('/delete/:uuid', UserController.deleteUser);
export default routes;

