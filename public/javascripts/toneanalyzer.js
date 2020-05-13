function tone_analyzer() {

    var text = document.getElementById("input_search").value;

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/toneanalyzer',
        //data: JSON.stringify({"text": text})
        data : text,
    });

    request.done((response) => {
        for(var i = 0; i<response.result.length; i++){
          console.log(response.result[i])
          $("div#tone_results").append(response.result[i] + "<br /><br />");
        }
        //$("div#tone_results").append(response.result);
    });

    request.fail((error) => {
        //console.log(error);
        //document.getElementById("results_search").innerHTML = "error";
        $("div#tone_results").append(error);
    });

}