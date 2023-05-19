import { Todo } from './models/Todo.js';

//Todo.sync(); //cозд если не существует
// Todo.sync( { force: true } )  //cозд если в любом случае
// Todo.sync( { alter: true } ) //попытается объединить

//если мы решим что sequelize сам создаст табл, тогда
// он са сосдаст id cавтоинсрементом,  createdAt, updatedAt

//ТОГДА:
// export const Todo = sequelize.define(
//   'Todo',
//   {
//     // Model attributes are defined here
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     completed: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//   },
//   {
//     tableName: 'todos', //может само создать таблицу без указания, но будет 'Todos'
//   }
// );
