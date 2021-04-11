
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
const ProductData = require('./src/model/ProductData');
const Orderdata = require('./src/model/OrderData');

app.use(express.urlencoded({extended:true}));

app.use(bodyparser.json());

app.use(express.json());

app.use(cors());

username = 'admin';
password = 'admin';

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
}

app.post('/login', (req, res) => {
    let userData = req.body
    
      
        if (!username) {
          res.status(401).send('Invalid Username')
        } else 
        if ( password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = {subject: username+password}
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({token})
        }
      
});

app.get('/products', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    ProductData.find()
        .then(function(products){
            res.send(products);
        });
});

app.get('/orders', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    Orderdata.find()
    .then(function(orders){
        res.send(orders);
    })
})

app.post('/insert', verifyToken ,function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');
    // console.log(req.body);
    var product = {
        productId : req.body.product.productId,
        productName : req.body.product.productName,
        productCode : req.body.product.productCode,
        description : req.body.product.description,
        price : req.body.product.price,
        starRating : req.body.product.starRating,
        image : req.body.product.image
    }
    var product = new ProductData(product);
    product.save();

});

app.post('/orderInsert', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');
    var p = req.body.product.price * req.body.order.qty ;
    // console.log(p);
    var order = {
        productId : req.body.product.productId,
        productName : req.body.product.productName,
        totalPrice : p,
        qty : req.body.order.qty,
        name : req.body.order.name,
        address : req.body.order.address,
        pin : req.body.order.pin,
        mobile: req.body.order.mobile
    }
    var order = new Orderdata(order);
    order.save(function(err,data){
        res.send(data._id);
    });
});

app.get('/single', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    const id = req.query.i;
    ProductData.findOne({_id:id})
    .then(function(product){
        res.send(product);
    })

});

app.get('/singleOrder', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    const id = req.query.i;
    Orderdata.findOne({_id:id})
    .then(function(order){
        res.send(order);
    })

});

app.delete('/remove/:id',(req,res)=>{
    id = req.params.id;
    ProductData.findByIdAndDelete({"_id":id})
    .then(()=>{
        res.send();
    })
})

app.post('/update/:i', function(req,res){
    console.log('done');
    var id = req.params.i
    var item = { $set : req.body.product }
    ProductData.updateOne({_id:id}, item,{ strict:false }, function(err,result) {
        if (err) {
            console.log(err);
        } else {
            res.send();
        }
    });
});

app.listen(5000, () => {console.log("server ready at 5000")});