$(document).ready(() => {

    $('#example').DataTable();

    $("#form_profile").validate({
        rules: {
            name: {
                minlength: 5
            },
            email: {
                email: true
            },
            username: {
                minlength: 5
            },
            password: {
                minlength: 5
            }
        },
        messages: {
            name: {
                minlength: "Tên hiển thị quá ngắn!"
            },
            email: {
                email: "Địa chỉ email không hợp lệ!"
            },
            username: {
                minlength: "Tên tài khoản quá ngắn!"
            },
            password: {
                minlength: "Mật khẩu quá ngắn!"
            }
        }
    })

    $('#thaydoi').click(() => {
        if ($('#thaydoi').html() == "Thay đổi") {
            $('input[name="name"]').removeAttr('disabled', 'disabled');
            $('input[name="username"]').removeAttr('disabled', 'disabled');
            $('input[name="email"]').removeAttr('disabled', 'disabled');
            $('input[name="password"]').removeAttr('disabled', 'disabled');
            $('#thaydoi').html('Lưu thay đổi');
        } else
        if ($('#thaydoi').html() == "Lưu thay đổi") {
            if ($("#form_profile").valid()) {
                swal.fire({
                    title: "Hãy nhập mật khẩu cũ của bạn để tiếp tục!",
                    input: 'text',
                    inputAttributes: {
                        placeholder: 'Mật khẩu cũ . . .',
                        autocapitalize: false
                    },
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Hủy bỏ',
                    allowOutsideClick: false
                }).then(result => {
                    if (result.value) {
                        let data = objectifyForm($("#form_profile").serializeArray());
                        data.oldPassword = result.value;
                        swal.showLoading();
                        $.ajax({
                            url: ".",
                            method: "POST",
                            data
                        }).done(response => {
                            swal.fire(response.data).then(() => {
                                if (response.data.icon == "error")
                                    location.assign('.');
                            });
                        })
                    }

                    $('input[name="name"]').attr('disabled', 'disabled');
                    $('input[name="username"]').attr('disabled', 'disabled');
                    $('input[name="email"]').attr('disabled', 'disabled');
                    $('input[name="password"]').attr('disabled', 'disabled');
                    $('#thaydoi').html('Thay đổi');
                })
            }
        }

    })
})