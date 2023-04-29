import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import genreRouter from './routes/genreRouter';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(genreRouter);

app.listen('3333', () => {
  console.log('App running on http://localhost:3333');
});
