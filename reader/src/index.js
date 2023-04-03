import express from 'express';
import router from './routes/index.js';
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(router);

app.listen(process.env.PORT || 3000);

console.log('Server on port 3000');
