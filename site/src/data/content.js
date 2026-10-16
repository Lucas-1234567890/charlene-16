// ============================================================================
// CONTEÚDO DO SITE: edite aqui. Todo texto que aparece na tela vem deste arquivo.
// Tudo marcado com [PREENCHER] precisa de informação real antes de enviar.
// Para conferir o que falta:  grep -rn "PREENCHER" src/
// ============================================================================

export const content = {
  nome: 'Charlene',
  cargo: 'Gerente Comercial',
  empresa: 'Grupo Vitalmed',
  cidade: 'Salvador-BA',
  data: '16.10.2026',

  // Idade em número (ex.: 35) ou null para manter segredo.
  // Com null, o numeral gigante e as velas formam "16" (o dia do aniversário).
  idade: null,

  // Quem assina o presente (aparece no rodapé e no recado final)
  remetente: 'Lucas Amorim · Inteligência Comercial',

  // Time de Inteligência Comercial (usado nos números e no mural de recados)
  time: ['Lucas Amorim', 'Joelton', 'Adriana', 'Camile', 'Mariane', 'Jamile', 'Adriana', 'Ana Cláudia', 'Crislane'],

  // Número para o botão "mandar um abraço de volta" (só dígitos, com DDI e DDD, ex. '5571999999999').
  // Deixe vazio ('') para esconder o botão.
  whatsapp: '',
  whatsappMensagem: 'Recebi meu presente! 🎂 Obrigada, time!',

  // ------------------------------------------------------------------ 00 · intro
  intro: {
    status: 'Preparando sua edição exclusiva',
    autorizado: 'Acesso autorizado · Charlene',
    botao: 'Abrir presente',
    dica: 'Melhor com o som ligado 🔊',
  },

  // ------------------------------------------------------------------ 01 · hero
  hero: {
    eyebrow: 'Edição 16.10.2026 · Salvador-BA',
    titulo: ['CHAR', 'LENE'],
    manifesto: 'Edição única. Feita em Salvador. Sem reposição.',
    carimbos: ['Ed. única', 'Libra ♎', 'SSA · BA'],
    codigo: 'CHARLENE/16',
    preco: 'Prioridade: máxima',
    // Classificação de risco (cores da triagem de Manchester)
    abracoLabel: 'Classificação de risco do abraço',
    abracos: [
      { nivel: 'Verde', cor: '#2e9e5b', texto: 'Verde · pouco urgente: abraço de corredor, entre uma reunião e outra.' },
      { nivel: 'Amarelo', cor: '#f2c230', texto: 'Amarelo · urgente: abraço de meta batida, com tapinha nas costas.' },
      { nivel: 'Vermelho', cor: '#f33a2f', texto: 'Vermelho · emergência: abraço baiano imediato, com direito a "minha linda" e balançadinho.' },
    ],
    cta: 'Soprar as velas',
    sinais: 'Monitor cardíaco',
    dados: [
      ['Sinais vitais', 'Ótimos'],
      ['Prognóstico', 'Excelente'],
      ['Plantão', '24h de festa'],
    ],
  },

  // ------------------------------------------------------------------ 02 · ficha clínica
  ficha: {
    eyebrow: '02 · Ficha clínica',
    titulo: ['FICHA', 'CLÍNICA'],
    intro: 'Atendimento prioritário exige ficha completa. Esta aqui foi preenchida pelo time, com todo o cuidado.',
    cabecalho: 'Atendimento VIP · SSA',
    // Tom de brincadeira: validar com o time antes de enviar.
    linhas: [
      ['Paciente', 'Charlene, edição 2026'],
      ['Procedência', 'Salvador, Bahia, Brasil'],
      ['Composição', '60% estratégia · 30% dendê · 10% café'],
      ['Signo', 'Libra ♎ (equilíbrio até na negociação)'],
      ['Diagnóstico', 'Excesso crônico de competência'],
      ['Sinais vitais', 'Estáveis, animados e batendo meta'],
      ['Contraindicação', 'Ficar sem um bom café'],
      ['Conduta', 'Comemorar sem moderação'],
    ],
    prescricaoTitulo: 'Prescrição',
    prescricao: ['1 fatia de bolo', 'Abraços à vontade', 'Café 3x ao dia', 'Elogios contínuos'],
    carimbo: 'Triagem ok ✓',
  },

  // ------------------------------------------------------------------ 03 · bolo 3D
  bolo: {
    eyebrow: '03 · O bolo',
    titulo: ['SOPRE', 'AS VELAS'],
    texto: 'Sopra no microfone do celular, como num bolo de verdade. Ou toca nas velas, uma por uma.',
    botaoMic: 'Soprar no microfone',
    botaoSemMic: 'Soprar sem microfone',
    ouvindo: 'Ouvindo… sopra forte!',
    micNegado: 'Sem microfone? Sem problema: toca nas velas ou usa o outro botão.',
    contador: 'Velas acesas',
    pedido: 'FAÇA UM PEDIDO.',
    reacender: 'Acender de novo',
  },

  // ------------------------------------------------------------------ 04 · fitinhas do Bonfim
  fitas: {
    eyebrow: '04 · Lembrança do Senhor do Bonfim',
    titulo: ['TRÊS NÓS,', 'TRÊS PEDIDOS'],
    texto: 'Manda a tradição: amarre a fitinha com três nós e faça um pedido em cada um. Toque em três fitas para dar os nós. Cada uma guarda um desejo do time para você.',
    legenda: 'Lembrança do Senhor do Bonfim da Bahia',
    // Os 3 desejos do time (editar à vontade)
    desejos: [
      'Que o próximo ano traga metas batidas antes do prazo e comemorações fora de hora.',
      'Que nunca falte saúde, axé e gente boa do seu lado, dentro e fora da Vitalmed.',
      'Que você continue sendo exatamente quem é: a gente aprende muito só de estar perto.',
    ],
    final: 'Pedidos feitos. Agora é esperar a fitinha cair sozinha, que aí eles se realizam.',
  },

  // ------------------------------------------------------------------ 05 · em números
  numeros: {
    eyebrow: '05 · Charlene em números',
    titulo: ['EM', 'NÚMEROS'],
    nota: 'Dados auditados pelo departamento de carinho. Margem de erro: nenhuma.',
    // valor: número (anima contando) ou texto. Os [PREENCHER] são dados reais.
    linhas: [
      { metrica: 'Anos de Vitalmed', valor: 13, detalhe: 'Desde 2013. Mais de uma década fazendo a casa crescer.' },
      { metrica: 'Reuniões que viraram contrato', valor: 'Incontáveis', detalhe: 'A gente tentou contar. O Excel travou.' },
      { metrica: 'Cafés tomados com cliente', valor: '∞', detalhe: 'Fonte: todas as cafeterias de Salvador.' },
      { metrica: 'Vezes que disse "vamos bater essa meta"', valor: 999, prefixo: '+', detalhe: 'E na maioria das vezes bateu.' },
      { metrica: 'Pessoas que ela fez crescer (só na Inteligência Comercial)', valor: 9, detalhe: 'Lucas, Joelton, Adriana, Camile, Mariane, Jamile, Adriana, Ana Cláudia e Crislane.' },
    ],
  },

  // ------------------------------------------------------------------ 06 · os laudos
  colecao: {
    eyebrow: '06 · Os laudos',
    titulo: 'Laudos Charlene 2026',
    looks: [
      { tag: 'Laudo 01', nome: 'A ESTRATEGISTA', texto: 'Vê a meta antes de todo mundo e já chega com o caminho desenhado.', icone: 'alvo' },
      { tag: 'Laudo 02', nome: 'A LÍDER', texto: 'Puxa o time para cima. E, quando precisa, levanta a voz, sempre com carinho.', icone: 'time' },
      { tag: 'Laudo 03', nome: 'A BAIANA', texto: 'Salvador no sotaque, no sorriso e no jeito de resolver as coisas.', icone: 'sol' },
      { tag: 'Laudo 04', nome: 'A PROFISSIONAL', texto: 'Excelente no que faz e muito inteligente. Para quem ela abriu as portas do time, motivo de gratidão todo dia.', icone: 'foto' },
      { tag: 'Laudo 05', nome: '2027', texto: 'O próximo capítulo já está sendo escrito. E promete.', icone: 'futuro' },
    ],
  },

  // ------------------------------------------------------------------ 07 · recados
  recados: {
    eyebrow: '07 · Quem assina',
    titulo: ['O', 'TIME'],
    texto: 'A equipe de Inteligência Comercial que preparou este presente. E tem um recado lá no fim, de alguém muito especial.',
    carimbo: '9 assinaturas · 1 recado do futuro',
    // Um objeto por pessoa: { nome, cargo, texto }. Com texto vazio, a linha mostra só o nome.
    lista: [
      { nome: 'Lucas Amorim', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Joelton', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Adriana', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Camile', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Mariane', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Jamile', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Adriana', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Ana Cláudia', cargo: 'Inteligência Comercial', texto: '' },
      { nome: 'Crislane', cargo: 'Inteligência Comercial', texto: '' },
    ],
    futuro: {
      nome: 'Charlene',
      cargo: '16.10.2036 · recado do futuro',
      texto: 'Oi, Charlene de 2026. Aqui é você, dez anos depois. Só passando para dizer: aquelas apostas que deram frio na barriga? Valeram a pena. Continua confiando no seu faro, cuidando da sua gente e comemorando cada meta como se fosse a primeira. E pede outro pedaço de bolo, que hoje pode.',
    },
  },

  // ------------------------------------------------------------------ 08 · finale
  finale: {
    eyebrow: '08 · Farol da Barra',
    numero: '16.10',
    frase: 'Que seu novo ciclo brilhe como o pôr do sol da Barra.',
    parabens: 'Feliz aniversário, Charlene.',
    cta: 'Mandar um abraço de volta',
    rodape: 'Feito com carinho pela Inteligência Comercial · Salvador · 2026',
  },
}

// Numeral gigante e velas: idade se informada, senão o dia.
export const numeral = content.idade ? String(content.idade) : '16'
