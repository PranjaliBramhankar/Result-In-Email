const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const port = process.env.port || 5000
const { studentLogin, adminLogin, result, register, sendMail, getStudent, updateStudent } = require("./controllers.js")
app.use(cors("*"))
app.use(express.json());

app.post("/adminlogin", adminLogin)
app.post("/studentlogin", studentLogin)
app.post("/register", register)
app.get("/result", result)
app.post("/sendmail", sendMail)
app.post("/getStudent", getStudent)
app.post("/updateStudent", updateStudent)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})