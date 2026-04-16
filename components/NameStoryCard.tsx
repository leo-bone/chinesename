"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award, BookOpen } from "lucide-react";
import { usePro } from "./ProProvider";

interface NameData {
  characters: string;
  pinyin: string;
  meaning: string;
  source: string;
  personalityMatch: string;
}

interface FormData {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
}

interface NameStoryCardProps {
  name: NameData;
  formData: FormData;
  showModal?: boolean;
  onClose?: () => void;
}

export default function NameStoryCard({
  name,
  formData,
  showModal = false,
  onClose,
}: NameStoryCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { proStatus } = usePro();
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  const isLocked = !proStatus.isPro;

  useEffect(() => {
    drawCard();
  }, [name, formData]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Card dimensions - A4 ratio
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fef7f0");
    gradient.addColorStop(0.5, "#fff8f0");
    gradient.addColorStop(1, "#fef3e2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative border
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Header decoration - Bilingual
    ctx.fillStyle = "#92400e";
    ctx.font = "bold 28px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText("Chinese Name Certificate · 姓名证书", width / 2, 100);

    // Decorative line
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 130);
    ctx.lineTo(width - 250, 130);
    ctx.stroke();

    // Small decorative circles
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(250, 130, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 250, 130, 6, 0, Math.PI * 2);
    ctx.fill();

    // "Certificate of Name" label - Bilingual
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 42px 'Noto Serif SC', serif";
    ctx.fillText("姓名证书 Name Certificate", width / 2, 200);

    // Recipient - Bilingual
    ctx.fillStyle = "#451a03";
    ctx.font = "24px 'Noto Sans SC', sans-serif";
    ctx.fillText(`授予 Awarded to: ${formData.englishName}`, width / 2, 270);

    // Main name - large calligraphy
    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 180px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText(name.characters, width / 2, 460);

    // Pinyin
    ctx.fillStyle = "#78716c";
    ctx.font = "italic 32px 'Noto Sans SC', sans-serif";
    ctx.fillText(name.pinyin, width / 2, 510);

    // Meaning section - Bilingual
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.textAlign = "left";
    ctx.fillText("名字寓意 Meaning", 120, 600);

    ctx.fillStyle = "#1c1917";
    ctx.font = "22px 'Noto Sans SC', sans-serif";
    const meaningLines = wrapText(ctx, name.meaning, width - 260);
    meaningLines.forEach((line, i) => {
      ctx.fillText(line, 120, 640 + i * 32);
    });

    // Story section - Bilingual with real story
    const sourceStartY = 640 + meaningLines.length * 32 + 30;
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.fillText("名字故事 Name Story", 120, sourceStartY);

    // Generate a real story based on the name
    const story = generateNameStory(name.characters, name.pinyin, name.meaning);
    
    ctx.fillStyle = "#44403c";
    ctx.font = "18px 'Noto Serif SC', serif";
    const storyLines = wrapText(ctx, story, width - 260);
    storyLines.forEach((line, i) => {
      ctx.fillText(line, 120, sourceStartY + 40 + i * 28);
    });

    // Personality match - Bilingual
    const matchStartY = sourceStartY + 40 + storyLines.length * 28 + 30;
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.fillText("与您的契合 Why It Fits", 120, matchStartY);

    ctx.fillStyle = "#44403c";
    ctx.font = "20px 'Noto Sans SC', sans-serif";
    const matchLines = wrapText(ctx, name.personalityMatch, width - 260);
    matchLines.forEach((line, i) => {
      ctx.fillText(line, 120, matchStartY + 40 + i * 30);
    });

    // Footer decoration
    const footerY = Math.max(matchStartY + 40 + matchLines.length * 30 + 60, 1200);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, footerY);
    ctx.lineTo(width - 150, footerY);
    ctx.stroke();

    // Info row - Bilingual
    ctx.fillStyle = "#78716c";
    ctx.font = "16px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    const genderText = formData.gender === 'male' ? '男 Male' : formData.gender === 'female' ? '女 Female' : '中性 Neutral';
    ctx.fillText(`性别 Gender: ${genderText}  |  年龄 Age: ${formData.age}  |  性格 Personality: ${getPersonalityLabel(formData.personality)}`, width / 2, footerY + 35);

    // Website
    ctx.fillStyle = "#92400e";
    ctx.font = "18px 'Noto Sans SC', sans-serif";
    ctx.fillText("chinesename.uichain.org", width / 2, footerY + 70);

    // Seal/stamp
    ctx.save();
    ctx.translate(width - 180, height - 180);
    ctx.rotate(-0.2);
    
    // Outer ring
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner circle
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    // Text in seal
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("名", -20, -10);
    ctx.fillText("至", 20, -10);
    ctx.fillText("诚", -20, 25);
    ctx.fillText("品", 20, 25);
    
    ctx.restore();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split("");
    const lines: string[] = [];
    let currentLine = "";

    for (const char of words) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  const getPersonalityLabel = (p: string): string => {
    const map: Record<string, string> = {
      "ambitious-driven": "有抱负",
      "calm-peaceful": "沉稳平和",
      "creative-artistic": "创意艺术",
      "wise-thoughtful": "睿智深思",
      "energetic-outgoing": "活力外向",
      "gentle-kind": "温柔善良",
      "strong-resilient": "坚强韧性",
      "curious-intellectual": "好奇求知",
    };
    return map[p] || p;
  };

  // Generate a meaningful story for the name
  const generateNameStory = (characters: string, pinyin: string, meaning: string): string => {
    const stories: Record<string, string> = {
      // ── 男孩名 ──
      "子轩": "子，取自《论语》「君子务本，本立而道生」，喻君子之德；轩，出自《楚辞》「轩翥而翔飞兮」，喻气宇轩昂。此名承载千年儒家文化，寓意君子风度、志向高远。",
      "浩然": "出自《孟子·公孙丑上》「我善养吾浩然之气」，浩然之气指正大刚直、充塞天地的精神。此名寓意胸怀坦荡、正气凛然，是中国文人追求的至高境界。",
      "睿渊": "睿，明智也，出自《尚书》「睿作圣」；渊，深邃也，出自《诗经》「秉心塞渊，騋牝三千」。二字合璧，喻智慧深邃如渊，是魏晋名士推崇的品格。",
      "文博": "文，文采也，出自《论语》「文质彬彬，然后君子」；博，广博也，出自《荀子》「君子博学而日参省乎己」。此名体现中国传统文化对学识修养的最高重视。",
      "俊熙": "俊，才俊也，出自《荀子》「虽有圣人之知，未必不遇诸俊」；熙，光明和悦也，出自《诗经》「维清缉熙，文王之典」。寓意才貌出众、前程光明。",
      "泽楷": "泽，恩泽也，出自《孟子》「若夫润泽之，则在君与子矣」；楷，楷模也，出自《后汉书》「陈元方难为兄，郭林宗楷为人」。寓意施恩于人、堪为模范。",
      "明辉": "出自唐代李白《把酒问月》「皎如飞镜临丹阙，绿烟灭尽清辉发」。明辉即明亮的光辉，寓意才华出众、光芒四射，如皓月朗照。",
      "修杰": "修，修身也，出自《大学》「修身齐家治国平天下」；杰，俊杰也，出自《孟子》「五百年必有王者兴，其间必有名世者」。寓意修身立德、成为人中豪杰。",
      "宇航": "宇，广阔无垠，出自《淮南子》「宇宙万物」；航，出自《楚辞》「乘舲船余上沅兮」。古典意象与现代精神融合，寓意志向广阔、乘风远行。",
      "志远": "出自诸葛亮《诫子书》「非淡泊无以明志，非宁静无以致远」。志与远二字直取原文，寓意淡泊明志、宁静致远，是中国士大夫人格的精髓。",
      "嘉豪": "嘉，美好盛大，出自《诗经》「我有嘉宾，鼓瑟吹笙」；豪，豪杰也，出自《史记》「布衣之怒，亦七步之内耳」。寓意性情豪迈、举止优雅。",
      "晨曦": "晨曦出自唐代杜甫「晨曦笼万物，东升气象新」，意为清晨第一缕阳光。寓意朝气蓬勃、充满希望，每日都是崭新的开始。",
      "浩宇": "浩，浩瀚也，出自《诗经》「浩浩其流」；宇，天宇也，出自《庄子》「若夫乘天地之正，御六气之辩，以游无穷者」。寓意胸怀天地、气度恢宏。",
      "泽宇": "泽，恩泽；宇，天下。出自《孟子》「泽加于百姓，而无以奉上」，寓意恩泽广布天下，德行惠及众人，胸怀宽广如天宇。",
      "正阳": "正阳出自《周易》「大哉乾元，万物资始，乃统天。云行雨施，品物流行」，正阳为天地间最纯正的阳气。寓意刚正不阿、光明磊落。",
      "致远": "直取诸葛亮《诫子书》「非宁静无以致远」。致远意为志向远大、目光如炬。此名自古以来被众多名人所取，彰显进取之志。",
      "博文": "博文，出自《论语》「博学于文，约之以礼」。孔子教导学生广博地学习文献典籍，用礼节约束自己。寓意博学多才、知礼守节。",
      "子墨": "子，君子之称；墨，出自《礼记》「管仲之器小哉」，亦取书写之意。寓意翰墨飘香、腹有诗书，是文人雅士的理想气质。",
      "建军": "建，出自《礼记》「建国君民」；军，保家卫国。此名寓意立志建功、保家报国，铁骨铮铮、英勇无畏。",
      "俊宇": "俊，出自《管子》「俊士在学，秀士在列」；宇，出自《诗经》「有觉其楹，哙哙其正」，意广阔。寓意英俊有为、胸怀广宇。",
      "鹏飞": "出自庄子《逍遥游》「鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里」。大鹏展翅，寓意志向高远、一飞冲天。",
      "翰林": "翰，文翰也，出自《诗经》「维鸠在桑，其子在梅」；林，书林也，出自《文选》。翰林为中国最高学府之名，寓意博学多才、文章华美。",
      "凌云": "出自苏轼《和董传留别》「粗缯大布裹生涯，腹有诗书气自华。厌伴老儒烹瓠叶，强随举子踏槐花」，凌云意为凌驾云端。寓意志存凌云、傲视苍穹。",
      "嘉明": "嘉，美好也；明，光明也。出自《诗经》「维其嘉矣」及《周易》「明明德」。寓意品德美好、光明磊落，是儒家君子的理想人格写照。",
      "永乐": "永，长久也；乐，欢乐也。出自《论语》「学而时习之，不亦说乎？有朋自远方来，不亦乐乎？」。寓意长久欢乐、生活美满。",
      // ── 女孩名 ──
      "诗涵": "诗，《诗经》也，中国第一部诗歌总集，「诗三百，一言以蔽之，思无邪」；涵，涵养也，出自《诗经》「涵煦之泽」。此名寓意腹有诗书、气质如兰，是书香门第的首选。",
      "雅琪": "雅，高雅也，出自《诗经》「雅者，正也，言王政之所由废兴也」；琪，美玉也，出自《山海经》「服常树，其上有三头人，伺琪树」。寓意高雅如玉、温润而泽。",
      "梦琪": "梦，出自《庄子·齐物论》「昔者庄周梦为胡蝶，栩栩然胡蝶也」；琪，美玉也。此名融合道家浪漫与儒家温润，寓意美梦成真、珍贵如玉。",
      "雨萱": "雨，甘霖也，出自《诗经》「雨雪霏霏，杨柳依依」；萱，萱草也，古称忘忧草，出自《诗经》「焉得谖草，言树之背」。寓意如春雨般滋润、带来欢乐无忧。",
      "欣怡": "欣，喜悦也，出自《诗经》「有女同车，颜如舜华」；怡，和悦也，出自《论语》「君子坦荡荡，小人长戚戚」。寓意欢欣喜悦、怡然自乐。",
      "思颖": "思，出自《论语》「学而不思则罔，思而不学则殆」；颖，聪颖出众也，出自《史记》「毛遂自荐，颖脱而出」。寓意聪慧善思、才思敏捷。",
      "佳怡": "佳，美好也，出自《楚辞》「佳人不同体，美人不同面」；怡，愉悦也，出自《论语》「三十而立，四十而不惑」。寓意美好愉悦、令人赏心悦目。",
      "若曦": "若，如也；曦，晨光也，出自《楚辞》「若丽姬之扬衣兮」。寓意如清晨第一缕阳光，温暖而充满希望，照亮一切。",
      "梓涵": "梓，梓树也，古代庭院常植，出自《诗经》「维桑与梓，必恭敬止」，梓代表家园；涵，涵养也。寓意心怀故土、品德高洁。",
      "嘉怡": "嘉，出自《诗经》「我有嘉宾，鼓瑟吹笙」；怡，和悦也。寓意美好怡人、令人如沐春风，是贵宾之气质。",
      "语嫣": "语，出自《诗经》「巧言如簧，颜之厚矣」，嫣，出自《楚辞》「美目盼兮，巧笑嫣兮」。寓意谈吐优雅、巧笑嫣然，是才女风范。",
      "晓燕": "晓，晨曦也，出自《诗经》「东方明矣，朝既昌矣」；燕，出自《诗经》「燕燕于飞，差池其羽」。寓意清晨燕飞，活泼灵动、充满朝气。",
      "芷若": "芷，白芷也，香草之一，出自《楚辞》「扈江离与辟芷兮，纫秋兰以为佩」；若，出自屈原「若有人兮山之阿，被薜荔兮带女萝」。寓意清香高洁、如兰似芷。",
      "婉清": "婉，柔顺貌，出自《诗经》「有美一人，婉如清扬」；清，清雅也，出自《楚辞》「清洁精忠，形魄不亏」。寓意温婉清雅、内外兼修。",
      "紫萱": "紫，高贵之色，出自《礼记》；萱，忘忧草，出自《诗经》「焉得谖草」，古代以此草赠母，象征母爱。寓意高贵典雅、幸福无忧。",
      "思雨": "思，出自《诗经》「关关雎鸠，在河之洲。窈窕淑女，君子好逑」；雨，甘霖也。寓意温柔如雨、体贴入微，是滋润他人心灵的温暖存在。",
      "莫愁": "莫愁出自南朝乐府《莫愁乐》「莫愁在何处？莫愁石城西。艇子打两桨，催送莫愁来」。莫愁是历史上著名的佳人，寓意无忧无虑、美丽大方。",
      "婉仪": "婉，温婉也；仪，仪态也，出自《诗经》「之子于归，宜其室家」及《礼记》「礼义廉耻」。寓意仪态端庄、温婉可人，是大家闺秀的气质。",
      "雅兰": "雅，高雅也；兰，出自《楚辞》「余既滋兰之九畹兮，又树蕙之百亩」，兰花是高洁品格的象征。寓意高雅如兰、清香自远。",
      "子涵": "子，出自《论语》「三人行，必有我师焉」；涵，涵养也，出自《孟子》「仁者爱人」。寓意涵养深厚、仁爱待人，是儒家女性美德的体现。",
      "可欣": "可，出自《论语》「可以为师矣」；欣，喜悦也，出自《诗经》「心之忧矣，如匪澣衣」。寓意令人欢欣、心情愉悦，给周围人带来快乐。",
      "欢颜": "出自李白《将进酒》「人生得意须尽欢，莫使金樽空对月」及「呼儿将出换美酒，与尔同销万古愁」。欢颜寓意常带笑容、乐观豁达。",
      "晴雯": "晴，晴天也，出自唐代「雨过天晴云破处，者般颜色做将来」；雯，彩云也，出自《楚辞》。二字合用出自《红楼梦》，寓意灵动率真、光彩照人。",
      "春华": "出自曹操《善哉行》「春华竞芳，五色凌素」。春华意为春天的花朵，寓意青春美丽、如花绽放，朝气蓬勃、绚丽多彩。",
      "秋韵": "秋，出自《诗经》「秋日凄凄，百卉具腓」；韵，出自苏轼「横看成岭侧成峰，远近高低各不同」。寓意如秋天般成熟优雅、气韵深长。",
      // ── 中性名 ──
      "文轩": "文，文采也，出自《论语》「郁郁乎文哉，吾从周」；轩，高扬也，出自《楚辞》「轩翥而翔飞兮，彼日月之照明」。寓意文采飞扬、气宇不凡。",
      "明远": "出自诸葛亮《诫子书》「非淡泊无以明志，非宁静无以致远」。明远二字直取原文，寓意志向远大、目光长远，是历代书生的座右铭。",
      "思远": "出自《诗经·采薇》「昔我往矣，杨柳依依；今我来思，雨雪霏霏」。思远寓意思虑深远、志存高远，怀有远大的理想和抱负。",
      "清扬": "出自《诗经·郑风·野有蔓草》「有美一人，清扬婉兮，邂逅相遇，适我愿兮」。清扬形容眉目清秀、神采飞扬，是诗经中最美丽的描写之一。",
      "云帆": "出自李白《行路难》「长风破浪会有时，直挂云帆济沧海」。云帆意为高挂云际的帆船，寓意乘风破浪、勇往直前，前途无量。",
      "景行": "出自《诗经·小雅·车辖》「高山仰止，景行行止」，景行意为高尚的行为准则。寓意德行高尚、令人敬仰，堪为世人楷模。",
      "晨辉": "晨，清晨也；辉，光辉也，出自《楚辞》「沐兰泽，含若芳，清晨辉兮」。晨辉寓意清晨的第一缕阳光，象征希望、朝气与无限可能。",
      "嘉华": "嘉，出自《诗经》「我有嘉宾，鼓瑟吹笙」；华，出自《诗经》「华之荣兮」，意为华美繁盛。寓意美好繁华、风华正茂。",
      "书航": "书，出自《论语》「学而时习之」；航，出自《楚辞》「乘舲船余上沅兮，齐吴榜以击汰」。寓意以书为帆、航向远方，学识是人生最好的船。",
      "乐天": "出自白居易《初入峡有感》「峡里谁知有人事，地中先作打钟声」，白居易字乐天。乐天意为乐观豁达、顺应自然，是中国文人的最高人生境界。",
      "贤明": "贤，贤能也，出自《论语》「见贤思齐焉，见不贤而内自省也」；明，明智也，出自《大学》「明明德，亲民，止于至善」。寓意贤能明智、德才兼备。",
      "正阳": "正阳出自《周易·乾卦》「乾，元亨利贞」，正阳为天地间最纯正刚健的阳气。寓意刚正不阿、光明磊落，如日中天、充满正气。",
      "子晴": "子，出自《论语》「子曰：吾日三省吾身」；晴，出自苏轼《饮湖上初晴后雨》「晴方好雨亦奇，若把西湖比西子」。寓意心境晴朗、明媚开朗。",
      "明珠": "出自《周易》「明夷，利艰贞」及民间俗语「掌上明珠」。明珠意为光明的珍珠，是父母对孩子的最深爱称，寓意珍贵无比、熠熠生辉。",
      "致远": "直取诸葛亮《诫子书》「非宁静无以致远」。致远意为志向高远、追求卓越。此名寓意脚踏实地，终能致于远方，达到人生至高境界。",
      "博远": "博，博学也，出自《论语》「博学于文，约之以礼」；远，高远也，出自诸葛亮《诫子书》。寓意学识渊博、志向高远，博古通今、见识超群。",
      "乾坤": "乾坤出自《周易》「乾为天，坤为地，乾坤定矣」，代表天地阴阳之道。此名寓意胸怀天地、气度非凡，掌握乾坤、运筹帷幄。",
      "以恒": "出自《论语》「人而无恒，不可以作巫医」及曾国藩名言「有志，有识，有恒」。以恒意为持之以恒、锲而不舍，是成功最重要的品质。",
      "子正": "子，君子；正，正直也，出自《论语》「其身正，不令而行；其身不正，虽令不从」。寓意品行端正、堂堂正正，是儒家君子人格的核心。",
      "嘉琪": "嘉，美好也，出自《诗经》「我有嘉宾，德音孔昭」；琪，美玉也，出自《山海经》。寓意美好如玉、品德高尚，是德才兼备的君子之名。",
      "宁远": "宁，宁静也，出自诸葛亮《诫子书》「静以修身，俭以养德，非宁静无以致远」；远，志远也。宁远二字出自原文，寓意宁静致远、不浮躁。",
      "承志": "承，承担也；志，志向也，出自诸葛亮《诫子书》「夫学须静也，才须学也，非学无以广才，非志无以成学」。寓意继承先志、立志成才。",
      "昭华": "昭，光明昭彰；华，华美也，出自《诗经》「月出皎兮，佼人僚兮」及「华之荣兮」。寓意光彩照人、风华绝代，名扬四海。",
      "嘉祺": "嘉，美好也；祺，吉祥也，出自《诗经》「受天之祜，四方来贺」。寓意美好吉祥、福泽深厚，是传统中国对孩子最美好的祝愿。",
      "振华": "振，奋发也，出自《论语》「博学而笃志，切问而近思」；华，华美繁盛也。寓意奋发图强、振兴中华，是爱国豪情与个人理想的融合。",
      "文远": "文，文采也，出自《论语》「文质彬彬，然后君子」；远，志远也，出自《荀子》「目不能两视而明，耳不能两听而聪」。寓意文采斐然、志向高远。",
      "思齐": "出自《论语》「见贤思齐焉，见不贤而内自省也」。思齐意为见到贤德之人就向他学习，是孔子最重要的修身之道，寓意积极向上、不断完善。",
      "慕远": "慕，仰慕也，出自《诗经》「高山仰止，景行行止」；远，高远也。寓意心慕高远、志向广阔，仰慕君子德行，自强不息。",
    };
    
    // 单字名查询
    const singleCharStories: Record<string, string> = {
      "轩": "出自《楚辞》「轩翥而翔飞兮，彼日月之照明」，意为气宇轩昂、飞翔高远。",
      "博": "出自《论语》「博学于文，约之以礼」，意为学识广博、博古通今。",
      "熙": "出自《诗经》「维清缉熙，文王之典」，意为光明和悦、前途熙熙。",
      "远": "出自诸葛亮《诫子书》「非宁静无以致远」，意为志向高远。",
      "明": "出自《大学》「大学之道，在明明德」，意为光明正大、明智睿智。",
      "华": "出自《诗经》「华之荣兮」，意为华美繁盛、风华正茂。",
      "辉": "出自李白「皎如飞镜临丹阙，绿烟灭尽清辉发」，意为光辉灿烂。",
      "涵": "出自《诗经》「涵煦之泽」，意为涵养深厚、包容万物。",
      "怡": "出自《论语》「怡然自得」，意为心情愉悦、怡然自乐。",
      "琪": "出自《山海经》，美玉之称，意为温润如玉、珍贵稀有。",
      "萱": "萱草即忘忧草，出自《诗经》「焉得谖草，言树之背」，意为无忧无虑。",
      "颖": "出自《史记》「毛遂自荐，颖脱而出」，意为才思敏捷、出类拔萃。",
      "诗": "出自《论语》「诗三百，一言以蔽之，思无邪」，意为文雅有诗意。",
      "雅": "出自《诗经》「雅者，正也」，意为高雅正直、品味出众。",
    };

    // Return specific story if exists
    if (stories[characters]) {
      return stories[characters];
    }
    
    // Try single characters
    for (const char of characters.split("")) {
      if (singleCharStories[char]) {
        return `"${char}"${singleCharStories[char]} 此名「${characters}」${meaning}，融合中国传统文化精髓，每个汉字都承载着千年文化积淀，既有古典韵味，又具现代气息。`;
      }
    }
    
    // Generic story based on meaning
    return `「${characters}」，${meaning}。此名融合中国传统文化精髓，每个汉字都承载着千年文化积淀。中国古人为子女取名，讲究「名以正体，字以表德」，此名既有古典韵味，又具现代气息，是为您的独特气质量身定制的佳名，寄托着深厚的文化祝愿。`;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${name.characters}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], "certificate.png", { type: "image/png" })] })) {
        await navigator.share({
          title: `My Chinese Name: ${name.characters}`,
          text: `I just got my Chinese name "${name.characters}" (${name.pinyin})! Get yours at chinesename.uichain.org`,
          files: [new File([blob], "certificate.png", { type: "image/png" })],
        });
      } else {
        // Fallback: download
        handleDownload();
      }
    } catch (err) {
      console.log("Share cancelled or failed");
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (isLocked) {
    return (
      <Card className="p-6 bg-stone-50 border-stone-200">
        <div className="text-center py-8">
          <Award className="w-12 h-12 mx-auto mb-4 text-stone-400" />
          <h3 className="text-lg font-semibold text-stone-700 mb-2">Name Story Card</h3>
          <p className="text-sm text-stone-500 mb-4">Unlock Pro to create beautiful name certificates</p>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Unlock Pro Features
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-stone-200">
      <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-amber-600" />
        Name Story Card
      </h3>

      <p className="text-sm text-stone-600 mb-4">
        Create a beautiful certificate for your name that you can share or print
      </p>

      {/* Canvas Preview */}
      <div className="relative bg-stone-100 rounded-lg overflow-hidden mb-4">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-red-800 hover:bg-red-900 text-white"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloaded ? "Saved!" : "Save Card"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-stone-300"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {shared ? "Shared!" : "Share"}
        </Button>
      </div>
    </Card>
  );
}
