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

                # Obtém os comandos SQL marcados como "aplicados" na tabela de logs
                cursor_registros.execute("SELECT sql_statement FROM sql_log WHERE applied = true;")
                applied_commands = [row[0] for row in cursor_registros.fetchall()]

                # Executa apenas os comandos marcados como "aplicados" na tabela de logs
                for sql_command in applied_commands:
                    if sql_command.strip():
                        try:
                            cursor_pedidos.execute(sql_command)
                        except Error as sql_error:
                            print(f"Erro ao executar o comando SQL: {sql_error}")
                            connection_pedidos.rollback()
                            connection_registros.rollback()
                
                # Confirma as alterações nos bancos de dados
                connection_pedidos.commit()
                connection_registros.commit()
                print("Backup restaurado com sucesso.")

    except Error as e:
        # Em caso de erro, realiza rollback em ambos os bancos de dados
        connection_pedidos.rollback()
        connection_registros.rollback()
        print(f"Erro ao restaurar o backup: {str(e)}")

    finally:
        # Restaura o modo de autocommit em ambos os bancos de dados
        connection_pedidos.autocommit = True
        connection_registros.autocommit = True

if __name__ == "__main__":
    try:
        connection_pedidos = mysql.connector.connect(
            host='localhost',
            database='pedidos',
            user='root',
            password='12345'
        )

        connection_registros = mysql.connector.connect(
            host='localhost',
            database='registros',
            user='root',
            password='12345'
        )

        backup_filename = 'backup.sql'

        # Função para fazer o restore do backup
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
