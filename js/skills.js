/* =====================================================================
   KIẾM MỆNH · KỸ NĂNG, VÕ ĐẠO, VÕ CÔNG RIÊNG
   Trường kỹ năng:
     cost {sta|kh}, cd (lượt hồi), mult (hệ số), hits, src p (ngoại công) | n (nội công),
     aoe (số mục tiêu), pierce (bỏ qua giáp), crit (+% chí mạng), stun (tỉ lệ choáng),
     weak (giảm công địch), burn/poison (tỉ lệ), heal (% HP), guard (% giảm sát thương),
     counter (hệ số phản đòn), eva (+% né), turns, kt (dùng Khí Thế), hp (% HP tự mất),
     w (vũ khí bắt buộc), lost (học lỏm: 0.6 uy lực)
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const K = (name, o) => Object.assign({ name, mult: 0, cd: 0, src: "p" }, o);

  KM.SKILLS = {
    // Cơ bản
    danh_thuong: K("Đánh thường", { mult: 1.0, basic: true, desc: "Đòn đánh theo đặc trưng vũ khí đang cầm." }),
    tap_dich_quyen: K("Tạp Dịch Quyền", { mult: 1.3, cost: { sta: 10 }, cd: 2, stun: 0.2, desc: "Cú đấm học lỏm từ những năm bổ củi. 20% choáng 1 lượt." }),
    chiu_don: K("Chịu Đòn", { guard: 0.3, cost: { sta: 15 }, cd: 3, desc: "Gồng người chịu đòn: giảm 30% sát thương phải nhận lượt này." }),

    // KIẾM – NGOẠI (Kiếm thuật)
    k_tam_thuc: K("Thanh Phong Tam Thức", { mult: 0.7, hits: 3, cost: { sta: 15 }, cd: 2, w: "kiem", desc: "Ba nhát kiếm liền nhau." }),
    k_tat_phong: K("Tật Phong Thích", { mult: 1.8, crit: 15, cost: { sta: 20 }, cd: 3, w: "kiem", desc: "Một nhát đâm thẳng, chí mạng +15%." }),
    // KIẾM – NỘI (Kiếm khí)
    k_khi_tram: K("Kiếm Khí Trảm", { mult: 1.6, src: "n", cost: { kh: 20 }, cd: 2, w: "kiem", desc: "Phóng kiếm khí ngắn, bỏ qua 30% giáp." }),
    k_han_phong: K("Hàn Phong Kiếm Khí", { mult: 1.2, src: "n", weak: 0.2, turns: 2, cost: { kh: 25 }, cd: 3, w: "kiem", desc: "Kiếm khí lạnh, giảm 20% công địch 2 lượt." }),
    // ĐAO – NGOẠI
    d_khai_son: K("Khai Sơn Trảm", { mult: 1.7, cost: { sta: 15 }, cd: 2, w: "dao", desc: "Bổ đao từ trên xuống." }),
    d_cuong_phong: K("Cuồng Phong Đao", { mult: 1.0, hits: 2, cost: { sta: 20 }, cd: 3, w: "dao", desc: "Hai đao xoáy liên tiếp." }),
    // ĐAO – NỘI
    d_cuong_pha: K("Đao Cương Phá", { mult: 1.7, src: "n", cost: { kh: 22 }, cd: 2, w: "dao", desc: "Đao cương chém xa, bỏ qua 30% giáp." }),
    d_liet_hoa: K("Liệt Hỏa Đao Khí", { mult: 1.3, src: "n", burn: 1, turns: 3, cost: { kh: 25 }, cd: 3, w: "dao", desc: "Đao khí nóng rực, gây bỏng 3 lượt (5% HP tối đa mỗi lượt)." }),
    // CÔN – NGOẠI
    c_hoanh_tao: K("Hoành Tảo Thiên Quân", { mult: 1.2, aoe: 3, stun: 0.25, cost: { sta: 15 }, cd: 2, w: "con", desc: "Quét côn trúng tối đa 3 địch, 25% choáng." }),
    c_thiet_thu: K("Thiết Côn Thủ", { guard: 0.4, counter: 0.8, cost: { sta: 15 }, cd: 3, w: "con", desc: "Dựng côn chắn: giảm 40% sát thương, phản đòn ×0.8." }),
    // CÔN – NỘI
    c_phuc_ma: K("Phục Ma Côn", { mult: 1.6, src: "n", cost: { kh: 22 }, cd: 2, w: "con", desc: "Côn mang nội kình, bỏ qua 30% giáp." }),
    c_dinh_tam: K("Thiền Côn Định Tâm", { heal: 0.15, cleanse: true, cost: { kh: 20 }, cd: 4, w: "con", desc: "Định tâm điều tức: hồi 15% HP, giải độc/bỏng." }),
    // THƯƠNG – NGOẠI
    t_doc_long: K("Độc Long Xuất Động", { mult: 1.8, aoe: 2, cost: { sta: 15 }, cd: 2, w: "thuong", desc: "Mũi thương xuyên thẳng 2 địch." }),
    t_bao_vu: K("Bạo Vũ Lê Hoa Thương", { mult: 0.55, hits: 4, cost: { sta: 25 }, cd: 3, w: "thuong", desc: "Bốn mũi thương như mưa." }),
    // THƯƠNG – NỘI
    t_xuyen_tam: K("Thương Ý Xuyên Tâm", { mult: 1.7, src: "n", pierce: 0.2, cost: { kh: 22 }, cd: 2, w: "thuong", desc: "Thương ý xuyên giáp thêm 20%." }),
    t_long_ngam: K("Long Ngâm", { mult: 1.2, src: "n", stun: 0.3, cost: { kh: 25 }, cd: 3, w: "thuong", desc: "Thương rít như rồng ngâm, 30% choáng." }),
    // QUYỀN – NGOẠI (Quyền pháp)
    q_manh_ho: K("Mãnh Hổ Quyền", { mult: 1.5, cost: { sta: 12 }, cd: 2, w: "quyen", desc: "Cú đấm nặng, cộng thưởng Khí Thế." }),
    q_bang_son: K("Băng Sơn Quyền", { mult: 2.2, kt: true, cost: { sta: 20 }, cd: 3, w: "quyen", desc: "Dồn toàn bộ Khí Thế: mỗi tầng +15% sát thương." }),
    // QUYỀN – NỘI (Chưởng pháp)
    q_mien_chuong: K("Miên Chưởng", { mult: 1.5, src: "n", cost: { kh: 22 }, cd: 2, w: "quyen", desc: "Chưởng mềm như bông, kình lực thấm vào trong." }),
    q_liet_duong: K("Liệt Dương Chưởng", { mult: 1.9, src: "n", burn: 0.5, turns: 3, cost: { kh: 28 }, cd: 3, w: "quyen", desc: "Chưởng lực nóng rực, 50% gây bỏng 3 lượt." }),

    // Kỳ ngộ
    tan_kiem_pho: K("Tàn Kiếm Phổ", { mult: 1.6, cost: { kh: 25 }, cd: 3, w: "kiem", desc: "Bí kíp khuyết tìm thấy sau thác Thanh Vân. Chiêu kiếm ×1.6." }),
    bat_quai_con: K("Bát Quái Côn", { mult: 1.1, aoe: 3, cost: { kh: 30 }, cd: 3, w: "con", desc: "Ông lão đánh cá truyền lại. Đánh 3 địch, mỗi địch ×1.1." }),
    // Học lỏm (Quái Nhãn)
    hoc_phi_van: K("Phi Vân Tam Kiếm (học lỏm)", { mult: 0.7, hits: 3, lost: 0.6, cost: { sta: 15 }, cd: 3, w: "kiem", desc: "Học lỏm từ Tiêu Hạo. 60% uy lực." }),
    hoc_giao_long: K("Giao Long Xuất Hải (học lỏm)", { mult: 0.75, hits: 3, lost: 0.6, cost: { sta: 18 }, cd: 3, w: "thuong", desc: "Học lỏm từ Hắc Giao. 60% uy lực." }),
  };

  /* ---------------- Võ Đạo bậc 1 (10 nhánh theo vũ khí) ---------------- */
  // s1: học khi chọn Võ Đạo; s2: học qua bí kíp ở Thư quán (Level 10)
  const C = (name, weapon, branch, art, s1, s2, prio, tree, hidden) => ({ name, weapon, branch, art, s1, s2, prio, tree, hidden });
  KM.CLASSES = {
    kiem_ngoai: C("Kiếm Khách", "kiem", "ngoai", "Kiếm thuật", "k_tam_thuc", "k_tat_phong", ["AGI", "STR"], ["Kiếm Khách", "Khoái Kiếm Sư / Trọng Kiếm Sư", "Kiếm Tông", "Kiếm Thánh"], "Vô Danh Kiếm Thần (bậc 4)"),
    kiem_noi: C("Khí Kiếm Sĩ", "kiem", "noi", "Kiếm khí", "k_khi_tram", "k_han_phong", ["INT", "WIS"], ["Khí Kiếm Sĩ", "Ngự Kiếm Sư / Hàn Phong Kiếm Sư", "Kiếm Khí Tông", "Tâm Kiếm Thánh"], "Tuyệt Mạch Kiếm Ma (bậc 1)"),
    dao_ngoai: C("Đao Khách", "dao", "ngoai", "Đao thuật", "d_khai_son", "d_cuong_phong", ["STR", "VIT"], ["Đao Khách", "Cuồng Đao Sư / Song Đao Sư", "Đao Bá", "Đao Hoàng"], "Huyết Chiến Đao Quỷ (bậc 2)"),
    dao_noi: C("Cương Đao Sĩ", "dao", "noi", "Đao cương", "d_cuong_pha", "d_liet_hoa", ["WIS", "INT"], ["Cương Đao Sĩ", "Liệt Hỏa Đao Sư / Huyết Đao Sư", "Đao Cương Tông", "Đao Cương Vương"], "Bá Vương Đao Hồn (bậc 3)"),
    con_ngoai: C("Côn Khách", "con", "ngoai", "Côn thuật", "c_hoanh_tao", "c_thiet_thu", ["STR", "VIT"], ["Côn Khách", "Bá Côn Sư / Du Long Côn Sư", "Côn Tông", "Côn Thánh"], "Phong Ba Côn Vương (bậc 3)"),
    con_noi: C("Thiền Côn Tăng", "con", "noi", "Thiền côn", "c_phuc_ma", "c_dinh_tam", ["WIS", "VIT"], ["Thiền Côn Tăng", "Kim Cương Côn Sư / Phục Ma Côn Sư", "Thiền Côn Tông", "La Hán Côn Thánh"], "Phục Ma La Hán (bậc 2)"),
    thuong_ngoai: C("Thương Khách", "thuong", "ngoai", "Thương thuật", "t_doc_long", "t_bao_vu", ["STR", "AGI"], ["Thương Khách", "Bạo Vũ Thương Sư / Thiết Kỵ Thương Sư", "Thương Tông", "Thương Vương"], "Thiết Kỵ Tướng Quân (bậc 2)"),
    thuong_noi: C("Kình Thương Sĩ", "thuong", "noi", "Thương ý", "t_xuyen_tam", "t_long_ngam", ["INT", "STR"], ["Kình Thương Sĩ", "Xuyên Vân Thương Sư / Long Ngâm Thương Sư", "Thương Ý Tông", "Bá Vương Thương Thánh"], "Long Hồn Thương (bậc 3)"),
    quyen_ngoai: C("Quyền Thủ", "quyen", "ngoai", "Quyền pháp", "q_manh_ho", "q_bang_son", ["STR", "AGI"], ["Quyền Thủ", "Cang Quyền Sư / Bạo Quyền Sư", "Quyền Tông", "Quyền Thánh"], "Tuyệt Mạch Kim Thân (bậc 1)"),
    quyen_noi: C("Chưởng Thủ", "quyen", "noi", "Chưởng pháp", "q_mien_chuong", "q_liet_duong", ["WIS", "INT"], ["Chưởng Thủ", "Miên Chưởng Sư / Liệt Dương Chưởng Sư", "Chưởng Tông", "Chưởng Thánh"], "Thái Cực Chưởng Tông (bậc 3)"),
  };
  KM.BRANCH_NAME = { ngoai: "Ngoại công", noi: "Nội công" };
  KM.STARTER_WEAPON = { kiem: "thiet_kiem", dao: "phac_dao", con: "te_mi_con", thuong: "hong_anh_thuong", quyen: "bo_quyen_sao" };

  /* Class ẩn mở được trong Arc 1–2 */
  KM.HIDDEN_CLASSES = {
    tuyet_mach_kim_than: { name: "Tuyệt Mạch Kim Thân", base: "quyen_ngoai", desc: "Giáp ×1.3; bị đánh trúng cũng nhận 1 tầng Khí Thế. Vĩnh viễn không học được nhánh nội công.", prio: ["STR", "VIT"] },
    tuyet_mach_kiem_ma: { name: "Tuyệt Mạch Kiếm Ma", base: "kiem_noi", desc: "Đốt Khí Huyết thành kiếm khí với 100% uy lực, không bị phạt Tuyệt Mạch. Mất 5% HP mỗi chiêu.", prio: ["AGI", "STR"] },
  };

  /* ---------------- Võ công riêng trên Mạch Ẩn ----------------
     t: xu hướng (binh/tay, nhanh/nang, cong/thu, minh/am) */
  KM.MACH_AN = {
    huyet_anh_lien: { name: "Huyết Ảnh Liên Hoàn", t: { binh: 2, nhanh: 2, cong: 2 }, sk: K("Huyết Ảnh Liên Hoàn", { mult: 0.75, hits: 3, cost: { kh: 20 }, cd: 2, own: true, desc: "Ba nhát liên hoàn, mỗi nhát ×0.75 công." }), style: "Dồn dập, ăn theo số đòn" },
    pha_mach: { name: "Phá Mạch Nhất Kích", t: { nang: 3, cong: 2 }, sk: K("Phá Mạch Nhất Kích", { mult: 2.5, pierce: 0.3, cost: { kh: 35 }, cd: 4, own: true, desc: "Một đòn ×2.5 công, bỏ qua 30% giáp." }), style: "Một chiêu phân thắng bại" },
    phong_tram_bo: { name: "Phong Trầm Bộ", t: { nhanh: 3, thu: 2 }, sk: K("Phong Trầm Bộ", { eva: 15, turns: 2, counter: 1.2, cost: { kh: 25 }, cd: 3, own: true, desc: "Né +15% trong 2 lượt; né thành công thì phản đòn ×1.2." }), style: "Lấy thân pháp dẫn đòn" },
    thiet_bich: { name: "Thiết Bích Thân", t: { nang: 2, thu: 3, minh: 1 }, sk: K("Thiết Bích Thân", { guard: 0.5, turns: 2, cost: { kh: 25 }, cd: 4, own: true, desc: "Giảm 50% sát thương phải nhận trong 2 lượt." }), style: "Đứng vững như tường đồng" },
    anh_sat_chi: { name: "Ảnh Sát Chỉ", t: { am: 3, nhanh: 1, cong: 1 }, sk: K("Ảnh Sát Chỉ", { mult: 1.6, crit: 40, cost: { kh: 25 }, cd: 3, own: true, desc: "Điểm vào chỗ hiểm: ×1.6 công, chí mạng +40%." }), style: "Đánh vào chỗ không ai ngờ" },
    bao_huyet: { name: "Tuyệt Mạch Bạo Huyết", t: { tay: 2, nang: 1, cong: 2, am: 1 }, sk: K("Tuyệt Mạch Bạo Huyết", { mult: 1.2, rage: true, hp: 0.05, cost: { kh: 20 }, cd: 3, own: true, desc: "×1.2 công, cộng thêm 1% cho mỗi 1% HP đã mất. Tự mất 5% HP." }), style: "Càng đau càng mạnh" },
    ho_tam: { name: "Huyết Khí Hộ Tâm", t: { thu: 2, minh: 3 }, sk: K("Huyết Khí Hộ Tâm", { heal: 0.2, cost: { kh: 30 }, cd: 4, own: true, desc: "Dồn Khí Huyết về tâm mạch, hồi 20% HP." }), style: "Bền bỉ, đánh lâu" },
    loi_dinh: { name: "Lôi Đình Quyền Ảnh", t: { tay: 3, nhanh: 2, cong: 1 }, sk: K("Lôi Đình Quyền Ảnh", { mult: 1.0, hits: 2, stun: 0.2, cost: { kh: 25 }, cd: 3, own: true, desc: "Hai quyền nhanh như sấm, 20% choáng." }), style: "Áp sát, đánh nhanh" },
  };

  KM.INTERVIEW = [
    { q: "Hệ Thống: Khi bị dồn vào đường cùng, ngươi liều mạng hay tìm đường lùi?",
      a: [["Liều mạng, lao vào kẻ địch", { cong: 2, nang: 1 }], ["Lùi một bước, chờ sơ hở", { thu: 1, nhanh: 1, am: 1 }], ["Đứng vững, chịu đòn để tìm cơ hội", { thu: 2, minh: 1 }]] },
    { q: "Hệ Thống: Một nhát chí mạng, hay trăm nhát vừa đủ?",
      a: [["Một nhát là xong", { nang: 2 }], ["Trăm nhát, kẻ địch không kịp thở", { nhanh: 2 }]] },
    { q: "Hệ Thống: Ngươi tin vào binh khí hay thân thể mình?",
      a: [["Binh khí là cánh tay thứ hai", { binh: 2 }], ["Thân thể này đã chịu đủ rồi, nó sẽ không phản bội ta", { tay: 2 }]] },
    { q: "Hệ Thống: Muốn thắng, ngươi chọn cách nào?",
      a: [["Đánh trực diện trước mặt mọi người", { minh: 2 }], ["Ra tay khi không ai thấy", { am: 2 }], ["Không cần thắng, chỉ cần không thua", { thu: 2 }]] },
    { q: "Hệ Thống: Đêm mưa hôm ấy, điều gì giữ ngươi sống sót?",
      a: [["Cơn giận", { cong: 1, nang: 1, tay: 1 }], ["Lòng kiên nhẫn", { thu: 1, minh: 1 }], ["Đôi chân", { nhanh: 2 }]] },
  ];
})(typeof window !== "undefined" ? window : globalThis);
