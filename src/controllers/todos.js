import * as todoService from '../services/todos.js';

export const getAll = (req, res) => {
  const todos = todoService.getAll();
  res.send(todos);
};

export const getOne = (req, res) => {
  const { todoId } = req.params; //:todoId - это параметры после двоеточия
  const foundTodo = todoService.getById(todoId);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(foundTodo);
};

export const add = (req, res) => {
  const { title } = req.body;

  const newTodo = todoService.create(title);

  res.statusCode = 201; //Created
  res.send(newTodo);
};

export const remove = (req, res) => {
  const { todoId } = req.params;
  const todoForRemove = todoService.getById(todoId);

  if (!todoForRemove) {
    res.sendStatus(404);
    return;
  }

  todoService.remove(todoId);
  res.sendStatus(204); //No content
};

export const update = (req, res) => {
  const { todoId } = req.params; //параметр после /
  const foundTodo = todoService.getById(todoId);
  //если не найден с таким id
  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  const { title, completed } = req.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422); //если некорректные данные
    return;
  }

  todoService.update({ id: todoId, title, completed });

  res.send(foundTodo);
};

//запрос localhost:8080/todos?action=delete body -  { "ids": ["1", "2"]} удалить несколько сразу
export const removeMany = (req, res) => {
  const { ids } = req.body; //в body передаётся массив с id для последующей собработки

  if (!Array.isArray(ids)) {
    //если ids это не массив
    res.sendStatus(422);
    return;
  }
  //если какой-то id в ids ошибочный, то removeMany(ids) не сраб.
  try {
    todoService.removeMany(ids);
  } catch (e) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(204); //No Content
};

export const updateMany = (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    //если ids это не массив
    res.sendStatus(422); //Unprocessable Entity
  }
  //для информации всех наденных и ненайденных туду для обновления
  const results = [];
  const errors = [];
  for (const { id, title, completed } of items) {
    const foundTodo = todoService.getById(id); //находим todo для обновления в списке todos

    if (foundTodo) {
      //если найден
      todoService.update({ id, title, completed });
      results.push({ id, status: 'OK' });
    } else {
      //если не найден
      errors.push({ id, status: 'NOT FOUND' });
    }
  }
  //todoService.updateMany(items);
  //res.sendStatus(200);
  //на фронте можно обработать эти массивы успехов и ошибок
  res.send({ results, errors });
};
