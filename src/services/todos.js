import { v4 as uuidv4 } from 'uuid';
import { client } from '../utils/db.js';

export async function getAll() {
  const result = await client.query(`SELECT * FROM todos ORDER BY created_at`);
  return result.rows;
} //ORDER BY created_at чтобы сохранить порядок при обновлении

export async function getById(todoId) {
  // const result = await client.query(`SELECT * FROM todos WHERE id='${todoId}'`);
  //параметризированный запрос $1 - 1-й пар-р в массиве [todoId]
  const result = await client.query(`SELECT * FROM todos WHERE id=$1`, [
    todoId,
  ]);
  return result.rows[0] || null;
}

export async function create(title) {
  const id = uuidv4();
  // await client.query(`INSERT INTO todos (id, title, completed)
  //   VALUES ('${id}', '${title}', false)`);
  //параметризированный запрос $1 -1-й в массиве -id, $2 -2-й в массиве -id [id, title]
  await client.query(
    `INSERT INTO todos (id, title, completed)
    VALUES ($1, $2, false)`,
    [id, title]
  );
  const newTodo = await getById(id);
  return newTodo;
}

export async function remove(todoId) {
  // await client.query(`DELETE FROM todos WHERE id='${todoId}'`);
  //параметризированный запрос $1 - 1-й пар-р в массиве [todoId]
  await client.query(`DELETE FROM todos WHERE id=$1`, [todoId]);
}

export async function update({ id, title, completed }) {
  // await client.query(`UPDATE todos
  //    SET title='${title}', completed=${completed}
  //    WHERE id='${id}'`);
  await client.query(
    `UPDATE todos SET title=$2, completed=$3
     WHERE id=$1`,
    [id, title, completed]
  );
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
