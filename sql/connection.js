require('dotenv').config();

const mysql = require('mysql');

// define the connection
let connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
);

// make the connection
connection.connect();


// mysql module doesn't include a method that handles promises, just callbacks
// the database doesn't care. it's just receiving queries, it processes what the query says, and returning results
// if we want to use promises, we either find a module that handles mysql promises (and learn to use it)
// or we can build our own middleware function that does it for us

// basic wrapper promise if you just want to convert a callback to a promise
// we'll use this when we build our authorization project
connection.queryPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};

// go farther, and if you want to process the results of your promise and return the results
// you want to make a blocking function that always returns an err or rows

connection.querySync = async (sql, params) => {
  let promise = new Promise((resolve, reject) => {
    console.log("Executing query", sql);
    connection.query(sql, params, (err, results) => {
      if(err){
        console.log("rejecting");
        return reject(err);
      } else {
        console.log("resolving");
        return resolve(results);
      }
    })
  })

  let results = await promise.then( (results) => {
    console.log("results ", results);
    return results;
  }).catch( (err) => {
    throw err;
  })
  return results;
};



// make an async call to test the connection
connection.query("select now()", (err, rows) => {
    if(err){
      console.log("Connection not successful", err);
    } else {
      console.log("Connected, ", rows);
    }
  }
);


module.exports = connection;

// class based connection
// class Connection {
//   constructor() {
//     if (!this.pool) {
//       console.log('creating connection...')
//       this.pool = mysql.createPool({
//         connectionLimit: 100,
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PWD,
//         database: process.env.DB_NAME
//       })

//       return this.pool
//     }

//     return this.pool
//   }
// }

// const instance = new Connection()

// module.exports = instance;