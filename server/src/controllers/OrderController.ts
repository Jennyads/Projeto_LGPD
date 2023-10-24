import AppDataSource from "../data-source"
import { Request, Response } from 'express';
import { Order } from "../entities/Order";

class OrderController {

    public async getHistoric (req: Request, res: Response) : Promise<Response> {
        const orderRepository = AppDataSource.getRepository(Order)
        const allOrder = await orderRepository.find()
        console.log(allOrder)
        return res.json(allOrder)
    }

    public async getOrderByOne (req: Request, res: Response) : Promise<Response> {
        const idOrder:any = req.params.uuid
        const orderRepository = AppDataSource.getRepository(Order)
        const allOrder = await orderRepository.find({relations: { product: true },
            where: {
                product: { id: idOrder },
            },}) //{id: idOrder}
        return res.json(allOrder)
    }


    public async postOrder (req: Request, res: Response) : Promise<Response> {
        const createOrder = req.body
        const orderRepository = AppDataSource.getRepository(Order)
        const insertOrder = new Order();
        insertOrder.product = createOrder.product
        insertOrder.user = createOrder.user


        const allOrder = await orderRepository.save(insertOrder)
        return res.json(allOrder)
    }

    public async putGroup (req: Request, res: Response) : Promise<Response> {
        const createOrder = req.body
        const idOrder:any = req.params.uuid
        const orderRepository = AppDataSource.getRepository(Order)
        const findOrder = await orderRepository.findOneBy({id: idOrder})
        findOrder.product = createOrder.product
        findOrder.user = createOrder.user
       
    
        const allOrder = await orderRepository.save(findOrder)
        return res.json(allOrder)
    }

    public async deleteGroup (req: Request, res: Response) : Promise<Response> {
        const idOrder:any = req.params.uuid
        const orderRepository = AppDataSource.getRepository(Order)
        const findOrder = await orderRepository.findOneBy({id: idOrder})
        const allOrder = await orderRepository.remove(findOrder)
        return res.json(allOrder)
    }

}
export default new OrderController();
