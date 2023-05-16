import { v4 as uuidv4 } from 'uuid';

let todos = [
  { id: '1', title: 'Study React', completed: true },
  { id: '2', title: 'Study Node', completed: false },
  { id: '3', title: 'Study CSS', completed: false },
  { id: '4', title: 'Study Redux', completed: false },
  { id: '5', title: 'Study JS', completed: false },
];

export function getAll() {
  return todos;
}

export function getById(todoId) {
  const foundTodo = todos.find((todo) => todo.id === todoId);
  return foundTodo || null;
}

export function create(title) {
  const newTodo = {
    id: uuidv4(),
    title,
    completed: false,
  };

  todos.push(newTodo);

  return newTodo;
}

export function remove(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
}

export function update({ id, title, completed }) {
  const todo = getById(id);
  Object.assign(todo, { title, completed });
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
