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

// ==================== 扩展的传统名字库（精选高质量名字）====================
const traditionalNameDatabase = {
  male: [
    // 文雅书生型 · Scholarly & Refined
    { characters: "子轩", pinyin: "Zǐ Xuān", meaning: "Son of nobility · 子之轩昂", source: "Classical literature · 经典文学", personalityMatch: "Conveys dignity and scholarly grace · 传达尊严与学者风范" },
    { characters: "文博", pinyin: "Wén Bó", meaning: "Cultured and learned · 文采博学", source: "Confucian tradition · 儒家传统", personalityMatch: "Shows literary excellence and wisdom · 展现文学才华与智慧" },
    { characters: "书涵", pinyin: "Shū Hán", meaning: "Book cultivation · 书香涵养", source: "Scholarly tradition · 学者传统", personalityMatch: "Embodies knowledge and refinement · 体现知识与修养" },
    { characters: "墨轩", pinyin: "Mò Xuān", meaning: "Ink pavilion · 墨香轩窗", source: "Literary tradition · 文人传统", personalityMatch: "Reflects artistic and scholarly temperament · 反映艺术与学者气质" },
    { characters: "修远", pinyin: "Xiū Yuǎn", meaning: "Cultivated far-reaching · 修身向远", source: "Qu Yuan · 《楚辞》'路漫漫其修远兮'", personalityMatch: "The spirit that never stops seeking, no matter how long the journey · 永不停止追求的精神" },
    { characters: "文渊", pinyin: "Wén Yuān", meaning: "Profound culture · 文学渊博", source: "Ming Dynasty Imperial Archive · 明代文渊阁", personalityMatch: "Deep and expansive like a literary ocean · 深邃广博如文海" },
    { characters: "博远", pinyin: "Bó Yuǎn", meaning: "Broad and far-sighted · 博学远见", source: "Confucian ideal · 儒家理想", personalityMatch: "Broad knowledge with forward vision · 知识渊博，目光远大" },
    
    // 大气豪迈型 · Grand & Ambitious
    { characters: "浩然", pinyin: "Hào Rán", meaning: "Vast righteous spirit · 浩然正气", source: "Mencius · 《孟子》'我善养吾浩然之气'", personalityMatch: "Embodies the grand moral spirit of the universe · 体现宇宙浩然正气" },
    { characters: "天翔", pinyin: "Tiān Xiáng", meaning: "Soaring to the sky · 凌云天翔", source: "Classical imagery · 古典意象", personalityMatch: "Shows boundless ambition and freedom · 展现无边抱负与自由" },
    { characters: "鹏程", pinyin: "Péng Chéng", meaning: "Roc's mighty journey · 鹏程万里", source: "Zhuangzi · 《庄子·逍遥游》", personalityMatch: "Symbolizes great ambition — the roc soars ninety thousand li · 象征远大志向，鹏飞九万里" },
    { characters: "海川", pinyin: "Hǎi Chuān", meaning: "Sea embracing all rivers · 海纳百川", source: "Ancient wisdom · 古典智慧", personalityMatch: "The sea accepts all streams — inclusive and magnificent · 大海纳百川，宽广包容" },
    { characters: "长风", pinyin: "Cháng Fēng", meaning: "Enduring wind · 长风破浪", source: "Li Bai · 李白《行路难》'长风破浪会有时'", personalityMatch: "One day the wind will come and break through the waves · 终有乘风破浪时" },
    { characters: "志远", pinyin: "Zhì Yuǎn", meaning: "Aspirations soaring far · 志存高远", source: "Zhuge Liang · 诸葛亮《诫子书》", personalityMatch: "The ambitious spirit that always aims beyond the horizon · 志向高远，永不停步" },
    { characters: "凌云", pinyin: "Líng Yún", meaning: "Rising above the clouds · 凌云壮志", source: "Du Fu · 杜甫《初上凤凰台》", personalityMatch: "Towering ambitions that pierce the clouds · 雄心壮志，直插云霄" },
    
    // 智慧深邃型 · Wise & Profound
    { characters: "睿渊", pinyin: "Ruì Yuān", meaning: "Wise and profound · 睿智渊博", source: "Ancient wisdom texts · 古籍智慧", personalityMatch: "Deep intelligence that sees beyond the surface · 洞察本质的深邃智慧" },
    { characters: "明哲", pinyin: "Míng Zhé", meaning: "Brilliant and wise · 明智哲思", source: "Book of Songs · 《诗经》'既明且哲，以保其身'", personalityMatch: "Wisdom that illuminates the path ahead · 智慧照亮前路" },
    { characters: "智宸", pinyin: "Zhì Chén", meaning: "Wisdom of the cosmos · 智慧宸宇", source: "Classical combination · 古典组合", personalityMatch: "Wisdom as vast as the heavens · 智慧如宸宇般广博" },
    { characters: "哲思", pinyin: "Zhé Sī", meaning: "Philosophical thought · 哲学思考", source: "Philosophical tradition · 哲学传统", personalityMatch: "A mind that questions and seeks truth · 探寻真理的哲思之心" },
    { characters: "慎思", pinyin: "Shèn Sī", meaning: "Careful thoughtfulness · 慎思明辨", source: "The Doctrine of the Mean · 《中庸》'博学之，审问之，慎思之'", personalityMatch: "Careful in reflection, clear in judgement · 思虑周全，明辨是非" },
    
    // 品德高尚型 · Virtuous & Noble
    { characters: "浩德", pinyin: "Hào Dé", meaning: "Vast virtue · 浩然之德", source: "Confucian canon · 儒家经典", personalityMatch: "Virtue as vast and pure as the open sky · 道德广博纯正如青天" },
    { characters: "仁杰", pinyin: "Rén Jié", meaning: "Benevolent excellence · 仁德杰出", source: "Confucian virtue · 儒家美德", personalityMatch: "Combines benevolence with outstanding character · 仁慈与卓越并存" },
    { characters: "弘毅", pinyin: "Hóng Yì", meaning: "Magnanimous and resolute · 弘毅宽厚", source: "Analects · 《论语》'士不可以不弘毅'", personalityMatch: "The scholar must be broad-minded and strong-willed · 胸怀宽广，意志坚定" },
    { characters: "君子", pinyin: "Jūn Zǐ", meaning: "Gentleman of virtue · 君子之风", source: "Analects · 《论语》", personalityMatch: "The Confucian ideal of a virtuous, cultured person · 儒家理想中的君子人格" },
    { characters: "德辉", pinyin: "Dé Huī", meaning: "Virtue's radiance · 德行光辉", source: "Moral tradition · 道德传统", personalityMatch: "Character that shines with moral brilliance · 品德光辉照耀" },
    
    // 意境深远型 · Poetic & Evocative
    { characters: "锦程", pinyin: "Jǐn Chéng", meaning: "Brocade journey · 锦绣前程", source: "Classical blessing · 古典祝福", personalityMatch: "A brilliant and colorful future awaits · 锦绣前程，无限可能" },
    { characters: "承泽", pinyin: "Chéng Zé", meaning: "Inheriting blessings · 承受恩泽", source: "Classical heritage · 古典传承", personalityMatch: "One who carries forward the blessings of generations past · 传承前人恩泽" },
    { characters: "宇恒", pinyin: "Yǔ Héng", meaning: "Universal permanence · 宇宙恒久", source: "Astronomical imagery · 天文意象", personalityMatch: "As enduring and steadfast as the universe itself · 如宇宙般永恒坚定" },
    { characters: "澄怀", pinyin: "Chéng Huái", meaning: "Pure heart · 澄怀观道", source: "Zong Bing · 宗炳《画山水序》", personalityMatch: "A pure heart that perceives the Tao in all things · 纯净之心，感悟万道" },
    { characters: "云鹤", pinyin: "Yún Hè", meaning: "Cloud crane · 云中仙鹤", source: "Taoist imagery · 道家意象", personalityMatch: "Free and transcendent as a crane gliding through clouds · 如云中仙鹤般超脱自在" },
  ],
  
  female: [
    // 温婉优雅型 · Gentle & Elegant
    { characters: "若兰", pinyin: "Ruò Lán", meaning: "Like an orchid · 若兰芳馥", source: "Qu Yuan · 《楚辞》'纫秋兰以为佩'", personalityMatch: "Pure and fragrant as an orchid in the valley · 幽谷兰花，芳洁纯美" },
    { characters: "诗涵", pinyin: "Shī Hán", meaning: "Poetic grace · 诗意涵养", source: "Tang poetry tradition · 唐诗传统", personalityMatch: "Carries the depth and beauty of classical poetry · 蕴含古典诗词的深度与美" },
    { characters: "婉清", pinyin: "Wǎn Qīng", meaning: "Graceful and pure · 婉约清丽", source: "Song Dynasty Ci poetry · 宋词", personalityMatch: "Elegant as a Song dynasty ci poem, clear as still water · 宛如宋词，清如静水" },
    { characters: "静姝", pinyin: "Jìng Shū", meaning: "Quiet and beautiful · 静女其姝", source: "Book of Songs · 《诗经·静女》", personalityMatch: "The quiet beauty that shines most brilliantly in stillness · 静中光华，最为动人" },
    { characters: "雅韵", pinyin: "Yǎ Yùn", meaning: "Elegant rhythm · 雅致韵味", source: "Classical music tradition · 古典音乐传统", personalityMatch: "Graceful like classical music — every note resonates with elegance · 如古典音乐，每个音符都优雅共鸣" },
    { characters: "清婉", pinyin: "Qīng Wǎn", meaning: "Pure and graceful · 清丽婉约", source: "Classical feminine ideal · 古典女性美", personalityMatch: "Clear-hearted and gently graceful · 心思清澈，举止婉约" },
    { characters: "幽兰", pinyin: "Yōu Lán", meaning: "Hidden orchid · 幽谷空兰", source: "Confucius · 孔子'芷兰生于深林，不以无人而不芳'", personalityMatch: "Flourishes with inner virtue regardless of recognition · 不因无人赏而不芳" },
    
    // 灵动活泼型 · Lively & Vibrant
    { characters: "雨萱", pinyin: "Yǔ Xuān", meaning: "Rain-nurtured lily · 雨润萱草", source: "Nature poetry · 自然诗词", personalityMatch: "Fresh and life-giving as rain on day lilies · 如雨润萱草，清新生机" },
    { characters: "飞燕", pinyin: "Fēi Yàn", meaning: "Flying swallow · 燕飞春来", source: "Classical poetry · 古典诗词", personalityMatch: "Swift, graceful and full of spring's energy · 轻盈灵动，充满春的活力" },
    { characters: "灵韵", pinyin: "Líng Yùn", meaning: "Spiritual melody · 灵动韵味", source: "Artistic tradition · 艺术传统", personalityMatch: "Alive with artistic spirit and natural rhythm · 充满艺术灵气与自然韵律" },
    { characters: "沐晨", pinyin: "Mù Chén", meaning: "Bathed in dawn · 沐浴晨光", source: "Nature imagery · 自然意象", personalityMatch: "Radiates the freshness and hope of morning light · 散发清晨阳光般的清新与希望" },
    { characters: "妙音", pinyin: "Miào Yīn", meaning: "Wondrous music · 妙音天籁", source: "Buddhist tradition · 佛教传统", personalityMatch: "A voice and presence as beautiful as heavenly music · 如天籁妙音般美好" },
    
    // 聪慧知性型 · Intelligent & Thoughtful
    { characters: "思颖", pinyin: "Sī Yǐng", meaning: "Thoughtful brilliance · 思辨颖悟", source: "Scholarly tradition · 学者传统", personalityMatch: "Sharp intellect with elegant insight · 思维敏锐，优雅洞察" },
    { characters: "慧心", pinyin: "Huì Xīn", meaning: "Wise heart · 慧心妙解", source: "Buddhist wisdom · 佛教智慧", personalityMatch: "The heart that sees what others miss · 洞察他人所不见的慧心" },
    { characters: "知微", pinyin: "Zhī Wēi", meaning: "Perceiving subtleties · 知微见著", source: "I Ching · 《易经》", personalityMatch: "Sees the profound in the subtle, the great in the small · 见微知著，洞察入微" },
    { characters: "睿涵", pinyin: "Ruì Hán", meaning: "Wise and cultivated · 睿智涵养", source: "Classical combination · 古典组合", personalityMatch: "Wisdom that is deep and quietly cultivated · 深沉而安静地培养的智慧" },
    { characters: "明思", pinyin: "Míng Sī", meaning: "Brilliant thinking · 明净思维", source: "Philosophical ideal · 哲学理想", personalityMatch: "Clear mind, brilliant thought · 头脑清晰，思维明敏" },
    
    // 诗意美好型 · Poetic & Beautiful
    { characters: "云舒", pinyin: "Yún Shū", meaning: "Clouds unfurling · 白云舒卷", source: "Tao Yuanming · 陶渊明'云无心以出岫'", personalityMatch: "Free and natural as clouds drifting without purpose · 自然自在，如云无心" },
    { characters: "芷若", pinyin: "Zhǐ Ruò", meaning: "Angelica fragrance · 芷若芳菲", source: "Jin Yong · 金庸《倚天屠龙记》赵敏之名", personalityMatch: "Pure fragrance of mountain herbs — wild and graceful · 山草芬芳，野性优雅" },
    { characters: "晚晴", pinyin: "Wǎn Qíng", meaning: "Evening's clarity · 晚晴温柔", source: "Li Shangyin · 李商隐《晚晴》", personalityMatch: "The serene beauty that emerges after the storm passes · 风雨后晚晴的宁静之美" },
    { characters: "月盈", pinyin: "Yuè Yíng", meaning: "Full moon · 月满盈盈", source: "Astronomical poetry · 天文诗词", personalityMatch: "Complete and luminous as a full moon · 如满月般圆满明亮" },
    { characters: "烟雨", pinyin: "Yān Yǔ", meaning: "Misty rain · 烟雨朦胧", source: "Su Shi · 苏轼'烟雨中'", personalityMatch: "Mysterious and beautiful as rain-misted mountains · 如烟雨江南般朦胧美丽" },
    
    // 大气端庄型 · Dignified & Gracious
    { characters: "婉仪", pinyin: "Wǎn Yí", meaning: "Graceful deportment · 婉约仪范", source: "Classical etiquette · 古典礼仪", personalityMatch: "Embodies grace, propriety and inner dignity · 体现优雅、得体与内在尊严" },
    { characters: "淑慧", pinyin: "Shū Huì", meaning: "Virtuous and wise · 淑德慧心", source: "Book of Songs · 《诗经》'淑德淑仪'", personalityMatch: "The rare combination of virtue and wisdom · 美德与智慧的珍贵结合" },
    { characters: "华彩", pinyin: "Huá Cǎi", meaning: "Magnificent brilliance · 华彩绽放", source: "Musical term · 音乐术语", personalityMatch: "Brilliant and magnificent, like a cadenza in full bloom · 如华彩乐段般璀璨绽放" },
    { characters: "凤仪", pinyin: "Fèng Yí", meaning: "Phoenix grace · 凤仪天下", source: "Historical name · 历史典故", personalityMatch: "The rare grace and nobility of a phoenix · 凤凰般稀有的优雅与尊贵" },
  ],
  
  neutral: [
    // 自然意境型 · Nature Inspired
    { characters: "云帆", pinyin: "Yún Fān", meaning: "Cloud sail · 云帆远航", source: "Li Bai · 李白《行路难》'直挂云帆济沧海'", personalityMatch: "Set sail with cloud-white wings to cross the vast sea · 扬帆远航，横渡苍海" },
    { characters: "星河", pinyin: "Xīng Hé", meaning: "Milky Way · 星河灿烂", source: "Classical astronomical poetry · 古典天文诗", personalityMatch: "Brilliant and limitless as the Milky Way · 如银河般灿烂无垠" },
    { characters: "晨曦", pinyin: "Chén Xī", meaning: "First light of dawn · 晨曦微光", source: "Nature imagery · 自然意象", personalityMatch: "The quiet hope of a new beginning · 新开始的静谧希望" },
    { characters: "清泉", pinyin: "Qīng Quán", meaning: "Clear spring · 清泉石上流", source: "Wang Wei · 王维《山居秋暝》", personalityMatch: "Pure and flowing like a mountain spring over stones · 如山间清泉般纯净流淌" },
    { characters: "霁月", pinyin: "Jì Yuè", meaning: "Moon after rain · 霁月清光", source: "Su Shi · 苏轼《水调歌头》", personalityMatch: "Clear and serene as moonlight after the rain clears · 如霁后月光般清澈宁静" },
    
    // 哲学意境型 · Philosophical
    { characters: "知行", pinyin: "Zhī Xíng", meaning: "Knowledge and action · 知行合一", source: "Wang Yangming · 王阳明'知行合一'", personalityMatch: "Unites knowledge and action into one — the highest ideal · 知行合一，最高境界" },
    { characters: "致远", pinyin: "Zhì Yuǎn", meaning: "Reaching far · 致远求真", source: "Zhuge Liang · 诸葛亮《诫子书》'志当存高远'", personalityMatch: "Ambition that always reaches beyond the present horizon · 志向永远超越当下" },
    { characters: "悠然", pinyin: "Yōu Rán", meaning: "Carefree serenity · 悠然自得", source: "Tao Yuanming · 陶渊明'采菊东篱下，悠然见南山'", personalityMatch: "The rare art of finding peace and joy in simplicity · 在简单中寻得宁静与快乐" },
    { characters: "涵虚", pinyin: "Hán Xū", meaning: "Embracing emptiness · 涵虚若谷", source: "Laozi · 《道德经》'上善若水'", personalityMatch: "Deep enough to contain all things, humble as a valley · 深含万物，谦逊如谷" },
    { characters: "逸飞", pinyin: "Yì Fēi", meaning: "Free and soaring · 逸兴遄飞", source: "Classical poetry · 古典诗词", personalityMatch: "Free-spirited, unrestrained, soaring beyond boundaries · 自由奔放，超越一切界限" },
    
    // 文化意象型 · Cultural Imagery
    { characters: "琴声", pinyin: "Qín Shēng", meaning: "Sound of the qin · 琴声悠扬", source: "Classical music culture · 古典音乐文化", personalityMatch: "Like qin music — refined, timeless, deeply moving · 如琴声般精致、超越时间、动人心弦" },
    { characters: "墨香", pinyin: "Mò Xiāng", meaning: "Fragrance of ink · 墨香四溢", source: "Calligraphy tradition · 书法传统", personalityMatch: "The lasting fragrance of cultured learning and art · 学问与艺术的持久芬芳" },
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
  "墨": "Mò", "书": "Shū", "哲": "Zhé", "宸": "Chén", "德": "Dé",
  "豪": "Háo", "弘": "Hóng", "峻": "Jùn", "婉": "Wǎn", "静": "Jìng",
  "姝": "Shū", "韵": "Yùn", "晓": "Xiǎo", "语": "Yǔ", "嫣": "Yān", "霖": "Lín",
  "婕": "Jié", "瑶": "Yáo", "琳": "Lín", "美": "Měi", "甜": "Tián", "馨": "Xīn",
  "婷": "Tíng", "丽": "Lì", "淑": "Shū", "仪": "Yí", "星": "Xīng",
  "辰": "Chén", "晨": "Chén", "宇": "Yǔ", "逸": "Yì",
};

export function getPinyinForChars(chars: string): string {
  return chars.split("").map(c => pinyinMap[c] || c).join(" ");
}
