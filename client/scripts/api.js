const adminLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = Object.fromEntries(formData)
    const response = await fetch("http://localhost:5000/adminlogin", {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email, pass: credentials.password }),
        method: "POST",
    })
    const data = await response.json()
    if (data.result) {
        window.location.href = "./Admindashboard.html";
        console.log(data);
    } else {
        console.log(data);
    }
}

const studentLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = Object.fromEntries(formData)

    const response = await fetch("http://localhost:5000/studentlogin", {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            enrollmentID: credentials.enrollmentID,
            pass: credentials.password
        }),
        method: "POST",
    })

    const data = await response.json()
    if (data.result) {
        sessionStorage.setItem("enrollmentID", credentials.enrollmentID)
        window.location.href = "./Studentdashboard.html";
        console.log(data);
    } else {
        console.log(data);
    }
}

const register = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = Object.fromEntries(formData)
    const response = await fetch("http://localhost:5000/register", {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            enrollmentID: credentials.enrollmentID,
            semester: credentials.semester,
            year: credentials.year
        }),
        method: "POST",
    })
    const data = await response.json()
    if (data.success) {
        sessionStorage.setItem("enrollmentID", credentials.enrollmentID)
        window.location.href = "./Studentdashboard.html";
        console.log(data.email);
    } else {
        console.log(data);
    }
}

const getResultData = async () => {
    const response = await fetch("http://localhost:5000/result")
    const json = await response.json()
    const rows = document.getElementsByClassName("result")
    json.forEach(sem => {
        const row = rows[sem - 1]
        const status = row.cells[1]
        const sendBtn = row.cells[2].childNodes[1]

        sendBtn.addEventListener("click", async (event) => {
            status.innerText = "Sending";
            const sent = await sendResult(sem)
            status.innerText = "Declared (Sent)";
        });

        status.innerText = "Declared";
        status.style.color = "blue";
        sendBtn.disabled = false;
    })
}

const sendResult = async (sem) => {
    const response = await fetch("http://localhost:5000/sendmail", {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ sem }),
        method: "POST",
    })
    const json = await response.json()
    console.log(json);
}