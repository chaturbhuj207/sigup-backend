const express = require('express');
const app = express();
const cors = require('cors')
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;


require('./dbConnect')
const USER = require('./userSchema');
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send("Running")
})

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await USER.findOne({ email });
        if (userExist) { return res.send({ message: "User is exist", codeStatus: 1 }) }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new USER({ email, password: hashPassword, token: '' });
        newUser.save();
        res.send({ message: "Register Successfully", codeStatus: 2, newUser })
    } catch (error) {
        res.send({ message: "Server error" });

    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await USER.findOne({ email })
        if (!userExist) {
            return res.send({ message: "User Not Found!", codeStutas: 1 })
        }
        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.send({ message: "Password is not match", codeStutas: 1 })
        }

        const token = jwt.sign({ email }, jwt_secret, { expiresIn: '1h' });

        userExist.token = token;
        await userExist.save();
        res.send({ message: "Login successfully", userExist, userlogin: true, token })

    } catch (error) {
        console.log("error", error)
    }

})

app.listen(port, () => {
    console.log("port is listening on   http://localhost:1300")
})

