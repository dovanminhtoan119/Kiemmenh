/* =====================================================================
   KIẾM MỆNH · BỘ MÁY ARC 3–9
   Đột phá theo cốt truyện, bậc Võ Đạo, Mạch Ẩn tầng 2–5, Lộ diện (Arc 4),
   Sĩ khí chiến tuyến (Arc 7), hồ sơ chứng cứ (Arc 8), đồng hành chết vĩnh viễn.
   Hành động chính tuyến trong khu tự do bắt đầu bằng "▶".
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  KM.R = (msgs, o) => Object.assign({ msgs: msgs || [] }, o || {});
  KM.since = (s, m) => (s.marks[m] == null ? -1 : s.day - s.marks[m]);
  KM.cnt = (s, list) => list.filter((f) => KM.has(s, f)).length;
  KM.dead = (s, n) => KM.has(s, "dead_" + n);
  KM.TRIGGERS = [];
  Object.assign(KM.RANK_REWARDS, KM.RANK_REWARDS2 || {});

  /* ---------------- Lựa chọn động ---------------- */
  KM.visibleChoices = (s, sc) => (typeof sc.choices === "function" ? sc.choices(s) : sc.choices || []).filter((c) => !c.hide || KM.reqOk(s, c.req));

  /* ---------------- Điều kiện mở rộng ---------------- */
  const reqBase = KM.reqOk;
  KM.reqOk = function (s, r) {
    if (!r) return true;
    if (r.any && ![].concat(r.any).some((f) => KM.has(s, f))) return false;
    if (r.cnt && KM.cnt(s, r.cnt[0]) < r.cnt[1]) return false;
    if (r.anti != null && s.anti < r.anti) return false;
    if (r.maxMoral != null && s.moral > r.maxMoral) return false;
    if (r.alive && [].concat(r.alive).some((n) => KM.dead(s, n))) return false;
    if (r.inv && !s.inv[r.inv]) return false;
    if (r.ev != null && KM.evidence(s).score < r.ev) return false;
    if (r.shards != null && s.shards < r.shards) return false;
    if (r.fn && !r.fn(s)) return false;
    return reqBase(s, r);
  };
  const lblBase = KM.reqLabel;
  KM.reqLabel = function (r) {
    if (!r) return "";
    const p = [lblBase(r)].filter(Boolean);
    if (r.anti != null) p.push("Kiêu Hùng ≥ " + r.anti);
    if (r.maxMoral != null) p.push("Đạo đức ≤ " + r.maxMoral);
    if (r.ev != null) p.push(r.ev + " điểm chứng cứ");
    if (r.shards != null) p.push(r.shards + " mảnh Chân Giải");
    if (r.label) p.push(r.label);
    return p.join(", ");
  };

  /* ---------------- Đột phá theo cốt truyện ----------------
     Cốt truyện cấp "giấy phép" brk_X; khi EXP chạm trần, Shen đột phá ngay. */
  KM.tryBreak = function (s) {
    const nx = KM.RANKS[KM.rankIdx(s.rank) + 1];
    if (!nx || nx === "D" || !KM.has(s, "brk_" + nx) || !KM.readyBreak(s)) return [];
    return KM.rankUp(s);
  };
  const gainBase = KM.gainExp;
  KM.gainExp = function (s, n) { const m = gainBase(s, n); if (!s._breaking) { s._breaking = true; m.push(...KM.tryBreak(s)); s._breaking = false; } return m; };

  /* ---------------- Mạch Ẩn tầng 2–5: chiêu riêng mạnh dần ---------------- */
  const skillBase = KM.skill;
  KM.OWN_TIER_MUL = [1, 1, 1.3, 1.6, 2.0, 2.6];
  KM.skill = function (s, id) {
    const sk = skillBase(s, id);
    if (id !== "own" || !sk || (s.ownTier || 1) <= 1) return sk;
    const m = KM.OWN_TIER_MUL[s.ownTier];
    const o = Object.assign({}, sk, { name: sk.name + " · tầng " + s.ownTier });
    if (o.mult) o.mult = Math.round(o.mult * m * 100) / 100;
    if (o.heal) o.heal = Math.min(0.6, o.heal * m);
    if (o.guard) o.guard = Math.min(0.8, o.guard + 0.05 * (s.ownTier - 1));
    if (o.eva) o.eva = o.eva + 3 * (s.ownTier - 1);
    if (s.ownTier >= 4 && o.mult) o.ranged = true;
    return o;
  };

  /* ---------------- Hồ sơ chứng cứ (Arc 8) ---------------- */
  KM.evidence = function (s) {
    const L = [];
    const add = (ok, name, pts) => ok && L.push({ name, pts });
    add(s.inv.khuon_dong, "Khuôn đồng Thiên Ma Chưởng", 3);
    add(!s.inv.khuon_dong && s.inv.so_kho, "Sổ kho chép tay", 1);
    add(s.inv.so_sach_giao, "Sổ sách thủy trại", 3);
    add(s.inv.danh_sach, "Danh sách ám sát Huyết Ảnh", 3);
    add(s.inv.thu_minh_chu || s.inv.ban_chep, "Thư tay Minh chủ", 3);
    add(s.inv.an_tin, "Ấn tín phủ Minh chủ", 3);
    add(KM.has(s, "lien_witness") && !KM.dead(s, "lien_nhi"), "Liên Nhi (nhân chứng sống)", 2);
    add(!KM.dead(s, "lao_ho") && KM.has(s, "laoho_2"), "Lão Hồ (người cứu Shen đêm cháy)", 2);
    add(KM.has(s, "tieu_hao_return") && !KM.dead(s, "tieu_hao"), "Tiêu Hạo (lời khai đêm mất kiếm phổ)", 2);
    add(KM.has(s, "da_linh_witness"), "Dạ Linh (vụ ám sát trong Ma Lao)", 1);
    add(KM.has(s, "ev_trieu_phuc"), "Lời khai quản gia Triệu Phúc", 1);
    add(KM.has(s, "ev_truong_lao"), "Lời khai trưởng lão bị mua chuộc", 1);
    add(KM.has(s, "ev_mat_that"), "Sổ chi bạc trong mật thất", 3);
    add(KM.has(s, "ev_huyet_quan"), "Huyết Ảnh trà trộn trong quân Minh", 1);
    add(KM.has(s, "ev_lao_ho_ke"), "Lão Hồ kể toàn bộ đêm Thẩm gia trang", 1);
    add(KM.has(s, "vanphi_side"), "Tạ Vân Phi đứng ra làm chứng", 2);
    add(KM.has(s, "chan_giai_trade"), "Lời khai của chính Tạ Thiên Hành", 3);
    return { score: L.reduce((a, x) => a + x.pts, 0), list: L };
  };

  /* ---------------- Đồng hành chết vĩnh viễn ---------------- */
  KM.COMPANIONS = ["to_van_yen", "lao_ho", "phuong_nhi", "duong_nhat_anh", "thanh_hu", "hue_nang", "lien_nhi", "tieu_hao", "da_linh", "ta_van_phi"];
  KM.kill = function (s, n, why) {
    if (KM.dead(s, n)) return [];
    KM.flag(s, "dead_" + n);
    KM.addLedger(s, { actor: why.actor || "—", action: why.action, target: KM.NPCS[n].name, witness: why.witness || "—", pending: "Không thể cứu vãn", trigger: "—" });
    return ["✝ " + KM.NPCS[n].name + " đã chết. " + (why.note || "")];
  };

  /* ---------------- Hiệu ứng mở rộng ---------------- */
  const applyXBase = KM.applyX;
  KM.applyX = function (s, eff, tx) {
    if (!eff) return [];
    if (tx && s.claimed.includes(tx)) return [];
    const m = [];
    const plain = Object.assign({}, eff);
    ["breakTo", "tier", "ownTier", "lo", "front", "die", "mirror", "evGain", "endFlag", "traitPick", "giveTier", "vodanh", "learnMastery", "water", "tierWeapon", "moneyPct", "fx", "hurt"].forEach((k) => delete plain[k]);
    if (eff.die) [].concat(eff.die).forEach((d) => m.push(...KM.kill(s, d.n || d, d.n ? d : { action: "Tử trận", actor: "—" })));
    if (eff.lo) { const b = s.lo || 0; let v = eff.lo; if (v > 0 && KM.hasTrait(s, "anh_tu")) v = Math.round(v * 0.6); s.lo = Math.max(0, Math.min(100, b + v)); m.push("Lộ diện " + (v > 0 ? "+" : "") + v + " (" + b + " → " + s.lo + "/100)"); }
    if (eff.front) { s.front = s.front || {}; for (const k in eff.front) { const b = s.front[k] || 0; s.front[k] = Math.max(0, Math.min(100, b + eff.front[k])); m.push("Sĩ khí " + KM.FRONT_NAME[k] + " " + (eff.front[k] > 0 ? "+" : "") + eff.front[k] + " (" + b + " → " + s.front[k] + ")"); } }
    if (eff.mirror) KM.makeMirror(s);
    if (eff.hurt) { s.hurt = s.hurt || {}; s.hurt[eff.hurt] = (s.hurt[eff.hurt] || 0) + 1; m.push("Đối thủ cũng đã bị thương: lần sau vào trận, máu của nó chỉ còn ×" + Math.pow(0.85, s.hurt[eff.hurt]).toFixed(2) + "."); }
    if (eff.moneyPct) { const lost = Math.floor(s.money * -eff.moneyPct); m.push(...KM.apply(s, { money: -lost })); }
    if (eff.tierWeapon) { const wt = s.cls ? KM.CLASSES[s.cls].weapon : "kiem"; m.push(...KM.addItem(s, KM.TIER_WEAPON[eff.tierWeapon][wt] || KM.TIER_WEAPON[eff.tierWeapon].kiem, 1)); }
    if (eff.water) {
      let n = eff.water - (KM.has(s, "a5_guide") ? 1 : 0); const have = s.inv.tui_nuoc || 0, use = Math.min(n, have), miss = n - use;
      if (use) { s.inv.tui_nuoc -= use; if (!s.inv.tui_nuoc) delete s.inv.tui_nuoc; }
      m.push("Đi sa mạc " + n + " ngày: uống " + use + " túi nước (còn " + (s.inv.tui_nuoc || 0) + ")" + (miss ? ", thiếu " + miss + " ngày nước." : "."));
      if (miss) { const d = KM.derived(s), loss = Math.floor(d.maxHP * 0.15 * miss); s.cur.hp = Math.max(1, s.cur.hp - loss); m.push("Khát cháy họng: −" + loss + " HP (15% HP tối đa × " + miss + " ngày)."); }
    }
    if (eff.vodanh) { const wt = s.cls ? KM.CLASSES[s.cls].weapon : "kiem"; m.push(...KM.addItem(s, "vo_danh_" + wt, 1)); }
    if (eff.learnMastery) { const pool = s.skills.filter((x) => x !== "danh_thuong" && x !== "chiu_don"); pool.forEach((id) => (s.use[id] = Math.max(s.use[id] || 0, KM.MASTERY_AT[Math.min(4, KM.mastery(s, id) + 1)]))); m.push("Mọi kỹ năng lên thêm một mức thuần thục."); }
    if (eff.water && plain.time && KM.has(s, "a5_guide")) plain.time = Math.max(4, plain.time - 4);
    m.push(...applyXBase(s, plain, tx));
    if (eff.fx) m.push(...(eff.fx(s) || []));
    if (eff.ownTier && (s.ownTier || 1) < eff.ownTier && s.ownArt) { s.ownTier = eff.ownTier; m.push("Mạch Ẩn khai thông tầng " + s.ownTier + ": " + KM.skill(s, "own").name + " (×" + KM.OWN_TIER_MUL[s.ownTier] + " uy lực gốc)."); }
    if (eff.tier) m.push(...KM.tierUp(s, eff.tier.n || eff.tier, eff.tier.pick));
    if (eff.breakTo) { KM.flag(s, "brk_" + eff.breakTo); const r = KM.tryBreak(s); m.push(...(r.length ? r : ["Đã đủ điều kiện đột phá " + KM.RANK_NAME[eff.breakTo] + ". Shen sẽ đột phá ngay khi EXP chạm trần cảnh giới hiện tại (Lv " + KM.cap(s) + ")."])); }
    else m.push(...KM.tryBreak(s));
    return m;
  };

  /* ---------------- Bóng tâm ma: sao chép chính Shen ---------------- */
  KM.makeMirror = function (s) {
    const e = KM.eff(s), wt = KM.weaponType(s), w = s.gear.weapon ? KM.ITEMS[s.gear.weapon] : null;
    const sks = s.skills.map((id) => KM.skill(s, id)).concat(s.ownArt ? [KM.skill(s, "own")] : []).filter((k) => k && k.mult).sort((a, b) => b.mult * (b.hits || 1) - a.mult * (a.hits || 1)).slice(0, 3)
      .map((k) => ({ name: k.name + " (bóng)", mult: k.mult, hits: k.hits, src: k.src, cd: Math.max(1, k.cd || 1) }));
    KM.ENEMIES.tam_ma = { name: "Bóng tâm ma", rank: s.rank, lv: s.level, st: { STR: e.STR, AGI: e.AGI, VIT: e.VIT, INT: e.INT, WIS: e.WIS, LUK: e.LUK }, wtype: wt, watk: w ? w.atk : 0, skills: sks, hpMul: 1, expMul: 1.0, boss: true, portrait: "shen", loot: [], coin: [0, 0, 0] };
  };
  // Có sẵn một bản mặc định để kiểm thử cảnh
  KM.ENEMIES.tam_ma = { name: "Bóng tâm ma", rank: "S", lv: 74, st: { STR: 60, AGI: 60, VIT: 60, INT: 60, WIS: 60, LUK: 60 }, wtype: "kiem", watk: 60, skills: [{ name: "Ảnh kiếm", mult: 1.6, cd: 1, src: "p" }], hpMul: 1, expMul: 1, boss: true, portrait: "shen", loot: [], coin: [0, 0, 0] };

  /* ---------------- Sĩ khí chiến tuyến (Arc 7) ---------------- */
  KM.FRONT_DECAY = 6;
  KM.FRONT_NAME = { nga_mi: "tuyến Nga Mi", vo_dang: "tuyến Võ Đang", lac_ha: "tuyến Lạc Hà" };
  KM.FRONT_LOSS = { nga_mi: ["to_van_yen", "Tô Vân Yên ở lại quân y đến người cuối cùng."], vo_dang: ["thanh_hu", "Chân nhân Thanh Hư tử chiến trước Tử Tiêu Cung."], lac_ha: ["phuong_nhi", "Long Phượng Nhi ngã xuống trước cổng Long Môn Tiêu Cục."] };
  const newDayBase = KM.newDay;
  KM.newDay = function (s) {
    const m = newDayBase(s);
    if (s.front && KM.has(s, "a7_start") && !KM.has(s, "a7_done")) {
      for (const k in s.front) {
        if (KM.has(s, "fall_" + k)) continue;
        if (s.place === k) continue;
        const b = s.front[k]; s.front[k] = Math.max(0, b - KM.FRONT_DECAY);
        m.push("Sĩ khí " + KM.FRONT_NAME[k] + ": " + b + " − " + KM.FRONT_DECAY + " = " + s.front[k] + " (Shen vắng mặt)");
        if (s.front[k] <= 0) { KM.flag(s, "fall_" + k); m.push(KM.FRONT_NAME[k][0].toUpperCase() + KM.FRONT_NAME[k].slice(1) + " THẤT THỦ."); const [n, note] = KM.FRONT_LOSS[k]; if (!KM.has(s, "saved_" + n)) m.push(...KM.kill(s, n, { actor: "Võ Lâm Minh / Huyết Ảnh Lâu", action: "Chết khi " + KM.FRONT_NAME[k] + " thất thủ", note })); }
      }
    }
    if (KM.has(s, "a8_start") && !KM.has(s, "a8_hoi") && KM.since(s, "a8") < 10) {
      const r = KM.d100(s); if (r <= 40) { s.threat = true; m.push("Đêm qua có bóng người lảng vảng quanh chỗ trú của nhân chứng (d100 = " + r + " ≤ 40)."); }
    }
    return m;
  };

  /* ---------------- Sự kiện tự kích hoạt ---------------- */
  const trigBase = KM.hubTrigger;
  KM.hubTrigger = function (s) {
    const t = trigBase(s); if (t) return t;
    for (const f of KM.TRIGGERS) { const r = f(s); if (r) return r; }
    return null;
  };

  /* ---------------- Bản đồ: mở khóa theo tiến trình ---------------- */
  KM.PLACE_OPEN = {
    kim_lang: (s) => KM.has(s, "a2_done") || "Hoàn thành Arc 2",
    ngoai_o: (s) => KM.has(s, "a2_done") || "Hoàn thành Arc 2",
    van_thuy: (s) => KM.has(s, "a3_done") || "Mở ở Arc 4",
    luong_chau: (s) => KM.has(s, "a4_done") || "Mở ở Arc 5",
    nguyet_nha: (s) => KM.has(s, "a5_start") || "Mở ở Arc 5",
    thanh_hoa: (s) => KM.has(s, "a5_gate_done") || (KM.has(s, "a5_start") ? "Phải qua Tam Quan theo cốt truyện" : "Mở ở Arc 5"),
    tuyet_linh: (s) => KM.has(s, "a5_done") || "Mở ở Arc 6",
    kiem_trung: (s) => (KM.has(s, "realm_open") && !KM.has(s, "realm_closed")) || (KM.has(s, "realm_closed") ? "Bí cảnh đã khép lại" : "Chỉ mở trong 7 ngày bí cảnh (Arc 6)"),
    nga_mi: (s) => KM.has(s, "a6_done") || "Mở ở Arc 7",
    vo_dang: (s) => KM.has(s, "a6_done") || "Mở ở Arc 7",
    thien_son: (s) => KM.has(s, "a8_done") || "Mở ở Arc 9",
  };
  const mapBase = KM.mapDests;
  KM.mapDests = function (s) {
    return mapBase(s).map((d) => {
      if (d.p === "kim_lang" && d.lock === "Arc 3 · sắp ra mắt") d.lock = "";
      const f = KM.PLACE_OPEN[d.p]; if (f) { const r = f(s); if (r !== true) d.lock = d.lock || r; }
      if (KM.has(s, "a9_climb") && !KM.has(s, "a9_done")) d.lock = "Đang leo Thiên Sơn, không thể quay đầu";
      return d;
    });
  };

  /* ---------------- Chọn bậc Võ Đạo (cảnh dùng chung) ---------------- */
  KM.SCENES = KM.SCENES || {};
  KM.SCENES.x_tier2 = { chapter: "Võ Đạo", title: "Bậc 2 · chọn chuyên môn", place: "temple", time: "day", cast: ["shen"],
    text: ["[Hệ Thống] Cảnh giới Nhất Lưu đã vững. Võ Đạo của Shen có thể rẽ theo một trong hai chuyên môn. Chọn rồi không đổi được."],
    choices: (s) => {
      const T2 = s.cls && KM.CLASS_TIERS[s.cls];
      if (!T2 || (s.tier || 1) >= 2) return [{ t: "Tiếp tục", go: "@hub" }];
      return T2.t2.map((o, i) => ({ t: o.name + " — chiêu " + KM.SKILLS[o.sk].name + ": " + KM.SKILLS[o.sk].desc, go: "@hub", eff: { tier: { n: 2, pick: i } } }));
    } };
  KM.TRIGGERS.push((s) => (s.rank !== "E" && s.rank !== "D" && s.cls && KM.CLASS_TIERS[s.cls] && (s.tier || 1) < 2 ? "x_tier2" : null));

  /* ---------------- Tiện ích hành động ---------------- */
  KM.rest = (s, price, label) => ({ t: label || "Thuê phòng nghỉ đêm", sub: price ? KM.money(price) : "", cost: 0, run: (s2) => KM.R(KM.apply(s2, { money: -Math.min(price, s2.money) }).concat(KM.sleep(s2))) });
  KM.trainAct = (label, sub) => ({ t: label || "Luyện công", sub, run: (s) => {
    const wt = KM.weaponType(s), pool = s.skills.filter((k) => k !== "danh_thuong" && k !== "chiu_don" && KM.SKILLS[k] && (!KM.SKILLS[k].w || KM.SKILLS[k].w === wt));
    const m = ["Shen luyện công cả buổi."];
    if (pool.length) { const id = pool[Math.floor(KM.rand(s) * pool.length)]; const b = KM.mastery(s, id); s.use[id] = (s.use[id] || 0) + 4; const a = KM.mastery(s, id); m.push("Luyện " + KM.SKILLS[id].name + ": " + s.use[id] + " lần dùng" + (a > b ? " → lên " + KM.MASTERY[a] + "!" : "")); }
    return KM.R(m.concat(KM.apply(s, { exp: Math.floor(KM.expReq(s.level) * 0.1) + 40 })));
  } });
  KM.huntAct = (label, sub, pool, note) => ({ t: label, sub, run: (s) => { const r = KM.d100(s); let f = pool[0][1]; for (const [p, foes] of pool) if (r <= p) { f = foes; break; } return KM.R([note || label + "."], { fight: { foes: f.slice(), opts: {} } }); } });
  KM.shopAct = (id, label) => ({ t: label || KM.SHOPS[id].name, cost: 0, run: () => KM.R([], { shop: id }) });
  KM.storyAct = (t, scene, show, sub, cost) => ({ t: "▶ " + t, sub, show, cost: cost == null ? 0 : cost, run: () => KM.R([], { scene }) });
})(typeof window !== "undefined" ? window : globalThis);
