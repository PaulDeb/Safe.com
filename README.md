# Safe.com
Web Application to make cours on SAFe system with MERN stack

## How to install
Go to backend and frontend/safedotcom folders and execute : ```npm install```

For the back-end, you need to change the database, create a database on [MongoDB Atlas](https://account.mongodb.com/account/login) and put the DB connection string in backend/.env.
Check on the website of MongoDB that your IP address is authorized.

## How to start ?

### Backend :
To start the backend, go to <i>./backend</i> and execute : ```npm run start```

Now, you have logs in the terminal and the API listen http://localhost:4000

### Frontend :
To start frontend, go to <i> ./frontend/safedotcom</i> and execute : ```npm run start```

Now, you can go on your navigator and found web application here: http://localhost:3000


## Documentation

### Backend
When the backend is running, go to : http://localhost:4000/api-docs/

After changing of routes and completting the commentaries, before restart the backend, execute : ```npm run swagger-autogen```

### Frontend
No documentation available

## How To Build and expose on internet

1. On the safedotcom folder use the command : ```npm run build```

2. Go to <i>backend</i> folder and use the command : ```npm run start``` (you only need to start the backend because it exposed the build folder of the frontend)

3. In the Browser go to https://safe.loca.lt

4. Enter the password (ip address of the host => https://loca.lt/mytunnelpassword )

5. Enjoy the website !
