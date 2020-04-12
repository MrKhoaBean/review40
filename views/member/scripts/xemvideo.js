let newwindow = false;
let popup = (url) => {
    if (newwindow && !newwindow.closed) {
        newwindow.focus(); //If already Open Set focus
    } else {
    	$('#showvideo').html("Nhận tiền [còn " + minutesCount + " phút]");
    	let interval = setInterval(()=>{
    		if (minutesCount > 1){
    			$('#showvideo').html("Nhận tiền [còn " + (--minutesCount) + " phút]");
    			$('#showvideo').attr('disabled', 'disabled');
    		}
    		else {
    			clearInterval(interval);
    			$('#showvideo').html("Nhận tiền ngay!");
    			$('#showvideo').removeAttr('disabled');
    			$('#showvideo').click(()=>{
    				$.ajax({
    					url: ".",
    					method: "POST"
    				}).done(result => {
    					let { alert, data } = result;
    					if (alert == "dialog")
    						swal.fire(data).then(()=>{
    							location.assign('.');
    						})
    				})
    			})
    		}
    	}, 60*1000);
        newwindow = window.open(url, "Xem video hay, nhận tiền mặt ngay!", 'height=500,width=1000');
        $.ajax({
        	url: "./start",
        	method: "POST"
        });
    }
}

setInterval(function() { 
	if (newwindow) {
		if (newwindow.closed) {
			$('#showvideo').html("Click để hiển thị video");
			$.ajax({
				url: './stop',
				method: "POST"
			})
			swal.fire({
				title: "Thông báo",
				text: "Bạn đã tắt popup nên sẽ không nhận được tiền, vui lòng xem lại video!"
			})

			newwindow = false;
		}
	}
}, 2000);