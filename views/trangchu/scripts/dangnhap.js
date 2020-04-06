function objectifyForm(formArray) { //serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

$(document).ready(() => {
    $("#form_login").validate({
        rules: {
            username: {
                required: true,
                minlength: 5
            },
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            username: {
                required: "Bạn phải điền tên tài khoản!",
                minlength: "Tên tài khoản không hợp lệ!"
            },
            password: {
                required: "Bạn phải điền mật khẩu!",
                minlength: "Mật khẩu không hợp lệ!",
            }
        }
    })

    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: ".",
            type: "POST",
            data: objectifyForm($(this).serializeArray())
        }).done(result => {
            if (result.redirect) {
                location.assign(result.redirect);
            } else {
                swal.close();
                if (result.data.preConfirm_stringcode) {
                    result.data.preConfirm = function() {
                        eval(result.data.preConfirm_stringcode);
                    }
                }
                swal.fire(result.data);
            }
        })
        swal.fire({
            title: "Hệ thông đang đăng nhập",
            text: "Vui lòng chờ . . .",
            showConfirmButton: false,
            allowOutsideClick: false
        })
        swal.showLoading();
    });
})