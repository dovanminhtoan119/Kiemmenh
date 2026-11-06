/* =====================================================================
   KIẾM MỆNH · MỞ ĐẦU & ARC 1 — TẠP DỊCH THANH VÂN
   Dòng bắt đầu bằng ">" là lời thoại, "[" là thông báo Hệ Thống.
   trend = dấu vết ẩn hình thành võ công riêng (người chơi không thấy).
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  KM.SCENES = KM.SCENES || {};
  Object.assign(KM.SCENES, {
    /* ======================= MỞ ĐẦU ======================= */
    p_rain: { chapter: "Mở đầu · Đêm mưa", title: "Sau bếp Thanh Vân", place: "kitchen", time: "rain", cast: ["shen", "tieu_hao", "ly_tam"],
      text: [
        "Mưa đổ xuống núi Thanh Vân như trút. Sau dãy bếp, nước từ mái ngói chảy thành dòng, cuốn theo tro củi đen sì.",
        "Shen nằm co trên nền đá. Năm đệ tử ngoại môn đứng vây quanh, gậy tre còn nhỏ nước. Môi cậu rách, một bên mắt sưng húp, mỗi lần thở là sườn trái lại nhói lên.",
        "> Tạp dịch mà cũng dám mò vào Tàng Kinh Các? Nói! Thanh Vân Kiếm Phổ tầng ba đâu?",
        "Người hỏi là Tiêu Hạo, sư huynh nội môn, áo lụa xanh không dính một hạt mưa nhờ chiếc ô đệ tử cầm hộ. Hắn nói chậm rãi, như đang hỏi giá một mớ rau.",
        "Shen chưa từng đặt chân vào Tàng Kinh Các. Cậu là tạp dịch, mười năm nay chỉ biết bổ củi, gánh nước, rửa bát. Cậu sinh ra đã mắc chứng Tuyệt Mạch: kinh mạch bế tắc, không luyện nổi một tia nội lực.",
        "> Không nói à? Lý Tam, cho nó nhớ.",
      ],
      choices: [
        { t: "Cuộn người lại, cắn răng chịu đòn", go: "p_system", eff: { trend: { thu: 2, minh: 1 } } },
        { t: "Vùng dậy, đấm thẳng vào mặt Lý Tam", go: "p_system", eff: { trend: { tay: 2, cong: 2, nang: 1 } } },
        { t: "Lăn khỏi vòng vây, lao về phía bóng tối", go: "p_system", eff: { trend: { nhanh: 2, am: 2 } } },
      ] },

    p_system: { chapter: "Mở đầu", title: "Thiên Mệnh Hệ Thống", place: "kitchen", time: "rain", cast: ["shen"],
      text: [
        "Gậy tre giáng xuống. Thế giới tối sầm lại.",
        "Trong bóng tối ấy, Shen nghe thấy một âm thanh lạ, như tiếng kiếm rút khỏi vỏ. Rồi một khung chữ màu vàng nhạt hiện lên ngay sau mí mắt.",
        "[Phát hiện ký chủ Tuyệt Mạch. Sinh mệnh dưới 20%. Khởi động Thiên Mệnh Hệ Thống.]",
        "[Thân thể Tuyệt Mạch: Lực, Thân Pháp, Căn Cốt ×1.2. Không có Nội Lực. Tài nguyên thay thế: Khí Huyết.]",
        "[Khai mở Mạch Ẩn: một kênh duy nhất dành cho võ công do chính ký chủ sáng tạo. Mạch Ẩn sẽ thành hình theo cách ký chủ chiến đấu.]",
        "[Hồi phục khẩn cấp: 100% HP. Chỉ một lần.]",
        "[Vui lòng chọn 2 Đặc tính. Lựa chọn không thể thay đổi.]",
      ],
      onEnter: { heal: 1, flag: "system" },
      special: "traits", go: "p_tut" },

    p_tut: { chapter: "Mở đầu", title: "Đứng dậy", place: "kitchen", time: "rain", cast: ["shen", "ly_tam"],
      text: [
        "Shen mở mắt. Cơn đau vẫn còn, nhưng như đã lùi ra xa, nhường chỗ cho một luồng hơi ấm chạy dọc sống lưng.",
        "Tiêu Hạo đã bỏ đi, bỏ lại một câu: \"Mai hội đồng xử nó, giờ đánh cho nhớ là được.\" Chỉ còn Lý Tam ở lại, xắn tay áo, nhổ nước bọt.",
        "> Còn bò dậy được à? Để tao giúp mày nằm xuống lần nữa.",
        "[Chiến đấu. Mỗi đòn tấn công sẽ gieo xúc xắc: né, chí mạng, biến thiên sát thương. Có thể Quan sát đối thủ mà không mất lượt.]",
      ],
      fight: { foes: ["ly_tam"], opts: { solo: true, canFlee: false }, win: "p_tut_win", lose: "p_tut_lose" } },

    p_tut_win: { chapter: "Mở đầu", title: "Một cú đấm", place: "kitchen", time: "rain", cast: ["shen"],
      text: [
        "Lý Tam ngã ngửa vào vũng nước, ôm mặt kêu oai oái rồi bò dậy chạy mất, không ngoái lại.",
        "Shen đứng giữa mưa, nhìn bàn tay mình. Mười năm bổ củi, lần đầu tiên nó đánh trúng một người.",
        "Rồi đầu gối cậu khuỵu xuống.",
      ],
      onEnter: { flag: "beat_ly_tam", rep: { thanh_van: 5 }, trend: { cong: 1 } },
      choices: [{ t: "…", go: "a1_morning" }] },

    p_tut_lose: { chapter: "Mở đầu", title: "Nằm xuống", place: "kitchen", time: "rain", cast: ["shen"],
      text: [
        "Cú đá cuối cùng hất Shen vào chân tường. Lý Tam phủi tay, cười khẩy rồi bỏ đi.",
        "[Thua không có nghĩa là chết. Hệ Thống đã ghi nhận cách ký chủ chiến đấu.]",
        "Mưa vẫn rơi. Shen lịm đi.",
      ],
      onEnter: { trend: { thu: 1 } },
      choices: [{ t: "…", go: "a1_morning" }] },

    /* ======================= ARC 1 ======================= */
    a1_morning: { chapter: "Arc 1 · Tạp Dịch Thanh Vân", title: "Dược phòng", place: "medic", time: "day", cast: ["shen", "to_van_yen"],
      text: [
        "Mùi thuốc bắc đánh thức Shen. Cậu nằm trên tấm phản trong dược phòng, ngực quấn băng trắng.",
        "Bên cạnh là một thiếu nữ áo xám, tay áo xắn cao, đang giã thuốc. Cậu nhận ra bộ áo của Nga Mi phái. Mấy hôm nay Nga Mi gửi người lên núi trao đổi dược liệu.",
        "> Tỉnh rồi à? Ba xương sườn rạn, hai chỗ bầm tím quanh thận. Người khác nằm mười ngày. Cậu… ba ngày là đi lại được. Lạ thật.",
        "> Ta là Tô Vân Yên. Đêm qua đi hái thuốc, thấy cậu nằm sau bếp.",
        "Ngoài cửa, Tiểu Lục, tạp dịch cùng phòng, thò đầu vào, mặt tái mét.",
        "> Shen! Trưởng lão truyền lệnh rồi: sáng ngày thứ mười hội đồng sẽ xử vụ mất kiếm phổ. Không có chứng cứ thì… nhẹ thì đuổi xuống núi, nặng thì phế tay.",
      ],
      onEnter: { sleep: true, meet: ["to_van_yen", "tieu_luc"], quest: { q_rua_oan: { name: "Rửa oan trước ngày xét xử", desc: "Tìm chứng cứ kẻ thật sự lấy trộm Thanh Vân Kiếm Phổ trước khi hội đồng xét xử vào sáng ngày 10.", deadline: 9 } } },
      choices: [
        { t: "Cảm ơn Tô cô nương đã cứu mạng", go: "a1_intro", eff: { aff: { to_van_yen: 6 }, trend: { minh: 1 } } },
        { t: "Hỏi vì sao một đệ tử Nga Mi lại cứu một tạp dịch", go: "a1_intro", eff: { aff: { to_van_yen: 3 } } },
        { t: "Gượng dậy ngay, không có thời gian nằm", go: "a1_intro", eff: { aff: { to_van_yen: -2 }, trend: { cong: 1, nhanh: 1 } } },
      ] },

    a1_intro: { chapter: "Arc 1", title: "Chín ngày", place: "room", time: "day", cast: ["shen", "tieu_luc"],
      text: [
        "Tiểu Lục kéo Shen về căn phòng tạp dịch ẩm thấp, hạ giọng:",
        "> Ai cũng biết mày không vào Tàng Kinh Các. Nhưng Tiêu sư huynh là đệ tử chân truyền tương lai, lời hắn nặng hơn lời mày cả trăm lần.",
        "> Muốn sống thì phải có chứng cứ. Tao nghe nói đêm nào Tiêu sư huynh cũng ra khỏi Đông viện, chẳng ai biết đi đâu. Rừng sau núi thì ban đêm có sói, mày cẩn thận.",
        "> À, còn chuyện ma ở thác Bạch Long nữa. Người ta đồn đêm khuya nghe tiếng kiếm ngân sau màn nước. Chắc là nói nhảm.",
        "[Thời gian tự do. Mỗi hành động tốn một buổi: sáng, chiều, tối. Đêm khuya chỉ có thể nghỉ.]",
        "[Mục tiêu: tìm đủ manh mối (ít nhất 2) rồi đối chất, hoặc tự ra tay. Hạn chót: sáng ngày 10.]",
        "[Bản đồ: trong thời hạn này chỉ có thể xuống Thôn Hạnh Hoa dưới chân núi (1 ngày đường). Mỗi thôn trấn đều có người nhờ việc: nhiệm vụ nhánh.]",
        "[Đạt Level 5: Mạch Ẩn thành hình, có thể chọn Võ Đạo.]",
      ],
      onEnter: { aff: { tieu_luc: 5 } },
      special: "hub", hub: "thanh_van" },

    /* ---------- Sự kiện trong thời gian tự do ---------- */
    a1_clue_room: { chapter: "Arc 1", title: "Tro giấy trong lò sưởi", place: "room", time: "night", cast: ["shen"],
      text: [
        "Shen lách qua cửa sổ Đông viện khi gã gác cổng đang ngủ gật. Phòng Tiêu Hạo thơm mùi trầm, sách xếp ngay ngắn, không có lấy một hạt bụi.",
        "Trong lò sưởi còn một nắm tro chưa nguội. Cậu lấy que cời khều ra một mẩu giấy cháy dở. Trên đó còn nửa dòng chữ: \"…giao tầng ba vào đêm rằm, chỗ cũ…\". Bên dưới là một dấu ấn hình giọt máu.",
        "Ngoài hành lang có tiếng bước chân. Shen nhét mẩu giấy vào ngực áo rồi trèo ra cửa sổ.",
      ],
      onEnter: { clue: "c_tro", clueName: "Tro giấy cháy dở có ấn giọt máu, hẹn giao \"tầng ba\"", flag: "saw_shadow", exp: 300, trend: { am: 2, nhanh: 1 } },
      choices: [{ t: "Quay về", go: "@hub" }] },
    a1_caught: { chapter: "Arc 1", title: "Bị phát hiện", place: "room", time: "night", cast: ["shen", "de_tu"],
      text: [
        "Chân Shen vừa chạm ngưỡng cửa sổ thì một đệ tử nội môn tuần đêm hét lên:",
        "> Ai đó! Tạp dịch? Mày dám lẻn vào Đông viện à?",
      ],
      fight: { foes: ["de_tu_noi"], opts: { solo: true, canFlee: true }, win: "a1_caught_win", lose: "a1_caught_lose" } },
    a1_caught_win: { chapter: "Arc 1", title: "Chạy thoát", place: "room", time: "night", cast: ["shen"],
      text: ["Gã đệ tử ngã xuống bậc thềm. Shen không đợi hắn kịp gọi người, lao vào bóng tối.", "Ngày mai cả viện sẽ đồn có kẻ lạ đột nhập. Lần sau phải cẩn thận hơn."],
      onEnter: { rep: { thanh_van: -10 } }, choices: [{ t: "Quay về", go: "@hub" }] },
    a1_caught_lose: { chapter: "Arc 1", title: "Ăn đòn", place: "room", time: "night", cast: ["shen"],
      text: ["Shen bị đánh gục, bị lôi ra sân phạt quỳ đến nửa đêm. Lời đồn \"tạp dịch trộm kiếm phổ lại lẻn vào Đông viện\" lan khắp núi trước khi trời sáng."],
      onEnter: { rep: { thanh_van: -25 } }, choices: [{ t: "Quay về", go: "@hub" }] },

    a1_witness: { chapter: "Arc 1", title: "Điều Tiểu Lục giấu", place: "kitchen", time: "day", cast: ["shen", "tieu_luc"],
      text: [
        "Tiểu Lục đặt bó củi xuống, nhìn quanh rồi kéo Shen vào góc kho.",
        "> Tao… tao chưa nói với ai. Đêm mất kiếm phổ, tao đi đổ nước gạo, thấy Tiêu sư huynh từ cửa sau Tàng Kinh Các đi ra, tay cầm một cuộn sách bọc vải đen.",
        "> Tao sợ lắm. Nhưng mày đã cứu tao khỏi bị Lý Tam bắt nạt bao nhiêu lần. Nếu cần, tao sẽ nói trước hội đồng.",
      ],
      onEnter: { clue: "c_nhan_chung", clueName: "Tiểu Lục thấy Tiêu Hạo rời Tàng Kinh Các đêm mất kiếm phổ", exp: 300, aff: { tieu_luc: 5 }, trend: { minh: 2 } },
      choices: [{ t: "Nắm chặt tay Tiểu Lục", go: "@hub" }] },

    a1_yen_hint: { chapter: "Arc 1", title: "Bóng người trong rừng", place: "medic", time: "day", cast: ["shen", "to_van_yen"],
      text: [
        "Tô Vân Yên vừa băng lại vết thương cho Shen vừa nói, giọng thản nhiên như kể chuyện thời tiết:",
        "> Đêm qua ta đi hái Dạ Quang Thảo ở rừng sau núi, thấy một người áo xanh gặp một kẻ áo đen dưới gốc tùng rỗng. Áo xanh… giống y áo sư huynh Tiêu của các cậu.",
        "> Ta không biết họ nói gì. Nhưng kẻ áo đen đi không để lại tiếng động, không phải người thường. Đây, cầm lấy, phòng khi cần.",
      ],
      onEnter: { flag: "saw_shadow", item: ["kim_sang", 2], aff: { to_van_yen: 4 } },
      choices: [{ t: "Cảm ơn", go: "@hub" }] },

    a1_shadow: { chapter: "Arc 1", title: "Gốc tùng rỗng", place: "forest", time: "night", cast: ["shen", "hac_y"],
      text: [
        "Shen nấp sau tảng đá phủ rêu gần gốc tùng rỗng. Gần nửa đêm, một bóng đen lướt tới, thò tay vào hốc cây.",
        "Hắn lấy ra một ống trúc, rồi khựng lại, quay đầu về phía tảng đá.",
        "> Chuột ở đâu ra thế này. Thôi thì cho ngươi đi theo Tiêu công tử luôn.",
      ],
      fight: { foes: ["hac_y_nhan"], opts: { solo: true, canFlee: true }, win: "a1_shadow_win", lose: "a1_shadow_lose", tx: "a1_shadow" } },
    a1_shadow_win: { chapter: "Arc 1", title: "Thư mật", place: "forest", time: "night", cast: ["shen"],
      text: [
        "Kẻ áo đen trúng đòn, lùi lại, ném một nắm khói độc rồi biến mất vào rừng. Ống trúc rơi lăn trên mặt đất.",
        "Bên trong là một lá thư đóng ấn giọt máu: \"Tiêu công tử: tầng ba đã nhận, phần còn lại giao đêm rằm. Huyết Ảnh Lâu.\"",
        "[Huyết Ảnh Lâu: tổ chức sát thủ bí ẩn. Thông tin đã được ghi vào Sổ Ân Oán.]",
      ],
      onEnter: { clue: "c_thu_mat", clueName: "Thư mật Huyết Ảnh Lâu gửi \"Tiêu công tử\"", item: ["thu_mat", 1], exp: 400,
        ledger: { actor: "Shen", action: "Đánh lui sứ giả Huyết Ảnh Lâu, lấy thư mật", target: "Huyết Ảnh Lâu", witness: "Không ai", pending: "Huyết Ảnh Lâu có thể truy tìm kẻ lấy thư", trigger: "Khi Shen xuất hiện công khai ở trấn lớn" } },
      choices: [{ t: "Quay về", go: "@hub" }] },
    a1_shadow_lose: { chapter: "Arc 1", title: "Trắng tay", place: "forest", time: "night", cast: ["shen"],
      text: ["Shen tỉnh dậy dưới gốc tùng, trời đã gần sáng. Ống trúc và kẻ áo đen đều biến mất. Hốc cây trống rỗng.", "Ít nhất cậu đã biết chắc một điều: Tiêu Hạo có liên lạc với người ngoài."],
      onEnter: { flag: "shadow_failed" }, choices: [{ t: "Quay về", go: "@hub" }] },

    a1_waterfall: { chapter: "Arc 1", title: "Tiếng kiếm ngân", place: "waterfall", time: "night", cast: ["shen"],
      text: [
        "Thác Bạch Long đổ xuống vực, bọt nước trắng xóa dưới ánh trăng. Lần thứ ba Shen tới đây vào ban đêm, và lần thứ ba cậu nghe thấy nó: một tiếng ngân rất mảnh, như kiếm khẽ chạm vào nhau.",
        "Lần này cậu nhận ra tiếng ngân không lẫn trong tiếng nước, mà vang lên từ phía sau màn nước.",
      ],
      choices: [
        { t: "Lặng người lắng nghe, tìm khe đá phía sau màn nước", check: { stat: "WIS", dc: 12 }, go: "a1_kyngo", fail: "a1_waterfall_fail" },
        { t: "Thôi, quay về", go: "@hub" },
      ] },
    a1_waterfall_fail: { chapter: "Arc 1", title: "Chỉ có nước", place: "waterfall", time: "night", cast: ["shen"],
      text: ["Shen dò dẫm dọc vách đá ướt, trượt chân suýt rơi xuống vực. Tiếng ngân đã tắt. Có lẽ đêm khác cậu sẽ tìm ra."],
      choices: [{ t: "Quay về", go: "@hub" }] },
    a1_kyngo: { chapter: "Arc 1 · Kỳ ngộ", title: "Hang sau thác", place: "cave", time: "night", cast: ["shen"],
      text: [
        "Sau màn nước có một khe đá chỉ vừa một người lách qua. Bên trong là một hang nhỏ khô ráo, mùi rêu và sắt gỉ.",
        "Giữa hang, một bộ hài cốt ngồi xếp bằng, tay vẫn đặt trên chuôi một thanh kiếm đã mục. Gió lùa qua khe đá thổi vào lưỡi kiếm gãy, tạo nên tiếng ngân mà cả núi đồn là tiếng ma.",
        "Trong lòng hài cốt có một cuộn lụa và một túi bạc. Trên cuộn lụa chép nửa bộ kiếm phổ, chữ đã nhòe. Kẹp giữa là một mảnh lụa khác, viết bằng mực đỏ: \"Thiên Mạch Chân Giải, quyển thượng. Kinh mạch bế tắc không phải trời định.\"",
        "[KỲ NGỘ: Hang sau thác Thanh Vân.]",
      ],
      onEnter: { skill: "tan_kiem_pho", money: 3000, item: ["manh_chan_giai", 1], shard: 1, flag: "kyngo_a1", exp: 500, trend: { binh: 1 },
        ledger: { actor: "Shen", action: "Tìm thấy hài cốt kiếm khách vô danh và mảnh Thiên Mạch Chân Giải sau thác Bạch Long", target: "—", witness: "Không ai", pending: "Hai mảnh còn lại nằm đâu đó trên giang hồ", trigger: "—" } },
      choices: [{ t: "Cúi lạy bộ hài cốt rồi rời hang", go: "@hub", eff: { moral: 3 } }] },

    /* ---------- Võ công riêng & Võ Đạo ---------- */
    a1_interview: { chapter: "Arc 1", title: "Mạch Ẩn thành hình", place: "room", time: "night", cast: ["shen"],
      text: [
        "Đêm ấy, Shen ngồi xếp bằng trên phản. Lần đầu tiên từ khi Hệ Thống thức tỉnh, cậu cảm thấy rõ một dòng nóng chạy trong người, không theo bất kỳ kinh mạch nào sách vở từng chép.",
        "[Level 5. Mạch Ẩn đã đủ sức chứa một môn võ công.]",
        "[Hệ Thống đã ghi lại cách ký chủ chiến đấu. Trả lời 5 câu hỏi để hoàn tất.]",
      ],
      special: "interview", go: "a1_art" },
    a1_art: { chapter: "Arc 1", title: "Võ công của riêng mình", place: "room", time: "night", cast: ["shen"],
      text: ["[Hệ Thống ghép dữ liệu thành 3 hướng công pháp. Chọn một. Không thể thay đổi.]"],
      special: "art", go: "@hub" },
    x_class: { chapter: "Võ Đạo", title: "Chọn con đường", place: "yard", time: "day", cast: ["shen", "han_giao_dau"],
      text: [
        "Hàn giáo đầu đứng khoanh tay ở mép diễn võ trường, nhìn Shen đánh hết một lượt quyền.",
        "> Tuyệt Mạch mà đánh ra được quyền như thế. Thằng nhóc, ngươi không có nội lực thì càng phải có một con đường. Chọn một món binh khí đi. Ta dạy ngươi nhập môn.",
        "[Chọn Võ Đạo bậc 1: 5 loại vũ khí, mỗi loại có nhánh Ngoại công và Nội công. Mỗi nhánh có một Class ẩn.]",
        "[Tuyệt Mạch: chiêu nội công đốt Khí Huyết, đạt 60% uy lực (75% / 90% / 100% khi có 1 / 2 / 3 mảnh Thiên Mạch Chân Giải).]",
      ],
      special: "class", go: "@hub" },
    x_hidden_kimthan: { chapter: "Class ẩn", title: "Phát hiện con đường ẩn", place: "yard", time: "day", cast: ["shen"],
      text: [
        "Sau buổi tập, Shen thấy da thịt mình rắn lại một cách lạ lùng. Cú đấm của chính cậu dội ngược vào người cũng không còn đau.",
        "[Phát hiện con đường ẩn: Tuyệt Mạch Kim Thân (Class ẩn bậc 1 của nhánh Quyền – Ngoại công).]",
        "[Giáp ×1.3. Bị đánh trúng cũng nhận 1 tầng Khí Thế. Cái giá: vĩnh viễn không học được nhánh nội công.]",
      ],
      choices: [
        { t: "Rẽ sang Tuyệt Mạch Kim Thân", go: "@hub", eff: { hiddenClass: "tuyet_mach_kim_than" } },
        { t: "Giữ nhánh Quyền Thủ", go: "@hub", eff: { flag: "declined_kimthan" } },
      ] },
    x_hidden_kiemma: { chapter: "Class ẩn", title: "Máu kiếm", place: "forest", time: "night", cast: ["shen"],
      text: [
        "Kiếm còn nhỏ máu. Shen nghe trong người một tiếng ngân rất khẽ, giống hệt tiếng kiếm sau thác Bạch Long.",
        "[Phát hiện con đường ẩn: Tuyệt Mạch Kiếm Ma (Class ẩn bậc 1 của nhánh Kiếm – Nội công).]",
        "[Đốt Khí Huyết thành kiếm khí với 100% uy lực, không bị phạt Tuyệt Mạch. Cái giá: mất 5% HP mỗi chiêu kiếm khí.]",
      ],
      choices: [
        { t: "Rẽ sang Tuyệt Mạch Kiếm Ma", go: "@hub", eff: { hiddenClass: "tuyet_mach_kiem_ma" } },
        { t: "Giữ con đường hiện tại", go: "@hub", eff: { flag: "declined_kiemma" } },
      ] },
    x_rank: { chapter: "Đột phá", title: "Nhị Lưu", place: "yard", time: "day", cast: ["shen"],
      text: ["[Đột phá cảnh giới. Chọn 1 trong 3 phần thưởng.]"], special: "rank", go: "@back" },

    /* ---------- Đối chất ---------- */
    a1_confront: { chapter: "Arc 1", title: "Thời khắc đối chất", place: "room", time: "day", cast: ["shen", "tieu_luc"],
      text: [
        "Shen trải những gì mình có lên tấm phản. Tiểu Lục nuốt nước bọt.",
        "> Mày định làm gì? Đưa lên Chưởng môn, hay…",
      ],
      choices: [
        { t: "Đưa chứng cứ lên Chưởng môn trước toàn phái", go: "a1_public", req: { clues: 2 } },
        { t: "Phục kích Tiêu Hạo ở gốc tùng đêm nay", go: "a1_ambush", req: { flag: "saw_shadow" } },
        { t: "Chưa, cần thêm thời gian", go: "@hub" },
      ] },

    a1_public: { chapter: "Arc 1 · Hội đồng", title: "Chính điện Thanh Vân", place: "hall", time: "day", cast: ["shen", "chuong_mon", "tieu_hao"],
      text: [
        "Chính điện Thanh Vân chật kín người. Chưởng môn Lục Thanh Tùng ngồi trên ghế gỗ trầm, mắt khép hờ. Ba vị trưởng lão ngồi hai bên.",
        "Shen quỳ giữa điện, lần lượt trình ra từng manh mối. Tiếng xì xào nổi lên mỗi lúc một to.",
        "Tiêu Hạo bước ra, sắc mặt tái đi trong chớp mắt rồi lại đỏ bừng.",
        "> Bịa đặt! Một thằng tạp dịch Tuyệt Mạch mà dám vu cho đệ tử nội môn? Chưởng môn, đệ tử xin được tỉ võ với nó để rửa nhục. Kẻ nói dối, trời sẽ không giúp.",
        "> Được. Tỉ võ, không lấy mạng. Hai người ra sân.",
      ],
      fight: { foes: ["tieu_hao"], opts: { solo: true, canFlee: false }, win: "a1_public_win", lose: "a1_public_lose", tx: "a1_tieu_hao" } },
    a1_public_win: { chapter: "Arc 1", title: "Trời không giúp kẻ nói dối", place: "hall", time: "day", cast: ["shen", "chuong_mon"],
      text: [
        "Thanh kiếm của Tiêu Hạo văng khỏi tay, cắm phập xuống nền đá. Cả chính điện im phăng phắc.",
        "Chưởng môn mở mắt. Chỉ một ánh nhìn, hai trưởng lão đã bước tới khóa tay Tiêu Hạo. Từ tay áo hắn rơi ra một ống kim châm có khắc hình giọt máu.",
        "> Giam vào Tư Quá Nhai. Tra hỏi cho ra kẻ đứng sau.",
        "Đêm đó, Chưởng môn gọi riêng Shen vào thư phòng, đưa cho cậu một phong thư đã ngả vàng.",
        "> Mười năm trước, một lão ăn mày cõng con lên núi, gửi con làm tạp dịch, chỉ để lại lá thư này. Lão dặn: khi nào thằng bé tự đứng dậy được thì đưa cho nó.",
        "Trong thư chỉ có một dòng: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
      ],
      onEnter: { quest: { q_rua_oan: "done" }, rep: { thanh_van: 100 }, moral: 10, money: 3000, exp: 800, flag: ["a1_done", "tieu_hao_jailed"],
        ledger: { actor: "Shen", action: "Đối chất công khai, thắng Tiêu Hạo trong tỉ võ", target: "Tiêu Hạo", witness: "Toàn phái Thanh Vân", pending: "Huyết Ảnh Lâu mất một tay trong ở Thanh Vân", trigger: "Khi Shen tới Lạc Hà" } },
      choices: [{ t: "Thu xếp hành lý", go: "a1_end" }] },
    a1_public_lose: { chapter: "Arc 1", title: "Chứng cứ vẫn còn đó", place: "hall", time: "day", cast: ["shen", "chuong_mon"],
      text: [
        "Shen ngã xuống, máu trào ra khóe miệng. Tiêu Hạo giơ kiếm lên, mặt hằn sát khí.",
        "> Đủ rồi.",
        "Chưởng môn chỉ phẩy tay áo, Tiêu Hạo đã lùi lại ba bước. Ông cầm lấy chứng cứ trên khay, đọc rất lâu.",
        "> Võ công không thay được sự thật. Tiêu Hạo, ngươi giải thích đi.",
        "Tiêu Hạo bỗng tung ra một nắm kim châm rồi phóng qua cửa sổ, lao thẳng xuống vực sau núi. Không ai đuổi kịp.",
        "Đêm đó, Chưởng môn đưa cho Shen một phong thư cũ: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
      ],
      onEnter: { quest: { q_rua_oan: "done" }, rep: { thanh_van: 40 }, moral: 5, money: 1500, exp: 400, flag: ["a1_done", "tieu_hao_fled"],
        ledger: { actor: "Shen", action: "Đối chất công khai; thua tỉ võ nhưng chứng cứ được công nhận", target: "Tiêu Hạo", witness: "Toàn phái Thanh Vân", pending: "Tiêu Hạo trốn thoát, có thể tìm Shen báo thù", trigger: "Arc 4 · Huyết Ảnh Lâu" } },
      choices: [{ t: "Thu xếp hành lý", go: "a1_end" }] },

    a1_trial: { chapter: "Arc 1 · Hội đồng", title: "Sáng ngày thứ mười", place: "hall", time: "day", cast: ["shen", "chuong_mon", "tieu_hao"],
      text: ["Chuông chính điện vang lên chín hồi. Hội đồng trưởng lão đã họp, hạn đã hết.", "Nếu Shen đang ở ngoài núi, hai đệ tử chấp pháp đã tìm tới tận nơi, áp giải cậu về chính điện."],
      onEnter: { place: "thanh_van" },
      choices: [
        { t: "Trình bày chứng cứ", go: "a1_public", req: { clues: 2 } },
        { t: "Không có đủ chứng cứ…", go: "a1_trial_fail", req: { maxClues: 1 } },
      ] },
    a1_trial_fail: { chapter: "Arc 1", title: "Trục xuất", place: "mountain_gate", time: "day", cast: ["shen", "han_giao_dau"],
      text: [
        "Lời Shen nhẹ như gió thoảng. Hội đồng phán: trục xuất khỏi Thanh Vân, vĩnh viễn không được đặt chân lên núi.",
        "Tiêu Hạo đứng sau hàng đệ tử, khẽ mỉm cười.",
        "Ở cổng sơn môn, Hàn giáo đầu đứng chờ sẵn, dúi vào tay Shen một phong thư cũ cùng một túi bạc nhỏ.",
        "> Chưởng môn bảo ta đưa. Ông ấy không tin ngươi trộm, nhưng không có chứng cứ thì ông ấy cũng không làm gì được. Đi đi. Đừng chết.",
        "Trong thư chỉ có một dòng: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
      ],
      onEnter: { quest: { q_rua_oan: "fail" }, rep: { thanh_van: -100 }, money: 1000, flag: ["a1_done", "expelled", "tv_banned"],
        ledger: { actor: "Hội đồng Thanh Vân", action: "Trục xuất Shen vì không chứng minh được mình vô tội", target: "Shen", witness: "Toàn phái", pending: "Tiêu Hạo tiếp tục làm tay trong cho Huyết Ảnh Lâu", trigger: "Võ Lâm Đại Hội (Arc 3)" } },
      choices: [{ t: "Xuống núi", go: "a1_end" }] },

    a1_ambush: { chapter: "Arc 1", title: "Phục kích", place: "forest", time: "night", cast: ["shen", "tieu_hao"],
      text: [
        "Đêm không trăng. Shen nằm phục trong bụi dương xỉ cách gốc tùng rỗng mười bước.",
        "Gần canh ba, Tiêu Hạo tới một mình, liên tục ngoái lại phía sau. Hắn thò tay vào hốc cây.",
      ],
      choices: [
        { t: "Lặng lẽ áp sát, ra đòn trước", check: { stat: "AGI", dc: 12, bonusTrait: { anh_tu: 5 } }, go: "a1_ambush_go", fail: "a1_ambush_seen" },
      ] },
    a1_ambush_go: { chapter: "Arc 1", title: "Đòn đánh lén", place: "forest", time: "night", cast: ["shen", "tieu_hao"],
      text: ["Shen lao ra khi Tiêu Hạo còn đang cúi xuống hốc cây. Hắn chỉ kịp quay nửa người."],
      fight: { foes: ["tieu_hao"], opts: { solo: true, canFlee: true, ambush: true }, win: "a1_ambush_win", lose: "a1_ambush_lose", tx: "a1_tieu_hao" } },
    a1_ambush_seen: { chapter: "Arc 1", title: "Lộ", place: "forest", time: "night", cast: ["shen", "tieu_hao"],
      text: ["Một cành khô gãy dưới chân. Tiêu Hạo rút kiếm, cười lạnh.", "> Tạp dịch mà cũng biết rình mồi. Tốt. Không ai biết ngươi chết ở đây."],
      fight: { foes: ["tieu_hao"], opts: { solo: true, canFlee: true }, win: "a1_ambush_win", lose: "a1_ambush_lose", tx: "a1_tieu_hao" } },
    a1_ambush_win: { chapter: "Arc 1", title: "Dưới gốc tùng", place: "forest", time: "night", cast: ["shen", "tieu_hao"],
      text: [
        "Tiêu Hạo quỳ trên đất, cánh tay cầm kiếm gãy gập. Hắn ngẩng lên, giọng run rẩy:",
        "> Tha… tha cho ta. Ta chỉ là con cờ! Người của Huyết Ảnh Lâu ép ta. Kiếm phổ ta đưa cho chúng rồi!",
      ],
      choices: [
        { t: "Kết liễu hắn", go: "a1_end_kill", eff: { moral: -40, anti: 1, rep: { huyet_anh: -50 }, flag: ["a1_done", "killed_tieu_hao", "tv_banned"],
          ledger: { actor: "Shen", action: "Giết Tiêu Hạo dưới gốc tùng rỗng", target: "Tiêu Hạo", witness: "Không ai (có thể có tai mắt Huyết Ảnh)", pending: "Huyết Ảnh Lâu cử người điều tra cái chết của tay trong", trigger: "Khi Shen ở Lạc Hà vài ngày" } } },
        { t: "Trói hắn lại, để thư và chứng cứ trước cửa thư phòng Chưởng môn", go: "a1_end_bind", eff: { moral: 10, rep: { thanh_van: 60 }, flag: ["a1_done", "tieu_hao_jailed"], quest: { q_rua_oan: "done" },
          ledger: { actor: "Shen", action: "Bắt sống Tiêu Hạo, giao chứng cứ cho Chưởng môn", target: "Tiêu Hạo", witness: "Chưởng môn (qua chứng cứ)", pending: "Huyết Ảnh Lâu mất tay trong", trigger: "—" } } },
        { t: "Ép hắn khai kẻ đứng sau, rồi thả đi", go: "a1_end_free", eff: { moral: -5, anti: 1, flag: ["a1_done", "tieu_hao_fled", "know_giang_nam"],
          ledger: { actor: "Shen", action: "Ép Tiêu Hạo khai: Huyết Ảnh Lâu đặt tổng đàn ở Giang Nam; rồi thả hắn", target: "Tiêu Hạo", witness: "Không ai", pending: "Tiêu Hạo nợ Shen một mạng, hoặc mang hận", trigger: "Arc 4 · Huyết Ảnh Lâu" } } },
      ] },
    a1_ambush_lose: { chapter: "Arc 1", title: "Kẻ trộm bỏ trốn", place: "forest", time: "night", cast: ["shen", "tieu_hao"],
      text: [
        "Kiếm của Tiêu Hạo dừng cách cổ Shen một tấc. Hắn không giết, mà ngửa cổ hét lớn:",
        "> Có trộm! Tên tạp dịch trộm kiếm phổ định giết người diệt khẩu!",
        "Đuốc bừng sáng khắp sườn núi. Shen chỉ còn một đường: lao xuống dốc đá phía tây, xuống núi trong đêm.",
      ],
      onEnter: { rep: { thanh_van: -150 }, flag: ["a1_done", "fugitive_tv", "tv_banned"], quest: { q_rua_oan: "fail" },
        ledger: { actor: "Tiêu Hạo", action: "Vu Shen giết người diệt khẩu", target: "Shen", witness: "Đệ tử tuần đêm", pending: "Shen bị Thanh Vân truy nã", trigger: "Khi Shen quay lại Thanh Vân" } },
      choices: [{ t: "Chạy", go: "a1_end_run" }] },
    a1_end_kill: { chapter: "Arc 1", title: "Máu dưới gốc tùng", place: "forest", time: "night", cast: ["shen"],
      text: [
        "Tiêu Hạo ngã xuống, mắt còn mở trừng. Shen đứng rất lâu dưới gốc tùng, đến khi tay thôi run.",
        "Cậu lục người hắn, tìm được một phong thư cũ đề tên mình, chắc Tiêu Hạo lấy trộm từ thư phòng Chưởng môn để dò la: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
        "Shen không thể ở lại Thanh Vân được nữa.",
      ],
      choices: [{ t: "Xuống núi trong đêm", go: "a1_end" }] },
    a1_end_bind: { chapter: "Arc 1", title: "Trước thư phòng", place: "hall", time: "night", cast: ["shen", "chuong_mon"],
      text: [
        "Sáng hôm sau, Chưởng môn cho gọi Shen. Tiêu Hạo đã bị giam ở Tư Quá Nhai.",
        "> Ngươi làm đúng. Nhưng ngươi tự ý xử, phép tắc không tha. Ta không thể giữ ngươi trên núi.",
        "Ông đưa cho cậu một phong thư cũ cùng một túi bạc: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
      ],
      onEnter: { money: 2000, exp: 500 },
      choices: [{ t: "Cúi lạy rồi xuống núi", go: "a1_end" }] },
    a1_end_free: { chapter: "Arc 1", title: "Tiếng chân xa dần", place: "forest", time: "night", cast: ["shen"],
      text: [
        "Tiêu Hạo khai hết: tổng đàn Huyết Ảnh Lâu ở Giang Nam, người liên lạc đeo nhẫn đồng hình giọt máu. Rồi hắn bò dậy, chạy mất vào rừng.",
        "Trong túi hắn rơi ra một phong thư cũ đề tên Shen: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
      ],
      onEnter: { exp: 300 },
      choices: [{ t: "Xuống núi", go: "a1_end" }] },
    a1_end_run: { chapter: "Arc 1", title: "Chạy trong đêm", place: "road", time: "night", cast: ["shen"],
      text: [
        "Shen trượt dọc dốc đá, quần áo rách tươm. Đến chân núi, trời vừa hửng sáng. Cậu sờ ngực áo: phong thư cũ cậu lấy được từ hốc cây vẫn còn.",
        "Đó không phải thư của Huyết Ảnh, mà là một lá thư cũ đề tên cậu, chắc Tiêu Hạo đã trộm từ thư phòng Chưởng môn: \"Muốn biết vì sao Thẩm gia trang cháy, hãy tới trấn Lạc Hà, tìm Lão Hồ.\"",
      ],
      choices: [{ t: "Lên đường", go: "a1_end" }] },

    a1_end: { chapter: "Arc 1 · Kết", title: "Xuống núi", place: "mountain_gate", time: "dusk", cast: ["shen", "to_van_yen"],
      text: [
        "Con đường đá dẫn xuống núi ướt sương. Shen ngoái lại lần cuối nhìn mái ngói Thanh Vân ẩn hiện trong mây, nơi cậu đã sống mười năm mà chưa từng được gọi là đệ tử.",
        "Ở khúc quanh đầu tiên, Tô Vân Yên đứng chờ, gùi thuốc sau lưng.",
        "> Ta cũng phải về Nga Mi. Đi chung một đoạn nhé. Mà này, Tuyệt Mạch của cậu… ta chưa từng thấy ai như vậy. Nếu có ngày tìm được cách chữa, nhớ báo cho ta.",
        "[Kết thúc Arc 1. Đích đến: trấn Lạc Hà, 2 ngày đường đi bộ.]",
      ],
      onEnter: { aff: { to_van_yen: 5 }, arc: 2 },
      choices: [
        { t: "Lên đường tới Lạc Hà", go: "a2_road", eff: { cond: { req: { aff: { to_van_yen: 20 } }, eff: { item: ["kim_sang", 2] }, note: "Tô Vân Yên dúi vào tay Shen hai lọ thuốc." } } },
      ] },
  });
})(typeof window !== "undefined" ? window : globalThis);
