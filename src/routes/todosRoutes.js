import express from 'express';
import * as todoController from '../controllers/todos.js';

const router = express.Router();
router.get('/', todoController.getAll);
router.get('/:todoId', todoController.getOne);

router.post('/', express.json(), todoController.add);
router.delete('/:todoId', todoController.remove);
//put - полностью обновляет конкретный todo
// при put передаются все свойства { title, completed } = req.body
router.put('/:todoId', express.json(), todoController.update);

//patch - частично обновляет конкретный todo или несколько todo
//  { "ids": ["1", "2"]}
// router.patch('/', express.json(), (req, res) => {
//   const { action } = req.query; //query параметр после ? (/todos?action=delete)
//   //запрос localhost:8080/todos?action=delete body -  { "ids": ["1", "2"]}
//   if (action === 'delete') {
//     todoController.removeMany(req, res);
//     return;
//   }
//запрос localhost:8080/todos?action=updatete body -  { "items":
//[ { "id": "3", "title": "Study CSS", "completed": false },
// {"id": "4", "title": "Study Redux", "completed": false } ]
//   if (action === 'update') {
//     todoController.updateMany(req, res);
//     return;
//   }

//   res.sendStatus(400); //Bad Request - ecли придёт неизвестный action из req.query
// });

//Перепишем patch используя доп. middleware hasAction
//  и в зависимости от экшена будем выполнять patch todoService.removeMany или updateMany
const hasAction = (action) => {
  return (req, res, next) => {
    if (req.query.action === action) {
      next(); //перейдёт к контроллеру в цепочке текущего метода
    } else {
      //перейдёт следующему роуту
      next('route');
    }
  };
};
//запрос localhost:8080/todos?action=delete body -  { "ids": ["1", "2"]}
router.patch('/', hasAction('delete'), todoController.removeMany);
//запрос localhost:8080/todos?action=updatete body -  { "items":
//   //[ { "id": "3", "title": "Study CSS", "completed": false },
//   // {"id": "4", "title": "Study Redux", "completed": false } ]
router.patch('/', hasAction('update'), todoController.updateMany);

export default router;

//  patch упрощённый - без массива ошибок если не найден эл-т
// app.patch('/todos', express.json(), (req, res) => {
//   const { action } = req.query; //query параметр после ? (/todos?action=delete)
//   //запрос localhost:8080/todos?action=delete body -  { "ids": ["1", "2"]}
//   if (action === 'delete') {
//     const { ids } = req.body; //в body передаётся массив с id для последующей собработки

//     if (!Array.isArray(ids)) {
//       //если ids это не массив
//       res.sendStatus(422);
//     }

//     todoService.removeMany(ids);
//     res.sendStatus(204); //No Content
//     return;
//   }

//   //запрос localhost:8080/todos?action=updatete body -  { "items":
//   //[ { "id": "3", "title": "Study CSS", "completed": false },
//   // {"id": "4", "title": "Study Redux", "completed": false } ]
//   if (action === 'update') {
//     const { items } = req.body;

//     if (!Array.isArray(items)) {
//       //если ids это не массив
//       res.sendStatus(422); //Unprocessable Entity
//     }

//     todoService.updateMany(items);

//     res.sendStatus(200);
//     return;
//   }

//   res.sendStatus(400); //Bad Request - ecли придёт неизвестный action из req.query
// });
