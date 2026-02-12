/**
 * To embed your Spotify playlist:
 * 1. Open the playlist in Spotify (desktop or web).
 * 2. Click the "…" menu → Share → Embed playlist.
 * 3. Copy the playlist ID from the embed URL (the part after /playlist/).
 *    Or from a normal link: open.spotify.com/playlist/THIS_PART_IS_THE_ID
 * 4. Paste it below. Leave empty to hide the embed.
 */
const SPOTIFY_PLAYLIST_ID = "7x0zTGBe5n5A8IqKz3NGke";

export function PlaylistSection() {
  return (
    <section
      className="w-full px-4 py-20 mt-12 bg-[#faa141]"
      id="playlist"
    >
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 w-full max-w-[1600px] mx-auto">
        {/* Image — big on left, full width on mobile */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/guffs-playlist.png"
            alt="Guffs Playlist — album cover with vinyl"
            width={680}
            height={680}
            className="w-full h-auto max-w-[420px] lg:max-w-[680px] object-contain"
          />
        </div>

        {/* Playlist content — right column on desktop */}
        <div className="flex-1 w-full min-w-0 lg:pl-8 order-2">
          {SPOTIFY_PLAYLIST_ID ? (
            <div className="rounded-xl overflow-hidden w-full max-w-xl">
              <iframe
                title="Guffs Playlist on Spotify"
                src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            </div>
          ) : (
            <p className="text-[#2a2520] text-sm">
              Add your Spotify playlist ID at the top of <code className="bg-black/20 px-1 rounded">components/PlaylistSection.tsx</code> to embed it here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
