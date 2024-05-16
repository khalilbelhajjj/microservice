const sqlite3 = require('sqlite3').verbose();

const resolvers = {
  Query: {
    game: (_, { id }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.get('SELECT * FROM games WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
    games: (_, __, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.all('SELECT * FROM games', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    stage: (_, { id }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.get('SELECT * FROM stages WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
    stages: (_, __, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.all('SELECT * FROM stages', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    user: (_, { id }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
    users: (_, __, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.all('SELECT * FROM users', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
  },
  Mutation: {
    CreateGame: (_, { id, title, description }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run(
          'INSERT INTO games (id, title, description) VALUES (?, ?, ?)',
          [id, title, description],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id, title, description });
            }
          }
        );
      });
    },
    CreateStage: (_, { id, title, description }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run(
          'INSERT INTO stages (id, title, description) VALUES (?, ?, ?)',
          [id, title, description],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id, title, description });
            }
          }
        );
      });
    },
    UpdateGame: (_, { id, title, description }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run(
          'UPDATE games SET title = ?, description = ? WHERE id = ?',
          [title, description, id],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id, title, description });
            }
          }
        );
      });
    },
    UpdateStage: (_, { id, title, description }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run(
          'UPDATE stages SET title = ?, description = ? WHERE id = ?',
          [title, description, id],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id, title, description });
            }
          }
        );
      });
    },
    DeleteGame: (_, { id }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run('DELETE FROM games WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id });
          }
        });
      });
    },
    DeleteStage: (_, { id }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run('DELETE FROM stages WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id });
          }
        });
      });
    },
    CreateUser: (_, { id, username, password, email }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run(
          'INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)',
          [id, username, password, email],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id, username, password, email });
            }
          }
        );
      });
    },
    UpdateUser: (_, { id, username, password, email }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run(
          'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?',
          [username, password, email, id],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id, username, password, email });
            }
          }
        );
      });
    },
    DeleteUser: (_, { id }, context) => {
      return new Promise((resolve, reject) => {
        const db = context.db;
        db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id });
          }
        });
      });
    },
  },
};

module.exports = resolvers;
