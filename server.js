const express = require('express');
// vai renderizar um id universal aleartorio 
const { randomUUID } = require('crypto');
const fs = require('fs')

const app = express();

// banco de dados fake
let products = [];
fs.readFile("products.json", "utf-8", (err, data) => {
   if (err) {
      console.log(err)
   } else {
      // vai ser transformado em um objeto
      products = JSON.parse(data)
   }
})
app.use(express.json());


app.post("/products", (request, response) => {
   const { name, price } = request.body;

   const product = {
      name,
      price,
      id: randomUUID(),
   };
   products.push(product)
   // @ts-ignore
   //  converte para json e o writeFile => ele pega o arquivo 

   productFile();
   return response.json(product)

});
app.get("/products", (request, response) => {


   return response.json(products)
});

app.get("/products/:id", (request, response) => {
   const { id } = request.params;
   const product = products.find(product => product.id === id);

   return response.json(product);
});
app.put("/products/:id", (request, response) => {
   // recuperou o id 
   const { id } = request.params;
   // recuperou o name e preço 
   const { name, price } = request.body;

   const productIndex = products.findIndex(product => product.id === id)

   //   acessou a posição que esta no banco fez um objeto sendo para ser trocado o id , name , price
   products[productIndex] = {

      ...products[productIndex],
      name,
      price,

   }

   productFile()

   return response.json({ message: "produto alterado com sucesso!'" });
});

app.delete("/products/:id", (request, response) => {
   const { id } = request.params;
   const productIndex = products.findIndex(product => product.id === id);

   products.splice(productIndex, 1);
   productFile()

   return response.json({ message: "produto removido com sucesso!" });
});

function productFile() {
   fs.writeFile("products.json", JSON.stringify(products), (err) => {
      if (err) {
         console.log(err)
      } else {
         console.log("produto inserido")
      }
   });
}


app.listen(4000)