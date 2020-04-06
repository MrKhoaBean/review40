function objectifyForm(formArray) { //serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

$(document).ready(() => {
    $("#form_register").validate({
        rules: {
            name: {
                required: true,
                minlength: 5
            },
            phone: {
                required: true,
                minlength: 10
            },
            email: {
                required: true,
                email: true
            },
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
            name: {
                required: "Bạn phải điền tên hiển thị!",
                minlength: "Tên hiển thị quá ngắn!"
            },
            phone: {
                required: "Bạn phải điền số điện thoại!",
                minlength: "Số điện thoại không hợp lệ!",
            },
            email: {
                required: "Bạn phải điền địa chỉ Email!",
                email: "Địa chỉ email không hợp lệ!"
            },
            username: {
                required: "Bạn phải điền tên tài khoản!",
                minlength: "Tên tài khoản quá ngắn!",
            },
            password: {
                required: "Bạn phải điền mật khẩu!",
                minlength: "Mật khẩu quá ngắn!",
            }
        }
    })

    $('#form_register').submit(function(e) {
        e.preventDefault();
        if ($(this).valid()) {
            $.ajax({
                url: ".",
                type: "POST",
                data: objectifyForm($(this).serializeArray())
            }).done(result => {
                if (result.data.preConfirm_stringcode) {
                    result.data.preConfirm = function() {
                        eval(result.data.preConfirm_stringcode);
                    }
                }
                swal.fire(result.data);
            })
        }
    });
})