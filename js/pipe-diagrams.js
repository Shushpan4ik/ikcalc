// Shared axial sections for ASME B1.20.1-2013 pipe thread families.
// Shapes are schematic. Numerical dimensions belong to the size tables.
const PIPE_DIAGRAMS = {
  NPT: {table: 2, taper: true, summary: 'Коническая наружная и внутренняя резьба · 1:16 по диаметру'},
  NPSC: {table: 4, internalOnly: true, summary: 'Цилиндрическая внутренняя резьба трубной муфты'},
  NPTR: {table: 5, taper: true, recessed: true, summary: 'Укороченный наружный конец и выточка во внутренней детали'},
  NPSM: {table: 6, summary: 'Цилиндрическая пара для механических соединений'},
  NPSL: {table: 7, locknut: true, summary: 'Цилиндрическая пара со свободной посадкой под контргайку'},
};

function pipeDiagram(series) {
  const spec = PIPE_DIAGRAMS[series];
  const panels = spec.internalOnly ? [true] : [false, true];
  const width = 360;
  const panelHeight = 140;

  function section(internal, index) {
    const top = index * panelHeight;
    const left = spec.recessed && !internal ? 70 : 32;
    const right = spec.recessed && internal ? 272 : 328;
    const axis = 104;
    const slope = spec.taper ? 14 : 0;
    const start = internal ? 66 : 72;
    const depth = 8;
    const toothCount = Math.round((right - left) / 26);
    const step = (right - left) / toothCount;
    const direction = internal ? -1 : 1;

    function surface(x, height = 0) {
      return start - (x - left) / (right - left) * slope + height * direction;
    }

    const edge = [];
    for (let tooth = 0; tooth < toothCount; tooth++) {
      for (const [fraction, height] of [[0, 0], [.20, 0], [.48, depth], [.72, depth]]) {
        const x = left + (tooth + fraction) * step;
        edge.push([x.toFixed(2), surface(x, height).toFixed(2)].join(','));
      }
    }
    edge.push(right + ',' + surface(right));
    if (spec.recessed && internal) edge.push('272,43', '328,43');

    const innerOutline = spec.locknut ? '328,47 310,35 50,35 32,47' : '328,35 32,35';
    const outline = internal ? innerOutline : '328,96 ' + left + ',96';
    const kind = internal ? (spec.locknut ? 'Внутренняя · контргайка' : 'Внутренняя резьба') : 'Наружная резьба';
    const material = internal ? '#e2eef8' : '#d6e7f5';
    let markers = '';

    if (series === 'NPT') {
      const x = internal ? right : left;
      const label = internal ? 'E₁ · широкая плоскость' : 'E₀ · малый торец';
      markers = `<path d="M${x} 48V110" stroke="#8d4122" stroke-dasharray="4 3"/>
        <text x="${internal ? x - 3 : x + 3}" y="128" fill="#793b23" text-anchor="${internal ? 'end' : 'start'}">${label}</text>`;
    }
    if (series === 'NPT' && !internal) {
      markers += `<path d="M32 46H156 M32 41V51 M156 41V57" stroke="#8d4122"/>
        <text x="94" y="40" text-anchor="middle" fill="#793b23">L₁</text>`;
    }
    if (spec.recessed) {
      markers = internal
        ? '<path d="M300 44V115" stroke="#8d4122" stroke-dasharray="4 3"/><text x="328" y="128" fill="#793b23" text-anchor="end">Выточка q / Q</text>'
        : '<path d="M32 80V112 M70 80V112 M32 111H70" stroke="#8d4122"/><text x="32" y="128" fill="#793b23">L₆ · укорочение</text>';
    }

    return `<g transform="translate(0 ${top})">
      <text x="32" y="24" font-weight="600">${kind}</text>
      <path d="M24 ${axis}H336" stroke="#617489" stroke-dasharray="8 4 2 4"/>
      <text x="336" y="118" text-anchor="end" font-size="11">Ось</text>
      <polygon points="${edge.join(' ')} ${outline}" fill="${material}" stroke="#284660" stroke-width="1.5" stroke-linejoin="round"/>
      ${markers}
    </g>`;
  }

  const height = panelHeight * panels.length;
  return `<figure style="margin:12px 0 20px">
    <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
      style="display:block;width:100%;max-width:540px;height:auto;border-radius:8px"
      role="img" aria-label="${series}. ${spec.summary}"
      font-family="system-ui,sans-serif" font-size="13" fill="#172f46">
      <rect width="${width}" height="${height}" fill="#f3f7fa"/>
      ${panels.map(section).join('')}
    </svg>
    <figcaption style="margin-top:8px">${spec.summary}. Условный разрез, без масштаба.
      <small>ASME B1.20.1-2013, табл. ${spec.table}.</small>
    </figcaption>
  </figure>`;
}

