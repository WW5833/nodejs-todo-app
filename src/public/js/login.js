const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const logoutBlock = document.getElementById("logoutBlock");
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'))

function setCookie(cname, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function setUserId(userId) {
    if(userId == "")
        logoutBlock.hidden = true;
    else
        logoutBlock.hidden = false;

    setCookie("user_id", userId);
}

function getUserId() {
    return document.cookie.split(';').find(x => x.startsWith("user_id"))?.split('=')[1] ?? "";
}

function Logout() {
    setUserId("");
    logoutBlock.hidden = true;
    OpenLogin();
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

            loginModal.hide();
            setUserId(result.UserId);
            ShowToast("Login successful");       

            UpdateCurrentToDo();
            UpdateArchiveToDo();
            
        },
        error: function (request, status, error) {
            if(request.status == 403) {
                ShowToastError("Login failed, wrong username or password");
            }
            else {
                console.log(request);
                ShowToastError("Login failed for unknown reasons");
            }
        }
    });
}

function OpenLogin() {
    registerModal.hide();
    loginModal.show();
}

if(getUserId() != "") {
    logoutBlock.hidden = false;
    UpdateCurrentToDo();
    UpdateArchiveToDo();
}
else {
    logoutBlock.hidden = true;
    OpenLogin();
}