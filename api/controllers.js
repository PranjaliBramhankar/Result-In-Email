const data = require("./model.js")
const nodemailer = require("nodemailer");
const sql = require('mssql')

const sqlConfig = {
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    server: process.env.db_server,
    options: {
        trustServerCertificate: true,
    }
}


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.email,
        pass: process.env.password,
    },
});

const query = async (queryString) => {
    await sql.connect(sqlConfig)
    const result = await sql.query(queryString);
    return result
}

const adminLogin = async (req, res) => {
    const { email, pass } = req.body
    const result = await query(`select * from admin where email='${email}' and password='${pass}'`)
    const credentials = result.recordset[0]
    if (credentials) {
        res.json({ message: `Authenticated`, result: true })
    } else {
        res.send({ message: 'No user found', result: false })
    }

}

const studentLogin = async (req, res) => {
    const { enrollmentID, pass } = req.body
    const result = await query(`select * from student where enrollmentID='${enrollmentID}' and password='${pass}'`)
    const credentials = result.recordset[0]
    if (credentials) {
        res.json({ message: `Authenticated`, result: true })
    } else {
        res.send({ message: 'No user found', result: false })
    }
}

const register = async (req, res) => {
    const { enrollmentID, email, password, name, semester, year } = req.body
    const result = await query(`insert into student values('${enrollmentID}', '${email}', '${password}', '${name}', '${semester}', '${year}')`)
    console.log(result);

    const info = await transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: "RTMNU RIM Verify Account",
        text: "Hello world?",
        html: `
        <h3>Click on the below link to verify your account.</h3>
        <a href="http://localhost:8080/Studentdashboard.html">Click here to verify.</a>
        `,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("Message sent: %s", info.messageId);

    res.send({ success: true, enrollmentID: email })
}

const result = (_, res) => {
    res.json(Object.keys(data.result).filter(key => Object.keys(data.result[key]).length !== 0))
}

const sendMail = async (req, res) => {
    const { sem } = req.body
    const ro = await query(`select * from student where semester='${sem}'`);
    const students = ro.recordset
    const results = data.result[parseInt(sem)]

    students.forEach(async (student) => {
        const { enrollmentID, email } = student
        const style = `style="border: 2px black solid; padding: 8px;"`

        let rows = `
            <tr ${style}>
            <th ${style}>Subject</th>
            <th ${style}>Total Marks</th>
            <th ${style}>Marks</th>
            </tr>
        `

        results[enrollmentID].forEach(row => {
            rows += getRow(style, row)
        });

        const mailContent = `
            <table style="border-collapse: collapse; text-align: center;">
            <tbody>
            ${rows}
            </tbody>
            </table>
        `

        const info = await transporter.sendMail({
            from: process.env.email,
            to: email,
            subject: "RTMNU RIM New 3",
            text: "Hello world?",
            html: mailContent,
        });

        console.log("Sent to " + email);
        console.log("Message Id: %s", info.messageId);
    });

    res.send({ success: true, results });
}

const updateStudent = async (req, res) => {
    const { enrollmentID, email, password, name, semester, year } = req.body
    const result = await query(`update student set email='${email}', password='${password}', name='${name}', semester='${semester}', year='${year}' where enrollmentID='${enrollmentID}'`)
    res.send({ success: true })
}

const getStudent = async (req, res) => {
    const { enrollmentID } = req.body
    const result = await query(`select * from student where enrollmentID='${enrollmentID}'`)
    const credentials = result.recordset[0]
    res.send({ success: true, studentData: credentials })
}

const getRow = (style, { name, totalmarks, marks }) => {
    return `
        <tr ${style}>
            <td ${style}>${name}</td>
            <td ${style}>${totalmarks}</td>
            <td ${style}>${marks}</td>
        </tr>
    `
}


module.exports = { studentLogin, adminLogin, result, register, sendMail, updateStudent, getStudent }