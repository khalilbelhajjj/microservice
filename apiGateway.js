const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const gameProtoPath = 'game.proto';
const stageProtoPath = 'stage.proto';
const userProtoPath = 'user.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const db = new sqlite3.Database('./database.db');

const app = express();
app.use(bodyParser.json());

const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const stageProtoDefinition = protoLoader.loadSync(stageProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;
const stageProto = grpc.loadPackageDefinition(stageProtoDefinition).stage;
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
const clientGames = new gameProto.GameService('localhost:50051', grpc.credentials.createInsecure());
const clientStages = new stageProto.StageService('localhost:50052', grpc.credentials.createInsecure());
const clientUsers = new userProto.UserService('localhost:50053', grpc.credentials.createInsecure());

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});

// Routes pour les jeux
app.get('/games/:id', (req, res) => {
    const id = req.params.id;
    clientGames.GetGame({ game_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else if (response.game) {
            res.json(response.game);
        } else {
            res.status(404).send('Game not found.');
        }
    });
});

app.post('/games', (req, res) => {
    const { id, title, description } = req.body;
    clientGames.CreateGame({ game_id: id, title, description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.game);
        }
    });
});

app.put('/games/:id', (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id;
    clientGames.UpdateGame({ game_id: id, title, description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.game);
        }
    });
});

app.delete('/games/:id', (req, res) => {
    const id = req.params.id;
    clientGames.DeleteGame({ game_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(204);
        }
    });
});

// Routes pour les étapes
app.get('/stages/:id', (req, res) => {
    const id = req.params.id;
    clientStages.GetStage({ stage_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else if (response.stage) {
            res.json(response.stage);
        } else {
            res.status(404).send('Stage not found.');
        }
    });
});

app.post('/stages', (req, res) => {
    const { id, title, description } = req.body;
    clientStages.CreateStage({ stage_id: id, title, description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.stage);
        }
    });
});

app.put('/stages/:id', (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id;
    clientStages.UpdateStage({ stage_id: id, title, description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.stage);
        }
    });
});

app.delete('/stages/:id', (req, res) => {
    const id = req.params.id;
    clientStages.DeleteStage({ stage_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(204);
        }
    });
});

// Routes pour les utilisateurs
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    clientUsers.GetUser({ user_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else if (response.user) {
            res.json(response.user);
        } else {
            res.status(404).send('User not found.');
        }
    });
});

app.post('/users', (req, res) => {
    const { id, username, password, email } = req.body;
    clientUsers.CreateUser({ user_id: id, username, password, email }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.user);
        }
    });
});

app.put('/users/:id', (req, res) => {
    const { username, password, email } = req.body;
    const id = req.params.id;
    clientUsers.UpdateUser({ user_id: id, username, password, email }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.user);
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    clientUsers.DeleteUser({ user_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(204);
          }
      });
  });
  
  const port = 3000;
  app.listen(port, () => {
      console.log(`API Gateway running on port ${port}`);
  });
  
