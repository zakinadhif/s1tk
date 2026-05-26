<script lang="ts">
  import { onMount } from 'svelte';

  type Annotation = {
    id: string;
    color: string;
    text: string;
    note?: string;
    xpath?: string;
    startOffset?: number;
    endOffset?: number;
  };

  const COLORS = ['yellow', 'blue', 'green', 'purple', 'red'] as const;
  type Color = (typeof COLORS)[number];

  const STORAGE_KEY = `s1tk-annotations:${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  let toolbarVisible = $state(false);
  let toolbarX = $state(0);
  let toolbarY = $state(0);
  let noteOpen = $state(false);
  let noteText = $state('');
  let pendingColor = $state<Color>('yellow');
  let pendingRange: Range | null = null;
  let annotations = $state<Annotation[]>([]);

  function uuid() {
    return crypto.randomUUID();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
  }

  function loadAnnotations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) annotations = JSON.parse(raw);
    } catch {}
  }

  function isInvalidTarget(node: Node | null): boolean {
    let el = node instanceof Element ? node : node?.parentElement;
    while (el) {
      const tag = el.tagName?.toLowerCase();
      if (tag === 'code' || tag === 'pre' || tag === 'iframe') return true;
      if (el.classList.contains('note-header')) return true;
      el = el.parentElement;
    }
    return false;
  }

  function applyHighlight(range: Range, color: Color, id: string) {
    const mark = document.createElement('mark');
    mark.className = `hl-${color}`;
    mark.dataset.annId = id;
    try {
      range.surroundContents(mark);
    } catch {
      // Range spans multiple elements — extract and wrap contents
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }
  }

  function highlight(color: Color) {
    if (!pendingRange) return;
    const text = pendingRange.toString().trim();
    if (!text) return;
    const id = uuid();
    applyHighlight(pendingRange, color, id);
    annotations = [...annotations, { id, color, text }];
    save();
    hideToolbar();
  }

  function openNote() {
    noteOpen = true;
    noteText = '';
    toolbarVisible = false;
  }

  function saveNote() {
    if (!pendingRange) return;
    const text = pendingRange.toString().trim();
    if (!text) return;
    const id = uuid();
    applyHighlight(pendingRange, pendingColor, id);
    annotations = [...annotations, { id, color: pendingColor, text, note: noteText }];
    save();
    noteOpen = false;
    noteText = '';
    pendingRange = null;
  }

  function copySelection() {
    if (pendingRange) {
      navigator.clipboard.writeText(pendingRange.toString().trim()).catch(() => {});
    }
    hideToolbar();
  }

  function hideToolbar() {
    toolbarVisible = false;
    pendingRange = null;
  }

  function onSelectionChange() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      toolbarVisible = false;
      return;
    }
    const range = sel.getRangeAt(0);
    const text = range.toString().trim();
    if (!text) { toolbarVisible = false; return; }

    // Must be inside .note-body or .note-article
    const container = range.commonAncestorContainer;
    const article = document.querySelector('.note-body, .note-article');
    if (!article?.contains(container)) { toolbarVisible = false; return; }
    if (isInvalidTarget(container)) { toolbarVisible = false; return; }

    pendingRange = range.cloneRange();
    const rect = range.getBoundingClientRect();
    toolbarX = rect.left + rect.width / 2 + window.scrollX;
    toolbarY = rect.top + window.scrollY - 44;
    toolbarVisible = true;
  }

  onMount(() => {
    loadAnnotations();
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  });
</script>

{#if toolbarVisible}
  <div
    class="ann-toolbar"
    style="left:{toolbarX}px; top:{toolbarY}px"
    onmousedown={(e) => e.preventDefault()}
    role="toolbar"
    aria-label="Annotation toolbar"
  >
    {#each COLORS as color}
      <button
        class="swatch swatch-{color}"
        title="Sorot {color}"
        aria-label="Highlight {color}"
        onclick={() => highlight(color)}
      ></button>
    {/each}
    <button class="ann-btn" title="Tambah catatan" onclick={openNote}>📝</button>
    <button class="ann-btn" title="Salin teks" onclick={copySelection}>📋</button>
  </div>
{/if}

{#if noteOpen}
  <div class="note-overlay" role="dialog" aria-modal="true" aria-label="Tambah catatan">
    <div class="note-popover">
      <p class="note-popover-title">Catatan</p>
      <textarea
        class="note-textarea"
        rows="4"
        placeholder="Tulis catatan Anda..."
        bind:value={noteText}
        autofocus
      ></textarea>
      <div class="note-popover-actions">
        <button class="btn-save-note" onclick={saveNote}>Simpan</button>
        <button class="btn-cancel-note" onclick={() => { noteOpen = false; hideToolbar(); }}>Batal</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .ann-toolbar {
    position: absolute;
    transform: translateX(-50%);
    background: var(--color-ink);
    border-radius: 6px;
    padding: 5px 8px;
    display: flex;
    gap: 6px;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  .ann-toolbar::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-bottom: none;
    border-top-color: var(--color-ink);
  }

  .swatch {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.5);
    cursor: pointer;
    transition: transform 0.1s, border-color 0.1s;
    padding: 0;
  }
  .swatch:hover { transform: scale(1.2); border-color: #fff; }
  .swatch-yellow { background: var(--hl-yellow); }
  .swatch-blue   { background: var(--hl-blue); }
  .swatch-green  { background: var(--hl-green); }
  .swatch-purple { background: var(--hl-purple); }
  .swatch-red    { background: var(--hl-red); }

  .ann-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    line-height: 1;
    opacity: 0.85;
  }
  .ann-btn:hover { opacity: 1; }

  .note-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .note-popover {
    background: var(--color-paper);
    border-radius: var(--radius);
    padding: 1.25rem;
    width: min(380px, 90vw);
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }
  .note-popover-title {
    font-weight: 600;
    margin: 0 0 0.75rem;
  }
  .note-textarea {
    width: 100%;
    font-family: var(--font-body);
    font-size: 0.9rem;
    border: 1px solid var(--color-grid);
    border-radius: var(--radius);
    padding: 0.5rem;
    resize: vertical;
  }
  .note-popover-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 0.75rem;
  }
  .btn-save-note {
    background: var(--color-binder);
    color: #fff;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .btn-cancel-note {
    background: transparent;
    border: 1px solid var(--color-grid);
    padding: 0.4rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
  }
</style>
