/* =====================================================================
   KIẾM MỆNH · ARC 8 — VẠCH MẶT MINH CHỦ (Kim Lăng) · Rank S → SS · Lv 74–86
             ARC 9 — THIÊN HẠ ĐỆ NHẤT (Thiên Sơn) · Rank SS → SSS · Lv 86–95
   Arc 9: Shen leo Thiên Sơn một mình.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const R = KM.R, night = (s) => s.slot === 2, day = (s) => s.slot <= 1;
  const once = (s, f) => { if (KM.has(s, f)) return false; KM.flag(s, f); return true; };
  const A8 = (s) => KM.has(s, "a8_start") && !KM.has(s, "a8_done");
  const A9 = (s) => KM.has(s, "a9_start") && !KM.has(s, "a9_done");
  const C8 = "Arc 8 · Vạch Mặt Minh Chủ", C9 = "Arc 9 · Thiên Hạ Đệ Nhất";
  const SIDES = ["thieu_lam", "vo_dang", "nga_mi", "cai_bang", "duong_mon"];
  KM.SIDE_NAME = { thieu_lam: "Thiếu Lâm", vo_dang: "Võ Đang", nga_mi: "Nga Mi", cai_bang: "Cái Bang", duong_mon: "Đường Môn" };
  KM.sideNeed = function (s, f) {
    if (f === "thieu_lam") return KM.has(s, "a8_tl_mercy") ? 4 : 6;
    if (f === "vo_dang") return KM.has(s, "saved_thanh_hu") && !KM.dead(s, "thanh_hu") ? 3 : 5;
    if (f === "nga_mi") return KM.has(s, "yen_killed_by_shen") ? 99 : KM.has(s, "saved_to_van_yen") ? 3 : 4;
    if (f === "cai_bang") return KM.has(s, "saved_lao_ho") || KM.has(s, "sect_cai_bang") ? 3 : 5;
    if (f === "duong_mon") return (s.aff.duong_nhat_anh || 0) >= 60 && !KM.dead(s, "duong_nhat_anh") ? 0 : 4;
    return 99;
  };
  const sidesOn = (s) => SIDES.filter((f) => KM.has(s, "side_" + f)).length;
  const WITNESS = [["lien_nhi", "lien_witness"], ["lao_ho", "laoho_2"], ["tieu_hao", "tieu_hao_return"]];
  const COMP_LINE = { to_van_yen: "Tô Vân Yên", lao_ho: "Lão Hồ", phuong_nhi: "Long Phượng Nhi", duong_nhat_anh: "Đường Nhất Ảnh", thanh_hu: "Chân nhân Thanh Hư", hue_nang: "Huệ Năng", lien_nhi: "Liên Nhi", tieu_hao: "Tiêu Hạo", da_linh: "Dạ Linh", ta_van_phi: "Tạ Vân Phi" };
  const fates = (s) => {
    const met = KM.COMPANIONS.filter((n) => s.met.includes(n));
    const dead = met.filter((n) => KM.dead(s, n)), alive = met.filter((n) => !KM.dead(s, n));
    const out = [];
    if (dead.length) out.push("Những người đã nằm xuống trên con đường này: " + dead.map((n) => COMP_LINE[n]).join(", ") + ". Không có phép màu nào đưa họ trở lại.");
    if (alive.length) out.push("Những người còn sống: " + alive.map((n) => COMP_LINE[n]).join(", ") + ".");
    return out;
  };

  Object.assign(KM.SCENES, {
    /* ================= ARC 8 ================= */
    a8_road: { chapter: C8, title: "Về Kim Lăng", place: "road", time: "day", cast: ["shen"], text: ["Con đường từ Lạc Hà về Kim Lăng, Shen đã đi một lần năm ngoái. Khi ấy cậu đi tìm một chiếc nhẫn. Lần này cậu đi tìm một lời phán xét."], special: "travel", dest: "kim_lang", go: "a8_invite" },
    a8_invite: { chapter: C8, title: "Thiệp mời", place: "city", time: "day", cast: ["shen", "ta_thien_hanh"],
      text: [
        "Kim Lăng treo đèn kết hoa. Khắp phố dán cáo thị: \"Đại Hội Võ Lâm, mười ngày nữa, tôn vinh người có công diệt ma.\"",
        "Một tấm thiệp đỏ viền vàng đặt sẵn trên bàn trong khách điếm, đề tên Shen bằng nét chữ phóng khoáng. Nét chữ ấy Shen đã thấy trong một lá thư ở Hữu điện Thánh Hỏa Sơn.",
        "\"Mời Thẩm hiền điệt ngồi bàn chủ khách. Tạ Thiên Hành kính bút.\"",
        "[Hồ sơ chứng cứ: vật chứng 3 điểm, nhân chứng sống 2, lời khai 1. Mỗi phái cần một số điểm khác nhau mới chịu đứng về phía Shen ở Đại Hội. Mỗi đêm có thể có kẻ đến ám sát nhân chứng.]",
      ],
      onEnter: { flag: "a8_start", mark: "a8", arc: 8, place: "kim_lang",
        quest: { q_vach_mat: { name: "Vạch Mặt Minh Chủ", desc: "Gom chứng cứ, bảo vệ nhân chứng, thuyết phục các phái ở Hội quán (Kim Lăng). Đại Hội Võ Lâm ngày A+10.", dueDays: 10, dueFrom: "a8" } } },
      choices: [
        { t: "Nhận thiệp, ngồi bàn chủ khách", go: "@hub", eff: { flag: "a8_guest" }, r: "Ngồi cạnh kẻ thù thì dễ nhìn rõ mặt kẻ thù. Từ nay cửa phủ Minh chủ mở cho Shen." },
        { t: "Xé thiệp", go: "@hub", eff: { trend: { minh: 1 } }, r: "Mảnh thiệp đỏ rơi lả tả xuống sàn. Từ nay Shen bị Thiết Vệ để mắt tới." },
      ] },
    a8_ev: { chapter: C8, title: "Hồ sơ chứng cứ", place: "room", time: "night", cast: ["shen"],
      text: (s) => { const e = KM.evidence(s); return ["Shen bày từng thứ lên bàn dưới ngọn đèn dầu."].concat(e.list.length ? e.list.map((x) => "• " + x.name + " — " + x.pts + " điểm") : ["Chưa có gì."], ["Tổng: " + e.score + " điểm.", "Phái cần: " + SIDES.map((f) => KM.SIDE_NAME[f] + " " + (KM.sideNeed(s, f) >= 99 ? "không bao giờ" : KM.sideNeed(s, f)) + (KM.has(s, "side_" + f) ? " ✓" : "")).join(" · ")]); },
      choices: [{ t: "Cất lại", go: "@hub" }] },
    a8_persuade: { chapter: C8, title: "Hội quán các phái", place: "hall", time: "day", cast: ["shen"],
      text: (s) => ["Các phái đóng ở Hội quán phía đông Kim Lăng, chờ Đại Hội. Ai cũng biết Shen. Không ai biết nên tin cậu đến đâu.", "Chứng cứ hiện có: " + KM.evidence(s).score + " điểm."],
      choices: (s) => SIDES.filter((f) => !KM.has(s, "side_" + f)).map((f) => {
        const need = KM.sideNeed(s, f), ok = KM.evidence(s).score >= need;
        return { t: "Thuyết phục " + KM.SIDE_NAME[f] + (need >= 99 ? " (không bao giờ tha thứ cho kẻ giết Tô Vân Yên)" : " (cần " + need + " điểm)"), req: { fn: () => ok, label: need >= 99 ? "không thể" : need + " điểm chứng cứ" }, go: "@hub", eff: { flag: "side_" + f, rep: { [f]: 100 } },
          r: { thieu_lam: "Phương trượng Thiếu Lâm chắp tay: \"A Di Đà Phật. Thiếu Lâm sẽ đứng sau thí chủ.\"", vo_dang: "Võ Đang rút kiếm khỏi vỏ một tấc, rồi tra vào: \"Đến ngày ấy, kiếm Võ Đang sẽ rút hết.\"", nga_mi: "Sư thái Nga Mi nhìn Shen rất lâu: \"Vân Yên nói cậu là người tốt. Ta tin con bé.\"", cai_bang: "Trưởng lão Cái Bang gõ gậy xuống đất ba cái: \"Thiên hạ ăn mày, theo cậu.\"", duong_mon: "Đường Nhất Ảnh xòe quạt: \"Đường Môn không bao giờ đứng về phe thua.\"" }[f] };
      }).concat([{ t: "Rời Hội quán", go: "@hub" }]) },
    a8_ambush: { repeat: true, chapter: C8, title: "Ám sát nhân chứng", place: "city", time: "night", cast: ["shen", "hac_y"],
      text: ["Nửa đêm, tiếng mái ngói vỡ ở dãy nhà nơi nhân chứng trú ẩn. Huyết Ảnh tàn quân, áo đen, kiếm tẩm độc. Chúng đến để bịt miệng."],
      onEnter: { fx: (s) => ((s.threat = false), []) },
      fight: { foes: ["huyet_tan", "huyet_tan"], opts: { canFlee: false }, win: "a8_ambush_win", lose: "a8_ambush_lose" } },
    a8_ambush_win: { repeat: true, chapter: C8, title: "Giữ được", place: "city", time: "night", cast: ["shen"], text: ["Hai sát thủ ngã xuống sân. Nhân chứng run rẩy, nhưng còn sống."], choices: [{ t: "…", go: "@hub" }] },
    a8_ambush_lose: { repeat: true, chapter: C8, title: "Chậm một bước", place: "city", time: "night", cast: ["shen"], text: ["Khi Shen gượng dậy được, sát thủ đã đi. Trong phòng nhân chứng chỉ còn vết máu."],
      onEnter: { fx: (s) => { const w = WITNESS.find(([n, f]) => KM.has(s, f) && !KM.dead(s, n)); return w ? KM.kill(s, w[0], { actor: "Huyết Ảnh tàn quân", action: "Ám sát nhân chứng trước Đại Hội Võ Lâm", note: "Một nhân chứng đã mất." }) : ["May mắn, đêm nay chúng nhắm nhầm phòng."]; } }, choices: [{ t: "…", go: "@hub" }] },

    a8_tea: { chapter: C8, title: "Chén trà của Minh chủ", place: "palace", time: "night", cast: ["shen", "ta_thien_hanh"],
      text: [
        "Tạ Thiên Hành mời Shen uống trà ở thư phòng, không có thị vệ. Ông rót trà bằng tay trái; tay phải giấu dưới ống tay áo, có một vết bỏng hình bàn tay.",
        "> Ta biết cậu đã gom đủ những gì. — Ông nói, giọng mệt mỏi. — Mười năm trước, ta mắc kẹt trong ma công. Có người dạy ta, rồi bỏ mặc ta. Kinh mạch ta đang mục dần từ bên trong. Thiên Mạch Chân Giải là cách chữa duy nhất. Cha cậu giữ nó, và không chịu đưa.",
        "> Ta không xin cậu tha thứ. Ta chỉ muốn cậu biết: ta cũng từng là một quân cờ.",
        "Chén trà trong tay Shen lạnh dần. Trong đáy chén, cậu thấy một gương mặt, là chính mình, nhưng mắt đỏ như máu.",
        "[Tâm ma trỗi dậy. Đánh bại bóng tâm ma để đột phá cảnh giới Thiên Nhân (Rank SS).]",
      ],
      onEnter: { flag: "a8_tea_seen", mirror: true },
      choices: [{ t: "Đối mặt với chính mình", go: "a8_tam_ma" }] },
    a8_tam_ma: { repeat: true, onEnter: { mirror: true }, chapter: C8, title: "Bóng tâm ma", place: "cave", time: "night", cast: ["shen"], text: ["Bóng tâm ma đứng dậy từ đáy chén trà. Nó biết mọi chiêu thức của Shen, vì nó chính là Shen."],
      fight: { foes: ["tam_ma"], opts: { solo: true, canFlee: false, noLoot: true, hurt: "tam_ma" }, win: "a8_tam_ma_win", lose: "a8_tam_ma_lose" } },
    a8_tam_ma_lose: { repeat: true, chapter: C8, title: "Chưa phá được", place: "cave", time: "night", cast: ["shen"], text: ["Bóng tâm ma cười, giọng y hệt Shen: \"Ngươi sợ ta, vì ta là thứ ngươi có thể trở thành.\" Nhưng nó cũng đã chảy máu."], onEnter: { hurt: "tam_ma", heal: 1, mirror: true }, choices: [{ t: "Đánh lại", go: "a8_tam_ma" }] },
    a8_tam_ma_win: { chapter: C8, title: "Thiên Nhân", place: "palace", time: "day", cast: ["shen"],
      text: ["Bóng tâm ma vỡ vụn như gương. Shen mở mắt, vẫn ngồi trong thư phòng, chén trà vẫn còn nóng. Tạ Thiên Hành đã đi từ lúc nào.", "Trong người cậu, Khí Huyết chảy qua tầng thứ năm của Mạch Ẩn, rộng như sông lớn đổ ra biển.", "[Hệ Thống] Phá tâm ma. Mạch Ẩn tầng 5. Võ Đạo bậc 4. Cánh cửa cảnh giới Thiên Nhân đã mở."],
      onEnter: { flag: "a8_tam_ma_done", ownTier: 5, tier: 4, breakTo: "SS", exp: 150000 }, choices: [{ t: "…", go: "@hub" }] },
    a8_vanphi: { chapter: C8, title: "Tạ Vân Phi", place: "city", time: "night", cast: ["shen", "ta_van_phi"],
      text: ["Tạ Vân Phi đứng ở đầu cầu Chu Tước, đúng chỗ năm ngoái hắn chặn Shen hỏi vì sao bị nhường.", "> Ta đã đọc những thứ ngươi đưa. Ta đã hỏi cha ta. Ông ấy không chối. — Hắn cười, khổ sở. — Ngày mai kia, ngươi muốn ta đứng ở đâu?"],
      onEnter: { flag: "a8_vanphi_seen" },
      choices: [
        { t: "\"Đứng cạnh sự thật.\"", go: "@hub", eff: { flag: "vanphi_side", aff: { ta_van_phi: 15 } }, r: "Tạ Vân Phi gật đầu, rất chậm. \"Được. Ta sẽ làm chứng. Rồi sau đó… ngươi đừng giết ông ấy trước mặt ta.\"" },
        { t: "\"Đứng ở chỗ ngươi tự chọn.\"", go: "@hub", eff: { flag: "vanphi_choose" }, r: "Tạ Vân Phi quay đi. \"Vậy ngày ấy, ta sẽ đứng cạnh cha ta. Đánh với ta một trận cuối, rồi ta sẽ biết mình sai hay đúng.\"" },
      ] },
    a8_chan_giai: { chapter: C8 + " · Kỳ ngộ", title: "Thiên Mạch Chân Giải toàn bản", place: "medic", time: "night", cast: ["shen"],
      text: ["Ba mảnh lụa cũ ghép lại khít như chưa từng bị xé. Thiên Mạch Chân Giải, bản toàn vẹn mà cha Shen đã giữ bằng cả mạng sống.", "Mảnh lụa chép không chỉ cách thông kinh mạch, mà còn cách chữa một thân thể bị ma công gặm nhấm. Thứ Tạ Thiên Hành cần hơn bất cứ thứ gì."],
      onEnter: { flag: "a8_cg_seen" },
      choices: [
        { t: "Tự luyện Chân Giải toàn bản", go: "@hub", eff: { flag: "chan_giai_full", bonus: { src: "Thiên Mạch Chân Giải", st: { VIT: 15, WIS: 15, INT: 10 } }, exp: 50000 }, r: "Shen ngồi luyện suốt đêm. Kinh mạch đứt đoạn từ thuở lọt lòng, lần đầu tiên, có những đoạn nối lại." },
        { t: "Mang Chân Giải tới trao cho Tạ Thiên Hành, đổi lấy lời khai", go: "@hub", eff: { flag: "chan_giai_trade", moral: 30 }, r: "Tạ Thiên Hành nhận mảnh lụa bằng hai tay run rẩy. \"Cha cậu… cũng sẽ làm thế.\" Ông viết một tờ cung khai, ký tên, đóng dấu. Rồi ông bắt đầu luyện, ngay trước mặt Shen. Ma khí trong ông nhạt dần." },
      ] },
    a8_mercy: { chapter: C8, title: "Sát thủ hụt", place: "temple", time: "night", cast: ["shen", "hue_tri"],
      text: ["Một sát thủ Huyết Ảnh lẻn vào chùa Thiện Giác định ám sát Shen, bị bắt sống. Hắn mới mười lăm tuổi, tay còn run khi cầm dao.", "Phương trượng Huệ Trì nhìn Shen: \"Thí chủ muốn xử hắn thế nào?\""],
      choices: [
        { t: "Tha cho nó, để Phương trượng giữ lại chùa", go: "@hub", eff: { flag: "a8_tl_mercy", moral: 15, rep: { thieu_lam: 60 } }, r: "Phương trượng chắp tay cúi đầu thật sâu. \"Thiếu Lâm đã thấy lòng thí chủ.\"" },
        { t: "Giao cho quan phủ", go: "@hub", eff: { flag: "a8_mercy_done" } },
      ] },
    a8_mat_that: { chapter: C8, title: "Mật thất phủ Minh chủ", place: "cave", time: "night", cast: ["shen"],
      text: ["Ba chìa khóa đồng mở ba ngọn đèn đá dưới bàn thờ tổ tiên họ Tạ. Vách đá trượt sang bên. Trong mật thất là một cuốn sổ chi bạc: từng khoản tiền trả cho Huyết Ảnh Lâu, mười năm, không sót khoản nào."],
      onEnter: { flag: "ev_mat_that", take: ["chia_khoa_mat", 3], exp: 40000 }, choices: [{ t: "Mang đi", go: "@hub" }] },
    a8_truong_lao: { chapter: C8, title: "Trưởng lão bị mua chuộc", place: "hall", time: "night", cast: ["shen", "hue_nang"],
      text: ["Trưởng lão này đã nhận bạc của phủ Minh chủ suốt năm năm, đêm nay hẹn gặp người của phủ ở đình bỏ hoang. Shen tới trước."],
      fight: { foes: ["truong_lao"], opts: { canFlee: true }, win: "a8_truong_lao_win", lose: "@hub", tx: "a8_truong_lao" } },
    a8_truong_lao_win: { chapter: C8, title: "Lời khai", place: "hall", time: "night", cast: ["shen"], text: ["Trưởng lão quỳ dưới đất, khai hết: ai đưa bạc, bao nhiêu, để làm gì."], onEnter: { flag: "ev_truong_lao" }, choices: [{ t: "…", go: "@hub" }] },
    a8_trieu_phuc: { chapter: C8, title: "Triệu Phúc", place: "inn", time: "night", cast: ["shen", "trieu_phuc"],
      text: ["Quản gia Triệu Phúc bị Shen chặn ở cửa sau tiệm Phúc Ký, chùm chìa khóa vẫn lủng lẳng bên hông.", "> Tôi… tôi chỉ làm theo lệnh. Tôi có vợ con…"],
      choices: [
        { t: "Ép hắn khai", go: "@hub", eff: { flag: "ev_trieu_phuc", moral: -10 }, r: "Triệu Phúc khai hết, nước mắt nước mũi chảy ròng ròng." },
        { t: "Hứa đưa vợ con hắn ra khỏi Kim Lăng nếu hắn chịu làm chứng", req: { INT: 70 }, go: "@hub", eff: { flag: "ev_trieu_phuc", moral: 5 }, r: "Triệu Phúc nhìn Shen rất lâu, rồi gật đầu. \"Ngày Đại Hội, tôi sẽ đứng ra.\"" },
      ] },

    /* ---------- Đại Hội Võ Lâm ---------- */
    a8_hoi: { chapter: C8, title: "Đại Hội Võ Lâm", place: "arena", time: "day", cast: ["shen", "ta_thien_hanh"],
      text: (s) => {
        const e = KM.evidence(s), n = sidesOn(s);
        return [
          "Quảng trường trước phủ Minh chủ, nơi Shen từng thắng hoặc thua ở Đại Hội Thiếu Niên. Giờ đây là chưởng môn các phái, là quan lại triều đình, là hàng vạn người giang hồ.",
          "Tạ Thiên Hành đứng trên đài cao, sắp đọc tên người kế vị. Shen bước lên.",
          "Cậu trình từng thứ một. " + (e.list.length ? e.list.map((x) => x.name).join(", ") + "." : "Trong tay cậu, gần như không có gì."),
          n ? "Lần lượt, " + SIDES.filter((f) => KM.has(s, "side_" + f)).map((f) => KM.SIDE_NAME[f]).join(", ") + " đứng dậy, bước về phía Shen." : "Không một phái nào đứng dậy. Cả quảng trường xì xào: kẻ vu khống.",
          "Tạ Thiên Hành im lặng rất lâu. Rồi ông cởi áo bào trắng. Dưới lớp áo, kinh mạch trên người ông đen như mực.",
          "> Thôi được. Mười năm diễn kịch, ta cũng mệt rồi.",
        ];
      },
      onEnter: { flag: "a8_hoi", place: "kim_lang", cond: { req: { fn: (s) => KM.evidence(s).score < 6 }, note: "Chứng cứ dưới 6 điểm: các phái đứng ngoài, Shen phải một mình đối mặt Minh chủ." } },
      choices: [
        { t: "Tạ Vân Phi rút kiếm, bước ra chắn trước cha", req: { flag: "vanphi_choose", alive: "ta_van_phi" }, hide: true, go: "a8_vanphi_f" },
        { t: "Vào trận", req: { fn: (s) => !KM.has(s, "vanphi_choose") || KM.dead(s, "ta_van_phi") }, hide: true, go: "a8_boss" },
      ] },
    a8_vanphi_f: { chapter: C8, title: "Trận cuối với Tạ Vân Phi", place: "arena", time: "day", cast: ["shen", "ta_van_phi"], text: ["> Một trận cuối. — Tạ Vân Phi nói. — Thắng ta, ngươi có quyền phán xét cha ta."],
      fight: { foes: ["ta_van_phi_ss"], opts: { solo: true, canFlee: false, noLoot: true }, win: "a8_vanphi_win", lose: "a8_vanphi_win", tx: "a8_vanphi_f" } },
    a8_vanphi_win: { chapter: C8, title: "Tránh đường", place: "arena", time: "day", cast: ["shen", "ta_van_phi"], text: ["Tạ Vân Phi buông kiếm. Hắn bước sang một bên, mắt đỏ hoe. Hắn đã biết câu trả lời từ trước khi rút kiếm."], onEnter: { flag: "vanphi_side" }, choices: [{ t: "…", go: "a8_boss" }] },
    a8_boss: { chapter: C8, title: "Minh chủ Tạ Thiên Hành", place: "arena", time: "day", cast: ["shen", "ta_thien_hanh"], text: ["Tạ Thiên Hành vung tay. Một dấu bàn tay đen in lên nền đá, y hệt dấu trên ngực cha Shen mười năm trước."],
      fight: { foes: ["ta_thien_hanh"], opts: { canFlee: false, hurt: "ttt", cuts: SIDES.map((f) => ["side_" + f, 0.92]).concat([["chan_giai_trade", 0.75]]) }, win: "a8_judge", lose: "a8_boss_lose" } },
    a8_boss_lose: { repeat: true, chapter: C8, title: "Gượng dậy", place: "arena", time: "day", cast: ["shen"], text: ["Shen ngã xuống giữa quảng trường. Ma khí trên người Tạ Thiên Hành cũng đang nuốt chính ông. Ông ho ra một ngụm máu đen."], onEnter: { hurt: "ttt", heal: 1 }, choices: [{ t: "Đứng dậy", go: "a8_boss" }] },
    a8_judge: { chapter: C8, title: "Phán xét", place: "arena", time: "dusk", cast: ["shen", "ta_thien_hanh"],
      text: ["Tạ Thiên Hành quỳ giữa đống đổ nát của đài cao. Ma khí đã rút khỏi người ông, để lại một ông già gầy gò, tóc bạc trắng.", "> Giết ta đi. Cha cậu đáng được thế.", "Cả quảng trường chờ Shen."],
      onEnter: { flag: "a8_boss_done", exp: 200000, money: 500000, quest: { q_vach_mat: "done" } },
      choices: [
        { t: "Giết", go: "a8_end", eff: { flag: "ttt_killed", cond: { req: { fn: (s) => sidesOn(s) < 3 }, eff: { moral: -30 } }, fx: (s) => KM.has(s, "vanphi_side") ? [] : KM.apply(s, { aff: { ta_van_phi: -100 } }) }, r: "Một nhát. Máu của Tạ Thiên Hành thấm xuống nơi từng dựng lôi đài. Mối thù Thẩm gia trang, sau mười năm, đã trả." },
        { t: "Phế võ công, để ông sống trong ngục", go: "a8_end", eff: { flag: ["ttt_crippled", "a9_info"], moral: 20 }, r: "Shen điểm vào Đan Điền Tạ Thiên Hành. Ông khụy xuống, già đi mười tuổi trong nháy mắt. Trước khi bị giải đi, ông nói một cái tên: \"Thiên Cơ. Hắn ở Thiên Sơn.\"" },
        { t: "Giao cho triều đình xét xử", go: "a8_end", eff: { flag: "ttt_court", rep: { trieu_dinh: 200 } }, r: "Cẩm Y Ti giải Tạ Thiên Hành đi. Ba ngày sau, tin báo về: Minh chủ đột tử trong ngục, không rõ nguyên do." },
      ] },
    a8_end: { chapter: C8 + " · Kết", title: "Quân cờ đen", place: "city", time: "night", cast: ["shen", "ong_lao_tra"],
      text: [
        "Đêm ấy, trên bàn trong khách điếm, có một quân cờ đen đặt cạnh chén trà còn ấm. Dưới quân cờ là một mảnh giấy:",
        "\"Lên Thiên Sơn. Ván cờ này, ngươi là quân cuối cùng. Mười hai ngày sau khi ngươi tới chân núi, ta sẽ phá Băng Đê. Thiên Cơ.\"",
        "Shen nhận ra nét chữ. Nó giống hệt nét chữ trên tấm biển gỗ của quán trà ngõ Ô Y.",
        "[Kết thúc Arc 8. Mở Arc 9 · Thiên Hạ Đệ Nhất.]",
      ],
      onEnter: { flag: "a8_done", item: ["minh_chu_lenh", 1], meet: "thien_co", cond: { req: { flag: "ttt_court" }, eff: {}, note: "Thiên Cơ đã xóa dấu vết. Shen bước vào Arc 9 mà không biết hết về kẻ thù." } },
      choices: [{ t: "Lên Thiên Sơn", go: "a9_road" }, { t: "Chuẩn bị thêm ở Kim Lăng (đi Thiên Sơn bằng bản đồ)", go: "@hub" }] },

    /* ================= ARC 9 ================= */
    a9_road: { chapter: C9, title: "Đường lên Thiên Sơn", place: "snow", time: "day", cast: ["shen"], text: ["Thiên Sơn ở tận cùng phía tây bắc, nơi trời và tuyết nhập làm một. Người ta bảo ở đó có những ngọn núi chưa ai leo tới đỉnh."], special: "travel", dest: "thien_son", go: "a9_foot" },
    a9_foot: { chapter: C9, title: "Chân Thiên Sơn", place: "snow", time: "dusk", cast: ["shen"],
      text: [
        "Dưới chân Thiên Sơn có ba trấn nhỏ dọc dòng sông băng. Dân trấn sống bằng nghề săn và buôn da, chẳng ai biết trên núi có gì.",
        "Phía trên ba trấn là Băng Đê, bức tường băng tự nhiên chặn một hồ nước khổng lồ. Nếu nó vỡ, ba trấn sẽ biến mất trong một đêm.",
        "Trên tảng đá đầu trấn Bạch Thủy, có một bàn cờ dở dang, quân đen bị vây ba góc.",
        "[Thiên Hạ Kỳ Cục: 12 ngày. Leo núi qua 5 chặng, mỗi chặng 2 ngày. Qua Băng Cốc thì không quay xuống được nữa.]",
      ],
      onEnter: { flag: "a9_start", mark: "a9", arc: 9, place: "thien_son",
        quest: { q_thien_co: { name: "Thiên Hạ Kỳ Cục", desc: "Leo Thiên Sơn qua 5 chặng (mỗi chặng 2 ngày), đánh bại Thiên Cơ Lão Nhân trước khi Băng Đê vỡ vào ngày A+12.", dueDays: 12, dueFrom: "a9" } } },
      special: "hub", hub: "thien_son" },
    a9_farewell: { chapter: C9, title: "Một mình", place: "snow", time: "day", cast: ["shen"],
      text: (s) => {
        const alive = KM.COMPANIONS.filter((n) => s.met.includes(n) && !KM.dead(s, n) && (s.aff[n] || 0) >= 20);
        return [
          alive.length ? "Những người theo Shen tới chân núi: " + alive.map((n) => COMP_LINE[n]).join(", ") + ". Ai cũng muốn lên cùng." : "Không ai theo Shen tới chân núi. Như thế có lẽ cũng tốt.",
          "Shen lắc đầu. Ván cờ này Thiên Cơ bày cho một người. Đem thêm ai lên núi, là đem thêm một quân cờ cho lão.",
          "> Ở lại giữ ba trấn. Nếu Băng Đê vỡ, ít ra còn có người dẫn dân chạy.",
          "Cậu quay lưng, một mình bước lên con đường tuyết.",
        ];
      },
      onEnter: { flag: "a9_climb" }, choices: [{ t: "Bắt đầu leo", go: "a9_s1" }] },
    a9_s1: { chapter: C9, title: "Chặng 1 · Phong Tuyết", place: "snow", time: "day", cast: ["shen"],
      text: ["Bão tuyết nổi lên từ giữa trưa. Gió thổi ngang, tuyết quất vào mặt như roi. Trong màn trắng xóa, hai cái bóng khổng lồ lừ lừ tiến lại: tuyết quái Thiên Sơn."],
      onEnter: { time: 8, fx: (s) => { if (s.gear.body && KM.ITEMS[s.gear.body].cold) return ["Áo chống lạnh giữ ấm Shen qua bão tuyết."]; const d = KM.derived(s), l = Math.floor(d.maxHP * 0.2); s.cur.hp = Math.max(1, s.cur.hp - l); return ["Không có áo chống lạnh: −" + l + " HP (20% HP tối đa)."]; } },
      fight: { foes: ["tuyet_quai", "tuyet_quai"], opts: { canFlee: false }, win: "a9_s2", lose: "a9_s1_lose", tx: "a9_s1" } },
    a9_s1_lose: { repeat: true, chapter: C9, title: "Vùi trong tuyết", place: "snow", time: "night", cast: ["shen"], text: ["Shen tỉnh dậy trong một hốc đá, tuyết phủ nửa người. Tuyết quái đã bỏ đi. Cậu nhai một viên đan, gượng dậy."], onEnter: { heal: 1, time: 2, hurt: "tq9" }, choices: [{ t: "Leo tiếp", go: "a9_s1b" }] },
    a9_s1b: { repeat: true, chapter: C9, title: "Phong Tuyết", place: "snow", time: "day", cast: ["shen"], text: ["Tuyết quái lại chắn đường."], fight: { foes: ["tuyet_quai"], opts: { canFlee: false, hurt: "tq9" }, win: "a9_s2", lose: "a9_s1_lose" } },
    a9_s2: { chapter: C9, title: "Chặng 2 · Băng Cốc", place: "cave", time: "day", cast: ["shen", "kiem_khoi"],
      text: ["Băng Cốc là một khe núi hẹp, vách băng xanh trong như ngọc. Giữa khe đứng những hình người bằng sắt và gỗ, khớp nối kêu lạch cạch: cơ quan nhân của Thiên Cơ.", "Phía sau Shen, một tảng băng khổng lồ rơi xuống, lấp kín lối về."],
      onEnter: { time: 8, flag: "a9_banglock" },
      fight: { foes: ["co_quan", "co_quan"], opts: { canFlee: false, hurt: "cq9" }, win: "a9_s3", lose: "a9_s2_lose", tx: "a9_s2" } },
    a9_s2_lose: { repeat: true, chapter: C9, title: "Lùi lại", place: "cave", time: "night", cast: ["shen"], text: ["Shen lùi vào một hốc băng, điều tức nửa đêm. Đám cơ quan nhân không đuổi theo, chúng chỉ canh khe núi."], onEnter: { heal: 1, time: 2, hurt: "cq9" }, choices: [{ t: "Phá qua lần nữa", go: "a9_s2" }] },
    a9_s3: { chapter: C9, title: "Chặng 3 · Kỳ Lộ", place: "snow", time: "day", cast: ["shen"],
      text: ["Con đường lên cao trải dài chín bàn cờ đá. Trên mỗi bàn khắc một dòng chữ, và mỗi dòng chữ là một chuyện Shen đã làm.", "Bàn thứ nhất: \"Đêm mưa ở hậu trù Thanh Vân, ngươi muốn sống để làm gì?\""],
      onEnter: { time: 8 },
      choices: [
        { t: "\"Để bắt kẻ thù trả giá.\"", go: "a9_s3b", eff: { fx: (s) => ((s.visits.end_ma = (s.visits.end_ma || 0) + 1), []) } },
        { t: "\"Để không ai phải chết như cha mẹ ta nữa.\"", go: "a9_s3b", eff: { fx: (s) => ((s.visits.end_khai = (s.visits.end_khai || 0) + 1), []) } },
        { t: "\"Chỉ để sống.\"", go: "a9_s3b", eff: { fx: (s) => ((s.visits.end_an = (s.visits.end_an || 0) + 1), []) } },
      ] },
    a9_s3b: { chapter: C9, title: "Kỳ Lộ", place: "snow", time: "day", cast: ["shen"], text: ["Bàn thứ năm: \"Nếu cả thiên hạ coi ngươi là ác nhân, nhưng nhờ thế mà thiên hạ được yên, ngươi có chịu không?\""],
      choices: [
        { t: "\"Chịu.\"", go: "a9_s3c", eff: { fx: (s) => ((s.visits.end_kieu = (s.visits.end_kieu || 0) + 1), []) } },
        { t: "\"Không. Người tốt phải được gọi là người tốt.\"", go: "a9_s3c", eff: { fx: (s) => ((s.visits.end_khai = (s.visits.end_khai || 0) + 1), []) } },
        { t: "\"Thiên hạ yên hay không, liên quan gì tới ta.\"", go: "a9_s3c", eff: { fx: (s) => ((s.visits.end_ma = (s.visits.end_ma || 0) + 1), []) } },
      ] },
    a9_s3c: { chapter: C9, title: "Kỳ Lộ", place: "snow", time: "dusk", cast: ["shen", "huyet_y"], text: ["Bàn thứ chín không có chữ. Thay vào đó, từ bàn cờ bốc lên một bóng áo đỏ. Bóng của Lâu chủ Huyết Y, mạnh hơn cả lúc hắn còn sống.", "> Thiên Cơ muốn biết ngươi còn nhớ ta không."],
      fight: { foes: ["bong_huyet_y"], opts: { canFlee: false, noLoot: true, hurt: "bong9" }, win: "a9_s4", lose: "a9_s3c_lose" } },
    a9_s3c_lose: { repeat: true, chapter: C9, title: "Bóng cũ", place: "snow", time: "night", cast: ["shen"], text: ["Shen ngã giữa bàn cờ. Bóng áo đỏ chập chờn, như cũng đang tan dần."], onEnter: { heal: 1, time: 2, hurt: "bong9" }, choices: [{ t: "Đứng dậy", go: "a9_s3c" }] },
    a9_s4: { chapter: C9, title: "Chặng 4 · Vấn Tâm đài", place: "snow", time: "night", cast: ["shen"],
      text: ["Vấn Tâm đài là một mỏm đá tròn nhô ra giữa biển mây. Đứng trên đó, người ta nghe thấy chính lòng mình.", "Shen ngồi xuống. Ba câu hỏi vang lên, không từ đâu cả: Ngươi là ai? Ngươi đã làm gì? Ngươi sẽ làm gì?", "Cậu trả lời, bằng chính lịch sử của mình. Mỗi lựa chọn trong Sổ Ân Oán hiện lên, rõ như vết khắc trên đá.", "[Hệ Thống] Võ Đạo Tâm. Cánh cửa cảnh giới Võ Thần đã mở. Kỳ ngộ: chọn thêm một đặc tính."],
      onEnter: { time: 8, breakTo: "SSS", fx: (s) => { const pool = Object.keys(KM.TRAITS).filter((k) => !s.traits.includes(k) && !KM.TRAITS[k].rare); s.offer9 = []; while (s.offer9.length < 3 && pool.length) s.offer9.push(pool.splice(Math.floor(KM.rand(s) * pool.length), 1)[0]); return []; } },
      choices: (s) => (s.offer9 || []).map((k) => ({ t: KM.TRAITS[k].name + " — " + KM.TRAITS[k].desc, go: "a9_s5", eff: { fx: (s2) => { if (!s2.traits.includes(k)) s2.traits.push(k); KM.recalc(s2); return ["Đặc tính mới: " + KM.TRAITS[k].name + "."]; } } })).concat((s.offer9 || []).length ? [] : [{ t: "Đi tiếp", go: "a9_s5" }]) },
    a9_s5: { chapter: C9, title: "Chặng 5 · Thiên Cơ Các", place: "palace", time: "day", cast: ["shen", "thien_co"],
      text: [
        "Trên đỉnh Thiên Sơn có một gian các gỗ nhỏ, mái phủ tuyết. Bên trong, một ông lão ngồi trước bàn cờ, rót trà vào hai chén.",
        "Ông lão bán trà ngõ Ô Y.",
        "> Ngồi đi. — Thiên Cơ cười hiền như mọi chiều ở Kim Lăng. — Ta dạy Tạ Thiên Hành ma công, nuôi Huyết Ảnh Lâu, đẩy giang hồ vào chiến tranh. Ngươi muốn hỏi vì sao? Vì sư phụ ta, Kiếm Thần Vô Danh, nói võ đạo không thể dạy. Ta muốn chứng minh ông ấy sai. Thiên hạ là bàn cờ của ta, và ngươi là quân cờ đẹp nhất ta từng đi.",
        "> Ván cờ này còn dở. Đánh nốt với ta, hay rút vũ khí?",
      ],
      onEnter: { time: 4, fx: (s) => KM.scaleFinal(s) },
      choices: [
        { t: "Ngồi xuống, đánh nốt ván cờ", check: { stat: "INT", dc: 30, bonusTrait: { thong_tue: 5 } }, go: "a9_boss", fail: "a9_boss", effOk: { flag: "tc_chess" }, rOk: "Shen đặt quân đen vào đúng chỗ năm xưa cậu đã đặt ở ngõ Ô Y. Lần này nó nối thông cả bàn cờ. Thiên Cơ nhìn bàn cờ rất lâu, nụ cười đông cứng.", rFail: "Quân trắng khép lại. Thiên Cơ gật gù: \"Vẫn non lắm.\"" },
        { t: "Lật bàn cờ, rút vũ khí", go: "a9_boss", r: "Quân cờ đen trắng văng khắp gian các. Thiên Cơ thở dài, đứng dậy." },
      ] },
    a9_boss: { repeat: true, onEnter: { fx: (s) => (KM.scaleFinal(s), []) }, chapter: C9, title: "Thiên Cơ Lão Nhân", place: "palace", time: "night", cast: ["shen", "thien_co"], text: ["Thiên Cơ rút từ trong tay áo một thanh kiếm gỗ. Trong tay lão, nó sắc hơn mọi thanh kiếm thép."],
      fight: { foes: ["thien_co"], opts: { canFlee: false, hurt: "tc", cuts: [["tc_chess", 0.85], ["has_ban_ve", 0.9]] }, win: "a9_dam", lose: "a9_boss_lose" } },
    a9_boss_lose: { repeat: true, chapter: C9, title: "Chưa hết ván", place: "palace", time: "night", cast: ["shen", "thien_co"], text: ["Shen ngã xuống giữa những quân cờ vương vãi. Thiên Cơ không ra đòn kết liễu. \"Đứng dậy. Ván cờ chưa hết.\" Nhưng tay áo lão đã rách một đường."], onEnter: { heal: 1, hurt: "tc" }, choices: [{ t: "Đứng dậy", go: "a9_boss" }] },
    a9_dam: { chapter: C9, title: "Băng Đê", place: "snow", time: "day", cast: ["shen"],
      text: (s) => {
        const late = KM.since(s, "a9") > 12, evac = KM.has(s, "a9_evac");
        return [
          "Thiên Cơ ngã xuống bàn cờ. Lão cười, máu chảy ra từ khóe miệng: \"Thì ra… sư phụ đúng. Võ đạo không dạy được. Chỉ có thể tự đi.\"",
          late ? "Từ đỉnh núi nhìn xuống, Băng Đê đã vỡ. Hồ nước tràn qua ba trấn trong một tiếng gầm dài." : "Dưới chân núi, Băng Đê nứt toác. Shen lao xuống, dồn hết Khí Huyết vào hai tay, chặn vết nứt lớn nhất suốt ba canh giờ, cho tới khi nước chảy chậm lại.",
          late ? (evac ? "Nhưng dân ba trấn đã được sơ tán từ trước. Không ai chết." : "Không ai kịp chạy.") : "Ba trấn dưới chân núi còn nguyên.",
          "Trên bàn cờ, Thiên Cơ để lại một miếng ngọc bội hình bàn cờ nhỏ: Thiên Cơ Kỳ Bàn.",
        ];
      },
      onEnter: { flag: "a9_boss_done", exp: 300000, quest: { q_thien_co: "done" }, cond: { req: { fn: (s) => KM.since(s, "a9") > 12 && !KM.has(s, "a9_evac") }, eff: { moral: -50, flag: "a9_flood" }, note: "Băng Đê vỡ: ba trấn bị nhấn chìm." } },
      choices: [{ t: "…", go: "a9_end" }] },
    a9_end: { chapter: C9 + " · Kết", title: "Con đường", place: "snow", time: "day", cast: ["shen"],
      text: ["Shen đứng trên đỉnh Thiên Sơn nhìn xuống thiên hạ. Mối thù đã trả. Ván cờ đã hết. Giờ chỉ còn một câu hỏi, câu thứ ba của tấm bia Vấn Kiếm: khi không còn ai để báo thù, ngươi sống vì điều gì?"],
      choices: [
        { t: "Khai Tông Lập Phái", req: { moral: 100, inv: "minh_chu_lenh" }, go: "a9_end_khai" },
        { t: "Quy Ẩn", req: { fn: (s) => KM.COMPANIONS.some((n) => !KM.dead(s, n) && (s.aff[n] || 0) >= 90), label: "một người đồng hành hảo cảm ≥ 90 còn sống" }, go: "a9_end_an" },
        { t: "Kiêu Hùng Vô Danh", req: { anti: 3 }, go: "a9_end_kieu" },
        { t: "Ma Tôn", req: { maxMoral: -200 }, go: "a9_end_ma" },
        { t: "Lãng tử giang hồ", go: "a9_end_lang" },
      ] },
    a9_end_khai: { chapter: "Kết thúc · Khai Tông Lập Phái", title: "Thẩm gia trang", place: "mountain_gate", time: "day", cast: ["shen"],
      text: (s) => ["Một năm sau, trên nền Thẩm gia trang cũ, một môn phái mới dựng cổng. Không có tên. Người ta gọi là Vô Danh Môn, theo cái tên Shen từng ghi trên bảng Đại Hội.", "Các phái gửi người tới chúc mừng. Thiên hạ gọi Shen là Võ Thần, nhưng cậu chỉ nhận một danh xưng: chưởng môn.", "Đệ tử đầu tiên của Vô Danh Môn là một đứa bé mồ côi tám tuổi, mắc chứng Tuyệt Mạch. Shen dạy nó đấm vào bao cát, như cậu từng đấm vào đống củi sau hậu trù Thanh Vân."].concat(fates(s)),
      onEnter: { flag: ["a9_done", "end_khai", "game_done"], arc: 10 }, choices: [{ t: "Tiếp tục giang hồ tự do", go: "a9_post" }] },
    a9_end_an: { chapter: "Kết thúc · Quy Ẩn", title: "Người ấy", place: "village", time: "dusk", cast: ["shen"],
      text: (s) => { const n = KM.COMPANIONS.filter((k) => !KM.dead(s, k)).sort((a, b) => (s.aff[b] || 0) - (s.aff[a] || 0))[0]; return ["Shen xuống núi, đi thẳng tới chỗ " + COMP_LINE[n] + " đang chờ. Hai người không nói gì nhiều.", "Từ hôm ấy, giang hồ không còn ai thấy Thẩm Phong. Chỉ có lời đồn về một cao thủ vô danh sống ở đâu đó dưới chân núi, sáng bổ củi, chiều câu cá, đêm ngồi uống trà với người thương."].concat(fates(s)); },
      onEnter: { flag: ["a9_done", "end_an", "game_done"], arc: 10 }, choices: [{ t: "Tiếp tục giang hồ tự do", go: "a9_post" }] },
    a9_end_kieu: { chapter: "Kết thúc · Kiêu Hùng Vô Danh", title: "Kẻ gánh tội", place: "city", time: "night", cast: ["shen"],
      text: (s) => ["Shen để thiên hạ tin rằng chính cậu đã bày mọi ván cờ: Huyết Ảnh, chiến tranh, cái chết của Minh chủ. Tội danh của Thiên Cơ, cậu nhận hết.", "Các phái ngừng đánh nhau, vì họ có chung một kẻ thù để sợ. Giang hồ yên ổn suốt hai mươi năm.", "Không ai dám gọi tên cậu. Người ta chỉ gọi là \"Kẻ Ấy\", và dọa trẻ con bằng cái tên đó. Shen không bận tâm."].concat(fates(s)),
      onEnter: { flag: ["a9_done", "end_kieu", "game_done"], arc: 10 }, choices: [{ t: "Tiếp tục giang hồ tự do", go: "a9_post" }] },
    a9_end_ma: { chapter: "Kết thúc · Ma Tôn", title: "Thiên hạ trong lòng bàn tay", place: "palace", time: "night", cast: ["shen"],
      text: (s) => ["Shen trở về Kim Lăng, ngồi lên chiếc ghế của Minh chủ. Ai không quỳ, chết. Ai quỳ chậm, cũng chết.", "Giang hồ chưa bao giờ yên ắng như thế. Không ai dám rút kiếm khi chưa được phép.", "Đêm khuya, trong phủ Minh chủ, Shen ngồi một mình trước bàn cờ. Cậu nhớ lại nụ cười của Thiên Cơ trước khi chết: \"Ngươi là quân cờ đẹp nhất của ta.\" Giờ cậu mới hiểu lão cười vì sao."].concat(fates(s)),
      onEnter: { flag: ["a9_done", "end_ma", "game_done"], arc: 10 }, choices: [{ t: "Tiếp tục giang hồ tự do", go: "a9_post" }] },
    a9_end_lang: { chapter: "Kết thúc · Lãng Tử", title: "Con đường không tên", place: "road", time: "day", cast: ["shen"],
      text: (s) => ["Shen xuống núi, không về Kim Lăng, không về Thanh Vân. Cậu đi về phía chưa có tên trên bản đồ.", "Có người nói thấy cậu ở biên ải, dạy kiếm cho lính biên phòng. Có người nói thấy cậu ở Giang Nam, uống rượu với ăn mày. Không ai chắc."].concat(fates(s)),
      onEnter: { flag: ["a9_done", "end_lang", "game_done"], arc: 10 }, choices: [{ t: "Tiếp tục giang hồ tự do", go: "a9_post" }] },
    a9_post: { chapter: "Hậu truyện", title: "Giang hồ còn dài", place: "snow", time: "day", cast: ["shen"],
      text: ["[Kết thúc Kiếm Mệnh. Cảm ơn đã đồng hành cùng Shen.]", "[Mọi địa điểm trên bản đồ đã mở. Tiến trình được lưu; có thể tiếp tục luyện công, làm nhiệm vụ nhánh, hoặc mở ván mới để đi con đường khác.]"],
      special: "hub", hub: "thien_son" },
  });

  /* Thiên Cơ luôn mạnh ngang hoặc hơn Shen: EXP tích lũy ở trần cảnh giới không làm trận cuối dễ đi */
  KM.scaleFinal = function (s) {
    const E = KM.ENEMIES.thien_co, base = E.base || (E.base = { lv: E.lv, st: Object.assign({}, E.st) });
    const L = Math.max(base.lv, s.level + 2), k = (30 + 5 * (L - 1)) / (30 + 5 * (base.lv - 1));
    E.lv = L; E.st = {}; for (const x in base.st) E.st[x] = Math.round(base.st[x] * k);
    return L > base.lv ? ["Thiên Cơ đã đoán trước từng bước tiến của Shen: lão mạnh lên theo (Lv " + L + ")."] : [];
  };

  /* ---------------- Sự kiện ---------------- */
  KM.TRIGGERS.push((s) => {
    if (KM.has(s, "a7_done") && !KM.has(s, "a8_start") && s.place === "kim_lang") return "a8_invite";
    if (A8(s)) {
      const d = KM.since(s, "a8");
      if (d >= 10 && !KM.has(s, "a8_hoi")) return "a8_hoi";
      if (s.threat && s.place === "kim_lang") return "a8_ambush";
      if (d >= 4 && !KM.has(s, "a8_tea_seen")) return "a8_tea";
      if (d >= 6 && !KM.has(s, "a8_vanphi_seen") && KM.has(s, "vanphi_truth") && !KM.dead(s, "ta_van_phi")) return "a8_vanphi";
      if (d >= 8 && !KM.has(s, "a8_cg_seen") && s.shards >= 3) return "a8_chan_giai";
    }
    if (KM.has(s, "a8_done") && !KM.has(s, "a9_start") && s.place === "thien_son") return "a9_foot";
    return null;
  });
  // Đại Hội không có Tạ Vân Phi biết sự thật thì hắn đứng về phía cha
  const hoiEnter = KM.enterScene;
  KM.enterScene = function (s, id) { if (id === "a8_hoi" && !KM.has(s, "vanphi_side") && !KM.dead(s, "ta_van_phi") && s.met.includes("ta_van_phi")) KM.flag(s, "vanphi_choose"); if (id === "a9_boss" && s.inv.ban_ve_co_quan) KM.flag(s, "has_ban_ve"); if (id === "a4_yen_dead") KM.flag(s, "yen_killed_by_shen"); return hoiEnter(s, id); };

  /* ---------------- Khu tự do ---------------- */
  KM.HUBS.kim_lang.locs.push(
    { id: "hoi_quan", name: "Hội quán các phái", art: "hall", desc: "Các phái đóng ở đây chờ Đại Hội Võ Lâm.", show: (s) => A8(s), actions: [
      KM.storyAct("Thuyết phục các phái", "a8_persuade", (s) => SIDES.some((f) => !KM.has(s, "side_" + f))),
      { t: "Xem lại hồ sơ chứng cứ", cost: 0, run: () => R([], { scene: "a8_ev" }) },
    ] },
    { id: "mat_that", name: "Mật thất phủ Minh chủ", art: "cave", when: "night", desc: "Dưới bàn thờ tổ tiên họ Tạ.", show: (s) => A8(s) && !KM.has(s, "ev_mat_that"), actions: [
      KM.storyAct("Mở mật thất", "a8_mat_that", (s) => (s.inv.chia_khoa_mat || 0) >= 3, "cần 3 chìa khóa đồng (Thiết Vệ giữ)", 1),
      KM.huntAct("Đánh Thiết Vệ tuần đêm lấy chìa khóa", "Rank SS", [[100, ["thiet_ve"]]], "Một Thiết Vệ đeo chìa khóa đồng bên hông."),
    ] },
    { id: "dinh_hoang", name: "Đình bỏ hoang", art: "hall", when: "night", desc: "Nơi người của phủ Minh chủ hẹn gặp kẻ ăn bạc.", show: (s) => A8(s), actions: [
      KM.storyAct("Phục kích trưởng lão bị mua chuộc", "a8_truong_lao", (s) => !KM.has(s, "ev_truong_lao"), "Rank SS · Lv 78", 1),
      KM.storyAct("Chặn quản gia Triệu Phúc", "a8_trieu_phuc", (s) => !KM.has(s, "ev_trieu_phuc"), "", 1),
      KM.huntAct("Diệt Huyết Ảnh tàn quân", "Rank SS", [[100, ["huyet_tan"]]], "Bóng áo đen lẩn trong ngõ."),
    ] },
  );
  KM.HUBS.ngoai_o.locs[0].actions.push(KM.storyAct("Gặp Phương trượng về tên sát thủ bị bắt", "a8_mercy", (s) => A8(s) && !KM.has(s, "a8_tl_mercy") && !KM.has(s, "a8_mercy_done")));
  KM.HUBS.kim_lang.locs.find((l) => l.id === "mieu").actions.push({ t: "▶ Mời Lão Hồ ba vò Nữ Nhi Hồng, nghe kể đêm Thẩm gia trang", sub: "cần 3 Nữ Nhi Hồng", show: (s) => A8(s) && !KM.has(s, "ev_lao_ho_ke") && !KM.dead(s, "lao_ho"), run: (s) => (s.inv.nu_nhi_hong || 0) < 3 ? R(["Lão Hồ lắc đầu: \"Ba vò. Thiếu một vò ta không nhớ nổi.\""], { free: true }) : R(KM.apply(s, { take: ["nu_nhi_hong", 3], flag: ["ev_lao_ho_ke", "laoho_2"], aff: { lao_ho: 10 } }).concat(["Lão Hồ uống cạn ba vò, rồi kể. Đêm ấy lão là người bế đứa bé họ Thẩm chạy qua lửa. Lão đã thấy mặt kẻ đeo vết bỏng ở tay phải. Lão sẽ nói ra ở Đại Hội."])) });
  KM.SHOPS.kl_thuoc.stock.push("nu_nhi_hong");
  KM.ITEMS.chia_khoa_mat = { name: "Chìa khóa đồng mật thất", type: "key", price: 0, desc: "Thiết Vệ phủ Minh chủ giữ. Cần đủ 3 chiếc." };
  KM.ENEMIES.thiet_ve.loot.push(["chia_khoa_mat", 60]);

  KM.HUBS.thien_son = {
    name: "Thiên Sơn · trấn Bạch Thủy", place: "snow",
    note: (s) => A9(s) ? "Thiên Hạ Kỳ Cục: Băng Đê vỡ ngày " + (s.marks.a9 + 12) + " (còn " + Math.max(0, s.marks.a9 + 12 - s.day) + " ngày). Leo 5 chặng mất khoảng 9 ngày." + (KM.has(s, "a9_evac") ? " Dân ba trấn đã được sơ tán." : "") : KM.has(s, "game_done") ? "Giang hồ tự do. Mọi nơi đã mở." : "",
    locs: [
      { id: "tram", name: "Trấn Bạch Thủy", art: "village", desc: "Trấn nhỏ dưới chân Băng Đê.", actions: [
        KM.rest(null, 50),
        { t: "▶ Sơ tán dân ba trấn", sub: "8 buổi · Đạo đức +30", cost: 8, show: (s) => A9(s) && !KM.has(s, "a9_evac") && !KM.has(s, "a9_climb"), run: (s) => R(["Shen đi từng nhà, thuyết phục dân ba trấn dọn lên đồi cao. Có người tin, có người chửi. Hai ngày sau, ba trấn vắng tanh."].concat(KM.apply(s, { flag: "a9_evac", moral: 30 }))) },
        KM.storyAct("Bắt đầu leo Thiên Sơn (một mình)", "a9_farewell", (s) => A9(s) && !KM.has(s, "a9_climb")),
        KM.shopAct("ts_bach_thuy"),
      ] },
      { id: "chan_nui", name: "Chân núi tuyết", art: "snow", desc: "Tuyết quái và cơ quan nhân lạc xuống từ trên núi.", actions: [
        KM.huntAct("Săn tuyết quái", "Rank SS", [[80, ["tuyet_quai"]], [100, ["co_quan"]]], "Mặt đất rung lên dưới những bước chân nặng nề."),
        KM.trainAct("Luyện công giữa tuyết"),
      ] },
    ],
  };
})(typeof window !== "undefined" ? window : globalThis);
