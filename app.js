/* ============================================================
   DSA Vault — app.js
   All logic: storage, rendering, filters, modal, form, toasts
   Default language: Java
   ============================================================ */

'use strict';

// ── STORAGE KEY ────────────────────────────────────────────────
const STORE_KEY = 'dsa_vault_v1';

// ── DATA LAYER ─────────────────────────────────────────────────
function loadProblems() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch { return []; }
}
function saveProblems(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

let problems = loadProblems();

// ── HELPERS ───────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const uid = () => '_' + Math.random().toString(36).slice(2, 10);

function parseTags(raw) {
  return raw.split(',').map(t => t.trim()).filter(Boolean);
}
function starsHTML(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}
function diffClass(d) {
  return { Easy: 'easy-card', Medium: 'medium-card', Hard: 'hard-card' }[d] || '';
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function thisWeek(problems) {
  const weekAgo = Date.now() - 7 * 86400000;
  return problems.filter(p => new Date(p.createdAt).getTime() > weekAgo).length;
}

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 3100);
}

// ── NAVIGATION ────────────────────────────────────────────────
let currentView = 'dashboard';
let activeTagFilter = null;

function showView(name) {
  currentView = name;
  $$('.view').forEach(v => v.classList.remove('active'));
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  const view = $(`#view${name.charAt(0).toUpperCase() + name.slice(1)}`);
  if (view) view.classList.add('active');
  $$('.nav-item').forEach(n => {
    if (n.dataset.view === name) n.classList.add('active');
  });

  if (name === 'dashboard') renderDashboard();
  if (name === 'problems') renderProblems();
  if (name === 'revisit') renderRevisit();
  if (name === 'add') {
    // fresh add — only reset if not editing
    if (!$('#editId').value) resetForm();
  }
  // Close sidebar on mobile
  if (window.innerWidth <= 900) $('#sidebar').classList.remove('open');
}

// Delegated nav clicks
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-view]');
  if (target) {
    if (!$('#editId').value && target.dataset.view === 'add') resetForm();
    showView(target.dataset.view);
  }
});

// Sidebar hamburger
$('#sidebarToggle').addEventListener('click', () => {
  $('#sidebar').classList.toggle('open');
});

// ── SIDEBAR STATS UPDATE ──────────────────────────────────────
function updateSidebarStats() {
  const ps = loadProblems();
  $('#sidebarTotal').textContent  = ps.length;
  $('#sidebarEasy').textContent   = ps.filter(p => p.difficulty === 'Easy').length;
  $('#sidebarMedium').textContent = ps.filter(p => p.difficulty === 'Medium').length;
  $('#sidebarHard').textContent   = ps.filter(p => p.difficulty === 'Hard').length;
}

// ── DASHBOARD ─────────────────────────────────────────────────
function renderDashboard() {
  const ps = loadProblems();
  const easy = ps.filter(p => p.difficulty === 'Easy').length;
  const med  = ps.filter(p => p.difficulty === 'Medium').length;
  const hard = ps.filter(p => p.difficulty === 'Hard').length;
  const rev  = ps.filter(p => p.revisit).length;
  const week = thisWeek(ps);
  const total = ps.length;

  $('#dashTotal').textContent   = total;
  $('#dashEasy').textContent    = easy;
  $('#dashMed').textContent     = med;
  $('#dashHard').textContent    = hard;
  $('#dashRevisit').textContent = rev;
  $('#dashWeek').textContent    = week;

  const pct = (n) => total ? Math.round((n / total) * 100) + '%' : '0%';
  $('#dashEasyBar').style.width    = pct(easy);
  $('#dashMedBar').style.width     = pct(med);
  $('#dashHardBar').style.width    = pct(hard);
  $('#dashRevisitBar').style.width = pct(rev);
  $('#dashWeekBar').style.width    = week ? Math.min(100, (week / Math.max(total,1)) * 100) + '%' : '0%';

  // Tag cloud
  const tagMap = {};
  ps.forEach(p => (p.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }));
  const tagCloud = $('#tagCloud');
  if (!Object.keys(tagMap).length) {
    tagCloud.innerHTML = '<p class="muted">No tags yet — add some problems!</p>';
  } else {
    tagCloud.innerHTML = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, cnt]) => `
        <div class="tag-cloud-item" data-tag="${tag}">
          ${tag} <span class="tag-count">${cnt}</span>
        </div>`)
      .join('');
    $$('.tag-cloud-item', tagCloud).forEach(el => {
      el.addEventListener('click', () => {
        activeTagFilter = el.dataset.tag;
        showView('problems');
      });
    });
  }

  // Recent (last 5)
  const recent = [...ps].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0, 5);
  const recentList = $('#recentList');
  if (!recent.length) {
    recentList.innerHTML = '<p class="muted">Nothing here yet.</p>';
  } else {
    recentList.innerHTML = recent.map(p => probCardHTML(p)).join('');
    attachCardListeners(recentList);
  }
}

// ── PROBLEM CARD HTML ─────────────────────────────────────────
function probCardHTML(p) {
  const tagPills = (p.tags || []).slice(0, 4).map(t =>
    `<span class="tag-pill">${t}</span>`).join('');
  const extraTags = (p.tags || []).length > 4 ?
    `<span class="tag-pill">+${(p.tags||[]).length - 4}</span>` : '';
  const stars = p.confidence ? `<span class="card-stars" title="Confidence: ${p.confidence}/5">${starsHTML(p.confidence)}</span>` : '';
  const revisitFlag = p.revisit ? '<span class="revisit-flag">🔁 Revisit</span>' : '';
  const complexity = [
    p.timeComplexity ? `⏱ ${p.timeComplexity}` : '',
    p.spaceComplexity ? `💾 ${p.spaceComplexity}` : ''
  ].filter(Boolean).join('  ');

  return `
    <div class="prob-card ${diffClass(p.difficulty)}" data-id="${p.id}" role="button" tabindex="0">
      <div class="card-top">
        <span class="card-num">${p.number ? '#' + p.number : ''}</span>
        <div class="card-badges">
          ${revisitFlag}
          <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
        </div>
      </div>
      <div class="card-title">${p.title}</div>
      <div class="card-tags">${tagPills}${extraTags}</div>
      <div class="card-footer">
        <span class="card-complexity">${complexity}</span>
        ${stars}
      </div>
    </div>`;
}

function attachCardListeners(container) {
  $$('.prob-card', container).forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(card.dataset.id); });
  });
}

// ── PROBLEMS VIEW ─────────────────────────────────────────────
let diffFilter = 'all';
let searchQuery = '';
let sortMode = 'newest';

function renderProblems() {
  problems = loadProblems();
  let ps = [...problems];

  // Active tag filter pill
  const bar = $('#activeTagBar');
  if (activeTagFilter) {
    bar.innerHTML = `<div class="active-tag-pill" id="removeTagFilter">${activeTagFilter} ✕</div>`;
    $('#removeTagFilter').addEventListener('click', () => { activeTagFilter = null; renderProblems(); });
    ps = ps.filter(p => (p.tags || []).includes(activeTagFilter));
  } else {
    bar.innerHTML = '';
  }

  // Diff filter
  if (diffFilter !== 'all') ps = ps.filter(p => p.difficulty === diffFilter);

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    ps = ps.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.number || '').toString().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  // Sort
  const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
  ps.sort((a, b) => {
    if (sortMode === 'newest')     return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortMode === 'oldest')     return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortMode === 'difficulty') return (diffOrder[a.difficulty]||0) - (diffOrder[b.difficulty]||0);
    if (sortMode === 'confidence') return (b.confidence||0) - (a.confidence||0);
    if (sortMode === 'title')      return a.title.localeCompare(b.title);
    return 0;
  });

  const grid = $('#problemsGrid');
  if (!ps.length) {
    grid.innerHTML = `<div class="empty-state" id="problemsEmpty">
      <div class="empty-ico">🔍</div>
      <div class="empty-title">${problems.length === 0 ? 'No problems yet' : 'No results found'}</div>
      <div class="empty-sub">${problems.length === 0 ? 'Hit "+ Add Problem" to get started!' : 'Try a different search or filter.'}</div>
    </div>`;
    return;
  }
  grid.innerHTML = ps.map(p => probCardHTML(p)).join('');
  attachCardListeners(grid);
}

// Filter chips
$$('.diff-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.diff-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    diffFilter = chip.dataset.diff;
    renderProblems();
  });
});

// Search
const searchInput = $('#searchInput');
const clearBtn = $('#clearSearch');
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  clearBtn.classList.toggle('hidden', !searchQuery);
  renderProblems();
});
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearBtn.classList.add('hidden');
  renderProblems();
});

// Sort
$('#sortSelect').addEventListener('change', () => {
  sortMode = $('#sortSelect').value;
  renderProblems();
});

// ── REVISIT VIEW ──────────────────────────────────────────────
function renderRevisit() {
  problems = loadProblems();
  const revProblems = problems.filter(p => p.revisit);
  const grid = $('#revisitGrid');
  if (!revProblems.length) {
    grid.innerHTML = `<div class="empty-state" id="revisitEmpty">
      <div class="empty-ico">✅</div>
      <div class="empty-title">You're all caught up!</div>
      <div class="empty-sub">No problems flagged for revisit.</div>
    </div>`;
    return;
  }
  grid.innerHTML = revProblems.map(p => probCardHTML(p)).join('');
  attachCardListeners(grid);
}

// ── FORM: SOLUTIONS MANAGER ───────────────────────────────────
const LANGS = ['java', 'python', 'javascript', 'cpp', 'c', 'csharp', 'go', 'rust', 'typescript', 'kotlin', 'swift'];
const LANG_LABELS = {
  java: 'Java', python: 'Python', javascript: 'JavaScript', cpp: 'C++',
  c: 'C', csharp: 'C#', go: 'Go', rust: 'Rust', typescript: 'TypeScript',
  kotlin: 'Kotlin', swift: 'Swift'
};
let solutions = []; // [{ id, name, lang, code }]
let activeSolTab = null;

function langOptions(selected = 'java') {
  return LANGS.map(l =>
    `<option value="${l}" ${l === selected ? 'selected' : ''}>${LANG_LABELS[l]}</option>`
  ).join('');
}

function renderSolTabs() {
  const tabs   = $('#solTabs');
  const panels = $('#solPanels');
  tabs.innerHTML = solutions.map((s, i) => `
    <button type="button" class="sol-tab${activeSolTab === s.id ? ' active' : ''}" data-sid="${s.id}">
      ${LANG_LABELS[s.lang] || s.lang}
      ${solutions.length > 1 ? `<span class="sol-tab-del" data-del="${s.id}" title="Remove">✕</span>` : ''}
    </button>`).join('');

  panels.innerHTML = solutions.map(s => `
    <div class="sol-panel${activeSolTab === s.id ? ' active' : ''}" data-sid="${s.id}">
      <div class="sol-panel-inner">
        <div class="sol-panel-bar">
          <input type="text" class="sol-name-inp" placeholder="Solution name (e.g. Optimal, Brute Force)" value="${s.name}" data-field="name" data-sid="${s.id}" />
          <select class="lang-sel" data-field="lang" data-sid="${s.id}">${langOptions(s.lang)}</select>
        </div>
        <textarea class="sol-code-area" spellcheck="false" data-field="code" data-sid="${s.id}" placeholder="// Paste your Java solution here...">${escHtml(s.code)}</textarea>
      </div>
    </div>`).join('');

  // Tab click
  $$('.sol-tab', tabs).forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.dataset.del) return; // handled below
      activeSolTab = btn.dataset.sid;
      renderSolTabs();
    });
  });

  // Delete tab
  $$('.sol-tab-del', tabs).forEach(x => {
    x.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = x.dataset.del;
      solutions = solutions.filter(s => s.id !== id);
      if (activeSolTab === id) activeSolTab = solutions[0]?.id || null;
      renderSolTabs();
    });
  });

  // Field changes
  $$('[data-field]', panels).forEach(el => {
    el.addEventListener('input', () => {
      const sol = solutions.find(s => s.id === el.dataset.sid);
      if (sol) {
        sol[el.dataset.field] = el.value;
        if (el.dataset.field === 'lang') {
          // update tab label
          const tab = $(`.sol-tab[data-sid="${el.dataset.sid}"]`, tabs);
          if (tab) tab.firstChild.textContent = LANG_LABELS[el.value] || el.value;
        }
      }
    });
  });
}

function addSolution(name = '', lang = 'java', code = '') {
  const s = { id: uid(), name, lang, code };
  solutions.push(s);
  activeSolTab = s.id;
  renderSolTabs();
}

$('#addSolBtn').addEventListener('click', () => addSolution());

// ── STAR RATING ───────────────────────────────────────────────
let confidence = 0;
function renderStars() {
  $$('.star', $('#starRow')).forEach(s => {
    s.classList.toggle('lit', parseInt(s.dataset.v) <= confidence);
  });
  $('#fConf').value = confidence;
}
$$('.star', $('#starRow')).forEach(star => {
  star.addEventListener('click', () => {
    const v = parseInt(star.dataset.v);
    confidence = confidence === v ? 0 : v;
    renderStars();
  });
  star.addEventListener('mouseenter', () => {
    $$('.star', $('#starRow')).forEach(s => s.classList.toggle('lit', parseInt(s.dataset.v) <= parseInt(star.dataset.v)));
  });
  star.addEventListener('mouseleave', renderStars);
});

// ── TAG PREVIEW ───────────────────────────────────────────────
$('#fTags').addEventListener('input', () => {
  const tags = parseTags($('#fTags').value);
  $('#tagPreview').innerHTML = tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
});

// ── FORM RESET ────────────────────────────────────────────────
function resetForm() {
  $('#problemForm').reset();
  $('#editId').value = '';
  $('#formTitle').textContent = 'Add Problem';
  confidence = 0;
  renderStars();
  solutions = [];
  activeSolTab = null;
  addSolution('Solution 1', 'java', ''); // default Java solution
  $('#tagPreview').innerHTML = '';
}

// ── FORM SUBMIT ───────────────────────────────────────────────
$('#problemForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('#fTitle').value.trim();
  const diff  = $('#fDiff').value;
  if (!title) { toast('Please enter a problem title', 'error'); $('#fTitle').classList.add('error'); return; }
  if (!diff)  { toast('Please select a difficulty', 'error'); $('#fDiff').classList.add('error'); return; }
  $('#fTitle').classList.remove('error');
  $('#fDiff').classList.remove('error');

  problems = loadProblems();
  const editId = $('#editId').value;
  const prob = {
    id:            editId || uid(),
    title,
    number:        $('#fNum').value.trim(),
    difficulty:    diff,
    link:          $('#fLink').value.trim(),
    confidence:    parseInt($('#fConf').value) || 0,
    tags:          parseTags($('#fTags').value),
    notes:         $('#fNotes').value.trim(),
    solutions:     solutions.map(s => ({ ...s })),
    timeComplexity:  $('#fTime').value.trim(),
    spaceComplexity: $('#fSpace').value.trim(),
    revisit:       $('#fRevisit').checked,
    createdAt:     editId ? (problems.find(p => p.id === editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    updatedAt:     new Date().toISOString(),
  };

  if (editId) {
    const idx = problems.findIndex(p => p.id === editId);
    if (idx !== -1) problems[idx] = prob;
  } else {
    problems.unshift(prob);
  }
  saveProblems(problems);
  updateSidebarStats();
  toast(editId ? 'Problem updated! 🎉' : 'Problem saved! 💾', 'success');
  resetForm();
  showView('problems');
});

$('#cancelBtn').addEventListener('click', () => {
  resetForm();
  showView(problems.length ? 'problems' : 'dashboard');
});

// ── MODAL ─────────────────────────────────────────────────────
let modalProblemId = null;

function openModal(id) {
  problems = loadProblems();
  const p = problems.find(p => p.id === id);
  if (!p) return;
  modalProblemId = id;

  $('#mNum').textContent   = p.number ? `#${p.number}` : '';
  $('#mTitle').textContent = p.title;
  $('#mDiff').textContent  = p.difficulty;
  $('#mDiff').className    = `diff-badge ${p.difficulty}`;
  $('#mRevisitBadge').classList.toggle('hidden', !p.revisit);

  // Meta
  const metaItems = [
    p.link ? `<div class="m-meta-item"><span class="m-meta-key">Link</span><a href="${p.link}" target="_blank" rel="noopener">LeetCode ↗</a></div>` : '',
    p.timeComplexity  ? `<div class="m-meta-item"><span class="m-meta-key">Time</span>${p.timeComplexity}</div>` : '',
    p.spaceComplexity ? `<div class="m-meta-item"><span class="m-meta-key">Space</span>${p.spaceComplexity}</div>` : '',
    p.confidence      ? `<div class="m-meta-item"><span class="m-meta-key">Confidence</span><span style="color:var(--medium)">${starsHTML(p.confidence)}</span></div>` : '',
    `<div class="m-meta-item"><span class="m-meta-key">Added</span>${fmtDate(p.createdAt)}</div>`,
  ].filter(Boolean).join('');
  $('#mMeta').innerHTML = metaItems;

  // Tags
  const mTagsSec = $('#mTagsSec');
  if (p.tags && p.tags.length) {
    mTagsSec.classList.remove('hidden');
    $('#mTags').innerHTML = p.tags.map(t =>
      `<span class="tag-pill" style="cursor:pointer" data-tag="${t}">${t}</span>`).join('');
    $$('[data-tag]', $('#mTags')).forEach(pill => {
      pill.addEventListener('click', () => {
        activeTagFilter = pill.dataset.tag;
        closeModal();
        showView('problems');
      });
    });
  } else {
    mTagsSec.classList.add('hidden');
  }

  // Notes
  const mNotesSec = $('#mNotesSec');
  if (p.notes) {
    mNotesSec.classList.remove('hidden');
    $('#mNotes').textContent = p.notes;
  } else {
    mNotesSec.classList.add('hidden');
  }

  // Solutions
  const mSolSec = $('#mSolSec');
  const solns = p.solutions || [];
  if (solns.length) {
    mSolSec.classList.remove('hidden');
    const tabs   = $('#mSolTabs');
    const panels = $('#mSolPanels');
    tabs.innerHTML = solns.map((s, i) =>
      `<button type="button" class="m-sol-tab${i === 0 ? ' active' : ''}" data-i="${i}">
        ${s.name || LANG_LABELS[s.lang] || s.lang}
      </button>`).join('');
    panels.innerHTML = solns.map((s, i) =>
      `<div class="m-sol-panel${i === 0 ? ' active' : ''}" data-i="${i}">
        <div class="m-sol-header">
          <span>${s.name || 'Solution'}</span>
          <span style="font-family:'JetBrains Mono',monospace">${LANG_LABELS[s.lang] || s.lang}</span>
        </div>
        <pre><code class="language-${s.lang}">${escHtml(s.code)}</code></pre>
      </div>`).join('');

    // Highlight
    $$('pre code', panels).forEach(block => {
      if (window.hljs) hljs.highlightElement(block);
    });

    // Tab clicks
    $$('.m-sol-tab', tabs).forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.i;
        $$('.m-sol-tab', tabs).forEach(t => t.classList.remove('active'));
        $$('.m-sol-panel', panels).forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        $(`.m-sol-panel[data-i="${idx}"]`, panels).classList.add('active');
      });
    });
  } else {
    mSolSec.classList.add('hidden');
  }

  $('#backdrop').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('#backdrop').classList.add('hidden');
  document.body.style.overflow = '';
  modalProblemId = null;
}

$('#mClose').addEventListener('click', closeModal);
$('#backdrop').addEventListener('click', (e) => { if (e.target === $('#backdrop')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Edit from modal
$('#mEdit').addEventListener('click', () => {
  closeModal();
  editProblem(modalProblemId || $('#mTitle').textContent);
});

// Delete from modal
$('#mDelete').addEventListener('click', () => {
  if (!modalProblemId) return;
  if (!confirm('Delete this problem? This cannot be undone.')) return;
  problems = loadProblems();
  problems = problems.filter(p => p.id !== modalProblemId);
  saveProblems(problems);
  updateSidebarStats();
  toast('Problem deleted', 'info');
  closeModal();
  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'revisit') renderRevisit();
  else renderProblems();
});

// ── EDIT PROBLEM ──────────────────────────────────────────────
function editProblem(id) {
  problems = loadProblems();
  const p = problems.find(p => p.id === id);
  if (!p) return;

  $('#editId').value        = p.id;
  $('#fTitle').value        = p.title;
  $('#fNum').value          = p.number || '';
  $('#fDiff').value         = p.difficulty;
  $('#fLink').value         = p.link || '';
  $('#fTags').value         = (p.tags || []).join(', ');
  $('#fNotes').value        = p.notes || '';
  $('#fTime').value         = p.timeComplexity || '';
  $('#fSpace').value        = p.spaceComplexity || '';
  $('#fRevisit').checked    = p.revisit || false;
  confidence = p.confidence || 0;
  renderStars();

  // Tag preview
  $('#tagPreview').innerHTML = (p.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');

  // Solutions
  solutions = (p.solutions && p.solutions.length) ?
    p.solutions.map(s => ({ ...s, id: s.id || uid() })) :
    [{ id: uid(), name: 'Solution 1', lang: 'java', code: '' }];
  activeSolTab = solutions[0].id;
  renderSolTabs();

  $('#formTitle').textContent = 'Edit Problem';
  showView('add');
}

// ── ESCAPE HTML ───────────────────────────────────────────────
function escHtml(str = '') {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  updateSidebarStats();
  renderDashboard();
  resetForm(); // creates default Java solution slot
}

init();
