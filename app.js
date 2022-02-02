// Criando uma pequena aplicação para realizar cadastro de produtos. Uma rota para cadastro, outra pra o delete, outra para alteração.

const express = require('express');
const { randomUUID } = require("crypto");
const { response } = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// Array para inserção dos produtos

let products = [];

// Inseriando as informações do 'Banco de Dados" criado e inserido elas no array

fs.readFile('products.json', 'utf-8', (err, data) => {
  if(err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});

/* POST => Inserir um dado
  GET => Buscar um ou mais dados
  PUT => ALterar dados
  DELETE => Remover um dado
*/

/* 
  Body => Enviar dados para a aplicação
  Params => /product/6516164616
  Query => Fazem parte da rota mas não sao obrigatorios
*/

// Criando uma rota para criação de produtos

app.post("/products", (req, res) => {
  // Nome e preço

  const { name, price } = req.body;  

  const product = { 
    name,
    price,
    id: randomUUID(),
  }

  products.push(product);

  productFile()

  return res.json(product);
});

// Criando uma rota para listar todos os produtos

app.get('/products', (req, res) => {
  return res.json(products);
});

// Criando uma rota para retornar o produto pelo ID do mesmo

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((product) => product.id === id);

  return res.json(product);
});

// Criando uma rota para alterar aguma informação contida dentro do array

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);
  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  productFile();

  return res.json({ message: "Produto alterado com sucesso" });
});

// Criando uma rota para deletar informação contidas no array de produtos

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  const productIndex = products.findIndex((product) => product.id === id);

  products.splice(productIndex, 1);

  productFile();

  return res.json({ message: "Produto removido com sucesso" });
})

// Utilizando o File System para simular um Banco de Dados

function productFile() {
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Produto inserido');
    }
  });
}

app.listen(4002, () => console.log("Servidor esta rodando na porta 4002"));
