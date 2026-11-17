const PIPE_DIAGRAMS = {
  NPT: ['npt', 905, 927, 'рис. 3, стр. 6', 'Базовые плоскости и размеры конической резьбы NPT'],
  NPTR: ['nptr', 935, 297, 'табл. 5, стр. 15', 'Укороченная наружная резьба NPTR и контроль внутренней резьбы калибром'],
  NPSM: ['npsm', 958, 561, 'табл. 6, стр. 17', 'Профили наружной и внутренней резьбы NPSM'],
  NPSL: ['npsl', 562, 497, 'табл. 7, стр. 18', 'Соединение с контргайками и резьбой NPSL'],
};

function pipeDiagram(series) {
  const figure = PIPE_DIAGRAMS[series];
  if (!figure) return '';

  const [name, width, height, source, description] = figure;
  const url = 'assets/threads/asme-b1-20-1-' + name + '.png';
  return standardDiagram(url, width, height, 'ASME B1.20.1-2013', source, description);
}

function standardDiagram(url, width, height, standard, source, description) {
  return `<figure style="margin:12px 0 20px">
    <a href="${url}" target="_blank" rel="noopener">
      <img src="${url}" width="${width}" height="${height}" alt="${description}"
        style="display:block;width:100%;max-width:640px;height:auto">
    </a>
    <figcaption style="margin-top:8px">${standard} · ${source}.
      <a href="${url}" target="_blank" rel="noopener">Открыть в полном размере</a>
    </figcaption>
  </figure>`;
}

function profileDiagram(thread) {
  if (thread.system === 'METRIC_GOST' && thread.series === 'M') {
    return standardDiagram('assets/threads/gost-9150-2002-fig-1.png', 637, 558,
      'ГОСТ 9150-2002', 'рис. 1, стр. 2', 'Основной профиль наружной и внутренней метрической резьбы');
  }
  if (thread.system === 'UNIFIED' && ['UN', 'UNC', 'UNF', 'UNEF'].includes(thread.series)) {
    return standardDiagram('assets/threads/asme-b1-1-2024-fig-2.png', 772, 505,
      'ASME B1.1-2024', 'рис. 2, стр. 4', 'Основной профиль Unified для резьб UN и UNR');
  }
  return '';
}
