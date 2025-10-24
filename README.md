# Azubi-Game-Challenge 2025

### Herausforderung: Das erste Spiel in einem Team erstellen ✨

🎯 **Goal:** Entwickelt gemeinsam ein **Multiplayer-Spiel mit Phaser 3**, das wir an der Weihnachtsfeier zocken können.

---

## 🏆 Anforderungen

- **Technologie:** [Phaser 3](https://phaser.io/) + TypeScript
- **Laufzeit:** Spiel läuft im Browser (Chrome/Edge, Vollbild/Kiosk möglich)
- **Spielidee:** frei wählbar (Winter-/Weihnachtsthema ist ein Bonus 🎅)
- **Spielbar:** Single-Play oder **2 Spieler** (Tastatur oder Gamepads)
- **Scope:** lieber **klein, aber spielbar** als zu groß gedacht und unfertig
- **Deadline:** erste Demo nach **14 Tagen** (zeigt uns, was ihr habt!)

---

## 📚 Tutorials & Lernmaterial

- [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3)
- [Making your first Phaser 3 game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
- [Phaser API Documentation](https://docs.phaser.io/api-documentation/api-documentation)
- [Phaser Examples](https://phaser.io/examples)
- [Helpful idk](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/)
- [phaser-vite-typescript-template](https://github.com/phaserjs/template-vite-ts) (Dieses Template ist Basis für dieses Repository.)
- [MDN – Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)

## 📂 Repo-Aufbau

```sh
/README.md → diese Datei
/package.json → Dependencies (npm/yarn/pnpm)
/public
  /background -> Hintergründe
  /hud -> UI Elemente & Buttons
  /sound -> Musik
  /sprites -> Bilder für Spieler und "Gegner"
/src
  /custom_classes -> Wiederverwendbare Klassen
  /loader -> Loader von Texturen und Sounds
  /scenes -> Game-Scenen
  /thatFolder -> Haupt Ordner für Logik
```


## ⚙️ Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## 💻 Available Commands

| Command               | Description                                                                                              |
|-----------------------|----------------------------------------------------------------------------------------------------------|
| `npm install`         | Install project dependencies                                                                             |
| `npm run dev`         | Launch a development web server                                                                          |
| `npm run build`       | Create a production build in the `dist` folder                                                           |
| `npm run dev-nolog`   | Launch a development web server without sending anonymous data (see "About log.js" below)                |
| `npm run build-nolog` | Create a production build in the `dist` folder without sending anonymous data (see "About log.js" below) |

### Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the Vite documentation if you wish to change this or add SSL support.

Once the server is running, you can edit any of the files in the `src` folder. Vite will automatically recompile your code and then reload the browser.

### Template Project Structure

We have provided a default project structure to get you started. This is as follows:

### Template Project Structure

We have provided a default project structure to get you started:

| Path               | Description                                           |
|--------------------|-------------------------------------------------------|
| `index.html`       | A basic HTML page to contain the game.                |
| `public/assets`    | Game sprites, audio, etc. Served directly at runtime. |
| `public/style.css` | Global layout styles.                                 |
| `src/main.ts`      | Application bootstrap.                                |
| `src/game`         | Folder containing the game code.                      |
| `src/game/main.ts` | Game entry point: configures and starts the game.     |
| `src/game/scenes`  | Folder with all Phaser game scenes.                   | 

### Handling Assets

Vite supports loading assets via JavaScript module `import` statements.

This template provides support for both embedding assets and also loading them from a static folder. To embed an asset, you can import it at the top of the JavaScript file you are using it in:

```js
import logoImg from './assets/logo.png'
```

To load static files such as audio files, videos, etc. place them into the `public/assets` folder. Then you can use this path in the Loader calls within Phaser:

```js
preload() {
  //  This is an example of an imported bundled image.
  //  Remember to import it at the top of this file
  this.load.image('logo', logoImg);

  //  This is an example of loading a static image
  //  from the public/assets folder:
  this.load.image('background', 'assets/bg.png');
}
```

When you issue the `npm run build` command, all static assets are automatically copied to the `dist/assets` folder.

### Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public asset's folder.

To deploy your game, you will need to upload *all* the contents of the `dist` folder to a public-facing web server.

### Customizing the Template

#### Vite

If you want to customize your build, such as adding plugin (i.e., for loading CSS or fonts), you can modify the `vite/config.*.mjs` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json`. Please see the [Vite documentation](https://vitejs.dev/) for more information.

### About log.js

If you inspect our node scripts, you will see there is a file called `log.js`. This file makes a single silent API call to a domain called `gryzor.co`. This domain is owned by Phaser Studio Inc. The domain name is homage to one of our favorite retro games.

We send the following 3 pieces of data to this API: The name of the template being used (vue, react, etc.). If the build was 'dev' or 'prod' and finally the version of Phaser being used.

At no point is any personal data collected or sent. We don't know about your project files, device, browser or anything else. Feel free to inspect the `log.js` file to confirm this.

Why do we do this? Because being open source means we have no visible metrics about which of our templates are being used. We work hard to maintain a large and diverse set of templates for Phaser developers, and this is our small anonymous way to determine if that work is actually paying off, or not. In short, it helps us ensure we're building the tools for you.

However, if you don't want to send any data, you can use these commands instead:

Dev:

```bash
npm run dev-nolog
```

Build:

```bash
npm run build-nolog
```

Or, to disable the log entirely, delete the file `log.js` and remove the call to it in the `scripts` section of `package.json`:

Before:

```json
"scripts": {
"dev": "node log.js dev & dev-template-script",
"build": "node log.js build & build-template-script"
},
```

After:

```json
"scripts": {
"dev": "dev-template-script",
"build": "build-template-script"
},
```

Either of these will stop `log.js` from running. If you do decide to do this, please could you at least join our Discord and tell us which template you're using! Or send us a quick email. Either will be super-helpful, thank you.

## License

The Phaser logo and characters are &copy; 2011 - 2025 Phaser Studio Inc. All rights reserved.

[MIT License](LICENSE)

