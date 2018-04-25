const listagem = document.getElementById("listagem");
const titulo = document.getElementById("titulo");
const mensagem = document.getElementById("mensagem");
const author = document.getElementById("author");

const msgs = [];

function update_views() {
    const items = msgs.map(e => `
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
}

fetch('http://150.165.85.16:9900/api/msgs')
.then(r => r.json())
.then(data => {
    Object.assign(msgs, data);
    update_views();
});


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
}