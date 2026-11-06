/* =====================================================================
   KIẾM MỆNH · ARC 4 — HUYẾT ẢNH LÂU (Vân Thủy Thành) · Rank C → B · Lv 28–40
             ARC 5 — MA GIÁO TÂY VỰC (Lương Châu → Thánh Hỏa Sơn) · Rank B → A · Lv 40–52
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const R = KM.R, night = (s) => s.slot === 2, day = (s) => s.slot <= 1;
  const once = (s, f) => { if (KM.has(s, f)) return false; KM.flag(s, f); return true; };
  const A4 = (s) => KM.has(s, "a4_start") && !KM.has(s, "a4_done");
  const A5 = (s) => KM.has(s, "a5_start") && !KM.has(s, "a5_done");
  const NO = { solo: true, canFlee: false, noItems: true, noLoot: true };
  const C4 = "Arc 4 · Huyết Ảnh Lâu", C5 = "Arc 5 · Ma Giáo Tây Vực";
  const k5 = ["k5_thu", "k5_noi", "k5_trung"];

  Object.assign(KM.SCENES, {
    /* ================= ARC 4 ================= */
    a4_road: { chapter: C4, title: "Xuôi về Giang Nam", place: "road", time: "day", cast: ["shen"],
      text: ["Càng xuống phía nam, núi càng thấp, nước càng nhiều. Ruộng sen nối ruộng sen, mái ngói đen in bóng xuống mặt kênh. Giang Nam đẹp như một giấc mơ, và Huyết Ảnh Lâu ngủ giữa giấc mơ ấy."],
      special: "travel", dest: "van_thuy", go: "a4_arrive" },
    a4_arrive: { chapter: C4, title: "Vân Thủy Thành", place: "town", time: "dusk", cast: ["shen"],
      text: [
        "Vân Thủy Thành nằm bên bờ Tây Hồ, phố xá chằng chịt kênh rạch. Ban ngày người ta bán lụa, bán trà; ban đêm thuyền hoa thắp đèn đỏ dọc mặt hồ.",
        "Thiên Mạc Loát, tiệm vải lớn nhất thành, có một cửa sau không ai dám gõ. Đó là cửa vào Huyết Ảnh Lâu.",
        "[Lộ diện: 0–100. Hành động đáng ngờ làm Lộ diện tăng; nghỉ ở chỗ an toàn làm giảm. Chạm 100 là bị lộ.]",
      ],
      onEnter: { flag: "a4_start", mark: "a4", arc: 4, place: "van_thuy",
        quest: { q_huyet_anh: { name: "Huyết Ảnh Lâu", desc: "Trà trộn vào Lâu, tìm danh sách ám sát mười năm trước trong Tàng Án Các (mở từ ngày A+12). Đêm Huyết Nguyệt (A+18) Lâu chủ trở về, phải thoát trước đó. Lộ diện chạm 100 là bị lộ.", dueDays: 18, dueFrom: "a4" } } },
      choices: [
        { t: "Nhặt tờ thiếp đỏ cắm trên bàn khách điếm", req: { flag: "a3_fame" }, go: "a4_test", r: "Tờ thiếp viết: \"Người thắng Đại Hội, Lâu ta trọng tài. Canh hai, cửa sau Thiên Mạc Loát.\" Chúng đã biết Shen tới từ trước khi cậu bước vào thành." },
        { t: "Tới cửa sau Thiên Mạc Loát xin thi tuyển", req: { flag: "a3_hide" }, go: "a4_test", r: "Người gác cửa nhìn Shen từ đầu tới chân, chẳng nhận ra kẻ á quân Đại Hội. \"Vào đi. Sống qua bài thi thì có cơm ăn.\"" },
        { t: "Bán mình cho Lâu để được che chở", req: { flag: "a3_wanted" }, go: "a4_test", eff: { lo: 30 }, r: "\"Kẻ bị Minh chủ truy nã à? Hay đấy. Lâu ta không hỏi quá khứ, chỉ hỏi ngươi giết được ai.\" Nhưng ánh mắt của chúng không rời khỏi Shen." },
      ] },
    a4_test: { chapter: C4, title: "Bài thi đầu tiên", place: "cave", time: "night", cast: ["shen", "hac_y"],
      text: [
        "Hầm ngầm dưới Thiên Mạc Loát lạnh và ẩm. Một gã đàn ông bị trói vào cột, miệng nhét giẻ, mắt đỏ ngầu.",
        "> Kẻ phản bội, bán tin của Lâu cho Cẩm Y Ti. Giết hắn, ngươi là người của Lâu.",
        "Gã đàn ông lắc đầu điên cuồng. Giẻ tuột ra một nửa: \"Tôi chỉ khuân vải… tôi chỉ khuân vải thôi…\"",
      ],
      choices: [
        { t: "Ra tay", go: "a4_in", eff: { moral: -20, lo: -10, trend: { am: 2 }, ledger: { actor: "Shen", action: "Giết một phu khuân vác để vào Huyết Ảnh Lâu", target: "Phu khuân vác vô danh", witness: "Sát thủ Huyết Ảnh", pending: "—", trigger: "—" } }, r: "Lưỡi dao đi một đường gọn. Những kẻ đứng xem gật đầu hài lòng. Đêm ấy Shen rửa tay rất lâu." },
        { t: "Giả vờ đâm trượt chỗ hiểm, lén cắt dây cho hắn chạy", check: { stat: "AGI", dc: 18, bonusTrait: { anh_tu: 5 } }, go: "a4_in", fail: "a4_in", eff: { moral: 5 }, effFail: { lo: 25 }, rOk: "Máu chảy nhiều, nhưng không trúng tim. Lúc chúng khiêng \"xác\" ra kênh, Shen thấy ngón tay gã khẽ động đậy.", rFail: "Gã khuân vác bỏ chạy quá sớm. Một mũi tiêu bay theo, nhưng hắn đã nhảy xuống kênh. Mấy cặp mắt quay sang Shen." },
        { t: "\"Ta giết kẻ đáng giết, không giết người khuân vải.\"", go: "a4_in", eff: { lo: 20, moral: 10, trend: { minh: 2 } }, r: "Gian hầm im lặng. Rồi một giọng đàn bà cười khẽ từ trong bóng tối: \"Có khí phách. Cho nó vào. Nhưng để mắt tới nó.\"" },
      ] },
    a4_in: { chapter: C4, title: "Người của Lâu", place: "cave", time: "night", cast: ["shen"],
      text: [
        "Shen nhận một chiếc nhẫn đồng hình giọt máu, y hệt chiếc cậu mang theo từ Thanh Vân.",
        "Luật của Lâu: nhận hợp đồng ở Thiên Mạc Loát, làm xong thì lấy tiền. Không hỏi ai thuê. Không hỏi vì sao. Kẻ hỏi nhiều thì thành mục tiêu của hợp đồng tiếp theo.",
        "[Hợp đồng mở dần mỗi hai ngày. Sinh Tử Quan ngày A+8. Tàng Án Các mở từ ngày A+12.]",
      ],
      onEnter: { flag: "a4_in" }, special: "hub", hub: "van_thuy" },

    /* ---------- Sáu hợp đồng ---------- */
    a4_hd1: { chapter: C4, title: "Hợp đồng thứ nhất · Hồ Tam", place: "river", time: "night", cast: ["shen"],
      text: ["Mục tiêu: Hồ Tam, chủ thuyền buôn ở bến Đông. Người thuê: không rõ.", "Shen theo dõi hắn hai đêm. Dưới khoang thuyền của Hồ Tam là mười mấy đứa trẻ bị xích, chờ bán sang xứ khác."],
      choices: [
        { t: "Làm thật. Kẻ này đáng chết", go: "a4_hd1_f", r: "Shen nhảy lên thuyền. Hai tên hộ vệ rút đao chắn trước cửa khoang." },
        { t: "Phá xích thả bọn trẻ, để Hồ Tam sống", go: "a4_hd_done", eff: { flag: "hd1", lo: 15, moral: 15, rep: { huyet_anh: -10 } }, r: "Bọn trẻ chạy tán loạn trong đêm. Hồ Tam sống, nhưng Lâu sẽ hỏi vì sao mục tiêu còn thở." },
      ] },
    a4_hd1_f: { chapter: C4, title: "Thuyền buôn người", place: "river", time: "night", cast: ["shen", "tieu_dau"], text: ["Hộ vệ của Hồ Tam đánh liều mạng."], fight: { foes: ["ho_ve", "ho_ve"], opts: { canFlee: false }, win: "a4_hd1_win", lose: "a4_hd_fail", tx: "a4_hd1" } },
    a4_hd1_win: { chapter: C4, title: "Hợp đồng hoàn thành", place: "river", time: "night", cast: ["shen"], text: ["Hồ Tam chết trên boong thuyền của chính hắn. Shen phá xích, thả bọn trẻ đi trước khi trời sáng."], onEnter: { flag: "hd1", lo: -5, moral: 10, money: 8000 }, choices: [{ t: "Về Lâu nhận tiền", go: "@hub" }] },
    a4_hd2: { chapter: C4, title: "Hợp đồng thứ hai · Lưu tri phủ", place: "palace", time: "night", cast: ["shen"],
      text: ["Mục tiêu: Lưu tri phủ, quan coi kho lương Vân Thủy. Hắn ăn bớt lương cứu đói ba năm liền, người chết đói ngoài thành không đếm xuể."],
      choices: [
        { t: "Làm thật", go: "a4_hd2_f" },
        { t: "Đặt dao lên cổ hắn, bắt hắn mở kho phát lương rồi cút khỏi thành", check: { stat: "WIS", dc: 18 }, go: "a4_hd_done", fail: "a4_hd2_f", effOk: { flag: "hd2", moral: 10, money: 5000 }, rOk: "Sáng hôm sau, kho lương mở. Lưu tri phủ biến mất cùng một cỗ xe. Lâu nhận được \"tin hắn chết đuối\".", rFail: "Lưu tri phủ hét lên. Hộ vệ ập vào." },
        { t: "Từ chối", go: "a4_hd_done", eff: { flag: "hd2", lo: 15 } },
      ] },
    a4_hd2_f: { chapter: C4, title: "Phủ tri phủ", place: "palace", time: "night", cast: ["shen", "tieu_dau"], text: ["Hộ vệ phủ tri phủ chặn ở hành lang."], fight: { foes: ["ho_ve", "ho_ve"], opts: { canFlee: true }, win: "a4_hd2_win", lose: "a4_hd_fail", tx: "a4_hd2" } },
    a4_hd2_win: { chapter: C4, title: "Hợp đồng hoàn thành", place: "palace", time: "night", cast: ["shen"], text: ["Lưu tri phủ chết trong thư phòng, giữa những rương bạc chưa kịp chở đi."], onEnter: { flag: "hd2", lo: -5, money: 10000 }, choices: [{ t: "Về Lâu", go: "@hub" }] },
    a4_hd3: { chapter: C4, title: "Hợp đồng thứ ba · Lương y Bạch Thuật", place: "medic", time: "day", cast: ["shen", "lang_trung"],
      text: ["Mục tiêu: Bạch Thuật, lương y ở ngõ Hạnh Lâm. Ông chữa bệnh không lấy tiền của người nghèo. Lý do bị thuê giết: không ghi.", "Ông đang bốc thuốc cho một bà cụ khi Shen bước vào. Ông nhìn chiếc nhẫn đồng trên tay cậu, rồi tiếp tục cân thuốc, tay không run."],
      choices: [
        { t: "Ra tay", go: "a4_hd_done", eff: { flag: "hd3", moral: -30, lo: -10, money: 6000, trend: { am: 2 }, ledger: { actor: "Shen", action: "Giết lương y Bạch Thuật theo hợp đồng Huyết Ảnh", target: "Bạch Thuật", witness: "Bà cụ bốc thuốc", pending: "—", trigger: "—" } }, r: "Bạch Thuật gói xong thang thuốc cuối cùng, đưa cho bà cụ, rồi mới nhắm mắt. Ông không chống cự." },
        { t: "Dàn cảnh giả chết, giấu ông khỏi thành", check: { stat: "INT", dc: 18 }, go: "a4_hd_done", fail: "a4_hd_done", eff: { flag: "hd3", moral: 10 }, effOk: { lo: 5 }, effFail: { lo: 30 }, rOk: "Một cái xác chết đuối mặc áo Bạch Thuật trôi trên kênh. Người thật đã lên thuyền xuôi về phương nam. Lâu không nghi ngờ gì.", rFail: "Kế hoạch lộ một chỗ hở: có người thấy Bạch Thuật lên thuyền. Lộ diện +30." },
        { t: "Báo cho ông trốn đi", go: "a4_hd_done", eff: { flag: "hd3", lo: 20, moral: 10 }, r: "Bạch Thuật cúi đầu cảm ơn, dặn Shen một câu: \"Kẻ thuê giết ta là người ta đã chữa vết thương cho, mười năm trước. Vết bỏng ở bàn tay phải.\"" },
      ] },
    a4_hd4: { chapter: C4, title: "Hợp đồng thứ tư · Hổ Uy Tiêu Cục", place: "yard2", time: "day", cast: ["shen", "tieu_dau"],
      text: ["Mục tiêu: tổng tiêu đầu Hổ Uy Tiêu Cục, đối thủ làm ăn của Long Môn ở Giang Nam. Người thuê trả gấp đôi giá thường."],
      choices: [
        { t: "Làm thật", go: "a4_hd4_f", eff: { moral: -10 } },
        { t: "Đánh phế tay hắn, để hắn bỏ nghề", go: "a4_hd4_f", eff: { flag: "hd4_spare" } },
        { t: "Từ chối", go: "a4_hd_done", eff: { flag: "hd4", lo: 15 } },
      ] },
    a4_hd4_f: { chapter: C4, title: "Hổ Uy Tiêu Cục", place: "yard2", time: "day", cast: ["shen", "tieu_dau"], text: ["Tổng tiêu đầu cầm đao ra sân, hai đệ tử theo sau."], fight: { foes: ["thiet_dien"], opts: { canFlee: true }, win: "a4_hd4_win", lose: "a4_hd_fail", tx: "a4_hd4" } },
    a4_hd4_win: { chapter: C4, title: "Hợp đồng hoàn thành", place: "yard2", time: "day", cast: ["shen"], text: ["Hổ Uy Tiêu Cục đóng cửa từ hôm ấy."], onEnter: { flag: "hd4", lo: -5, money: 15000, rep: { long_mon: 20 } }, choices: [{ t: "Về Lâu", go: "@hub" }] },
    a4_hd5: { chapter: C4, title: "Hợp đồng thứ năm · Mật thám", place: "town", time: "night", cast: ["shen"],
      text: ["Mục tiêu: một mật thám Cẩm Y Ti cài vào Lâu từ ba năm trước. Hắn đã gửi đi một bức thư nói về \"kẻ mới tới tên Vô Danh\". Nếu bức thư thứ hai đi được, Shen sẽ bị lộ cùng với hắn."],
      choices: [
        { t: "Chặn đường hắn", go: "a4_hd5_f" },
        { t: "Tha cho hắn, đổi lấy lời hứa im lặng", go: "a4_hd_done", eff: { flag: ["hd5", "cam_y_friend"], lo: 20, moral: 5 }, r: "Mật thám nhìn Shen rất lâu. \"Ngươi cũng không phải người của Lâu.\" Hắn để lại một lệnh bài: \"Sau này cần, Cẩm Y Ti nợ ngươi một lần.\"" },
      ] },
    a4_hd5_f: { chapter: C4, title: "Ngõ tối", place: "town", time: "night", cast: ["shen", "hac_y"], text: ["Mật thám rút kiếm. Hắn đánh như một kẻ biết mình không còn đường lui."], fight: { foes: ["huyet_ve"], opts: { canFlee: false }, win: "a4_hd5_win", lose: "a4_hd_fail", tx: "a4_hd5" } },
    a4_hd5_win: { chapter: C4, title: "Hợp đồng hoàn thành", place: "town", time: "night", cast: ["shen"], text: ["Bức thư thứ hai cháy thành tro trong lòng bàn tay Shen."], onEnter: { flag: "hd5", lo: -15, money: 12000 }, choices: [{ t: "Về Lâu", go: "@hub" }] },

    a4_hd6: { chapter: C4, title: "Hợp đồng thứ sáu · Tô Vân Yên", place: "medic", time: "day", cast: ["shen", "to_van_yen"],
      text: [
        "Tờ hợp đồng thứ sáu chỉ có một cái tên. Shen đọc ba lần.",
        "Mục tiêu: Tô Vân Yên, đệ tử Nga Mi, đang hành y ở Vân Thủy. Lý do: đã chữa trị cho một nhân chứng của \"việc cũ\". Thời hạn: ba ngày.",
        "Y quán ở cuối ngõ Hạnh Lâm. Qua khung cửa sổ, Tô Vân Yên đang băng bó cho một đứa bé bị bỏng, vừa băng vừa kể chuyện cười cho nó khỏi khóc.",
        "Liên Nhi đứng sau lưng Shen. Lâu đã cử cô theo dõi hợp đồng này.",
      ],
      choices: [
        { t: "Giết cô ấy", go: "a4_yen_kill", eff: { trend: { am: 3 } }, r: "Shen bước vào y quán. Tô Vân Yên ngẩng lên, mỉm cười như ở Thanh Vân, rồi thấy chiếc nhẫn đồng trên tay cậu. Nụ cười tắt dần." },
        { t: "Báo cho cô ấy trốn khỏi thành", go: "a4_hd_done", eff: { flag: ["hd6", "yen_warned"], lo: 25, aff: { to_van_yen: 15 } }, r: "Shen đặt mảnh hợp đồng lên bàn thuốc. Tô Vân Yên đọc, mặt tái đi, rồi nắm chặt tay cậu: \"Còn ngươi thì sao?\" Đêm ấy cô rời Vân Thủy bằng thuyền đánh cá. Liên Nhi nhìn thấy hết, nhưng không nói gì." },
        { t: "Dàn cảnh giả chết cho cô ấy", req: { aff: { to_van_yen: 40 } }, check: { stat: "INT", dc: 20, bonusTrait: { thong_tue: 4 } }, go: "a4_hd_done", fail: "a4_hd_done", eff: { flag: ["hd6", "yen_fake_dead"], aff: { to_van_yen: 10 } }, effOk: { lo: -10, aff: { to_van_yen: 10 } }, effFail: { lo: 35 },
          rOk: "Tô Vân Yên tự pha một thang Quy Tức Tán, ngủ say như chết suốt hai ngày. Lâu nhận được \"xác\" của cô trong quan tài gỗ mỏng, đóng đinh kín. Nửa đêm, Shen cạy nắp quan tài đưa cô ra khỏi thành.", rFail: "Thuốc ngấm chậm hơn tính toán. Liên Nhi thấy ngón tay \"xác chết\" cử động, và nhìn Shen rất lâu." },
        { t: "Từ chối hợp đồng", go: "a4_hd_done", eff: { flag: "hd6", lo: 30 }, r: "Shen trả tờ hợp đồng lại. Người đưa hợp đồng không nói gì, chỉ ghi một dấu chấm đỏ cạnh tên cậu trong sổ." },
      ] },
    a4_yen_kill: { chapter: C4, title: "Y quán ngõ Hạnh Lâm", place: "medic", time: "day", cast: ["shen", "to_van_yen"],
      text: ["> Hóa ra là vậy. — Tô Vân Yên đặt cuộn băng xuống, bảo đứa bé ra ngoài chơi. — Ta đã băng cho ngươi bao nhiêu lần ở Thanh Vân, Shen?", "Cô rút kiếm. Tay cô không run, nhưng mắt thì đỏ."],
      fight: { foes: ["yen_dau"], opts: { canFlee: true, noLoot: true }, win: "a4_yen_dead", lose: "a4_yen_flee", tx: "a4_yen_kill" } },
    a4_yen_dead: { chapter: C4, title: "Hợp đồng hoàn thành", place: "medic", time: "dusk", cast: ["shen"],
      text: [
        "Tô Vân Yên ngã xuống giữa những bó thuốc phơi dở. Trước khi tắt thở, cô nắm lấy vạt áo Shen, như muốn nói điều gì đó, rồi thôi.",
        "Đứa bé bị bỏng đứng ở ngưỡng cửa, nhìn.",
        "Đêm ấy Lâu thưởng Shen một túi vàng. Liên Nhi không nhìn cậu suốt bữa rượu.",
      ],
      onEnter: { flag: "hd6", die: { n: "to_van_yen", actor: "Shen", action: "Giết Tô Vân Yên theo hợp đồng thứ sáu của Huyết Ảnh Lâu", witness: "Một đứa bé, Liên Nhi", note: "Nga Mi sẽ không bao giờ tha thứ." }, moral: -80, lo: -30, money: 50000, rep: { nga_mi: -300, huyet_anh: 50 }, aff: { lien_nhi: -15 } },
      choices: [{ t: "…", go: "@hub" }] },
    a4_yen_flee: { chapter: C4, title: "Cô ấy chạy thoát", place: "medic", time: "dusk", cast: ["shen"],
      text: ["Một nhát kiếm Nga Mi rạch ngang ngực Shen. Khi cậu đứng dậy được, y quán đã trống trơn. Tô Vân Yên biến mất, và cô sẽ không bao giờ tin cậu nữa."],
      onEnter: { flag: "hd6", lo: 30, aff: { to_van_yen: -100 }, rep: { nga_mi: -100 } }, choices: [{ t: "…", go: "@hub" }] },
    a4_hd_done: { chapter: C4, title: "Hợp đồng", place: "cave", time: "night", cast: ["shen"], text: ["Shen trở về Thiên Mạc Loát. Sổ hợp đồng ghi thêm một dòng."], choices: [{ t: "…", go: "@hub" }] },
    a4_hd_fail: { repeat: true, chapter: C4, title: "Thất bại", place: "town", time: "night", cast: ["shen"], text: ["Mục tiêu trốn thoát. Lâu không trả tiền cho kẻ thất bại, và ghi nhớ."], onEnter: { lo: 10 }, choices: [{ t: "…", go: "@hub" }] },

    /* ---------- Liên Nhi ---------- */
    a4_lien: { chapter: C4, title: "Liên Nhi", place: "river", time: "night", cast: ["shen", "lien_nhi"],
      text: [
        "Liên Nhi ngồi trên mũi thuyền, chân thả xuống nước Tây Hồ. Cô mười sáu tuổi, giết người từ năm mười hai.",
        "> Lâu giao ta theo dõi ngươi. Ngươi biết rồi chứ?",
        "> Ta không nhớ cha mẹ ta là ai. Chỉ nhớ một trận cháy lớn, ai đó bế ta chạy qua lửa. Trên tay người đó có một vết bỏng hình bàn tay.",
      ],
      onEnter: { flag: "lien_talk", aff: { lien_nhi: 5 } },
      choices: [{ t: "Không nói gì, ngồi xuống cạnh cô", go: "@hub", eff: { aff: { lien_nhi: 5 } } }, { t: "\"Trận cháy ấy ở đâu?\"", go: "@hub", eff: { aff: { lien_nhi: 3 } }, r: "Liên Nhi lắc đầu. \"Một trang viện lớn, có cây ngô đồng trước cổng.\" Thẩm gia trang có cây ngô đồng trước cổng." }] },

    /* ---------- Sinh Tử Quan ---------- */
    a4_sinh_tu: { chapter: C4, title: "Huyết Ảnh Thí Luyện", place: "cave", time: "night", cast: ["shen", "hac_y"],
      text: ["Đấu trường dưới lòng đất, vách đá loang máu cũ. Ai muốn lên làm sát thủ chính thức phải vượt Sinh Tử Quan: đấu với một trong Thất Sát, không thuốc, không đường lui.", "[Sinh Tử Quan: thắng để đột phá cảnh giới Tuyệt Đỉnh (Rank B). Thua thì nghỉ 3 ngày rồi thử lại.]"],
      fight: { foes: ["that_sat"], opts: NO, win: "a4_sinh_tu_win", lose: "a4_sinh_tu_lose" } },
    a4_sinh_tu_win: { chapter: C4, title: "Tuyệt Đỉnh", place: "cave", time: "night", cast: ["shen"],
      text: ["Thất Sát quỳ xuống, máu chảy từ khóe miệng. Cả đấu trường im phăng phắc.", "Trong lồng ngực Shen, Khí Huyết sôi lên như nước sắp tràn bờ, rồi tìm được một lối mới, lặng lẽ chảy vào tầng thứ ba của Mạch Ẩn.", "[Hệ Thống] Vượt Sinh Tử Quan. Mạch Ẩn tầng 3."],
      onEnter: { flag: "a4_st_done", ownTier: 3, breakTo: "B", exp: 15000, money: 20000, rep: { huyet_anh: 30 } }, choices: [{ t: "Đứng dậy", go: "@hub" }] },
    a4_sinh_tu_lose: { repeat: true, chapter: C4, title: "Chưa qua", place: "cave", time: "night", cast: ["shen"], text: ["Shen tỉnh dậy trong căn phòng đá, toàn thân băng kín. \"Ba ngày nữa, nếu còn muốn chết thì quay lại.\""], onEnter: { flag: "a4_st_fail", mark: "a4st" }, choices: [{ t: "…", go: "@hub" }] },

    /* ---------- Tàng Án Các ---------- */
    a4_tang: { chapter: C4, title: "Tàng Án Các", place: "cave", time: "night", cast: ["shen"],
      text: ["Tàng Án Các là gian đá sâu nhất dưới Thiên Mạc Loát, nơi Lâu cất hồ sơ mọi hợp đồng ba mươi năm. Chìa khóa nằm trong phòng Phó lâu chủ Quỷ Ảnh. Thiết Diện, cận vệ của hắn, canh cửa suốt đêm."],
      choices: [
        { t: "Lẻn vào phòng Quỷ Ảnh lấy trộm chìa khóa", check: { stat: "AGI", dc: 20, bonusTrait: { anh_tu: 5 } }, go: "a4_list", fail: "a4_tang_f", rOk: "Shen trườn qua xà nhà, móc chùm chìa khóa khỏi đai lưng treo trên ghế. Quỷ Ảnh trở mình trong giấc ngủ.", rFail: "Một tấm ván kêu cót két. Thiết Diện quay phắt lại." },
        { t: "Nhờ Liên Nhi đánh lạc hướng Thiết Diện", req: { aff: { lien_nhi: 40 }, alive: "lien_nhi" }, go: "a4_list", eff: { flag: "lien_helped", aff: { lien_nhi: 5 } }, r: "Liên Nhi bước tới, giả say, ngã vào người Thiết Diện. Hắn chửi rủa, kéo cô đi. Cửa Tàng Án Các bỏ trống một khắc." },
        { t: "Đánh thẳng qua Thiết Diện", go: "a4_tang_f" },
      ] },
    a4_tang_f: { chapter: C4, title: "Thiết Diện", place: "cave", time: "night", cast: ["shen", "dau_muc"], text: ["Thiết Diện rút đao, mặt nạ sắt lạnh tanh."], fight: { foes: ["thiet_dien"], opts: { canFlee: true }, win: "a4_list_hot", lose: "a4_tang_lose", tx: "a4_tang_f" } },
    a4_tang_lose: { repeat: true, chapter: C4, title: "Bị đuổi ra", place: "cave", time: "night", cast: ["shen"], text: ["Shen lăn ra khỏi hành lang trước khi lưỡi đao kịp hạ xuống. Thiết Diện không đuổi theo, nhưng hắn đã nhìn thấy mặt cậu."], onEnter: { lo: 20 }, choices: [{ t: "…", go: "@hub" }] },
    a4_list_hot: { chapter: C4, title: "Phá cửa", place: "cave", time: "night", cast: ["shen"], text: ["Thiết Diện gục xuống. Không còn thời gian để làm khéo. Shen đạp tung cửa Tàng Án Các."], onEnter: { lo: 20 }, choices: [{ t: "Lục hồ sơ", go: "a4_list" }] },
    a4_list: { chapter: C4, title: "Danh sách mười năm trước", place: "cave", time: "night", cast: ["shen"],
      text: [
        "Hồ sơ năm Giáp Ngọ nằm ở ngăn trên cùng, bụi phủ dày một lớp. Shen rút ra một tờ giấy mỏng.",
        "\"Thẩm gia trang. Người thuê: phủ Minh chủ. Người đổ tội: Thiên Ma Giáo. Tiền công: ba vạn lượng. Đã hoàn thành.\"",
        "Bên dưới, đóng một con dấu đỏ: ấn tín phủ Minh chủ Võ Lâm.",
      ],
      onEnter: { flag: "a4_list", item: ["danh_sach", 1], lo: 40, exp: 12000, quest: { q_huyet_anh: "done" },
        ledger: { actor: "Phủ Minh chủ", action: "Thuê Huyết Ảnh Lâu thảm sát Thẩm gia trang, đổ tội cho Thiên Ma Giáo", target: "Thẩm gia trang", witness: "Hồ sơ Tàng Án Các", pending: "Phải tới được tay Ma Giáo hoặc các phái", trigger: "Arc 5 · Arc 8" } },
      choices: [{ t: "Nhét vào ngực áo", go: "@hub" }] },

    /* ---------- Quỷ Ảnh ---------- */
    a4_quy_anh: { chapter: C4, title: "Phó lâu chủ Quỷ Ảnh", place: "river", time: "night", cast: ["shen", "quy_anh", "lien_nhi"],
      text: ["Quỷ Ảnh đứng trên mũi thuyền giữa Tây Hồ, một tay túm tóc Liên Nhi, lưỡi kiếm kề cổ cô.", "> Ta biết có chuột trong Lâu. Ta chỉ không ngờ con chuột lại thân với con mèo nhỏ của ta. Ra đây, Vô Danh. Hoặc ta cắt cổ nó."],
      onEnter: { meet: ["quy_anh", "lien_nhi"] },
      fight: { foes: ["quy_anh"], opts: { canFlee: false }, win: "a4_lien_choice", lose: "a4_quy_lose", tx: "a4_quy_anh" } },
    a4_quy_lose: { chapter: C4, title: "Mất cô ấy", place: "river", time: "night", cast: ["shen"],
      text: ["Shen rơi xuống hồ. Lúc trồi lên, cậu chỉ kịp thấy lưỡi kiếm của Quỷ Ảnh hạ xuống, và một bóng áo hồng nhỏ bé đổ sụp trên mũi thuyền.", "Quỷ Ảnh biến mất vào sương đêm."],
      onEnter: { flag: "quy_anh_done", die: { n: "lien_nhi", actor: "Quỷ Ảnh", action: "Giết Liên Nhi trên Tây Hồ", witness: "Shen", note: "Cô chết mà chưa biết cha mẹ mình là ai." }, lo: 30 }, choices: [{ t: "…", go: "@hub" }] },
    a4_lien_choice: { chapter: C4, title: "Liên Nhi", place: "river", time: "night", cast: ["shen", "lien_nhi"],
      text: ["Quỷ Ảnh rơi xuống hồ, không nổi lên nữa. Liên Nhi ngồi bệt trên boong thuyền, cổ rướm máu, tay vẫn cầm thanh đoản kiếm.", "> Ngươi biết ta là người Lâu cử theo dõi ngươi. Ngươi biết ta đã báo cáo mọi thứ. Giờ ngươi định làm gì ta?"],
      onEnter: { flag: "quy_anh_done", exp: 20000, money: 30000, rep: { huyet_anh: -100 } },
      choices: [
        { t: "Giết cô, không để lại nhân chứng", go: "@hub", eff: { die: { n: "lien_nhi", actor: "Shen", action: "Giết Liên Nhi để bịt đầu mối", witness: "—", note: "" }, moral: -30, lo: -20, trend: { am: 2 } }, r: "Liên Nhi không chạy. Có lẽ cô đã biết trước." },
        { t: "Tha cho cô đi", go: "@hub", eff: { flag: "lien_spared", moral: 10, aff: { lien_nhi: 15 } }, r: "Liên Nhi nhìn Shen như nhìn một kẻ ngốc, rồi nhảy xuống thuyền nhỏ, chèo vào sương. \"Nợ ngươi một mạng. Ta không thích nợ ai.\"" },
        { t: "Tha cho cô, và kể cho cô nghe về cây ngô đồng trước cổng Thẩm gia trang", req: { aff: { lien_nhi: 60 } }, go: "@hub", eff: { flag: ["lien_spared", "lien_witness"], moral: 15, aff: { lien_nhi: 20 },
          ledger: { actor: "Liên Nhi", action: "Là đứa bé được cứu khỏi đám cháy Thẩm gia trang", target: "—", witness: "Shen", pending: "Nhân chứng sống thứ hai của vụ thảm sát", trigger: "Arc 8" } },
          r: "Liên Nhi im lặng rất lâu. Rồi cô khóc, lần đầu tiên từ năm mười hai tuổi. \"Người bế ta chạy qua lửa… có vết bỏng ở tay. Ta nhớ mặt người đó. Nếu có ngày ngươi cần ta nói ra trước thiên hạ, ta sẽ nói.\"" },
      ] },

    /* ---------- Đêm Huyết Nguyệt ---------- */
    a4_blood_moon: { chapter: C4 + " · Kết", title: "Đêm Huyết Nguyệt", place: "town", time: "night", cast: ["shen", "huyet_y"],
      text: [
        "Trăng đêm nay đỏ như máu. Cả Vân Thủy Thành tắt đèn sớm.",
        "Lâu chủ Huyết Y đã trở về. Người ta chỉ thấy một vạt áo đỏ lướt trên mái ngói, và tiếng chuông đồng của Lâu gõ chín tiếng: tìm kẻ phản bội.",
        "Shen phải ra khỏi thành ngay đêm nay.",
      ],
      onEnter: { place: "van_thuy", cond: { req: { noflag: "a4_list" }, eff: { flag: "no_list", quest: { q_huyet_anh: "fail" } }, note: "Không lấy được danh sách trước đêm Huyết Nguyệt. Shen chỉ còn lời kể để thuyết phục người khác." } },
      choices: [
        { t: "Theo Liên Nhi qua đường hầm dưới hồ", req: { flag: "lien_spared", alive: "lien_nhi" }, go: "a4_end", r: "Một bàn tay nhỏ kéo Shen vào bóng tối. \"Ta đã bảo là không thích nợ ai.\" Đường hầm dưới đáy Tây Hồ dẫn thẳng ra ngoài thành." },
        { t: "Đi theo bóng người đeo mặt nạ sắt", req: { flag: "a3_unmask", noflag: "killed_tieu_hao" }, go: "a4_end", eff: { flag: "tieu_hao_freed" }, r: "Tiêu Hạo chặn đường đám truy binh, kiếm Thanh Vân loang loáng dưới trăng đỏ. \"Đi đi. Ta nợ Thanh Vân một mạng, coi như trả cho ngươi.\"" },
        { t: "Lên thuyền của Đường Môn", req: { any: ["sect_duong_mon", "ally_duong"], alive: "duong_nhat_anh" }, go: "a4_end", r: "Đường Nhất Ảnh tung một nắm Tán Hoa Châm về phía truy binh, kéo Shen lên thuyền. \"Đường Môn không để bạn mình chết ở Giang Nam.\"" },
        { t: "Chui vào cống ngầm cùng đám ăn mày", req: { flag: "sect_cai_bang" }, go: "a4_end", r: "Một đứa ăn mày nhỏ huýt sáo. Cả một đàn ăn mày ùa ra phố, chặn ngang đường truy binh." },
        { t: "Một mình phá vòng vây", check: { stat: "AGI", dc: 22, bonusTrait: { anh_tu: 5 } }, go: "a4_end", fail: "a4_escape_hurt", rOk: "Shen chạy trên mái ngói suốt nửa đêm, bỏ lại tiếng chuông đồng sau lưng.", rFail: "Một vạt áo đỏ lướt qua. Shen chỉ thấy đau nhói sau lưng, rồi cả người rơi xuống kênh." },
      ] },
    a4_escape_hurt: { chapter: C4 + " · Kết", title: "Thoát chết", place: "river", time: "night", cast: ["shen"], text: ["Shen trôi theo dòng kênh ra khỏi thành, tỉnh dậy trên bãi sậy. Túi tiền đã mất một nửa, lưng còn in vết kiếm của Huyết Y."],
      onEnter: { moneyPct: -0.5 }, choices: [{ t: "Gượng dậy", go: "a4_end", eff: { trend: { thu: 1 } } }] },
    a4_exposed: { chapter: C4, title: "Bị lộ", place: "town", time: "night", cast: ["shen", "hac_y"],
      text: ["Chuông đồng của Lâu gõ chín tiếng giữa ban ngày. Lộ diện đã chạm đáy: Lâu biết Shen là ai.", "Hai huyết vệ chặn đầu ngõ."],
      onEnter: { flag: "a4_exposed_seen" },
      fight: { foes: ["huyet_ve", "huyet_ve"], opts: { canFlee: true }, win: "a4_blood_moon", lose: "a4_blood_moon", tx: "a4_exposed" } },
    a4_end: { chapter: C4 + " · Kết", title: "Tây Vực", place: "road", time: "day", cast: ["shen", "lao_ho"],
      text: [
        "Bình minh trên đường quan phía bắc Vân Thủy. Lão Hồ ngồi đợi ở quán nước đầu đường, như thể đã biết trước.",
        "> Ma Giáo bị đổ tội mười năm. Kẻ duy nhất muốn biết sự thật hơn ngươi là Giáo chủ Dạ Vô Thương. Lão ở Thánh Hỏa Sơn, bên kia sa mạc, phía tây Lương Châu.",
        "> Nhưng nhớ cho kỹ: người Ma Giáo không tin người Trung Nguyên. Mang theo bằng chứng, nếu không thì mang theo quan tài.",
        "[Kết thúc Arc 4. Mở Arc 5 · Ma Giáo Tây Vực.]",
      ],
      onEnter: { flag: "a4_done", exp: 10000, cond: { req: { noflag: "brk_B" }, note: "Thoát khỏi tay Huyết Y đêm Huyết Nguyệt cũng là một lần Sinh Tử Quan. Mạch Ẩn tầng 3 khai thông.", eff: {} }, fx: (s) => KM.has(s, "brk_B") ? [] : KM.applyX(s, { breakTo: "B", ownTier: 3 }) },
      choices: [{ t: "Lên đường đi Lương Châu", go: "a5_road" }, { t: "Nghỉ ngơi đã (đi Lương Châu bằng bản đồ)", go: "@hub" }] },

    /* ---------- Kỳ ngộ Tây Hồ ---------- */
    a4_kyngo: { chapter: C4 + " · Kỳ ngộ", title: "Đáy Tây Hồ đêm rằm", place: "river", time: "night", cast: ["shen"],
      text: ["Trăng rằm soi thẳng xuống lòng hồ. Theo lời lão lái đò, dưới đáy hồ chỗ cột đá thứ ba có một ngôi mộ tướng quân thời Tống, chôn cùng cây thương của ông."],
      choices: [{ t: "Nín thở lặn xuống", check: { stat: "VIT", dc: 18 }, go: "a4_kyngo_win", fail: "a4_kyngo_f", rOk: "Shen lặn sâu ba trượng. Giữa đám rong, một cán thương đồng phát ánh xanh mờ.", rFail: "Phổi Shen như muốn nổ tung. Một bóng đen khổng lồ bơi ngang qua dưới đáy hồ." }] },
    a4_kyngo_f: { chapter: C4 + " · Kỳ ngộ", title: "Thủy quái", place: "river", time: "night", cast: ["shen"], text: ["Thủy quái Tây Hồ quẫy đuôi, cuốn Shen lên mặt nước."], fight: { foes: ["thuy_quai"], opts: { canFlee: true }, win: "@hub", lose: "@hub" } },
    a4_kyngo_win: { chapter: C4 + " · Kỳ ngộ", title: "Binh khí dưới đáy hồ", place: "river", time: "night", cast: ["shen"],
      text: ["Shen trồi lên mặt hồ, trong tay là một binh khí cổ. Dưới ánh trăng, lớp rong rêu bong ra, để lộ thân binh khí sáng như mới đúc.", "[Hệ Thống] Binh khí tự đổi hình theo Võ Đạo của Shen. Long Đảm Thương nếu dùng thương; nếu không, Âu Trì sẽ nhận ra đây là một món Bảo phẩm hợp tay cậu.]"],
      onEnter: { flag: "kyngo_a4", tierWeapon: "b", exp: 8000 }, choices: [{ t: "Bơi vào bờ", go: "@hub" }] },

    /* ================= ARC 5 ================= */
    a5_road: { chapter: C5, title: "Đường quan lên Tây Bắc", place: "road", time: "day", cast: ["shen"],
      text: ["Đường quan dài tưởng không có điểm cuối. Ruộng lúa nhường chỗ cho đồng cỏ, đồng cỏ nhường chỗ cho đá sỏi. Gió bắt đầu có vị cát."],
      special: "travel", dest: "luong_chau", go: "a5_arrive" },
    a5_arrive: { chapter: C5, title: "Lương Châu", place: "desert", time: "dusk", cast: ["shen"],
      text: [
        "Lương Châu là cửa ngõ cuối cùng của Trung Nguyên. Tường thành đất nện vàng sẫm, cờ quân biên phòng rách tả tơi trong gió.",
        "Người ta đồn Ma Giáo sắp tràn xuống đánh Trung Nguyên. Thương đoàn hủy chuyến, quân biên phòng tăng gác gấp đôi.",
        "[Sa mạc: mỗi ngày đi qua cần 1 túi nước. Thiếu nước thì mất máu và chỉ số. Lễ Thánh Hỏa ở Thánh Hỏa Sơn diễn ra ngày A+16.]",
      ],
      onEnter: { flag: "a5_start", mark: "a5", arc: 5, place: "luong_chau",
        quest: { q_thanh_hoa: { name: "Thánh Hỏa Sơn", desc: "Vượt sa mạc (Lương Châu → Nguyệt Nha Tuyền → Thánh Hỏa Sơn, 3 + 3 ngày), gặp Giáo chủ Dạ Vô Thương. Lễ Thánh Hỏa ngày A+16.", dueDays: 16, dueFrom: "a5" } } },
      special: "hub", hub: "luong_chau" },
    a5_desert: { chapter: C5, title: "Biển cát", place: "desert", time: "day", cast: ["shen"],
      text: ["Ra khỏi Lương Châu nửa ngày đường, mặt đất biến thành cát. Cồn cát nối cồn cát, gió thổi cát rát mặt. Đêm lạnh buốt, ngày nóng như lò.", "Đến chiều ngày thứ hai, một toán mã tặc phi ngựa từ sau cồn cát ra."],
      onEnter: { water: 3, time: 8 },
      fight: { foes: ["ma_tac", "ma_tac"], opts: { canFlee: true, road: true }, win: "a5_oasis", lose: "a5_oasis_lose", tx: "a5_desert" } },
    a5_oasis_lose: { chapter: C5, title: "Bị cướp", place: "desert", time: "dusk", cast: ["shen"], text: ["Mã tặc lấy đi một nửa số bạc của Shen rồi bỏ cậu lại giữa sa mạc. Cậu lê bước tới tận nửa đêm mới thấy ánh nước."], onEnter: { time: 4 }, choices: [{ t: "Bò tới bờ nước", go: "a5_oasis" }] },
    a5_oasis: { chapter: C5, title: "Nguyệt Nha Tuyền", place: "desert", time: "night", cast: ["shen"],
      text: ["Giữa sa mạc mênh mông, một hồ nước hình trăng non nằm lọt giữa những cồn cát cao. Mấy lều du mục dựng bên bờ, khói bếp bay thẳng lên trời.", "Một ông lão du mục kể: \"Đêm rằm, có con ngựa đỏ như máu xuống hồ uống nước. Ai bắt được nó thì đi nghìn dặm một ngày.\""],
      onEnter: { place: "nguyet_nha", flag: "a5_oasis" }, special: "hub", hub: "nguyet_nha" },
    a5_desert2: { chapter: C5, title: "Đường lên Thánh Hỏa Sơn", place: "desert", time: "day", cast: ["shen"],
      text: ["Phía tây Nguyệt Nha Tuyền, cát chuyển sang màu đỏ. Xa xa, một ngọn núi đen sừng sững, đỉnh núi có ngọn lửa cháy không bao giờ tắt: Thánh Hỏa."],
      onEnter: { water: 3, time: 12 },
      fight: { foes: ["bo_cap", "bo_cap"], opts: { canFlee: true, road: true }, win: "a5_gate", lose: "a5_gate", tx: "a5_desert2" } },
    a5_gate: { chapter: C5, title: "Tam Quan · Sức", place: "desert", time: "day", cast: ["shen", "ma_giao"],
      text: ["Cổng đá Thánh Hỏa Sơn khắc hình ngọn lửa. Ba vệ sĩ Ma Giáo đứng chắn, đao cong đỏ như máu.", "> Người Trung Nguyên muốn gặp Giáo chủ? Qua được ba cửa Sức, Trí, Tâm thì nói chuyện."],
      onEnter: { place: "thanh_hoa" },
      fight: { foes: ["ma_ve", "ma_ve", "ma_ve"], opts: { canFlee: false, hurt: "gate5" }, win: "a5_gate2", lose: "a5_gate_lose", tx: "a5_gate" } },
    a5_gate_lose: { repeat: true, chapter: C5, title: "Bị ném ra", place: "desert", time: "dusk", cast: ["shen"], text: ["Vệ sĩ Ma Giáo ném Shen ra ngoài cổng như ném một bao cát. \"Mai lại tới. Nếu còn đứng được.\""], onEnter: { time: 4, heal: 1, hurt: "gate5", place: "nguyet_nha" }, choices: [{ t: "Thử lại", go: "a5_gate" }, { t: "Lui về Nguyệt Nha Tuyền luyện thêm", go: "@hub" }] },
    a5_gate2: { chapter: C5, title: "Tam Quan · Trí", place: "palace", time: "day", cast: ["shen", "ma_giao"],
      text: ["Cửa thứ hai là một ông lão ngồi trước bức vách khắc nửa câu đối:", "\"Lửa đốt núi cao, núi còn lửa tắt…\""],
      choices: [{ t: "Đối lại", check: { stat: "INT", dc: 18, bonusTrait: { thong_tue: 4 } }, go: "a5_gate3", fail: "a5_gate3", rOk: "Shen đáp: \"…Máu chảy sông dài, sông cạn máu khô.\" Ông lão gật gù: \"Ngươi hiểu lửa Ma Giáo, cũng hiểu máu Trung Nguyên.\"", rFail: "Câu đối của Shen vụng về. Ông lão lắc đầu, bắt cậu quỳ trước vách đá nửa ngày rồi mới cho qua.", eff: { time: 1 } }] },
    a5_gate3: { chapter: C5, title: "Tam Quan · Tâm", place: "palace", time: "night", cast: ["shen"],
      text: ["Cửa thứ ba là một đại điện tối om, hai bên xếp đầy đầu lâu. Ai bước qua cũng nghe tiếng người chết gọi tên mình.", "Shen nghe thấy tiếng mẹ, tiếng cha, tiếng lửa cháy."],
      choices: [{ t: "Bước thẳng, không quay đầu", check: { stat: "WIS", dc: 18, bonusTrait: { linh_giac: 4 } }, go: "a5_hall", fail: "a5_hall", rOk: "Shen đi hết đại điện, mắt nhìn thẳng. Phía cuối là ánh lửa.", rFail: "Shen quay đầu lại một lần. Chỉ một lần. Đến khi tỉnh ra, cậu đã quỳ giữa đại điện, mặt đầy nước mắt.", eff: { trend: { minh: 1 } } }] },
    a5_hall: { chapter: C5, title: "Giáo chủ Dạ Vô Thương", place: "palace", time: "night", cast: ["shen", "da_vo_thuong"],
      text: [
        "Dạ Vô Thương ngồi trên ngai đá đen, tóc bạc trắng dù chưa tới năm mươi. Bên cạnh ông, một thiếu nữ áo đỏ, mắt sắc như dao: Dạ Linh, con gái Giáo chủ.",
        "> Thẩm gia trang. — Dạ Vô Thương lặp lại cái tên, chậm rãi. — Mười năm nay, thiên hạ nói ta giết cả nhà họ Thẩm bằng Thiên Ma Chưởng. Ta chưa từng đặt chân tới đó.",
        "> Ngươi đến đây làm gì, con cháu nhà họ Thẩm? Báo thù? Hay mang chứng cứ?",
      ],
      onEnter: { meet: ["da_vo_thuong", "da_linh"] },
      choices: [
        { t: "Trình danh sách ám sát của Huyết Ảnh Lâu", req: { inv: "danh_sach" }, go: "a5_jail", eff: { aff: { da_vo_thuong: 30 }, rep: { ma_giao: 60 } }, r: "Dạ Vô Thương đọc tờ giấy, đọc lần nữa. Bàn tay ông siết lại, ngai đá nứt một đường. \"Ta cần kiểm chứng. Từ giờ tới khi đó, ngươi ở lại Ma Lao. Đừng trách ta, mười năm qua ta đã quá quen với lừa dối.\"" },
        { t: "Kể lại mọi chuyện bằng lời", go: "a5_jail", eff: { aff: { da_vo_thuong: 5 } }, r: "Dạ Vô Thương nghe hết, mặt không đổi sắc. \"Lời nói thì ai cũng nói được. Giam vào Ma Lao.\"" },
      ] },
    a5_jail: { chapter: C5, title: "Ma Lao", place: "cave", time: "night", cast: ["shen", "ma_giao"],
      text: ["Ma Lao khoét sâu vào lòng núi, nóng hầm hập vì hơi lửa Thánh Hỏa. Đêm thứ hai, cửa ngục mở lặng lẽ. Hai vệ sĩ Ma Giáo bước vào, đao đã rút khỏi vỏ.", "> Hữu hộ pháp gửi lời hỏi thăm."],
      fight: { foes: ["ma_ve", "ma_ve"], opts: { canFlee: false }, win: "a5_jail_win", lose: "a5_jail_saved", tx: "a5_jail" } },
    a5_jail_win: { chapter: C5, title: "Nhân chứng", place: "cave", time: "night", cast: ["shen", "da_linh"],
      text: ["Hai vệ sĩ nằm gục trên nền đá. Dạ Linh đứng ở cửa ngục từ lúc nào, tay cầm cây roi da, mắt nhìn xác người của Hữu điện.", "> Ta thấy hết rồi. Người của Cừu Thiên Liệt đến giết ngươi. — Cô ném chùm chìa khóa xuống. — Cha ta sẽ nghe ta. Từ giờ ngươi đi lại tự do trong núi, nhưng đừng để ta phải hối hận."],
      onEnter: { place: "thanh_hoa", flag: ["a5_gate_done", "da_linh_witness"], aff: { da_linh: 20 }, exp: 15000 }, special: "hub", hub: "thanh_hoa" },
    a5_jail_saved: { chapter: C5, title: "Dạ Linh", place: "cave", time: "night", cast: ["shen", "da_linh"],
      text: ["Lưỡi đao sắp hạ xuống thì một ngọn roi da quấn lấy cổ tay tên vệ sĩ. Dạ Linh kéo mạnh, hắn ngã sấp xuống nền đá.", "> Người của Hữu điện dám vào Ma Lao giết khách của cha ta? Ta thấy hết rồi."],
      onEnter: { place: "thanh_hoa", flag: ["a5_gate_done", "da_linh_witness"], aff: { da_linh: 10 } }, special: "hub", hub: "thanh_hoa" },
    a5_huu_dien: { chapter: C5, title: "Hữu điện", place: "palace", time: "night", cast: ["shen"],
      text: ["Hữu điện của Cừu Thiên Liệt canh gác nghiêm hơn cả chính điện. Trong thư phòng, một hộp sắt khóa kín đặt dưới chân tượng Hỏa Thần."],
      choices: [{ t: "Mở hộp sắt", check: { stat: "AGI", dc: 20, bonusTrait: { anh_tu: 5 } }, go: "a5_letter_found", fail: "a5_huu_dien_f", rOk: "Hộp mở ra không một tiếng động.", rFail: "Chuông đồng treo trên xà rung lên." }] },
    a5_huu_dien_f: { chapter: C5, title: "Bị phát hiện", place: "palace", time: "night", cast: ["shen", "ma_giao"], text: ["Phản đồ Hữu điện ập vào."], fight: { foes: ["ma_phan", "ma_phan"], opts: { canFlee: true }, win: "a5_letter_found", lose: "@hub", tx: "a5_huu_dien_f" } },
    a5_letter_found: { chapter: C5, title: "Thư tay Minh chủ", place: "palace", time: "night", cast: ["shen"],
      text: ["Trong hộp là một lá thư, nét chữ phóng khoáng, ký tên: Tạ Thiên Hành.", "\"Đêm lễ Thánh Hỏa, ta sẽ cho người chặn đường Võ Lâm Minh ở Lương Châu. Huynh lên ngôi Giáo chủ, Ma Giáo và Võ Lâm Minh từ nay chia đôi thiên hạ.\""],
      onEnter: { flag: "k5_thu", item: ["thu_minh_chu", 1], exp: 8000 }, choices: [{ t: "Cất kỹ", go: "@hub" }] },

    /* ---------- Lễ Thánh Hỏa ---------- */
    a5_ceremony: { chapter: C5, title: "Lễ Thánh Hỏa", place: "desert", time: "night", cast: ["shen", "cuu_thien_liet", "da_vo_thuong"],
      text: [
        "Thánh Hỏa đài trên đỉnh núi, lửa cháy cao ba trượng. Toàn giáo quỳ dưới chân đài.",
        "Giữa lúc Dạ Vô Thương dâng hương, Cừu Thiên Liệt đứng dậy, chỉ thẳng vào Shen: \"Gian tế Trung Nguyên ám sát Giáo chủ! Giết hắn!\" Một mũi tên tẩm độc đã cắm vào vai Giáo chủ.",
        "Người của Hữu điện rút đao khắp quảng trường.",
      ],
      onEnter: { place: "thanh_hoa", meet: "cuu_thien_liet", cond: { req: { cnt: [k5, 3] }, note: "Đủ ba manh mối: phe trung thành biết trước, đã vây Hữu điện. Cừu Thiên Liệt mất người, mất thế." } },
      fight: { foes: ["cuu_thien_liet"], opts: { canFlee: false, hurt: "cuu", cuts: [["k5_thu", 0.93], ["k5_noi", 0.93], ["k5_trung", 0.93]] }, win: "a5_y", lose: "a5_cere_lose" } },
    a5_cere_lose: { repeat: true, chapter: C5, title: "Chưa ngã", place: "desert", time: "night", cast: ["shen", "da_linh"],
      text: ["Shen bị đánh văng xuống chân đài. Dạ Linh nhét vào miệng cậu một viên thuốc đắng nghét. Dạ Vô Thương, máu chảy ròng ròng, vẫn tung một chưởng vào lưng Cừu Thiên Liệt.", "> Đứng dậy, người Trung Nguyên! Hắn đã bị thương rồi!"],
      onEnter: { hurt: "cuu", heal: 1 }, choices: [{ t: "Đứng dậy", go: "a5_ceremony" }] },
    a5_late: { chapter: C5, title: "Đảo chính", place: "desert", time: "night", cast: ["shen", "da_linh"],
      text: ["Shen tới quá muộn. Đêm lễ Thánh Hỏa, Cừu Thiên Liệt đã làm phản. Dạ Vô Thương trọng thương, cùng Dạ Linh trốn vào sa mạc.", "Shen tìm thấy họ ở một hang đá giữa cồn cát, đúng lúc người của Hữu điện đuổi tới. Cừu Thiên Liệt cưỡi ngựa đi đầu."],
      onEnter: { place: "thanh_hoa", flag: ["a5_gate_done", "a5_was_late"], meet: ["da_vo_thuong", "da_linh", "cuu_thien_liet"] },
      fight: { foes: ["cuu_thien_liet"], opts: { canFlee: false, foeHpMul: 1.1, hurt: "cuu" }, win: "a5_y", lose: "a5_late_lose" } },
    a5_late_lose: { repeat: true, chapter: C5, title: "Chưa ngã", place: "desert", time: "night", cast: ["shen", "da_linh"], text: ["Dạ Linh kéo Shen vào hang. \"Hắn cũng bị thương rồi. Lần nữa!\""], onEnter: { hurt: "cuu", heal: 1 }, choices: [{ t: "Đứng dậy", go: "a5_late" }] },
    a5_y: { chapter: C5, title: "Ý", place: "desert", time: "night", cast: ["shen"],
      text: [
        "Cừu Thiên Liệt ngã vào ngọn lửa Thánh Hỏa. Lửa bùng lên, nuốt chửng hắn.",
        "Shen đứng giữa đài lửa, mồ hôi chảy ròng ròng. Trong khoảnh khắc ấy cậu bỗng hiểu: chiêu thức chỉ là hình. Thứ làm nên chiêu thức là \"Ý\", ý muốn của người ra đòn. Cậu đã đánh cả đời bằng cơn giận, giờ mới biết mình đánh vì điều gì.",
        "[Hệ Thống] Lĩnh ngộ Ý. Võ Đạo bậc 3. Cánh cửa cảnh giới Tông Sư đã mở.",
      ],
      onEnter: { tier: 3, breakTo: "A", shard: 1, exp: 40000, money: 100000, rep: { ma_giao: 150 }, aff: { da_vo_thuong: 20, da_linh: 15 },
        ledger: { actor: "Cừu Thiên Liệt", action: "Cấu kết với Tạ Thiên Hành đảo chính Thiên Ma Giáo", target: "Dạ Vô Thương", witness: "Toàn giáo", pending: "Thư tay Minh chủ", trigger: "Arc 8" } },
      choices: [{ t: "…", go: "a5_letter" }] },
    a5_letter: { chapter: C5, title: "Lá thư của Minh chủ", place: "palace", time: "day", cast: ["shen", "da_vo_thuong", "da_linh"],
      text: [
        "Dạ Vô Thương ngồi lại trên ngai đá, vai quấn băng. Ông nhìn Shen rất lâu.",
        "> Ma Giáo nợ ngươi một lần. Lá thư của Tạ Thiên Hành, ngươi định làm gì với nó?",
      ],
      choices: [
        { t: "Giao cho Giáo chủ, kết minh với Ma Giáo", req: { inv: "thu_minh_chu" }, go: "a5_end", eff: { flag: ["letter_given", "ma_ally"], take: ["thu_minh_chu", 1], rep: { ma_giao: 300, vo_lam: -100 }, cond: { req: { aff: { da_vo_thuong: 60 } }, note: "Dạ Vô Thương trao lại một mảnh lụa cũ cất trong ngai đá: một mảnh Thiên Mạch Chân Giải.", eff: { shard: 1 } } },
          r: "Dạ Vô Thương cầm lá thư, đứng dậy. \"Từ hôm nay, kẻ thù của Thẩm gia là kẻ thù của Thiên Ma Giáo.\" Toàn giáo hô vang." },
        { t: "Giữ lại làm chứng cứ", req: { inv: "thu_minh_chu" }, go: "a5_end", eff: { flag: "letter_kept" },
          r: "Dạ Vô Thương không ép. \"Ngươi giữ cũng được. Nhưng lá thư ấy sẽ khiến người ta muốn giết ngươi hơn cả ta.\"" },
        { t: "Chép thành hai bản: bản chính cho Giáo chủ, bản chép giữ lại", req: { inv: "thu_minh_chu", INT: 40, anti: 2 }, go: "a5_end", eff: { flag: ["letter_copied", "ma_ally"], take: ["thu_minh_chu", 1], item: ["ban_chep", 1], anti: 1, rep: { ma_giao: 100 } },
          r: "Shen chép lá thư suốt đêm, nét chữ y hệt. Bản chính đặt lên ngai đá. Bản chép nằm trong ngực áo cậu. Dạ Linh nhìn thấy, nhưng chỉ nhếch mép cười." },
        { t: "Ném lá thư vào lửa Thánh Hỏa", req: { inv: "thu_minh_chu" }, go: "a5_end", eff: { flag: "letter_burned", take: ["thu_minh_chu", 1], moral: -50, trend: { am: 3 } },
          r: "Lá thư cháy rụi trong nháy mắt. Dạ Vô Thương sững người. \"Ngươi… ngươi muốn chiến tranh?\" Shen không trả lời. Bằng chứng duy nhất đã thành tro, và chẳng ai còn ngăn được hai phe lao vào nhau." },
        { t: "\"Thư không ở trong tay tôi.\"", req: { noflag: "k5_thu" }, hide: true, go: "a5_end", r: "Dạ Vô Thương gật đầu. \"Vậy để ta tự tìm. Hữu điện còn nhiều thứ để lục.\"" },
      ] },
    a5_end: { chapter: C5 + " · Kết", title: "Bắc Cảnh", place: "desert", time: "dusk", cast: ["shen", "da_linh"],
      text: [
        "Dạ Linh tiễn Shen tới chân núi.",
        "> Giang hồ đồn ầm lên rồi: sáu mươi năm một lần, Kiếm Trủng ở Bắc Cảnh mở cửa. Trong đó có truyền thừa của Kiếm Thần Vô Danh. Các phái lớn đều kéo nhau lên Tuyết Lĩnh Trấn.",
        "> Huyết Ảnh Lâu cũng đi. Lâu chủ Huyết Y muốn truyền thừa ấy hơn bất cứ thứ gì. Đừng để hắn có được.",
        "[Kết thúc Arc 5. Mở Arc 6 · Bí Cảnh Kiếm Trủng.]",
      ],
      onEnter: { flag: "a5_done", quest: { q_thanh_hoa: "done" }, exp: 10000 },
      choices: [{ t: "Lên đường đi Tuyết Lĩnh Trấn", go: "a6_road" }, { t: "Ở lại Thánh Hỏa Sơn ít hôm", go: "@hub" }] },

    /* ---------- Kỳ ngộ thần mã ---------- */
    a5_kyngo: { chapter: C5 + " · Kỳ ngộ", title: "Ngựa đỏ uống nước lúc nửa đêm", place: "desert", time: "night", cast: ["shen"],
      text: ["Nửa đêm, mặt hồ Nguyệt Nha phẳng lặng như gương. Rồi một con ngựa đỏ rực bước xuống bờ nước, mồ hôi nó đỏ như máu. Hãn Huyết Bảo Mã.", "Shen nín thở, nhích từng bước lại gần."],
      choices: [{ t: "Nhảy lên lưng ngựa, ghì chặt bờm", check: { stat: "STR", dc: 20 }, go: "a5_kyngo_win", fail: "a5_kyngo_f", rOk: "Con ngựa chồm lên, quăng quật suốt nửa canh giờ. Shen không buông. Cuối cùng nó đứng yên, thở phì phò, quay đầu nhìn cậu.", rFail: "Con ngựa hất Shen văng xuống hồ, phi vào sa mạc." }] },
    a5_kyngo_f: { chapter: C5 + " · Kỳ ngộ", title: "Vuột mất", place: "desert", time: "night", cast: ["shen"], text: ["Có lẽ đêm khác nó sẽ quay lại."], choices: [{ t: "…", go: "@hub" }] },
    a5_kyngo_win: { chapter: C5 + " · Kỳ ngộ", title: "Hãn Huyết Bảo Mã", place: "desert", time: "night", cast: ["shen"], text: ["Hãn Huyết Bảo Mã cúi đầu, để Shen vuốt bờm. Từ nay nghìn dặm cũng chỉ là một ngày đường."], onEnter: { flag: "kyngo_a5", giveHorse: "han_huyet", exp: 10000 }, choices: [{ t: "…", go: "@hub" }] },
  });

  /* ---------------- Sự kiện ---------------- */
  KM.A4_HD = [1, 2, 3, 4, 5, 6];
  KM.TRIGGERS.push((s) => {
    if (KM.has(s, "a3_done") && !KM.has(s, "a4_start") && s.place === "van_thuy") return "a4_arrive";
    if (A4(s) && KM.has(s, "a4_in")) {
      const d = KM.since(s, "a4");
      if ((s.lo || 0) >= 100 && !KM.has(s, "a4_exposed_seen")) return "a4_exposed";
      if (d >= 18) return "a4_blood_moon";
      if (s.place !== "van_thuy") return null;
      if (d >= 8 && !KM.has(s, "a4_st_done") && !KM.has(s, "a4_st_fail")) return "a4_sinh_tu";
      if (d >= 15 && !KM.has(s, "quy_anh_done")) return "a4_quy_anh";
    }
    if (KM.has(s, "a4_done") && !KM.has(s, "a5_start") && s.place === "luong_chau") return "a5_arrive";
    if (A5(s) && !KM.has(s, "a5_cere")) {
      const d = KM.since(s, "a5");
      if (d >= 16) { KM.flag(s, "a5_cere"); return KM.has(s, "a5_gate_done") ? "a5_ceremony" : "a5_late"; }
    }
    return null;
  });

  /* ---------------- Khu tự do ---------------- */
  const hdNext = (s) => KM.A4_HD.find((n) => !KM.has(s, "hd" + n));
  KM.HUBS.van_thuy = {
    name: "Vân Thủy Thành", place: "town",
    note: (s) => !A4(s) ? (KM.has(s, "a4_done") ? "Huyết Ảnh Lâu đã biết mặt Shen. Đi đâu trong thành cũng nên đề phòng." : "") :
      "Lộ diện " + (s.lo || 0) + "/100 · đêm Huyết Nguyệt ngày " + (s.marks.a4 + 18) + " (còn " + Math.max(0, s.marks.a4 + 18 - s.day) + " ngày) · hợp đồng " + KM.cnt(s, KM.A4_HD.map((n) => "hd" + n)) + "/6" + (KM.has(s, "a4_list") ? " · đã có danh sách." : "."),
    locs: [
      { id: "khach_diem", name: "Khách điếm Thủy Vân", art: "inn", desc: "Khách điếm nhỏ bên kênh, chủ quán không bao giờ hỏi tên khách.", actions: [
        { t: "Thuê phòng nghỉ đêm", sub: "30 đồng · Lộ diện −5", cost: 0, run: (s) => R(KM.apply(s, { money: -Math.min(30, s.money) }).concat(A4(s) && s.lo ? KM.applyX(s, { lo: -5 }) : [], KM.sleep(s))) },
      ] },
      { id: "thien_mac", name: "Thiên Mạc Loát", art: "cave", desc: "Tiệm vải lớn nhất thành. Cửa sau là Huyết Ảnh Lâu.", show: (s) => KM.has(s, "a4_in") && !KM.has(s, "a4_done"), actions: [
        { t: "▶ Nhận hợp đồng tiếp theo", sub: "", cost: 0, show: (s) => { const n = hdNext(s); return n && KM.since(s, "a4") >= 2 * n - 1; }, run: (s) => R([], { scene: "a4_hd" + hdNext(s) }) },
        KM.storyAct("Thử lại Sinh Tử Quan", "a4_sinh_tu", (s) => KM.has(s, "a4_st_fail") && !KM.has(s, "a4_st_done") && s.day >= (s.marks.a4st || 0) + 3, "Huyết Ảnh Thất Sát · Rank B · Lv 33"),
        KM.storyAct("Đột nhập Tàng Án Các", "a4_tang", (s) => night(s) && KM.since(s, "a4") >= 12 && !KM.has(s, "a4_list"), "ban đêm", 1),
        KM.huntAct("Luyện cùng sát thủ tập sự", "Rank C", [[80, ["sat_thu_b"]], [100, ["sat_thu_b", "sat_thu_b"]]], "Trong đấu trường ngầm, sát thủ tập sự đánh nhau thật."),
      ] },
      { id: "cho_dem", name: "Chợ đêm bờ kênh", art: "river", when: "night", desc: "Chợ họp dưới ánh đèn lồng dọc kênh. Liên Nhi hay ngồi ở mũi thuyền cuối chợ.", actions: [
        { t: "Gặp Liên Nhi", show: (s) => KM.has(s, "a4_in") && KM.since(s, "a4") >= 3 && !KM.dead(s, "lien_nhi") && !KM.has(s, "a4_done"), run: (s) => {
          if (!once(s, "today_lien")) return R(["Liên Nhi không có ở đây."], { free: true });
          const m = KM.apply(s, { meet: "lien_nhi", aff: { lien_nhi: 8 } });
          if ((s.aff.lien_nhi || 0) >= 40 && !KM.has(s, "lien_talk")) return R(m, { scene: "a4_lien" });
          m.push(["Liên Nhi ăn hết ba xâu kẹo hồ lô, không nói câu nào.", "Liên Nhi hỏi Shen giết người lần đầu năm bao nhiêu tuổi.", "Liên Nhi chỉ cho Shen cách đi trên mái ngói không phát ra tiếng động."][Math.floor(KM.rand(s) * 3)]);
          return R(m);
        } },
        KM.shopAct("cho_den", "Chợ đen"),
        KM.huntAct("Dẹp côn đồ chợ đêm", "Rank C", [[70, ["du_dang"]], [100, ["du_dang", "du_dang"]]], "Một toán côn đồ chặn đường trong ngõ."),
      ] },
      { id: "tay_ho", name: "Tây Hồ", art: "river", desc: "Hồ rộng mênh mông, sương phủ quanh năm.", actions: [
        { t: "Thuê thuyền dạo hồ", sub: "50 đồng · Lộ diện −5", show: day, run: (s) => R(KM.apply(s, { money: -Math.min(50, s.money), exp: 50 }).concat(A4(s) && s.lo ? KM.applyX(s, { lo: -5 }) : [], KM.has(s, "heard_tayho") ? [] : (KM.flag(s, "heard_tayho"), ["Lão lái đò kể: dưới đáy hồ có mộ một tướng quân thời Tống, chôn cùng cây thương. Đêm rằm, ai lặn được xuống thì thấy ánh xanh."]))) },
        KM.storyAct("Lặn xuống đáy Tây Hồ đêm rằm", "a4_kyngo", (s) => night(s) && KM.has(s, "heard_tayho") && !KM.has(s, "kyngo_a4") && KM.has(s, "a4_start"), "Kỳ ngộ · kiểm tra Căn Cốt (VIT) độ khó 18", 1),
        KM.huntAct("Săn thủy quái ven hồ", "Rank B", [[100, ["thuy_quai"]]], "Mặt hồ dậy sóng."),
      ] },
      { id: "thuong_hoi", name: "Thương hội Vân Thủy", art: "market", when: "day", desc: "Thương hội lớn nhất Giang Nam.", actions: [
        KM.shopAct("vt_thuong_hoi"), { t: "Chợ ngựa", cost: 0, run: () => R([], { horses: true }) }, { t: "Lò rèn (cường hóa)", cost: 0, run: () => R([], { forge: true }) },
      ] },
    ],
  };
  KM.HUBS.luong_chau = {
    name: "Lương Châu", place: "desert",
    note: (s) => A5(s) && !KM.has(s, "a5_gate_done") ? "Lễ Thánh Hỏa ngày " + (s.marks.a5 + 16) + " (còn " + Math.max(0, s.marks.a5 + 16 - s.day) + " ngày). Túi nước: " + (s.inv.tui_nuoc || 0) + "." : "",
    locs: [
      { id: "lu_quan", name: "Lữ quán thương đoàn", art: "inn", desc: "Lữ quán lớn nhất biên ải.", actions: [
        KM.rest(null, 30),
        { t: "▶ Thuê người dẫn đường qua sa mạc", sub: "15 bạc · bớt 1 ngày mỗi chặng", cost: 0, show: (s) => A5(s) && !KM.has(s, "a5_guide"), run: (s) => s.money < 1500 ? R(["Không đủ 15 bạc."], { free: true }) : R(KM.apply(s, { money: -1500, flag: "a5_guide" }).concat(["Một lão Hồi Hột râu dài nhận lời dẫn đường."])) },
        KM.storyAct("Vượt sa mạc tới Nguyệt Nha Tuyền", "a5_desert", (s) => A5(s) && !KM.has(s, "a5_oasis"), "3 ngày (2 nếu có người dẫn đường) · cần túi nước"),
      ] },
      { id: "cho", name: "Chợ biên ải", art: "market", when: "day", desc: "Chợ bán nước, lạc đà, binh khí Tây Vực.", actions: [KM.shopAct("lc_cho"), { t: "Chợ ngựa", cost: 0, run: () => R([], { horses: true }) }, { t: "Lò rèn (cường hóa)", cost: 0, run: () => R([], { forge: true }) }] },
      { id: "doanh_trai", name: "Doanh trại biên phòng", art: "camp", desc: "Quân biên phòng thiếu người, sẵn lòng trả công cho ai đi tuần cùng.", actions: [
        KM.huntAct("Đi tuần cùng quân biên phòng", "Rank B", [[70, ["ma_tac"]], [100, ["ma_tac", "ma_tac"]]], "Đội tuần gặp mã tặc ở bìa sa mạc."),
        KM.trainAct("Luyện võ ở thao trường"),
      ] },
    ],
  };
  KM.HUBS.nguyet_nha = {
    name: "Nguyệt Nha Tuyền", place: "desert", note: (s) => A5(s) && !KM.has(s, "a5_gate_done") ? "Lễ Thánh Hỏa ngày " + (s.marks.a5 + 16) + ". Túi nước: " + (s.inv.tui_nuoc || 0) + "." : "",
    locs: [
      { id: "leu", name: "Lều du mục", art: "camp", desc: "Người du mục bán nước và cho khách ngủ nhờ.", actions: [
        KM.rest(null, 10, "Ngủ nhờ lều du mục"),
        { t: "Mua 3 túi nước", sub: "60 đồng", cost: 0, run: (s) => s.money < 60 ? R(["Không đủ tiền."], { free: true }) : R(KM.apply(s, { money: -60, item: ["tui_nuoc", 3] }), { free: true }) },
        KM.storyAct("Lên đường tới Thánh Hỏa Sơn", "a5_desert2", (s) => A5(s) && !KM.has(s, "a5_gate_done"), "3 ngày (2 nếu có người dẫn đường) · cần túi nước"),
      ] },
      { id: "ho", name: "Hồ trăng khuyết", art: "desert", desc: "Hồ nước hình trăng non giữa sa mạc.", actions: [
        { t: "Rình bên hồ lúc nửa đêm", sub: "Kỳ ngộ · tối đa 3 lần", show: (s) => night(s) && !KM.has(s, "kyngo_a5") && (s.visits.ngua || 0) < 3, run: (s) => { s.visits.ngua = (s.visits.ngua || 0) + 1; return KM.d100(s) <= 70 ? R(["Lần thứ " + s.visits.ngua + "."], { scene: "a5_kyngo" }) : R(["Lần thứ " + s.visits.ngua + ". Đêm nay mặt hồ không động. Chỉ có gió."]); } },
        KM.huntAct("Săn bọ cạp cát quanh hồ", "Rank B", [[100, ["bo_cap"]]], "Cát dưới chân Shen chuyển động."),
      ] },
    ],
  };
  KM.HUBS.thanh_hoa = {
    name: "Thánh Hỏa Sơn", place: "desert",
    note: (s) => A5(s) ? "Lễ Thánh Hỏa ngày " + (s.marks.a5 + 16) + " (còn " + Math.max(0, s.marks.a5 + 16 - s.day) + " ngày) · manh mối âm mưu " + KM.cnt(s, k5) + "/3." : "Thánh Hỏa Sơn giờ là chỗ dựa của Shen ở Tây Vực.",
    locs: [
      { id: "khach_xa", name: "Khách xá", art: "room", desc: "Gian phòng đá Dạ Linh cho Shen ở.", actions: [KM.rest(null, 0, "Nghỉ ở khách xá")] },
      { id: "huu_dien", name: "Hữu điện", art: "palace", desc: "Điện của Hữu hộ pháp Cừu Thiên Liệt.", actions: [
        KM.storyAct("Lục soát thư phòng Hữu điện", "a5_huu_dien", (s) => night(s) && A5(s) && !KM.has(s, "k5_thu"), "ban đêm", 1),
        { t: "▶ Theo dõi kẻ ra vào Hữu điện", sub: "kiểm tra Tâm Cảnh (WIS) độ khó 19", show: (s) => A5(s) && !KM.has(s, "k5_noi"), run: (s) => { const r = KM.check(s, "WIS", 19, KM.hasTrait(s, "linh_giac") ? 4 : 0); return R([r.line].concat(r.ok ? ["Shen ghi nhớ mặt từng kẻ đêm đêm lẻn vào Hữu điện: ba trưởng lão, bảy đội trưởng vệ sĩ. Dạ Linh nhận danh sách, mặt tái đi."].concat(KM.apply(s, { flag: "k5_noi", aff: { da_linh: 5 } })) : ["Đêm nay không ai ra vào."])); } },
        KM.huntAct("Chặn phản đồ Hữu điện", "Rank A", [[100, ["ma_phan"]]], "Một phản đồ Hữu điện phát hiện Shen."),
      ] },
      { id: "chinh_dien", name: "Chính điện", art: "palace", desc: "Nơi Giáo chủ nghị sự. Dạ Linh hay luyện roi ở sân trước.", actions: [
        { t: "Trò chuyện với Dạ Linh", run: (s) => {
          if (!once(s, "today_dl")) return R(["Dạ Linh bận việc."], { free: true });
          const m = KM.apply(s, { aff: { da_linh: 6 } });
          if ((s.aff.da_linh || 0) >= 30 && A5(s) && !KM.has(s, "k5_trung")) { m.push("Dạ Linh dẫn Shen đi gặp các trưởng lão trung thành. Đêm lễ Thánh Hỏa, họ sẽ vây Hữu điện."); m.push(...KM.apply(s, { flag: "k5_trung", rep: { ma_giao: 40 } })); }
          else m.push(["Dạ Linh kể mẹ cô chết năm cô lên năm, vì bị đầu độc.", "Dạ Linh hỏi Trung Nguyên có tuyết không.", "Dạ Linh múa roi, quất tắt từng ngọn nến cách mười bước."][Math.floor(KM.rand(s) * 3)]);
          return R(m);
        } },
        KM.shopAct("th_ma_kho"),
      ] },
      { id: "ma_lao", name: "Ma Lao", art: "cave", desc: "Ngục trong lòng núi. Mấy đệ tử Võ Đang bị bắt từ năm ngoái vẫn còn giam ở đây.", actions: [
        { t: "Xin Giáo chủ thả đệ tử Võ Đang", sub: "cần hảo cảm Dạ Vô Thương 30", show: (s) => !KM.has(s, "vd_freed"), req: { aff: { da_vo_thuong: 30 } }, run: (s) => R(["Dạ Vô Thương phẩy tay: \"Thả đi. Bảo Thanh Hư lão đạo nhớ cái ơn này.\""].concat(KM.apply(s, { flag: "vd_freed", rep: { vo_dang: 80 }, aff: { thanh_hu: 10 }, moral: 10 }))) },
      ] },
      { id: "thung_lung", name: "Thung lũng Huyết Lang", art: "desert", desc: "Thung lũng đá đỏ sau núi, bầy Huyết Lang làm tổ.", actions: [
        KM.huntAct("Săn Huyết Lang", "Rank B", [[70, ["huyet_lang"]], [100, ["huyet_lang", "huyet_lang"]]], "Tiếng tru vang khắp thung lũng."),
        KM.trainAct("Luyện công trên đá nóng"),
      ] },
    ],
  };
})(typeof window !== "undefined" ? window : globalThis);
