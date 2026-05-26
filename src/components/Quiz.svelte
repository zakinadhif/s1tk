<script lang="ts">
  let {
    question,
    options,
    correctIndex,
    explanation,
  } = $props<{
    question: string;
    options: string[];
    correctIndex: number | number[];
    explanation: string;
  }>();

  let selected = $state<number[]>([]);
  let submitted = $state(false);

  const correctSet = new Set(Array.isArray(correctIndex) ? correctIndex : [correctIndex]);
  const isMulti = Array.isArray(correctIndex) && (correctIndex as number[]).length > 1;

  function toggle(i: number) {
    if (submitted) return;
    if (isMulti) {
      selected = selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i];
    } else {
      selected = [i];
    }
  }

  function submit() {
    if (selected.length === 0) return;
    submitted = true;
  }

  function reset() {
    selected = [];
    submitted = false;
  }

  function optionStatus(i: number): 'default' | 'correct' | 'wrong' | 'missed' {
    if (!submitted) return 'default';
    if (correctSet.has(i) && selected.includes(i)) return 'correct';
    if (!correctSet.has(i) && selected.includes(i)) return 'wrong';
    if (correctSet.has(i) && !selected.includes(i)) return 'missed';
    return 'default';
  }
</script>

<div class="quiz">
  <p class="quiz-question">{question}</p>
  {#if isMulti}
    <p class="quiz-hint">Pilih semua jawaban yang benar.</p>
  {/if}
  <ul class="quiz-options" role="listbox" aria-multiselectable={isMulti}>
    {#each options as opt, i}
      <li>
        <button
          class="quiz-option"
          class:selected={selected.includes(i)}
          class:correct={optionStatus(i) === 'correct'}
          class:wrong={optionStatus(i) === 'wrong'}
          class:missed={optionStatus(i) === 'missed'}
          disabled={submitted}
          onclick={() => toggle(i)}
          role="option"
          aria-selected={selected.includes(i)}
        >
          <span class="opt-indicator">
            {#if optionStatus(i) === 'correct'}✓
            {:else if optionStatus(i) === 'wrong'}✗
            {:else if optionStatus(i) === 'missed'}○
            {:else}{String.fromCharCode(65 + i)}{/if}
          </span>
          <span class="opt-text">{opt}</span>
        </button>
      </li>
    {/each}
  </ul>

  {#if !submitted}
    <button class="btn-submit" disabled={selected.length === 0} onclick={submit}>
      Periksa Jawaban
    </button>
  {:else}
    <div class="quiz-explanation callout callout-tip">
      <p class="callout-title">Penjelasan</p>
      <p>{explanation}</p>
    </div>
    <button class="btn-retry" onclick={reset}>Coba Lagi</button>
  {/if}
</div>

<style>
  .quiz {
    background: #fff;
    border: 1px solid var(--color-grid);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
    margin: 1.5rem 0;
  }
  .quiz-question {
    font-weight: 600;
    font-size: 1rem;
    margin: 0 0 0.75rem;
  }
  .quiz-hint {
    font-size: 0.8rem;
    color: var(--color-ink-muted);
    font-style: italic;
    margin: 0 0 0.5rem;
  }
  .quiz-options {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .quiz-option {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    width: 100%;
    text-align: left;
    background: hsl(220 15% 97%);
    border: 2px solid transparent;
    border-radius: var(--radius);
    padding: 0.6rem 0.75rem;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
    font-size: 0.9rem;
    font-family: var(--font-body);
    color: var(--color-ink);
  }
  .quiz-option:hover:not(:disabled) { background: hsl(215 60% 94%); }
  .quiz-option.selected { border-color: var(--color-binder); background: hsl(215 80% 94%); }
  .quiz-option.correct  { border-color: var(--callout-tip);     background: hsl(145 45% 92%); }
  .quiz-option.wrong    { border-color: var(--callout-danger);   background: hsl(0   70% 94%); }
  .quiz-option.missed   { border-color: var(--callout-warning);  background: hsl(38  90% 94%); }
  .quiz-option:disabled { cursor: default; }

  .opt-indicator {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    min-width: 1.2em;
    line-height: 1.4;
  }
  .opt-text { flex: 1; line-height: 1.4; }

  .btn-submit {
    background: var(--color-binder);
    color: #fff;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-submit:disabled { opacity: 0.45; cursor: default; }

  .quiz-explanation { margin-top: 0.75rem; }

  .btn-retry {
    margin-top: 0.75rem;
    background: transparent;
    border: 1px solid var(--color-grid);
    padding: 0.4rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-ink-muted);
  }
  .btn-retry:hover { border-color: var(--color-binder); color: var(--color-binder); }
</style>
