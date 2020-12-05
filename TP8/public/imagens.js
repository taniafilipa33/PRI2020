//Image display on client browser
function showImage(name, type){
    if(type=='image/png' || type=='image/jpeg')    
        var file = $('<img src="/fileStore/' + name + '" width="80%" />')
    else 
        var file = $('<p>' + name + ', ' + type + '</p>')
    var download = $('<div><a href="/download/' + name + '">Download</a></div>')

    $("#display").empty()
    $("#display").append(file, download)
    $("#display").modal()
}


function addi() {
    console.log("testeImagem")
    var file = $('<input class="w3-input w3-border w3-light-grey" type="file" name="myFile"></input>')
    $("#adiciona").append(file)
}