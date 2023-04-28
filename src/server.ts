import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send('Hello World');
});

app.listen('3333', () => {
  console.log('App running on http://localhost:3333');
});
