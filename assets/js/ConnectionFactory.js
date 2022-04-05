let connection = null;
class ConnectionFactory {
    constructor() {
        throw new Error('Não é possível instânciar esta classe!');
    }

    static getConnection() {
        return new Promise((resolve, reject) => {

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

                resolve(e.target.result);
            }

            openRequest.onerror = e => {
                console.log(e.target.error);
                reject(e.target.error.name);
            }
        })
    }

    static pegaDadosDoIndexed() {
        return new PratoDao(connection)
            .listaDePratos()
            .then(lista => lista)
            .catch(erro => console.log(erro));
    }
}