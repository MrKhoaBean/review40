var xoa = function(id, type) {
    swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắn chắn muốn xóa link này không?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Không, để sau",
        allowEnterKey: false
    }).then(result => {
        if (result.value) {
            $.ajax({
                url: "./delete",
                method: "POST",
                data: {
                    id,
                    type
                }
            }).done(res => {
                swal.fire(res.data);
                if (res.data.icon == "info") {
                    $(`#${type}${id}_tr`).fadeOut(1000);
                }
            })
        }
    })
}

var sua = function(id, type) {
    if ($(`#${type}${id}_button`).html() == "Sửa") {
        let url = $(`#${type}${id}row-1`).html();
        let bonus = $(`#${type}${id}row-2`).html().split('đ')[0].split(',').join('');
        $(`#${type}${id}row-1`).html('');
        $(`#${type}${id}row-2`).html('');
        $(`#${type}${id}row-1`).append(`<input style="background-color:#ae55ff;color:white;width:100%;height:100%" value="${url}" type="url">`);
        $(`#${type}${id}row-2`).append(`<input style="background-color:#ae55ff;color:white;width:100%;height:100%" value="${bonus}" type="number">`);
        $(`#${type}${id}_button`).html("Lưu lại");
    } else {
        let url = $(`#${type}${id}row-1 input`).val();
        let bonus = $(`#${type}${id}row-2 input`).val().split('đ')[0].split(',').join('');

        $(`#${type}${id}_button`).html("Sửa");
        swal.showLoading();

        let data = {
            url,
            bonus,
            id,
            type
        }
        $.ajax({
            url: './edit',
            method: "POST",
            data
        }).done(result=>{
        	swal.fire(result.data).then(()=>{
        		if (result.data.icon == "error")
        			location.assign('.');
        	});
        	if (result.data.icon == "success") {
        		$(`#${type}${id}row-1`).html(url);
        		$(`#${type}${id}row-2`).html(bonus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'đ');
        	}
        })
    }

}