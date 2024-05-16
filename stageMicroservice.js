const sqlite3 = require('sqlite3').verbose();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const stageProtoPath = 'stage.proto';
const stageProtoDefinition = protoLoader.loadSync(stageProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const stageProto = grpc.loadPackageDefinition(stageProtoDefinition).stage;

const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS stages (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);

const stageService = {
  GetStage: (call, callback) => {
    const { stage_id } = call.request;
    db.get('SELECT * FROM stages WHERE id = ?', [stage_id], (err, row) => {
      if (err) {
        callback(err);
      } else if (row) {
        const stage = {
          id: row.id,
          title: row.title,
          description: row.description,
        };
        callback(null, { stage });
      } else {
        callback(new Error('Stage not found'));
      }
    });
  },
  CreateStage: (call, callback) => {
    const { title, description } = call.request;
    db.run(
      'INSERT INTO stages (title, description) VALUES (?, ?)',
      [title, description],
      function (err) {
        if (err) {
          callback(err);
        } else {
          const stageId = this.lastID;
          const stage = {
            id: stageId,
            title,
            description,
          };
          callback(null, { stage });
        }
      }
    );
  },
  UpdateStage: (call, callback) => {
    const { stage_id, title, description } = call.request;
    db.run(
      'UPDATE stages SET title = ?, description = ? WHERE id = ?',
      [title, description, stage_id],
      function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { success: true });
        }
      }
    );
  },
  DeleteStage: (call, callback) => {
    const { stage_id } = call.request;
    db.run(
      'DELETE FROM stages WHERE id = ?',
      [stage_id],
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
server.addService(stageProto.StageService.service, stageService);

const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Stage microservice running on port ${port}`);
  server.start();
});
