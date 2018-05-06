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
            set_hidden("alert")
        } else {
            document.getElementById("alert").hidden = false;
            document.getElementById("alert").innerHTML = alert_simples("Frontend não cadastrado!");
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
                document.getElementById("alert").hidden = true;
            }
        });
    }
}

function update_msgs() {
    if (frontend.length != 0){
        fetch('http://150.165.85.16:9900/api/msgs')
        .then(r => r.json())
        .then(data => {
            msgs = data;
            update_views(msgs.sort(function(a,b) {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()}));
        });
    }
}

function update_views(array) {
    listagem.hidden = false;
    document.getElementById("alert").hidden = true;
    const itens = array.filter(function (e) {
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
            if(result.status == 401){
                swal("Senha incorreta");
            } else {
                update_msgs();
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
    let array = []
    if(opcao === "titulo_p") {
        array = msgs.filter(a => a.title.toLowerCase().indexOf(atributo.value.toLowerCase()) != -1);
    } else if (opcao === "mensagem_p") {
        array = msgs.filter(a => a.msg.toLowerCase().indexOf(atributo.value.toLowerCase()) != -1);
    } else {
        array = msgs.filter(a => a.author.toLowerCase().indexOf(atributo.value.toLowerCase()) != -1);
    }
    if (array.length == 0) {
        listagem.hidden = true;
        document.getElementById("alert").hidden = false;
        document.getElementById("alert").innerHTML = alert_simples("Nenhuma mensagem encontrada!");
    } else {
        set_hidden("alert");
        update_views(array);
    }
}



function set_hidden(doc){
    if (doc == "alert"){
        document.getElementById("alert").hidden = "true";
    }
    else if (doc.hidden == false && frontend.length != 0) {
        doc.hidden = true;
    }
}

function show(doc){
    if (frontend.length != 0) {
        document.getElementById("alert").hidden = "true";
        doc.hidden = !doc.hidden;   
    } else {
        alert_login();
    }
}

function alert_simples(mensagem) {
    return `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>${mensagem}</strong>
            <button onclick="set_hidden('alert')" type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
    </div>`;
}

function alert_login() {
    if (frontend.length == 0) {
        document.getElementById("alert").hidden = false;
        document.getElementById("alert").innerHTML = alert_simples("Você precisa estar logado!");
    } else {
        listagem.hidden = false;
        document.getElementById("alert").hidden = true;
    }
}

function get_msgs_front() {
    alert_login();
    fetch('http://150.165.85.16:9900/api/msgs')
    .then(r => r.json())
    .then(data => {
        msgs = data;
        msgs_front(msgs.sort(function(a,b) {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()}));
    });
}

function msgs_front(mensagens) {
    const items = msgs.filter(e => e.frontend === frontend).map(e => `
    <div class="card bg-light mb-3 shadow scroll">
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
    swal("Digite sua senha:", {
        content: {
            element: "input",
            attributes: {
              type: "password",
            },
          },
      })
      .then((value) => {
          var result = null;
          const body = JSON.stringify({credentials: `${frontend}:${value}`});
          fetch(`http://150.165.85.16:9900/api/msgs/${id}`, {
          method: 'delete', 
          body:body})
              .then(function(response){
                  if(response.status == 401){
                      swal("Senha incorreta");
                  }
              }).then(function(){
                  get_msgs_front();
        });
    });
};

view_botao();

function view_botao(){
    window.onscroll = function(){
        var top = window.pageYOffset || document.documentElement.scrollTop
        if( top > 300 ) {
            document.getElementById("topo").hidden = false;
        } else {
            document.getElementById("topo").hidden = true;
        }
    }
}

/*function view_botao() {
    if( window.pageYOffset > 350 ) {
        console.log("ok");
        document.getElementById("topo").hidden = false;
    }
}*/