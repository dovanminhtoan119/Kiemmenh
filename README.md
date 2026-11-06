# Kiếm Mệnh – Giang Hồ Lục

Game nhập vai kiếm hiệp chạy trên trình duyệt, dựng theo bộ luật **Universal Multiverse RPG Engine** (Mode B: Web RPG).
Nhân vật chính: **Shen (Thẩm Phong)**, tạp dịch mắc chứng Tuyệt Mạch của Thanh Vân Phái, bất ngờ thức tỉnh Hệ Thống.

Chơi tại: https://dovanminhtoan119.github.io/Kiemmenh/

## Nội dung bản này
- **Mở đầu + Arc 1 · Tạp Dịch Thanh Vân**: rửa oan trong 7 ngày, 3 manh mối, đối chất công khai hoặc phục kích, kỳ ngộ hang sau thác.
- **Arc 2 · Trấn Lạc Hà**: Lão Hồ, Long Môn Tiêu Cục, cứu Long Phượng Nhi ở Hắc Phong Trại, chuyến tiêu Phong Lâm, lôi đài, kỳ ngộ ông lão đánh cá, thủy phỉ Hắc Giao, chọn phe.

## Hệ thống
- EXP `floor(100 × L^1.5)`, 5 điểm/cấp, trần Level theo cảnh giới E–SSS (đột phá Rank D: thắng một đối thủ Rank D đơn đấu).
- 6 chỉ số, chỉ số phái sinh theo bản thiết kế; Tuyệt Mạch ×1.2 Lực/Thân Pháp/Căn Cốt, dùng Khí Huyết thay Nội Lực.
- 20 đặc tính (chọn 2 trong 6, xáo lại 1 lần), hệ số nhân nối tiếp.
- 5 vũ khí có đặc trưng riêng (Kiếm Thế, Phá Giáp, Quét Ngang, Tiên Phát, Liên Kích) + khắc chế tầm đánh.
- Võ Đạo: mỗi vũ khí 2 nhánh Ngoại công / Nội công, mỗi nhánh có Class ẩn. Nội công của Shen đạt 60% → 75% → 90% → 100% theo mảnh Thiên Mạch Chân Giải.
- Võ công riêng trên Mạch Ẩn: hình thành từ cách chơi + 5 câu phỏng vấn, Hệ Thống đề xuất 3 hướng.
- Xúc xắc: né / chí mạng / trạng thái / rơi đồ gieo d100, biến thiên sát thương d20, kiểm tra ngoài trận d20 + chỉ số/5. Bộ sinh số có hạt giống lưu trong save.
- Rơi đồ theo phẩm (Phàm → Thần), ngựa rút ngắn đường đi theo phẩm, kỳ ngộ mỗi arc + tiểu kỳ ngộ hằng ngày.
- Thời gian 4 buổi/ngày, khu tự do, cửa hàng, lò rèn cường hóa, đạo đức 7 bậc, danh vọng theo phe, hảo cảm NPC, Sổ Ân Oán.
- Tự lưu, 3 ô lưu, xuất/nhập file có mã kiểm tra.

## Cấu trúc
- `js/data.js` — chỉ số, cảnh giới, đặc tính, vũ khí, vật phẩm, ngựa, kẻ địch, cửa hàng.
- `js/skills.js` — kỹ năng, 10 nhánh Võ Đạo, Class ẩn, võ công Mạch Ẩn, câu hỏi phỏng vấn.
- `js/engine.js` — xúc xắc, chỉ số, EXP/cảnh giới, trang bị, cửa hàng, rơi đồ, thời gian, đi đường, lưu.
- `js/combat.js` — chiến đấu theo lượt.
- `js/story_a1.js`, `js/story_a2.js` — cốt truyện; `js/hub.js` — khu tự do và sự kiện.
- `js/art.js` — phông cảnh và chân dung SVG; `js/ui.js`, `css/style.css` — giao diện (Times New Roman).
- `tests/engine.test.js` — unit test công thức + bot chơi thử tự động qua 2 arc: `node tests/engine.test.js 60`.

Sau khi sửa `app.part.html`, chạy `sh build.sh` để tạo lại `index.html`.
