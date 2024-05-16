const sqlite3 = require('sqlite3').verbose();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const userProtoPath = 'user.proto';
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    email TEXT
  )
`);

const userService = {
  GetUser: (call, callback) => {
    const { user_id } = call.request;
    db.get('SELECT * FROM users WHERE id = ?', [user_id], (err, row) => {
      if (err) {
        callback(err);
      } else if (row) {
        const user = {
          id: row.id,
          username: row.username,
          password: row.password,
          email: row.email,
        };
        callback(null, { user });
      } else {
        callback(new Error('User not found'));
      }
    });
  },
  CreateUser: (call, callback) => {
    const { username, password, email } = call.request;
    db.run(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email],
      function (err) {
        if (err) {
          callback(err);
        } else {
          const userId = this.lastID;
          const user = {
            id: userId,
            username,
            password,
            email,
          };
          callback(null, { user });
        }
      }
    );
  },
  UpdateUser: (call, callback) => {
    const { user_id, username, password, email } = call.request;
    db.run(
      'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?',
      [username, password, email, user_id],
      function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { success: true });
        }
      }
    );
  },
  DeleteUser: (call, callback) => {
    const { user_id } = call.request;
    db.run(
      'DELETE FROM users WHERE id = ?',
      [user_id],
      function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { success: true });
        }
      }
    );
  },
};

const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);

const port = 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`User microservice running on port ${port}`);
  server.start();
});
