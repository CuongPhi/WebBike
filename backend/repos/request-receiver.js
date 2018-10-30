var DbFunction = require('../fn/sqlite3-db');
const tableName = 'request_receiver';
/* trạng thái request
chưa được định vị 0
đã định vị xong,  1
đã có xe nhận     2
đang di chuyển    3
đã hoàn thành     4
*/
class RequestRepos {
    constructor(){
        this.createTable();
    }

    createTable() {
         const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
             id INTEGER PRIMARY KEY AUTOINCREMENT, 
             name TEXT,
             phone TEXT,
             note TEXT,
             address TEXT,
             status INTERGER,
             isDelete INTERGER,
             iat INTERGER 
         ) `;
       return DbFunction.runQuery(sql);
    }

    addRequest(reqObj) {
        return DbFunction.runQuery(`INSERT INTO ${tableName}  (name, phone, note, address,iat, status,isDelete) VALUES (?,?,?,?,?,?,?)`,
        [reqObj.name, reqObj.phone, reqObj.note, reqObj.address,reqObj.iat ,  0, 0]);
    }
    updateRequestName(Request) {
        return DbFunction.runQuery(`UPDATE ${tableName} SET name = ? WHERE id = ?`,
        [Request.name, Request.id]);
    }
    removeRequest(id) {
        return DbFunction.runQuery(`UPDATE ${tableName} SET isDelete = ? WHERE id = ?`, [1 ,id]);
    }

    getById(id) {
        return DbFunction.getOne(`SELECT * FROM ${tableName} WHERE id = ?`, [id])
    }
    getAll() {
        return DbFunction.getAll(`SELECT * FROM  ${tableName} WHERE isDelete = 0`);
    }
    getAll_Stt0(){
        return DbFunction.getAll(`SELECT * FROM  ${tableName} WHERE isDelete = 0 AND status = 0`);

    }
    updateRequestStt(Request) {
        return DbFunction.runQuery(`UPDATE ${tableName} SET status = ? WHERE id = ?`,
        [Request.status, Request.id]);
    }
}



module.exports = RequestRepos;