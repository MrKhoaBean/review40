var duyet;
$(document).ready(()=>{
	duyet = function(id, method) {
		$.ajax({
			url:'.',
			method: 'POST',
			data: {
				id,
				method
			}
		}).done(res=>{
			if (res.data.icon == "info")
				swal.fire(res.data);
			else
				$('#form'+id).append('<code style="font-size:1em">Bạn đã duyệt &#10004;</code>')

			$('button[aria-label="Next"]').click();
		})
	}
})