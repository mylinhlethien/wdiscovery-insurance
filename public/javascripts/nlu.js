document.getElementById("analyze").addEventListener("nluanalyze", analyze);

function analyze() {
  document.getElementById("advisor").innerHTML = "Analyzing...";
  var text = document.getElementById("res").innerText;
  console.log(text);

  var fd = new FormData();
  fd.append('text', text);

  var request = $.ajax({
    method: 'POST',
    url: '/advisor',
    //dataType: html,
    data: fd,
    processData: false,
    contentType: false
  });

  request.done((data) => {
    document.getElementById("advisor").innerHTML = data;
  });

  request.fail((error) => {
    console.log(error);
  });
}