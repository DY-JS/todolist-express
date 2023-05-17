import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todosRoutes.js';

const app = express();

app.use(cors()); //политика cors применяется ко всему приложению
app.use('/todos', express.json(), todosRouter); //'/todos', express.json(), -префиксы для всех роутов todos уже не надо писать
//app.use( todosRouter ); //'/todos', express.json(), нужно писать во всех роутах

app.listen(8080);
