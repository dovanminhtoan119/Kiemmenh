/* =====================================================================
   KIẾM MỆNH · HÌNH ẢNH ARC 3–9
   Phông cảnh mới: kinh thành, phủ đệ, sa mạc, núi tuyết. Chân dung NPC mới.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  const { roof, pine, mountains, rng, SKY, INK, FAR, MID, LAMP } = KM.ART;
  let uid = 0;
  const base = KM.background;
  const wrap = (place, t, body, id) => '<svg class="bg" viewBox="0 0 660 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + place + '"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (SKY[t] || SKY.day)[0] + '"/><stop offset="1" stop-color="' + (SKY[t] || SKY.day)[1] + '"/></linearGradient></defs>' + body + "</svg>";
  function stars() { const r = rng(3); let s = ""; for (let i = 0; i < 40; i++) s += '<circle cx="' + (r() * 660).toFixed(0) + '" cy="' + (r() * 110).toFixed(0) + '" r="' + (r() * 1.2 + 0.3).toFixed(1) + '" fill="#fff" opacity="' + (0.3 + r() * 0.6).toFixed(2) + '"/>'; return s; }
  KM.background = function (place, t) {
    t = t || "day";
    if (!["city", "palace", "desert", "snow"].includes(place)) return base(place, t);
    const id = "h" + uid++, ink = INK[t] || INK.day, far = FAR[t] || FAR.day, mid = MID[t] || MID.day, lamp = LAMP[t] || LAMP.day;
    let b = '<rect width="660" height="220" fill="url(#' + id + ')"/>';
    if (t === "night") b += stars() + '<circle cx="560" cy="44" r="16" fill="#f3ecd2" opacity=".9"/>';
    if (t === "day") b += '<circle cx="540" cy="46" r="22" fill="#fff6d8" opacity=".8"/>';
    if (t === "dusk") b += '<circle cx="520" cy="130" r="34" fill="#f6c27a" opacity=".85"/>';
    if (place === "city") {
      b += mountains(t, 91, 120, 40, far, 6);
      b += '<rect x="0" y="120" width="660" height="60" fill="' + mid + '"/>';
      for (let i = 0; i < 22; i++) b += '<rect x="' + (i * 30) + '" y="112" width="18" height="10" fill="' + mid + '"/>';
      b += '<rect x="270" y="80" width="120" height="100" fill="' + ink + '"/>' + roof(250, 70, 160, ink, lamp) + '<path d="M300 180 Q330 130 360 180 Z" fill="' + far + '" opacity=".5"/>';
      b += roof(30, 150, 120, ink, lamp) + roof(500, 150, 130, ink, lamp) + '<rect x="0" y="190" width="660" height="30" fill="' + ink + '"/>';
      [80, 200, 460, 590].forEach((x) => (b += '<ellipse cx="' + x + '" cy="140" rx="8" ry="11" fill="#b8332c"/><ellipse cx="' + x + '" cy="140" rx="4" ry="6" fill="' + lamp + '" opacity=".7"/>'));
    } else if (place === "palace") {
      b += mountains(t, 93, 130, 30, far, 5);
      b += '<rect x="0" y="176" width="660" height="44" fill="' + mid + '"/>';
      b += '<rect x="140" y="110" width="380" height="70" fill="' + ink + '"/>' + roof(120, 96, 420, ink, lamp) + roof(220, 60, 220, mid, lamp);
      for (let i = 0; i < 8; i++) b += '<rect x="' + (160 + i * 46) + '" y="112" width="8" height="64" fill="#7a1e1e"/>';
      b += '<rect x="300" y="130" width="60" height="46" fill="' + lamp + '" opacity=".35"/>';
      b += '<g fill="' + ink + '"><rect x="90" y="150" width="30" height="30"/><circle cx="105" cy="146" r="12"/><rect x="540" y="150" width="30" height="30"/><circle cx="555" cy="146" r="12"/></g>';
    } else if (place === "desert") {
      const dune = t === "night" ? "#2a2440" : t === "dusk" ? "#8a4a3a" : "#d8b272", dune2 = t === "night" ? "#1c182e" : t === "dusk" ? "#6a3628" : "#c4985a";
      b += '<path d="M0 150 Q120 110 240 140 T480 130 T660 140 L660 220 L0 220 Z" fill="' + dune + '"/>';
      b += '<path d="M0 185 Q160 150 330 178 T660 170 L660 220 L0 220 Z" fill="' + dune2 + '"/>';
      b += '<path d="M470 140 L500 70 L530 140 Z" fill="' + ink + '"/><path d="M494 72 q6 -18 0 -30 q8 10 6 30 z" fill="#f08a3a" opacity=".85"/>';
      b += '<g fill="' + ink + '" opacity=".8"><path d="M120 168 l6 -14 l10 0 l4 -8 l4 8 l10 0 l4 14 z"/><rect x="122" y="168" width="3" height="10"/><rect x="146" y="168" width="3" height="10"/></g>';
    } else if (place === "snow") {
      const sn = t === "night" ? "#9aa6c4" : t === "dusk" ? "#d8c0c8" : "#eef2f6";
      b += mountains(t, 97, 120, 80, far, 5) + '<path d="M0 120 L60 60 L120 110 L200 40 L290 115 L380 50 L470 112 L560 46 L660 118" fill="none" stroke="' + sn + '" stroke-width="8" opacity=".9"/>';
      b += '<path d="M0 170 Q330 140 660 168 L660 220 L0 220 Z" fill="' + sn + '"/>';
      const r = rng(17); for (let i = 0; i < 8; i++) b += pine(30 + i * 85 + r() * 20, 190 - r() * 16, 0.9 + r() * 0.5, ink);
      for (let i = 0; i < 50; i++) b += '<circle cx="' + (r() * 660).toFixed(0) + '" cy="' + (r() * 220).toFixed(0) + '" r="' + (r() * 1.6 + 0.4).toFixed(1) + '" fill="#fff" opacity=".7"/>';
    }
    return wrap(place, t, b, id);
  };

  Object.assign(KM.PORTRAITS, {
    ta_thien_hanh: { skin: "#ecd0ae", hair: "crown", hc: "#3a3a3a", robe: "#eeeae0", trim: "#c8a040", beard: "#3a3a3a", label: "Tạ Thiên Hành" },
    ta_van_phi: { skin: "#f2d8bc", hair: "topknot", hc: "#121212", robe: "#f0f0f4", trim: "#5a7aa8", label: "Tạ Vân Phi" },
    trieu_phuc: { skin: "#e0bc96", hair: "short", hc: "#2a2a2a", robe: "#5a4a3a", trim: "#c8a060", big: true, label: "Triệu Phúc" },
    ong_lao_tra: { skin: "#d8b48c", hair: "topknot", hc: "#e8e8e8", robe: "#5a6a5a", trim: "#3a4a3a", beard: "#efefef", label: "Ông lão bán trà" },
    thien_co: { skin: "#d8b48c", hair: "long", hc: "#f2f2f2", robe: "#2a2a34", trim: "#d8d8e0", beard: "#f4f4f4", label: "Thiên Cơ Lão Nhân" },
    hue_nang: { skin: "#d8b088", hair: "bald", hc: "#333", robe: "#c8862a", trim: "#7a3a1a", label: "Huệ Năng" },
    hue_tri: { skin: "#d0a880", hair: "bald", hc: "#333", robe: "#b8762a", trim: "#7a3a1a", beard: "#eeeeee", label: "Phương trượng Huệ Trì" },
    thanh_hu: { skin: "#e4c8a4", hair: "topknot", hc: "#f0f0f0", robe: "#3a4a6a", trim: "#e0e0e8", beard: "#f4f4f4", label: "Chân nhân Thanh Hư" },
    lien_nhi: { skin: "#f2d6ba", hair: "pony", hc: "#141010", robe: "#d86a8a", trim: "#2a1a20", female: true, label: "Liên Nhi" },
    quy_anh: { skin: "#c8b098", hair: "hood", hc: "#0b0b0b", robe: "#2a0a0e", trim: "#b8332c", mask: true, label: "Quỷ Ảnh" },
    huyet_y: { skin: "#e0c4a4", hair: "long", hc: "#0e0e0e", robe: "#9a1a1e", trim: "#2a0a0c", label: "Lâu chủ Huyết Y" },
    da_vo_thuong: { skin: "#d8b08c", hair: "long", hc: "#e8e8e8", robe: "#1a1a1a", trim: "#c8322a", label: "Dạ Vô Thương" },
    da_linh: { skin: "#f0d0b0", hair: "bun", hc: "#101010", robe: "#b8222a", trim: "#f0c040", female: true, label: "Dạ Linh" },
    cuu_thien_liet: { skin: "#b8845a", hair: "wild", hc: "#7a1a1a", robe: "#2a1a1a", trim: "#e06a2a", beard: "#5a1a1a", big: true, label: "Cừu Thiên Liệt" },
    ma_giao: { skin: "#c0946a", hair: "band", hc: "#111", robe: "#1e1414", trim: "#c8322a", label: "Vệ sĩ Ma Giáo" },
    lao_tuong: { skin: "#b88a60", hair: "short", hc: "#cfcfcf", robe: "#4a3a2a", trim: "#8a7a5a", beard: "#d8d8d8", scar: true, label: "Lão tướng Mạnh Cương" },
    lao_dan_duong: { skin: "#b88a60", hair: "straw", hc: "#cfcfcf", robe: "#6a5a4a", trim: "#3a2a1a", beard: "#dcdcdc", label: "Lão dẫn đường" },
    kiem_khoi: { skin: "#8a8a8a", hair: "bald", hc: "#6a6a6a", robe: "#5a5a5a", trim: "#3a3a3a", big: true, label: "Kiếm khôi đá" },
    kiem_hon: { skin: "#c8d0d8", hair: "long", hc: "#e8ecf0", robe: "#6a7480", trim: "#c8d0d8", label: "Kiếm Hồn Vô Danh" },
  });
})(typeof window !== "undefined" ? window : globalThis);
