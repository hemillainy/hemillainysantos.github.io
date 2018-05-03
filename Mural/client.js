const listagem = document.getElementById("listagem");
const titulo = document.getElementById("titulo");
const mensagem = document.getElementById("mensagem");
const autor = document.getElementById("autor");

let frontend = "";

let msgs = [];

function set_button_login() {
    if(frontend.length == 0) {
        document.getElementById("name_button").innerText = "Login";
        document.getElementById("login_f").hidden = false;
        listagem.hidden = true;
    } else {
        document.getElementById("name_button").innerText = "Logout";
    }
}

function login_frontend(front, tag) {
    if (frontend.length == 0) {
        fetch('http://150.165.85.16:9900/api/frontends')
        .then(r => r.json())
        .then(frontends => {
            if (frontends.indexOf(front.value) != -1) {
            document.getElementById("listagem").hidden = false;
            tag.hidden = true;
            frontend = front.value;
            update_msgs();
            clear_input(front);
            set_button_login();
            set_hidden("login_alert");
        } else {
            alert("Frontend não cadastrado!");
        }});
    } else {
        logout();
    }
}

function logout() {
    if (frontend.length != 0) {
        swal({
            title: "Confirmar logout?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                frontend = "";
                set_button_login();
            }
        });
    }
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
    const itens = msgs.filter(function (e) {
            if (e.frontend != "icaro" && e.frontend != "caiolira" && e.frontend != "hgalvao") {
                return e;
            }
        }).map(e => `
        <div class="card bg-light mb-3 shadow scroll">
            <div class="card-header">${e.title}</div>
            <div class="card-body">
                <h6 class="card-title">${e.msg}</h6>
                <p class="card-text"></p>
                    <small class="text-muted">${e.author},</small>
                    <small class="text-muted">${new Date(e.created_at).toLocaleDateString()} às ${new Date(e.created_at).toLocaleTimeString()}</small>
            </div>
        </div>`).join("\n");
        listagem.innerHTML = itens;        
};

function send(senha) {
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
                swal("Senha incorreta");
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

function set_hidden(doc){
    console.log(doc);
    if (doc == "login_alert"){
        document.getElementById("login_alert").hidden = "true";
    }
    else if (doc.hidden == false && frontend.length != 0) {
        doc.hidden = true;
    }
}

function show(document){
    if (frontend.length != 0) {
        document.hidden = !document.hidden;   
    } else {
        alert_login();
    }
}

function alert_login() {
    if (frontend.length == 0) {
        document.getElementById("login_alert").hidden = false;
        document.getElementById("login_alert").innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Você precisa estar logado!</strong>
            <button onclick="set_hidden('login_alert')" type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>`;
    }
}

function get_msgs_front() {
    alert_login();
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
    var result = null;
    const body = JSON.stringify({credentials: `${frontend}:${senha}`});
    fetch(`http://150.165.85.16:9900/api/msgs/${id}`, {
    method: 'delete', 
    body:body})
    .then(function (response){
        result = response;
        return response.json()})
        .then(function(body){
            if(result.status != 200){
                swal("Senha incorreta");
            }
        }).then(function(){
            get_msgs_front();
        });
    };

function recebe_senha(){
    const senha = prompt("Digite sua senha:");
    return senha;
}

