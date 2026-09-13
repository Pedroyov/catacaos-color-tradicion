(function () {
  'use strict';

  var GROUPS = [
    {
      id: 'danzas',
      title: 'Danzas Nacionales',
      eyebrow: 'Tradición en escena',
      description: 'Campeones de Danzas Nacionales en categoría mayores.'
    },
    {
      id: 'caporales',
      title: 'Caporales',
      eyebrow: 'Fuerza y elegancia',
      description: 'Campeones de la modalidad Caporales.'
    },
    {
      id: 'infantil',
      title: 'Infantiles',
      eyebrow: 'Nuevas generaciones',
      description: 'Campeones de la categoría Infantil.'
    }
  ];

  var state = {
    activeGroup: null,
    winnersByGroup: {},
    editionsByYear: new Map(),
    groupsById: new Map(),
    groupsByName: new Map(),
    groupRows: []
  };

  var elements = {};

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function keyify(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }

  function normalizedRecord(record) {
    var output = {};
    Object.keys(record || {}).forEach(function (key) {
      output[keyify(key)] = record[key];
    });
    return output;
  }

  function read(record, aliases) {
    for (var i = 0; i < aliases.length; i += 1) {
      var value = record[keyify(aliases[i])];
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return '';
  }

  function asArray(payload, possibleKeys) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];
    for (var i = 0; i < possibleKeys.length; i += 1) {
      if (Array.isArray(payload[possibleKeys[i]])) return payload[possibleKeys[i]];
    }
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.data && typeof payload.data === 'object') {
      return asArray(payload.data, possibleKeys);
    }
    return [];
  }

  function isFalse(value) {
    return ['no', 'false', '0', 'oculto', 'inactivo', 'borrador'].indexOf(normalize(value)) !== -1;
  }

  function isChampion(record) {
    var explicit = read(record, ['campeon', 'es_campeon', 'ganador']);
    if (explicit && ['si', 'sí', 'true', '1', 'x'].indexOf(normalize(explicit)) !== -1) return true;

    var place = normalize(read(record, ['puesto', 'posicion', 'lugar', 'resultado']));
    return /^1(?:\D|$)/.test(place) || place.indexOf('primer') !== -1 || place.indexOf('campeon') !== -1;
  }

  function resolveGroup(record) {
    // `grupo_ganadores` permite controlar desde Sheets cómo se muestra cualquier
    // combinación futura de modalidad/categoría, sin cambiar este archivo.
    var explicit = normalize(read(record, ['grupo_ganadores', 'grupo', 'seccion_ganadores']));
    if (explicit.indexOf('infant') !== -1) return 'infantil';
    if (explicit.indexOf('caporal') !== -1) return 'caporales';
    if (explicit.indexOf('danza') !== -1 || explicit.indexOf('mayor') !== -1) return 'danzas';

    var category = normalize(read(record, ['categoria', 'categoria_nombre']));
    var modality = normalize(read(record, ['modalidad', 'modalidad_nombre']));
    if (category.indexOf('infant') !== -1) return 'infantil';
    if (modality.indexOf('caporal') !== -1) return 'caporales';
    return 'danzas';
  }

  function numberYear(value) {
    var match = String(value || '').match(/(?:19|20)\d{2}/);
    return match ? Number(match[0]) : 0;
  }

  function joinUnique(values) {
    var seen = new Set();
    return values.filter(function (value) {
      var clean = String(value || '').trim();
      var token = normalize(clean);
      if (!clean || seen.has(token)) return false;
      seen.add(token);
      return true;
    }).join(' · ');
  }

  function buildLookups(groupRows, editionRows) {
    state.groupsById.clear();
    state.groupsByName.clear();
    state.editionsByYear.clear();
    state.groupRows = groupRows.map(normalizedRecord);

    state.groupRows.forEach(function (group) {
      var id = normalize(read(group, ['id_agrupacion', 'id agrupacion', 'id']));
      var name = normalize(read(group, ['nombre_oficial', 'nombre', 'agrupacion']));
      if (id) state.groupsById.set(id, group);
      if (name) state.groupsByName.set(name, group);
    });

    editionRows.map(normalizedRecord).forEach(function (edition) {
      var year = numberYear(read(edition, ['anio', 'año', 'edicion']));
      if (year) state.editionsByYear.set(year, edition);
    });
  }

  function enrichWinner(rawRecord) {
    var record = normalizedRecord(rawRecord);
    var groupId = normalize(read(record, ['id_agrupacion', 'id agrupacion']));
    var rawName = read(record, ['agrupacion', 'nombre_agrupacion', 'nombre']);
    var normalizedName = normalize(rawName);
    var compactName = keyify(rawName).replace(/_/g, '');
    var group = state.groupsById.get(groupId) || state.groupsByName.get(normalizedName);
    if (!group && compactName) {
      group = state.groupRows.find(function (candidate) {
        var officialName = read(candidate, ['nombre_oficial', 'nombre', 'agrupacion']);
        var compactOfficialName = keyify(officialName).replace(/_/g, '');
        return compactOfficialName && (
          compactName === compactOfficialName ||
          compactName.endsWith(compactOfficialName) ||
          compactOfficialName.endsWith(compactName)
        );
      });
    }
    group = group || {};
    var year = numberYear(read(record, ['anio', 'año', 'edicion']));
    var edition = state.editionsByYear.get(year) || {};
    var district = read(record, ['localidad_centro_poblado', 'distrito_localidad', 'distritoLocalidad', 'localidad', 'distrito']);
    var province = read(record, ['provincia']);
    var region = read(record, ['region']);

    return {
      year: year,
      group: resolveGroup(record),
      name: read(group, ['nombre_oficial', 'nombre_corto', 'nombre']) || rawName || 'Agrupación ganadora',
      location: joinUnique([
        district || read(group, ['localidad_centro_poblado', 'localidad', 'distrito']),
        province || read(group, ['provincia']),
        region || read(group, ['region'])
      ]),
      image: read(record, ['logo', 'imagen', 'foto']) || read(group, ['logo', 'imagen', 'foto']),
      detail: read(record, ['mensajeCampeon', 'mensaje_campeon', 'observaciones', 'observacion', 'detalle', 'reconocimiento']) || 'Primer lugar',
      url: read(record, ['url_edicion', 'enlace', 'url']) || read(edition, ['url', 'enlace', 'pagina'])
    };
  }

  function create(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createMedia(winner, className) {
    var media = create('div', className);
    if (winner.image) {
      var image = document.createElement('img');
      image.src = winner.image;
      image.alt = 'Logo de ' + winner.name;
      image.loading = 'lazy';
      image.addEventListener('error', function () {
        media.replaceChildren(create('span', 'winner-monogram', winner.name.trim().charAt(0).toUpperCase()));
      }, { once: true });
      media.appendChild(image);
    } else {
      media.appendChild(create('span', 'winner-monogram', winner.name.trim().charAt(0).toUpperCase()));
    }
    return media;
  }

  function createCurrentCard(group, winners) {
    var primary = winners[0];
    var card = create('article', 'current-champion-card current-champion-card--' + group.id);
    card.dataset.group = group.id;
    card.appendChild(createMedia(primary, 'current-champion-media'));

    var content = create('div', 'current-champion-content');
    content.appendChild(create('span', 'current-champion-label', group.title));
    content.appendChild(create('span', 'current-champion-year', 'Campeón ' + primary.year));
    content.appendChild(create('h3', '', joinUnique(winners.map(function (winner) { return winner.name; }))));

    var locations = joinUnique(winners.map(function (winner) { return winner.location; }));
    if (locations) content.appendChild(create('p', 'current-champion-location', locations));

    var linkWinner = winners.find(function (winner) { return winner.url; });
    if (linkWinner) {
      var link = create('a', 'current-champion-link', 'Ver edición ' + primary.year + ' →');
      link.href = linkWinner.url;
      content.appendChild(link);
    }
    card.appendChild(content);
    return card;
  }

  function createHistoryCard(winner, groupId) {
    var card = create('article', 'winner-history-card winner-history-card--' + groupId);
    card.appendChild(createMedia(winner, 'winner-history-logo'));

    var content = create('div', 'winner-history-content');
    content.appendChild(create('span', 'winner-history-year', String(winner.year || 'Edición')));
    content.appendChild(create('h3', '', winner.name));
    if (winner.location) content.appendChild(create('p', 'winner-history-location', winner.location));
    if (winner.detail) content.appendChild(create('p', 'winner-history-detail', winner.detail));
    if (winner.url) {
      var link = create('a', 'winner-history-link', 'Conocer la edición');
      link.href = winner.url;
      content.appendChild(link);
    }
    card.appendChild(content);
    return card;
  }

  function renderCurrentChampions() {
    elements.currentList.replaceChildren();
    var count = 0;

    GROUPS.forEach(function (group) {
      var winners = state.winnersByGroup[group.id] || [];
      if (!winners.length) return;
      var latestYear = winners[0].year;
      var current = winners.filter(function (winner) { return winner.year === latestYear; });
      elements.currentList.appendChild(createCurrentCard(group, current));
      count += 1;
    });

    elements.currentSection.hidden = count === 0;
    elements.currentList.dataset.count = String(count);
  }

  function createGroupSection(group, winners) {
    var section = create('section', 'winner-group winner-group--' + group.id);
    section.dataset.group = group.id;
    section.setAttribute('aria-labelledby', 'winner-group-title-' + group.id);

    var header = create('div', 'winner-group-header');
    var titleBlock = create('div', 'winner-group-title-block');
    titleBlock.appendChild(create('span', 'winner-group-eyebrow', group.eyebrow));
    var title = create('h3', '', group.title);
    title.id = 'winner-group-title-' + group.id;
    titleBlock.appendChild(title);
    titleBlock.appendChild(create('p', '', group.description));
    header.appendChild(titleBlock);
    header.appendChild(create('span', 'winner-group-count', winners.length + (winners.length === 1 ? ' campeón' : ' campeones')));
    section.appendChild(header);

    var grid = create('div', 'winner-history-grid');
    winners.forEach(function (winner) { grid.appendChild(createHistoryCard(winner, group.id)); });
    section.appendChild(grid);
    return section;
  }

  function renderHistory() {
    elements.sections.replaceChildren();
    var available = 0;

    GROUPS.forEach(function (group) {
      var winners = state.winnersByGroup[group.id] || [];
      var button = elements.filters.querySelector('[data-group="' + group.id + '"]');
      var hasData = winners.length > 0;
      button.disabled = !hasData;
      button.title = hasData ? '' : 'Aún no hay campeones publicados en esta competencia';
      if (!hasData) return;
      elements.sections.appendChild(createGroupSection(group, winners));
      available += 1;
    });

    elements.empty.hidden = available !== 0;
    elements.filters.hidden = available === 0;
    applyFilter();
  }

  function applyFilter() {
    var sections = elements.sections.querySelectorAll('.winner-group');
    sections.forEach(function (section) {
      section.hidden = Boolean(state.activeGroup && section.dataset.group !== state.activeGroup);
    });

    elements.filters.querySelectorAll('.winner-filter').forEach(function (button) {
      var active = button.dataset.group === state.activeGroup;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (!state.activeGroup) {
      elements.filterStatus.textContent = '';
      return;
    }
    var group = GROUPS.find(function (item) { return item.id === state.activeGroup; });
    elements.filterStatus.textContent = 'Mostrando solo: ' + group.title + '. Pulsa el filtro otra vez para ver todo.';
  }

  function bindFilters() {
    elements.filters.addEventListener('click', function (event) {
      var button = event.target.closest('.winner-filter');
      if (!button || button.disabled) return;
      state.activeGroup = state.activeGroup === button.dataset.group ? null : button.dataset.group;
      applyFilter();
    });
  }

  function requestDataset(name, required) {
    // Un `const CCTData` declarado en un script clásico es accesible como
    // identificador global, pero no siempre se convierte en `window.CCTData`.
    // La versión anterior de esta página usaba precisamente esa primera forma.
    var dataService = typeof CCTData !== 'undefined' ? CCTData : window.CCTData;
    if (!dataService) {
      return required ? Promise.reject(new Error('CCTData no está disponible')) : Promise.resolve([]);
    }

    var methodName = 'get' + name.charAt(0).toUpperCase() + name.slice(1);
    if (typeof dataService[methodName] === 'function') {
      return Promise.resolve(dataService[methodName]());
    }
    if (typeof dataService.getData === 'function') {
      return Promise.resolve(dataService.getData(name));
    }
    if (typeof dataService.get === 'function') {
      return Promise.resolve(dataService.get(name));
    }
    if (dataService[name] !== undefined) {
      return Promise.resolve(dataService[name]);
    }

    return required
      ? Promise.reject(new Error('No existe un método para obtener ' + name))
      : Promise.resolve([]);
  }

  function loadData() {
    elements.loading.hidden = false;
    elements.error.hidden = true;
    elements.empty.hidden = true;
    state.activeGroup = null;

    return Promise.all([
      requestDataset('participaciones', true),
      requestDataset('agrupaciones', false).catch(function () { return []; }),
      requestDataset('ediciones', false).catch(function () { return []; })
    ]).then(function (responses) {
      var participations = asArray(responses[0], ['participaciones', 'resultados', 'items']);
      var groups = asArray(responses[1], ['agrupaciones', 'items']);
      var editions = asArray(responses[2], ['ediciones', 'items']);
      buildLookups(groups, editions);

      var winners = participations
        .map(normalizedRecord)
        .filter(function (record) {
          return !isFalse(read(record, ['visible', 'publicado'])) && isChampion(record);
        })
        .map(enrichWinner)
        .filter(function (winner) { return winner.group && winner.year; })
        .sort(function (a, b) { return b.year - a.year || a.name.localeCompare(b.name, 'es'); });

      state.winnersByGroup = {};
      GROUPS.forEach(function (group) { state.winnersByGroup[group.id] = []; });
      winners.forEach(function (winner) { state.winnersByGroup[winner.group].push(winner); });

      renderCurrentChampions();
      renderHistory();
      elements.loading.hidden = true;
    }).catch(function (error) {
      console.error('[Ganadores] No se pudieron cargar los datos:', error);
      elements.loading.hidden = true;
      elements.error.hidden = false;
      elements.currentSection.hidden = true;
      elements.filters.hidden = true;
      elements.sections.replaceChildren();
    });
  }

  function init() {
    elements.currentSection = document.getElementById('current-champions-section');
    elements.currentList = document.getElementById('current-champions-list');
    elements.filters = document.getElementById('winner-filters');
    elements.filterStatus = document.getElementById('winner-filter-status');
    elements.sections = document.getElementById('winner-sections');
    elements.loading = document.getElementById('winners-loading');
    elements.error = document.getElementById('winners-error');
    elements.empty = document.getElementById('winners-empty');

    bindFilters();
    document.getElementById('winners-retry').addEventListener('click', loadData);
    loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
