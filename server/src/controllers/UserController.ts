import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from "../entities/User";
import { Historic } from "../entities/Historic";
import { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import { Address } from "../entities/Address";
import { PhoneNumber } from "../entities/PhoneNumber";

class UserController {

    public async getHistoricUser(req: Request, res: Response): Promise<Response> {
        const userRepository = AppDataSource.getRepository(User)
        const allUser = await userRepository.find()
        console.log(allUser)
        return res.json(allUser)
    }

    public async getUser(req: Request, res: Response): Promise<Response> {
        const idUser: any = req.params.uuid
        const userRepository = AppDataSource.getRepository(User)
        const allUser = await userRepository.findOneBy({ id: idUser })
        return res.json(allUser)
    }

    public async postUser(req: Request, res: Response): Promise<Response> {
        const createUser = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const addressRepository = AppDataSource.getRepository(Address);
        const phoneNumberRepository = AppDataSource.getRepository(PhoneNumber);

        const insertUser = new User();
        insertUser.userName = createUser.userName;
        insertUser.userCpf = createUser.userCpf;
        insertUser.userEmail = createUser.userEmail;
        insertUser.dateCreate = new Date();

        const insertAddress = new Address();
        insertAddress.street = createUser.userAddress.street;
        insertAddress.city = createUser.userAddress.city;
        insertAddress.neighborhood = createUser.userAddress.neighborhood;
        insertAddress.number = createUser.userAddress.number;
        insertAddress.country = createUser.userAddress.country;
        insertAddress.cep = createUser.userAddress.cep;

        // Handle phone numbers
        const insertPhoneNumber = new PhoneNumber();
        insertPhoneNumber.ddd = createUser.phoneNumbers[0].ddd;
        insertPhoneNumber.number = createUser.phoneNumbers[0].number;

        // Save the phone number and assign it to the user
        const savedPhoneNumber = await phoneNumberRepository.save(insertPhoneNumber);
        insertUser.phoneNumbers = [savedPhoneNumber];

        // Save the user first to generate an ID
        // Remove this line => await userRepository.save(insertUser);

        // Assign the user to the address
        insertAddress.user = insertUser;

        // Save the address
        const savedAddress = await addressRepository.save(insertAddress);

        // Update the user's address
        insertUser.address = savedAddress;

        // Construct the SQL statement to insert the user
        const userSqlStatement = `
        INSERT INTO user (userName, userCpf, userEmail, address, phoneNumber)
        VALUES ('${insertUser.userName}', '${insertUser.userCpf}', '${insertUser.userEmail}', '${insertUser.address.id}', '${insertUser.phoneNumbers[0].id}')`;

        try {
            // Execute the SQL statement to insert the user
            await userRepository.save(insertUser);

            // Establish a second connection to the logging database
            const logConnection: Connection = await createConnection({
                host: 'localhost',
                user: 'root',
                password: '12345',
                database: 'registros',
            });

            const userId = insertUser.id; // Assuming ID is stored in the "id" property
            const userSqlStatement = `INSERT INTO user (id) VALUES (${userId})`;

            // Construct the SQL statement to log the action
            const logSqlStatement = `
            INSERT INTO sql_log (timestamp, sql_statement, applied)
            VALUES (NOW(), '${userSqlStatement.replace(/'/g, "''")}', false)
        `;

            // Open the connection to the logging database
            await logConnection.connect();

            // Log the SQL statement in the logging database
            await logConnection.query(logSqlStatement);

            // Close the connection to the logging database
            await logConnection.end();

            return res.json(insertUser);
        } catch (error) {
            console.error(error);
            // Handle errors
            return res.status(500).json({ error: "Erro ao inserir usuário." });
        }
    }



    public async putUser(req: Request, res: Response): Promise<Response> {
        const createUser = req.body
        const idUser: any = req.params.uuid
        const userRepository = AppDataSource.getRepository(User)
        const findUser = await userRepository.findOneBy({ id: idUser })
        findUser.userName = createUser.userName
        findUser.userCpf = createUser.userCpf
        findUser.userEmail = createUser.userEmail
        findUser.address = createUser.userAddress
        const allUser = await userRepository.save(findUser)
        return res.json(allUser)
    }

    // public async deleteUser(req: Request, res: Response): Promise<Response> {
    //     const idUser: any = req.params.uuid;
    //     const userRepository = AppDataSource.getRepository(User);
    //     const findUser = await userRepository.findOneBy({ id: idUser });

    //     if (!findUser) {
    //       return res.status(404).json({ message: "User not found" });
    //     }
    //     const removedUser = await userRepository.remove(findUser);

    //     const historicRepository = AppDataSource.getRepository(Historic);
    //     const historicRecord = new Historic();
    //     historicRecord.action = `User with ID ${findUser.id} deleted`;
    //     historicRecord.timestamp = new Date();
    //     historicRecord.entityType = "User";
    //     await historicRepository.save(historicRecord);
    //     return res.json(removedUser);
    //   }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const idUser: any = req.params.uuid;
        const userRepository = AppDataSource.getRepository(User);
        const findUser = await userRepository.findOne({ where: { id: idUser } });


        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Construa a instrução SQL para excluir o usuário da tabela "user"
        const userSqlStatement = `
            DELETE FROM user
            WHERE id = '${findUser.id}'
        `;

        try {
            // Execute a instrução SQL principal para excluir o usuário da tabela "user"
            const removedUser = await userRepository.remove(findUser);

            // Estabeleça uma segunda conexão com o banco de dados de registro
            const logConnection: Connection = await createConnection({
                host: 'localhost',
                user: 'root',
                password: 'africas2lucas',
                database: 'registros',
            });

            // Construa a instrução SQL para registrar a ação de exclusão na tabela de logs
            const logSqlStatement = `
                INSERT INTO sql_log (timestamp, sql_statement, applied)
                VALUES (NOW(), '${userSqlStatement.replace(/'/g, "''")}', false)
            `;

            // Abra a conexão com o banco de dados de registros
            await logConnection.connect();

            // Registre a instrução SQL no log no banco de dados de registros
            await logConnection.query(logSqlStatement);

            // Feche a conexão com o banco de dados de registros
            await logConnection.end();

            // Registre a ação no histórico
            const historicRepository = AppDataSource.getRepository(Historic);
            const historicRecord = new Historic();
            historicRecord.action = `User with ID ${findUser.id} deleted`;
            historicRecord.timestamp = new Date();
            historicRecord.entityType = "User";
            await historicRepository.save(historicRecord);

            return res.json(removedUser);
        } catch (error) {
            console.log(error);
            // Lide com erros
            return res.status(500).json({ error: "Erro ao excluir usuário." });
        }
    }

}
export default new UserController();