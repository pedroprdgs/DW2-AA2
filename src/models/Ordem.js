export default class Ordem{
    constructor(codigoOrdem, codigoProduto, tipoProduto, quantidadeProduzida, custoUnitarioBase, estoqueInicial){
        this.codigoOrdem = codigoOrdem;
        this.codigoProduto = codigoProduto;
        this.tipoProduto = tipoProduto;
        this.quantidadeProduzida = quantidadeProduzida;
        this.custoUnitarioBase = custoUnitarioBase;

        this.estoqueInicial = estoqueInicial;

        // Campos calculados
        this.custoUnitarioAjustado = 0;
        this.estoqueFinal = 0;
        this.custoTotal = 0;
        this.alertaEstoque = "NORMAL";
    }

    calcularEstoqueFinal(){
        this.estoqueFinal = this.estoqueInicial + this.quantidadeProduzida;
    }

    calcularCustoUnitario(){
        switch(this.tipoProduto){
            case 1:
                this.custoUnitarioAjustado = this.custoUnitarioBase;
                break;
            case 2:
                this.custoUnitarioAjustado = this.custoUnitarioBase * 1.1;
                break;
            case 3:
                this.custoUnitarioAjustado = this.custoUnitarioBase * 1.2;
                break;
        }

        this.custoUnitarioAjustado = Number(this.custoUnitarioAjustado.toFixed(2));
    }

    calcularAlerta(){
        if(this.estoqueFinal > 5000){
            this.alertaEstoque = "ALTO";
        }
        else if(this.estoqueFinal < 500){
            this.alertaEstoque = "CRITICO";
        }
        else{
            this.alertaEstoque = "NORMAL";
        }
    }

    calcularCustoTotal(){
        this.custoTotal = this.quantidadeProduzida * this.custoUnitarioAjustado;
        this.custoTotal = Number(this.custoTotal.toFixed(2));
    }

    calcular(){
        this.calcularEstoqueFinal();
        this.calcularCustoUnitario();
        this.calcularAlerta();
        this.calcularCustoTotal();
    }
}