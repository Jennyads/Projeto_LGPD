import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from "../entities/User";
import { Historic } from "../entities/Historic";
import { createConnection, Connection } from 'mysql2/promise';


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

    public async postUser(req: Request, res: Response): Promise<Response> {
        const createUser = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const insertUser = new User();
        insertUser.userName = createUser.userName;
        insertUser.userCpf = createUser.userCpf;
        insertUser.userEmail = createUser.userEmail;
        insertUser.userAddress = createUser.userAddress;
        console.log(insertUser)
    
        // Construa a instrução SQL para inserir o usuário na tabela "user" (seu banco de dados principal)
        const userSqlStatement = `
            INSERT INTO user (userName, userCpf, userEmail, userAddress)
            VALUES ('${insertUser.userName}', '${insertUser.userCpf}', '${insertUser.userEmail}', '${insertUser.userAddress}')
        `;
    
        try {
            // Execute a instrução SQL principal para inserir o usuário na tabela "user"
            const allUser = await userRepository.save(insertUser);
            console.log(allUser)
    
            // Estabeleça uma segunda conexão com o banco de dados de registro
            const logConnection: Connection = await createConnection({
                host: 'localhost',
                user: 'root',
                password: 'africas2lucas',
                database: 'registros',
            });
    
            // Construa a instrução SQL para registrar a ação na tabela de logs
            const logSqlStatement = `
                INSERT INTO sql_log (timestamp, sql_statement, applied)
                VALUES (NOW(), '${userSqlStatement.replace(/'/g, "''")}', false)
            `;
            console.log(logSqlStatement)
    
            // Abra a conexão com o banco de dados de registros
            await logConnection.connect();
    
            // Registre a instrução SQL no log no banco de dados de registros
            await logConnection.query(logSqlStatement);
    
            // Feche a conexão com o banco de dados de registros
            await logConnection.end();
    
            return res.json(allUser);
        } catch (error) {
            console.log(error)
            // Lide com erros
            return res.status(500).json({ error: "Erro ao inserir usuário." });
        }
    }
    
    public async getUnappliedLogs(req: Request, res: Response): Promise<Response> {
        try {
            // Estabeleça uma conexão com o banco de registros
            const logConnection: Connection = await createConnection({
                host: 'localhost',
                user: 'root',
                password: 'africas2lucas',
                database: 'registros',
            });
    
            // Construa a instrução SQL para selecionar registros com "applied" igual a false
            const selectSqlStatement = `
                SELECT * FROM sql_log WHERE applied = false
            `;
    
            // Abra a conexão com o banco de registros
            await logConnection.connect();
    
            // Execute a instrução SQL para obter os registros não aplicados
            const [rows] = await logConnection.query(selectSqlStatement);
    
            // Feche a conexão com o banco de registros
            await logConnection.end();
    
            return res.json(rows);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao buscar registros não aplicados." });
        }
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