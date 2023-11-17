import mysql.connector
from mysql.connector import Error

def restore_backup(connection, backup_filename):
    try:
        with open(backup_filename, 'r') as backup_file:
            sql_commands = backup_file.read().split(';')

            with connection.cursor() as cursor:
                # Desative o modo de autocommit para iniciar uma transação
                connection.autocommit = False

                # Inicia explicitamente uma transação
                cursor.execute("START TRANSACTION;")

                # Executa cada comando SQL individualmente
                for sql_command in sql_commands:
                    if sql_command.strip():
                        cursor.execute(sql_command)

                # Confirma as alterações e fecha a transação
                connection.commit()
                print("Backup restaurado com sucesso.")

                # Execução dos comandos SQL 
                update_script = """
                    UPDATE pedidos.user
                    SET
                        id = registros.sql_log.id
                    WHERE
                        registros.sql_log.sql_statement LIKE '%DELETE FROM user%'
                        AND registros.sql_log.applied = 0;

                    UPDATE registros.sql_log
                    SET applied = 1
                    WHERE sql_statement LIKE '%DELETE FROM user%'
                    AND applied = 0;

                    DELETE FROM pedidos.user
                    WHERE id IN (
                        SELECT id
                        FROM registros.sql_log
                        WHERE sql_statement LIKE '%INSERT INTO user%'
                        AND applied = 0
                    );

                    UPDATE registros.sql_log
                    SET applied = 1
                    WHERE sql_statement LIKE '%INSERT INTO user%'
                    AND applied = 0;
                """

                cursor.execute(update_script)

                # Confirma as alterações após a execução do script de atualização
                connection.commit()
                print("Script executado com sucesso.")

    except Error as e:
        # Em caso de erro, realiza rollback
        connection.rollback()
        print(f"Erro ao restaurar o backup: {str(e)}")

    finally:
        # Restaura o modo de autocommit
        connection.autocommit = True

if __name__ == "__main__":
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='pedidos',
                                             user='root',
                                             password='12345')

        backup_filename = 'backup.sql'

        # Função para fazer o restore do backup e executar o script de atualização
        restore_backup(connection, backup_filename)

    except Error as e:
        print(f"Erro ao conectar ao MySQL: {str(e)}")

    finally:
        if connection.is_connected():
            connection.close()
            print("Conexão encerrada.")
