"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// Create connection to pool server
const pool = mysql2_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tipjs',
    database: 'testdb',
    port: 8811,
});
const batchSize = 10;
const totalSize = 100;
let curLength = 1;
console.time(':::::::::::::::TIMER:::');
const insertBatch = () => __awaiter(void 0, void 0, void 0, function* () {
    const values = [];
    for (let i = 0; i < batchSize && curLength <= totalSize; i++) {
        const name = `name-${curLength}`;
        const age = curLength;
        const address = `address-${curLength}`;
        values.push([curLength, name, age, address]);
        curLength++;
    }
    if (!values.length) {
        console.timeEnd(':::::::::::::::TIMER:::');
        pool.end((err) => {
            if (err) {
                console.error(`Error occurred while running batch`);
            }
            else {
                console.log(`Connection pool closed successfully`);
            }
        });
        return;
    }
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
    pool.query(sql, [values], function (err, result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err)
                throw err;
            console.log(`Inserted ${result['affectedRows']} records`);
            yield insertBatch();
        });
    });
});
insertBatch().catch(console.error);
// perform a sample operation
// pool.query('SELECT 1 + 1 AS solution', function (err, result) {
//   if (err) throw err;
//   console.log(`query result: ${result[0]['solution']}`);
//   pool.end((err) => {
//     console.log(`connection closed`);
//     if (err) throw err;
//   });
// });
