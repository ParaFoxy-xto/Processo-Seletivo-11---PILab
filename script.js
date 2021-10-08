
var parsedList = [];
let btn_upload = document.getElementById('btn-upload-csv').addEventListener('click', () => {
    /*
        Extraindo do botao o arquivo e transformando em CSV-->JSON  
        O comentário do codigo abaixo, gera uma tabela do arquivo no input, como teoricamente tera dois
        inputs, so repetir o processo para a entrada dos releases.
    */
    Papa.parse(document.getElementById('upload-csv').files[0], {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            parsedList = results.data
            console.log(results);
            /*console.log(results);
            let i = 0;
            results.data.map((data, index) => {
                if (i === 0) {
                    let table = document.getElementById('tbl-data');
                    generateTableHead(table, data);
                } else {
                    let table = document.getElementById('tbl-data');
                    generateTableRows(table, data);
                }
                i++;
            });*/

        }
    });
});
/*Entrada dos releases com o mesmo codigo que gera a tabela
    Foi-se utilizado o papaparse para fazer a conversão do arquivo,
    estava usando o online mas houve instabilidade, por isso tem a pasta com  o script em JS
    fazer outro conversor tbm n vale a pena ja q deixaria de cobrir algumas coisas
*/
var parsedRelease = [];
let btn_upload_release = document.getElementById('btn-upload-release-csv').addEventListener('click', () => {

    Papa.parse(document.getElementById('upload-release-csv').files[0], {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            parsedRelease = results.data
            console.log(results);

            /*;
            let i = 0;
            results.data.map(function (data) {

                if (i === 0) {

                    let table = document.getElementById('tbl-data');
                    generateTableHead(table, data);
                } else {
                    let table = document.getElementById('tbl-data');
                    generateTableRows(table, data);
                }
                i++;
            });
            */
        }
    });
});

/* Botao para confirmar a geracao da balanco, dps de colocar os arquivos ele aciona o evento pelo script*/
let btn_balance = document.getElementById('btn-balance').addEventListener('click', () => {
    lista_filhos = [];  //criacao de 2 listas auxiliares para trocarmos os valores sem perder nenhum na lista origina
    lista_aux = [];
/*Passando pelos items "Pais" da lista de catagories com os "pequenos" da lista de releases, passando todos os valores para 
a lista pai*/
    for (var l in parsedList) {
        lista_filhos = [];
        for (var m in parsedRelease) {
            if (parsedRelease[m].category_id == parsedList[l].id) {

                var initial_value = parseInt(parsedList[l].initial_value, 10);
                var qtd = parseInt(parsedRelease[m].amount, 10);
                var valor = parseInt(parsedRelease[m].value, 10);
                var total = qtd * valor + (initial_value);
                parsedRelease[m].prod = JSON.stringify(total);//Transformando o valor como produto, para o acesso no futuro

                total = JSON.stringify(total);
                parsedList[l].total = total;
                /*Depois de todos os valores serem passados, podemos agrupar os filhos no array auxliar para dps aguparmos o childs
                na categoria childs do pai, mudando tmm o id redundante*/

                parsedRelease[m].product_id = parsedRelease[m].category_id
                delete parsedRelease[m].category_id;

                lista_filhos.push(parsedRelease[m]); 
            }

        }
        parsedList[l]['total'] = total;
        parsedList[l].total = JSON.stringify(total);
        prod_lista = [];
        prod_lista = lista_filhos;

        parsedList[l]['child'] = lista_filhos;





    }
/*  sort da lista pela orientacao do ultimo no, assim os pequenos q tem o valor de referencia
    vao se agrupando de baixo para cima e incrementando o valor, ate chegar no total, no topo*/

    parsedList.sort(function (a, b) {
        return b.father - a.father;
    });
    //console.log(parsedList);    

/*Subida dos valores 1 a 1 dentro da propira lista parsedList que eh a lista das categorias, mantendo o valor unitario do childs
e o somatorio das categorias intermediarias e ao somatorio geral na classe do topo*/
    for (var l in parsedList) {
        lista_filhos = [];
        for (var m in parsedList) {
            if ((parsedList[m].father == parsedList[l].id) & (parsedList[l].id != 0)) {
                //console.log(typeof(parsedList[l].total));

                var auxChild = parseInt(parsedList[m].total, 10);
                var auxFather = parseInt(parsedList[l].total, 10);
                var auxTotal = auxFather + auxChild;

                parsedList[l].total = JSON.stringify(auxTotal);

                lista_filhos.push(parsedList[m]);
                delete parsedList[m]
            }
        }
        parsedList[l]['child'] = lista_filhos;
    }


});

/*criacao de um evento para a abertura de uma url para endpoint
    nunca fiz, acho que seria atraves de node, mas nunca apliquei e to sem tempo xD*/

let btn_print = document.getElementById('btn-print').addEventListener('click', () => {
    str = JSON.stringify(parsedList);
    const htmlDocument = document.implementation.createHTMLDocument();
    const customURL = htmlDocument.createElement('base');
    customURL.href = "index.html";
    htmlDocument.head.append(customURL);
    console.log("Base URL=" + customURL.href);
    const modifiedURL = htmlDocument.createElement("a");
    modifiedURL.href = "../balance";
    htmlDocument.body.append(modifiedURL);
    console.log("After Modifying URL=" + modifiedURL.href);
});



/*func para a geracao da tabela , os paramentros dela encaixam com a formtacao do papaparse
com a separacao do header e do corpo da tabela, com adaptacao da para fazer em modo cascata 
usando lista fica igual o exemplo do pilab*/
function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement('th');
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTableRows(table, data) {
    let newRow = table.insertRow(-1);
    data.map((row, index) => {
        let newCell = newRow.insertCell();
        let newText = document.createTextNode(row);
        newCell.appendChild(newText);
    });
}



