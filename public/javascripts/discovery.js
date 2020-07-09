//construction de requêtes avec le langage de requêtes Discovery
//get Field function
function getFieldDisco(field) {

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
function getOperatorDisco(operator) {

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
function getValueDisco(value) {

    if (value == "exclusion" || value == "exclusions") {
        value = "EXCLUSION";
    }
    else if (value == "inclusion" || value == "inclusions" || value == "garanties") {
        value = "INCLUSION";
    }
    else if (value == "option" || value == "options" || value == "garanties supplémentaires") {
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

//Discovery query using the search field
function search_discovery() {
    var text = document.getElementById("input_search").value;

    let list = new Array();

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/discovery',
        //data: JSON.stringify({"text": text})
        data : text
    });

    request.done((response) => {

        //affichage des docs
        /*$("div#number_results").append("Il y a " + response.result.results.length + " documents :" + "<br /><br />");
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
        }*/

        //affichage des passages
        $("div#number_passages").append("Il y a " + response.result.passages.length + " passages :" + "<br /><br />");
        for(var i = 0; i<response.result.passages.length; i++) {
            if (list.includes(response.result.passages[i].document_id)) {
                continue; 
            }
            list[i] = response.result.passages[i].document_id;
            $("div#results_passages").append("<button class=\"accordion\">"+ getDocumentTitle(response.result.passages[i].document_id) + "</button>");
            var passages = response.result.passages[i].passage_text + "<br /><br />";
            for (var j = i + 1 ; j < response.result.passages.length; j++) {
                if (response.result.passages[i].document_id == response.result.passages[j].document_id) {
                    passages += response.result.passages[j].passage_text + "<br /><br />";
                }
            }
            $("div#results_passages").append("<div class=\"panel\">" + 
                "<p>" + passages +"</p>" + 
                "</div>");
        }

        //Animation Accordion/ animation des onglets
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

//Build Discovery Queries
function buildQueries() {
    
    //alert(getField(field), getOperator(operator), getValue(value) , getField(field2), getOperator(operator2), getValue(value2));

    var field = document.getElementById("field").value;
    var operator = document.getElementById("operator").value;
    var value = document.getElementById("input_value").value;
    var field2 = document.getElementById("field2").value;
    var operator2 = document.getElementById("operator2").value;
    var value2 = document.getElementById("input_value2").value;

    let list = [];

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/discoveryqueries',
        //data: JSON.stringify({"text": text})
        data: {field: getFieldDisco(field), operator: getOperatorDisco(operator), value: getValueDisco(value),field2: getFieldDisco(field2), operator2: getOperatorDisco(operator2), input_value2: getValueDisco(value2)}
    });

    request.done((response) => {

        /*$("div#number_results").append("Il y a " + response.result.results.length + " documents :" + "<br /><br />");
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
        }*/


        $("div#number_passages").append("Il y a " + response.result.passages.length + " passages :" + "<br /><br />");
        for(var i = 0; i<response.result.passages.length; i++) {
            if (list.includes(response.result.passages[i].document_id)) {
                continue; 
            }
            list[i] = response.result.passages[i].document_id;
            $("div#results_passages").append("<button class=\"accordion\">"+ getDocumentTitle(response.result.passages[i].document_id) + "</button>");
            var passages = response.result.passages[i].passage_text + "<br /><br />";
            for (var j = i + 1 ; j < response.result.passages.length; j++) {
                if (response.result.passages[i].document_id == response.result.passages[j].document_id) {
                    passages += response.result.passages[j].passage_text + "<br /><br />";
                }
            }
            $("div#results_passages").append("<div class=\"panel\">" + 
                "<p>" + passages +"</p>" + 
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
    document.getElementById("input_value").value="";
    document.getElementById("input_value2").value="";
    $('#number_results').empty();
    $('#results_search').empty();
    $('#number_passages').empty();
    $('#results_passages').empty();
    $('#results_mongodb').empty();
    $('#tone_results').empty();
}

//affiche le titre des documents
function getDocumentTitle(document_id) {
    var document_title='';
    if (document_id == "06697abe51f83dc234fd6abcaa1c0a3a") {
        document_title = "MOBIL HOMES ET CONSTRUCTIONS LEGERES";
    }
    else if (document_id == "8b4fbff4cc81436e31401a897499778f") {
        document_title = "TEMPO HABITATION EN CONSTRUCTION";
    }
    else if (document_id == "dd18e9714dd42cf74070497a30fa605b") {
        document_title = "ALCYON";
    }
    else if (document_id == "fb99487fd7f8a0006346b344c4789465") {
        document_title = "IMMEUBLE";
    }
    else if (document_id == "25222b34783c7a371aad7c017196a775") {
        document_title = "TEMPO JEUNES";
    }
    else if (document_id == "e7bc203bb4b51f558d58d73b05fa72e1") {
        document_title = "ASSURANCE MULTIRISQUE HABITATION";
    }
    else if (document_id == "1fc21fc69ffc7a5dabff6493156f42a4") {
        document_title = "CHASSE";
    }
    else if (document_id == "2a92b9698cb41e43b0088625c36efbc0" || document_id == "792a8c9b85e60b123afcb6581e547af2" || document_id == "9cf9fa883ab2e743b2071287c89b7112") {
        document_title = "TEMPO HABITATION";
    }
    else if (document_id == "0cc30e4b82fff3996861b84b3c13382b") {
        document_title = "TEMPO ENFANTS";
    }
    else {
        document_title = document_id;
    }

    return document_title;
}