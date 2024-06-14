import mysql from 'mysql2';

// Create connection to pool server
const pool = mysql.createPool({
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
const insertBatch = async () => {
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
      } else {
        console.log(`Connection pool closed successfully`);
      }
    });
    return;
  }
  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async function (err, result) {
    if (err) throw err;
    console.log(`Inserted ${result['affectedRows']} records`);
    await insertBatch();
  });
};
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
