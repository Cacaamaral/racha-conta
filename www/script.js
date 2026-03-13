// Array global que armazenará as pessoas e seus gastos
let people = [];

/**
 * Captura, valida e adiciona uma pessoa ao array de estado.
 * Agora inclui verificação de duplicidade de nomes para somar valores.
 */
function addPerson() {
    const nameInput = document.getElementById('person-name');
    const amountInput = document.getElementById('person-amount');

    // Extrai o nome removendo espaços em branco nas extremidades
    const name = nameInput.value.trim();
    // Converte o valor inserido para um número decimal
    const amount = parseFloat(amountInput.value);

    // Valida se os campos foram preenchidos corretamente e com valores lógicos
    if (name === '' || isNaN(amount) || amount < 0) {
        alert('Por favor, insira um nome válido e o valor consumido.');
        return;
    }

    // Busca no array global se já existe uma pessoa com o nome inserido.
    // Converte ambos os nomes para minúsculas (toLowerCase) para evitar que 
    // "João" e "joão" sejam tratados como duas pessoas diferentes.
    const existingIndex = people.findIndex(
        person => person.name.toLowerCase() === name.toLowerCase()
    );

    // O método findIndex retorna -1 se não encontrar nada.
    // Se retornar um valor diferente de -1, significa que a pessoa já existe na lista.
    if (existingIndex !== -1) {
        // Acessa o objeto da pessoa existente e soma o novo valor ao montante atual
        people[existingIndex].amount += amount;
    } else {
        // Caso não exista, cria um novo objeto e insere no array
        people.push({ name: name, amount: amount });
    }

    // Reseta os campos de entrada de texto no HTML para facilitar a próxima inserção
    nameInput.value = '';
    amountInput.value = '';

    // Chama a função que reconstrói a lista visual na tela com os dados atualizados
    renderPeople();

    // Oculta a área de resultados para forçar o usuário a clicar em "Calcular Divisão" novamente
    document.getElementById('result-section').style.display = 'none';
}

/**
 * Remove uma pessoa do array baseando-se no índice e atualiza a interface.
 * @param {number} index - A posição do elemento no array.
 */
function deletePerson(index) {
    // Remove 1 elemento a partir da posição 'index'
    people.splice(index, 1);

    // Re-renderiza a lista visual
    renderPeople();

    // Oculta os resultados antigos, forçando um novo cálculo
    document.getElementById('result-section').style.display = 'none';
}

/**
 * Atualiza o HTML para mostrar as pessoas recém-adicionadas e os botões de exclusão.
 */
function renderPeople() {
    const section = document.getElementById('people-section');
    section.innerHTML = '';

    // Itera sobre o array passando também o índice da iteração
    people.forEach((person, index) => {
        const div = document.createElement('div');
        div.className = 'person-item';

        // Estrutura o HTML interno separando dados da pessoa do botão de exclusão
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
 * Executa a lógica de divisão da conta com base na escolha do usuário.
 */
function calculateSplit() {
    if (people.length === 0) {
        alert('Adicione pelo menos uma pessoa antes de calcular.');
        return;
    }

    // Captura o tipo de divisão escolhida nos botões de rádio
    const splitType = document.querySelector('input[name="split-type"]:checked').value;

    // Captura e valida a porcentagem da gorjeta
    const tipInput = document.getElementById('tip-percentage');
    const tipPercentage = parseFloat(tipInput.value) || 0;

    // Calcula o valor total apenas dos pedidos
    const subtotal = people.reduce((sum, person) => sum + person.amount, 0);

    // Impede o cálculo se a soma dos pedidos for zero
    if (subtotal === 0) {
        alert('A soma dos pedidos não pode ser zero.');
        return;
    }

    // Calcula o valor financeiro da gorjeta baseado na porcentagem
    const totalTipValue = subtotal * (tipPercentage / 100);

    // Valor total absoluto que precisa ser pago ao restaurante
    const totalGeral = subtotal + totalTipValue;

    // Prepara o container de resultados
    const resultSection = document.getElementById('result-section');
    resultSection.style.display = 'block';
    resultSection.innerHTML = '<h3>Resultado da Divisão:</h3>';

    // Ramificação lógica baseada no tipo de divisão escolhida
    if (splitType === 'equal') {
        // Divisão Igualitária: Divide o valor total final pelo número de pessoas
        const amountPerPerson = totalGeral / people.length;

        people.forEach(person => {
            const p = document.createElement('p');
            p.innerHTML = `<span>${person.name}</span> <strong>R$ ${amountPerPerson.toFixed(2)}</strong>`;
            resultSection.appendChild(p);
        });

    } else {
        // Divisão Proporcional: Mantém o peso do consumo individual
        people.forEach(person => {
            // Peso de consumo da pessoa sobre o subtotal
            const proportion = person.amount / subtotal;

            // Valor devido pela pessoa (consumo próprio + parte proporcional da gorjeta)
            const personTotal = person.amount + (totalTipValue * proportion);

            const p = document.createElement('p');
            p.innerHTML = `<span>${person.name}</span> <strong>R$ ${personTotal.toFixed(2)}</strong>`;
            resultSection.appendChild(p);
        });
    }

    // Exibe o total geral no final da lista
    const totalElement = document.createElement('h4');
    totalElement.innerText = `Total da Mesa: R$ ${totalGeral.toFixed(2)}`;
    resultSection.appendChild(totalElement);
}