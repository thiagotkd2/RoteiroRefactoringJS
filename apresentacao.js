var formatarMoeda  =  require('./util.js')


module.exports = function gerarFaturaStr (fatura, calc) {
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