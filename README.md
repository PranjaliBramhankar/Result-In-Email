# Result In Email

## Steps to run project in development mode 
<br>

1. install dependecies by running the following command in "api" folder.

```bash
npm install
```

2. create a ".env" file in root of "api" folder with following variables having prot number, email and app password (obtained from your email provider) and database credentials. 

```bash
email = "example_email@gmail.com"
password = "App_Password"
port = "5000"
db_user = "admin"
db_password = "admin"
db_name = "Database_Name"
db_server = "Server_Name"
```

3. run server by running the following command in "api" folder, sever will run on port 5000.

```bash
npm start
```


4. open index.html file in "client" folder using live-server.