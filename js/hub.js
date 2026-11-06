/* =====================================================================
   KIẾM MỆNH · KHU TỰ DO, SỰ KIỆN & BỘ CHẠY CỐT TRUYỆN
   Mỗi hành động trong khu tự do tốn 1 buổi (sáng / chiều / tối).
   Đêm khuya chỉ còn nghỉ ngơi.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const R = (msgs, o) => Object.assign({ msgs: msgs || [] }, o || {});
  const day = (s) => s.slot <= 1, night = (s) => s.slot === 2;
  const once = (s, f) => { if (KM.has(s, f)) return false; KM.flag(s, f); return true; };
  const trainExp = (s, k) => Math.floor(KM.expReq(s.level) * k);
  const pick = (s, arr) => arr[Math.floor(KM.rand(s) * arr.length)];

  /* ---------------- Bộ chạy cốt truyện ---------------- */
  KM.applyX = function (s, eff, tx) {
    const msgs = [];
    if (!eff) return msgs;
    if (tx && s.claimed.includes(tx)) return msgs;
    if (eff.cond) { if (KM.reqOk(s, eff.cond.req)) { if (eff.cond.note) msgs.push(eff.cond.note); msgs.push(...KM.apply(s, eff.cond.eff || {})); } }
    if (eff.sleep) msgs.push(...KM.sleep(s));
    if (eff.hiddenClass) { const H = KM.HIDDEN_CLASSES[eff.hiddenClass]; s.cls = H.base; s.hidden = eff.hiddenClass; msgs.push("Class ẩn: " + H.name + ".", H.desc); KM.recalc(s); }
    if (eff.giveHorse) {
      const h = KM.HORSES[eff.giveHorse];
      if (!s.horse || KM.HORSES[s.horse].mult > h.mult) { s.horse = eff.giveHorse; msgs.push("Nhận ngựa: " + h.name + " [" + h.q + "] — thời gian đi đường ×" + h.mult + "."); }
      else msgs.push("Shen đã có ngựa tốt hơn; tiêu chủ đổi lại bằng 30 bạc.", ...KM.apply(s, { money: 3000 }));
    }
    if (eff.phongLam && s.tieuRun) {
      const ok = s.day <= s.tieuRun.due;
      msgs.push("Giao hàng ngày " + s.day + " / hạn ngày " + s.tieuRun.due + " → " + (ok ? "đúng hạn" : "trễ hạn"));
      msgs.push(...KM.apply(s, ok ? { money: 2000, exp: 1500, rep: { long_mon: 40 }, quest: { q_phong_lam: "done" } } : { money: 800, exp: 600, rep: { long_mon: 5 }, quest: { q_phong_lam: "fail" } }));
      s.tieuRun = null;
    }
    const plain = Object.assign({}, eff); ["cond", "sleep", "hiddenClass", "giveHorse", "phongLam"].forEach((k) => delete plain[k]);
    msgs.push(...KM.apply(s, plain, tx));
    return msgs;
  };
  KM.visibleChoices = (s, sc) => (sc.choices || []).filter((c) => !c.hide || KM.reqOk(s, c.req));
  KM.enterScene = function (s, id) {
    s.scene = id; s.hub = null;
    const sc = KM.SCENES[id]; if (!sc) return ["(Thiếu cảnh: " + id + ")"];
    return KM.applyX(s, sc.onEnter, sc.repeat ? null : "enter:" + id);
  };
  KM.choose = function (s, idx) {
    const sc = KM.SCENES[s.scene], c = KM.visibleChoices(s, sc)[idx];
    if (!c || !KM.reqOk(s, c.req)) return { msgs: ["Chưa đủ điều kiện."] };
    const msgs = [];
    let go = c.go, beat = c.r || null;
    if (c.check) {
      let b = 0; if (c.check.bonusTrait) for (const t in c.check.bonusTrait) if (KM.hasTrait(s, t)) b += c.check.bonusTrait[t];
      const r = KM.check(s, c.check.stat, c.check.dc, b); msgs.push(r.line); if (!r.ok) go = c.fail;
      beat = (r.ok ? c.rOk : c.rFail) || beat;
      const ex = r.ok ? c.effOk : c.effFail; if (ex) msgs.push(...KM.applyX(s, ex));
    }
    msgs.push(...KM.applyX(s, c.eff, s.scene + ":" + idx));
    return { msgs, go, beat, label: c.t };
  };

  /* ---------------- Sự kiện tự kích hoạt khi vào khu tự do ---------------- */
  KM.A1_DEADLINE = 10;      // hội đồng xét xử sáng ngày 10 (9 ngày tự do)
  KM.A2_HACGIAO_DAYS = 24;  // Hắc Giao rời Lạc Hà sau 24 ngày kể từ khi Shen tới
  KM.hubTrigger = function (s) {
    if (s.level >= 5 && !s.ownArt) return "a1_interview";
    if (s.level >= 5 && !s.cls) return "x_class";
    if (s.cls === "quyen_ngoai" && !s.hidden && !KM.has(s, "declined_kimthan") && s.level < 10 && KM.eff(s).VIT >= 20 && !s.skills.some((k) => KM.SKILLS[k] && KM.SKILLS[k].src === "n")) return "x_hidden_kimthan";
    if (KM.hasTrait(s, "kiem_ma") && s.cls && s.cls.startsWith("kiem") && !s.hidden && !KM.has(s, "declined_kiemma") && KM.has(s, "killed_higher_sword")) return "x_hidden_kiemma";
    if (!KM.has(s, "a1_done") && s.day >= KM.A1_DEADLINE) return "a1_trial";
    if (s.place === "lac_ha" && KM.has(s, "tieu_su") && !KM.has(s, "kidnap_seen") && s.day >= (s.marks.tieu || 99) + 2) return "a2_kidnap";
    if (s.quests.q_cuu_phuong && s.quests.q_cuu_phuong.st === "active" && s.day > s.quests.q_cuu_phuong.deadline && s.place !== "hac_phong") return "a2_kidnap_late";
    if (KM.has(s, "arrived_lac_ha") && !KM.has(s, "hac_giao_down") && !KM.has(s, "hac_giao_gone") && s.day > (s.marks.arrive || 0) + KM.A2_HACGIAO_DAYS) return "a2_hacgiao_gone";
    return null;
  };

  /* ---------------- Săn & đánh nhau trong khu tự do ---------------- */
  const hunt1 = (s) => {
    const r = KM.die(s, 10);
    if (s.level >= 5 && r >= 9) return ["son_tac"];
    if (r >= 6) return ["heo_rung"];
    if (r >= 3) return ["soi_xam", "soi_xam"];
    return ["soi_xam"];
  };
  const hunt2 = (s) => {
    const r = KM.d100(s);
    if (r <= 8) return { foes: ["ho_du"], note: "d100 = " + r + " ≤ 8: một con hổ dữ (Rank C) chắn đường! Có thể bỏ chạy." };
    if (r <= 50) return { foes: ["soi_dau_dan"], note: "" };
    if (r <= 80) return { foes: ["cuop_duong"], note: "" };
    return { foes: ["soi_dau_dan", "cuop_duong"], note: "" };
  };
  const trainSkill = (s) => {
    const wt = KM.weaponType(s), pool = s.skills.filter((k) => k !== "danh_thuong" && k !== "chiu_don" && (!KM.SKILLS[k].w || KM.SKILLS[k].w === wt));
    if (!pool.length) return [];
    const id = pick(s, pool), b = KM.mastery(s, id); s.use[id] = (s.use[id] || 0) + 4;
    const a = KM.mastery(s, id);
    return ["Luyện " + KM.SKILLS[id].name + ": " + (s.use[id]) + " lần dùng" + (a > b ? " → lên " + KM.MASTERY[a] + "!" : " (" + KM.MASTERY[a] + ")")];
  };

  /* ---------------- KHU TỰ DO ---------------- */
  KM.HUBS = {
    /* ================= THANH VÂN ================= */
    thanh_van: {
      name: "Thanh Vân Sơn", place: "mountain_gate", note: (s) => KM.has(s, "tv_banned") ? "Shen bị cấm vào sơn môn. Chỉ có thể quanh quẩn rừng sau núi và thác Bạch Long." : KM.has(s, "a1_done") ? "Shen trở về Thanh Vân với tư cách khách. Người trên núi nhìn cậu đã khác." : "",
      locs: [
        { id: "phong", name: "Phòng tạp dịch", art: "room", show: (s) => !KM.has(s, "tv_banned"), desc: "Căn phòng ẩm thấp Shen ở chung với Tiểu Lục.", actions: [
          { t: "Nghỉ đêm", cost: 0, run: (s) => R(KM.sleep(s)) },
          { t: "Trò chuyện với Tiểu Lục", show: (s) => !night(s), run: (s) => {
            if (!once(s, "today_tl")) return R(["Hôm nay đã trò chuyện rồi."], { free: true });
            const m = KM.apply(s, { aff: { tieu_luc: 5 } });
            if ((s.aff.tieu_luc || 0) >= 20 && s.day >= 3 && !s.clues.includes("c_nhan_chung") && !KM.has(s, "a1_done")) return R(m, { scene: "a1_witness" });
            m.push("Tiểu Lục kể đủ thứ chuyện vặt trên núi." + ((s.aff.tieu_luc || 0) < 20 ? " Có vẻ cậu ta vẫn đang giấu điều gì." : ""));
            return R(m);
          } },
          { t: "Bày chứng cứ, tính chuyện đối chất", cost: 0, show: (s) => !KM.has(s, "a1_done") && (s.clues.length >= 2 || KM.has(s, "saw_shadow")), run: () => R([], { scene: "a1_confront" }) },
        ] },
        { id: "hau_tru", name: "Hậu trù", art: "kitchen", when: "day", show: (s) => !KM.has(s, "tv_banned"), desc: "Bếp lớn của phái. Việc không bao giờ hết.", actions: [
          { t: "Làm việc vặt (bổ củi, gánh nước)", run: (s) => R(["Shen bổ hết ba gánh củi. Mồ hôi đổ ra, gân cốt nóng lên."].concat(KM.apply(s, { money: 40, exp: 30 + 8 * s.level, trend: { thu: 1, minh: 1 }, aff: { tieu_luc: 2 } }))) },
        ] },
        { id: "dien_vo", name: "Diễn võ trường", art: "yard", when: "day", show: (s) => !KM.has(s, "tv_banned"), desc: "Sân tập đá xanh. Đệ tử ngoại môn tập buổi sáng, nội môn tập buổi chiều.", actions: [
          { t: "Luyện công một mình", run: (s) => R(["Shen tập một mình ở góc sân."].concat(trainSkill(s), KM.apply(s, { exp: 40 + trainExp(s, 0.1), trend: { cong: 1 } }))) },
          { t: "Tỉ thí với Lý Tam", sub: "Rank E · Lv 2", run: (s) => R(["Lý Tam nhổ nước bọt: \"Lần này tao không nương tay.\""], { fight: { foes: ["ly_tam"], opts: { solo: true } } }) },
          { t: "Tỉ thí với đệ tử nội môn", sub: "Rank E · Lv 6", req: { lv: 4 }, run: (s) => R(["Một đệ tử nội môn nhếch mép nhận lời."], { fight: { foes: ["de_tu_noi"], opts: { solo: true } } }) },
          { t: "Thỉnh giáo Hàn giáo đầu", run: (s) => {
            if (!once(s, "today_han")) return R(["Hàn giáo đầu đã chỉ dạy hôm nay rồi."], { free: true });
            return R(["Hàn giáo đầu chỉ ra ba chỗ sơ hở trong thế đứng của Shen."].concat(KM.apply(s, { meet: "han_giao_dau", aff: { han_giao_dau: 4 }, exp: trainExp(s, 0.08) + 30 })));
          } },
        ] },
        { id: "duoc_phong", name: "Dược phòng", art: "medic", when: "day", show: (s) => !KM.has(s, "a1_done"), desc: "Tô Vân Yên ở nhờ đây, phơi thuốc kín cả hiên.", actions: [
          { t: "Gặp Tô Vân Yên", run: (s) => {
            if (!once(s, "today_yen")) return R(["Tô Vân Yên đang bận sắc thuốc."], { free: true });
            const d = KM.derived(s), b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * 0.5));
            const m = ["Tô Vân Yên thay băng cho Shen: +" + (s.cur.hp - b) + " HP."].concat(KM.apply(s, { aff: { to_van_yen: 5 } }));
            if ((s.aff.to_van_yen || 0) >= 25 && !KM.has(s, "yen_hint")) { KM.flag(s, "yen_hint"); return R(m, { scene: "a1_yen_hint" }); }
            return R(m);
          } },
        ] },
        { id: "rung", name: "Rừng sau núi", art: "forest", desc: "Ban ngày có sói và heo rừng. Ban đêm… có những thứ khác.", actions: [
          { t: "Săn thú", show: day, run: (s) => R(["Shen men theo lối mòn vào rừng."], { fight: { foes: hunt1(s), opts: {} } }) },
          { t: "Ngủ ngoài trời dưới chân núi", cost: 0, show: (s) => KM.has(s, "tv_banned"), run: (s) => R(["Shen nhóm lửa dưới gốc tùng, ngủ chập chờn."].concat(KM.sleep(s))) },
          { t: "Rình ở gốc tùng rỗng", show: (s) => night(s) && !KM.has(s, "a1_done") && KM.has(s, "saw_shadow") && !s.clues.includes("c_thu_mat") && !KM.has(s, "shadow_failed"), run: () => R([], { scene: "a1_shadow" }) },
          { t: "Lang thang trong rừng đêm", show: (s) => night(s) && !KM.has(s, "saw_shadow") && !KM.has(s, "a1_done"), run: (s) => {
            const r = KM.check(s, "WIS", 13, KM.hasTrait(s, "linh_giac") ? 4 : 0);
            if (r.ok) { KM.flag(s, "saw_shadow"); return R([r.line, "Gần gốc tùng rỗng, Shen thấy một bóng đen lướt qua, rồi một người áo xanh. Đêm khác quay lại rình."]); }
            return R([r.line, "Chỉ có tiếng cú kêu. Một con sói lao ra từ bụi rậm!"], { fight: { foes: ["soi_xam"], opts: {} } });
          } },
        ] },
        { id: "dong_vien", name: "Đông viện", art: "room", when: "night", show: (s) => !KM.has(s, "a1_done"), desc: "Nơi ở của đệ tử nội môn. Phòng Tiêu Hạo ở cuối dãy.", actions: [
          { t: "Lẻn vào phòng Tiêu Hạo", sub: "kiểm tra Thân Pháp, độ khó 13", show: (s) => !s.clues.includes("c_tro"), run: (s) => {
            const r = KM.check(s, "AGI", 13, KM.hasTrait(s, "anh_tu") ? 5 : 0);
            return R([r.line], { scene: r.ok ? "a1_clue_room" : "a1_caught" });
          } },
        ] },
        { id: "thac", name: "Thác Bạch Long", art: "waterfall", desc: "Thác nước sau núi. Người ta đồn đêm khuya có tiếng kiếm ngân.", actions: [
          { t: "Ngồi tĩnh tọa bên thác", show: day, run: (s) => R(["Tiếng nước làm đầu óc Shen trong lại."].concat(KM.apply(s, { exp: 25 + trainExp(s, 0.05), trend: { minh: 1, thu: 1 } }))) },
          { t: "Đi về phía thác trong đêm", show: (s) => night(s) && !KM.has(s, "kyngo_a1"), run: (s) => {
            s.visits.thac = (s.visits.thac || 0) + 1;
            if (s.visits.thac >= 3) return R([], { scene: "a1_waterfall" });
            return R(["Lần thứ " + s.visits.thac + ". Giữa tiếng nước, Shen ngờ ngợ nghe một tiếng ngân rất khẽ, rồi tắt."]);
          } },
        ] },
        { id: "tap_hoa", name: "Tạp hóa sơn môn", art: "market", when: "day", show: (s) => !KM.has(s, "tv_banned"), desc: "Gian hàng nhỏ bán đồ dùng cho đệ tử.", actions: [
          { t: "Xem hàng", cost: 0, run: () => R([], { shop: "tap_hoa" }) },
        ] },
      ],
    },

    /* ================= LẠC HÀ ================= */
    lac_ha: {
      name: "Trấn Lạc Hà", place: "town",
      locs: [
        { id: "khach_diem", name: "Khách điếm Duyệt Lai", art: "inn", desc: "Khách điếm đông nhất trấn. Lão Hồ ngồi ở góc trong cùng.", actions: [
          { t: "Thuê phòng nghỉ đêm", sub: "10 đồng", cost: 0, run: (s) => {
            const m = KM.apply(s, { money: -Math.min(10, s.money) });
            const hunted = KM.has(s, "killed_tieu_hao") || KM.has(s, "tieu_hao_jailed") || s.clues.includes("c_thu_mat");
            if (hunted && !KM.has(s, "assassin_came") && s.day >= (s.marks.arrive || 0) + 3) {
              const r = KM.d100(s); m.push("Đêm nay có gì đó không ổn… d100 = " + r + " / cần ≤ 50 → " + (r <= 50 ? "có kẻ đột nhập!" : "yên ổn"));
              if (r <= 50) { s.slot = 3; return R(m, { scene: "a2_assassin" }); }
            }
            return R(m.concat(KM.sleep(s)));
          } },
          { t: "Uống rượu với Lão Hồ", sub: "20 đồng", run: (s) => {
            if (!once(s, "today_ho")) return R(["Lão Hồ đã say khướt."], { free: true });
            if (s.money < 20) return R(["Không đủ 20 đồng mua rượu."], { free: true });
            const m = KM.apply(s, { money: -20, aff: { lao_ho: 6 } });
            if ((s.aff.lao_ho || 0) >= 20 && !KM.has(s, "laoho_1")) return R(m, { scene: "a2_laoho_1" });
            if ((s.aff.lao_ho || 0) >= 40 && KM.has(s, "hac_giao_down") && !KM.has(s, "laoho_2")) return R(m, { scene: "a2_laoho_2" });
            m.push(pick(s, ["Lão Hồ kể chuyện ba mươi năm trước lão đánh nhau với tám tên Thiết Kỵ, câu chuyện mỗi lần một khác.", "Lão Hồ lẩm bẩm: \"Tạ Thiên Hành… tên hay đấy, \"đi thay trời\". Hừ.\"", "Lão Hồ ngủ gật giữa câu, tay vẫn giữ chặt bát rượu."]));
            return R(m);
          } },
          { t: "Nghe ngóng tin đồn", run: (s) => {
            if (!once(s, "today_tin")) return R(["Hôm nay khách điếm chẳng có gì mới."], { free: true });
            const pool = ["Thủy phỉ Hắc Giao lại cướp một thuyền muối. Hắn đóng trại ở khúc sông hẹp dưới vách đá, nhưng chẳng ai biết lối vào.", "Nghe nói ở chợ đen bến sông có kẻ bán tin, chuyện gì cũng biết, chỉ cần có bạc.", "Lôi đài Lạc Hà có một kiếm khách tên Lãnh Nguyệt, ba tháng chưa thua trận nào.", "Rừng trúc ngoài trấn có hổ dữ xuống núi, đã vồ hai người kiếm củi.", "Ông lão chèo đò ở bến sông hay bị thủy phỉ bắt nạt, nghe nói ông ta từng là hòa thượng."];
            return R(["Một gã lái buôn kể: \"" + pick(s, pool) + "\""].concat(KM.apply(s, { exp: 20 + 3 * s.level })));
          } },
        ] },
        { id: "tieu_cuc", name: "Long Môn Tiêu Cục", art: "yard2", desc: "Tiêu cục lớn nhất Lạc Hà. Cờ rồng đen bay trước cổng.", when: "day", actions: [
          { t: "Ứng tuyển tiêu sư", sub: "đấu với tiêu đầu Mã Đại · Rank D · Lv 11", show: (s) => !KM.has(s, "tieu_su"), run: (s) => {
            if (!once(s, "today_tieu_test")) return R(["Mã Đại: \"Mai quay lại.\""], { free: true });
            return R([], { scene: "a2_tieu_test" });
          } },
          { t: "Nhận việc áp tiêu ngắn", sub: "2 buổi · có thể gặp cướp", cost: 2, show: (s) => KM.has(s, "tieu_su"), run: (s) => {
            const r = KM.d100(s), m = ["Áp một xe hàng sang làng bên. Gặp cướp: d100 = " + r + " / cần ≤ 60 → " + (r <= 60 ? "có" : "không")];
            const pay = { money: 300 + 20 * s.level, exp: trainExp(s, 0.12), rep: { long_mon: 8 } };
            if (r <= 60) return R(m, { fight: { foes: KM.die(s, 3) === 3 ? ["cuop_duong", "cuop_duong"] : ["cuop_duong"], opts: { road: true }, after: (s2, won) => won ? KM.apply(s2, pay) : ["Hàng bị cướp mất một nửa. Không có tiền công."] } });
            return R(m.concat(KM.apply(s, pay)));
          } },
          { t: "Nhận chuyến tiêu đi Phong Lâm", sub: "3 ngày đường, hạn 5 ngày", show: (s) => KM.has(s, "tieu_su") && !s.tieuRun && !s.quests.q_phong_lam, cost: 0, run: (s) => {
            s.tieuRun = { due: s.day + 5 };
            return R(KM.apply(s, { quest: { q_phong_lam: { name: "Chuyến tiêu Phong Lâm", desc: "Giao hàng tới trạm tiêu Phong Lâm trước hết ngày " + (s.day + 5) + ". Đi bộ mất 3 ngày; có ngựa sẽ nhanh hơn.", deadline: s.day + 5 } } }).concat(["Mở Bản đồ để lên đường."]));
          } },
          { t: "Luyện võ với tiêu sư", run: (s) => R(["Shen đấu tập với mấy tiêu sư già."].concat(trainSkill(s), KM.apply(s, { exp: 40 + trainExp(s, 0.1) }))), show: (s) => KM.has(s, "tieu_su") },
        ] },
        { id: "cho", name: "Chợ Lạc Hà", art: "market", when: "day", desc: "Chợ bên bến sông, buôn bán từ sáng đến chiều.", actions: [
          { t: "Tiệm binh khí", cost: 0, run: () => R([], { shop: "binh_khi" }) },
          { t: "Hiệu thuốc Hồi Xuân", cost: 0, run: () => R([], { shop: "hieu_thuoc" }) },
          { t: "Thư quán Văn Uyên (bí kíp)", cost: 0, run: () => R([], { shop: "thu_quan" }) },
          { t: "Chợ ngựa", cost: 0, run: () => R([], { horses: true }) },
          { t: "Lò rèn Âu Trì (cường hóa)", cost: 0, run: (s) => R(KM.apply(s, { meet: "au_tri" }), { forge: true }) },
        ] },
        { id: "cho_den", name: "Chợ đen bến sông", art: "river", when: "night", desc: "Chỉ họp ban đêm, dưới những chiếc thuyền úp ngược.", actions: [
          { t: "Xem hàng chợ đen", cost: 0, run: () => R([], { shop: "cho_den" }) },
          { t: "Mua tin về thủy trại Hắc Giao", sub: "5 bạc", show: (s) => s.quests.q_hac_giao && !KM.has(s, "a2_scouted"), run: (s) => {
            if (s.money < 500) return R(["Kẻ bán tin lắc đầu: \"5 bạc. Không bớt.\""], { free: true });
            return R(KM.apply(s, { money: -500, flag: "know_lair" }).concat(["\"Lối vào thủy trại là khe đá có cây liễu chết. Đêm nào cũng có hai tên gác.\" Giờ có thể tới bến sông ban đêm dò thám."]));
          } },
        ] },
        { id: "ben_song", name: "Bến sông", art: "river", desc: "Thuyền buôn, dân chài và thủy phỉ lẫn lộn.", actions: [
          { t: "Giúp dân chài kéo lưới", show: day, run: (s) => R(["Shen kéo lưới cả buổi, tay phồng rộp."].concat(KM.apply(s, { money: 60 + 5 * s.level, exp: trainExp(s, 0.06) + 20, rep: { lac_ha: 3 } }))) },
          { t: "Ra bến lúc chiều tà", show: (s) => day(s) && !KM.has(s, "fisher_seen") && s.day >= (s.marks.arrive || 0) + 1, run: (s) => { KM.flag(s, "fisher_seen"); return R([], { scene: "a2_fisher" }); } },
          { t: "Dò thám thủy trại", sub: "ban đêm", show: (s) => night(s) && s.quests.q_hac_giao && !KM.has(s, "a2_scouted") && (KM.has(s, "know_lair") || (s.aff.lao_ho || 0) >= 25), run: () => R([], { scene: "a2_scout" }) },
          { t: "Tấn công thủy trại Hắc Giao", sub: "Trùm · Rank D · Lv 18", show: (s) => night(s) && KM.has(s, "a2_scouted") && !KM.has(s, "hac_giao_down"), run: () => R([], { scene: "a2_lair" }) },
        ] },
        { id: "loi_dai", name: "Lôi đài Lạc Hà", art: "arena", when: "day", desc: "Phí vào 1 bạc. Thắng thì có thưởng. Mỗi võ sĩ một trận mỗi ngày.", actions: [
          { t: "Đấu với Hồ Báo", sub: "Rank D · Lv 11 · thưởng 5 bạc", run: (s) => arena(s, "vo_si_1", 500, "today_ld1") },
          { t: "Đấu với Thiết Ngưu", sub: "Rank D · Lv 13 · thưởng 10 bạc", show: (s) => KM.has(s, "ld1_won"), run: (s) => arena(s, "vo_si_2", 1000, "today_ld2") },
          { t: "Đấu với Lãnh Nguyệt", sub: "Rank D · Lv 16 · thưởng 25 bạc", show: (s) => KM.has(s, "ld2_won"), run: (s) => arena(s, "vo_si_3", 2500, "today_ld3") },
        ] },
        { id: "rung_truc", name: "Rừng trúc ngoại trấn", art: "bamboo", when: "day", desc: "Bìa rừng có sói và heo rừng. Sâu bên trong là sói đầu đàn, cướp đường, và lời đồn về một con hổ dữ.", actions: [
          { t: "Săn ở bìa rừng", sub: "Rank E", run: (s) => R(["Shen men theo bìa rừng trúc."], { fight: { foes: hunt1(s), opts: {} } }) },
          { t: "Đi sâu vào rừng trúc", sub: "Rank D · có thể gặp hổ dữ Rank C", run: (s) => { const h = hunt2(s); return R([h.note || "Shen đi sâu vào rừng trúc."], { fight: { foes: h.foes, opts: {} } }); } },
        ] },
      ],
    },

    /* ================= THÔN HẠNH HOA ================= */
    hanh_hoa: {
      name: "Thôn Hạnh Hoa", place: "village",
      locs: [
        { id: "gieng", name: "Giếng làng", art: "village", desc: "Nơi dân thôn tụ tập. Trưởng thôn Lưu hay ngồi dưới gốc hạnh.", actions: [
          { t: "Hỏi chuyện dân làng", show: (s) => s.slot <= 1, run: (s) => {
            if (!once(s, "today_hh_hoi")) return R(["Dân làng đã ra đồng hết."], { free: true });
            return R(["Một bà lão kể: \"" + pick(s, ["Heo rừng năm nay nhiều lắm, phá sạch ruộng khoai.", "Đường lên Thanh Vân dạo này hay có người lạ qua lại, áo đen cả.", "Miếu Thổ Địa trên dốc linh lắm, cầu gì được nấy.", "Thằng Hạ Tứ đi săn giỏi nhất thôn, mà dạo này bị bọn sơn tặc đuổi khỏi lán."]) + "\""].concat(KM.apply(s, { exp: 20 + 3 * s.level, rep: { hanh_hoa: 3 } })));
          } },
        ] },
        { id: "quan_tra", name: "Quán trà đầu thôn", art: "inn", desc: "Quán trà nhỏ của bà Tư. Có mấy gian trọ cho khách qua đường.", actions: [
          { t: "Trọ lại qua đêm", sub: "5 đồng", cost: 0, run: (s) => R(KM.apply(s, { money: -Math.min(5, s.money) }).concat(KM.sleep(s))) },
          { t: "Uống trà nghỉ chân", sub: "2 đồng · hồi 20% HP", run: (s) => { const d = KM.derived(s), b = s.cur.hp; s.cur.hp = Math.min(d.maxHP, s.cur.hp + Math.floor(d.maxHP * 0.2)); return R(KM.apply(s, { money: -Math.min(2, s.money) }).concat(["+" + (s.cur.hp - b) + " HP."])); } },
        ] },
        { id: "doi", name: "Đồi Hạnh Hoa", art: "forest", when: "day", desc: "Đồi thấp sau thôn, rừng thưa. Heo rừng, sói và đôi khi sơn tặc.", actions: [
          { t: "Săn trên đồi", sub: "Rank E", run: (s) => R(["Shen leo lên đồi."], { fight: { foes: hunt1(s), opts: {} } }) },
        ] },
        { id: "mieu", name: "Miếu Thổ Địa", art: "temple", desc: "Ngôi miếu nhỏ trên dốc, khói hương quanh năm.", actions: [
          { t: "Thắp hương cầu may", sub: "5 đồng · d100 ≤ 10 + LUK/5", run: (s) => {
            if (!once(s, "today_mieu")) return R(["Hương đã thắp hôm nay rồi."], { free: true });
            const pct = 10 + KM.eff(s).LUK / 5, r = KM.d100(s), m = KM.apply(s, { money: -Math.min(5, s.money) });
            m.push("Cầu may: d100 = " + r + " / cần ≤ " + KM.fmtPct(pct) + " → " + (r === 1 || r <= pct ? "linh ứng" : "không có gì"));
            if (r === 1 || r <= pct) m.push(...KM.apply(s, pick(s, [{ money: 500 }, { item: ["hoi_khi", 2] }, { item: ["kim_sang", 3] }, { exp: 200 + 30 * s.level }])));
            return R(m);
          } },
        ] },
      ],
    },
    /* ================= PHONG LÂM ================= */
    phong_lam: {
      name: "Phong Lâm Trấn", place: "town",
      locs: [
        { id: "tram", name: "Trạm tiêu Phong Lâm", art: "yard2", desc: "Trạm tiêu nhỏ của Long Môn, có phòng trọ cho tiêu sư.", actions: [
          { t: "Giao hàng chuyến tiêu", cost: 0, show: (s) => !!s.tieuRun, run: () => R([], { scene: "a2_phong_lam" }) },
          { t: "Nghỉ đêm ở trạm", cost: 0, run: (s) => R(KM.sleep(s)) },
        ] },
        { id: "cho_phien", name: "Chợ phiên Phong Lâm", art: "market", when: "day", desc: "Chợ họp mỗi ngày, hàng hóa từ phương nam đổ về.", actions: [
          { t: "Hiệu thuốc", cost: 0, run: () => R([], { shop: "hieu_thuoc" }) },
          { t: "Tiệm binh khí", cost: 0, run: () => R([], { shop: "binh_khi" }) },
          { t: "Chợ ngựa", cost: 0, run: () => R([], { horses: true }) },
        ] },
        { id: "y_quan", name: "Y quán họ Mạc", art: "medic", desc: "Lang trung Mạc chữa bệnh cho cả trấn.", actions: [
          { t: "Chữa thương", sub: "30 đồng · hồi đầy HP", run: (s) => { if (s.money < 30) return R(["Không đủ 30 đồng."], { free: true }); const d = KM.derived(s); s.cur.hp = d.maxHP; return R(KM.apply(s, { money: -30 }).concat(["HP hồi đầy."])); } },
        ] },
        { id: "rung_phong", name: "Rừng phong", art: "forest", when: "day", desc: "Rừng lá đỏ phía nam trấn. Sói đầu đàn và cướp đường.", actions: [
          { t: "Đi vào rừng phong", sub: "Rank D", run: (s) => { const r = KM.d100(s); const f = r <= 50 ? ["soi_dau_dan"] : r <= 85 ? ["cuop_duong"] : ["cuop_duong", "cuop_duong"]; return R(["Lá phong rụng đỏ dưới chân."], { fight: { foes: f, opts: {} } }); } },
        ] },
      ],
    },
    /* ================= HẮC PHONG SƠN ================= */
    hac_phong: {
      name: "Hắc Phong Sơn", place: "road", note: (s) => KM.has(s, "rescued_phuong") ? "Trại đã tan, nhưng tàn dư sơn tặc vẫn lẩn khuất trong núi." : "Trại sơn tặc trên mỏm đá phía trên. Đi một mình rất nguy hiểm.",
      locs: [
        { id: "chan_nui", name: "Chân núi", art: "camp", desc: "Lều tạm của thợ săn bỏ lại.", actions: [
          { t: "Tấn công Hắc Phong Trại", show: (s) => s.quests.q_cuu_phuong && s.quests.q_cuu_phuong.st === "active", run: () => R([], { scene: "a2_hac_phong" }) },
          { t: "Nghỉ ở lều tạm", cost: 0, run: (s) => R(KM.sleep(s)) },
        ] },
        { id: "son_dao", name: "Sơn đạo", art: "camp", when: "day", desc: "Con đường mòn quanh núi, nơi sơn tặc hay phục kích.", actions: [
          { t: "Lùng sục sơn đạo", sub: "Rank D", run: (s) => R(["Shen men theo sơn đạo."], { fight: { foes: KM.die(s, 4) === 4 ? ["cuop_duong", "cuop_duong"] : ["cuop_duong"], opts: {} } }) },
        ] },
      ],
    },
  };
  function arena(s, id, prize, f) {
    if (!once(s, f)) return R(["Võ sĩ này đã đấu hôm nay."], { free: true });
    if (s.money < 100) return R(["Phí vào 1 bạc. Không đủ tiền."], { free: true });
    const m = KM.apply(s, { money: -100 });
    return R(m, { fight: { foes: [id], opts: { solo: true, noLoot: false }, after: (s2, won) => won ? (KM.flag(s2, id === "vo_si_1" ? "ld1_won" : id === "vo_si_2" ? "ld2_won" : "ld3_won"), KM.apply(s2, { money: prize, rep: { lac_ha: 15 } })) : ["Thua. Mất phí vào cửa."] } });
  }

  KM.hubOf = (s) => KM.HUBS[s.place];
  KM.hubLocs = (s, H) => H.locs.filter((l) => !l.show || l.show(s));
  KM.locActions = function (s, loc) {
    return loc.actions.filter((a) => !a.show || a.show(s)).concat(KM.questActions ? KM.questActions(s, s.place, loc.id) : []);
  };
  KM.locOpen = (s, loc) => !loc.when || (loc.when === "day" ? s.slot <= 1 : loc.when === "night" ? s.slot === 2 : true);
  KM.hubAct = function (s, locId, idx) {
    const H = KM.hubOf(s), loc = KM.hubLocs(s, H).find((l) => l.id === locId); if (!loc) return R(["?"]);
    const acts = KM.locActions(s, loc);
    const a = acts[idx]; if (!a) return R(["?"]);
    if (s.slot === 3 && (a.cost == null || a.cost > 0)) return R(["Đã khuya. Chỉ có thể nghỉ ngơi."]);
    if (a.disabled) return R(["Chưa xong: " + (a.sub || "") + "."]);
    if (!KM.locOpen(s, loc) && !(a.cost === 0 && /Nghỉ|Thuê|Trọ|Ngủ/.test(a.t)) && !a.quest) return R(["Nơi này không mở vào giờ này."]);
    if (a.req && !KM.reqOk(s, a.req)) return R(["Chưa đủ điều kiện: " + KM.reqLabel(a.req) + "."]);
    const res = a.run(s);
    const cost = res.free ? 0 : a.cost == null ? 1 : a.cost;
    if (cost) res.msgs.push(...KM.advance(s, cost));
    return res;
  };
  KM.mapDests = function (s) {
    return Object.keys(KM.PLACES).filter((p) => p !== s.place).map((p) => {
      let lock = "";
      if (!KM.has(s, "a1_done") && p !== "hanh_hoa" && p !== "thanh_van") lock = "Đang trong hạn xét xử của Thanh Vân, không đi xa được";
      if (p === "kim_lang") lock = "Arc 3 · sắp ra mắt";
      const path = KM.path(s.place, p);
      if (!path) lock = lock || "Không có đường";
      return { p, days: path ? KM.travelDays(s, s.place, p) : null, base: path ? path.days : null, via: path ? path.nodes : [], lock, known: s.known.includes(p) };
    });
  };
})(typeof window !== "undefined" ? window : globalThis);
