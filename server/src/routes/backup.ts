import { Router } from "express";
import { UserController as UserController } from "../controllers";
import backupController from "../controllers/backupController";
const routes = Router();



// routes.get('/insert', backupController.getBackup);
routes.get("/logs", backupController.getSqlLog);


export default routes;