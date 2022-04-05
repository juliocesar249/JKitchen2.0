class PratoDao {
    constructor(connection) {
        this._connection = connection;
        this._store = 'pratos'
    }

    adiciona(...pratoCriado) {

        return new Promise((resolve, reject) =>{ConnectionFactory.pegaDadosDoIndexed()
        .then(itens => {
            let prato = PedidoController.comparaPratos(pratoCriado[0], itens);

            if(prato.some(elemento => elemento != undefined)) {
                ConnectionFactory.getConnection()
                    .then(connection => {
                        
                        let transaction = connection.transaction(['pratos'], 'readwrite');
                        let store = transaction.objectStore('pratos');
                        let request = store.add(prato[0]); 
                        request.onsuccess = e => {
                            resolve('Prato/s salvo/s!');
                            window.location.href = 'pagamento.html'
                        };
                        request.onerror = e => reject(e.target.error);
                    })

            } else if(itens.length == 0) {
                ConnectionFactory.getConnection()
                    .then(connection => {

                        let transaction = connection.transaction(['pratos'], 'readwrite');
                        let store = transaction.objectStore('pratos');
                        let request = store.add(pratoCriado[0]);    
                        request.onsuccess = e => {
                            resolve('Prato/s salvo/s!');
                            setTimeout(() => window.location.href = 'pagamento.html', 50);
                        };
                        request.onerror = e => reject(e.target.error);
                    })
            } else { 
                console.log("Prato já foi incluído");
                window.location.href = 'pagamento.html';
            }
        })
        .catch(erro => { throw new Error(erro)})})
    }

    listaDePratos() {
        return new Promise((resolve, reject) => {
                let cursor = this._connection
                .transaction(['pratos'], 'readwrite')
                .objectStore('pratos')
                .openCursor();
    
            let pratosImportados = [];
    
            cursor.onsuccess = e => {
                let atual = e.target.result;
    
                if(atual) {
                    let prato = atual.value;
    
                    pratosImportados.push(prato);
    
                    atual.continue();
                } else {
                    resolve(pratosImportados);
                }
            }

            cursor.onerror = e => reject(e.target.error);})
    }

    apaga() {
        return new Promise((resolve, reject) => {
            let request = this._connection
                .transaction(['pratos'], 'readwrite')
                .objectStore('pratos')
                .clear();
                
            request.onsuccess = e => resolve();
            
            request.onerror = e => reject(e.target.error);
        })
    }
}