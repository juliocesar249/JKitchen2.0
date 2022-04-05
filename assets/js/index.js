const form = document.querySelector('form');

function confirmarPedidos(event) {
    event.preventDefault();

    let pratosSeleciondos =  document.querySelectorAll(':checked');

    pratosSeleciondos.forEach(prato => {

        let pratoObj = {
            nome: prato.parentElement.innerText.match(/^[A-Z][a-zãõêô.\s{1,1}]+/g).toString().replace('\n\n', ''),
            preco: parseFloat(prato.parentElement.innerText.match(/[^A-Zãõêôa-z\s$]/g).join('').replace(',', '.'))
        }

        console.log(pratoObj);

    });

}