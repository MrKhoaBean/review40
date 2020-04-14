$(document).ready(() => {
    $('#send').click(() => {
        let cmtUrl = $('#url').val();
        $.ajax({
            url: ".",
            method: "POST",
            data: {
                cmtUrl
            }
        }).done((result) => {
            if (result.alert == "dialog")
                swal.fire(result.data).then(() => {
                    if (result.data.preconfirm_string)
                        eval(result.data.preconfirm_string);
                });
        })
    })
})