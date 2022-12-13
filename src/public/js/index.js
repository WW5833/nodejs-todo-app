const currentDate = document.getElementById("currentDate");
const archiveDate = document.getElementById("archiveDate");

const inputTitle = document.getElementById("inputTitle");
const inputDate = document.getElementById("inputDate");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

function setCookie(cname, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setUserId(userId) {
    setCookie("user_id", userId);
}

function getUserId() {
    return document.cookie.split(';').find(x => x.startsWith("user_id"))?.split('=')[1] ?? "";
}

const myModal = new bootstrap.Modal(document.getElementById('loginModal'))


function UpdateCurrentToDo() {
    var date = currentDate.value ?? new Date();
    if(!date) return;
    $.ajax({
        url: `/api/${getUserId()}/todo/${date}`,
        data: {
          status: false
        },
        success: result => {
            console.log(result);
            let toWrite = "";
            result.forEach(todo => {
                toWrite += `<strong>${todo.Title}</strong>: &nbsp;`
                toWrite += `<input type="checkbox" id="current_state_${todo._id}" onchange='UpdateCurrentToDoStatus("${todo._id}")' value="state">`
                toWrite += "<br>";
            });
            $("#currentOutput")
                .css("display", "none")
                .html(toWrite)
                .fadeIn("slow");
        }
    });
}

function UpdateCurrentToDoStatus(id) {
    const statusCheckbox = document.getElementById(`current_state_${id}`);
    if(!statusCheckbox) throw Error("Todo with supplied id was not found: " + `current_state_${id}`);
    $.ajax({
        url: `/api/${getUserId()}/todo/${id}/${statusCheckbox.checked}`,
        type: "PUT",
        success: result => {
            console.log(result);
            UpdateCurrentToDo();
            UpdateArchiveToDo();
        }
    });
}

function DeleteToDo(id) {
    $.ajax({
        url: `/api/${getUserId()}/todo/${id}`,
        type: "DELETE",
        success: result => {
            console.log(result);
            UpdateCurrentToDo();
            UpdateArchiveToDo();
        }
    });
}

function AddToDo() {
    $.ajax({
        url: `/api/${getUserId()}/todo`,
        type: "POST",
        data: {
            "Title": inputTitle.value,
            "Date": inputDate.value
        },
        success: result => {
            console.log(result);
            UpdateCurrentToDo();
            UpdateArchiveToDo();
        }
    });
}

function Logout() {
    setUserId("");
    myModal.show();
}

function Login() {
    $.ajax({
        url: `/api/login`,
        type: "POST",
        data: {
            "Username": loginUsername.value,
            "Password": loginPassword.value
        },
        success: result => {
            console.log(result);

            myModal.hide();
            setUserId(result.UserId);

            UpdateCurrentToDo();
            UpdateArchiveToDo();
            
        },
        error: function (request, status, error) {
            if(request.status == 403) {
                alert(request.responseText);
            }
            else {
                console.log(request);
                alert("Login failed for unknown reasons")
            }
        }
    });
}

function UpdateArchiveToDo() {
    var date = archiveDate.value ?? new Date();
    if(!date) return;
    $.ajax({
        url: `/api/${getUserId()}/todo/${date}`,
        success: result => {
            console.log(result);
            let toWrite = "";
            result.forEach(todo => {
                toWrite += `<strong>${todo.Title}</strong>: &nbsp;`
                toWrite += `<input type="button" id="delete_todo_button_${todo._id}" onclick='DeleteToDo("${todo._id}")'  value="Delete">`
                toWrite += "<br>";
            });
            $("#archiveOutput")
                .css("display", "none")
                .html(toWrite)
                .fadeIn("slow");
        }
    });
}

currentDate.valueAsDate = new Date();
archiveDate.valueAsDate = new Date();

if(getUserId() != "") {
    UpdateCurrentToDo();
    UpdateArchiveToDo();
}
else {
    myModal.show();
}