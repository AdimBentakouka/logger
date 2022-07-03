import * as fs from "fs";
import { Logger, Config } from "../src/index";

const MAX_TRY_ORDER = 10_000;

describe("Class Logger", () => {
    // Constructor
    const config: Config = {
        name: "jest-test",
        dateFormat: "dd/MM/yyyy HH:mm:ss.SSS",
        showLevel: ["info"],
        writeLevel: [],
        path: "./pathtest",
    };

    test("Constructeur sans paramètre", () => {
        const logger = new Logger();
        expect(logger).toBeInstanceOf(Logger);
    });

    test("Constructeur avec paramètre", () => {
        const logger = new Logger(config);
        expect(logger).toBeInstanceOf(Logger);
        expect(logger.getConfig()).toEqual(config);
    });

    describe("Les methodes sont définis", () => {
        const logger = new Logger({ showLevel: [], writeLevel: [] });
        // Méthodes public
        test("La methode info", () => {
            const info = jest.spyOn(logger, "info");

            const result = logger.info("message");

            // Check qu'on a pas de retour
            expect(result).toBeUndefined();

            // Check si la méthode a été appelée
            expect(info).toHaveBeenCalledWith("message");

            info.mockClear();
        });

        test("La methode warn", () => {
            const warn = jest.spyOn(logger, "warn");

            const result = logger.warn("message");

            // Check qu'on a pas de retour
            expect(result).toBeUndefined();

            // Check si la méthode a été appelée
            expect(warn).toHaveBeenCalledWith("message");

            warn.mockClear();
        });

        test("La methode error", () => {
            const error = jest.spyOn(logger, "error");

            const result = logger.error("message");

            // Check qu'on a pas de retour
            expect(result).toBeUndefined();

            // Check si la méthode a été appelée
            expect(error).toHaveBeenCalledWith("message");

            error.mockClear();
        });

        test("La methode verbose", () => {
            const verbose = jest.spyOn(logger, "verbose");

            const result = logger.verbose("message");

            // Check qu'on a pas de retour
            expect(result).toBeUndefined();

            // Check si la méthode a été appelée
            expect(verbose).toHaveBeenCalledWith("message");

            verbose.mockClear();
        });

        test("La methode getConfig", () => {
            const getConfig = jest.spyOn(logger, "getConfig");

            const result = logger.getConfig();

            expect(result).toBeTruthy();
            expect(getConfig).toHaveBeenCalled();

            getConfig.mockClear();
        });
    });
});

describe("Horodatage - getDate", () => {
    const logger = new Logger();
    const loggerProto = Object.getPrototypeOf(logger);

    describe("format de date", () => {
        const year = 2022;
        const month = "01";
        const day = "01";
        const hour = "01";
        const minute = "01";
        const second = "01";
        const millisecond = "001";

        beforeEach(() => {
            jest.spyOn(global.Date, "now").mockImplementationOnce(
                (): number => {
                    return new Date(
                        `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`
                    ).valueOf();
                }
            );
        });

        test("Par défaut", () => {
            const getDate = jest.spyOn(loggerProto, "getDate");

            const result = loggerProto.getDate();

            // Check qu'on ai un retour
            expect(result).toBeTruthy();

            // Check si la méthode a été appelée
            expect(getDate).toHaveBeenCalled();

            // Check le format de la date
            expect(result).toEqual(
                `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`
            );

            getDate.mockClear();
        });

        test("dd/MM/yyyy HH:mm:ss.SSS", () => {
            const getDate = jest.spyOn(loggerProto, "getDate");

            const result = loggerProto.getDate("dd/MM/yyyy HH:mm:ss.SSS");

            // Check qu'on ai un retour
            expect(result).toBeTruthy();

            // Check si la méthode a été appelée
            expect(getDate).toHaveBeenCalled();

            // Check le format de la date
            expect(result).toEqual(
                `${day}/${month}/${year} ${hour}:${minute}:${second}.${millisecond}`
            );

            getDate.mockClear();
        });

        test("yyyy MM SSS ss HH dd mm 'yyyy'", () => {
            const getDate = jest.spyOn(loggerProto, "getDate");

            const result = loggerProto.getDate(
                "yyyy MM SSS ss HH dd mm 'yyyy'"
            );

            // Check qu'on ai un retour
            expect(result).toBeTruthy();

            // Check si la méthode a été appelée
            expect(getDate).toHaveBeenCalled();

            // Check le format de la date
            expect(result).toEqual(
                `${year} ${month} ${millisecond} ${second} ${hour} ${day} ${minute} 'yyyy'`
            );

            getDate.mockClear();
        });
    });

    describe("valeur de retour", () => {
        test("Année 2022", () => {
            jest.spyOn(global.Date, "now").mockImplementationOnce(
                (): number => {
                    return new Date(`2022-01-01T00:00:00.000Z`).valueOf();
                }
            );

            const getDate = jest.spyOn(loggerProto, "getDate");

            const result = loggerProto.getDate("yyyy");

            // Check qu'on ai un retour
            expect(result).toBeTruthy();

            // Check si la méthode a été appelée
            expect(getDate).toHaveBeenCalled();

            // Check le format de la date
            expect(result).toEqual("2022");

            getDate.mockClear();
        });

        describe("Mois", () => {
            test("Janvier (01)", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-01-22T00:00:00.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("MM");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("01");

                getDate.mockClear();
            });
            test("decembre (12)", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-22T00:00:00.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("MM");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("12");

                getDate.mockClear();
            });
        });

        describe("Jours", () => {
            test("01", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-01T00:00:00.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("dd");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("01");

                getDate.mockClear();
            });

            test("20", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-20T00:00:00.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("dd");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("20");

                getDate.mockClear();
            });
        });

        describe("Heures", () => {
            test("00", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-01T00:05:55.555Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("HH");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("00");

                getDate.mockClear();
            });

            test("14", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-20T14:00:00.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("HH");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("14");

                getDate.mockClear();
            });
        });

        describe("Minutes", () => {
            test("00", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-01T20:00:55.555Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("mm");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("00");

                getDate.mockClear();
            });

            test("32", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-20T14:32:00.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("mm");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("32");

                getDate.mockClear();
            });
        });

        describe("Secondes", () => {
            test("00", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-01T20:59:00.555Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("ss");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("00");

                getDate.mockClear();
            });

            test("45", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-20T14:32:45.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("ss");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("45");

                getDate.mockClear();
            });
        });

        describe("Millisecondes", () => {
            test("000", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-01T20:12:55.000Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("SSS");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("000");

                getDate.mockClear();
            });

            test("032", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-20T14:12:45.032Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("SSS");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("032");

                getDate.mockClear();
            });
            test("999", () => {
                jest.spyOn(global.Date, "now").mockImplementationOnce(
                    (): number => {
                        return new Date(`2022-12-20T14:12:45.999Z`).valueOf();
                    }
                );

                const getDate = jest.spyOn(loggerProto, "getDate");

                const result = loggerProto.getDate("SSS");

                // Check qu'on ai un retour
                expect(result).toBeTruthy();

                // Check si la méthode a été appelée
                expect(getDate).toHaveBeenCalled();

                // Check le format de la date
                expect(result).toEqual("999");

                getDate.mockClear();
            });
        });
    });
});

describe("Logger", () => {
    // suppression du dossier de logs

    const log = console.log;

    beforeEach(() => {
        fs.existsSync("./jest-log") &&
            fs.rmSync("./jest-log", { recursive: true });
        console.log = jest.fn();
    });

    afterAll(() => {
        console.log = log;

        fs.existsSync("./jest-log") &&
            fs.rmSync("./jest-log", { recursive: true });
    });

    test("Afficher les levels 'info', 'warn', 'error', 'verbose' dans la console sans fichier log", () => {
        jest.spyOn(global.Date, "now").mockImplementation((): number => {
            return new Date("2022-12-10T05:10:12.358Z").valueOf();
        });
        const logger = new Logger({
            name: "jest-test",
            showLevel: ["info", "warn", "error", "verbose"],
            writeLevel: [],
            path: "./jest-log",
        });

        const consoleSpy = jest.spyOn(console, "log");

        logger.info("msg info");
        logger.warn("msg warn");
        logger.error("msg error");
        logger.verbose("msg verbose");

        expect(consoleSpy).toBeCalledWith(
            "\x1b[34m2022-12-10 05:10:12.358 [jest-test] - info:\x1b[0m msg info"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[33m2022-12-10 05:10:12.358 [jest-test] - warn:\x1b[0m msg warn"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[31m2022-12-10 05:10:12.358 [jest-test] - error:\x1b[0m msg error"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[35m2022-12-10 05:10:12.358 [jest-test] - verbose:\x1b[0m msg verbose"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(4);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(
            false
        );
    });

    test("Afficher les levels 'info', 'warn', 'error' dans la console sans fichier log", () => {
        jest.spyOn(global.Date, "now").mockImplementation((): number => {
            return new Date("2022-12-10T05:10:12.358Z").valueOf();
        });
        const logger = new Logger({
            name: "jest-test",
            showLevel: ["info", "warn", "error"],
            writeLevel: [],
            path: "./jest-log",
        });

        const consoleSpy = jest.spyOn(console, "log");

        logger.info("msg info");
        logger.warn("msg warn");
        logger.error("msg error");
        logger.verbose("msg verbose");

        expect(consoleSpy).toBeCalledWith(
            "\x1b[34m2022-12-10 05:10:12.358 [jest-test] - info:\x1b[0m msg info"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[33m2022-12-10 05:10:12.358 [jest-test] - warn:\x1b[0m msg warn"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[31m2022-12-10 05:10:12.358 [jest-test] - error:\x1b[0m msg error"
        );

        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[35m2022-12-10 05:10:12.358 [jest-test] - verbose:\x1b[0m msg verbose"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(3);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(
            false
        );
    });

    test("Afficher les levels 'info', 'warn', 'error', 'verbose' dans la console et dans le fichier log", () => {
        jest.spyOn(global.Date, "now").mockImplementation((): number => {
            return new Date("2022-12-10T05:10:12.358Z").valueOf();
        });
        const logger = new Logger({
            name: "jest-test",
            showLevel: ["info", "warn", "error", "verbose"],
            writeLevel: ["info", "warn", "error", "verbose"],
            path: "./jest-log",
        });

        const consoleSpy = jest.spyOn(console, "log");

        logger.info("msg info");
        logger.warn("msg warn");
        logger.error("msg error");
        logger.verbose("msg verbose");

        expect(consoleSpy).toBeCalledWith(
            "\x1b[34m2022-12-10 05:10:12.358 [jest-test] - info:\x1b[0m msg info"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[33m2022-12-10 05:10:12.358 [jest-test] - warn:\x1b[0m msg warn"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[31m2022-12-10 05:10:12.358 [jest-test] - error:\x1b[0m msg error"
        );

        expect(consoleSpy).toBeCalledWith(
            "\x1b[35m2022-12-10 05:10:12.358 [jest-test] - verbose:\x1b[0m msg verbose"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(4);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(true);

        const file = fs.readFileSync(
            "./jest-log/jest-test/2022-12-10.log",
            "utf8"
        );

        const logs = file.split("\r\n");

        expect(logs[0]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - info: msg info"
        );

        expect(logs[1]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - warn: msg warn"
        );

        expect(logs[2]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - error: msg error"
        );

        expect(logs[3]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - verbose: msg verbose"
        );
    });

    test("Afficher les levels 'info', 'warn', 'error', 'verbose' dans la console et sans le 'verbose' dans le fichier log", () => {
        jest.spyOn(global.Date, "now").mockImplementation((): number => {
            return new Date("2022-12-10T05:10:12.358Z").valueOf();
        });
        const logger = new Logger({
            name: "jest-test",
            showLevel: ["info", "warn", "error", "verbose"],
            writeLevel: ["info", "warn", "error"],
            path: "./jest-log",
        });

        const consoleSpy = jest.spyOn(console, "log");

        logger.info("msg2 info");
        logger.warn("msg2 warn");
        logger.error("msg2 error");
        logger.verbose("msg2 verbose");

        expect(consoleSpy).toBeCalledWith(
            "\x1b[34m2022-12-10 05:10:12.358 [jest-test] - info:\x1b[0m msg2 info"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[33m2022-12-10 05:10:12.358 [jest-test] - warn:\x1b[0m msg2 warn"
        );
        expect(consoleSpy).toBeCalledWith(
            "\x1b[31m2022-12-10 05:10:12.358 [jest-test] - error:\x1b[0m msg2 error"
        );

        expect(consoleSpy).toBeCalledWith(
            "\x1b[35m2022-12-10 05:10:12.358 [jest-test] - verbose:\x1b[0m msg2 verbose"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(4);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(true);

        const file = fs.readFileSync(
            "./jest-log/jest-test/2022-12-10.log",
            "utf8"
        );

        const logs = file.split("\r\n");

        expect(logs[0]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - info: msg2 info"
        );

        expect(logs[1]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - warn: msg2 warn"
        );

        expect(logs[2]).toBe(
            "2022-12-10 05:10:12.358 [jest-test] - error: msg2 error"
        );

        expect(
            logs.includes(
                "2022-12-10 05:10:12.358 [jest-test] - verbose: msg2 verbose"
            )
        ).toBe(false);
    });

    test("Afficher aucun level dans la console &  sans fichier log (showLevel & writeLevel = [])", () => {
        jest.spyOn(global.Date, "now").mockImplementation((): number => {
            return new Date("2022-12-10T05:10:12.358Z").valueOf();
        });
        const logger = new Logger({
            name: "jest-test",
            showLevel: [],
            writeLevel: [],
            path: "./jest-log",
        });

        const consoleSpy = jest.spyOn(console, "log");

        logger.info("msg info");
        logger.warn("msg warn");
        logger.error("msg error");
        logger.verbose("msg verbose");

        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[34m2022-12-10 05:10:12.358 [jest-test] - info:\x1b[0m msg info"
        );
        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[33m2022-12-10 05:10:12.358 [jest-test] - warn:\x1b[0m msg warn"
        );
        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[31m2022-12-10 05:10:12.358 [jest-test] - error:\x1b[0m msg error"
        );

        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[35m2022-12-10 05:10:12.358 [jest-test] - verbose:\x1b[0m msg verbose"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(0);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(
            false
        );
    });

    test("Afficher aucun level dans la console & sans fichier log (showLevel & writeLevel = undefined)", () => {
        jest.spyOn(global.Date, "now").mockImplementation((): number => {
            return new Date("2022-12-10T05:10:12.358Z").valueOf();
        });
        const logger = new Logger({
            name: "jest-test",
            showLevel: undefined,
            writeLevel: undefined,
            path: "./jest-log",
        });

        const consoleSpy = jest.spyOn(console, "log");

        logger.info("msg info");
        logger.warn("msg warn");
        logger.error("msg error");
        logger.verbose("msg verbose");

        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[34m2022-12-10 05:10:12.358 [jest-test] - info:\x1b[0m msg info"
        );
        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[33m2022-12-10 05:10:12.358 [jest-test] - warn:\x1b[0m msg warn"
        );
        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[31m2022-12-10 05:10:12.358 [jest-test] - error:\x1b[0m msg error"
        );

        expect(consoleSpy).not.toBeCalledWith(
            "\x1b[35m2022-12-10 05:10:12.358 [jest-test] - verbose:\x1b[0m msg verbose"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(0);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(
            false
        );
    });

    test(`Ordre des logs dans le fichier log (occurence: ${MAX_TRY_ORDER})`, () => {
        const logger = new Logger({ name: "jest-test", path: "./jest-log" });

        for (let i = 0; i < MAX_TRY_ORDER; i++) {
            logger.info(`msg ${i}`);
            logger.warn(`msg ${i}`);
        }

        expect(fs.existsSync("./jest-log/jest-test/2022-12-10.log")).toBe(true);

        const file = fs.readFileSync(
            "./jest-log/jest-test/2022-12-10.log",
            "utf8"
        );

        const logs = file.split("\r\n");

        logs.forEach((log, i) => {
            if (log !== "") {
                // Si paire => info
                if (i % 2 === 0) {
                    //diviser par deux car on ajoute deux messages logs pour le même compteur
                    expect(log).toEqual(
                        `2022-12-10 05:10:12.358 [jest-test] - info: msg ${
                            i / 2
                        }`
                    );
                }
                if (i % 2 === 1) {
                    expect(log).toEqual(
                        `2022-12-10 05:10:12.358 [jest-test] - warn: msg ${
                            (i - 1) / 2
                        }`
                    );
                }
            }
        });
    });

    test("Deux fichier de logs lors d'un changement de jour", () => {
        jest.spyOn(global.Date, "now")
            // logs
            .mockImplementation((): number => {
                return new Date("2022-12-13T05:10:12.358Z").valueOf();
            })
            // fichier log
            .mockImplementationOnce((): number => {
                return new Date("2022-12-13T05:10:12.358Z").valueOf();
            })
            // log
            .mockImplementationOnce((): number => {
                return new Date("2022-12-14T05:10:12.358Z").valueOf();
            })
            // fichier log
            .mockImplementationOnce((): number => {
                return new Date("2022-12-14T05:10:12.358Z").valueOf();
            });
        const logger = new Logger({
            name: "jest-test",
            showLevel: ["info", "warn", "error", "verbose"],
            writeLevel: ["info", "warn", "error"],
            path: "./jest-log",
        });

        logger.info("test 12");

        logger.info("test 13");

        expect(fs.existsSync("./jest-log/jest-test/2022-12-13.log")).toBe(true);

        expect(fs.existsSync("./jest-log/jest-test/2022-12-14.log")).toBe(true);
    });
});
