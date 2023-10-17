import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from "../entities/User";


class UserController {

    public async getHistoricUser (req: Request, res: Response) : Promise<Response> {
        const userRepository = AppDataSource.getRepository(User)
        const allUser = await userRepository.find()
        console.log(allUser)
        return res.json(allUser)
    }

    public async getUser(req: Request, res: Response) : Promise<Response> {
        const idUser:any = req.params.uuid
        const userRepository = AppDataSource.getRepository(User)
        const allUser = await userRepository.findOneBy({id: idUser})
        return res.json(allUser)
    }

    public async postUser (req: Request, res: Response) : Promise<Response> {
        const createUser = req.body
        const userRepository = AppDataSource.getRepository(User)
        const insertUser = new User();
        insertUser.userName = createUser.userName
        insertUser.userCpf = createUser.userCpf
        insertUser.userEmail = createUser.userEmail
        insertUser.userAddress = createUser.userAddress
     
        const allUser = await userRepository.save(insertUser)
        return res.json(allUser)
    }

    public async putUser (req: Request, res: Response) : Promise<Response> {
        const createUser = req.body
        const idUser:any = req.params.uuid
        const userRepository = AppDataSource.getRepository(User)
        const findUser = await userRepository.findOneBy({id: idUser})
        findUser.userName = createUser.userName
        findUser.userCpf = createUser.userCpf
        findUser.userEmail = createUser.userEmail
        findUser.userAddress = createUser.userAddress
        const allUser = await userRepository.save(findUser)
        return res.json(allUser)
    }

    public async deleteUser (req: Request, res: Response) : Promise<Response> {
        const idUser:any = req.params.uuid
        const userRepository = AppDataSource.getRepository(User)
        const findUser = await userRepository.findOneBy({id: idUser})
        const allUser = await userRepository.remove(findUser)
        return res.json(allUser)
    }

}
export default new UserController();