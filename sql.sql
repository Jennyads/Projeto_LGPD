CREATE DATABASE IF NOT EXISTS shopping;
USE shopping;

DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS transacao;

CREATE TABLE cliente(
    id int auto_increment primary key,
    nome varchar(50) not null,
    email varchar(50) not null unique,
    senha varchar(100) not null,
    telefone varchar(20) not null,
    infoAdicional varchar(100) not null
) ENGINE=INNODB;

CREATE TABLE produto(
    id int auto_increment primary key,
    nome varchar(50) not null,
    preco float(50) not null,
    infoAdicional varchar(100) not null
) ENGINE=INNODB;

CREATE TABLE transacao(
    id int auto_increment primary key,
    valorTotal float(50) not null,
    descricao varchar(300) not null,
    data varchar(50) not null,
    infoAdicional varchar(100) not null

    -- produtos []produto

    -- cliente_id int not null,
    -- FOREIGN KEY (cliente_id)
    -- REFERENCES cliente(id)
    -- ON DELETE CASCADE
) ENGINE=INNODB;
