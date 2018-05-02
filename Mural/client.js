const listagem = document.getElementById("listagem");
const titulo = document.getElementById("titulo");
const mensagem = document.getElementById("mensagem");
const autor = document.getElementById("autor");

let frontend = "";

let login = false;

let msgs = [];
let frontends = [];

function get_frontends () {
    fetch('http://150.165.85.16:9900/api/frontends')
    .then(r => r.json())
    .then(data => {
        Object.assign(frontends, data);
    });
}

function login_frontend(front, tag) {
    get_frontends();
    if (frontends.filter(f => f === front.value).length == 1) {
        login = true;
        set_hidden(tag);
        frontend = front;
        update_msgs();
    } else {
        alert("Frontend não cadastrado!");
    }
}

function login_frontend(front, tag) {
    fetch('http://150.165.85.16:9900/api/frontends')
    .then(r => r.json())
    .then(frontends => {
        if (frontends.indexOf(front.value) != -1) {
        login = true;
        set_hidden(tag);
        frontend = front.value;
        update_msgs();
        clear_input(front);
    } else {
        alert("Frontend não cadastrado!");
    }});
}

function verifica_senha(senha) {
    if (senha.value === "friends") {
        return true;
    }
    return false;
}

function update_msgs() {
    fetch('http://150.165.85.16:9900/api/msgs')
    .then(r => r.json())
    .then(data => {
        Object.assign(msgs, data);
        update_views(msgs.sort(function(a,b) {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()}));
    });
}

function update_views(array) {
    if (login) {
        const items = array.map(e => `
        <div class="card bg-light mb-3 shadow scroll">
            <div class="card-header">${e.title}</div>
            <div class="card-body">
                <h6 class="card-title">${e.msg}</h6>
                <p class="card-text"></p>
                    <small class="text-muted">${e.author},</small>
                    <small class="text-muted">${new Date(e.created_at).toLocaleDateString()} às ${new Date(e.created_at).toLocaleTimeString()}</small>
            </div>
        </div>`).join("\n");
        listagem.innerHTML = items;        
    }
};

function send(senha) {
    console.log(frontend);
    var result = null;
    fetch('http://150.165.85.16:9900/api/msgs', {
    method: 'post', 
    body: JSON.stringify({
        title: titulo.value,
        msg: mensagem.value,
        author: autor.value,
        credentials: `${frontend}:${senha.value}`})
    })
    .then(function (response){
        result = response;
        return response.json()})
        .then(function(body){
            if(result.status != 200){
                alert("Senha incorreta");
            }
        })
    };



update_msgs();

function clear_input(tag){
    tag.value = "";
}

function get_select_value() {
    var value = document.getElementById("opcoes").value;
    return value;
}

function search(opcao, atributo) {
    if(opcao === "titulo_p") {
        const array = msgs.filter(a => a.title.toLowerCase().indexOf(atributo.value.toLowerCase()) != -1);
        update_views(array);
    } else if (opcao === "mensagem_p") {
        const array = msgs.filter(a => a.msg.toLowerCase().indexOf(atributo.value.toLowerCase()) != -1);
        update_views(array);
    } else {
        const array = msgs.filter(a => a.author.toLowerCase().indexOf(atributo.value.toLowerCase()) != -1);
        update_views(array);
    }    
}

function set_hidden(document){
    if (document.hidden == false) {
        document.hidden = true;
    }
}

function show(document){
    document.hidden = !document.hidden;   
}

function get_msgs_front() {
    let mensagens = msgs.filter(e => e.frontend === frontend);
    msgs_front(mensagens);
}

function msgs_front(mensagens) {
    const items = mensagens.map(e => `
    <div class="card bg-light mb-3 shadow scroll">
        <button type="button" class="close" aria-label="Close" onclick="apagar(recebe_senha(),${e.id})">
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

function apagar(senha, id){
    if (senha === "friends") {
        const body = JSON.stringify({credentials: "hemillainy:friends"})
        fetch("http://150.165.85.16:9900/api/msgs/"+`${id}`+"",
        {method: "delete", body: body})
        .then(function(){
            get_minhas_msgs();
        })
    } else {
        alert("Senha Incorreta");
    };
}

function recebe_senha(){
    const senha = prompt("Digite sua senha:");
    return senha;
}