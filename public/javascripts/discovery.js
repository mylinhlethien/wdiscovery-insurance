//Discovery query using the search field
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
            //if the document has no title
            if (response.result.results[i].title == undefined) {
                //$("div#results_search").append("No Title :"+ "<br />" + response.result.results[i].highlight.text + "<br /><br />");
                $("div#results_search").append("<button class=\"accordion\">" + "No Title" + "</button>" +
                "<div class=\"panel\">" + 
                "<p>" + response.result.results[i].highlight.text +"</p>" + 
                "</div>");
            }
            else {
                //$("div#results_search").append(response.result.results[i].title + " :"+ "<br />" + response.result.results[i].highlight.text + "<br /><br />");
                $("div#results_search").append("<button class=\"accordion\">" + response.result.results[i].title + "</button>" +
                "<div class=\"panel\">" + 
                "<p>" + response.result.results[i].highlight.text +"</p>" + 
                "</div>");
            }
        }

        $("div#number_passages").append("Il y a " + response.result.passages.length + " passages :" + "<br /><br />");
        for(var i = 0; i<response.result.passages.length; i++) {
            //$("div#results_passages").append( "Document id: "+ response.result.passages[i].document_id + "<br/> Field: " + response.result.passages[i].field + "<br />"+ response.result.passages[i].passage_text + "<br /><br /> <br/>");
            $("div#results_passages").append("<button class=\"accordion\">" + "Document id: "+ response.result.passages[i].document_id + "<br/> Field: " + response.result.passages[i].field + "</button>" +
                "<div class=\"panel\">" + 
                "<p>" + response.result.passages[i].passage_text +"</p>" + 
                "</div>");
        }

        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
            panel.style.display = "none";
            } else {
            panel.style.display = "block";
            }
        });
        }
    });

    request.fail((error) => {
        //console.log(error);
        //document.getElementById("results_search").innerHTML = "error";
        $("div#results_search").append(error);
    });
}

//get Field function
function getField() {
    var field = document.getElementById("field").value;
    return field;
}

//get Operator function
function getOperator() {
    var operator = document.getElementById("operator").value;
    return operator;
}

//get Value function
function getValue() {
    var value = document.getElementById("input_value").value;
    return value;
}

//Build Discovery Queries
function buildQueries() {
    //alert (getField() + getOperator()+ getValue());

}

//clear/empty fields for new query
function reset() {
    document.getElementById('input_search').value = "";
    document.getElementById('number_results').innerHTML = "";
    document.getElementById('results_search').innerHTML = "";
    document.getElementById('number_passages').innerHTML = "";
    document.getElementById('results_passages').innerHTML = "";
    document.getElementById('tone_results').innerHTML = "";
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}