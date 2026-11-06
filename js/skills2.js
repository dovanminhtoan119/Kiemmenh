/* =====================================================================
   KIẾM MỆNH · VÕ ĐẠO BẬC 2–4, CHIÊU MỚI ARC 3–9
   Bậc 2 (Rank C): chọn 1 trong 2 chuyên môn. Bậc 3 (Rank A). Bậc 4 (Rank SS).
   Mỗi bậc cộng vĩnh viễn vào hai chỉ số ưu tiên của Võ Đạo.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const K = (name, o) => Object.assign({ name, mult: 0, cd: 0, src: "p" }, o);
  const P = (sta) => ({ sta }), Q = (kh) => ({ kh });
  Object.assign(KM.SKILLS, {
    vo_tuong_bo: K("Vô Tướng Bộ", { eva: 8, turns: 2, cost: P(20), cd: 4, desc: "Bộ pháp của ông lão bán trà: né +8% trong 2 lượt." }),
    kiem_tam: K("Kiếm Tâm Nhất Điểm", { mult: 2.2, crit: 20, cost: P(40), cd: 3, desc: "Một điểm kiếm ý, chí mạng +20%. Lĩnh hội ở Kiếm Trủng." }),
    ba_vuong_tram: K("Bá Vương Đoạn Giang", { mult: 2.6, pierce: 0.3, cost: P(50), cd: 4, w: "dao", desc: "Đao pháp của lão tướng Mạnh Cương, bỏ qua 30% giáp." }),
    // Kiếm – ngoại
    k2a: K("Lưu Tinh Thất Kiếm", { mult: 0.5, hits: 7, cost: P(40), cd: 3, w: "kiem", desc: "Bảy nhát kiếm như sao băng." }),
    k2b: K("Thái Sơn Áp Đỉnh", { mult: 3.0, pierce: 0.1, cost: P(45), cd: 3, w: "kiem", desc: "Một kiếm nặng như núi." }),
    k3: K("Vạn Kiếm Quy Tông", { mult: 0.45, hits: 10, cost: P(70), cd: 4, w: "kiem", desc: "Mười đường kiếm cùng quy về một điểm." }),
    k4: K("Nhất Kiếm Định Càn Khôn", { mult: 6.0, crit: 30, cost: P(120), cd: 6, w: "kiem", desc: "Kiếm tối thượng của Kiếm Thánh." }),
    // Kiếm – nội
    kn2a: K("Phi Kiếm Truy Hồn", { mult: 1.4, hits: 2, src: "n", cost: Q(40), cd: 3, w: "kiem", desc: "Kiếm khí bay xa, đuổi theo mục tiêu." }),
    kn2b: K("Băng Phong Kiếm Vực", { mult: 1.3, aoe: 3, src: "n", stun: 0.2, cost: Q(45), cd: 3, w: "kiem", desc: "Vùng kiếm khí lạnh trúng 3 địch, 20% đóng băng." }),
    kn3: K("Kiếm Khí Trường Hà", { mult: 2.0, aoe: 6, src: "n", cost: Q(70), cd: 4, w: "kiem", desc: "Kiếm khí cuồn cuộn như sông, trúng mọi địch." }),
    kn4: K("Tâm Kiếm Vô Hình", { mult: 5.0, src: "n", cost: Q(120), cd: 6, w: "kiem", desc: "Kiếm trong tâm, không thể né." }),
    // Đao – ngoại
    d2a: K("Cuồng Long Trảm", { mult: 2.6, cost: P(45), cd: 3, w: "dao", desc: "Đao như rồng cuồng." }),
    d2b: K("Loạn Vũ Đao", { mult: 0.7, hits: 5, cost: P(45), cd: 3, w: "dao", desc: "Năm đao loạn vũ." }),
    d3: K("Bá Đao Đoạn Nhạc", { mult: 3.4, pierce: 0.35, cost: P(70), cd: 4, w: "dao", desc: "Một đao chém đứt núi." }),
    d4: K("Đao Hoàng Lâm Thế", { mult: 2.5, aoe: 3, cost: P(110), cd: 5, w: "dao", desc: "Đao Hoàng giáng thế, trúng 3 địch." }),
    // Đao – nội
    dn2a: K("Hỏa Long Đao Cương", { mult: 1.5, aoe: 3, src: "n", burn: 1, turns: 3, cost: Q(45), cd: 3, w: "dao", desc: "Đao cương lửa trúng 3 địch, gây bỏng." }),
    dn2b: K("Huyết Nguyệt Đao", { mult: 2.2, src: "n", heal: 0.1, cost: Q(45), cd: 3, w: "dao", desc: "Đao cương hút máu, hồi 10% HP." }),
    dn3: K("Cương Phong Liệt Địa", { mult: 2.2, aoe: 6, src: "n", cost: Q(70), cd: 4, w: "dao", desc: "Đao cương xé đất, trúng mọi địch." }),
    dn4: K("Thiên Hỏa Đao Cương", { mult: 4.5, src: "n", burn: 1, turns: 5, cost: Q(120), cd: 6, w: "dao", desc: "Lửa trời bám vào đao cương, bỏng 5 lượt." }),
    // Côn – ngoại
    c2a: K("Thiên Quân Phá Thạch", { mult: 2.4, stun: 0.3, cost: P(45), cd: 3, w: "con", desc: "Một côn phá đá, 30% choáng." }),
    c2b: K("Du Long Phệ Thủy", { mult: 0.9, hits: 4, cost: P(45), cd: 3, w: "con", desc: "Côn như rồng lượn dưới nước." }),
    c3: K("Phong Lôi Côn", { mult: 1.8, aoe: 6, stun: 0.25, cost: P(70), cd: 4, w: "con", desc: "Côn mang gió sấm, trúng mọi địch." }),
    c4: K("Định Hải Thần Côn", { mult: 4.0, stun: 1, cost: P(110), cd: 6, w: "con", desc: "Côn định biển, choáng chắc chắn." }),
    // Côn – nội
    cn2a: K("Kim Cương Hộ Pháp", { guard: 0.6, turns: 2, cost: Q(40), cd: 4, w: "con", desc: "Giảm 60% sát thương phải nhận." }),
    cn2b: K("Phục Ma Kim Côn", { mult: 2.3, src: "n", cost: Q(45), cd: 3, w: "con", desc: "Côn phục ma." }),
    cn3: K("La Hán Trận", { guard: 0.5, counter: 1.0, turns: 3, cost: Q(70), cd: 5, w: "con", desc: "Giảm 50% sát thương 3 lượt và phản đòn." }),
    cn4: K("Như Lai Côn Ấn", { mult: 4.2, src: "n", heal: 0.2, cost: Q(120), cd: 6, w: "con", desc: "Côn ấn Như Lai, hồi 20% HP." }),
    // Thương – ngoại
    t2a: K("Bạo Vũ Phi Hoa", { mult: 0.5, hits: 6, cost: P(45), cd: 3, w: "thuong", desc: "Sáu mũi thương như hoa bay." }),
    t2b: K("Thiết Kỵ Xung Phong", { mult: 2.5, cost: P(45), cd: 3, w: "thuong", desc: "Xung phong như thiết kỵ." }),
    t3: K("Bách Điểu Triều Phượng", { mult: 0.6, hits: 8, cost: P(70), cd: 4, w: "thuong", desc: "Trăm chim chầu phượng." }),
    t4: K("Bá Vương Cử Đỉnh", { mult: 5.0, cost: P(120), cd: 6, w: "thuong", desc: "Thương Vương nâng đỉnh." }),
    // Thương – nội
    tn2a: K("Xuyên Vân Phá Nhật", { mult: 2.2, aoe: 3, src: "n", pierce: 0.15, cost: Q(45), cd: 3, w: "thuong", desc: "Thương ý xuyên mây, trúng 3 địch." }),
    tn2b: K("Long Ngâm Cửu Thiên", { mult: 1.6, aoe: 6, src: "n", stun: 0.45, cost: Q(45), cd: 4, w: "thuong", desc: "Tiếng rồng ngâm làm choáng mọi địch." }),
    tn3: K("Ý Thương Xuyên Sơn", { mult: 2.6, aoe: 2, src: "n", cost: Q(70), cd: 4, w: "thuong", desc: "Thương ý xuyên núi." }),
    tn4: K("Long Hồn Cửu Chuyển", { mult: 1.0, hits: 9, src: "n", cost: Q(120), cd: 6, w: "thuong", desc: "Chín vòng long hồn." }),
    // Quyền – ngoại
    q2a: K("Phá Thiên Quyền", { mult: 2.8, cost: P(45), cd: 3, w: "quyen", desc: "Quyền phá trời." }),
    q2b: K("Bách Bộ Thần Quyền", { mult: 0.6, hits: 6, cost: P(45), cd: 3, w: "quyen", desc: "Trăm bước thần quyền." }),
    q3: K("Hàng Long Quyền Ảnh", { mult: 3.2, cost: P(70), cd: 4, w: "quyen", desc: "Quyền ảnh hàng long." }),
    q4: K("Thiên Băng Địa Liệt", { mult: 5.2, cost: P(120), cd: 6, w: "quyen", desc: "Trời sập đất nứt." }),
    // Quyền – nội
    qn2a: K("Miên Lý Tàng Châm", { mult: 1.9, src: "n", weak: 0.2, turns: 2, cost: Q(45), cd: 3, w: "quyen", desc: "Chưởng mềm giấu kim, giảm 20% công địch." }),
    qn2b: K("Liệt Dương Phần Thiên", { mult: 2.4, src: "n", burn: 1, turns: 3, cost: Q(45), cd: 3, w: "quyen", desc: "Chưởng mặt trời thiêu trời." }),
    qn3: K("Bài Sơn Đảo Hải", { mult: 2.3, aoe: 6, src: "n", cost: Q(70), cd: 4, w: "quyen", desc: "Dời núi lấp biển, trúng mọi địch." }),
    qn4: K("Vạn Chưởng Quy Nguyên", { mult: 5.5, src: "n", cost: Q(120), cd: 6, w: "quyen", desc: "Vạn chưởng quy về một." }),
  });
  /* Bậc Võ Đạo theo nhánh: t2 = [chuyên môn A, chuyên môn B], t3, t4 */
  const T = (a, ka, b, kb, n3, k3, n4, k4) => ({ t2: [{ name: a, sk: ka }, { name: b, sk: kb }], t3: { name: n3, sk: k3 }, t4: { name: n4, sk: k4 } });
  KM.CLASS_TIERS = {
    kiem_ngoai: T("Khoái Kiếm Sư", "k2a", "Trọng Kiếm Sư", "k2b", "Kiếm Tông", "k3", "Kiếm Thánh", "k4"),
    kiem_noi: T("Ngự Kiếm Sư", "kn2a", "Hàn Phong Kiếm Sư", "kn2b", "Kiếm Khí Tông", "kn3", "Tâm Kiếm Thánh", "kn4"),
    dao_ngoai: T("Cuồng Đao Sư", "d2a", "Song Đao Sư", "d2b", "Đao Bá", "d3", "Đao Hoàng", "d4"),
    dao_noi: T("Liệt Hỏa Đao Sư", "dn2a", "Huyết Đao Sư", "dn2b", "Đao Cương Tông", "dn3", "Đao Cương Vương", "dn4"),
    con_ngoai: T("Bá Côn Sư", "c2a", "Du Long Côn Sư", "c2b", "Côn Tông", "c3", "Côn Thánh", "c4"),
    con_noi: T("Kim Cương Côn Sư", "cn2a", "Phục Ma Côn Sư", "cn2b", "Thiền Côn Tông", "cn3", "La Hán Côn Thánh", "cn4"),
    thuong_ngoai: T("Bạo Vũ Thương Sư", "t2a", "Thiết Kỵ Thương Sư", "t2b", "Thương Tông", "t3", "Thương Vương", "t4"),
    thuong_noi: T("Xuyên Vân Thương Sư", "tn2a", "Long Ngâm Thương Sư", "tn2b", "Thương Ý Tông", "tn3", "Bá Vương Thương Thánh", "tn4"),
    quyen_ngoai: T("Cang Quyền Sư", "q2a", "Bạo Quyền Sư", "q2b", "Quyền Tông", "q3", "Quyền Thánh", "q4"),
    quyen_noi: T("Miên Chưởng Sư", "qn2a", "Liệt Dương Chưởng Sư", "qn2b", "Chưởng Tông", "qn3", "Chưởng Thánh", "qn4"),
  };
  KM.TIER_BONUS = { 2: 8, 3: 15, 4: 25 };
  KM.tierOf = (s) => s.tier || 1;
  KM.classPrio = (s) => (s.hidden && KM.HIDDEN_CLASSES[s.hidden] ? KM.HIDDEN_CLASSES[s.hidden].prio : s.cls ? KM.CLASSES[s.cls].prio : ["STR", "VIT"]);
  KM.tierUp = function (s, n, pick) {
    const T2 = s.cls && KM.CLASS_TIERS[s.cls]; if (!T2 || (s.tier || 1) >= n) return [];
    const o = n === 2 ? T2.t2[pick || 0] : n === 3 ? T2.t3 : T2.t4;
    s.tier = n; s.tierName = o.name;
    const pr = KM.classPrio(s), v = KM.TIER_BONUS[n];
    const msgs = ["Võ Đạo bậc " + n + ": " + o.name + "."];
    msgs.push(...KM.apply(s, { skill: o.sk, bonus: { src: "Võ Đạo bậc " + n, st: { [pr[0]]: v, [pr[1]]: v } } }));
    return msgs;
  };
})(typeof window !== "undefined" ? window : globalThis);
