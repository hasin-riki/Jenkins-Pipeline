const express=require('express');
const app=express();
require('dotenv').config();
const cors=require('cors');
const helmet=require('helmet');
const mongoose=require('mongoose');
const ProductRoutes=require('./src/routes/productRoutes');
const ReviewRoutes=require('./src/routes/reviewRoutes');
const checkout=require('./src/controllers/checkoutController');

app.use(express.json());

app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ['GET','POST','PUT','PATCH','DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);

app.use(helmet());

app.disable('x-powered-by');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_LINK).then(()=>{
    console.log("Connected to Mongodb...")
    const port = process.env.PORT || 3000;
    app.listen(port, ()=>{
        console.log("Node running on assigned port...");
    });
}).catch((error)=>{
    console.log(error);
});

//routes
app.get('/',(req,res)=>{
    res.send('Jenkins : Pipeline');
});

app.get('/success',(req,res)=>{
    res.send('Payment successful');
});

app.get('/cancel',(req,res)=>{
    res.send('Payment Cancelled');
});

app.get('/health', (req, res) => {
    const data = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date()
    }
  
    res.status(200).send(data);
});

app.use('/', ProductRoutes);

app.use('/', ReviewRoutes);

app.post('/checkout/:price/:quantity', checkout);