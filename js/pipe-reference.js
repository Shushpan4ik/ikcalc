const pipeValue = value => fmt(value, 5);
const pipeSize = value => pipeValue(pipeMm(value));
function pipeBetween(min, max) {
  if (min === max) return pipeValue(min);
  if (min == null) return '≤ ' + pipeValue(max);
  if (max == null) return '≥ ' + pipeValue(min);
  return pipeValue(min) + '…' + pipeValue(max);
}

function pipeCell(thread, side, kind) {
  const limits = thread.pipe[side]?.[kind];
  return limits ? (thread.taper ? 'баз. ' : '') + pipeBetween(...limits) : '—';
}

function pipeMeasurementLabel(thread, side) {
  if (!thread.taper) return 'Измеряемый диаметр';
  if (side === 'internal') return 'D₁ в широкой плоскости резьбы (E₁ − h)';
  return thread.series === 'NPT' ? 'd у малого торца (E₀ + h)' : 'd у укороченного торца (E₆ + h)';
}

function pipeDetail(thread) {
  const {row, series, tpi, taper} = thread;
  const dimensions = [
    ['Наружный Ø трубы D', pipeValue(thread.diameter_mm) + ' мм'],
    ['Шаг P', pipeValue(thread.pitch_mm) + ' мм · ' + pipeValue(tpi) + ' TPI'],
    ['Профиль', (taper ? 'Конический 1:16' : 'Цилиндрический') + ' · 60°'],
  ];
  const tolerances = [];
  const add = values => dimensions.push(...values.map(([label, inches]) => [label, pipeSize(inches) + ' мм']));
  const sources = {
    NPT: 'табл. 1–3, стр. 5, 8–10; § 3.2, рис. 4–7',
    NPSC: 'табл. 1, 4, стр. 5, 14; §§ 4.1.2, 4.2',
    NPTR: 'табл. 1, 2, 5, стр. 5, 8–9, 15; § 5',
    NPSM: 'табл. 6, стр. 17; §§ 6.2, 6.4',
    NPSL: 'табл. 7, стр. 18; §§ 6.3, 6.4',
  };
  let note = '';
  if (series === 'NPT') {
    add([
      ['E₀ · средний диаметр у малого торца', row[4]],
      ['E₁ · средний диаметр в плоскости L₁', row[7]],
      ['E₂ · средний диаметр в конце L₂', row[10]],
      ['E₃ · средний диаметр на глубине L₁ + L₃', row[15]],
      ['E₅ · средний диаметр в плоскости L₅', row[20]],
      ['h · базовая высота профиля', row[21]],
      ['L₁ · свинчивание от руки', row[5]],
      ['L₂ · эффективная длина наружной резьбы', row[8]],
      ['L₂ − L₁ · запас наружной резьбы под ключ', row[11]],
      ['L₃ · запас внутренней резьбы под ключ', row[13]],
      ['L₄ · полная наружная длина', row[18]],
      ['L₅ · длина с полным профилем', row[19]],
      ['V · длина сбега', row[16]],
    ]);
    tolerances.push(
      ['Калибр L₁ · наружная и внутренняя', '±1 оборот (±' + pipeValue(thread.pitch_mm) + ' мм по оси)'],
      ['Индикаторный калибр L₁ · эквивалент по диаметру', '±' + pipeSize(row[22]) + ' мм'],
      ['Конусность по диаметру', 'от 0,6875 до 0,875 дюйма на фут'],
      ['Отклонение хода на эффективной длине', '±0,0762 мм; свыше 25,4 мм — ±0,003 мм/мм'],
      ['Отклонение угла профиля', '±' + pipeValue(PIPE_PROFILE[tpi][6]) + '°'],
    );
    note = 'Плоскость E₁ отстоит от малого торца наружной резьбы на L₁ и соответствует широкому торцу внутренней резьбы при свинчивании от руки. База контроля L₁ — торец. При наружной фаске диаметром меньше малого диаметра резьбы или внутренней фаске диаметром больше большого диаметра резьбы база переносится на линию окончания фаски (§ 3.2.4, рис. 5–6).';
  }
  if (series === 'NPSC') {
    tolerances.push(['Пробка L₁ · внутренняя', '±1,5 оборота (±' + pipeValue(1.5 * thread.pitch_mm) + ' мм по оси)']);
    note = 'Средние диаметры таблицы 4 соответствуют контролю конической пробкой. Фактический средний диаметр цилиндрической резьбы может быть немного меньше (примечание 1 к таблице 4).';
  }
  if (series === 'NPTR') {
    add([
      ['E₆ · средний диаметр у укороченного торца', row[4]],
      ['h · высота профиля', row[3]],
      ['L₆ · укорочение наружной резьбы', row[5]],
      ['L₂ − L₆ · эффективная наружная длина', row[7]],
      ['L₄ − L₆ · максимальная полная наружная длина', row[9]],
      ['V · максимальная длина неполных ниток', row[11]],
      ['q · минимальная глубина выточки', row[13]],
      ['Q · минимальный диаметр выточки', row[14]],
      ['T · минимальная длина', row[15]],
      ['S · базовое заглубление риски калибра', row[16]],
    ]);
    tolerances.push(
      ['Кольцо L₁ · торец внутри калибра', (row[6] - 1) + '…' + row[6] + ' оборота'],
      ['Пробка L₁ · риска ниже торца детали', row[17] + '…' + (row[17] + 1) + ' оборота'],
    );
    note = 'Внутренняя резьба имеет базовую геометрию NPT. Выточку детали задают размеры таблицы 5. Наружная резьба укорочена на L₆.';
  }
  if (series === 'NPSM') add([['Диаметральный зазор по среднему диаметру (allowance)', row[3]]]);
  if (taper || series === 'NPSC') {
    const [hMin, hMax, fMin, fMax, flatMin, flatMax] = PIPE_PROFILE[tpi];
    tolerances.push(
      ['Высота профиля h · табл. 1', pipeSize(hMin) + '…' + pipeSize(hMax) + ' мм'],
      ['Срез вершины и впадины f · табл. 1', pipeSize(fMin) + '…' + pipeSize(fMax) + ' мм'],
      ['Эквивалентная ширина площадки F · табл. 1', pipeSize(flatMin) + '…' + pipeSize(flatMax) + ' мм'],
    );
  }

  const diameters = Object.entries(thread.pipe).flatMap(([side, values]) => {
    const labels = side === 'external' ? ['d', 'd₂', 'd₁'] : ['D', 'D₂', 'D₁'];
    const plane = taper ? (side === 'external' ? ' · малый торец' : ' · широкая плоскость резьбы') : '';
    return ['major', 'pitch', 'minor'].flatMap((kind, i) => values[kind]
      ? [[labels[i] + plane, pipeBetween(...values[kind]) + ' мм']]
      : []);
  });

  function tableHtml(rows, heading) {
    if (!rows.length) return '';
    return '<h3>' + heading + '</h3><table class="dtable"><tbody>' + rows.map(([label, value]) =>
      '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>').join('') + '</tbody></table>';
  }

  return '<div class="detailTop"><div><span class="tag">ASME · ' + series + '</span><h2>' + thread.designation + '</h2></div></div>'
    + pipeDiagram(series)
    + tableHtml(dimensions, 'Базовые размеры')
    + tableHtml(diameters, taper ? 'Базовые диаметры в указанных плоскостях' : 'Предельные диаметры')
    + tableHtml(tolerances, 'Допуски и контроль')
    + (note ? '<p class="note">' + note + '</p>' : '')
    + '<p class="source"><a href="' + PIPE_STANDARD_URL + '" target="_blank" rel="noopener">' + PIPE_STANDARD
    + '</a> · ' + sources[series] + '</p>';
}
