/* =====================================================================
   KIẾM MỆNH · DIỄN BIẾN SAU LỰA CHỌN
   Mỗi lựa chọn có một đoạn kể ngắn: Shen làm gì, NPC phản ứng ra sao,
   kết quả thế nào. Người chơi đọc xong mới bấm "Tiếp tục" sang cảnh mới.
   r = diễn biến; rOk / rFail = khi kiểm tra xúc xắc thành công / thất bại.
   ===================================================================== */
(function (G) {
  const KM = G.KM;
  const B = {
    p_rain: [
      { r: ["Shen co người lại, hai tay ôm lấy đầu. Gậy tre quất xuống lưng, xuống vai, đều đặn như người ta đập lúa. Cậu cắn chặt răng, không kêu một tiếng.",
        "> Thằng câm này lì thật. — Lý Tam cười khẩy, vung gậy lên cao hơn.",
        "Đòn cuối cùng giáng thẳng vào thái dương."] },
      { r: ["Shen chống tay bật dậy, dồn hết sức vào một cú đấm. Nắm tay trúng ngay sống mũi Lý Tam, máu mũi phun ra.",
        "Lý Tam loạng choạng lùi hai bước, ôm mặt rú lên: \"Mày dám…!\"",
        "Hắn giật cây gậy tre từ tay đồng bọn, vụt thẳng vào đầu Shen. Một tiếng \"bốp\" khô khốc. Shen đổ gục xuống vũng nước, máu từ trán loang ra, hơi thở yếu dần."] },
      { r: ["Shen lăn qua chân hai tên đệ tử, bò dậy lao về phía bóng tối sau kho củi.",
        "> Giữ nó lại! — Tiêu Hạo quát.",
        "Chưa chạy được mười bước, một cây gậy ném theo trúng ngay khoeo chân. Shen ngã sấp, cằm đập xuống bậc đá. Lý Tam đuổi kịp, giơ gậy giáng thẳng xuống gáy cậu."] },
    ],
    a1_morning: [
      { r: ["> Cảm ơn Tô cô nương. Nếu không có cô, đêm qua tôi đã…",
        "Tô Vân Yên khựng tay giã thuốc, rồi mỉm cười, lần đầu tiên kể từ khi cậu tỉnh dậy.",
        "> Đừng cảm ơn vội. Tiền thuốc sau này phải trả. Ba lạng sâm, hai lạng hoàng kỳ, ta ghi cả đấy.",
        "Tiểu Lục đứng ngoài cửa gãi đầu, không biết nên cười hay nên lo."] },
      { r: ["> Cô là đệ tử Nga Mi, sao lại cứu một tạp dịch như tôi?",
        "Tô Vân Yên nhún vai, không ngẩng đầu lên.",
        "> Sư phụ ta dạy: thầy thuốc chỉ thấy người bệnh, không thấy áo mặc. Với lại… người bị đánh nặng thế mà vẫn còn thở, ta tò mò.",
        "Cô liếc nhìn cậu thật nhanh, như đang xem một vị thuốc lạ."] },
      { r: ["Shen chống tay ngồi dậy. Ba xương sườn rạn kêu lên răng rắc, mồ hôi lạnh túa ra trên trán.",
        "> Nằm xuống! — Tô Vân Yên đặt chày xuống, giọng sắc lại. — Muốn chết thì cứ đi, nhưng đừng chết trong dược phòng của ta.",
        "Shen vẫn bước xuống phản. Cô nhìn theo, lắc đầu, ném cho cậu một cuộn băng: \"Thay băng mỗi tối. Ngốc.\""] },
    ],
    a1_waterfall: [
      { rOk: ["Shen nhắm mắt, gạt hết tiếng nước ra khỏi đầu. Tiếng ngân hiện ra rõ dần, ở bên trái, thấp hơn mặt nước một chút.",
        "Cậu bám vào vách đá trơn, lần từng bước vào sau màn nước. Nước lạnh như dao cứa vào da… rồi tay cậu chạm vào một khoảng trống."],
        rFail: ["Shen nhắm mắt lắng nghe, nhưng tiếng nước át hết mọi thứ. Cậu đánh liều bám vách đá lần sang bên trái…"] },
      {},
    ],
    x_hidden_kimthan: [
      { r: ["Shen siết chặt nắm tay. Da thịt rắn lại như đồng hun, một luồng nóng chạy từ sống lưng ra khắp người.", "Từ nay, thân thể này chính là binh khí của cậu."] },
      { r: ["Shen lắc đầu, buông lỏng nắm tay. Cảm giác lạ lùng kia tan dần. Con đường Quyền Thủ đã đủ dài để đi."] },
    ],
    x_hidden_kiemma: [
      { r: ["Shen nắm chặt chuôi kiếm. Máu trong người sôi lên, chảy ngược về phía lưỡi kiếm như bị hút vào.", "Lưỡi kiếm khẽ ngân một tiếng, như đáp lời."] },
      { r: ["Shen tra kiếm vào vỏ. Tiếng ngân tắt dần. Có những con đường, một khi đã bước vào thì không quay lại được."] },
    ],
    a1_confront: [
      { r: ["> Ta sẽ đưa lên Chưởng môn. Trước mặt toàn phái, hắn không chối được.",
        "Tiểu Lục nuốt nước bọt, rồi gật đầu thật mạnh: \"Nếu cần, tao sẽ đứng ra làm chứng.\"",
        "Sáng hôm sau, Shen quỳ trước cửa chính điện xin được trình chứng cứ. Một canh giờ sau, chuông triệu tập vang lên khắp núi."] },
      { r: ["> Không. Đưa lên Chưởng môn thì hắn sẽ có thời gian đốt sạch chứng cứ. Đêm nay ta tự bắt hắn.",
        "Tiểu Lục tái mặt: \"Mày điên rồi! Hắn là đệ tử nội môn đấy!\"",
        "Shen không trả lời. Cậu lấy cuộn dây thừng trong kho củi quấn quanh hông, ngồi chờ trời tối."] },
      { r: ["> Chưa được. Chừng này chưa đủ để hắn hết đường chối.", "Tiểu Lục thở phào, rồi lại lo lắng nhìn ra cửa: \"Nhanh lên đấy. Không còn nhiều ngày đâu.\""] },
    ],
    a1_trial: [
      { r: ["Shen đứng dậy giữa chính điện, lần lượt lấy từng thứ trong ngực áo ra đặt lên khay gỗ.", "Tiêu Hạo nhìn khay chứng cứ, nụ cười trên môi cứng lại."] },
      { r: ["Shen mở miệng, rồi im lặng. Cậu không có gì để trình.", "Từ hàng đệ tử nội môn, Tiêu Hạo khẽ mỉm cười."] },
    ],
    a1_ambush: [
      { rOk: ["Shen nín thở, trườn từng tấc qua lớp lá mục. Tiêu Hạo vẫn không hay biết, mải lần tay trong hốc cây.", "Năm bước. Ba bước. Một bước."],
        rFail: ["Shen nhích lên được ba bước thì gót chân giẫm phải một cành khô.", "Tiếng \"rắc\" vang lên giữa đêm im lặng. Tiêu Hạo quay phắt lại."] },
    ],
    a1_ambush_win: [
      { r: ["> Con cờ cũng phải trả giá. — Shen nói khẽ.", "Tiêu Hạo mở to mắt định hét lên, nhưng tiếng hét tắt nghẹn trong cổ họng.", "Cánh rừng im bặt. Chỉ còn tiếng cú kêu xa xa."] },
      { r: ["Shen trói chặt hai tay Tiêu Hạo ra sau lưng, nhét giẻ vào miệng hắn.", "Hắn giãy giụa, mắt long lên căm hận, nhưng không thoát được.", "Gần sáng, Shen vác hắn tới trước thư phòng Chưởng môn, đặt thư mật và chứng cứ bên cạnh, rồi gõ cửa ba tiếng."] },
      { r: ["Shen bóp lấy cổ họng Tiêu Hạo, siết nhẹ.", "> Ai đứng sau? Nói thật, ta tha mạng.", "Tiêu Hạo run bần bật, nói như tháo cống."] },
    ],
    a1_end: [{ r: ["Hai người đi chung một đoạn đường dốc. Đến ngã ba chân núi, Tô Vân Yên rẽ về hướng tây, vẫy tay một cái rồi không ngoái lại.", "Shen đi về hướng đông, nơi có trấn Lạc Hà."] }],

    /* ---------- Arc 2 ---------- */
    a2_arrive: [
      { r: ["Shen đặt hai mươi đồng lên bàn, gọi một vò rượu nếp. Lão Hồ nhìn vò rượu, rồi nhìn cậu, cười khà khà.", "> Biết điều đấy. Ngồi đi, thằng nhóc."] },
      { r: ["> Ông là Lão Hồ? Ông biết gì về Thẩm gia trang?", "Cả gian khách điếm bỗng im đi một nhịp. Lão Hồ nheo mắt, ra hiệu cho cậu nói nhỏ lại.", "> Hỏi to thế, muốn cả trấn biết à? Ngồi xuống."] },
      { r: ["Shen đặt phong thư ố vàng lên bàn. Lão Hồ nhìn nét chữ trên phong bì rất lâu, ngón tay gõ nhịp lên mặt bàn.", "> Chữ của ta. Mười năm rồi… Ngồi xuống."] },
    ],
    a2_tieu_win: [{ r: ["Mã Đại dẫn Shen đi một vòng quanh tiêu cục, chỉ chuồng ngựa, kho hàng, chỗ ngủ.", "> Ở đây không ai hỏi ngươi từ đâu tới. Chỉ hỏi hàng có tới nơi không."] }],
    a2_kidnap: [
      { r: ["> Tôi đi.", "Long Chấn Uy nhìn Shen rất lâu, rồi đặt vào tay cậu một tấm lệnh bài khắc chữ Long.", "> Cầm cái này, tiêu cục nào trên đường cũng sẽ giúp ngươi. Phượng Nhi… trông cậy cả vào ngươi."] },
      { r: ["> Tôi đi. Nhưng cần tiền thuốc men trước.", "Mã Đại trợn mắt định chửi, nhưng Long Chấn Uy giơ tay ngăn lại, ném cho Shen một túi bạc.", "> Mười bạc. Mang được con gái ta về, ngươi muốn bao nhiêu nữa cũng được."] },
    ],
    a2_hac_phong: [
      { r: ["Shen bước thẳng ra giữa con đường dẫn lên trại, đứng dưới ánh đuốc, không giấu mình.", "Hai tên lâu la gác cổng đánh rơi vò rượu."] },
      { rOk: ["Shen men theo chân vách đá phía sau trại. Đá lởm chởm, cậu bám từng mỏm, leo lên trong bóng tối.", "Trên đầu, tiếng bọn lâu la đánh bạc vẫn ồn ào, không ai nhìn xuống."],
        rFail: ["Leo được nửa vách thì một mỏm đá vỡ vụn dưới tay. Đá lăn ầm ầm xuống dốc.", "Shen buộc phải nhảy xuống, chạy vòng ra cổng trước. Bọn lâu la đã bị đánh thức."] },
    ],
    a2_hp_win: [{ r: ["Long Phượng Nhi nhặt thanh đao của tên đầu mục, vác lên vai đi trước.", "> Đi thôi. Ta mà về muộn, cha ta đốt cả ngọn núi này mất."] }],
    a2_hp_reward: [{ r: ["Shen nhận dây cương. Con ngựa hồng hí vang, cọ mõm vào vai cậu.", "Long Phượng Nhi đứng ở cửa chuồng ngựa: \"Nó tên Hỏa Vân. Đối xử tử tế với nó đấy.\""] }],
    a2_fisher: [
      { r: ["> Dừng tay! — Shen bước ra, đứng chắn trước ông lão. — Thuyền của người ta, các ngươi lấy làm gì?", "Hai tên thủy phỉ nhìn nhau, rồi phá lên cười, rút vũ khí."] },
      { r: ["Shen bước ra, nhưng vẫn kịp liếc nhìn túi tiền bên hông ông lão.", "> Đi đi, mấy thằng nhãi. Ông già này có người lo rồi.", "Bọn thủy phỉ rút vũ khí."] },
      { r: ["Shen quay lưng đi. Sau lưng, thúng cá đổ ụp xuống bến, rồi tiếng cười của bọn thủy phỉ.", "Ông lão không kêu một tiếng nào."] },
    ],
    a2_fisher_win: [
      { r: ["> Lão trượng, xin ông chỉ dạy.", "Ông lão ngẩng lên, nhìn Shen như nhìn một con cá vừa tự nhảy lên thuyền.", "> Không đòi công, còn đòi học. Ha. Đợi trời tối."] },
      { r: ["Ông lão móc túi đưa cho Shen một nắm bạc lẻ, cảm ơn rối rít rồi chèo thuyền đi.", "Nhìn theo bóng thuyền, Shen có cảm giác mình vừa bỏ lỡ điều gì đó."] },
    ],
    a2_fisher_teach: [
      { r: ["Ông lão dạy Shen suốt đêm bên bến sông. Đến khi gà gáy, cây sào tre trong tay cậu đã vẽ được trọn một vòng bát quái.", "> Được rồi. Từ nay ta không nợ ngươi, ngươi cũng không nợ ta."] },
      { r: ["Ông lão lôi từ khoang thuyền ra một cây côn đen bóng, ném cho Shen.", "> Gỗ ô mộc ngâm nước sông ba mươi năm. Đừng làm gãy."] },
    ],
    a2_scout: [
      { r: ["> Ta muốn hỏi Hắc Giao về Huyết Ảnh Lâu. Hợp tác nhé?", "Đường Nhất Ảnh nhướng mày, rồi chìa tay ra.", "> Ngươi lấy người, ta lấy sổ. Khi nào ngươi tấn công, ta sẽ ở đó."] },
      { r: ["> Việc của ngươi, ta không quản. Ta tự làm.", "Đường Nhất Ảnh nhún vai, cười như vừa nghe một câu đùa.", "> Tùy ngươi. Đừng chết sớm quá.", "Hắn biến vào bóng lau sậy, không một tiếng động."] },
    ],
    a2_lair_win: [
      { r: ["Shen ném cuốn sổ cho Đường Nhất Ảnh. Hắn bắt lấy, lật vài trang, nụ cười trên mặt biến mất trong chớp mắt rồi quay trở lại.", "> Ơn này Đường Môn nhớ."] },
      { r: ["Sáng hôm sau, Shen đặt cuốn sổ lên bàn rượu của Lão Hồ. Lão lật từng trang, mặt tối sầm lại.", "> Thằng nhóc, ngươi vừa mang về thứ có thể giết cả chục người đấy. Để ta cất."] },
      { r: ["Shen nhét cuốn sổ vào ngực áo, không nói với ai. Có những thứ phải tự mình hiểu trước đã."] },
    ],
    a2_choice: [
      { r: ["> Lão Hồ, cho tôi theo ông.", "Lão Hồ ngừng uống, nhìn Shen một lúc rồi bẻ đôi cây gậy trúc nhỏ giắt bên hông, đưa cho cậu một nửa.", "> Từ nay ngươi là đệ tử Cái Bang. Không có nhà, nhưng ở đâu cũng có anh em."] },
      { r: ["Shen gật đầu với Đường Nhất Ảnh đang ngồi ở bàn bên. Hắn nâng chén rượu lên, cười.", "> Đường Môn không nhận người ngoài. Nhưng ta có thể nhận một người bạn. Đi Kim Lăng, ta lo đường."] },
      { r: ["> Long tiêu chủ, tôi muốn ở lại Long Môn.", "Long Chấn Uy cười vang, đập bàn một cái làm chén bát nhảy lên.", "> Tốt! Từ hôm nay ngươi là tiêu sư chính thức, ăn lương gấp đôi!", "Phượng Nhi ngồi góc bàn, khẽ quay mặt đi giấu nụ cười."] },
      { r: ["> Tôi không theo ai cả.", "Cả bàn im lặng. Lão Hồ cười khẩy, nhưng ánh mắt lại có vẻ hài lòng.", "> Giống cha ngươi. Lão ấy cũng chưa bao giờ chịu cúi đầu trước ai."] },
    ],
  };
  for (const id in B) {
    const sc = KM.SCENES[id]; if (!sc || !sc.choices) continue;
    B[id].forEach((b, i) => { if (sc.choices[i]) Object.assign(sc.choices[i], b); });
  }
  // Câu mở đầu cảnh Hệ Thống khớp với cả ba cách Shen gục ngã
  if (KM.SCENES.p_system) KM.SCENES.p_system.text[0] = "Thế giới tối sầm lại. Tiếng mưa, tiếng cười, tiếng gậy xa dần như vọng lên từ đáy giếng.";
})(typeof window !== "undefined" ? window : globalThis);
