import * as fs from "fs";
import * as path from "path";

//#region CONSTANTS
const LOGGER_COLOR = "__LOGGER_COLOR__";
const LOGGER_RESET_COLOR = "__LOGGER_RESET_COLOR__";

const RESET_COLOR = "\x1b[0m";

enum ColorLevel {
    error = "\x1b[31m",
    warn = "\x1b[33m",
    info = "\x1b[34m",
    verbose = "\x1b[35m",
}
//#endregion

export type level = "info" | "warn" | "error" | "verbose";

export type Config = {
    name?: string;
    dateFormat?: string;
    showLevel?: level[];
    writeLevel?: level[];
    path?: string;
};

export class Logger {
    //#region attribute

    private config: Config = {
        name: "App",
        dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
        showLevel: ["info", "warn", "error", "verbose"],
        writeLevel: ["info", "warn", "error"],
        path: "./logs",
    };

    //#endregion

    /**
     * Instancie un nouveau logger avec un nom, un format de date et différent niveau à afficher
     *
     * @example
     * // avec une variable de configuration
     * const logger = new Logger({
     *   name: "app",
     *   dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
     *   showLevel: ["info", "warn", "error", "debug"],
     *   writeLevel: ["info", "warn", "error"],
     * })
     * 
     * // sans variable de configuration
     * const logger = new Logger()
     *
     * @param {Config}   [config = {
            name?: "app",
            dateFormat?: "yyyy-MM-dd HH:mm:ss.SSS",
            showLevel?: ["info", "warn", "error", "debug"],
            writeLevel?: ["info", "warn", "error"],
        }] variable de configuration
    */
    constructor(config?: Config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }

    //#region  Methode private

    /**
     * @private
     * Permet d'écrire un message dans un fichier de log et d'afficher le message dans la console
     * @param {level} [level] niveau de log
     * @param {string} [message] message à afficher
     */
    private log(level: level, message: string): void {
        const { dateFormat, writeLevel = [], showLevel = [] } = this.config;

        const datetime = this.getDate(dateFormat);
        const label = `[${this.config.name}]`;

        const _msg = `${LOGGER_COLOR}${datetime} ${label} - ${level}:${LOGGER_RESET_COLOR} ${message}`;

        if (writeLevel.includes(level)) {
            this.writeLog(
                _msg.replace(LOGGER_COLOR, "").replace(LOGGER_RESET_COLOR, "")
            );
        }

        if (showLevel.includes(level)) {
            console.log(
                _msg
                    .replace(LOGGER_COLOR, ColorLevel[level])
                    .replace(LOGGER_RESET_COLOR, RESET_COLOR)
            );
        }
    }

    private writeLog(message: string): void {
        const datetime = this.getDate("yyyy-MM-dd");
        const filepath = `${this.config.path}/${this.config.name}/${datetime}.log`;

        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, message + "\r\n", { flag: "a+" });
    }

    /**
     * @private
     * Permet d'obtenir une date au format souhaité
     * @param {string} [format] format de la date (ex: "yyyy-MM-dd HH:mm:ss.SSS")
     * @example
     * // avec un format donné en paramètre
     * getDate("dd/MM/yyyy HH:mm") => "01/01/2020 00:00"
     * // sans format donné en paramètre
     * getDate() => "2020-01-01 00:00:00.000"
     * @returns {string} date au format souhaité
     *
     */
    private getDate(format: string = "yyyy-MM-dd HH:mm:ss.SSS"): string {
        const date = new Date(Date.now());

        const year = `${date.getFullYear()}`;
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        const hour = `0${date.getHours()}`.slice(-2);
        const minute = `0${date.getMinutes()}`.slice(-2);
        const second = `0${date.getSeconds()}`.slice(-2);
        const millisecond = `00${date.getMilliseconds()}`.slice(-3);

        return format
            .replace("yyyy", year)
            .replace("MM", month)
            .replace("dd", day)
            .replace("HH", hour)
            .replace("mm", minute)
            .replace("ss", second)
            .replace("SSS", millisecond);
    }

    //#endregion

    //#region Methode publique

    /**
     * Permet d'écrire un message de niveau info dans un fichier de log et d'afficher le message dans la console
     *
     * @example
     * // example d'appel
     * logger.info("message")
     * @param {string} [message] message à afficher
     */
    public info(message: string): void {
        this.log("info", message);
    }

    /**
     * Permet d'écrire un message de niveau warn dans un fichier de log et d'afficher le message dans la console
     *
     * @example
     * // example d'appel
     * logger.warn("message")
     * @param {string} [message] message à afficher
     */
    public warn(message: string): void {
        this.log("warn", message);
    }

    /**
     * Permet d'écrire un message de niveau error dans un fichier de log et d'afficher le message dans la console
     *
     * @example
     * // example d'appel
     * logger.error("message")
     * @param {string} [message] message à afficher
     */
    public error(message: string): void {
        this.log("error", message);
    }

    /**
     * Permet d'écrire un message de niveau verbose dans un fichier de log et d'afficher le message dans la console
     *
     * @example
     * // example d'appel
     * logger.debug("message")
     * @param {string} [message] message à afficher
     */
    public verbose(message: string): void {
        this.log("verbose", message);
    }
    /**
     * Permet de récupérer la configuration du logger
     * @returns {Config} configuration du logger
     */
    public getConfig(): Config {
        return this.config;
    }
    //#endregion
}
