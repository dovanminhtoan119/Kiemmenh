/* =====================================================================
   KIẾM MỆNH · LÕI ENGINE
   EXP floor(100 × L^1.5) · 5 điểm/cấp · trần Level theo cảnh giới
   Chỉ số hiệu dụng = floor(gốc × hệ số đặc tính) + thưởng + trang bị
   Xúc xắc: bộ sinh số có hạt giống lưu trong save (tải lại ra cùng kết quả)
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  KM.VERSION = 1;

  /* ---------------- Xúc xắc ---------------- */
  KM.rand = function (s) {
    let t = (s.rng.s = (s.rng.s + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  KM.die = (s, n) => 1 + Math.floor(KM.rand(s) * n);
  KM.d100 = (s) => KM.die(s, 100);
  // Gieo d100 so với tỉ lệ %; ra 1 luôn thành công
  KM.rollPct = function (s, pct) { const r = KM.d100(s); return { r, ok: r === 1 || r <= pct }; };
  KM.fmtPct = (p) => (Math.round(p * 10) / 10).toString().replace(/\.0$/, "") + "%";
  // Kiểm tra ngoài chiến đấu: d20 + chỉ số/5 + thưởng ≥ độ khó
  KM.check = function (s, stat, dc, bonus) {
    const v = KM.eff(s)[stat], b = bonus || 0, r = KM.die(s, 20), mod = Math.floor(v / 5);
    const total = r + mod + b, ok = total >= dc;
    return { ok, r, total, line: "Kiểm tra " + KM.STAT_NAME[stat] + ": d20 = " + r + " + " + mod + (b ? " + " + b : "") + " = " + total + " / cần " + dc + " → " + (ok ? "thành công" : "thất bại") };
  };

  /* ---------------- Khởi tạo ---------------- */
  KM.newGame = function (seed) {
    const s = {
      v: KM.VERSION, name: "Shen", day: 1, slot: 2, place: "thanh_van", arc: 0,
      level: 1, exp: 0, rank: "E", base: { STR: 6, AGI: 6, VIT: 6, INT: 4, WIS: 4, LUK: 4 }, unalloc: 0,
      traits: [], traitOffer: [], traitReroll: 1, bonus: [],
      cur: { hp: 1, kh: 0, sta: 0 }, cls: null, hidden: null,
      skills: ["danh_thuong", "tap_dich_quyen", "chiu_don"], use: {}, ownArt: null, ownTier: 0,
      trend: { binh: 0, tay: 0, nhanh: 0, nang: 0, cong: 0, thu: 0, minh: 0, am: 0 }, interview: [],
      inv: { ngoc_tham_gia: 1 }, gear: { weapon: null, head: null, body: null, wrist: null, boots: null, belt: null, jade: null, jade2: null }, enh: {},
      money: 0, horse: null, shards: 0,
      moral: 0, anti: 0, rep: {}, aff: {}, met: [],
      quests: {}, ledger: [], flags: [], claimed: [], clues: [], visits: {},
      rng: { s: (seed == null ? Math.floor(Math.random() * 2147483647) : seed) | 0 },
      scene: "p_rain", hub: null, travel: null, weakUntil: 0, pendingRank: null, mini: null,
      stats: { kills: 0, wins: 0, losses: 0 }, marks: {}, tieuRun: null, known: ["thanh_van"], side: {}, opts: { autoEquip: false },
    };
    KM.recalc(s, true);
    s.cur.hp = 38; // đêm mưa: bị đánh gần chết
    return s;
  };

  KM.has = (s, f) => s.flags.includes(f);
  KM.flag = (s, f) => { if (!s.flags.includes(f)) s.flags.push(f); };
  KM.hasTrait = (s, t) => s.traits.includes(t);
  KM.rankIdx = (r) => KM.RANKS.indexOf(r);
  KM.expReq = (L) => Math.floor(100 * Math.pow(L, 1.5));
  KM.money = function (d) {
    d = Math.max(0, Math.floor(d));
    const v = Math.floor(d / 10000), b = Math.floor((d % 10000) / 100), c = d % 100, out = [];
    if (v) out.push(v + " vàng"); if (b) out.push(b + " bạc"); if (c || !out.length) out.push(c + " đồng");
    return out.join(" ");
  };

  /* ---------------- Chỉ số ---------------- */
  KM.traitMult = function (s) {
    const m = { STR: 1.2, AGI: 1.2, VIT: 1.2, INT: 1, WIS: 1, LUK: 1 }; // Tuyệt Mạch ×1.2 STR/AGI/VIT
    s.traits.forEach((t) => { const tm = KM.TRAITS[t].mult; if (tm) for (const k in tm) m[k] *= tm[k]; });
    return m;
  };
  KM.gearList = (s) => Object.values(s.gear).filter(Boolean).map((id) => ({ id, it: KM.ITEMS[id] }));
  KM.eff = function (s, skipGear) {
    const m = KM.traitMult(s), e = {};
    KM.STATS.forEach((k) => { e[k] = Math.floor(s.base[k] * m[k] + 1e-9); });
    s.bonus.forEach((b) => { for (const k in b.st) e[k] += b.st[k]; });
    if (!skipGear) KM.gearList(s).forEach(({ it }) => { if (it.st) for (const k in it.st) e[k] += it.st[k]; });
    if (s.weakUntil && s.day <= s.weakUntil) KM.STATS.forEach((k) => (e[k] = Math.floor(e[k] * 0.9)));
    KM.STATS.forEach((k) => (e[k] = Math.max(1, e[k])));
    return e;
  };
  KM.weaponType = (s) => (s.gear.weapon ? KM.ITEMS[s.gear.weapon].wtype : "tay");
  KM.enhMul = (s, id) => 1 + 0.05 * (s.enh[id] || 0);
  KM.noiEff = function (s, sk) {
    if (s.hidden === "tuyet_mach_kiem_ma" && (!sk || sk.w === "kiem")) return 1;
    return [0.6, 0.75, 0.9, 1][Math.min(3, s.shards)];
  };
  KM.derive = function (e, L, x) {
    // x: { watk, def, crit, eva, wtype, critDmg, defMul }
    x = x || {};
    const wt = x.wtype || "tay";
    let pdef = 0.5 * e.VIT + 0.25 * e.STR + (x.def || 0);
    if (wt === "con") pdef *= 1.1;
    pdef *= x.defMul || 1;
    let eva = Math.min(40, (40 * e.AGI) / (e.AGI + 100)) + (x.eva || 0) - (wt === "dao" ? 3 : 0);
    let crit = 5 + Math.min(20, e.AGI / 5) + (x.crit || 0) + (wt === "kiem" ? 5 : 0);
    return {
      maxHP: Math.floor(100 + 20 * e.VIT + 5 * L),
      maxKH: Math.floor(30 + 8 * e.VIT + 4 * e.STR),
      maxNL: Math.floor(20 + 10 * e.INT + 10 * e.WIS),
      maxSTA: Math.floor(50 + 10 * e.VIT + 5 * e.AGI),
      patk: 2 * e.STR + 0.5 * e.AGI + (x.watk || 0),
      npow: 2 * e.INT + e.WIS + (x.watk || 0),
      pdef: Math.round(pdef * 100) / 100,
      eva: Math.max(0, Math.round(eva * 10) / 10),
      crit: Math.round(crit * 10) / 10,
      critDmg: x.critDmg || (wt === "kiem" ? 1.75 : 1.5),
      speed: e.AGI,
    };
  };
  KM.gearX = function (s) {
    const x = { watk: 0, def: 0, crit: 0, eva: 0, wtype: KM.weaponType(s), defMul: 1 };
    KM.gearList(s).forEach(({ id, it }) => {
      const em = KM.enhMul(s, id);
      if (it.atk) x.watk += it.atk * em;
      if (it.def) x.def += it.def * em;
      if (it.crit) x.crit += it.crit;
      if (it.eva) x.eva += it.eva;
      if (it.critDmg) x.critDmg = it.critDmg;
    });
    x.watk = Math.round(x.watk * 10) / 10; x.def = Math.round(x.def * 10) / 10;
    if (KM.hasTrait(s, "kim_cuong")) x.defMul *= 1.5;
    s.traits.forEach((t) => { const T = KM.TRAITS[t]; if (T && T.dx && T.dx.defMul) x.defMul *= T.dx.defMul; if (T && T.dx) { x.crit += T.dx.crit || 0; x.eva += T.dx.eva || 0; } });
    if (s.hidden === "tuyet_mach_kim_than") x.defMul *= 1.3;
    return x;
  };
  KM.derived = function (s) {
    const x = KM.gearX(s), d = KM.derive(KM.eff(s), s.level, x);
    s.traits.forEach((t) => {
      const T = KM.TRAITS[t] && KM.TRAITS[t].dx; if (!T) return;
      if (T.critDmg) d.critDmg = Math.round((d.critDmg + T.critDmg) * 100) / 100;
      if (T.hpMul) d.maxHP = Math.floor(d.maxHP * T.hpMul);
      if (T.khMul) d.maxKH = Math.floor(d.maxKH * T.khMul);
      if (T.staMul) d.maxSTA = Math.floor(d.maxSTA * T.staMul);
      if (T.patkMul) d.patk = Math.round(d.patk * T.patkMul * 10) / 10;
    });
    d.eva = Math.max(0, d.eva);
    return d;
  };
  KM.traitProd = (s, key) => s.traits.reduce((m, t) => m * ((KM.TRAITS[t] && KM.TRAITS[t][key]) || 1), 1);
  KM.recalc = function (s, fill) {
    const d = KM.derived(s);
    if (fill) { s.cur.hp = d.maxHP; s.cur.kh = d.maxKH; s.cur.sta = d.maxSTA; }
    s.cur.hp = Math.min(s.cur.hp, d.maxHP); s.cur.kh = Math.min(s.cur.kh, d.maxKH); s.cur.sta = Math.min(s.cur.sta, d.maxSTA);
    return d;
  };

  /* ---------------- Level & cảnh giới ---------------- */
  KM.cap = (s) => KM.RANK_CAP[s.rank];
  KM.readyBreak = (s) => s.level >= KM.cap(s) && s.exp >= KM.expReq(s.level);
  KM.gainExp = function (s, n) {
    const msgs = [];
    if (!n) return msgs;
    s.exp += n; msgs.push("+" + n + " EXP");
    while (s.exp >= KM.expReq(s.level) && s.level < KM.cap(s)) {
      s.exp -= KM.expReq(s.level); s.level++; s.unalloc += 5;
      msgs.push("Lên Level " + s.level + "! +5 điểm chỉ số chưa phân bổ.");
      const d = KM.recalc(s); s.cur.hp = d.maxHP; s.cur.kh = d.maxKH; s.cur.sta = d.maxSTA;
    }
    if (KM.readyBreak(s) && !s._capNote) { s._capNote = true; const nx = KM.RANKS[KM.rankIdx(s.rank) + 1]; msgs.push("Đã chạm trần cảnh giới " + KM.RANK_NAME[s.rank] + ". EXP vẫn tích lũy. Đột phá " + nx + ": " + (KM.RANK_BREAK[nx] || "") + "."); }
    return msgs;
  };
  KM.rankUp = function (s) {
    const msgs = [];
    s.rank = KM.RANKS[KM.rankIdx(s.rank) + 1]; s._capNote = false;
    msgs.push("ĐỘT PHÁ! Cảnh giới " + KM.RANK_NAME[s.rank] + " (Rank " + s.rank + ").");
    s.pendingRank = s.rank;
    msgs.push(...KM.gainExp(s, 0));
    while (s.exp >= KM.expReq(s.level) && s.level < KM.cap(s)) { s.exp -= KM.expReq(s.level); s.level++; s.unalloc += 5; msgs.push("Lên Level " + s.level + "! +5 điểm chỉ số."); }
    KM.recalc(s, true);
    return msgs;
  };
  KM.RANK_REWARDS = {
    D: (s) => {
      const cls = s.cls && KM.CLASSES[s.cls];
      const wid = cls ? { kiem: "thanh_phong_kiem", dao: "quy_dau_dao", con: "o_moc_con", thuong: "ngu_xoa", quyen: "thiet_chi_ho_trao" }[cls.weapon] : "thanh_phong_kiem";
      return [
        { t: "+5 điểm chỉ số tự do", eff: { stat: 5 } },
        { t: "Trang bị: " + KM.ITEMS[wid].name + " (" + KM.ITEMS[wid].q + ")", eff: { item: [wid, 1] } },
        { t: "Tiếp tế: 3 Kim sáng dược, 2 Hồi khí tán, 20 bạc", eff: { item: [["kim_sang", 3], ["hoi_khi", 2]], money: 2000 } },
      ];
    },
  };
  KM.claimRank = function (s, i) {
    const R = KM.RANK_REWARDS[s.pendingRank]; if (!R) { s.pendingRank = null; return []; }
    const opt = R(s)[i]; s.pendingRank = null;
    return KM.apply(s, opt.eff, "rank_" + s.rank);
  };
  KM.allocate = function (s, k, n) { n = Math.min(n || 1, s.unalloc); if (n <= 0) return; s.base[k] += n; s.unalloc -= n; KM.recalc(s); };

  /* ---------------- Đạo đức, danh vọng, quan hệ ---------------- */
  KM.moralTier = (v) => KM.MORAL_TIERS.find((t) => v >= t.min).name;
  KM.repTier = (v) => KM.REP_TIERS.find((t) => v >= t.min).name;
  KM.addLedger = function (s, e) { s.ledger.unshift(Object.assign({ id: "AO-" + String(s.ledger.length + 1).padStart(3, "0"), day: s.day }, e)); };

  /* ---------------- Kỹ năng ---------------- */
  KM.MASTERY = ["Sơ Nhập", "Tiểu Thành", "Đại Thành", "Viên Mãn", "Hóa Cảnh"];
  KM.MASTERY_AT = [0, 10, 30, 60, 100];
  KM.mastery = (s, id) => { const u = s.use[id] || 0; let m = 0; KM.MASTERY_AT.forEach((t, i) => { if (u >= t) m = i; }); return m; };
  KM.skill = (s, id) => (id === "own" ? s.ownArt && KM.MACH_AN[s.ownArt].sk : KM.SKILLS[id]);
  KM.learn = function (s, id) { if (s.skills.includes(id)) return []; s.skills.push(id); return ["Lĩnh hội võ công: " + KM.skill(s, id).name + "."]; };
  KM.skillLine = function (s, id) {
    const sk = KM.skill(s, id); if (!sk) return "";
    const parts = [];
    if (sk.cost && sk.cost.sta) parts.push(sk.cost.sta + " thể lực");
    if (sk.cost && sk.cost.kh) parts.push(sk.cost.kh + " Khí Huyết");
    parts.push(sk.cd ? "hồi " + sk.cd + " lượt" : "không hồi chiêu");
    if (sk.src === "n" && !sk.own) parts.push("nội công " + Math.round(KM.noiEff(s, sk) * 100) + "%");
    if (sk.w) parts.push("cần " + KM.WEAPON_TYPES[sk.w].name.toLowerCase());
    return parts.join(" · ");
  };

  /* ---------------- Vật phẩm & trang bị ---------------- */
  KM.meets = function (s, req) {
    if (!req) return true;
    const e = KM.eff(s, true);
    for (const k in req) {
      if (k === "lv") { if (s.level < req.lv) return false; }
      else if (KM.STATS.includes(k)) { if (e[k] < req[k]) return false; }
    }
    return true;
  };
  KM.reqText = function (req) {
    if (!req) return "";
    return Object.keys(req).map((k) => (k === "lv" ? "Level " + req.lv : k + " " + req[k])).join(", ");
  };
  KM.itemLine = function (s, id) {
    const it = KM.ITEMS[id]; if (!it) return "";
    if (it.type === "use" || it.type === "mat" || it.type === "key") return it.desc || "";
    const p = [], em = KM.enhMul(s, id);
    if (it.atk) p.push("Công +" + Math.round(it.atk * em * 10) / 10);
    if (it.def) p.push("Giáp +" + Math.round(it.def * em * 10) / 10);
    if (it.st) for (const k in it.st) p.push(k + " " + (it.st[k] > 0 ? "+" : "") + it.st[k]);
    if (it.crit) p.push("chí mạng +" + it.crit + "%");
    if (it.eva) p.push("né +" + it.eva + "%");
    if (it.critDmg) p.push("sát thương chí mạng ×" + it.critDmg);
    if (it.pierce) p.push("Phá Giáp thành " + Math.round(it.pierce * 100) + "%");
    if (it.mounted) p.push("cưỡi ngựa +" + Math.round(it.mounted * 100) + "%");
    if (it.sweep) p.push("Quét Ngang tối đa " + it.sweep + " địch");
    if (it.maxKT) p.push("Khí Thế tối đa " + it.maxKT);
    return p.join(", ");
  };
  KM.itemScore = (it) => (it.atk || 0) * 2 + (it.def || 0) * 2 + (it.st ? Object.values(it.st).reduce((a, b) => a + b, 0) : 0) + (it.crit || 0) + (it.eva || 0);
  KM.slotFor = function (s, it) { if (it.slot !== "jade") return it.slot; if (!s.gear.jade) return "jade"; if (!s.gear.jade2) return "jade2"; return KM.itemScore(KM.ITEMS[s.gear.jade]) <= KM.itemScore(KM.ITEMS[s.gear.jade2]) ? "jade" : "jade2"; };
  KM.snap = function (s) { const e = KM.eff(s), d = KM.derived(s); return { e, d }; };
  KM.diffLines = function (a, b) {
    const out = [];
    KM.STATS.forEach((k) => { if (a.e[k] !== b.e[k]) out.push(k + " " + a.e[k] + " → " + b.e[k]); });
    const names = { maxHP: "HP tối đa", maxKH: "Khí Huyết", maxSTA: "Thể lực", patk: "Công vật lý", npow: "Nội công lực", pdef: "Giáp", eva: "Né %", crit: "Chí mạng %" };
    for (const k in names) if (a.d[k] !== b.d[k]) out.push(names[k] + " " + a.d[k] + " → " + b.d[k]);
    return out;
  };
  // So sánh một món trong túi với món đang mặc ở cùng ô (mô phỏng trên bản sao trạng thái)
  KM.compareEquip = function (s, id) {
    const it = KM.ITEMS[id]; if (!it || !it.slot) return null;
    const slot = KM.slotFor(s, it), cur = s.gear[slot];
    const c = JSON.parse(JSON.stringify(s)); c.gear[slot] = id;
    const a = KM.snap(s), b = KM.snap(c), rows = [];
    KM.STATS.forEach((k) => { if (a.e[k] !== b.e[k]) rows.push({ k, a: a.e[k], b: b.e[k] }); });
    const names = { patk: "Công vật lý", npow: "Nội công lực", pdef: "Giáp", maxHP: "HP tối đa", maxKH: "Khí Huyết", maxSTA: "Thể lực", eva: "Né %", crit: "Chí mạng %", critDmg: "Sát thương chí mạng" };
    for (const k in names) if (a.d[k] !== b.d[k]) rows.push({ k: names[k], a: a.d[k], b: b.d[k] });
    rows.forEach((r) => (r.d = Math.round((r.b - r.a) * 100) / 100));
    const score = rows.reduce((t, r) => t + (["Công vật lý", "Nội công lực", "Giáp"].includes(r.k) ? r.d * 2 : r.d), 0);
    const wtNote = it.wtype && s.cls && KM.CLASSES[s.cls].weapon !== it.wtype ? "Khác vũ khí của Võ Đạo (" + KM.WEAPON_TYPES[KM.CLASSES[s.cls].weapon].name + ") — chiêu Võ Đạo sẽ không dùng được." : "";
    return { slot, cur, rows, better: score > 0 && !wtNote, worse: score < 0 || !!wtNote, meets: KM.meets(s, it.req), wtNote };
  };
  KM.equip = function (s, id) {
    const it = KM.ITEMS[id];
    if (!it || !it.slot || !s.inv[id]) return ["Không thể trang bị."];
    if (!KM.meets(s, it.req)) return ["Chưa đủ điều kiện: " + KM.reqText(it.req) + "."];
    const before = KM.snap(s), slot = KM.slotFor(s, it), old = s.gear[slot];
    if (old) s.inv[old] = (s.inv[old] || 0) + 1;
    s.inv[id]--; if (!s.inv[id]) delete s.inv[id];
    s.gear[slot] = id;
    KM.recalc(s);
    const after = KM.snap(s);
    return ["Trang bị " + it.name + (old ? " (thay " + KM.ITEMS[old].name + ")" : "") + ".", ...KM.diffLines(before, after).map((l) => "  " + l)];
  };
  KM.unequip = function (s, slot) {
    const id = s.gear[slot]; if (!id) return [];
    const before = KM.snap(s); s.gear[slot] = null; s.inv[id] = (s.inv[id] || 0) + 1; KM.recalc(s);
    return ["Tháo " + KM.ITEMS[id].name + ".", ...KM.diffLines(before, KM.snap(s)).map((l) => "  " + l)];
  };
  // Tự mặc đồ tốt hơn (vũ khí: chỉ cùng loại với Võ Đạo; chưa có Võ Đạo thì chỉ khi tay không hoặc cùng loại)
  KM.autoEquip = function (s, id) {
    const it = KM.ITEMS[id]; if (!it || !it.slot || !KM.meets(s, it.req)) return [];
    if (!(s.opts && s.opts.autoEquip)) { const c = KM.compareEquip(s, id); return c && c.better ? ["  ↑ Tốt hơn đồ đang mặc ở ô " + (KM.SLOTS[c.slot] || "Ngọc bội") + ". Vào Túi đồ để so sánh và chọn."] : []; }
    if (it.slot === "weapon") {
      const cw = KM.weaponType(s), want = s.cls ? KM.CLASSES[s.cls].weapon : null;
      if (want && it.wtype !== want) return [];
      if (!want && cw !== "tay" && cw !== it.wtype) return [];
    }
    const slot = KM.slotFor(s, it), cur = s.gear[slot];
    if (cur && KM.itemScore(KM.ITEMS[cur]) >= KM.itemScore(it)) return [];
    return ["Tự động trang bị (tốt hơn đồ đang mặc):", ...KM.equip(s, id)];
  };
  KM.addItem = function (s, id, q) {
    q = q || 1; const it = KM.ITEMS[id]; if (!it) return [];
    s.inv[id] = (s.inv[id] || 0) + q;
    const msgs = ["Nhận " + it.name + (q > 1 ? " ×" + q : "") + (it.q ? " [" + it.q + "]" : "") + (it.slot ? " — " + KM.itemLine(s, id) : "")];
    if (it.slot) msgs.push(...KM.autoEquip(s, id));
    return msgs;
  };
  KM.useItem = function (s, id) {
    const it = KM.ITEMS[id]; if (!it || it.type !== "use" || !s.inv[id]) return null;
    const d = KM.derived(s), out = [];
    let hm = KM.hasTrait(s, "y_thanh") ? 1.5 : 1; if (KM.hasTrait(s, "doc_the")) hm *= 0.7;
    if (it.heal) { const b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * it.heal * hm)); out.push("+" + (s.cur.hp - b) + " HP"); }
    if (it.kh) { const b = s.cur.kh; s.cur.kh = Math.min(d.maxKH, s.cur.kh + Math.floor(d.maxKH * it.kh * (KM.hasTrait(s, "y_thanh") ? 1.5 : 1))); out.push("+" + (s.cur.kh - b) + " Khí Huyết"); }
    if (it.cure) out.push("giải độc");
    s.inv[id]--; if (!s.inv[id]) delete s.inv[id];
    return "Dùng " + it.name + ": " + out.join(", ") + ".";
  };

  /* ---------------- Cửa hàng ---------------- */
  KM.buyPrice = (s, id, shop) => Math.ceil(KM.ITEMS[id].price * (KM.hasTrait(s, "thuong_nhan") ? 0.8 : 1) * ((shop && KM.SHOPS[shop].markup) || 1));
  KM.sellPrice = (s, id) => Math.floor(KM.ITEMS[id].price * 0.4 * (KM.hasTrait(s, "thuong_nhan") ? 1.2 : 1));
  KM.BOOK_PRICE = 3000;
  KM.shopStock = function (s, shop) {
    const out = [];
    KM.SHOPS[shop].stock.forEach((x) => {
      if (x === "bk:2") {
        if (s.cls) { const sk = KM.CLASSES[s.cls].s2; out.push({ book: sk, name: "Bí kíp " + KM.SKILLS[sk].name, price: Math.ceil(KM.BOOK_PRICE * (KM.hasTrait(s, "thuong_nhan") ? 0.8 : 1)), req: { lv: 10 }, owned: s.skills.includes(sk) }); }
      } else out.push({ id: x, name: KM.ITEMS[x].name, price: KM.buyPrice(s, x, shop) });
    });
    return out;
  };
  KM.buy = function (s, shop, entry) {
    if (s.money < entry.price) return ["Không đủ tiền. Cần " + KM.money(entry.price) + ", đang có " + KM.money(s.money) + "."];
    if (entry.book) {
      if (entry.owned) return ["Đã học rồi."];
      if (s.level < 10) return ["Cần Level 10 mới lĩnh hội được."];
      const b = s.money; s.money -= entry.price;
      return ["Mua bí kíp: " + KM.money(b) + " − " + KM.money(entry.price) + " = " + KM.money(s.money) + ".", ...KM.learn(s, entry.book)];
    }
    const b = s.money; s.money -= entry.price;
    return ["Mua " + entry.name + ": " + KM.money(b) + " − " + KM.money(entry.price) + " = " + KM.money(s.money) + ".", ...KM.addItem(s, entry.id, 1)];
  };
  KM.sell = function (s, id) {
    const it = KM.ITEMS[id]; if (!s.inv[id] || it.type === "key" || !it.price) return ["Không bán được."];
    const p = KM.sellPrice(s, id), b = s.money; s.money += p; s.inv[id]--; if (!s.inv[id]) delete s.inv[id];
    return ["Bán " + it.name + ": " + KM.money(b) + " + " + KM.money(p) + " = " + KM.money(s.money) + "."];
  };
  KM.buyHorse = function (s, hid) {
    const h = KM.HORSES[hid], p = Math.ceil(h.price * (KM.hasTrait(s, "thuong_nhan") ? 0.8 : 1));
    if (s.money < p) return ["Không đủ tiền. Cần " + KM.money(p) + "."];
    const b = s.money; s.money -= p; s.horse = hid;
    return ["Mua " + h.name + " [" + h.q + "]: " + KM.money(b) + " − " + KM.money(p) + " = " + KM.money(s.money) + ".", "Hệ số thời gian đi đường ×" + h.mult + "."];
  };
  KM.ENH_COST = (n) => 500 * (n + 1) * (n + 1);
  KM.enhance = function (s, slot) {
    const id = s.gear[slot]; if (!id) return ["Chưa trang bị gì ở ô này."];
    const n = s.enh[id] || 0; if (n >= 10) return ["Đã cường hóa tối đa +10."];
    const cost = KM.ENH_COST(n); if (s.money < cost) return ["Cần " + KM.money(cost) + "."];
    const b = s.money; s.money -= cost; const before = KM.snap(s);
    const out = ["Phí cường hóa: " + KM.money(b) + " − " + KM.money(cost) + " = " + KM.money(s.money) + "."];
    if (n >= 6) { const fail = 10 * (n - 5); const r = KM.rollPct(s, 100 - fail); out.push("Tỉ lệ thành công " + (100 - fail) + "%: d100 = " + r.r + " → " + (r.ok ? "thành công" : "thất bại")); if (!r.ok) return out; }
    s.enh[id] = n + 1; KM.recalc(s);
    out.push(KM.ITEMS[id].name + " +" + (n + 1) + ".", ...KM.diffLines(before, KM.snap(s)).map((l) => "  " + l));
    return out;
  };

  /* ---------------- Rơi đồ ---------------- */
  KM.dropPct = function (s, base, q) {
    let p = base * (1 + KM.eff(s).LUK / 100);
    if (q && KM.QUALITIES.indexOf(q) >= 3 && KM.hasTrait(s, "thien_van")) p *= 1.25;
    return Math.round(p * 10) / 10;
  };
  KM.randomOfQuality = function (s, q) {
    const pool = Object.keys(KM.ITEMS).filter((k) => KM.ITEMS[k].q === q && KM.ITEMS[k].slot && KM.ITEMS[k].price < 100000);
    return pool[Math.floor(KM.rand(s) * pool.length)];
  };
  KM.rollLoot = function (s, foe) {
    const msgs = [], E = KM.ENEMIES[foe.id];
    (E.loot || []).forEach(([what, base]) => {
      let q = null; if (what.startsWith("q:")) q = what.slice(2);
      if (q && KM.rankIdx(foe.rank) < KM.rankIdx(KM.QUALITY_MIN_RANK[q])) return;
      const pct = base >= 100 ? 100 : KM.dropPct(s, base, q || (KM.ITEMS[what] && KM.ITEMS[what].q));
      const r = KM.d100(s), ok = pct >= 100 || r === 1 || r <= pct;
      let id = what;
      if (q) id = KM.randomOfQuality(s, q);
      if (what.startsWith("pick:")) { const ops = what.slice(5).split(","); id = ops[Math.floor(KM.rand(s) * ops.length)]; }
      const label = q ? "trang bị " + q + " ngẫu nhiên" : KM.ITEMS[id].name;
      msgs.push("Rơi đồ " + foe.name + " · " + label + ": " + (pct >= 100 ? "chắc chắn" : "d100 = " + r + " / cần ≤ " + KM.fmtPct(pct) + " → " + (ok ? "rơi" : "không")));
      if (ok) msgs.push(...KM.addItem(s, id, 1).map((l) => "  " + l));
    });
    if (E.coin && E.coin[0]) {
      let sum = 0; const rolls = [];
      for (let i = 0; i < E.coin[0]; i++) { const r = KM.die(s, E.coin[1]); rolls.push(r); sum += r; }
      const got = sum * E.coin[2], b = s.money; s.money += got;
      msgs.push("Tiền " + foe.name + ": " + E.coin[0] + "d" + E.coin[1] + " = " + rolls.join("+") + " → " + KM.money(got) + " (" + KM.money(b) + " → " + KM.money(s.money) + ")");
    }
    return msgs;
  };

  /* ---------------- Hiệu ứng ---------------- */
  KM.apply = function (s, eff, tx) {
    const msgs = [];
    if (!eff) return msgs;
    if (tx) { if (s.claimed.includes(tx)) return msgs; s.claimed.push(tx); }
    if (eff.flag) [].concat(eff.flag).forEach((f) => KM.flag(s, f));
    if (eff.unflag) [].concat(eff.unflag).forEach((f) => (s.flags = s.flags.filter((x) => x !== f)));
    if (eff.trend) for (const k in eff.trend) s.trend[k] = (s.trend[k] || 0) + eff.trend[k];
    if (eff.clue && !s.clues.includes(eff.clue)) { s.clues.push(eff.clue); msgs.push("Manh mối mới (" + s.clues.length + "): " + eff.clueName); }
    if (eff.money) { const b = s.money; s.money = Math.max(0, s.money + eff.money); msgs.push((eff.money > 0 ? "Nhận " : "Mất ") + KM.money(Math.abs(eff.money)) + " (" + KM.money(b) + " → " + KM.money(s.money) + ")"); }
    if (eff.item) { const list = Array.isArray(eff.item[0]) ? eff.item : [eff.item]; list.forEach(([id, q]) => msgs.push(...KM.addItem(s, id, q))); }
    if (eff.take) { const [id, q] = eff.take; s.inv[id] = Math.max(0, (s.inv[id] || 0) - (q || 1)); if (!s.inv[id]) delete s.inv[id]; }
    if (eff.skill) [].concat(eff.skill).forEach((id) => msgs.push(...KM.learn(s, id)));
    if (eff.stat) { s.unalloc += eff.stat; msgs.push("+" + eff.stat + " điểm chỉ số tự do."); }
    if (eff.bonus) { s.bonus.push(eff.bonus); msgs.push(eff.bonus.src + ": " + Object.keys(eff.bonus.st).map((k) => k + " +" + eff.bonus.st[k]).join(", ") + " (vĩnh viễn)."); KM.recalc(s); }
    if (eff.shard) { s.shards += eff.shard; msgs.push("Mảnh Thiên Mạch Chân Giải " + s.shards + "/3. Nhánh nội công của Shen đạt " + Math.round(KM.noiEff(s) * 100) + "% uy lực."); }
    if (eff.moral) {
      let v = eff.moral; if (v < 0 && KM.hasTrait(s, "ma_tinh")) v -= 2;
      const b = s.moral; s.moral = Math.max(-300, Math.min(300, s.moral + v));
      msgs.push("Đạo đức " + (v > 0 ? "+" : "") + v + " (" + b + " → " + s.moral + ", " + KM.moralTier(s.moral) + ")");
    }
    if (eff.anti) { s.anti += eff.anti; }
    if (eff.rep) for (const f in eff.rep) {
      let v = eff.rep[f]; if (v > 0 && KM.hasTrait(s, "hiep_cot") && f !== "huyet_anh") v = Math.round(v * 1.5);
      s.rep[f] = (s.rep[f] || 0) + v; msgs.push("Danh vọng " + KM.FACTIONS[f] + " " + (v > 0 ? "+" : "") + v + " (" + s.rep[f] + ")");
    }
    if (eff.aff) for (const n in eff.aff) {
      if (!s.met.includes(n)) s.met.push(n);
      const b = s.aff[n] || 0; s.aff[n] = Math.max(0, Math.min(100, b + eff.aff[n]));
      if (eff.aff[n]) msgs.push("Hảo cảm " + KM.NPCS[n].name + " " + (eff.aff[n] > 0 ? "+" : "") + eff.aff[n] + " (" + s.aff[n] + "/100)");
    }
    if (eff.meet) [].concat(eff.meet).forEach((n) => { if (!s.met.includes(n)) { s.met.push(n); s.aff[n] = s.aff[n] || 0; } });
    if (eff.quest) for (const q in eff.quest) {
      const v = eff.quest[q];
      if (typeof v === "object") {
        const o = Object.assign({ st: "active" }, v);
        if (v.dueDays) o.deadline = (v.dueFrom ? (s.marks[v.dueFrom] || s.day) : s.day) + v.dueDays;
        s.quests[q] = o; msgs.push("Nhiệm vụ mới: " + v.name + (o.deadline ? " (hạn: hết ngày " + o.deadline + ")" : ""));
      }
      else if (s.quests[q] && s.quests[q].st !== v) { s.quests[q].st = v; msgs.push((v === "done" ? "Hoàn thành" : v === "fail" ? "Thất bại" : "Cập nhật") + " nhiệm vụ: " + s.quests[q].name); }
    }
    if (eff.ledger) KM.addLedger(s, eff.ledger);
    if (eff.heal) { const d = KM.derived(s); s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * eff.heal)); if (eff.heal >= 1) { s.cur.kh = d.maxKH; s.cur.sta = d.maxSTA; } }
    if (eff.place) s.place = eff.place;
    if (eff.mark) s.marks[eff.mark] = s.day;
    if (eff.arc != null) s.arc = eff.arc;
    if (eff.time) msgs.push(...KM.advance(s, eff.time));
    if (eff.exp) msgs.push(...KM.gainExp(s, eff.exp));
    return msgs;
  };

  /* ---------------- Điều kiện lựa chọn ---------------- */
  KM.reqOk = function (s, r) {
    if (!r) return true;
    if (r.lv && s.level < r.lv) return false;
    if (r.flag && ![].concat(r.flag).every((f) => KM.has(s, f))) return false;
    if (r.noflag && [].concat(r.noflag).some((f) => KM.has(s, f))) return false;
    if (r.clues != null && s.clues.length < r.clues) return false;
    if (r.maxClues != null && s.clues.length > r.maxClues) return false;
    if (r.money && s.money < r.money) return false;
    if (r.item && !s.inv[r.item]) return false;
    if (r.trait && !KM.hasTrait(s, r.trait)) return false;
    if (r.aff) for (const n in r.aff) if ((s.aff[n] || 0) < r.aff[n]) return false;
    if (r.quest) for (const q in r.quest) if (!s.quests[q] || s.quests[q].st !== r.quest[q]) return false;
    if (r.dayMin && s.day < r.dayMin) return false;
    if (r.night && s.slot !== 2) return false;
    if (r.day && s.slot === 2) return false;
    if (r.moral != null && s.moral < r.moral) return false;
    const e = KM.eff(s);
    for (const k of KM.STATS) if (r[k] && e[k] < r[k]) return false;
    return true;
  };
  KM.reqLabel = function (r) {
    if (!r) return "";
    const p = [];
    if (r.lv) p.push("Lv " + r.lv);
    KM.STATS.forEach((k) => r[k] && p.push(k + " " + r[k]));
    if (r.clues) p.push(r.clues + " manh mối");
    if (r.money) p.push(KM.money(r.money));
    if (r.aff) for (const n in r.aff) p.push("Hảo cảm " + KM.NPCS[n].name + " " + r.aff[n]);
    if (r.moral != null) p.push("Đạo đức ≥ " + r.moral);
    if (r.trait) p.push(KM.TRAITS[r.trait].name);
    return p.join(", ");
  };

  /* ---------------- Thời gian ---------------- */
  KM.SLOT_NAME = ["Buổi sáng", "Buổi chiều", "Buổi tối", "Đêm khuya"];
  KM.advance = function (s, n) {
    const msgs = [];
    s.slot += n;
    while (s.slot >= 4) { s.slot -= 4; msgs.push(...KM.newDay(s)); }
    return msgs;
  };
  KM.newDay = function (s) {
    s.day++;
    const msgs = ["— Ngày " + s.day + " —"];
    if (s.horse) { const b = s.money; s.money = Math.max(0, s.money - KM.HORSE_FEED); msgs.push("Cỏ và trọ ngựa: " + KM.money(b) + " − " + KM.HORSE_FEED + " đồng = " + KM.money(s.money) + "."); }
    if (KM.sideDeadlines) msgs.push(...KM.sideDeadlines(s));
    return msgs;
  };
  KM.sleep = function (s) {
    const msgs = [];
    s.slot = 0; msgs.push(...KM.newDay(s));
    const d = KM.derived(s);
    s.cur.hp = d.maxHP; s.cur.kh = d.maxKH; s.cur.sta = Math.min(d.maxSTA, s.cur.sta + Math.ceil(d.maxSTA * 0.5));
    msgs.push("Ngủ một giấc: HP và Khí Huyết hồi đầy, thể lực +50%.");
    s.flags = s.flags.filter((f) => !f.startsWith("today_"));
    msgs.push(...KM.rollMini(s));
    return msgs;
  };
  // Tiểu kỳ ngộ: mỗi ngày tự do gieo d100 ≤ 2 + LUK/10
  KM.rollMini = function (s) {
    const pct = 2 + KM.eff(s).LUK / 10, r = KM.d100(s);
    if (!(r === 1 || r <= pct)) return [];
    const k = KM.die(s, 4), out = ["TIỂU KỲ NGỘ (d100 = " + r + " / cần ≤ " + KM.fmtPct(pct) + ")"];
    if (k === 1) { const n = KM.die(s, 6) + KM.die(s, 6); out.push("Đào được một hũ tiền chôn dưới gốc cây: 2d6 = " + n + " bạc.", ...KM.apply(s, { money: n * 100 })); }
    else if (k === 2) out.push("Một lão thầy thuốc rong tặng thuốc.", ...KM.apply(s, { item: [["kim_sang", 2], ["hoi_khi", 1]] }));
    else if (k === 3) { const id = KM.randomOfQuality(s, s.rank === "E" ? "Lương" : "Tinh"); out.push("Nhặt được một bọc hành lý bị bỏ lại.", ...KM.addItem(s, id, 1)); }
    else {
      const pool = s.skills.filter((x) => x !== "danh_thuong" && x !== "chiu_don"); const id = pool[Math.floor(KM.rand(s) * pool.length)];
      if (id) { s.use[id] = Math.max(s.use[id] || 0, KM.MASTERY_AT[Math.min(4, KM.mastery(s, id) + 1)]); out.push("Một cao thủ ẩn thế đi ngang, chỉ điểm một chiêu: " + KM.skill(s, id).name + " lên " + KM.MASTERY[KM.mastery(s, id)] + "."); }
    }
    return out;
  };

  /* ---------------- Đi đường ---------------- */
  KM.edges = function (a) { const out = []; for (const k in KM.ROUTES) { const [x, y] = k.split(">"); if (x === a) out.push([y, KM.ROUTES[k]]); else if (y === a) out.push([x, KM.ROUTES[k]]); } return out; };
  // Đường ngắn nhất (Dijkstra) giữa hai địa điểm bất kỳ
  KM.path = function (a, b, avoid) {
    if (a === b) return { days: 0, nodes: [a] };
    const dist = { [a]: 0 }, prev = {}, todo = new Set(Object.keys(KM.PLACES));
    while (todo.size) {
      let u = null; todo.forEach((n) => { if (dist[n] != null && (u == null || dist[n] < dist[u])) u = n; });
      if (u == null) break; todo.delete(u); if (u === b) break;
      KM.edges(u).forEach(([v, w]) => { if (avoid && avoid.includes(v) && v !== b) return; const nd = dist[u] + w; if (dist[v] == null || nd < dist[v]) { dist[v] = nd; prev[v] = u; } });
    }
    if (dist[b] == null) return null;
    const nodes = [b]; while (nodes[0] !== a) nodes.unshift(prev[nodes[0]]);
    return { days: dist[b], nodes };
  };
  KM.routeDays = function (a, b) { const p = KM.path(a, b); return p ? p.days : null; };
  KM.travelDays = function (s, a, b) {
    const base = KM.routeDays(a, b); if (base == null) return null;
    const m = s.horse ? KM.HORSES[s.horse].mult : 1;
    return Math.ceil((base * m) / 0.25 - 1e-9) * 0.25;
  };
  KM.startTravel = function (s, dest) {
    const days = KM.travelDays(s, s.place, dest), p = KM.path(s.place, dest), base = p.days;
    s.travel = { from: s.place, dest, left: Math.round(days * 4), total: Math.round(days * 4), via: p.nodes.slice(1, -1) };
    const route = p.nodes.map((n) => KM.PLACES[n]).join(" → ");
    return [route + ": đi bộ " + base + " ngày" + (s.horse ? " × " + KM.HORSES[s.horse].mult + " (" + KM.HORSES[s.horse].name + ") = " + (base * KM.HORSES[s.horse].mult).toFixed(2).replace(/\.?0+$/, "") + " → làm tròn lên " + days + " ngày" : " = " + days + " ngày") + "."];
  };
  // Đi một chặng (tối đa 4 buổi); trả về sự kiện nếu có
  KM.travelStep = function (s) {
    const t = s.travel; if (!t) return { msgs: [] };
    const n = Math.min(4, t.left); t.left -= n;
    const msgs = KM.advance(s, n);
    let fight = null;
    if (n === 4 || t.left === 0) {
      const r = KM.d100(s);
      msgs.push("Sự kiện dọc đường: d100 = " + r + " / cần ≤ 15 → " + (r <= 15 ? "có" : "bình yên"));
      if (r <= 15) {
        const k = KM.die(s, 10);
        if (k <= 5) { fight = KM.ROAD_FOES ? KM.ROAD_FOES[s.rank].slice() : s.rank === "E" ? ["son_tac"] : ["cuop_duong"]; msgs.push("Một toán cướp chặn đường!"); }
        else if (k <= 8) msgs.push("Gặp thương nhân đi ngược chiều, mua rẻ được thuốc.", ...KM.apply(s, { item: ["kim_sang", 1] }));
        else msgs.push(...(KM.rollMiniForce(s)));
      }
    }
    if (t.left <= 0) { s.place = t.dest; s.travel = null; if (!s.known.includes(t.dest)) { s.known.push(t.dest); msgs.push("Khám phá địa điểm mới: " + KM.PLACES[t.dest] + "."); } msgs.push("Đã đến " + KM.PLACES[t.dest] + "."); }
    return { msgs, fight };
  };
  KM.rollMiniForce = function (s) { const out = []; const k = KM.die(s, 6) + KM.die(s, 6); out.push("TIỂU KỲ NGỘ dọc đường: nhặt được túi tiền rơi, 2d6 = " + k + " bạc.", ...KM.apply(s, { money: k * 100 })); return out; };

  /* ---------------- Võ công riêng ---------------- */
  KM.suggestArts = function (s) {
    const t = s.trend;
    return Object.keys(KM.MACH_AN).map((id) => {
      const a = KM.MACH_AN[id]; let sc = 0; for (const k in a.t) sc += a.t[k] * (t[k] || 0);
      return { id, sc };
    }).sort((a, b) => b.sc - a.sc || a.id.localeCompare(b.id)).slice(0, 3).map((x) => x.id);
  };
  KM.setOwnArt = function (s, id) {
    s.ownArt = id; s.ownTier = 1;
    return ["Mạch Ẩn khai thông. Võ công riêng tầng 1: " + KM.MACH_AN[id].name + ".", KM.MACH_AN[id].sk.desc];
  };
  KM.setClass = function (s, id) {
    const C = KM.CLASSES[id]; s.cls = id;
    const msgs = ["Võ Đạo: " + C.name + " (" + KM.WEAPON_TYPES[C.weapon].name + " · " + KM.BRANCH_NAME[C.branch] + ")."];
    msgs.push(...KM.learn(s, C.s1));
    if (C.branch === "noi") msgs.push("Tuyệt Mạch: chiêu nội công đốt Khí Huyết, đạt " + Math.round(KM.noiEff(s) * 100) + "% uy lực cho đến khi gom đủ Thiên Mạch Chân Giải.");
    if (KM.weaponType(s) !== C.weapon) {
      const own = Object.keys(s.inv).filter((k) => KM.ITEMS[k].wtype === C.weapon && KM.meets(s, KM.ITEMS[k].req)).sort((a, b) => KM.itemScore(KM.ITEMS[b]) - KM.itemScore(KM.ITEMS[a]));
      if (own.length) msgs.push(...KM.equip(s, own[0]));
      else msgs.push("Hàn giáo đầu đưa cho một món binh khí tập luyện.", ...KM.addItem(s, KM.STARTER_WEAPON[C.weapon], 1), ...(KM.weaponType(s) !== C.weapon ? KM.equip(s, KM.STARTER_WEAPON[C.weapon]) : []));
    }
    return msgs;
  };

  /* ---------------- Lưu game ---------------- */
  KM.hash = function (str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); };
  KM.exportSave = function (s) { const body = JSON.stringify(s); return JSON.stringify({ game: "kiem-menh", v: KM.VERSION, sum: KM.hash(body), body }); };
  KM.importSave = function (txt) {
    let o; try { o = JSON.parse(txt); } catch (e) { return { err: "File không đúng định dạng." }; }
    if (!o || o.game !== "kiem-menh" || typeof o.body !== "string") return { err: "Không phải file lưu của Kiếm Mệnh." };
    if (KM.hash(o.body) !== o.sum) return { err: "Mã kiểm tra không khớp: file đã bị sửa hoặc hỏng." };
    const s = JSON.parse(o.body); KM.migrate(s); const v = KM.validate(s); if (v) return { err: v };
    return { s };
  };
  KM.migrate = function (s) {
    if (!s.known) { s.known = ["thanh_van"]; if (KM.has(s, "arrived_lac_ha")) s.known.push("hanh_hoa", "lac_ha"); if (s.quests.q_cuu_phuong) s.known.push("hac_phong"); if (s.quests.q_phong_lam) s.known.push("phong_lam"); if (!s.known.includes(s.place)) s.known.push(s.place); }
    if (!s.side) s.side = {};
    if (!s.opts) s.opts = { autoEquip: false };
    if (!s.marks) s.marks = {};
    if ((KM.has(s, "expelled") || KM.has(s, "fugitive_tv") || KM.has(s, "killed_tieu_hao")) && !KM.has(s, "tv_banned")) s.flags.push("tv_banned");
  };
  KM.validate = function (s) {
    if (!s || typeof s.level !== "number" || !s.base || !s.cur) return "Thiếu dữ liệu nhân vật.";
    if (KM.rankIdx(s.rank) < 0) return "Cảnh giới không hợp lệ.";
    for (const k in s.inv) if (!KM.ITEMS[k] || s.inv[k] < 0) return "Vật phẩm không hợp lệ: " + k;
    for (const k in s.gear) if (s.gear[k] && !KM.ITEMS[s.gear[k]]) return "Trang bị không hợp lệ.";
    return null;
  };
})(typeof window !== "undefined" ? window : globalThis);
(function (G) {
  const KM = G.KM;
  /* ---------------- Đặc tính khởi đầu: chọn từng cái một ----------------
     Mỗi lượt hiện 6 đặc tính ngẫu nhiên (chưa có), chọn 1; hệ thống xáo bộ mới cho lượt sau.
     Mỗi lượt được xáo lại 1 lần. */
  KM.TRAIT_PICKS = 2;
  KM.offerTraits = function (s) {
    const have = s.traitPick || [];
    const pool = Object.keys(KM.TRAITS).filter((k) => !KM.TRAITS[k].rare && !have.includes(k)), out = [];
    while (out.length < 6 && out.length < pool.length) { const k = pool[Math.floor(KM.rand(s) * pool.length)]; if (!out.includes(k)) out.push(k); }
    const r = KM.d100(s); if (r <= 5 && !have.includes("kiem_ma")) out[out.length - 1] = "kiem_ma";
    s.traitOffer = out; return out;
  };
  KM.rerollTraits = function (s) { if (s.traitReroll <= 0) return false; s.traitReroll--; KM.offerTraits(s); return true; };
  // Chọn một đặc tính; trả về true khi đã đủ số đặc tính
  KM.pickTrait = function (s, id) {
    if (!s.traitOffer.includes(id)) return null;
    s.traitPick = (s.traitPick || []).concat(id);
    if (s.traitPick.length < KM.TRAIT_PICKS) { s.traitReroll = 1; KM.offerTraits(s); return false; }
    s.traits = s.traitPick.slice(); delete s.traitPick; s.traitOffer = [];
    const d = KM.recalc(s, false); s.cur.hp = d.maxHP; s.cur.kh = d.maxKH; s.cur.sta = d.maxSTA; return true;
  };
  KM.pickTraits = function (s, ids) {
    if (ids.length !== 2 || !ids.every((i) => s.traitOffer.includes(i))) return false;
    s.traits = ids.slice(); const d = KM.recalc(s, false); s.cur.hp = d.maxHP; s.cur.kh = d.maxKH; s.cur.sta = d.maxSTA; return true;
  };
  KM.answerInterview = function (s, qi, ai) { const a = KM.INTERVIEW[qi].a[ai]; s.interview[qi] = ai; for (const k in a[1]) s.trend[k] = (s.trend[k] || 0) + a[1][k] * 2; };
})(typeof window !== "undefined" ? window : globalThis);
