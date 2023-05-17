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

// 1-й вариант removeMany
export async function removeMany(ids) {
  //сделаем строку из индексов массива ids --> $1, $3,..
  // чтобы использовать в запросе
  const indexesString = ids.map((id, index) => `$${index + 1}`).join(',');
  console.log(indexesString);

  await client.query(`DELETE FROM todos WHERE id IN (${indexesString})`, ids);
}

// 2-й вариант removeMany
function isValidId(id) {
  const pattern = /^[0-9a-f\-]+s/;
  return pattern.test(id); //проверка что id валидный(соответствует паттерну)
}

// export async function removeMany(ids) {
// //сделаем проверку каждого id в массиве ids чтобы использовать в запросе
//   if (!ids.every(isValidId)) {
//     throw new Error();
//   }

//   await client.query(`DELETE FROM todos
//  WHERE id IN (${ids.map((id) => `'${id}'`).join(',')})`);
// }

export async function updateMany(todos) {
  for (const { id, title, completed } of todos) {
    await update({ id, title, completed }); //обновили todo в списке todos
  }
}
