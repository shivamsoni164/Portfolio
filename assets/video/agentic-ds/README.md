# Agentic Design Systems hero video

A muted, autoplay video that plays once and then stops fills the hero slot on `agentic-ds.html`
(the box is 16:9, the same shape as the video, so nothing is cropped).

| File | What it is |
|---|---|
| `hero.mp4` | The video: 1920x1080, 30 fps, H.264, **no audio**, fast-start, about 7 MB. |
| `hero-poster.jpg` | The hero image: shown while the video loads, for reduced-motion visitors, and in place of the video if it can't play. |


Browsers only autoplay **muted** video, so it starts silent. A slim control bar
(over the bottom of the video) lets visitors play/pause, drag the timeline, replay
after it ends. The mute button is hidden because the recording has no sound (remove the `hidden` attribute on `.vc__mute` if you add audio). Pausing sticks; reduced-motion visitors see the poster
until they press play. The icons are drawn in the css.gg style; to use the exact
css.gg SVGs, swap the inline `<svg>`s inside `.vc` in `agentic-ds.html`.

## Compressing a big export

GitHub's web uploader accepts files up to 25 MB (a normal `git push` up to 100 MB),
and a hero should be far smaller than that. This keeps 1280 px wide, strips audio:

```bash
ffmpeg -i input.mov -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart hero.mp4
```

Make the poster from the first frame:

```bash
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```
