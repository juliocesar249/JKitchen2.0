class PedidoController {

    constructor() {
        this._pratosCheckboxes = undefined;
    }
    
    adiciona(event) {
        event.preventDefault();
        
        this._pratosCheckboxes = document.querySelectorAll(':checked');

        this._pratosCheckboxes.length ? this._pratosCheckboxes.forEach(cartao => PedidoController.acessaIndexedDB(this.criaPrato(cartao))) : alert('Você deve escolher ao menos um prato');
    }

    criaPrato(cartao) {
        let nome = cartao.parentElement.innerText.match(/^[A-Z][a-zãõêô.\s{1,1}]+/g).toString().replace('\n\n', '');
        let preco = parseFloat(cartao.parentElement.innerText.match(/[^A-Zãõêôa-z\s$]/g).join('').replace(',', '.'));
        let quantidade = parseInt(cartao.parentElement.querySelector('.quantidade__campo').value.length > 0 ? cartao.parentElement.querySelector('.quantidade__campo').value : 1);

        return new Prato(nome, preco, quantidade);
    }

    static acessaIndexedDB(prato) {
        let dbName = 'JKitchen';
        let version = 1;

        let openRequest = window.indexedDB.open(dbName, version);

        openRequest.onupgradeneeded = e => {
            console.log('Database criado/atualizdo');

            let minhaConnection = e.target.result;

            if(minhaConnection.objectStoreNames.contains('pratos')) minhaConnection.deleteObjectStore('pratos');
            minhaConnection.createObjectStore('pratos', { autoIncrement: true });

        }

        openRequest.onsuccess = e => {
            connection = e.target.result;

            this.adicionaNoIndexed(prato);
        }

        openRequest.onerror = e => {
            console.log(e.target.error);
        }
        
    }

    static comparaPratos(pratoCriado, pratosExistentes) {
        let resultado = pratosExistentes.map(pratoExistente => {
            return [pratoCriado].find(prato => !prato.isEquals(pratoExistente));
        })
        return resultado.some(elemento => elemento == undefined) ? [undefined] : resultado;
    }
    
    static adicionaNoIndexed(pratoCriado) {
        ConnectionFactory.getConnection()
            .then(connection => new PratoDao(connection))
            .then(dao => dao.adiciona(pratoCriado))
            .catch(erro => console.log(erro));
        
    }

    static apagaIndexed() {
        ConnectionFactory.getConnection()
            .then(conexao => {
                conexao
                .transaction('pratos', 'readwrite')
                .objectStore('pratos')
                .clear();
            })
            .catch(erro => console.log(erro));
    }

    pegaTabela() {
        return document.querySelector('tbody');
    }

    adicionaTabela() {
        ConnectionFactory.getConnection()
            .then(connection => new PratoDao(connection))
            .then(dao => {
                dao.listaDePratos()
                    .then(lista => {
                        let listaPratos = lista;
                        
                        let tabela = this.pegaTabela();

                        listaPratos.forEach(prato => {
                            let elemento = `
                                <tr>
                                    <td id="nome" title="Nome do prato">${prato._nome}</td>
                                    <td id="quantidade">${prato._quantidade}</td>
                                    <td id="preco" title="Preço do prato">R$${JSON.stringify(prato._preco * prato._quantidade).indexOf('.') > 0 ? JSON.stringify(prato._preco * prato._quantidade).replace('.', ',') : prato._preco * prato._quantidade},00</td>
                                </tr>
                            `

                            tabela.innerHTML += elemento;
                        })
                        let precos = [];
                        document.querySelectorAll('#preco').forEach(td => {
                            precos.push(parseFloat(td.innerText.replace('R$', '').replace(',', '.')));
                        })

                        let precoTotal = JSON.stringify(precos.reduce((precoAnterior, precoAtual) => precoAnterior + precoAtual)).indexOf('.') > 0 ? JSON.stringify(precos.reduce((precoAnterior, precoAtual) => precoAnterior + precoAtual)).replace('.', ',') : JSON.stringify(precos.reduce((precoAnterior, precoAtual) => precoAnterior + precoAtual));

                        tabela.innerHTML += `<tr><td colspan="3">R$${precoTotal.indexOf(',') >= 0 ? precoTotal : precoTotal + ",00"}</td></tr>`;
                    })
            })
            .catch(erro => console.log(erro));
    }

    static voltar() {
        this.apagaIndexed();
        window.location.href="index.html";
    }

    pagar() {
        let metodosPagamento = [];
        document.querySelectorAll('.pagamentos__radio').forEach(elemento => metodosPagamento.push(elemento));
        let url = window.location.href;

        if(metodosPagamento.some(pagamento => pagamento.checked))  {
            
            window.location.href = url + '#openModal';
            document.querySelector('.modalDialog').style.animation = 'modalAnim 3s forwards';
            setTimeout(() => {
                
                PedidoController.voltar();
            }, 3000);
        } else {
            alert('Escolha a forma de pagamento.');
        }
    }


}


