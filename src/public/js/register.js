const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");

const registerModal = new bootstrap.Modal(document.getElementById('registerModal'))

function OpenRegister() {
    loginModal.hide();
    registerModal.show();
}

function Register() {
    $.ajax({
        url: `/api/register`,
        type: "POST",
        data: {
            "Username": registerUsername.value,
            "Password": registerPassword.value
        },
        success: result => {
            console.log(result);

            ShowToast("Register successful, you can now login");        

            OpenLogin();
        },
        error: function (request, status, error) {
            if(request.status == 400) {
                ShowToastError("Register failed, username already exists");
            }
            else {
                console.log(request);
                ShowToastError("Register failed, unknown error");
            }
        }
    });
}