/* =====================================================================
   KIẾM MỆNH – GIANG HỒ LỤC · DỮ LIỆU
   Bám theo bản thiết kế: 6 chỉ số, cảnh giới E–SSS, 20 đặc tính,
   5 loại vũ khí, Võ Đạo ngoại/nội công + nhánh ẩn, trang bị 7 phẩm,
   ngựa, bảng rơi đồ, kẻ địch Arc 1–2.
   Tiền lưu bằng đồng: 1 vàng = 100 bạc = 10.000 đồng.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});

  KM.STATS = ["STR", "AGI", "VIT", "INT", "WIS", "LUK"];
  KM.STAT_NAME = { STR: "Lực", AGI: "Thân Pháp", VIT: "Căn Cốt", INT: "Ngộ Tính", WIS: "Tâm Cảnh", LUK: "Cơ Duyên" };
  KM.STAT_DESC = {
    STR: "Công vật lý, Khí Huyết, dùng binh khí nặng",
    AGI: "Né, chí mạng, tốc độ ra đòn, khinh công",
    VIT: "HP, thể lực, Khí Huyết",
    INT: "Nội công lực, giải mã bí kíp, nhìn thấu sơ hở",
    WIS: "Nội công lực, Nội Lực, cảm nhận sát khí",
    LUK: "Rơi đồ, kỳ ngộ, gieo lại xúc xắc",
  };

  /* ---------------- Cảnh giới ---------------- */
  KM.RANKS = ["E", "D", "C", "B", "A", "S", "SS", "SSS"];
  KM.RANK_NAME = { E: "Tam Lưu", D: "Nhị Lưu", C: "Nhất Lưu", B: "Tuyệt Đỉnh", A: "Tông Sư", S: "Đại Tông Sư", SS: "Thiên Nhân", SSS: "Võ Thần" };
  KM.RANK_MIN_LV = { E: 1, D: 10, C: 20, B: 30, A: 45, S: 60, SS: 75, SSS: 90 };
  KM.RANK_CAP = { E: 9, D: 19, C: 29, B: 44, A: 59, S: 74, SS: 89, SSS: 999 };
  KM.RANK_BREAK = {
    D: "Thắng một đối thủ Rank D trong trận đơn đấu",
    C: "Một chỉ số ≥ 50 và võ công riêng tầng 2",
    B: "Vượt Sinh Tử Quan",
  };

  /* ---------------- Đạo đức 7 bậc ---------------- */
  KM.MORAL_TIERS = [
    { min: 200, name: "Đại Hiệp" }, { min: 100, name: "Hiệp Khách" }, { min: 30, name: "Chính Nhân" },
    { min: -29, name: "Lãng Khách" }, { min: -99, name: "Tà Nhân" }, { min: -199, name: "Ma Đầu" }, { min: -9999, name: "Đại Ma" },
  ];
  KM.REP_TIERS = [
    { min: 800, name: "Huyền thoại" }, { min: 400, name: "Được kính trọng" }, { min: 100, name: "Được biết đến" },
    { min: -99, name: "Vô danh" }, { min: -499, name: "Bị ghét" }, { min: -9999, name: "Kẻ thù" },
  ];
  KM.FACTIONS = {
    thanh_van: "Thanh Vân Phái", long_mon: "Long Môn Tiêu Cục", lac_ha: "Dân trấn Lạc Hà",
    cai_bang: "Cái Bang", duong_mon: "Đường Môn", huyet_anh: "Huyết Ảnh Lâu", hanh_hoa: "Dân thôn Hạnh Hoa", phong_lam: "Trấn Phong Lâm",
  };

  /* ---------------- 20 đặc tính ---------------- */
  // mult: nhân lên chỉ số gốc. Các hiệu ứng khác do engine đọc theo id.
  KM.TRAITS = {
    kiem_tam: { name: "Kiếm Tâm Thông Minh", desc: "×1.5 sát thương khi dùng kiếm.", cost: "−", wmul: { kiem: 1.5 } },
    dao_y: { name: "Đao Ý Bá Thể", desc: "×1.5 sát thương khi dùng đao; đòn nặng phá thế thủ.", cost: "AGI ×0.9", mult: { AGI: 0.9 }, wmul: { dao: 1.5 } },
    con_phap: { name: "Côn Pháp Thiên Thành", desc: "×1.5 sát thương khi dùng trường côn; giáp vật lý ×1.1.", cost: "INT ×0.9", mult: { INT: 0.9 }, wmul: { con: 1.5 }, dx: { defMul: 1.1 } },
    thuong_hon: { name: "Thương Hồn Bất Diệt", desc: "×1.5 sát thương khi dùng thương; chí mạng +3%.", cost: "WIS ×0.9", mult: { WIS: 0.9 }, wmul: { thuong: 1.5 }, dx: { crit: 3 } },
    quyen_than: { name: "Quyền Thần Thể", desc: "×1.5 sát thương khi dùng quyền sáo; tay không ×1.3.", cost: "−", wmul: { quyen: 1.5, tay: 1.3 } },
    bach_binh: { name: "Bách Binh Thông", desc: "×1.15 sát thương với mọi loại vũ khí.", cost: "−", wmul: { kiem: 1.15, dao: 1.15, con: 1.15, thuong: 1.15, quyen: 1.15, tay: 1.15 } },
    mang_nguu: { name: "Mãng Ngưu Lực", desc: "STR ×1.5.", cost: "AGI ×0.85", mult: { STR: 1.5, AGI: 0.85 } },
    phong_anh: { name: "Phong Ảnh Thân", desc: "AGI ×1.5.", cost: "VIT ×0.85", mult: { AGI: 1.5, VIT: 0.85 } },
    ban_thach: { name: "Bàn Thạch Thể", desc: "VIT ×1.5.", cost: "AGI ×0.85", mult: { VIT: 1.5, AGI: 0.85 } },
    tue_nhan: { name: "Tuệ Nhãn Thông Thiên", desc: "INT ×1.5.", cost: "STR ×0.85", mult: { INT: 1.5, STR: 0.85 } },
    tinh_tam: { name: "Tĩnh Tâm Như Thủy", desc: "WIS ×1.5.", cost: "STR ×0.85", mult: { WIS: 1.5, STR: 0.85 } },
    phuc_tinh: { name: "Phúc Tinh Cao Chiếu", desc: "LUK ×2.", cost: "VIT ×0.9", mult: { LUK: 2, VIT: 0.9 } },
    toan_tai: { name: "Toàn Tài", desc: "Mọi chỉ số ×1.08.", cost: "−", mult: { STR: 1.08, AGI: 1.08, VIT: 1.08, INT: 1.08, WIS: 1.08, LUK: 1.08 } },
    sat_than: { name: "Sát Thần Nhãn", desc: "Chí mạng +8%; sát thương chí mạng +0.3.", cost: "Né tránh −3%", dx: { crit: 8, critDmg: 0.3, eva: -3 } },
    linh_hau: { name: "Linh Hầu Bộ", desc: "Né tránh +6%.", cost: "Giáp vật lý ×0.9", dx: { eva: 6, defMul: 0.9 } },
    truong_sinh: { name: "Trường Sinh Thể", desc: "HP tối đa ×1.25; mỗi lượt hồi 2% HP.", cost: "Công vật lý ×0.95", dx: { hpMul: 1.25, patkMul: 0.95 }, regen: { hp: 0.02 } },
    huyet_hai: { name: "Huyết Hải", desc: "Khí Huyết tối đa ×1.4; mỗi lượt hồi thêm 5% Khí Huyết.", cost: "−", dx: { khMul: 1.4 }, regen: { kh: 0.05 } },
    ben_bi: { name: "Bền Bỉ", desc: "Thể lực tối đa ×1.4; mỗi lượt hồi thêm 4% thể lực.", cost: "−", dx: { staMul: 1.4 }, regen: { sta: 0.04 } },
    noi_cong: { name: "Nội Công Kỳ Tài", desc: "Sát thương nội công và chiêu Mạch Ẩn ×1.3.", cost: "Ngoại công ×0.9", noiMul: 1.3, ngoaiMul: 0.9 },
    ngoai_gia: { name: "Ngoại Gia Cao Thủ", desc: "Sát thương ngoại công ×1.25.", cost: "Nội công ×0.85", ngoaiMul: 1.25, noiMul: 0.85 },
    thiet_bich: { name: "Thiết Bích", desc: "Mọi sát thương phải chịu ×0.85.", cost: "AGI ×0.9", mult: { AGI: 0.9 }, taken: 0.85 },
    ngo_tinh: { name: "Ngộ Tính Siêu Phàm", desc: "EXP nhận ×1.25.", cost: "−", expMul: 1.25 },
    tien_phat: { name: "Tiên Phát Chế Nhân", desc: "Luôn ra đòn trước ở lượt đầu, đòn đầu ×1.3.", cost: "Sát thương chí mạng −0.1", dx: { critDmg: -0.1 }, first: true },
    hau_phat: { name: "Hậu Phát Chế Nhân", desc: "Sát thương ×1.25 khi HP dưới 50%.", cost: "−", lowHp: 1.25 },
    thiet_cot: { name: "Thiết Cốt", desc: "VIT ×1.3; giảm 10% sát thương vật lý phải chịu.", cost: "−", mult: { VIT: 1.3 } },
    than_hanh: { name: "Thần Hành", desc: "AGI ×1.3; bỏ chạy luôn thành công trước địch cùng Rank hoặc thấp hơn.", cost: "−", mult: { AGI: 1.3 } },
    ba_vuong: { name: "Bá Vương Lực", desc: "STR ×1.3.", cost: "−", mult: { STR: 1.3 } },
    linh_giac: { name: "Linh Giác", desc: "WIS ×1.3; phát hiện mai phục, độc trong đồ ăn.", cost: "−", mult: { WIS: 1.3 } },
    thong_tue: { name: "Thông Tuệ", desc: "INT ×1.3; giải mã bí kíp nhanh hơn.", cost: "−", mult: { INT: 1.3 } },
    thien_van: { name: "Thiên Vận", desc: "LUK ×1.5; tỉ lệ rơi đồ phẩm Bảo trở lên ×1.25.", cost: "−", mult: { LUK: 1.5 } },
    doc_the: { name: "Độc Thể", desc: "Miễn độc Rank ≤ C; trúng độc hồi Khí Huyết thay vì mất HP.", cost: "Thuốc chữa thương giảm 30% tác dụng" },
    bat_tu: { name: "Bất Tử Thân", desc: "Mỗi trận sống lại 1 lần với 20% HP.", cost: "Sau đó suy yếu 1 ngày (−10% chỉ số)" },
    ma_tinh: { name: "Ma Tính", desc: "Sát thương +3% cho mỗi 10% HP đã mất.", cost: "Đạo đức dễ trượt về Ma" },
    hiep_cot: { name: "Hiệp Cốt", desc: "Danh vọng tốt nhận ×1.5; NPC lương thiện dễ tin.", cost: "Bị tà phái nhắm sớm" },
    anh_tu: { name: "Ảnh Tử", desc: "+5 cho mọi kiểm tra lẩn trốn ban đêm; đánh lén ×2 sát thương.", cost: "−" },
    quai_nhan: { name: "Quái Nhãn", desc: "Quan sát chiêu thức đặc trưng của đối thủ là học lỏm được (60% uy lực).", cost: "Chiêu học lỏm chỉ đạt 60%" },
    y_thanh: { name: "Y Thánh Thủ", desc: "Thuốc và kỹ năng hồi phục ×1.5.", cost: "−" },
    thuong_nhan: { name: "Thương Nhân Thiên Bẩm", desc: "Mua rẻ 20%, bán đắt 20%.", cost: "−" },
    huyet_chien: { name: "Huyết Chiến", desc: "Mỗi địch hạ được hồi 10% HP.", cost: "−" },
    kim_cuong: { name: "Kim Cương Bất Hoại", desc: "Giáp vật lý ×1.5.", cost: "AGI ×0.9", mult: { AGI: 0.9 } },
    thien_sinh: { name: "Thiên Sinh Thần Lực", desc: "STR ×1.2, VIT ×1.2.", cost: "INT ×0.9", mult: { STR: 1.2, VIT: 1.2, INT: 0.9 } },
    kiem_ma: { name: "Kiếm Ma Huyết Mạch", desc: "Mở điều kiện Class ẩn Tuyệt Mạch Kiếm Ma.", cost: "Chính phái nghi kỵ khi lộ diện", rare: true },
    thien_ma: { name: "Thiên Ma Chi Thể", desc: "Mọi sát thương gây ra ×1.3, cả ngoại công lẫn nội công.", cost: "HP tối đa ×0.85", rare: true, ngoaiMul: 1.3, noiMul: 1.3, dx: { hpMul: 0.85 } },
    cuu_duong: { name: "Cửu Dương Chân Thể", desc: "HP tối đa ×1.4; mỗi lượt hồi 4% HP.", cost: "Khí Huyết tối đa ×0.8", rare: true, dx: { hpMul: 1.4, khMul: 0.8 }, regen: { hp: 0.04 } },
    than_toan: { name: "Thiên Cơ Thần Toán", desc: "INT ×1.3; mỗi trận được gieo lại xúc xắc thêm 2 lần.", cost: "−", rare: true, mult: { INT: 1.3 }, rerolls: 2 },
    long_tuong: { name: "Long Tượng Thần Lực", desc: "STR ×1.4, VIT ×1.4.", cost: "AGI ×0.9", rare: true, mult: { STR: 1.4, VIT: 1.4, AGI: 0.9 } },
    phong_loi: { name: "Phong Lôi Ảnh Bộ", desc: "Né tránh +12%; luôn ra đòn trước ở lượt đầu, đòn đầu ×1.3.", cost: "Giáp vật lý ×0.85", rare: true, dx: { eva: 12, defMul: 0.85 }, first: true },
  };

  /* ---------------- Vũ khí ---------------- */
  KM.WEAPON_TYPES = {
    tay: { name: "Tay không", range: 2, atkMul: 1.0, desc: "Không có đặc trưng." },
    kiem: { name: "Kiếm", range: 2, atkMul: 1.0, desc: "Kiếm Thế: chí mạng +5%, sát thương chí mạng ×1.75." },
    dao: { name: "Đao", range: 2, atkMul: 1.3, desc: "Phá Giáp: bỏ qua 20% giáp. Né −3%." },
    con: { name: "Trường côn", range: 3, atkMul: 0.9, desc: "Quét Ngang: đánh thường trúng tối đa 3 địch (70% mỗi địch), 15% choáng; giáp +10%." },
    thuong: { name: "Thương", range: 3, atkMul: 1.1, desc: "Tiên Phát: lượt đầu ra đòn trước địch tầm ngắn hơn; xuyên 2 địch; cưỡi ngựa +20%. Bị áp sát −15%." },
    quyen: { name: "Quyền sáo", range: 1, atkMul: 0.6, desc: "Liên Kích: đánh thường 2 đòn; mỗi đòn trúng +1 Khí Thế (tối đa 5, +4%/tầng)." },
  };
  KM.RANGE_NAME = { 1: "Ngắn", 2: "Trung", 3: "Dài" };

  /* ---------------- Phẩm chất ---------------- */
  KM.QUALITIES = ["Phàm", "Lương", "Tinh", "Bảo", "Huyền", "Thần", "Vô Song"];
  KM.QUALITY_DROP = { "Phàm": 40, "Lương": 20, "Tinh": 8, "Bảo": 3, "Huyền": 1, "Thần": 0.2 };
  KM.QUALITY_MIN_RANK = { "Phàm": "E", "Lương": "E", "Tinh": "D", "Bảo": "B", "Huyền": "A", "Thần": "S" };

  /* ---------------- Vật phẩm ----------------
     slot: weapon | head | body | wrist | boots | belt | jade
     st: cộng chỉ số; atk: Công; def: Giáp; crit/eva: % */
  const W = (name, wtype, q, rank, atk, extra, req, price) => Object.assign({ name, slot: "weapon", wtype, q, rank, atk, req, price }, extra);
  const A = (name, slot, q, rank, def, extra, req, price) => Object.assign({ name, slot, q, rank, def, req, price }, extra);
  KM.ITEMS = {
    // Kiếm
    thiet_kiem: W("Thiết Kiếm", "kiem", "Phàm", "E", 5, {}, { lv: 1 }, 400),
    thanh_phong_kiem: W("Thanh Phong Kiếm", "kiem", "Tinh", "D", 12, { st: { AGI: 3 }, crit: 3 }, { lv: 10, AGI: 15 }, 7000),
    thu_thuy_kiem: W("Thu Thủy Kiếm", "kiem", "Huyền", "A", 48, { st: { AGI: 12 }, crit: 6, critDmg: 2.0 }, { lv: 45, AGI: 80 }, 3000000),
    // Đao
    phac_dao: W("Phác Đao", "dao", "Phàm", "E", 7, { st: { AGI: -1 } }, { lv: 1 }, 450),
    ho_dau_dao: W("Hổ Đầu Đao", "dao", "Tinh", "C", 22, { st: { STR: 5 } }, { lv: 20, STR: 35 }, 15000),
    ba_vuong_dao: W("Bá Vương Đao", "dao", "Huyền", "A", 60, { st: { STR: 15 }, pierce: 0.3 }, { lv: 45, STR: 90 }, 3000000),
    // Côn
    te_mi_con: W("Tề Mi Côn", "con", "Phàm", "E", 5, { def: 2 }, { lv: 1 }, 350),
    o_moc_con: W("Ô Mộc Côn", "con", "Tinh", "D", 11, { st: { VIT: 3 }, def: 4 }, { lv: 12, STR: 15 }, 7000),
    nhu_y_con: W("Như Ý Bàn Long Côn", "con", "Huyền", "A", 45, { st: { VIT: 12 }, def: 12, sweep: 4 }, { lv: 45, STR: 70 }, 3000000),
    // Thương
    hong_anh_thuong: W("Hồng Anh Thương", "thuong", "Phàm", "E", 6, {}, { lv: 1 }, 420),
    long_dam_thuong: W("Long Đảm Thương", "thuong", "Bảo", "B", 36, { st: { STR: 6, AGI: 8 }, crit: 4 }, { lv: 30, STR: 50 }, 80000),
    luong_ngan_thuong: W("Lượng Ngân Thương", "thuong", "Huyền", "A", 55, { st: { STR: 12, AGI: 10 }, mounted: 0.3 }, { lv: 45, STR: 75 }, 3000000),
    // Quyền sáo
    bo_quyen_sao: W("Bố Quyền Sáo", "quyen", "Phàm", "E", 4, { st: { AGI: 1 } }, { lv: 1 }, 300),
    thiet_chi_ho_trao: W("Thiết Chỉ Hổ Trảo", "quyen", "Tinh", "D", 10, { st: { STR: 2, AGI: 2 } }, { lv: 10, STR: 15 }, 7000),
    kim_ty_thu: W("Kim Ty Thiên Tàm Thủ", "quyen", "Huyền", "A", 40, { st: { STR: 10, AGI: 10 }, maxKT: 7 }, { lv: 45, STR: 70 }, 3000000),
    // Vũ khí phẩm Lương (rơi đồ)
    tinh_cuong_kiem: W("Tinh Cương Kiếm", "kiem", "Lương", "E", 8, { crit: 1 }, { lv: 5 }, 1500),
    quy_dau_dao: W("Quỷ Đầu Đao", "dao", "Lương", "E", 10, { st: { AGI: -1 } }, { lv: 5 }, 1600),
    thiet_moc_con: W("Thiết Mộc Côn", "con", "Lương", "E", 8, { def: 3 }, { lv: 5 }, 1400),
    bach_lap_thuong: W("Bạch Lạp Thương", "thuong", "Lương", "E", 9, { st: { AGI: 1 } }, { lv: 5 }, 1500),
    thiet_quyen_sao: W("Thiết Quyền Sáo", "quyen", "Lương", "E", 7, { st: { STR: 1 } }, { lv: 5 }, 1400),
    ngu_xoa: W("Ngư Xoa Hắc Giao", "thuong", "Tinh", "D", 15, { st: { STR: 3 }, crit: 2 }, { lv: 15, STR: 20 }, 9000),

    // Giáp & phụ kiện
    ao_vai: A("Áo vải thô", "body", "Phàm", "E", 2, {}, { lv: 1 }, 150),
    khan_dau: A("Khăn vấn đầu", "head", "Phàm", "E", 1, {}, { lv: 1 }, 80),
    giay_co: A("Giày cỏ", "boots", "Phàm", "E", 0, { st: { AGI: 1 } }, { lv: 1 }, 100),
    ao_da_soi: A("Áo da sói", "body", "Lương", "E", 4, { st: { VIT: 1 } }, { lv: 3 }, 1200),
    ho_uyen_da: A("Hộ uyển da", "wrist", "Lương", "E", 1, { st: { AGI: 1 } }, { lv: 3 }, 900),
    dai_tieu_su: A("Đai lưng tiêu sư", "belt", "Lương", "E", 1, { st: { STR: 1, VIT: 1 } }, { lv: 8 }, 1500),
    giay_da_ho: A("Giày da hổ", "boots", "Tinh", "D", 2, { st: { AGI: 3 } }, { lv: 12 }, 6000),
    ao_giap_lan: A("Áo giáp lân", "body", "Tinh", "D", 8, { st: { VIT: 2 } }, { lv: 12, VIT: 15 }, 8000),
    mu_tieu_su: A("Mũ tiêu sư", "head", "Lương", "E", 2, { st: { VIT: 1 } }, { lv: 8 }, 1100),
    ngoc_thanh_tam: A("Ngọc bội Thanh Tâm", "jade", "Tinh", "D", 0, { st: { WIS: 3 } }, { lv: 10 }, 6000),
    ngoc_ho_phach: A("Ngọc hổ phách", "jade", "Lương", "E", 0, { st: { LUK: 2 } }, { lv: 1 }, 1200),
    giap_da_giao: A("Giáp da Hắc Giao", "body", "Tinh", "D", 10, { st: { VIT: 3 }, eva: 1 }, { lv: 15 }, 11000),

    // Vật phẩm tiêu hao
    banh_bao: { name: "Bánh bao", type: "use", heal: 0.15, combat: false, price: 5, desc: "Hồi 15% HP (ngoài trận)." },
    kim_sang: { name: "Kim sáng dược", type: "use", heal: 0.3, price: 50, desc: "Hồi 30% HP." },
    hoi_khi: { name: "Hồi khí tán", type: "use", kh: 0.4, price: 60, desc: "Hồi 40% Khí Huyết / Nội Lực." },
    giai_doc: { name: "Giải độc đan", type: "use", cure: true, price: 80, desc: "Giải độc và bỏng." },
    dai_hoan: { name: "Đại Hoàn Đan", type: "use", heal: 0.7, kh: 0.7, price: 900, desc: "Hồi 70% HP và Khí Huyết." },
    // Nguyên liệu (chỉ để bán / rèn)
    da_soi: { name: "Da sói", type: "mat", price: 60 },
    rang_soi: { name: "Răng sói", type: "mat", price: 40 },
    da_heo: { name: "Da heo rừng", type: "mat", price: 70 },
    nanh_heo: { name: "Nanh heo rừng", type: "mat", price: 90 },
    da_ho: { name: "Da hổ", type: "mat", price: 800 },
    xuong_ho: { name: "Xương hổ", type: "mat", price: 600 },
    sat_tinh: { name: "Sắt tinh", type: "mat", price: 300 },
    da_giao: { name: "Da Hắc Giao", type: "mat", price: 1500 },
    // Vật phẩm cốt truyện
    ngoc_tham_gia: { name: "Ngọc bội Thẩm gia", type: "key", price: 0, desc: "Miếng ngọc mẹ để lại. Mặt sau khắc chữ \"Thẩm\"." },
    manh_chan_giai: { name: "Mảnh Thiên Mạch Chân Giải", type: "key", price: 0, desc: "Mảnh lụa cũ chép phép thông kinh mạch. Mỗi mảnh tăng uy lực nhánh nội công của Shen." },
    thu_mat: { name: "Thư mật Huyết Ảnh", type: "key", price: 0, desc: "Thư hẹn giao bí kíp, đóng ấn giọt máu." },
    so_sach_giao: { name: "Sổ sách thủy trại", type: "key", price: 0, desc: "Sổ ghi các chuyến hàng độc dược Hắc Giao buôn cho Đường Môn." },
    thu_nha: { name: "Thư nhà của bà Tư", type: "key", price: 0, desc: "Gửi con trai bà, Tư Bình, làm tiểu nhị ở khách điếm Duyệt Lai, Lạc Hà." },
    hop_doc: { name: "Hộp gỗ niêm phong", type: "key", price: 0, desc: "Hộp của Đường Môn, nặng mùi thuốc. Giao cho trạm tiêu Phong Lâm." },
    duoc_thao: { name: "Dạ Quang Thảo", type: "mat", price: 120, desc: "Cỏ phát sáng ban đêm, mọc trong rừng ẩm." },
  };
  KM.SLOTS = { weapon: "Vũ khí", head: "Khăn đầu", body: "Áo giáp", wrist: "Hộ uyển", boots: "Giày", belt: "Đai lưng", jade: "Ngọc bội" };

  /* ---------------- Ngựa ---------------- */
  KM.HORSES = {
    lua: { name: "Lừa thồ", q: "Phàm", mult: 0.8, price: 2000, mounted: false, desc: "Không chiến đấu trên lưng được." },
    ngua_hong: { name: "Ngựa hồng Trung Nguyên", q: "Lương", mult: 0.65, price: 6000, mounted: true, desc: "Cho phép kỵ chiến." },
    thanh_tong: { name: "Thanh Tông Mã", q: "Tinh", mult: 0.5, price: 20000, mounted: true, speed: 0.1, desc: "Kỵ chiến: tốc độ ra đòn +10%." },
    o_truy: { name: "Ô Truy", q: "Bảo", mult: 0.4, price: 80000, mounted: true, speed: 0.1, desc: "Không bị chậm trong sa mạc." },
    chieu_da: { name: "Chiếu Dạ Ngọc Sư Tử", q: "Huyền", mult: 0.33, price: 300000, mounted: true, speed: 0.15, desc: "Đi đêm không bị phạt." },
    han_huyet: { name: "Hãn Huyết Bảo Mã", q: "Thần", mult: 0.25, price: 0, mounted: true, speed: 0.2, desc: "Bỏ chạy luôn thành công." },
  };
  KM.HORSE_FEED = 20; // đồng mỗi ngày

  /* Tuyến đường (ngày đi bộ) */
  KM.ROUTES = {
    "thanh_van>hanh_hoa": 1, "hanh_hoa>lac_ha": 1, "lac_ha>hac_phong": 1, "hac_phong>phong_lam": 2, "lac_ha>phong_lam": 3, "lac_ha>kim_lang": 6,
  };
  KM.PLACES = {
    thanh_van: "Thanh Vân Sơn", hanh_hoa: "Thôn Hạnh Hoa", lac_ha: "Trấn Lạc Hà", hac_phong: "Hắc Phong Sơn", phong_lam: "Phong Lâm Trấn", kim_lang: "Kim Lăng",
  };
  KM.PLACE_KIND = { thanh_van: "Môn phái", hanh_hoa: "Thôn làng", lac_ha: "Thị trấn", hac_phong: "Núi hoang", phong_lam: "Thị trấn", kim_lang: "Kinh thành" };
  // Tọa độ trên bản đồ thế giới (0–100)
  KM.MAP_XY = { thanh_van: [14, 22], hanh_hoa: [30, 42], lac_ha: [50, 55], hac_phong: [44, 82], phong_lam: [76, 80], kim_lang: [88, 30] };

  /* ---------------- NPC ---------------- */
  KM.NPCS = {
    to_van_yen: { name: "Tô Vân Yên", role: "Đệ tử Nga Mi, đang ở nhờ dược phòng Thanh Vân" },
    tieu_luc: { name: "Tiểu Lục", role: "Tạp dịch nhà bếp, bạn cùng phòng của Shen" },
    han_giao_dau: { name: "Hàn giáo đầu", role: "Giáo đầu diễn võ trường Thanh Vân" },
    tieu_hao: { name: "Tiêu Hạo", role: "Sư huynh nội môn Thanh Vân" },
    chuong_mon: { name: "Lục Thanh Tùng", role: "Chưởng môn Thanh Vân Phái" },
    lao_ho: { name: "Lão Hồ", role: "Lão ăn mày say rượu ở khách điếm Duyệt Lai" },
    long_tieu_chu: { name: "Long Chấn Uy", role: "Tiêu chủ Long Môn Tiêu Cục" },
    phuong_nhi: { name: "Long Phượng Nhi", role: "Con gái tiêu chủ Long Môn" },
    duong_nhat_anh: { name: "Đường Nhất Ảnh", role: "Thiếu gia Đường Môn" },
    au_tri: { name: "Âu Trì", role: "Thợ rèn ở chợ Lạc Hà" },
    ong_lao_ca: { name: "Ông lão đánh cá", role: "Ông lão chèo đò trên sông Lạc Hà" },
    quan_su_bep: { name: "Quản sự Vương", role: "Quản sự hậu trù Thanh Vân" },
    truong_thon: { name: "Trưởng thôn Lưu", role: "Trưởng thôn Hạnh Hoa" },
    ba_tra: { name: "Bà Tư bán trà", role: "Chủ quán trà đầu thôn Hạnh Hoa" },
    tho_san: { name: "Thợ săn Hạ Tứ", role: "Thợ săn trên đồi Hạnh Hoa" },
    dan_chai: { name: "Lão Ngư", role: "Trưởng dân chài bến Lạc Hà" },
    chuong_quy: { name: "Chưởng quỹ Tiền", role: "Chưởng quỹ trạm tiêu Phong Lâm" },
    lang_trung: { name: "Lang trung Mạc", role: "Thầy thuốc ở Phong Lâm" },
  };

  /* ---------------- Kẻ địch ----------------
     Chỉ số gốc theo Level (≈ 30 + 5×(Lv−1) điểm). hpMul < 1 cho quần chúng (World Rule). */
  const N = (name, rank, lv, st, o) => Object.assign({ name, rank, lv, st, wtype: "tay", watk: 0, skills: [], hpMul: 1, expMul: 0.5 }, o);
  const S = (name, mult, o) => Object.assign({ name, mult, src: "p" }, o);
  KM.ENEMIES = {
    ly_tam: N("Lý Tam", "E", 2, { STR: 8, AGI: 7, VIT: 7, INT: 4, WIS: 4, LUK: 5 }, { hpMul: 0.3, portrait: "ly_tam",
      skills: [S("Thanh Vân Quyền", 1.3, { cd: 2 })], loot: [["banh_bao", 50]], coin: [1, 3, 10] }),
    soi_xam: N("Sói xám", "E", 3, { STR: 9, AGI: 10, VIT: 7, INT: 2, WIS: 6, LUK: 6 }, { hpMul: 0.3, beast: true, portrait: "soi",
      skills: [S("Cắn xé", 1.25, { cd: 1 })], loot: [["da_soi", 60], ["rang_soi", 30], ["duoc_thao", 15]], coin: [0, 0, 0] }),
    heo_rung: N("Heo rừng", "E", 4, { STR: 12, AGI: 6, VIT: 12, INT: 2, WIS: 5, LUK: 8 }, { hpMul: 0.35, beast: true, portrait: "heo",
      skills: [S("Húc", 1.5, { cd: 2 })], loot: [["da_heo", 55], ["nanh_heo", 35]] }),
    de_tu_noi: N("Đệ tử nội môn", "E", 6, { STR: 11, AGI: 12, VIT: 10, INT: 8, WIS: 7, LUK: 7 }, { wtype: "kiem", watk: 5, hpMul: 0.45, portrait: "de_tu",
      skills: [S("Thanh Vân Kiếm Pháp", 1.4, { cd: 1 }), S("Phi Vân Kiếm", 0.7, { hits: 2, cd: 3 })], loot: [["kim_sang", 30]], coin: [1, 6, 100] }),
    son_tac: N("Sơn tặc", "E", 6, { STR: 13, AGI: 10, VIT: 11, INT: 5, WIS: 6, LUK: 10 }, { wtype: "dao", watk: 7, hpMul: 0.45, portrait: "son_tac",
      skills: [S("Chém bổ", 1.4, { cd: 1 })], loot: [["phac_dao", 15], ["kim_sang", 25], ["q:Lương", 20]], coin: [1, 6, 100] }),
    hac_y_nhan: N("Hắc y nhân", "E", 8, { STR: 12, AGI: 16, VIT: 11, INT: 9, WIS: 9, LUK: 8 }, { wtype: "kiem", watk: 6, hpMul: 0.6, portrait: "hac_y",
      skills: [S("Ám tiêu", 1.2, { src: "n", cd: 2, poison: 0.3 }), S("Đoản kiếm", 1.3, { cd: 1 })], loot: [["hoi_khi", 40], ["q:Lương", 30]], coin: [1, 6, 100], expMul: 0.6 }),
    tieu_hao: N("Tiêu Hạo", "D", 12, { STR: 16, AGI: 18, VIT: 15, INT: 12, WIS: 12, LUK: 12 }, { wtype: "kiem", watk: 12, boss: true, portrait: "tieu_hao",
      skills: [S("Phi Vân Tam Kiếm", 0.7, { hits: 3, cd: 3 }), S("Huyết Ảnh Độc Châm", 1.0, { src: "n", cd: 4, poison: 0.6 }), S("Thanh Vân Kiếm Pháp", 1.4, { cd: 1 })],
      loot: [["thanh_phong_kiem", 100], ["kim_sang", 100]], coin: [2, 6, 100], expMul: 1.2, teach: "hoc_phi_van" }),
    // Arc 2
    vo_si_1: N("Võ sĩ lôi đài Hồ Báo", "D", 11, { STR: 17, AGI: 13, VIT: 15, INT: 8, WIS: 9, LUK: 18 }, { wtype: "quyen", watk: 7, hpMul: 0.7, portrait: "vo_si",
      skills: [S("Hổ Báo Quyền", 1.4, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    vo_si_2: N("Võ sĩ lôi đài Thiết Ngưu", "D", 13, { STR: 20, AGI: 12, VIT: 19, INT: 8, WIS: 10, LUK: 21 }, { wtype: "con", watk: 8, hpMul: 0.75, portrait: "vo_si2",
      skills: [S("Thiết Ngưu Côn", 1.5, { cd: 1 }), S("Quét côn", 0.9, { cd: 3, stun: 0.25 })], loot: [], coin: [0, 0, 0] }),
    vo_si_3: N("Võ sĩ lôi đài Lãnh Nguyệt", "D", 16, { STR: 18, AGI: 24, VIT: 17, INT: 14, WIS: 14, LUK: 18 }, { wtype: "kiem", watk: 12, hpMul: 0.8, portrait: "vo_si3",
      skills: [S("Lãnh Nguyệt Kiếm", 1.5, { cd: 1 }), S("Nguyệt Ảnh Tam Liên", 0.7, { hits: 3, cd: 3 })], loot: [["q:Tinh", 25]], coin: [0, 0, 0] }),
    tieu_dau: N("Tiêu đầu Mã Đại", "D", 11, { STR: 17, AGI: 13, VIT: 16, INT: 9, WIS: 9, LUK: 16 }, { wtype: "dao", watk: 10, hpMul: 0.7, portrait: "tieu_dau",
      skills: [S("Khai Sơn Đao", 1.5, { cd: 1 })], loot: [], coin: [0, 0, 0], expMul: 0.5 }),
    cuop_duong: N("Cướp đường", "D", 11, { STR: 16, AGI: 15, VIT: 15, INT: 7, WIS: 9, LUK: 18 }, { wtype: "dao", watk: 10, hpMul: 0.55, portrait: "son_tac",
      skills: [S("Chém bổ", 1.4, { cd: 1 })], loot: [["kim_sang", 40], ["sat_tinh", 25], ["q:Lương", 25], ["q:Tinh", 4]], coin: [2, 6, 100] }),
    soi_dau_dan: N("Sói đầu đàn", "D", 13, { STR: 18, AGI: 21, VIT: 15, INT: 4, WIS: 14, LUK: 18 }, { hpMul: 0.5, beast: true, portrait: "soi",
      skills: [S("Cắn xé", 1.35, { cd: 1 }), S("Tru gọi bầy", 0.8, { hits: 2, cd: 3 })], loot: [["da_soi", 80], ["rang_soi", 60], ["q:Lương", 15]] }),
    thuy_phi: N("Thủy phỉ", "D", 12, { STR: 17, AGI: 15, VIT: 16, INT: 7, WIS: 10, LUK: 20 }, { wtype: "thuong", watk: 9, hpMul: 0.55, portrait: "thuy_phi",
      skills: [S("Đâm xiên", 1.4, { cd: 1 })], loot: [["kim_sang", 35], ["hoi_khi", 20], ["sat_tinh", 20], ["q:Lương", 25], ["q:Tinh", 5]], coin: [2, 6, 100] }),
    son_tac_dau: N("Đầu mục Hắc Phong Trại", "D", 14, { STR: 21, AGI: 16, VIT: 20, INT: 10, WIS: 11, LUK: 17 }, { wtype: "dao", watk: 22, boss: true, portrait: "dau_muc",
      skills: [S("Hắc Phong Đao", 1.5, { cd: 1 }), S("Liên Hoàn Trảm", 0.8, { hits: 2, cd: 3 })], loot: [["q:Tinh", 100], ["dai_hoan", 50]], coin: [3, 6, 100], expMul: 0.9 }),
    sat_thu: N("Sát thủ Huyết Ảnh", "D", 15, { STR: 16, AGI: 26, VIT: 15, INT: 14, WIS: 13, LUK: 16 }, { wtype: "kiem", watk: 12, hpMul: 0.75, portrait: "hac_y",
      skills: [S("Huyết Ảnh Thích", 1.5, { cd: 1 }), S("Độc châm", 1.0, { src: "n", cd: 3, poison: 0.5 })], loot: [["hoi_khi", 60], ["q:Tinh", 15]], coin: [2, 6, 100], expMul: 0.6 }),
    ho_du: N("Hổ dữ", "C", 22, { STR: 32, AGI: 26, VIT: 30, INT: 4, WIS: 18, LUK: 25 }, { hpMul: 0.6, beast: true, portrait: "ho",
      skills: [S("Hổ vồ", 1.5, { cd: 1 }), S("Gầm thét", 0.6, { cd: 4, stun: 0.4 })], loot: [["da_ho", 70], ["xuong_ho", 40], ["q:Tinh", 8], ["giay_da_ho", 10]], coin: [0, 0, 0] }),
    hac_giao: N("Thủy phỉ Hắc Giao", "D", 18, { STR: 24, AGI: 20, VIT: 22, INT: 14, WIS: 15, LUK: 20 }, { wtype: "thuong", watk: 18, boss: true, hpMul: 1.15, portrait: "hac_giao",
      skills: [S("Phân Thủy Thích", 1.5, { cd: 1 }), S("Giao Long Xuất Hải", 0.75, { hits: 3, cd: 3 }), S("Độc thủy tiễn", 1.1, { src: "n", cd: 4, poison: 0.6 })],
      loot: [["pick:o_moc_con,thiet_chi_ho_trao,thanh_phong_kiem", 100], ["da_giao", 50], ["ngu_xoa", 30]], coin: [2, 6, 100], expMul: 1.0, teach: "hoc_giao_long" }),
  };

  /* ---------------- Ngoại hình kẻ địch dùng cho chân dung ---------------- */
  KM.FOE_ART = {};

  /* ---------------- Cửa hàng ---------------- */
  KM.SHOPS = {
    tap_hoa: { name: "Tạp hóa sơn môn", stock: ["banh_bao", "kim_sang", "hoi_khi", "ao_vai", "khan_dau", "giay_co", "thiet_kiem", "phac_dao", "te_mi_con", "hong_anh_thuong", "bo_quyen_sao"] },
    binh_khi: { name: "Tiệm binh khí Lạc Hà", stock: ["thiet_kiem", "phac_dao", "te_mi_con", "hong_anh_thuong", "bo_quyen_sao", "tinh_cuong_kiem", "quy_dau_dao", "thiet_moc_con", "bach_lap_thuong", "thiet_quyen_sao", "ao_da_soi", "ho_uyen_da", "mu_tieu_su", "dai_tieu_su", "ao_giap_lan"] },
    hieu_thuoc: { name: "Hiệu thuốc Hồi Xuân", stock: ["banh_bao", "kim_sang", "hoi_khi", "giai_doc", "dai_hoan"] },
    cho_den: { name: "Chợ đen bến sông", night: true, stock: ["hoi_khi", "giai_doc", "dai_hoan", "ngoc_ho_phach", "ngoc_thanh_tam", "giay_da_ho"], markup: 1.3 },
    thu_quan: { name: "Thư quán Văn Uyên", stock: ["bk:2"] },
  };
  KM.HORSE_SHOP = ["lua", "ngua_hong", "thanh_tong"];
})(typeof window !== "undefined" ? window : globalThis);
