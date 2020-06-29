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
                "<p>" + response.result.results[i].text +"</p>" +
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

        //Animation  Accordion
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
        $("div#results_search").append(error);
    });
}

//get Field function
function getField() {
    var field = document.getElementById("field").value;
    if (field == "Entity Types") {
        field = "enriched_text.entities.type";
    }
    else if (field == "Entities") {
        field = "enriched_text.entities.text";
    }
    else if (field == "Categories") {
        field = "enriched_text.categories.label";
    }
    else if (field == "Concepts") {
        field = "enriched_text.concepts.text";
    }
    else if (field == "Keywords") {
        field = "enriched_text.keywords.text";
    }
    return field;
}

//get Operator function
function getOperator() {
    var operator = document.getElementById("operator").value;
    if (operator == "is") {
        operator = "::";
    }
    else if (operator == "is not") {
        operator = "::!";
    }
    else if (operator == "contains") {
        operator = ":";
    }
    else if (operator == "does not contain") {
        operator = ":!";
    }
    return operator;
}

//get Value function
function getValue() {
    var value = document.getElementById("input_value").value;
    if (value == "exclusion" || value == "exclusions") {
        value = "EXCLUSION";
    }
    else if (value == "inclusion" || value == "inclusions") {
        value = "INCLUSION";
    }
    else if (value == "option" || value == "options") {
        value = "OPTION";
    }
    else if (value == "plafond" || value == "plafonds") {
        value = "PLAFOND";
    }
    else if (value == "formule" || value == "formules") {
        value = "FORMULE";
    }
    return value;
}

//Build Discovery Queries
function buildQueries() {
    //alert (getField() + getOperator()+ getValue());
    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/discoveryqueries',
        //data: JSON.stringify({"text": text})
        data: {field: getField(), operator: getOperator(), value: getValue()}
    });

    request.done((response) => {

        $("div#number_results").append("Il y a " + response.result.results.length + " résultats de recherche :" + "<br /><br />");
        for(var i = 0; i<response.result.results.length; i++){
            //if the document has no title
            if (response.result.results[i].title == undefined) {
                //if there's no highlight
                if (response.result.results[i].highlight.text == undefined) {
                    $("div#results_search").append("<button class=\"accordion\">" + "No Title" + "</button>" +
                    "<div class=\"panel\">" + 
                    "<p>" + response.result.results[i].text +"</p>" +
                    "</div>");
                }
                else {
                    $("div#results_search").append("<button class=\"accordion\">" + "No Title" + "</button>" +
                    "<div class=\"panel\">" + 
                    "<p>" + response.result.results[i].highlight.text +"</p>" +
                    "</div>");
                }   
            }
            else {
                //if there's no highlight
                if (response.result.results[i].highlight.text == undefined) {
                    $("div#results_search").append("<button class=\"accordion\">" + response.result.results[i].title + "</button>" +
                    "<div class=\"panel\">" + 
                    "<p>" + response.result.results[i].text +"</p>" + 
                    "</div>");
                }
                else {
                    $("div#results_search").append("<button class=\"accordion\">" + response.result.results[i].title + "</button>" +
                    "<div class=\"panel\">" + 
                    "<p>" + response.result.results[i].highlight.text +"</p>" + 
                    "</div>");
                }
                
            }
        }

        $("div#number_passages").append("Il y a " + response.result.passages.length + " passages :" + "<br /><br />");
        for(var i = 0; i<response.result.passages.length; i++) {
            $("div#results_passages").append("<button class=\"accordion\">" + "Document id: "+ response.result.passages[i].document_id + "<br/> Field: " + response.result.passages[i].field + "</button>" +
                "<div class=\"panel\">" + 
                "<p>" + response.result.passages[i].passage_text +"</p>" + 
                "</div>");
        }

        //Animation  Accordion
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
        $("div#results_search").append(error);
    });
}

//clear/empty fields for new query
function reset() {
    document.getElementById('input_search').value = "";
    document.getElementById('number_results').innerHTML = "";
    document.getElementById('results_search').innerHTML = "";
    document.getElementById('number_passages').innerHTML = "";
    document.getElementById('results_passages').innerHTML = "";
    document.getElementById('tone_results').innerHTML = "";
    document.getElementById("input_value").value="";
    document.getElementById('results_mongodb').innerHTML = "";
}

function getDocumentTitle(document_id) {
    var document_title='';

    return document_title;
}