var template = "";
var pageNumber = 1;
var getList = function(page) {
    $.ajax({
        url: './getlist',
        method: 'get',
        data: { page }
    }).done((result) => {
        if (result.length == 0) return;
        for (let element of $('.user')) {
            $(element).fadeOut(500);
        }
        setTimeout(() => {
            $('#contacts-list').html(ejs.compile(template)({ listAdmin: result }));
        }, 500)
        $('#page').html(page);
    })
}

var getAllList = function() {
    $.ajax({
        url: './getalllist',
        method: 'get'
    }).done(result => {
        if (result.length == 0) return;
        for (let element of $('.user')) {
            $(element).fadeOut(500);
        }
        setTimeout(() => {
            $('#contacts-list').html(ejs.compile(template)({ listAdmin: result }));
        }, 500)
        $('#page').html('(hiển thị tất cả)');
    })
}

var reloadList = function() {
    let page = $('#page').html();
    if (page == "(hiển thị tất cả)") {
        getAllList();
    } else {
        if (isNaN(page))
            page = 1;
        getList(page);
    }
}

var deleteAccount = function(username) {
    Swal.fire({
        title: 'Xóa tài khoản',
        text: 'Bạn có muốn xóa tài khoản ' + username + '?',
        confirmButtonText: 'Xóa tài khoản này',
        cancelButtonText: 'Hủy bỏ',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        allowEnterKey: false
    }).then(result => {
        if (result.value) {
            $.ajax({
                url: "./delete",
                method: "POsT",
                data: { username }
            }).done((response) => {
                if (response.success) {
                    Toast.fire({
                        title: 'Thành công',
                        icon: 'success',
                        text: 'Đã xóa người dùng: ' + username
                    })
                } else {
                    Toast.fire({
                        title: 'Thất bại',
                        icon: 'error',
                        text: 'Không tìm thấy người dùng: ' + username
                    })
                }
                reloadList();
            })
        }
    })
}

$(document).ready(() => {
    $.ajax({
        url: './partials/listuser.ejs',
        method: 'get'
    }).done((result) => {
        template = result;
        getList(1);
    })

    $('#next_page').click(() => {
        let page = Number($('#page').html());
        if (isNaN(page))
            page = 0;
        getList(++page);
    })

    $('#previous_page').click(() => {
        let page = Number($('#page').html());
        if (isNaN(page))
            page = 2;
        getList(--page);
    })

    $('#getalllist').click(() => {
        getAllList();
    })

    $('#them_nguoi').click(() => {
        // swal.fire({
        //     title: "Duyệt tài khoản",
        //     input: 'text',
        //     inputAttributes: {
        //         placeholder: 'Mã đơn hàng: ',
        //         autocapitalize: false
        //     },
        //     showCancelButton: true,
        //     confirmButtonText: 'Duyệt',
        //     cancelButtonText: 'Hủy bỏ',
        //     allowOutsideClick: false,
        //     showLoaderOnConfirm: true,
        //     preConfirm: (madonhang) => new Promise((resolve, reject) => {
        //         $($('.swal2-input')[0]).attr('disabled', 'true');
        //         $($('.swal2-input')[0]).css('cursor', 'not-allowed');
        //         $.ajax({
        //             url: "./duyet",
        //             method: "POST",
        //             data: { madonhang }
        //         }).done((e) => {
        //             e.madonhang = madonhang;
        //             resolve(e);
        //         })
        //     })
        // }).then((result) => {
        //     swal.close();
        //     let { username, failed, madonhang } = result.value;
        //     if (!failed)
        //         Toast.fire({
        //             title: 'Thành công',
        //             icon: 'success',
        //             text: 'Đã duyệt người dùng: ' + username
        //         })
        //     else
        //         Toast.fire({
        //             title: 'Thất bại',
        //             icon: 'error',
        //             text: 'Không tìm thấy mã đơn hàng: ' + madonhang
        //         })
        //     reloadList();
        // })
    })
})