var duyet;
$(document).ready(() => {
    duyet = async function(id, method) {
        const { value: thongdiep } = await swal.fire({
            title: "Thêm thông điệp",
            input: 'text',
            inputAttributes: {
                placeholder: 'Thông điệp mà bạn muốn để lại ở đây',
                autocapitalize: false
            },
            showCancelButton: true,
            confirmButtonText: 'Duyệt',
            cancelButtonText: 'Hủy bỏ',
            allowOutsideClick: false,
            onOpen: () => {
                if (method)
                    $('.swal2-input').val('Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!');
                else
                    $('.swal2-input').val('Xin lỗi, thông tin chuyển khoản không hợp lệ!');
            }
        })

        if (thongdiep) {
            $.ajax({
                url: '.',
                method: 'POST',
                data: {
                    id,
                    method,
                    thongdiep
                }
            }).done(res => {
                swal.fire(res.data);
                if (res.data.icon == "warning") { // khúc này bị lỗi
                    $('#form' + id).append('<code style="font-size:1em; color:red">Admin khác đã duyệt &#9888;</code>');
                } else { // khi duyệt thành công bởi mình:
                    $('#form' + id).append('<code style="font-size:1em">Bạn đã duyệt (' + $('#' + method.toString()).html() + ') &#10004;</code>');
                    $('button[aria-label="Next"]').click();
                }
            })
        }
    }
})