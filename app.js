/* Raio-X do Ecossistema de Carreira — regra de negócio e conteúdo versionados juntos. */
(() => {
  'use strict';
  const KEY = 'sem-rodeios-raio-x-v1';
  const VERSION = '1.0.0';
  const FREQ = [
    { value: 0, label: 'Nunca' }, { value: 1, label: 'Uma vez' },
    { value: 2, label: 'Algumas vezes' }, { value: 3, label: 'Com frequência' },
    { value: 4, label: 'De forma consistente' }
  ];
  const DIMS = {
    capacity: { label: 'Capacidade', short: 'CAPACIDADE', map: 'VALOR ENTREGUE' },
    visibility: { label: 'Visibilidade', short: 'VISIBILIDADE', map: 'VISIBILIDADE' },
    interpretation: { label: 'Interpretação', short: 'INTERPRETAÇÃO', map: 'INTERPRETAÇÃO' },
    relations: { label: 'Relações', short: 'RELAÇÕES', map: null },
    recognition: { label: 'Reconhecimento', short: 'RECONHECIMENTO', map: 'RECONHECIMENTO' },
    opportunity: { label: 'Oportunidade', short: 'OPORTUNIDADE', map: 'OPORTUNIDADE' }
  };
  const FLOW = [
    {key:'capacity',label:'VALOR ENTREGUE',description:'O trabalho e os resultados que você produz.'},
    {key:'visibility',label:'VISIBILIDADE',description:'Quem consegue acessar seu trabalho.'},
    {key:'interpretation',label:'INTERPRETAÇÃO',description:'Como sua contribuição é compreendida.'},
    {key:'recognition',label:'RECONHECIMENTO',description:'Retorno explícito e mudança concreta associada.'},
    {key:'opportunity',label:'OPORTUNIDADE',description:'Acesso a possibilidades ligadas ao movimento desejado.'}
  ];
  const Q = [
    { id:'q1', dim:'capacity', type:'frequency', text:'Com que frequência você concluiu entregas relacionadas ao seu trabalho ou ao objetivo profissional escolhido?' },
    { id:'q2', dim:'capacity', type:'frequency', text:'Com que frequência conseguiu identificar ou demonstrar o resultado concreto de uma entrega sua — por exemplo, um problema resolvido, um processo melhorado ou uma meta alcançada?' },
    { id:'q3', dim:'capacity', type:'evidence', text:'Qual evidência melhor representa suas entregas no período?', options:[
      'Entrega concluída, com resultado observável.',
      'Entrega concluída, mas sem resultado registrado ou fácil de demonstrar.',
      'Trabalho em andamento ou compartilhado, sem resultado atribuível com clareza.',
      'Não consigo apontar uma entrega relevante no período.', 'Não sei avaliar.' ] },
    { id:'q4', dim:'visibility', type:'frequency', text:'Com que frequência as pessoas relevantes para seu trabalho tiveram acesso direto a uma entrega sua ou ao resultado produzido?' },
    { id:'q5', dim:'visibility', type:'frequency', text:'Com que frequência você compartilhou o andamento ou os resultados do seu trabalho com essas pessoas?' },
    { id:'q6', dim:'visibility', type:'evidence', text:'Como essas pessoas costumam tomar conhecimento do seu trabalho?', options:[
      'Acompanham a entrega ou veem o resultado diretamente.',
      'Recebem atualizações minhas sobre o trabalho.',
      'Ficam sabendo por outras pessoas ou por canais indiretos.',
      'Raramente ou nunca têm acesso ao trabalho ou aos resultados.', 'Não sei avaliar quem teve acesso.' ] },
    { id:'q7', dim:'interpretation', type:'frequency', text:'Com que frequência as pessoas relevantes para seu trabalho conseguem explicar qual foi sua contribuição em uma entrega ou resultado?' },
    { id:'q8', dim:'interpretation', type:'frequency', text:'Com que frequência essas pessoas conectam sua contribuição a um efeito concreto — por exemplo, um problema resolvido, uma decisão apoiada ou um resultado alcançado?' },
    { id:'q9', dim:'interpretation', type:'evidence', text:'Qual situação melhor descreve como sua contribuição costuma ser entendida?', options:[
      'Identificam minha contribuição e a conectam a um resultado.',
      'Identificam minha contribuição, mas não costumam conectá-la ao resultado.',
      'Conhecem o resultado, mas não identificam claramente minha contribuição.',
      'A compreensão que demonstram não corresponde ao trabalho que realizei.', 'Não sei avaliar.' ] },
    { id:'q10', dim:'relations', type:'frequency', text:'Com que frequência você interagiu com pessoas da sua área de atuação para trocar informações, conhecimento ou perspectivas sobre o trabalho?' },
    { id:'q11', dim:'relations', type:'frequency', text:'Com que frequência houve colaboração ou troca de apoio entre você e outras pessoas da sua área de atuação em situações concretas de trabalho?' },
    { id:'q12', dim:'relations', type:'evidence', text:'Qual situação melhor descreve suas relações profissionais na área de atuação?', options:[
      'Mantive trocas recorrentes de conhecimento, colaboração ou apoio.',
      'Tive algumas trocas úteis, mas sem continuidade.',
      'Tive contato com pessoas da área, mas pouca troca ou colaboração concreta.',
      'Tive dificuldade de estabelecer interações relevantes na área.', 'Não sei avaliar a frequência ou relevância dessas interações.' ] },
    { id:'q13', dim:'recognition', type:'frequency', text:'Com que frequência você recebeu retorno explícito sobre o valor ou impacto de uma entrega sua?' },
    { id:'q14', dim:'recognition', type:'frequency', text:'Com que frequência esse retorno foi acompanhado por uma mudança concreta associada ao trabalho — por exemplo, em escopo, responsabilidade, remuneração, crédito ou posição?' },
    { id:'q15', dim:'recognition', type:'evidence', text:'Qual situação melhor descreve o que aconteceu?', options:[
      'Recebi retorno explícito e houve uma mudança concreta associada.',
      'Recebi retorno explícito, mas não houve mudança concreta associada.',
      'Houve uma mudança concreta, mas sem retorno explícito que a conectasse ao trabalho.',
      'Não houve retorno explícito nem mudança concreta que eu consiga associar às entregas.',
      'Não sei avaliar se houve essa relação.' ] },
    { id:'q16', dim:'opportunity', type:'frequency', text:'Com que frequência surgiram oportunidades relacionadas ao movimento profissional que você deseja realizar?' },
    { id:'q17', dim:'opportunity', type:'frequency', text:'Quando surgiu uma oportunidade relevante, com que frequência você teve acesso ao processo ou pôde demonstrar sua contribuição?' },
    { id:'q18', dim:'opportunity', type:'evidence', text:'Qual situação melhor descreve as oportunidades no período?', options:[
      'Surgiram oportunidades alinhadas ao movimento desejado e pude participar.',
      'Surgiram oportunidades alinhadas, mas não tive acesso ou não pude participar.',
      'Surgiram oportunidades, mas não estavam alinhadas ao movimento desejado.',
      'Não identifiquei oportunidades relacionadas ao movimento desejado.',
      'Não sei avaliar se essas oportunidades existiram.' ] }
  ];
  const MICRO = [
    'Responda com base no que acontece hoje.',
    'Agora, pense em como seu trabalho circula.',
    'Se não souber avaliar, diga isso. A incerteza também é uma informação.',
    'Considere situações reais dos últimos 12 meses.'
  ];
  const blank = () => ({ version:VERSION, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), screen:'home', qIndex:0, context:{moment:'', objective:'', move:'', challenge:''}, answers:{}, result:null, experiment:null,tracking:null,cardOpen:false });
  function todayLocal(){const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);}
  function blankTracking(){return{startDate:todayLocal(),checkIns:{1:false,2:false,3:false,4:false},notes:{1:'',2:'',3:'',4:''},reflection:''};}
  let state = load() || blank();
  const app = document.getElementById('app');
  function load(){ try { const raw=localStorage.getItem(KEY); return raw?JSON.parse(raw):null; } catch { return null; } }
  function persist(){ state.updatedAt=new Date().toISOString(); try { localStorage.setItem(KEY,JSON.stringify(state)); } catch { /* private browsing may disable storage */ } }
  function esc(value=''){ return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function qBy(id){ return Q.find(x=>x.id===id); }
  function answerLabel(question, answer){
    if(answer===undefined || answer===null) return 'Sem resposta';
    return question.type==='frequency' ? FREQ.find(x=>x.value===answer)?.label || 'Sem resposta' : question.options[answer] || 'Sem resposta';
  }
  function setScreen(screen){ state.screen=screen; persist(); window.scrollTo(0,0); render(); }
  function shell(html, wide=false){ app.innerHTML=`<section class="screen screen-enter ${wide?'wide':''}">${html}</section>`; app.focus({preventScroll:true}); }
  function render(){
    document.title = state.screen==='result' ? 'Seu diagnóstico · Raio-X do Ecossistema de Carreira' : 'Raio-X do Ecossistema de Carreira · Sem Rodeios';
    if(state.screen==='home') return home();
    if(state.screen==='context') return context();
    if(state.screen==='question') return question();
    if(state.screen==='review') return review();
    if(state.screen==='processing') return processing();
    if(state.screen==='result') return resultPage();
    home();
  }
  function home(){
    const unfinished=state.screen!=='home' || Object.keys(state.answers||{}).length>0 || Object.values(state.context||{}).some(Boolean);
    shell(`<div class="hero" id="inicio"><p class="eyebrow">SEM RODEIOS · UMA LEITURA DA TRAJETÓRIA</p><h1>RAIO-X DO <span>ECOSSISTEMA</span> DE CARREIRA</h1><p class="lead">Descubra onde suas respostas apontam sinais de ruptura entre entrega, reconhecimento e oportunidade — e qual movimento testar agora.</p><p class="body-copy">Nem todo problema de carreira está na capacidade de uma pessoa. O que acontece ao redor dela também influencia como seu valor circula, é interpretado e encontra oportunidades.</p><div class="meta-row"><span>Cerca de 8 minutos</span><span>18 perguntas</span><span>Leitura personalizada</span><span>Experimento de 30 dias</span></div><div class="actions"><button class="btn" data-action="begin">COMEÇAR MEU DIAGNÓSTICO</button>${unfinished?'<button class="btn text" data-action="resume">Retomar diagnóstico salvo</button><button class="btn text" data-action="reset">Apagar respostas salvas</button>':''}</div><p class="microcopy" style="margin-top:22px">Suas respostas ficam neste dispositivo. Não é um teste de personalidade ou de competência.</p></div>`);
  }
  function context(){
    const c=state.context;
    shell(`<p class="eyebrow">ETAPA 1 · CONTEXTO</p><h1>Antes de começar</h1><p class="lead">Quero entender em que momento da sua trajetória você está. Não existe resposta certa.</p><p class="body-copy">Estas informações ajudam a interpretar seu diagnóstico; não entram no cálculo.</p><form id="context-form">
      <div class="field"><label for="moment">Em que momento profissional você está?</label><input id="moment" name="moment" autocomplete="off" value="${esc(c.moment)}" required></div>
      <div class="field"><label for="objective">O que você gostaria de mudar ou conquistar?</label><input id="objective" name="objective" autocomplete="off" value="${esc(c.objective)}" required></div>
      <div class="field"><label for="move">Que movimento profissional deseja fazer?</label><input id="move" name="move" autocomplete="off" value="${esc(c.move)}" required></div>
      <div class="field"><label for="challenge">O que mais está te incomodando hoje?</label><textarea id="challenge" name="challenge" required>${esc(c.challenge)}</textarea></div>
      <div class="actions"><button class="btn secondary" type="button" data-action="home">Voltar</button><button class="btn" type="submit">Continuar</button></div></form>`);
    const form=document.getElementById('context-form');
    form.addEventListener('input',e=>{if(e.target.name&&Object.hasOwn(state.context,e.target.name)){state.context[e.target.name]=e.target.value;persist();}});
    form.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);state.context={moment:String(f.get('moment')).trim(),objective:String(f.get('objective')).trim(),move:String(f.get('move')).trim(),challenge:String(f.get('challenge')).trim()};state.qIndex=0;state.screen='question';persist();render();});
  }
  function question(){
    const i=Math.max(0,Math.min(state.qIndex,Q.length-1)), q=Q[i], ans=state.answers[q.id], percent=((i+1)/Q.length)*100;
    const options=q.type==='frequency'?FREQ.map(o=>({value:o.value,label:o.label})):q.options.map((label,value)=>({value,label}));
    const micro=(i>0 && i%4===0)?MICRO[Math.floor(i/4)%MICRO.length]:'';
    shell(`<div class="progress-head"><span>PERGUNTA ${i+1} DE ${Q.length}</span><span>DIAGNÓSTICO</span></div><div class="progress-track" role="progressbar" aria-valuenow="${i+1}" aria-valuemin="1" aria-valuemax="${Q.length}" aria-label="Progresso do diagnóstico"><div class="progress-fill" style="width:${percent}%"></div></div>${micro?`<p class="microcopy">${micro}</p>`:''}<h1 class="question">${esc(q.text)}</h1><fieldset class="choices" style="border:0;padding:0"><legend class="eyebrow" style="margin-bottom:12px">${q.type==='frequency'?'Nos últimos 12 meses':'Escolha a situação que mais se aproxima'}</legend>${options.map(o=>`<label class="choice ${String(ans)===String(o.value)?'selected':''}"><input type="radio" name="answer" value="${esc(o.value)}" ${String(ans)===String(o.value)?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</fieldset><div class="actions"><button class="btn secondary" data-action="prev">Voltar</button><button class="btn" data-action="next" ${ans===undefined?'disabled':''}>${i===Q.length-1?'Revisar respostas':'Continuar'}</button><button class="btn text" data-action="save-exit">Salvar e sair</button></div>`);
    app.querySelectorAll('input[name="answer"]').forEach(input=>input.addEventListener('change',()=>{state.answers[q.id]=q.type==='frequency'?Number(input.value):Number(input.value);persist();render();}));
  }
  function review(){
    const groups=Object.keys(DIMS).map(dim=>({dim,qs:Q.filter(q=>q.dim===dim)}));
    shell(`<p class="eyebrow">ETAPA 3 · REVISÃO</p><h1>Antes de mostrar sua leitura, confira suas respostas.</h1><p class="body-copy">Você pode editar qualquer resposta. Nenhum resultado será calculado até continuar.</p>${groups.map(g=>`<div class="review-group"><div class="review-title">${esc(DIMS[g.dim].label)}</div>${g.qs.map(q=>`<div class="review-row"><div><div class="review-question">${esc(q.text)}</div><div class="review-answer">${esc(answerLabel(q,state.answers[q.id]))}</div></div><button class="edit-link" data-edit="${q.id}">Editar</button></div>`).join('')}</div>`).join('')}<div class="actions"><button class="btn secondary" data-action="prev">Voltar</button><button class="btn" data-action="calculate">Ver meu diagnóstico</button></div>`);
  }
  function processing(){shell(`<div style="min-height:52vh;display:flex;flex-direction:column;justify-content:center"><p class="eyebrow">ORGANIZANDO SUAS RESPOSTAS</p><h1>Reunindo os sinais e as evidências para preparar sua leitura.</h1></div>`);}
  function calc(){
    const scores={};
    for(const [dim] of Object.entries(DIMS)){
      const qs=Q.filter(q=>q.dim===dim), evidence=state.answers[qs[2].id], noEvidence=evidence===qs[2].options.length-1;
      const f1=state.answers[qs[0].id], f2=state.answers[qs[1].id];
      const eligible=!noEvidence && Number.isInteger(f1) && Number.isInteger(f2);
      scores[dim]={dim,signal:eligible?((4-f1)+(4-f2))/2:null,evidenceStatus:eligible?'sufficient':'insufficient',trace:{frequency:[qs[0].id,qs[1].id],qualifier:qs[2].id,rule:'signal_mean_reverse_frequency_v1'}};
    }
    const eligible=Object.values(scores).filter(x=>x.signal!==null).sort((a,b)=>b.signal-a.signal);
    let primary=[],secondary=[];
    if(eligible.length){const top=eligible[0].signal;primary=eligible.filter(x=>top-x.signal<=.5).map(x=>x.dim);const next=eligible.find(x=>top-x.signal>.5);if(next){secondary=eligible.filter(x=>x.signal<=next.signal&&next.signal-x.signal<=.5).map(x=>x.dim);}}
    const result={scores,primary,secondary,insufficient:Object.keys(scores).filter(k=>scores[k].signal===null),external:externalContext(),createdAt:new Date().toISOString()};
    result.evidence=primary.flatMap(dim=>evidenceFor(dim).map(item=>({dimension:dim,...item})));
    result.synthesisTrace=primary.map(dim=>interpretDim(dim).trace);
    result.recommendations=makeRecommendations(result);
    result.traceSummary={calculation:'mean(4-frequency_q1, 4-frequency_q2)',tieRule:'within_0_5_of_highest',evidenceRule:'third_answer_no_dont_know_excludes_dimension',contextRule:'context_not_scored',externalRule:result.external?'explicit_phrase_match_context_challenge_v1':'no_explicit_external_phrase'};
    state.result=result;state.screen='result';persist();render();
  }
  function externalContext(){
    const raw=(state.context.challenge||'').trim();
    const patterns=[/congelamento de vagas/i,/vagas congeladas/i,/congelamento de contratações/i,/contratações congeladas/i,/orçamento congelado/i,/corte de orçamento/i,/corte de vagas/i,/reestruturação em andamento/i,/reorganização da área/i,/ausência de vagas/i,/não há vagas/i,/vagas bloqueadas/i];
    for(const pattern of patterns){const match=pattern.exec(raw);if(!match)continue;const preceding=raw.slice(Math.max(0,match.index-35),match.index);if(/\b(não|nao|sem|nunca)\s+(há|ha|existe|ocorre|está|esta|tem)?\s*$/i.test(preceding))continue;return{text:raw,source:'context.challenge',rule:'explicit_phrase_match_context_challenge_v1'};}
    return null;
  }
  function evidenceFor(dim){
    const qs=Q.filter(q=>q.dim===dim),items=[];
    for(const q of qs){const value=state.answers[q.id],label=answerLabel(q,value);if(value!==undefined)items.push({questionId:q.id,answer:label,rule:`evidence_from_${q.id}`});}
    return items;
  }
  function interpretDim(dim){
    const qs=Q.filter(q=>q.dim===dim);
    const move=state.context.move||state.context.objective||'o próximo passo que você deseja';
    const narrative={
      capacity:`Antes que o valor circule, ele precisa tomar a forma de uma entrega cujo efeito possa ser percebido. Aqui, o trabalho parece pedir mais fechamento: deixar claro o que mudou, qual parte foi sua e o que ainda depende de outras pessoas. Isso não é uma avaliação da sua capacidade; é uma leitura sobre a evidência que a trajetória consegue carregar. Para ${move}, uma entrega concreta e bem delimitada tende a ser mais útil do que simplesmente assumir novas frentes.`,
      visibility:`O gargalo parece estar na passagem entre fazer um trabalho relevante e ele chegar a quem consegue reconhecê-lo ou abrir o próximo caminho. Isso não pede exposição constante: pede circulação intencional de uma entrega certa, para as pessoas que precisam conhecê-la, no momento em que ela ainda pode influenciar decisões. No seu caso, conecte essa circulação ao movimento de ${move}.`,
      interpretation:`O trabalho pode até chegar às pessoas certas, mas a contribuição corre o risco de ficar misturada ao resultado coletivo ou ser entendida de outro jeito. O passo importante não é repetir a entrega com mais volume; é tornar legível a sequência entre o problema, sua contribuição e o efeito observado. Isso ajuda quem acompanha o trabalho a compreender o que você pode assumir em seguida, inclusive em relação a ${move}.`,
      relations:`Na sua área de atuação, o ecossistema parece oferecer poucas trocas de trabalho que se transformem em conhecimento compartilhado, colaboração ou apoio recíproco. Relações aqui não significa acumular contatos influentes: significa construir interações úteis e contínuas em torno de problemas reais da área. Essa dimensão atravessa o fluxo: pode ampliar a circulação do trabalho e o acesso a perspectivas e possibilidades ligadas a ${move}.`,
      recognition:`O ponto de atenção está na conversão entre uma contribuição compreendida e uma consequência concreta na trajetória. Um retorno positivo, por si só, não fecha esse ciclo: neste modelo, reconhecimento exige retorno explícito e alguma mudança associada, como escopo, responsabilidade, crédito, remuneração ou posição. A conversa útil é sobre critérios e consequência concreta, não sobre pedir validação abstrata.`,
      opportunity:`O gargalo parece estar menos em desejar um próximo passo e mais nas condições para alcançá-lo: a oportunidade existir, os critérios estarem claros e você conseguir participar ou demonstrar sua contribuição. Parte disso depende do contexto, como prioridades, orçamento e desenho das vagas; não deve ser lido automaticamente como falta de preparo individual. Para ${move}, o primeiro avanço é descobrir qual dessas condições está realmente em jogo.`
    }[dim];
    const text=`${narrative} ${evidenceSummary(dim)}`;
    return {text,point:pointFor(dim),trace:{dimension:dim,questionIds:qs.map(q=>q.id),contextFields:['move','objective'],rule:`synthesis_${dim}_v2`}};
  }
  function pointFor(dim){
    return ({capacity:{kind:'stage',index:0,label:'NA ENTREGA DE VALOR'},visibility:{kind:'gap',index:0,label:'ENTRE VALOR ENTREGUE E VISIBILIDADE'},interpretation:{kind:'gap',index:1,label:'ENTRE VISIBILIDADE E INTERPRETAÇÃO'},recognition:{kind:'gap',index:2,label:'ENTRE INTERPRETAÇÃO E RECONHECIMENTO'},opportunity:{kind:'gap',index:3,label:'ENTRE RECONHECIMENTO E OPORTUNIDADE'},relations:{kind:'network',index:-1,label:'RELAÇÕES ATRAVESSAM TODO O FLUXO'}})[dim];
  }
  function pointStatement(dim){return dim==='relations'?'O ponto de atenção é transversal: as relações atravessam todo o fluxo.':`A principal ruptura aparece ${pointFor(dim).label.toLowerCase()}.`;}
  function naturalJoin(items){return items.length<2?(items[0]||''):items.length===2?`${items[0]} e ${items[1]}`:`${items.slice(0,-1).join(', ')} e ${items.at(-1)}`;}
  function evidenceSummary(dim){
    const qs=Q.filter(q=>q.dim===dim),idx=state.answers[qs[2].id];
    const summaries={
      capacity:['Há material concreto para demonstrar valor; o foco é tornar nítida a contribuição.','O resultado parece existir, mas ainda pode ser difícil recuperá-lo ou demonstrá-lo.','Como o trabalho é compartilhado ou está em andamento, é importante delimitar contribuições e efeitos.','O próximo passo começa por localizar uma entrega concreta antes de tirar conclusões sobre o restante do fluxo.'],
      visibility:['O acesso ao trabalho não garante que o resultado certo tenha circulado entre as pessoas relevantes.','As atualizações podem estar chegando sem deixar o resultado suficientemente visível.','A circulação parece depender de canais indiretos, o que pode reduzir controle sobre o contexto em que o trabalho é conhecido.','Há um sinal de pouca circulação direta para as pessoas ligadas ao próximo movimento.'],
      interpretation:['Há uma base para conectar contribuição e efeito; vale conferir se isso se mantém em situações diferentes.','A contribuição parece reconhecível, mas sua ligação com o resultado pode perder força.','O resultado pode ser conhecido sem que a participação individual fique clara.','Pode haver uma distância entre a contribuição realizada e a forma como ela é compreendida.'],
      relations:['Há trocas úteis na área que podem ser aprofundadas e mantidas ao longo do tempo.','Algumas interações produzem valor, mas ainda não se transformam em continuidade.','Estar em contato com pessoas da área não tem se convertido regularmente em colaboração concreta.','O sinal aponta para poucas interações profissionais úteis na área de atuação.'],
      recognition:['Há sinais de retorno e consequência concreta; observe como um levou ao outro.','O retorno existe, mas ainda não se traduz claramente em mudança concreta.','Uma mudança aconteceu, mas a relação com o trabalho não está explicitada.','Falta uma conexão observável entre retorno explícito e mudança concreta.'],
      opportunity:['Há participação em oportunidades alinhadas; vale entender o que tornou esse acesso possível.','Oportunidades surgem, mas o acesso ou a chance de demonstrar contribuição é limitado.','Oportunidades disponíveis podem não levar ao movimento desejado.','Ainda não há um caminho de oportunidade claramente identificado para o movimento desejado.']
    };
    return summaries[dim]?.[idx]||'As respostas não oferecem evidência suficiente para interpretar esta dimensão.';
  }
  function recFor(dim){
    const move=state.context.move||state.context.objective||'seu movimento profissional';
    const rules={
      capacity:{stop:'Tratar uma entrega como evidência suficiente sem registrar o resultado observável que ela produziu.',start:'Escolher uma entrega recente ligada a '+move+' e registrar o resultado concreto e sua contribuição.',test:'Em até 30 dias, documente uma entrega ligada a '+move+' com o resultado observado e peça a alguém diretamente envolvido que confirme o que mudou.',who:'Uma pessoa diretamente envolvida na entrega',evidence:'A entrega, o resultado observado e a confirmação ou diferença de interpretação',learn:'Se a evidência disponível deixa claro o resultado e sua contribuição.'},
      visibility:{stop:'Depender apenas de outras pessoas ou de canais indiretos para que as entregas cheguem às pessoas relevantes.',start:'Compartilhar diretamente uma entrega ligada a '+move+' e o resultado observável que ela produziu.',test:'Em até 30 dias, apresente uma entrega recente e seu resultado em um espaço de trabalho acessível às pessoas relevantes para '+move+'.',who:'Pessoas relevantes para '+move+' ou participantes do fórum escolhido',evidence:'Quem teve acesso, quem fez perguntas e se houve pedido de mais informação',learn:'Se esse espaço alcança as pessoas relevantes para o movimento desejado.'},
      interpretation:{stop:'Presumir que conhecer o resultado significa entender sua contribuição para ele.',start:'Ao apresentar um resultado, explicitar seu papel e como ele se conecta ao efeito observado.',test:'Em até 30 dias, apresente um resultado ligado a '+move+', explique sua contribuição e pergunte como seu papel foi entendido.',who:'Uma pessoa que conheça o resultado apresentado',evidence:'A forma como a pessoa descreve sua contribuição e o resultado',learn:'Se sua contribuição está clara ou se ainda há diferença de interpretação.'},
      relations:{stop:'Manter as trocas profissionais apenas como contatos pontuais, quando suas respostas indicam pouca continuidade.',start:'Propor uma troca concreta de conhecimento ou colaboração com alguém da sua área de atuação.',test:'Em até 30 dias, combine uma conversa de trabalho com alguém da sua área sobre um tema concreto e registre que informação, colaboração ou apoio surgiu.',who:'Uma pessoa da sua área de atuação',evidence:'O tema discutido e qualquer informação, colaboração ou apoio que surgiu',learn:'Que tipo de interação na área se mostra útil para sua trajetória.'},
      recognition:{stop:'Tratar retorno positivo sem mudança concreta associada como evidência completa de reconhecimento.',start:'Registrar separadamente o retorno explícito recebido e qualquer mudança concreta ligada ao trabalho.',test:'Em até 30 dias, leve uma entrega documentada a uma conversa e pergunte quais critérios se aplicam a uma mudança concreta de escopo, responsabilidade, crédito, remuneração ou posição.',who:'Uma pessoa responsável por discutir o trabalho ou os critérios aplicáveis',evidence:'Resposta explícita sobre critérios e qualquer mudança concreta observada',learn:'Se existe uma relação explícita entre a contribuição e uma forma concreta de reconhecimento.'},
      opportunity:{stop:'Esperar oportunidades alinhadas sem investigar se existem e como se acessa o processo.',start:'Identificar uma oportunidade concreta ligada a '+move+' e verificar requisitos e processo de acesso.',test:'Em até 30 dias, selecione uma oportunidade ligada a '+move+', confirme seus requisitos e faça uma ação observável para participar ou se posicionar.',who:'Responsável pelo processo ou pessoa que conheça a oportunidade',evidence:'Requisitos, disponibilidade e resposta sobre o acesso ao processo',learn:'Se a oportunidade existe, quais condições se aplicam e qual acesso é possível.'}
    };
    const base={...rules[dim]};
    const qs=Q.filter(q=>q.dim===dim), evidenceIndex=state.answers[qs[2].id];
    const variants={
      capacity:[
        ['Não deixe a entrega sem registrar o resultado concreto e a contribuição que você quer demonstrar.','Escolha uma entrega ligada a '+move+' e reúna o resultado observável e sua contribuição.'],
        ['Não deixe o resultado de uma entrega sem registro ou difícil de recuperar.','Registre o resultado observável de uma entrega recente e o que permite atribuí-lo ao trabalho.'],
        ['Não apresente trabalho em andamento como se o resultado já estivesse concluído ou fosse individual.','Registre o estágio, as pessoas envolvidas e o resultado que ainda pode ser observado em conjunto.'],
        ['Não conclua que houve uma entrega relevante sem conseguir apontar uma situação concreta.','Observe uma atividade ligada a '+move+' e registre se dela resultou uma entrega ou um efeito observável.']
      ],
      visibility:[
        ['Não presuma que acesso direto, por si só, significa que as pessoas relevantes viram o resultado ligado a '+move+'.','Confirme com uma pessoa relevante qual resultado ela associa à entrega que acompanhou.'],
        ['Não deixe as atualizações sem explicitar o resultado de uma entrega ligada a '+move+'.','Inclua o resultado observável de uma entrega em uma atualização às pessoas relevantes.'],
        ['Não dependa somente de canais indiretos para fazer circular uma entrega ligada a '+move+'.','Compartilhe diretamente uma entrega recente e seu resultado com as pessoas relevantes para '+move+'.'],
        ['Não dependa de que pessoas sem acesso atual encontrem a entrega por conta própria.','Identifique um espaço acessível às pessoas relevantes e leve até ele uma entrega e seu resultado.']
      ],
      interpretation:[
        ['Não assuma que a contribuição está sempre compreendida sem conferir um exemplo concreto.','Confirme como uma pessoa relevante descreve seu papel em uma entrega ligada a '+move+'.'],
        ['Não deixe a ligação entre sua contribuição e o resultado implícita.','Ao apresentar uma entrega, explicite o resultado e a relação entre sua contribuição e esse efeito.'],
        ['Não presuma que conhecer o resultado significa identificar sua contribuição.','Em uma conversa sobre um resultado conhecido, descreva seu papel e pergunte como foi entendido.'],
        ['Não tome uma descrição divergente como evidência suficiente de que sua contribuição foi compreendida.','Compare uma descrição concreta do trabalho com a forma como foi entendido e identifique a diferença.']
      ],
      relations:[
        ['Não deixe as trocas recorrentes sem identificar que informação, colaboração ou apoio concreto produzem.','Registre qual troca recorrente na área gerou informação, colaboração ou apoio concreto.'],
        ['Não deixe uma troca útil se encerrar sem verificar se há continuidade possível.','Retome uma troca útil com alguém da área em torno de um tema concreto de trabalho.'],
        ['Não trate contato sem colaboração concreta como evidência de troca de apoio.','Proponha uma troca de conhecimento ligada a uma situação real de trabalho na área.'],
        ['Não conclua que as relações são irrelevantes sem observar uma interação ligada ao trabalho.','Escolha uma situação de trabalho e identifique uma pessoa da área com quem possa trocar conhecimento.']
      ],
      recognition:[
        ['Não deixe retorno e mudança concreta sem registrar como se relacionam.','Registre o retorno explícito e a mudança concreta associada, junto ao que conecta uma à outra.'],
        ['Não trate o retorno explícito, sozinho, como evidência de mudança concreta.','Registre o retorno e pergunte quais critérios se aplicam a uma mudança concreta ligada ao trabalho.'],
        ['Não atribua automaticamente uma mudança ao trabalho sem retorno explícito que confirme a relação.','Pergunte como a mudança concreta se relaciona ao trabalho e que evidência sustenta essa relação.'],
        ['Não conclua que houve reconhecimento sem retorno explícito e mudança concreta associada.','Investigue separadamente se houve retorno explícito e se ocorreu uma mudança concreta relacionada.']
      ],
      opportunity:[
        ['Não deixe de registrar quais condições permitiram participar de uma oportunidade alinhada.','Registre quais condições permitiram acesso e participação para reconhecer o que pode ser repetido.'],
        ['Não espere acesso sem investigar os critérios de uma oportunidade alinhada específica.','Investigue os critérios e o caminho de acesso de uma oportunidade alinhada a '+move+'.'],
        ['Não trate uma oportunidade desalinhada como evidência de acesso ao movimento desejado.','Compare uma oportunidade disponível com '+move+' e identifique o requisito que não se alinhou.'],
        ['Não conclua que não há caminho possível sem verificar oportunidades ou projetos concretos.','Pergunte a alguém que conheça o contexto se existe projeto ou oportunidade alinhada e quais critérios se aplicam.']
      ]
    };
    const variant=variants[dim]?.[evidenceIndex];
    if(variant){base.stop=variant[0];base.start=variant[1];}
    const authored={
      capacity:{stop:'Evite deixar o resultado da entrega para ser percebido por inferência. Se o efeito fica implícito, a trajetória tem pouco material para levar adiante.',start:'Escolha um trabalho recente ligado a '+move+'. Em poucas linhas, registre o problema, a sua contribuição e o que mudou — incluindo o que foi feito em conjunto.',test:'Nas próximas quatro semanas, monte esse registro para uma entrega real e peça a alguém que acompanhou o trabalho para dizer o que ficou claro e o que ainda falta demonstrar.',who:'Uma pessoa que tenha acompanhado a entrega',evidence:'O registro da entrega, o efeito observável e o que a outra pessoa compreendeu',learn:'Se o resultado e a contribuição ficam claros sem explicações adicionais.'},
      visibility:{stop:'Evite contar apenas com a circulação espontânea do trabalho. Uma entrega pode ser boa e ainda assim não chegar ao espaço onde se discutem decisões e próximos passos.',start:'Escolha uma entrega relevante para '+move+' e prepare uma síntese curta do problema, do resultado e do que vem a seguir. Leve-a a um canal ou conversa que as pessoas ligadas a esse movimento realmente acompanham.',test:'Neste mês, compartilhe a síntese em uma conversa ou fórum de trabalho pertinente. Observe quem se envolve, que pergunta surge e se a entrega abre uma conversa concreta sobre o próximo passo.',who:'Uma pessoa ou fórum ligado às decisões sobre '+move,evidence:'Quem teve contato com a síntese e que conversa ou encaminhamento ela provocou',learn:'Se o canal escolhido aproxima seu trabalho das pessoas e decisões relevantes.'},
      interpretation:{stop:'Evite apresentar o resultado esperando que a sua parte fique evidente por si só. Em trabalhos compartilhados, isso pode apagar diferenças importantes de contribuição.',start:'Prepare um exemplo ligado a '+move+' em três partes: o desafio, o que você fez e qual efeito isso teve. Reconheça também o que foi construído com outras pessoas.',test:'Nas próximas quatro semanas, use esse exemplo em uma conversa com alguém que conheça o trabalho. Peça que essa pessoa explique com as próprias palavras qual foi sua contribuição e compare com o que você pretendia comunicar.',who:'Alguém que conheça o trabalho e possa falar sobre como ele foi entendido',evidence:'A diferença entre a contribuição descrita e o que a outra pessoa consegue reconhecer',learn:'Que parte do seu papel precisa ficar mais explícita para ser compreendida com precisão.'},
      relations:{stop:'Não meça a qualidade das relações profissionais pela quantidade de contatos. O que importa aqui é se as interações na sua área produzem troca, colaboração ou continuidade.',start:'Escolha um tema real da sua área de atuação e convide uma pessoa com experiência complementar para uma troca de trabalho — algo que permita comparar perspectivas ou resolver uma questão concreta.',test:'Neste mês, faça essa troca e combine um retorno: compartilhar uma referência, revisar uma ideia ou colaborar em uma pequena tarefa. Observe se a interação gera valor para os dois lados e se há motivo para continuar.',who:'Uma pessoa da sua área de atuação, com experiência relacionada ao tema',evidence:'O que foi trocado, se surgiu colaboração concreta e se houve continuidade',learn:'Que tipo de relação de trabalho vale cultivar na sua área, além de ampliar contatos.'},
      recognition:{stop:'Evite encerrar a conversa no elogio quando o que você procura é uma mudança concreta. Feedback positivo e reconhecimento que altera a trajetória são coisas relacionadas, mas não equivalentes.',start:'Leve uma entrega e seu efeito para uma conversa sobre critérios. Pergunte que evidência sustenta uma mudança de escopo, responsabilidade, crédito, remuneração ou posição — e qual é o próximo passo possível.',test:'Nas próximas quatro semanas, faça uma conversa objetiva sobre uma contribuição e uma consequência concreta possível. Registre o retorno, os critérios mencionados e qualquer encaminhamento combinado.',who:'A pessoa que pode esclarecer os critérios ou encaminhar uma mudança concreta',evidence:'Critérios explícitos, decisão ou encaminhamento e sua relação com a contribuição',learn:'Se existe um caminho concreto entre o valor entregue e uma forma de reconhecimento.'},
      opportunity:{stop:'Separe a existência de uma oportunidade do acesso a ela. Não transforme uma barreira de contexto, por si só, em conclusão sobre sua capacidade.',start:'Escolha uma oportunidade, projeto ou escopo que se aproxime de '+move+'. Descubra quais critérios são usados, quem decide e que forma de participação é possível no contexto atual.',test:'Neste mês, converse com alguém que conheça esse caminho e faça uma ação verificável: pedir participação em um projeto, apresentar uma proposta ou confirmar o requisito que falta. Se não houver oportunidade disponível, registre essa condição como informação do contexto.',who:'Alguém que conheça a oportunidade, o projeto ou o processo de decisão',evidence:'Disponibilidade real, critérios de acesso, resposta recebida e próximo passo viável',learn:'Se o obstáculo está na disponibilidade, no acesso, nos critérios ou em algo que você pode preparar.'}
    };
    Object.assign(base,authored[dim]);
    if(dim==='capacity'&&evidenceIndex===2)base.start='Como o trabalho ainda está em andamento ou é compartilhado, delimite a etapa atual, as pessoas envolvidas e qual efeito já pode ser observado — sem atribuir a si o resultado coletivo.';
    if(dim==='visibility'&&evidenceIndex===2)base.start='Não tente alcançar todo mundo. Escolha uma entrega ligada a '+move+' e identifique uma pessoa ou fórum que precise conhecê-la para que esse trabalho circule além do canal indireto.';
    if(dim==='interpretation'&&evidenceIndex===3)base.start='Escolha uma situação em que a leitura do seu trabalho divergiu do que aconteceu. Compare fatos, contribuição e efeito antes de decidir como corrigir essa interpretação.';
    if(dim==='relations'&&evidenceIndex===1)base.start='Retome uma troca que já foi útil e proponha uma continuidade pequena, ligada a uma questão atual da sua área.';
    if(dim==='recognition'&&evidenceIndex===1)base.test='Nas próximas quatro semanas, use uma conversa de acompanhamento para sair do retorno geral e chegar a critérios, possibilidades e um próximo passo concreto. Registre o que foi combinado, sem presumir que a mudança já aconteceu.';
    if(dim==='opportunity'&&evidenceIndex===2)base.start='Separe as oportunidades que existem daquelas que realmente aproximam você de '+move+'. Escolha uma que se alinhe e confirme quais critérios permitem participar.';
    base.traceQuestionIds=qs.map(q=>q.id);
    base.traceRules={pare:`pare_${dim}_evidence_${evidenceIndex}_v1`,comece:`comece_${dim}_evidence_${evidenceIndex}_v1`,teste:`teste_${dim}_objective_context_v1`};
    return base;
  }
  function experimentFor(rules,move){
    if(rules.length===1){const r=rules[0];return{hypothesis:interpretDim(r.dim).text,test:r.test,who:r.who,when:'Nos próximos 30 dias',evidence:r.evidence,learn:r.learn};}
    const labels=rules.map(r=>DIMS[r.dim].label.toLowerCase()),labelList=naturalJoin(labels);
    const steps={
      capacity:'Registre qual mudança ocorreu e qual parte do trabalho foi sua.',
      visibility:'Leve o exemplo a uma pessoa ou espaço que acompanhe decisões ligadas a esse movimento.',
      interpretation:'Peça que a outra pessoa explique com as próprias palavras qual foi sua contribuição.',
      relations:'Transforme a conversa em uma troca útil com alguém da sua área de atuação.',
      recognition:'Pergunte que critérios podem ligar essa contribuição a uma mudança concreta.',
      opportunity:'Confirme se existe uma possibilidade real, quais são os critérios de acesso e qual ação cabe agora.'
    };
    const relevantSteps=rules.map(r=>steps[r.dim]);
    const hypothesis=`As dimensões de ${labelList} aparecem no mesmo nível de atenção. A hipótese é que o próximo passo de ${move} depende de entender como essas passagens se conectam no seu contexto.`;
    const test=`Escolha uma entrega, projeto ou situação real ligada a ${move} e use-a como fio condutor de uma conversa de trabalho. ${relevantSteps.join(' ')} Nos próximos 30 dias, registre o que avançou e qual condição ainda depende de outras pessoas ou do contexto.`;
    const who=rules.some(r=>r.dim==='relations')?'Uma pessoa que conheça o trabalho e, se possível, atue na sua área; inclua quem possa esclarecer critérios ou decisões.':'Uma pessoa que conheça o trabalho e possa esclarecer critérios ou decisões ligados ao próximo passo.';
    const evidence=rules.map(r=>r.evidence).join(' ');
    const learn=`O que conecta ${labelList} no seu caso e qual dessas condições mais influencia o movimento desejado.`;
    return{hypothesis,test,who,when:'Nos próximos 30 dias',evidence,learn};
  }
  function makeRecommendations(result){
    if(!result.primary.length) return {available:false,reason:'Nenhuma dimensão tem evidência suficiente para sustentar movimentos personalizados.',trace:[]};
    const rules=result.primary.map(dim=>{const rec=recFor(dim),evidenceQuestion=rec.traceQuestionIds[2];return{dim,...rec,trace:{dimension:dim,questionIds:rec.traceQuestionIds,contextFields:['move','objective'],rules:rec.traceRules,evidenceAnswer:answerLabel(qBy(evidenceQuestion),state.answers[evidenceQuestion])}};});
    const join=(key)=>rules.map(r=>String(r[key]||'').trim().replace(/[.\s]+$/,'')).join(rules.length>1?'\n':'')+(rules.length>1?'.':'');
    return {available:true,stop:join('stop'),start:join('start'),test:join('test'),actions:rules.map(r=>({dimension:r.dim,stop:r.stop,start:r.start,test:r.test,evidence:evidenceSummary(r.dim)})),experiment:experimentFor(rules,state.context.move||state.context.objective||'seu próximo movimento'),trace:rules.map(r=>r.trace)};
  }
  function resultPage(){
    if(!state.result) calc();
    const r=state.result, primary=r.primary, main=primary[0], noResult=!main;
    r.recommendations=makeRecommendations(r);
    const primaryLabels=primary.map(d=>DIMS[d].short),readings=noResult?[]:primary.map(dim=>({dim,...interpretDim(dim)}));
    const mainSynthesis=noResult?'Ainda não há evidência suficiente para apontar uma ruptura com segurança. Isso não significa que sua trajetória esteja sem problemas; significa que este diagnóstico não deve inventar uma explicação.':readings.map(item=>item.text).join('\n\n');
    const heading=noResult?'AINDA NÃO É POSSÍVEL LOCALIZAR A RUPTURA':primary.length>1?'PONTOS NO MESMO NÍVEL DE ATENÇÃO':'O TRECHO EM QUE O FLUXO PERDE FORÇA';
    const title=noResult?'':primaryLabels.join(' + ');
    const map=FLOW.map((stage,i)=>{const focus=primary.some(dim=>{const point=pointFor(dim);return point.kind==='stage'&&point.index===i;});const breakHere=primary.some(dim=>{const point=pointFor(dim);return point.kind==='gap'&&point.index===i;});return `<div class="diagram-stage ${focus?'active':''}"><div class="stage-marker"><span>${String(i+1).padStart(2,'0')}</span></div><div class="stage-copy">${focus?'<small class="diagram-focus">PONTO DE ATENÇÃO</small>':''}<strong>${stage.label}</strong><p>${stage.description}</p></div></div>${i<FLOW.length-1?`<div class="stage-connector ${breakHere?'is-break':''}" aria-hidden="true"><span>${breakHere?'!':'→'}</span>${breakHere?'<small>RUPTURA</small>':''}</div>`:''}`;}).join('');
    const relationsPrimary=primary.includes('relations');
    const insuffList=r.insufficient.filter(d=>!primary.includes(d));
    const secondary= r.secondary.length?r.secondary.map(d=>DIMS[d].label).join(' + '):'';
    const leastPressure=Object.values(r.scores).filter(item=>item.signal!==null&&!primary.includes(item.dim)).sort((a,b)=>a.signal-b.signal)[0];
    const notMain=leastPressure&&leastPressure.signal<=1.5?`Neste recorte, ${DIMS[leastPressure.dim].label.toLowerCase()} não aparece como o primeiro obstáculo a resolver. Isso não a torna irrelevante; apenas ajuda a decidir por onde começar.`:'As outras dimensões também influenciam a trajetória. O destaque indica uma prioridade de investigação, não uma explicação única.';
    const influence=`<div class="split"><div class="split-block"><h3>O QUE ESTÁ AO SEU ALCANCE</h3><p>${esc(noResult?'Revisitar uma ou duas situações concretas dos últimos 12 meses e identificar o que aconteceu em cada passagem do fluxo.':influenceText(main))}</p></div><div class="split-block"><h3>O QUE DEPENDE DO CONTEXTO</h3><p>${esc(r.external?'Você trouxe um possível limite organizacional ligado à disponibilidade de oportunidades ou recursos. Isso pode estreitar os caminhos no momento; vale tratá-lo como uma condição real, sem atribuir toda a ruptura à sua atuação.':'Critérios de decisão, prioridades, orçamento e disponibilidade de oportunidades não dependem apenas de você. O experimento ajuda a descobrir quais deles estão atuando agora.')}</p></div></div>`;
    const moves=r.recommendations.available?(r.recommendations.actions||[]).map(item=>`<article class="action-plan"><p class="eyebrow">${esc(DIMS[item.dimension].label)} · MOVIMENTO PROPOSTO</p><div class="action-plan-grid"><section><span>PARE</span><p>${esc(item.stop)}</p></section><section><span>COMECE</span><p>${esc(item.start)}</p></section><section class="action-test"><span>TESTE EM 30 DIAS</span><p>${esc(item.test)}</p></section></div></article>`).join(''):`<div class="empty-note">Ainda não há base suficiente para recomendar um movimento específico. Retome uma situação concreta e identifique como o trabalho circulou, foi compreendido e encontrou condições para avançar.</div>`;
    const legacyWording=/Você marcou|A situação escolhida foi|você respondeu|Em até 30 dias,/.test(JSON.stringify(state.experiment||{}));
    const experimentDraft=state.experiment?._edited&&!legacyWording?state.experiment:null;
    const exp=r.recommendations.experiment||{hypothesis:'',test:'',who:'',when:'Nos próximos 30 dias',evidence:'',learn:''};
    const tracking=state.tracking||blankTracking(),checkCount=Object.values(tracking.checkIns||{}).filter(Boolean).length;
    const trackerRows=[1,2,3,4].map(week=>`<div class="checkin-row"><label><input type="checkbox" name="week${week}" ${tracking.checkIns?.[week]?'checked':''}><span><strong>Semana ${week}</strong><small>${week===4?'Fechamento do experimento':'Acompanhamento do teste'}</small></span></label><input class="checkin-note" name="note${week}" aria-label="Registro da semana ${week}" placeholder="O que aconteceu?" value="${esc(tracking.notes?.[week]||'')}"></div>`).join('');
    const cardActions=key=>(r.recommendations.actions||[]).map(item=>`<p><small>${esc(DIMS[item.dimension].short)}</small>${esc(item[key])}</p>`).join('');
    const summaryCard=state.cardOpen?`<section class="result-section card-output" id="summary-card"><article class="follow-card"><div class="follow-card-top"><span>SEM RODEIOS</span><span>MEU RAIO-X · 30 DIAS</span></div><p class="eyebrow">MEU PONTO DE ATENÇÃO</p><h2>${esc(title||'Evidência insuficiente')}</h2><p class="follow-summary">${esc(mainSynthesis)}</p><div class="follow-flow">${FLOW.map((stage,i)=>`<span class="${primary.some(dim=>{const point=pointFor(dim);return point.kind==='stage'&&point.index===i;})?'active':''}">${i+1} · ${stage.label}</span>${i<FLOW.length-1&&primary.some(dim=>{const point=pointFor(dim);return point.kind==='gap'&&point.index===i;})?'<b class="follow-break">!</b>':''}`).join('')}</div>${relationsPrimary?'<p class="follow-relations">RELAÇÕES · dimensão transversal do ecossistema</p>':''}<div class="follow-actions"><div><small>PARE</small>${cardActions('stop')||'<p>Reúna evidências antes de definir o que interromper.</p>'}</div><div><small>COMECE</small>${cardActions('start')||'<p>Reúna evidências antes de definir o que começar.</p>'}</div><div><small>TESTE EM 30 DIAS</small><p>${esc(experimentDraft?.test||exp.test||'Preencha seu experimento para registrar o que vai testar.')}</p></div></div><div class="follow-card-bottom"><span>HIPÓTESE DE TRABALHO</span><span>${checkCount} DE 4 ACOMPANHAMENTOS</span></div></article><form id="tracker-form" class="tracker"><div class="tracker-heading"><div><p class="eyebrow">ACOMPANHAMENTO</p><h3>O que aconteceu durante o teste?</h3></div><p class="tracker-count" id="tracker-count">${checkCount}/4</p></div><div class="field"><label for="tracking-start">Data de início</label><input id="tracking-start" type="date" name="startDate" value="${esc(tracking.startDate)}"></div><div class="checkin-list">${trackerRows}</div><div class="field"><label for="tracking-reflection">Ao final, o que aprendi?</label><textarea id="tracking-reflection" name="reflection" placeholder="Registre o que observou e o que mudou na sua compreensão.">${esc(tracking.reflection||'')}</textarea></div><div class="actions no-print"><button class="btn" type="submit">Salvar acompanhamento</button><button class="btn secondary" type="button" data-action="download-card">Baixar card como imagem</button><span class="microcopy" id="tracking-status" aria-live="polite"></span></div></form></section>`:'';
    const readingCards=readings.map(item=>`<article class="diagnosis-card"><p class="eyebrow">${item.dim==='relations'?'RELAÇÕES · DIMENSÃO TRANSVERSAL':`${esc(DIMS[item.dim].label)} · ${esc(item.point.label)}`}</p><p>${esc(item.text)}</p></article>`).join('');
    const relationBand=relationsPrimary?'<div class="relations-note"><strong>RELAÇÕES ATRAVESSAM O ECOSSISTEMA</strong><span>Este ponto não é uma etapa extra. As interações na sua área podem ampliar ou restringir como o trabalho circula, ganha sentido e encontra apoio.</span></div>':r.secondary.includes('relations')?'<div class="relations-note secondary-relations"><strong>RELAÇÕES TAMBÉM ENTRAM NA LEITURA</strong><span>Como dimensão transversal, elas podem influenciar o fluxo sem ocupar um único degrau.</span></div>':'';
    shell(`<p class="eyebrow">SEM RODEIOS · LEITURA DA TRAJETÓRIA</p><div class="result-head"><p class="eyebrow">${heading}</p>${title?`<h1 class="result-title">${esc(title)}</h1>`:''}<p class="result-synthesis">${noResult?esc(mainSynthesis):primary.length>1?'As dimensões empatadas estão no mesmo nível de atenção. O mapa destaca cada ponto; não escolhe uma vencedora.':esc(pointStatement(main))}</p></div>
      <section class="result-section result-map-section"><div class="map-heading"><div><p class="eyebrow">O MAPA DO SEU FLUXO</p><h2>Onde o valor perde força</h2></div><p>O marcador laranja mostra o trecho que pede atenção. O restante do fluxo continua fazendo parte da história.</p></div><div class="flow-diagram" role="img" aria-label="Diagrama do fluxo profissional. O ponto de atenção aparece destacado entre as etapas correspondentes.">${map}</div><p class="map-legend"><i></i> Principal ponto de atenção</p>${relationBand}</section>
      <section class="result-section"><p class="eyebrow">A LEITURA</p><h2>O que esse ponto significa</h2>${readingCards||'<p class="empty-note">Reúna exemplos de situações reais antes de escolher um movimento. Com as evidências atuais, ainda não é responsável apontar onde o fluxo perde força.</p>'}</section>
      ${secondary?`<p class="secondary-signal"><strong>Outros sinais acompanham o resultado:</strong> ${esc(secondary)}. Eles merecem contexto, mas não deslocam o primeiro ponto a investigar.</p>`:''}
      <section class="result-section not-primary"><p class="eyebrow">PERSPECTIVA</p><h2>O que não parece ser o primeiro obstáculo</h2><p>${esc(notMain)}</p></section>
      ${insuffList.length?`<p class="microcopy">Algumas dimensões ficaram sem evidência suficiente para esta leitura: ${insuffList.map(d=>esc(DIMS[d].label)).join(', ')}.</p>`:''}
      <section class="result-section"><h2>O que você pode influenciar</h2>${influence}</section>
      <section class="result-section"><h2>Seu próximo movimento</h2>${moves}</section>
      <section class="result-section"><p class="eyebrow">DA LEITURA À AÇÃO</p><h2>Um experimento para os próximos 30 dias</h2><p class="body-copy">Use a proposta como ponto de partida. Ajuste-a para caber na sua realidade e registre o que o teste ensinar — inclusive se a hipótese não se confirmar.</p><form id="experiment-form" class="experiment-form"><div class="field full"><label for="hypothesis">O que quero descobrir</label><textarea id="hypothesis" name="hypothesis">${esc(experimentDraft?.hypothesis??exp.hypothesis)}</textarea></div><div class="field full"><label for="test">O movimento que vou testar</label><textarea id="test" name="test">${esc(experimentDraft?.test??exp.test)}</textarea></div><div class="field"><label for="who">Com quem</label><input id="who" name="who" value="${esc(experimentDraft?.who??exp.who)}"></div><div class="field"><label for="when">Quando</label><input id="when" name="when" value="${esc(experimentDraft?.when??exp.when)}"></div><div class="field full"><label for="evidence">O que vou observar</label><textarea id="evidence" name="evidence">${esc(experimentDraft?.evidence??exp.evidence)}</textarea></div><div class="field full"><label for="learn">O que quero aprender com isso</label><textarea id="learn" name="learn">${esc(experimentDraft?.learn??exp.learn)}</textarea></div><div class="actions no-print"><button class="btn" type="submit">Salvar meu experimento</button><span id="save-status" class="microcopy" aria-live="polite"></span></div></form></section>
      <section class="closing"><p class="closing-quote">Seu diagnóstico não é um rótulo.<br>É uma hipótese de trabalho.</p><p class="lead">Agora teste essa hipótese no mundo real.</p><div class="actions no-print"><button class="btn" data-action="save-result">Salvar diagnóstico</button><button class="btn secondary" data-action="print">Imprimir / salvar PDF</button><button class="btn text" data-action="reset">Refazer diagnóstico</button></div><p class="microcopy no-print">O diagnóstico fica salvo neste dispositivo, no navegador. Não é enviado a um servidor.</p><div class="actions no-print"><button class="btn" data-action="create-card">Criar meu card de acompanhamento</button></div>${state.cardOpen?'<a class="card-anchor" href="#summary-card">Ir para meu card e acompanhamento ↓</a>':''}</section>${summaryCard}` ,true);
    document.getElementById('experiment-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);state.experiment={...Object.fromEntries(['hypothesis','test','who','when','evidence','learn'].map(k=>[k,String(f.get(k)||'').trim()])),_edited:true};persist();const status=document.getElementById('save-status');status.textContent='Experimento salvo neste dispositivo.';});
    if(state.cardOpen){
      const trackerForm=document.getElementById('tracker-form');
      const saveTracking=()=>{const f=new FormData(trackerForm),checkIns={},notes={};for(let week=1;week<=4;week++){checkIns[week]=f.get(`week${week}`)==='on';notes[week]=String(f.get(`note${week}`)||'').trim();}state.tracking={startDate:String(f.get('startDate')||todayLocal()),checkIns,notes,reflection:String(f.get('reflection')||'').trim()};persist();const count=Object.values(checkIns).filter(Boolean).length;document.getElementById('tracker-count').textContent=`${count}/4`;document.querySelector('.follow-card-bottom span:last-child').textContent=`${count} DE 4 ACOMPANHAMENTOS`;};
      trackerForm.addEventListener('input',saveTracking);trackerForm.addEventListener('change',saveTracking);
      trackerForm.addEventListener('submit',e=>{e.preventDefault();saveTracking();document.getElementById('tracking-status').textContent='Acompanhamento salvo neste dispositivo.';});
    }
  }
  function influenceText(dim){
    const move=state.context.move||state.context.objective||'o movimento desejado';
    const map={capacity:'Você pode escolher uma entrega, reconstruir o que mudou e distinguir sua contribuição do trabalho coletivo. Esse material também vai mostrar o que ainda precisa de validação.',visibility:'Você pode escolher para quem uma entrega ligada a '+move+' precisa circular, preparar o contexto e encontrar um espaço onde ela possa influenciar uma conversa real.',interpretation:'Você pode tornar explícitos o problema, a sua parte e o efeito observado, sem apagar a contribuição de outras pessoas. Depois, pode conferir se essa história foi compreendida como pretendia.',relations:'Você pode iniciar trocas de trabalho relevantes para sua área, oferecer uma contribuição e criar continuidade quando a interação for útil para as duas partes.',recognition:'Você pode pedir clareza sobre critérios e próximos passos, levando evidências do trabalho e perguntando que mudança concreta pode decorrer dele.',opportunity:'Você pode esclarecer requisitos, acesso e disponibilidade. A resposta também ajuda a separar o que precisa ser preparado por você do que depende das condições atuais do contexto.'};
    return map[dim]||'Você pode reunir um exemplo concreto e observar como ele atravessa as diferentes passagens da trajetória.';
  }
  function downloadCardImage(){
    const r=state.result;if(!r)return;
    const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=2400;
    const ctx=canvas.getContext('2d');if(!ctx){toast('Não foi possível criar a imagem neste navegador.');return;}
    const colors={paper:'#f4f1eb',ink:'#20211f',muted:'#686a64',line:'#d6d1c7',accent:'#bf4d31',soft:'#f0ddd5',white:'#fffefa'};
    ctx.fillStyle=colors.paper;ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=colors.white;ctx.fillRect(54,54,1092,2292);ctx.fillStyle=colors.accent;ctx.fillRect(54,54,8,2292);
    let y=110;const left=100,width=990;
    function paragraph(text,font,color,lineHeight,maxLines=8){
      ctx.font=font;ctx.fillStyle=color;const words=String(text||'').split(/\s+/);let line='',lines=[];
      for(const word of words){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){lines.push(line);line=word;}else line=next;}
      if(line)lines.push(line);if(lines.length>maxLines){lines=lines.slice(0,maxLines);let last=lines[maxLines-1];while(ctx.measureText(last+'…').width>width&&last.length)last=last.slice(0,-1);lines[maxLines-1]=last+'…';}
      for(const item of lines){ctx.fillText(item,left,y);y+=lineHeight;}return lines.length;
    }
    ctx.font='700 20px Arial';ctx.fillStyle=colors.ink;ctx.fillText('SEM RODEIOS',left,y);ctx.font='16px Arial';ctx.fillStyle=colors.muted;ctx.textAlign='right';ctx.fillText('MEU RAIO-X · 30 DIAS',1090,y);ctx.textAlign='left';y+=68;
    ctx.font='700 16px Arial';ctx.fillStyle=colors.accent;ctx.fillText('MEU PONTO DE ATENÇÃO',left,y);y+=54;
    const title=r.primary.length?r.primary.map(d=>DIMS[d].short).join(' + '):'EVIDÊNCIA INSUFICIENTE';
    paragraph(title,'bold 48px Georgia',colors.ink,58,2);y+=12;
    const summary=r.primary.length?r.primary.map(d=>interpretDim(d).text).join(' '):'Suas respostas não permitem concluir isso com segurança.';
    paragraph(summary,'26px Georgia',colors.ink,37,5);y+=25;
    y+=25;ctx.font='700 14px Arial';ctx.fillStyle=colors.muted;ctx.fillText('O FLUXO DA TRAJETÓRIA',left,y);y+=24;
    const boxWidth=194,gap=7,flowY=y,flowH=94;
    FLOW.forEach((stage,i)=>{const x=left+i*(boxWidth+gap),active=r.primary.includes(stage.key);ctx.fillStyle=active?colors.soft:colors.paper;ctx.fillRect(x,flowY,boxWidth,flowH);ctx.strokeStyle=active?colors.accent:colors.line;ctx.lineWidth=active?3:1;ctx.strokeRect(x,flowY,boxWidth,flowH);ctx.font='700 12px Arial';ctx.fillStyle=colors.muted;ctx.fillText(`0${i+1}`,x+12,flowY+21);ctx.font='bold 14px Arial';ctx.fillStyle=active?colors.ink:colors.muted;ctx.fillText(stage.label,x+12,flowY+48);if(i<FLOW.length-1){ctx.font='16px Arial';ctx.fillStyle=colors.accent;ctx.fillText('→',x+boxWidth+1,flowY+51);}});
    y+=flowH+30;if(r.primary.includes('relations')){ctx.font='700 14px Arial';ctx.fillStyle=colors.accent;ctx.fillText('RELAÇÕES · DIMENSÃO TRANSVERSAL',left,y);y+=26;}
    const rec=r.recommendations;
    for(const [label,key] of [['PARE','stop'],['COMECE','start'],['TESTE EM 30 DIAS','test']]){ctx.fillStyle=colors.paper;ctx.fillRect(left,y,width,30);ctx.font='700 14px Arial';ctx.fillStyle=colors.accent;ctx.fillText(label,left+12,y+21);y+=49;paragraph(rec?.[key]||'Reúna evidências antes de definir este movimento.','20px Arial',colors.ink,29,5);y+=18;}
    ctx.strokeStyle=colors.line;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(left+width,y);ctx.stroke();y+=34;
    const tracking=state.tracking||blankTracking(),checks=Object.values(tracking.checkIns||{}).filter(Boolean).length;
    ctx.font='700 15px Arial';ctx.fillStyle=colors.ink;ctx.fillText(`ACOMPANHAMENTO · ${checks} DE 4 REGISTROS`,left,y);y+=27;
    const start=tracking.startDate?new Date(`${tracking.startDate}T00:00:00`).toLocaleDateString('pt-BR'):'Não iniciado';
    paragraph(`Início: ${start}. ${tracking.reflection?`Aprendizado até agora: ${tracking.reflection}`:'Use os próximos 30 dias para observar o teste.'}`,'17px Arial',colors.muted,24,3);y+=23;
    ctx.font='italic 20px Georgia';ctx.fillStyle=colors.ink;ctx.fillText('Uma hipótese de trabalho. Não um rótulo.',left,y);
    const finalCanvas=document.createElement('canvas');finalCanvas.width=canvas.width;finalCanvas.height=y+75;finalCanvas.getContext('2d').drawImage(canvas,0,0);
    finalCanvas.toBlob(blob=>{if(!blob){toast('Não foi possível criar a imagem neste navegador.');return;}const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='meu-raio-x-de-carreira.png';document.body.append(link);link.click();link.remove();URL.revokeObjectURL(url);},'image/png');
  }
  function handle(action){
    if(action==='begin'){state=blank();state.screen='context';persist();render();}
    else if(action==='resume'){state.screen=Object.keys(state.answers).length===18?'review':state.context.moment?'question':'context';persist();render();}
    else if(action==='home'){setScreen('home');}
    else if(action==='save-exit'){persist();setScreen('home');}
    else if(action==='prev'){if(state.screen==='question'){if(state.qIndex===0){state.screen='context';persist();render();}else{state.qIndex--;persist();render();}}else if(state.screen==='review'){state.screen='question';state.qIndex=17;persist();render();}else if(state.screen==='context')setScreen('home');}
    else if(action==='next'){const q=Q[state.qIndex];if(state.answers[q.id]===undefined){toast('Escolha uma resposta para continuar.');return;}if(state.qIndex<Q.length-1){state.qIndex++;persist();render();}else setScreen('review');}
    else if(action==='calculate'){state.screen='processing';persist();render();setTimeout(calc,420);}
    else if(action==='create-card'){const form=document.getElementById('experiment-form');if(form){const f=new FormData(form);state.experiment={...Object.fromEntries(['hypothesis','test','who','when','evidence','learn'].map(k=>[k,String(f.get(k)||'').trim()])),_edited:true};}state.tracking=state.tracking||blankTracking();state.cardOpen=true;persist();render();setTimeout(()=>document.getElementById('summary-card')?.scrollIntoView({behavior:'smooth',block:'start'}),30);}
    else if(action==='download-card')downloadCardImage();
    else if(action==='print')window.print();
    else if(action==='save-result'){persist();toast('Diagnóstico salvo neste dispositivo.');}
    else if(action==='reset'){if(confirm('Apagar respostas, contexto e experimento deste dispositivo?')){localStorage.removeItem(KEY);state=blank();render();}}
  }
  function toast(message){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2500);}
  app.addEventListener('click',e=>{const a=e.target.closest('[data-action]');if(a){e.preventDefault();handle(a.dataset.action);return;}const edit=e.target.closest('[data-edit]');if(edit){state.qIndex=Q.findIndex(q=>q.id===edit.dataset.edit);state.screen='question';persist();render();}});
  app.addEventListener('click',e=>{if(e.target.matches('[data-action="next"]')){const q=Q[state.qIndex];if(state.answers[q.id]===undefined){e.preventDefault();toast('Escolha uma resposta para continuar.');}}});
  render();
  // Recover an in-flight calculation if the browser is refreshed during processing.
  if(state.screen==='processing') setTimeout(calc,420);

  // Exposed read-only hooks support the four requested deterministic acceptance simulations.
  window.RaioX = Object.freeze({ version:VERSION, questions:Q, dimensions:DIMS,
    calculateForTest:(context,answers)=>{const previous=state;try{state={...blank(),context:{...blank().context,...context},answers};const scores={};for(const dim of Object.keys(DIMS)){const qs=Q.filter(q=>q.dim===dim),evidence=answers[qs[2].id],unknown=evidence===qs[2].options.length-1,f1=answers[qs[0].id],f2=answers[qs[1].id],eligible=!unknown&&Number.isInteger(f1)&&Number.isInteger(f2);scores[dim]={dim,signal:eligible?((4-f1)+(4-f2))/2:null,evidenceStatus:eligible?'sufficient':'insufficient'};}const sorted=Object.values(scores).filter(x=>x.signal!==null).sort((a,b)=>b.signal-a.signal);const primary=sorted.length?sorted.filter(x=>sorted[0].signal-x.signal<=.5).map(x=>x.dim):[];const next=sorted.find(x=>!primary.includes(x.dim));const secondary=next?sorted.filter(x=>x.signal<=next.signal&&next.signal-x.signal<=.5).map(x=>x.dim):[];const result={scores,primary,secondary,insufficient:Object.keys(scores).filter(k=>scores[k].signal===null),external:externalContext()};result.recommendations=makeRecommendations(result);result.syntheses=primary.map(dim=>interpretDim(dim));return result;}finally{state=previous;}},
    renderResultForTest:(context,answers,includeCard=false)=>{const previous=state,previousHtml=app.innerHTML,previousStorage=localStorage.getItem(KEY);try{state={...blank(),context:{...blank().context,...context},answers,cardOpen:includeCard,tracking:includeCard?blankTracking():null};calc();return app.innerHTML;}finally{state=previous;app.innerHTML=previousHtml;if(previousStorage===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,previousStorage);}}
  });
})();

