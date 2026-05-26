<script lang="ts">
  import { onMount } from 'svelte';

  let { url, title, caption = '', height = 480, pending = false } = $props<{
    url: string;
    title: string;
    caption?: string;
    height?: number;
    pending?: boolean;
  }>();

  let loaded = $state(false);
  let dismissed = $state(false);
  let cardEl: HTMLDivElement | undefined = $state();

  function load() {
    loaded = true;
  }

  onMount(() => {
    if (!pending && cardEl) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            load();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(cardEl);
      return () => observer.disconnect();
    }
  });
</script>

<figure class="circuit-sim">
  {#if pending}
    <div class="circuit-placeholder circuit-pending">
      <span class="circuit-icon">⚗️</span>
      <p class="circuit-title">{title}</p>
      <p class="circuit-pending-text">Simulasi sedang disiapkan oleh tim dosen.</p>
    </div>
  {:else if !loaded}
    <div class="circuit-placeholder" bind:this={cardEl}>
      <span class="circuit-icon">🔌</span>
      <p class="circuit-title">{title}</p>
      {#if caption}
        <p class="circuit-caption-preview">{caption}</p>
      {/if}
      <div class="circuit-actions">
        <button class="btn-load" onclick={load}>▶ Muat Simulasi</button>
        <a class="btn-external" href={url} target="_blank" rel="noopener noreferrer">↗ Buka di tab baru</a>
      </div>
    </div>
  {:else}
    <div class="circuit-frame-wrap" style="height:{height}px">
      <iframe
        src={url}
        {title}
        width="100%"
        {height}
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
      ></iframe>
      {#if !dismissed}
        <div class="circuit-banner" role="alert">
          <span>Klik komponen di dalam simulator untuk mengubah nilai.</span>
          <button class="btn-dismiss" onclick={() => dismissed = true} aria-label="Tutup">✕</button>
        </div>
      {/if}
    </div>
  {/if}
  {#if caption && (loaded || pending)}
    <figcaption class="circuit-figcaption">{caption}</figcaption>
  {/if}
</figure>

<style>
  .circuit-sim {
    margin: 1.5rem 0;
    border: 2px dashed var(--color-grid);
    border-radius: var(--radius);
    background: #fff;
    overflow: hidden;
  }

  .circuit-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    text-align: center;
    min-height: 200px;
    background:
      linear-gradient(var(--color-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--color-grid) 1px, transparent 1px);
    background-size: 24px 24px;
    background-color: #f8fcff;
  }

  .circuit-pending {
    border-style: dashed;
    opacity: 0.8;
  }

  .circuit-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .circuit-title {
    font-weight: 600;
    font-size: 1rem;
    margin: 0 0 0.5rem;
    color: var(--color-ink);
    max-width: 480px;
  }

  .circuit-pending-text {
    color: var(--color-ink-muted);
    font-style: italic;
    margin: 0;
    font-size: 0.9rem;
  }

  .circuit-caption-preview {
    color: var(--color-ink-muted);
    font-size: 0.85rem;
    margin: 0 0 1rem;
    max-width: 480px;
  }

  .circuit-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .btn-load {
    background: var(--color-binder);
    color: #fff;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-load:hover { background: #162d4a; }

  .btn-external {
    color: var(--color-binder);
    font-size: 0.85rem;
    text-decoration: none;
  }
  .btn-external:hover { text-decoration: underline; }

  .circuit-frame-wrap {
    position: relative;
  }

  iframe {
    display: block;
    border: none;
    width: 100%;
  }

  @media (max-width: 768px) {
    iframe { min-height: 320px; overflow-x: scroll; }
    .circuit-frame-wrap { overflow-x: auto; }
  }

  .circuit-banner {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(30, 58, 95, 0.9);
    color: #fff;
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-dismiss {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0;
    line-height: 1;
    opacity: 0.7;
  }
  .btn-dismiss:hover { opacity: 1; }

  .circuit-figcaption {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    color: var(--color-ink-muted);
    font-style: italic;
    border-top: 1px solid var(--color-grid);
    background: #fafafa;
  }
</style>
