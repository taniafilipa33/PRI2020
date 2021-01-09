//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/shopList';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

var shopListSchema = new mongoose.Schema({
    product: String,
    quantity: Number,
    category: String
});

var shopListModel = mongoose.model('list', shopListSchema)

var data = [
    {
      "product": "bananas",
      "quantity": 6,
      "category": "fruit"
    },
    {
      "product": "sugar",
      "quantity": 2,
      "category": "grosseries"
    },
    {
      "product": "Apples",
      "quantity": 10,
      "category": "fruit"
    },
    {
      "product": "Carrots",
      "quantity": 8,
      "category": "vegetables"
    }
  ]

shopListModel.create(data)

console.log("That's all folks...")
