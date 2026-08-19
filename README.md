# Startup Company Project

A small web project built with HTML, TypeScript and CSS. This README adds a screenshot placeholder and a small inline animated demo to showcase the UI.

![Uploading image.png…]()


## Animated preview

<img alt="Animated demo" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='360' viewBox='0 0 800 360'><rect width='100%' height='100%' fill='%23020b2f'/><g transform='translate(0,0)'><circle cx='140' cy='180' r='38' fill='%23ff7b7b'><animate attributeName='r' values='22;50;22' dur='1.6s' repeatCount='indefinite'/></circle><rect x='320' y='140' width='260' height='100' rx='12' fill='%2317c3b2'><animate attributeName='x' values='320;340;320' dur='1.9s' repeatCount='indefinite'/></rect><text x='360' y='198' fill='white' font-family='Arial' font-size='22'>Live demo</text></g></svg>" />

> If the animation doesn't render in your environment (some renderers block data URIs), open `assets/demo.svg` in a browser or copy the inline SVG into an `.svg` file.

## What to include (quick)

- Replace `./assets/screenshot.png` with an actual screenshot of your app (PNG or JPG recommended).
- Optional: add `assets/demo.svg` if you prefer a separate demo file instead of the inline data URI.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

## How to add a real screenshot

1. Create an `assets` folder at the repo root if it doesn't exist:

```bash
mkdir -p assets
```

2. Add your screenshot (example):

```bash
cp ~/Downloads/my-screenshot.png assets/screenshot.png
```

3. Commit it and push:

```bash
git add assets/screenshot.png
git commit -m "Add screenshot"
git push
```

4. If you add a PNG, the README already points to `./assets/screenshot.png`. If you use a different name, update the README image path.

## Features

- HTML + TypeScript front-end
- Simple CSS styles

## Tech stack

- TypeScript
- HTML
- CSS

## Contributing

Contributions welcome — open an issue or PR with improvements.

## License

MIT
