/* =====================================================================
   KIẾM MỆNH · GIAO DIỆN
   ===================================================================== */
(function () {
  const KM = window.KM;
  const $ = (q) => document.querySelector(q);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const AUTO = "km_auto", SLOT = (i) => "km_slot_" + i;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };

  const UI = { s: null, tab: "story", msgs: [], view: null, combat: null, ctx: null, sel: [], iq: 0, pick: null, sellMode: false, title: true };
  window.UI = UI;

  /* ---------------- Tiện ích ---------------- */
  const qCls = (q) => "q q" + Math.max(0, KM.QUALITIES.indexOf(q));
  const qTag = (q) => (q ? ' <i class="' + qCls(q) + '">' + esc(q) + "</i>" : "");
  const rTag = (r) => '<i class="rank r' + KM.rankIdx(r) + '">' + esc(r) + "</i>";
  const bar = (cls, cur, max, label) => '<div class="bar ' + cls + '"><i style="width:' + Math.max(0, Math.min(100, (cur / max) * 100)).toFixed(1) + '%"></i><span>' + esc(label) + " " + Math.max(0, Math.floor(cur)) + "/" + Math.floor(max) + "</span></div>";
  const msgClass = (m) => (/^\s*(Lên Level|ĐỘT PHÁ)/.test(m) ? "lvup" : /d100|d20|Kiểm tra|\dd\d/.test(m) ? "dice" : "");
  const msgsBox = (arr) => (arr && arr.length ? '<div class="msgs" aria-live="polite">' + arr.map((m) => '<div class="' + msgClass(m) + '">' + esc(m) + "</div>").join("") + "</div>" : "");
  const line = (t) => (t.startsWith(">") ? '<p class="say">' + esc(t.slice(1).trim()) + "</p>" : t.startsWith("[") ? '<p class="sys">' + esc(t.replace(/^\[|\]$/g, "")) + "</p>" : "<p>" + esc(t) + "</p>");
  function save() { if (UI.s) store.set(AUTO, KM.exportSave(UI.s)); }
  function push(arr) { if (arr && arr.length) UI.msgs.push(...arr); }
  function stage(place, time, cast, chip) {
    return '<div class="stage">' + KM.background(place, time) + '<div class="tchip">' + esc(chip) + "</div>" +
      '<div class="cast">' + (cast || []).map((k) => '<figure class="pt">' + KM.portrait(k) + "<figcaption>" + esc(KM.portraitLabel(k)) + "</figcaption></figure>").join("") + "</div></div>";
  }
  const TIME_LABEL = { day: "Ban ngày", dusk: "Hoàng hôn", night: "Ban đêm", rain: "Đêm mưa", indoor: "Trong nhà" };
  const slotTime = (s) => ["day", "day", "night", "night"][s.slot];

  /* ---------------- Điều hướng ---------------- */
  function go(target) {
    const s = UI.s;
    UI.view = null;
    if (!target) return;
    if (target === "@hub" || target === "@back") { s.scene = null; s.hub = s.place; return checkHub(); }
    push(KM.enterScene(s, target));
    const sc = KM.SCENES[target];
    if (sc && sc.special === "hub") { s.hub = sc.hub; s.scene = null; checkHub(); }
    else if (sc && sc.special === "travel") { push(KM.startTravel(s, sc.dest)); s.travelGo = sc.go; }
  }
  function checkHub() {
    const s = UI.s;
    if (!s.hub) return;
    const t = KM.hubTrigger(s);
    if (t) { s.hub = null; go(t); }
  }
  function startFight(def, ctx) {
    const s = UI.s, o = Object.assign({}, def.opts || {});
    if (o.foeHpMulFlag && KM.has(s, o.foeHpMulFlag)) o.foeHpMul = 0.8;
    UI.combat = KM.combat.start(s, def.foes, o);
    UI.ctx = Object.assign({ win: def.win, lose: def.lose, after: def.after, tx: def.tx }, ctx);
    UI.cmsgs = null; UI.tab = "story";
  }
  function endFight() {
    const s = UI.s, c = UI.combat, ctx = UI.ctx, won = c.over === "win";
    UI.combat = null; UI.ctx = null;
    push(UI.cmsgs || []);
    if (ctx.from === "scene") { if (c.over === "flee") { s.scene = null; s.hub = s.place; checkHub(); } else go(won ? ctx.win : ctx.lose); }
    else if (ctx.from === "hub") { if (ctx.after) push(ctx.after(s, won)); if (c.over === "lose") push(["Shen gục ngã, được người qua đường khiêng về. HP còn 1."]); checkHub(); }
    else if (ctx.from === "travel") { if (c.over === "lose") push(["Shen bị đánh gục, bọn cướp lấy đi một ít tiền."].concat(KM.apply(s, { money: -Math.floor(s.money * 0.1) }))); }
    UI.cmsgs = null;
  }

  /* ---------------- Hành động ---------------- */
  const A = {
    newGame() { UI.s = KM.newGame(); UI.title = false; UI.msgs = []; UI.tab = "story"; UI.sel = []; KM.offerTraits(UI.s); push(KM.enterScene(UI.s, "p_rain")); },
    cont() { const r = KM.importSave(store.get(AUTO) || ""); if (r.s) { UI.s = r.s; UI.title = false; UI.msgs = []; if (!UI.s.traitOffer.length) KM.offerTraits(UI.s); } else alert(r.err); },
    choose(i) {
      const s = UI.s; UI.msgs = [];
      const r = KM.choose(s, i); push(r.msgs); if (r.go) go(r.go);
    },
    fightScene() { const sc = KM.SCENES[UI.s.scene]; UI.msgs = []; startFight(sc.fight, { from: "scene" }); },
    special(kind, arg) {
      const s = UI.s, sc = KM.SCENES[s.scene];
      if (kind === "trait") { const i = UI.sel.indexOf(arg); if (i >= 0) UI.sel.splice(i, 1); else if (UI.sel.length < 2) UI.sel.push(arg); return; }
      if (kind === "reroll") { if (KM.rerollTraits(s)) UI.sel = []; return; }
      if (kind === "traitsOk") { if (KM.pickTraits(s, UI.sel)) { UI.msgs = ["Đặc tính: " + UI.sel.map((t) => KM.TRAITS[t].name).join(", ") + "."]; UI.sel = []; go(sc.go); } return; }
      if (kind === "answer") { KM.answerInterview(s, UI.iq, arg); UI.iq++; if (UI.iq >= KM.INTERVIEW.length) { UI.iq = 0; UI.msgs = []; go(sc.go); } return; }
      if (kind === "pick") { UI.pick = arg; return; }
      if (kind === "artOk") { UI.msgs = KM.setOwnArt(s, UI.pick); UI.pick = null; go(sc.go); return; }
      if (kind === "classOk") { UI.msgs = KM.setClass(s, UI.pick); UI.pick = null; go(sc.go); return; }
    },
    rank(i) { push(KM.claimRank(UI.s, i)); if (KM.SCENES[UI.s.scene] && KM.SCENES[UI.s.scene].special === "rank") go("@hub"); },
    loc(id) { UI.view = UI.view && UI.view.kind === "loc" && UI.view.id === id ? null : { kind: "loc", id }; },
    hubAct(loc, i) {
      const s = UI.s; UI.msgs = [];
      const r = KM.hubAct(s, loc, i); push(r.msgs);
      if (r.scene) { s.hub = null; go(r.scene); return; }
      if (r.fight) { startFight(r.fight, { from: "hub" }); return; }
      if (r.shop) UI.view = { kind: "shop", id: r.shop }; else if (r.horses) UI.view = { kind: "horses" }; else if (r.forge) UI.view = { kind: "forge" };
      checkHub();
    },
    map() { UI.view = { kind: "map" }; UI.mapSel = null; },
    mapSel(p) { UI.mapSel = p; },
    travel(p) { const s = UI.s; UI.msgs = KM.startTravel(s, p); s.travelGo = null; s.hub = null; UI.view = null; UI.mapSel = null; },
    step() {
      const s = UI.s; UI.msgs = [];
      const r = KM.travelStep(s); push(r.msgs);
      if (r.fight) { startFight({ foes: r.fight, opts: { road: true } }, { from: "travel" }); return; }
      if (!s.travel) { if (s.travelGo) { const g = s.travelGo; s.travelGo = null; go(g); } else { s.hub = s.place; checkHub(); } }
    },
    buy(shop, i) { const s = UI.s; const e = KM.shopStock(s, shop)[i]; UI.msgs = KM.buy(s, shop, e); },
    sell(id) { UI.msgs = KM.sell(UI.s, id); },
    horse(id) { UI.msgs = KM.buyHorse(UI.s, id); },
    enh(slot) { UI.msgs = KM.enhance(UI.s, slot); },
    back() { UI.view = null; UI.sellMode = false; },
    sellMode() { UI.sellMode = !UI.sellMode; },
    // chiến đấu
    act(type, id) { const s = UI.s, c = UI.combat; KM.combat.playerAct(s, c, { type, id }); if (c.over) UI.cmsgs = KM.combat.finish(s, c, UI.ctx.tx); },
    target(i) { KM.combat.setTarget(UI.combat, i); },
    observe(i) { const c = UI.combat; UI.obs = KM.combat.observe(UI.s, c, c.foes[i]); },
    reroll() { UI.combat.rerollOn = !UI.combat.rerollOn; },
    endFight() { endFight(); },
    // nhân vật & đồ
    alloc(k, n) { KM.allocate(UI.s, k, n); },
    equip(id) { UI.msgs = KM.equip(UI.s, id); },
    unequip(slot) { UI.msgs = KM.unequip(UI.s, slot); },
    use(id) { const m = KM.useItem(UI.s, id); UI.msgs = m ? [m] : []; },
    tab(t) { UI.tab = t; UI.obs = null; },
    // lưu
    saveSlot(i) { store.set(SLOT(i), KM.exportSave(UI.s)); UI.msgs = ["Đã lưu vào ô " + i + "."]; },
    loadSlot(i) { const r = KM.importSave(store.get(SLOT(i)) || ""); if (r.s) { UI.s = r.s; UI.title = false; UI.combat = null; UI.view = null; UI.tab = "story"; UI.msgs = ["Đã tải ô " + i + "."]; } else UI.msgs = [r.err]; },
    delSlot(i) { if (confirm("Xóa ô lưu " + i + "?")) store.del(SLOT(i)); },
    exportFile() {
      const blob = new Blob([KM.exportSave(UI.s)], { type: "application/json" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "kiem-menh-ngay" + UI.s.day + ".json"; document.body.appendChild(a); a.click(); a.remove();
    },
    importText() { const t = $("#imp").value.trim(); const r = KM.importSave(t); if (r.s) { UI.s = r.s; UI.title = false; UI.combat = null; UI.view = null; UI.tab = "story"; UI.msgs = ["Đã nhập file lưu."]; } else UI.msgs = [r.err]; },
    importFile(ev) { const f = ev.target.files[0]; if (!f) return; f.text().then((t) => { const r = KM.importSave(t); if (r.s) { UI.s = r.s; UI.title = false; UI.combat = null; UI.view = null; UI.tab = "story"; UI.msgs = ["Đã nhập file lưu."]; } else UI.msgs = [r.err]; render(); }); },
    restart() { if (confirm("Bắt đầu lại từ đầu? Tiến trình tự động lưu sẽ bị ghi đè.")) A.newGame(); },
  };
  window.KMA = A;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]"); if (!b || b.disabled) return;
    const a = b.dataset.a, x = b.dataset.x, y = b.dataset.y;
    const nx = x != null && x !== "" && !isNaN(x) ? +x : x;
    const ny = y != null && y !== "" && !isNaN(y) ? +y : y;
    A[a](nx, ny);
    if (UI.s && !UI.title) save();
    render();
    const keep = ["alloc", "target", "reroll", "mapSel", "sellMode"].includes(a) || (a === "special" && (x === "trait" || x === "pick"));
    if (!keep) window.scrollTo(0, 0);
  });
  document.addEventListener("change", (e) => { if (e.target.id === "impf") A.importFile(e); });

  /* ---------------- HUD ---------------- */
  function hud() {
    const s = UI.s; if (!s || UI.title) return '<div class="hud-top"><h1>Kiếm Mệnh <span>·</span> Giang Hồ Lục</h1></div>';
    const d = KM.derived(s), req = KM.expReq(s.level);
    return '<div class="hud-top"><h1>' + esc(s.name) + ' <span>·</span> <small style="font-size:.8rem;font-weight:400">' + esc(KM.PLACES[s.place] || "") + "</small></h1>" +
      '<div class="lvl">' + rTag(s.rank) + " Lv " + s.level + (s.unalloc ? ' <button class="pts" data-a="tab" data-x="char">+' + s.unalloc + " điểm</button>" : "") + "</div></div>" +
      '<div class="hud-bars">' + bar("hp", s.cur.hp, d.maxHP, "HP") + bar("kh", s.cur.kh, d.maxKH, "Khí Huyết") + bar("sta", s.cur.sta, d.maxSTA, "Thể lực") + "</div>" +
      '<div class="exp"><i style="width:' + Math.min(100, (s.exp / req) * 100).toFixed(1) + '%"></i></div>' +
      '<div class="hud-meta"><span>EXP ' + s.exp + "/" + req + (KM.readyBreak(s) ? " · chạm trần" : "") + "</span><span>Ngày " + s.day + " · " + KM.SLOT_NAME[s.slot] + "</span><span>" + esc(KM.money(s.money)) + "</span></div>";
  }

  /* ---------------- Màn hình tiêu đề ---------------- */
  function titleView() {
    const has = !!store.get(AUTO);
    return '<div class="stage">' + KM.background("mountain_gate", "dusk") + '</div><div class="scene title"><h1>Kiếm Mệnh</h1><p>Giang Hồ Lục · Arc 1–2</p>' +
      '<p class="muted">Một tạp dịch Tuyệt Mạch, một Hệ Thống bí ẩn, và mối thù của Thẩm gia trang mười năm trước.</p>' +
      '<div class="choices" style="max-width:360px;margin:16px auto 0">' + (has ? '<button class="choice" data-a="cont"><span><b>1.</b> Tiếp tục</span></button>' : "") +
      '<button class="choice" data-a="newGame"><span><b>' + (has ? 2 : 1) + '.</b> Bắt đầu mới</span></button></div>' +
      '<div class="panel" style="text-align:left"><p class="label">Nhập file lưu</p><input type="file" id="impf" accept=".json,application/json"></div></div>';
  }

  /* ---------------- Cảnh truyện ---------------- */
  function sceneView() {
    const s = UI.s, sc = KM.SCENES[s.scene];
    if (!sc) return '<div class="scene solo">Không tìm thấy cảnh.</div>';
    let h = stage(sc.place, sc.time, sc.cast, TIME_LABEL[sc.time] || "") + '<div class="scene"><p class="chap">' + esc(sc.chapter) + "</p><h2>" + esc(sc.title) + '</h2><div class="text">' + sc.text.map(line).join("") + "</div>" + msgsBox(UI.msgs);
    if (sc.special === "traits") h += traitsView();
    else if (sc.special === "interview") h += interviewView();
    else if (sc.special === "art") h += artView();
    else if (sc.special === "class") h += classView();
    else if (sc.special === "rank") h += "";
    else if (sc.fight) h += '<div class="choices"><button class="primary" data-a="fightScene">Vào trận</button></div>';
    else {
      h += '<div class="choices">' + KM.visibleChoices(s, sc).map((c, i) => {
        const ok = KM.reqOk(s, c.req), lab = c.req ? KM.reqLabel(c.req) : "";
        return '<button class="choice" data-a="choose" data-x="' + i + '"' + (ok ? "" : " disabled") + "><span><b>" + (i + 1) + ".</b> " + esc(c.t) + "</span>" + (c.check ? "<small>" + esc(KM.STAT_NAME[c.check.stat]) + " · độ khó " + c.check.dc + "</small>" : lab ? "<small>" + esc(lab) + "</small>" : "") + "</button>";
      }).join("") + "</div>";
    }
    return h + "</div>";
  }
  function traitsView() {
    const s = UI.s;
    if (!s.traitOffer.length) KM.offerTraits(s);
    return '<div class="panel"><p class="label">Chọn 2 đặc tính (' + UI.sel.length + '/2)</p><div class="cards">' + s.traitOffer.map((k) => {
      const t = KM.TRAITS[k];
      return '<button class="card' + (UI.sel.includes(k) ? " on" : "") + '" data-a="special" data-x="trait" data-y="' + k + '"><span class="nm">' + esc(t.name) + (t.rare ? ' <i class="q q4">Hiếm</i>' : "") + "</span><span>" + esc(t.desc) + "</span><small>Đánh đổi: " + esc(t.cost) + "</small></button>";
    }).join("") + '</div><div class="row" style="margin-top:10px"><button class="primary" data-a="special" data-x="traitsOk"' + (UI.sel.length === 2 ? "" : " disabled") + '>Xác nhận</button><button class="ghost" data-a="special" data-x="reroll"' + (s.traitReroll > 0 ? "" : " disabled") + ">Xáo lại (còn " + s.traitReroll + ")</button></div></div>";
  }
  function interviewView() {
    const q = KM.INTERVIEW[UI.iq];
    return '<div class="panel"><p class="label">Câu ' + (UI.iq + 1) + "/" + KM.INTERVIEW.length + '</p><p class="sys">' + esc(q.q) + '</p><div class="choices">' + q.a.map((a, i) => '<button class="choice" data-a="special" data-x="answer" data-y="' + i + '"><span><b>' + (i + 1) + ".</b> " + esc(a[0]) + "</span></button>").join("") + "</div></div>";
  }
  function skillCard(s, sk, extra) {
    return '<span class="nm">' + esc(sk.name) + "</span><span>" + esc(sk.desc) + "</span><small>" + esc([sk.cost && sk.cost.sta ? sk.cost.sta + " thể lực" : "", sk.cost && sk.cost.kh ? sk.cost.kh + " Khí Huyết" : "", sk.cd ? "hồi " + sk.cd + " lượt" : "", sk.w ? "cần " + KM.WEAPON_TYPES[sk.w].name.toLowerCase() : ""].filter(Boolean).join(" · ")) + "</small>" + (extra || "");
  }
  function artView() {
    const s = UI.s, ids = KM.suggestArts(s);
    return '<div class="panel"><div class="cards">' + ids.map((id) => { const a = KM.MACH_AN[id]; return '<button class="card' + (UI.pick === id ? " on" : "") + '" data-a="special" data-x="pick" data-y="' + id + '"><span class="tag">' + esc(a.style) + "</span>" + skillCard(s, a.sk) + "</button>"; }).join("") +
      '</div><div class="row" style="margin-top:10px"><button class="primary" data-a="special" data-x="artOk"' + (UI.pick && ids.includes(UI.pick) ? "" : " disabled") + ">Khai mở Mạch Ẩn</button></div></div>";
  }
  function classView() {
    const s = UI.s;
    let h = '<div class="panel">';
    Object.keys(KM.WEAPON_TYPES).filter((w) => w !== "tay").forEach((w) => {
      const W = KM.WEAPON_TYPES[w];
      h += '<p class="grp">' + esc(W.name) + " · tầm " + KM.RANGE_NAME[W.range] + '</p><p class="muted" style="margin:0 0 6px">' + esc(W.desc) + '</p><div class="cards">';
      Object.keys(KM.CLASSES).filter((k) => KM.CLASSES[k].weapon === w).forEach((k) => {
        const C = KM.CLASSES[k], sk = KM.SKILLS[C.s1];
        h += '<button class="card' + (UI.pick === k ? " on" : "") + '" data-a="special" data-x="pick" data-y="' + k + '"><span class="tag">' + esc(KM.BRANCH_NAME[C.branch] + " · " + C.art) + '</span><span class="nm">' + esc(C.name) + "</span><span>Ưu tiên: " + C.prio.join(", ") + (C.branch === "noi" ? " · Shen: " + Math.round(KM.noiEff(s) * 100) + "% uy lực" : "") + "</span><small>Chiêu nhập môn: " + esc(sk.name) + " — " + esc(sk.desc) + " (" + esc(KM.skillLine(s, C.s1)) + ")</small><small>Bậc 2: " + esc(C.tree[1]) + " · Nhánh ẩn: ???</small></button>";
      });
      h += "</div>";
    });
    return h + '<div class="row" style="margin-top:12px"><button class="primary" data-a="special" data-x="classOk"' + (UI.pick && KM.CLASSES[UI.pick] ? "" : " disabled") + ">Chọn Võ Đạo này</button></div></div>";
  }
  function rankView() {
    const s = UI.s, R = KM.RANK_REWARDS[s.pendingRank];
    if (!R) { s.pendingRank = null; return ""; }
    return '<div class="rankup"><h2>Đột phá ' + esc(KM.RANK_NAME[s.pendingRank]) + "</h2><p>Chọn 1 phần thưởng:</p>" + '<div class="choices">' + R(s).map((o, i) => '<button class="choice" data-a="rank" data-x="' + i + '"><span><b>' + (i + 1) + ".</b> " + esc(o.t) + "</span></button>").join("") + "</div></div>";
  }

  /* ---------------- Khu tự do ---------------- */
  function hubView() {
    const s = UI.s, H = KM.hubOf(s);
    if (!H) { s.hub = null; return sceneView(); }
    const t = slotTime(s);
    let h = stage(H.place, t, [], KM.SLOT_NAME[s.slot]) +
      '<div class="hubbar"><div><b>' + esc(H.name) + '</b> <span class="muted">· Ngày ' + s.day + '</span></div><div class="slots">' + ["Sáng", "Chiều", "Tối", "Khuya"].map((n, i) => '<i class="' + (i === s.slot ? "now" : i < s.slot ? "used" : "") + '">' + n + "</i>").join("") + "</div>" +
      '<div class="row"><button class="ghost sm" data-a="map">Bản đồ</button></div></div>';
    h += msgsBox(UI.msgs);
    const v = UI.view;
    if (v && v.kind === "shop") return h + shopView(v.id);
    if (v && v.kind === "horses") return h + horseView();
    if (v && v.kind === "forge") return h + forgeView();
    if (v && v.kind === "map") return h + mapView();
    const note = H.note && H.note(s);
    if (note) h += '<p class="sys" style="margin-top:10px">' + esc(note) + "</p>";
    if (s.slot === 3) h += '<p class="sys" style="margin-top:10px">Đã khuya. Hãy tìm chỗ nghỉ (phòng trọ, trạm, lều…).</p>';
    const locs = KM.hubLocs(s, H);
    h += '<div class="locs">' + locs.map((l) => {
      const open = KM.locOpen(s, l), qa = KM.questActions(s, s.place, l.id), nNew = qa.filter((a) => /^Nhận/.test(a.t)).length, nDone = qa.filter((a) => /^(Trả|Giao)/.test(a.t) && !a.disabled).length;
      return '<button class="loc' + (v && v.id === l.id ? " on" : "") + (open ? "" : " closed") + '" data-a="loc" data-x="' + l.id + '"><b>' + esc(l.name) + (nDone ? ' <i class="qb done">✓</i>' : nNew ? ' <i class="qb">!</i>' : "") + "</b><small>" + (l.when === "day" ? "Sáng · chiều" : l.when === "night" ? "Chỉ buổi tối" : "Cả ngày") + "</small></button>";
    }).join("") + "</div>";
    if (v && v.kind === "loc" && !locs.find((x) => x.id === v.id)) UI.view = null;
    if (v && v.kind === "loc" && locs.find((x) => x.id === v.id)) {
      const l = locs.find((x) => x.id === v.id), open = KM.locOpen(s, l);
      const acts = KM.locActions(s, l);
      h += '<div class="panel"><h3>' + esc(l.name) + '</h3><p class="muted">' + esc(l.desc) + "</p>" + (open ? "" : '<p class="sys">Nơi này không mở vào giờ này.</p>') +
        '<div class="acts">' + acts.map((a, i) => {
          const sleepy = a.cost === 0 && /Nghỉ|Thuê|Trọ|Ngủ/.test(a.t);
          const dis = a.disabled || (!open && !sleepy && !a.quest) || (s.slot === 3 && !(a.cost === 0)) || (a.req && !KM.reqOk(s, a.req));
          return '<button class="act' + (a.quest ? " quest" : "") + '" data-a="hubAct" data-x="' + l.id + '" data-y="' + i + '"' + (dis ? " disabled" : "") + "><span>" + esc(a.t) + "</span>" + (a.sub ? "<small>" + esc(a.sub) + "</small>" : "") + '<span class="fx">' + (a.quest ? "nhiệm vụ nhánh · không tốn thời gian" : a.cost === 0 ? "không tốn thời gian" : a.cost === 2 ? "tốn 2 buổi" : "tốn 1 buổi") + (a.req ? " · cần " + esc(KM.reqLabel(a.req)) : "") + "</span></button>";
        }).join("") + (acts.length ? "" : '<p class="muted">Không có việc gì lúc này.</p>') + "</div></div>";
    }
    return h;
  }
  function itemRow(s, id, right) {
    const it = KM.ITEMS[id];
    return '<div class="slot"><div><b>' + esc(it.name) + "</b>" + qTag(it.q) + (it.rank ? " " + rTag(it.rank) : "") + (it.wtype ? ' <small class="muted">' + esc(KM.WEAPON_TYPES[it.wtype].name) + "</small>" : "") + '<br><small class="muted">' + esc(KM.itemLine(s, id)) + (it.req ? " · cần " + esc(KM.reqText(it.req)) : "") + "</small></div>" + right + "</div>";
  }
  function shopView(id) {
    const s = UI.s, sh = KM.SHOPS[id];
    let h = '<div class="panel"><div class="row" style="justify-content:space-between"><h3>' + esc(sh.name) + '</h3><div class="row"><button class="ghost sm" data-a="sellMode">' + (UI.sellMode ? "Mua hàng" : "Bán đồ") + '</button><button class="ghost sm" data-a="back">Đóng</button></div></div><p class="muted">Đang có: <b class="hot">' + esc(KM.money(s.money)) + "</b></p>";
    if (UI.sellMode) {
      const ids = Object.keys(s.inv).filter((k) => KM.ITEMS[k].type !== "key" && KM.ITEMS[k].price);
      h += ids.length ? ids.map((k) => itemRow(s, k, '<button class="ghost sm" data-a="sell" data-x="' + k + '">Bán ×' + s.inv[k] + " · " + esc(KM.money(KM.sellPrice(s, k))) + "</button>")).join("") : '<p class="muted">Không có gì để bán.</p>';
      return h + "</div>";
    }
    KM.shopStock(s, id).forEach((e, i) => {
      if (e.book) { const sk = KM.SKILLS[e.book]; h += '<div class="slot"><div><b>' + esc(e.name) + '</b><br><small class="muted">' + esc(sk.desc) + " · " + esc(KM.skillLine(s, e.book)) + " · cần Level 10</small></div>" + '<button class="ghost sm" data-a="buy" data-x="' + id + '" data-y="' + i + '"' + (e.owned ? " disabled" : "") + ">" + (e.owned ? "Đã học" : esc(KM.money(e.price))) + "</button></div>"; }
      else h += itemRow(s, e.id, '<button class="ghost sm" data-a="buy" data-x="' + id + '" data-y="' + i + '">' + esc(KM.money(e.price)) + "</button>");
    });
    if (id === "thu_quan" && !s.cls) h += '<p class="muted">Chưa có Võ Đạo nên chưa có bí kíp phù hợp.</p>';
    return h + "</div>";
  }
  function horseView() {
    const s = UI.s;
    let h = '<div class="panel"><div class="row" style="justify-content:space-between"><h3>Chợ ngựa</h3><button class="ghost sm" data-a="back">Đóng</button></div><p class="muted">Đang cưỡi: ' + (s.horse ? esc(KM.HORSES[s.horse].name) + " (×" + KM.HORSES[s.horse].mult + ")" : "chưa có") + " · Cỏ và trọ ngựa: " + KM.HORSE_FEED + " đồng/ngày</p>";
    KM.HORSE_SHOP.forEach((k) => { const ho = KM.HORSES[k], p = Math.ceil(ho.price * (KM.hasTrait(s, "thuong_nhan") ? 0.8 : 1)); h += '<div class="slot"><div><b>' + esc(ho.name) + "</b>" + qTag(ho.q) + '<br><small class="muted">Thời gian đi đường ×' + ho.mult + " · " + esc(ho.desc) + '</small></div><button class="ghost sm" data-a="horse" data-x="' + k + '"' + (s.horse === k ? " disabled" : "") + ">" + esc(KM.money(p)) + "</button></div>"; });
    return h + "</div>";
  }
  function forgeView() {
    const s = UI.s;
    let h = '<div class="panel"><div class="row" style="justify-content:space-between"><h3>Lò rèn Âu Trì</h3><button class="ghost sm" data-a="back">Đóng</button></div><p class="muted">Mỗi cấp +5% Công/Giáp gốc của món đồ. Từ +7 có thể thất bại (mất phí).</p>';
    Object.keys(KM.SLOTS).concat(["jade2"]).forEach((sl) => {
      const id = s.gear[sl]; if (!id) return; const n = s.enh[id] || 0;
      h += itemRow(s, id, '<button class="ghost sm" data-a="enh" data-x="' + sl + '"' + (n >= 10 ? " disabled" : "") + ">+" + n + " → +" + (n + 1) + " · " + esc(KM.money(KM.ENH_COST(n))) + "</button>");
    });
    return h + "</div>";
  }
  function mapView() {
    const s = UI.s, dests = KM.mapDests(s), sel = UI.mapSel;
    let svg = '<svg viewBox="0 0 100 100" class="wmap" role="img" aria-label="Bản đồ thế giới"><rect width="100" height="100" fill="#e9dfc4"/>' +
      '<path d="M0 62 Q30 50 50 58 T100 52" stroke="#7fa6b8" stroke-width="2.2" fill="none" opacity=".7"/><path d="M8 14 l6 -8 l6 8 M18 18 l5 -7 l5 7 M60 86 l5 -7 l5 7" stroke="#8a7a5a" stroke-width=".8" fill="none"/>';
    for (const k in KM.ROUTES) { const [a, b] = k.split(">"), A = KM.MAP_XY[a], B = KM.MAP_XY[b]; svg += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="#6a5a3a" stroke-width=".7" stroke-dasharray="1.6 1.2"/><text x="' + ((A[0] + B[0]) / 2 + 1) + '" y="' + ((A[1] + B[1]) / 2 - 1) + '" font-size="2.6" fill="#6a5a3a">' + KM.ROUTES[k] + "n</text>"; }
    if (sel) { const p = KM.path(s.place, sel); if (p) for (let i = 1; i < p.nodes.length; i++) { const A = KM.MAP_XY[p.nodes[i - 1]], B = KM.MAP_XY[p.nodes[i]]; svg += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="#b8332c" stroke-width="1.2"/>'; } }
    Object.keys(KM.PLACES).forEach((p) => {
      const [x, y] = KM.MAP_XY[p], here = p === s.place, known = s.known.includes(p), d = dests.find((z) => z.p === p), locked = d && d.lock;
      svg += '<g class="wnode" data-a="mapSel" data-x="' + p + '" style="cursor:pointer"><circle cx="' + x + '" cy="' + y + '" r="' + (here ? 3.4 : 2.6) + '" fill="' + (here ? "#b8332c" : locked ? "#9a917c" : known ? "#22201b" : "#efe6cf") + '" stroke="#22201b" stroke-width=".6"/>' +
        '<text x="' + x + '" y="' + (y + 6.4) + '" font-size="3.4" text-anchor="middle" fill="#22201b" font-weight="' + (p === sel ? 700 : 400) + '">' + esc(known || here ? KM.PLACES[p] : "???  " + KM.PLACES[p]) + "</text>" +
        '<text x="' + x + '" y="' + (y + 9.6) + '" font-size="2.4" text-anchor="middle" fill="#6a5a3a">' + esc(KM.PLACE_KIND[p] + (KM.questCountAt(s, p) && known ? " · " + KM.questCountAt(s, p) + " việc" : "")) + "</text></g>";
    });
    svg += "</svg>";
    let h = '<div class="panel"><div class="row" style="justify-content:space-between"><h3>Bản đồ thế giới</h3><button class="ghost sm" data-a="back">Đóng</button></div>' + svg +
      '<p class="muted">Đang ở <b>' + esc(KM.PLACES[s.place]) + "</b>. Ngựa: " + (s.horse ? esc(KM.HORSES[s.horse].name) + " ×" + KM.HORSES[s.horse].mult : "đi bộ ×1") + ". Đi tới bất kỳ đâu theo đường ngắn nhất; thời gian = tổng ngày đi bộ × hệ số ngựa, làm tròn lên theo buổi.</p>";
    const main = Object.keys(UI.s.quests).map((k) => UI.s.quests[k]).filter((q) => q.st === "active" && q.deadline);
    if (main.length) h += '<p class="sys">Chính tuyến: ' + main.map((q) => esc(q.name) + " — hạn hết ngày " + q.deadline + " (còn " + Math.max(0, q.deadline - s.day) + " ngày)").join("; ") + "</p>";
    dests.forEach((d) => {
      h += '<div class="slot' + (d.p === sel ? " sel" : "") + '"><div><b>' + esc(KM.PLACES[d.p]) + "</b> <small class=\"muted\">" + esc(KM.PLACE_KIND[d.p]) + (d.known ? "" : " · chưa khám phá") + '</small><br><small class="muted">' + (d.base != null ? esc(d.via.map((n) => KM.PLACES[n]).join(" → ")) + " · đi bộ " + d.base + " ngày → " + d.days + " ngày" : "") + (d.lock ? " · " + esc(d.lock) : "") + '</small></div><button class="ghost sm" data-a="travel" data-x="' + d.p + '"' + (d.lock ? " disabled" : "") + ">Lên đường</button></div>";
    });
    return h + "</div>";
  }
  function travelView() {
    const s = UI.s, t = s.travel;
    const done = t.total - t.left;
    return stage("road", slotTime(s), ["shen"], KM.SLOT_NAME[s.slot]) + '<div class="scene"><p class="chap">Đi đường</p><h2>' + esc(KM.PLACES[t.from]) + " → " + esc(KM.PLACES[t.dest]) + '</h2><p>Đã đi ' + (done / 4) + " / " + (t.total / 4) + " ngày" + (s.horse ? " · cưỡi " + esc(KM.HORSES[s.horse].name) : " · đi bộ") + ".</p>" + bar("sta", done, t.total, "Hành trình") + msgsBox(UI.msgs) +
      '<div class="choices"><button class="primary" data-a="step">' + (t.left > 4 ? "Đi tiếp một ngày" : "Đi nốt chặng cuối") + "</button></div></div>";
  }

  /* ---------------- Chiến đấu ---------------- */
  function combatView() {
    const s = UI.s, c = UI.combat, d = KM.derived(s), tg = KM.combat.target(c);
    const place = (KM.SCENES[s.scene] && KM.SCENES[s.scene].place) || (s.travel ? "road" : (KM.hubOf(s) || {}).place) || "forest";
    const mini = (cur, max, cls) => '<span class="mb ' + cls + '"><i style="width:' + Math.max(0, Math.min(100, (cur / max) * 100)).toFixed(1) + '%"></i><em>' + Math.max(0, Math.floor(cur)) + "/" + Math.floor(max) + "</em></span>";
    // Cột trái: sân đấu + đối thủ + Shen
    let L = '<div class="cf-stage">' + KM.background(place, slotTime(s)) + '<div class="cf-over">';
    c.foes.forEach((f, i) => {
      const chips = [];
      if (f.stun) chips.push("Choáng"); if (f.weak) chips.push("−" + f.weak.pct * 100 + "% công " + f.weak.t + "l"); if (f.burn) chips.push("Bỏng " + f.burn + "l");
      const cds = Object.keys(f.cds).filter((k) => f.cds[k] > 0).map((k) => k + " " + f.cds[k]);
      L += '<div class="cf-foe' + (f === tg ? " tg" : "") + (f.hp <= 0 ? " dead" : "") + '" data-a="target" data-x="' + i + '">' + '<span class="cf-pt">' + KM.portrait(f.portrait, f.name) + "</span>" +
        '<div class="cf-info"><div class="cf-name"><b>' + esc(f.name) + "</b> " + rTag(f.rank) + " <small>Lv " + f.lv + "</small>" + '<button class="cf-obs" data-a="observe" data-x="' + i + '" aria-label="Quan sát ' + esc(f.name) + '">?</button></div>' +
        mini(f.hp, f.maxHP, "hp") + '<div class="cf-st">' + esc(KM.WEAPON_TYPES[f.wtype].name) + " · Công " + Math.round(f.d.patk) + " · Giáp " + f.d.pdef + " · Né " + f.d.eva + "% · CM " + f.d.crit + "%</div>" +
        (chips.length || cds.length ? '<div class="cf-ch">' + chips.map((x) => "<i>" + esc(x) + "</i>").join("") + cds.map((x) => '<i class="g">' + esc(x) + "</i>").join("") + "</div>" : "") + "</div></div>";
    });
    const me = [];
    if (c.kt) me.push("Khí Thế " + c.kt); if (c.poison) me.push("Độc " + c.poison + "l"); if (c.buf.guardT > 0) me.push("Giảm " + c.buf.guard * 100 + "% · " + c.buf.guardT + "l"); if (c.buf.evaT > 0) me.push("Né +" + c.buf.eva + "% · " + c.buf.evaT + "l");
    L += '</div><div class="cf-me"><span class="cf-pt">' + KM.portrait("shen") + '</span><div class="cf-info"><div class="cf-name"><b>Shen</b> ' + rTag(s.rank) + " <small>Lv " + s.level + "</small></div>" +
      mini(s.cur.hp, d.maxHP, "hp") + mini(s.cur.kh, d.maxKH, "kh") + mini(s.cur.sta, d.maxSTA, "sta") +
      '<div class="cf-st">' + esc(KM.WEAPON_TYPES[KM.weaponType(s)].name) + " · Công " + d.patk + " · Giáp " + d.pdef + " · Né " + d.eva + "% · CM " + d.crit + "%</div>" +
      (me.length ? '<div class="cf-ch">' + me.map((x) => '<i class="g">' + esc(x) + "</i>").join("") + "</div>" : "") + "</div></div></div>";
    // Cột phải: nhật ký + hành động
    let R = '<div class="cf-side"><div class="cf-head"><b>Lượt ' + c.round + "</b> · " + (c.close ? "đã áp sát" : "mở màn") +
      (c.rerolls > 0 || c.rerollOn ? '<label class="cf-rr"><input type="checkbox" data-a="reroll"' + (c.rerollOn ? " checked" : "") + "> Gieo lại (" + c.rerolls + ")</label>" : "") + "</div>";
    const logLines = (UI.obs ? UI.obs.map((l) => ({ t: l, k: "obs" })) : []).concat(c.log.map((l) => ({ t: l, k: /^—/.test(l) ? "sep" : /^(Né|Chí mạng|Choáng|Bỏng|Trúng độc|Bỏ chạy).*d100/.test(l) ? "dice" : /→ .*sát thương/.test(l) ? "hit" : /−\d+ HP/.test(l) ? "ouch" : "" })));
    R += '<div class="cf-log">' + (logLines.length ? logLines.map((l) => '<div class="' + l.k + '">' + esc(l.t) + "</div>").join("") : '<div class="sep">Chọn hành động. Bấm vào đối thủ để nhắm, nút ? để quan sát (không mất lượt).</div>') +
      (c.hist.length > 1 ? '<details class="hist"><summary>Các lượt trước</summary>' + c.hist.slice(0, -1).reverse().map((r) => '<div class="hr"><b>Lượt ' + r.round + "</b><br>" + r.lines.map(esc).join("<br>") + "</div>").join("") + "</details>" : "") + "</div>";
    if (c.over) {
      const t = c.over === "win" ? "Chiến thắng" : c.over === "flee" ? "Đã thoát" : "Thất bại";
      R += '<div class="cf-res' + (c.over === "lose" ? " lose" : "") + '"><strong>' + t + '</strong><div class="cf-resl">' + (UI.cmsgs || []).map((m) => '<div class="' + msgClass(m) + '">' + esc(m) + "</div>").join("") + "</div>" +
        (s.pendingRank ? rankView() : '<button class="primary" data-a="endFight">Tiếp tục</button>') + "</div>";
    } else {
      const rd = KM.combat.ready(s, c);
      R += '<div class="cf-acts">' + rd.map((x) => {
        const sk = x.sk, mult = sk.mult ? "×" + sk.mult + (sk.hits ? "×" + sk.hits : "") + (sk.aoe ? "·" + sk.aoe + "đ" : "") : "";
        const cost = sk.cost ? (sk.cost.sta ? sk.cost.sta + "TL" : sk.cost.kh + "KH") : "";
        const tip = (x.ok ? (x.id === "danh_thuong" ? KM.WEAPON_TYPES[KM.weaponType(s)].desc : sk.desc) : x.why) + " · " + (KM.skillLine(s, x.id) || "");
        return '<button class="ca' + (x.id === "own" ? " own" : "") + '" data-a="act" data-x="skill" data-y="' + x.id + '"' + (x.ok ? "" : " disabled") + ' title="' + esc(tip) + '"><b>' + esc(sk.name) + "</b><small>" + esc([mult, cost, x.cd > 0 ? "hồi " + x.cd : sk.cd ? "cd " + sk.cd : ""].filter(Boolean).join(" · ") || "—") + "</small></button>";
      }).join("");
      R += '<button class="ca" data-a="act" data-x="gap" title="Lùi lại; lượt sau tính như lượt mở màn"><b>Giãn cách</b><small>lùi lại</small></button>';
      ["dai_hoan", "kim_sang", "hoi_khi", "giai_doc"].forEach((k) => { if (s.inv[k]) R += '<button class="ca item" data-a="act" data-x="item" data-y="' + k + '" title="' + esc(KM.ITEMS[k].desc) + '"><b>' + esc(KM.ITEMS[k].name) + "</b><small>×" + s.inv[k] + "</small></button>"; });
      R += '<button class="ca flee" data-a="act" data-x="flee"' + (c.opts.canFlee === false ? " disabled" : "") + '><b>Bỏ chạy</b><small>' + (c.opts.canFlee === false ? "không thể" : "d100") + "</small></button></div>";
    }
    R += "</div>";
    return '<div class="cframe">' + L + R + "</div>";
  }

  /* ---------------- Các tab ---------------- */
  function charView() {
    const s = UI.s, e = KM.eff(s), eb = KM.eff(s, true), d = KM.derived(s), m = KM.traitMult(s);
    let h = '<div class="panel"><h3>Chỉ số</h3><p class="muted">Điểm chưa phân bổ: <b class="hot">' + s.unalloc + "</b> · Hiệu dụng = floor(gốc × hệ số) + thưởng + trang bị</p><table class=\"stats\"><tr><th></th><th class=\"num\">Gốc</th><th class=\"num\">Hệ số</th><th class=\"num\">Hiệu dụng</th><th></th></tr>";
    KM.STATS.forEach((k) => {
      h += "<tr><th>" + k + "<small>" + esc(KM.STAT_NAME[k]) + " · " + esc(KM.STAT_DESC[k]) + '</small></th><td class="num">' + s.base[k] + '</td><td class="num">×' + Math.round(m[k] * 1000) / 1000 + '</td><td class="num eff">' + e[k] + (e[k] !== eb[k] ? ' <small class="muted">(' + (e[k] - eb[k] > 0 ? "+" : "") + (e[k] - eb[k]) + " đồ)</small>" : "") + "</td><td>" + (s.unalloc ? '<div class="row"><button class="plus" data-a="alloc" data-x="' + k + '" data-y="1">+1</button>' + (s.unalloc >= 5 ? '<button class="plus" data-a="alloc" data-x="' + k + '" data-y="5">+5</button>' : "") + "</div>" : "") + "</td></tr>";
    });
    h += '</table></div><div class="panel"><h3>Chỉ số phái sinh</h3><div class="kv">' +
      "<span>HP tối đa</span><b>100 + 20×" + e.VIT + " + 5×" + s.level + " = " + d.maxHP + "</b>" +
      "<span>Khí Huyết</span><b>30 + 8×" + e.VIT + " + 4×" + e.STR + " = " + d.maxKH + "</b>" +
      "<span>Thể lực</span><b>50 + 10×" + e.VIT + " + 5×" + e.AGI + " = " + d.maxSTA + "</b>" +
      "<span>Công vật lý</span><b>2×" + e.STR + " + 0.5×" + e.AGI + " + vũ khí = " + d.patk + "</b>" +
      "<span>Nội công lực</span><b>2×" + e.INT + " + " + e.WIS + " + vũ khí = " + d.npow + " (Shen: " + Math.round(KM.noiEff(s) * 100) + "% uy lực)</b>" +
      "<span>Giáp</span><b>" + d.pdef + "</b><span>Né</span><b>" + d.eva + "%</b><span>Chí mạng</span><b>" + d.crit + "% · ×" + d.critDmg + "</b>" +
      "<span>Vũ khí</span><b>" + esc(KM.WEAPON_TYPES[KM.weaponType(s)].name) + " — " + esc(KM.WEAPON_TYPES[KM.weaponType(s)].desc) + "</b></div></div>";
    h += '<div class="panel"><h3>Cảnh giới</h3><p>' + rTag(s.rank) + " " + esc(KM.RANK_NAME[s.rank]) + " · Level " + s.level + "/" + KM.cap(s) + "</p>" + (KM.readyBreak(s) && KM.RANKS[KM.rankIdx(s.rank) + 1] ? '<p class="sys">Đột phá ' + esc(KM.RANKS[KM.rankIdx(s.rank) + 1]) + ": " + esc(KM.RANK_BREAK[KM.RANKS[KM.rankIdx(s.rank) + 1]] || "") + "</p>" : "") + "</div>";
    h += '<div class="panel"><h3>Đặc tính</h3>' + (s.traits.length ? s.traits.map((t) => "<p><b>" + esc(KM.TRAITS[t].name) + "</b> — " + esc(KM.TRAITS[t].desc) + ' <small class="muted">(' + esc(KM.TRAITS[t].cost) + ")</small></p>").join("") : '<p class="muted">Chưa chọn.</p>') + '<p class="muted">Tuyệt Mạch: Lực, Thân Pháp, Căn Cốt ×1.2; không có Nội Lực; dùng Khí Huyết.</p></div>';
    return h;
  }
  function skillsView() {
    const s = UI.s;
    let h = '<div class="panel"><h3>Võ Đạo</h3>';
    if (s.cls) {
      const C = KM.CLASSES[s.cls];
      h += "<p><b>" + esc(s.hidden ? KM.HIDDEN_CLASSES[s.hidden].name : C.name) + "</b> · " + esc(KM.WEAPON_TYPES[C.weapon].name) + " · " + esc(KM.BRANCH_NAME[C.branch]) + " (" + esc(C.art) + ")</p>" + (s.hidden ? '<p class="muted">' + esc(KM.HIDDEN_CLASSES[s.hidden].desc) + "</p>" : "") +
        '<ol class="tree">' + C.tree.map((t, i) => '<li class="' + (i === 0 ? "cur" : "") + '">Bậc ' + (i + 1) + ": " + esc(t) + "</li>").join("") + '<li class="hid">Nhánh ẩn: ' + (s.hidden ? esc(KM.HIDDEN_CLASSES[s.hidden].name) : "???") + "</li></ol>" +
        '<p class="muted">Bí kíp chiêu thứ hai (' + esc(KM.SKILLS[C.s2].name) + ") bán ở Thư quán Văn Uyên, Lạc Hà (cần Level 10).</p>";
    } else h += '<p class="muted">Chọn Võ Đạo khi đạt Level 5.</p>';
    h += "</div><div class=\"panel\"><h3>Võ công riêng · Mạch Ẩn</h3>";
    if (s.ownArt) { const a = KM.MACH_AN[s.ownArt]; h += "<p><b>" + esc(a.name) + "</b> · tầng " + s.ownTier + "/5 · " + esc(a.style) + '</p><p class="muted">' + esc(a.sk.desc) + " · " + esc(KM.skillLine(s, "own")) + "</p>"; }
    else h += '<p class="muted">Mạch Ẩn thành hình ở Level 5, theo cách Shen chiến đấu.</p>';
    h += '</div><div class="panel"><h3>Kỹ năng</h3>';
    s.skills.forEach((id) => {
      const sk = KM.SKILLS[id], m = KM.mastery(s, id);
      h += '<div class="skill"><div class="skill-h"><b>' + esc(sk.name) + "</b><span>" + esc(KM.MASTERY[m]) + " (+" + m * 15 + "%) · " + (s.use[id] || 0) + " lần dùng</span></div><small class=\"muted\">" + esc(sk.desc) + (sk.mult ? " · hệ số ×" + sk.mult + (sk.hits ? "×" + sk.hits : "") : "") + " · " + esc(KM.skillLine(s, id)) + "</small></div>";
    });
    return h + '<p class="muted">Thuần thục: 10 / 30 / 60 / 100 lần dùng → Tiểu Thành / Đại Thành / Viên Mãn / Hóa Cảnh, mỗi mức +15% hệ số.</p></div>';
  }
  function bagView() {
    const s = UI.s;
    let h = msgsBox(UI.msgs) + '<div class="panel"><h3>Trang bị</h3>';
    Object.keys(s.gear).forEach((sl) => {
      const id = s.gear[sl], name = sl === "jade2" ? "Ngọc bội 2" : KM.SLOTS[sl];
      h += '<div class="slot"><span>' + esc(name) + "</span><div>" + (id ? "<b>" + esc(KM.ITEMS[id].name) + (s.enh[id] ? " +" + s.enh[id] : "") + "</b>" + qTag(KM.ITEMS[id].q) + '<br><small class="muted">' + esc(KM.itemLine(s, id)) + "</small>" : '<span class="muted">—</span>') + "</div>" + (id ? '<button class="ghost sm" data-a="unequip" data-x="' + sl + '">Tháo</button>' : "") + "</div>";
    });
    h += '</div><div class="panel"><h3>Hành trang</h3><p class="muted">Tiền: <b class="hot">' + esc(KM.money(s.money)) + "</b> · Ngựa: " + (s.horse ? esc(KM.HORSES[s.horse].name) + " [" + KM.HORSES[s.horse].q + "] ×" + KM.HORSES[s.horse].mult : "chưa có") + " · Mảnh Thiên Mạch Chân Giải: " + s.shards + "/3</p>";
    const ids = Object.keys(s.inv);
    if (!ids.length) h += '<p class="muted">Trống.</p>';
    ids.forEach((id) => {
      const it = KM.ITEMS[id];
      let btn = "";
      if (it.slot) btn = '<button class="ghost sm" data-a="equip" data-x="' + id + '"' + (KM.meets(s, it.req) ? "" : " disabled") + ">Trang bị</button>";
      else if (it.type === "use" && it.combat !== false || it.type === "use") btn = '<button class="ghost sm" data-a="use" data-x="' + id + '">Dùng</button>';
      h += itemRow(s, id, '<div class="row"><small class="muted">×' + s.inv[id] + "</small>" + btn + "</div>");
    });
    return h + "</div>";
  }
  function questView() {
    const s = UI.s, qs = Object.keys(s.quests);
    let h = '<div class="panel"><h3>Chính tuyến</h3>' + (qs.length ? qs.reverse().map((k) => { const q = s.quests[k]; return '<div class="quest ' + q.st + '"><b>' + esc(q.name) + "</b> <em>" + (q.st === "done" ? "Hoàn thành" : q.st === "fail" ? "Thất bại" : "Đang làm") + (q.st === "active" && q.deadline ? " · hạn hết ngày " + q.deadline + " (còn " + Math.max(0, q.deadline - s.day) + " ngày)" : "") + '</em><br><small class="muted">' + esc(q.desc) + "</small></div>"; }).join("") : '<p class="muted">Chưa có.</p>') + "</div>";
    const sq = Object.keys(s.side), order = { active: 0, fail: 2, done: 1 };
    h += '<div class="panel"><h3>Nhiệm vụ nhánh</h3>' + (sq.length ? sq.sort((a, b) => order[s.side[a].st] - order[s.side[b].st]).map((id) => {
      const q = KM.SIDEQUESTS[id], st = s.side[id], ready = KM.sideReady(s, id);
      return '<div class="quest ' + st.st + '"><b>' + esc(q.name) + "</b> <em>" + (st.st === "done" ? "Hoàn thành" : st.st === "fail" ? "Thất bại" : ready ? "Đã xong — về trả việc" : "Đang làm") + '</em><br><small class="muted">' + esc(KM.GIVER_NAME(q.giver)) + " · " + esc(KM.PLACES[q.place]) + " · " + esc(q.desc) + (st.st === "active" ? "<br>Tiến độ: " + esc(KM.sideDesc(s, id)) : "") + "</small></div>";
    }).join("") : '<p class="muted">Chưa nhận việc nào. Ghé các thôn trấn, tìm địa điểm có dấu <b class="hot">!</b>.</p>') + "</div>";
    h += '<div class="panel"><h3>Manh mối</h3>' + (s.clues.length ? "<ol>" + s.clues.map((c) => "<li>" + esc({ c_tro: "Tro giấy cháy dở có ấn giọt máu, hẹn giao \"tầng ba\"", c_nhan_chung: "Tiểu Lục thấy Tiêu Hạo rời Tàng Kinh Các đêm mất kiếm phổ", c_thu_mat: "Thư mật Huyết Ảnh Lâu gửi \"Tiêu công tử\"" }[c] || c) + "</li>").join("") + "</ol>" : '<p class="muted">Chưa có.</p>') + "</div>";
    return h;
  }
  function relView() {
    const s = UI.s;
    let h = '<div class="panel"><h3>Đạo đức</h3><div class="moral">' + KM.MORAL_TIERS.slice().reverse().map((t) => '<span class="' + (KM.moralTier(s.moral) === t.name ? "on" : "") + '">' + esc(t.name) + "</span>").join("") + '</div><p class="muted">Điểm ' + s.moral + " (−300 đến +300)" + (s.anti >= 3 ? " · Con đường Kiêu Hùng đã mở" : s.anti ? " · Kiêu Hùng " + s.anti + "/3" : "") + "</p></div>";
    h += '<div class="panel"><h3>Danh vọng</h3><div class="kv">' + Object.keys(KM.FACTIONS).map((f) => "<span>" + esc(KM.FACTIONS[f]) + "</span><b>" + (s.rep[f] || 0) + " · " + esc(KM.repTier(s.rep[f] || 0)) + "</b>").join("") + "</div></div>";
    h += '<div class="panel"><h3>Nhân vật đã gặp</h3>' + (s.met.length ? s.met.map((n) => '<div class="relrow">' + KM.portrait(n) + "<div><b>" + esc(KM.NPCS[n].name) + '</b> <small class="muted">' + esc(KM.NPCS[n].role) + "</small>" + bar("rel", s.aff[n] || 0, 100, "") + '<small class="muted">Hảo cảm ' + (s.aff[n] || 0) + "/100</small></div></div>").join("") : '<p class="muted">Chưa gặp ai.</p>') + "</div>";
    return h;
  }
  function ledgerView() {
    const s = UI.s;
    return '<div class="panel"><h3>Sổ Ân Oán</h3><p class="muted">Những việc lớn và hậu quả đang chờ. Chỉ ghi những gì Shen biết.</p>' + (s.ledger.length ? s.ledger.map((l) => '<div class="ledger"><code>' + esc(l.id) + " · Ngày " + l.day + "</code><br><b>" + esc(l.actor) + "</b>: " + esc(l.action) + '<br><small class="muted">Nhân chứng: ' + esc(l.witness || "—") + " · Hậu quả chờ: " + esc(l.pending || "—") + " · Kích hoạt: " + esc(l.trigger || "—") + "</small></div>").join("") : '<p class="muted">Trống.</p>') + "</div>";
  }
  function saveView() {
    let h = msgsBox(UI.msgs) + '<div class="panel"><h3>Lưu game</h3><p class="muted">Game tự lưu sau mỗi hành động. Có thêm 3 ô lưu thủ công trên trình duyệt này.</p>';
    [1, 2, 3].forEach((i) => {
      const raw = store.get(SLOT(i)); let info = "Trống";
      if (raw) { const r = KM.importSave(raw); info = r.s ? "Lv " + r.s.level + " " + r.s.rank + " · Ngày " + r.s.day + " · " + (KM.PLACES[r.s.place] || "") : "Hỏng"; }
      h += '<div class="slot"><span>Ô ' + i + "</span><div>" + esc(info) + '</div><div class="row"><button class="ghost sm" data-a="saveSlot" data-x="' + i + '">Lưu</button><button class="ghost sm" data-a="loadSlot" data-x="' + i + '"' + (raw ? "" : " disabled") + '>Tải</button><button class="ghost sm" data-a="delSlot" data-x="' + i + '"' + (raw ? "" : " disabled") + ">Xóa</button></div></div>";
    });
    h += '</div><div class="panel"><h3>Xuất / nhập</h3><div class="row"><button class="ghost" data-a="exportFile">Tải file lưu (.json)</button></div><p class="label" style="margin-top:12px">Nhập từ file</p><input type="file" id="impf" accept=".json,application/json"><p class="label" style="margin-top:12px">Hoặc dán nội dung file</p><textarea id="imp" rows="3"></textarea><button class="ghost" data-a="importText">Nhập</button></div>';
    h += '<div class="panel"><button class="ghost" data-a="restart">Chơi lại từ đầu</button></div>';
    return h;
  }

  /* ---------------- Render ---------------- */
  const TABS = [["story", "Truyện"], ["char", "Nhân vật"], ["skills", "Võ công"], ["bag", "Túi đồ"], ["quest", "Nhiệm vụ"], ["rel", "Quan hệ"], ["ledger", "Ân Oán"], ["save", "Lưu"]];
  function render() {
    const s = UI.s;
    $("#hud").innerHTML = hud();
    let main = "";
    document.body.classList.toggle("fighting", !!UI.combat);
    if (UI.combat) UI.tab = "story";
    if (UI.title || !s) main = titleView();
    else if (UI.tab === "story") {
      if (UI.combat) main = combatView();
      else if (s.travel) main = travelView();
      else if (s.hub) main = hubView();
      else main = sceneView();
      if (!UI.combat && s.pendingRank) main = rankView() + main;
    } else main = { char: charView, skills: skillsView, bag: bagView, quest: questView, rel: relView, ledger: ledgerView, save: saveView }[UI.tab]();
    $("#main").innerHTML = main;
    const dk = $("#dock");
    dk.hidden = true; dk.innerHTML = "";
    const tabs = $("#tabs");
    tabs.hidden = UI.title || !s || !!UI.combat;
    if (!tabs.hidden) tabs.innerHTML = TABS.map(([k, n]) => '<button class="' + (UI.tab === k ? "on" : "") + '" data-a="tab" data-x="' + k + '">' + n + (k === "char" && s.unalloc ? "<i></i>" : "") + "</button>").join("");
  }
  window.KMrender = render;
  render();
})();
