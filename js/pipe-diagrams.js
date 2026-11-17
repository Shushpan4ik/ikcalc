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
  return `<figure style="margin:12px 0 20px">
    <a href="${url}" target="_blank" rel="noopener">
      <img src="${url}" width="${width}" height="${height}" alt="${description}"
        style="display:block;width:100%;max-width:640px;height:auto">
    </a>
    <figcaption style="margin-top:8px">ASME B1.20.1-2013 · ${source}.
      <a href="${url}" target="_blank" rel="noopener">Открыть в полном размере</a>
    </figcaption>
  </figure>`;
}
