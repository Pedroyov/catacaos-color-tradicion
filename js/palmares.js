/**
 * Palmarés histórico de la portada.
 * Los resultados se calculan desde Participaciones y Agrupaciones mediante
 * CCTData. No contiene nombres, posiciones ni años escritos manualmente.
 */
(function () {
  'use strict';

  var COMPETITIONS = {
    danzas: {
      label: 'Danzas Nacionales',
      description: 'Resultados históricos de la modalidad Danzas Nacionales.'
    },
    caporales: {
      label: 'Caporales',
      description: 'Resultados históricos de la modalidad Caporales.'
    },
    infantil: {
      label: 'Infantiles',
      description: 'Resultados históricos de la categoría Infantil.'
    }
  };

  var activeCompetition = 'danzas';
  var competitionData = { danzas: [], caporales: [], infantil: [] };
  var competitionRows = { danzas: [], caporales: [], infantil: [] };

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function keyify(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, '');
  }

  function read(record, keys) {
    for (var i = 0; i < keys.length; i += 1) {
      var value = record && record[keys[i]];
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return '';
  }

  function isFalse(value) {
    return ['no', 'false', '0', 'oculto', 'inactivo', 'borrador'].indexOf(normalize(value)) !== -1;
  }

  function numberYear(value) {
    var match = String(value || '').match(/(?:19|20)\d{2}/);
    return match ? Number(match[0]) : 0;
  }

  function normalizePuesto(value) {
    var match = String(value == null ? '' : value).match(/[123]/);
    return match ? Number(match[0]) : null;
  }

  function competitionOf(record) {
    var modalidad = normalize(read(record, ['modalidad']));
    var categoria = normalize(read(record, ['categoria']));

    if (modalidad.indexOf('caporal') !== -1) return 'caporales';
    if (categoria.indexOf('infantil') !== -1 || categoria.indexOf('nino') !== -1) return 'infantil';
    if (modalidad.indexOf('danza') !== -1 && modalidad.indexOf('nacional') !== -1) return 'danzas';
    return null;
  }

  function buildGroupReferences(groups) {
    return groups.map(function (group) {
      var official = read(group, ['nombre_oficial', 'nombreOficial']);
      var shortName = read(group, ['nombre_corto', 'nombreCorto']);
      return {
        displayName: official || shortName,
        logo: read(group, ['logo']),
        aliases: [official, shortName].map(keyify).filter(Boolean)
      };
    }).filter(function (group) { return group.displayName; });
  }

  function findGroup(rawName, references) {
    var compactName = keyify(rawName);
    var match = references.find(function (reference) {
      return reference.aliases.some(function (alias) {
        return compactName === alias || compactName.endsWith(alias) || alias.endsWith(compactName);
      });
    });
    return match || { displayName: rawName, logo: '', aliases: [compactName] };
  }

  function buildStats(rows, references) {
    var byName = new Map();

    rows.forEach(function (record) {
      var puesto = normalizePuesto(read(record, ['puesto']));
      var rawName = read(record, ['agrupacion']);
      if (!puesto || !rawName) return;

      var reference = findGroup(rawName, references);
      var groupKey = keyify(reference.displayName || rawName);
      var year = numberYear(read(record, ['anio', 'año']));

      if (!byName.has(groupKey)) {
        byName.set(groupKey, {
          name: reference.displayName || rawName,
          logo: reference.logo,
          titulos: new Set(),
          subcampeonatos: new Set(),
          terceros: new Set()
        });
      }

      var entry = byName.get(groupKey);
      if (!entry.logo && reference.logo) entry.logo = reference.logo;
      if (puesto === 1) entry.titulos.add(year);
      if (puesto === 2) entry.subcampeonatos.add(year);
      if (puesto === 3) entry.terceros.add(year);
    });

    return Array.from(byName.values()).map(function (entry) {
      return {
        name: entry.name,
        logo: entry.logo,
        titulos: Array.from(entry.titulos).filter(Boolean).sort(),
        subcampeonatos: Array.from(entry.subcampeonatos).filter(Boolean).sort(),
        terceros: Array.from(entry.terceros).filter(Boolean).sort()
      };
    });
  }

  function firstYear(entry, key) {
    return entry[key].length ? Math.min.apply(null, entry[key]) : Number.MAX_SAFE_INTEGER;
  }

  function compareMetric(a, b, key) {
    return b[key].length - a[key].length || firstYear(a, key) - firstYear(b, key);
  }

  function compareOverall(a, b) {
    return (
      b.titulos.length - a.titulos.length ||
      b.subcampeonatos.length - a.subcampeonatos.length ||
      b.terceros.length - a.terceros.length ||
      firstYear(a, 'titulos') - firstYear(b, 'titulos') ||
      firstYear(a, 'subcampeonatos') - firstYear(b, 'subcampeonatos') ||
      firstYear(a, 'terceros') - firstYear(b, 'terceros') ||
      a.name.localeCompare(b.name, 'es')
    );
  }

  function topByMetric(entries, key) {
    return entries
      .filter(function (entry) { return entry[key].length > 0; })
      .sort(function (a, b) {
        return compareMetric(a, b, key) || a.name.localeCompare(b.name, 'es');
      })
      .slice(0, 2);
  }

  function create(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function pluralTitulos(number) {
    return number === 1 ? '1 título' : number + ' títulos';
  }

  function pluralVeces(number) {
    return number === 1 ? '1 vez' : number + ' veces';
  }

  function createLogo(entry) {
    var image = document.createElement('img');
    image.src = entry.logo || 'img/logo1.png';
    image.alt = 'Logo de ' + entry.name;
    image.loading = 'lazy';
    image.addEventListener('error', function () {
      if (!image.src.endsWith('/img/logo1.png')) image.src = 'img/logo1.png';
    });
    return image;
  }

  function honorItem(entry, label) {
    var item = create('div', 'honor-item');
    item.appendChild(createLogo(entry));
    var info = create('div');
    info.appendChild(create('strong', '', entry.name));
    info.appendChild(create('span', '', label));
    item.appendChild(info);
    return item;
  }

  function renderHonors(container, entries, label) {
    var columns = [
      { title: '🥇 Más campeonatos', key: 'titulos', label: pluralTitulos },
      { title: '🥈 Más subcampeonatos', key: 'subcampeonatos', label: pluralVeces },
      { title: '🥉 Más terceros lugares', key: 'terceros', label: pluralVeces }
    ];

    container.replaceChildren();
    if (!entries.length) {
      var empty = create('div', 'palmares-empty');
      empty.appendChild(create('strong', '', 'Aún no hay resultados publicados'));
      empty.appendChild(document.createTextNode(
        'Cuando se registren puestos de ' + label + ' en Sheets, aparecerán aquí automáticamente.'
      ));
      container.appendChild(empty);
      return;
    }

    columns.forEach(function (column) {
      var top = topByMetric(entries, column.key);
      if (!top.length) return;
      var card = create('div', 'honor-column');
      card.appendChild(create('h4', '', column.title));
      top.forEach(function (entry) {
        card.appendChild(honorItem(entry, column.label(entry[column.key].length)));
      });
      container.appendChild(card);
    });
  }

  function allPodiumYears(entry) {
    return Array.from(new Set(entry.titulos.concat(entry.subcampeonatos, entry.terceros))).sort();
  }

  function renderTable(tbody, entries) {
    var ranked = entries.slice().sort(compareOverall);
    tbody.replaceChildren();

    if (!ranked.length) {
      var emptyRow = create('tr', 'palmares-table-message');
      var emptyCell = create('td', '', 'Todavía no hay posiciones publicadas para esta competencia.');
      emptyCell.colSpan = 6;
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return;
    }

    ranked.forEach(function (entry, index) {
      var row = document.createElement('tr');
      var rankCell = document.createElement('td');
      rankCell.appendChild(create('span', 'palmares-rank', String(index + 1)));
      row.appendChild(rankCell);

      var nameCell = document.createElement('td');
      var group = create('div', 'palmares-group-cell');
      group.appendChild(createLogo(entry));
      var groupText = create('div');
      groupText.appendChild(create('strong', '', entry.name));
      var years = allPodiumYears(entry);
      groupText.appendChild(create('small', '', years.length ? 'Podios: ' + years.join(', ') : 'Sin podios'));
      group.appendChild(groupText);
      nameCell.appendChild(group);
      row.appendChild(nameCell);

      [entry.titulos.length, entry.subcampeonatos.length, entry.terceros.length].forEach(function (number) {
        row.appendChild(create('td', '', String(number)));
      });
      row.appendChild(create('td', 'palmares-total', String(
        entry.titulos.length + entry.subcampeonatos.length + entry.terceros.length
      )));
      tbody.appendChild(row);
    });
  }

  function renderSummary(container, entries, rows) {
    var champions = entries.filter(function (entry) { return entry.titulos.length > 0; }).length;
    var podiums = entries.reduce(function (total, entry) {
      return total + entry.titulos.length + entry.subcampeonatos.length + entry.terceros.length;
    }, 0);
    var latestYear = rows.reduce(function (latest, record) {
      return Math.max(latest, numberYear(read(record, ['anio', 'año'])));
    }, 0);

    container.replaceChildren();
    [
      [entries.length, 'agrupaciones con podios'],
      [champions, champions === 1 ? 'campeón' : 'campeones'],
      [podiums, podiums === 1 ? 'podio registrado' : 'podios registrados'],
      [latestYear || '—', 'edición más reciente']
    ].forEach(function (item) {
      var card = create('div', 'palmares-summary-item');
      card.appendChild(create('strong', '', String(item[0])));
      card.appendChild(create('span', '', item[1]));
      container.appendChild(card);
    });
  }

  function updateButtons(selected) {
    document.querySelectorAll('[data-palmares-filter]').forEach(function (button) {
      var isActive = button.dataset.palmaresFilter === selected;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  }

  function renderActiveCompetition() {
    var config = COMPETITIONS[activeCompetition];
    var entries = competitionData[activeCompetition] || [];
    var rows = competitionRows[activeCompetition] || [];
    var panel = document.querySelector('.palmares-panel');

    document.getElementById('honors-active-title').textContent = config.label;
    document.getElementById('historic-table-title').textContent = 'Palmarés de ' + config.label;
    document.getElementById('historic-table-description').textContent = config.description;
    panel.dataset.palmaresTheme = activeCompetition;
    updateButtons(activeCompetition);
    renderHonors(document.getElementById('honors-grid'), entries, config.label);
    renderTable(document.getElementById('historic-table-body'), entries);
    renderSummary(document.getElementById('palmares-summary'), entries, rows);
  }

  function showLoadError(error) {
    console.error('[Palmarés] No se pudieron cargar los datos:', error);
    var message = 'No fue posible cargar el palmarés en este momento. Inténtalo nuevamente más tarde.';
    document.getElementById('honors-grid').replaceChildren(create('div', 'palmares-empty', message));
    var tableBody = document.getElementById('historic-table-body');
    tableBody.replaceChildren();
    var row = create('tr', 'palmares-table-message');
    var cell = create('td', '', message);
    cell.colSpan = 6;
    row.appendChild(cell);
    tableBody.appendChild(row);
    document.getElementById('palmares-summary').replaceChildren();
  }

  function init() {
    if (!document.getElementById('honors-grid') || typeof CCTData === 'undefined') return;

    document.querySelectorAll('[data-palmares-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        activeCompetition = button.dataset.palmaresFilter;
        renderActiveCompetition();
      });
    });

    Promise.all([
      CCTData.getParticipaciones(),
      CCTData.getAgrupaciones().catch(function () { return []; })
    ]).then(function (responses) {
      var participaciones = (responses[0] || []).filter(function (record) {
        return !isFalse(read(record, ['visible', 'publicado']));
      });
      var references = buildGroupReferences(responses[1] || []);

      Object.keys(COMPETITIONS).forEach(function (competition) {
        var rows = participaciones.filter(function (record) {
          return competitionOf(record) === competition;
        });
        competitionRows[competition] = rows;
        competitionData[competition] = buildStats(rows, references);
      });
      renderActiveCompetition();
    }).catch(showLoadError);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
