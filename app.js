/* ============================================================
   DSA Vault — app.js
   All logic: storage, rendering, filters, modal, form, toasts
   Default language: Java
   ============================================================ */

'use strict';

// ── STORAGE KEY ────────────────────────────────────────────────
const STORE_KEY = 'dsa_vault_v1';
const GOAL_KEY = 'dsa_vault_weekly_goal';
const COMPLETED_NUMBERS_KEY = 'dsa_vault_completed_numbers_v1';
const LEETCODE_PROBLEM_LIMIT = 4086;

// ── DATA LAYER ─────────────────────────────────────────────────
function loadProblems() {
  const seeds = (typeof window !== 'undefined' && window.SEED_PROBLEMS) || [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored) && stored.length > 0) {
        // Merge any seed problems not yet in local storage (by number & title)
        const existingKeys = new Set(stored.map(p => (p.number || '') + ':' + p.title.toLowerCase()));
        const toAdd = seeds.filter(p => !existingKeys.has((p.number || '') + ':' + p.title.toLowerCase()));
        if (toAdd.length > 0) {
          const merged = [...stored, ...toAdd];
          saveProblems(merged);
          return merged;
        }
        return stored;
      }
    }
    if (seeds.length > 0) {
      saveProblems(seeds);
      return seeds;
    }
    return [];
  } catch {
    return seeds;
  }
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
function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function reviewIntervalDays(confidence) {
  return ({ 0: 1, 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 })[confidence] || 1;
}
function nextReviewDate(confidence, from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + reviewIntervalDays(confidence));
  return localDateString(date);
}
function isReviewDue(problem) {
  return Boolean(problem.nextReviewDate && problem.nextReviewDate <= localDateString());
}
function fmtReviewDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}
function isValidDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
function isHttpUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
function currentWeekStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return localDateString(date);
}
function hasLegacyReview(problem) {
  if (!problem.reviewedAt) return false;
  const reviewedAt = new Date(problem.reviewedAt).getTime();
  const createdAt = new Date(problem.createdAt).getTime();
  return !Number.isNaN(reviewedAt) &&
    (Number.isNaN(createdAt) || reviewedAt - createdAt > 60000);
}
function weeklyReviewCount(problemList) {
  const start = currentWeekStart();
  const today = localDateString();
  const reviewed = new Set();
  problemList.forEach(problem => {
    const history = Array.isArray(problem.reviewHistory) ? problem.reviewHistory : [];
    const dates = history.map(entry => entry.reviewedAt);
    if (!history.length && hasLegacyReview(problem)) dates.push(problem.reviewedAt);
    if (dates.some(date => {
      const parsed = new Date(date);
      return !Number.isNaN(parsed.getTime()) &&
        localDateString(parsed) >= start && localDateString(parsed) <= today;
    })) reviewed.add(problem.id);
  });
  return reviewed.size;
}
function getWeeklyGoal() {
  const stored = Number(localStorage.getItem(GOAL_KEY));
  return Number.isInteger(stored) && stored >= 1 && stored <= 100 ? stored : 5;
}
function loadCompletedNumbers() {
  const raw = localStorage.getItem(COMPLETED_NUMBERS_KEY);
  if (raw === null) return [];
  const numbers = JSON.parse(raw);
  if (!Array.isArray(numbers) || !numbers.every(number =>
    Number.isInteger(number) && number >= 1 && number <= LEETCODE_PROBLEM_LIMIT
  )) {
    throw new Error('Your saved completed problem numbers are invalid. Export a backup before clearing browser storage.');
  }
  return [...new Set(numbers)];
}
function saveCompletedNumbers(numbers) {
  localStorage.setItem(COMPLETED_NUMBERS_KEY, JSON.stringify([...new Set(numbers)]));
}
function getProblemNumberSet(problemList = loadProblems()) {
  return new Set(problemList
    .map(problem => Number.parseInt(problem.number, 10))
    .filter(number => Number.isInteger(number) && number >= 1 && number <= LEETCODE_PROBLEM_LIMIT));
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

// ── BACKUP / RESTORE ─────────────────────────────────────────
$('#exportBackup').addEventListener('click', () => {
  try {
    const backup = {
      format: 'dsa-vault-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      weeklyGoal: getWeeklyGoal(),
      completedNumbers: loadCompletedNumbers(),
      problems: loadProblems()
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `dsa-vault-backup-${localDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Backup downloaded 💾', 'success');
  } catch (error) {
    console.error('Could not export backup', error);
    toast('Could not export backup. Check browser storage permissions.', 'error');
  }
});

$('#importBackup').addEventListener('click', () => $('#backupFile').click());
$('#backupFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    let imported;
    if (Array.isArray(data)) {
      imported = data;
    } else if (data && data.format === 'dsa-vault-backup' && data.version === 1) {
      imported = data.problems;
    } else {
      throw new Error('Unsupported backup format.');
    }
    if (!Array.isArray(imported)) throw new Error('Backup must contain a problem list.');
    if (data && data.weeklyGoal !== undefined &&
      (!Number.isInteger(data.weeklyGoal) || data.weeklyGoal < 1 || data.weeklyGoal > 100)) {
      throw new Error('Backup contains an invalid weekly goal.');
    }
    const importedCompletedNumbers = Array.isArray(data) ? [] : (data.completedNumbers || []);
    if (!Array.isArray(importedCompletedNumbers) || !importedCompletedNumbers.every(number =>
      Number.isInteger(number) && number >= 1 && number <= LEETCODE_PROBLEM_LIMIT
    )) {
      throw new Error(`Backup completed numbers must be whole numbers from 1 to ${LEETCODE_PROBLEM_LIMIT}.`);
    }

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    const valid = imported.every(problem =>
      problem && typeof problem === 'object' &&
      typeof problem.id === 'string' && problem.id.length > 0 &&
      typeof problem.title === 'string' && problem.title.trim().length > 0 &&
      validDifficulties.includes(problem.difficulty) &&
      (problem.tags === undefined || (Array.isArray(problem.tags) && problem.tags.every(tag => typeof tag === 'string'))) &&
      (problem.solutions === undefined || (Array.isArray(problem.solutions) && problem.solutions.every(solution =>
        solution && typeof solution === 'object' &&
        LANGS.includes(solution.lang) && typeof solution.code === 'string' &&
        (solution.name === undefined || typeof solution.name === 'string')
      ))) &&
      (problem.reviewHistory === undefined || (Array.isArray(problem.reviewHistory) && problem.reviewHistory.every(entry =>
        entry && typeof entry === 'object' &&
        typeof entry.reviewedAt === 'string' && !Number.isNaN(new Date(entry.reviewedAt).getTime()) &&
        Number.isInteger(entry.confidence) && entry.confidence >= 0 && entry.confidence <= 5
      ))) &&
      (problem.confidence === undefined || (Number.isInteger(problem.confidence) && problem.confidence >= 0 && problem.confidence <= 5)) &&
      (problem.link === undefined || problem.link === '' || isHttpUrl(problem.link)) &&
      (problem.nextReviewDate === undefined || isValidDateOnly(problem.nextReviewDate))
    );
    if (!valid) throw new Error('Backup contains invalid problem data.');

    problems = loadProblems();
    let added = 0;
    let updated = 0;
    imported.forEach(problem => {
      const key = `${problem.number || ''}:${problem.title.toLowerCase()}`;
      const index = problems.findIndex(existing =>
        existing.id === problem.id ||
        `${existing.number || ''}:${existing.title.toLowerCase()}` === key
      );
      if (index === -1) {
        problems.push(problem);
        added++;
      } else {
        problems[index] = problem;
        updated++;
      }
    });
    saveProblems(problems);
    if (data && data.weeklyGoal !== undefined) localStorage.setItem(GOAL_KEY, String(data.weeklyGoal));
    saveCompletedNumbers([...loadCompletedNumbers(), ...importedCompletedNumbers]);
    updateSidebarStats();
    if (currentView === 'dashboard') renderDashboard();
    else if (currentView === 'problems') renderProblems();
    else if (currentView === 'revisit') renderRevisit();
    toast(`Backup imported: ${added} added, ${updated} updated.`, 'success');
  } catch (error) {
    console.error('Could not import backup', error);
    toast(error instanceof SyntaxError ? 'That file is not valid JSON.' : error.message || 'Could not import backup.', 'error');
  } finally {
    event.target.value = '';
  }
});

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
  const due  = ps.filter(isReviewDue).length;
  const goal = getWeeklyGoal();
  const reviewedThisWeek = weeklyReviewCount(ps);
  const total = ps.length;

  $('#dashTotal').textContent   = total;
  $('#dashEasy').textContent    = easy;
  $('#dashMed').textContent     = med;
  $('#dashHard').textContent    = hard;
  $('#dashRevisit').textContent = rev;
  $('#dashWeek').textContent    = week;
  $('#dashDue').textContent     = due;
  $('#weeklyGoalInput').value = goal;
  $('#goalProgress').setAttribute('aria-valuemax', goal);
  $('#goalProgress').setAttribute('aria-valuenow', Math.min(reviewedThisWeek, goal));
  $('#goalProgressFill').style.width = Math.min(100, (reviewedThisWeek / goal) * 100) + '%';
  $('#goalProgressCopy').textContent = `${reviewedThisWeek} of ${goal} ${goal === 1 ? 'problem' : 'problems'} reviewed this week${reviewedThisWeek >= goal ? ' — goal reached!' : ''}`;

  const pct = (n) => total ? Math.round((n / total) * 100) + '%' : '0%';
  $('#dashEasyBar').style.width    = pct(easy);
  $('#dashMedBar').style.width     = pct(med);
  $('#dashHardBar').style.width    = pct(hard);
  $('#dashRevisitBar').style.width = pct(rev);
  $('#dashWeekBar').style.width    = week ? Math.min(100, (week / Math.max(total,1)) * 100) + '%' : '0%';
  $('#dashDueBar').style.width     = pct(due);

  // Topic coverage, with the least-practiced topics first.
  const tagMap = {};
  ps.forEach(p => (p.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }));
  const tagCloud = $('#tagCloud');
  if (!Object.keys(tagMap).length) {
    tagCloud.innerHTML = '<p class="muted">No tags yet — add some problems!</p>';
  } else {
    tagCloud.innerHTML = Object.entries(tagMap)
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(([tag, cnt]) => {
        const coverage = Math.round((cnt / Math.max(total, 1)) * 100);
        const safeTag = escHtml(tag);
        return `
        <button type="button" class="topic-item" data-tag="${safeTag}" title="Filter by ${safeTag}">
          <span class="topic-item-header">
            <span class="topic-item-name">${safeTag}</span>
            <span class="topic-item-count">${cnt} ${cnt === 1 ? 'problem' : 'problems'} · ${coverage}%</span>
          </span>
          <span class="topic-item-bar"><span class="topic-item-fill" style="width:${coverage}%"></span></span>
        </button>`;
      })
      .join('');
    $$('.topic-item', tagCloud).forEach(el => {
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

$('#goalForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const goal = Number($('#weeklyGoalInput').value);
  if (!Number.isInteger(goal) || goal < 1 || goal > 100) {
    toast('Set a weekly goal between 1 and 100.', 'error');
    $('#weeklyGoalInput').focus();
    return;
  }
  try {
    localStorage.setItem(GOAL_KEY, String(goal));
    renderDashboard();
    toast('Weekly practice goal updated.', 'success');
  } catch (error) {
    console.error('Could not save weekly practice goal', error);
    toast('Could not save your goal. Check browser storage permissions.', 'error');
  }
});

// ── PROBLEM CARD HTML ─────────────────────────────────────────
function probCardHTML(p) {
  const tagPills = (p.tags || []).slice(0, 4).map(t =>
    `<span class="tag-pill">${escHtml(t)}</span>`).join('');
  const extraTags = (p.tags || []).length > 4 ?
    `<span class="tag-pill">+${(p.tags||[]).length - 4}</span>` : '';
  const stars = p.confidence ? `<span class="card-stars" title="Confidence: ${p.confidence}/5">${starsHTML(p.confidence)}</span>` : '';
  const revisitFlag = p.revisit ? '<span class="revisit-flag">🔁 Revisit</span>' : '';
  const dueFlag = isReviewDue(p) ? '<span class="review-due-flag">⏰ Review due</span>' : '';
  const favBadge = p.favorite ? '<span class="fav-badge">⭐ Pinned</span>' : '';
  const complexity = [
    p.timeComplexity ? `⏱ ${escHtml(p.timeComplexity)}` : '',
    p.spaceComplexity ? `💾 ${escHtml(p.spaceComplexity)}` : ''
  ].filter(Boolean).join('  ');

  return `
    <div class="prob-card ${diffClass(p.difficulty)}${p.favorite ? ' is-favorite' : ''}" data-id="${escHtml(p.id)}" role="button" tabindex="0">
      <div class="card-top">
        <div class="card-top-left">
          <button type="button" class="card-fav-btn ${p.favorite ? 'active' : ''}" data-fav="${escHtml(p.id)}" title="${p.favorite ? 'Unpin from top' : 'Star problem (pins to top)'}" aria-label="Star">
            <span>${p.favorite ? '★' : '☆'}</span>
            <span>${p.favorite ? 'Starred' : 'Star'}</span>
          </button>
          <span class="card-num">${p.number ? '#' + escHtml(String(p.number)) : ''}</span>
        </div>
        <div class="card-badges">
          ${favBadge}
          ${revisitFlag}
          ${dueFlag}
          <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
        </div>
      </div>
      <div class="card-title">${escHtml(p.title)}</div>
      <div class="card-tags">${tagPills}${extraTags}</div>
      <div class="card-footer">
        <span class="card-complexity">${complexity}</span>
        ${stars}
      </div>
    </div>`;
}

function attachCardListeners(container) {
  $$('.prob-card', container).forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) return;
      openModal(card.dataset.id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.card-fav-btn')) return;
        openModal(card.dataset.id);
      }
    });
  });

  $$('.card-fav-btn', container).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.fav);
    });
  });
}

// ── TOGGLE FAVORITE ───────────────────────────────────────────
function toggleFavorite(id) {
  problems = loadProblems();
  const p = problems.find(x => x.id === id);
  if (!p) return;
  p.favorite = !p.favorite;
  saveProblems(problems);
  toast(p.favorite ? 'Pinned to top ⭐' : 'Unpinned from top', 'info');
  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'revisit') renderRevisit();
  else renderProblems();

  if (modalProblemId === id) {
    $('#mFavBadge').classList.toggle('hidden', !p.favorite);
    $('#mFav').classList.toggle('active', !!p.favorite);
    $('#mFav').textContent = p.favorite ? '★ Favorited' : '☆ Favorite';
  }
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
    bar.innerHTML = `<div class="active-tag-pill" id="removeTagFilter">${escHtml(activeTagFilter)} ✕</div>`;
    $('#removeTagFilter').addEventListener('click', () => { activeTagFilter = null; renderProblems(); });
    ps = ps.filter(p => (p.tags || []).includes(activeTagFilter));
  } else {
    bar.innerHTML = '';
  }

  // Diff filter (all, fav, Easy, Medium, Hard)
  if (diffFilter === 'fav') {
    ps = ps.filter(p => p.favorite);
  } else if (diffFilter !== 'all') {
    ps = ps.filter(p => p.difficulty === diffFilter);
  }

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    ps = ps.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.number || '').toString().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  // Sort (favorites / pinned always stay at the top!)
  const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
  ps.sort((a, b) => {
    if (Boolean(b.favorite) !== Boolean(a.favorite)) {
      return b.favorite ? 1 : -1;
    }
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

// GitHub-style '/' shortcut to focus search
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    if (currentView !== 'problems') showView('problems');
    setTimeout(() => {
      searchInput.focus();
      searchInput.select();
    }, 10);
  }
});

// Sort
$('#sortSelect').addEventListener('change', () => {
  sortMode = $('#sortSelect').value;
  renderProblems();
});

// ── REVISIT VIEW ──────────────────────────────────────────────
function renderRevisit() {
  problems = loadProblems();
  const revProblems = problems.filter(p => p.revisit || isReviewDue(p));
  revProblems.sort((a, b) => {
    if (isReviewDue(a) !== isReviewDue(b)) return isReviewDue(a) ? -1 : 1;
    if (a.nextReviewDate && b.nextReviewDate && a.nextReviewDate !== b.nextReviewDate) {
      return a.nextReviewDate.localeCompare(b.nextReviewDate);
    }
    if (Boolean(b.favorite) !== Boolean(a.favorite)) return b.favorite ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const grid = $('#revisitGrid');
  if (!revProblems.length) {
    grid.innerHTML = `<div class="empty-state" id="revisitEmpty">
      <div class="empty-ico">✅</div>
      <div class="empty-title">You're all caught up!</div>
      <div class="empty-sub">No problems are flagged or due for review.</div>
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
    <button type="button" class="sol-tab${activeSolTab === s.id ? ' active' : ''}" data-sid="${escHtml(s.id)}">
      ${escHtml(LANG_LABELS[s.lang] || s.lang)}
      ${solutions.length > 1 ? `<span class="sol-tab-del" data-del="${escHtml(s.id)}" title="Remove">✕</span>` : ''}
    </button>`).join('');

  panels.innerHTML = solutions.map(s => `
    <div class="sol-panel${activeSolTab === s.id ? ' active' : ''}" data-sid="${escHtml(s.id)}">
      <div class="sol-panel-inner">
        <div class="sol-panel-bar">
          <input type="text" class="sol-name-inp" placeholder="Solution name (e.g. Optimal, Brute Force)" value="${escHtml(s.name)}" data-field="name" data-sid="${escHtml(s.id)}" />
          <select class="lang-sel" data-field="lang" data-sid="${escHtml(s.id)}">${langOptions(s.lang)}</select>
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
  $('#tagPreview').innerHTML = tags.map(t => `<span class="tag-pill">${escHtml(t)}</span>`).join('');
});

// ── FORM RESET ────────────────────────────────────────────────
function resetForm() {
  $('#problemForm').reset();
  $('#editId').value = '';
  $('#fFavorite').checked = false;
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
    favorite:      Boolean($('#fFavorite').checked),
    revisit:       $('#fRevisit').checked,
    createdAt:     editId ? (problems.find(p => p.id === editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    reviewedAt:    editId ? problems.find(p => p.id === editId)?.reviewedAt : undefined,
    reviewHistory: editId ? problems.find(p => p.id === editId)?.reviewHistory || [] : [],
    nextReviewDate: editId
      ? problems.find(p => p.id === editId)?.nextReviewDate
      : nextReviewDate(parseInt($('#fConf').value, 10) || 0),
    updatedAt:     new Date().toISOString(),
  };

  if (editId) {
    const idx = problems.findIndex(p => p.id === editId);
    if (idx !== -1) problems[idx] = prob;
  } else {
    // If favorited/pinned, put at very front
    if (prob.favorite) problems.unshift(prob);
    else problems.unshift(prob);
  }
  saveProblems(problems);
  recordCompletedNumber(prob.number);
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
let modalPracticeMode = false;

function openModal(id, practice = false) {
  problems = loadProblems();
  const p = problems.find(p => p.id === id);
  if (!p) return;
  modalProblemId = id;

  $('#mNum').textContent   = p.number ? `#${p.number}` : '';
  $('#mTitle').textContent = p.title;
  $('#mDiff').textContent  = p.difficulty;
  $('#mDiff').className    = `diff-badge ${p.difficulty}`;
  $('#mFavBadge').classList.toggle('hidden', !p.favorite);
  $('#mRevisitBadge').classList.toggle('hidden', !p.revisit);
  $('#mFav').classList.toggle('active', Boolean(p.favorite));
  $('#mFav').textContent   = p.favorite ? '★ Favorited' : '☆ Favorite';

  // Meta
  const metaItems = [
    isHttpUrl(p.link) ? `<div class="m-meta-item"><span class="m-meta-key">Link</span><a href="${escHtml(p.link)}" target="_blank" rel="noopener">LeetCode ↗</a></div>` : '',
    p.timeComplexity  ? `<div class="m-meta-item"><span class="m-meta-key">Time</span>${escHtml(p.timeComplexity)}</div>` : '',
    p.spaceComplexity ? `<div class="m-meta-item"><span class="m-meta-key">Space</span>${escHtml(p.spaceComplexity)}</div>` : '',
    p.confidence      ? `<div class="m-meta-item"><span class="m-meta-key">Confidence</span><span style="color:var(--medium)">${starsHTML(p.confidence)}</span></div>` : '',
    `<div class="m-meta-item"><span class="m-meta-key">Added</span>${fmtDate(p.createdAt)}</div>`,
    p.reviewedAt ? `<div class="m-meta-item"><span class="m-meta-key">Last reviewed</span>${fmtDate(p.reviewedAt)}</div>` : '',
    p.nextReviewDate ? `<div class="m-meta-item"><span class="m-meta-key">Next review</span>${fmtReviewDate(p.nextReviewDate)}${isReviewDue(p) ? ' · Due' : ''}</div>` : '<div class="m-meta-item"><span class="m-meta-key">Review</span>Not scheduled</div>',
  ].filter(Boolean).join('');
  $('#mMeta').innerHTML = metaItems;

  // Tags
  const mTagsSec = $('#mTagsSec');
  if (p.tags && p.tags.length) {
    mTagsSec.classList.remove('hidden');
    $('#mTags').innerHTML = p.tags.map(t =>
      `<span class="tag-pill" style="cursor:pointer" data-tag="${escHtml(t)}">${escHtml(t)}</span>`).join('');
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
        ${escHtml(s.name || LANG_LABELS[s.lang] || s.lang)}
      </button>`).join('');
    panels.innerHTML = solns.map((s, i) =>
      `<div class="m-sol-panel${i === 0 ? ' active' : ''}" data-i="${i}">
        <div class="m-sol-header">
          <span>${escHtml(s.name || 'Solution')}</span>
          <span style="font-family:'JetBrains Mono',monospace">${escHtml(LANG_LABELS[s.lang] || s.lang)}</span>
        </div>
        <pre><code class="language-${escHtml(s.lang)}">${escHtml(s.code)}</code></pre>
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

  const history = Array.isArray(p.reviewHistory) ? [...p.reviewHistory] : [];
  if (!history.length && hasLegacyReview(p)) {
    history.push({ reviewedAt: p.reviewedAt, confidence: p.confidence || 0 });
  }
  history.sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
  $('#mHistory').innerHTML = history.length
    ? history.map(entry => `
      <div class="review-history-item">
        <span>${fmtDate(entry.reviewedAt)}</span>
        <span>${entry.confidence ? `${starsHTML(entry.confidence)} (${entry.confidence}/5)` : 'Not rated'}</span>
      </div>`).join('')
    : '<p class="muted">No reviews recorded yet.</p>';
  $('#mReviewConfidence').value = 'current';
  $('#mRevealNotes').classList.toggle('hidden', !p.notes);
  $('#mRevealSolutions').classList.toggle('hidden', !solns.length);
  $('#mNotes').classList.remove('practice-hidden');
  $('#mSolTabs').classList.remove('practice-hidden');
  $('#mSolPanels').classList.remove('practice-hidden');
  setPracticeMode(practice);

  $('#backdrop').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function setPracticeMode(enabled) {
  modalPracticeMode = enabled;
  $('#mPractice').classList.toggle('active', enabled);
  $('#mPractice').setAttribute('aria-pressed', String(enabled));
  $('#mPractice').textContent = enabled ? '✕ Exit practice mode' : '🎯 Practice mode';
  $('#mRevealNotes').classList.toggle('hidden', !enabled || $('#mNotesSec').classList.contains('hidden'));
  $('#mRevealSolutions').classList.toggle('hidden', !enabled || $('#mSolSec').classList.contains('hidden'));
  $('#mNotes').classList.toggle('practice-hidden', enabled);
  $('#mSolTabs').classList.toggle('practice-hidden', enabled);
  $('#mSolPanels').classList.toggle('practice-hidden', enabled);
}

$('#mPractice').addEventListener('click', () => setPracticeMode(!modalPracticeMode));
$('#mRevealNotes').addEventListener('click', () => {
  $('#mNotes').classList.remove('practice-hidden');
  $('#mRevealNotes').classList.add('hidden');
});
$('#mRevealSolutions').addEventListener('click', () => {
  $('#mSolTabs').classList.remove('practice-hidden');
  $('#mSolPanels').classList.remove('practice-hidden');
  $('#mRevealSolutions').classList.add('hidden');
});

function closeModal() {
  $('#backdrop').classList.add('hidden');
  document.body.style.overflow = '';
  modalProblemId = null;
}

$('#mClose').addEventListener('click', closeModal);
$('#backdrop').addEventListener('click', (e) => { if (e.target === $('#backdrop')) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeChallenge();
  }
});

let activeChallengeNumber = null;

function recordCompletedNumber(rawNumber) {
  const number = Number.parseInt(rawNumber, 10);
  if (!Number.isInteger(number) || number < 1 || number > LEETCODE_PROBLEM_LIMIT) return;
  saveCompletedNumbers([...loadCompletedNumbers(), number]);
}

function pickUnsolvedNumber() {
  const unavailable = getProblemNumberSet();
  loadCompletedNumbers().forEach(number => unavailable.add(number));
  const available = [];
  for (let number = 1; number <= LEETCODE_PROBLEM_LIMIT; number++) {
    if (!unavailable.has(number)) available.push(number);
  }
  if (!available.length) {
    toast(`All numbers from 1 to ${LEETCODE_PROBLEM_LIMIT} are marked solved.`, 'info');
    return;
  }
  activeChallengeNumber = available[Math.floor(Math.random() * available.length)];
  $('#challengeNumber').textContent = `#${activeChallengeNumber}`;
  $('#challengeLink').href = `https://leetcode.com/problemset/?search=${activeChallengeNumber}`;
  $('#challengeComplete').classList.add('hidden');
  $('#challengeMarkDone').classList.remove('hidden');
  $('#challengeAddDetails').classList.add('hidden');
  $('#challengeBackdrop').classList.remove('hidden');
}

function closeChallenge() {
  $('#challengeBackdrop').classList.add('hidden');
  activeChallengeNumber = null;
}

$('#challengeClose').addEventListener('click', closeChallenge);
$('#challengeBackdrop').addEventListener('click', event => {
  if (event.target === $('#challengeBackdrop')) closeChallenge();
});
$('#challengeAnother').addEventListener('click', pickUnsolvedNumber);
$('#challengeMarkDone').addEventListener('click', () => {
  if (!activeChallengeNumber) return;
  try {
    saveCompletedNumbers([...loadCompletedNumbers(), activeChallengeNumber]);
    $('#challengeComplete').classList.remove('hidden');
    $('#challengeMarkDone').classList.add('hidden');
    $('#challengeAddDetails').classList.remove('hidden');
    toast(`LeetCode #${activeChallengeNumber} marked done.`, 'success');
  } catch (error) {
    console.error('Could not save completed problem number', error);
    toast('Could not save this completion. Check browser storage permissions.', 'error');
  }
});
$('#challengeAddDetails').addEventListener('click', () => {
  if (!activeChallengeNumber) return;
  const number = activeChallengeNumber;
  closeChallenge();
  showView('add');
  $('#fNum').value = String(number);
  $('#fLink').value = `https://leetcode.com/problemset/?search=${number}`;
});

$('#randomPracticeBtn').addEventListener('click', () => {
  pickUnsolvedNumber();
});

$('#mReviewed').addEventListener('click', () => {
  if (!modalProblemId) return;
  problems = loadProblems();
  const problem = problems.find(item => item.id === modalProblemId);
  if (!problem) return;
  const now = new Date();
  const selectedConfidence = $('#mReviewConfidence').value;
  const confidence = selectedConfidence === 'current'
    ? (problem.confidence || 0)
    : Number(selectedConfidence);
  problem.confidence = confidence;
  problem.reviewedAt = now.toISOString();
  problem.nextReviewDate = nextReviewDate(confidence, now);
  problem.reviewHistory = Array.isArray(problem.reviewHistory) ? problem.reviewHistory : [];
  problem.reviewHistory.push({ reviewedAt: now.toISOString(), confidence });
  problem.revisit = false;
  problem.updatedAt = now.toISOString();
  saveProblems(problems);
  updateSidebarStats();
  toast(`Review scheduled for ${fmtReviewDate(problem.nextReviewDate)}.`, 'success');

  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'revisit') renderRevisit();
  else renderProblems();
  openModal(problem.id);
});

// Favorite from modal
$('#mFav').addEventListener('click', () => {
  if (modalProblemId) toggleFavorite(modalProblemId);
});

// Edit from modal
$('#mEdit').addEventListener('click', () => {
  const id = modalProblemId;
  closeModal();
  editProblem(id);
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
  $('#fFavorite').checked   = Boolean(p.favorite);
  $('#fRevisit').checked    = p.revisit || false;
  confidence = p.confidence || 0;
  renderStars();

  // Tag preview
  $('#tagPreview').innerHTML = (p.tags || []).map(t => `<span class="tag-pill">${escHtml(t)}</span>`).join('');

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

// ── THEME SUPPORT (DARK / MOODY SLATE LIGHT) ──────────────────
const THEME_KEY = 'dsa_vault_theme';

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = $('#themeToggle');
  if (btn) {
    btn.textContent = theme === 'light' ? '☀️' : '🌙';
    btn.setAttribute('title', theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode');
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  setTheme(saved);
  const btn = $('#themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  initTheme();
  updateSidebarStats();
  renderDashboard();
  resetForm(); // creates default Java solution slot
}

init();
