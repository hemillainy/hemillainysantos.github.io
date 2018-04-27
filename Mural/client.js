const listagem = document.getElementById("listagem");
const titulo = document.getElementById("titulo");
const mensagem = document.getElementById("mensagem");
const author = document.getElementById("author");

let msgs = [];

function update_msgs() {
    fetch('http://150.165.85.16:9900/api/msgs')
    .then(r => r.json())
    .then(data => {
        Object.assign(msgs, data);
        update_views(msgs.reverse());
    });
}
function update_views(array) {
        const items = array.map(e => `
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">${e.title}</h2> 
                <p class="card-text">${e.msg}</p> 
                <p class="card-text">
                    <small class="text-muted">${e.author}</small>
                    <small class="text-muted">${e.created_at}</small>
                </p>
            </div>
        </div><br>`).join("\n");
        listagem.innerHTML = items;        
};

function send() {
    fetch('http://150.165.85.16:9900/api/msgs', {
    method: 'post',
    body: JSON.stringify({
        title:titulo.value, 
        msg:mensagem.value, 
        author:author.value, 
        credentials:"hemillainy:friends"})
  })
  .then(dado => dado.json())
    update_msgs();
}

update_msgs();

function clear_input(){
    titulo.value = "";
    mensagem.value = "";
    author.value = "";
}

function search(tag) {
    const array = msgs.filter(a => a.title.toLowerCase().indexOf(tag.value.toLowerCase()) != -1);
    update_views(array);
}

function show(document){
    document.hidden = !document.hidden;   
}