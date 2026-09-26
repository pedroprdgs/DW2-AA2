import Ordem from "../models/Ordem.js";

const ordens = [];

function validarDadosOrdem(dados){
    const{
        quantidadeProduzida,
        custoUnitarioBase,
        estoqueInicial
    } = dados;

    if(quantidadeProduzida === undefined){
        throw new Error("quantidadeProduzida é obrigatório.");
    }

    if(custoUnitarioBase === undefined){
        throw new Error("custoUnitarioBase é obrigatório.");
    }

    if(estoqueInicial === undefined){
        throw new Error("estoqueInicial é obrigatório.");
    }

    if(quantidadeProduzida < 0){
        throw new Error("quantidadeProduzida não pode ser negativa.");
    }

    if(custoUnitarioBase < 0){
        throw new Error("custoUnitarioBase não pode ser negativo.");
    }

    if(estoqueInicial < 0){
        throw new Error("estoqueInicial não pode ser negativo.");
    }
}

export function criarOrdem(dados){
    const {
        codigoOrdem,
        codigoProduto,
        tipoProduto,
        quantidadeProduzida,
        custoUnitarioBase,
        estoqueInicial
    } = dados;

    validarDadosOrdem(dados);

    // Checando se o código já existe
    const ordemExistente = ordens.find(
        ordem => ordem.codigoOrdem === codigoOrdem
    );

    if(ordemExistente){
        throw new Error("Código da ordem já cadastrado");
    }

    // Validação do tipo do produto
    let tipoValido = false;

    for(let tipo = 1; tipo <= 3; tipo++){
        if(tipoProduto === tipo){
            tipoValido = true;
            break;
        }
    }

    if(!tipoValido){
        throw new Error("tipoProduto deve ser 1, 2 ou 3.");
    }

    const ordem = new Ordem(codigoOrdem, codigoProduto, tipoProduto, quantidadeProduzida, custoUnitarioBase, estoqueInicial);
    ordem.calcular();
    ordens.push(ordem);

    return ordem;
}

export function listarOrdens(filtros = {}){
    let resultado = ordens;

    if(filtros.tipo !== undefined){
        resultado = resultado.filter(
            ordem => ordem.tipoProduto === Number(filtros.tipo)
        );
    }

    if(filtros.alerta !== undefined){
        resultado = resultado.filter(
            ordem => ordem.alertaEstoque === filtros.alerta
        );
    }

    return resultado;
}

export function buscarOrdem(codigoOrdem){
    return ordens.find(
        ordem => ordem.codigoOrdem === codigoOrdem
    );
}

export function atualizarOrdem(codigoOrdem, dados){
    const ordem = ordens.find(
        ordem => ordem.codigoOrdem === codigoOrdem
    );

    if(!ordem){
        throw new Error("Ordem não encontrada.");
    }

    const {
        codigoProduto,
        tipoProduto,
        quantidadeProduzida,
        custoUnitarioBase,
        estoqueInicial
    } = dados;

    if(codigoProduto !== undefined){
        ordem.codigoProduto = codigoProduto;
    }

    if(tipoProduto !== undefined){
        let tipoValido = false;

        for(let tipo = 1; tipo <= 3; tipo++){
            if(tipoProduto === tipo){
                tipoValido = true;
                break;
            }
        }

        if(!tipoValido){
            throw new Error("tipoProduto deve ser 1, 2 ou 3.");
        }

        ordem.tipoProduto = tipoProduto;
    }

    if(quantidadeProduzida !== undefined){
        ordem.quantidadeProduzida = quantidadeProduzida;
    }

    if(custoUnitarioBase !== undefined){
        ordem.custoUnitarioBase = custoUnitarioBase;
    }

    if(estoqueInicial !== undefined){
        ordem.estoqueInicial = estoqueInicial;
    }

    ordem.calcular();

    return ordem;
}

export function deletarOrdem(codigoOrdem){
    const indice = ordens.findIndex(
        ordem => ordem.codigoOrdem === codigoOrdem
    );

    if(indice === -1){
        throw new Error("Ordem não encontrada.");
    }

    ordens.splice(indice, 1);
}

export function gerarRelatorio(){
    const totalOrdens = ordens.length;

    let estoquePorTipo = {
        padrao: 0,
        premium: 0,
        sobEncomenda: 0
    };

    let quantidadeAlertas = {
        alto: 0,
        critico: 0,
        normal: 0
    };

    let custoTotal = 0;

    let ordemMaisCara = null;
    let ordemMaisBarata = null;

    const porProduto = {};

    for(const ordem of ordens){
        // Estoque por tipo
        switch(ordem.tipoProduto){
            case 1:
                estoquePorTipo.padrao += ordem.estoqueFinal;
                break;
            case 2:
                estoquePorTipo.premium += ordem.estoqueFinal;
                break;
            case 3:
                estoquePorTipo.sobEncomenda += ordem.estoqueFinal;
                break;
        }

        // Alertas
        switch(ordem.alertaEstoque){
            case "ALTO":
                quantidadeAlertas.alto++;
                break;
            case "CRITICO":
                quantidadeAlertas.critico++;
                break;
            case "NORMAL":
                quantidadeAlertas.normal++;
                break;
        }

        // Custo total
        custoTotal += ordem.custoTotal;

        // Mais cara
        if(ordemMaisCara === null || ordem.custoTotal > ordemMaisCara.custoTotal){
            ordemMaisCara = ordem
        }

        // Mais barata
        if(ordemMaisBarata === null || ordem.custoTotal < ordemMaisBarata.custoTotal){
            ordemMaisBarata = ordem
        }

        // Por produto
        if(!porProduto[ordem.codigoProduto]){
            porProduto[ordem.codigoProduto] = {
                estoqueFinalConsolidado: 0,
                valorTotalInvestido: 0
            };
        }

        porProduto[ordem.codigoProduto].estoqueFinalConsolidado += ordem.estoqueFinal;

        porProduto[ordem.codigoProduto].valorTotalInvestido += ordem.custoTotal;
    }

    const mediaCustoTotalPorOrdem = totalOrdens === 0 ? 0 : Number((custoTotal / totalOrdens).toFixed(2));

    return{
        totalOrdens,
        estoquePorTipo,
        mediaCustoTotalPorOrdem,
        ordemMaisCara,
        ordemMaisBarata,
        quantidadeAlertas,
        porProduto
    };
}