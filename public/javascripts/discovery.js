function search_discovery() {

    var text = "assurance habitation";
    var fd = new FormData();
    fd.append('text', text);

    var request = $.ajax({
        method: 'POST',
        url: '/discovery',
        dataType: 'application/json',
        data: fd,
        processData: false,
        contentType: false,

    });

    request.done((response) => {
        //document.getElementById("results_search").innerHTML = response;
        $("div#results_search").append(response);
        //console.log(response);
    });

    request.fail((error) => {
        //console.log(error);
        //document.getElementById("results_search").innerHTML = "error";
        $("div#results_search").append(error);
    });

}
