$(document).ready(() => {
    $('#form_linkcmt').validate({
        rules: {
            url: {
                required: true,
                url: true
            },
            noidung: {
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
            noidung: {
                required: "Vui lòng nhập nội dung cần bình luận"
            },
            bonus: {
                required: "Vui lòng nhập tiền thưởng"
            }

        }
    })

    $('#form_linkcmt').submit(function(e) {
        e.preventDefault();
        if ($(this).valid()) {
            swal.showLoading();
            let data = objectifyForm($(this).serializeArray());
            $.ajax({
                url: ".",
                type: "POST",
                data
            }).done(result => {
                Toast.fire(result.data);
            })
        }
    });
})