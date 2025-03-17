const express = require('express');
const {ServerConfig, DB_Config} = require('./config');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRoutes = require('./routes');
const {ErrorHandler} = require('./middlewares');

const app = express();

DB_Config();

app.use(cors({
    origin:'http://localhost:5173/',
    methods: ['GET' ,'POST', 'DELETE', 'PUT'],
    allowedHeaders:[
        'Content-Type',
        'Authorization',
        'Cache-control',
        'Expires',
        'Pragma'
    ],
    credentials: true// allows us to login and register
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

//API Routes
app.use('/api', apiRoutes);

app.use(ErrorHandler)


app.listen(ServerConfig.PORT, ()=>{
    console.log(`App is running on Port: http://localhost:${ServerConfig.PORT}`);
    
})
