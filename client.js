const listagem = document.getElementById("listagem");
listagem.innerHTML = "a";

var e = [];

function update(){
    
}

fetch("http://150.165.85.16:9900/api/msgs")
.then(a => a.json())
.then(d => {
    Object.assign(e, d);
});