const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sei3l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    // console.log('connection error', err);
  const orderCollection = client.db("bloomitdb").collection("orders");
  const productCollection = client.db("bloomitdb").collection("products");


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product ', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
        // console.log('inserted count ',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.get('/products', (req, res) => {
  // console.log('working');
  productCollection.find()
  .toArray((err, items) => {
      // console.log(err);
      // console.log('working 2');
      res.send(items)
      // console.log('from database',items);
  })
})

    app.get('/orders', (req, res) => {
        // console.log('working');
        orderCollection.find()
        .toArray((err, items) => {
            console.log(err);
            // console.log('working 2');
            res.send(items)
            // console.log('from database',items);
        })
    })

  app.post('/addOrder', (req, res) => {
      const newOrder = req.body;
      console.log('adding new product ', newOrder);
      orderCollection.insertOne(newOrder)
      .then(result => {
          console.log('inserted count ',result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })


  app.delete('/deleteItem/:id',(req,res) => {
    const Id = ObjectID(req.params.id);
    console.log("delete this",  Id);
    productCollection.deleteOne({_id: Id})
    .then(documents => {
      console.log(documents.deletedCount);
      res.send(documents)
    })
  });



  // app.delete('deleteItem/:id', (req, res) => {
  //   const id = ObjectID(req.params.id);
  //   console.log('delete item', id);
  //   orderCollection.findOneAndDelete({_id: id})
  //   .then(documents => res.send(!!documents.value))
  // })
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})