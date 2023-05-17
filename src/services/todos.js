import { v4 as uuidv4 } from 'uuid';
//import fs from 'fs';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data', 'todos.json');

//чтобы работать promise сделаем функцию async
async function read() {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function write(todos) {
  const data = JSON.stringify(todos, null, 2);
  await fs.writeFile(filePath, data);
}

//чтобы не блокировать поток  лучше не исп. writeFileSync и сделаем функцию async
// function write(todos) {
//   const data = JSON.stringify(todos, null, 2);
//   fs.writeFileSync(filePath, data);
// }

//чтобы не блокировать поток  лучше не исп. readFileSync и сделаем функцию async
// function read() {
//   const data = fs.readFileSync(filePath, 'utf-8');
//   return JSON.parse(data);
// }

// function write(todos) {
//   const data = JSON.stringify(todos, null, 2);
//   fs.writeFileSync(filePath, data);
// }

export function getAll() {
  return read();
}

export async function getById(todoId) {
  const todos = await read();
  const foundTodo = todos.find((todo) => todo.id === todoId);
  return foundTodo || null;
}

export async function create(title) {
  const todos = await read();
  const newTodo = {
    id: uuidv4(),
    title,
    completed: false,
  };

  todos.push(newTodo);
  await write(todos);

  return newTodo;
}

export async function remove(todoId) {
  const todos = await read();
  await write(todos.filter((todo) => todo.id !== todoId));
}

export async function update({ id, title, completed }) {
  const todos = await read();
  const todo = todos.find((todo) => todo.id === id);
  Object.assign(todo, { title, completed });
  await write(todos);
  return todo;
}

// упрощённый removeMany
// export function removeMany(ids) {
//   todos = todos.filter((todo) => !ids.includes(todo.id)); //очистили todos
// }

//если какой-то id ошибочный, то в контроллере try catch
export function removeMany(ids) {
  if (!ids.every(getById)) {
    throw new Error();
  }
  todos = todos.filter((todo) => !ids.includes(todo.id)); //очистили todos
}

export function updateMany(items) {
  for (const { id, title, completed } of items) {
    const foundTodo = getById(id); //находим todo для обновления в списке todos

    if (!foundTodo) {
      continue;
    }

    update({ id, title, completed }); //обновили todo в списке todos
  }
}
