

# Hey! 

##  A Chat Application

This project is a chat application built using Node.js, Express, MongoDB, and Socket.IO.

## Technologies Used

- **Node.js**: Node.js is used as the backend JavaScript runtime environment.
- **Express.js**: Express.js is used as the web application framework for Node.js.
- **MongoDB**: MongoDB is used as the NoSQL database to store chat messages and user data.
- **Socket.IO**: Socket.IO is a JavaScript library for real-time web applications, enabling bidirectional communication between clients and servers.
- **bcryptjs**: bcryptjs is used for hashing user passwords securely.
- **dotenv**: dotenv is used for loading environment variables from a .env file.
- **jsonwebtoken**: jsonwebtoken is used for generating and verifying JSON web tokens for user authentication.

## Features

- Real-time chat functionality with Socket.IO.
- User authentication and authorization using JSON web tokens.
- Secure password storage with bcryptjs.
- MongoDB integration for storing chat messages and user data.
- Environment variable management with dotenv.

## How to Run

1. Clone the repository to your local machine.
2. Install the dependencies using `npm install`.
3. Start the server using `npm run server`.
4. The chat application will be accessible at `http://localhost:PORT`.

## Deployment

To deploy the chat application, follow these steps:

1. Ensure you have MongoDB set up and running on your server.
2. Set the necessary environment variables in a `.env` file.
3. Build the frontend using `npm run build`.
4. Start the server using `npm start`.
5. Configure your server to listen on the appropriate port and domain.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.



