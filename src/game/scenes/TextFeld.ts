import { Scene } from 'phaser';

export class TextFeld extends Scene {
  constructor() {
    super('TextFeld');
  }
  create() {
    // Prompt abfragen
    const kuerzel = prompt("Gib bitte deinen Kürzel ein, wenn du deinen Score speichern möchtest");

    // Prüfen, ob etwas eingegeben wurde
    if (kuerzel && kuerzel.trim() !== "") {
      // Score speichern
      localStorage.setItem("playerKuerzel", kuerzel);
      this.add.text(100, 100, "Dein Score wird abgespeichert!", { fontSize: '20px', color: '#fff' });
    } else {
      // Kein Score speichern
      this.add.text(100, 100, "Dein Score wird nicht abgespeichert!", { fontSize: '20px', color: '#f00' });
    }
  }

}

