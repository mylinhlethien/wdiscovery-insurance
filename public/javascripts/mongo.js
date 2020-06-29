function search_mongodb() {
    var text = document.getElementById("input_search").value;

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/mongodb',
        //data: JSON.stringify({"text": text})
        data : text
    });

    request.done((response) => {

        $("div#results_mongodb").append(text + " : </br>");
        if (response[0].text == text) {
            for (var i = 1; i <= 3; i++) {
                if (response[i].text == "") {
                    $("div#results_mongodb").append("Non couvert dans la formule " + response[i].column_header_texts[0] + "<br/>");
                }
                else {
                    if (response[i].text == "option") {
                        $("div#results_mongodb").append("En option dans la formule " + response[i].column_header_texts[0] + "<br/>");
                    }
                    else {
                        $("div#results_mongodb").append("Couvert dans la formule " + response[i].column_header_texts[0] + "<br/>");
                    }
                }
            }
        }
        else if (response[4].text == text) {
            for (var i = 5; i <= response.length ; i++) {
                $("div#results_mongodb").append(response[i].text + " pour la formule "+ response[i].column_header_texts[0] + "<br/>");
            }
        }
        
    });

    request.fail((error) => {
        document.getElementById("results_mongodb").innerHTML = error;
    });
}
function reset() {
    document.getElementById('input_search').value = "";
    document.getElementById('number_results').innerHTML = "";
    document.getElementById('results_search').innerHTML = "";
    document.getElementById('number_passages').innerHTML = "";
    document.getElementById('results_passages').innerHTML = "";
    document.getElementById('tone_results').innerHTML = "";
    document.getElementById("input_value").value="";
    document.getElementById('results_mongodb').innerText = "";
}
