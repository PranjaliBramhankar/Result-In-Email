const enrID = sessionStorage.getItem("enrollmentID");

const getData = async () => {
    const response = await fetch("http://localhost:5000/getStudent", {
        headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
        body: JSON.stringify({ enrollmentID: enrID }),
        method: "POST",
    })
    const { studentData } = await response.json()
    const { name, email, password, enrollmentID, semester, year } = studentData
    const form = document.forms["studentDetails"]
    form["name"].value = name
    form["email"].value = email
    form["password"].value = password
    form["enrollmentID"].value = enrollmentID
    form["semester"].value = semester
    form["year"].value = year
}

getData();

const update = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target);
    const response = await fetch("http://localhost:5000/updateStudent", {
        headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
        method: "POST",
    })

    const data = await response.json()

    if (data.success) {
        window.location.href = "./Studentdashboard.html";
    } else {
        event.preventDefault();
    }
}