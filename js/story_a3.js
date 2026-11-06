/* =====================================================================
   KIẾM MỆNH · ARC 3 — VÕ LÂM ĐẠI HỘI THIẾU NIÊN (Kim Lăng)
   Rank D → C · Lv 19–28. Lôi đài theo lịch: A+5, A+7, A+9, A+10, A+11.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const R = KM.R, night = (s) => s.slot === 2, day = (s) => s.slot <= 1;
  const once = (s, f) => { if (KM.has(s, f)) return false; KM.flag(s, f); return true; };
  const A3 = (s) => KM.has(s, "a3_start") && !KM.has(s, "a3_done");
  const k3 = ["k3_nhan", "k3_cang", "k3_trieu"];
  const NO = { solo: true, canFlee: false, noItems: true, noLoot: true };
  const CH = "Arc 3 · Võ Lâm Đại Hội";

  // Kết thúc Arc 2 giờ mở đường lên Kim Lăng
  Object.assign(KM.SCENES.a2_end, {
    text: [
      "Shen đứng trên bến Lạc Hà nhìn dòng sông chảy về phía đông, nơi có Kim Lăng.",
      "Mười ngày trước, cậu còn là một tạp dịch bị đánh gần chết sau bếp. Giờ đây, cậu có một cái tên trên giang hồ, một mối thù chưa rõ mặt, và một con đường.",
      "[Kết thúc Arc 2. Đại Hội Thiếu Niên sắp mở ở Kim Lăng, sáu ngày đường đi bộ.]",
    ],
    choices: [{ t: "Lên đường đi Kim Lăng", go: "a3_road" }, { t: "Ở lại Lạc Hà thêm ít lâu (đi Kim Lăng bằng bản đồ lúc nào cũng được)", go: "@hub" }],
  });

  Object.assign(KM.SCENES, {
    a3_road: { chapter: CH, title: "Đường quan về Kim Lăng", place: "road", time: "day", cast: ["shen"],
      text: ["Đường quan rộng dần, xe ngựa nối nhau về kinh thành. Người đi đường bàn tán không ngớt về Đại Hội Thiếu Niên: ai sẽ là đệ nhất, Minh chủ sẽ thưởng gì, môn phái nào mang người trẻ giỏi nhất tới."],
      special: "travel", dest: "kim_lang", go: "a3_gate" },

    a3_gate: { chapter: CH, title: "Cổng thành Kim Lăng", place: "city", time: "day", cast: ["shen"],
      text: [
        "Tường thành Kim Lăng cao ngất, gạch xám rêu phong. Dưới cổng Tụ Bảo, lính Cẩm Y Ti áo đỏ thêu cá chuồn lục từng bọc hành lý.",
        "Một tên lính chặn trước mặt Shen, mắt dán vào cái tay nải căng phồng.",
        "> Mở ra. Dạo này Ma Giáo trà trộn khắp nơi, ai mang thư từ lạ đều phải trình.",
      ],
      onEnter: { flag: "a3_start", mark: "a3", arc: 3, place: "kim_lang",
        quest: { q_dai_hoi: { name: "Đại Hội Thiếu Niên", desc: "Lôi đài mở theo lịch: vòng loại ngày A+5, vòng 16 A+7, vòng 8 A+9, bán kết A+10, chung kết A+11 (A là ngày tới Kim Lăng). Phải có mặt ở Kim Lăng đúng ngày, vắng mặt là bị loại.", dueDays: 11, dueFrom: "a3" },
          q_khuon: { name: "Kẻ đeo nhẫn giọt máu", desc: "Lần theo chiếc nhẫn đồng hình giọt máu ở Kim Lăng. Cần 2 trong 3 manh mối (tiệm cầm đồ Phúc Ký, bến cảng, Cái Bang ở miếu Thành Hoàng) để biết chỗ giấu. Hạn: trước chung kết.", dueDays: 11, dueFrom: "a3" } } },
      choices: [
        { t: "Giấu thư mật và sổ sách vào lớp áo trong", check: { stat: "AGI", dc: 16, bonusTrait: { anh_tu: 5 } }, go: "a3_register", fail: "a3_gate_fail", hide: true, req: { any: ["has_secret"] },
          rOk: "Ngón tay Shen lướt nhanh hơn mắt tên lính. Hắn lục tay nải, chỉ thấy quần áo cũ và mấy lọ thuốc, phẩy tay cho qua.", rFail: "Một góc giấy lòi ra khỏi vạt áo. Tên lính giật lấy, mắt sáng lên." },
        { t: "Dúi cho hắn 3 bạc", req: { money: 300 }, go: "a3_register", eff: { money: -300, anti: 1 }, r: "Tên lính cân thử túi bạc, cười nhạt: \"Mặt mũi sáng sủa thế này thì Ma Giáo gì.\" Hắn tránh sang một bên." },
        { t: "Đi cửa dành cho xe tiêu Long Môn", req: { flag: "sect_long_mon" }, go: "a3_register", eff: { aff: { long_tieu_chu: 3 } }, r: "Tiêu sư Long Môn đưa lệnh bài. Lính Cẩm Y chẳng buồn nhìn, phất cờ cho cả đoàn xe vào." },
        { t: "Mở tay nải cho hắn xem", go: "a3_register", r: "Trong tay nải chỉ có quần áo, thuốc men và ít tiền lẻ. Tên lính lầm bầm, đẩy Shen đi." },
      ] },
    a3_gate_fail: { chapter: CH, title: "Phạt tiền", place: "city", time: "day", cast: ["shen"],
      text: ["Tên lính đọc lướt mấy dòng, không hiểu gì, nhưng vẫn ghi tên Shen vào sổ \"kẻ khả nghi\". Cậu phải nộp 5 bạc tiền phạt mới được trả lại giấy tờ.", "[Cẩm Y Ti để ý Shen. Ra đường buổi tối ở Kim Lăng dễ bị chặn hỏi hơn.]"],
      onEnter: { money: -500, flag: "cam_y_watch" }, choices: [{ t: "Vào thành", go: "a3_register" }] },

    a3_register: { chapter: CH, title: "Phủ Minh chủ", place: "palace", time: "day", cast: ["shen", "ta_thien_hanh"],
      text: [
        "Bàn ghi danh Đại Hội đặt ngay trước phủ Minh chủ, nơi hai con sư tử đá cao bằng hai người đứng gác. Thiếu niên các phái xếp hàng dài, ai cũng áo mới, kiếm bóng.",
        "Shen vừa cầm bút thì cả hàng người chợt im bặt. Một người trung niên áo bào trắng bước ra từ trong phủ, tóc mai điểm bạc, nụ cười hiền như ông đồ dạy chữ.",
        "Tạ Thiên Hành, Minh chủ Võ Lâm. Ông nhìn bàn tay chai sạn của Shen một lúc lâu.",
        "> Cậu đánh Hắc Giao ở Lạc Hà, ta có nghe. Đánh không giống ai. Cậu tên gì, sư thừa môn phái nào?",
      ],
      onEnter: { meet: "ta_thien_hanh" },
      choices: [
        { t: "\"Thẩm Phong. Không môn không phái.\"", go: "a3_register2", eff: { flag: "name_real", rep: { vo_lam: 20 } }, r: "Nụ cười của Tạ Thiên Hành đứng lại nửa nhịp, chỉ nửa nhịp thôi. \"Thẩm… họ hay đấy.\" Rồi ông vỗ vai Shen như một trưởng bối." },
        { t: "\"Vô Danh. Kẻ vô danh tiểu tốt.\"", go: "a3_register2", eff: { flag: "name_fake", trend: { am: 1 } }, r: "Tạ Thiên Hành bật cười: \"Vô Danh. Năm xưa cũng có một người tên như thế, kiếm thuật đứng đầu thiên hạ.\" Ông cho người ghi tên vào sổ." },
      ] },
    a3_register2: { chapter: CH, title: "Kinh thành", place: "city", time: "dusk", cast: ["shen"],
      text: [
        "Kim Lăng về đêm sáng như ban ngày. Đèn lồng treo dọc sông Tần Hoài, thuyền hoa trôi chầm chậm, tiếng đàn tì bà vọng từ các tửu lâu.",
        "Shen tìm được phòng ở khách điếm Phúc Lai, sát chợ Đông. Cậu lấy chiếc nhẫn đồng hình giọt máu ra, xoay trong tay. Kẻ đeo nó đang ở đâu đó trong thành này.",
        "[Kim Lăng mở. Lôi đài Đại Hội mở vào ngày " + "A+5. Trong lúc chờ, hãy điều tra chiếc nhẫn: tiệm cầm đồ Phúc Ký, bến cảng, và Cái Bang ở miếu Thành Hoàng.]",
      ],
      special: "hub", hub: "kim_lang" },

    /* ---------- Điều tra ---------- */
    a3_phuc_ky: { chapter: CH, title: "Tiệm cầm đồ Phúc Ký", place: "inn", time: "day", cast: ["shen"],
      text: ["Lão chủ tiệm Phúc Ký đeo kính lão, ngón tay gầy như que củi. Vừa thấy chiếc nhẫn đồng, lão rụt tay lại như chạm phải than hồng.", "> Thứ này… tháng trước cũng có người mang tới cầm, rồi ba hôm sau quay lại chuộc. Người đó… thôi, lão không nhớ."],
      choices: [
        { t: "Gõ nhẹ lên quầy, chỉ ra sổ cầm đồ có ghi ngày tháng", check: { stat: "INT", dc: 15 }, go: "a3_phuc_ky_ok", fail: "a3_phuc_ky_no", rOk: "Shen lật sổ, chỉ vào một dòng chữ còn mới. Lão chủ tiệm tái mặt, biết không chối được nữa.", rFail: "Lão chủ tiệm gập sổ lại, mời Shen ra ngoài rất lễ phép." },
        { t: "Đặt 3 bạc lên quầy", req: { money: 300 }, go: "a3_phuc_ky_ok", eff: { money: -300 }, r: "Lão chủ tiệm nhìn quanh, rồi kéo bạc về phía mình." },
      ] },
    a3_phuc_ky_no: { chapter: CH, title: "Tiệm cầm đồ Phúc Ký", place: "inn", time: "day", cast: ["shen"], text: ["Lão chủ tiệm không hé thêm lời nào. Có lẽ phải quay lại hôm khác, hoặc mang theo bạc."], choices: [{ t: "Rời đi", go: "@hub" }] },
    a3_phuc_ky_ok: { chapter: CH, title: "Người chuộc nhẫn", place: "inn", time: "day", cast: ["shen"],
      text: ["> Người chuộc là một gã quản gia, áo the, mặt tròn, nói giọng Kim Lăng chính gốc. Lão thấy gã đi vào cửa sau phủ Minh chủ. Lão chỉ biết có thế thôi, công tử tha cho."],
      onEnter: { flag: "k3_nhan" }, choices: [{ t: "\"Cửa sau phủ Minh chủ…\"", go: "@hub" }] },

    a3_cang: { chapter: CH, title: "Bến cảng Tần Hoài", place: "river", time: "dusk", cast: ["shen"],
      text: ["Bến cảng ngoài cửa Thủy Tây ngập mùi cá và mùi dầu thắp. Mấy phu khuân vác ngồi nghỉ quanh đống lửa, chia nhau bình rượu rẻ.", "Nghe Shen hỏi chuyện nhẫn đồng, một gã già nhất nheo mắt."],
      choices: [
        { t: "Ngồi xuống uống cùng, nghe họ kể", check: { stat: "WIS", dc: 15, bonusTrait: { linh_giac: 4 } }, go: "a3_cang_ok", fail: "a3_cang_no", rOk: "Shen để họ nói. Câu chuyện vòng vèo một hồi rồi cũng quay về chỗ cậu cần.", rFail: "Họ chuyển sang chuyện đàn bà và cờ bạc. Đêm nay không moi thêm được gì." },
      ] },
    a3_cang_no: { chapter: CH, title: "Bến cảng", place: "river", time: "night", cast: ["shen"], text: ["Đống lửa tàn dần. Shen về khách điếm tay trắng."], choices: [{ t: "Về", go: "@hub" }] },
    a3_cang_ok: { chapter: CH, title: "Chuyến hàng đêm", place: "river", time: "night", cast: ["shen"],
      text: ["> Tháng trước có một chuyến hàng nặng lắm, hòm gỗ đóng đinh kín, chở thẳng từ thuyền vào kho sau phủ Minh chủ, nửa đêm. Người áp hàng đeo nhẫn đồng y như cái của cậu. Lão quản gia béo đứng đếm từng hòm."],
      onEnter: { flag: "k3_cang" }, choices: [{ t: "Ghi nhớ", go: "@hub" }] },

    a3_hac_giao: { chapter: CH, title: "Hắc Giao ở Kim Lăng", place: "lair", time: "night", cast: ["shen", "hac_giao"],
      text: ["Shen tìm thấy hắn ở cuối bến, trên một chiếc thuyền buôn muối giả. Hắc Giao đã cạo đầu, mặc áo thương nhân, nhưng hình xăm rồng trên ngực vẫn lộ ra dưới ánh đèn.", "> Lại là mày. Cái trấn Lạc Hà không đủ chỗ cho mày chết à?"],
      fight: { foes: ["hac_giao2"], opts: { canFlee: true }, win: "a3_hac_giao_win", lose: "a3_hac_giao_lose", tx: "a3_hac_giao" } },
    a3_hac_giao_win: { chapter: CH, title: "Sổ sách", place: "lair", time: "night", cast: ["shen"],
      text: ["Hắc Giao ngã xuống boong thuyền, máu loang lẫn vào nước sông. Dưới khoang, cuốn sổ sách thủy trại vẫn còn nguyên, kẹp kèm một tờ biên nhận: \"Hàng giao kho sau phủ Minh chủ. Người nhận: Triệu Phúc.\""],
      onEnter: { flag: ["hac_giao2_down", "k3_cang"], item: ["so_sach_giao", 1], exp: 3000, rep: { lac_ha: 30 } }, choices: [{ t: "Triệu Phúc…", go: "@hub" }] },
    a3_hac_giao_lose: { chapter: CH, title: "Rơi xuống sông", place: "river", time: "night", cast: ["shen"], text: ["Một ngọn giáo quật Shen văng khỏi thuyền. Cậu bơi được vào bờ, sống sót, nhưng thuyền muối đã nhổ neo đi mất. Có lẽ hắn sẽ quay lại bến vào đêm khác."], choices: [{ t: "Lết về", go: "@hub" }] },

    a3_mieu: { chapter: CH, title: "Miếu Thành Hoàng", place: "temple", time: "dusk", cast: ["shen", "lao_ho"],
      text: ["Miếu Thành Hoàng là nơi đám ăn mày Kim Lăng tụ tập mỗi chiều. Tượng thần sứt mũi, bát hương đầy tàn nhang.", "Lão Hồ ngồi trên bậc thềm, gặm đùi gà, như thể đã ngồi đó từ hôm qua."],
      choices: [
        { t: "Hỏi lão về chiếc nhẫn", req: { any: ["sect_cai_bang", "laoho_1"] }, go: "a3_mieu_ok", eff: { aff: { lao_ho: 4 } }, r: "Lão Hồ nhổ cái xương gà, gật đầu với mấy đứa ăn mày nhỏ. Lát sau chúng quay về, thì thầm vào tai lão." },
        { t: "Mua tin của đám ăn mày (5 bạc)", req: { money: 500 }, go: "a3_mieu_ok", eff: { money: -500, rep: { cai_bang: 10 } }, r: "Đám ăn mày chia nhau túi bạc, rồi tản ra khắp thành như bầy chim sẻ." },
        { t: "Thôi, để hôm khác", go: "@hub" },
      ] },
    a3_mieu_ok: { chapter: CH, title: "Triệu Phúc", place: "temple", time: "night", cast: ["shen", "lao_ho"],
      text: ["> Quản gia phủ Minh chủ tên Triệu Phúc. Đêm nào hắn cũng ra kho sau đếm hàng, một mình, mang theo chùm chìa khóa đeo ở thắt lưng. Kho có ba lớp khóa, lối vào từ ngõ cống phía tây.", "Lão Hồ ngừng lại, nhìn Shen rất lâu.", "> Ngươi định vào đó thật à? Phủ Minh chủ đấy, thằng ngốc."],
      onEnter: { flag: "k3_trieu", meet: "trieu_phuc" }, choices: [{ t: "\"Đêm nào cũng có trăng, lão Hồ.\"", go: "@hub" }] },

    /* ---------- Đột nhập kho sau ---------- */
    a3_inf: { chapter: CH, title: "Kho sau phủ Minh chủ", place: "palace", time: "night", cast: ["shen"],
      text: ["Canh ba. Tường phủ Minh chủ cao hai trượng, trên đỉnh cắm mảnh sành. Hai thị vệ cầm thương đi tuần, cứ một khắc lại qua một lượt.", "[Đột nhập qua ba lớp: tường, khóa, hòm hàng. Thất bại ở lớp nào cũng phải đánh thị vệ.]"],
      choices: [
        { t: "Lẻn qua tường lúc thị vệ quay lưng", check: { stat: "AGI", dc: 17, bonusTrait: { anh_tu: 5 } }, go: "a3_inf2", fail: "a3_inf_fight", rOk: "Shen lật qua tường không một tiếng động, áp mình vào bóng mái kho.", rFail: "Một mảnh sành rơi xuống, vỡ loảng xoảng. \"Ai đó?!\"" },
        { t: "Chui theo lối cống phía tây Lão Hồ chỉ", req: { flag: "k3_trieu", any: ["sect_cai_bang"] }, go: "a3_inf2", r: "Lối cống hôi thối, nhưng đưa Shen thẳng vào sân sau, không ai hay biết." },
      ] },
    a3_inf2: { chapter: CH, title: "Ba lớp khóa", place: "palace", time: "night", cast: ["shen"],
      text: ["Cửa kho có ba ổ khóa đồng, mỗi ổ một kiểu then. Phía xa, đèn lồng của Triệu Phúc đang lắc lư tiến lại."],
      choices: [{ t: "Dùng trâm sắt dò then khóa", check: { stat: "INT", dc: 16, bonusTrait: { thong_tue: 4 } }, go: "a3_inf3", fail: "a3_inf_fight", rOk: "Tách. Tách. Tách. Ba ổ khóa lần lượt bật ra trước khi ánh đèn kịp rẽ vào ngõ.", rFail: "Cây trâm gãy trong ổ khóa thứ hai. Ánh đèn đã tới đầu ngõ." }] },
    a3_inf3: { chapter: CH, title: "Trong kho", place: "cave", time: "night", cast: ["shen"],
      text: ["Trong kho chất đầy hòm gỗ: lụa, gấm, ngân phiếu, cả những hòm đóng dấu Đường Môn. Mùi gỗ mục lẫn mùi dầu đồng."],
      choices: [{ t: "Tìm chiếc hòm đóng đinh kín như phu khuân vác tả", check: { stat: "WIS", dc: 16, bonusTrait: { linh_giac: 4 } }, go: "a3_mold", fail: "a3_inf_fight", rOk: "Dưới đáy đống hòm, có một chiếc nhỏ hơn cả, đinh đóng mới, nặng trĩu.", rFail: "Shen lật nhầm một hòm sứ. Tiếng vỡ vang khắp sân sau." }] },
    a3_inf_fight: { chapter: CH, title: "Bị phát hiện", place: "palace", time: "night", cast: ["shen", "de_tu"],
      text: ["Đuốc bùng lên khắp sân. Hai thị vệ phủ Minh chủ lao tới, mũi thương nhắm thẳng yết hầu."],
      fight: { foes: ["thi_ve_phu", "thi_ve_phu"], opts: { canFlee: true }, win: "a3_mold_rush", lose: "a3_inf_lose", tx: "a3_inf_fight" } },
    a3_mold_rush: { chapter: CH, title: "Cướp lấy trong hỗn loạn", place: "cave", time: "night", cast: ["shen"],
      text: ["Thị vệ gục xuống, nhưng tiếng hò hét đã lan khắp phủ. Shen phá cửa kho, lật tung đống hòm, giật lấy chiếc hòm nặng nhất rồi phóng qua tường."],
      onEnter: { flag: "a3_alert" }, choices: [{ t: "Mở hòm", go: "a3_mold" }] },
    a3_inf_lose: { repeat: true, chapter: CH, title: "Tháo chạy", place: "city", time: "night", cast: ["shen"],
      text: ["Shen nhảy xuống sông Tần Hoài, để dòng nước cuốn đi. Lúc bò lên bờ, cậu chỉ còn hơi thở. Đêm khác thử lại vậy."], onEnter: { flag: "a3_alert" }, choices: [{ t: "Về khách điếm", go: "@hub" }] },
    a3_mold: { chapter: CH, title: "Khuôn đồng", place: "cave", time: "night", cast: ["shen"],
      text: [
        "Trong hòm, giữa lớp rơm khô, là một chiếc khuôn đồng to bằng bàn tay người lớn. Mặt khuôn khắc nổi một dấu bàn tay, từng đường chỉ tay, từng vết chai.",
        "Shen đã thấy dấu tay này. Mười năm trước, trên ngực cha cậu, giữa đống tro tàn của Thẩm gia trang. Cả giang hồ gọi nó là Thiên Ma Chưởng.",
        "Kẹp dưới đáy hòm là một trang sổ kho chép tay: \"Thẩm gia trang — khuôn đồng, xuất kho.\"",
        "Hai tay Shen run lên. Không phải vì sợ.",
      ],
      onEnter: { flag: "mold", item: [["khuon_dong", 1], ["so_kho", 1]], quest: { q_khuon: "done" }, exp: 4000, trend: { am: 1 },
        ledger: { actor: "Phủ Minh chủ", action: "Giữ khuôn đồng làm giả dấu Thiên Ma Chưởng, dùng ở Thẩm gia trang", target: "Thẩm gia trang", witness: "Sổ kho phủ Minh chủ", pending: "Bằng chứng chống lại Tạ Thiên Hành", trigger: "Arc 8" } },
      choices: [{ t: "Giấu thật kỹ", go: "@hub" }] },

    /* ---------- Lôi đài ---------- */
    a3_miss: { chapter: CH, title: "Vắng mặt", place: "arena", time: "day", cast: ["shen"],
      text: ["Lôi đài đã gọi tên Shen ba lần. Không ai bước lên. Trọng tài gạch tên cậu khỏi bảng.", "[Shen bị loại khỏi Đại Hội. Mạch điều tra vẫn tiếp tục; chung kết diễn ra ngày A+11.]"],
      onEnter: { flag: "a3_out" }, choices: [{ t: "…", go: "@hub" }] },
    a3_r_lose: { chapter: CH, title: "Bị loại", place: "arena", time: "day", cast: ["shen"],
      text: ["Shen nằm giữa lôi đài, nhìn lên bầu trời Kim Lăng xanh ngắt. Tiếng trống báo kết thúc trận vang lên, khô khốc.", "[Shen bị loại khỏi Đại Hội. Mạch điều tra vẫn tiếp tục; chung kết diễn ra ngày A+11.]"],
      onEnter: { flag: "a3_out" }, choices: [{ t: "Đứng dậy", go: "@hub" }] },
    a3_r1: { chapter: CH, title: "Vòng loại", place: "arena", time: "day", cast: ["shen", "de_tu"],
      text: ["Lôi đài Đại Hội dựng giữa quảng trường trước phủ Minh chủ, rộng mười trượng, viền gỗ sơn son. Bốn phía khán đài kín người.", "Đối thủ đầu tiên là một đệ tử Hoa Sơn, kiếm còn sáng loáng như chưa từng đổ máu.", "[Đơn đấu, không được dùng thuốc, bỏ chạy là nhận thua.]"],
      fight: { foes: ["de_tu_danh_mon"], opts: NO, win: "a3_r1_win", lose: "a3_r_lose", tx: "a3_r1" } },
    a3_r1_win: { chapter: CH, title: "Vượt vòng loại", place: "arena", time: "day", cast: ["shen"],
      text: ["Thanh kiếm Hoa Sơn văng khỏi tay chủ, cắm phập xuống sàn gỗ. Khán đài im lặng một thoáng, rồi ồ lên.", "> Tên Vô Danh kia là ai thế? Tuyệt Mạch mà cũng đánh được à?"],
      onEnter: { flag: "a3_r1", money: 2000, rep: { vo_lam: 20 } }, choices: [{ t: "Bước xuống lôi đài", go: "@hub" }] },
    a3_r2_pre: { chapter: CH, title: "Vòng 16 · Mặt Nạ Sắt", place: "arena", time: "day", cast: ["shen", "hac_y"],
      text: ["Đối thủ vòng 16 đeo mặt nạ sắt kín mặt, tên ghi trên bảng chỉ là \"Mặt Nạ Sắt\". Lúc hắn rút kiếm, Shen nhận ra thế khởi đầu ấy: Thanh Vân Kiếm Pháp, thức thứ nhất."],
      choices: [
        { t: "Giật mặt nạ của hắn giữa lôi đài", req: { noflag: "killed_tieu_hao" }, go: "a3_r2", eff: { flag: "a3_unmask", rep: { huyet_anh: -30, vo_lam: 20 } },
          r: "Shen lướt vào trong tầm kiếm, ngón tay móc vào mép mặt nạ. Tấm sắt rơi xuống sàn. Gương mặt Tiêu Hạo, gầy rộc, đầy sẹo mới, lộ ra trước hàng nghìn người. Cả khán đài nhốn nháo: \"Phản đồ Thanh Vân!\"" },
        { t: "Không nói gì, vào trận", go: "a3_r2" },
      ] },
    a3_r2: { chapter: CH, title: "Vòng 16", place: "arena", time: "day", cast: ["shen", "hac_y"], text: ["Mặt Nạ Sắt lao tới, kiếm pha lẫn Thanh Vân và một thứ gì đó tà dị hơn: kiếm pháp Huyết Ảnh Lâu."],
      fight: { foes: ["mat_na_sat"], opts: NO, win: "a3_r2_win", lose: "a3_r_lose", tx: "a3_r2" } },
    a3_r2_win: { chapter: CH, title: "Ngộ Đạo", place: "arena", time: "dusk", cast: ["shen"],
      text: [
        "Đòn cuối cùng của Shen đánh bật Mặt Nạ Sắt ra khỏi lôi đài. Hắn bò dậy, nhìn cậu qua khe mặt nạ, rồi lẩn vào đám đông.",
        "Đêm ấy, Shen ngồi một mình trên mái khách điếm. Những trận đánh ở Thanh Vân, ở Lạc Hà, ở lôi đài hôm nay cứ chạy qua đầu cậu như một cuộn tranh. Khí Huyết trong Mạch Ẩn bỗng xoay một vòng mới, sâu hơn, rộng hơn.",
        "[Hệ Thống] Ngộ Đạo. Mạch Ẩn khai thông tầng 2. Cánh cửa cảnh giới Nhất Lưu đã mở.",
      ],
      onEnter: { flag: "a3_r2", money: 4000, rep: { vo_lam: 30 }, ownTier: 2, breakTo: "C" }, choices: [{ t: "Thở ra một hơi dài", go: "@hub" }] },
    a3_r3: { chapter: CH, title: "Vòng 8 · Huệ Năng", place: "arena", time: "day", cast: ["shen", "hue_nang"],
      text: ["Huệ Năng, đệ tử Thiếu Lâm, chắp tay niệm Phật rồi mới dựng côn. Cây côn gỗ tử đàn nặng trịch, mỗi lần chạm sàn lại rung cả lôi đài.", "> A Di Đà Phật. Thí chủ ra tay xin đừng lưu tình, tiểu tăng chịu được."],
      onEnter: { meet: "hue_nang" },
      fight: { foes: ["hue_nang"], opts: NO, win: "a3_r3_win", lose: "a3_r_lose", tx: "a3_r3" } },
    a3_r3_win: { chapter: CH, title: "Chân nhân Thanh Hư", place: "temple", time: "dusk", cast: ["shen", "thanh_hu"],
      text: [
        "Huệ Năng chắp tay cúi đầu nhận thua, mỉm cười như vừa được học thêm một bài kinh.",
        "Chiều hôm ấy, một đạo sĩ già râu tóc bạc trắng chờ Shen trước cửa khách điếm. Chân nhân Thanh Hư, trưởng lão Võ Đang.",
        "> Ta đã xem cậu đánh ba trận. Cậu không có nội lực, nhưng khí trong người cậu chảy theo một đường ta chưa từng thấy. Nếu một ngày cậu cần nơi trú chân, Võ Đang mở cửa.",
      ],
      onEnter: { flag: "a3_r3", money: 6000, meet: ["thanh_hu"], aff: { hue_nang: 15, thanh_hu: 15 }, rep: { thieu_lam: 40, vo_dang: 40 } }, choices: [{ t: "Cúi đầu cảm tạ", go: "@hub" }] },
    a3_r4_pre: { chapter: CH, title: "Bán kết", place: "arena", time: "day", cast: ["shen"],
      text: ["Bốc thăm bán kết. Trọng tài mở mảnh giấy, đọc to tên đối thủ của Shen."],
      choices: [
        { t: "Đối thủ: Tô Vân Yên, Nga Mi", hide: true, req: { aff: { to_van_yen: 30 }, alive: "to_van_yen" }, go: "a3_r4_yen" },
        { t: "Đối thủ: Đường Nhất Ảnh, Đường Môn", hide: true, req: { fn: (s) => (s.aff.to_van_yen || 0) < 30 && KM.has(s, "ally_duong") && !KM.has(s, "sect_duong_mon") }, go: "a3_r4_anh" },
        { t: "Đối thủ: Lệnh Hồ Cảnh, Hoa Sơn", hide: true, req: { fn: (s) => (s.aff.to_van_yen || 0) < 30 && !(KM.has(s, "ally_duong") && !KM.has(s, "sect_duong_mon")) }, go: "a3_r4_hs" },
      ] },
    a3_r4_yen: { chapter: CH, title: "Bán kết · Tô Vân Yên", place: "arena", time: "day", cast: ["shen", "to_van_yen"],
      text: ["Tô Vân Yên bước lên lôi đài, áo Nga Mi xám bạc, kiếm buộc dải lụa trắng. Cô nhìn Shen, khẽ cười.", "> Ở Thanh Vân, ngươi còn để ta băng bó cho. Giờ thì phải đánh nhau rồi."],
      choices: [
        { t: "Đánh hết sức", go: "a3_r4_yen_f", r: "\"Vậy thì đánh thật.\" Tô Vân Yên rút kiếm." },
        { t: "Để cô ấy nhường", req: { aff: { to_van_yen: 50 } }, go: "a3_r4_win", eff: { aff: { to_van_yen: 5 } }, r: "Hai người trao nhau mười chiêu, chiêu nào cũng đẹp như múa. Đến chiêu thứ mười một, Tô Vân Yên lùi một bước ra khỏi mép lôi đài, cúi đầu: \"Nga Mi Tô Vân Yên, nhận thua.\" Lúc đi ngang Shen, cô nói khẽ: \"Thắng cho đàng hoàng đấy.\"" },
      ] },
    a3_r4_yen_f: { chapter: CH, title: "Bán kết", place: "arena", time: "day", cast: ["shen", "to_van_yen"], text: ["Kiếm Nga Mi mềm như nước, nhưng nước cũng cắt được đá."], fight: { foes: ["yen_dau"], opts: NO, win: "a3_r4_win", lose: "a3_r_lose", tx: "a3_r4y" } },
    a3_r4_anh: { chapter: CH, title: "Bán kết · Đường Nhất Ảnh", place: "arena", time: "day", cast: ["shen", "duong_nhat_anh"], text: ["Đường Nhất Ảnh phẩy chiếc quạt sắt: \"Ngươi từ chối Đường Môn, thì để ta xem ngươi giỏi tới đâu.\""], fight: { foes: ["anh_dau"], opts: NO, win: "a3_r4_win", lose: "a3_r_lose", tx: "a3_r4a" } },
    a3_r4_hs: { chapter: CH, title: "Bán kết · Lệnh Hồ Cảnh", place: "arena", time: "day", cast: ["shen", "vo_si3"], text: ["Lệnh Hồ Cảnh, đại đệ tử Hoa Sơn, vuốt lưỡi kiếm: \"Sư đệ ta thua ngươi ở vòng loại. Hôm nay ta đòi lại.\""], fight: { foes: ["hoa_son_kk"], opts: NO, win: "a3_r4_win", lose: "a3_r_lose", tx: "a3_r4h" } },
    a3_r4_win: { chapter: CH, title: "Vào chung kết", place: "arena", time: "dusk", cast: ["shen"],
      text: ["Trống trận dồn lên. Tên Shen được viết vào ô cuối cùng trên bảng, đối diện với một cái tên khác: Tạ Vân Phi.", "Con trai Minh chủ. Đệ nhất kiếm khách thiếu niên Trung Nguyên. Chưa từng thua một trận nào."],
      onEnter: { flag: "a3_r4", money: 8000, rep: { vo_lam: 40 }, meet: "ta_van_phi" }, choices: [{ t: "Ngày mai…", go: "@hub" }] },

    a3_final_pre: { chapter: CH, title: "Chung kết", place: "arena", time: "day", cast: ["shen", "ta_van_phi", "ta_thien_hanh"],
      text: [
        "Cả Kim Lăng đổ ra quảng trường. Trên khán đài cao nhất, Tạ Thiên Hành ngồi giữa các chưởng môn, áo trắng như tuyết.",
        "Tạ Vân Phi bước lên lôi đài. Hắn đẹp như tranh, kiếm Lưu Vân bên hông, ánh mắt sạch sẽ của người chưa từng biết mình đang đứng trên đống tro của ai.",
        "> Ta nghe nói cậu tên Vô Danh. Thắng ta xong, cậu sẽ có tên.",
        "Trong ngực áo Shen, chiếc khuôn đồng nặng như một hòn đá." ],
      onEnter: { cond: { req: { noflag: "mold" }, eff: { flag: "mold_lost", quest: { q_khuon: "fail" } }, note: "Không lấy được khuôn đồng trước chung kết. Đêm qua, kho sau phủ Minh chủ bốc mùi đồng chảy." } },
      choices: [
        { t: "Đánh, và thắng", go: "a3_final", r: "Shen rút vũ khí. Tạ Vân Phi khẽ gật đầu, như chào một người ngang hàng." },
        { t: "Đánh, rồi cố ý thua", go: "a3_end_hide", eff: { flag: "threw_final", trend: { am: 2 } }, r: "Đến chiêu thứ hai mươi, Shen để lộ một sơ hở mà người tinh mắt mới thấy. Kiếm Lưu Vân dừng cách cổ cậu một tấc. Cả quảng trường vỗ tay vang dội. Chỉ có Tạ Vân Phi nhìn cậu, không cười." },
        { t: "Giơ khuôn đồng lên giữa lôi đài, vạch mặt Minh chủ", req: { inv: "khuon_dong" }, go: "a3_end_wanted", eff: { moral: 10, trend: { minh: 2 } }, r: "Shen giơ chiếc khuôn đồng lên cao. \"Thiên Ma Chưởng mười năm trước ở Thẩm gia trang, được đúc từ thứ này. Nó nằm trong kho sau phủ Minh chủ!\" Cả quảng trường lặng ngắt như tờ." },
      ] },
    a3_final: { chapter: CH, title: "Chung kết", place: "arena", time: "day", cast: ["shen", "ta_van_phi"], text: ["Kiếm Lưu Vân như mây trôi, không thấy đầu, không thấy cuối."],
      fight: { foes: ["ta_van_phi"], opts: NO, win: "a3_end_fame", lose: "a3_end_lost", tx: "a3_final" } },
    a3_final_watch: { chapter: CH, title: "Chung kết, từ dưới khán đài", place: "arena", time: "day", cast: ["shen", "ta_van_phi"],
      text: ["Shen đứng lẫn trong đám đông. Tạ Vân Phi hạ đối thủ cuối cùng sau ba mươi chiêu, giơ kiếm nhận tràng pháo tay của cả Kim Lăng. Tạ Thiên Hành mỉm cười trên khán đài."],
      onEnter: { place: "kim_lang", cond: { req: { noflag: "mold" }, eff: { flag: "mold_lost", quest: { q_khuon: "fail" } }, note: "Không lấy được khuôn đồng trước chung kết. Đêm qua, kho sau phủ Minh chủ bốc mùi đồng chảy." } },
      choices: [
        { t: "Leo lên lôi đài, giơ khuôn đồng lên vạch mặt Minh chủ", req: { inv: "khuon_dong" }, go: "a3_end_wanted", eff: { moral: 10 } },
        { t: "Lặng lẽ rời quảng trường", go: "a3_end_quiet" },
      ] },

    /* ---------- Ba kết ---------- */
    a3_end_fame: { chapter: CH + " · Kết", title: "Đệ nhất thiếu niên", place: "palace", time: "dusk", cast: ["shen", "ta_thien_hanh", "ta_van_phi"],
      text: [
        "Kiếm Lưu Vân rơi xuống sàn lôi đài. Tạ Vân Phi nhìn bàn tay trống trơn của mình như nhìn một thứ xa lạ.",
        "Tạ Thiên Hành đứng dậy vỗ tay đầu tiên. Ông tự tay cầm thanh Lưu Vân Kiếm, trao cho Shen trước mặt quần hùng.",
        "> Kiếm này theo con ta tám năm. Từ nay nó theo cậu. Nếu cậu muốn, ta nhận cậu làm đệ tử ký danh.",
        "Shen cúi đầu nhận kiếm. Bàn tay trao kiếm ấm áp, vững chãi. Chính bàn tay ấy, mười năm trước, đã ký lệnh xuất kho.",
      ],
      onEnter: { flag: ["a3_fame", "a3_done"], quest: { q_dai_hoi: "done" }, item: ["wc_kiem", 1], money: 30000, exp: 8000, rep: { vo_lam: 200, huyet_anh: -50 }, aff: { ta_van_phi: -10 },
        ledger: { actor: "Shen", action: "Vô địch Đại Hội Thiếu Niên, nhận Lưu Vân Kiếm từ tay Minh chủ", target: "Tạ Vân Phi", witness: "Cả Kim Lăng", pending: "Huyết Ảnh Lâu đặt Shen vào danh sách ám sát", trigger: "Arc 4" } },
      choices: [{ t: "…", go: "a3_after" }] },
    a3_end_hide: { chapter: CH + " · Kết", title: "Á quân", place: "city", time: "dusk", cast: ["shen", "ta_van_phi"],
      text: [
        "Tối hôm ấy, Tạ Vân Phi chặn Shen ở đầu cầu Chu Tước, áo trắng dính đầy bụi đường.",
        "> Ngươi nhường ta. Ta không phải kẻ ngốc. Vì sao?",
        "Gió sông thổi lạnh. Shen nhìn hắn rất lâu.",
      ],
      onEnter: { flag: ["a3_hide", "a3_done"], quest: { q_dai_hoi: "done" }, money: 15000, exp: 6000, rep: { vo_lam: 60 }, meet: "ta_van_phi" },
      choices: [
        { t: "Kể cho hắn nghe về khuôn đồng", req: { inv: "khuon_dong" }, go: "a3_after", eff: { flag: "vanphi_truth", aff: { ta_van_phi: 25 } }, r: "Tạ Vân Phi nghe hết, mặt trắng bệch. Hắn không tin, không thể tin. Nhưng hắn cũng không rút kiếm. \"Nếu ngươi nói dối, ta sẽ giết ngươi. Nếu ngươi nói thật…\" Hắn bỏ đi, không nói hết câu." },
        { t: "\"Vì ta không cần cái tên ấy.\"", go: "a3_after", eff: { aff: { ta_van_phi: 10 } }, r: "Tạ Vân Phi nhíu mày, rồi bật cười, lần đầu tiên cười như một thiếu niên. \"Lần sau gặp lại, đánh thật.\"" },
      ] },
    a3_end_lost: { chapter: CH + " · Kết", title: "Á quân", place: "arena", time: "dusk", cast: ["shen", "ta_van_phi"],
      text: ["Mũi kiếm Lưu Vân dừng trước cổ họng Shen. Tạ Vân Phi thu kiếm, đưa tay kéo cậu dậy.", "> Ngươi đánh không có nội lực mà ép được ta tới chiêu thứ bốn mươi. Lần sau, ta không dám chắc."],
      onEnter: { flag: ["a3_hide", "a3_done"], quest: { q_dai_hoi: "done" }, money: 15000, exp: 6000, rep: { vo_lam: 80 }, aff: { ta_van_phi: 15 } }, choices: [{ t: "Nắm lấy tay hắn", go: "a3_after" }] },
    a3_end_quiet: { chapter: CH + " · Kết", title: "Kẻ vô danh", place: "city", time: "dusk", cast: ["shen"],
      text: ["Không ai nhớ tới cái tên Vô Danh trên bảng đấu. Như thế cũng tốt. Một kẻ không ai để ý thì đi được tới những nơi người khác không vào được."],
      onEnter: { flag: ["a3_hide", "a3_done"], quest: { q_dai_hoi: "fail" }, exp: 4000 }, choices: [{ t: "…", go: "a3_after" }] },
    a3_end_wanted: { chapter: CH + " · Kết", title: "Kẻ vu khống", place: "palace", time: "night", cast: ["shen", "ta_thien_hanh"],
      text: [
        "Sự im lặng kéo dài ba nhịp thở. Rồi Tạ Thiên Hành đứng dậy, giọng vẫn ôn hòa:",
        "> Chiếc khuôn ấy là vật chứng Võ Lâm Minh thu từ Ma Giáo mười năm trước, cất trong kho phủ ta. Đêm qua kho bị trộm. Hóa ra là cậu.",
        "> Bắt lấy kẻ trộm. Đừng làm hắn bị thương, ta muốn hỏi xem ai đứng sau hắn.",
        "Thị vệ ùa lên từ bốn phía. Shen chỉ kịp nhảy khỏi lôi đài, lao vào biển người. Khuôn đồng tuột khỏi tay, rơi vào giữa đám đông.",
      ],
      onEnter: { flag: ["a3_wanted", "a3_done", "wanted", "mold_lost"], take: ["khuon_dong", 1], quest: { q_dai_hoi: "fail" }, exp: 5000, rep: { vo_lam: -300, huyet_anh: -30 }, moral: 5,
        ledger: { actor: "Tạ Thiên Hành", action: "Ra lệnh truy nã Shen vì tội trộm vật chứng", target: "Shen", witness: "Cả Kim Lăng", pending: "Bị truy nã khắp Trung Nguyên", trigger: "Arc 4–8" } },
      choices: [
        { t: "Trốn trong xe tiêu Long Môn", req: { any: ["sect_long_mon", "rescued_phuong"] }, go: "a3_after", r: "Long Chấn Uy giấu Shen dưới đáy một xe hàng lụa. \"Ân cứu con gái ta, hôm nay trả.\" Đoàn xe ra khỏi cổng thành lúc nửa đêm." },
        { t: "Theo cống ngầm của Cái Bang", req: { any: ["sect_cai_bang", "k3_trieu"] }, go: "a3_after", r: "Lão Hồ kéo Shen xuống một nắp cống. Cả hai lội trong bóng tối suốt một canh giờ, chui lên ở bờ sông ngoài thành." },
        { t: "Liều mạng phá vòng vây", go: "a3_after", eff: { trend: { cong: 2 } }, r: "Shen đánh gục ba tên thị vệ, nhảy từ mái nhà này sang mái nhà khác, rồi lao xuống sông Tần Hoài. Lúc nổi lên ngoài thành, người cậu đầy vết thương." },
      ] },
    a3_after: { chapter: CH + " · Kết", title: "Vân Thủy Thành", place: "inn", time: "night", cast: ["shen", "lao_ho"],
      text: [
        "Lão Hồ tìm thấy Shen, như mọi lần, chẳng ai biết bằng cách nào.",
        "> Huyết Ảnh Lâu đặt tổng đàn ở Vân Thủy Thành, Giang Nam, bốn ngày đường về phía nam. Muốn biết ai thuê chúng đốt Thẩm gia trang, phải vào tận ổ.",
        "> Nhưng vào đó rồi thì phải làm sát thủ, thằng ngốc. Ngươi chịu được không?",
        "[Kết thúc Arc 3. Mở Arc 4 · Huyết Ảnh Lâu.]",
      ],
      onEnter: { cond: { req: { flag: "a3_fame" }, note: "Huyết Ảnh Lâu đã biết mặt Shen. Chúng sẽ tự tìm tới." }, fx: (s) => KM.has(s, "brk_C") ? [] : ["Những trận đấu ở Kim Lăng, thắng cũng như thua, đã đủ để Shen Ngộ Đạo."].concat(KM.applyX(s, { breakTo: "C", ownTier: 2 })) },
      choices: [{ t: "Lên đường đi Vân Thủy Thành", go: "a4_road" }, { t: "Ở lại Kim Lăng thêm ít lâu", go: "@hub" }] },

    /* ---------- Kỳ ngộ ---------- */
    a3_kyngo: { chapter: CH + " · Kỳ ngộ", title: "Ván cờ của ông lão bán trà", place: "inn", time: "dusk", cast: ["shen", "ong_lao_tra"],
      text: [
        "Ông lão bán trà bày bàn cờ ra như mọi chiều, nhưng hôm nay ông không đánh một mình. Ông đẩy hộp quân đen sang phía Shen.",
        "> Cậu ngồi xem ta đánh ba hôm rồi. Thử một ván. Thắng, ta dạy cậu một bộ pháp. Thua, cậu trả tiền trà.",
        "Trên bàn cờ, quân trắng đã vây kín ba góc. Chỉ còn một lối thoát, hẹp như kẽ tóc.",
      ],
      choices: [
        { t: "Đặt quân vào chỗ ai cũng bỏ qua", check: { stat: "INT", dc: 15, bonusTrait: { thong_tue: 4 } }, go: "a3_kyngo_win", fail: "a3_kyngo_lose", rOk: "Quân đen lách qua kẽ hở, nối thông hai mảng cờ chết. Ông lão nhìn bàn cờ rất lâu.", rFail: "Quân trắng khép lại. Ông lão cười khà khà, chìa tay đòi tiền trà." },
      ] },
    a3_kyngo_win: { chapter: CH + " · Kỳ ngộ", title: "Vô Tướng Bộ", place: "inn", time: "night", cast: ["shen", "ong_lao_tra"],
      text: ["Ông lão đứng dậy, đi ba bước quanh bàn cờ. Shen chớp mắt: ông đã đứng sau lưng cậu, tay đặt lên vai.", "> Không có tướng, thì không ai bắt được. Nhớ lấy. Ván cờ thật còn dài lắm, cậu bé."],
      onEnter: { flag: "kyngo_a3", skill: "vo_tuong_bo", exp: 3000, aff: { ong_lao_tra: 20 } }, choices: [{ t: "Ngẩng lên thì ông lão đã dọn hàng", go: "@hub" }] },
    a3_kyngo_lose: { repeat: true, chapter: CH + " · Kỳ ngộ", title: "Thua cờ", place: "inn", time: "night", cast: ["shen", "ong_lao_tra"], text: ["> Mai lại tới. Cờ cũng như võ, thua nhiều mới biết đi."], onEnter: { money: -20 }, choices: [{ t: "Về", go: "@hub" }] },
  });

  /* ---------------- Sự kiện theo lịch ---------------- */
  KM.TRIGGERS.push((s) => {
    if (KM.has(s, "a2_done") && !KM.has(s, "a3_start") && s.place === "kim_lang") return "a3_gate";
    if (!A3(s)) return null;
    const d = KM.since(s, "a3"), here = s.place === "kim_lang";
    if (KM.has(s, "a3_out")) return d >= 11 && !KM.has(s, "a3_final_seen") ? (KM.flag(s, "a3_final_seen"), "a3_final_watch") : null;
    if (!KM.has(s, "a3_r1") && d >= 5) return here ? "a3_r1" : "a3_miss";
    if (KM.has(s, "a3_r1") && !KM.has(s, "a3_r2") && d >= 7) return here ? "a3_r2_pre" : "a3_miss";
    if (KM.has(s, "a3_r2") && !KM.has(s, "a3_r3") && d >= 9) return here ? "a3_r3" : "a3_miss";
    if (KM.has(s, "a3_r3") && !KM.has(s, "a3_r4") && d >= 10) return here ? "a3_r4_pre" : "a3_miss";
    if (KM.has(s, "a3_r4") && d >= 11) return here ? "a3_final_pre" : "a3_miss";
    return null;
  });
  // Mang thư mật / sổ sách thì phải giấu ở cổng thành
  const enterBase = KM.enterScene;
  KM.enterScene = function (s, id) { if (id === "a3_gate") { if (s.inv.thu_mat || s.inv.so_sach_giao) KM.flag(s, "has_secret"); } return enterBase(s, id); };

  /* ---------------- Khu tự do ---------------- */
  const roundNote = (s) => {
    if (!A3(s)) return KM.has(s, "a3_wanted") ? "Shen đang bị Võ Lâm Minh truy nã. Kim Lăng không còn an toàn." : "";
    const d = KM.since(s, "a3"), nx = KM.has(s, "a3_out") ? "Đã bị loại. Chung kết ngày " + (s.marks.a3 + 11) + "." : !KM.has(s, "a3_r1") ? "Vòng loại ngày " + (s.marks.a3 + 5) : !KM.has(s, "a3_r2") ? "Vòng 16 ngày " + (s.marks.a3 + 7) : !KM.has(s, "a3_r3") ? "Vòng 8 ngày " + (s.marks.a3 + 9) : !KM.has(s, "a3_r4") ? "Bán kết ngày " + (s.marks.a3 + 10) : "Chung kết ngày " + (s.marks.a3 + 11);
    const nx2 = nx + ".";
    return "Đại Hội Thiếu Niên · ngày thứ " + d + " kể từ khi tới Kim Lăng. " + nx2.replace("..", ".") + " Manh mối nhẫn đồng: " + KM.cnt(s, k3) + "/3" + (KM.has(s, "mold") ? " · đã lấy được khuôn đồng." : ".");
  };
  KM.HUBS.kim_lang = {
    name: "Kim Lăng", place: "city", note: roundNote,
    locs: [
      { id: "khach_diem", name: "Khách điếm Phúc Lai", art: "inn", desc: "Khách điếm sát chợ Đông, đông khách giang hồ.", actions: [
        KM.rest(null, 20),
        { t: "Nghe ngóng tin đồn", run: (s) => {
          if (!once(s, "today_kl_tin")) return R(["Hôm nay chẳng có gì mới."], { free: true });
          const pool = ["Quản gia phủ Minh chủ, lão Triệu Phúc ấy, đêm nào cũng ra kho sau đếm hàng.", "Tiệm cầm đồ Phúc Ký nhận cả đồ của người trong phủ Minh chủ, mà không bao giờ hỏi.", "Ông lão bán trà ngõ Ô Y đánh cờ chưa thua ai. Kỳ lạ là chẳng ai biết ông ở đâu ra.", "Bọn Cẩm Y Ti dạo này lùng sục Ma Giáo khắp thành. Ra đường buổi tối nhớ mang giấy tờ.", "Huyết Ảnh Lâu đóng tổng đàn ở Vân Thủy Thành, Giang Nam. Ai có tiền thì thuê được chúng giết bất cứ ai."];
          return R(["Một khách giang hồ kể: \"" + pool[Math.floor(KM.rand(s) * pool.length)] + "\""].concat(KM.apply(s, { exp: 60 + 10 * s.level })));
        } },
      ] },
      { id: "phu", name: "Phủ Minh chủ", art: "palace", desc: "Phủ đệ của Tạ Thiên Hành. Kho sau nằm ở ngõ phía tây.", actions: [
        KM.storyAct("Đột nhập kho sau phủ Minh chủ", "a3_inf", (s) => night(s) && A3(s) && !KM.has(s, "mold") && KM.cnt(s, k3) >= 2, "cần 2 manh mối · ban đêm"),
        { t: "Đứng nhìn phủ từ xa", show: (s) => day(s), run: (s) => R(["Cổng phủ mở suốt ngày, khách khứa ra vào nườm nượp. Không ai nghĩ trong đó có gì để giấu."].concat(KM.apply(s, { exp: 30 }))) },
      ] },
      { id: "loi_dai", name: "Lôi đài Đại Hội", art: "arena", when: "day", desc: "Lôi đài lớn giữa quảng trường. Ngày thường có lôi đài phụ cho người luyện tay.", actions: [
        { t: "Đấu tập ở lôi đài phụ", sub: "Rank D–C · mỗi ngày một lần", run: (s) => { if (!once(s, "today_kl_ld")) return R(["Hôm nay đã đấu rồi."], { free: true }); return R(["Một thiếu niên giang hồ nhận lời tỉ thí."], { fight: { foes: [s.level >= 22 ? "hoa_son_kk" : "de_tu_danh_mon"], opts: { solo: true, noLoot: true } } }); } },
        { t: "Xem các phái tỉ võ", run: (s) => R(["Shen ngồi trên khán đài cả buổi, nhìn kiếm Hoa Sơn, côn Thiếu Lâm, chưởng Võ Đang. Mỗi thế đều có chỗ hở."].concat(KM.apply(s, { exp: Math.floor(KM.expReq(s.level) * 0.06) + 30, trend: { thu: 1 } }))) },
      ] },
      { id: "cho_dong", name: "Chợ Đông", art: "market", when: "day", desc: "Chợ lớn nhất Kim Lăng.", actions: [
        KM.shopAct("kl_binh_khi"), KM.shopAct("kl_thuoc"), KM.shopAct("kl_cuu_tu"), { t: "Chợ ngựa", cost: 0, run: () => R([], { horses: true }) },
        { t: "Lò rèn (cường hóa)", cost: 0, run: () => R([], { forge: true }) },
        KM.shopAct("kl_tran_bao"),
      ] },
      { id: "phuc_ky", name: "Tiệm cầm đồ Phúc Ký", art: "inn", when: "day", desc: "Tiệm cầm đồ cũ trong ngõ Tam Sơn.", actions: [
        KM.storyAct("Hỏi về chiếc nhẫn đồng", "a3_phuc_ky", (s) => A3(s) && !KM.has(s, "k3_nhan"), "", 1),
      ] },
      { id: "ben_cang", name: "Bến cảng Tần Hoài", art: "river", desc: "Bến cảng ngoài cửa Thủy Tây. Ban đêm nhiều du côn.", actions: [
        KM.storyAct("Hỏi chuyện phu khuân vác", "a3_cang", (s) => A3(s) && !KM.has(s, "k3_cang") && !KM.has(s, "hac_giao_gone"), "", 1),
        KM.storyAct("Tìm Hắc Giao ở cuối bến", "a3_hac_giao", (s) => night(s) && KM.has(s, "hac_giao_gone") && !KM.has(s, "hac_giao2_down"), "Trùm · Rank C · Lv 24", 1),
        KM.huntAct("Dẹp du côn bến cảng", "Rank D–C", [[60, ["du_con"]], [90, ["du_con", "du_con"]], [100, ["cam_y"]]], "Đám du côn bến cảng thấy Shen lạ mặt, kéo nhau ra chặn."),
      ] },
      { id: "mieu", name: "Miếu Thành Hoàng", art: "temple", desc: "Chỗ tụ tập của Cái Bang Kim Lăng.", actions: [
        KM.storyAct("Tìm Cái Bang hỏi tin", "a3_mieu", (s) => A3(s) && !KM.has(s, "k3_trieu"), "", 1),
        { t: "Uống rượu với Lão Hồ", sub: "1 vò Nữ Nhi Hồng hoặc 30 đồng", show: (s) => KM.has(s, "a3_done") && !KM.dead(s, "lao_ho"), run: (s) => {
          if (!once(s, "today_ho")) return R(["Lão Hồ đã say khướt."], { free: true });
          const m = s.inv.nu_nhi_hong ? (KM.apply(s, { take: ["nu_nhi_hong", 1] }), ["Lão Hồ ôm vò Nữ Nhi Hồng, mắt sáng rỡ."]) : KM.apply(s, { money: -Math.min(30, s.money) });
          return R(m.concat(KM.apply(s, { aff: { lao_ho: 5 } })));
        } },
      ] },
      { id: "quan_tra", name: "Quán trà ngõ Ô Y", art: "inn", when: "day", desc: "Quán trà nhỏ của một ông lão mê cờ.", actions: [
        { t: "Uống trà, xem ông lão đánh cờ", sub: "5 đồng", run: (s) => {
          if (!once(s, "today_tra")) return R(["Ông lão đã dọn hàng."], { free: true });
          s.visits.tra = (s.visits.tra || 0) + 1; const m = KM.apply(s, { money: -Math.min(5, s.money), meet: "ong_lao_tra", aff: { ong_lao_tra: 5 } });
          m.push(["Ông lão đánh cờ một mình, tay phải đi quân trắng, tay trái đi quân đen.", "Ông lão nói, mắt không rời bàn cờ: \"Thiên hạ là một bàn cờ. Người giỏi nhất không phải kẻ thắng, mà là kẻ bày ra ván cờ.\"", "Ông lão hỏi Shen về Thanh Vân, về Lạc Hà, như thể ông đã biết hết rồi, chỉ muốn nghe lại."][Math.min(2, s.visits.tra - 1)]);
          return R(m.concat(KM.apply(s, { exp: 40 + 5 * s.level })));
        } },
        KM.storyAct("Đánh cờ với ông lão", "a3_kyngo", (s) => (s.visits.tra || 0) >= 3 && !KM.has(s, "kyngo_a3") && !KM.has(s, "a4_start"), "Kỳ ngộ · kiểm tra Ngộ Tính (INT) độ khó 15", 1),
      ] },
    ],
  };
  KM.HUBS.ngoai_o = {
    name: "Ngoại ô Kim Lăng", place: "village", note: (s) => KM.has(s, "wanted") ? "Lính Cẩm Y ít khi xuống tận đây. Chỗ trốn tạm được." : "",
    locs: [
      { id: "chua", name: "Chùa Thiện Giác", art: "temple", desc: "Ngôi chùa cổ giữa ruộng dâu. Phương trượng Huệ Trì cho khách giang hồ ngủ nhờ.", actions: [
        KM.rest(null, 0, "Ngủ nhờ ở chùa"),
        { t: "▶ Bế quan ngộ đạo", sub: "4 buổi · mở cảnh giới Nhất Lưu nếu chưa Ngộ Đạo", cost: 4, show: (s) => KM.has(s, "a3_start") && !KM.has(s, "brk_C") && KM.since(s, "a3") >= 6, run: (s) => R(["Shen ngồi trước tượng Phật suốt một ngày một đêm. Phương trượng Huệ Trì chỉ nói một câu: \"Võ học cũng như tu hành, chỗ bế tắc nhất là chỗ sắp thông.\""].concat(KM.applyX(s, { ownTier: 2, breakTo: "C", meet: "hue_tri", aff: { hue_tri: 10 } }))) },
        { t: "Nghe Phương trượng giảng kinh", run: (s) => R(["Lời kinh chậm rãi làm tâm Shen lắng xuống."].concat(KM.apply(s, { exp: Math.floor(KM.expReq(s.level) * 0.05) + 30, meet: "hue_tri", aff: { hue_tri: 3 }, trend: { minh: 1 } }))) },
      ] },
      { id: "lo_gach", name: "Lò gạch bỏ hoang", art: "camp", desc: "Thổ phỉ ngoại ô tụ tập ở đây. Đêm có hổ từ đồi xuống.", actions: [
        KM.huntAct("Dẹp thổ phỉ lò gạch", "Rank C", [[70, ["tho_phi_c"]], [92, ["tho_phi_c", "tho_phi_c"]], [100, ["ho_du"]]], "Shen lần vào lò gạch đổ nát."),
        KM.trainAct("Luyện công giữa bãi gạch vụn"),
      ] },
      { id: "ruong", name: "Ruộng dâu", art: "village", when: "day", desc: "Ruộng dâu bạt ngàn, dân quê nuôi tằm dệt lụa cho Kim Lăng.", actions: [
        { t: "Giúp dân hái dâu", run: (s) => R(["Shen hái dâu cả buổi, áo đẫm mồ hôi."].concat(KM.apply(s, { money: 300 + 20 * s.level, exp: Math.floor(KM.expReq(s.level) * 0.04) + 20 }))) },
      ] },
    ],
  };
})(typeof window !== "undefined" ? window : globalThis);
