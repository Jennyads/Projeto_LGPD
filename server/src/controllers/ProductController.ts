import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Product } from "../entities/Product";


class ProductController {

    public async getHistoricProduct (req: Request, res: Response) : Promise<Response> {
        const prodRepository = AppDataSource.getRepository(Product)
        const allProd = await prodRepository.find()
        console.log(allProd)
        return res.json(allProd)
    }

    public async getProduct (req: Request, res: Response) : Promise<Response> {
        const idProd:any = req.params.uuid
        const prodRepository = AppDataSource.getRepository(Product)
        const allProd = await prodRepository.findOneBy({id: idProd})
        return res.json(allProd)
    }

    public async postProduct (req: Request, res: Response) : Promise<Response> {
        const createProduct = req.body
        const prodRepository = AppDataSource.getRepository(Product)
        const insertProduct = new Product();
        insertProduct.prodTitle = createProduct.prodTitle
        insertProduct.prodDescription = createProduct.prodDescription
        insertProduct.prodPrice = createProduct.prodPrice
     
        const allProd = await prodRepository.save(insertProduct)
        return res.json(allProd)
    }

    public async putProduct (req: Request, res: Response) : Promise<Response> {
        const createProduct = req.body
        const idProd:any = req.params.uuid
        const prodRepository = AppDataSource.getRepository(Product)
        const findProduct = await prodRepository.findOneBy({id: idProd})
        findProduct.prodTitle = createProduct.prodTitle
        findProduct.prodDescription = createProduct.prodDescription
        findProduct.prodPrice = createProduct.prodPrice
        const allProd = await prodRepository.save(findProduct)
        return res.json(allProd)
    }

    public async deleteProduct (req: Request, res: Response) : Promise<Response> {
        const idProd:any = req.params.uuid
        const prodRepository = AppDataSource.getRepository(Product)
        const findProduct = await prodRepository.findOneBy({id: idProd})
        const allProd = await prodRepository.remove(findProduct)
        return res.json(allProd)
    }

}
export default new ProductController();