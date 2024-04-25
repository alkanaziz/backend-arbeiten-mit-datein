import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { nanoid } from 'nanoid';


const filePath = "data.json";
const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Anfrage an ${req.method} ${req.url}`);
    next();
    // res.send("Ich bin Middleware nummer1 und habe die Anfrage abgebrochen");
})

app.use("/users" || "/", (req, res, next) => {
    console.log("Ich bin Middleware nummer2");
    if (req.method === "GET") {
        console.log("GET Anfrage, erlaubt!");
        next();
    } else {
        console.log("POST Anfrage, thou shall not pass!");
        res.send("Nur GET Anfragen sind erlaubt!")
    }
})

const users = [
    {
        "id": 12321,
        "userName": "john050",
        "role": "admin",
        "password": "admin"
    },
    {
        "id": 12322,
        "userName": "jane050",
        "role": "user",
        "password": "user"
    },
    {
        "id": 12323,
        "userName": "joe050",
        "role": "user",
        "password": "user"
    }
]

const authMiddleware = (req, res, next) => {
    const { userName, role, password } = req.body.user;
    const user = users.find(user => user.userName === userName && user.role === role && user.password === password)
    if (user) {
        next();
    } else {
        res.send("Login failed");
    }
};

app.post('/login', authMiddleware, (req, res) => {
    res.send("Login successful");
});

app.get('/', (req, res) => {
    res.send("Server is running");
})

app.post('/user', (req, res) => {
    // check if the data.json file exists
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }

    const userInfo = req.body;
    const newUserInfo = {
        id: nanoid(),
        ...userInfo
    }

    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);
    jsonData.push(newUserInfo);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    res.send({ message: 'User created successfully', user: newUserInfo });
})

app.get('/users', (req, res) => {
    if (!fs.existsSync(filePath)) {
        res.send("No user found");
        return;
    }

    const jsonData = fs.readFileSync(filePath, "utf8");
    const jsObjData = JSON.parse(jsonData);
    res.send(jsObjData);
})
app.listen(3002, () => {
    console.log("Server is running on http://localhost:3002");
})