function search_discovery() {

    var text = document.getElementById("input_search").value;
    var fd = new FormData();
    fd.append('text', text);

    console.log(fd)

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/discovery',
        data: JSON.stringify({ "text": text }),
    });

    request.done((response) => {
        console.log(response)
        for(var i = 0; i<response.result.results.length; i++){
          console.log(response.result.results[i])
          $("div#results_search").append(response.result.results[i].text + "<br /><br />");
        }
        //document.getElementById("results_search").innerHTML = response;
        //$("div#results_search").append(response);
        //console.log(response);
    });

    request.fail((error) => {
        console.log(error);
        //document.getElementById("results_search").innerHTML = "error";
        $("div#results_search").append(error);
    });

}
