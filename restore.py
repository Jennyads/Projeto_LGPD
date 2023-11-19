import mysql.connector
from mysql.connector import Error

def restore_and_update(connection_pedidos, connection_registros, backup_filename):
    try:
        with open(backup_filename, 'r') as backup_file:
            sql_commands = backup_file.read().split(';')

            with connection_pedidos.cursor() as cursor_pedidos, connection_registros.cursor() as cursor_registros:
                # Desative o modo de autocommit para iniciar uma transação
                connection_pedidos.autocommit = False
                connection_registros.autocommit = False

                # Inicia explicitamente uma transação
                cursor_pedidos.execute("START TRANSACTION;")
                cursor_registros.execute("START TRANSACTION;")

                # Executa cada comando SQL individualmente
                for sql_command in sql_commands:
                    if sql_command.strip():
                        cursor_pedidos.execute(sql_command)
                        cursor_registros.execute(sql_command)

                # Confirma as alterações e fecha a transação
                connection_pedidos.commit()
                connection_registros.commit()
                print("Backup restaurado com sucesso.")

                # Execução dos comandos SQL
                update_script = """
                    -- Atualização para pedidos.user
                    UPDATE pedidos.user
                    SET
                        id = registros.sql_log.id
                    WHERE
                        registros.sql_log.sql_statement LIKE '%DELETE FROM user%'
                        AND registros.sql_log.applied = 0;

                    -- Marca os registros como aplicados
                    UPDATE registros.sql_log
                    SET applied = 1
                    WHERE sql_statement LIKE '%DELETE FROM user%'
                    AND applied = 0;

                    -- Exclui registros de pedidos.user
                    DELETE FROM pedidos.user
                    WHERE id IN (
                        SELECT id
                        FROM registros.sql_log
                        WHERE sql_statement LIKE '%INSERT INTO user%'
                        AND applied = 0
                    );

                    -- Marca os registros como aplicados
                    UPDATE registros.sql_log
                    SET applied = 1
                    WHERE sql_statement LIKE '%INSERT INTO user%'
                    AND applied = 0;
                """

                cursor_pedidos.execute(update_script)

                # Confirma as alterações após a execução do script de atualização
                connection_pedidos.commit()
                connection_registros.commit()
                print("Script executado com sucesso.")

    except Error as e:
        # Em caso de erro, realiza rollback
        connection_pedidos.rollback()
        connection_registros.rollback()
        print(f"Erro ao restaurar o backup: {str(e)}")

    finally:
        # Restaura o modo de autocommit
        connection_pedidos.autocommit = True
        connection_registros.autocommit = True

if __name__ == "__main__":
    try:
        connection_pedidos = mysql.connector.connect(
            host='localhost',
            database='pedidos',
            user='root',
            password='africas2lucas'
        )

        connection_registros = mysql.connector.connect(
            host='localhost',
            database='registros',
            user='root',
            password='africas2lucas'
        )

        backup_filename = 'backup.sql'

        # Função para fazer o restore do backup e executar o script de atualização
        restore_and_update(connection_pedidos, connection_registros, backup_filename)

    except Error as e:
        print(f"Erro ao conectar ao MySQL: {str(e)}")

    finally:
        if connection_pedidos.is_connected():
            connection_pedidos.close()
            print("Conexão de pedidos encerrada.")
        
        if connection_registros.is_connected():
            connection_registros.close()
            print("Conexão de registros encerrada.")
