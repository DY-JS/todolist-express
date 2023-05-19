import { sequelize } from '../utils/db.js';
// const sequelize = new Sequelize('sqlite::memory:');
//sequelize.org  Model, Queries

import { Sequelize, DataTypes } from 'sequelize';
// const sequelize = new Sequelize('sqlite::memory:');
//sequelize.org  Model, Queries

export const Todo = sequelize.define(
  'Todo',
  {
    // Model attributes are defined here
    id: {
      //type: DataTypes.STRING,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, //для автогенерации id в БД
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'todos', //может само создать таблицу без указания, но будет 'Todos'
    updatedAt: false, // updatedAt: false нужно указать чтобы не было ошибки
  }
);

// `sequelize.define` also returns the model
//console.log(User === sequelize.models.User); // true
