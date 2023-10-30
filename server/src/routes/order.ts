import { Router } from "express";
import { OrderController as OrderController } from "../controllers";
const routes = Router();

routes.get('/historic', OrderController.getHistoric);
routes.get('/specific/:uuid', OrderController.getOrderByOne);

routes.post('/create', OrderController.postOrder);

routes.put('/modify/:uuid', OrderController.putOrder);

routes.delete('/delete/:uuid', OrderController.deleteOrder);
export default routes;

