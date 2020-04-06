$(document).ready(() => {
    $('#form_linkvideo').validate({
        rules: {
            url: {
                required: true,
                url: true
            },
            minutes: {
                required: true
            },
            bonus: {
                required: true
            }
        },
        messages: {
            url: {
                required: "Vui lòng điền url!",
                url: "Vui lòng nhập đúng định dạng!"
            },
            minutes: {
                required: "Vui lòng nhập số lượng phút cần xem"
            },
            bonus: {
                required: "Vui lòng nhập tiền thưởng"
            }

        }
    })

    $('#form_linkvideo').submit(function(e) {
        e.preventDefault();
        if ($(this).valid()) {
            swal.showLoading();
            $.ajax({
                url: ".",
                type: "POST",
                data: objectifyForm($(this).serializeArray())
            }).done(result => {
                Toast.fire(result.data);
            })
        }
    });
})