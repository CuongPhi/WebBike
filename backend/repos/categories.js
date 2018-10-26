var DbFunction = require('../fn/sqlite3-db');

const tableName = 'categories';

class CategoriesReps {
    constructor(){
    }

    createTable() {
         const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
             id INTEGER PRIMARY KEY AUTOINCREMENT, 
             name TEXT,
             isDelete INTERGER 
         ) `;
       return DbFunction.runQuery(sql);
    }

    addCategory(name) {
        return DbFunction.runQuery(`INSERT INTO ${tableName}  (name, isDelete) VALUES (?,?)`,
        [name, 0]);
    }
    updateCategory(category) {
        return DbFunction.runQuery(`UPDATE ${tableName} SET name = ? WHERE id = ?`,
        [category.name, category.id]);
    }
    removeCategory(id) {
        return DbFunction.runQuery(`UPDATE ${tableName} SET isDelete = ? WHERE id = ?`, [1 ,id]);
    }

    getById(id) {
        return DbFunction.getOne(`SELECT * FROM ${tableName} WHERE id = ?`, [id])
    }
    getAll() {
        return DbFunction.getAll(`SELECT * FROM  ${tableName}`);
    }
}



module.exports = CategoriesReps;