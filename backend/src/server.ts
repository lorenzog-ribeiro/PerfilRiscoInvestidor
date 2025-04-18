import { Router, Request, Response } from 'express';
import router from './questions/router';
import express from 'express'
import cors from 'cors';

const app = express();

const route = Router()
app.use(cors());
app.use(express.json())
app.use('/', router);

app.use(route)

route.get('/questions', (req: Request, res: Response) => {
    res.json({ message: 'hello world with Typescript' })
})

app.listen(3333, () => 'server running on port 3333')


