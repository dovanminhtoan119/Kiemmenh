const { botRun } = require("./engine.test.js");
for (const sd of (process.argv[2] || "1000,1003,1007").split(",").map(Number)) { const r = botRun(sd, false); console.log("--", sd, r.s.cls, r.log.filter((x) => !/^[WL] (soi|heo|son_tac|cuop|ly_tam|de_tu)/.test(x)).join(" | ")); }
