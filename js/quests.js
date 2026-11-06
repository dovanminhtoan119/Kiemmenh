/* =====================================================================
   KIẾM MỆNH · NHIỆM VỤ NHÁNH
   Nhận từ NPC ở thôn làng, thị trấn, môn phái. Ba loại:
     kill    — hạ đủ số kẻ địch (where: chỉ tính ở địa điểm đó)
     collect — mang đủ vật phẩm về nộp
     deliver — nhận đồ, mang tới địa điểm khác (có thể có hạn)
   Nhận và trả nhiệm vụ không tốn thời gian.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const Q = (o) => o;
  KM.SIDEQUESTS = {
    /* ---------- Thanh Vân Phái ---------- */
    tv_soi: Q({ name: "Sói cắn gà", giver: "quan_su_bep", place: "thanh_van", loc: "hau_tru", kind: "kill", foe: ["soi_xam"], count: 3,
      desc: "Mấy đêm nay sói mò vào chuồng gà sau bếp. Hạ 3 con sói xám trong rừng sau núi.", req: { noflag: "tv_banned" },
      reward: { money: 120, exp: 250, aff: { tieu_luc: 3 } } }),
    tv_nanh: Q({ name: "Nanh heo làm thuốc", giver: "to_van_yen", place: "thanh_van", loc: "duoc_phong", kind: "collect", item: "nanh_heo", qty: 2,
      desc: "Tô Vân Yên cần 2 nanh heo rừng để bào chế thuốc trị thương.", req: { noflag: "a1_done" },
      reward: { item: ["kim_sang", 3], exp: 200, aff: { to_van_yen: 8 } } }),
    tv_ti_thi: Q({ name: "Nắn gân đệ tử nội môn", giver: "han_giao_dau", place: "thanh_van", loc: "dien_vo", kind: "kill", foe: ["de_tu_noi"], count: 2, req: { lv: 4, noflag: "tv_banned" },
      desc: "Hàn giáo đầu muốn xem ngươi có thắng nổi đệ tử nội môn hai lần không.",
      reward: { item: ["ho_uyen_da", 1], exp: 400, aff: { han_giao_dau: 8 }, rep: { thanh_van: 15 } } }),
    tv_thao: Q({ name: "Dạ Quang Thảo", giver: "han_giao_dau", place: "thanh_van", loc: "dien_vo", kind: "collect", item: "duoc_thao", qty: 2, req: { flag: "a1_done", noflag: "tv_banned" },
      desc: "Vợ Hàn giáo đầu ốm nặng, cần 2 cây Dạ Quang Thảo. Sói ở rừng thường tha cỏ này về hang.",
      reward: { money: 800, exp: 900, aff: { han_giao_dau: 15 }, rep: { thanh_van: 30 }, moral: 5 } }),

    /* ---------- Thôn Hạnh Hoa ---------- */
    hh_heo: Q({ name: "Heo rừng phá ruộng", giver: "truong_thon", place: "hanh_hoa", loc: "gieng", kind: "kill", foe: ["heo_rung"], count: 3, where: "hanh_hoa",
      desc: "Heo rừng trên đồi xuống phá ruộng khoai. Hạ 3 con trên đồi Hạnh Hoa.",
      reward: { money: 200, exp: 350, rep: { hanh_hoa: 40 } } }),
    hh_thu: Q({ name: "Thư nhà", giver: "ba_tra", place: "hanh_hoa", loc: "quan_tra", kind: "deliver", give: "thu_nha", to: "lac_ha", toLoc: "khach_diem", due: 6,
      desc: "Bà Tư nhờ mang thư cho con trai là Tư Bình, tiểu nhị khách điếm Duyệt Lai ở Lạc Hà. Hạn 6 ngày.",
      reward: { money: 150, exp: 300, rep: { hanh_hoa: 30, lac_ha: 10 }, aff: { ba_tra: 15 }, moral: 3 } }),
    hh_son_tac: Q({ name: "Sơn tặc trên đồi", giver: "tho_san", place: "hanh_hoa", loc: "doi", kind: "kill", foe: ["son_tac"], count: 2, req: { lv: 5 },
      desc: "Một toán sơn tặc chiếm lán săn của Hạ Tứ. Hạ 2 tên.",
      reward: { item: ["ngoc_ho_phach", 1], exp: 500, rep: { hanh_hoa: 40 }, aff: { tho_san: 15 } } }),
    hh_da: Q({ name: "Da sói cho mùa đông", giver: "tho_san", place: "hanh_hoa", loc: "doi", kind: "collect", item: "da_soi", qty: 4,
      desc: "Hạ Tứ thu mua 4 tấm da sói để may áo cho cả thôn trước mùa đông.",
      reward: { money: 400, exp: 300, rep: { hanh_hoa: 30 }, item: ["ao_da_soi", 1] } }),

    /* ---------- Trấn Lạc Hà ---------- */
    lh_truy_na: Q({ name: "Cáo thị truy nã cướp đường", giver: "bang", place: "lac_ha", loc: "cho", kind: "kill", foe: ["cuop_duong"], count: 3,
      desc: "Nha môn treo thưởng 6 bạc cho ai hạ 3 tên cướp đường quanh Lạc Hà.",
      reward: { money: 600, exp: 1500, rep: { lac_ha: 40 } } }),
    lh_sat: Q({ name: "Sắt tinh cho lò rèn", giver: "au_tri", place: "lac_ha", loc: "cho", kind: "collect", item: "sat_tinh", qty: 3,
      desc: "Âu Trì cần 3 khối sắt tinh. Bọn cướp đường và thủy phỉ hay mang theo.",
      reward: { money: 500, exp: 1200, aff: { au_tri: 20 }, flag: "au_tri_discount" } }),
    lh_ho: Q({ name: "Hổ dữ rừng trúc", giver: "dan_chai", place: "lac_ha", loc: "ben_song", kind: "kill", foe: ["ho_du"], count: 1,
      desc: "Con hổ dữ trong rừng trúc đã vồ hai người kiếm củi. Lão Ngư góp tiền cả xóm chài treo thưởng.",
      reward: { money: 3000, exp: 4000, rep: { lac_ha: 120 }, moral: 10 } }),
    lh_cai_bang: Q({ name: "Đệ tử Cái Bang mất tích", giver: "lao_ho", place: "lac_ha", loc: "khach_diem", kind: "kill", foe: ["soi_dau_dan"], count: 2, req: { flag: "laoho_1" },
      desc: "Hai tiểu khất cái vào rừng trúc rồi không về. Lão Hồ nghi bầy sói đầu đàn. Hạ 2 con.",
      reward: { money: 600, exp: 2200, rep: { cai_bang: 80 }, aff: { lao_ho: 10 } } }),
    lh_phuong: Q({ name: "Tàn dư Hắc Phong Trại", giver: "phuong_nhi", place: "lac_ha", loc: "tieu_cuc", kind: "kill", foe: ["cuop_duong"], count: 2, where: "hac_phong", req: { flag: "rescued_phuong" },
      desc: "Phượng Nhi muốn dọn sạch bọn sơn tặc còn sót lại ở Hắc Phong Sơn. Hạ 2 tên ở đó.",
      reward: { item: ["giay_da_ho", 1], exp: 2000, aff: { phuong_nhi: 15 }, rep: { long_mon: 40 } } }),
    lh_hop_doc: Q({ name: "Hộp gỗ niêm phong", giver: "duong_nhat_anh", place: "lac_ha", loc: "cho_den", kind: "deliver", give: "hop_doc", to: "phong_lam", toLoc: "tram", due: 6, req: { flag: "ally_duong" },
      desc: "Đường Nhất Ảnh nhờ mang một hộp gỗ niêm phong tới trạm tiêu Phong Lâm, không được mở. Hạn 6 ngày.",
      reward: { money: 1500, exp: 1500, rep: { duong_mon: 60 }, aff: { duong_nhat_anh: 10 }, moral: -5 } }),

    /* ---------- Phong Lâm Trấn ---------- */
    pl_hang: Q({ name: "Hàng thất lạc", giver: "chuong_quy", place: "phong_lam", loc: "tram", kind: "kill", foe: ["cuop_duong"], count: 2, where: "phong_lam",
      desc: "Cướp đường trong rừng phong cướp mất hai xe hàng. Hạ 2 tên ở rừng phong.",
      reward: { money: 800, exp: 1600, rep: { phong_lam: 50, long_mon: 20 } } }),
    pl_xuong: Q({ name: "Thuốc cho người già", giver: "lang_trung", place: "phong_lam", loc: "y_quan", kind: "collect", item: "xuong_ho", qty: 1,
      desc: "Lang trung Mạc cần 1 khúc xương hổ để nấu cao cho người già trong trấn.",
      reward: { item: ["dai_hoan", 2], exp: 1500, rep: { phong_lam: 60 }, moral: 5 } }),
    pl_soi: Q({ name: "Bầy sói rừng phong", giver: "lang_trung", place: "phong_lam", loc: "y_quan", kind: "kill", foe: ["soi_dau_dan"], count: 2, where: "phong_lam",
      desc: "Bầy sói đầu đàn chặn đường hái thuốc trong rừng phong. Hạ 2 con.",
      reward: { money: 700, exp: 1800, rep: { phong_lam: 40 } } }),
  };
  KM.GIVER_NAME = (g) => (g === "bang" ? "Bảng cáo thị" : KM.NPCS[g] ? KM.NPCS[g].name : g);

  KM.sideState = (s, id) => (s.side[id] ? s.side[id].st : null);
  KM.sideDesc = function (s, id) {
    const q = KM.SIDEQUESTS[id], st = s.side[id];
    let prog = "";
    if (q.kind === "kill") prog = "Đã hạ " + Math.min(q.count, (st && st.prog) || 0) + "/" + q.count + (q.where ? " (tại " + KM.PLACES[q.where] + ")" : "");
    if (q.kind === "collect") prog = "Đang có " + Math.min(q.qty, s.inv[q.item] || 0) + "/" + q.qty + " " + KM.ITEMS[q.item].name;
    if (q.kind === "deliver") prog = "Mang tới " + KM.PLACES[q.to];
    if (st && st.due) prog += " · hạn hết ngày " + st.due;
    return prog;
  };
  KM.sideReady = function (s, id) {
    const q = KM.SIDEQUESTS[id], st = s.side[id]; if (!st || st.st !== "active") return false;
    if (q.kind === "kill") return st.prog >= q.count;
    if (q.kind === "collect") return (s.inv[q.item] || 0) >= q.qty;
    return false;
  };
  KM.acceptSide = function (s, id) {
    const q = KM.SIDEQUESTS[id];
    s.side[id] = { st: "active", prog: 0, start: s.day, due: q.due ? s.day + q.due : null };
    const msgs = ["Nhận nhiệm vụ nhánh: " + q.name + " (" + KM.GIVER_NAME(q.giver) + ")."];
    if (KM.NPCS[q.giver]) msgs.push(...KM.apply(s, { meet: q.giver }));
    if (q.give) msgs.push(...KM.addItem(s, q.give, 1));
    if (q.due) msgs.push("Hạn: hết ngày " + s.side[id].due + ".");
    return msgs;
  };
  KM.completeSide = function (s, id) {
    const q = KM.SIDEQUESTS[id], st = s.side[id];
    if (q.kind === "collect") { s.inv[q.item] -= q.qty; if (!s.inv[q.item]) delete s.inv[q.item]; }
    if (q.kind === "deliver") { delete s.inv[q.give]; }
    st.st = "done";
    return ["Hoàn thành nhiệm vụ nhánh: " + q.name + "."].concat(KM.apply(s, q.reward));
  };
  // Gọi khi hạ một kẻ địch
  KM.sideKill = function (s, foeId) {
    const out = [];
    for (const id in s.side) {
      const q = KM.SIDEQUESTS[id], st = s.side[id];
      if (st.st !== "active" || q.kind !== "kill" || !q.foe.includes(foeId) || (q.where && q.where !== s.place)) continue;
      if (st.prog >= q.count) continue;
      st.prog++;
      out.push("Nhiệm vụ nhánh " + q.name + ": " + st.prog + "/" + q.count + (st.prog >= q.count ? " — đủ rồi, quay về gặp " + KM.GIVER_NAME(q.giver) + "." : ""));
    }
    return out;
  };
  // Gọi mỗi khi sang ngày mới
  KM.sideDeadlines = function (s) {
    const out = [];
    for (const id in s.side) {
      const q = KM.SIDEQUESTS[id], st = s.side[id];
      if (st.st === "active" && st.due && s.day > st.due) {
        st.st = "fail"; out.push("Nhiệm vụ nhánh thất bại (quá hạn): " + q.name + ".");
        if (q.give) delete s.inv[q.give];
        if (q.reward.rep) { const f = Object.keys(q.reward.rep)[0]; out.push(...KM.apply(s, { rep: { [f]: -15 } })); }
      }
    }
    return out;
  };
  // Các hành động nhiệm vụ ở một địa điểm trong khu tự do
  KM.questActions = function (s, place, loc) {
    const acts = [];
    for (const id in KM.SIDEQUESTS) {
      const q = KM.SIDEQUESTS[id], st = s.side[id];
      if (q.place === place && q.loc === loc) {
        if (!st && KM.reqOk(s, q.req)) acts.push({ quest: true, t: "Nhận việc: " + q.name, sub: KM.GIVER_NAME(q.giver) + " · " + q.desc, cost: 0, run: (s2) => ({ msgs: KM.acceptSide(s2, id) }) });
        else if (st && st.st === "active" && q.kind !== "deliver") {
          const ready = KM.sideReady(s, id);
          acts.push({ quest: true, t: (ready ? "Trả việc: " : "Đang làm: ") + q.name, sub: KM.sideDesc(s, id), cost: 0, disabled: !ready, run: (s2) => ({ msgs: KM.sideReady(s2, id) ? KM.completeSide(s2, id) : ["Chưa xong: " + KM.sideDesc(s2, id) + "."], free: true }) });
        }
      }
      if (q.kind === "deliver" && st && st.st === "active" && q.to === place && q.toLoc === loc) {
        acts.push({ quest: true, t: "Giao đồ: " + q.name, sub: KM.sideDesc(s, id), cost: 0, run: (s2) => ({ msgs: KM.completeSide(s2, id) }) });
      }
    }
    return acts;
  };
  KM.questCountAt = function (s, place) {
    let n = 0;
    for (const id in KM.SIDEQUESTS) { const q = KM.SIDEQUESTS[id], st = s.side[id]; if (q.place === place && !st && KM.reqOk(s, q.req)) n++; }
    return n;
  };
})(typeof window !== "undefined" ? window : globalThis);
