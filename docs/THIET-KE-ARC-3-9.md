# Kiếm Mệnh – Thiết kế Arc 3–9

Bản thiết kế toàn bộ phần còn lại của cốt truyện, từ Rank D (Lv 19) tới Rank SSS (Lv 95). Mỗi arc theo cùng một khung: tổng quan, mốc truyện theo ngày, lựa chọn lớn và hậu quả, hạn chót chính tuyến, kỳ ngộ, kẻ địch, trang bị, nhiệm vụ nhánh. Luật chơi theo file System và bản thiết kế gốc: EXP `floor(100 × L^1.5)`, 5 điểm/cấp, trần Level theo cảnh giới, xúc xắc d100/d20.

Quy ước: **A** là ngày Shen đặt chân tới vùng của arc. Chỉ số kẻ địch: tổng điểm = 30 + 5 × (Lv − 1); HP = (100 + 20 × VIT + 5 × Lv) × hệ số HP; EXP = floor(100 × Lv^1.5) × 0.5 cho quái thường, × 1.0–1.3 cho trùm.

---

## 0. Lộ trình toàn bộ

| Arc | Tên | Rank / Level | Vùng | Hạn chính tuyến | Trùm | Lựa chọn lớn | Kỳ ngộ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | Võ Lâm Đại Hội Thiếu Niên | D → C · Lv 19–28 | Kim Lăng | Lịch đại hội cố định, chung kết A+11 | Tạ Vân Phi (C, Lv 28) | Thắng chung kết / cố ý thua / vạch mặt quá sớm | Ván cờ với ông lão bán trà |
| 4 | Huyết Ảnh Lâu | C → B · Lv 28–40 | Giang Nam (Vân Thủy Thành) | Đêm Huyết Nguyệt A+18 | Phó lâu chủ Quỷ Ảnh (B, Lv 40) | Giết hay tha Liên Nhi | Đáy Tây Hồ đêm rằm |
| 5 | Ma Giáo Tây Vực | B → A · Lv 40–52 | Lương Châu, sa mạc, Thánh Hỏa Sơn | Lễ Thánh Hỏa A+16 | Hữu hộ pháp Cừu Thiên Liệt (A, Lv 50) | Xử lý lá thư của Minh chủ (4 cách) | Thần mã ở ốc đảo |
| 6 | Bí Cảnh Kiếm Trủng | A → S · Lv 52–64 | Bắc Cảnh | Bí cảnh mở A+3, khép lại cuối ngày A+9 | Kiếm Hồn Vô Danh (S, Lv 64) | Nhận truyền thừa hay nhường đồng minh | Kiếm Ý Thạch |
| 7 | Chính Tà Đại Chiến | S · Lv 64–74 | Trung Nguyên (3 chiến tuyến) | Các chiến tuyến thất thủ theo lịch, đại chiến A+14 | Lâu chủ Huyết Y (S, Lv 72) | Cứu phái nào khi hai nơi cùng bị vây | Lời trăng trối của lão tướng |
| 8 | Vạch Mặt Minh Chủ | S → SS · Lv 74–86 | Kim Lăng | Đại Hội Võ Lâm A+10 | Tạ Thiên Hành (SS, Lv 86) | Giết, phế võ công hay giao triều đình | Thiên Mạch Chân Giải toàn bản |
| 9 | Thiên Hạ Đệ Nhất | SS → SSS · Lv 86–95 | Thiên Sơn | Thiên Hạ Kỳ Cục, 12 ngày | Thiên Cơ Lão Nhân (SSS, Lv 95) | Chọn kết thúc (4 kết) | Vấn Tâm đài |

Tổng thời lượng dự kiến: khoảng 150–180 ngày trong game. Mỗi arc có 6 nhiệm vụ nhánh, một đại kỳ ngộ, tiểu kỳ ngộ hằng ngày, và mọi lựa chọn đều có đoạn diễn biến riêng trước khi chuyển cảnh.

---

## 1. Kế thừa xuyên suốt

Không có lựa chọn nào khóa mạch truyện; chỉ đổi đường đi, đồng minh và độ khó.

| Điều kiện (cờ) | Hậu quả |
| --- | --- |
| Theo Cái Bang (`sect_cai_bang`) | Kiểm tra dò thám ở thành lớn −3 độ khó; Lão Hồ dẫn đường vào phủ Minh chủ (Arc 3); nội ứng Cái Bang ở Giang Nam (Arc 4); Cái Bang là một chiến tuyến ở Arc 7 |
| Theo Đường Môn (`sect_duong_mon`) | Đường Nhất Ảnh là đồng đội ở đại hội và ở bí cảnh; giải độc đan rẻ 30% ở chợ đen; Arc 8 Đường Môn đứng về Shen nếu Nhất Ảnh hảo cảm ≥ 60 |
| Tiêu sư Long Môn (`sect_long_mon`) | Vào Kim Lăng bằng xe tiêu dù bị truy nã; phòng ở miễn phí ở chi nhánh; Arc 7 Long Môn vận lương cho tiền tuyến |
| Không theo ai (`sect_none`) | Mở Class ẩn Lãng Tử Vô Môn; không phe nào coi là kẻ thù, nhưng Arc 8 phải tự gom đủ chứng cứ |
| Tiêu Hạo bị giam / bỏ trốn | Huyết Ảnh cướp ngục; hắn đeo mặt nạ sắt ở đại hội (Arc 3), là Song Sát ở Arc 7 |
| Ép Tiêu Hạo khai rồi thả | Biết trước tổng đàn ở Giang Nam; Arc 4 hắn có thể giúp Shen thoát thân; Arc 7 có thể quay về phe Shen |
| Giết Tiêu Hạo | Huyết Ảnh treo thưởng Shen; mỗi 4 ngày có 50% bị ám sát ban đêm cho tới hết Arc 7 |
| Cứu Phượng Nhi / Long Môn nộp tiền chuộc | AO-012 (vào thành khi bị truy nã) có hoặc không; Phượng Nhi là người đưa tin ở Arc 3 và Arc 7 |
| Sổ sách thủy trại (giao Lão Hồ / Đường Môn / giữ) | Lão Hồ: lần ra người đeo nhẫn sớm 2 ngày. Đường Môn: Nhất Ảnh nợ Shen. Giữ: +1 chứng cứ ở Arc 8 |
| Hắc Giao bỏ trốn | Trùm phụ ở bến cảng Kim Lăng (Arc 3) |
| Kết Arc 3 (nổi danh / ẩn mình / truy nã) | Cách vào Huyết Ảnh Lâu và Lộ diện khởi đầu ở Arc 4; Tạ Vân Phi đứng về phía nào ở Arc 8 |
| Liên Nhi (giết / tha / tha và hỏi chuyện cũ) | AO-027 ở Arc 7; nhân chứng sống sót thứ hai ở Arc 8 |
| Lá thư Minh chủ (Arc 5) | Đồng minh ở Arc 7; chứng cứ ở Arc 8; mở kết Kiêu Hùng hoặc Ma Tôn |
| Truyền thừa Kiếm Trủng (Arc 6) | Có hoặc không binh khí Vô Song và Class ẩn bậc 4 |
| Mảnh Thiên Mạch Chân Giải 1/2/3 | Nhánh nội công 75% / 90% / 100%; đủ 3 mảnh thì mở kỳ ngộ Arc 8 |

---

## 2. Bản đồ mở rộng

| Địa điểm mới | Loại | Mở từ | Khu tự do | Đặc trưng |
| --- | --- | --- | --- | --- |
| Kim Lăng | Kinh thành | Arc 3 | Phủ Minh chủ, lôi đài Đại Hội, chợ Đông, bến cảng, tiệm cầm đồ Phúc Ký, quán trà ông lão, chi nhánh Long Môn, Tàng thư lâu | Cẩm Y Ti tuần đêm: bị truy nã thì ra đường buổi tối có 30% bị chặn hỏi |
| Ngoại ô Kim Lăng | Thôn làng | Arc 3 | Ruộng dâu, chùa Thiện Giác, lò gạch | Chỗ ẩn thân khi bị truy nã; luyện quái Rank C |
| Vân Thủy Thành (Giang Nam) | Thị trấn | Arc 4 | Kỹ viện Ngân Nguyệt, thương hội, Tây Hồ, Thiên Mạc Loát (ổ Huyết Ảnh), chợ đêm | Thanh Lộ diện |
| Lương Châu | Biên ải | Arc 5 | Chợ ngựa, doanh trại biên phòng, lữ quán thương đoàn | Mua nước và lạc đà |
| Nguyệt Nha Tuyền | Ốc đảo | Arc 5 | Hồ trăng khuyết, lều du mục | Kỳ ngộ thần mã |
| Thánh Hỏa Sơn | Tổng đàn Thiên Ma Giáo | Arc 5 | Thánh Hỏa đài, Hữu điện, ngục Ma Lao, thung lũng Huyết Lang | Vào sau Tam Quan |
| Bắc Cảnh (Tuyết Lĩnh Trấn) | Thị trấn biên giới | Arc 6 | Quán rượu thợ săn, lò rèn băng, doanh trại các phái | Lạnh: mỗi đêm ngủ ngoài trời −10% HP nếu không có áo lông |
| Kiếm Trủng | Bí cảnh | Arc 6 | 3 tầng Vấn Kiếm, nghĩa địa kiếm, hồ băng | Không có cửa hàng; chỉ dùng đồ mang theo |
| Tam chiến tuyến (Nga Mi, Võ Đang, Lạc Hà) | Chiến trường | Arc 7 | Doanh trại, tiền tuyến, quân y | Bản đồ chiến tuyến (mục 4) |
| Thiên Sơn | Núi tuyết | Arc 9 | Chân núi, Băng Cốc, Vấn Tâm đài, Thiên Cơ Các | Leo núi theo chặng; không quay lại xuống núi được sau khi qua Băng Cốc |

| Tuyến đường mới | Đi bộ | Ghi chú |
| --- | --- | --- |
| Lạc Hà → Kim Lăng | 6 ngày | Đã có, giờ mở khóa |
| Kim Lăng ↔ Ngoại ô | 0.5 ngày | |
| Kim Lăng → Vân Thủy Thành | 4 ngày | |
| Phong Lâm → Vân Thủy Thành | 3 ngày | Lối tắt phía nam, nhiều cướp |
| Kim Lăng → Lương Châu | 12 ngày | Đường quan, mỗi ngày 20% gặp sự kiện |
| Lương Châu → Nguyệt Nha Tuyền → Thánh Hỏa Sơn | 3 + 3 ngày | Sa mạc |
| Kim Lăng → Tuyết Lĩnh Trấn | 10 ngày | Đường núi phía bắc |
| Tuyết Lĩnh Trấn → Kiếm Trủng | 1 ngày | Chỉ mở trong 7 ngày bí cảnh |
| Kim Lăng → các chiến tuyến | 3–5 ngày | Mở ở Arc 7 |
| Kim Lăng → Thiên Sơn (chân núi) | 14 ngày | Mở ở Arc 9 |

Ví dụ: Kim Lăng → Thánh Hỏa Sơn đi bộ 12 + 3 + 3 = 18 ngày. Cưỡi Thanh Tông Mã (×0.5): đường quan 6 ngày, sa mạc 6 × 0.5 × 1.5 = 4.5 ngày (ngựa dưới phẩm Bảo bị chậm ×1.5), tổng 10.5 ngày.

---

## 3. Cơ chế mới

### 3.1 Đột phá cảnh giới

| Đột phá | Level trần | Điều kiện | Xảy ra ở | Phần thưởng (chọn 1 trong 3) |
| --- | --- | --- | --- | --- |
| D → C (Nhất Lưu) | 19 → 20 | Một chỉ số hiệu dụng ≥ 50 và Mạch Ẩn tầng 2 | Arc 3, quanh vòng 8 đại hội | +5 điểm · vũ khí Tinh/Bảo đúng Võ Đạo · bí kíp phụ |
| C → B (Tuyệt Đỉnh) | 29 → 30 | Vượt Sinh Tử Quan: trận không bỏ chạy, không thuốc; thua thì nghỉ 3 ngày rồi thử lại | Arc 4, Huyết Ảnh Thí Luyện | +5 điểm · đặc tính phụ thứ 3 (6 lựa chọn) · giáp Bảo |
| B → A (Tông Sư) | 44 → 45 | Lĩnh ngộ "Ý" sau trận trùm Arc 5 + một kỹ năng đạt Đại Thành | Arc 5, Thánh Hỏa đài | +10 điểm · chấm "Ý" (+10% sát thương) · mảnh Chân Giải nếu chưa có |
| A → S (Đại Tông Sư) | 59 → 60 | Phóng khí ra ngoài thân + Võ Đạo bậc 3. Shen Tuyệt Mạch phóng Khí Huyết qua Mạch Ẩn tầng 4 | Arc 6, tầng 3 Vấn Kiếm | +10 điểm · binh khí Huyền đúng Võ Đạo · Mạch Ẩn tầng 4 thêm biến thể |
| S → SS (Thiên Nhân) | 74 → 75 | Thắng một đối thủ SS hoặc phá tâm ma | Arc 8, trước Đại Hội Võ Lâm | +10 điểm · Võ Đạo bậc 4 · danh hiệu "Thiên Nhân" (danh vọng mọi phe +100) |
| SS → SSS (Võ Thần) | 89 → 90 | Võ Đạo bậc 4 + Võ Đạo Tâm (Vấn Tâm đài) | Arc 9 | Kết thúc game theo con đường đã chọn |

### 3.2 Võ Đạo bậc 2 (Rank C) — mỗi nhánh chọn 1 trong 2 chuyên môn

| Nhánh | Chuyên môn A | Chuyên môn B |
| --- | --- | --- |
| Kiếm – Ngoại | Khoái Kiếm Sư: chiêu nhiều đòn +1 đòn, chí mạng +5% · "Lưu Tinh Thất Kiếm" ×0.5×7 | Trọng Kiếm Sư: chiêu 1 đòn ×1.2, xuyên giáp +10% · "Thái Sơn Áp Đỉnh" ×3.0 |
| Kiếm – Nội | Ngự Kiếm Sư: kiếm khí luôn coi như tầm Dài · "Phi Kiếm Truy Hồn" ×1.4×2 | Hàn Phong Kiếm Sư: đòn trúng 20% đóng băng 1 lượt · "Băng Phong Kiếm Vực" ×1.3, 3 địch |
| Đao – Ngoại | Cuồng Đao Sư: HP < 50% thì +25% sát thương · "Cuồng Long Trảm" ×2.6 | Song Đao Sư: đánh thường 2 đòn ×0.8 · "Loạn Vũ Đao" ×0.7×5 |
| Đao – Nội | Liệt Hỏa Đao Sư: bỏng 5% → 8%/lượt · "Hỏa Long Đao Cương" ×1.5, 3 địch | Huyết Đao Sư: hút 15% sát thương thành HP · "Huyết Nguyệt Đao" ×2.2 |
| Côn – Ngoại | Bá Côn Sư: choáng 15% → 30% · "Thiên Quân Phá Thạch" ×2.4 | Du Long Côn Sư: né +8%, phản đòn ×0.6 khi né · "Du Long Phệ Thủy" ×0.9×4 |
| Côn – Nội | Kim Cương Côn Sư: giáp ×1.2 · "Kim Cương Hộ Pháp" giảm 60% sát thương 2 lượt | Phục Ma Côn Sư: +30% sát thương lên địch bậc Tà trở xuống · "Phục Ma Kim Côn" ×2.3 |
| Thương – Ngoại | Bạo Vũ Thương Sư: chiêu nhiều đòn +1 đòn · "Bạo Vũ Phi Hoa" ×0.5×6 | Thiết Kỵ Thương Sư: kỵ chiến +20% → +35% · "Thiết Kỵ Xung Phong" ×2.5, đánh trước |
| Thương – Nội | Xuyên Vân Thương Sư: xuyên giáp thêm 15% · "Xuyên Vân Phá Nhật" ×2.2, 3 địch thẳng hàng | Long Ngâm Thương Sư: choáng 30% → 45% · "Long Ngâm Cửu Thiên" ×1.6, choáng mọi địch |
| Quyền – Ngoại | Cang Quyền Sư: Khí Thế tối đa 5 → 8 · "Phá Thiên Quyền" ×2.8 | Bạo Quyền Sư: Liên Kích 2 → 3 đòn · "Bách Bộ Thần Quyền" ×0.6×6 |
| Quyền – Nội | Miên Chưởng Sư: mỗi chiêu giảm 20% công địch 2 lượt · "Miên Lý Tàng Châm" ×1.9 | Liệt Dương Chưởng Sư: bỏng 50% → 80% · "Liệt Dương Phần Thiên" ×2.4 |

### 3.3 Võ Đạo bậc 3 (Rank A, cuối Arc 5) và bậc 4 (Rank SS, Arc 8)

| Nhánh | Bậc 3 · nội tại · chiêu | Bậc 4 · nội tại · chiêu tối thượng |
| --- | --- | --- |
| Kiếm – Ngoại | Kiếm Tông: chí mạng ×1.75 → ×2.0 · "Vạn Kiếm Quy Tông" ×0.45×10 | Kiếm Thánh: mỗi lượt đầu trận chắc chắn chí mạng · "Nhất Kiếm Định Càn Khôn" ×6.0, hồi 6 lượt |
| Kiếm – Nội | Kiếm Khí Tông: kiếm khí xuyên giáp 30% → 45% · "Kiếm Khí Trường Hà" ×2.0, mọi địch | Tâm Kiếm Thánh: không cần cầm kiếm vẫn dùng chiêu kiếm khí · "Tâm Kiếm Vô Hình" ×5.0, không thể né |
| Đao – Ngoại | Đao Bá: Phá Giáp 20% → 35% · "Bá Đao Đoạn Nhạc" ×3.4 | Đao Hoàng: mỗi địch hạ được +1 lượt hành động · "Đao Hoàng Lâm Thế" ×2.5, 3 địch |
| Đao – Nội | Đao Cương Tông: đao cương đánh xa từ lượt 1 · "Cương Phong Liệt Địa" ×2.2, mọi địch | Đao Cương Vương: bỏng không thể giải · "Thiên Hỏa Đao Cương" ×4.5 + bỏng 5 lượt |
| Côn – Ngoại | Côn Tông: Quét Ngang trúng mọi địch · "Phong Lôi Côn" ×1.8, mọi địch | Côn Thánh: miễn choáng; choáng gây ra kéo dài 2 lượt · "Định Hải Thần Côn" ×4.0, choáng 100% |
| Côn – Nội | Thiền Côn Tông: mỗi lượt hồi 4% HP · "La Hán Trận" giảm 50% sát thương 3 lượt + phản ×1.0 | La Hán Côn Thánh: miễn tâm ma và giảm công · "Như Lai Côn Ấn" ×4.2, hồi 20% HP |
| Thương – Ngoại | Thương Tông: Tiên Phát áp dụng mọi lượt · "Bách Điểu Triều Phượng" ×0.6×8 | Thương Vương: kỵ chiến ×1.5 · "Bá Vương Cử Đỉnh" ×5.0, đánh trước mọi địch |
| Thương – Nội | Thương Ý Tông: mọi chiêu xuyên 2 địch · "Ý Thương Xuyên Sơn" ×2.6 | Bá Vương Thương Thánh: xuyên giáp tuyệt đối 60% · "Long Hồn Cửu Chuyển" ×1.0×9 |
| Quyền – Ngoại | Quyền Tông: Khí Thế không mất khi bị choáng · "Hàng Long Quyền Ảnh" ×3.2 | Quyền Thánh: Khí Thế tối đa 12 · "Thiên Băng Địa Liệt" dồn Khí Thế, mỗi tầng +25% |
| Quyền – Nội | Chưởng Tông: chưởng lực đánh xa · "Bài Sơn Đảo Hải" ×2.3, mọi địch | Chưởng Thánh: nội công lực ×1.3 · "Vạn Chưởng Quy Nguyên" ×5.5 |

Mỗi bậc +3 vào hai chỉ số ưu tiên mỗi 5 Level (ghi riêng với 5 điểm cơ bản).

### 3.4 Class ẩn theo arc

| Class ẩn | Nhánh gốc · bậc | Mở ở | Điều kiện |
| --- | --- | --- | --- |
| Huyết Chiến Đao Quỷ | Đao ngoại · 2 | Arc 3–4 | Thắng 3 trận bằng đao khi HP < 20% |
| Phục Ma La Hán | Côn nội · 2 | Arc 3 | Phương trượng Huệ Trì truyền ở chùa Thiện Giác + đạo đức ≥ +100 |
| Thiết Kỵ Tướng Quân | Thương ngoại · 2 | Arc 3–7 | Thắng 5 trận trên lưng ngựa phẩm Tinh+ |
| Ảnh Sát Thủ | Ám khí · 2 | Arc 4 | 10 vụ ám sát không bị phát hiện |
| Long Hồn Thương | Thương nội · 3 | Arc 4–5 | Có Long Đảm Thương + INT ≥ 60 |
| Thái Cực Chưởng Tông | Quyền nội · 3 | Arc 5–6 | Chân nhân Thanh Hư truyền (cứu đệ tử Võ Đang ở Ma Lao) + WIS ≥ 100 |
| Phong Ba Côn Vương | Côn ngoại · 3 | Arc 7 | Một mình hạ 10 địch trong một trận chiến tuyến |
| Bá Vương Đao Hồn | Đao nội · 3 | Arc 7 | Có Bá Vương Đao + WIS ≥ 80 |
| Vô Danh Kiếm Thần | Kiếm ngoại · 4 | Arc 6–8 | Truyền thừa Kiếm Trủng + võ công riêng tầng 5 |
| Vạn Độc Thánh Thể | Y độc · 3 | Arc 4–7 | Đặc tính Độc Thể + hấp thụ 30 loại độc |
| Lãng Tử Vô Môn | Ngoài cây · 1 | Arc 3 | Không gia nhập môn phái đến Lv 15 + học lỏm 3 chiêu |

### 3.5 Mạch Ẩn tầng 2–5

| Tầng | Mở khi | Điều kiện | Lựa chọn |
| --- | --- | --- | --- |
| 2 | Rank C (Arc 3) | Lv 19 + "Ngộ Đạo": thắng 3 trận đại hội, mỗi trận dùng võ công riêng ≥ 2 lần | Nâng chiêu cũ ×1.3 / thêm chiêu thứ 2 cùng xu hướng / thêm nội tại (+10% Khí Huyết) |
| 3 | Rank B (Arc 4) | Vượt Sinh Tử Quan | Biến thể theo xu hướng Minh/Ám tích lũy ở Arc 4 |
| 4 | Rank S (Arc 6) | Phóng khí ra ngoài thân ở tầng 3 Vấn Kiếm | Chiêu đánh xa đầu tiên của Shen; chọn hình thái: khí kiếm, khí quyền, hay hộ thể |
| 5 | Rank SS (Arc 8) | Phá tâm ma | Chiêu tối thượng mang tên do người chơi đặt; hệ số theo toàn bộ lịch sử xu hướng |

### 3.6 Cơ chế theo arc

- **Lôi đài theo lịch (Arc 3):** 5 vòng vào A+5, A+7, A+9, A+10, A+11. Đơn đấu, không dùng thuốc, bỏ chạy là nhận thua. Bỏ lỡ vòng là bị loại, nhưng mạch điều tra vẫn tiếp tục.
- **Thanh Lộ diện (Arc 4):** 0–100. Hành động đáng ngờ +5 đến +25; nghỉ ở chỗ an toàn −5. Mốc 50: bị theo dõi, thêm trận phục kích. Mốc 100: bị lộ, chuyển nhánh "Tháo chạy khỏi Vân Thủy Thành". Ảnh Tử giảm mọi mức tăng 40%.
- **Nước trong sa mạc (Arc 5):** mỗi ngày 1 túi nước (20 đồng, mang tối đa 6; lạc đà thêm 6). Hết nước: mỗi ngày −15% HP tối đa và −10% mọi chỉ số đến khi uống lại. Thiết Cốt giảm còn −10% HP.
- **Bí cảnh có giới hạn (Arc 6):** mở ngày A+3, khép lại cuối ngày A+9 (7 ngày), không cửa hàng, không ngủ trọ. Mỗi tầng có "Kiếm Ý" 0–100: dùng chiêu kiếm/vũ khí đúng Võ Đạo +5, dùng thuốc −10. Đủ 100 thì mở cửa tầng sau mà không cần đánh người gác. Phe khác cùng tranh truyền thừa; có thể liên thủ hoặc phá đám.
- **Bản đồ chiến tuyến (Arc 7):** 3 chiến tuyến (Nga Mi, Võ Đang, Lạc Hà), mỗi tuyến có Sĩ khí 0–100, giảm 8/ngày khi Shen vắng mặt. Mỗi trận Shen thắng ở tuyến nào +15 Sĩ khí tuyến đó. Sĩ khí về 0 là tuyến thất thủ: mất đồng minh, NPC có thể chết vĩnh viễn. Di chuyển giữa các tuyến tốn 1–2 ngày (ngựa rút ngắn).
- **Hồ sơ chứng cứ (Arc 8):** mỗi chứng cứ và nhân chứng gom từ Arc 1–7 có điểm (vật chứng 3, nhân chứng sống 2, lời khai 1). Ở Đại Hội Võ Lâm, mỗi môn phái cần một ngưỡng điểm khác nhau để đứng về Shen (Thiếu Lâm 6, Võ Đang 5, Nga Mi 4, Cái Bang 3, Đường Môn 4 hoặc nợ ân tình).
- **Leo Thiên Sơn (Arc 9):** 5 chặng, mỗi chặng tốn 2 ngày và một thử thách (thời tiết, cơ quan, tâm ma). Không xuống núi được sau Băng Cốc; phải chuẩn bị đủ thuốc trước khi lên.
- **Truy nã:** bị Võ Lâm Minh hoặc Cẩm Y Ti truy nã thì cửa hàng chính phái tăng giá 50%, ra phố buổi tối 30% gặp lính tuần, danh vọng chính phái không tăng. Gỡ bằng chứng cứ Arc 4 hoặc bảo lãnh của Chân nhân Thanh Hư.

---

## 4. Arc 3 · Võ Lâm Đại Hội Thiếu Niên

Shen lên Kim Lăng dự Đại Hội Thiếu Niên để tìm kẻ đeo nhẫn đồng giọt máu, và phát hiện chiếc khuôn đồng dùng để làm giả dấu Thiên Ma Chưởng nằm ngay trong phủ Minh chủ. Arc kết thúc ở chung kết với Tạ Vân Phi, khi Shen phải chọn nổi danh hay ẩn mình.

**Mở đầu:** Lạc Hà → Kim Lăng 6 ngày đi bộ. Theo Long Môn thì đi cùng xe tiêu (thêm 2 trận cướp có thưởng). Theo Cái Bang thì Lão Hồ đi trước, hẹn ở miếu Thành Hoàng.

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A | Cổng thành Kim Lăng | Cẩm Y Ti lục soát; nếu giữ thư mật Huyết Ảnh hoặc sổ sách thì phải giấu | Giấu (Thân Pháp 16) / hối lộ 3 bạc / đi cửa xe tiêu (Long Môn) |
| A | Phủ Minh chủ, bàn ghi danh | Lần đầu gặp Tạ Thiên Hành. Ông khen Shen "đánh không giống ai", hỏi tên thật | Xưng Thẩm Phong / xưng tên giả "Vô Danh" |
| A+1–A+4 | Tự do | Điều tra nhẫn đồng: tiệm cầm đồ Phúc Ký nhận cầm một chiếc nhẫn y hệt; theo dấu ra quản gia phủ Minh chủ là Triệu Phúc | 3 manh mối, cần 2 để mở cảnh đột nhập |
| A+5 | Vòng loại | Đệ tử danh môn (D, Lv 20) | Thắng để vào vòng 16 |
| A+7 | Vòng 16 | "Mặt Nạ Sắt" (C, Lv 25): Tiêu Hạo nếu còn sống, nếu không là sát thủ Huyết Ảnh | Lột mặt nạ giữa lôi đài (Huyết Ảnh chú ý) / giữ bí mật |
| A+8 đêm | Phủ Minh chủ | Đột nhập kho sau, tìm thấy khuôn đồng in dấu bàn tay và chữ "Thẩm gia trang" trong sổ kho | 3 kiểm tra Thân Pháp/Tâm Cảnh; thua 2 lần thì đánh thị vệ và bỏ chạy |
| A+9 | Vòng 8 | Huệ Năng, đệ tử Thiếu Lâm (C, Lv 26) | Sau trận, Chân nhân Thanh Hư tìm gặp Shen |
| A+10 | Bán kết | Tô Vân Yên (C, Lv 26) nếu hảo cảm ≥ 30; nếu không, Đường Nhất Ảnh hoặc một kiếm khách Hoa Sơn | Đánh hết sức / để đối thủ nhường (Tô Vân Yên hảo cảm ≥ 50) |
| A+11 | Chung kết | Tạ Vân Phi (C, Lv 28) | Thắng / cố ý thua / trước trận vạch mặt khuôn đồng |

| Kết | Diễn biến | Hậu quả |
| --- | --- | --- |
| Nổi danh | Tạ Thiên Hành mời Shen làm đệ tử ký danh; Shen nhận Lưu Vân Kiếm | Danh vọng toàn giang hồ +200; Huyết Ảnh đặt Shen vào danh sách ám sát; vào Giang Nam với tư cách "khách của Minh chủ" |
| Ẩn mình | Tạ Vân Phi thắng nhưng biết mình được nhường, chặn Shen lại hỏi lý do | Không ai chú ý Shen; Tạ Vân Phi có thể đứng về phía Shen ở Arc 8; Lộ diện khởi đầu Arc 4 = 0 |
| Vạch mặt quá sớm | Tạ Thiên Hành tuyên bố khuôn đồng là vật chứng thu từ Ma Giáo, ra lệnh bắt Shen vì đánh cắp | Truy nã toàn Trung Nguyên; thoát qua xe tiêu Long Môn (AO-012) hoặc cống Cái Bang; mất khuôn đồng; Lộ diện khởi đầu Arc 4 = 30 |

**Hạn chót:** chưa đột nhập kho trước đêm A+11 thì khuôn đồng bị nấu chảy; chỉ còn sổ kho chép tay (chứng cứ yếu hơn).

**Kỳ ngộ · Ván cờ với ông lão bán trà:** uống trà ở quán ông lão ≥ 3 lần, rồi d20 + INT/5 ≥ 15. Thắng nhận Vô Tướng Bộ (né +8% 2 lượt, 20 thể lực, hồi 4 lượt); thua được thử lại hôm sau. Ông lão là Thiên Cơ Lão Nhân, người chơi chưa được biết.

---

## 5. Arc 4 · Huyết Ảnh Lâu

Shen trà trộn vào Huyết Ảnh Lâu ở Vân Thủy Thành làm sát thủ tập sự, để lấy danh sách ám sát mười năm trước. Danh sách có ấn phủ Minh chủ, và cho thấy Ma Giáo chỉ là kẻ gánh tội thay.

**Vào Lâu:** nổi danh → Huyết Ảnh tự tìm tới; ẩn mình → tự thi tuyển, không bị nghi; truy nã → bán mình cho Lâu để được che chở (Lộ diện 30). Biết trước tổng đàn (ép Tiêu Hạo khai) thì đi thẳng tới người liên lạc.

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A | Thiên Mạc Loát | Bài thi đầu: giết một "kẻ phản bội" bị trói, hắn nói mình chỉ là phu khuân vác | Giết (đạo đức −20) / giả giết, lén thả (Thân Pháp 18; thất bại Lộ diện +25) / từ chối |
| A+1–A+14 | Tự do + 5 hợp đồng | Mỗi hợp đồng một mục tiêu cụ thể (thương nhân buôn người, quan tham, lương y vô tội…) | Làm thật / làm giả / phá hợp đồng |
| A+3 | Chợ đêm | Gặp Liên Nhi, sát thủ trẻ được giao giám sát Shen | Hảo cảm Liên Nhi mở cảnh riêng |
| A+8 | Huyết Ảnh Thí Luyện | Sinh Tử Quan với Huyết Ảnh Thất Sát (B, Lv 33) | Thắng: đột phá Rank B + Mạch Ẩn tầng 3 |
| A+12 | Tàng Án Các | Cần chìa khóa từ phòng Phó lâu chủ | Lấy trộm (Thân Pháp 20) / nhờ Liên Nhi (hảo cảm ≥ 40) / đánh thẳng (Thiết Diện, B Lv 36) |
| A+14 | Danh sách | "Thẩm gia trang. Người thuê: phủ Minh chủ. Người đổ tội: Thiên Ma Giáo." | Lộ diện +40 |
| A+15 | Quỷ Ảnh | Phó lâu chủ (B, Lv 40) bắt Liên Nhi làm con tin | Trận trùm; kết thúc bằng lựa chọn về Liên Nhi |
| A+18 | Đêm Huyết Nguyệt | Lâu chủ Huyết Y (S) về Lâu, Shen phải thoát | Trận chạy trốn 3 lượt; người cứu: Liên Nhi / Tiêu Hạo / Nhất Ảnh / Cái Bang |

**Liên Nhi:** giết → đạo đức −30, mất một người cứu. Tha → nội gián, AO-027 ở Arc 7. Tha và hỏi chuyện cũ (hảo cảm ≥ 60) → cô là đứa bé được cứu khỏi đám cháy Thẩm gia trang, nhân chứng sống thứ hai.

**Hạn chót:** chưa lấy được danh sách trước A+18 thì chỉ mang theo lời khai của Liên Nhi; Dạ Vô Thương ban đầu không tin Shen (hảo cảm bắt đầu −20).

**Kỳ ngộ · Đáy Tây Hồ đêm rằm:** d20 + VIT/5 ≥ 18 → Long Đảm Thương (Bảo, Rank B), mở điều kiện Long Hồn Thương. Không dùng thương thì đổi ở lò rèn Âu Trì lấy vũ khí Bảo đúng Võ Đạo.

---

## 6. Arc 5 · Ma Giáo Tây Vực

Shen vượt sa mạc tới Thánh Hỏa Sơn đưa chứng cứ cho Giáo chủ Dạ Vô Thương, và phát hiện Hữu hộ pháp Cừu Thiên Liệt cấu kết với Minh chủ để đảo chính vào lễ Thánh Hỏa.

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A | Lương Châu | Tin đồn Ma Giáo sắp đánh Trung Nguyên. Mua nước, lạc đà, thuê dẫn đường | Thuê dẫn đường (−1 ngày sa mạc, 15 bạc) / đi một mình |
| A+1–A+3 | Sa mạc | Bão cát, mã tặc, bọ cạp cát; sự kiện 25% mỗi ngày | Linh Giác báo trước bão cát |
| A+3 | Nguyệt Nha Tuyền | Du mục kể về con ngựa máu đỏ uống nước lúc nửa đêm | Kỳ ngộ thần mã |
| A+6 | Cổng Thánh Hỏa Sơn | Tam Quan: sức (3 vệ sĩ liên tiếp), trí (câu đối, Ngộ Tính 18), tâm (đại điện đầy đầu lâu, Tâm Cảnh 18) | |
| A+7 | Chính điện | Dạ Vô Thương nghe chuyện, không tin, giam Shen vào Ma Lao | Trình danh sách (hảo cảm +30) / giữ lại để mặc cả |
| A+8 | Ma Lao | Người của Hữu hộ pháp vào ngục giết Shen; Dạ Linh nhìn thấy | 2 vệ sĩ Ma Giáo (B, Lv 44); Dạ Linh thành nhân chứng |
| A+9–A+15 | Tự do trong tổng đàn | Tìm thư tay Minh chủ ở Hữu điện; gây dựng phe; luyện ở thung lũng Huyết Lang | 3 manh mối cho lễ Thánh Hỏa |
| A+16 | Lễ Thánh Hỏa | Cừu Thiên Liệt đảo chính, đổ cho Shen ám sát Giáo chủ | Trùm (A, Lv 50); đủ 3 manh mối: phe trung thành giúp, trùm mất 20% HP |
| Sau trận | Thánh Hỏa đài | Lĩnh ngộ "Ý": đột phá Rank A | Lựa chọn lớn |

| Lá thư của Minh chủ | Hậu quả |
| --- | --- |
| Giao cho Dạ Vô Thương, kết minh | Danh vọng Ma Giáo +300, chính phái −100; Ma Giáo là đồng minh ở Arc 7; hảo cảm ≥ 60 nhận mảnh Chân Giải 3/3 |
| Giữ làm chứng cứ | AO-041; Ma Giáo trung lập; Minh chủ cử sát thủ mạnh nhất truy sát |
| Chép hai bản (Kiêu Hùng) | Cần Ngộ Tính ≥ 40 và Kiêu Hùng ≥ 2; cả hai phe nghi Shen; mở kết Kiêu Hùng Vô Danh |
| Đốt thư | Đạo đức −50; chiến tranh đến sớm 10 ngày; mở đường tới kết Ma Tôn |

**Hạn chót:** chưa tới tổng đàn trước A+16 thì đảo chính thành công; nhánh "Cứu Giáo chủ trong sa mạc" với trùm khó hơn, không có phe trung thành.

**Kỳ ngộ · Thần mã ở Nguyệt Nha Tuyền:** ngủ lại 2 đêm; d20 + STR/5 ≥ 20, thử 3 lần → Hãn Huyết Bảo Mã (Thần, ×0.25, không chậm trong sa mạc, bỏ chạy luôn thành công trên đường). Thất bại thì đêm rằm tháng sau ngựa mới quay lại.

---

## 7. Arc 6 · Bí Cảnh Kiếm Trủng

Sáu mươi năm một lần, Kiếm Trủng ở Bắc Cảnh mở cửa. Các phái lớn, Huyết Ảnh Lâu và cả Tạ Vân Phi đều tới tranh truyền thừa của Kiếm Thần Vô Danh. Shen vào bí cảnh để đột phá Rank S, và lần đầu nghe thấy cái tên Thiên Cơ Lão Nhân. Bộ hài cốt sau thác Bạch Long ở Arc 1 là đệ tử phản sư của Kiếm Thần.

**Mở đầu:** Kim Lăng → Tuyết Lĩnh Trấn 10 ngày. Thiếu áo lông thì mỗi đêm ngủ ngoài trời −10% HP. Ở trấn có doanh trại của các phái; Shen chọn vào cùng ai: một mình, Thiếu Lâm (Huệ Năng), Võ Đang (Thanh Hư), Đường Nhất Ảnh, hoặc Tạ Vân Phi (nếu ẩn mình ở Arc 3).

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A–A+2 | Tuyết Lĩnh Trấn | Chuẩn bị: thuốc, áo lông, kết minh. Kẻ lạ trong quán rượu bán bản đồ bí cảnh | Mua bản đồ (20 bạc, giảm 1 ngày tầng 1) / tự dò |
| A+3 | Cửa bí cảnh | Băng tan, cổng đá mở. Mọi phe cùng ùa vào | Đi trước (đối đầu Huyết Ảnh Ngũ Lão ngay cửa) / đi sau (an toàn, mất 1 ngày) |
| A+3–A+4 | Tầng 1 · Kiếm Lâm | Rừng kiếm cắm ngược, kiếm khôi đá thức dậy khi có người tới gần | Đánh hoặc đạt Kiếm Ý 100 để đi qua |
| A+4 | Nghĩa địa kiếm | Huyết Ảnh Ngũ Lão phục kích phe đồng minh của Shen | Cứu đồng minh (+hảo cảm, mất nửa ngày) / bỏ mặc, đi tiếp |
| A+5 | Tầng 2 · Vấn Kiếm | Bia đá hỏi ba câu về võ đạo; trả lời theo lịch sử hành động của Shen | Không có đáp án đúng; câu trả lời mở biến thể Mạch Ẩn tầng 4 |
| A+5 | Hồ băng | Kỳ ngộ Kiếm Ý Thạch | |
| A+6 | Tầng 3 · Vô Danh Điện | Tạ Vân Phi chặn trước cửa điện, nếu Shen nổi danh ở Arc 3 | Đấu (S, Lv 60) / thuyết phục (nếu đã cho hắn biết sự thật về cha) |
| A+7 | Kiếm Hồn Vô Danh | Linh hồn kiếm của Kiếm Thần thử thách người kế thừa | Trận trùm (S, Lv 64). Giữa trận Shen phải phóng khí ra ngoài thân: đột phá Rank S |
| Sau trận | Truyền thừa | Kiếm Thần để lại binh khí Vô Song và một câu: "Kẻ dạy Tạ Thiên Hành ma công cũng từng là đệ tử của ta." | Lựa chọn lớn |

| Truyền thừa | Hậu quả |
| --- | --- |
| Nhận truyền thừa | Vô Danh Binh (Vô Song, mang hình dạng vũ khí của Võ Đạo hiện tại); mở Class ẩn Vô Danh Kiếm Thần nếu dùng kiếm; các phe khác ghen ghét, danh vọng −30 với mỗi phái đã vào bí cảnh |
| Nhường cho đồng minh | Đồng minh đó (Huệ Năng / Thanh Hư / Nhất Ảnh / Tạ Vân Phi) mạnh vượt bậc ở Arc 7–8; danh vọng phe đó +200, đạo đức +20; Shen nhận Kiếm Tâm (nội tại: chí mạng +8%) |
| Phá hủy truyền thừa | Không ai có được; đạo đức không đổi; Huyết Ảnh Lâu mất mục tiêu lớn nhất, Arc 7 Huyết Ảnh yếu đi (trùm −15% HP) |

**Hạn chót:** bí cảnh khép lại cuối ngày A+9. Ai còn trong bí cảnh sẽ bị đẩy ra ngoài, mất truyền thừa. Nếu Shen chưa hạ Kiếm Hồn trước lúc đó, Huyết Ảnh Ngũ Lão đã lấy truyền thừa, mang về cho Lâu chủ (trùm Arc 7 mạnh hơn).

**Kỳ ngộ · Kiếm Ý Thạch:** ở hồ băng tầng 2, vượt tầng 2 mà không dùng vật phẩm nào. Phần thưởng: mọi kỹ năng của Võ Đạo hiện tại +1 mức thuần thục.

**Kẻ địch**

| Kẻ địch | Rank · Lv | Vũ khí | STR / AGI / VIT / INT / WIS / LUK | HP | Chiêu chính | Rơi đồ |
| --- | --- | --- | --- | --- | --- | --- |
| Kiếm khôi đá | A · 52 | Kiếm | 55 / 50 / 60 / 20 / 50 / 50 | 1560 × 0.5 = 780 | Thạch Kiếm ×1.6, miễn choáng | Kiếm Thạch (rèn +1 cấp) |
| Băng Nguyên Tuyết Lang | A · 56 | (thú) | 60 / 70 / 55 / 5 / 55 / 60 | 1480 × 0.5 = 740 | Hàn Nha ×1.3, 30% đóng băng | Da tuyết lang (áo lông) |
| Đệ tử Võ Đang tranh bí cảnh | A · 55 | Kiếm | 45 / 55 / 50 / 60 / 60 / 30 | 1375 × 0.7 = 962 | Thái Cực Kiếm ×1.8 nội công | — |
| Huyết Ảnh Ngũ Lão (mỗi lão) | A · 58 | Kiếm | 50 / 75 / 50 / 45 / 45 / 50 | 1390 × 0.8 = 1112 | Ngũ Ảnh Liên Hoàn ×0.6×5 | Huyền 2%, Bảo 10% |
| Tạ Vân Phi | S · 60 | Kiếm | 58 / 70 / 55 / 50 / 52 / 40 | 1500 × 1.0 = 1500 | Lưu Vân Kiếm Vực ×0.7×6 | — |
| Kiếm Hồn Vô Danh (trùm) | S · 64 | Kiếm | 65 / 75 / 60 / 55 / 60 / 30 | 1620 × 1.3 = 2106 | Vạn Kiếm Quy Tông ×0.5×10; Vô Danh Nhất Kiếm ×4.0 (hồi 5) | Vô Danh Binh (nếu nhận truyền thừa) |

**Trang bị mới:** Áo lông tuyết lang (Bảo / A: giáp +18, VIT +6, miễn lạnh); Kiếm Thạch (nguyên liệu: cường hóa không thể thất bại 1 lần); Vô Danh Binh (Vô Song / S: Công +80, chỉ số chính +20, mỗi chiêu bỏ qua 50% giáp; chỉ một trong chiến dịch).

**Nhiệm vụ nhánh**

| Việc | Nơi nhận | Loại | Mục tiêu | Phần thưởng |
| --- | --- | --- | --- | --- |
| Thợ săn mất tích | Tuyết Lĩnh · quán rượu | Giết | Hạ 4 Băng Nguyên Tuyết Lang | Áo lông tuyết lang |
| Than đá cho lò rèn băng | Tuyết Lĩnh · lò rèn | Thu thập | 5 Kiếm Thạch | Cường hóa +2 miễn phí |
| Bức thư dưới tuyết | Tuyết Lĩnh · doanh trại Võ Đang | Giao hàng | Mang thư của Thanh Hư vào tầng 1 bí cảnh cho đệ tử đi trước, trong 2 ngày | Hảo cảm Thanh Hư +20 |
| Kẻ bán bản đồ | Tuyết Lĩnh · quán rượu | Lựa chọn | Hắn bán bản đồ giả cho các phái: tố giác (danh vọng các phái +40) hay ăn chia (50 bạc, đạo đức −10) | — |
| Hài cốt người giữ kiếm | Kiếm Trủng · nghĩa địa | Thu thập | 3 thẻ bài của người giữ kiếm đời trước | Mảnh ký ức Kiếm Thần (lore Thiên Cơ) |
| Tiểu hòa thượng lạc đường | Kiếm Trủng · tầng 1 | Lựa chọn | Đưa ra ngoài (mất 1 ngày, đạo đức +15, Thiếu Lâm +60) hay để lại chỗ an toàn | — |

---

## 8. Arc 7 · Chính Tà Đại Chiến

Minh chủ Tạ Thiên Hành phát động "đại chiến diệt ma", kéo cả giang hồ đánh Thiên Ma Giáo, đồng thời dùng Huyết Ảnh Lâu đánh úp những phái còn nghi ngờ mình. Shen chạy giữa ba chiến tuyến để cứu người, giữ lấy nhân chứng và chứng cứ cho Arc 8. Đồng hành có thể chết vĩnh viễn.

**Mở đầu:** tin chiến tranh tới khi Shen về Kim Lăng sau Arc 6. Phe Shen đứng (theo lá thư ở Arc 5) quyết định ai tin cậu ban đầu.

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A | Kim Lăng · hội quân | Tạ Thiên Hành tuyên chiến; cả quảng trường hô vang. Shen được mời làm tiên phong | Nhận lời (vào trong quân, dễ lấy tin) / từ chối (bị nghi ngờ, tự do đi lại) |
| A+1–A+14 | Bản đồ chiến tuyến | 3 tuyến Nga Mi, Võ Đang, Lạc Hà; Sĩ khí giảm 8/ngày khi Shen vắng | Mỗi ngày chọn tuyến để có mặt |
| A+3 | Tuyến Lạc Hà | Huyết Ảnh Song Sát đánh úp Long Môn Tiêu Cục | Cứu Long Môn; Phượng Nhi có thể chết nếu Sĩ khí < 30 |
| A+5 | Tuyến Nga Mi | Nga Mi bị vây, Tô Vân Yên cầm quân y | Kỳ ngộ lời trăng trối của lão tướng ở quân y |
| A+7 | Cả hai cùng bị vây | Võ Đang và Cái Bang cùng bị đánh trong một đêm; Shen chỉ kịp tới một nơi | Lựa chọn lớn: cứu Võ Đang hay Cái Bang |
| A+9 | Doanh trại Minh chủ | Liên Nhi (nếu tha ở Arc 4, hảo cảm ≥ 40) lén đưa Shen kế hoạch của Lâu chủ | AO-027: biết trước trận phục kích, trùm −20% HP |
| A+11 | Thiết Kỵ Cẩm Y | Triều đình cử Thiết Kỵ tới "dẹp loạn", đánh cả hai phe | Liên thủ với Ma Giáo đánh lui / giữ trung lập |
| A+14 | Đại chiến Lạc Hà Nguyên | Tất cả phe dồn về bờ sông Lạc Hà. Lâu chủ Huyết Y xuất hiện | Trận trùm Huyết Y (S, Lv 72); đủ Sĩ khí ở 2 tuyến trở lên thì các phái cùng đánh, trùm −20% HP |
| Sau trận | Lạc Hà Nguyên | Trên xác Huyết Y là mảnh Thiên Mạch Chân Giải 2/3 và ấn tín phủ Minh chủ | +2 điểm chứng cứ |

| Lựa chọn: cứu ai đêm A+7 | Hậu quả |
| --- | --- |
| Cứu Võ Đang | Chân nhân Thanh Hư sống, đứng về Shen ở Arc 8 (Võ Đang cần 3 điểm thay vì 5); Cái Bang tổn thất nặng, Lão Hồ bị thương, nghỉ hết Arc 7 |
| Cứu Cái Bang | Lão Hồ và Cái Bang nguyên vẹn, mạng lưới tin tức giúp Arc 8 (+2 điểm chứng cứ); Võ Đang mất Tàng Kinh Các, Thanh Hư trung lập ở Arc 8 |
| Chia quân (cần đồng minh mạnh từ truyền thừa Arc 6) | Đồng minh giữ một nơi, Shen giữ nơi kia; cả hai được cứu nhưng đồng minh tử trận nếu Sĩ khí tuyến đó < 50 |

**Hạn chót:** lịch chiến tuyến cố định. Tuyến nào về 0 Sĩ khí là thất thủ ngay ngày đó; đại chiến A+14 diễn ra dù Shen đã chuẩn bị hay chưa.

**Kỳ ngộ · Lời trăng trối của lão tướng:** ở quân y tuyến Nga Mi, ở lại cứu thương binh thay vì truy kích địch khi có lựa chọn. Lão tướng biên phòng sắp chết trao Bá Vương Đao (Huyền / A) và mở điều kiện Bá Vương Đao Hồn. Không dùng đao thì đổi ở lò rèn lấy vũ khí Huyền cùng bậc.

**Kẻ địch**

| Kẻ địch | Rank · Lv | Vũ khí | STR / AGI / VIT / INT / WIS / LUK | HP | Chiêu chính | Rơi đồ |
| --- | --- | --- | --- | --- | --- | --- |
| Binh sĩ Võ Lâm Minh | S · 64 | Đao | 70 / 55 / 70 / 40 / 50 / 60 | 1820 × 0.45 = 819 | Trận đao ×0.8×2 | Huyền 1%, Đại Hoàn Đan 20% |
| Ma Giáo tử sĩ (nếu đối địch Ma Giáo) | S · 66 | Đao | 65 / 60 / 65 / 55 / 60 / 50 | 1730 × 0.5 = 865 | Huyết Tế: mất 20% HP, ×3.0 | Bảo 8% |
| Huyết Ảnh Song Sát (mỗi tên) | S · 68 | Kiếm | 60 / 90 / 60 / 55 / 50 / 50 | 1640 × 0.8 = 1312 | Song Ảnh Hợp Kích ×1.2×2 khi cả hai còn sống | Huyền 3% |
| Thiết Kỵ Cẩm Y | S · 70 | Thương | 80 / 70 / 75 / 40 / 50 / 60 | 1950 × 0.7 = 1365 | Thiết Kỵ Xung Phong ×2.5, đánh trước | Lệnh bài Cẩm Y (gỡ truy nã 1 lần) |
| Tiêu Hạo (nếu còn theo Huyết Ảnh) | S · 66 | Kiếm | 58 / 80 / 55 / 60 / 52 / 50 | 1580 × 1.0 = 1580 | Huyết Ảnh Phi Vân ×0.75×4 | Lời khai về đêm mất kiếm phổ (+1 chứng cứ) |
| Lâu chủ Huyết Y (trùm) | S · 72 | Kiếm | 70 / 100 / 70 / 55 / 60 / 30 | 1860 × 1.3 = 2418 | Huyết Nguyệt Thiên Sát ×0.6×8; Huyết Y Phân Thân (2 lượt né +30%) | Mảnh Chân Giải 2/3, Huyết Y (Huyền) |

**Trang bị mới:** Bá Vương Đao (Huyền / A: Công +60, STR +15, Phá Giáp 30%); Huyết Y (Huyền / S: giáp +22, AGI +12, né +8%); Lệnh bài Cẩm Y (vật phẩm: gỡ truy nã một lần); vũ khí Huyền đúng Võ Đạo ở lò rèn quân đội (cần 3 Kiếm Thạch + 20 vàng).

**Nhiệm vụ nhánh**

| Việc | Nơi nhận | Loại | Mục tiêu | Phần thưởng |
| --- | --- | --- | --- | --- |
| Lương thảo tiền tuyến | Tuyến Lạc Hà · Long Môn | Giao hàng | Mang 3 xe lương tới tuyến Nga Mi trong 3 ngày | Sĩ khí Nga Mi +30, Long Môn +60 |
| Quân y thiếu thuốc | Tuyến Nga Mi · quân y | Thu thập | 10 Kim sáng dược | Hảo cảm Tô Vân Yên +20, Đại Hoàn Đan ×3 |
| Gián điệp trong doanh | Doanh trại Minh chủ | Lựa chọn | Bắt được gián điệp Ma Giáo: giao cho Minh chủ (danh vọng chính phái +60) hay thả về (Ma Giáo +60, Kiêu Hùng +1) | — |
| Đội tuần Huyết Ảnh | Tuyến Võ Đang | Giết | Hạ 6 binh sĩ Võ Lâm Minh mặc giáp Huyết Ảnh | +1 chứng cứ (Huyết Ảnh trà trộn trong quân Minh) |
| Trẻ mồ côi chiến tranh | Tuyến Lạc Hà · làng cháy | Giao hàng | Đưa 4 đứa trẻ về chùa Thiện Giác ngoại ô Kim Lăng trong 5 ngày | Đạo đức +25, Thiếu Lâm +80 |
| Đầu hàng hay tử chiến | Tuyến Nga Mi | Lựa chọn | Một đội Ma Giáo bị vây xin hàng: nhận hàng (Ma Giáo +40, chính phái −20) hay để quân Minh xử (đạo đức −20) | — |

---

## 9. Arc 8 · Vạch Mặt Minh Chủ

Sau đại chiến, Tạ Thiên Hành mở Đại Hội Võ Lâm ở Kim Lăng để tôn vinh "người đã đánh lui Ma Giáo", và chọn người kế vị. Shen có mười ngày để gom đủ chứng cứ, kéo đủ môn phái về phía mình, rồi vạch mặt Minh chủ trước toàn giang hồ. Đây là nơi Sổ Ân Oán từ Arc 1 tới Arc 7 được tính sổ.

**Hồ sơ chứng cứ** (mục 3.6): vật chứng 3 điểm, nhân chứng sống 2, lời khai 1.

| Chứng cứ | Nguồn | Điểm |
| --- | --- | --- |
| Khuôn đồng (hoặc sổ kho chép tay) | Arc 3 | 3 (hoặc 1) |
| Sổ sách thủy trại (nếu giữ) | Arc 2 | 3 |
| Danh sách ám sát Huyết Ảnh | Arc 4 | 3 |
| Thư tay Minh chủ (nếu giữ hoặc chép) | Arc 5 | 3 |
| Ấn tín phủ Minh chủ trên xác Huyết Y | Arc 7 | 3 |
| Liên Nhi (nhân chứng sống) | Arc 4 | 2 |
| Lão Hồ (người cứu Shen đêm cháy) | Arc 2 | 2 |
| Tiêu Hạo (nếu còn sống và quay về) | Arc 1 / 7 | 2 |
| Dạ Linh (vụ ám sát trong Ma Lao) | Arc 5 | 1 |
| Lời khai Hắc Giao, Triệu Phúc, binh sĩ Huyết Ảnh | Arc 2–7 | 1 mỗi người |

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A | Kim Lăng | Đại hội mở thiệp mời. Minh chủ đích thân mời Shen ngồi bàn chủ khách | Nhận thiệp (ở trong phủ, dễ tiếp cận) / từ chối |
| A+1–A+9 | Tự do | Thuyết phục từng phái (mỗi phái một cảnh riêng), tìm nhân chứng, bảo vệ nhân chứng khỏi bị ám sát | Mỗi đêm 40% có ám sát nhắm vào một nhân chứng; nhân chứng chết là mất điểm |
| A+4 | Tâm ma | Tạ Thiên Hành mời Shen uống trà, kể chuyện mình bị ma công gặm nhấm kinh mạch, và rằng Thiên Mạch Chân Giải là cách chữa duy nhất | Cảnh tâm ma: thắng bóng tâm ma (Shen tự đấu với bản sao của mình) để đột phá Rank SS và Mạch Ẩn tầng 5 |
| A+6 | Tạ Vân Phi | Con trai Minh chủ biết sự thật (nếu Shen đã kể ở Arc 3/6) | Kéo về phía mình (+2 điểm) / để hắn chọn cha (thêm 1 trận ở Đại Hội) |
| A+8 | Kỳ ngộ | Thiên Mạch Chân Giải toàn bản (nếu đủ 3 mảnh) | |
| A+10 | Đại Hội Võ Lâm | Shen đứng lên giữa quần hùng, trình từng chứng cứ. Mỗi phái quyết định theo ngưỡng điểm | Số phái đứng về Shen quyết định trận cuối: mỗi phái giúp làm trùm −8% HP |
| A+10 | Tạ Thiên Hành | Minh chủ lộ ma công. Pha 1: Thiên Ma Chưởng giả; pha 2 (HP < 50%): ma công nuốt chửng, hút HP | Trận trùm (SS, Lv 86) |
| Sau trận | Quảng trường | Minh chủ quỳ giữa đống đổ nát | Lựa chọn lớn |

| Lựa chọn: xử Tạ Thiên Hành | Hậu quả |
| --- | --- |
| Giết | Đạo đức không đổi nếu ≥ 3 phái đứng về Shen, −30 nếu ít hơn; mối thù Thẩm gia được trả; Tạ Vân Phi thành kẻ thù nếu chưa kéo về phe |
| Phế võ công | Đạo đức +20; Tạ Thiên Hành sống trong ngục, trước khi chết khai ra người dạy ma công: Thiên Cơ Lão Nhân (mở Arc 9 với thông tin đầy đủ) |
| Giao triều đình | Danh vọng triều đình +200; Cẩm Y Ti thành đồng minh; nhưng Tạ Thiên Hành bị "đột tử" trong ngục, Thiên Cơ xóa dấu vết (Arc 9 bắt đầu thiếu thông tin) |

**Hạn chót:** Đại Hội diễn ra A+10 dù đủ chứng cứ hay chưa. Dưới 6 điểm thì không phái nào đứng về Shen: Shen bị coi là kẻ vu khống, trận trùm diễn ra với trùm 100% HP và các phái đứng xem.

**Kỳ ngộ · Thiên Mạch Chân Giải toàn bản:** đủ 3 mảnh. Tô Vân Yên (nếu còn sống) hoặc Lang trung Mạc ghép lại toàn bản. Khí Huyết tối đa +50%; nhánh nội công 100%; Mạch Ẩn chạy được thêm một công pháp phụ. Nếu Shen trao Chân Giải cho Tạ Thiên Hành để đổi lấy lời khai: Minh chủ được chữa, trận trùm mất pha 2, nhưng Shen mất Chân Giải vĩnh viễn.

**Kẻ địch**

| Kẻ địch | Rank · Lv | Vũ khí | STR / AGI / VIT / INT / WIS / LUK | HP | Chiêu chính | Rơi đồ |
| --- | --- | --- | --- | --- | --- | --- |
| Thiết Vệ (cận vệ Minh chủ) | SS · 76 | Đao | 85 / 70 / 85 / 50 / 60 / 55 | 2180 × 0.6 = 1308 | Thiết Vệ Trận: giảm 30% sát thương cho đồng đội | Thần 0.5%, Huyền 5% |
| Huyết Ảnh tàn quân | SS · 76 | Kiếm | 70 / 100 / 65 / 60 / 55 / 55 | 1780 × 0.6 = 1068 | Ám sát nhân chứng: nhắm mục tiêu yếu nhất | Huyền 4% |
| Trưởng lão bị mua chuộc | SS · 78 | Côn | 80 / 60 / 90 / 60 / 75 / 50 | 2290 × 0.8 = 1832 | Kim Cương Côn Trận ×2.2 nội công | Lời khai (+1) |
| Bóng tâm ma | = Shen | = Shen | Sao chép chỉ số hiệu dụng của Shen | = HP Shen | Dùng đúng bộ kỹ năng của Shen, đảo ngược xu hướng Minh/Ám | Đột phá SS |
| Tạ Vân Phi (nếu chống Shen) | SS · 80 | Kiếm | 80 / 95 / 75 / 60 / 65 / 50 | 2000 × 1.1 = 2200 | Lưu Vân Vô Tận ×0.6×9 | — |
| Tạ Thiên Hành (trùm) | SS · 86 | Quyền sáo | 80 / 85 / 85 / 90 / 90 / 25 | 2230 × 1.5 = 3345 | Pha 1: Thiên Ma Chưởng giả ×2.5 nội công; pha 2: Ma Công Phệ Nguyên hút 25% sát thương thành HP | Minh Chủ Lệnh, Thiên Ma Thủ (Thần) |

**Trang bị mới:** Thiên Ma Thủ (Thần / SS, quyền sáo: Công +90, WIS +20, mỗi đòn trúng hút 5% sát thương); Minh Chủ Lệnh (vật phẩm cốt truyện, mở kết Khai Tông Lập Phái); vũ khí Thần đúng Võ Đạo (Âu Trì rèn từ Kiếm Thạch + Huyết Y + 50 vàng).

**Nhiệm vụ nhánh**

| Việc | Nơi nhận | Loại | Mục tiêu | Phần thưởng |
| --- | --- | --- | --- | --- |
| Hộ tống nhân chứng | Kim Lăng · chi nhánh Long Môn | Giao hàng | Đưa Liên Nhi (hoặc Lão Hồ) từ ngoại ô vào thành trong 1 ngày, qua 2 trận phục kích | Nhân chứng sống tới Đại Hội |
| Quản gia Triệu Phúc | Kim Lăng · tiệm Phúc Ký | Lựa chọn | Bắt Triệu Phúc: ép khai (+1, đạo đức −10) / thuyết phục bằng gia đình hắn (+1, cần INT ≥ 70) | Lời khai |
| Ba ngọn đèn phủ Minh chủ | Kim Lăng · phủ Minh chủ | Thu thập | 3 chìa khóa từ Thiết Vệ | Lối vào mật thất (thêm 1 vật chứng) |
| Thiếu Lâm do dự | Ngoại ô · chùa Thiện Giác | Lựa chọn | Phương trượng muốn thấy Shen từ bi: tha một sát thủ vừa ám sát hụt (Thiếu Lâm ngưỡng 6 → 4) | — |
| Rượu của Lão Hồ | Kim Lăng · miếu Thành Hoàng | Thu thập | 3 vò Nữ Nhi Hồng (chợ Đông) | Lão Hồ kể toàn bộ đêm Thẩm gia trang (+1, lore) |
| Mộ Thẩm gia | Thanh Vân → Thẩm Gia Trang | Giao hàng | Mang ngọc bội Thẩm gia về đặt trên mộ cha mẹ | Đạo đức +10, đặc tính phụ "Hiếu Tâm" (WIS +5) |

---

## 10. Arc 9 · Thiên Hạ Đệ Nhất

Kẻ đứng sau tất cả là Thiên Cơ Lão Nhân, đệ tử duy nhất của Kiếm Thần Vô Danh. Ông lão bán trà ở Kim Lăng từ Arc 2–3 chính là ông ta. Lão dạy ma công cho Tạ Thiên Hành, nuôi Huyết Ảnh Lâu, đẩy giang hồ vào chiến tranh, chỉ để biến thiên hạ thành một bàn cờ thử võ đạo. Lão gửi cho Shen một quân cờ đen kèm lời mời: "Lên Thiên Sơn. Ván cờ này, ngươi là quân cuối cùng."

**Mở đầu:** Kim Lăng → Thiên Sơn 14 ngày. Thiên Cơ mở "Thiên Hạ Kỳ Cục": 12 ngày sau khi Shen tới chân núi, lão sẽ phá Thiên Sơn Băng Đê, nhấn chìm ba trấn dưới chân núi. Đồng minh còn sống có thể theo Shen tới chân núi, nhưng **Shen leo núi một mình**: họ ở lại giữ ba trấn.

| Ngày | Cảnh | Nội dung | Lựa chọn / kiểm tra |
| --- | --- | --- | --- |
| A | Chân Thiên Sơn | Ba trấn dưới chân núi chưa biết gì. Thiên Cơ để lại bàn cờ dở trên tảng đá | Sơ tán dân (mất 2 ngày, đạo đức +30) / lên núi ngay |
| A+1–A+2 | Chặng 1 · Phong Tuyết | Bão tuyết, tuyết quái | Áo lông tuyết lang miễn mất HP vì lạnh |
| A+3–A+4 | Chặng 2 · Băng Cốc | Cơ quan nhân của Thiên Cơ; qua đây là không xuống núi được nữa | Không quay đầu được |
| A+5–A+6 | Chặng 3 · Kỳ Lộ | 9 bàn cờ đá, mỗi bàn là một câu hỏi về những lựa chọn trong Sổ Ân Oán của Shen | Không đúng sai; mỗi câu trả lời tăng một trong 4 hướng kết thúc |
| A+7–A+8 | Chặng 4 · Vấn Tâm đài | Kỳ ngộ Vấn Tâm; Võ Đạo Tâm | Điều kiện đột phá SSS |
| A+9–A+10 | Chặng 5 · Thiên Cơ Các | Thiên Cơ ngồi chờ bên bàn cờ, rót trà như ở Kim Lăng | Đánh nốt ván cờ (Ngộ Tính 30: trùm −15% HP) / lật bàn cờ, rút vũ khí |
| A+10 | Thiên Cơ Lão Nhân | Trận cuối. Pha 1: kiếm của Kiếm Thần; pha 2: dùng lại chiêu mạnh nhất của từng trùm Shen đã gặp | Trận trùm (SSS, Lv 95) |
| A+11–A+12 | Băng Đê | Dù thắng, Băng Đê đã nứt. Phải giữ đê hoặc sơ tán | Quyết định cuối trước khi chọn kết |

**Bốn kết thúc**

| Kết | Điều kiện | Diễn biến |
| --- | --- | --- |
| Khai Tông Lập Phái | Đạo đức ≥ +100, danh vọng Huyền thoại với ≥ 3 phái, có Minh Chủ Lệnh | Shen lập phái riêng trên nền Thẩm gia trang; thiên hạ công nhận Võ Thần; đồ đệ đầu tiên là một đứa trẻ Tuyệt Mạch |
| Quy Ẩn | Bất kỳ, có một bạn đồng hành hảo cảm ≥ 90 | Shen trả xong nợ máu, cùng người ấy biến mất khỏi giang hồ; lời đồn về một cao thủ vô danh ở Nga Mi / Lạc Hà |
| Kiêu Hùng Vô Danh | Cờ Kiêu Hùng ≥ 3 | Shen cứu giang hồ nhưng gánh hết tội danh của Thiên Cơ, sống như một truyền thuyết không ai dám gọi tên |
| Ma Tôn | Đạo đức ≤ −200 | Shen thay Minh chủ cai trị võ lâm bằng sợ hãi; Thiên Cơ mỉm cười trước khi chết: "Ngươi là quân cờ đẹp nhất của ta." |

Sau kết thúc: chế độ giang hồ tự do với nhiệm vụ sinh ngẫu nhiên, cao thủ ẩn thế, và lôi đài Võ Thần (đấu lại mọi trùm ở phiên bản mạnh hơn).

**Hạn chót:** Thiên Hạ Kỳ Cục 12 ngày. Tới A+12 mà chưa đánh bại Thiên Cơ thì Băng Đê vỡ, ba trấn bị nhấn chìm (đạo đức −50, danh vọng mọi phe −200), nhưng trận cuối vẫn diễn ra.

**Kỳ ngộ · Vấn Tâm đài:** trả lời đúng lòng mình 3 câu hỏi; câu hỏi lấy từ chính lịch sử hành động trong Sổ Ân Oán. Phần thưởng: chọn thêm một đặc tính thứ ba từ bảng 20 (hoặc đặc tính thứ tư nếu đã có thứ ba từ đột phá B).

**Kẻ địch**

| Kẻ địch | Rank · Lv | Vũ khí | STR / AGI / VIT / INT / WIS / LUK | HP | Chiêu chính | Rơi đồ |
| --- | --- | --- | --- | --- | --- | --- |
| Thiên Sơn tuyết quái | SS · 86 | (thú) | 100 / 80 / 100 / 10 / 85 / 80 | 2530 × 0.5 = 1265 | Tuyết Lở ×1.5, mọi mục tiêu | Tuyết Tinh (hồi 30% Khí Huyết) |
| Cơ quan nhân Thiên Cơ | SS · 88 | Côn | 95 / 80 / 110 / 60 / 60 / 60 | 2740 × 0.6 = 1644 | Tự hủy khi HP < 10%: ×3.0 | Linh kiện cơ quan (rèn Thần) |
| Bóng các trùm cũ (Kỳ Lộ) | theo trùm | theo trùm | Chỉ số gốc của trùm tương ứng ×1.2 | theo trùm × 0.8 | Chiêu đặc trưng của trùm đó | — |
| Thiên Cơ Lão Nhân (trùm cuối) | SSS · 95 | Kiếm | 85 / 105 / 90 / 110 / 100 / 10 | 2375 × 1.8 = 4275 | Pha 1: Thiên Cơ Kiếm ×0.6×10; pha 2: Vạn Cục Quy Nhất, mỗi lượt dùng chiêu mạnh nhất của một trùm cũ | Thiên Cơ Kỳ Bàn (Vô Song, ngọc bội) |

**Trang bị mới:** Thiên Cơ Kỳ Bàn (Vô Song / SSS, ngọc bội: mọi chỉ số +15, mỗi trận được gieo lại xúc xắc thêm 2 lần); áo choàng Thiên Sơn (Thần / SS: giáp +34, VIT +12, miễn lạnh và đóng băng); vũ khí Thần đúng Võ Đạo rèn từ linh kiện cơ quan.

**Nhiệm vụ nhánh**

| Việc | Nơi nhận | Loại | Mục tiêu | Phần thưởng |
| --- | --- | --- | --- | --- |
| Sơ tán trấn Bạch Thủy | Chân Thiên Sơn · trấn Bạch Thủy | Giao hàng | Đưa trưởng trấn tới trấn bên trong 1 ngày | Đạo đức +15, dân ba trấn tin Shen |
| Người dẫn đường già | Chân Thiên Sơn · lều thợ săn | Lựa chọn | Lão muốn lên núi tìm con trai mất tích: cho đi cùng (chặng 1–2 dễ hơn, lão có thể chết) hay từ chối | — |
| Tuyết Tinh | Chặng 1 | Thu thập | 5 Tuyết Tinh | Áo choàng Thiên Sơn |
| Cơ quan bị khóa | Chặng 2 · Băng Cốc | Giết | Hạ 3 cơ quan nhân | Bản vẽ cơ quan (trùm cuối −10% HP) |
| Ván cờ dở | Chân Thiên Sơn · tảng đá | Lựa chọn | Đi tiếp nước cờ của Thiên Cơ (Ngộ Tính 25) hay để nguyên | Gợi ý về pha 2 của trùm cuối |
| Lời nhắn cho người ở lại | Chặng 2 · Băng Cốc | Giao hàng | Gửi thư cho đồng minh không được lên núi trước khi qua Băng Cốc | Mở cảnh hậu kết cho đồng minh đó |

---

## 11. Quyết định đã chốt

- **Hợp đồng thứ sáu (Arc 4) nhắm vào Tô Vân Yên:** có hành động "Giết cô ấy" trong game. Giết thì cô chết vĩnh viễn, Đạo đức −80, Nga Mi không bao giờ đứng về phía Shen ở Arc 8. Ba lựa chọn khác: báo cho cô trốn, dàn cảnh giả chết (cần hảo cảm ≥ 40, Ngộ Tính độ khó 20), hoặc từ chối hợp đồng.
- **Đồng hành chết vĩnh viễn**, trừ khi Shen cứu được. Ai từng được cứu (`saved_…`) thì chiến tuyến thất thủ không giết được họ nữa. Những chỗ có thể mất người: bỏ mặc đồng hành ở nghĩa địa Kiếm Trủng, chiến tuyến Arc 7 về 0 Sĩ khí, thua Quỷ Ảnh ở Tây Hồ, nhân chứng bị ám sát ở Arc 8, và các lựa chọn giết của chính Shen. Không có kỳ ngộ hồi sinh.
- **Arc 9: Shen leo Thiên Sơn một mình.**

## 12. Ghi chú cân bằng (bản chơi được)

- Trùm và đối thủ lôi đài Arc 3–9 có máu ×1.6 và công ×1.5 so với công thức gốc. Bot chơi thử thua lần đầu khoảng 40–60% ở các trùm chính.
- Mỗi lần thua trùm, Shen được hồi đầy và trùm còn ×0.85 máu ở lần sau (cộng dồn). Cảnh thua có lựa chọn rút lui luyện thêm.
- Lỡ mất một mốc đột phá (bị loại sớm ở Đại Hội, bị lộ trước Sinh Tử Quan), kết arc vẫn cấp điều kiện đột phá để không bị kẹt.
- Sĩ khí chiến tuyến giảm 6/ngày khi Shen vắng mặt.
- Thiên Cơ Lão Nhân luôn mạnh ít nhất bằng Shen + 2 Level, để EXP dồn lại ở trần cảnh giới không làm trận cuối quá dễ.
- Nhiệm vụ nhánh trong game: 6 việc mỗi arc cho Arc 3–7, 3 việc cho Arc 8 (cộng thêm các việc thu thập chứng cứ ở Kim Lăng), 3 việc cho Arc 9.
