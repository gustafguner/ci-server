import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.json({ success: true });
});

app.post('/ci', (req, res) => {
  console.log('Request body: ', req.body);
  res.status(202);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
