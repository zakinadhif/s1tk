<script lang="ts">
  import { onMount } from 'svelte';

  let { videoId } = $props<{ videoId: string }>();

  let playerEl: HTMLDivElement | undefined = $state();
  let player: YT.Player | null = null;

  declare global {
    interface Window {
      onYouTubeIframeAPIReady?: () => void;
      YT: typeof YT;
    }
  }

  function dispatchTimeUpdate(seconds: number) {
    window.dispatchEvent(new CustomEvent('videotimeupdate', { detail: { seconds } }));
  }

  onMount(() => {
    if (!videoId) return;

    function initPlayer() {
      if (!playerEl) return;
      player = new window.YT.Player(playerEl, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            setInterval(() => {
              if (player && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
                dispatchTimeUpdate(player.getCurrentTime());
              }
            }, 500);
          },
        },
      });
    }

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    // Listen for seek events from timestamp anchors
    function handleSeek(e: Event) {
      const detail = (e as CustomEvent<{ seconds: number }>).detail;
      player?.seekTo(detail.seconds, true);
      player?.playVideo();
    }
    window.addEventListener('videoseek', handleSeek);
    return () => window.removeEventListener('videoseek', handleSeek);
  });
</script>

<div class="video-sidebar">
  <p class="video-sidebar-label">Video Kuliah</p>
  {#if videoId}
    <div class="video-player-wrap">
      <div bind:this={playerEl}></div>
    </div>
  {:else}
    <p class="no-video">Video belum tersedia untuk materi ini.</p>
  {/if}
</div>

<style>
  .video-sidebar { width: 100%; }
  .video-sidebar-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-ink-muted);
    margin: 0 0 0.5rem;
    font-family: var(--font-mono);
  }
  .video-player-wrap {
    position: relative;
    padding-top: 56.25%;
    background: #000;
    border-radius: var(--radius);
    overflow: hidden;
  }
  .video-player-wrap :global(iframe),
  .video-player-wrap > div {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .no-video { color: var(--color-ink-muted); font-size: 0.875rem; font-style: italic; }
</style>
