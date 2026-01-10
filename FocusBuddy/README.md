# Projektdokumentation – FocusBuddy

## Inhaltsverzeichnis

1. [Einordnung & Zielsetzung](#1-einordnung--zielsetzung)
2. [Zielgruppe & Stakeholder](#2-zielgruppe--stakeholder)
3. [Anforderungen & Umfang](#3-anforderungen--umfang)
4. [Vorgehen & Artefakte](#4-vorgehen--artefakte)
    - [Understand & Define](#41-understand--define)
    - [Sketch](#42-sketch)
    - [Decide](#43-decide)
    - [Prototype](#44-prototype)
    - [Validate](#45-validate)
5. [Erweiterungen [Optional]](#5-erweiterungen-optional)
6. [Projektorganisation [Optional]](#6-projektorganisation-optional)
7. [KI‑Deklaration](#7-ki‑deklaration)
8. [Anhang [Optional]](#8-anhang-optional)

---

## 1. Einordnung & Zielsetzung

- **Kontext & Problem:** Viele Studierende und Lernende haben Schwierigkeiten, ihre Lernzeit effektiv zu organisieren und den Überblick über erledigte Aufgaben zu behalten. Es fehlt oft eine zentrale Anlaufstelle, die Zeiterfassung, Aufgabenverwaltung und bewährte Lernmethoden vereint.

- **Ziele:** 
  - Eine benutzerfreundliche Webanwendung entwickeln, die Lernende bei der Organisation ihrer Lernzeit unterstützt
  - Zeiterfassung mittels Timer (Stopuhr und Countdown) ermöglichen
  - Integration bewährter Lernmethoden wie Pomodoro-Technik anbieten
  - Übersicht über absolvierte Lernaktivitäten mit Visualisierungen bereitstellen
  - To-Do-Verwaltung für die Planung von Aufgaben integrieren

- **Abgrenzung:** FocusBuddy ist kein vollständiges Lernmanagementsystem. Funktionen wie Kursplanung, Gruppenarbeit oder Notenerfassung sind nicht Teil des Projekts. Der Fokus liegt auf der individuellen Zeiterfassung und Selbstorganisation.

---

## 2. Zielgruppe & Stakeholder

- **Primäre Zielgruppe:** Studierende und Lernende, die ihre Lernzeit besser strukturieren und dokumentieren möchten. Personen, die von strukturierten Lernmethoden profitieren und einen Überblick über ihre investierte Zeit behalten wollen.

- **Weitere Stakeholder:** 
  - Dozenten, die Interesse an Tools zur Förderung selbstgesteuertes Lernen haben
  - Bildungseinrichtungen, die solche Tools empfehlen könnten

- **Annahmen:**
  - Nutzende sind mit grundlegenden Webapplikationen vertraut
  - Der Zugang erfolgt primär über Desktop-Browser
  - Nutzende haben Interesse daran, ihre Lerngewohnheiten zu verbessern

---

## 3. Anforderungen & Umfang

- **Kernfunktionalität (Mindestumfang):**
  1. **Timer-Funktion:** Stopuhr- und Timer-Modus zur Zeiterfassung mit Unterstützung verschiedener Lernmethoden
  2. **Aktivitäten-Übersicht:** Liste aller erfassten Lernsessions mit Bearbeitungs- und Löschfunktion sowie Diagramm-Visualisierung
  3. **Lernmethoden:** Darstellung verschiedener Lernmethoden (z.B. Pomodoro) mit direkter Anwendung im Timer
  4. **To-Do-Liste:** Erstellung, Bearbeitung und Priorisierung von Aufgaben
  5. **Benutzerverwaltung:** Registrierung, Anmeldung, Profilverwaltung und Passwortänderung

- **Akzeptanzkriterien:**
  - Nutzende können sich registrieren und anmelden
  - Der Timer kann gestartet, pausiert und beendet werden
  - Nach Beenden einer Session wird die Aktivität gespeichert, wenn der User angemeldet ist
  - Aktivitäten können in Listen- und Diagrammansicht angezeigt werden
  - To-Dos können erstellt, bearbeitet, als erledigt markiert und gelöscht werden
  - Lernmethoden werden angezeigt und können im Timer angewendet werden

- **Erweiterungen:** 
  - Tagebuch-Funktion (in Entwicklung)
  - Tag-System hinzufügen für Aktivitäten zur besseren Kategorisierung

---

## 4. Vorgehen & Artefakte

### 4.1 Understand & Define

- **Ausgangslage & Ziele:** Ausgangspunkt war die Beobachtung, dass viele Lernende Schwierigkeiten haben, ihre Zeit effektiv einzuteilen. Ziel war es, ein Tool zu entwickeln, das den Einstieg in strukturiertes Lernen erleichtert.

- **Zielgruppenverständnis:** Durch Gespräche mit Mitstudierenden wurden häufige Probleme identifiziert: fehlende Übersicht über die investierte Zeit, Schwierigkeiten bei der Anwendung von Lernmethoden und mangelnde Motivation durch fehlende Fortschrittsvisualisierung.

- **Wesentliche Erkenntnisse:**
  - Ein einfacher Timer reicht nicht aus – die Verbindung mit Lernmethoden schafft Mehrwert
  - Visualisierungen der investierten Zeit motivieren
  - Die Anwendung muss unkompliziert sein, damit sie tatsächlich genutzt wird

### 4.2 Sketch

- **Variantenüberblick:** Es wurden mehrere Designvarianten exploriert:
  1. Minimalistischer Ansatz: Nur Timer und Aktivitätsliste
  2. Dashboard-Ansatz: Zentrale Übersicht mit allen Funktionen auf einer Seite
  3. Modularer Ansatz: Separate Seiten für verschiedene Funktionen (gewählt)

- **Skizzen:** Die Skizzen zeigten verschiedene Layouts für die Navigation, Timer-Darstellung und Aktivitätsübersicht. Der modulare Ansatz wurde aufgrund besserer Übersichtlichkeit gewählt.

### 4.3 Decide

- **Gewählte Variante & Begründung:** Der modulare Ansatz mit separaten Seiten wurde gewählt, da:
  - Jede Funktion übersichtlich dargestellt werden kann
  - Die Navigation intuitiv über eine Navbar erfolgt
  - Die Anwendung leicht erweiterbar bleibt

- **End-to-End-Ablauf:** 
  1. Nutzer registriert sich oder meldet sich an
  2. Wählt im Timer eine Lernmethode oder startet direkt
  3. Arbeitet mit laufendem Timer
  4. Beendet die Session und speichert sie mit Titel, Beschreibung und Tags
  5. Kann die Aktivität später in der Übersicht einsehen oder bearbeiten
  6. Parallel können To-Dos für Aufgabenplanung genutzt werden

- **Referenz-Mockup:** https://www.figma.com/make/bguM1cka3tfFTwUhDsliWN/FocusBuddy-App-Development

  **Test-Zugangsdaten:**
  - E-Mail: `admin@admin.ch`
  - Passwort: `admin`

### 4.4 Prototype

- **Kernfunktionalität:** Vollständig implementierter Timer mit Stopuhr/Countdown, Aktivitätsverwaltung mit CRUD-Operationen und Diagrammen, Lernmethoden-Katalog, To-Do-Liste und Benutzerverwaltung.

- **Deployment:** Die Anwendung ist auf Netlify gehostet: https://focusbuddy67.netlify.app

  **Test-Zugangsdaten (mit vorausgefüllten Daten):**
  - E-Mail: `test@focusbuddy.ch`
  - Passwort: `test123`
  
  *Dieser Account enthält bereits Beispiel-Aktivitäten und To-Dos zum Testen.*


#### 4.4.1. Entwurf (Design)

- **Informationsarchitektur:**
  - **Timer** (Startseite): Zentrale Zeiterfassung
  - **Aktivitäten:** Übersicht vergangener Sessions
  - **Lernmethoden:** Katalog mit Beschreibungen
  - **Tagebuch:** Geplante Reflexionsfunktion
  - **To-Do:** Aufgabenverwaltung
  - **Profil:** Kontoeinstellungen

- **Oberflächenentwürfe:** 
  - Dunkle Navbar für einheitliche Navigation
  - Helle Card-basierte Inhalte für gute Lesbarkeit
  - Konsistente Bootstrap-Komponenten
  - Icons zur visuellen Orientierung (Bootstrap Icons)

- **Designentscheidungen:**
  - Bootstrap 5 für konsistentes, responsives Design
  - Dunkle Navbar mit hellem Content-Bereich für Kontrast
  - Modal-Dialoge für Formulare (neuer To-Do, Session speichern)
  - Toast-Benachrichtigungen für Feedback

#### 4.4.2. Umsetzung (Technik)

- **Technologie-Stack:**
  - **Framework:** SvelteKit
  - **Styling:** Bootstrap 5.3.8 (CDN), Bootstrap Icons 1.11.3
  - **Datenbank:** MongoDB (Cloud-Hosting)
  - **Visualisierung:** Chart.js für Diagramme
  - **Deployment:** Netlify

- **Tooling:**
  - Visual Studio Code als IDE
  - Vite als Build-Tool und Dev-Server
  - npm für Paketmanagement
  - Git für Versionskontrolle

- **Struktur & Komponenten:**
  ```
  src/
  ├── lib/
  │   ├── db.js              # Datenbankzugriff (MongoDB)
  │   ├── assets/            # Statische Assets
  │   └── components/        # Wiederverwendbare Komponenten
  ├── routes/
  │   ├── +layout.svelte     # Hauptlayout mit Navbar
  │   ├── style.css          # Globale Styles
  │   ├── timer/             # Timer-Seite
  │   ├── activities/        # Aktivitäten-Übersicht
  │   ├── lernmethoden/      # Lernmethoden-Katalog
  │   ├── tagebuch/          # Tagebuch (WIP)
  │   ├── to-do/             # To-Do-Liste
  │   ├── profil/            # Profilseite
  │   ├── login/             # Anmeldeseite
  │   ├── register/          # Registrierungsseite
  │   └── logout/            # Logout-Endpunkt
  ```

- **Daten & Schnittstellen:**
  - MongoDB Collections: `users`, `todos`, `activities`, `learningMethods`, `tags`, `(habits)`, `(journalEntries)`
    - *Collections in Klammern existieren in der Datenbank, werden aber in diesem Projekt noch nicht verwendet*
  - Authentifizierung über Cookies (Session-basiert)
  - Passwort-Hashing mit Node.js crypto (scryptSync)
  - SvelteKit Form Actions für serverseitige Verarbeitung

- **Besondere Entscheidungen:**
  - CDN für Bootstrap statt lokaler Installation (schnelleres Setup, einfachere Updates)
  - Chart.js client-seitig für Diagramme, um Server-Last zu reduzieren

### 4.5 Validate

- **URL der getesteten Version:** https://focusbuddy67.netlify.app/timer

- **Ziele der Prüfung:**
  - Kann ein neuer Nutzer sich problemlos registrieren und anmelden?
  - Ist der Timer-Workflow intuitiv verständlich?
  - Werden Aktivitäten korrekt gespeichert und angezeigt?

- **Vorgehen:** Moderierte Usability-Tests mit Think-Aloud-Methode, durchgeführt in der Fachhochscule und zuhause per Demo

- **Stichprobe:** 4 Teilnehmende (3 Studierende, 1 Berufstätige (Schwester)), Alter 21-26 Jahre

- **Aufgaben/Szenarien:**
  1. "Registrieren Sie sich mit einer E-Mail-Adresse und melden Sie sich an."
  2. "Starten Sie einen Timer für 25 Minuten mit der Pomodoro-Methode."
  3. "Beenden Sie die Session und speichern Sie sie mit einem passenden Titel, Tags und Beschreibung."
  4. "Erstellen Sie eine neue Aufgabe in der To-Do-Liste."
  5. "Schauen Sie sich Ihre Aktivitäten an und bearbeite diese."
  6. "Lösche die Aktivität und logge dich aus."

- **Kennzahlen & Beobachtungen:**
  | Aufgabe               | Anmerkungen (Beobachtung)                                                                   |
  |-----------------------|---------------------------------------------------------------------------------------------|
  | Registrierung/Login   | Reibungslos, Formular klar verständlich                                                     |
  | Timer starten         | 1 Person verstand nicht ganz wie die lernmethode funktionieren                              |
  | Session speichern     | Modal wurde als übersichtlich empfunden, jedoch gab es keine Benachritigung beim Speichern. |
  | To-Do erstellen       | Keine Probleme                                                                              |
  | Diagramm-Ansicht      | Button "Diagramme" wurde übersehen                                                          |

- **Zusammenfassung der Resultate:**
  Die Grundfunktionen (Login, To-Do, Session speichern) funktionierten insgesamt gut und wurden als intuitiv wahrgenommen. Es traten keine grundlegenden Bedienprobleme auf; jedoch wurden einige Bugs und Inkonsistenzen festgestellt: Lernmethoden funktionierten teilweise nicht wie erwartet; beim Wechsel der Lernmethode wurde der Timer nicht zurückgesetzt und zeigte weiterhin die vorherige Minute; nach dem Speichern einer Session fehlte eine Bestätigung/Benachrichtigung. Beim Design gab es Uneinheiten: Bootstrap-Icons wurden nicht durchgehend verwendet und einzelne Seiten wichen im Erscheinungsbild voneinander ab. Auf Basis dieser Beobachtungen wurden entsprechende Verbesserungen empfohlen.

- **Abgeleitete Verbesserungen:**
  1. **Hoch:** Einheitliches Design (konsistente Nutzung von Bootstrap-Icons, vereinheitlichte Seitenlayouts)
  2. **Hoch:** Fehlerbehebungen bei Lernmethoden und Timer-Reset beim Moduswechsel
  3. **Mittel:** Visuelles Feedback/Bestätigung nach dem Speichern einer Session; Tooltip/Hilfetext beim ersten Besuch der Timer-Seite
  4. **Niedrig:** Farbliche Unterscheidung der Modi (z.B. Blau für Stopuhr, Orange für Timer)
  5. **Niedrig:** Tagebuch-Funktion (erwartet, aber noch nicht verfügbar)

- **Umgesetzte Anpassungen:**
  - Einheitliches Design: konsistente Nutzung von Bootstrap-Icons, vereinheitlichte Seitenlayouts
  - Visuelle Bestätigung nach dem Speichern einer Session (Toast/Benachrichtigung)
  - Timer wird beim Wechsel der Lernmethode zurückgesetzt
  - Modus-Auswahl klarer und prominenter dargestellt ("Stopuhr" / "Timer")
  - Button-Gruppe für Listen-/Diagramm-Ansicht vergrössert und eindeutiger beschriftet

---

## 5. Erweiterungen [Optional]

- **Tag-System für Aktivitäten:**
  - **Beschreibung & Nutzen:** Aktivitäten können mit Tags versehen werden, um sie thematisch zu kategorisieren. Dies ermöglicht bessere Filterung und Analyse der investierten Zeit pro Themenbereich.
  - **Umsetzung:** Separate Tags-Collection in MongoDB, Auswahl beim Speichern einer Session
  - **Abgrenzung:** Geht über einfache Zeiterfassung hinaus, bietet aber Mehrwert für die Selbstanalyse

- **Diagramm-Visualisierung:**
  - **Beschreibung & Nutzen:** Aktivitäten werden in Balkendiagrammen visualisiert (Zeit pro Tag, Zeit pro Kategorie). Dies unterstützt die Reflexion und Motivation.
  - **Umsetzung:** Chart.js-Integration, client-seitige Aggregation der Daten
  - **Abgrenzung:** Erweitert die reine Listenansicht um analytische Komponente

---

## 6. Projektorganisation [Optional]

- **Repository & Struktur:** 
  - Git-Repository mit klarer Ordnerstruktur
  - `src/lib/` für wiederverwendbare Module
  - `src/routes/` für Seiten nach SvelteKit-Konvention

- **Commit-Praxis:** 
  - Aussagekräftige Commit-Messages
  - Feature-basierte Commits

---

## 7. KI‑Deklaration

### Eingesetzte KI‑Werkzeuge
- GitHub Copilot und Claude Opus(in VS Code)
- ChatGPT / Claude für punktuelle Fragen

### Zweck & Umfang
KI wurde unterstützend eingesetzt für:
- **Code-Vorschläge:** Autovervollständigung bei repetitiven Mustern (z.B. CRUD-Operationen)
- **Debugging:** Hilfe bei der Fehlersuche und -behebung, vor allem bei Type-Fehlern (null, any-Variablen)
- **Styling:** Unterstützung bei Bootstrap-Klassen und CSS
- **Datenbank (db.js):** Claude unterstützte bei der Implementierung, da dieses Thema nicht im Lehrplan behandelt wurde; alle Änderungen wurden manuell getestet und verifiziert


Der Einsatz erfolgte stets mit kritischer Überprüfung. Generierte Vorschläge wurden auf Korrektheit geprüft und bei Bedarf angepasst oder verworfen.

### Art der Beiträge
- Datenbankfunktionen (db.js) entstanden mit Copilot
- Bootstrap-Styling wurde teilweise mit KI-Hilfe optimiert

### Eigene Leistung (Abgrenzung)
- Konzeption und Architektur der Anwendung
- Design-Entscheidungen (Navigation, Seitenstruktur)
- Implementierung der Geschäftslogik (Timer-Funktionalität, Authentifizierung)
- Datenbankmodell und -schema (Mongodb)
- Testing und Qualitätssicherung
- Integration und Zusammenführung aller Komponenten

### Reflexion
- **Nutzen:** KI beschleunigte repetitive Aufgaben und unterstützte bei der Recherche von API-Details und Dokumentation. Besonders hilfreich war die KI-Unterstützung bei Themen, die nicht im Lehrplan behandelt wurden (z.B. Datenbankimplementierung in MongoDB und Fehlerbehebung).
- **Grenzen:** Komplexe Logik (z.B. Timer-State-Management, Zustandsverwaltung) erforderte eigenes Verständnis und kritische Überprüfung. KI-Vorschläge waren nicht immer optimal und führten teilweise zu unerwarteten Fehlern, die ein Überdenken oder komplettes Redesign erforderten.
- **Qualitätssicherung:** Alle KI-generierten Codeabschnitte wurden gründlich getestet und ggf. überarbeitet oder neu geschrieben, um sicherzustellen, dass die Anforderungen erfüllt werden.

---

## 8. Anhang [Optional]

---
