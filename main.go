package main

import (
	"database/sql"
	"encoding/json"
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
	ClienteID     int
	Produtos      []Produto
	ValorTotal    float64
	Descricao     string
	Data          string
	InfoAdicional string
}

// Função para inserir um cliente no banco de dados
func inserirCliente(db *sql.DB, cliente Cliente) error {
	_, err := db.Exec("INSERT INTO clientes (nome, email, telefone, info_adicional) VALUES (?, ?, ?, ?)", cliente.Nome, cliente.Email, cliente.Telefone, cliente.InfoAdicional)
	return err
}

// Função para inserir produtos no banco de dados
func inserirProdutos(db *sql.DB, produtos []Produto) error {
	for _, produto := range produtos {
		_, err := db.Exec("INSERT INTO produtos (nome, preco, info_adicional) VALUES (?, ?, ?)", produto.Nome, produto.Preco, produto.InfoAdicional)
		if err != nil {
			return err
		}
	}
	return nil
}

// Função para inserir uma transação no banco de dados
func inserirTransacao(db *sql.DB, transacao Transacao) error {
	_, err := db.Exec("INSERT INTO transacoes (cliente_id, descricao, valor_total, data, info_adicional) VALUES (?, ?, ?, ?, ?)",
		transacao.ClienteID, transacao.Descricao, transacao.ValorTotal, transacao.Data, transacao.InfoAdicional)
	if err != nil {
		return err
	}

	// Observe que esta função não insere os detalhes dos produtos da transação neste exemplo,
	// mas você pode adaptá-la para fazer isso se necessário.

	return nil
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
	if err := inserirCliente(db, cliente); err != nil {
		log.Fatal("Erro ao inserir o cliente no banco de dados:", err)
	}

	// Capturar informações dos produtos a partir da entrada do usuário
	var nomeProduto1, nomeProduto2 string
	var precoProduto1, precoProduto2 float64
	fmt.Print("Informe o nome do Produto 1: ")
	fmt.Scan(&nomeProduto1)
	fmt.Print("Informe o preço do Produto 1: ")
	fmt.Scan(&precoProduto1)
	fmt.Print("Informe o nome do Produto 2: ")
	fmt.Scan(&nomeProduto2)
	fmt.Print("Informe o preço do Produto 2: ")
	fmt.Scan(&precoProduto2)

	// Criar produtos com informações fornecidas pelo usuário
	produtos := []Produto{
		{
			Nome:  nomeProduto1,
			Preco: precoProduto1,
		},
		{
			Nome:  nomeProduto2,
			Preco: precoProduto2,
		},
	}

	// Inserir os produtos no banco de dados
	if err := inserirProdutos(db, produtos); err != nil {
		log.Fatal("Erro ao inserir os produtos no banco de dados:", err)
	}

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

	// Criar uma transação com informações fornecidas pelo usuário
	transacao := Transacao{
		ClienteID:     cliente.ID, // ID do cliente inserido no banco de dados
		Produtos:      produtos,
		ValorTotal:    valorTotalTransacao,
		Descricao:     descricaoTransacao,
		Data:          dataTransacao,
		InfoAdicional: infoAdicionalTransacao,
	}

	// Inserir a transação no banco de dados
	if err := inserirTransacao(db, transacao); err != nil {
		log.Fatal("Erro ao inserir a transação no banco de dados:", err)
	}

	fmt.Println("Dados inseridos com sucesso no banco de dados MySQL!")
}
