import { Request, Response } from 'express';
import { User } from '../entities/User';
import { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import { getRepository } from 'typeorm';


class BackupController {
  // public async getBackup(req: Request, res: Response): Promise<Response> {
  //   try {
  //     // Estabeleça a conexão com o banco de dados "pedidos"
  //     const pedidosConnection: Connection = await createConnection({
  //       host: 'localhost',
  //       user: 'root',
  //       password: 'africas2lucas',
  //       database: 'pedidos',
  //     });

  //     // 1. Importação do Backup para a tabela "user" em "pedidos"
  //     const userRepository = getRepository(User);
  //     const usuariosPedidos = await userRepository.find();
  //     console.log(usuariosPedidos);


  //     // 2. Verificação e Remoção
  //     const registrosConnection: Connection = await createConnection({
  //       host: 'localhost',
  //           user: 'root',
  //           password: 'africas2lucas',
  //           database: 'registros',
  //       });

  //     const usuariosSqlLog = await registrosConnection.query('SELECT id FROM sql_log');

  //     // Para cada usuário em "pedidos", verifique se está presente em "sql_log"
  //     for (const usuarioPedido of usuariosPedidos) {
  //       const usuarioId = usuarioPedido.id;

  //       // Se o usuário não estiver presente em "sql_log", remova-o de "pedidos"
  //       if (!usuariosSqlLog.some((usuarioSqlLog: { id: number }) => usuarioSqlLog.id === usuarioId)) {
  //         await pedidosConnection.query(`DELETE FROM user WHERE id = ${usuarioId}`);
  //       }
        
  //     }

  //     // Feche as conexões
  //     await pedidosConnection.end();
  //     await registrosConnection.end();

  //     return res.json({ message: 'Backup importado e verificado com sucesso.' });
  //   } catch (error) {
  //     console.error('Ocorreu um erro:', error);
  //     return res.status(500).json({ error: 'Erro ao importar e verificar o backup.' });
  //   }
  // }
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
public async getSqlLog(req: Request, res: Response): Promise<Response> {
  try {
    // Cria uma conexão com o banco de dados "registros"
    const registrosConnection: Connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: 'africas2lucas',
      database: 'registros',
    });

    // Construa a instrução SQL para selecionar colunas específicas
    const selectSqlStatement = `
      SELECT id, timestamp, sql_statement, applied
      FROM sql_log
    `;

    // Abra a conexão com o banco de registros
    await registrosConnection.connect();

    // Execute a instrução SQL para obter os registros
    const [rows] = await registrosConnection.query(selectSqlStatement);

    // Feche a conexão com o banco de registros
    await registrosConnection.end();

    // Retorna os dados obtidos como resposta JSON
    return res.json(rows);
  } catch (error) {
    console.error('Ocorreu um erro:', error);
    return res.status(500).json({ error: 'Erro ao obter dados da tabela sql_log.' });
  }
}

}


export default new BackupController();
