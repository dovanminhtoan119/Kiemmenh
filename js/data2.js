/* =====================================================================
   KIẾM MỆNH · DỮ LIỆU ARC 3–9
   Trang bị theo bậc, kẻ địch, địa điểm, NPC, cửa hàng, phần thưởng đột phá.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const I = KM.ITEMS;
  const W = (name, wtype, q, rank, atk, extra, req, price) => Object.assign({ name, slot: "weapon", wtype, q, rank, atk, req, price }, extra);
  const A = (name, slot, q, rank, def, extra, req, price) => Object.assign({ name, slot, q, rank, def, req, price }, extra);

  /* ---------------- Trang bị theo bậc ----------------
     Mỗi bậc một bộ vũ khí cho 5 loại + 6 món giáp/phụ kiện. Giá và chỉ số tăng theo cảnh giới. */
  const TIERS = [
    { k: "c", q: "Tinh", rank: "C", lv: 20, atk: 22, def: 12, st: 5, price: 15000, set: "Thanh Đồng", jade: "Ngọc Thanh Bích" },
    { k: "b", q: "Bảo", rank: "B", lv: 30, atk: 36, def: 18, st: 8, price: 80000, set: "Hàn Thiết", jade: "Ngọc Huyết Hồng" },
    { k: "a", q: "Huyền", rank: "A", lv: 45, atk: 52, def: 26, st: 12, price: 400000, set: "Huyền Vũ", jade: "Ngọc Tử Kim" },
    { k: "s", q: "Thần", rank: "S", lv: 60, atk: 72, def: 34, st: 16, price: 1200000, set: "Long Lân", jade: "Ngọc Long Văn" },
    { k: "ss", q: "Thần", rank: "SS", lv: 75, atk: 92, def: 44, st: 22, price: 3500000, set: "Thiên Tàm", jade: "Ngọc Thiên Tâm" },
  ];
  const WNAME = {
    kiem: ["Lưu Vân Kiếm", "Bích Thủy Kiếm", null, "Tử Điện Kiếm", "Hiên Viên Kiếm"],
    dao: [null, "Huyết Nguyệt Đao", null, "Liệt Hỏa Thần Đao", "Đoạn Nhạc Thiên Đao"],
    con: ["Hàng Ma Côn", "Kim Cương Côn", null, "Định Hải Côn", "Kình Thiên Thần Côn"],
    thuong: ["Phá Trận Thương", null, null, "Bá Vương Thương", "Long Hồn Thần Thương"],
    quyen: ["Hắc Thiết Quyền Sáo", "Huyền Băng Thủ", null, "Liệt Dương Thủ", "Thiên Ma Thủ"],
  };
  const WMAIN = { kiem: "AGI", dao: "STR", con: "VIT", thuong: "STR", quyen: "STR" };
  const WEXTRA = { kiem: (t) => ({ crit: 2 + t }), dao: (t) => ({ pierce: 0.05 * t }), con: (t) => ({ def: 3 + 3 * t }), thuong: (t) => ({ mounted: 0.2 + 0.05 * t }), quyen: (t) => ({ maxKT: 5 + Math.min(3, t) }) };
  // Vũ khí bậc A đã có sẵn (Huyền); chỉnh giá cho hợp kinh tế các arc sau
  ["thu_thuy_kiem", "ba_vuong_dao", "nhu_y_con", "luong_ngan_thuong", "kim_ty_thu"].forEach((id) => (I[id].price = 400000));
  I.ho_dau_dao.price = 15000; I.long_dam_thuong.price = 80000;
  KM.TIER_WEAPON = { c: {}, b: {}, a: {}, s: {}, ss: {} };
  KM.TIER_WEAPON.c.dao = "ho_dau_dao"; KM.TIER_WEAPON.b.thuong = "long_dam_thuong";
  Object.assign(KM.TIER_WEAPON.a, { kiem: "thu_thuy_kiem", dao: "ba_vuong_dao", con: "nhu_y_con", thuong: "luong_ngan_thuong", quyen: "kim_ty_thu" });
  TIERS.forEach((T, ti) => {
    for (const wt in WNAME) {
      const nm = WNAME[wt][ti]; if (!nm) continue;
      const id = "w" + T.k + "_" + wt;
      I[id] = W(nm, wt, T.q, T.rank, T.atk, Object.assign({ st: { [WMAIN[wt]]: T.st } }, WEXTRA[wt](ti + 1)), { lv: T.lv }, T.price);
      KM.TIER_WEAPON[T.k][wt] = id;
    }
    const sl = [["body", "Giáp " + T.set, 1, "VIT"], ["head", "Mũ " + T.set, 0.4, "VIT"], ["wrist", "Hộ uyển " + T.set, 0.3, "AGI"], ["boots", "Giày " + T.set, 0.2, "AGI"], ["belt", "Đai " + T.set, 0.3, "STR"]];
    sl.forEach(([slot, nm, f, k]) => { I["a" + T.k + "_" + slot] = A(nm, slot, T.q, T.rank, Math.round(T.def * f), { st: { [k]: Math.round(T.st * (slot === "body" ? 0.8 : 0.5)) } }, { lv: T.lv }, Math.round(T.price * (slot === "body" ? 0.7 : 0.35))); });
    I["a" + T.k + "_jade"] = A(T.jade, "jade", T.q, T.rank, 0, { st: { WIS: Math.round(T.st * 0.6), LUK: Math.round(T.st * 0.4) } }, { lv: T.lv }, Math.round(T.price * 0.5));
  });
  KM.tierGear = (k) => Object.keys(I).filter((id) => id.startsWith("a" + k + "_")).concat(Object.values(KM.TIER_WEAPON[k]));

  Object.assign(I, {
    // Trang bị đặc biệt theo cốt truyện
    ao_long_tuyet: A("Áo lông tuyết lang", "body", "Bảo", "A", 18, { st: { VIT: 6 }, cold: true }, { lv: 45 }, 250000),
    huyet_y_giap: A("Huyết Y", "body", "Huyền", "S", 22, { st: { AGI: 12 }, eva: 8 }, { lv: 60 }, 900000),
    ao_thien_son: A("Áo choàng Thiên Sơn", "body", "Thần", "SS", 34, { st: { VIT: 12 }, cold: true }, { lv: 75 }, 3000000),
    thien_co_ky_ban: A("Thiên Cơ Kỳ Bàn", "jade", "Vô Song", "SSS", 0, { st: { STR: 15, AGI: 15, VIT: 15, INT: 15, WIS: 15, LUK: 15 } }, { lv: 85 }, 0),
    // Tiêu hao
    tui_nuoc: { name: "Túi nước", type: "mat", price: 20, desc: "Mỗi ngày trong sa mạc uống hết một túi." },
    tuyet_tinh: { name: "Tuyết Tinh", type: "use", kh: 0.3, price: 2000, desc: "Hồi 30% Khí Huyết." },
    cuu_chuyen: { name: "Cửu Chuyển Hoàn Hồn Đan", type: "use", heal: 1, kh: 1, price: 20000, desc: "Hồi đầy HP và Khí Huyết." },
    // Nguyên liệu
    kiem_thach: { name: "Kiếm Thạch", type: "mat", price: 5000, desc: "Đá ngấm kiếm ý. Thợ rèn trả giá cao." },
    da_tuyet_lang: { name: "Da tuyết lang", type: "mat", price: 3000 },
    linh_kien: { name: "Linh kiện cơ quan", type: "mat", price: 12000 },
    vay_bo_cap: { name: "Vỏ bọ cạp cát", type: "mat", price: 1500 },
    nu_nhi_hong: { name: "Nữ Nhi Hồng", type: "mat", price: 300, desc: "Rượu ngon chợ Đông. Lão Hồ thích nhất." },
    // Vật phẩm cốt truyện
    khuon_dong: { name: "Khuôn đồng Thiên Ma Chưởng", type: "key", price: 0, desc: "Khuôn đúc in dấu bàn tay, giấu trong kho phủ Minh chủ. Ai in dấu này lên xác người, giang hồ sẽ tin đó là Thiên Ma Chưởng." },
    so_kho: { name: "Sổ kho chép tay", type: "key", price: 0, desc: "Trang sổ kho phủ Minh chủ ghi một dòng: \"Thẩm gia trang — khuôn đồng, xuất kho.\"" },
    danh_sach: { name: "Danh sách ám sát Huyết Ảnh", type: "key", price: 0, desc: "\"Thẩm gia trang. Người thuê: phủ Minh chủ. Người đổ tội: Thiên Ma Giáo.\"" },
    thu_minh_chu: { name: "Thư tay Minh chủ", type: "key", price: 0, desc: "Thư Tạ Thiên Hành gửi Hữu hộ pháp Cừu Thiên Liệt, hẹn ngày đảo chính." },
    ban_chep: { name: "Bản chép thư Minh chủ", type: "key", price: 0, desc: "Bản chép tay, đủ để thuyết phục người tin Shen." },
    an_tin: { name: "Ấn tín phủ Minh chủ", type: "key", price: 0, desc: "Tìm thấy trên xác Lâu chủ Huyết Y." },
    lenh_cam_y: { name: "Lệnh bài Cẩm Y", type: "key", price: 0, desc: "Gỡ lệnh truy nã một lần." },
    minh_chu_lenh: { name: "Minh Chủ Lệnh", type: "key", price: 0, desc: "Lệnh bài của Minh chủ Võ Lâm." },
    ban_ve_co_quan: { name: "Bản vẽ cơ quan", type: "key", price: 0, desc: "Bản vẽ cơ quan Thiên Cơ Các." },
    the_bai: { name: "Thẻ bài người giữ kiếm", type: "mat", price: 0, desc: "Thẻ đồng khắc tên người giữ kiếm đời trước." },
  });

  // Vô Danh Binh: mang hình dạng vũ khí hợp Võ Đạo của chủ nhân
  const VDN = { kiem: "Vô Danh Kiếm", dao: "Vô Danh Đao", con: "Vô Danh Côn", thuong: "Vô Danh Thương", quyen: "Vô Danh Thủ" };
  for (const wt in VDN) I["vo_danh_" + wt] = W(VDN[wt], wt, "Vô Song", "S", 80, { st: { [WMAIN[wt]]: 20 }, pierce: 0.5, desc: "Binh khí của Kiếm Thần Vô Danh. Mỗi đòn bỏ qua một nửa giáp." }, { lv: 55 }, 0);

  /* ---------------- Phe & NPC ---------------- */
  Object.assign(KM.FACTIONS, {
    vo_lam: "Võ Lâm Minh", thieu_lam: "Thiếu Lâm", vo_dang: "Võ Đang", nga_mi: "Nga Mi", ma_giao: "Thiên Ma Giáo", trieu_dinh: "Triều đình",
  });
  Object.assign(KM.NPCS, {
    ta_thien_hanh: { name: "Tạ Thiên Hành", role: "Minh chủ Võ Lâm" },
    ta_van_phi: { name: "Tạ Vân Phi", role: "Con trai Minh chủ, đệ nhất kiếm khách thiếu niên" },
    trieu_phuc: { name: "Triệu Phúc", role: "Quản gia phủ Minh chủ" },
    ong_lao_tra: { name: "Ông lão bán trà", role: "Chủ quán trà nhỏ ở Kim Lăng, mê cờ" },
    hue_nang: { name: "Huệ Năng", role: "Đệ tử Thiếu Lâm" },
    thanh_hu: { name: "Chân nhân Thanh Hư", role: "Trưởng lão Võ Đang" },
    hue_tri: { name: "Phương trượng Huệ Trì", role: "Trụ trì chùa Thiện Giác ngoại ô Kim Lăng" },
    lien_nhi: { name: "Liên Nhi", role: "Sát thủ trẻ của Huyết Ảnh Lâu" },
    quy_anh: { name: "Quỷ Ảnh", role: "Phó lâu chủ Huyết Ảnh Lâu" },
    da_vo_thuong: { name: "Dạ Vô Thương", role: "Giáo chủ Thiên Ma Giáo" },
    da_linh: { name: "Dạ Linh", role: "Con gái Giáo chủ Thiên Ma Giáo" },
    cuu_thien_liet: { name: "Cừu Thiên Liệt", role: "Hữu hộ pháp Thiên Ma Giáo" },
    lao_tuong: { name: "Lão tướng Mạnh Cương", role: "Tướng biên phòng già" },
    thien_co: { name: "Thiên Cơ Lão Nhân", role: "Kẻ đứng sau bàn cờ" },
    lao_dan_duong: { name: "Lão dẫn đường", role: "Thợ săn già dưới chân Thiên Sơn" },
  });

  /* ---------------- Địa điểm & tuyến đường ---------------- */
  Object.assign(KM.PLACES, {
    ngoai_o: "Ngoại ô Kim Lăng", van_thuy: "Vân Thủy Thành", luong_chau: "Lương Châu", nguyet_nha: "Nguyệt Nha Tuyền", thanh_hoa: "Thánh Hỏa Sơn",
    tuyet_linh: "Tuyết Lĩnh Trấn", kiem_trung: "Kiếm Trủng", nga_mi: "Nga Mi Sơn", vo_dang: "Võ Đang Sơn", thien_son: "Thiên Sơn",
  });
  Object.assign(KM.PLACE_KIND, {
    ngoai_o: "Thôn làng", van_thuy: "Thị trấn", luong_chau: "Biên ải", nguyet_nha: "Ốc đảo", thanh_hoa: "Tổng đàn Ma Giáo",
    tuyet_linh: "Thị trấn", kiem_trung: "Bí cảnh", nga_mi: "Môn phái", vo_dang: "Môn phái", thien_son: "Núi tuyết",
  });
  Object.assign(KM.ROUTES, {
    "kim_lang>ngoai_o": 0.5, "kim_lang>van_thuy": 4, "phong_lam>van_thuy": 3, "kim_lang>luong_chau": 12, "luong_chau>nguyet_nha": 3, "nguyet_nha>thanh_hoa": 3,
    "kim_lang>tuyet_linh": 10, "luong_chau>tuyet_linh": 9, "tuyet_linh>kiem_trung": 1, "kim_lang>vo_dang": 3, "kim_lang>nga_mi": 4, "nga_mi>vo_dang": 2, "vo_dang>lac_ha": 3, "nga_mi>lac_ha": 2, "kim_lang>thien_son": 14,
  });
  KM.MAP_XY = {
    thanh_van: [32, 37], hanh_hoa: [38, 50], lac_ha: [50, 60], hac_phong: [44, 76], phong_lam: [62, 80], kim_lang: [78, 46], ngoai_o: [87, 57], van_thuy: [84, 72],
    luong_chau: [16, 26], nguyet_nha: [13, 46], thanh_hoa: [11, 64], tuyet_linh: [64, 14], kiem_trung: [80, 8], nga_mi: [28, 86], vo_dang: [60, 34], thien_son: [36, 8],
  };
  KM.HORSE_SHOP2 = { luong_chau: ["ngua_hong", "thanh_tong", "o_truy"], kim_lang: ["ngua_hong", "thanh_tong", "o_truy", "chieu_da"] };

  /* ---------------- Cửa hàng ---------------- */
  const tg = KM.tierGear;
  Object.assign(KM.SHOPS, {
    kl_binh_khi: { name: "Binh khí phường chợ Đông", stock: tg("c").concat(["ho_uyen_da", "ao_giap_lan"]) },
    kl_thuoc: { name: "Đồng Nhân Đường", stock: ["kim_sang", "hoi_khi", "giai_doc", "dai_hoan"] },
    kl_cuu_tu: { name: "Kho Long Môn Kim Lăng", stock: tg("b").concat(tg("a")) },
    vt_thuong_hoi: { name: "Thương hội Vân Thủy", stock: tg("b").concat(["dai_hoan", "giai_doc", "hoi_khi", "kim_sang"]) },
    lc_cho: { name: "Chợ biên ải Lương Châu", stock: ["tui_nuoc", "kim_sang", "hoi_khi", "giai_doc", "dai_hoan"].concat(tg("b")) },
    th_ma_kho: { name: "Binh khố Thánh Hỏa", stock: tg("a").concat(["dai_hoan", "hoi_khi"]) },
    tl_lo_ren: { name: "Lò rèn băng Tuyết Lĩnh", stock: ["ao_long_tuyet"].concat(tg("a"), ["dai_hoan", "hoi_khi", "giai_doc"]) },
    quan_nhu: { name: "Quân nhu tiền tuyến", stock: tg("s").concat(["dai_hoan", "cuu_chuyen", "hoi_khi"]) },
    kl_tran_bao: { name: "Trân Bảo Các Kim Lăng", stock: tg("s").concat(tg("ss"), ["cuu_chuyen", "dai_hoan"]) },
    ts_bach_thuy: { name: "Lều buôn trấn Bạch Thủy", stock: tg("ss").concat(["ao_thien_son", "cuu_chuyen", "dai_hoan", "tuyet_tinh"]) },
  });

  /* ---------------- Kẻ địch ----------------
     Tổng điểm chỉ số = 30 + 5 × (Lv − 1). HP = (100 + 20 × VIT + 5 × Lv) × hpMul. */
  const st = (a) => ({ STR: a[0], AGI: a[1], VIT: a[2], INT: a[3], WIS: a[4], LUK: a[5] });
  const N = (name, rank, lv, s6, o) => Object.assign({ name, rank, lv, st: st(s6), wtype: "tay", watk: 0, skills: [], hpMul: 1, expMul: 0.5 }, o);
  const S = (name, mult, o) => Object.assign({ name, mult, src: "p" }, o);
  const C = { C: 400, B: 1000, A: 3000, S: 6000, SS: 12000, SSS: 20000 };
  const coin = (r) => [3, 6, C[r]];
  Object.assign(KM.ENEMIES, {
    /* Arc 3 · Kim Lăng */
    du_con: N("Du côn bến cảng", "D", 20, [28, 26, 25, 10, 16, 20], { wtype: "quyen", watk: 10, hpMul: 0.5, portrait: "son_tac", skills: [S("Đấm móc", 1.4, { cd: 1 })], loot: [["kim_sang", 40], ["q:Tinh", 6]], coin: [3, 6, 300] }),
    tho_phi_c: N("Thổ phỉ ngoại ô", "C", 23, [30, 26, 28, 12, 18, 26], { wtype: "dao", watk: 18, hpMul: 0.5, portrait: "son_tac", skills: [S("Chém bổ", 1.5, { cd: 1 }), S("Loạn đao", 0.8, { hits: 2, cd: 3 })], loot: [["kim_sang", 40], ["sat_tinh", 30], ["q:Tinh", 8]], coin: coin("C") }),
    cam_y: N("Lính tuần Cẩm Y Ti", "C", 22, [30, 25, 30, 15, 20, 15], { wtype: "dao", watk: 18, hpMul: 0.55, portrait: "tieu_dau", skills: [S("Tú Xuân Đao", 1.5, { cd: 1 })], loot: [["hoi_khi", 40], ["q:Tinh", 8]], coin: coin("C") }),
    thi_ve_phu: N("Thị vệ phủ Minh chủ", "C", 24, [34, 26, 34, 14, 20, 17], { wtype: "thuong", watk: 20, hpMul: 0.6, portrait: "de_tu", skills: [S("Tỏa Hầu Thương", 1.5, { cd: 1 }), S("Liên hoàn thương", 0.7, { hits: 3, cd: 3 })], loot: [["dai_hoan", 15], ["q:Tinh", 10]], coin: coin("C") }),
    sat_thu_c: N("Sát thủ Huyết Ảnh", "C", 24, [24, 40, 24, 22, 20, 15], { wtype: "kiem", watk: 18, hpMul: 0.6, portrait: "hac_y", skills: [S("Huyết Ảnh Thích", 1.6, { cd: 1 }), S("Độc châm", 1.1, { src: "n", cd: 3, poison: 0.5 })], loot: [["hoi_khi", 50], ["q:Tinh", 12]], coin: coin("C") }),
    de_tu_danh_mon: N("Đệ tử Hoa Sơn", "D", 20, [26, 30, 24, 15, 15, 15], { wtype: "kiem", watk: 14, hpMul: 0.7, portrait: "de_tu", skills: [S("Hoa Sơn Kiếm Pháp", 1.5, { cd: 1 }), S("Kim Nhạn Tam Thức", 0.65, { hits: 3, cd: 3 })], loot: [], coin: [0, 0, 0] }),
    mat_na_sat: N("Mặt Nạ Sắt", "C", 25, [30, 38, 28, 22, 20, 12], { wtype: "kiem", watk: 20, hpMul: 0.85, portrait: "hac_y", skills: [S("Huyết Ảnh Phi Vân", 0.7, { hits: 3, cd: 3 }), S("Thanh Vân Kiếm Pháp", 1.5, { cd: 1 }), S("Độc châm", 1.1, { src: "n", cd: 4, poison: 0.6 })], loot: [], coin: [0, 0, 0] }),
    hue_nang: N("Huệ Năng", "C", 26, [36, 22, 40, 18, 26, 13], { wtype: "con", watk: 18, hpMul: 0.85, portrait: "hue_nang", skills: [S("La Hán Côn", 1.5, { cd: 1 }), S("Hàng Ma Trượng", 1.2, { cd: 3, stun: 0.3 })], loot: [], coin: [0, 0, 0] }),
    yen_dau: N("Tô Vân Yên", "C", 26, [22, 34, 26, 30, 30, 13], { wtype: "kiem", watk: 16, hpMul: 0.85, portrait: "to_van_yen", skills: [S("Nga Mi Kiếm Pháp", 1.5, { cd: 1 }), S("Kim Đỉnh Miên Chưởng", 1.4, { src: "n", cd: 3 })], loot: [], coin: [0, 0, 0] }),
    anh_dau: N("Đường Nhất Ảnh", "C", 26, [24, 38, 24, 30, 24, 15], { wtype: "quyen", watk: 16, hpMul: 0.85, portrait: "duong_nhat_anh", skills: [S("Bạo Vũ Lê Hoa Châm", 0.5, { hits: 4, src: "n", cd: 3, poison: 0.3 }), S("Truy Hồn Tiêu", 1.5, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    hoa_son_kk: N("Kiếm khách Hoa Sơn Lệnh Hồ Cảnh", "C", 26, [30, 36, 28, 24, 22, 15], { wtype: "kiem", watk: 18, hpMul: 0.85, portrait: "vo_si3", skills: [S("Thái Nhạc Tam Thanh Phong", 0.7, { hits: 3, cd: 3 }), S("Hoa Sơn Kiếm Pháp", 1.5, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    ta_van_phi: N("Tạ Vân Phi", "C", 28, [34, 42, 32, 24, 22, 11], { wtype: "kiem", watk: 24, boss: true, hpMul: 1.0, portrait: "ta_van_phi", expMul: 1.0, skills: [S("Lưu Vân Kiếm Pháp", 1.6, { cd: 1 }), S("Lưu Vân Tam Điệp", 0.7, { hits: 3, cd: 3 })], loot: [], coin: [0, 0, 0] }),
    hac_giao2: N("Hắc Giao", "C", 24, [36, 28, 34, 18, 20, 9], { wtype: "thuong", watk: 22, boss: true, hpMul: 1.0, portrait: "hac_giao", expMul: 0.9, skills: [S("Phân Thủy Thích", 1.5, { cd: 1 }), S("Giao Long Xuất Hải", 0.75, { hits: 3, cd: 3 }), S("Độc thủy tiễn", 1.1, { src: "n", cd: 4, poison: 0.6 })], loot: [["da_giao", 100], ["q:Tinh", 50]], coin: coin("C") }),
    /* Arc 4 · Vân Thủy */
    sat_thu_b: N("Sát thủ tập sự", "C", 28, [28, 44, 30, 24, 22, 17], { wtype: "kiem", watk: 22, hpMul: 0.55, portrait: "hac_y", skills: [S("Huyết Ảnh Thích", 1.6, { cd: 1 }), S("Độc châm", 1.1, { src: "n", cd: 3, poison: 0.5 })], loot: [["hoi_khi", 40], ["q:Tinh", 12]], coin: coin("C") }),
    ho_ve: N("Hộ vệ thuê", "C", 29, [40, 30, 38, 16, 22, 24], { wtype: "dao", watk: 24, hpMul: 0.55, portrait: "tieu_dau", skills: [S("Khai Sơn Đao", 1.6, { cd: 1 })], loot: [["kim_sang", 40], ["q:Tinh", 12]], coin: coin("C") }),
    du_dang: N("Côn đồ chợ đêm", "C", 28, [36, 30, 36, 18, 24, 21], { wtype: "con", watk: 20, hpMul: 0.5, portrait: "son_tac", skills: [S("Quét côn", 1.0, { cd: 2, stun: 0.25 }), S("Bổ côn", 1.5, { cd: 1 })], loot: [["kim_sang", 40], ["q:Tinh", 10]], coin: coin("C") }),
    thuy_quai: N("Thủy quái Tây Hồ", "B", 32, [46, 30, 50, 6, 30, 23], { hpMul: 0.6, beast: true, portrait: "ho", skills: [S("Quật đuôi", 1.5, { cd: 1 }), S("Cuộn siết", 0.8, { cd: 4, stun: 0.4 })], loot: [["q:Bảo", 6], ["dai_hoan", 20]], coin: [0, 0, 0] }),
    that_sat: N("Huyết Ảnh Thất Sát", "B", 33, [36, 52, 34, 26, 26, 16], { wtype: "kiem", watk: 30, boss: true, hpMul: 0.95, portrait: "hac_y", expMul: 1.0, skills: [S("Thất Sát Liên Hoàn", 0.6, { hits: 4, cd: 3 }), S("Huyết Ảnh Thích", 1.6, { cd: 1 })], loot: [["q:Bảo", 100]], coin: coin("B") }),
    thiet_dien: N("Thiết Diện", "B", 36, [50, 36, 50, 22, 30, 17], { wtype: "dao", watk: 34, hpMul: 0.85, portrait: "dau_muc", skills: [S("Thiết Diện Đao", 1.6, { cd: 1 }), S("Phá Sơn Liên Trảm", 0.85, { hits: 2, cd: 3 })], loot: [["q:Bảo", 30]], coin: coin("B") }),
    huyet_ve: N("Huyết vệ truy sát", "B", 36, [40, 56, 40, 28, 26, 15], { wtype: "kiem", watk: 30, hpMul: 0.6, portrait: "hac_y", skills: [S("Huyết Ảnh Thích", 1.6, { cd: 1 }), S("Độc châm", 1.1, { src: "n", cd: 3, poison: 0.5 })], loot: [["hoi_khi", 40], ["q:Bảo", 8]], coin: coin("B") }),
    quy_anh: N("Phó lâu chủ Quỷ Ảnh", "B", 40, [46, 62, 44, 34, 30, 9], { wtype: "kiem", watk: 36, boss: true, hpMul: 1.1, portrait: "quy_anh", expMul: 1.1, skills: [S("Quỷ Ảnh Mê Tung", 0.6, { hits: 5, cd: 3 }), S("Huyết Nguyệt Thích", 1.7, { cd: 1 }), S("Thất Bộ Đoạn Hồn", 1.2, { src: "n", cd: 4, poison: 0.7 })], loot: [["q:Bảo", 100], ["dai_hoan", 100]], coin: coin("B") }),
    /* Arc 5 · Tây Vực */
    ma_tac: N("Mã tặc sa mạc", "B", 40, [52, 44, 48, 18, 34, 29], { wtype: "dao", watk: 34, hpMul: 0.55, portrait: "son_tac", skills: [S("Loan Đao", 1.6, { cd: 1 }), S("Phi Mã Trảm", 0.85, { hits: 2, cd: 3 })], loot: [["kim_sang", 40], ["tui_nuoc", 50], ["q:Bảo", 6]], coin: coin("B") }),
    bo_cap: N("Bọ cạp cát", "B", 42, [50, 46, 52, 6, 40, 41], { hpMul: 0.5, beast: true, portrait: "heo", skills: [S("Đuôi độc", 1.2, { cd: 2, poison: 0.7 }), S("Kẹp", 1.4, { cd: 1 })], loot: [["vay_bo_cap", 70], ["giai_doc", 30]], coin: [0, 0, 0] }),
    ma_ve: N("Vệ sĩ Ma Giáo", "B", 44, [56, 44, 56, 30, 38, 21], { wtype: "dao", watk: 38, hpMul: 0.6, portrait: "ma_giao", skills: [S("Thiên Ma Đao", 1.6, { cd: 1 }), S("Huyết Hỏa Trảm", 1.3, { src: "n", cd: 3 })], loot: [["dai_hoan", 15], ["q:Bảo", 10]], coin: coin("B") }),
    huyet_lang: N("Huyết Lang", "B", 44, [52, 60, 48, 6, 40, 39], { hpMul: 0.5, beast: true, portrait: "soi", skills: [S("Cắn xé", 1.5, { cd: 1 }), S("Bầy sói", 0.7, { hits: 3, cd: 3 })], loot: [["da_soi", 80], ["q:Bảo", 6]], coin: [0, 0, 0] }),
    ma_phan: N("Phản đồ Hữu điện", "A", 46, [58, 46, 56, 36, 40, 19], { wtype: "dao", watk: 44, hpMul: 0.6, portrait: "ma_giao", skills: [S("Thiên Ma Đao", 1.6, { cd: 1 }), S("Huyết Tế", 2.2, { cd: 4 })], loot: [["q:Huyền", 3], ["dai_hoan", 25]], coin: coin("A") }),
    cuu_thien_liet: N("Hữu hộ pháp Cừu Thiên Liệt", "A", 50, [60, 50, 60, 45, 45, 15], { wtype: "quyen", watk: 40, boss: true, hpMul: 1.15, portrait: "cuu_thien_liet", expMul: 1.2, skills: [S("Liệt Hỏa Thiên Ma Chưởng", 1.8, { src: "n", cd: 2 }), S("Thiên Ma Liên Hoàn", 0.6, { hits: 4, cd: 3 }), S("Hỏa Long Quyền", 1.5, { cd: 1 })], loot: [["q:Huyền", 100]], coin: coin("A"),
      phase2: { line: "Cừu Thiên Liệt rạch tay, máu bốc thành lửa: \"Thiên Ma Giải Thể!\"", skills: [S("Thiên Ma Giải Thể", 2.2, { src: "n", cd: 2 }), S("Hỏa Long Quyền", 1.5, { cd: 1 })] } }),
    /* Arc 6 · Kiếm Trủng */
    kiem_khoi: N("Kiếm khôi đá", "A", 52, [55, 50, 60, 20, 50, 50], { wtype: "kiem", watk: 46, hpMul: 0.5, portrait: "kiem_khoi", skills: [S("Thạch Kiếm", 1.6, { cd: 1 })], loot: [["kiem_thach", 60], ["q:Huyền", 3]], coin: [0, 0, 0] }),
    tuyet_lang: N("Băng Nguyên Tuyết Lang", "A", 56, [60, 70, 55, 5, 55, 60], { hpMul: 0.5, beast: true, portrait: "soi", skills: [S("Hàn Nha", 1.3, { cd: 1, stun: 0.3 }), S("Bầy tuyết lang", 0.7, { hits: 3, cd: 3 })], loot: [["da_tuyet_lang", 80], ["q:Huyền", 3]], coin: [0, 0, 0] }),
    de_tu_vd: N("Đệ tử Võ Đang tranh bí cảnh", "A", 55, [45, 55, 50, 60, 60, 30], { wtype: "kiem", watk: 44, hpMul: 0.7, portrait: "de_tu", skills: [S("Thái Cực Kiếm", 1.8, { src: "n", cd: 2 }), S("Lưỡng Nghi Kiếm", 1.3, { cd: 1 })], loot: [["q:Huyền", 4], ["dai_hoan", 20]], coin: coin("A") }),
    ngu_lao: N("Huyết Ảnh Ngũ Lão", "A", 58, [50, 75, 50, 45, 45, 50], { wtype: "kiem", watk: 48, hpMul: 0.8, portrait: "hac_y", skills: [S("Ngũ Ảnh Liên Hoàn", 0.6, { hits: 5, cd: 3 }), S("Huyết Ảnh Thích", 1.6, { cd: 1 })], loot: [["q:Huyền", 6], ["q:Bảo", 12]], coin: coin("A") }),
    ta_van_phi_s: N("Tạ Vân Phi", "S", 60, [58, 70, 55, 50, 52, 40], { wtype: "kiem", watk: 60, boss: true, hpMul: 1.0, portrait: "ta_van_phi", expMul: 1.0, skills: [S("Lưu Vân Kiếm Vực", 0.7, { hits: 6, cd: 3 }), S("Lưu Vân Kiếm Pháp", 1.6, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    kiem_hon: N("Kiếm Hồn Vô Danh", "S", 64, [65, 75, 60, 55, 60, 30], { wtype: "kiem", watk: 62, boss: true, hpMul: 1.2, portrait: "kiem_hon", expMul: 1.3, skills: [S("Vô Danh Nhất Kiếm", 3.2, { cd: 5 }), S("Vạn Kiếm Quy Tông", 0.45, { hits: 7, cd: 3 }), S("Kiếm Ý", 1.6, { cd: 1 })], loot: [["kiem_thach", 100]], coin: [0, 0, 0] }),
    /* Arc 7 · Chính Tà Đại Chiến */
    binh_si_vlm: N("Binh sĩ Võ Lâm Minh", "S", 64, [70, 55, 70, 40, 50, 60], { wtype: "dao", watk: 62, hpMul: 0.45, portrait: "tieu_dau", skills: [S("Trận đao", 0.8, { hits: 2, cd: 1 })], loot: [["dai_hoan", 20], ["q:Huyền", 2]], coin: coin("S") }),
    ma_tu_si: N("Ma Giáo tử sĩ", "S", 66, [65, 60, 65, 55, 60, 50], { wtype: "dao", watk: 64, hpMul: 0.5, portrait: "ma_giao", skills: [S("Huyết Tế", 2.6, { cd: 4 }), S("Thiên Ma Đao", 1.6, { cd: 1 })], loot: [["q:Bảo", 8], ["q:Huyền", 3]], coin: coin("S") }),
    song_sat: N("Huyết Ảnh Song Sát", "S", 68, [60, 90, 60, 55, 50, 50], { wtype: "kiem", watk: 64, hpMul: 0.7, portrait: "hac_y", skills: [S("Song Ảnh Hợp Kích", 1.1, { hits: 2, cd: 2 }), S("Huyết Ảnh Thích", 1.6, { cd: 1 })], loot: [["q:Huyền", 4]], coin: coin("S") }),
    thiet_ky: N("Thiết Kỵ Cẩm Y", "S", 70, [80, 70, 75, 40, 50, 60], { wtype: "thuong", watk: 70, hpMul: 0.65, portrait: "tieu_dau", skills: [S("Thiết Kỵ Xung Phong", 2.2, { cd: 3 }), S("Trường thương", 1.5, { cd: 1 })], loot: [["lenh_cam_y", 15], ["q:Thần", 1]], coin: coin("S") }),
    tieu_hao_s: N("Tiêu Hạo · Song Sát", "S", 66, [58, 80, 55, 60, 52, 50], { wtype: "kiem", watk: 62, hpMul: 0.9, portrait: "tieu_hao", skills: [S("Huyết Ảnh Phi Vân", 0.75, { hits: 4, cd: 3 }), S("Thanh Vân Kiếm Pháp", 1.6, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    huyet_y: N("Lâu chủ Huyết Y", "S", 72, [70, 100, 70, 55, 60, 30], { wtype: "kiem", watk: 72, boss: true, hpMul: 1.2, portrait: "huyet_y", expMul: 1.3, skills: [S("Huyết Nguyệt Thiên Sát", 0.5, { hits: 6, cd: 4 }), S("Huyết Y Thích", 1.6, { cd: 1 }), S("Huyết Ảnh Độc", 1.2, { src: "n", cd: 4, poison: 0.7 })], loot: [["huyet_y_giap", 100], ["an_tin", 100]], coin: coin("S") }),
    /* Arc 8 · Kim Lăng */
    thiet_ve: N("Thiết Vệ phủ Minh chủ", "SS", 76, [85, 70, 85, 50, 60, 55], { wtype: "dao", watk: 80, hpMul: 0.55, portrait: "tieu_dau", skills: [S("Thiết Vệ Trảm", 1.6, { cd: 1 }), S("Liên Trảm", 0.85, { hits: 2, cd: 3 })], loot: [["q:Huyền", 5], ["q:Thần", 0.5], ["cuu_chuyen", 10]], coin: coin("SS") }),
    huyet_tan: N("Huyết Ảnh tàn quân", "SS", 76, [70, 100, 65, 60, 55, 55], { wtype: "kiem", watk: 76, hpMul: 0.55, portrait: "hac_y", skills: [S("Huyết Ảnh Thích", 1.7, { cd: 1 }), S("Độc châm", 1.2, { src: "n", cd: 3, poison: 0.6 })], loot: [["q:Huyền", 4]], coin: coin("SS") }),
    truong_lao: N("Trưởng lão bị mua chuộc", "SS", 78, [80, 60, 90, 60, 75, 50], { wtype: "con", watk: 78, hpMul: 0.75, portrait: "hue_nang", skills: [S("Kim Cương Côn Trận", 2.0, { src: "n", cd: 2 }), S("La Hán Côn", 1.5, { cd: 1 })], loot: [["q:Thần", 1]], coin: coin("SS") }),
    ta_van_phi_ss: N("Tạ Vân Phi", "SS", 80, [80, 95, 75, 60, 65, 50], { wtype: "kiem", watk: 84, boss: true, hpMul: 1.0, portrait: "ta_van_phi", expMul: 1.0, skills: [S("Lưu Vân Vô Tận", 0.55, { hits: 8, cd: 3 }), S("Lưu Vân Kiếm Pháp", 1.7, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    ta_thien_hanh: N("Minh chủ Tạ Thiên Hành", "SS", 86, [80, 85, 85, 90, 90, 25], { wtype: "quyen", watk: 80, boss: true, hpMul: 1.3, portrait: "ta_thien_hanh", expMul: 1.3, skills: [S("Thiên Ma Chưởng giả", 2.2, { src: "n", cd: 2 }), S("Minh Chủ Quyền", 1.6, { cd: 1 }), S("Vạn Chưởng Phong Thiên", 0.6, { hits: 4, src: "n", cd: 4 })], loot: [["minh_chu_lenh", 100], ["wss_quyen", 100]], coin: coin("SS"),
      phase2: { line: "Kinh mạch Tạ Thiên Hành đen lại. Ma công trỗi dậy, nuốt lấy chính chủ nhân: \"Ma Công Phệ Nguyên!\"", skills: [S("Ma Công Phệ Nguyên", 2.0, { src: "n", cd: 1, drain: 0.25 })] } }),
    /* Arc 9 · Thiên Sơn */
    tuyet_quai: N("Thiên Sơn tuyết quái", "SS", 86, [100, 80, 100, 10, 85, 80], { hpMul: 0.5, beast: true, portrait: "ho", skills: [S("Tuyết Lở", 1.5, { cd: 2 }), S("Vồ", 1.6, { cd: 1 })], loot: [["tuyet_tinh", 70], ["q:Thần", 1]], coin: [0, 0, 0] }),
    co_quan: N("Cơ quan nhân Thiên Cơ", "SS", 88, [95, 80, 110, 60, 60, 60], { wtype: "con", watk: 84, hpMul: 0.55, portrait: "kiem_khoi", skills: [S("Thiết Côn Cơ Quan", 1.6, { cd: 1 }), S("Tự hủy", 3.0, { cd: 9 })], loot: [["linh_kien", 80]], coin: [0, 0, 0] }),
    bong_huyet_y: N("Bóng Lâu chủ Huyết Y", "S", 86, [84, 120, 84, 66, 72, 36], { wtype: "kiem", watk: 86, hpMul: 0.75, portrait: "huyet_y", skills: [S("Huyết Nguyệt Thiên Sát", 0.55, { hits: 7, cd: 3 }), S("Huyết Y Thích", 1.7, { cd: 1 })], loot: [], coin: [0, 0, 0] }),
    thien_co: N("Thiên Cơ Lão Nhân", "SSS", 95, [85, 105, 90, 110, 100, 10], { wtype: "kiem", watk: 100, boss: true, hpMul: 1.5, portrait: "thien_co", expMul: 1.5, skills: [S("Thiên Cơ Kiếm", 0.55, { hits: 8, cd: 3 }), S("Kỳ Bàn Định Thế", 2.0, { src: "n", cd: 2 }), S("Lạc Tử", 1.6, { cd: 1 })], loot: [["thien_co_ky_ban", 100]], coin: [0, 0, 0],
      phase2: { line: "Thiên Cơ gạt đổ bàn cờ: \"Vạn Cục Quy Nhất.\" Từng chiêu của những kẻ Shen đã đánh bại lần lượt hiện về.", skills: [S("Vô Danh Nhất Kiếm", 3.0, { cd: 4 }), S("Ma Công Phệ Nguyên", 1.9, { src: "n", cd: 2, drain: 0.2 }), S("Huyết Nguyệt Thiên Sát", 0.55, { hits: 7, cd: 3 }), S("Liệt Hỏa Thiên Ma Chưởng", 1.8, { src: "n", cd: 1 })] } }),
  });
  // Trùm và đối thủ lôi đài Arc 3–9: dày máu và đánh đau hơn quái thường
  KM.BOSS_TUNE = { hp: 1.6, atk: 1.5 };
  ["mat_na_sat", "hue_nang", "yen_dau", "anh_dau", "hoa_son_kk", "ta_van_phi", "hac_giao2", "that_sat", "thiet_dien", "quy_anh", "cuu_thien_liet", "kiem_hon", "ta_van_phi_s", "tieu_hao_s", "huyet_y", "ta_van_phi_ss", "truong_lao", "ta_thien_hanh", "bong_huyet_y", "thien_co"].forEach((id) => {
    const E = KM.ENEMIES[id]; E.hpMul = Math.round(E.hpMul * KM.BOSS_TUNE.hp * 100) / 100; E.watk = Math.round(E.watk * KM.BOSS_TUNE.atk);
  });
  KM.ENEMIES.ta_thien_hanh.hpMul = Math.round(KM.ENEMIES.ta_thien_hanh.hpMul * 1.3 * 100) / 100;
  KM.ENEMIES.huyet_y.watk = 80;
  // Rơi đồ chung theo bậc cho quái thường
  KM.ROAD_FOES = { E: ["son_tac"], D: ["cuop_duong"], C: ["tho_phi_c"], B: ["ma_tac"], A: ["ngu_lao"], S: ["binh_si_vlm"], SS: ["huyet_tan"], SSS: ["huyet_tan"] };

  /* ---------------- Đột phá cảnh giới ---------------- */
  Object.assign(KM.RANK_BREAK, {
    C: "Ngộ Đạo ở Đại Hội Thiếu Niên (Arc 3)",
    B: "Vượt Sinh Tử Quan ở Huyết Ảnh Lâu (Arc 4)",
    A: "Lĩnh ngộ \"Ý\" sau trận ở Thánh Hỏa đài (Arc 5)",
    S: "Phóng khí ra ngoài thân trong Kiếm Trủng (Arc 6)",
    SS: "Phá tâm ma trước Đại Hội Võ Lâm (Arc 8)",
    SSS: "Võ Đạo Tâm ở Vấn Tâm đài (Arc 9)",
  });
  const tierPick = (s, k) => { const C2 = s.cls && KM.CLASSES[s.cls]; const wt = C2 ? C2.weapon : "kiem"; return KM.TIER_WEAPON[k][wt] || KM.TIER_WEAPON[k].kiem; };
  const RR = (k, pts, money, pots) => (s) => {
    const w = tierPick(s, k);
    return [
      { t: "+" + pts + " điểm chỉ số tự do", eff: { stat: pts } },
      { t: "Binh khí: " + I[w].name + " [" + I[w].q + "] đúng Võ Đạo", eff: { item: [w, 1] } },
      { t: "Tiếp tế: " + pots + " và " + KM.money(money), eff: { item: [["dai_hoan", 3], ["hoi_khi", 3]].concat(k === "s" || k === "ss" ? [["cuu_chuyen", 2]] : []), money } },
    ];
  };
  KM.RANK_REWARDS2 = ({
    C: RR("c", 5, 20000, "3 Đại Hoàn Đan, 3 Hồi khí tán"),
    B: RR("b", 5, 60000, "3 Đại Hoàn Đan, 3 Hồi khí tán"),
    A: RR("a", 10, 200000, "3 Đại Hoàn Đan, 3 Hồi khí tán"),
    S: RR("s", 10, 500000, "3 Đại Hoàn Đan, 3 Hồi khí tán, 2 Cửu Chuyển Đan"),
    SS: RR("ss", 10, 1000000, "3 Đại Hoàn Đan, 3 Hồi khí tán, 2 Cửu Chuyển Đan"),
    SSS: (s) => [{ t: "+20 điểm chỉ số tự do", eff: { stat: 20 } }, { t: "Mọi chỉ số +5 vĩnh viễn", eff: { bonus: { src: "Võ Thần", st: { STR: 5, AGI: 5, VIT: 5, INT: 5, WIS: 5, LUK: 5 } } } }, { t: "Tiếp tế: 5 Cửu Chuyển Đan", eff: { item: ["cuu_chuyen", 5] } }],
  });
})(typeof window !== "undefined" ? window : globalThis);
