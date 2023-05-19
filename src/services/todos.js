import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../utils/db.js';
import { Todo } from '../models/Todo.js';

import { Sequelize, DataTypes, Op, QueryTypes } from 'sequelize';
// const sequelize = new Sequelize('sqlite::memory:');
//sequelize.org  Model, Queries

export const normalize = ({ id, title, completed }) => {
  return { id, title, completed }; //Это DTO - для возврата на фронт без created_at
};

export async function getAll() {
  //findAll({ order: ['created_at', ..., DESC] }); можно сортировать по неск полям по ASC, DESC
  //logging: false -если не хотим видеть логов по запросам sql
  const result = await Todo.findAll({ order: ['created_at'], logging: false });
  return result;
}

export async function getById(todoId) {
  //можно и без async await
  return await Todo.findByPk(todoId); //если нет - то вернёт null(Not found)
}

export function create(title) {
  //можно и без async await
  // const id = uuidv4();
  return Todo.create({ title }); //вернёт созданный Todo уже с id
}

export async function remove(todoId) {
  return Todo.destroy({ where: { id: todoId } });
}

export function update({ id, title, completed }) {
  return Todo.update(
    //обновление по id
    { title, completed },
    {
      where: { id },
    }
  );
}

// 1-й вариант removeMany
export async function removeMany(ids) {
  //1-й sequelize.query
  return sequelize.query(
    `DELETE FROM todos WHERE id IN (?)`,
    {
      replacements: [ids], //список ids подставится вместо ?, всё будет санитизовано
    }

    //  `DELETE FROM todos WHERE id IN (:ids)`,//ещё вариант -пар-р с ключом ids
    // {
    //   replacements: { ids: ids } //ключ ids подставится в пар-р запроса
    //   type: QueryTypes.BULKDELETE, //множ. удаление - вернёт кол-во
    // } //указали явно тип запроса ч-з QueryTypes
  );

  //sequelize cам сделает проверку валидные ли значения в списке ids
  // 2-й return Todo.destroy({
  //   where: {
  //     id: {
  //       [Op.in]: ids, //аттрибут - массив ids
  //     },
  //   },
  // });
}

export async function updateMany(todos) {
  //1 - c помощью транзакции все запросы группируются
  return sequelize.transaction(async (t) => {
    for (const { id, title, completed } of todos) {
      await Todo.update(
        { title, completed },
        {
          where: { id },
          transaction: t,
        }
      ); //обновили все todo из списке одной транзакцией
    }
  });
  //2 - bulkCreate - для множественного апдейта, но имет побочные эффекты
  // return Todo.bulkCreate(todos, {
  //   updateOnDuplicate: ['title', 'complited'],
  // }); updateOnDuplicate - если есть дубликаты то обновит

  //2 -так тоже сработает но плохая производительность
  // for (const { id, title, completed } of todos) {
  //   await update({ id, title, completed }); //обновили todo в списке todos
  // }
}
