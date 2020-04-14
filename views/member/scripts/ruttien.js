function objectifyForm(formArray) { //serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

$(document).ready(() => {
    $('#form_ruttien').validate({
        rules: {
            thongtin: {
                required: true,
                minlength: 10
            },
            amount: {
                required: true
            }
        },
        messages: {
            thongtin: {
                required: "Vui lòng điền thông tin chuyển khoản!",
                minlength: "Thông tin chuyển khoản quá ngắn!"
            },
            amount: {
                required: "Vui lòng số tiền cần rút!"
            }
        }
    })

    $('#form_ruttien').submit(function(e) {
        e.preventDefault();
        if ($(this).valid()) {
            swal.showLoading();
            let data = objectifyForm($(this).serializeArray());
            $.ajax({
                url: ".",
                type: "POST",
                data
            }).done(result => {
                swal.fire(result.data).then(() => {
                    location.assign('.');
                });
            })
        }
    });
})