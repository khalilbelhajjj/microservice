## Game Stage Microservice
Game Stage Microservice is a microservices-based application built with Node.js, gRPC, GraphQL, and REST, using SQLite as the database. It consists of three entities: User, Game, and Stage. This README file provides an overview of the project and other relevant information.

## Table of Contents
Installation Technologies Architecture Overview Usage API Endpoints Database Contributing

## Technologies
Node.js gRPC GraphQL RESTful APIs SQLite

## Architecture Overview

The chosen architecture provides several benefits and conveniences:

## Microservices
The microservices architecture allows for modular and independent development of the "Game","Stage" and "User" functionalities. Each microservice can be developed, tested, and scaled separately, resulting in better maintainability and scalability of the overall system.

REST and GraphQL: The RESTful API between the client and the API gateway provides a familiar and straightforward interface for traditional HTTP-based communication. GraphQL is used alongside REST to provide flexible and efficient data querying capabilities, allowing clients to request only the specific data they need, reducing unnecessary data transfer and improving performance.

gRPC: The use of gRPC between the API gateway and the microservices offers efficient and high-performance communication using Protocol Buffers. gRPC supports bi-directional streaming and uses binary serialization, which results in faster data transfer compared to traditional REST APIs. Additionally, gRPC provides strong typing and generates client and server stubs automatically based on the defined Protobuf messages, making it easier to work with the microservices.

[apigetway (1).txt](https://github.com/khalilbelhajjj/microservice/files/15341884/apigetway.1.txt)



## Installation :
download all files Install the dependencies

## Usage :
Start the microservices: Start all microservices and the gateway in this order : node gameMicroservice.js node stageMicroservice.js node userMicroservice.js node apiGateway.js The microservices should now be running, and you can access them using the provided endpoints.

## API Endpoints :
GET /game: Retrieves all games from the database. GET /games/:id: Retrieves a specific game by its ID. GET /stages/:id: Retrieves a specific stage by its ID. GET /stages: Retrieves all stages from the database. POST /game: Creates a new game in the database. POST /stages: Creates a new stage in the database. PUT /game/:id: Updates a specific game by its ID. PUT /stage/:id: Updates a specific stage by its ID. DELETE /game/:id: Deletes a specific game by its ID. DELETE /stage/:id: Deletes a specific stage by its ID. GET /games: Retrieves all games from the database. GET /users: Retrieves all users from the database. GET /users/:id: Retrieves a specific user by its ID. POST /user: Creates a new user in the database. DELETE /user/:id: Deletes a specific user by its ID.

 ## Database :
The project uses SQLite as the database system. The SQLite database file can be found in the database directory.

## Contributing :
Contributions are welcome! If you find any issues or have suggestions for improvement, please submit an issue or a pull request. For major changes, please open an issue first to discuss potential changes.
