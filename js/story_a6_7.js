/* =====================================================================
   KIẾM MỆNH · ARC 6 — BÍ CẢNH KIẾM TRỦNG (Bắc Cảnh) · Rank A → S · Lv 52–64
             ARC 7 — CHÍNH TÀ ĐẠI CHIẾN (ba chiến tuyến) · Rank S · Lv 64–74
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const R = KM.R, night = (s) => s.slot === 2, day = (s) => s.slot <= 1;
  const once = (s, f) => { if (KM.has(s, f)) return false; KM.flag(s, f); return true; };
  const A6 = (s) => KM.has(s, "a6_start") && !KM.has(s, "a6_done");
  const A7 = (s) => KM.has(s, "a7_start") && !KM.has(s, "a7_done");
  const C6 = "Arc 6 · Bí Cảnh Kiếm Trủng", C7 = "Arc 7 · Chính Tà Đại Chiến";
  const ALLY6 = { hue_nang: "thieu_lam", thanh_hu: "vo_dang", duong_nhat_anh: "duong_mon", ta_van_phi: "vo_lam" };
  const ally6 = (s) => Object.keys(ALLY6).find((n) => KM.has(s, "ally6_" + n) && !KM.dead(s, n));
  const CUT6 = [["ally6_hue_nang", 0.9], ["ally6_thanh_hu", 0.9], ["ally6_duong_nhat_anh", 0.9], ["ally6_ta_van_phi", 0.9]];

  Object.assign(KM.SCENES, {
    /* ================= ARC 6 ================= */
    a6_road: { chapter: C6, title: "Lên phương bắc", place: "snow", time: "day", cast: ["shen"],
      text: ["Càng đi về bắc, trời càng trắng. Tuyết rơi từ sáng tới tối, gió thổi buốt tận xương. Trên đường, Shen gặp không ít người mang kiếm, ai cũng đi về một hướng."],
      special: "travel", dest: "tuyet_linh", go: "a6_arrive" },
    a6_arrive: { chapter: C6, title: "Tuyết Lĩnh Trấn", place: "snow", time: "dusk", cast: ["shen"],
      text: [
        "Tuyết Lĩnh Trấn chỉ có một con phố, nhà gỗ lợp tranh phủ tuyết dày nửa thước. Mấy hôm nay trấn chật cứng: Thiếu Lâm, Võ Đang, Đường Môn, Hoa Sơn, và những kẻ áo đen không xưng danh.",
        "Phía bắc trấn một ngày đường là Kiếm Trủng, nơi Kiếm Thần Vô Danh chôn kiếm sáu mươi năm trước. Băng sẽ tan, cổng đá sẽ mở trong ba ngày tới, và chỉ mở bảy ngày.",
        "[Bí cảnh mở ngày A+3, khép lại cuối ngày A+9. Trong bí cảnh không có cửa hàng, không có quán trọ. Thiếu áo lông thì mỗi đêm ngủ ngoài tuyết mất 10% HP.]",
      ],
      onEnter: { flag: "a6_start", mark: "a6", arc: 6, place: "tuyet_linh",
        quest: { q_kiem_trung: { name: "Kiếm Trủng", desc: "Vượt ba tầng bí cảnh (Kiếm Lâm, Vấn Kiếm, Vô Danh Điện), đánh bại Kiếm Hồn Vô Danh trước khi bí cảnh khép lại cuối ngày A+9.", dueDays: 9, dueFrom: "a6" } } },
      special: "hub", hub: "tuyet_linh" },
    a6_ally: { chapter: C6, title: "Đồng hành", place: "camp", time: "day", cast: ["shen"],
      text: ["Doanh trại các phái dựng sát nhau ở đầu trấn. Vào bí cảnh một mình thì nhẹ gánh, nhưng có người cùng đi thì thêm một thanh kiếm che lưng.", "[Đồng hành giúp mọi trận lớn trong bí cảnh dễ hơn (máu đối thủ −10%). Đồng hành có thể gặp nguy, và có thể chết.]"],
      choices: [
        { t: "Đi một mình", go: "@hub", eff: { flag: ["ally6_none", "a6_ally_set"] } },
        { t: "Đi cùng Huệ Năng (Thiếu Lâm)", req: { alive: "hue_nang", aff: { hue_nang: 10 } }, go: "@hub", eff: { flag: ["ally6_hue_nang", "a6_ally_set"], aff: { hue_nang: 5 } }, r: "Huệ Năng chắp tay: \"Tiểu tăng xin theo thí chủ. Kiếm Trủng nhiều oan hồn, có người niệm Phật cũng tốt.\"" },
        { t: "Đi cùng Chân nhân Thanh Hư (Võ Đang)", req: { alive: "thanh_hu", aff: { thanh_hu: 15 } }, go: "@hub", eff: { flag: ["ally6_thanh_hu", "a6_ally_set"], aff: { thanh_hu: 5 } }, r: "Thanh Hư vuốt râu cười: \"Lão đạo sống tám mươi năm, chưa thấy Kiếm Trủng mở lần nào. Đi thôi.\"" },
        { t: "Đi cùng Đường Nhất Ảnh (Đường Môn)", req: { alive: "duong_nhat_anh", any: ["ally_duong", "sect_duong_mon"] }, go: "@hub", eff: { flag: ["ally6_duong_nhat_anh", "a6_ally_set"], aff: { duong_nhat_anh: 5 } }, r: "Đường Nhất Ảnh xòe quạt: \"Có ta, cơ quan nào trong đó cũng chỉ là đồ chơi.\"" },
        { t: "Đi cùng Tạ Vân Phi", req: { flag: "a3_hide", alive: "ta_van_phi", aff: { ta_van_phi: 20 } }, go: "@hub", eff: { flag: ["ally6_ta_van_phi", "a6_ally_set"], aff: { ta_van_phi: 5 } }, r: "Tạ Vân Phi nhìn Shen, rồi gật đầu. \"Cha ta bảo ta lấy truyền thừa. Ta muốn xem ngươi lấy nó thế nào.\"" },
      ] },
    a6_open: { chapter: C6, title: "Cổng đá mở", place: "snow", time: "day", cast: ["shen"],
      text: ["Sáng ngày thứ ba, cả dãy núi rung lên. Lớp băng phủ cổng đá Kiếm Trủng nứt toác, rơi thành từng tảng. Phía sau là một rừng kiếm cắm ngược, trải dài tới tận chân trời.", "Hàng trăm người ùa về phía cổng. Năm bóng áo đen đi đầu, chẳng thèm che giấu: Huyết Ảnh Ngũ Lão."],
      onEnter: { flag: "realm_open", place: "kiem_trung" },
      choices: [
        { t: "Xông lên trước, chặn Ngũ Lão ngay cửa", go: "a6_gate_f" },
        { t: "Đi sau, để các phái chen nhau trước", go: "@hub", eff: { time: 4 }, r: "Shen đợi tới chiều. Cổng đá vắng dần, chỉ còn vết máu và mấy thanh kiếm gãy. Mất nửa ngày, nhưng không mất giọt máu nào." },
      ] },
    a6_gate_f: { chapter: C6, title: "Cửa bí cảnh", place: "snow", time: "day", cast: ["shen", "hac_y"], text: ["Hai trong Ngũ Lão quay lại chặn Shen. \"Kẻ phản bội của Lâu. Lâu chủ dặn: thấy mặt là giết.\""],
      fight: { foes: ["ngu_lao", "ngu_lao"], opts: { canFlee: true, cuts: CUT6 }, win: "a6_gate_win", lose: "@hub", tx: "a6_gate_f" } },
    a6_gate_win: { chapter: C6, title: "Mở đường", place: "snow", time: "day", cast: ["shen"], text: ["Hai lão già áo đen ngã xuống tuyết. Ba kẻ còn lại đã biến mất vào rừng kiếm. Nhưng từ nay chúng biết Shen ở đây."], onEnter: { flag: "ngu_lao_hurt", exp: 20000 }, choices: [{ t: "Vào Kiếm Lâm", go: "@hub" }] },
    a6_lam: { chapter: C6, title: "Tầng một · Kiếm Lâm", place: "snow", time: "day", cast: ["shen", "kiem_khoi"],
      text: ["Hàng vạn thanh kiếm cắm ngược giữa tuyết, thanh nào cũng rỉ sét, nhưng mũi kiếm vẫn sắc. Mỗi khi có người bước qua, một bức tượng đá cầm kiếm lại cựa mình đứng dậy."],
      choices: [
        { t: "Đi theo đường vẽ trên tấm bản đồ đã mua", req: { flag: "a6_map" }, go: "a6_lam_win", r: "Tấm bản đồ chỉ một lối mòn giữa hai hàng kiếm khôi. Chúng không động đậy." },
        { t: "Đánh thẳng qua", go: "a6_lam_f" },
      ] },
    a6_lam_f: { chapter: C6, title: "Kiếm khôi", place: "snow", time: "day", cast: ["shen", "kiem_khoi"], text: ["Hai kiếm khôi đá chắn đường, kiếm đá giơ cao."], fight: { foes: ["kiem_khoi", "kiem_khoi"], opts: { canFlee: true, cuts: CUT6 }, win: "a6_lam_win", lose: "@hub", tx: "a6_lam_f" } },
    a6_lam_win: { chapter: C6, title: "Qua Kiếm Lâm", place: "snow", time: "dusk", cast: ["shen"], text: ["Cuối rừng kiếm là một bậc đá dẫn xuống lòng núi. Trên vách khắc bốn chữ: \"Vấn Kiếm Tâm Lộ\"."], onEnter: { flag: "f1", exp: 15000 }, choices: [{ t: "…", go: "@hub" }] },

    a6_ngu_lao: { chapter: C6, title: "Nghĩa địa kiếm", place: "snow", time: "night", cast: ["shen", "hac_y"],
      text: ["Tiếng binh khí vang lên từ nghĩa địa kiếm. Ba lão già áo đen vây kín người đồng hành của Shen, máu đã nhuộm đỏ một khoảng tuyết.", "Người ấy hét về phía Shen: \"Đừng lo cho ta! Đi tìm truyền thừa đi!\""],
      choices: [
        { t: "Lao vào cứu", go: "a6_ngu_lao_f" },
        { t: "Bỏ mặc, đi tiếp", go: "a6_ngu_lao_left", eff: { moral: -30, trend: { am: 2 } } },
      ] },
    a6_ngu_lao_f: { chapter: C6, title: "Ngũ Lão", place: "snow", time: "night", cast: ["shen", "hac_y"], text: ["Shen lao vào giữa vòng vây."], fight: { foes: ["ngu_lao", "ngu_lao"], opts: { canFlee: false }, win: "a6_ngu_lao_win", lose: "a6_ngu_lao_lose", tx: "a6_ngu_lao_f" } },
    a6_ngu_lao_win: { chapter: C6, title: "Cứu được", place: "snow", time: "night", cast: ["shen"], text: ["Ngũ Lão rút lui để lại hai cái xác. Người đồng hành tựa lưng vào Shen, thở dốc, cười: \"Ngươi ngốc thật.\""],
      onEnter: { flag: "ally6_saved", exp: 20000, fx: (s) => { const n = ally6(s); return n ? KM.apply(s, { aff: { [n]: 15 } }) : []; } }, choices: [{ t: "…", go: "@hub" }] },
    a6_ngu_lao_lose: { chapter: C6, title: "Mất người", place: "snow", time: "night", cast: ["shen"], text: ["Shen ngã xuống tuyết. Khi cậu gượng dậy được, người đồng hành đã nằm bất động giữa những thanh kiếm gãy, tay vẫn che chắn trước mặt cậu."],
      onEnter: { flag: "ally6_lost", fx: (s) => { const n = ally6(s); return n ? KM.kill(s, n, { actor: "Huyết Ảnh Ngũ Lão", action: "Chết ở nghĩa địa Kiếm Trủng", witness: "Shen", note: "" }) : []; } }, choices: [{ t: "…", go: "@hub" }] },
    a6_ngu_lao_left: { chapter: C6, title: "Bỏ lại", place: "snow", time: "night", cast: ["shen"], text: ["Shen quay lưng. Sau lưng cậu, tiếng binh khí tắt dần, rồi chỉ còn tiếng gió."], onEnter: { flag: "ally6_lost", fx: (s) => { const n = ally6(s); return n ? KM.kill(s, n, { actor: "Huyết Ảnh Ngũ Lão", action: "Chết ở nghĩa địa Kiếm Trủng", witness: "Shen", note: "" }) : []; } }, choices: [{ t: "…", go: "@hub" }] },

    a6_bia: { chapter: C6, title: "Tầng hai · Vấn Kiếm", place: "cave", time: "day", cast: ["shen"],
      text: ["Lòng núi là một gian đá rộng, giữa gian sừng sững một tấm bia cao ba trượng. Chữ trên bia tự sáng lên khi Shen tới gần.", "\"Câu thứ nhất: Kiếm để làm gì?\""],
      choices: [
        { t: "\"Để giết kẻ đáng giết.\"", go: "a6_bia2", eff: { trend: { cong: 2, am: 1 } } },
        { t: "\"Để bảo vệ người cần bảo vệ.\"", go: "a6_bia2", eff: { trend: { thu: 2, minh: 1 } } },
        { t: "\"Kiếm chỉ là kiếm.\"", go: "a6_bia2", eff: { trend: { nhanh: 1, nang: 1 } } },
      ] },
    a6_bia2: { chapter: C6, title: "Vấn Kiếm", place: "cave", time: "day", cast: ["shen"], text: ["\"Câu thứ hai: Nếu kẻ thù của ngươi cũng là ân nhân của ngươi, ngươi làm sao?\""],
      choices: [{ t: "\"Trả ơn trước, báo thù sau.\"", go: "a6_bia3", eff: { trend: { minh: 2 } } }, { t: "\"Thù là thù.\"", go: "a6_bia3", eff: { trend: { am: 2 } } }, { t: "\"Hỏi hắn vì sao.\"", go: "a6_bia3", eff: { trend: { thu: 1, minh: 1 } } }] },
    a6_bia3: { chapter: C6, title: "Vấn Kiếm", place: "cave", time: "day", cast: ["shen"], text: ["\"Câu thứ ba: Khi không còn ai để báo thù, ngươi sống vì điều gì?\"", "Shen đứng trước bia rất lâu. Không có câu trả lời đúng. Tấm bia chỉ muốn nghe câu trả lời thật."],
      choices: [{ t: "\"Ta chưa biết.\"", go: "a6_bia_done", eff: { trend: { minh: 1, thu: 1 } } }, { t: "\"Vì những người còn sống.\"", go: "a6_bia_done", eff: { trend: { minh: 2 } } }, { t: "\"Vì con đường của chính ta.\"", go: "a6_bia_done", eff: { trend: { cong: 1, nhanh: 1 } } }] },
    a6_bia_done: { chapter: C6, title: "Cửa thứ ba", place: "cave", time: "dusk", cast: ["shen"], text: ["Tấm bia rung lên, chữ trên mặt đá tắt dần. Phía sau, một vách đá trượt sang bên, để lộ con đường dẫn lên Vô Danh Điện."], onEnter: { flag: "f2", exp: 15000 }, choices: [{ t: "…", go: "@hub" }] },

    a6_kyngo: { chapter: C6 + " · Kỳ ngộ", title: "Kiếm Ý Thạch", place: "snow", time: "night", cast: ["shen"],
      text: ["Giữa hồ băng sau Vấn Kiếm có một hòn đá trắng nằm lọt giữa mặt băng, từ đó tỏa ra một luồng kiếm ý lạnh buốt. Người ta gọi là Kiếm Ý Thạch.", "Ai ngồi cạnh nó đủ lâu mà không bị kiếm ý xé nát tâm trí, sẽ thấy được kiếm của người xưa."],
      choices: [{ t: "Ngồi xuống, nhắm mắt", check: { stat: "WIS", dc: 22, bonusTrait: { linh_giac: 4 } }, go: "a6_kyngo_win", fail: "a6_kyngo_f", rOk: "Shen thấy một người áo xám múa kiếm trên mặt hồ. Từng đường kiếm đơn giản tới mức ai cũng làm được, nhưng không ai làm được như thế.", rFail: "Kiếm ý cắt vào tâm trí như dao. Shen bật ngửa ra sau, máu chảy ra từ mũi." }] },
    a6_kyngo_f: { chapter: C6 + " · Kỳ ngộ", title: "Chưa đủ", place: "snow", time: "night", cast: ["shen"], text: ["Có lẽ mai thử lại."], choices: [{ t: "…", go: "@hub" }] },
    a6_kyngo_win: { chapter: C6 + " · Kỳ ngộ", title: "Kiếm Tâm", place: "snow", time: "night", cast: ["shen"], text: ["Khi Shen mở mắt, trời đã sáng. Đôi tay cậu vẫn y như cũ, nhưng mọi chiêu thức trong người dường như sáng rõ thêm một tầng."],
      onEnter: { flag: "kyngo_a6", learnMastery: true, skill: "kiem_tam", exp: 20000 }, choices: [{ t: "…", go: "@hub" }] },

    a6_vanphi: { chapter: C6, title: "Tạ Vân Phi", place: "palace", time: "day", cast: ["shen", "ta_van_phi"],
      text: ["Trước cửa Vô Danh Điện, Tạ Vân Phi đứng chờ, áo trắng không dính một hạt tuyết.", "> Đại Hội ngươi thắng ta trước mặt cha ta. Truyền thừa này, ta không nhường nữa."],
      choices: [
        { t: "Rút vũ khí", go: "a6_vanphi_f" },
        { t: "Kể cho hắn nghe về khuôn đồng và danh sách ám sát", req: { any: ["mold", "a4_list"] }, go: "a6_boss_pre", eff: { flag: ["vanphi_truth", "vanphi6_done"], aff: { ta_van_phi: 20 } }, r: "Tạ Vân Phi nghe xong, đứng lặng giữa tuyết. Rồi hắn tránh sang một bên. \"Vào đi. Ta cần thời gian.\"" },
      ] },
    a6_vanphi_f: { chapter: C6, title: "Lưu Vân Kiếm Vực", place: "palace", time: "day", cast: ["shen", "ta_van_phi"], text: ["Kiếm Lưu Vân giờ đã thành một vùng mây kiếm."], fight: { foes: ["ta_van_phi_s"], opts: { canFlee: true, noLoot: true }, win: "a6_vanphi_win", lose: "@hub", tx: "a6_vanphi" } },
    a6_vanphi_win: { chapter: C6, title: "Tránh đường", place: "palace", time: "day", cast: ["shen", "ta_van_phi"], text: ["Tạ Vân Phi chống kiếm quỳ trên tuyết. \"Lại thua.\" Hắn không đứng dậy cho tới khi Shen đi khuất."], onEnter: { flag: "vanphi6_done", exp: 30000, aff: { ta_van_phi: -5 } }, choices: [{ t: "Vào điện", go: "a6_boss_pre" }] },
    a6_boss_pre: { chapter: C6, title: "Tầng ba · Vô Danh Điện", place: "palace", time: "night", cast: ["shen", "kiem_hon"],
      text: [
        "Vô Danh Điện trống trơn, chỉ có một thanh kiếm sắt cắm giữa nền đá. Khi Shen bước tới, kiếm khí từ thanh kiếm bốc lên, ngưng thành bóng một người áo xám.",
        "> Sáu mươi năm. — Bóng người nói, giọng như gió thổi qua khe đá. — Kẻ nào muốn kiếm của ta, hãy cho ta xem kiếm của ngươi.",
        "[Kiếm Hồn Vô Danh: trùm Rank S. Giữa trận, Shen phải phóng khí ra ngoài thân.]",
      ],
      choices: [{ t: "Vào trận", go: "a6_boss" }] },
    a6_boss: { chapter: C6, title: "Kiếm Hồn Vô Danh", place: "palace", time: "night", cast: ["shen", "kiem_hon"], text: ["Bóng người áo xám nhấc tay. Vạn thanh kiếm trong Kiếm Lâm cùng ngân lên."],
      fight: { foes: ["kiem_hon"], opts: { canFlee: false, hurt: "kiem_hon", cuts: CUT6 }, win: "a6_boss_win", lose: "a6_boss_lose" } },
    a6_boss_lose: { repeat: true, chapter: C6, title: "Chưa đủ", place: "palace", time: "night", cast: ["shen"], text: ["Shen ngã xuống, nhưng bóng người áo xám không ra đòn kết liễu. \"Đứng dậy. Ngươi đã chạm được tới nó rồi.\""], onEnter: { hurt: "kiem_hon", heal: 1 }, choices: [{ t: "Đứng dậy", go: "a6_boss" }, { t: "Rút lui, luyện thêm rồi quay lại", go: "@hub" }] },
    a6_boss_win: { chapter: C6, title: "Phóng khí", place: "palace", time: "night", cast: ["shen"],
      text: [
        "Đòn cuối cùng, Shen không đánh bằng vũ khí. Khí Huyết trong Mạch Ẩn trào ra khỏi lòng bàn tay, thành một luồng sáng đỏ như máu, xuyên qua bóng người áo xám.",
        "Một kẻ Tuyệt Mạch, không có một sợi nội lực, vừa phóng khí ra ngoài thân.",
        "Bóng người áo xám mỉm cười. \"Hay. Không ngờ người kế thừa ta lại là một kẻ không có kinh mạch.\"",
        "> Nghe đây. Ta có một đệ tử, tên Thiên Cơ. Nó thông minh nhất trong những người ta từng gặp, và tàn nhẫn nhất. Kẻ dạy Tạ Thiên Hành ma công cũng là nó. Nếu ngươi còn sống tới ngày gặp nó… hãy thay ta dạy lại nó một bài.",
        "[Hệ Thống] Mạch Ẩn tầng 4: chiêu riêng của Shen đánh được từ xa. Cánh cửa cảnh giới Đại Tông Sư đã mở.",
      ],
      onEnter: { flag: "a6_boss_done", ownTier: 4, breakTo: "S", exp: 60000, quest: { q_kiem_trung: "done" },
        ledger: { actor: "Thiên Cơ", action: "Dạy ma công cho Tạ Thiên Hành", target: "—", witness: "Kiếm Hồn Vô Danh", pending: "Kẻ đứng sau Minh chủ", trigger: "Arc 9" } },
      choices: [{ t: "…", go: "a6_legacy" }] },
    a6_legacy: { chapter: C6, title: "Truyền thừa", place: "palace", time: "night", cast: ["shen"],
      text: ["Bóng người tan biến. Thanh kiếm sắt giữa nền đá rung lên, đổi hình theo tay người chạm vào nó.", "Truyền thừa của Kiếm Thần Vô Danh nằm trong tay Shen. Bên ngoài, các phái đang tràn vào Vô Danh Điện."],
      choices: [
        { t: "Nhận truyền thừa", go: "a6_end", eff: { flag: "legacy_mine", vodanh: true, rep: { thieu_lam: -30, vo_dang: -30, duong_mon: -30, vo_lam: -30 } }, r: "Binh khí đổi hình hợp với tay Shen. Các phái đứng ở cửa điện nhìn cậu, ánh mắt không còn như trước." },
        { t: "Nhường cho người đồng hành", req: { fn: (s) => !!ally6(s) }, go: "a6_end", eff: { flag: "legacy_ally", moral: 20, skill: "kiem_tam", cond: { req: { flag: "ally6_hue_nang" }, eff: { rep: { thieu_lam: 200 } } } },
          r: "Shen trao binh khí cho người đã cùng mình vượt bí cảnh. \"Người cần nó hơn tôi.\" Bàn tay cậu chạm vào thanh kiếm lần cuối, và kiếm ý của Kiếm Thần vẫn ở lại trong tâm cậu." },
        { t: "Bẻ gãy truyền thừa, không để ai có được", go: "a6_end", eff: { flag: "legacy_destroyed", trend: { am: 1 } }, r: "Shen dồn Khí Huyết vào lòng bàn tay, đập xuống thân kiếm. Thanh kiếm gãy làm đôi, kiếm khí tan vào gió tuyết. Ngoài cửa điện, ba lão già áo đen nghiến răng bỏ đi." },
      ] },
    a6_closed: { chapter: C6, title: "Bí cảnh khép lại", place: "snow", time: "night", cast: ["shen"],
      text: [
        "Cuối ngày thứ chín, cả Kiếm Trủng rung lên. Băng tuyết đổ ập xuống cổng đá. Mọi người bị cuồng phong cuốn văng ra ngoài.",
        "Giữa bão tuyết, Shen thấy ba bóng áo đen lao ra từ Vô Danh Điện, trên tay là một thanh kiếm sắt tỏa ánh xám. Huyết Ảnh Ngũ Lão đã lấy được truyền thừa.",
        "Trong cơn bão, để không bị cuốn vào vực, Shen dồn hết Khí Huyết ra ngoài thân, tạo thành một lớp hộ thể. Cậu đã phóng được khí ra ngoài, dù chẳng còn truyền thừa nào để nhận.",
      ],
      onEnter: { flag: ["realm_closed", "huyet_got_legacy"], ownTier: 4, breakTo: "S", quest: { q_kiem_trung: "fail" }, place: "tuyet_linh",
        ledger: { actor: "Huyết Ảnh Lâu", action: "Cướp truyền thừa Kiếm Thần Vô Danh", target: "Kiếm Trủng", witness: "Shen", pending: "Lâu chủ Huyết Y mạnh thêm", trigger: "Arc 7" } },
      choices: [{ t: "…", go: "a6_end" }] },
    a6_end: { chapter: C6 + " · Kết", title: "Chiến tranh", place: "snow", time: "day", cast: ["shen"],
      text: [
        "Bí cảnh khép lại sau lưng Shen. Ở Tuyết Lĩnh Trấn, một con ngựa trạm phi tới, người đưa tin hét lên giữa phố:",
        "> Minh chủ phát lệnh diệt ma! Võ Lâm Minh hội quân ở Kim Lăng, đánh Thiên Ma Giáo! Ai không theo, coi như đồng đảng của Ma Giáo!",
        "Shen nhìn về phía nam. Tạ Thiên Hành không chờ nữa. Lão sẽ dùng chiến tranh để chôn vùi mọi bằng chứng, và mọi kẻ còn nghi ngờ lão.",
        "[Kết thúc Arc 6. Mở Arc 7 · Chính Tà Đại Chiến.]",
      ],
      onEnter: { flag: ["a6_done", "realm_closed"], exp: 20000 },
      choices: [{ t: "Về Kim Lăng", go: "a7_road" }, { t: "Chuẩn bị thêm ở Tuyết Lĩnh (đi Kim Lăng bằng bản đồ)", go: "@hub" }] },

    /* ================= ARC 7 ================= */
    a7_road: { chapter: C7, title: "Về Kim Lăng", place: "road", time: "day", cast: ["shen"], text: ["Trên đường quan, từng đoàn người mang kiếm đi về phía nam, cờ Võ Lâm Minh phấp phới. Không khí giang hồ đặc quánh mùi máu sắp đổ."], special: "travel", dest: "kim_lang", go: "a7_rally" },
    a7_rally: { chapter: C7, title: "Hội quân", place: "city", time: "day", cast: ["shen", "ta_thien_hanh"],
      text: [
        "Quảng trường trước phủ Minh chủ, nơi từng dựng lôi đài Đại Hội, giờ kín người mang giáp. Tạ Thiên Hành đứng trên đài cao, giọng vang khắp Kim Lăng:",
        "> Ma Giáo mười năm trước thảm sát Thẩm gia trang. Nay chúng lại cấu kết Huyết Ảnh Lâu, ám sát người các phái. Võ Lâm Minh phải diệt cỏ tận gốc!",
        "Cả quảng trường hô vang. Shen nghe thấy tên nhà mình, được hô lên bằng hàng nghìn giọng, để biện minh cho một cuộc chiến nữa.",
        "Tin mật từ Cái Bang: song song với cuộc chiến, Huyết Ảnh Lâu sẽ đánh úp những phái còn nghi ngờ Minh chủ. Nga Mi, Võ Đang, và Long Môn ở Lạc Hà.",
        "[Bản đồ chiến tuyến: Nga Mi, Võ Đang, Lạc Hà. Mỗi tuyến có Sĩ khí; Shen vắng mặt ở tuyến nào thì Sĩ khí tuyến ấy giảm 6 mỗi ngày. Về 0 là thất thủ, người ở đó có thể chết vĩnh viễn.]",
      ],
      onEnter: { flag: "a7_start", mark: "a7", arc: 7, place: "kim_lang", front: { nga_mi: 70, vo_dang: 70, lac_ha: 70 },
        quest: { q_dai_chien: { name: "Chính Tà Đại Chiến", desc: "Giữ ba chiến tuyến Nga Mi, Võ Đang, Lạc Hà. Ngày A+3 Huyết Ảnh đánh Long Môn ở Lạc Hà, A+5 vây Nga Mi, A+7 cùng lúc vây Võ Đang và Cái Bang, A+11 Thiết Kỵ triều đình tới, A+14 đại chiến ở Lạc Hà Nguyên.", dueDays: 14, dueFrom: "a7" } } },
      choices: [
        { t: "Nhận lời làm tiên phong để lấy tin trong quân", req: { noflag: "wanted" }, go: "@hub", eff: { flag: "a7_vanguard", rep: { vo_lam: 50 } }, r: "Tạ Thiên Hành vỗ vai Shen trước toàn quân. Từ nay cậu đi lại trong doanh trại Võ Lâm Minh như người nhà." },
        { t: "Lặng lẽ rời quảng trường, tự đi giữ các tuyến", go: "@hub", eff: { flag: "a7_refuse" }, r: "Shen rời quảng trường khi tiếng hô còn vang. Từ hôm nay, cậu bị coi là kẻ đáng ngờ." },
      ] },

    a7_lh_attack: { chapter: C7, title: "Huyết Ảnh đánh Long Môn", place: "yard2", time: "night", cast: ["shen", "hac_y"],
      text: ["Đêm thứ ba, Song Sát của Huyết Ảnh Lâu đánh vào Long Môn Tiêu Cục. Cờ rồng đen bốc cháy. Long Phượng Nhi đứng trước cổng, một mình cầm đao chặn lối."],
      fight: { foes: ["song_sat", "song_sat"], opts: { canFlee: false }, win: "a7_lh_win", lose: "a7_lh_lose", tx: "a7_lh_attack" } },
    a7_lh_win: { chapter: C7, title: "Giữ được Long Môn", place: "yard2", time: "night", cast: ["shen", "phuong_nhi"], text: ["Song Sát rút lui. Long Phượng Nhi buông đao, ngồi phịch xuống bậc thềm, cười trong nước mắt: \"Lần thứ hai ngươi cứu ta rồi đấy.\""],
      onEnter: { flag: ["saved_phuong_nhi", "a7_ev_lh"], front: { lac_ha: 20 }, aff: { phuong_nhi: 15, long_tieu_chu: 15 }, rep: { long_mon: 80 }, exp: 40000 }, choices: [{ t: "…", go: "@hub" }] },
    a7_lh_lose: { chapter: C7, title: "Long Môn cháy", place: "yard2", time: "night", cast: ["shen", "phuong_nhi"], text: ["Shen bị đánh văng vào tường. Long Chấn Uy lao ra từ hậu viện, ôm con gái chạy qua đám cháy. Long Môn mất nửa tiêu cục, nhưng người còn sống."],
      onEnter: { flag: ["saved_phuong_nhi", "a7_ev_lh"], front: { lac_ha: -15 } }, choices: [{ t: "…", go: "@hub" }] },
    a7_lh_news: { chapter: C7, title: "Tin dữ từ Lạc Hà", place: "camp", time: "day", cast: ["shen"], text: ["Người đưa tin của Long Môn tới, áo dính đầy tro: đêm qua Huyết Ảnh Song Sát đánh vào tiêu cục. Long Môn tổn thất nặng.", "[Nếu Sĩ khí tuyến Lạc Hà còn dưới 20 sau trận này, Long Phượng Nhi không qua khỏi. Giữ Sĩ khí, hoặc có mặt ở Lạc Hà, là cách cứu cô.]"],
      onEnter: { flag: "a7_ev_lh", front: { lac_ha: -15 }, cond: { req: { fn: (s) => (s.front.lac_ha || 0) < 20 }, eff: { die: { n: "phuong_nhi", actor: "Huyết Ảnh Song Sát", action: "Giết Long Phượng Nhi trước cổng Long Môn", note: "Cô giữ cổng tới hơi thở cuối cùng." } } } }, choices: [{ t: "…", go: "@hub" }] },

    a7_nm_siege: { chapter: C7, title: "Nga Mi bị vây", place: "temple", time: "day", cast: ["shen", "to_van_yen"],
      text: ["Ngày thứ năm, quân mặc giáp Võ Lâm Minh vây chân núi Nga Mi, nhưng kẻ cầm đầu đeo nhẫn đồng hình giọt máu. Ni cô Nga Mi giữ cổng Kim Đỉnh, quân y chật kín người bị thương."],
      fight: { foes: ["binh_si_vlm", "song_sat"], opts: { canFlee: false }, win: "a7_nm_win", lose: "a7_nm_lose", tx: "a7_nm_siege" } },
    a7_nm_win: { chapter: C7, title: "Giữ được Kim Đỉnh", place: "temple", time: "dusk", cast: ["shen"], text: ["Quân vây rút xuống chân núi. Các ni cô Nga Mi chắp tay cúi đầu trước Shen."],
      onEnter: { flag: ["saved_to_van_yen", "a7_ev_nm"], front: { nga_mi: 20 }, rep: { nga_mi: 100 }, aff: { to_van_yen: 15 }, exp: 40000 }, choices: [{ t: "…", go: "@hub" }] },
    a7_nm_lose: { chapter: C7, title: "Lùi lên núi", place: "temple", time: "dusk", cast: ["shen"], text: ["Shen cùng các ni cô lùi lên Kim Đỉnh. Chân núi đã mất."], onEnter: { flag: "a7_ev_nm", front: { nga_mi: -15 } }, choices: [{ t: "…", go: "@hub" }] },
    a7_nm_news: { chapter: C7, title: "Tin từ Nga Mi", place: "camp", time: "day", cast: ["shen"], text: ["Chim bồ câu từ Nga Mi bay tới, chân buộc mảnh lụa thấm máu: \"Chân núi đã mất. Kim Đỉnh còn trụ được ít ngày.\""], onEnter: { flag: "a7_ev_nm", front: { nga_mi: -15 } }, choices: [{ t: "…", go: "@hub" }] },

    a7_double: { chapter: C7, title: "Hai nơi cùng bị vây", place: "camp", time: "night", cast: ["shen", "lao_ho"],
      text: [
        "Đêm thứ bảy, hai tin dữ tới cùng lúc.",
        "Võ Đang bị vây kín, Tử Tiêu Cung đã cháy một góc. Cùng giờ ấy, tổng đà Cái Bang ngoài Kim Lăng bị quân Võ Lâm Minh đánh úp, Lão Hồ đang bị vây trong miếu.",
        "Hai nơi cách nhau ba ngày đường. Shen chỉ kịp tới một.",
      ],
      onEnter: { flag: "a7_ev_double" },
      choices: [
        { t: "Cứu Võ Đang", go: "a7_vd_f", eff: { flag: "chose_vo_dang", place: "vo_dang", rep: { cai_bang: -50 } }, r: "Shen thúc ngựa về phía Võ Đang. Sau lưng cậu, ánh lửa ở phía Kim Lăng sáng rực cả một góc trời." },
        { t: "Cứu Cái Bang", go: "a7_cb_f", eff: { flag: "chose_cai_bang", place: "kim_lang", front: { vo_dang: -20 } }, r: "Shen quay đầu về Kim Lăng. Lão Hồ đã cứu cậu một lần trong đêm cháy năm xưa. Lần này đến lượt cậu." },
        { t: "Chia quân: người nhận truyền thừa Kiếm Trủng giữ Võ Đang, Shen về cứu Cái Bang", req: { flag: "legacy_ally", fn: (s) => !!ally6(s) }, go: "a7_cb_f", eff: { flag: ["chose_cai_bang", "split_army"], place: "kim_lang" },
          r: "Người đồng hành cầm truyền thừa Kiếm Thần, một mình lên Võ Đang. \"Đi đi. Ta giữ được.\"" },
      ] },
    a7_vd_f: { chapter: C7, title: "Tử Tiêu Cung", place: "temple", time: "night", cast: ["shen", "thanh_hu"], text: ["Shen phá vòng vây từ chân núi lên Tử Tiêu Cung. Thanh Hư chân nhân đang một mình giữ cổng."], fight: { foes: ["binh_si_vlm", "binh_si_vlm", "ma_tu_si"], opts: { canFlee: false }, win: "a7_vd_win", lose: "a7_vd_lose", tx: "a7_vd_f" } },
    a7_vd_win: { chapter: C7, title: "Giữ được Võ Đang", place: "temple", time: "day", cast: ["shen", "thanh_hu"],
      text: ["Bình minh trên Võ Đang. Thanh Hư chống kiếm đứng dậy giữa sân đá, áo đạo bào rách nát.", "> Lão đạo nợ cậu một mạng. Võ Đang nợ cậu một ngọn núi.", "Tin từ Kim Lăng: tổng đà Cái Bang bị đốt, Lão Hồ trọng thương nhưng còn sống."],
      onEnter: { flag: "saved_thanh_hu", front: { vo_dang: 25 }, rep: { vo_dang: 150, cai_bang: -30 }, aff: { thanh_hu: 20 }, exp: 60000 }, choices: [{ t: "…", go: "@hub" }] },
    a7_vd_lose: { chapter: C7, title: "Lùi vào Tử Tiêu Cung", place: "temple", time: "day", cast: ["shen"], text: ["Shen cùng các đạo sĩ lùi vào Tử Tiêu Cung, đóng chặt cửa. Võ Đang còn, nhưng chân núi đã mất."], onEnter: { flag: "saved_thanh_hu", front: { vo_dang: -10 } }, choices: [{ t: "…", go: "@hub" }] },
    a7_cb_f: { chapter: C7, title: "Miếu Thành Hoàng", place: "temple", time: "night", cast: ["shen", "lao_ho"], text: ["Miếu Thành Hoàng cháy rừng rực. Lão Hồ đứng giữa sân miếu, cây gậy trúc xanh quét ngang, xung quanh là xác lính mặc giáp Võ Lâm Minh."], fight: { foes: ["binh_si_vlm", "binh_si_vlm", "huyet_tan"], opts: { canFlee: false }, win: "a7_cb_win", lose: "a7_cb_lose", tx: "a7_cb_f" } },
    a7_cb_win: { chapter: C7, title: "Lão Hồ", place: "temple", time: "day", cast: ["shen", "lao_ho"],
      text: ["Lão Hồ ngồi bệt giữa tro tàn, tu một hơi rượu, rồi phá lên cười.", "> Thằng ngốc. Mười năm trước ta bế ngươi qua lửa. Hôm nay ngươi lội lửa vào lôi ta ra. Huề.", "Mạng lưới Cái Bang còn nguyên. Mọi tin tức trong quân Minh chủ, từ nay đều tới tai Shen."],
      onEnter: { flag: ["saved_lao_ho", "ev_caibang"], rep: { cai_bang: 150, vo_dang: -30 }, aff: { lao_ho: 20 }, exp: 60000, cond: { req: { flag: "split_army" }, note: "Tin từ Võ Đang: người đồng hành đã giữ được núi.", eff: { front: { vo_dang: 15 } } } }, choices: [{ t: "…", go: "@hub" }] },
    a7_cb_lose: { chapter: C7, title: "Tro tàn", place: "temple", time: "day", cast: ["shen"], text: ["Shen lôi được Lão Hồ ra khỏi biển lửa, nhưng tổng đà Cái Bang đã thành tro."], onEnter: { flag: "saved_lao_ho" }, choices: [{ t: "…", go: "@hub" }] },

    a7_lien: { chapter: C7, title: "Tin mật", place: "camp", time: "night", cast: ["shen", "lien_nhi"],
      text: ["Một mũi phi tiêu cắm phập xuống cột lều, kèm mảnh giấy cuộn tròn. Nét chữ nguệch ngoạc của Liên Nhi:", "\"Lâu chủ sẽ phục kích ở khúc sông hẹp Lạc Hà Nguyên, đêm đại chiến. Hắn sẽ đánh từ phía sau lưng quân các phái. Đừng chết. Ta còn nợ ngươi.\""],
      onEnter: { flag: ["plan_known", "a7_ev_lien"], ledger: { actor: "Liên Nhi", action: "Báo trước kế hoạch phục kích của Lâu chủ Huyết Y", target: "Huyết Ảnh Lâu", witness: "—", pending: "—", trigger: "—" } }, choices: [{ t: "…", go: "@hub" }] },

    a7_thiet_ky: { chapter: C7, title: "Thiết Kỵ Cẩm Y", place: "camp", time: "day", cast: ["shen"],
      text: ["Ngày thứ mười một, triều đình nhúng tay. Ba nghìn Thiết Kỵ Cẩm Y kéo xuống từ phương bắc, danh nghĩa \"dẹp loạn giang hồ\", gặp ai mang binh khí cũng chém."],
      onEnter: { flag: "a7_ev_tk" },
      choices: [
        { t: "Đưa lệnh bài của tên mật thám năm xưa", req: { flag: "cam_y_friend" }, go: "@hub", eff: { item: ["lenh_cam_y", 1], front: { nga_mi: 5, vo_dang: 5, lac_ha: 5 } }, r: "Viên chỉ huy Thiết Kỵ nhìn lệnh bài rất lâu, rồi ra lệnh lui quân ba mươi dặm. \"Cẩm Y Ti trả nợ một lần. Lần sau gặp lại, không có nợ nữa.\"" },
        { t: "Liên thủ với Ma Giáo đánh lui Thiết Kỵ", req: { flag: "ma_ally" }, go: "a7_tk_f", r: "Dạ Linh dẫn tử sĩ Ma Giáo từ Tây Vực tới. Lần đầu tiên sau mười năm, người Ma Giáo và người Trung Nguyên đứng cùng một hàng." },
        { t: "Tự mình chặn đường Thiết Kỵ", go: "a7_tk_f" },
        { t: "Giữ trung lập, để chúng tự rút", go: "@hub", eff: { front: { nga_mi: -15, vo_dang: -15, lac_ha: -15 } }, r: "Thiết Kỵ càn qua các tuyến như lưỡi cày qua ruộng, rồi mới chịu rút." },
      ] },
    a7_tk_f: { chapter: C7, title: "Chặn Thiết Kỵ", place: "road", time: "day", cast: ["shen"], text: ["Tiếng vó ngựa rung chuyển mặt đất."], fight: { foes: ["thiet_ky", "thiet_ky"], opts: { canFlee: true, road: true, cuts: [["ma_ally", 0.85]] }, win: "a7_tk_win", lose: "a7_tk_lose", tx: "a7_tk_f" } },
    a7_tk_win: { chapter: C7, title: "Thiết Kỵ lui quân", place: "road", time: "dusk", cast: ["shen"], text: ["Hai viên phó tướng Thiết Kỵ ngã ngựa. Quân triều đình lui về phương bắc."], onEnter: { front: { nga_mi: 10, vo_dang: 10, lac_ha: 10 }, rep: { trieu_dinh: -50 }, exp: 60000 }, choices: [{ t: "…", go: "@hub" }] },
    a7_tk_lose: { chapter: C7, title: "Thất bại", place: "road", time: "dusk", cast: ["shen"], text: ["Thiết Kỵ tràn qua. Shen chỉ cứu được những người ở gần mình."], onEnter: { front: { nga_mi: -10, vo_dang: -10, lac_ha: -10 } }, choices: [{ t: "…", go: "@hub" }] },

    a7_final_pre: { chapter: C7, title: "Lạc Hà Nguyên", place: "river", time: "dusk", cast: ["shen"],
      text: [
        "Ngày thứ mười bốn. Mọi chiến tuyến dồn về bờ sông Lạc Hà, nơi Shen lần đầu nhìn thấy dòng sông chảy về Kim Lăng.",
        "Quân các phái đóng ở bờ bắc, quân Võ Lâm Minh ở bờ nam. Giữa hai bờ, sương chiều dày đặc như một tấm màn.",
      ],
      onEnter: { place: "lac_ha", cond: { req: { fn: (s) => ["nga_mi", "vo_dang", "lac_ha"].filter((k) => !KM.has(s, "fall_" + k) && (s.front[k] || 0) >= 50).length >= 2 }, note: "Ít nhất hai chiến tuyến còn vững: các phái cùng sát cánh. Huyết Y sẽ phải chia lực.", eff: { flag: "a7_fronts_ok" } } },
      choices: [
        { t: "Đi chặn Tiêu Hạo ở mỏm đá đầu sông", req: { noflag: ["killed_tieu_hao", "tieu_hao_freed"], alive: "tieu_hao" }, hide: true, go: "a7_tieu_hao" },
        { t: "Vào trận", req: { fn: (s) => KM.has(s, "killed_tieu_hao") || KM.has(s, "tieu_hao_freed") || KM.dead(s, "tieu_hao") || KM.has(s, "a7_th_done") }, hide: true, go: "a7_final" },
      ] },
    a7_tieu_hao: { chapter: C7, title: "Song Sát", place: "river", time: "dusk", cast: ["shen", "tieu_hao"],
      text: ["Trên mỏm đá, một trong Huyết Ảnh Song Sát gỡ mặt nạ. Tiêu Hạo. Gương mặt hắn già đi mười tuổi.", "> Ta đã không còn đường quay lại Thanh Vân, Shen. Chỉ còn Lâu. Đánh đi."],
      fight: { foes: ["tieu_hao_s"], opts: { canFlee: false, noLoot: true }, win: "a7_tieu_hao_win", lose: "a7_final", tx: "a7_tieu_hao" } },
    a7_tieu_hao_win: { chapter: C7, title: "Sư huynh", place: "river", time: "dusk", cast: ["shen", "tieu_hao"],
      text: ["Tiêu Hạo nằm ngửa trên đá, máu thấm ướt áo đen. Hắn cười, lần đầu tiên không nhếch mép.", "> Năm ấy ta trộm kiếm phổ, đổ cho ngươi. Rồi Huyết Ảnh mua ta bằng một lời hứa. Giờ ngươi muốn làm gì thì làm."],
      onEnter: { flag: "a7_th_done", exp: 50000 },
      choices: [
        { t: "Tha cho hắn, bảo hắn đứng ra làm chứng", go: "a7_final", eff: { flag: "tieu_hao_return", moral: 15 }, r: "Tiêu Hạo nhìn Shen rất lâu. \"Được. Ta sẽ nói hết. Về cái đêm mất kiếm phổ, về kẻ đã mua ta.\"" },
        { t: "Kết liễu", go: "a7_final", eff: { die: { n: "tieu_hao", actor: "Shen", action: "Giết Tiêu Hạo ở Lạc Hà Nguyên", note: "" }, moral: -10 }, r: "Tiêu Hạo nhắm mắt. Hắn không né." },
      ] },
    a7_final: { chapter: C7, title: "Lâu chủ Huyết Y", place: "river", time: "night", cast: ["shen", "huyet_y"],
      text: ["Giữa đêm, sương trên mặt sông bỗng nhuốm đỏ. Một bóng áo đỏ đứng trên mặt nước, không chìm. Lâu chủ Huyết Y.", "> Thẩm gia trang. Ta còn nhớ lửa đêm ấy. Ngươi là đứa bé trốn dưới giếng phải không?"],
      onEnter: { meet: "thien_co" },
      fight: { foes: ["huyet_y"], opts: { canFlee: false, hurt: "huyet_y", cuts: [["a7_fronts_ok", 0.8], ["plan_known", 0.8], ["huyet_got_legacy", 1.15]] }, win: "a7_final_win", lose: "a7_final_lose" } },
    a7_final_lose: { repeat: true, chapter: C7, title: "Gượng dậy", place: "river", time: "night", cast: ["shen"], text: ["Shen rơi xuống sông. Bàn tay ai đó kéo cậu lên bờ, nhét vào miệng một viên đan dược. Bờ bắc vang tiếng hô: các phái đã vượt sông, lao vào quân Huyết Ảnh."], onEnter: { hurt: "huyet_y", heal: 1 }, choices: [{ t: "Quay lại trận", go: "a7_final" }] },
    a7_final_win: { chapter: C7, title: "Áo đỏ chìm sông", place: "river", time: "day", cast: ["shen"],
      text: [
        "Huyết Y quỵ xuống, áo đỏ loang ra trên mặt nước như một vũng máu. Trong ngực áo hắn có hai thứ: một mảnh lụa cũ chép phép thông kinh mạch, và một con dấu bằng ngọc, khắc bốn chữ \"Võ Lâm Minh Chủ\".",
        "Trước khi tắt thở, Huyết Y cười khàn: \"Ngươi tưởng Minh chủ là kẻ cầm cờ sao? Hắn cũng chỉ là một quân cờ… như ta.\"",
      ],
      onEnter: { flag: "a7_boss_done", shard: 1, exp: 100000, money: 300000, quest: { q_dai_chien: "done" }, rep: { vo_dang: 50, nga_mi: 50, thieu_lam: 50, cai_bang: 50 },
        ledger: { actor: "Huyết Y", action: "Mang ấn tín phủ Minh chủ khi chỉ huy Huyết Ảnh Lâu", target: "—", witness: "Các phái ở Lạc Hà Nguyên", pending: "Bằng chứng nối Minh chủ với Huyết Ảnh", trigger: "Arc 8" } },
      choices: [{ t: "…", go: "a7_end" }] },
    a7_end: { chapter: C7 + " · Kết", title: "Sau chiến tranh", place: "river", time: "day", cast: ["shen", "lao_ho"],
      text: [
        "Lạc Hà Nguyên im ắng sau ba ngày. Người ta chôn người chết thành từng hàng dài dọc bờ sông.",
        "Tin từ Kim Lăng: Tạ Thiên Hành tuyên bố \"đã đánh lui Ma Giáo\", mở Đại Hội Võ Lâm sau mười ngày để tôn vinh người có công, và chọn người kế vị.",
        "> Đại Hội ấy là nơi duy nhất cả giang hồ cùng có mặt. — Lão Hồ nói. — Muốn vạch mặt lão, phải ở đó. Và phải mang đủ chứng cứ.",
        "[Kết thúc Arc 7. Mở Arc 8 · Vạch Mặt Minh Chủ.]",
      ],
      onEnter: { flag: "a7_done", exp: 20000 },
      choices: [{ t: "Lên đường về Kim Lăng", go: "a8_road" }, { t: "Ở lại Lạc Hà ít hôm", go: "@hub" }] },

    /* ---------- Kỳ ngộ lão tướng ---------- */
    a7_kyngo: { chapter: C7 + " · Kỳ ngộ", title: "Lời trăng trối của lão tướng", place: "medic", time: "night", cast: ["shen", "lao_tuong"],
      text: [
        "Trong quân y Nga Mi có một ông già cụt tay, là lão tướng biên phòng Mạnh Cương, bị thương khi dẫn dân chạy loạn. Mấy đêm nay Shen ngồi cạnh thay băng cho ông.",
        "> Ta đánh giặc bốn mươi năm, cuối cùng chết vì người mình. — Ông cười. — Dưới gầm giường có cây binh khí theo ta cả đời, và mấy chiêu đao ta học từ một người tên Bá Vương. Cầm lấy. Đừng để nó gỉ.",
        "Sáng hôm sau, lão tướng không dậy nữa.",
      ],
      onEnter: { flag: "kyngo_a7", tierWeapon: "s", skill: "ba_vuong_tram", meet: "lao_tuong", exp: 50000 }, choices: [{ t: "Chôn ông dưới gốc tùng", go: "@hub" }] },
  });

  /* ---------------- Sự kiện ---------------- */
  KM.TRIGGERS.push((s) => {
    if (KM.has(s, "a5_done") && !KM.has(s, "a6_start") && s.place === "tuyet_linh") return "a6_arrive";
    if (A6(s)) {
      const d = KM.since(s, "a6");
      if (d >= 10 && !KM.has(s, "a6_boss_done") && !KM.has(s, "realm_closed")) return "a6_closed";
      if (d >= 3 && !KM.has(s, "realm_open")) return "a6_open";
      if (KM.has(s, "a6_boss_done") && !KM.has(s, "a6_done") && s.place === "kiem_trung") return "a6_legacy";
    }
    if (KM.has(s, "a6_done") && !KM.has(s, "a7_start") && s.place === "kim_lang") return "a7_rally";
    if (A7(s)) {
      const d = KM.since(s, "a7");
      if (d >= 14 && !KM.has(s, "a7_boss_done")) return "a7_final_pre";
      if (d >= 3 && !KM.has(s, "a7_ev_lh")) return s.place === "lac_ha" ? "a7_lh_attack" : "a7_lh_news";
      if (d >= 5 && !KM.has(s, "a7_ev_nm")) return s.place === "nga_mi" ? "a7_nm_siege" : "a7_nm_news";
      if (d >= 7 && !KM.has(s, "a7_ev_double")) return "a7_double";
      if (d >= 9 && !KM.has(s, "a7_ev_lien") && KM.has(s, "lien_spared") && !KM.dead(s, "lien_nhi") && (s.aff.lien_nhi || 0) >= 40) return "a7_lien";
      if (d >= 11 && !KM.has(s, "a7_ev_tk")) return "a7_thiet_ky";
    }
    return null;
  });

  /* ---------------- Khu tự do ---------------- */
  const coldSleep = (label, price) => ({ t: label, sub: price ? KM.money(price) : "", cost: 0, run: (s) => {
    const m = price ? KM.apply(s, { money: -Math.min(price, s.money) }) : [];
    m.push(...KM.sleep(s));
    const warm = s.gear.body && KM.ITEMS[s.gear.body].cold;
    if (!warm && s.place === "kiem_trung") { const d = KM.derived(s), l = Math.floor(d.maxHP * 0.1); s.cur.hp = Math.max(1, s.cur.hp - l); m.push("Lạnh thấu xương: −" + l + " HP (10% HP tối đa). Mặc áo lông tuyết lang thì không bị."); }
    return R(m);
  } });
  KM.HUBS.tuyet_linh = {
    name: "Tuyết Lĩnh Trấn", place: "snow",
    note: (s) => A6(s) ? (KM.has(s, "realm_open") ? "Bí cảnh đang mở, khép lại cuối ngày " + (s.marks.a6 + 9) + "." : "Bí cảnh mở ngày " + (s.marks.a6 + 3) + ".") + (KM.has(s, "a6_ally_set") ? "" : " Chưa chọn đồng hành.") : "",
    locs: [
      { id: "quan_ruou", name: "Quán rượu thợ săn", art: "inn", desc: "Quán rượu duy nhất trấn, lò sưởi cháy suốt ngày đêm.", actions: [
        coldSleep("Thuê phòng nghỉ đêm", 50),
        { t: "▶ Mua bản đồ bí cảnh của kẻ lạ", sub: "20 bạc · qua Kiếm Lâm không cần đánh", cost: 0, show: (s) => A6(s) && !KM.has(s, "a6_map"), run: (s) => s.money < 2000 ? R(["Không đủ 20 bạc."], { free: true }) : R(KM.apply(s, { money: -2000, flag: "a6_map" }).concat(["Kẻ lạ trùm khăn kín mặt, đẩy tấm da dê vẽ lối đi qua Kiếm Lâm. \"Bản thật đấy. Bán cho mỗi mình ngươi thôi.\""])) },
      ] },
      { id: "lo_ren", name: "Lò rèn băng", art: "market", when: "day", desc: "Thợ rèn ở đây tôi thép bằng nước tuyết tan.", actions: [KM.shopAct("tl_lo_ren"), { t: "Cường hóa", cost: 0, run: () => R([], { forge: true }) }] },
      { id: "doanh_trai", name: "Doanh trại các phái", art: "camp", desc: "Thiếu Lâm, Võ Đang, Đường Môn, Hoa Sơn dựng trại sát nhau.", actions: [
        KM.storyAct("Chọn đồng hành vào bí cảnh", "a6_ally", (s) => A6(s) && !KM.has(s, "a6_ally_set")),
        KM.storyAct("Tới cửa bí cảnh", "a6_open", (s) => A6(s) && KM.since(s, "a6") >= 3 && !KM.has(s, "realm_open")),
        KM.trainAct("Tỉ thí với đệ tử các phái"),
      ] },
      { id: "rung_tuyet", name: "Rừng tuyết", art: "snow", when: "day", desc: "Rừng thông phủ tuyết, bầy tuyết lang săn mồi.", actions: [
        KM.huntAct("Săn tuyết lang", "Rank A", [[75, ["tuyet_lang"]], [100, ["tuyet_lang", "tuyet_lang"]]], "Tiếng tru vọng giữa rừng tuyết."),
      ] },
    ],
  };
  KM.HUBS.kiem_trung = {
    name: "Kiếm Trủng", place: "snow",
    note: (s) => A6(s) ? "Bí cảnh khép lại cuối ngày " + (s.marks.a6 + 9) + " (còn " + Math.max(0, s.marks.a6 + 9 - s.day) + " ngày). " + (KM.has(s, "f2") ? "Đã qua tầng 2." : KM.has(s, "f1") ? "Đã qua tầng 1." : "Chưa qua tầng nào.") + (ally6(s) ? " Đồng hành: " + KM.NPCS[ally6(s)].name + "." : "") : "",
    locs: [
      { id: "hang_bang", name: "Hang băng", art: "cave", desc: "Hang đá cạn sát cổng, đủ chỗ cho vài người tránh gió.", actions: [coldSleep("Ngủ trong hang băng", 0)] },
      { id: "kiem_lam", name: "Tầng 1 · Kiếm Lâm", art: "snow", desc: "Rừng kiếm cắm ngược, kiếm khôi đá canh giữ.", actions: [
        KM.storyAct("Vượt Kiếm Lâm", "a6_lam", (s) => !KM.has(s, "f1"), "Kiếm khôi đá ×2 · Rank A", 1),
        KM.huntAct("Đập kiếm khôi lấy Kiếm Thạch", "Rank A", [[100, ["kiem_khoi"]]], "Một kiếm khôi cựa mình đứng dậy."),
      ] },
      { id: "nghia_dia", name: "Nghĩa địa kiếm", art: "snow", desc: "Nơi chôn những người giữ kiếm đời trước.", actions: [
        KM.storyAct("Lần theo tiếng giao đấu", "a6_ngu_lao", (s) => KM.has(s, "f1") && !!ally6(s) && !KM.has(s, "ally6_saved") && !KM.has(s, "ally6_lost"), "", 1),
        KM.huntAct("Truy đuổi tàn quân Huyết Ảnh", "Rank A", [[100, ["ngu_lao"]]], "Một bóng áo đen lẩn sau bia mộ."),
      ] },
      { id: "van_kiem", name: "Tầng 2 · Vấn Kiếm", art: "cave", desc: "Gian đá với tấm bia biết hỏi.", show: (s) => KM.has(s, "f1"), actions: [
        KM.storyAct("Đứng trước bia Vấn Kiếm", "a6_bia", (s) => !KM.has(s, "f2"), "", 1),
        { t: "▶ Ngồi tĩnh tọa bên Kiếm Ý Thạch", sub: "Kỳ ngộ · Tâm Cảnh (WIS) độ khó 22 · mỗi ngày một lần", show: (s) => KM.has(s, "f2") && !KM.has(s, "kyngo_a6") && !KM.has(s, "today_kyngo6"), run: (s) => (KM.flag(s, "today_kyngo6"), R([], { scene: "a6_kyngo" })) },
      ] },
      { id: "vo_danh", name: "Tầng 3 · Vô Danh Điện", art: "palace", desc: "Điện thờ kiếm của Kiếm Thần Vô Danh.", show: (s) => KM.has(s, "f2"), actions: [
        { t: "▶ Bước vào Vô Danh Điện", sub: "Trùm · Kiếm Hồn Vô Danh · Rank S · Lv 64", cost: 0, show: (s) => !KM.has(s, "a6_boss_done"), run: (s) => R([], { scene: KM.has(s, "a3_fame") && !KM.has(s, "vanphi6_done") && !KM.dead(s, "ta_van_phi") && !KM.has(s, "ally6_ta_van_phi") ? "a6_vanphi" : "a6_boss_pre" }) },
      ] },
    ],
  };
  /* Ba chiến tuyến */
  const frontNote = (k) => (s) => A7(s) ? "Sĩ khí: " + ["nga_mi", "vo_dang", "lac_ha"].map((f) => KM.FRONT_NAME[f].replace("tuyến ", "") + " " + (KM.has(s, "fall_" + f) ? "THẤT THỦ" : (s.front[f] || 0))).join(" · ") + ". Đại chiến ngày " + (s.marks.a7 + 14) + "." : "";
  const frontFight = (k, pool, note) => ({ t: "▶ Ra tiền tuyến", sub: "Rank S · thắng: Sĩ khí +15", show: (s) => A7(s) && !KM.has(s, "fall_" + k), run: (s) => {
    const r = KM.d100(s); let f = pool[0][1]; for (const [p, foes] of pool) if (r <= p) { f = foes; break; }
    return R([note], { fight: { foes: f.slice(), opts: {}, after: (s2, won) => won ? KM.applyX(s2, { front: { [k]: 15 }, exp: Math.floor(KM.expReq(s2.level) * 0.05) }) : KM.applyX(s2, { front: { [k]: -5 } }) } });
  } });
  KM.HUBS.nga_mi = {
    name: "Nga Mi Sơn", place: "temple", note: frontNote("nga_mi"),
    locs: [
      { id: "kim_dinh", name: "Kim Đỉnh", art: "temple", desc: "Đỉnh núi Nga Mi, chùa vàng giữa mây.", actions: [KM.rest(null, 0, "Nghỉ ở thiện phòng"), KM.trainAct("Luyện công giữa biển mây")] },
      { id: "tien_tuyen", name: "Tiền tuyến chân núi", art: "camp", desc: "Quân vây đóng trại dưới chân núi.", actions: [frontFight("nga_mi", [[60, ["binh_si_vlm", "binh_si_vlm"]], [100, ["song_sat"]]], "Shen dẫn các ni cô đánh xuống chân núi.")] },
      { id: "quan_y", name: "Quân y", art: "medic", desc: "Lều quân y chật kín thương binh.", actions: [
        { t: "Cứu chữa thương binh", sub: "Kỳ ngộ sau 3 lần", show: (s) => !KM.has(s, "kyngo_a7"), run: (s) => { if (!once(s, "today_qy")) return R(["Hôm nay đã thay băng xong."], { free: true }); s.visits.qy = (s.visits.qy || 0) + 1; const m = KM.apply(s, { moral: 3, rep: { nga_mi: 10 } }); if (s.visits.qy >= 3) return R(m, { scene: "a7_kyngo" }); m.push("Shen thay băng suốt buổi. Ông lão cụt tay ở giường cuối nhìn cậu không chớp mắt."); return R(m); } },
        KM.shopAct("quan_nhu"),
      ] },
    ],
  };
  KM.HUBS.vo_dang = {
    name: "Võ Đang Sơn", place: "temple", note: frontNote("vo_dang"),
    locs: [
      { id: "tu_tieu", name: "Tử Tiêu Cung", art: "temple", desc: "Cung điện chính của Võ Đang.", actions: [KM.rest(null, 0, "Nghỉ ở đạo quán"), { t: "Luận đạo với Chân nhân Thanh Hư", show: (s) => !KM.dead(s, "thanh_hu"), run: (s) => R(["Thanh Hư giảng về Thái Cực: lấy nhu chế cương, lấy tĩnh chế động."].concat(KM.apply(s, { aff: { thanh_hu: 3 }, exp: Math.floor(KM.expReq(s.level) * 0.06), trend: { thu: 1 } }))) }] },
      { id: "tien_tuyen", name: "Tiền tuyến chân núi", art: "camp", desc: "Quân mặc giáp Võ Lâm Minh vây chân núi.", actions: [frontFight("vo_dang", [[60, ["binh_si_vlm", "binh_si_vlm"]], [100, ["binh_si_vlm", "ma_tu_si"]]], "Shen theo các đạo sĩ đánh xuống chân núi."), KM.shopAct("quan_nhu")] },
    ],
  };
  KM.HUBS.lac_ha.locs.push({ id: "tien_tuyen", name: "Tiền tuyến Lạc Hà", art: "camp", desc: "Doanh trại các phái dựng dọc bờ sông.", show: (s) => A7(s), actions: [
    frontFight("lac_ha", [[60, ["binh_si_vlm", "binh_si_vlm"]], [100, ["song_sat"]]], "Shen cùng tiêu sư Long Môn đánh ra bờ sông."), KM.shopAct("quan_nhu"),
  ] });
  const lhNote = KM.HUBS.lac_ha.note;
  KM.HUBS.lac_ha.note = (s) => (A7(s) ? frontNote("lac_ha")(s) : lhNote ? lhNote(s) : "");
})(typeof window !== "undefined" ? window : globalThis);
