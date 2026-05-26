<script lang="ts">
  import { onMount } from 'svelte';

  type SectionEntry = { id: string; start: number; end: number };
  let { sectionMap = [] } = $props<{ sectionMap?: SectionEntry[] }>();

  let articleEl: HTMLDivElement | undefined = $state();
  let currentSectionId = $state<string | null>(null);
  let userScrolled = $state(false);
  let scrollTimer: ReturnType<typeof setTimeout>;

  function findSection(seconds: number): string | null {
    for (const s of sectionMap) {
      if (seconds >= s.start && seconds < s.end) return s.id;
    }
    return null;
  }

  function highlightSection(id: string | null) {
    if (!articleEl) return;
    articleEl.querySelectorAll('.video-highlight').forEach(el => el.classList.remove('video-highlight'));
    if (!id) return;
    const target = articleEl.querySelector(`#${CSS.escape(id)}`);
    if (target) {
      target.classList.add('video-highlight');
      if (!userScrolled) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function handleTimeUpdate(e: Event) {
    const { seconds } = (e as CustomEvent<{ seconds: number }>).detail;
    const id = findSection(seconds);
    if (id !== currentSectionId) {
      currentSectionId = id;
      highlightSection(id);
    }
  }

  function handleUserScroll() {
    userScrolled = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { userScrolled = false; }, 3000);
  }

  onMount(() => {
    window.addEventListener('videotimeupdate', handleTimeUpdate);
    window.addEventListener('scroll', handleUserScroll, { passive: true });

    // Wire up timestamp anchors
    if (articleEl) {
      articleEl.addEventListener('click', (e) => {
        const anchor = (e.target as Element).closest('a.ts-anchor');
        if (!anchor) return;
        e.preventDefault();
        const seconds = Number((anchor as HTMLAnchorElement).dataset.seconds);
        if (!isNaN(seconds)) {
          window.dispatchEvent(new CustomEvent('videoseek', { detail: { seconds } }));
        }
      });
    }

    return () => {
      window.removeEventListener('videotimeupdate', handleTimeUpdate);
      window.removeEventListener('scroll', handleUserScroll);
    };
  });
</script>

<div class="video-sync-article" bind:this={articleEl}>
  <slot />
  {#if userScrolled}
    <button
      class="follow-video-btn"
      onclick={() => { userScrolled = false; highlightSection(currentSectionId); }}
    >
      ▶ Ikuti Video Lagi
    </button>
  {/if}
</div>

<style>
  .video-sync-article { position: relative; line-height: 1.75; }
  .follow-video-btn {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    background: var(--color-binder);
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 100;
    transition: background 0.15s;
  }
  .follow-video-btn:hover { background: #162d4a; }
</style>
