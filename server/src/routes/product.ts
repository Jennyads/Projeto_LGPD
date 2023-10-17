import { Router } from "express";
import { ProductController as ProductController } from "../controllers";
const routes = Router();

routes.get('/historic', ProductController.getHistoricProduct);
routes.get('/specific/:uuid', ProductController.getProduct);

routes.post('/create', ProductController.postProduct);

routes.put('/modify/:uuid', ProductController.putProduct);

routes.delete('/delete/:uuid', ProductController.deleteProduct);
export default routes;

