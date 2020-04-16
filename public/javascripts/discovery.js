function search_discovery() {

    var text = document.getElementById("input_search").value;

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/discovery',
        data: JSON.stringify({ "text": text }),
    });

    request.done((response) => {
        $("div#number_results").append("Il y a " + response.result.results.length + " résultats de recherche :" + "<br /><br />");
        for(var i = 0; i<response.result.results.length; i++){
          //console.log(response.result.results[i])
          $("div#results_search").append(response.result.results[i].text + "<br /><br />");
        }
    });

    request.fail((error) => {
        //console.log(error);
        //document.getElementById("results_search").innerHTML = "error";
        $("div#results_search").append(error);
    });

}
