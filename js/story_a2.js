/* =====================================================================
   KIẾM MỆNH · ARC 2 — TRẤN LẠC HÀ
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  KM.SCENES = KM.SCENES || {};
  Object.assign(KM.SCENES, {
    a2_road: { chapter: "Arc 2 · Trấn Lạc Hà", title: "Đường xuống núi", place: "road", time: "day", cast: ["shen"],
      text: [
        "Con đường đất đỏ uốn quanh chân núi, hai bên là ruộng bậc thang đã gặt xong. Lần đầu tiên trong đời, Shen đi xa khỏi Thanh Vân.",
        "[Đi đường: mỗi ngày Hệ Thống gieo d100, ra ≤ 15 thì gặp sự kiện. Có ngựa thì thời gian đi đường rút ngắn theo phẩm ngựa.]",
      ],
      special: "travel", dest: "lac_ha", go: "a2_arrive" },

    a2_arrive: { chapter: "Arc 2 · Trấn Lạc Hà", title: "Khách điếm Duyệt Lai", place: "inn", time: "dusk", cast: ["shen", "lao_ho"],
      text: [
        "Trấn Lạc Hà nằm bên một khúc sông rộng, thuyền buôn đậu kín bến. Mùi cá khô, mùi rượu nếp và mùi dầu đèn quyện vào nhau trong gió chiều.",
        "Khách điếm Duyệt Lai đông nghẹt. Ở góc trong cùng, một lão ăn mày râu tóc bạc phơ gục đầu bên vò rượu rỗng, ngáy như sấm. Cây gậy trúc xanh dựng cạnh bàn bóng lên vì dầu tay.",
        "Tiểu nhị chép miệng: \"Lão Hồ đấy. Nợ tiền rượu ba tháng rồi, chẳng ai đuổi nổi.\"",
        "Shen vừa bước tới thì lão ăn mày mở một mắt. Ánh mắt lão dừng lại ở miếng ngọc bội lấp ló trên cổ cậu, rồi tỉnh hẳn.",
        "> …Chữ Thẩm. Mười năm rồi đấy nhỉ.",
      ],
      onEnter: { place: "lac_ha", meet: "lao_ho", flag: "arrived_lac_ha", mark: "arrive" },
      choices: [
        { t: "Gọi thêm một vò rượu, ngồi xuống đối ẩm", go: "a2_laoho_meet", req: { money: 20 }, eff: { money: -20, aff: { lao_ho: 10 }, trend: { minh: 1 } } },
        { t: "Hỏi thẳng: \"Ông là Lão Hồ? Ông biết gì về Thẩm gia trang?\"", go: "a2_laoho_meet", eff: { aff: { lao_ho: 3 } } },
        { t: "Đưa phong thư cũ ra trước mặt lão", go: "a2_laoho_meet", eff: { aff: { lao_ho: 6 } } },
      ] },
    a2_laoho_meet: { chapter: "Arc 2", title: "Lão Hồ", place: "inn", time: "dusk", cast: ["shen", "lao_ho"],
      text: [
        "Lão Hồ cười hề hề, rót rượu vào cái bát sứt mẻ.",
        "> Biết thì biết đấy. Nhưng ngươi bây giờ có biết cũng chỉ thêm một cái xác. Tuyệt Mạch mà đòi báo thù, ha.",
        "> Muốn nghe chuyện cũ thì cho ta thấy ngươi sống nổi ở cái trấn này trước đã. Long Môn Tiêu Cục đang tuyển tiêu sư, ngươi tới đó thử xem. Ăn được cơm tiêu cục rồi hẵng tới tìm ta.",
        "Lão gục đầu xuống bàn, ngáy tiếp như chưa từng nói gì.",
        "[Lão Hồ sẽ kể nhiều hơn khi hảo cảm đủ cao. Uống rượu cùng lão ở khách điếm mỗi ngày.]",
      ],
      onEnter: { quest: { q_tieu_su: { name: "Tiêu sư tập sự", desc: "Tới Long Môn Tiêu Cục ở chợ Lạc Hà, vượt qua bài thử của tiêu đầu." } }, arc: 2 },
      special: "hub", hub: "lac_ha" },

    /* ---------- Long Môn Tiêu Cục ---------- */
    a2_tieu_test: { chapter: "Arc 2", title: "Bài thử của tiêu đầu", place: "yard2", time: "day", cast: ["shen", "tieu_dau", "long_tieu_chu"],
      text: [
        "Sân Long Môn Tiêu Cục lát đá xanh, cờ rồng đen bay phần phật. Tiêu chủ Long Chấn Uy, người vạm vỡ như gấu, ngồi trên bậc thềm uống trà.",
        "> Tuyệt Mạch? Ha. Tiêu cục ta không nuôi người ăn không. Mã Đại, thử nó.",
        "Tiêu đầu Mã Đại bước ra, tay cầm thanh đao bản to, cười nhạt.",
      ],
      fight: { foes: ["tieu_dau"], opts: { solo: true, canFlee: false }, win: "a2_tieu_win", lose: "a2_tieu_lose", tx: "a2_tieu_test" } },
    a2_tieu_win: { chapter: "Arc 2", title: "Tiêu sư Long Môn", place: "yard2", time: "day", cast: ["shen", "long_tieu_chu"],
      text: [
        "Mã Đại lồm cồm bò dậy, xoa cằm rồi phá lên cười, vỗ vai Shen đôm đốp.",
        "> Được! Thằng nhóc này đánh không giống ai, nhưng đánh được!",
        "Long Chấn Uy gật đầu: \"Từ nay ngươi là tiêu sư tập sự. Việc áp tiêu ngắn ngày nào cũng có, tới đây nhận.\"",
      ],
      onEnter: { quest: { q_tieu_su: "done" }, rep: { long_mon: 50 }, meet: ["long_tieu_chu", "phuong_nhi"], exp: 600, money: 500, flag: "tieu_su", mark: "tieu", item: ["dai_tieu_su", 1] },
      choices: [{ t: "Nhận việc", go: "@hub" }] },
    a2_tieu_lose: { chapter: "Arc 2", title: "Chưa đủ", place: "yard2", time: "day", cast: ["shen", "long_tieu_chu"],
      text: ["Shen nằm ngửa giữa sân. Mã Đại chống đao, thở hồng hộc: \"Khá đấy, nhưng chưa đủ. Mai quay lại.\""],
      choices: [{ t: "Về", go: "@hub" }] },

    a2_kidnap: { chapter: "Arc 2", title: "Tin dữ", place: "yard2", time: "day", cast: ["shen", "long_tieu_chu"],
      text: [
        "Sân tiêu cục rối loạn. Một tiêu sư máu me đầy người được khiêng vào.",
        "> Tiêu chủ! Đoàn hàng đi Phong Lâm bị Hắc Phong Trại chặn ở đèo. Tiểu thư… tiểu thư bị chúng bắt mất rồi!",
        "Long Chấn Uy đập vỡ chén trà trong tay. Nhưng nửa số tiêu sư giỏi nhất đang áp tiêu xa, chưa về.",
        "> Shen. Ta biết ngươi mới tới. Nhưng Hắc Phong Sơn chỉ cách một ngày đường. Ngươi có dám đi không?",
      ],
      onEnter: { flag: "kidnap_seen", mark: "kidnap", quest: { q_cuu_phuong: { name: "Cứu Long Phượng Nhi", desc: "Tới Hắc Phong Sơn (1 ngày đường từ Lạc Hà), cứu con gái tiêu chủ khỏi tay sơn tặc. Quá 6 ngày, tiêu cục sẽ phải nộp tiền chuộc.", dueDays: 6 } } },
      choices: [
        { t: "\"Tôi đi.\"", go: "@hub", eff: { aff: { long_tieu_chu: 10 }, rep: { long_mon: 10 }, moral: 3 } },
        { t: "\"Tôi đi. Nhưng cần tiền thuốc men trước.\"", go: "@hub", eff: { money: 1000, anti: 1 } },
      ] },

    a2_hac_phong: { chapter: "Arc 2", title: "Hắc Phong Trại", place: "camp", time: "dusk", cast: ["shen", "son_tac"],
      text: [
        "Hắc Phong Trại dựng trên một mỏm đá, hàng rào gỗ nhọn, đuốc cháy leo lét. Hai tên lâu la gác cổng đang chia nhau vò rượu cướp được.",
        "Từ trong trại vọng ra tiếng một cô gái chửi rất to, rất rõ, không có vẻ gì sợ hãi.",
      ],
      choices: [
        { t: "Xông thẳng vào cổng", go: "a2_hp_gate" },
        { t: "Leo vách đá sau trại, lẻn vào", check: { stat: "AGI", dc: 14, bonusTrait: { anh_tu: 5 } }, go: "a2_hp_sneak", fail: "a2_hp_gate" },
      ] },
    a2_hp_gate: { chapter: "Arc 2", title: "Cổng trại", place: "camp", time: "night", cast: ["shen", "son_tac"],
      text: ["> Có kẻ phá trại!", "Hai tên cướp vứt vò rượu, rút đao xông ra."],
      fight: { foes: ["cuop_duong", "cuop_duong"], opts: { canFlee: true }, win: "a2_hp_boss", lose: "a2_hp_lose", tx: "a2_hp_gate" } },
    a2_hp_sneak: { chapter: "Arc 2", title: "Sau trại", place: "camp", time: "night", cast: ["shen"],
      text: ["Shen leo qua vách đá, lần theo tiếng chửi tới một căn nhà gỗ. Không một tên lâu la nào hay biết.", "Nhưng trước cửa, đầu mục Hắc Phong Trại đang ngồi mài đao."],
      onEnter: { exp: 500 },
      choices: [{ t: "Tiến lên", go: "a2_hp_boss" }] },
    a2_hp_boss: { chapter: "Arc 2", title: "Đầu mục Hắc Phong", place: "camp", time: "night", cast: ["shen", "dau_muc"],
      text: [
        "Gã đầu mục mặt rỗ đứng dậy, vác thanh đại đao lên vai.",
        "> Long Chấn Uy hết người rồi à, phải sai một thằng nhãi tới chết thay?",
      ],
      fight: { foes: ["son_tac_dau"], opts: { solo: true, canFlee: true }, win: "a2_hp_win", lose: "a2_hp_lose", tx: "a2_hp_boss" } },
    a2_hp_lose: { chapter: "Arc 2", title: "Rút lui", place: "road", time: "night", cast: ["shen"],
      text: ["Shen bị đánh văng xuống sườn dốc, lăn mấy vòng mới dừng. Phải nghỉ ngơi rồi quay lại."],
      onEnter: { place: "hac_phong" }, choices: [{ t: "Rút về trạm nghỉ chân", go: "@hub" }] },
    a2_hp_win: { chapter: "Arc 2", title: "Long Phượng Nhi", place: "camp", time: "night", cast: ["shen", "phuong_nhi"],
      text: [
        "Cửa nhà gỗ bật ra. Một thiếu nữ mặc áo đỏ, tay bị trói, chân đá văng xác tên lâu la cuối cùng.",
        "> Ngươi là ai? Người của cha ta à? Chậm quá đấy! Cởi trói nhanh lên, tay ta tê hết rồi.",
        "Shen cởi trói. Long Phượng Nhi xoa cổ tay, liếc cậu từ đầu đến chân rồi bất ngờ cúi đầu, giọng nhỏ hẳn đi: \"…Cảm ơn.\"",
      ],
      onEnter: { quest: { q_cuu_phuong: "done" }, exp: 3000, aff: { phuong_nhi: 20, long_tieu_chu: 20 }, rep: { long_mon: 150, lac_ha: 50 }, moral: 15, flag: "rescued_phuong",
        ledger: { actor: "Shen", action: "Một mình phá Hắc Phong Trại, cứu Long Phượng Nhi", target: "Hắc Phong Trại", witness: "Long Phượng Nhi, sơn tặc sống sót", pending: "Long Môn Tiêu Cục giúp Shen vào Kim Lăng", trigger: "Khi cần vào thành lúc bị truy nã (Arc 3)" } },
      choices: [{ t: "Đưa cô ấy về Lạc Hà", go: "a2_hp_reward" }] },
    a2_hp_reward: { chapter: "Arc 2", title: "Ơn nghĩa Long Môn", place: "yard2", time: "day", cast: ["shen", "long_tieu_chu", "phuong_nhi"],
      text: [
        "Long Chấn Uy ôm chầm lấy con gái rồi quay sang Shen, cúi đầu thật sâu, điều mà cả trấn Lạc Hà chưa ai thấy.",
        "> Ơn này Long Môn ghi nhớ. Con ngựa hồng ngoài chuồng từ nay là của ngươi. Đi đâu cũng nhanh hơn.",
      ],
      onEnter: { place: "lac_ha", money: 1500, giveHorse: "ngua_hong", time: 1 },
      choices: [{ t: "Nhận", go: "@hub" }] },

    a2_phong_lam: { chapter: "Arc 2", title: "Trạm tiêu Phong Lâm", place: "town", time: "day", cast: ["shen"],
      text: ["Shen giao hàng cho trạm tiêu Phong Lâm. Lão chưởng quỹ kiểm hàng, đếm ngày trên lịch."],
      choices: [{ t: "Nhận tiền công", go: "@hub", eff: { phongLam: true } }] },

    /* ---------- Lão Hồ ---------- */
    a2_laoho_1: { chapter: "Arc 2", title: "Đêm Thẩm gia trang cháy", place: "inn", time: "night", cast: ["shen", "lao_ho"],
      text: [
        "Rượu đã ngà ngà, Lão Hồ bỗng đặt bát xuống. Giọng lão không còn lè nhè.",
        "> Mười năm trước, ta tới Thẩm gia trang chậm nửa canh giờ. Lửa cháy đỏ trời. Trên tường có dấu bàn tay đen, Thiên Ma Chưởng, ai cũng nói là Ma Giáo làm.",
        "> Nhưng ta từng giao thủ với người Thiên Ma Giáo. Thiên Ma Chưởng thật thì dấu tay lõm vào, xung quanh đá cháy thành than. Dấu ở Thẩm gia chỉ in nông, rìa sắc như dùng khuôn đóng lên.",
        "> Ta lôi được một thằng bé bảy tuổi ra khỏi đống đổ nát, cõng nó lên Thanh Vân. Ngươi đoán xem thằng bé đó là ai?",
        "> Còn một chuyện nữa. Tên thủy phỉ Hắc Giao trên sông này đang buôn độc dược cho một tổ chức tên Huyết Ảnh Lâu. Độc châm của bọn sát thủ đêm đó cũng là loại độc ấy. Nếu ngươi muốn bắt đầu từ đâu, hãy bắt đầu từ hắn.",
      ],
      onEnter: { flag: "laoho_1", aff: { lao_ho: 5 }, exp: 800, quest: { q_hac_giao: { name: "Thủy phỉ Hắc Giao", desc: "Dò ra thủy trại của Hắc Giao (ban đêm ở bến sông, hoặc mua tin ở chợ đen) rồi tấn công. Lão Hồ nghe nói hắn sắp nhổ trại rời Lạc Hà.", dueFrom: "arrive", dueDays: 24 } },
        ledger: { actor: "Lão Hồ", action: "Kể rằng dấu Thiên Ma Chưởng ở Thẩm gia trang là giả", target: "—", witness: "Shen", pending: "Kẻ làm giả dấu chưởng vẫn đứng ngoài ánh sáng", trigger: "Võ Lâm Đại Hội (Arc 3)" } },
      choices: [{ t: "Siết chặt bát rượu", go: "@hub" }] },
    a2_laoho_2: { chapter: "Arc 2", title: "Thẩm Kiếm Phong", place: "inn", time: "night", cast: ["shen", "lao_ho"],
      text: [
        "> Cha ngươi tên Thẩm Kiếm Phong. Ông ấy không phải cao thủ đứng đầu thiên hạ, nhưng là người duy nhất ta chịu gọi một tiếng đại ca.",
        "> Thẩm gia giữ một bộ bí thuật tên Thiên Mạch Chân Giải. Ngươi biết nó dùng để làm gì không? Chữa kinh mạch bế tắc. Ngươi mang chứng Tuyệt Mạch, nghĩ xem, có phải trùng hợp không?",
        "Lão Hồ đặt cây gậy trúc xanh lên bàn.",
        "> Cái Bang không giàu, không sang, nhưng tai mắt ở khắp thiên hạ. Ngươi muốn tìm kẻ thù thì cần có người dò đường. Nếu muốn, cứ nói với ta.",
      ],
      onEnter: { flag: "laoho_2", aff: { lao_ho: 5 }, exp: 1000 },
      choices: [{ t: "Ghi nhớ từng lời", go: "@hub" }] },

    /* ---------- Kỳ ngộ Arc 2: Ông lão đánh cá ---------- */
    a2_fisher: { chapter: "Arc 2", title: "Bến sông lúc chiều", place: "river", time: "dusk", cast: ["shen", "ong_lao_ca", "thuy_phi"],
      text: [
        "Hai tên thủy phỉ đang đá lật thúng cá của một ông lão gầy gò, đòi tiền \"phí bến\".",
        "> Không có tiền thì lấy thuyền! Lão già sắp xuống lỗ rồi còn chèo đò làm gì!",
        "Ông lão chỉ cúi đầu nhặt cá, tay chậm rãi, không run một chút nào.",
      ],
      choices: [
        { t: "Bước ra can thiệp, không đòi gì", go: "a2_fisher_fight", eff: { flag: "fisher_free" } },
        { t: "Can thiệp, rồi nói khéo ông lão trả công", go: "a2_fisher_fight" },
        { t: "Không phải việc của mình", go: "@hub", eff: { flag: "fisher_ignored", moral: -3 } },
      ] },
    a2_fisher_fight: { chapter: "Arc 2", title: "Thủy phỉ", place: "river", time: "dusk", cast: ["shen", "thuy_phi"],
      text: ["> Lại thêm một thằng muốn chết!"],
      fight: { foes: ["thuy_phi", "thuy_phi"], opts: { canFlee: true }, win: "a2_fisher_win", lose: "a2_fisher_lose", tx: "a2_fisher" } },
    a2_fisher_lose: { chapter: "Arc 2", title: "Bị đánh xuống sông", place: "river", time: "dusk", cast: ["shen", "ong_lao_ca"],
      text: ["Shen bị đẩy xuống sông. Khi bò lên bờ, bọn thủy phỉ đã đi, thuyền ông lão cũng không còn. Trên bến chỉ còn mấy con cá giãy đành đạch."],
      onEnter: { flag: "fisher_ignored" }, choices: [{ t: "Về", go: "@hub" }] },
    a2_fisher_win: { chapter: "Arc 2 · Kỳ ngộ", title: "Ông lão đánh cá", place: "river", time: "dusk", cast: ["shen", "ong_lao_ca"],
      text: [
        "Bọn thủy phỉ bỏ chạy. Ông lão nhặt nốt con cá cuối cùng rồi nhìn Shen rất lâu.",
        "> Thân thể Tuyệt Mạch, đánh nhau toàn bằng gân cốt. Hay. Ba mươi năm trước ta cũng từng đánh như thế ở Thiếu Lâm, trước khi hoàn tục.",
      ],
      choices: [
        { t: "Xin ông lão chỉ dạy", go: "a2_fisher_teach", req: { flag: "fisher_free" } },
        { t: "Nhận một ít bạc lẻ rồi đi", go: "@hub", eff: { money: 300, flag: "fisher_paid" } },
      ] },
    a2_fisher_teach: { chapter: "Arc 2 · Kỳ ngộ", title: "Bát Quái Côn", place: "river", time: "night", cast: ["shen", "ong_lao_ca"],
      text: [
        "Ông lão nhặt một cây sào tre, xoay một vòng. Nước sông dưới chân tạt lên thành hình bát quái rồi rơi xuống.",
        "> Côn pháp này ta học ở Thiếu Lâm, gọi là Bát Quái Côn. Hoặc nếu ngươi không thích học, cây Ô Mộc Côn dưới khoang thuyền kia cũng bỏ không lâu rồi. Chọn một.",
        "[KỲ NGỘ: Ông lão đánh cá trên sông Lạc Hà.]",
      ],
      onEnter: { meet: "ong_lao_ca", aff: { ong_lao_ca: 30 }, flag: "kyngo_a2", moral: 5 },
      choices: [
        { t: "Học Bát Quái Côn (đánh 3 địch, mỗi địch ×1.1, 30 Khí Huyết, hồi 3 lượt; cần trường côn)", go: "@hub", eff: { skill: "bat_quai_con", exp: 800,
          ledger: { actor: "Ông lão đánh cá", action: "Truyền Bát Quái Côn cho Shen", target: "Shen", witness: "—", pending: "Ông lão là cựu Côn Tông Thiếu Lâm", trigger: "Khi Shen tới Thiếu Lâm" } } },
        { t: "Nhận Ô Mộc Côn (Tinh, Rank D: Công +11, VIT +3, Giáp +4; cần Lv 12, STR 15)", go: "@hub", eff: { item: ["o_moc_con", 1], exp: 800,
          ledger: { actor: "Ông lão đánh cá", action: "Tặng Shen cây Ô Mộc Côn", target: "Shen", witness: "—", pending: "Ông lão là cựu Côn Tông Thiếu Lâm", trigger: "Khi Shen tới Thiếu Lâm" } } },
      ] },

    /* ---------- Thủy trại Hắc Giao ---------- */
    a2_scout: { chapter: "Arc 2", title: "Thủy trại ban đêm", place: "river", time: "night", cast: ["shen", "duong_nhat_anh"],
      text: [
        "Shen men theo bờ lau sậy đến khúc sông hẹp dưới vách đá. Thủy trại của Hắc Giao dựng trên cọc gỗ, đèn lồng đỏ treo lủng lẳng.",
        "Một bàn tay đặt lên vai cậu từ phía sau. Không có tiếng bước chân.",
        "> Suỵt. Đừng quay lại vội. Ngươi mà la lên thì cả hai ta cùng chết.",
        "Kẻ đó là một công tử trẻ mặc áo lam, thắt lưng giắt một hàng phi tiêu mảnh như lá liễu. Hắn mỉm cười.",
        "> Đường Nhất Ảnh, Đường Môn. Ta tới lấy một cuốn sổ trong trại của Hắc Giao. Cuốn sổ ghi những chuyến độc dược nhà ta bán cho hắn. Nếu nó lọt ra ngoài, Đường Môn mất mặt. Ngươi thì sao?",
      ],
      onEnter: { meet: "duong_nhat_anh", flag: "a2_scouted", exp: 600 },
      choices: [
        { t: "\"Ta muốn hỏi hắn về Huyết Ảnh Lâu. Hợp tác nhé?\"", go: "@hub", eff: { flag: "ally_duong", aff: { duong_nhat_anh: 15 } } },
        { t: "\"Việc của ngươi, ta không quản. Ta tự làm.\"", go: "@hub", eff: { aff: { duong_nhat_anh: -5 } } },
      ] },
    a2_lair: { chapter: "Arc 2", title: "Tấn công thủy trại", place: "lair", time: "night", cast: ["shen", "thuy_phi"],
      text: [
        "Shen lội qua lớp bùn dưới cọc gỗ rồi trèo lên sàn trại. Hai tên thủy phỉ gác đèn quay lại, trợn mắt.",
      ],
      onEnter: { cond: { req: { flag: "ally_duong" }, note: "Một loạt phi tiêu lá liễu bay vụt qua đầu Shen, cắt đứt dây đèn lồng. Đường Nhất Ảnh đã vào từ phía bên kia." } },
      fight: { foes: ["thuy_phi", "thuy_phi"], opts: { canFlee: true }, win: "a2_lair_boss", lose: "a2_lair_lose", tx: "a2_lair" } },
    a2_lair_boss: { chapter: "Arc 2", title: "Hắc Giao", place: "lair", time: "night", cast: ["shen", "hac_giao"],
      text: [
        "Cửa khoang chính bật tung. Hắc Giao bước ra, mình trần xăm hình giao long kín lưng, tay cầm cây ngư xoa ba mũi đen bóng.",
        "> Đường Môn sai người tới? Hay Long Môn? Thôi, ai cũng được. Sông Lạc Hà không thiếu chỗ chôn.",
      ],
      onEnter: { cond: { req: { flag: "ally_duong" }, note: "Đường Nhất Ảnh phóng ba mũi tiêu cắm vào vai Hắc Giao trước khi bị hắn hất văng xuống sông. Hắc Giao chảy máu, sức đã giảm." } },
      fight: { foes: ["hac_giao"], opts: { solo: true, canFlee: true, foeHpMulFlag: "ally_duong" }, win: "a2_lair_win", lose: "a2_lair_lose", tx: "a2_hac_giao" } },
    a2_lair_lose: { chapter: "Arc 2", title: "Rút khỏi thủy trại", place: "river", time: "night", cast: ["shen"],
      text: ["Shen nhảy xuống sông, bơi ngược dòng trong đêm tối. Thủy trại vẫn đứng đó. Phải nghỉ ngơi, chuẩn bị kỹ hơn rồi quay lại."],
      choices: [{ t: "Về trấn", go: "@hub" }] },
    a2_lair_win: { chapter: "Arc 2", title: "Sổ sách thủy trại", place: "lair", time: "night", cast: ["shen", "hac_giao"],
      text: [
        "Hắc Giao quỳ sụp trên sàn gỗ, cây ngư xoa gãy làm đôi.",
        "> Ta… ta chỉ là người chở hàng! Hàng đưa cho người đeo nhẫn đồng hình giọt máu ở Kim Lăng! Ta không biết gì hơn!",
        "Trong khoang chính có một cuốn sổ bọc da cá. Shen lật vài trang: tên Đường Môn, tên các loại độc, và ở trang cuối là một dòng viết vội: \"Lô Huyết Ảnh Độc Châm, mười năm trước, giao tại Thẩm gia trang.\"",
      ],
      onEnter: { quest: { q_hac_giao: "done" }, item: ["so_sach_giao", 1], exp: 2500, rep: { lac_ha: 150, huyet_anh: -80 }, flag: "hac_giao_down", moral: 10,
        ledger: { actor: "Shen", action: "Đánh bại thủy phỉ Hắc Giao, lấy sổ sách thủy trại", target: "Hắc Giao", witness: "Thủy phỉ, dân chài" , pending: "Người đeo nhẫn đồng hình giọt máu ở Kim Lăng", trigger: "Arc 3 · Kim Lăng" } },
      choices: [
        { t: "Giao cuốn sổ cho Đường Nhất Ảnh", go: "a2_ledger_done", req: { flag: "ally_duong" }, eff: { take: ["so_sach_giao", 1], aff: { duong_nhat_anh: 25 }, rep: { duong_mon: 120 }, flag: "gave_duong" } },
        { t: "Mang cuốn sổ về cho Lão Hồ", go: "a2_ledger_done", eff: { take: ["so_sach_giao", 1], aff: { lao_ho: 15 }, rep: { cai_bang: 120 }, flag: "gave_laoho" } },
        { t: "Giữ cuốn sổ, chưa đưa cho ai", go: "a2_ledger_done", eff: { flag: "kept_ledger", anti: 1 } },
      ] },
    a2_ledger_done: { chapter: "Arc 2", title: "Bình minh trên sông", place: "river", time: "dusk", cast: ["shen"],
      text: [
        "Mặt trời lên trên sông Lạc Hà. Dân chài kéo nhau ra bến, nhìn thủy trại cháy âm ỉ mà không ai dám tin.",
        "\"Thủy phỉ Hắc Giao bị một tên tiêu sư trẻ đánh gục\": tin ấy lan khắp trấn trước giờ cơm trưa.",
      ],
      choices: [{ t: "Về khách điếm", go: "a2_choice" }] },

    a2_assassin: { chapter: "Arc 2", title: "Khách lạ lúc nửa đêm", place: "inn", time: "night", cast: ["shen", "hac_y"],
      text: [
        "Shen choàng tỉnh. Ánh trăng lọt qua khe cửa sổ, in một cái bóng mảnh trên vách.",
        "Lưỡi kiếm đâm xuyên qua tấm chăn, đúng chỗ cậu vừa nằm.",
        "> Huyết Ảnh Lâu không quên ai đụng vào người của mình.",
      ],
      onEnter: { flag: "assassin_came" },
      fight: { foes: ["sat_thu"], opts: { solo: true, canFlee: true }, win: "a2_assassin_win", lose: "a2_assassin_lose", tx: "a2_assassin" } },
    a2_assassin_win: { chapter: "Arc 2", title: "Nhẫn đồng", place: "inn", time: "night", cast: ["shen"],
      text: ["Sát thủ gục xuống sàn. Trên ngón tay hắn có một chiếc nhẫn đồng hình giọt máu. Huyết Ảnh Lâu đã biết Shen là ai."],
      onEnter: { rep: { huyet_anh: -30 }, ledger: { actor: "Huyết Ảnh Lâu", action: "Cử sát thủ ám sát Shen tại khách điếm Duyệt Lai", target: "Shen", witness: "Tiểu nhị", pending: "Huyết Ảnh Lâu sẽ cử người mạnh hơn", trigger: "Arc 3–4" } },
      choices: [{ t: "Không ngủ lại được nữa", go: "@hub" }] },
    a2_assassin_lose: { chapter: "Arc 2", title: "Thoát chết", place: "inn", time: "night", cast: ["shen", "lao_ho"],
      text: ["Lưỡi kiếm sắp đâm xuống thì một cây gậy trúc xanh từ đâu bay tới, đánh bật nó đi. Sát thủ biến mất qua cửa sổ.", "> Ngủ cũng phải để một mắt mở chứ, thằng ngốc. — tiếng Lão Hồ vọng từ mái nhà."],
      onEnter: { aff: { lao_ho: 5 } }, choices: [{ t: "…", go: "@hub" }] },

    a2_kidnap_late: { chapter: "Arc 2", title: "Tiền chuộc", place: "yard2", time: "day", cast: ["shen", "long_tieu_chu"],
      text: [
        "Tin từ Long Môn truyền tới: quá hạn chờ, Long Chấn Uy đã bán hai xe hàng, mang năm trăm lượng bạc lên Hắc Phong Trại chuộc con gái.",
        "Long Phượng Nhi được thả về, gầy rộc, không nói một lời với ai. Khi gặp Shen, tiêu chủ chỉ gật đầu một cái rồi quay đi.",
      ],
      onEnter: { quest: { q_cuu_phuong: "fail" }, rep: { long_mon: -40 }, aff: { long_tieu_chu: -10, phuong_nhi: -10 }, flag: "phuong_ransomed",
        ledger: { actor: "Long Môn Tiêu Cục", action: "Nộp tiền chuộc Long Phượng Nhi cho Hắc Phong Trại", target: "Hắc Phong Trại", witness: "Cả trấn Lạc Hà", pending: "Hắc Phong Trại giàu lên, càng lộng hành", trigger: "—" } },
      choices: [{ t: "…", go: "@hub" }] },
    a2_hacgiao_gone: { chapter: "Arc 2", title: "Thủy trại bỏ trống", place: "river", time: "dusk", cast: ["shen", "lao_ho"],
      text: [
        "Sáng nay dân chài kéo nhau ra bến: thủy trại dưới vách đá chỉ còn trơ cọc gỗ. Hắc Giao đã nhổ trại trong đêm, xuôi dòng về phía đông, mang theo cả cuốn sổ.",
        "Lão Hồ ngồi trên mũi thuyền, nhổ toẹt xuống nước.",
        "> Chậm một bước. Thôi, sông nào rồi cũng chảy về Kim Lăng. Đằng nào cũng phải gặp lại.",
      ],
      onEnter: { quest: { q_hac_giao: "fail" }, flag: "hac_giao_gone",
        ledger: { actor: "Hắc Giao", action: "Rời Lạc Hà xuôi về Kim Lăng, mang theo sổ sách độc dược", target: "—", witness: "Dân chài", pending: "Manh mối Thẩm gia trang trôi về Kim Lăng", trigger: "Arc 3 · Kim Lăng" } },
      choices: [{ t: "Về khách điếm", go: "a2_choice" }] },

    /* ---------- Kết Arc 2 ---------- */
    a2_choice: { chapter: "Arc 2 · Kết", title: "Ngã rẽ", place: "inn", time: "day", cast: ["shen", "lao_ho"],
      text: [
        "Tối ấy, khách điếm Duyệt Lai mở tiệc. Long Chấn Uy bao trọn tầng hai. Lão Hồ ngồi gác chân lên ghế, uống không ngừng.",
        "> Một tháng nữa, Kim Lăng mở Võ Lâm Đại Hội Thiếu Niên. Minh chủ Tạ Thiên Hành đích thân chủ trì. Kẻ đeo nhẫn giọt máu ở Kim Lăng, kẻ làm giả dấu Thiên Ma Chưởng… nếu muốn tìm, không có chỗ nào tốt hơn.",
        "> Nhưng đi một mình thì chết. Ngươi định đứng về phía ai?",
      ],
      choices: [
        { t: "Gia nhập Cái Bang theo Lão Hồ", go: "a2_end", eff: { flag: "sect_cai_bang", rep: { cai_bang: 100 }, aff: { lao_ho: 10 } } },
        { t: "Nhận lời mời của Đường Môn", go: "a2_end", req: { flag: "ally_duong" }, eff: { flag: "sect_duong_mon", rep: { duong_mon: 100 }, aff: { duong_nhat_anh: 10 } } },
        { t: "Làm tiêu sư chính thức của Long Môn", go: "a2_end", req: { flag: "tieu_su" }, eff: { flag: "sect_long_mon", rep: { long_mon: 100 }, aff: { long_tieu_chu: 10 } } },
        { t: "Không theo ai. Một mình một kiếm", go: "a2_end", eff: { flag: "sect_none", anti: 1 } },
      ] },
    a2_end: { chapter: "Arc 2 · Kết", title: "Hướng về Kim Lăng", place: "town", time: "dusk", cast: ["shen"],
      text: [
        "Shen đứng trên bến Lạc Hà nhìn dòng sông chảy về phía đông, nơi có Kim Lăng.",
        "Mười ngày trước, cậu còn là một tạp dịch bị đánh gần chết sau bếp. Giờ đây, cậu có một cái tên trên giang hồ, một mối thù chưa rõ mặt, và một con đường.",
        "[Kết thúc Arc 2. Arc 3 · Võ Lâm Đại Hội Thiếu Niên sẽ ra mắt trong bản cập nhật tới.]",
        "[Có thể tiếp tục tự do ở Lạc Hà: luyện công, đánh lôi đài, áp tiêu, săn thú. Tiến trình được lưu.]",
      ],
      onEnter: { flag: "a2_done", exp: 1500 },
      choices: [{ t: "Tiếp tục tự do ở Lạc Hà", go: "@hub" }] },
  });
})(typeof window !== "undefined" ? window : globalThis);
