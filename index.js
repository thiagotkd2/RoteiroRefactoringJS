const { readFileSync } = require('fs');
const { get } = require('http');


class ServicoCalculoFatura {

    constructor(repo) {
        this.repo = repo;
     }

    calcularCredito(apre) { 
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (this.repo.getPeca(apre).tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;   
    }
    
    calcularTotalApresentacao(apre) {
        let total = 0;
    
        switch (this.repo.getPeca(apre).tipo) {
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
                throw new Error(`Peça desconhecia: ${this.repo.pecas.getPeca(apre).tipo}`);
        }
        return total
    }

    calcularTotalFatura(apresentacoes) {
        let total = 0
        for(let apre of apresentacoes){
            total += this.calcularTotalApresentacao(apre)
        }
        return total
    }
    
    
    calcularTotalCreditos(apresentacoes) {
        let creditos = 0;
        for(let apre of apresentacoes){
            creditos += this.calcularCredito(apre)
        }
        return creditos
    }

}

class Repositorio {
    constructor() {
      this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }
  
    getPeca(apre) {
      return this.pecas[apre.id];
    }
  }


function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
      { style: "currency", currency: "BRL",
        minimumFractionDigits: 2 }).format(valor/100);
  }

function gerarFaturaStr (fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      // mais uma linha da fatura
      faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
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
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
//const faturaHTML = gerarFaturaHTML(faturas, pecas, calc)
console.log(faturaStr);
//console.log(faturaHTML)
