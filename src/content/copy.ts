/**
 * Alle sichtbaren deutschen Texte an einem Ort (Listen mit Wiederholstruktur
 * wie Weine, Wachstums-/Verarbeitungsschritte und die Familien-Chronik liegen
 * in data/*.ts). Tonalitaet: ruhig, konkret, handwerklich. Keine
 * Marketing-Floskeln, keine Gedankenstriche.
 *
 * Fuer ein anderes Weingut: diese Datei plus data/*.ts, die drei Quellvideos
 * und die sechs Platzhalterbilder ersetzen, der Rest der Seite bleibt stehen.
 */

import { withBase } from "../lib/publicUrl";

export const brand = {
  name: "Weingut Ehrlich",
  short: "Weingut Ehrlich",
  region: "Kaiserstuhl, Baden",
};

export const nav = {
  links: [
    { label: "Weine", href: "#weine" },
    { label: "Terroir", href: "#terroir" },
    { label: "Familie", href: "#familie" },
    { label: "Besuch", href: "#besuch" },
  ],
  cta: "Verkostung buchen",
};

export const hero = {
  eyebrow: "Weingut seit 1928",
  title: "Vier Generationen, ein Boden am Kaiserstuhl",
  body: "Seit fast hundert Jahren bewirtschaftet die Familie Ehrlich dieselben Steillagen am Kaiserstuhl, mit Handlese und Geduld statt Größe.",
  primary: { label: "Verkostung buchen", href: "#besuch" },
  secondary: { label: "Unsere Weine", href: "#weine" },
  scrollHint: "Scrollen",
};

// ScrollProcess "Wachstum" (vine-growth.mp4, drei Schritte aus data/growthSteps.ts)
export const growth = {
  eyebrow: "Vom Rebschnitt zur Lese",
  heading: "Ein Jahr im Weinberg",
};

export const wineCollection = {
  eyebrow: "Die Kollektion",
  title: "Vier Weine, eine Handschrift",
  intro:
    "Wir erzeugen kleine Mengen aus eigenen Lagen, jede Flasche laesst sich bis zum Weinberg zurueckverfolgen.",
};

// ScrollProcess "Verarbeitung" (wine-process.mp4, vier Schritte aus data/processSteps.ts)
export const process = {
  heading: "Von der Traube zur Flasche",
};

export const terroir = {
  title: "Vulkanischer Fels, steile Lagen",
  paragraphs: [
    "Der Kaiserstuhl ist ein erloschener Vulkan. Auf dem Gestein liegt eine dicke Schicht Löss, die unseren Weinen ihre Mineralik gibt und im Sommer die Wärme des Tages speichert.",
    "Manche unserer Lagen haben eine Hangneigung von über vierzig Prozent. Maschinen kommen dort nicht hin, jeder Handgriff im Weinberg passiert zu Fuß.",
    "Seit 2015 bewirtschaften wir den gesamten Betrieb biologisch. Bewässert wird nicht: Die Reben sollen lernen, ihre Wurzeln so tief zu schicken, wie sie es brauchen.",
  ],
  image: {
    src: withBase("/media/terroir.jpg"),
    alt: "Botanische Illustration eines Querschnitts durch den vulkanischen Lössboden einer Steillage am Kaiserstuhl",
    placeholderLabel: "Terroir",
    aspectClass: "aspect-[4/3]",
  },
};

export const family = {
  title: "Vier Generationen, ein Familienname",
  intro:
    "Von der Reblauskrise bis zur Bio-Zertifizierung: was gleich geblieben ist, ist der Nachname auf dem Etikett.",
  quote: {
    text: "Ich habe nie vorgehabt, alles anders zu machen. Nur genauer hinzusehen, wo wir täglich hintreten.",
    name: "Lena Ehrlich",
    role: "Vierte Generation",
  },
  image: {
    src: withBase("/media/family.jpg"),
    alt: "Botanische Illustration des Gutshauses und der Weinberge von Weingut Ehrlich",
    placeholderLabel: "Familie",
    aspectClass: "aspect-[4/3]",
  },
};

// Verkostung/Hofladen und allgemeine Fragen in einem Abschnitt und einem
// Formular: Wunschtermin und Personenzahl sind optional (nur fuer eine
// Verkostungsanfrage relevant), Name/E-Mail/Nachricht sind fuer beide
// Anliegen die einzigen Pflichtfelder.
export const visit = {
  title: "Besuch und Kontakt",
  intro:
    "Verkostungen sind nach Vereinbarung, der Hofladen hat feste Öffnungszeiten. Ob Terminwunsch, größere Bestellung oder Frage zu einem Jahrgang: Schreiben Sie uns kurz, wir antworten innerhalb von zwei Werktagen.",
  hours: [
    { days: "Montag bis Freitag", time: "9:00 bis 18:00 Uhr" },
    { days: "Samstag", time: "10:00 bis 14:00 Uhr" },
    { days: "Sonntag", time: "geschlossen" },
  ],
  anfahrt:
    "Wir liegen in Achkarren, einem Ortsteil von Vogtsburg im Kaiserstuhl, direkt an der Weinstraße zwischen Oberrotweil und Bickensohl.",
  form: {
    fields: {
      name: "Name",
      email: "E-Mail",
      date: "Wunschtermin (optional)",
      people: "Personenzahl (optional, für Verkostungen)",
      peoplePrompt: "Bitte wählen",
      message: "Ihre Nachricht",
      messagePlaceholder: "Worum geht es? Verkostungswunsch, Bestellung, Frage zu einem Wein ...",
    },
    peopleOptions: [
      "1 bis 2 Personen",
      "3 bis 5 Personen",
      "6 bis 10 Personen",
      "Mehr als 10 Personen",
    ],
    submit: "Anfrage senden",
    privacyNote:
      "Ihre Angaben nutzen wir ausschließlich zur Bearbeitung Ihrer Anfrage. Details finden Sie in der Datenschutzerklärung.",
    successTitle: "Vielen Dank",
    successBody:
      "Ihre Anfrage ist bei uns eingegangen. Bei einem Verkostungswunsch melden wir uns innerhalb von zwei Werktagen mit einem Terminvorschlag, bei allgemeinen Fragen ebenso schnell. Hinweis: Dieses Formular ist eine Demonstration und versendet noch keine echten Nachrichten.",
    errors: {
      name: "Bitte geben Sie Ihren Namen an.",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      message: "Bitte schreiben Sie uns kurz, worum es geht.",
    },
  },
};

export const awards = {
  title: "Auszeichnungen",
  items: [
    { source: "Gault&Millau", detail: "3 von 5 Trauben für das aktuelle Sortiment" },
    { source: "Falstaff", detail: "93 Punkte für den Spätburgunder Reserve 2022" },
    { source: "Regionale Anerkennung", detail: "Anerkanntes Prädikatsweingut am Kaiserstuhl" },
  ],
};

export const footer = {
  tagline: "Familienweingut am Kaiserstuhl. Seit 1928.",
  address: {
    lines: ["Winzerweg 8", "79235 Vogtsburg im Kaiserstuhl", "Achkarren, Baden"],
    phone: "+49 7662 000000",
    email: "hof@weingut-ehrlich.de",
  },
  impressum: {
    title: "Impressum",
    body: [
      "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).",
      "Weingut Ehrlich GmbH",
      "Winzerweg 8, 79235 Vogtsburg im Kaiserstuhl",
      "Vertreten durch: Familie Ehrlich",
      "Telefon: +49 7662 000000",
      "E-Mail: hof@weingut-ehrlich.de",
      "Registergericht: Amtsgericht Freiburg, HRB 00000",
      "Umsatzsteuer-ID: DE000000000",
      "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: Familie Ehrlich, Anschrift wie oben.",
    ],
  },
  datenschutz: {
    title: "Datenschutz",
    body: [
      "Der Schutz Ihrer Daten ist uns wichtig. Diese Erklärung fasst zusammen, wie wir mit Ihren Angaben umgehen.",
      "Verantwortliche Stelle ist die Weingut Ehrlich GmbH, Winzerweg 8, 79235 Vogtsburg im Kaiserstuhl.",
      "Wenn Sie ein Kontakt- oder Verkostungsformular nutzen, verarbeiten wir die eingegebenen Daten ausschließlich zur Bearbeitung Ihrer Anfrage und für mögliche Anschlussfragen. Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO.",
      "Ihre Daten geben wir nicht an Dritte weiter und löschen sie, sobald der Zweck entfällt und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.",
      "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie das Recht auf Datenübertragbarkeit. Wenden Sie sich dazu an die oben genannte Adresse.",
      "Diese Website bindet Schriftarten lokal ein und lädt keine Schriften von externen Anbietern nach.",
    ],
  },
  altersnachweis:
    "Alkoholische Getränke werden bei uns ausschließlich an Personen ab 18 Jahren abgegeben. Mit der Bestellung oder dem Besuch des Hofladens bestätigen Sie, dass Sie das gesetzliche Mindestalter erreicht haben.",
  copyright: "Weingut Ehrlich GmbH",
  legalLinks: {
    impressum: "Impressum",
    datenschutz: "Datenschutz",
  },
};
