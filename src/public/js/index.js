const currentDate = document.getElementById("currentDate");
const archiveDate = document.getElementById("archiveDate");

const inputTitle = document.getElementById("inputTitle");
const inputDate = document.getElementById("inputDate");


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
        },
        error: function (request, status, error) {
            if(request.status == 400) {
                ShowToastError("Get failed, invalid data (" + request.responseJSON.Message + ")");
            }
            else {
                console.log(request);
                ShowToastError("Get failed for unknown reasons");
            }
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
        },
        error: function (request, status, error) {
            if(request.status == 400) {
                ShowToastError("Update failed, invalid data (" + request.responseJSON.Message + ")");
            }
            else {
                console.log(request);
                ShowToastError("Update failed for unknown reasons");
            }
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
        },
        error: function (request, status, error) {
            if(request.status == 400) {
                ShowToastError("Delete failed, invalid data (" + request.responseJSON.Message + ")");
            }
            else {
                console.log(request);
                ShowToastError("Delete failed for unknown reasons");
            }
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
        },
        error: function (request, status, error) {
            if(request.status == 400) {
                ShowToastError("Add failed, invalid data (" + request.responseJSON.Message + ")");
            }
            else {
                console.log(request);
                ShowToastError("Add failed for unknown reasons");
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
                toWrite += `<strong class="${todo.State ? "green" : "red"}">${todo.Title}</strong>: &nbsp;`
                toWrite += `<input type="button" id="delete_todo_button_${todo._id}" onclick='DeleteToDo("${todo._id}")'  value="Delete">`
                toWrite += "<br>";
            });
            $("#archiveOutput")
                .css("display", "none")
                .html(toWrite)
                .fadeIn("slow");
        },
        error: function (request, status, error) {
            if(request.status == 400) {
                ShowToastError("Get failed, invalid data (" + request.responseJSON.Message + ")");
            }
            else {
                console.log(request);
                ShowToastError("Get failed for unknown reasons");
            }
        }
    });
}

currentDate.valueAsDate = new Date();
archiveDate.valueAsDate = new Date();

const toastElList = document.querySelectorAll('.toast')
const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl))

const alertToastBody = document.getElementById("alertToastBody");
const errorToastBody = document.getElementById("errorToastBody");

function ShowToast(message) {
    alertToastBody.innerText = message;
    toastList[0].show();
}

function ShowToastError(message) {
    errorToastBody.innerText = message;
    toastList[1].show();
}