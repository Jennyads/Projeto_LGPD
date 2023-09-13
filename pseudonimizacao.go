package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

// Definir uma estrutura de dados para representar informações do cliente
type Cliente struct {
	ID            int
	Nome          string
	Email         string
	Telefone      string
	InfoAdicional string
}

// Definir uma estrutura de dados para representar informações de produtos
type Produto struct {
	ID            int
	Nome          string
	Preco         float64
	InfoAdicional string
}

// Definir uma estrutura de dados para representar informações de transações
type Transacao struct {
	ID            int
	ClienteID     string // O ID do cliente pseudominizado
	Produtos      []Produto
	ValorTotal    float64
	Descricao     string
	Data          string
	InfoAdicional string
}

// Função para calcular o hash SHA-256 de uma string e retornar uma representação hexadecimal
func calcularHashSHA256(str string) string {
	hash := sha256.Sum256([]byte(str))
	return hex.EncodeToString(hash[:])
}

// Função para pseudominizar o ID do cliente
func pseudominizarIDCliente(id int) string {
	return calcularHashSHA256(fmt.Sprintf("%d", id))
}

// Função para inserir uma transação no banco de dados
func inserirTransacao(db *sql.DB, clienteID string, descricao string, valorTotal float64, data string, infoAdicional string) error {
	_, err := db.Exec("INSERT INTO transacoes (cliente_id, descricao, valor_total, data, info_adicional) VALUES (?, ?, ?, ?, ?)",
		clienteID, descricao, valorTotal, data, infoAdicional)
	if err != nil {
		return err
	}

	// Observe que esta função não insere os detalhes dos produtos da transação neste exemplo,
	// mas você pode adaptá-la para fazer isso se necessário.

	return nil
}

// Função para contar a quantidade de transações de um cliente pelo ID pseudominizado
func contarTransacoesCliente(db *sql.DB, clienteID string) (int, error) {
	var quantidade int
	err := db.QueryRow("SELECT COUNT(*) FROM transacoes WHERE cliente_id = ?", clienteID).Scan(&quantidade)
	if err != nil {
		return 0, err
	}
	return quantidade, nil
}

func main() {
	// Conectar ao banco de dados MySQL
	db, err := sql.Open("mysql", "usuario:senha@tcp(servidor:porta)/banco_de_dados")
	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}
	defer db.Close()

	// Capturar informações do cliente a partir da entrada do usuário
	var nomeCliente, emailCliente, telefoneCliente string
	fmt.Print("Informe o nome do cliente: ")
	fmt.Scan(&nomeCliente)
	fmt.Print("Informe o email do cliente: ")
	fmt.Scan(&emailCliente)
	fmt.Print("Informe o telefone do cliente: ")
	fmt.Scan(&telefoneCliente)

	// Criar um cliente com informações fornecidas pelo usuário
	cliente := Cliente{
		Nome:     nomeCliente,
		Email:    emailCliente,
		Telefone: telefoneCliente,
	}

	// Inserir o cliente no banco de dados
	if _, err := db.Exec("INSERT INTO clientes (nome, email, telefone, info_adicional) VALUES (?, ?, ?, ?)",
		cliente.Nome, cliente.Email, cliente.Telefone, cliente.InfoAdicional); err != nil {
		log.Fatal("Erro ao inserir o cliente no banco de dados:", err)
	}

	fmt.Println("Cliente inserido com sucesso no banco de dados!")

	// Pseudominizar o ID do cliente usando SHA-256
	clienteIDPseudominizado := pseudominizarIDCliente(cliente.ID)

	// Capturar informações da transação a partir da entrada do usuário
	var descricaoTransacao, dataTransacao, infoAdicionalTransacao string
	var valorTotalTransacao float64
	fmt.Print("Informe a descrição da transação: ")
	fmt.Scan(&descricaoTransacao)
	fmt.Print("Informe o valor total da transação: ")
	fmt.Scan(&valorTotalTransacao)
	fmt.Print("Informe a data da transação (no formato YYYY-MM-DD): ")
	fmt.Scan(&dataTransacao)
	fmt.Print("Informe informações adicionais da transação (em formato JSON): ")
	fmt.Scan(&infoAdicionalTransacao)

	// Inserir a transação no banco de dados com o cliente pseudominizado
	if err := inserirTransacao(db, clienteIDPseudominizado, descricaoTransacao, valorTotalTransacao, dataTransacao, infoAdicionalTransacao); err != nil {
		log.Fatal("Erro ao inserir a transação no banco de dados:", err)
	}

	fmt.Println("Dados da transação inseridos com sucesso no banco de dados MySQL!")

	// Contar a quantidade de transações do cliente pelo ID pseudominizado
	quantidadeTransacoes, err := contarTransacoesCliente(db, clienteIDPseudominizado)
	if err != nil {
		log.Fatal("Erro ao contar as transações do cliente:", err)
	}

	fmt.Printf("Quantidade de transações do cliente: %d\n", quantidadeTransacoes)
}
