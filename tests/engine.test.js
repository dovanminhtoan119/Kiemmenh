/* Kiểm thử: công thức + bot chơi thử tự động qua Mở đầu, Arc 1, Arc 2.
   Chạy: node tests/engine.test.js [số_lượt] */
const path = require("path");
["data", "skills", "engine", "combat", "story_a1", "story_a2", "hub", "quests"].forEach((f) => require(path.join(__dirname, "../js/" + f + ".js")));
const KM = globalThis.KM;
let fails = 0;
const eq = (a, b, m) => { if (a !== b) { fails++; console.log("✗ " + m + ": " + a + " ≠ " + b); } };
const ok = (c, m) => { if (!c) { fails++; console.log("✗ " + m); } };

/* ---------- Công thức ---------- */
[[1, 100], [2, 282], [3, 519], [4, 800], [5, 1118], [10, 3162], [20, 8944], [50, 35355], [100, 100000]].forEach(([L, v]) => eq(KM.expReq(L), v, "EXP L" + L));
{
  const s = KM.newGame(7); const d = KM.derived(s);
  eq(d.maxHP, 245, "HP khởi đầu"); eq(d.maxKH, 114, "Khí Huyết"); eq(d.maxSTA, 155, "Thể lực"); eq(d.patk, 17.5, "Công"); eq(d.pdef, 5.25, "Giáp"); eq(d.eva, 2.6, "Né"); eq(d.crit, 6.4, "Chí mạng");
  // nhiều cấp liền + giữ EXP dư
  const s2 = KM.newGame(1); KM.gainExp(s2, 2500); eq(s2.level, 5, "lên nhiều cấp"); eq(s2.exp, 2500 - 100 - 282 - 519 - 800, "EXP dư"); eq(s2.unalloc, 20, "điểm chưa phân bổ");
  // trần cảnh giới
  const s3 = KM.newGame(1); KM.gainExp(s3, 20000); eq(s3.level, 9, "trần Rank E"); ok(KM.readyBreak(s3), "sẵn sàng đột phá");
  // đặc tính nhân nối tiếp
  const s4 = KM.newGame(1); s4.traits = ["thien_sinh", "ba_vuong"]; eq(KM.eff(s4).STR, Math.floor(6 * 1.2 * 1.2 * 1.3), "nhân nối tiếp");
  // ngựa
  const s5 = KM.newGame(1); s5.place = "lac_ha"; eq(KM.travelDays(s5, "lac_ha", "phong_lam"), 3, "đi bộ"); s5.horse = "ngua_hong"; eq(KM.travelDays(s5, "lac_ha", "phong_lam"), 2, "ngựa Lương 3×0.65=1.95→2"); s5.horse = "han_huyet"; eq(KM.travelDays(s5, "lac_ha", "kim_lang"), 1.5, "Thần mã");
  // xúc xắc có hạt giống: cùng seed cùng kết quả
  const a = KM.newGame(42), b = KM.newGame(42); const ra = [1, 2, 3].map(() => KM.d100(a)), rb = [1, 2, 3].map(() => KM.d100(b)); eq(ra.join(), rb.join(), "seed lặp lại");
  // lưu / nhập
  const ex = KM.exportSave(a), im = KM.importSave(ex); ok(im.s && im.s.rng.s === a.rng.s, "lưu/nhập");
  ok(KM.importSave(ex.replace('\\"level\\":1', '\\"level\\":99')).err, "phát hiện file bị sửa");
  // cảnh liên kết đầy đủ
  for (const id in KM.SCENES) {
    const sc = KM.SCENES[id];
    const gos = [].concat((sc.choices || []).flatMap((c) => [c.go, c.fail]), sc.go, sc.fight ? [sc.fight.win, sc.fight.lose] : []).filter((g) => g && !g.startsWith("@"));
    gos.forEach((g) => ok(KM.SCENES[g], "cảnh " + id + " trỏ tới " + g + " không tồn tại"));
    if (sc.fight) sc.fight.foes.forEach((f) => ok(KM.ENEMIES[f], "kẻ địch " + f));
  }
  // bản đồ: đường ngắn nhất
  eq(KM.path("thanh_van", "lac_ha").days, 2, "Thanh Vân → Lạc Hà qua Hạnh Hoa");
  eq(KM.path("hanh_hoa", "phong_lam").days, 4, "Hạnh Hoa → Phong Lâm");
  { const t = KM.newGame(3); t.place = "hac_phong"; t.horse = "thanh_tong"; eq(KM.travelDays(t, "hac_phong", "thanh_van"), 1.5, "3 ngày × 0.5"); }
  // nhiệm vụ nhánh: giết
  { const t = KM.newGame(5); t.place = "hanh_hoa"; KM.acceptSide(t, "hh_heo"); KM.sideKill(t, "heo_rung"); KM.sideKill(t, "heo_rung"); ok(!KM.sideReady(t, "hh_heo"), "chưa đủ 3");
    t.place = "lac_ha"; KM.sideKill(t, "heo_rung"); ok(!KM.sideReady(t, "hh_heo"), "giết sai nơi không tính"); t.place = "hanh_hoa"; KM.sideKill(t, "heo_rung"); ok(KM.sideReady(t, "hh_heo"), "đủ 3");
    const m = t.money; KM.completeSide(t, "hh_heo"); eq(t.money - m, 200, "thưởng tiền"); eq(t.side.hh_heo.st, "done", "hoàn thành");
    ok(!KM.questActions(t, "hanh_hoa", "gieng").some((a) => /heo/i.test(a.t)), "không nhận lại"); }
  // thu thập
  { const t = KM.newGame(5); KM.acceptSide(t, "hh_da"); t.inv.da_soi = 5; ok(KM.sideReady(t, "hh_da"), "đủ da"); KM.completeSide(t, "hh_da"); eq(t.inv.da_soi, 1, "trừ vật phẩm"); }
  // giao hàng + quá hạn
  { const t = KM.newGame(5); KM.acceptSide(t, "hh_thu"); ok(t.inv.thu_nha === 1, "nhận thư"); t.place = "lac_ha"; ok(KM.questActions(t, "lac_ha", "khach_diem").some((a) => /Giao đồ/.test(a.t)), "giao ở Lạc Hà");
    const u = KM.newGame(5); KM.acceptSide(u, "hh_thu"); for (let i = 0; i < 7; i++) KM.newDay(u); eq(u.side.hh_thu.st, "fail", "quá hạn"); ok(!u.inv.thu_nha, "mất thư khi quá hạn"); }
  // hạn chính tuyến
  { const t = KM.newGame(5); t.place = "hanh_hoa"; t.day = KM.A1_DEADLINE; eq(KM.hubTrigger(t), "a1_trial", "xét xử dù ở ngoài núi"); }
  for (const k in KM.SIDEQUESTS) { const q = KM.SIDEQUESTS[k]; ok(KM.HUBS[q.place] && KM.HUBS[q.place].locs.find((l) => l.id === q.loc), "nơi nhận " + k); if (q.kind === "kill") q.foe.forEach((f) => ok(KM.ENEMIES[f], "địch " + f)); if (q.item) ok(KM.ITEMS[q.item], "vật phẩm " + q.item); if (q.to) ok(KM.HUBS[q.to].locs.find((l) => l.id === q.toLoc), "nơi giao " + k); }
  for (const k in KM.CLASSES) { ok(KM.SKILLS[KM.CLASSES[k].s1] && KM.SKILLS[KM.CLASSES[k].s2], "kỹ năng class " + k); }
}

/* ---------- Bot ---------- */
function fight(s, foes, opts) {
  const c = KM.combat.start(s, foes, opts);
  let guard = 0;
  while (!c.over && guard++ < 80) {
    const d = KM.derived(s);
    if (s.cur.hp < d.maxHP * 0.35) {
      const it = ["dai_hoan", "kim_sang"].find((x) => s.inv[x]);
      if (it) { KM.combat.playerAct(s, c, { type: "item", id: it }); continue; }
    }
    if (c.rerolls) c.rerollOn = true;
    const rd = KM.combat.ready(s, c).filter((x) => x.ok && x.id !== "chiu_don" && x.sk.mult);
    rd.sort((a, b) => (b.sk.mult * (b.sk.hits || 1) * (b.sk.aoe || 1)) - (a.sk.mult * (a.sk.hits || 1) * (a.sk.aoe || 1)));
    KM.combat.playerAct(s, c, { type: "skill", id: rd.length ? rd[0].id : "danh_thuong" });
  }
  return c;
}
function allocate(s) {
  const pr = s.cls ? (s.hidden ? KM.HIDDEN_CLASSES[s.hidden].prio : KM.CLASSES[s.cls].prio) : ["STR", "VIT"];
  while (s.unalloc > 0) { KM.allocate(s, pr[0], Math.min(3, s.unalloc)); if (s.unalloc > 0) KM.allocate(s, pr[1] === "INT" ? "VIT" : pr[1], Math.min(2, s.unalloc)); }
}
function playSceneFight(s, sc, log) {
  const o = Object.assign({}, sc.fight.opts); if (o.foeHpMulFlag && KM.has(s, o.foeHpMulFlag)) o.foeHpMul = 0.8;
  const c = fight(s, sc.fight.foes, o);
  const won = c.over === "win"; KM.combat.finish(s, c, sc.fight.tx);
  if (s.pendingRank) KM.claimRank(s, 0);
  log.push((won ? "W " : "L ") + sc.fight.foes.join("+") + " Lv" + s.level + " " + s.rank);
  return won || c.over === "flee" ? (won ? sc.fight.win : sc.fight.lose) : sc.fight.lose;
}
function botRun(seed, verbose) {
  const s = KM.newGame(seed), log = [];
  let steps = 0, scene = "p_rain";
  KM.enterScene(s, scene);
  const rnd = () => KM.rand(s); const skip = new Set();
  while (steps++ < 3000) {
    allocate(s);
    if (s.hub) {
      const trig = KM.hubTrigger(s); if (trig) { s.hub = null; KM.enterScene(s, trig); continue; }
      const H = KM.hubOf(s);
      if (!H) { log.push("no hub at " + s.place); break; }
      const d = KM.derived(s);
      // chọn hành động
      const acts = [];
      KM.hubLocs(s, H).forEach((l) => { const open = KM.locOpen(s, l); KM.locActions(s, l).forEach((a, i) => { if ((open || a.quest || /Nghỉ|Thuê|Trọ|Ngủ/.test(a.t)) && !a.disabled && !skip.has(s.day + ":" + a.t)) acts.push({ l, a, i }); }); });
      const find = (re) => acts.find((x) => re.test(x.a.t));
      let pickA = null;
      if (s.slot === 3 || s.cur.hp < d.maxHP * 0.4) pickA = find(/Nghỉ đêm|Thuê phòng|Nghỉ ở/);
      if (!pickA && s.place === "thanh_van") pickA = find(/Bày chứng cứ/) && ((s.clues.length >= 2 && s.level >= 8) || s.day >= 7) ? find(/Bày chứng cứ/) : null;
      const prefer = [/^Trả việc|^Giao đồ/, /^Nhận việc/, /Giao hàng/, /Tấn công Hắc Phong/, /Rình ở gốc/, /Lẻn vào/, /Đi về phía thác/, /Lang thang/, /Ứng tuyển/, /Ra bến/, /Dò thám/, /Mua tin/, /Tấn công thủy trại/, /Uống rượu/, /Trò chuyện/, /Gặp Tô/];
      if (!pickA) for (const re of prefer) { const x = find(re); if (x && !(re.source.includes("Tấn công thủy") && s.level < 15)) { pickA = x; break; } }
      if (s.tieuRun && s.place === "lac_ha" && !pickA) { KM.startTravel(s, "phong_lam"); while (s.travel) { const st = KM.travelStep(s); if (st.fight) { const c = fight(s, st.fight, { road: true }); KM.combat.finish(s, c); } } continue; }
      if (s.place === "phong_lam" && !s.tieuRun) { KM.startTravel(s, "lac_ha"); while (s.travel) { const st = KM.travelStep(s); if (st.fight) { const c = fight(s, st.fight, { road: true }); KM.combat.finish(s, c); } } continue; }
      if (s.quests.q_cuu_phuong && s.quests.q_cuu_phuong.st === "active" && s.place === "lac_ha") { KM.startTravel(s, "hac_phong"); while (s.travel) { const st = KM.travelStep(s); if (st.fight) { const c = fight(s, st.fight, { road: true }); KM.combat.finish(s, c); } } continue; }
      if (s.place === "hac_phong" && !(s.quests.q_cuu_phuong && s.quests.q_cuu_phuong.st === "active")) { KM.startTravel(s, "lac_ha"); while (s.travel) KM.travelStep(s); continue; }
      const go2 = (p) => { KM.startTravel(s, p); while (s.travel) { const st = KM.travelStep(s); if (st.fight) { const c = fight(s, st.fight, { road: true }); KM.combat.finish(s, c); } } };
      if (!pickA && KM.has(s, "a1_done") && KM.has(s, "arrived_lac_ha") && rnd() < 0.03) { const opts = KM.mapDests(s).filter((d) => !d.lock); if (opts.length) { go2(opts[Math.floor(rnd() * opts.length)].p); continue; } }
      if (s.place !== "lac_ha" && KM.has(s, "arrived_lac_ha") && rnd() < 0.25 && !(s.place === "hac_phong" && s.quests.q_cuu_phuong && s.quests.q_cuu_phuong.st === "active") && !(s.place === "phong_lam" && s.tieuRun)) { go2("lac_ha"); continue; }
      if (!pickA && s.place === "lac_ha" && !KM.has(s, "tieu_su_job") && find(/Nhận chuyến tiêu/) && s.horse) pickA = find(/Nhận chuyến tiêu/);
      if (!pickA) { const pool = acts.filter((x) => (s.rank !== 'E' || !/sâu vào|Đấu với/.test(x.a.t)) && /Săn|Tỉ thí|Đấu với|Luyện|áp tiêu ngắn|Làm việc|kéo lưới/.test(x.a.t) && (!x.a.req || KM.reqOk(s, x.a.req))); pickA = pool[Math.floor(rnd() * pool.length)] || find(/Nghỉ đêm|Thuê phòng|Nghỉ ở/); }
      // mua thuốc nếu ít
      if (s.money > 2000 && (s.inv.kim_sang || 0) < 3) { const st = KM.shopStock(s, s.place === "thanh_van" ? "tap_hoa" : "hieu_thuoc").find((e) => e.id === "kim_sang"); if (st && (s.place === "thanh_van" ? s.slot <= 1 : true)) KM.buy(s, null, st); }
      if (s.place === "lac_ha" && s.cls && s.level >= 10 && !s.skills.includes(KM.CLASSES[s.cls].s2) && s.money >= 3000) KM.buy(s, "thu_quan", KM.shopStock(s, "thu_quan")[0]);
      const res = KM.hubAct(s, pickA.l.id, pickA.i);
      if (res.free || (!res.scene && !res.fight && /Không|chưa|đã/.test(res.msgs[0] || "") && !/Nghỉ|Thuê/.test(pickA.a.t))) skip.add(s.day + ":" + pickA.a.t);
      if (res.scene) { s.hub = null; KM.enterScene(s, res.scene); continue; }
      if (res.fight) { const o = res.fight.opts || {}; const c = fight(s, res.fight.foes, o); const won = c.over === "win"; KM.combat.finish(s, c); if (s.pendingRank) KM.claimRank(s, 0); if (res.fight.after) res.fight.after(s, won); if (/ho_du|tieu_dau|vo_si/.test(res.fight.foes.join())) log.push((won ? "W " : "L ") + res.fight.foes.join("+") + " Lv" + s.level + " d" + s.day); }
      continue;
    }
    const sc = KM.SCENES[s.scene];
    if (!sc) { log.push("missing scene " + s.scene); break; }
    if (s.scene === "a2_end") { log.push("END Lv" + s.level + " " + s.rank + " day " + s.day); break; }
    let go = null;
    if (sc.special === "traits") { KM.offerTraits(s); KM.pickTraits(s, s.traitOffer.slice(0, 2)); go = sc.go; }
    else if (sc.special === "interview") { KM.INTERVIEW.forEach((q, i) => KM.answerInterview(s, i, Math.floor(rnd() * q.a.length))); go = sc.go; }
    else if (sc.special === "art") { KM.setOwnArt(s, KM.suggestArts(s)[0]); go = sc.go; }
    else if (sc.special === "class") { const ks = Object.keys(KM.CLASSES); const k = ks[seed % ks.length]; KM.setClass(s, k); go = sc.go; }
    else if (sc.special === "rank") { KM.claimRank(s, 0); go = "@hub"; }
    else if (sc.special === "hub") { s.hub = sc.hub; continue; }
    else if (sc.special === "travel") { KM.startTravel(s, sc.dest); while (s.travel) { const st = KM.travelStep(s); if (st.fight) { const c = fight(s, st.fight, { road: true }); KM.combat.finish(s, c); } } go = sc.go; }
    else if (sc.fight) go = playSceneFight(s, sc, log);
    else {
      const vis = KM.visibleChoices(s, sc).map((c, i) => ({ c, i })).filter((x) => KM.reqOk(s, x.c.req));
      if (!vis.length) { log.push("stuck at " + s.scene); break; }
      const ch = vis[Math.floor(rnd() * vis.length)];
      const r = KM.choose(s, ch.i); go = r.go;
    }
    if (!go) { log.push("no go from " + s.scene); break; }
    if (go === "@hub" || go === "@back") { s.hub = s.place; s.scene = null; continue; }
    KM.enterScene(s, go);
  }
  if (verbose) console.log(log.join("\n"));
  return { s, log };
}

module.exports = { botRun, fight };
if (require.main === module) {
const N = +process.argv[2] || 60;
let ends = 0; const lv = [], days = [], th = { w: 0, l: 0 }, hg = { w: 0, l: 0 }, stuck = [];
for (let i = 0; i < N; i++) {
  let r;
  try { r = botRun(1000 + i, false); } catch (e) { fails++; console.log("✗ crash seed " + (1000 + i) + ": " + e.stack.split("\n").slice(0, 3).join(" | ")); continue; }
  const L = r.log;
  L.forEach((x) => { if (/tieu_hao/.test(x)) th[x[0] === "W" ? "w" : "l"]++; if (/hac_giao/.test(x)) hg[x[0] === "W" ? "w" : "l"]++; });
  const e = L.find((x) => x.startsWith("END")); if (e) { ends++; lv.push(r.s.level); days.push(r.s.day); } else stuck.push((1000 + i) + ": " + L.slice(-2).join(" / ") + " @" + r.s.scene + " hub=" + r.s.hub + " day" + r.s.day);
}
console.log("Bot " + N + " lượt: tới cuối Arc 2: " + ends + "/" + N + " · Level TB " + (lv.reduce((a, b) => a + b, 0) / (lv.length || 1)).toFixed(1) + " · ngày TB " + (days.reduce((a, b) => a + b, 0) / (days.length || 1)).toFixed(1));
console.log("Tiêu Hạo thắng/thua " + th.w + "/" + th.l + " · Hắc Giao " + hg.w + "/" + hg.l);
if (stuck.length) console.log("Kẹt:\n" + stuck.slice(0, 8).join("\n"));
if (ends < N * 0.9) fails++;
console.log(fails ? "✗ " + fails + " lỗi" : "✓ Tất cả đạt");
process.exit(fails ? 1 : 0);
}
