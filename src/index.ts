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
  const cloneUrl: string = req.body.repository.clone_url;
  const commitId: string = req.body.head_commit.id;

  console.log('Request body: ', req.body);

  console.log(`Clone URL: ${cloneUrl}`);
  console.log(`Commit ID: ${commitId}`);

  res.status(202);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
