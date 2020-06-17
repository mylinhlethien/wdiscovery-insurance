function search_discovery() {

    var text = document.getElementById("input_search").value;

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/discovery',
        //data: JSON.stringify({"text": text})
        data : text
    });

    request.done((response) => {
        $("div#number_results").append("Il y a " + response.result.results.length + " résultats de recherche :" + "<br /><br />");
        for(var i = 0; i<response.result.results.length; i++){
          $("div#results_search").append(response.result.results[i].title + " :"+ "<br />" + response.result.results[i].highlight.text + "<br /><br />");
        }

        $("div#number_passages").append("Il y a " + response.result.passages.length + " passages :" + "<br /><br />");
        for(var i = 0; i<response.result.passages.length; i++) {
            $("div#results_passages").append(response.result.passages[i].passage_text + "<br /><br />");
          }
    });

    request.fail((error) => {
        //console.log(error);
        //document.getElementById("results_search").innerHTML = "error";
        $("div#results_search").append(error);
    });

}

function reset() {
    
    document.getElementById('input_search').value = "";
    document.getElementById('number_results').innerHTML = "";
    document.getElementById('results_search').innerHTML = "";
    document.getElementById('number_passages').innerHTML = "";
    document.getElementById('results_passages').innerHTML = "";
    document.getElementById('tone_results').innerHTML = "";

}