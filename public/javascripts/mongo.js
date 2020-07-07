//get Operator function
function getOperator(operator) {
    return operator;
}

//get Value function
//Lecture de tableau par MongoDB exige que le texte corresponde exactement, donc on met tout en majuscule
function getValue(value) {

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
    else if (value == "formule Eco" || value == "Eco") {
        value = "ECO";
    }
    else if (value == "formule Confort" || value == "Confort") {
        value = "CONFORT";
    }
    else if (value == "formule Excellence" || value == "Excellence") {
        value = "EXCELLENCE";
    }
    return value;
}

function getEntity(field, operator ,value) {
    var garantie ="";

    if ((field == "Entity Types" && value == "INCLUSION") || (field == "Entity Types" && operator=="is not" && value == "EXCLUSION") || (field == "Entity Types" && operator=="does not contain" && value == "EXCLUSION")) {
        garantie = "X";
    }
    else if (field == "Entity Types" && value == "OPTION") {
        garantie = "option";
    }
    else if ((field == "Entity Types" && value == "EXCLUSION") || (field == "Entity Types" && operator=="is not" && value == "INCLUSION") || (field == "Entity Types" && operator=="does not contain" && value == "INCLUSION")) {
        garantie = "";
    }
    return garantie;
}


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
        // if the results provide from the first document (tableau 2.pdf)
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
        // if the results provide from the second document (tableau 1.pdf)
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

function MongoDBQueries() {
    var field = document.getElementById("field").value;
    var operator = document.getElementById("operator").value;
    var value = document.getElementById("input_value").value;
    var value2 = document.getElementById("input_value2").value;

    var request = $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/mongodbqueries',
        //data: JSON.stringify({"text": text})
        data : {entity : getEntity(field, getOperator(operator),getValue(value)), formule : getValue(value2)}
    });

    request.done((response) => {
        for (i = 0; i < response.length; i++) {
            $("div#results_mongodb").append(response[i].text + "<br/>");
        }
        
    });

    request.fail((error) => {
        document.getElementById("results_mongodb").innerHTML = error;
    });
}
