/* =====================================================================
   KIẾM MỆNH · HÌNH ẢNH (SVG tự vẽ)
   Phông cảnh theo địa điểm × thời điểm (ngày / hoàng hôn / đêm / mưa / trong nhà)
   Chân dung nhân vật & thú dựng từ tham số.
   ===================================================================== */
(function (G) {
  const KM = (G.KM = G.KM || {});
  let uid = 0;
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const SKY = {
    day: ["#7fb3d8", "#e8f1ea"], dusk: ["#3a2547", "#e59a5c"], night: ["#070b1d", "#24305a"],
    rain: ["#2a3038", "#56606b"], indoor: ["#2a1c12", "#4a3322"],
  };
  const INK = { day: "#3d4b4a", dusk: "#2c1a2a", night: "#0b0f1c", rain: "#1d2228", indoor: "#160f09" };
  const FAR = { day: "#8fa8a6", dusk: "#7a4a5a", night: "#1b2442", rain: "#4b545d", indoor: "#3a2a1c" };
  const MID = { day: "#5f7a74", dusk: "#4a2d3e", night: "#121a33", rain: "#363d45", indoor: "#2b1e13" };
  const LAMP = { day: "#d9a85b", dusk: "#f0a050", night: "#ffcf6e", rain: "#e8b866", indoor: "#ffcf6e" };

  function mountains(t, seed, y0, h, color, n) {
    const r = rng(seed); let d = "M0 220 L0 " + (y0 + h * r());
    for (let i = 1; i <= n; i++) { const x = (660 / n) * i; d += " L" + (x - 660 / n / 2).toFixed(0) + " " + (y0 - h * (0.3 + r() * 0.7)).toFixed(0) + " L" + x.toFixed(0) + " " + (y0 + h * r() * 0.3).toFixed(0); }
    return '<path d="' + d + ' L660 220 Z" fill="' + color + '"/>';
  }
  function roof(x, y, w, c, lamp) {
    return '<g><path d="M' + (x - 8) + " " + y + " Q" + (x + w / 2) + " " + (y - 26) + " " + (x + w + 8) + " " + y + " L" + (x + w - 4) + " " + (y + 6) + " L" + (x + 4) + " " + (y + 6) + ' Z" fill="' + c + '"/>' +
      '<rect x="' + (x + 4) + '" y="' + (y + 6) + '" width="' + (w - 8) + '" height="40" fill="' + c + '" opacity=".85"/>' +
      (lamp ? '<circle cx="' + (x + 10) + '" cy="' + (y + 16) + '" r="4" fill="' + lamp + '"/><rect x="' + (x + w / 2 - 6) + '" y="' + (y + 20) + '" width="12" height="16" fill="' + lamp + '" opacity=".75"/>' : "") + "</g>";
  }
  function pine(x, y, s, c) { return '<path d="M' + x + " " + (y - 60 * s) + " L" + (x - 18 * s) + " " + (y - 20 * s) + " L" + (x - 8 * s) + " " + (y - 20 * s) + " L" + (x - 24 * s) + " " + y + " L" + (x + 24 * s) + " " + y + " L" + (x + 8 * s) + " " + (y - 20 * s) + " L" + (x + 18 * s) + " " + (y - 20 * s) + ' Z" fill="' + c + '"/><rect x="' + (x - 2 * s) + '" y="' + y + '" width="' + 4 * s + '" height="' + 10 * s + '" fill="' + c + '"/>'; }
  function rain() { const r = rng(7); let s = ""; for (let i = 0; i < 70; i++) { const x = r() * 680, y = r() * 220; s += '<line x1="' + x.toFixed(0) + '" y1="' + y.toFixed(0) + '" x2="' + (x - 6).toFixed(0) + '" y2="' + (y + 16).toFixed(0) + '" stroke="#c8d3de" stroke-width="1" opacity=".35"/>'; } return s; }
  function stars() { const r = rng(3); let s = ""; for (let i = 0; i < 40; i++) s += '<circle cx="' + (r() * 660).toFixed(0) + '" cy="' + (r() * 110).toFixed(0) + '" r="' + (r() * 1.2 + 0.3).toFixed(1) + '" fill="#fff" opacity="' + (0.3 + r() * 0.6).toFixed(2) + '"/>'; return s + '<circle cx="560" cy="44" r="16" fill="#f3ecd2" opacity=".9"/>'; }

  KM.background = function (place, t) {
    t = t || "day"; const id = "g" + uid++; const sky = SKY[t] || SKY.day, ink = INK[t], far = FAR[t], mid = MID[t], lamp = LAMP[t];
    let body = "";
    const indoor = ["room", "medic", "inn", "hall"].includes(place);
    if (indoor) {
      body += '<rect width="660" height="220" fill="url(#' + id + ')"/>';
      body += '<rect x="0" y="150" width="660" height="70" fill="' + ink + '" opacity=".8"/>';
      for (let i = 0; i < 6; i++) body += '<rect x="' + (40 + i * 115) + '" y="0" width="14" height="160" fill="' + ink + '"/>';
      body += '<rect x="0" y="18" width="660" height="10" fill="' + ink + '"/>';
      if (place === "hall") { body += '<rect x="250" y="60" width="160" height="70" fill="' + mid + '"/><rect x="300" y="82" width="60" height="48" fill="' + ink + '"/><text x="330" y="52" text-anchor="middle" font-family="Times New Roman" font-size="18" fill="' + lamp + '" opacity=".8">青 雲</text>'; }
      if (place === "medic") { for (let i = 0; i < 4; i++) body += '<rect x="' + (420 + i * 50) + '" y="70" width="40" height="70" fill="' + mid + '" stroke="' + ink + '"/>'; body += '<ellipse cx="200" cy="148" rx="60" ry="8" fill="' + mid + '"/>'; }
      if (place === "inn") { body += '<rect x="160" y="120" width="120" height="10" fill="' + mid + '"/><rect x="420" y="120" width="120" height="10" fill="' + mid + '"/>'; [120, 330, 540].forEach((x) => (body += '<line x1="' + x + '" y1="28" x2="' + x + '" y2="60" stroke="' + ink + '"/><ellipse cx="' + x + '" cy="70" rx="12" ry="16" fill="#b8332c"/><ellipse cx="' + x + '" cy="70" rx="7" ry="10" fill="' + lamp + '" opacity=".6"/>')); }
      if (place === "room") { body += '<rect x="80" y="118" width="200" height="16" fill="' + mid + '"/><rect x="460" y="50" width="90" height="70" fill="' + far + '" opacity=".5" stroke="' + ink + '" stroke-width="4"/>'; }
      body += '<circle cx="600" cy="90" r="40" fill="' + lamp + '" opacity=".08"/>';
    } else {
      body += '<rect width="660" height="220" fill="url(#' + id + ')"/>';
      if (t === "night") body += stars();
      if (t === "day") body += '<circle cx="540" cy="46" r="22" fill="#fff6d8" opacity=".8"/>';
      if (t === "dusk") body += '<circle cx="520" cy="130" r="34" fill="#f6c27a" opacity=".85"/>';
      body += mountains(t, 11, 120, 70, far, 6);
      if (place === "mountain_gate" || place === "kitchen" || place === "yard" || place === "mountain") {
        body += mountains(t, 23, 160, 40, mid, 5);
        if (place === "mountain_gate") body += '<g fill="' + ink + '"><rect x="250" y="90" width="12" height="100"/><rect x="398" y="90" width="12" height="100"/><path d="M226 92 Q330 66 434 92 L430 100 L230 100 Z"/><rect x="262" y="110" width="136" height="8"/></g><path d="M300 220 L320 150 L340 150 L360 220 Z" fill="' + mid + '"/>';
        if (place === "kitchen") body += roof(120, 110, 220, ink, lamp) + '<rect x="0" y="190" width="660" height="30" fill="' + ink + '"/><path d="M380 100 q10 -20 0 -40 q-10 -20 6 -40" stroke="#aaa" stroke-width="6" fill="none" opacity=".25"/>';
        if (place === "yard") body += roof(40, 100, 160, ink, null) + roof(460, 100, 160, ink, null) + '<rect x="0" y="170" width="660" height="50" fill="' + mid + '"/><g stroke="' + ink + '" stroke-width="3"><line x1="300" y1="120" x2="300" y2="172"/><line x1="320" y1="116" x2="320" y2="172"/><line x1="340" y1="120" x2="340" y2="172"/><line x1="290" y1="140" x2="350" y2="140"/></g>';
      } else if (place === "forest" || place === "bamboo") {
        body += mountains(t, 31, 170, 30, mid, 4);
        if (place === "forest") { const r = rng(5); for (let i = 0; i < 9; i++) body += pine(30 + i * 75 + r() * 20, 200 - r() * 20, 1 + r() * 0.6, ink); }
        else { const r = rng(9); for (let i = 0; i < 26; i++) { const x = r() * 660; body += '<rect x="' + x.toFixed(0) + '" y="0" width="' + (4 + r() * 4).toFixed(0) + '" height="220" fill="' + ink + '" opacity="' + (0.5 + r() * 0.5).toFixed(2) + '"/><path d="M' + x.toFixed(0) + " " + (60 + r() * 100).toFixed(0) + ' l24 -8 l-20 12 z" fill="' + ink + '"/>'; } }
        body += '<rect x="0" y="205" width="660" height="15" fill="' + ink + '"/>';
      } else if (place === "waterfall" || place === "cave") {
        if (place === "waterfall") body += '<path d="M180 220 L210 20 L300 10 L300 220 Z" fill="' + ink + '"/><path d="M380 220 L360 10 L470 30 L500 220 Z" fill="' + ink + '"/><rect x="300" y="10" width="62" height="210" fill="#dfe8ee" opacity=".55"/><ellipse cx="330" cy="212" rx="110" ry="14" fill="#fff" opacity=".25"/>';
        else body = '<rect width="660" height="220" fill="#0d0b09"/><path d="M0 0 L660 0 L660 40 Q330 90 0 40 Z" fill="#1d1813"/><path d="M0 220 L0 170 Q330 130 660 170 L660 220 Z" fill="#1d1813"/><ellipse cx="330" cy="150" rx="140" ry="40" fill="#e8d7a8" opacity=".06"/><g fill="#cfc6b0" opacity=".7"><circle cx="330" cy="120" r="10"/><rect x="318" y="130" width="24" height="26" rx="6"/><line x1="350" y1="128" x2="370" y2="168" stroke="#8a8a8a" stroke-width="3"/></g>';
      } else if (place === "road") {
        body += mountains(t, 41, 160, 30, mid, 5) + '<path d="M0 190 Q330 170 660 196 L660 220 L0 220 Z" fill="' + ink + '"/><path d="M280 220 Q330 186 400 176 L420 178 Q360 190 340 220 Z" fill="' + far + '" opacity=".6"/>';
        body += pine(80, 190, 1.1, ink) + pine(590, 196, 1.3, ink);
      } else if (place === "town" || place === "market") {
        body += roof(20, 120, 140, ink, lamp) + roof(180, 110, 150, mid, lamp) + roof(350, 124, 130, ink, lamp) + roof(500, 112, 150, mid, lamp) + '<rect x="0" y="166" width="660" height="54" fill="' + ink + '"/>';
        if (place === "market") body += '<g fill="#a34b2c" opacity=".85"><path d="M60 170 l60 0 l-10 -16 l-40 0 z"/><path d="M260 170 l70 0 l-10 -16 l-50 0 z"/><path d="M470 170 l60 0 l-10 -16 l-40 0 z"/></g>';
      } else if (place === "river" || place === "lair") {
        body += mountains(t, 51, 150, 40, mid, 5) + '<rect x="0" y="160" width="660" height="60" fill="' + mid + '"/>';
        for (let i = 0; i < 8; i++) body += '<line x1="' + (i * 90) + '" y1="' + (176 + (i % 3) * 12) + '" x2="' + (i * 90 + 40) + '" y2="' + (176 + (i % 3) * 12) + '" stroke="#fff" opacity=".15"/>';
        if (place === "river") body += '<path d="M120 170 q40 14 90 0 l-8 -8 l-74 0 z" fill="' + ink + '"/><line x1="160" y1="162" x2="160" y2="130" stroke="' + ink + '" stroke-width="2"/><path d="M430 180 q30 10 70 0 l-6 -6 l-58 0 z" fill="' + ink + '"/>';
        else { for (let i = 0; i < 6; i++) body += '<line x1="' + (200 + i * 50) + '" y1="150" x2="' + (200 + i * 50) + '" y2="200" stroke="' + ink + '" stroke-width="4"/>'; body += roof(200, 110, 250, ink, "#d13b30") + '<circle cx="230" cy="100" r="6" fill="#d13b30"/><circle cx="420" cy="100" r="6" fill="#d13b30"/>'; }
      } else if (place === "camp") {
        body += '<path d="M120 220 L200 110 L520 100 L600 220 Z" fill="' + ink + '"/>';
        for (let i = 0; i < 18; i++) body += '<path d="M' + (220 + i * 16) + " 110 l6 -22 l6 22 z" + '" fill="' + mid + '"/>';
        body += '<rect x="216" y="104" width="296" height="10" fill="' + mid + '"/><circle cx="240" cy="86" r="6" fill="' + lamp + '"/><circle cx="490" cy="86" r="6" fill="' + lamp + '"/>';
      } else if (place === "yard2" || place === "arena") {
        body += roof(60, 96, 240, ink, lamp) + '<rect x="0" y="166" width="660" height="54" fill="' + mid + '"/>';
        if (place === "yard2") body += '<line x1="470" y1="40" x2="470" y2="170" stroke="' + ink + '" stroke-width="4"/><path d="M472 44 l70 10 l-70 22 z" fill="#1c1c1c"/><text x="500" y="64" font-family="Times New Roman" font-size="16" fill="#c9a24a">龍</text>';
        else body += '<rect x="380" y="140" width="240" height="30" fill="' + ink + '"/><line x1="380" y1="80" x2="380" y2="140" stroke="#b8332c" stroke-width="4"/><line x1="620" y1="80" x2="620" y2="140" stroke="#b8332c" stroke-width="4"/><line x1="380" y1="84" x2="620" y2="84" stroke="#b8332c" stroke-width="3"/>';
      } else if (place === "village") {
        body += mountains(t, 71, 160, 30, mid, 5) + roof(60, 128, 110, ink, lamp) + roof(250, 120, 130, mid, lamp) + roof(470, 130, 110, ink, lamp) + '<rect x="0" y="174" width="660" height="46" fill="' + ink + '"/>';
        const r = rng(13); for (let i = 0; i < 5; i++) { const x = 190 + i * 70 + r() * 20; body += '<rect x="' + (x - 2) + '" y="140" width="4" height="36" fill="' + ink + '"/><circle cx="' + x + '" cy="134" r="16" fill="#e8a7b4" opacity="' + (t === "night" ? 0.35 : 0.8) + '"/>'; }
        body += '<rect x="400" y="160" width="26" height="16" fill="' + mid + '"/><rect x="396" y="156" width="34" height="5" fill="' + ink + '"/>';
      } else if (place === "temple") {
        body += mountains(t, 81, 160, 40, mid, 5) + '<path d="M240 220 L250 150 L410 150 L420 220 Z" fill="' + ink + '"/>' + roof(260, 108, 140, mid, lamp) + '<rect x="316" y="130" width="28" height="24" fill="' + lamp + '" opacity=".6"/><path d="M340 100 q6 -16 0 -30 q-6 -14 4 -28" stroke="#ccc" stroke-width="3" fill="none" opacity=".35"/>';
        body += pine(170, 200, 1.2, ink) + pine(500, 205, 1.3, ink);
      } else body += mountains(t, 61, 170, 40, mid, 5);
    }
    if (t === "rain") body += rain();
    return '<svg class="bg" viewBox="0 0 660 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + place + '"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' + body + "</svg>";
  };

  /* ---------------- Chân dung ---------------- */
  const P = {
    shen: { skin: "#e3c3a0", hair: "messy", hc: "#1b1714", robe: "#6b5a48", trim: "#3d3128", scar: true, label: "Shen" },
    tieu_hao: { skin: "#f0d4b4", hair: "crown", hc: "#141414", robe: "#2f7a72", trim: "#d8c58a", label: "Tiêu Hạo" },
    ly_tam: { skin: "#d9b48c", hair: "messy", hc: "#2b211a", robe: "#8a8a7a", trim: "#5a5a50", label: "Lý Tam" },
    to_van_yen: { skin: "#f2d8bc", hair: "bun", hc: "#18120f", robe: "#8f8c86", trim: "#e9e3d6", female: true, label: "Tô Vân Yên" },
    tieu_luc: { skin: "#d8b088", hair: "short", hc: "#2b1d12", robe: "#7a5a3a", trim: "#4a3826", label: "Tiểu Lục" },
    han_giao_dau: { skin: "#c99a70", hair: "bald", hc: "#333", robe: "#2a2f3a", trim: "#888", beard: "#3a3a3a", label: "Hàn giáo đầu" },
    chuong_mon: { skin: "#ecd2b2", hair: "long", hc: "#e8e8e8", robe: "#e9e6dc", trim: "#5c8fa3", beard: "#efefef", label: "Lục Thanh Tùng" },
    de_tu: { skin: "#e8c8a4", hair: "topknot", hc: "#151515", robe: "#7da4c4", trim: "#e0e8ef", label: "Đệ tử nội môn" },
    hac_y: { skin: "#d0b08c", hair: "hood", hc: "#0b0b0b", robe: "#151515", trim: "#7a1e1e", mask: true, label: "Hắc y nhân" },
    lao_ho: { skin: "#cfa47c", hair: "wild", hc: "#d8d8d8", robe: "#7a6448", trim: "#4c3d2b", beard: "#dcdcdc", patch: true, label: "Lão Hồ" },
    long_tieu_chu: { skin: "#c8946a", hair: "bald", hc: "#222", robe: "#1d1d1d", trim: "#a8322a", beard: "#1d1d1d", big: true, label: "Long Chấn Uy" },
    phuong_nhi: { skin: "#f0d0b0", hair: "pony", hc: "#1a1010", robe: "#b8322c", trim: "#f2c46a", female: true, label: "Long Phượng Nhi" },
    duong_nhat_anh: { skin: "#f0d6b8", hair: "topknot", hc: "#101010", robe: "#355f8f", trim: "#c8d6e6", label: "Đường Nhất Ảnh" },
    au_tri: { skin: "#b9845c", hair: "bald", hc: "#222", robe: "#5a3a24", trim: "#2a1a10", beard: "#4a3a2a", label: "Âu Trì" },
    ong_lao_ca: { skin: "#c08d63", hair: "straw", hc: "#cfcfcf", robe: "#5d6b62", trim: "#3a443d", beard: "#d8d8d8", label: "Ông lão đánh cá" },
    tieu_dau: { skin: "#c48e64", hair: "short", hc: "#1a1a1a", robe: "#3a3a3a", trim: "#a8322a", beard: "#1a1a1a", big: true, label: "Mã Đại" },
    son_tac: { skin: "#b98a62", hair: "wild", hc: "#1a1a1a", robe: "#4e4230", trim: "#2a2418", beard: "#1a1a1a", label: "Sơn tặc" },
    dau_muc: { skin: "#a87a52", hair: "bald", hc: "#1a1a1a", robe: "#2e2a24", trim: "#7a1e1e", beard: "#1a1a1a", big: true, scar: true, label: "Đầu mục" },
    thuy_phi: { skin: "#b08058", hair: "band", hc: "#1a1a1a", robe: "#2f4a52", trim: "#1a2a30", label: "Thủy phỉ" },
    hac_giao: { skin: "#a87650", hair: "band", hc: "#0f0f0f", robe: "skin", trim: "#1f4f4a", tattoo: true, big: true, label: "Hắc Giao" },
    vo_si: { skin: "#c8946a", hair: "band", hc: "#1a1a1a", robe: "#7a3a1a", trim: "#f0c060", label: "Hồ Báo" },
    vo_si2: { skin: "#a87a52", hair: "bald", hc: "#1a1a1a", robe: "#4a3a2a", trim: "#8a6a3a", big: true, label: "Thiết Ngưu" },
    vo_si3: { skin: "#f0d8c0", hair: "long", hc: "#101010", robe: "#d8dce6", trim: "#5a6a8a", label: "Lãnh Nguyệt" },
    quan_su_bep: { skin: "#d6a882", hair: "short", hc: "#3a3a3a", robe: "#8a7a5a", trim: "#f0ead8", beard: "#3a3a3a", big: true, label: "Quản sự Vương" },
    truong_thon: { skin: "#c99a70", hair: "topknot", hc: "#bdbdbd", robe: "#6a5a3a", trim: "#3a301e", beard: "#cfcfcf", label: "Trưởng thôn Lưu" },
    ba_tra: { skin: "#d8b08c", hair: "bun", hc: "#9a9a9a", robe: "#5a4a6a", trim: "#d8d0e0", female: true, label: "Bà Tư" },
    tho_san: { skin: "#b8845a", hair: "band", hc: "#1a1a1a", robe: "#5a4a2a", trim: "#8a6a3a", label: "Hạ Tứ" },
    dan_chai: { skin: "#a87a52", hair: "straw", hc: "#5a5a5a", robe: "#3a4a52", trim: "#1a2a30", beard: "#5a5a5a", label: "Lão Ngư" },
    chuong_quy: { skin: "#e0bc96", hair: "topknot", hc: "#2a2a2a", robe: "#7a3a2a", trim: "#d8b060", label: "Chưởng quỹ Tiền" },
    lang_trung: { skin: "#e4c4a0", hair: "long", hc: "#5a5a5a", robe: "#4a6a5a", trim: "#d8e8e0", beard: "#6a6a6a", label: "Lang trung Mạc" },
  };
  KM.PORTRAITS = P;
  KM.ART = { roof, pine, mountains, rng, SKY, INK, FAR, MID, LAMP };
  function beast(kind, label) {
    let body = "";
    if (kind === "soi") body = '<path d="M20 120 L34 70 L48 92 L60 60 L74 92 L90 70 L100 120 Z" fill="#5d6268"/><path d="M38 96 l10 6 M80 96 l-10 6" stroke="#f2d16b" stroke-width="4"/><path d="M50 112 l10 10 l10 -10" fill="#e8e8e8"/>';
    else if (kind === "heo") body = '<ellipse cx="60" cy="96" rx="44" ry="32" fill="#4a3a30"/><ellipse cx="60" cy="108" rx="18" ry="12" fill="#6a5040"/><circle cx="54" cy="108" r="3" fill="#222"/><circle cx="66" cy="108" r="3" fill="#222"/><path d="M42 112 l-8 -14 M78 112 l8 -14" stroke="#eee" stroke-width="4"/><circle cx="44" cy="86" r="4" fill="#d33"/><circle cx="76" cy="86" r="4" fill="#d33"/>';
    else body = '<path d="M16 120 L26 64 L42 80 L60 66 L78 80 L94 64 L104 120 Z" fill="#d9822b"/><path d="M30 80 l12 10 M90 80 l-12 10 M56 70 l4 14 l4 -14 M40 104 l12 -4 M80 104 l-12 -4" stroke="#1a1a1a" stroke-width="4"/><circle cx="46" cy="92" r="4" fill="#f5e04a"/><circle cx="74" cy="92" r="4" fill="#f5e04a"/><path d="M50 112 l10 8 l10 -8" fill="#fff"/>';
    return '<svg viewBox="0 0 120 140" class="pt" role="img" aria-label="' + label + '"><rect width="120" height="140" fill="#1e1a15"/>' + body + "</svg>";
  }
  KM.portrait = function (key, label) {
    if (key === "soi" || key === "heo" || key === "ho") return beast(key, label || key);
    const p = P[key] || P.son_tac; label = label || p.label;
    const s = p.skin, hc = p.hc, w = p.big ? 50 : 42;
    let g = '<rect width="120" height="140" fill="#1e1a15"/>';
    // thân
    const robe = p.robe === "skin" ? s : p.robe;
    g += '<path d="M' + (60 - w) + " 140 Q" + (60 - w) + " 100 60 96 Q" + (60 + w) + " 100 " + (60 + w) + ' 140 Z" fill="' + robe + '"/>';
    if (p.robe !== "skin") g += '<path d="M48 98 L60 128 L72 98" fill="none" stroke="' + p.trim + '" stroke-width="5"/>';
    if (p.tattoo) g += '<path d="M30 120 q15 -20 30 -6 q15 14 30 -8" stroke="#1f4f4a" stroke-width="5" fill="none"/>';
    if (p.patch) g += '<rect x="28" y="116" width="14" height="12" fill="#5a4a36"/><rect x="80" y="110" width="12" height="14" fill="#9a8460"/>';
    // cổ + mặt
    g += '<rect x="53" y="82" width="14" height="18" fill="' + s + '"/><ellipse cx="60" cy="62" rx="22" ry="27" fill="' + s + '"/>';
    // tóc
    if (p.hair === "topknot" || p.hair === "crown") g += '<path d="M38 58 Q38 32 60 32 Q82 32 82 58 Q76 44 60 44 Q44 44 38 58 Z" fill="' + hc + '"/><circle cx="60" cy="28" r="8" fill="' + hc + '"/>' + (p.hair === "crown" ? '<rect x="52" y="22" width="16" height="7" fill="#d8c58a"/>' : "");
    else if (p.hair === "messy") g += '<path d="M36 62 Q34 30 60 30 Q88 30 84 62 L80 50 L74 58 L70 44 L62 54 L56 42 L50 56 L44 46 Z" fill="' + hc + '"/><circle cx="60" cy="27" r="6" fill="' + hc + '"/>';
    else if (p.hair === "short") g += '<path d="M38 56 Q38 32 60 32 Q82 32 82 56 Q74 40 60 42 Q46 40 38 56 Z" fill="' + hc + '"/>';
    else if (p.hair === "bun") g += '<path d="M37 70 Q34 30 60 30 Q86 30 83 70 Q80 46 60 44 Q40 46 37 70 Z" fill="' + hc + '"/><circle cx="60" cy="26" r="10" fill="' + hc + '"/><line x1="46" y1="22" x2="76" y2="30" stroke="#d8c58a" stroke-width="2"/>';
    else if (p.hair === "pony") g += '<path d="M37 66 Q34 30 60 30 Q86 30 83 66 Q80 44 60 42 Q40 44 37 66 Z" fill="' + hc + '"/><path d="M80 40 Q100 60 88 110" stroke="' + hc + '" stroke-width="10" fill="none"/><rect x="74" y="34" width="10" height="6" fill="' + p.trim + '"/>';
    else if (p.hair === "long") g += '<path d="M34 110 Q30 30 60 30 Q90 30 86 110 L78 110 Q80 50 60 46 Q40 50 42 110 Z" fill="' + hc + '"/><circle cx="60" cy="28" r="7" fill="' + hc + '"/>';
    else if (p.hair === "wild") g += '<path d="M30 76 Q26 26 60 26 Q94 26 90 76 L84 60 L82 46 Q60 38 38 46 L36 60 Z" fill="' + hc + '"/>';
    else if (p.hair === "bald") g += '<ellipse cx="60" cy="42" rx="20" ry="10" fill="' + s + '" opacity=".9"/>';
    else if (p.hair === "band") g += '<path d="M38 56 Q38 32 60 32 Q82 32 82 56 Q74 42 60 42 Q46 42 38 56 Z" fill="' + hc + '"/><rect x="38" y="44" width="44" height="6" fill="#a8322a"/><path d="M82 46 l12 6 l-10 4 z" fill="#a8322a"/>';
    else if (p.hair === "hood") g += '<path d="M30 100 Q28 26 60 24 Q92 26 90 100 L80 100 Q82 48 60 44 Q38 48 40 100 Z" fill="' + hc + '"/>';
    else if (p.hair === "straw") g += '<path d="M14 46 L60 18 L106 46 Z" fill="#c8a860"/><path d="M14 46 L106 46" stroke="#8a7040" stroke-width="2"/>';
    // mắt, mày, miệng
    g += '<path d="M46 56 l10 -2 M64 54 l10 2" stroke="' + (p.hair === "bald" ? "#333" : hc) + '" stroke-width="2.5"/>';
    g += '<ellipse cx="51" cy="63" rx="3" ry="' + (p.female ? 3 : 2) + '" fill="#1a1410"/><ellipse cx="69" cy="63" rx="3" ry="' + (p.female ? 3 : 2) + '" fill="#1a1410"/>';
    g += '<path d="M54 78 Q60 ' + (p.female ? 81 : 79) + ' 66 78" stroke="#7a3a2a" stroke-width="2" fill="none"/>';
    if (p.beard) g += '<path d="M44 74 Q46 100 60 104 Q74 100 76 74 Q70 86 60 86 Q50 86 44 74 Z" fill="' + p.beard + '"/>';
    if (p.mask) g += '<rect x="38" y="68" width="44" height="18" fill="#0b0b0b"/>';
    if (p.scar) g += '<path d="M70 52 l6 14" stroke="#9a3a2a" stroke-width="2"/>';
    return '<svg viewBox="0 0 120 140" class="pt" role="img" aria-label="' + label + '">' + g + "</svg>";
  };
  KM.portraitLabel = (key) => (P[key] && P[key].label) || ({ soi: "Sói", heo: "Heo rừng", ho: "Hổ dữ" })[key] || key;
})(typeof window !== "undefined" ? window : globalThis);
