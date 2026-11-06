/* =====================================================================
   KIẾM MỆNH · CHIẾN ĐẤU THEO LƯỢT
   Thứ tự mỗi đòn: 1. Né (bên bị đánh gieo d100) → 2. Chí mạng (bên đánh gieo d100)
   → 3. Biến thiên d20: ×(0.89 + d20/100) → 4. Trạng thái (d100)
   Sát thương = max(1, Công × Hệ số × Thưởng − Giáp × (1 − Xuyên giáp)) × Chí mạng × Biến thiên
   Hệ số công của loại vũ khí chỉ áp cho Đánh thường; kỹ năng dùng hệ số riêng.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});

  KM.makeFoe = function (id, i) {
    const E = KM.ENEMIES[id];
    const d = KM.derive(E.st, E.lv, { watk: E.watk, wtype: E.wtype });
    const hp = Math.floor(d.maxHP * E.hpMul);
    return { key: id + "_" + i, id, name: E.name, rank: E.rank, lv: E.lv, st: E.st, d, hp, maxHP: hp, nl: d.maxNL, wtype: E.wtype,
      skills: E.skills, cds: {}, stun: 0, weak: null, burn: 0, boss: !!E.boss, beast: !!E.beast, exp: Math.floor(KM.expReq(E.lv) * E.expMul), portrait: E.portrait };
  };

  KM.combat = {
    start(s, ids, opts) {
      opts = Object.assign({ canFlee: true }, opts || {});
      KM.recalc(s);
      const foes = ids.map((id, i) => KM.makeFoe(id, i));
      let cut = opts.foeHpMul || 1;
      if (opts.cuts) opts.cuts.forEach(([f, m]) => { if (KM.has(s, f)) cut *= m; });
      if (opts.hurt) cut *= Math.pow(0.85, (s.hurt && s.hurt[opts.hurt]) || 0);
      if (cut !== 1) foes.forEach((f) => (f.hp = f.maxHP = Math.max(1, Math.floor(f.hp * cut))));
      const luk = KM.eff(s).LUK;
      return { foes, round: 1, log: [], hist: [], cds: {}, close: false, kt: 0, buf: { guard: 0, guardT: 0, eva: 0, evaT: 0, counter: 0, counterT: 0 },
        poison: 0, rerollOn: false, rerolls: (luk >= 100 ? 3 : luk >= 50 ? 2 : luk >= 20 ? 1 : 0) + s.traits.reduce((n, t) => n + ((KM.TRAITS[t] && KM.TRAITS[t].rerolls) || 0), 0), revived: false, observed: [], learned: [], opts, over: null, tIdx: 0, firstStrike: !!opts.ambush || s.traits.some((t) => KM.TRAITS[t] && KM.TRAITS[t].first), usedKH: false };
    },
    alive: (c) => c.foes.filter((f) => f.hp > 0),
    target(c) { const t = c.foes[c.tIdx]; return t && t.hp > 0 ? t : this.alive(c)[0]; },
    setTarget(c, i) { if (c.foes[i] && c.foes[i].hp > 0) c.tIdx = i; },

    ready(s, c) {
      const list = s.skills.slice(); if (s.ownArt) list.splice(1, 0, "own");
      const wt = KM.weaponType(s);
      return list.map((id) => {
        const sk = KM.skill(s, id), cd = c.cds[id] || 0;
        let why = "";
        if (sk.w && sk.w !== wt) why = "cần " + KM.WEAPON_TYPES[sk.w].name.toLowerCase();
        else if (cd > 0) why = "hồi " + cd + " lượt";
        else if (sk.cost && sk.cost.sta && s.cur.sta < sk.cost.sta) why = "thiếu thể lực";
        else if (sk.cost && sk.cost.kh && s.cur.kh < sk.cost.kh) why = "thiếu Khí Huyết";
        else if (s.hidden === "tuyet_mach_kim_than" && sk.src === "n" && !sk.own) why = "Kim Thân không dùng nội công";
        return { id, sk, cd, ok: !why, why };
      });
    },

    // Gieo d100 cho người chơi, có thể dùng Cơ Duyên gieo lại khi thất bại
    pRoll(s, c, pct, label, wantOk) {
      let r = KM.d100(s), ok = r === 1 || r <= pct;
      let line = label + ": d100 = " + r + " / cần ≤ " + KM.fmtPct(pct);
      if (ok !== wantOk && c.rerollOn && c.rerolls > 0) {
        c.rerolls--; const r2 = KM.d100(s); ok = r2 === 1 || r2 <= pct;
        line += " → gieo lại (Cơ Duyên, còn " + c.rerolls + "): d100 = " + r2;
      }
      return { ok, line };
    },
    variance(s) { const r = KM.die(s, 20); return { m: 0.89 + r / 100, r }; },
    rangeMod(c, atkR, defR, who) {
      if (!c.close) return atkR > defR ? 1.1 : 1;
      let m = 1; if (atkR < defR) m *= 1.15;
      if (who === "thuong" && atkR > defR) m *= 0.85;
      return m;
    },

    // Người chơi đánh 1 đòn vào 1 mục tiêu
    pHit(s, c, t, sk, mult, o) {
      const L = c.log, d = KM.derived(s), wt = KM.weaponType(s), e = KM.eff(s);
      o = o || {};
      // 1. Né
      const ev = KM.rollPct(s, t.d.eva);
      if (ev.ok) {
        let line = "Né (" + t.name + "): d100 = " + ev.r + " / cần ≤ " + KM.fmtPct(t.d.eva) + " → né được";
        if (c.rerollOn && c.rerolls > 0) { c.rerolls--; const r2 = KM.d100(s); line += " → Shen gieo lại (Cơ Duyên): d100 = " + r2; if (!(r2 === 1 || r2 <= t.d.eva)) { L.push(line + " → trúng"); } else { L.push(line + " → vẫn né"); return 0; } }
        else { L.push(line + "."); return 0; }
      } else L.push("Né (" + t.name + "): d100 = " + ev.r + " / cần ≤ " + KM.fmtPct(t.d.eva) + " → trúng");
      // Công & hệ số
      const noi = sk.src === "n" && !sk.own;
      let atk = noi ? d.npow : d.patk;
      let m = mult * (1 + 0.15 * KM.mastery(s, o.id || "")) * (sk.lost || 1);
      if (noi) m *= KM.noiEff(s, sk);
      s.traits.forEach((t) => { const T = KM.TRAITS[t]; if (T && T.wmul && T.wmul[wt]) m *= T.wmul[wt]; });
      m *= KM.traitProd(s, noi || sk.own ? "noiMul" : "ngoaiMul");
      if (s.cur.hp < d.maxHP * 0.5) m *= KM.traitProd(s, "lowHp");
      if (KM.hasTrait(s, "ma_tinh")) m *= 1 + 0.03 * Math.floor((1 - s.cur.hp / d.maxHP) * 10);
      if (sk.rage) m *= 1 + (1 - s.cur.hp / d.maxHP);
      if (wt === "quyen" && c.kt) m *= 1 + 0.04 * c.kt;
      if (sk.kt && c.kt) { m *= 1 + 0.15 * c.kt; L.push("Dồn " + c.kt + " tầng Khí Thế: +" + c.kt * 15 + "%."); c.kt = 0; }
      m *= this.rangeMod(c, KM.WEAPON_TYPES[wt].range, KM.WEAPON_TYPES[t.wtype].range, wt);
      if (c.opts.road && s.horse && KM.HORSES[s.horse].mounted && wt === "thuong") m *= 1 + (s.gear.weapon && KM.ITEMS[s.gear.weapon].mounted ? KM.ITEMS[s.gear.weapon].mounted : 0.2);
      if (c.firstStrike) { const amb = !!c.opts.ambush, fm = amb && KM.hasTrait(s, "anh_tu") ? 2 : 1.3; m *= fm; L.push((amb ? "Đánh lén" : "Tiên Phát Chế Nhân") + ": ×" + fm + "."); c.firstStrike = false; }
      let pierce = (sk.pierce || 0) + (noi ? 0.3 : 0) + (wt === "dao" ? 0.2 : 0) + (s.gear.weapon && KM.ITEMS[s.gear.weapon].pierce ? KM.ITEMS[s.gear.weapon].pierce - 0.2 : 0);
      pierce = Math.min(0.9, pierce);
      const def = t.d.pdef * (1 - pierce);
      // 2. Chí mạng
      const cp = d.crit + (sk.crit || 0);
      const cr = this.pRoll(s, c, cp, "Chí mạng", true); L.push(cr.line + " → " + (cr.ok ? "CHÍ MẠNG" : "thường"));
      // 3. Biến thiên
      const v = this.variance(s);
      let dmg = Math.max(1, atk * m - def) * (cr.ok ? d.critDmg : 1) * v.m;
      dmg = Math.max(1, Math.floor(dmg));
      t.hp -= dmg;
      L.push((o.label || sk.name) + " → " + t.name + ": max(1, " + Math.round(atk * 10) / 10 + " × " + Math.round(m * 100) / 100 + " − " + Math.round(def * 10) / 10 + ")" + (cr.ok ? " × " + d.critDmg : "") + " × " + v.m.toFixed(2) + " (d20 = " + v.r + ") = " + dmg + " sát thương.");
      if (wt === "quyen") { const mx = (s.gear.weapon && KM.ITEMS[s.gear.weapon].maxKT) || 5; if (c.kt < mx) c.kt++; }
      // 4. Trạng thái
      const stun = o.stun != null ? o.stun : sk.stun;
      if (stun && t.hp > 0) { const r = KM.rollPct(s, stun * 100); L.push("Choáng: d100 = " + r.r + " / cần ≤ " + Math.round(stun * 100) + "% → " + (r.ok ? t.name + " bị choáng 1 lượt" : "không")); if (r.ok) t.stun = 1; }
      if (sk.weak && t.hp > 0) { t.weak = { pct: sk.weak, t: sk.turns || 2 }; L.push(t.name + " bị giảm " + sk.weak * 100 + "% công trong " + (sk.turns || 2) + " lượt."); }
      if (sk.burn && t.hp > 0) { const r = KM.rollPct(s, sk.burn * 100); L.push("Bỏng: d100 = " + r.r + " / cần ≤ " + Math.round(sk.burn * 100) + "% → " + (r.ok ? "trúng" : "không")); if (r.ok) t.burn = sk.turns || 3; }
      return dmg;
    },

    playerAct(s, c, action) {
      if (c.over) return;
      c.log = []; const L = c.log; c.usedKH = false;
      KM.recalc(s);
      const d = KM.derived(s);
      const pre = [], post = [];
      // ai ra tay trước: địch nhanh hơn (hoặc thương lượt đầu với Shen tầm ngắn hơn)
      const myR = KM.WEAPON_TYPES[KM.weaponType(s)].range;
      this.alive(c).forEach((f) => {
        const fR = KM.WEAPON_TYPES[f.wtype].range;
        let first = f.d.speed > d.speed;
        if (!c.close) { if (fR > myR && (f.wtype === "thuong" || KM.weaponType(s) === "quyen")) first = true; if (myR > fR && (KM.weaponType(s) === "thuong" || f.wtype === "quyen")) first = false; }
        if (c.firstStrike) first = false;
        (first ? pre : post).push(f);
      });
      if (pre.length) { L.push("— " + pre.map((f) => f.name).join(", ") + " ra tay trước (tốc độ / tầm đánh) —"); pre.forEach((f) => this.foeAct(s, c, f)); if (this.checkEnd(s, c)) return this.endRound(s, c); }
      // Hành động của Shen
      const t = this.target(c);
      if (action.type === "flee") {
        const top = this.alive(c).reduce((a, f) => Math.max(a, KM.rankIdx(f.rank)), 0);
        if (!c.opts.canFlee) L.push("Không có đường thoát.");
        else if ((KM.hasTrait(s, "than_hanh") && top <= KM.rankIdx(s.rank)) || (s.horse === "han_huyet" && c.opts.road)) { L.push("Shen thoát khỏi trận chiến."); c.over = "flee"; return this.endRound(s, c, true); }
        else {
          const fa = this.alive(c).reduce((a, f) => Math.max(a, f.st.AGI), 0);
          const p = Math.max(10, Math.min(90, 30 + (KM.eff(s).AGI - fa) * 3));
          const r = this.pRoll(s, c, p, "Bỏ chạy", true); L.push(r.line + " → " + (r.ok ? "thoát được" : "thất bại"));
          if (r.ok) { c.over = "flee"; return this.endRound(s, c, true); }
        }
      } else if (action.type === "item") {
        if (c.opts.noItems) { L.push("Trận này không được dùng thuốc."); return; }
        L.push(KM.useItem(s, action.id) || "Không dùng được.");
        if (KM.ITEMS[action.id] && KM.ITEMS[action.id].cure) c.poison = 0;
      } else if (action.type === "gap") {
        c.close = false; L.push("Shen lùi lại giãn khoảng cách. Lượt sau tính như lượt mở màn.");
        s.trend.thu++;
      } else if (action.type === "skill") {
        const r = this.ready(s, c).find((x) => x.id === action.id);
        if (!r || !r.ok) { L.push("Chiêu này chưa dùng được" + (r ? " (" + r.why + ")" : "") + "."); return; }
        const sk = r.sk;
        if (sk.cost && sk.cost.sta) s.cur.sta -= sk.cost.sta;
        if (sk.cost && sk.cost.kh) { s.cur.kh -= sk.cost.kh; c.usedKH = true; }
        if (sk.hp) { const loss = Math.floor(d.maxHP * sk.hp); s.cur.hp = Math.max(1, s.cur.hp - loss); L.push(sk.name + ": tự mất " + loss + " HP."); }
        if (s.hidden === "tuyet_mach_kiem_ma" && sk.src === "n" && sk.w === "kiem") { const loss = Math.floor(d.maxHP * 0.05); s.cur.hp = Math.max(1, s.cur.hp - loss); L.push("Kiếm Ma đốt máu: −" + loss + " HP."); }
        if (sk.cd) c.cds[action.id] = sk.cd + 1;
        s.use[action.id] = (s.use[action.id] || 0) + 1;
        this.resolve(s, c, sk, t, action.id);
      }
      post.forEach((f) => { if (f.hp > 0 && !c.over) this.foeAct(s, c, f); });
      this.endRound(s, c);
    },

    resolve(s, c, sk, t, id) {
      const L = c.log, d = KM.derived(s), wt = KM.weaponType(s);
      // trend cho võ công riêng
      s.trend[wt === "tay" ? "tay" : "binh"] += 1;
      if (sk.guard || sk.eva || sk.heal) s.trend.thu++; else s.trend.cong++;
      if ((sk.hits || 1) > 1 || (id === "danh_thuong" && wt === "quyen")) s.trend.nhanh++; else if (sk.mult >= 1.5) s.trend.nang++;
      if (sk.heal) { const b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * sk.heal * (KM.hasTrait(s, "y_thanh") ? 1.5 : 1))); L.push(sk.name + ": hồi " + (s.cur.hp - b) + " HP."); }
      if (sk.cleanse) { c.poison = 0; L.push("Giải sạch độc."); }
      if (sk.guard) { c.buf.guard = sk.guard; c.buf.guardT = sk.turns || 1; c.buf.counter = sk.counter || 0; c.buf.counterT = sk.counter ? (sk.turns || 1) : 0; L.push(sk.name + ": giảm " + sk.guard * 100 + "% sát thương phải nhận" + (sk.turns > 1 ? " trong " + sk.turns + " lượt" : " lượt này") + (sk.counter ? ", phản đòn ×" + sk.counter : "") + "."); }
      if (sk.eva) { c.buf.eva = sk.eva; c.buf.evaT = sk.turns || 1; c.buf.counter = sk.counter || 0; c.buf.counterT = sk.turns || 1; L.push(sk.name + ": né +" + sk.eva + "% trong " + (sk.turns || 1) + " lượt" + (sk.counter ? ", né được thì phản đòn ×" + sk.counter : "") + "."); }
      if (!sk.mult) return;
      if (id === "danh_thuong") return this.basic(s, c, t);
      const hits = sk.hits || 1;
      if (sk.aoe) {
        const tg = [t].concat(this.alive(c).filter((f) => f !== t)).slice(0, sk.aoe);
        tg.forEach((f) => this.pHit(s, c, f, sk, sk.mult, { id }));
      } else for (let h = 0; h < hits && t.hp > 0; h++) this.pHit(s, c, t, sk, sk.mult, { id, label: sk.name + (hits > 1 ? " (đòn " + (h + 1) + ")" : "") });
      this.deaths(s, c);
    },
    basic(s, c, t) {
      const wt = KM.weaponType(s), W = KM.WEAPON_TYPES[wt], sk = KM.SKILLS.danh_thuong;
      if (wt === "quyen") { for (let h = 0; h < 2 && t.hp > 0; h++) this.pHit(s, c, t, sk, W.atkMul, { id: "danh_thuong", label: "Liên Kích (đòn " + (h + 1) + ")" }); }
      else if (wt === "con") {
        const mx = (s.gear.weapon && KM.ITEMS[s.gear.weapon].sweep) || 3;
        [t].concat(this.alive(c).filter((f) => f !== t)).slice(0, mx).forEach((f, i) => this.pHit(s, c, f, sk, W.atkMul * (i ? 0.7 : 1), { id: "danh_thuong", label: "Quét Ngang", stun: 0.15 }));
      } else if (wt === "thuong") {
        [t].concat(this.alive(c).filter((f) => f !== t)).slice(0, 2).forEach((f, i) => this.pHit(s, c, f, sk, W.atkMul, { id: "danh_thuong", label: i ? "Xuyên thương" : "Đâm thương" }));
      } else this.pHit(s, c, t, sk, W.atkMul, { id: "danh_thuong", label: wt === "tay" ? "Đánh tay không" : "Đánh thường" });
      this.deaths(s, c);
    },
    deaths(s, c) {
      c.foes.forEach((f) => {
        if (f.hp <= 0 && !f.dead) {
          f.dead = true; f.hp = 0; c.log.push(f.name + " gục ngã.");
          if (KM.hasTrait(s, "huyet_chien")) { const d = KM.derived(s), b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * 0.1)); c.log.push("Huyết Chiến: +" + (s.cur.hp - b) + " HP."); }
        }
      });
    },

    foeAct(s, c, f) {
      const L = c.log;
      if (f.burn > 0) { const b = Math.floor(f.maxHP * 0.05); f.hp -= b; f.burn--; L.push(f.name + " bị bỏng: −" + b + " HP."); this.deaths(s, c); if (f.hp <= 0) return; }
      if (f.stun) { f.stun = 0; L.push(f.name + " còn choáng, mất lượt."); return; }
      const E2 = KM.ENEMIES[f.id];
      if (E2.phase2 && !f.p2 && f.hp < f.maxHP * 0.5) { f.p2 = true; f.skills = E2.phase2.skills; f.cds = {}; L.push("【Pha 2】 " + E2.phase2.line); }
      const sk = f.skills.find((x) => !(f.cds[x.name] > 0)) || { name: "Đánh thường", mult: 1.0, src: "p" };
      if (sk.cd) f.cds[sk.name] = sk.cd + 1;
      const hits = sk.hits || 1;
      for (let h = 0; h < hits && s.cur.hp > 0; h++) this.foeHit(s, c, f, sk, hits > 1 ? " (đòn " + (h + 1) + ")" : "");
    },
    foeHit(s, c, f, sk, suf) {
      const L = c.log, d = KM.derived(s), wt = KM.weaponType(s);
      const eva = d.eva + (c.buf.evaT > 0 ? c.buf.eva : 0);
      const ev = this.pRoll(s, c, eva, "Né (Shen)", true);
      if (ev.ok) {
        L.push(ev.line + " → né được " + sk.name + suf + ".");
        if (c.buf.counterT > 0 && c.buf.evaT > 0 && c.buf.counter) { const dm = Math.max(1, Math.floor(d.patk * c.buf.counter - f.d.pdef)); f.hp -= dm; L.push("Phản đòn: " + dm + " sát thương lên " + f.name + "."); this.deaths(s, c); }
        return;
      }
      L.push(ev.line + " → trúng");
      const noi = sk.src === "n";
      let atk = noi ? f.d.npow : f.d.patk;
      let m = sk.mult * this.rangeMod(c, KM.WEAPON_TYPES[f.wtype].range, KM.WEAPON_TYPES[wt].range, f.wtype);
      if (f.weak && f.weak.t > 0) m *= 1 - f.weak.pct;
      let pierce = (noi ? 0.3 : 0) + (f.wtype === "dao" ? 0.2 : 0);
      const def = d.pdef * (1 - pierce);
      const cr = KM.rollPct(s, f.d.crit);
      const v = this.variance(s);
      let dmg = Math.max(1, atk * m - def) * (cr.ok ? f.d.critDmg : 1) * v.m;
      if (!noi && KM.hasTrait(s, "thiet_cot")) dmg *= 0.9;
      dmg *= KM.traitProd(s, "taken");
      if (c.buf.guardT > 0) dmg *= 1 - c.buf.guard;
      dmg = Math.max(1, Math.floor(dmg));
      s.cur.hp -= dmg;
      if (sk.drain) { const h = Math.floor(dmg * sk.drain); f.hp = Math.min(f.maxHP, f.hp + h); L.push(f.name + " hút " + h + " HP."); }
      L.push("Chí mạng (" + f.name + "): d100 = " + cr.r + " / cần ≤ " + KM.fmtPct(f.d.crit) + (cr.ok ? " → CHÍ MẠNG" : " → thường") + " · d20 = " + v.r + " → " + f.name + " dùng " + sk.name + suf + ": −" + dmg + " HP" + (c.buf.guardT > 0 ? " (đã giảm " + c.buf.guard * 100 + "%)" : "") + ".");
      if (s.hidden === "tuyet_mach_kim_than" && c.kt < 5) c.kt++;
      if (c.buf.guardT > 0 && c.buf.counter && c.buf.counterT > 0 && !c.buf.evaT) { const dm = Math.max(1, Math.floor(d.patk * c.buf.counter - f.d.pdef)); f.hp -= dm; L.push("Phản đòn: " + dm + " sát thương lên " + f.name + "."); this.deaths(s, c); }
      if (sk.poison) {
        const r = KM.rollPct(s, sk.poison * 100);
        if (r.ok && KM.hasTrait(s, "doc_the") && KM.rankIdx(f.rank) <= 2) { const g = Math.floor(d.maxKH * 0.1); s.cur.kh = Math.min(d.maxKH, s.cur.kh + g); L.push("Trúng độc (d100 = " + r.r + ") → Độc Thể hấp thụ, +" + g + " Khí Huyết."); }
        else { L.push("Trúng độc: d100 = " + r.r + " / cần ≤ " + Math.round(sk.poison * 100) + "% → " + (r.ok ? "trúng độc 3 lượt" : "không")); if (r.ok) c.poison = 3; }
      }
      if (sk.stun) { const r = KM.rollPct(s, sk.stun * 100); L.push("Choáng: d100 = " + r.r + " / cần ≤ " + Math.round(sk.stun * 100) + "% → " + (r.ok ? "Shen bị choáng, mất lượt kế" : "không")); if (r.ok) c.pStun = 1; }
      if (s.cur.hp <= 0 && KM.hasTrait(s, "bat_tu") && !c.revived) { c.revived = true; s.cur.hp = Math.floor(d.maxHP * 0.2); s.weakUntil = s.day + 1; L.push("Bất Tử Thân: Shen gượng dậy với " + s.cur.hp + " HP! (suy yếu đến hết ngày mai)"); }
    },

    checkEnd(s, c) {
      this.deaths(s, c);
      if (!this.alive(c).length) { c.over = "win"; return true; }
      if (s.cur.hp <= 0) { s.cur.hp = 0; c.over = "lose"; return true; }
      return false;
    },
    endRound(s, c, fled) {
      const L = c.log, d = KM.derived(s);
      if (!fled && !this.checkEnd(s, c)) {
        if (c.poison > 0) { const p = Math.floor(d.maxHP * 0.04); s.cur.hp -= p; c.poison--; L.push("Độc phát tác: −" + p + " HP."); if (s.cur.hp <= 0 && KM.hasTrait(s, "bat_tu") && !c.revived) { c.revived = true; s.cur.hp = Math.floor(d.maxHP * 0.2); L.push("Bất Tử Thân: Shen gượng dậy với " + s.cur.hp + " HP!"); } }
        s.cur.sta = Math.min(d.maxSTA, s.cur.sta + 5);
        s.traits.forEach((t) => { const g = KM.TRAITS[t] && KM.TRAITS[t].regen; if (!g) return;
          if (g.hp && s.cur.hp > 0) { const b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * g.hp)); if (s.cur.hp > b) L.push(KM.TRAITS[t].name + ": +" + (s.cur.hp - b) + " HP."); }
          if (g.kh) s.cur.kh = Math.min(d.maxKH, s.cur.kh + Math.floor(d.maxKH * g.kh));
          if (g.sta) s.cur.sta = Math.min(d.maxSTA, s.cur.sta + Math.floor(d.maxSTA * g.sta)); });
        if (!c.usedKH) s.cur.kh = Math.min(d.maxKH, s.cur.kh + Math.floor(d.maxKH * 0.1));
        for (const k in c.cds) if (c.cds[k] > 0) c.cds[k]--;
        c.foes.forEach((f) => { for (const k in f.cds) if (f.cds[k] > 0) f.cds[k]--; if (f.weak && --f.weak.t <= 0) f.weak = null; });
        ["guardT", "evaT", "counterT"].forEach((k) => c.buf[k] > 0 && c.buf[k]--);
        c.close = true;
        this.checkEnd(s, c);
      }
      c.hist.push({ round: c.round, lines: L.slice() });
      if (!c.over) c.round++;
      // choáng: Shen mất lượt kế → địch đánh luôn
      if (c.pStun && !c.over) { c.pStun = 0; c.log = ["Shen bị choáng, mất lượt."]; this.alive(c).forEach((f) => this.foeAct(s, c, f)); this.endRound(s, c); }
    },

    observe(s, c, f) {
      const out = [f.name + " · Rank " + f.rank + " (" + KM.RANK_NAME[f.rank] + ") · Lv " + f.lv + " · " + KM.WEAPON_TYPES[f.wtype].name];
      out.push("HP " + Math.max(0, f.hp) + "/" + f.maxHP + " · Công " + Math.round(f.d.patk) + " · Giáp " + f.d.pdef + " · Né " + f.d.eva + "% · Chí mạng " + f.d.crit + "%");
      out.push("Chiêu: " + f.skills.map((k) => k.name + " (×" + k.mult + (k.hits ? "×" + k.hits : "") + (k.src === "n" ? ", nội công" : "") + ")").join(", "));
      if (KM.eff(s).INT >= 30) out.push("Sơ hở: " + (f.d.eva < 8 ? "thân pháp chậm, đánh nhiều đòn sẽ hiệu quả" : f.d.pdef > 15 ? "giáp dày, nên dùng nội công hoặc đao" : "không có điểm yếu rõ rệt"));
      if (!c.observed.includes(f.key)) c.observed.push(f.key);
      const E = KM.ENEMIES[f.id];
      if (E.teach && KM.hasTrait(s, "quai_nhan") && !s.skills.includes(E.teach)) { out.push(...KM.learn(s, E.teach).map((l) => "Quái Nhãn — " + l)); }
      return out;
    },

    finish(s, c, tx) {
      const msgs = [];
      if (c.over === "win") {
        s.stats.wins++;
        c.foes.forEach((f) => { s.stats.kills++; msgs.push(f.name + " (Lv " + f.lv + "): " + f.exp + " EXP"); });
        if (KM.sideKill) c.foes.forEach((f) => msgs.push(...KM.sideKill(s, f.id)));
        const total = c.foes.reduce((a, f) => a + f.exp, 0);
        msgs.push(...KM.gainExp(s, total));
        if (!c.opts.noLoot && !(tx && s.claimed.includes("loot_" + tx))) { if (tx) s.claimed.push("loot_" + tx); c.foes.forEach((f) => msgs.push(...KM.rollLoot(s, f))); }
        if (KM.weaponType(s) === "kiem" && c.foes.some((f) => KM.rankIdx(f.rank) > KM.rankIdx(s.rank))) KM.flag(s, "killed_higher_sword");
        // Đột phá Rank D: thắng 1 đối thủ Rank D đơn đấu
        const nx = KM.RANKS[KM.rankIdx(s.rank) + 1];
        if (KM.readyBreak(s) && nx === "D" && c.foes.length === 1 && KM.rankIdx(c.foes[0].rank) >= 1) msgs.push(...KM.rankUp(s));
        else if (nx === "D" && c.foes.length === 1 && KM.rankIdx(c.foes[0].rank) >= 1 && !KM.readyBreak(s)) msgs.push("Thắng đối thủ Rank D, nhưng EXP chưa chạm trần Tam Lưu nên chưa đột phá được.");
      } else if (c.over === "lose") { s.stats.losses++; s.cur.hp = 1; }
      KM.recalc(s);
      return msgs;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
