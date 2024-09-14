const { readFileSync } = require('fs');
const { get } = require('http');


class ServicoCalculoFatura {
    calcularCredito(pecas, apre) { 
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (getPeca(pecas,apre).tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;   
    }
    
    calcularTotalApresentacao(pecas, apre) {
        let total = 0;
    
        switch (getPeca(pecas,apre).tipo) {
            case "tragedia":
                total = 40000;
                if (apre.audiencia > 30) {
                total += 1000 * (apre.audiencia - 30);
            }
            break;
            case "comedia":
                total = 30000;
                if (apre.audiencia > 20) {
                    total += 10000 + 500 * (apre.audiencia - 20);
                }
                total += 300 * apre.audiencia;
                break;
            default:
                throw new Error(`Peça desconhecia: ${getPeca(pecas,apre).tipo}`);
        }
        return total
    }

    calcularTotalFatura(pecas, apresentacoes) {
        let total = 0
        for(let apre of apresentacoes){
            total += this.calcularTotalApresentacao(pecas,apre)
        }
        return total
    }
    
    
    calcularTotalCreditos(pecas, apresentacoes) {
        let creditos = 0;
        for(let apre of apresentacoes){
            creditos += this.calcularCredito(pecas,apre)
        }
        return creditos
    }

}


function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
      { style: "currency", currency: "BRL",
        minimumFractionDigits: 2 }).format(valor/100);
  }

function getPeca(pecas, apre){
    return pecas[apre.id]

}

function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      // mais uma linha da fatura
      faturaStr += `  ${getPeca(pecas,apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas,apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas,fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas,fatura.apresentacoes)} \n`;
    return faturaStr;
}

// function gerarFaturaHTML (fatura, pecas) {
//     let faturaHTML = `<html>\n<p> ${fatura.cliente} </p>\n<ul>\n`;

//     for (let apre of fatura.apresentacoes) {

//       // mais uma linha da fatura
//       faturaHTML += `<li>  ${getPeca(pecas,apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas,apre))} (${apre.audiencia} assentos) </li>\n`;
//     }
//     faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas,fatura.apresentacoes))} </p>\n`;
//     faturaHTML += `<p>Créditos acumulados: ${calc.calcularTotalCreditos(pecas,fatura.apresentacoes)} </p>\n`;
//     return faturaHTML;
// }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
//const faturaHTML = gerarFaturaHTML(faturas, pecas, calc)
console.log(faturaStr);
//console.log(faturaHTML)
