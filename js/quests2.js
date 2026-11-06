/* =====================================================================
   KIẾM MỆNH · NHIỆM VỤ NHÁNH ARC 3–9
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const has = (f) => ({ flag: f });
  Object.assign(KM.ITEMS, {
    goi_lua: { name: "Gói lụa Kim Lăng", type: "key", price: 0, desc: "Lụa dâu ngoại ô, gửi kho Long Môn ở Lạc Hà." },
    hop_tra: { name: "Hộp trà Long Tỉnh", type: "key", price: 0, desc: "Thương hội Vân Thủy gửi ông lão bán trà ngõ Ô Y, Kim Lăng." },
    thu_bien_phong: { name: "Thư biên phòng", type: "key", price: 0, desc: "Quân báo khẩn từ Lương Châu, gửi Võ Lâm Minh ở Kim Lăng." },
    thu_thanh_hu: { name: "Thư của Chân nhân Thanh Hư", type: "key", price: 0, desc: "Gửi đệ tử Võ Đang đang ở tầng một Kiếm Trủng." },
    xe_luong: { name: "Ba xe lương thảo", type: "key", price: 0, desc: "Lương của Long Môn cho tiền tuyến Nga Mi." },
    tre_mo_coi: { name: "Bốn đứa trẻ mồ côi", type: "key", price: 0, desc: "Đưa về chùa Thiện Giác, ngoại ô Kim Lăng." },
  });
  KM.ENEMIES.kiem_khoi.loot.push(["the_bai", 35]);
  Object.assign(KM.SIDEQUESTS, {
    /* ---------- Arc 3 · Kim Lăng ---------- */
    kl_du_con: { name: "Du côn bến cảng", giver: "bang", place: "kim_lang", loc: "ben_cang", kind: "kill", foe: ["du_con"], count: 4, where: "kim_lang", req: has("a3_start"),
      desc: "Phu khuân vác bị du côn bến cảng thu tiền \"bảo kê\" mỗi đêm. Hạ 4 tên.", reward: { money: 3000, exp: 6000, rep: { vo_lam: 20 }, moral: 5 } },
    kl_tho_phi: { name: "Thổ phỉ lò gạch", giver: "hue_tri", place: "ngoai_o", loc: "chua", kind: "kill", foe: ["tho_phi_c"], count: 3, where: "ngoai_o", req: has("a3_start"),
      desc: "Thổ phỉ ở lò gạch bỏ hoang cướp gạo cúng chùa. Phương trượng nhờ dẹp 3 tên.", reward: { item: ["kim_sang", 5], exp: 8000, rep: { thieu_lam: 30 }, aff: { hue_tri: 10 } } },
    kl_sat: { name: "Sắt tinh cho lò rèn", giver: "bang", place: "kim_lang", loc: "cho_dong", kind: "collect", item: "sat_tinh", qty: 3, req: has("a3_start"),
      desc: "Lò rèn chợ Đông thiếu sắt tinh để rèn binh khí cho Đại Hội. Mang 3 khối tới.", reward: { item: ["ac_wrist", 1], exp: 5000 } },
    kl_lua: { name: "Lụa về Lạc Hà", giver: "bang", place: "ngoai_o", loc: "ruong", kind: "deliver", give: "goi_lua", to: "lac_ha", toLoc: "tieu_cuc", due: 9, req: has("a3_start"),
      desc: "Dân trồng dâu nhờ mang một gói lụa về kho Long Môn ở Lạc Hà. Hạn 9 ngày.", reward: { money: 5000, exp: 6000, rep: { long_mon: 30 } } },
    kl_hoa_son: { name: "Sư huynh Hoa Sơn", giver: "hue_nang", place: "kim_lang", loc: "loi_dai", kind: "kill", foe: ["hoa_son_kk"], count: 2, req: { flag: "a3_r3" },
      desc: "Huệ Năng muốn xem Shen thắng Lệnh Hồ Cảnh hai lần ở lôi đài phụ (từ Lv 22).", reward: { exp: 12000, aff: { hue_nang: 15 }, rep: { thieu_lam: 30 } } },
    kl_tra: { name: "Rượu ngon đổi chuyện cũ", giver: "ong_lao_tra", place: "kim_lang", loc: "quan_tra", kind: "collect", item: "nu_nhi_hong", qty: 2, req: has("a3_start"),
      desc: "Ông lão bán trà bảo trà uống mãi cũng chán. Mang 2 vò Nữ Nhi Hồng (Đồng Nhân Đường) tới.", reward: { exp: 8000, aff: { ong_lao_tra: 15 }, item: ["ac_jade", 1] } },

    /* ---------- Arc 4 · Vân Thủy ---------- */
    vt_du_dang: { name: "Côn đồ chợ đêm", giver: "bang", place: "van_thuy", loc: "cho_dem", kind: "kill", foe: ["du_dang"], count: 4, where: "van_thuy",
      desc: "Côn đồ chợ đêm cướp của người bán hàng rong. Hạ 4 tên.", reward: { money: 8000, exp: 12000, moral: 5 } },
    vt_thuy_quai: { name: "Thủy quái Tây Hồ", giver: "bang", place: "van_thuy", loc: "tay_ho", kind: "kill", foe: ["thuy_quai"], count: 2, where: "van_thuy",
      desc: "Thủy quái lật thuyền đánh cá ven hồ. Hạ 2 con.", reward: { item: ["ab_boots", 1], exp: 15000 } },
    vt_thuoc: { name: "Thuốc cho y quán", giver: "bang", place: "van_thuy", loc: "thuong_hoi", kind: "collect", item: "giai_doc", qty: 3,
      desc: "Y quán ngõ Hạnh Lâm hết giải độc đan sau đợt độc dịch. Mang 3 viên tới.", reward: { money: 3000, exp: 8000, moral: 8 } },
    vt_sat_thu: { name: "Bài học của Liên Nhi", giver: "lien_nhi", place: "van_thuy", loc: "thien_mac", kind: "kill", foe: ["sat_thu_b"], count: 3, req: { flag: "lien_talk" },
      desc: "Liên Nhi thách Shen hạ 3 sát thủ tập sự trong đấu trường ngầm trước cô.", reward: { exp: 15000, aff: { lien_nhi: 12 } } },
    vt_tra: { name: "Hộp trà Long Tỉnh", giver: "bang", place: "van_thuy", loc: "thuong_hoi", kind: "deliver", give: "hop_tra", to: "kim_lang", toLoc: "quan_tra", due: 8,
      desc: "Thương hội nhờ mang hộp trà Long Tỉnh cho ông lão ngõ Ô Y ở Kim Lăng. Hạn 8 ngày.", reward: { money: 6000, exp: 8000, aff: { ong_lao_tra: 10 } } },
    vt_den: { name: "Dầu đèn thuyền hoa", giver: "bang", place: "van_thuy", loc: "cho_dem", kind: "collect", item: "hoi_khi", qty: 4,
      desc: "Chủ thuyền hoa cần Hồi khí tán để pha dầu đèn không khói. Mang 4 gói.", reward: { money: 5000, exp: 6000 } },

    /* ---------- Arc 5 · Tây Vực ---------- */
    lc_ma_tac: { name: "Mã tặc biên ải", giver: "bang", place: "luong_chau", loc: "doanh_trai", kind: "kill", foe: ["ma_tac"], count: 4,
      desc: "Quân biên phòng treo thưởng đầu mã tặc. Hạ 4 tên.", reward: { money: 20000, exp: 25000, rep: { trieu_dinh: 20 } } },
    lc_vay: { name: "Vỏ bọ cạp làm giáp", giver: "bang", place: "nguyet_nha", loc: "leu", kind: "collect", item: "vay_bo_cap", qty: 3,
      desc: "Người du mục làm giáp từ vỏ bọ cạp cát. Mang 3 mảnh.", reward: { item: ["tui_nuoc", 6], money: 8000, exp: 20000 } },
    th_lang: { name: "Bầy Huyết Lang", giver: "da_linh", place: "thanh_hoa", loc: "thung_lung", kind: "kill", foe: ["huyet_lang"], count: 4,
      desc: "Dạ Linh muốn xem người Trung Nguyên săn Huyết Lang. Hạ 4 con.", reward: { exp: 30000, aff: { da_linh: 10 }, rep: { ma_giao: 40 } } },
    th_phan: { name: "Phản đồ Hữu điện", giver: "da_vo_thuong", place: "thanh_hoa", loc: "huu_dien", kind: "kill", foe: ["ma_phan"], count: 2,
      desc: "Giáo chủ muốn biết Hữu điện còn bao nhiêu kẻ phản. Bắt 2 tên.", reward: { item: ["aa_jade", 1], exp: 30000, rep: { ma_giao: 60 }, aff: { da_vo_thuong: 10 } } },
    lc_thu: { name: "Quân báo khẩn", giver: "bang", place: "luong_chau", loc: "doanh_trai", kind: "deliver", give: "thu_bien_phong", to: "kim_lang", toLoc: "khach_diem", due: 20,
      desc: "Quân biên phòng nhờ mang thư báo Ma Giáo không hề tập kết quân về Kim Lăng. Hạn 20 ngày.", reward: { money: 30000, exp: 30000, rep: { trieu_dinh: 40, vo_lam: 20 } } },
    nn_bo_cap: { name: "Bọ cạp quanh hồ", giver: "bang", place: "nguyet_nha", loc: "ho", kind: "kill", foe: ["bo_cap"], count: 3,
      desc: "Bọ cạp cát làm tổ quanh hồ, cắn chết hai con lạc đà. Hạ 3 con.", reward: { money: 10000, exp: 20000, item: ["giai_doc", 3] } },

    /* ---------- Arc 6 · Bắc Cảnh ---------- */
    tl_tho_san: { name: "Thợ săn mất tích", giver: "bang", place: "tuyet_linh", loc: "quan_ruou", kind: "kill", foe: ["tuyet_lang"], count: 4,
      desc: "Ba thợ săn mất tích trong rừng tuyết. Bầy tuyết lang đã ăn họ. Hạ 4 con.", reward: { item: ["ao_long_tuyet", 1], exp: 40000 } },
    tl_kiem_thach: { name: "Kiếm Thạch cho lò rèn", giver: "bang", place: "tuyet_linh", loc: "lo_ren", kind: "collect", item: "kiem_thach", qty: 5,
      desc: "Thợ rèn băng cần 5 Kiếm Thạch để tôi một thanh kiếm cho thái tử. Trả rất hậu.", reward: { money: 60000, exp: 40000 } },
    tl_thu: { name: "Bức thư dưới tuyết", giver: "thanh_hu", place: "tuyet_linh", loc: "doanh_trai", kind: "deliver", give: "thu_thanh_hu", to: "kiem_trung", toLoc: "kiem_lam", due: 7, req: { flag: "a6_start", alive: "thanh_hu" },
      desc: "Mang thư của Thanh Hư cho đệ tử Võ Đang đi trước vào tầng một bí cảnh. Hạn 7 ngày.", reward: { exp: 40000, aff: { thanh_hu: 20 }, rep: { vo_dang: 50 } } },
    kt_the_bai: { name: "Hài cốt người giữ kiếm", giver: "bang", place: "kiem_trung", loc: "nghia_dia", kind: "collect", item: "the_bai", qty: 3,
      desc: "Trên một tấm bia: \"Ai mang đủ ba thẻ bài người giữ kiếm về đây, sẽ được nghe chuyện cũ.\" Kiếm khôi đá đôi khi giữ thẻ bài.", reward: { exp: 60000, ledger: { actor: "Thiên Cơ", action: "Phản sư, giết ba người giữ kiếm đời trước", target: "Kiếm Trủng", witness: "Thẻ bài người giữ kiếm", pending: "—", trigger: "Arc 9" } } },
    kt_ngu_lao: { name: "Tàn quân Huyết Ảnh", giver: "bang", place: "kiem_trung", loc: "nghia_dia", kind: "kill", foe: ["ngu_lao"], count: 3,
      desc: "Huyết Ảnh Ngũ Lão để lại người canh khắp nghĩa địa. Hạ 3 tên.", reward: { exp: 60000, rep: { huyet_anh: -50, vo_lam: 30 } } },
    kt_khoi: { name: "Đường cho tiểu hòa thượng", giver: "hue_nang", place: "kiem_trung", loc: "kiem_lam", kind: "kill", foe: ["kiem_khoi"], count: 4, req: { alive: "hue_nang" },
      desc: "Một tiểu hòa thượng Thiếu Lâm lạc trong Kiếm Lâm. Dọn 4 kiếm khôi mở đường cho cậu bé ra ngoài.", reward: { exp: 50000, moral: 15, rep: { thieu_lam: 60 } } },

    /* ---------- Arc 7 · Chiến tuyến ---------- */
    a7_luong: { name: "Lương thảo tiền tuyến", giver: "long_tieu_chu", place: "lac_ha", loc: "tien_tuyen", kind: "deliver", give: "xe_luong", to: "nga_mi", toLoc: "kim_dinh", due: 3, req: { flag: "a7_start", noflag: "a7_done" },
      desc: "Mang ba xe lương của Long Môn tới Nga Mi trong 3 ngày.", reward: { exp: 60000, rep: { long_mon: 60, nga_mi: 40 } } },
    nm_thuoc: { name: "Quân y thiếu thuốc", giver: "bang", place: "nga_mi", loc: "quan_y", kind: "collect", item: "kim_sang", qty: 10, req: { flag: "a7_start" },
      desc: "Quân y Nga Mi cạn Kim sáng dược. Mang 10 lọ.", reward: { item: ["dai_hoan", 3], exp: 50000, rep: { nga_mi: 60 }, moral: 8 } },
    vd_huyet: { name: "Huyết Ảnh trong quân Minh", giver: "thanh_hu", place: "vo_dang", loc: "tien_tuyen", kind: "kill", foe: ["binh_si_vlm"], count: 6, req: { flag: "a7_start", alive: "thanh_hu" },
      desc: "Quân vây Võ Đang mặc giáp Võ Lâm Minh nhưng đeo nhẫn Huyết Ảnh. Hạ 6 tên để lấy bằng chứng.", reward: { flag: "ev_huyet_quan", exp: 80000, rep: { vo_dang: 60 } } },
    lh_tre: { name: "Trẻ mồ côi chiến tranh", giver: "bang", place: "lac_ha", loc: "tien_tuyen", kind: "deliver", give: "tre_mo_coi", to: "ngoai_o", toLoc: "chua", due: 6, req: { flag: "a7_start" },
      desc: "Đưa bốn đứa trẻ mồ côi từ làng cháy về chùa Thiện Giác, ngoại ô Kim Lăng. Hạn 6 ngày.", reward: { exp: 60000, moral: 25, rep: { thieu_lam: 80 } } },
    nm_song_sat: { name: "Song Sát ở chân núi", giver: "bang", place: "nga_mi", loc: "tien_tuyen", kind: "kill", foe: ["song_sat"], count: 3, req: { flag: "a7_start" },
      desc: "Sát thủ Huyết Ảnh rình giết ni cô đi lấy nước. Hạ 3 tên.", reward: { exp: 70000, rep: { nga_mi: 50 } } },
    vd_ma: { name: "Tử sĩ lạc đàn", giver: "bang", place: "vo_dang", loc: "tien_tuyen", kind: "kill", foe: ["ma_tu_si"], count: 3, req: { flag: "a7_start" },
      desc: "Tử sĩ Ma Giáo lạc đàn đánh cả quân Minh lẫn đạo sĩ. Hạ 3 tên.", reward: { exp: 70000, money: 50000 } },

    /* ---------- Arc 8 · Kim Lăng ---------- */
    a8_thiet_ve: { name: "Thiết Vệ tuần đêm", giver: "bang", place: "kim_lang", loc: "mat_that", kind: "kill", foe: ["thiet_ve"], count: 3, req: { flag: "a8_start" },
      desc: "Cái Bang treo thưởng: hạ 3 Thiết Vệ đã đánh chết ăn mày ở ngõ phủ Minh chủ.", reward: { exp: 120000, money: 100000, rep: { cai_bang: 60 } } },
    a8_huyet: { name: "Dọn tàn quân Huyết Ảnh", giver: "bang", place: "kim_lang", loc: "dinh_hoang", kind: "kill", foe: ["huyet_tan"], count: 4, req: { flag: "a8_start" },
      desc: "Huyết Ảnh tàn quân rình giết nhân chứng. Hạ 4 tên.", reward: { exp: 120000, rep: { vo_lam: 60 } } },
    a8_thuoc: { name: "Thuốc cho nhân chứng", giver: "bang", place: "kim_lang", loc: "hoi_quan", kind: "collect", item: "dai_hoan", qty: 3, req: { flag: "a8_start" },
      desc: "Nhân chứng bị thương sau một vụ ám sát hụt. Mang 3 Đại Hoàn Đan.", reward: { exp: 80000, moral: 10, item: ["cuu_chuyen", 1] } },

    /* ---------- Arc 9 · Thiên Sơn ---------- */
    ts_tinh: { name: "Tuyết Tinh", giver: "lao_dan_duong", place: "thien_son", loc: "tram", kind: "collect", item: "tuyet_tinh", qty: 5, req: { flag: "a9_start" },
      desc: "Lão dẫn đường cần 5 Tuyết Tinh để chữa bệnh cho dân trấn. Tuyết quái hay mang trong bụng.", reward: { item: ["ao_thien_son", 1], exp: 150000 } },
    ts_co_quan: { name: "Cơ quan lạc xuống núi", giver: "lao_dan_duong", place: "thien_son", loc: "chan_nui", kind: "kill", foe: ["co_quan"], count: 3, req: { flag: "a9_start" },
      desc: "Cơ quan nhân lạc xuống chân núi. Hạ 3 con, lão dẫn đường sẽ đưa bản vẽ cơ quan của Thiên Cơ Các.", reward: { item: ["ban_ve_co_quan", 1], exp: 150000 } },
    ts_quai: { name: "Tuyết quái phá trấn", giver: "bang", place: "thien_son", loc: "chan_nui", kind: "kill", foe: ["tuyet_quai"], count: 4, req: { flag: "a9_start" },
      desc: "Tuyết quái xuống phá chuồng gia súc. Hạ 4 con.", reward: { money: 300000, exp: 150000, moral: 5 } },
  });
})(typeof window !== "undefined" ? window : globalThis);
