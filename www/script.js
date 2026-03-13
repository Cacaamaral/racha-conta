// Array global que armazena os dados das pessoas na mesa
let people = [];

/**
 * Adiciona uma nova pessoa ou soma o valor se a pessoa já existir na lista.
 */
function addPerson() {
    const nameInput = document.getElementById('person-name');
    const amountInput = document.getElementById('person-amount');

    // Remove espaços em branco antes e depois do texto inserido
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // Valida estritamente se os dados inseridos são válidos
    if (name === '' || isNaN(amount) || amount < 0) {
        alert('Por favor, insira um nome válido e o valor consumido.');
        return;
    }

    // Procura no array se já existe alguém com o mesmo nome (ignorando maiúsculas e minúsculas)
    const existingIndex = people.findIndex(
        person => person.name.toLowerCase() === name.toLowerCase()
    );

    // Se o índice for diferente de -1, a pessoa já existe
    if (existingIndex !== -1) {
        // Soma o novo valor ao valor previamente cadastrado da pessoa
        people[existingIndex].amount += amount;
    } else {
        // Se a pessoa não existir no array, cria um novo registro
        people.push({ name: name, amount: amount });
    }

    // Limpa os campos de texto do HTML
    nameInput.value = '';
    amountInput.value = '';

    // Reconstrói a lista visual na tela com os dados atualizados
    renderPeople();

    // Oculta o resultado anterior para forçar o usuário a recalcular
    document.getElementById('result-section').style.display = 'none';
}

/**
 * Remove uma pessoa específica da lista com base no seu índice no array.
 * @param {number} index - A posição do elemento no array.
 */
function deletePerson(index) {
    // Remove 1 elemento a partir da posição especificada
    people.splice(index, 1);

    // Atualiza a interface
    renderPeople();
    document.getElementById('result-section').style.display = 'none';
}

/**
 * Renderiza os elementos do array no documento HTML.
 */
function renderPeople() {
    const section = document.getElementById('people-section');
    // Limpa a lista visual atual para evitar duplicação de elementos na tela
    section.innerHTML = '';

    // Itera sobre o array para criar os elementos HTML de cada pessoa
    people.forEach((person, index) => {
        const div = document.createElement('div');
        div.className = 'person-item';

        // Estrutura o HTML interno, vinculando a função de exclusão ao índice
        div.innerHTML = `
            <div class="person-info">
                <span>${person.name}</span> 
                <strong>R$ ${person.amount.toFixed(2)}</strong>
            </div>
            <button class="delete-btn" onclick="deletePerson(${index})">Excluir</button>
        `;

        section.appendChild(div);
    });
}

/**
 * Realiza o cálculo da divisão da conta baseado nas preferências do usuário.
 */
function calculateSplit() {
    // Interrompe se não houver dados
    if (people.length === 0) {
        alert('Adicione pelo menos uma pessoa antes de calcular.');
        return;
    }

    // Captura as opções de configuração de taxas e método de divisão
    const splitType = document.querySelector('input[name="split-type"]:checked').value;
    const tipInput = document.getElementById('tip-percentage');
    const tipPercentage = parseFloat(tipInput.value) || 0;

    // Calcula a soma dos pedidos individuais
    const subtotal = people.reduce((sum, person) => sum + person.amount, 0);

    // Valida divisão por zero
    if (subtotal === 0) {
        alert('A soma dos pedidos não pode ser zero.');
        return;
    }

    // Processa os valores globais da conta
    const totalTipValue = subtotal * (tipPercentage / 100);
    const totalGeral = subtotal + totalTipValue;

    // Prepara a seção HTML para exibir os resultados
    const resultSection = document.getElementById('result-section');
    resultSection.style.display = 'block';
    resultSection.innerHTML = '<h3>Resultado da Divisão:</h3>';

    // Ramifica a lógica de acordo com o método escolhido
    if (splitType === 'equal') {
        const amountPerPerson = totalGeral / people.length;

        people.forEach(person => {
            const p = document.createElement('p');
            p.innerHTML = `<span>${person.name}</span> <strong>R$ ${amountPerPerson.toFixed(2)}</strong>`;
            resultSection.appendChild(p);
        });
    } else {
        people.forEach(person => {
            const proportion = person.amount / subtotal;
            const personTotal = person.amount + (totalTipValue * proportion);

            const p = document.createElement('p');
            p.innerHTML = `<span>${person.name}</span> <strong>R$ ${personTotal.toFixed(2)}</strong>`;
            resultSection.appendChild(p);
        });
    }

    // Anexa o total geral ao final do documento
    const totalElement = document.createElement('h4');
    totalElement.innerText = `Total da Mesa: R$ ${totalGeral.toFixed(2)}`;
    resultSection.appendChild(totalElement);
}