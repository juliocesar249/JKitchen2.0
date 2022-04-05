class Prato {
    constructor(nome, preco, quantidade) {
        this._nome = nome;
        this._preco = preco;
        this._quantidade = quantidade;

        Object.freeze(this);
    }

    get nome() {
        return new this._nome;
    }

    get preco() {
        return this._preco;
    }

    get quantidade() {
        return this._quantidade;
    }

    isEquals(pratoCriado) {
        return JSON.stringify(this._nome) == JSON.stringify(pratoCriado._nome) && JSON.stringify(this._preco) == JSON.stringify(pratoCriado._preco) && JSON.stringify(pratoCriado._quantidade) && JSON.stringify(this._quantidade);
    }
}