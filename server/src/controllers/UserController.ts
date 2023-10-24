import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from "../entities/User";
import { Historic } from "../entities/Historic";



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

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const idUser: any = req.params.uuid;
        const userRepository = AppDataSource.getRepository(User);
        const findUser = await userRepository.findOneBy({ id: idUser });
      
        if (!findUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const removedUser = await userRepository.remove(findUser);

        const historicRepository = AppDataSource.getRepository(Historic);
        const historicRecord = new Historic();
        historicRecord.action = `User with ID ${findUser.id} deleted`;
        historicRecord.timestamp = new Date();
        historicRecord.entityType = "User";
        await historicRepository.save(historicRecord);
        return res.json(removedUser);
      }


}
export default new UserController();