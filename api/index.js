import express from 'express';
import cors from 'cors';

import * as poolController from './controllers/pool.controller.js';
import * as optionController from './controllers/option.controller.js';
import * as voteController from './controllers/vote.controller.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/createPool', poolController.create);
app.post('/updatePool', poolController.update);
app.get('/pools', poolController.list);

app.post('/createOption', optionController.create);

app.post('/vote', voteController.create);

app.listen(3000, () => console.log('Server running on 3000'));