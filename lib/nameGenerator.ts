// 智能中文名字生成器 - 本地算法优化版
// 无需 API，根据用户特征智能匹配名字

export interface ChineseName {
  characters: string;
  pinyin: string;
  meaning: string;
  source: string;
  personalityMatch: string;
}

export interface FormData {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
  desiredMeaning: string;
}

// ==================== 扩展的音译名字库 ====================
const phoneticNameDatabase: Record<string, ChineseName[]> = {
  // A 开头
  "alex": [
    { characters: "艾力", pinyin: "Ài Lì", meaning: "Ivy strength · 艾草之力", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your energetic and determined nature" },
    { characters: "艾乐", pinyin: "Ài Lè", meaning: "Ivy happiness · 艾草之乐", source: "Phonetic variation · 音译变体", personalityMatch: "Reflects your joyful and optimistic spirit" },
  ],
  "anna": [
    { characters: "安娜", pinyin: "Ān Nà", meaning: "Peaceful graceful · 安宁优雅", source: "Phonetic match · 音译谐音", personalityMatch: "Captures your gentle and elegant demeanor" },
    { characters: "安雅", pinyin: "Ān Yǎ", meaning: "Peaceful elegance · 安雅文静", source: "Chinese style adaptation · 中式改编", personalityMatch: "Embodies your calm and refined character" },
  ],
  "andrew": [
    { characters: "安德鲁", pinyin: "Ān Dé Lǔ", meaning: "Peaceful virtue · 安德鲁", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your strong and reliable presence" },
  ],
  "anthony": [
    { characters: "安东尼", pinyin: "Ān Dōng Ní", meaning: "Peaceful east · 安东尼", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your warm and approachable nature" },
  ],
  "amelia": [
    { characters: "艾美丽", pinyin: "Ài Měi Lì", meaning: "Ivy beautiful · 艾美丽", source: "Phonetic with meaning · 谐音寓意", personalityMatch: "Captures your charming and graceful beauty" },
  ],
  "aaron": [
    { characters: "阿伦", pinyin: "Ā Lún", meaning: "Vast ethics · 阿伦", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your thoughtful and principled nature" },
  ],
  
  // B 开头
  "ben": [
    { characters: "本", pinyin: "Běn", meaning: "Root, origin · 根本", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your grounded and authentic character" },
    { characters: "彬", pinyin: "Bīn", meaning: "Refined, cultured · 彬彬有礼", source: "Chinese style · 中式风格", personalityMatch: "Embodies your refined and courteous manner" },
  ],
  "benjamin": [
    { characters: "本杰明", pinyin: "Běn Jié Míng", meaning: "Root of wisdom · 本杰明", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your wise and thoughtful nature" },
  ],
  "bill": [
    { characters: "比尔", pinyin: "Bǐ Ěr", meaning: "Compare you · 比尔", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your distinctive and memorable character" },
    { characters: "必尔", pinyin: "Bì Ěr", meaning: "Certain elegance · 必尔", source: "Phonetic variation · 音译变体", personalityMatch: "Embodies your confident and decisive nature" },
  ],
  "bob": [
    { characters: "鲍勃", pinyin: "Bào Bó", meaning: "Abundant and vigorous · 鲍勃", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your lively and energetic spirit" },
  ],
  "brian": [
    { characters: "布莱恩", pinyin: "Bù Lái Ān", meaning: "Not coming peace · 布莱恩", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your unique and intriguing presence" },
  ],
  "betty": [
    { characters: "贝蒂", pinyin: "Bèi Dì", meaning: "Shell, treasure · 贝蒂", source: "Phonetic match · 音译谐音", personalityMatch: "Captures your precious and cherished nature" },
  ],
  
  // C 开头
  "chris": [
    { characters: "克里斯", pinyin: "Kè Lǐ Sī", meaning: "Overcome reason thought · 克里斯", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your analytical and thoughtful mind" },
    { characters: "凯", pinyin: "Kǎi", meaning: "Victory, triumph · 凯旋", source: "Simplified phonetic · 简化音译", personalityMatch: "Embodies your winning and successful spirit" },
  ],
  "christian": [
    { characters: "克里斯蒂安", pinyin: "Kè Lǐ Sī Dì Ān", meaning: "Christ follower · 克里斯蒂安", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your faithful and devoted nature" },
  ],
  "charles": [
    { characters: "查尔斯", pinyin: "Chá Ěr Sī", meaning: "Prosperous you thought · 查尔斯", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your distinguished and noble character" },
  ],
  "charlie": [
    { characters: "查理", pinyin: "Chá Lǐ", meaning: "Prosperous reason · 查理", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your cheerful and friendly nature" },
  ],
  "catherine": [
    { characters: "凯瑟琳", pinyin: "Kǎi Sè Lín", meaning: "Victory jade forest · 凯瑟琳", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your elegant and refined beauty" },
  ],
  "chloe": [
    { characters: "克洛伊", pinyin: "Kè Luò Yī", meaning: "Overcome network depend · 克洛伊", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your blooming and vibrant spirit" },
  ],
  
  // D 开头
  "david": [
    { characters: "大卫", pinyin: "Dà Wèi", meaning: "Great protection · 大卫", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your strong and protective nature" },
    { characters: "大维", pinyin: "Dà Wéi", meaning: "Great preservation · 大维", source: "Phonetic variation · 音译变体", personalityMatch: "Reflects your steadfast and reliable character" },
  ],
  "daniel": [
    { characters: "丹尼尔", pinyin: "Dān Ní Ěr", meaning: "Red mud you · 丹尼尔", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your wise and discerning nature" },
  ],
  "diana": [
    { characters: "戴安娜", pinyin: "Dài Ān Nà", meaning: "Wear peace elegant · 戴安娜", source: "Standard phonetic · 标准音译", personalityMatch: "Captures your divine and graceful beauty" },
  ],
  "derek": [
    { characters: "德里克", pinyin: "Dé Lǐ Kè", meaning: "Virtue reason overcome · 德里克", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your strong and capable leadership" },
  ],
  "doris": [
    { characters: "多丽丝", pinyin: "Duō Lì Sī", meaning: "Much beautiful thought · 多丽丝", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your generous and kind spirit" },
  ],
  
  // E 开头
  "emma": [
    { characters: "艾玛", pinyin: "Ài Mǎ", meaning: "Ivy agate · 艾玛瑙", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your elegant and precious nature" },
    { characters: "爱玛", pinyin: "Ài Mǎ", meaning: "Love agate · 爱玛瑙", source: "Phonetic with love · 谐音爱意", personalityMatch: "Embodies your loving and warm character" },
  ],
  "emily": [
    { characters: "艾米丽", pinyin: "Ài Mǐ Lì", meaning: "Ivy rice beautiful · 艾米丽", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your industrious and beautiful spirit" },
    { characters: "艾美丽", pinyin: "Ài Měi Lì", meaning: "Ivy beautiful · 艾美丽", source: "Phonetic variation · 音译变体", personalityMatch: "Captures your charming and lovely nature" },
  ],
  "eric": [
    { characters: "埃里克", pinyin: "Āi Lǐ Kè", meaning: "Dust reason overcome · 埃里克", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your eternal and powerful presence" },
  ],
  "eva": [
    { characters: "伊娃", pinyin: "Yī Wá", meaning: "That baby · 伊娃", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your life-giving and nurturing spirit" },
  ],
  "elizabeth": [
    { characters: "伊丽莎白", pinyin: "Yī Lì Shā Bái", meaning: "That beautiful sand white · 伊丽莎白", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your noble and majestic presence" },
  ],
  
  // F 开头
  "frank": [
    { characters: "弗兰克", pinyin: "Fú Lán Kè", meaning: "Bless orchid overcome · 弗兰克", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your honest and straightforward nature" },
  ],
  "fred": [
    { characters: "弗雷德", pinyin: "Fú Léi Dé", meaning: "Bless thunder virtue · 弗雷德", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your peaceful and wise leadership" },
  ],
  "fiona": [
    { characters: "菲奥娜", pinyin: "Fēi Ào Nà", meaning: "Fragrant elegant · 菲奥娜", source: "Standard phonetic · 标准音译", personalityMatch: "Captures your fair and beautiful spirit" },
  ],
  
  // G 开头
  "grace": [
    { characters: "格蕾丝", pinyin: "Gé Lěi Sī", meaning: "Pattern bud silk · 格蕾丝", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your graceful and elegant nature" },
    { characters: "格瑞丝", pinyin: "Gé Ruì Sī", meaning: "Pattern auspicious silk · 格瑞丝", source: "Phonetic variation · 音译变体", personalityMatch: "Embodies your blessed and graceful character" },
  ],
  "george": [
    { characters: "乔治", pinyin: "Qiáo Zhì", meaning: "Tall govern · 乔治", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your strong and capable leadership" },
  ],
  "gina": [
    { characters: "吉娜", pinyin: "Jí Nà", meaning: "Lucky elegant · 吉娜", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your fortunate and charming nature" },
  ],
  "gary": [
    { characters: "加里", pinyin: "Jiā Lǐ", meaning: "Excellent reason · 加里", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your strong and spear-like determination" },
  ],
  
  // H 开头
  "henry": [
    { characters: "亨利", pinyin: "Hēng Lì", meaning: "Prosperous benefit · 亨利", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your prosperous and successful nature" },
  ],
  "harry": [
    { characters: "哈里", pinyin: "Hā Lǐ", meaning: "Laugh reason · 哈里", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your cheerful and home-loving spirit" },
  ],
  "helen": [
    { characters: "海伦", pinyin: "Hǎi Lún", meaning: "Sea ethics · 海伦", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your bright and shining beauty" },
  ],
  "hannah": [
    { characters: "汉娜", pinyin: "Hàn Nà", meaning: "Chinese elegant · 汉娜", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your graceful and favored nature" },
  ],
  
  // I 开头
  "ian": [
    { characters: "伊恩", pinyin: "Yī Ēn", meaning: "That grace · 伊恩", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your gracious and God-given nature" },
  ],
  "irene": [
    { characters: "艾琳", pinyin: "Ài Lín", meaning: "Ivy jade · 艾琳", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your peaceful and serene beauty" },
  ],
  "isaac": [
    { characters: "艾萨克", pinyin: "Ài Sà Kè", meaning: "Ivy萨克", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your joyful and laughter-bringing spirit" },
  ],
  "isabella": [
    { characters: "伊莎贝拉", pinyin: "Yī Shā Bèi Lā", meaning: "That sand shell pull · 伊莎贝拉", source: "Standard phonetic · 标准音译", personalityMatch: "Captures your devoted and beautiful nature" },
  ],
  
  // J 开头
  "jack": [
    { characters: "杰克", pinyin: "Jié Kè", meaning: "Outstanding overcome · 杰克", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your strong and supplanting nature" },
    { characters: "杰克", pinyin: "Jié Kè", meaning: "Hero victory · 杰克", source: "Chinese style · 中式风格", personalityMatch: "Embodies your heroic and victorious spirit" },
  ],
  "james": [
    { characters: "詹姆斯", pinyin: "Zhān Mǔ Sī", meaning: "James", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your supplanter and determined nature" },
  ],
  "john": [
    { characters: "约翰", pinyin: "Yuē Hàn", meaning: "Promise writing · 约翰", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your God-gracious and kind nature" },
    { characters: "强", pinyin: "Qiáng", meaning: "Strong, powerful · 强大", source: "Meaning match · 意译", personalityMatch: "Embodies your strong and solid character" },
  ],
  "jason": [
    { characters: "杰森", pinyin: "Jié Sēn", meaning: "Outstanding forest · 杰森", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your healing and peaceful nature" },
  ],
  "jennifer": [
    { characters: "珍妮弗", pinyin: "Zhēn Nī Fú", meaning: "Precious girl blessing · 珍妮弗", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your fair and white wave spirit" },
  ],
  "jessica": [
    { characters: "杰西卡", pinyin: "Jié Xī Kǎ", meaning: "Outstanding west card · 杰西卡", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your wealthy and foresighted nature" },
  ],
  "julia": [
    { characters: "朱莉娅", pinyin: "Zhū Lì Yà", meaning: "Vermilion beautiful · 朱莉娅", source: "Standard phonetic · 标准音译", personalityMatch: "Captures your youthful and downy beauty" },
  ],
  "judy": [
    { characters: "朱迪", pinyin: "Zhū Dí", meaning: "Vermilion enlighten · 朱迪", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your praised and Jewish woman spirit" },
  ],
  
  // K 开头
  "kevin": [
    { characters: "凯文", pinyin: "Kǎi Wén", meaning: "Victory literature · 凯文", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your gentle and handsome birth nature" },
  ],
  "kate": [
    { characters: "凯特", pinyin: "Kǎi Tè", meaning: "Victory special · 凯特", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your pure and clear beauty" },
  ],
  "kelly": [
    { characters: "凯莉", pinyin: "Kǎi Lì", meaning: "Victory beautiful · 凯莉", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your warrior and bright-headed spirit" },
  ],
  "ken": [
    { characters: "肯", pinyin: "Kěn", meaning: "Willing, agree · 肯定", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your born of fire and clear water nature" },
  ],
  
  // L 开头
  "leo": [
    { characters: "李奥", pinyin: "Lǐ Ào", meaning: "Plum nobility · 李奥", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your lion-like strength and nobility" },
    { characters: "立欧", pinyin: "Lì Ōu", meaning: "Stand Europe · 立欧", source: "Phonetic variation · 音译变体", personalityMatch: "Embodies your standing tall and proud nature" },
    { characters: "雷欧", pinyin: "Léi Ōu", meaning: "Thunder Europe · 雷欧", source: "Phonetic with power · 谐音力量", personalityMatch: "Reflects your powerful and commanding presence" },
  ],
  "lily": [
    { characters: "莉莉", pinyin: "Lì Lì", meaning: "Jasmine beautiful · 莉莉", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your pure and innocent lily-like beauty" },
    { characters: "丽莉", pinyin: "Lì Lì", meaning: "Beautiful jasmine · 丽莉", source: "Phonetic variation · 音译变体", personalityMatch: "Embodies your beautiful and graceful nature" },
  ],
  "lucas": [
    { characters: "卢卡斯", pinyin: "Lú Kǎ Sī", meaning: "Hut victory thought · 卢卡斯", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your bright and illuminating spirit" },
  ],
  "lisa": [
    { characters: "丽莎", pinyin: "Lì Shā", meaning: "Beautiful sand · 丽莎", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your God-is-my-oath devotion" },
  ],
  "linda": [
    { characters: "琳达", pinyin: "Lín Dá", meaning: "Jade arrive · 琳达", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your beautiful and soft nature" },
  ],
  "laura": [
    { characters: "劳拉", pinyin: "Láo Lā", meaning: "Labor pull · 劳拉", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your laurel-wreathed victory spirit" },
  ],
  
  // M 开头
  "michael": [
    { characters: "迈克尔", pinyin: "Mài Kè Ěr", meaning: "Wheat overcome you · 迈克尔", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your who-is-like-God strength" },
    { characters: "麦克", pinyin: "Mài Kè", meaning: "Wheat overcome · 麦克", source: "Simplified phonetic · 简化音译", personalityMatch: "Embodies your strong and victorious nature" },
  ],
  "mike": [
    { characters: "迈克", pinyin: "Mài Kè", meaning: "Wheat overcome · 迈克", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your strong and capable nature" },
  ],
  "mary": [
    { characters: "玛丽", pinyin: "Mǎ Lì", meaning: "Horse beautiful · 玛丽", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your wished-for child beauty" },
    { characters: "玛莉", pinyin: "Mǎ Lì", meaning: "Horse jasmine · 玛莉", source: "Phonetic variation · 音译变体", personalityMatch: "Reflects your bitter and beloved nature" },
  ],
  "mark": [
    { characters: "马克", pinyin: "Mǎ Kè", meaning: "Horse overcome · 马克", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your warlike and dedicated nature" },
  ],
  "matt": [
    { characters: "马特", pinyin: "Mǎ Tè", meaning: "Horse special · 马特", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your gift-of-God gratitude" },
  ],
  "megan": [
    { characters: "梅根", pinyin: "Méi Gēn", meaning: "Plum root · 梅根", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your strong and capable pearl nature" },
  ],
  
  // N 开头
  "nancy": [
    { characters: "南希", pinyin: "Nán Xī", meaning: "South hope · 南希", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your gracious and full-of-grace nature" },
  ],
  "nick": [
    { characters: "尼克", pinyin: "Ní Kè", meaning: "Buddhist overcome · 尼克", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your victory-of-the-people spirit" },
  ],
  "nathan": [
    { characters: "内森", pinyin: "Nèi Sēn", meaning: "Inside forest · 内森", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your gift-giving generous nature" },
  ],
  "natalie": [
    { characters: "娜塔莉", pinyin: "Nà Tǎ Lì", meaning: "Elegant pagoda beautiful · 娜塔莉", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your Christmas-born joyful nature" },
  ],
  
  // O 开头
  "oliver": [
    { characters: "奥利弗", pinyin: "Ào Lì Fú", meaning: "Profound benefit blessing · 奥利弗", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your olive-tree peaceful nature" },
  ],
  "olivia": [
    { characters: "奥利维亚", pinyin: "Ào Lì Wéi Yà", meaning: "Profound benefit maintain · 奥利维亚", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your olive-tree graceful beauty" },
  ],
  "oscar": [
    { characters: "奥斯卡", pinyin: "Ào Sī Kǎ", meaning: "Profound thought card · 奥斯卡", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your spear-of-God divine nature" },
  ],
  
  // P 开头
  "peter": [
    { characters: "彼得", pinyin: "Bǐ Dé", meaning: "Compare virtue · 彼得", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your rock-solid dependable nature" },
  ],
  "paul": [
    { characters: "保罗", pinyin: "Bǎo Luó", meaning: "Protect net · 保罗", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your small-and-humble wise nature" },
  ],
  "patrick": [
    { characters: "帕特里克", pinyin: "Pà Tè Lǐ Kè", meaning: "Fear special reason overcome · 帕特里克", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your noble and patrician nature" },
  ],
  "pamela": [
    { characters: "帕梅拉", pinyin: "Pà Méi Lā", meaning: "Fear plum pull · 帕梅拉", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your honey-like sweet nature" },
  ],
  
  // Q 开头
  "quinn": [
    { characters: "奎因", pinyin: "Kuí Yīn", meaning: "Chief reason · 奎因", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your wise and intelligent head nature" },
  ],
  
  // R 开头
  "robert": [
    { characters: "罗伯特", pinyin: "Luó Bó Tè", meaning: "Net abundant special · 罗伯特", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your bright-and-famous glory" },
  ],
  "richard": [
    { characters: "理查德", pinyin: "Lǐ Chá Dé", meaning: "Reason investigate virtue · 理查德", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your brave-and-powerful rule" },
  ],
  "ryan": [
    { characters: "瑞安", pinyin: "Ruì Ān", meaning: "Auspicious peace · 瑞安", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your little-king noble nature" },
  ],
  "rachel": [
    { characters: "瑞秋", pinyin: "Ruì Qiū", meaning: "Auspicious autumn · 瑞秋", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your ewe gentle nature" },
  ],
  "rebecca": [
    { characters: "丽贝卡", pinyin: "Lì Bèi Kǎ", meaning: "Beautiful shell card · 丽贝卡", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your captivating and beautiful spirit" },
  ],
  
  // S 开头
  "sophia": [
    { characters: "索菲", pinyin: "Suǒ Fēi", meaning: "Search fragrance · 索菲", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your wisdom-filled graceful nature" },
    { characters: "索菲亚", pinyin: "Suǒ Fēi Yà", meaning: "Search fragrance elegant · 索菲亚", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your wise and skillful beauty" },
  ],
  "sam": [
    { characters: "山姆", pinyin: "Shān Mǔ", meaning: "Mountain mother · 山姆", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your told-by-God faithful nature" },
  ],
  "samuel": [
    { characters: "塞缪尔", pinyin: "Sāi Miù Ěr", meaning: "Fill error you · 塞缪尔", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your name-of-God devoted nature" },
  ],
  "sarah": [
    { characters: "莎拉", pinyin: "Shā Lā", meaning: "Sand pull · 莎拉", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your princess noble nature" },
  ],
  "steve": [
    { characters: "史蒂夫", pinyin: "Shǐ Dì Fū", meaning: "History emperor man · 史蒂夫", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your crown-and-victory glory" },
  ],
  "susan": [
    { characters: "苏珊", pinyin: "Sū Shān", meaning: "Revive coral · 苏珊", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your lily-pure graceful nature" },
  ],
  "sandra": [
    { characters: "桑德拉", pinyin: "Sāng Dé Lā", meaning: "Mulberry virtue pull · 桑德拉", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your defender-of-mankind strength" },
  ],
  "shirley": [
    { characters: "雪莉", pinyin: "Xuě Lì", meaning: "Snow beautiful · 雪莉", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your bright-meadow fresh nature" },
  ],
  
  // T 开头
  "tom": [
    { characters: "汤姆", pinyin: "Tāng Mǔ", meaning: "Soup mother · 汤姆", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your twin-like dual nature" },
  ],
  "thomas": [
    { characters: "托马斯", pinyin: "Tuō Mǎ Sī", meaning: "Support horse thought · 托马斯", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your twin-and-doubting thoughtful nature" },
  ],
  "tim": [
    { characters: "蒂姆", pinyin: "Dì Mǔ", meaning: "Stem mother · 蒂姆", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your honoring-God pious nature" },
  ],
  "tina": [
    { characters: "蒂娜", pinyin: "Dì Nà", meaning: "Stem elegant · 蒂娜", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your follower-of-Christ devoted nature" },
  ],
  "tiffany": [
    { characters: "蒂芙尼", pinyin: "Dì Fú Ní", meaning: "Stem blessing mud · 蒂芙尼", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your manifestation-of-God divine nature" },
  ],
  
  // V 开头
  "victor": [
    { characters: "维克多", pinyin: "Wéi Kè Duō", meaning: "Maintain overcome many · 维克多", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your conqueror-and-winner triumph" },
  ],
  "vincent": [
    { characters: "文森特", pinyin: "Wén Sēn Tè", meaning: "Literature forest special · 文森特", source: "Standard phonetic · 标准音译", personalityMatch: "Reflects your conquering victorious nature" },
  ],
  "vivian": [
    { characters: "薇薇安", pinyin: "Wēi Wēi Ān", meaning: "Tiny tiny peace · 薇薇安", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your lively-and-full-of-life energy" },
  ],
  "vanessa": [
    { characters: "瓦妮莎", pinyin: "Wǎ Nī Shā", meaning: "Tile girl sand · 瓦妮莎", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your butterfly-transforming beauty" },
  ],
  
  // W 开头
  "william": [
    { characters: "威廉", pinyin: "Wēi Lián", meaning: "Mighty protect · 威廉", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your resolute-protector guardian nature" },
  ],
  "walter": [
    { characters: "沃尔特", pinyin: "Wò Ěr Tè", meaning: "Lie down you special · 沃尔特", source: "Standard phonetic · 标准音译", personalityMatch: "Embodies your ruler-of-the-army leadership" },
  ],
  "wendy": [
    { characters: "温迪", pinyin: "Wēn Dí", meaning: "Warm enlighten · 温迪", source: "Phonetic match · 音译谐音", personalityMatch: "Reflects your friend-and-wanderer free spirit" },
  ],
  
  // Y 开头
  "yolanda": [
    { characters: "尤兰达", pinyin: "Yóu Lán Dá", meaning: "Especially orchid arrive · 尤兰达", source: "Standard phonetic · 标准音译", personalityMatch: "Matches your violet-flower violet nature" },
  ],
  
  // Z 开头
  "zach": [
    { characters: "扎克", pinyin: "Zhā Kè", meaning: "Thorn overcome · 扎克", source: "Phonetic match · 音译谐音", personalityMatch: "Matches your remembered-by-God blessed nature" },
  ],
  "zoe": [
    { characters: "佐伊", pinyin: "Zuǒ Yī", meaning: "Assist that · 佐伊", source: "Phonetic match · 音译谐音", personalityMatch: "Embodies your life-giving vibrant nature" },
  ],
};

// 首字母通用音译映射
const firstLetterPhoneticMap: Record<string, ChineseName> = {
  "A": { characters: "艾", pinyin: "Ài", meaning: "Ivy, beautiful plant · 艾草", source: "Phonetic starting with A · A音开头", personalityMatch: "Matches your name's elegant beginning sound" },
  "B": { characters: "贝", pinyin: "Bèi", meaning: "Shell, treasure · 贝壳", source: "Phonetic starting with B · B音开头", personalityMatch: "Echoes your treasured and valuable nature" },
  "C": { characters: "凯", pinyin: "Kǎi", meaning: "Victory, triumph · 凯旋", source: "Phonetic starting with C/K · C/K音开头", personalityMatch: "Matches your victorious and triumphant spirit" },
  "D": { characters: "大", pinyin: "Dà", meaning: "Great, big · 伟大", source: "Phonetic starting with D · D音开头", personalityMatch: "Captures your bold and grand nature" },
  "E": { characters: "伊", pinyin: "Yī", meaning: "That one, elegant · 伊人", source: "Phonetic starting with E · E音开头", personalityMatch: "Matches your elegant and graceful sound" },
  "F": { characters: "菲", pinyin: "Fēi", meaning: "Fragrant, luxuriant · 芳菲", source: "Phonetic starting with F · F音开头", personalityMatch: "Embodies your fragrant and flourishing nature" },
  "G": { characters: "格", pinyin: "Gé", meaning: "Pattern, standard · 格调", source: "Phonetic starting with G · G音开头", personalityMatch: "Reflects your distinguished and classic nature" },
  "H": { characters: "海", pinyin: "Hǎi", meaning: "Sea, vast · 海洋", source: "Phonetic starting with H · H音开头", personalityMatch: "Matches your vast and deep character" },
  "I": { characters: "艾", pinyin: "Ài", meaning: "Ivy, beautiful · 艾草", source: "Phonetic starting with I · I音开头", personalityMatch: "Echoes your elegant and refined sound" },
  "J": { characters: "杰", pinyin: "Jié", meaning: "Outstanding, hero · 杰出", source: "Phonetic starting with J · J音开头", personalityMatch: "Embodies your outstanding and heroic nature" },
  "K": { characters: "凯", pinyin: "Kǎi", meaning: "Victory, triumph · 凯旋", source: "Phonetic starting with K · K音开头", personalityMatch: "Matches your triumphant and successful spirit" },
  "L": { characters: "丽", pinyin: "Lì", meaning: "Beautiful, elegant · 美丽", source: "Phonetic starting with L · L音开头", personalityMatch: "Captures your beautiful and graceful nature" },
  "M": { characters: "麦", pinyin: "Mài", meaning: "Wheat, harvest · 麦穗", source: "Phonetic starting with M · M音开头", personalityMatch: "Matches your warm and abundant nature" },
  "N": { characters: "娜", pinyin: "Nà", meaning: "Elegant, graceful · 婀娜", source: "Phonetic starting with N · N音开头", personalityMatch: "Embodies your elegant and graceful demeanor" },
  "O": { characters: "奥", pinyin: "Ào", meaning: "Profound, mysterious · 深奥", source: "Phonetic starting with O · O音开头", personalityMatch: "Reflects your profound and mysterious nature" },
  "P": { characters: "帕", pinyin: "Pà", meaning: "Veil, fear respect · 帕巾", source: "Phonetic starting with P · P音开头", personalityMatch: "Matches your respectful and dignified nature" },
  "Q": { characters: "奎", pinyin: "Kuí", meaning: "Star, chief · 奎星", source: "Phonetic starting with Q · Q音开头", personalityMatch: "Embodies your stellar and leading nature" },
  "R": { characters: "瑞", pinyin: "Ruì", meaning: "Auspicious, jade · 瑞玉", source: "Phonetic starting with R · R音开头", personalityMatch: "Matches your auspicious and fortunate nature" },
  "S": { characters: "思", pinyin: "Sī", meaning: "Think, thought · 思考", source: "Phonetic starting with S · S音开头", personalityMatch: "Captures your thoughtful and contemplative nature" },
  "T": { characters: "泰", pinyin: "Tài", meaning: "Peaceful, safe · 安泰", source: "Phonetic starting with T · T音开头", personalityMatch: "Matches your peaceful and secure nature" },
  "U": { characters: "尤", pinyin: "Yóu", meaning: "Especially, outstanding · 尤其", source: "Phonetic starting with U · U音开头", personalityMatch: "Embodies your outstanding and special nature" },
  "V": { characters: "维", pinyin: "Wéi", meaning: "Maintain, thought · 思维", source: "Phonetic starting with V · V音开头", personalityMatch: "Reflects your thoughtful and maintaining nature" },
  "W": { characters: "威", pinyin: "Wēi", meaning: "Might, prestige · 威望", source: "Phonetic starting with W · W音开头", personalityMatch: "Matches your mighty and prestigious nature" },
  "X": { characters: "西", pinyin: "Xī", meaning: "West, west · 西方", source: "Phonetic starting with X · X音开头", personalityMatch: "Embodies your western and exploratory nature" },
  "Y": { characters: "雅", pinyin: "Yǎ", meaning: "Elegant, refined · 雅致", source: "Phonetic starting with Y · Y音开头", personalityMatch: "Matches your elegant and refined character" },
  "Z": { characters: "泽", pinyin: "Zé", meaning: "Grace, pool · 恩泽", source: "Phonetic starting with Z · Z音开头", personalityMatch: "Captures your graceful and beneficent nature" },
};

// ==================== 扩展的传统名字库 ====================
const traditionalNameDatabase = {
  male: [
    // 文雅书生型
    { characters: "子轩", pinyin: "Zǐ Xuān", meaning: "Son of nobility · 子之轩昂", source: "Classical literature · 经典文学", personalityMatch: "Conveys dignity and scholarly grace · 传达尊严与学者风范" },
    { characters: "文博", pinyin: "Wén Bó", meaning: "Cultured and learned · 文采博学", source: "Confucian tradition · 儒家传统", personalityMatch: "Shows literary excellence and wisdom · 展现文学才华与智慧" },
    { characters: "修杰", pinyin: "Xiū Jié", meaning: "Cultivated excellence · 修身杰士", source: "Classical cultivation · 修身之道", personalityMatch: "Demonstrates self-improvement and nobility · 体现自我提升与高尚" },
    { characters: "书涵", pinyin: "Shū Hán", meaning: "Book cultivation · 书香涵养", source: "Scholarly tradition · 学者传统", personalityMatch: "Embodies knowledge and refinement · 体现知识与修养" },
    { characters: "墨轩", pinyin: "Mò Xuān", meaning: "Ink pavilion · 墨香轩窗", source: "Literary tradition · 文人传统", personalityMatch: "Reflects artistic and scholarly temperament · 反映艺术与学者气质" },
    
    // 大气豪迈型
    { characters: "浩然", pinyin: "Hào Rán", meaning: "Vast and righteous · 浩然正气", source: "Mencius · 《孟子》", personalityMatch: "Embodies grand moral character · 体现宏大道德品格" },
    { characters: "天翔", pinyin: "Tiān Xiáng", meaning: "Soaring sky · 天翔云游", source: "Classical imagery · 古典意象", personalityMatch: "Shows ambition and freedom · 展现抱负与自由" },
    { characters: "鹏程", pinyin: "Péng Chéng", meaning: "Roc journey · 鹏程万里", source: "Zhuangzi · 《庄子》", personalityMatch: "Symbolizes great ambition and success · 象征远大抱负与成功" },
    { characters: "云飞", pinyin: "Yún Fēi", meaning: "Cloud flying · 云飞风扬", source: "Tang poetry · 唐诗", personalityMatch: "Represents freedom and aspiration · 代表自由与志向" },
    { characters: "海川", pinyin: "Hǎi Chuān", meaning: "Sea and river · 海纳百川", source: "Classical wisdom · 古典智慧", personalityMatch: "Shows包容 and magnanimity · 展现包容与宽宏" },
    
    // 智慧深邃型
    { characters: "睿渊", pinyin: "Ruì Yuān", meaning: "Wise and profound · 睿智渊博", source: "Ancient wisdom texts · 古籍智慧", personalityMatch: "Reflects deep intelligence · 反映深邃智慧" },
    { characters: "明哲", pinyin: "Míng Zhé", meaning: "Bright and wise · 明哲保身", source: "Book of Songs · 《诗经》", personalityMatch: "Shows wisdom and discernment · 展现智慧与洞察力" },
    { characters: "思远", pinyin: "Sī Yuǎn", meaning: "Thoughtful and far-seeing · 思远虑深", source: "Philosophical texts · 哲学典籍", personalityMatch: "Deep thinker with vision · 深思熟虑的远见者" },
    { characters: "智宸", pinyin: "Zhì Chén", meaning: "Wisdom imperial · 智慧宸宇", source: "Classical combination · 古典组合", personalityMatch: "Embodies wisdom and nobility · 体现智慧与高貴" },
    { characters: "明辉", pinyin: "Míng Huī", meaning: "Bright radiance · 明辉璀璨", source: "Tang Dynasty poetry · 唐诗", personalityMatch: "Shines with inner light and wisdom · 内心光芒与智慧闪耀" },
    
    // 品德高尚型
    { characters: "泽楷", pinyin: "Zé Kǎi", meaning: "Graceful model · 泽被楷模", source: "Confucian tradition · 儒家传统", personalityMatch: "Exemplifies virtuous conduct · 示范美德行为" },
    { characters: "德明", pinyin: "Dé Míng", meaning: "Virtue bright · 德明行正", source: "Moral tradition · 道德传统", personalityMatch: "Shows moral clarity and integrity · 展现道德清明与正直" },
    { characters: "仁杰", pinyin: "Rén Jié", meaning: "Benevolent hero · 仁德杰出", source: "Confucian virtue · 儒家美德", personalityMatch: "Combines kindness with excellence · 结合善良与卓越" },
    { characters: "义轩", pinyin: "Yì Xuān", meaning: "Righteous pavilion · 义薄云天", source: "Classical virtue · 古典美德", personalityMatch: "Embodies righteousness and nobility · 体现正义与高尚" },
    { characters: "信然", pinyin: "Xìn Rán", meaning: "Trustworthy and natural · 信然如一", source: "Confucian value · 儒家价值", personalityMatch: "Shows honesty and authenticity · 展现诚实与真实" },
    
    // 俊朗英武型
    { characters: "俊熙", pinyin: "Jùn Xī", meaning: "Talented and bright · 俊朗熙和", source: "Classical poetry · 古典诗词", personalityMatch: "Radiates talent and optimism · 散发才华与乐观" },
    { characters: "英杰", pinyin: "Yīng Jié", meaning: "Heroic excellence · 英雄杰出", source: "Classical ideal · 古典理想", personalityMatch: "Embodies heroism and excellence · 体现英雄主义与卓越" },
    { characters: "伟宸", pinyin: "Wěi Chén", meaning: "Great imperial · 伟岸宸宇", source: "Classical combination · 古典组合", personalityMatch: "Shows greatness and dignity · 展现伟大与尊严" },
    { characters: "弘毅", pinyin: "Hóng Yì", meaning: "Great perseverance · 弘毅宽厚", source: "Analects · 《论语》", personalityMatch: "Demonstrates strength and determination · 展现力量与决心" },
    { characters: "峻熙", pinyin: "Jùn Xī", meaning: "Lofty brightness · 峻熙明朗", source: "Classical imagery · 古典意象", personalityMatch: "Combines majesty with warmth · 结合威严与温暖" },
  ],
  
  female: [
    // 温婉优雅型
    { characters: "雅琪", pinyin: "Yǎ Qí", meaning: "Elegant jade · 雅致琪玉", source: "Classical feminine ideal · 古典女性美", personalityMatch: "Radiates refined beauty and grace · 散发精致美与优雅" },
    { characters: "诗涵", pinyin: "Shī Hán", meaning: "Poetic grace · 诗意涵养", source: "Tang poetry tradition · 唐诗传统", personalityMatch: "Embodies artistic elegance and depth · 体现艺术优雅与深度" },
    { characters: "若曦", pinyin: "Ruò Xī", meaning: "Like morning light · 若曦晨光", source: "Classical imagery · 古典意象", personalityMatch: "Gentle as dawn, warm and bright · 温柔如晨曦，温暖明亮" },
    { characters: "婉清", pinyin: "Wǎn Qīng", meaning: "Graceful and clear · 婉约清丽", source: "Song poetry · 宋词", personalityMatch: "Shows elegance and purity · 展现优雅与纯洁" },
    { characters: "静姝", pinyin: "Jìng Shū", meaning: "Quiet and beautiful · 静女其姝", source: "Book of Songs · 《诗经》", personalityMatch: "Embodies quiet beauty and grace · 体现静谧之美" },
    
    // 灵动活泼型
    { characters: "雨萱", pinyin: "Yǔ Xuān", meaning: "Rain lily · 雨润萱草", source: "Nature poetry · 自然诗词", personalityMatch: "Fresh and nurturing spirit · 清新滋养的精神" },
    { characters: "梦琪", pinyin: "Mèng Qí", meaning: "Dream jade · 梦幻琪玉", source: "Romantic poetry · 浪漫诗词", personalityMatch: "Carries dreamy elegance and wonder · 承载梦幻优雅与惊奇" },
    { characters: "灵韵", pinyin: "Líng Yùn", meaning: "Spiritual charm · 灵动韵味", source: "Artistic tradition · 艺术传统", personalityMatch: "Shows lively and artistic temperament · 展现活泼艺术气质" },
    { characters: "晓萱", pinyin: "Xiǎo Xuān", meaning: "Dawn lily · 晓露萱花", source: "Classical imagery · 古典意象", personalityMatch: "Bright and fresh like morning dew · 明亮清新如晨露" },
    { characters: "语嫣", pinyin: "Yǔ Yān", meaning: "Charming speech · 语笑嫣然", source: "Jin Yong novel · 金庸小说", personalityMatch: "Embodies charm and eloquence · 体现魅力与口才" },
    
    // 聪慧知性型
    { characters: "思颖", pinyin: "Sī Yǐng", meaning: "Thoughtful excellence · 思颖慧心", source: "Scholarly tradition · 学者传统", personalityMatch: "Shows intelligent grace and wisdom · 展现聪慧优雅与智慧" },
    { characters: "睿婕", pinyin: "Ruì Jié", meaning: "Wise and graceful · 睿智婕妤", source: "Classical combination · 古典组合", personalityMatch: "Combines wisdom with elegance · 结合智慧与优雅" },
    { characters: "书瑶", pinyin: "Shū Yáo", meaning: "Book jade · 书卷瑶华", source: "Literary tradition · 文学传统", personalityMatch: "Embodies knowledge and beauty · 体现知识与美" },
    { characters: "慧琳", pinyin: "Huì Lín", meaning: "Wise jade · 慧心琳琅", source: "Wisdom tradition · 智慧传统", personalityMatch: "Shows wisdom and preciousness · 展现智慧与珍贵" },
    { characters: "智美", pinyin: "Zhì Měi", meaning: "Wise and beautiful · 智美双全", source: "Modern classical · 现代古典", personalityMatch: "Combines intelligence with beauty · 结合智慧与美貌" },
    
    // 甜美可人型
    { characters: "欣怡", pinyin: "Xīn Yí", meaning: "Joyful harmony · 欣悦怡然", source: "Classical blessings · 古典祝福", personalityMatch: "Brings happiness and peace · 带来快乐与平和" },
    { characters: "佳怡", pinyin: "Jiā Yí", meaning: "Beautiful harmony · 佳期怡悦", source: "Traditional virtues · 传统美德", personalityMatch: "Radiates pleasant charm and joy · 散发愉悦魅力与快乐" },
    { characters: "甜甜", pinyin: "Tián Tián", meaning: "Sweet sweet · 甜甜蜜蜜", source: "Modern affectionate · 现代亲昵", personalityMatch: "Embodies sweetness and warmth · 体现甜蜜与温暖" },
    { characters: "美琳", pinyin: "Měi Lín", meaning: "Beautiful jade · 美丽琳琅", source: "Classical beauty · 古典美", personalityMatch: "Shows beauty and preciousness · 展现美与珍贵" },
    { characters: "可馨", pinyin: "Kě Xīn", meaning: "Adorable fragrance · 可人馨香", source: "Modern classical · 现代古典", personalityMatch: "Sweet and charming presence · 甜美迷人的存在" },
    
    // 大气端庄型
    { characters: "雅婷", pinyin: "Yǎ Tíng", meaning: "Elegant graceful · 雅致婷婷", source: "Classical elegance · 古典优雅", personalityMatch: "Shows dignity and refinement · 展现尊严与精致" },
    { characters: "丽华", pinyin: "Lì Huá", meaning: "Beautiful splendor · 丽华璀璨", source: "Historical name · 历史名讳", personalityMatch: "Embodies beauty and magnificence · 体现美与华丽" },
    { characters: "婷婷", pinyin: "Tíng Tíng", meaning: "Graceful and tall · 婷婷玉立", source: "Classical description · 古典描写", personalityMatch: "Shows elegance and poise · 展现优雅与镇定" },
    { characters: "淑华", pinyin: "Shū Huá", meaning: "Virtuous splendor · 淑女华彩", source: "Virtue tradition · 美德传统", personalityMatch: "Combines virtue with beauty · 结合美德与美" },
    { characters: "婉仪", pinyin: "Wǎn Yí", meaning: "Graceful demeanor · 婉约仪容", source: "Classical etiquette · 古典礼仪", personalityMatch: "Embodies grace and propriety · 体现优雅与得体" },
  ],
  
  neutral: [
    { characters: "文轩", pinyin: "Wén Xuān", meaning: "Cultured pavilion · 文轩雅室", source: "Scholarly tradition · 学者传统", personalityMatch: "Shows intellectual depth and refinement · 展现知识深度与修养" },
    { characters: "明远", pinyin: "Míng Yuǎn", meaning: "Bright and far-reaching · 明远志高", source: "Classical wisdom · 古典智慧", personalityMatch: "Visionary and clear-minded · 有远见且头脑清晰" },
    { characters: "清扬", pinyin: "Qīng Yáng", meaning: "Clear and elevated · 清扬婉兮", source: "Book of Songs · 《诗经》", personalityMatch: "Pure and uplifting spirit · 纯洁振奋的精神" },
    { characters: "云帆", pinyin: "Yún Fān", meaning: "Cloud sail · 云帆远航", source: "Li Bai poetry · 李白诗", personalityMatch: "Adventurous and aspirational spirit · 冒险与有志向的精神" },
    { characters: "景行", pinyin: "Jǐng Xíng", meaning: "Noble conduct · 景行行止", source: "Book of Songs · 《诗经》", personalityMatch: "Exemplary behavior and high standards · 模范行为与高标准" },
    { characters: "子墨", pinyin: "Zǐ Mò", meaning: "Child of ink · 子墨书香", source: "Literary tradition · 文学传统", personalityMatch: "Artistic and scholarly nature · 艺术与学者气质" },
    { characters: "星辰", pinyin: "Xīng Chén", meaning: "Star and constellation · 星辰大海", source: "Classical imagery · 古典意象", personalityMatch: "Dreamy and aspirational nature · 梦幻与有志向的天性" },
    { characters: "晨曦", pinyin: "Chén Xī", meaning: "Morning dawn · 晨曦微光", source: "Nature imagery · 自然意象", personalityMatch: "Fresh start and new hope · 新的开始与希望" },
    { characters: "涵宇", pinyin: "Hán Yǔ", meaning: "Cultivate universe · 涵养宇宙", source: "Philosophical · 哲学意境", personalityMatch: "Broad-minded and cultivated · 心胸宽广且有修养" },
    { characters: "逸飞", pinyin: "Yì Fēi", meaning: "Free flying · 逸兴遄飞", source: "Classical poetry · 古典诗词", personalityMatch: "Free-spirited and unrestrained · 自由奔放无拘无束" },
  ],
};

// ==================== 智能匹配关键词 ====================
const personalityKeywords: Record<string, string[]> = {
  "outgoing": ["阳", "朗", "熙", "乐", "欢", "悦", "翔", "飞"],
  "introverted": ["静", "思", "默", "涵", "渊", "逸", "幽", "清"],
  "creative": ["艺", "墨", "诗", "梦", "灵", "韵", "幻", "创"],
  "analytical": ["睿", "哲", "智", "明", "思", "析", "理", "辨"],
  "leadership": ["杰", "英", "豪", "雄", "领", "帅", "宸", "御"],
  "caring": ["仁", "慈", "惠", "爱", "恩", "泽", "润", "暖"],
  "adventurous": ["翔", "飞", "远", "航", "探", "征", "越", "驰"],
  "traditional": ["德", "礼", "义", "信", "忠", "孝", "廉", "诚"],
  "modern": ["新", "创", "尚", "潮", "酷", "炫", "锐", "锋"],
};

const professionKeywords: Record<string, string[]> = {
  "teacher": ["文", "书", "教", "诲", "师", "儒", "学", "智"],
  "doctor": ["仁", "慈", "济", "安", "康", "宁", "和", "愈"],
  "artist": ["艺", "墨", "画", "韵", "美", "华", "彩", "绘"],
  "engineer": ["工", "技", "巧", "匠", "造", "建", "构", "筑"],
  "business": ["商", "贸", "财", "富", "兴", "盛", "达", "通"],
  "lawyer": ["正", "义", "法", "理", "公", "平", "直", "明"],
  "scientist": ["科", "研", "究", "探", "索", "真", "知", "理"],
  "writer": ["文", "墨", "笔", "章", "辞", "赋", "诗", "书"],
  "designer": ["美", "艺", "创", "设", "计", "构", "思", "想"],
  "developer": ["码", "程", "智", "创", "新", "技", "数", "云"],
};

const interestKeywords: Record<string, string[]> = {
  "music": ["音", "乐", "韵", "律", "歌", "曲", "弦", "箫"],
  "sports": ["健", "强", "力", "勇", "捷", "敏", "动", "驰"],
  "reading": ["书", "文", "墨", "香", "阅", "读", "学", "知"],
  "travel": ["游", "旅", "行", "远", "航", "途", "涉", "历"],
  "cooking": ["味", "香", "美", "馔", "烹", "调", "膳", "食"],
  "gaming": ["游", "戏", "竞", "技", "策", "略", "勇", "智"],
  "nature": ["林", "山", "川", "海", "风", "云", "雨", "露"],
  "technology": ["科", "技", "智", "能", "数", "云", "创", "新"],
};

// ==================== 核心生成函数 ====================

/**
 * 生成音译名字
 */
function generatePhoneticNames(englishName: string, count: number = 2): ChineseName[] {
  const name = englishName.toLowerCase().trim();
  const results: ChineseName[] = [];
  
  // 1. 精确匹配完整名字
  if (phoneticNameDatabase[name]) {
    results.push(...phoneticNameDatabase[name].slice(0, count));
  }
  
  // 2. 部分匹配（名字包含数据库中的键）
  if (results.length < count) {
    for (const [key, names] of Object.entries(phoneticNameDatabase)) {
      if (name.includes(key) && key !== name) {
        results.push(...names.slice(0, count - results.length));
        if (results.length >= count) break;
      }
    }
  }
  
  // 3. 首字母匹配
  if (results.length < count) {
    const firstChar = englishName.charAt(0).toUpperCase();
    if (firstLetterPhoneticMap[firstChar]) {
      results.push(firstLetterPhoneticMap[firstChar]);
    }
  }
  
  return results.slice(0, count);
}

/**
 * 根据用户特征智能匹配名字
 */
function generateSmartTraditionalNames(data: FormData, count: number): ChineseName[] {
  let namePool: ChineseName[] = [];
  
  // 根据性别选择基础名字池
  if (data.gender === "male") {
    namePool = [...traditionalNameDatabase.male, ...traditionalNameDatabase.neutral];
  } else if (data.gender === "female") {
    namePool = [...traditionalNameDatabase.female, ...traditionalNameDatabase.neutral];
  } else {
    namePool = [
      ...traditionalNameDatabase.neutral,
      ...traditionalNameDatabase.male.slice(0, 5),
      ...traditionalNameDatabase.female.slice(0, 5),
    ];
  }
  
  // 为每个名字计算匹配分数
  const scoredNames = namePool.map(name => {
    let score = 0;
    const nameChars = name.characters;
    
    // 1. 性格匹配
    if (data.personality) {
      const personalityLower = data.personality.toLowerCase();
      for (const [trait, chars] of Object.entries(personalityKeywords)) {
        if (personalityLower.includes(trait)) {
          for (const char of chars) {
            if (nameChars.includes(char)) score += 3;
          }
        }
      }
    }
    
    // 2. 职业匹配
    if (data.profession) {
      const professionLower = data.profession.toLowerCase();
      for (const [prof, chars] of Object.entries(professionKeywords)) {
        if (professionLower.includes(prof)) {
          for (const char of chars) {
            if (nameChars.includes(char)) score += 2;
          }
        }
      }
    }
    
    // 3. 兴趣匹配
    if (data.interests) {
      const interestsLower = data.interests.toLowerCase();
      for (const [interest, chars] of Object.entries(interestKeywords)) {
        if (interestsLower.includes(interest)) {
          for (const char of chars) {
            if (nameChars.includes(char)) score += 2;
          }
        }
      }
    }
    
    // 4. 期望寓意匹配
    if (data.desiredMeaning) {
      const meaningLower = data.desiredMeaning.toLowerCase();
      const meaningWords = ["wisdom", "strength", "beauty", "peace", "success", "love", "health", "wealth", "happiness"];
      for (const word of meaningWords) {
        if (meaningLower.includes(word)) {
          // 根据寓意关键词加分
          if (word === "wisdom" && /[睿哲智明思]/.test(nameChars)) score += 3;
          if (word === "strength" && /[强豪杰英勇]/.test(nameChars)) score += 3;
          if (word === "beauty" && /[美丽华雅秀]/.test(nameChars)) score += 3;
          if (word === "peace" && /[安宁和静泰]/.test(nameChars)) score += 3;
          if (word === "success" && /[成达胜凯捷]/.test(nameChars)) score += 3;
        }
      }
    }
    
    // 5. 年龄适配（简单规则）
    if (data.age) {
      if (data.age < 25) {
        // 年轻人偏好更现代、活泼的名字
        if (/[熙萱琪涵]/.test(nameChars)) score += 1;
      } else if (data.age > 40) {
        // 成熟人士偏好稳重、传统的名字
        if (/[德仁义礼信]/.test(nameChars)) score += 1;
      }
    }
    
    return { name, score };
  });
  
  // 按分数排序，高分的排在前面
  scoredNames.sort((a, b) => b.score - a.score);
  
  // 返回前 count 个，如果不够就随机补充
  const result = scoredNames.slice(0, count).map(item => item.name);
  
  if (result.length < count) {
    const remaining = namePool
      .filter(n => !result.includes(n))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - result.length);
    result.push(...remaining);
  }
  
  return result;
}

/**
 * 生成个性化描述
 */
function enhanceNameDescription(name: ChineseName, data: FormData): ChineseName {
  // 根据用户输入个性化 personalityMatch
  let enhancedMatch = name.personalityMatch;
  
  if (data.personality && !enhancedMatch.includes(data.personality.substring(0, 20))) {
    enhancedMatch += ` · Especially suits your ${data.personality} personality`;
  }
  
  if (data.profession && !enhancedMatch.includes(data.profession.substring(0, 20))) {
    enhancedMatch += ` · Perfect for a ${data.profession}`;
  }
  
  return {
    ...name,
    personalityMatch: enhancedMatch,
  };
}

// ==================== 主生成函数 ====================

export function generateChineseNames(data: FormData, more: boolean = false): ChineseName[] {
  const count = more ? 9 : 5;
  
  // 1. 生成音译名字（1-2个）
  const phoneticNames = generatePhoneticNames(data.englishName, 2);
  
  // 2. 智能生成传统名字
  const traditionalCount = count - phoneticNames.length;
  const traditionalNames = generateSmartTraditionalNames(data, traditionalCount);
  
  // 3. 合并并增强描述
  const allNames = [...phoneticNames, ...traditionalNames];
  const enhancedNames = allNames.map(name => enhanceNameDescription(name, data));
  
  // 4. 打乱顺序（但音译名字优先）
  const shuffledTraditional = enhancedNames.slice(phoneticNames.length).sort(() => Math.random() - 0.5);
  
  return [...phoneticNames, ...shuffledTraditional].slice(0, count);
}

// 拼音映射表（简化版）
const pinyinMap: Record<string, string> = {
  "子": "Zǐ", "轩": "Xuān", "浩": "Hào", "然": "Rán", "睿": "Ruì", "渊": "Yuān",
  "文": "Wén", "博": "Bó", "俊": "Jùn", "熙": "Xī", "泽": "Zé", "楷": "Kǎi",
  "明": "Míng", "辉": "Huī", "修": "Xiū", "杰": "Jié", "诗": "Shī", "涵": "Hán",
  "雅": "Yǎ", "琪": "Qí", "梦": "Mèng", "雨": "Yǔ", "萱": "Xuān", "欣": "Xīn",
  "怡": "Yí", "思": "Sī", "颖": "Yǐng", "佳": "Jiā", "若": "Ruò", "曦": "Xī",
  "远": "Yuǎn", "清": "Qīng", "扬": "Yáng", "云": "Yún", "帆": "Fān", "景": "Jǐng",
  "行": "Xíng", "李": "Lǐ", "奥": "Ào", "立": "Lì", "欧": "Ōu", "艾": "Ài",
  "力": "Lì", "大": "Dà", "维": "Wéi", "迈": "Mài", "克": "Kè", "强": "Qiáng",
  "索": "Suǒ", "菲": "Fēi", "莉": "Lì", "格": "Gé", "蕾": "Lěi", "丝": "Sī",
  "安": "Ān", "娜": "Nà", "贝": "Bèi", "伊": "Yī", "凯": "Kǎi", "泰": "Tài",
  "麦": "Mài", "吉": "Jí", "祥": "Xiáng", "瑞": "Ruì", "福": "Fú", "禄": "Lù",
  "寿": "Shòu", "康": "Kāng", "宁": "Níng", "和": "Hé", "平": "Píng", "顺": "Shùn",
  "达": "Dá", "兴": "Xīng", "盛": "Shèng", "昌": "Chāng", "隆": "Lóng", "华": "Huá",
  "富": "Fù", "贵": "Guì", "荣": "Róng", "耀": "Yào", "光": "Guāng", "彩": "Cǎi",
  "灵": "Líng", "秀": "Xiù", "英": "Yīng", "伟": "Wěi", "毅": "Yì",
  "刚": "Gāng", "勇": "Yǒng", "智": "Zhì", "慧": "Huì", "仁": "Rén", "义": "Yì",
  "礼": "Lǐ", "信": "Xìn", "忠": "Zhōng", "孝": "Xiào", "廉": "Lián", "耻": "Chǐ",
  "天": "Tiān", "翔": "Xiáng", "鹏": "Péng", "程": "Chéng", "飞": "Fēi", "川": "Chuān",
  "墨": "Mò", "书": "Shū", "哲": "Zhé", "宸": "Chén", "德": "Dé", "仁": "Rén",
  "英": "Yīng", "豪": "Háo", "弘": "Hóng", "峻": "Jùn", "婉": "Wǎn", "静": "Jìng",
  "姝": "Shū", "灵": "Líng", "韵": "Yùn", "晓": "Xiǎo", "语": "Yǔ", "嫣": "Yān",
  "婕": "Jié", "瑶": "Yáo", "琳": "Lín", "美": "Měi", "甜": "Tián", "馨": "Xīn",
  "婷": "Tíng", "丽": "Lì", "淑": "Shū", "仪": "Yí", "子": "Zǐ", "星": "Xīng",
  "辰": "Chén", "晨": "Chén", "曦": "Xī", "宇": "Yǔ", "逸": "Yì",
};

export function getPinyinForChars(chars: string): string {
  return chars.split("").map(c => pinyinMap[c] || c).join(" ");
}
