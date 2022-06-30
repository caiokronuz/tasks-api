import express from 'express';
import routes from './routes.js'; 
import bodyParser from 'body-parser';

const app = express();

app.use(routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3333, () => {
    console.log("server running")
});