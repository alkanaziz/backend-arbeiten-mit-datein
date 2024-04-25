import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { nanoid } from 'nanoid';


const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Anfrage an ${req.method} ${req.url}`);
    next();
})

const filePath = "data.json";


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