function preencherHub() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── CLIENTES ──────────────────────────────────────────
  let aba = ss.getSheetByName('clientes') || ss.insertSheet('clientes');
  aba.clearContents();
  aba.getRange(1, 1, 1, 7).setValues([['nome','servico','total','entregues','prioridade','status','drive_link']]);
  aba.getRange(2, 1, 10, 7).setValues([
    ['Amendoeira',        'TikTok + YouTube',      20,  0, 'Alta',  'Ativo', ''],
    ['G3',               'Institucional + Reels',   3,  0, 'Média', 'Ativo', ''],
    ['Ótica Kaiser',     'Conteúdo Mensal',        '',  '', 'Alta', 'Ativo', ''],
    ['Conecta Soluções', 'Edições Comerciais',     12,  0, 'Média', 'Ativo', ''],
    ['Vinícius (Workana)','Pacote Shorts',          50,  0, 'Alta',  'Ativo', ''],
    ['Doutor Fabiano',   'Conteúdo Saúde',         20,  0, 'Alta',  'Ativo', ''],
    ['Eduarda',          'Conteúdo Estético',      20,  0, 'Média', 'Ativo', ''],
    ['Adriano',          'Vídeos Comerciais',       4,  0, 'Baixa', 'Ativo', ''],
    ['Candy',            'Conteúdo Marca',           6,  0, 'Média', 'Ativo', ''],
    ['Luanne Nutri',     'Conteúdo Nutrição',       4,  0, 'Média', 'Ativo', ''],
  ]);
  formatarCabecalho(aba, 7);

  // ── VIDEOS ────────────────────────────────────────────
  aba = ss.getSheetByName('videos') || ss.insertSheet('videos');
  aba.clearContents();
  aba.getRange(1, 1, 1, 6).setValues([['nome','cliente','responsavel','link_editado','status','prazo']]);
  aba.getRange(2, 1, 10, 6).setValues([
    ['Conteúdo mensal junho',   'Ótica Kaiser',        '', '', 'Em revisão', ''],
    ['Reel semana 1',           'Doutor Fabiano',      '', '', 'Pendente',   ''],
    ['TikTok lote 01',          'Amendoeira',          '', '', 'Pendente',   ''],
    ['Short pack #1',           'Vinícius (Workana)',   '', '', 'Em edição',  ''],
    ['Vídeo institucional 01',  'G3',                  '', '', 'Pendente',   ''],
    ['Edição comercial 01',     'Conecta Soluções',    '', '', 'Pendente',   ''],
    ['Vídeo estético 01',       'Eduarda',             '', '', 'Pendente',   ''],
    ['Vídeo marca 01',          'Candy',               '', '', 'Pendente',   ''],
    ['Conteúdo nutrição 01',    'Luanne Nutri',        '', '', 'Pendente',   ''],
    ['Vídeo comercial 01',      'Adriano',             '', '', 'Pendente',   ''],
  ]);
  formatarCabecalho(aba, 6);

  // ── FINANCEIRO ────────────────────────────────────────
  aba = ss.getSheetByName('financeiro') || ss.insertSheet('financeiro');
  aba.clearContents();
  aba.getRange(1, 1, 1, 6).setValues([['tipo','descricao','cliente','valor','status','categoria']]);
  aba.getRange(2, 1, 16, 6).setValues([
    // Receitas
    ['receita', 'Pacote Shorts',         'Vinícius (Workana)', 2500, 'Recebido',  ''],
    ['receita', 'Conteúdo Saúde',        'Doutor Fabiano',     1800, 'Recebido',  ''],
    ['receita', 'TikTok + YouTube',      'Amendoeira',         1500, 'A receber', ''],
    ['receita', 'Conteúdo Mensal',       'Ótica Kaiser',       2200, 'Recebido',  ''],
    ['receita', 'Edições Comerciais',    'Conecta Soluções',   1200, 'A receber', ''],
    ['receita', 'Institucional + Reels', 'G3',                  900, 'Recebido',  ''],
    ['receita', 'Conteúdo Estético',     'Eduarda',            1100, 'A receber', ''],
    ['receita', 'Vídeos Comerciais',     'Adriano',             600, 'Recebido',  ''],
    ['receita', 'Conteúdo Marca',        'Candy',               800, 'A receber', ''],
    ['receita', 'Conteúdo Nutrição',     'Luanne Nutri',        700, 'Recebido',  ''],
    // Custos
    ['custo', 'Ferramentas de edição',   '', 350, 'Pago',    'Software'],
    ['custo', 'Armazenamento em nuvem',  '', 120, 'Pago',    'Infra'],
    ['custo', 'Freelancer roteiro',      '', 600, 'Pago',    'Equipe'],
    ['custo', 'Música licenciada',       '',  80, 'Pago',    'Assets'],
    ['custo', 'Internet',                '', 150, 'Pago',    'Infra'],
    ['custo', 'Marketing',               '', 400, 'A pagar', 'Marketing'],
  ]);
  formatarCabecalho(aba, 6);

  // ── AGENDA ────────────────────────────────────────────
  aba = ss.getSheetByName('agenda') || ss.insertSheet('agenda');
  aba.clearContents();
  aba.getRange(1, 1, 1, 5).setValues([['titulo','data','hora','categoria','cliente']]);
  aba.getRange(2, 1, 3, 5).setValues([
    ['Reunião mensal com equipe',    '2025-06-20', '10:00', 'reuniao',    ''],
    ['Entrega TikTok Amendoeira',    '2025-06-25', '18:00', 'entrega',    'Amendoeira'],
    ['Entrega Ótica Kaiser',         '2025-06-30', '17:00', 'entrega',    'Ótica Kaiser'],
  ]);
  formatarCabecalho(aba, 5);

  SpreadsheetApp.getUi().alert('✅ Planilha preenchida com sucesso!\n\nAbra o hub e clique em "Sincronizar" para carregar os dados.');
}

function formatarCabecalho(aba, numCols) {
  const cab = aba.getRange(1, 1, 1, numCols);
  cab.setBackground('#1a1f36');
  cab.setFontColor('#60a5fa');
  cab.setFontWeight('bold');
  cab.setFontSize(10);
  aba.setFrozenRows(1);
  aba.autoResizeColumns(1, numCols);
}
