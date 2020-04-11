var copy = function(e) {
	/* Get the text field */
	console.log($(e))
	var copyText = document.getElementById('linkgioithieu');

	/* Select the text field */
	copyText.removeAttribute('disabled');
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/

	/* Copy the text inside the text field */
	document.execCommand("copy");
	copyText.setAttribute('disabled', 'disabled');

	/* Alert the copied text */
	Toast.fire({
		text: "Đã copy link giới thiệu",
		icon: "success"
	})
}