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

        //response[0].doc_ids (liste des ids des docs)
        //response[0].doc_ids.length (nb de docs ids) == response[1].length (nb de docs)
        //response[0][i] pour parcourir tous les docs
        //response[1][i].body_cells pour avoir les cellules de chaque doc
        //response[1][i].body_cells.length (nb de cellules récupérées, généralement = 8)
        //response[1][i].body_cells[j ou 8].doc_id (doc_id de la cellule donc à comparer avec response[0].doc_ids[i])

        var number_documents = response[0].doc_ids.length; //nombre de résultats/documents
        $("div#results_mongodb").append("<b>"+ response[1][0].document_contrat[0].document_contrat + " <b/> <br/> <br/>");
        for (i = 0; i < number_documents; i++) {
            for (j = 0; j < response[1][i].body_cells.length ; j++) {  //on parcourt les cellules de chaque résultat/document
                if (response[1][i].body_cells[j].doc_id == response[0].doc_ids[i]) {  //on vérifie que l'id du document correspond pour ne pas se tromper de cellules du tableau
                    
                    if (response[1][i].body_cells[j].text == "") {
                        $("div#results_mongodb").append("Non couvert dans la formule " + response[1][i].body_cells[j].column_header_texts[0] + "<br/>");
                    }
                    else if (response[1][i].body_cells[j].text == "option") {
                        $("div#results_mongodb").append("En option dans la formule " + response[1][i].body_cells[j].column_header_texts[0] + "<br/>");
                    }
                    else if (response[1][i].body_cells[j].text == "X") {
                        $("div#results_mongodb").append("Couvert dans la formule " + response[1][i].body_cells[j].column_header_texts[0] + "<br/>");
                    }
                    else if(response[1][i].body_cells[j].column_header_texts[0] == "LIMITES PARTICULIÈRES") {
                        $("div#results_mongodb").append("<b>"+response[1][i].body_cells[j].text + " - "+ response[1][i].body_cells[j].column_header_texts[0]+  " <br/> <b/>");
                    }
                    else if(response[1][i].body_cells[j].column_header_texts[0] == "GARANTIE") {
                        $("div#results_mongodb").append("<b>"+response[1][i].body_cells[j].text + " - "+ response[1][i].body_cells[j].column_header_texts[0]+  " <br/> <b/>");
                    }
                    else {
                        $("div#results_mongodb").append(response[1][i].body_cells[j].text + " dans la formule "+ response[1][i].body_cells[j].column_header_texts[0]+  " <br/>");
                    }
                }
            }
        }

        if (response[0].text == "Pas de résultat") {
            $("div#results_mongodb").append(response[0].text);
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

        if (response[0].text == "Pas de résultat") {
            $("div#results_mongodb").append(response[0].text);
        }
        else {
            $("div#results_mongodb").append("<b>" + response[0].document_contrat[0].document_contrat + "<b/> <br/>");
            $("div#results_mongodb").append("<b> Les "+ getValue(value) +"S de la formule " + getValue(value2) + " : </b> <br/> </br>");
            for (i = 0; i < response[0].body_cells.length; i++) {
                $("div#results_mongodb").append(response[0].body_cells[i].text + "<br/>");
            }
        }

    });

    request.fail((error) => {
        document.getElementById("results_mongodb").innerHTML = error;
    });
}
