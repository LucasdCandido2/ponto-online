const URL_RECORD = 'http://localhost:3000/api/records';

$(document).ready(function() {
    let records = [];

    // Função para carregar registros do servidor
    function loadRecords() {
        $.getJSON(URL_RECORD, function(data) {
            records = data;
            renderTable(records);
        });
    }

    // Função para registrar o ponto
    $('#registerButton').click(function() {
        const data = new Date();
        const recordDate = data.toLocaleDateString();
        const currentTime = data.toLocaleTimeString();

        // Buscar registro do colaborador para o dia
        let existingRecord = records.find(record => record.nome === 'Lucas Dourado Candido' && record.data === recordDate);

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
        const $table = $('#recordsTable');
        $table.empty();

        if (filteredRecords && filteredRecords.length > 0) {
            filteredRecords.forEach((record) => {
                if (record && record.nome) {
                    const row = `
                    <tr>
                        <td>${record.nome}</td>
                        <td>${record.data}</td>
                        <td>${record.entrada || ''}</td>
                        <td>${record.saidaAlmoco || ''}</td>
                        <td>${record.entradaAlmoco || ''}</td>
                        <td>${record.saida || ''}</td>
                        <td>${record.observacao || ''}</td>
                    </tr>
                    `;
                    $table.append(row);
                }
            });
        } else {
            $table.append('<tr><td colspan="7" class="text-center">Nenhum registro encontrado.</td></tr>');
        }
    }

    // Função para exportar para o Excel
    $('#exportExcel').click(function() {
        const filtroData = $('#dataFiltro').val();
        const registrosFiltrados = filtroData ? records.filter(record => record.data === filtroData) : records;

        const formattedRecords = registrosFiltrados.map(record => ({
            "Colaborador": record.nome,
            "Data": record.data,
            "Entrada": record.entrada,
            "Saída (Almoço)": record.saidaAlmoco,
            "Entrada (Almoço)": record.entradaAlmoco,
            "Saída": record.saida,
            "Observação": record.observacao
        }));

        const ws = XLSX.utils.json_to_sheet(formattedRecords);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registros de Ponto");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        const objectURL = URL.createObjectURL(blob);
        link.href = objectURL;
        link.download = "registro_ponto.xlsx";
        link.click();
    });

    $('#filterButton').click(function() {
        const dataInicio = $('#dataInicioFiltro').val();
        const dataFim = $('#dataFimFiltro').val();
    
        // Verificar se as datas foram selecionadas
        if (dataInicio && dataFim) {
            const registrosFiltrados = records.filter(record => {
                const recordDate = new Date(record.data.split('/').reverse().join('-')); // Converte 'dd/mm/aaaa' para 'aaaa-mm-dd'
                const startDate = new Date(dataInicio);
                const endDate = new Date(dataFim);
    
                // Verificar se a data do registro está dentro do intervalo
                return recordDate >= startDate && recordDate <= endDate;
            });
            renderTable(registrosFiltrados);
        } else {
            alert("Por favor, selecione a data de início e a data de fim.");
        }
    });

    // Carregar registros ao iniciar
    loadRecords();
});
