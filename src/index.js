import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todosRoutes.js';

const app = express();

app.use(cors()); //политика cors применяется ко всему приложению
app.use('/todos', express.json(), todosRouter); //'/todos', express.json(), -префиксы для всех роутов todos уже не надо писать
//app.use( todosRouter ); //'/todos', express.json(), нужно писать во всех роутах

app.listen(8080);

//app.use(cors()) //применяется ко всему приложению

// app.options('/todos', (req, res) => {
//   res.setHeader('Acceess-Control-Allow-Headers', 'Content-Type, X-Token');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Acceess-Control-Allow-Methods', 'DELETE'); //для предзапроса
// });

// app.get('/todos', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   //    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
//   res.setHeader('Acceess-Control-Allow-Headers', 'Content-Type, X-Token');
//   res.setHeader('Acceess-Control-Allow-Methods', 'DELETE');
//   res.send(todos);
// });
