const URL_RECORD = 'http://localhost:3000/api/records'; // A URL da API (já definida para a Vercel)

$(document).ready(function() {
    let records = [];

    // Função para carregar registros do servidor
    function loadRecords() {
        $.getJSON(URL_RECORD, function(data) {
            console.log("Dados recebidos da API:", data);
            records = data;
            renderTable(records); // Passa os dados para a função renderTable
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("Erro ao carregar os registros:", textStatus, errorThrown);
        });
    }

    // Função para registrar o ponto
    $('#registerButton').click(function() {
        const data = new Date();
        const recordDate = data.toLocaleDateString();
        const currentTime = data.toLocaleTimeString();
    
        // Buscar registro do colaborador para o dia
        let existingRecord = records.find(record => record.nome === 'Lucas Dourado Candido' && record.data === recordDate);
        console.log("Registro encontrado para atualização:", existingRecord);
    
        if (existingRecord && existingRecord.id) {
            // Atualizar o próximo campo do registro existente
            if (!existingRecord.entrada) {
                existingRecord.entrada = currentTime;
            } else if (!existingRecord.saidaAlmoco) {
                existingRecord.saidaAlmoco = currentTime;
            } else if (!existingRecord.entradaAlmoco) {
                existingRecord.entradaAlmoco = currentTime;
            } else if (!existingRecord.saida) {
                existingRecord.saida = currentTime;
            }
    
            // Enviar a atualização para o servidor
            $.ajax({
                url: `${URL_RECORD}/${existingRecord.id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(existingRecord),
                success: function(response) {
                    console.log(response.message || 'Registro atualizado com sucesso');
                    loadRecords(); // Recarrega a tabela após a atualização
                },
                error: function(error) {
                    console.log('Erro ao atualizar o registro:', error.responseJSON?.message || error.statusText);
                }
            });
        } else {
            // Criar novo registro para o dia
            const newRecord = {
                nome: "Lucas Dourado Candido",
                data: recordDate,
                entrada: currentTime,
                saidaAlmoco: "",
                entradaAlmoco: "",
                saida: "",
                observacao: ""
            };
    
            $.ajax({
                url: URL_RECORD,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newRecord),
                success: function(response) {
                    console.log(response.message || 'Novo registro adicionado');
                    records.push(newRecord);
                    renderTable(records);
                },
                error: function(error) {
                    console.log('Erro ao adicionar o registro:', error.responseJSON?.message || error.statusText);
                }
            });
        }
    });
    

    // Renderizar a tabela com os registros
    function renderTable(filteredRecords) {
        console.log("Dados para renderização:", filteredRecords);
        const $table = $('#recordsTable tbody');
        $table.empty();
        filteredRecords.forEach(record => {
            $table.append(`
                <tr>
                    <td>${record.nome}</td>
                    <td>${record.data}</td>
                    <td>${record.entrada || ''}</td>
                    <td>${record.saidaAlmoco || ''}</td>
                    <td>${record.entradaAlmoco || ''}</td>
                    <td>${record.saida || ''}</td>
                    <td>${record.observacao || ''}</td>
                </tr>
            `);
        });
        console.log("Registros após renderização:", filteredRecords);
    }

    // Carregar os registros ao carregar a página
    loadRecords();
});
