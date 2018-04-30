const listagem = document.getElementById("listagem");
const titulo = document.getElementById("titulo");
const mensagem = document.getElementById("mensagem");
const autor = document.getElementById("autor");

let msgs = [];

function update_msgs() {
    fetch('http://150.165.85.16:9900/api/msgs')
    .then(r => r.json())
    .then(data => {
        Object.assign(msgs, data);
        update_views(msgs.sort(function(a,b) {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()}));
    });
}

function update_views(array) {
    const items = array.map(e => `
    <div class="card bg-light mb-3 shadow scroll" style="max-width: 18rem; margin-right: 15px; height: 152px; width: 251px; overflow: auto">
        <div class="card-header">${e.title}</div>
        <div class="card-body">
            <h6 class="card-title">${e.msg}</h6>
            <p class="card-text"></p>
                <small class="text-muted">${e.author},</small>
                <small class="text-muted">${new Date(e.created_at).toLocaleDateString()} às ${new Date(e.created_at).toLocaleTimeString()}</small>
        </div>
    </div>`).join("\n");
    listagem.innerHTML = items;        
};

function send(senha) {
    if (verifica_senha(senha)){
        fetch('http://150.165.85.16:9900/api/msgs', {
        method: 'post',
        body: JSON.stringify({
            title:titulo.value, 
            msg:mensagem.value, 
            author:autor.value, 
            credentials:"hemillainy:friends"})
      })
      .then(dado => dado.json())
        update_msgs();
    } else {
        alert("Senha Incorreta");
    }
}

update_msgs();

function clear_input(tag){
    tag.value = "";
}

function search(tag) {
    const array = msgs.filter(a => a.title.toLowerCase().indexOf(tag.value.toLowerCase()) != -1);
    console.log(tag);
    update_views(array);
    
}
function set_hidden(document){
    if (document.hidden == false) {
        document.hidden = true;
    }
}

function show(document){
    document.hidden = !document.hidden;   
}

function get_minhas_msgs() {
    let mensagens = msgs.filter(e => e.frontend === "hemillainy");
    console.log(mensagens);
    minhas_msgs(mensagens);
}

function minhas_msgs(mensagens) {
    const items = mensagens.map(e => `
    <div class="card bg-light mb-3 shadow scroll" style="max-width: 18rem; margin-right: 15px; height: 152px; width: 251px; overflow: auto">
        <button type="button" class="close" aria-label="Close" onclick="apagar(${e.id})">
            <span aria-hidden="true" style="padding-left: 220px">&times;</span>
        </button>
        <div class="card-header">${e.title}</div>
        <div class="card-body">
        <h6 class="card-title">${e.msg}</h6>
        <p class="card-text"></p>
            <small class="text-muted">${e.author},</small>
            <small class="text-muted">${new Date(e.created_at).toLocaleDateString()} às ${new Date(e.created_at).toLocaleTimeString()}</small>
        </div>
    </div>`).join("\n");
    listagem.innerHTML = items;        
};

function apagar(id){
    const body = JSON.stringify({credentials: "hemillainy:friends"})
    fetch("http://150.165.85.16:9900/api/msgs/"+`${id}`+"",
    {method: "delete", body: body})
    .then(function(){
        get_minhas_msgs();
    })
}

function verifica_senha(senha) {
    if (senha.value === "friends") {
        return true;
    }
    return false;
}
