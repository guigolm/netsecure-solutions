(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  $('#year').textContent = new Date().getFullYear();

  // Menu mobile
  const menuToggle = $('#menuToggle');
  const nav = $('.desktop-nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Busca e filtro de temas
  const search = $('#topicSearch');
  const cards = $$('.topic-card');
  const chips = $$('.filter-chip');
  const empty = $('#emptyState');
  let activeFilter = 'Todos';
  function filterTopics() {
    const term = (search?.value || '').trim().toLocaleLowerCase('pt-BR');
    let shown = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'Todos' || card.dataset.category === activeFilter;
      const textMatch = `${card.dataset.search} ${card.innerText}`.toLocaleLowerCase('pt-BR').includes(term);
      const visible = categoryMatch && textMatch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    empty.hidden = shown > 0;
  }
  chips.forEach(chip => chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter;
    chips.forEach(item => item.classList.toggle('active', item === chip));
    filterTopics();
  }));
  search?.addEventListener('input', filterTopics);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search?.focus();
      $('#temas')?.scrollIntoView({behavior:'smooth'});
    }
    if (event.key === 'Escape') {
      $$('#topicDialog, #notesDialog').forEach(dialog => dialog.open && dialog.close());
    }
  });

  // Diálogo de detalhes
  const topicCopy = {
    'Inteligência artificial': 'Acompanhe aplicações, impactos, novidades e discussões sobre inteligência artificial. Adicione fontes confiáveis, notícias, vídeos e votações para transformar este tema em uma área viva de curadoria.',
    'Força da comunidade': 'Um espaço para acompanhar iniciativas, colaboração e assuntos que mobilizam a comunidade. Use-o para reunir referências, conversas e propostas relevantes.',
    'Cultura em movimento': 'Reúna referências de cultura, entretenimento, música e cinema. Este tema pode ser conectado a vídeos, canais e votações da comunidade.',
    'Cidades do futuro': 'Acompanhe ideias e soluções para mobilidade, sustentabilidade, conectividade e qualidade de vida nas cidades.',
    'Segurança digital': 'Explore privacidade, cibersegurança, proteção de dados e confiança digital — temas alinhados à expertise da NetSecure.',
    'Vozes e criadores': 'Organize criadores, canais e vozes que ajudam a explicar assuntos importantes e movimentam conversas.',
    'Aprender sempre': 'Descubra recursos sobre educação, novas habilidades e acesso ao conhecimento.',
    'Bem-estar conectado': 'Acompanhe hábitos, equilíbrio e iniciativas em que a tecnologia pode apoiar a qualidade de vida.'
  };
  const topicDialog = $('#topicDialog');
  $$('.details-button').forEach(button => button.addEventListener('click', () => {
    const title = button.dataset.topic;
    $('#dialogTitle').textContent = title;
    $('#dialogText').textContent = topicCopy[title] || 'Explore este tema e adicione suas referências.';
    topicDialog.showModal();
  }));

  // Notas locais: sem backend, ficam no navegador atual
  const notesDialog = $('#notesDialog');
  const notesText = $('#notesText');
  try { notesText.value = localStorage.getItem('netsecureRadarNotes') || ''; } catch (_) {}
  $('#openNotes')?.addEventListener('click', () => notesDialog.showModal());
  notesText?.addEventListener('input', () => {
    try {
      localStorage.setItem('netsecureRadarNotes', notesText.value);
      $('#notesStatus').textContent = 'Salvo neste navegador';
    } catch (_) {
      $('#notesStatus').textContent = 'Não foi possível salvar localmente';
    }
  });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()));
  [topicDialog, notesDialog].forEach(dialog => dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));
})();