// Conselho (/council) no modo demonstração: pautas, painéis e uma crítica curta de cada membro.
import { tr } from '../i18n';

export const COUNCIL_TOPICS = [tr('Lançar hoje ou esperar?'), tr('Monorepo ou polyrepo?'), tr('Cobrar por uso ou por assento?')];

/** Painéis de 3 (as tríades da skill) e um maior, de vez em quando. */
export const COUNCIL_PANELS: readonly (readonly string[])[] = [
  ['sun-tzu', 'machiavelli', 'aurelius'],
  ['torvalds', 'musashi', 'feynman'],
  ['aristotle', 'ada', 'feynman'],
  ['karpathy', 'sutskever', 'ada'],
  ['socrates', 'lao-tzu', 'watts'],
  ['socrates', 'feynman', 'torvalds', 'machiavelli', 'sun-tzu', 'aurelius'],
];

export const COUNCIL_CRITIQUES: Readonly<Record<string, string>> = {
  socrates: tr('Antes de decidir: o que exatamente chamamos de “pronto”? Essa premissa ninguém examinou.'),
  aristotle: tr('Separemos em categorias: risco técnico, de mercado e de execução. Só o primeiro está medido.'),
  machiavelli: tr('Quem ganha com o atraso? Sigam os incentivos: o concorrente prefere que vocês esperem.'),
  'sun-tzu': tr('O terreno favorece quem chega primeiro. Lancem num flanco pequeno, longe do adversário forte.'),
  musashi: tr('Ainda não é hora do golpe. O corte decisivo vem depois do primeiro dado real.'),
  aurelius: tr('Sob nosso controle está a qualidade da entrega. O resto, aceitem com serenidade.'),
  'lao-tzu': tr('Talvez o melhor movimento seja não forçar. Deixem o uso real mostrar o caminho.'),
  ada: tr('Isso dá para mecanizar: um teste automático decide melhor que a opinião de qualquer um aqui.'),
  feynman: tr('Se não cabe numa frase, ainda não entendemos. Rodem o experimento menor primeiro.'),
  torvalds: tr('Chega de teoria. Mostrem o código, rodem os testes e enviem hoje.'),
  watts: tr('E se o problema não for lançar ou esperar, mas a pressa que inventamos em volta disso?'),
  karpathy: tr('Olhem os dados antes do modelo: a maioria dos erros está nos exemplos, não na arquitetura.'),
  sutskever: tr('Escalar sem medir o risco é apostar às cegas. Definam o limite de segurança antes.'),
};
