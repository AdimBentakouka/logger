# @Warzon/Logger

Permet d'obtenir des fichiers de logs et de les afficher sur la console

### Exemple d'utilisation

```javascript
import Logger from "@Warzon/logger";

// Créera dans le dossier log un dossier app
const logger = new Logger({ name: "app" });

// Un fichier "/app/YYYY-mm-dd.log" sera créer et contiendra
// yyyy-MM-dd HH:mm:ss.SSS [app] - info: Hello World
logger.info("Hello World");
```

ou

```javascript
const Logger = require("@Warzon/logger").Logger;

const logger = new Logger();

// Un fichier "/app/YYYY-mm-dd.log" sera créer et contiendra
// yyyy-MM-dd HH:mm:ss.SSS [app] - info: Hello World
logger.info("Hello World");
```

---

#### Config constructor

```javascript
const config = {
    name: "App", // Nom de la catégorie à loggué
    /*   yyyy => Années, MM => Mois, dd => Jours
     *   HH => Heures, mm => Minutes, ss => Secondes, SSS => Millisecondes
     */
    dateFormat: "yyyy-MM-dd HH:mm:ss.SSS", // Format de la date
    showLevel: ["info", "warn", "error", "verbose"], // Les niveaux à afficher dans la console.log
    writeLevel: ["info", "warn", "error"], // Les niveaux à écrire dans un fichier yyyy-MM-dd.log
    path: "./logs", // Chemins du dossier de logs
};
```

---

#### Level log

```javascript
import { Logger } from "@Warzon/logger";

const logger = new Logger({
    name: "test",
});

// Console log => yyyy-MM-dd HH:mm:ss.SSS [test] - info: msg info
// Fichier log => (./logs/test/yyyy-MM-dd.log)
// => ... yyyy-MM-dd HH:mm:ss.SSS [test] - info: msg info ...
logger.info("msg info");

// Console log => yyyy-MM-dd HH:mm:ss.SSS [test] - warn: msg warn
// Fichier log => (./logs/test/yyyy-MM-dd.log)
// => ... yyyy-MM-dd HH:mm:ss.SSS [test] - warn: msg warn ...
logger.warn("msg warn");

// Console log => yyyy-MM-dd HH:mm:ss.SSS [test] - error: msg error
// Fichier log => (./logs/test/yyyy-MM-dd.log)
// => ... yyyy-MM-dd HH:mm:ss.SSS [test] - error: msg error ...
logger.error("msg error");

// Console log => yyyy-MM-dd HH:mm:ss.SSS [test] - verbose: msg verbose
// Pas de Fichier log => par défault writeLevel = ["info", "warn", "error"]
logger.verbose("msg verbose");
```

---
