import {
  FairyTale,
  ChildProfile,
  ReadingHistory,
  ParentSettings,
} from "./types";

export const initialProfiles: ChildProfile[] = [
  {
    name: "김첫째",
    age: 6,
    gender: "male",
    interests: ["한옥", "바다", "동물", "도깨비"],
    readingTendency: {
      length: "medium",
      speed: "medium",
      style: "balanced",
    },
  },
  {
    name: "김둘째",
    age: 3,
    gender: "female",
    interests: ["동물", "꽃", "우주"],
    readingTendency: {
      length: "very_short",
      speed: "slow",
      style: "more_illustrations",
    },
  },
];

export const defaultSettings: ParentSettings = {
  filterEnabled: true,
  filterIntensity: "medium",
  ageRange: { min: 2, max: 9 },
  approvalRequired: true,
  playtimeLimit: 45,
  playtimeLimitEnabled: true,
};

// Helper to safely convert UTF-8 strings to Base64 in any browser environment
function toBase64(str: string): string {
  const utf8Bytes = encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    },
  );
  return btoa(utf8Bytes);
}

// Procedural illustrator SVGs for classic books:
const rabbitForestSvg = `data:image/svg+xml;base64,${toBase64(
  `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#EBF9F7" />
  <circle cx="400" cy="200" r="280" fill="#FFF2F6" opacity="0.4"/>
  <path d="M-100 450 Q300 280 600 410 T1100 380 L1100 450 Z" fill="#7ECEC4" opacity="0.3" />
  <path d="M-50 450 Q200 240 500 340 T1000 320 L1000 450 Z" fill="#FF6B9D" opacity="0.1" />
  <circle cx="150" cy="120" r="40" fill="#FFD93D" opacity="0.8"/>
  <circle cx="150" cy="120" r="50" fill="#FFD93D" opacity="0.3"/>
  <g transform="translate(400, 240)">
    <ellipse cx="0" cy="20" rx="35" ry="50" fill="#FFF" stroke="#DDD" stroke-width="2"/>
    <ellipse cx="0" cy="-45" rx="30" ry="30" fill="#FFF" stroke="#DDD" stroke-width="2"/>
    <ellipse cx="-12" cy="-90" rx="8" ry="25" fill="#FFF" stroke="#DDD" stroke-width="2" transform="rotate(-10, -12, -90)"/>
    <ellipse cx="12" cy="-90" rx="8" ry="25" fill="#FFF" stroke="#DDD" stroke-width="2" transform="rotate(10, 12, -90)"/>
    <ellipse cx="-12" cy="-90" rx="4" ry="18" fill="#FFB7D5" transform="rotate(-10, -12, -90)"/>
    <ellipse cx="12" cy="-90" rx="4" ry="18" fill="#FFB7D5" transform="rotate(10, 12, -90)"/>
    <circle cx="-10" cy="-48" r="4" fill="#333"/>
    <circle cx="10" cy="-48" r="4" fill="#333"/>
    <circle cx="-18" cy="-40" r="5" fill="#FFB7D5" opacity="0.7"/>
    <circle cx="18" cy="-40" r="5" fill="#FFB7D5" opacity="0.7"/>
    <path d="M-4 -38 Q0 -34 4 -38" fill="none" stroke="#E25C80" stroke-width="3" stroke-linecap="round"/>
  </g>
  <text x="400" y="380" font-family="sans-serif" font-weight="bold" font-size="28" fill="#2C3E50" text-anchor="middle">토끼와 별빛 숲</text>
</svg>
`.trim(),
)}`;

const sleepingBeautySvg = `data:image/svg+xml;base64,${toBase64(
  `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#FFF0F5" />
  <circle cx="400" cy="220" r="260" fill="#F4F0FF" opacity="0.6"/>
  <path d="M-100 450 Q300 280 600 410 T1100 380 L1100 450 Z" fill="#C9B1FF" opacity="0.2" />
  <path d="M-50 450 Q200 240 500 350 T1000 320 L1000 450 Z" fill="#FF6B9D" opacity="0.15" />
  <g transform="translate(400, 200)">
    <rect x="-80" y="-30" width="160" height="12" rx="6" fill="#F0C2C9" />
    <circle cx="0" cy="-35" r="32" fill="#FFE2C1" />
    <path d="M-32 -35 C-32 -65 32 -65 32 -35 Z" fill="#FFB347" />
    <circle cx="-10" cy="-35" r="3.5" fill="#333" />
    <circle cx="10" cy="-35" r="3.5" fill="#333" />
    <path d="M-5 -25 Q0 -20 5 -25" fill="none" stroke="#FF6B9D" stroke-width="3" stroke-linecap="round" />
  </g>
  <text x="400" y="380" font-family="sans-serif" font-weight="bold" font-size="28" fill="#2C3E50" text-anchor="middle">잠자는 숲속의 공주</text>
</svg>
`.trim(),
)}`;

const cinderellaSvg = `data:image/svg+xml;base64,${toBase64(
  `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#F0F4FF" />
  <circle cx="400" cy="200" r="240" fill="#E6EEFF" />
  <path d="M-50 450 Q300 250 600 390 T1100 350 L1100 450 Z" fill="#7ECEC4" opacity="0.2" />
  <g transform="translate(400, 190)">
    <path d="M-30 40 L30 40 L45 90 L-45 90 Z" fill="#A4C2F4" stroke="#FFF" stroke-width="2" />
    <circle cx="0" cy="-5" r="30" fill="#FFE2C1" />
    <ellipse cx="0" cy="-40" rx="35" ry="15" fill="#F5B2D1" />
    <circle cx="-10" cy="-5" r="3.5" fill="#333"/>
    <circle cx="10" cy="-5" r="3.5" fill="#333"/>
    <path d="M-6 8 Q0 13 6 8" fill="none" stroke="#E25C80" stroke-width="3" stroke-linecap="round"/>
  </g>
  <text x="400" y="380" font-family="sans-serif" font-weight="bold" font-size="28" fill="#2C3E50" text-anchor="middle">신데렐라</text>
</svg>
`.trim(),
)}`;

const tortoiseRabbitSvg = `data:image/svg+xml;base64,${toBase64(
  `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#FFFEE6" />
  <path d="M-100 450 Q300 240 600 420 T1100 360 L1100 450 Z" fill="#7ECEC4" opacity="0.4" />
  <g transform="translate(300, 260)">
    <ellipse cx="0" cy="10" rx="40" ry="25" fill="#9CD095" stroke="#333" stroke-width="2"/>
    <path d="M-30 -5 Q-10 -30 20 -15" fill="none" stroke="#7CB075" stroke-width="4" />
    <circle cx="45" cy="0" r="14" fill="#C5E3B9" stroke="#333" stroke-width="2"/>
    <circle cx="48" cy="-4" r="2.5" fill="#333"/>
  </g>
  <g transform="translate(500, 230)">
    <ellipse cx="0" cy="15" rx="20" ry="32" fill="#FFF" stroke="#DDD" stroke-width="1.5"/>
    <ellipse cx="0" cy="-20" rx="18" ry="18" fill="#FFF" stroke="#DDD" stroke-width="1.5"/>
    <ellipse cx="-6" cy="-48" rx="5" ry="15" fill="#FFF" stroke="#DDD" stroke-width="1.5" transform="rotate(-10)"/>
    <ellipse cx="6" cy="-48" rx="5" ry="15" fill="#FFF" stroke="#DDD" stroke-width="1.5" transform="rotate(10)"/>
  </g>
  <text x="400" y="380" font-family="sans-serif" font-weight="bold" font-size="28" fill="#2C3E50" text-anchor="middle">토끼와 거북이</text>
</svg>
`.trim(),
)}`;

export const defaultFairytales: FairyTale[] = [
  {
    id: "classic-1",
    titleKo: "토끼와 별빛 숲 (스태프 추천)",
    titleEn: "Tori and the Starry Forest",
    titleJp: "トビと星空の森",
    titleCn: "托比与星光森林",
    titleEs: "Tori y el Bosque de las Estrellas",
    protagonist: "토리",
    age: 6,
    theme: "우정",
    style: "수채화",
    createdAt: "2026-06-01",
    isCustom: false,
    scenes: [
      {
        pageNum: 1,
        narrativeKo:
          "오늘 밤, 작은 토끼 토리는 별빛이 반짝이는 숲 속으로 첫 발걸음을 내디뎠어요. 나뭇잎 사이로 쏟아지는 달빛이 길을 밝혀 주었고, 어디선가 반딧불이 하나가 앞장 서 날기 시작했어요.",
        narrativeEn:
          "Tonight, a tiny rabbit named Tori took her very first steps into the starry, shimmering forest. Moonlight filtered through soft green leaves, lighting up her path, while a bright firefly began flying ahead.",
        narrativeJp:
          "今夜、小さなウサギのトリは、星空輝く森へと初めての一歩を踏み出しました。木の葉の間から差し込む月光が道を照らし、どこからか一匹のホタルが先頭に立って飛び始めました。",
        narrativeCn:
          "今晚，小兔子托比迈出了它走向星光森林的第一步。月光穿过树叶洒下来，照亮了它前行的道路，一只不知从哪飞来的萤火虫开始在前面带路。",
        narrativeEs:
          "Esta noche, la pequeña coneja Tori dio sus primeros pasos en el bosque estrellado. La luz de la luna se filtraba entre las hojas de los árboles iluminando su camino, y una luciérnaga comenzó a guiarla.",
        emotion: "호기심",
        visualPrompt:
          "Magical glowing forest at night, small cute fluffy rabbit with big ears looking up at glowing yellow fireflies, soft colorful watercolor illustration, dreamy.",
        imageUrl: rabbitForestSvg,
      },
      {
        pageNum: 2,
        narrativeKo:
          "한참을 걷던 토리는 소나무 밑 덤불에 날개가 끼어 오도 가도 못하는 요정 블링이를 발견했어요. 블링이는 소리 없이 울먹이며 도움의 손길을 간절히 바라고 있었답니다.",
        narrativeEn:
          "After walking for a while, Tori found a glowing fairy named Bling whose shiny wing was trapped in the pine bush. Bling was soft-crying, eagerly hoping for some help.",
        narrativeJp:
          "しばらく歩くと、トリは松の木の茂みに羽が挟まって動けなくなっている妖精ブリンイを見つけました。ブリンイは静かに泣きながら、助けてくれるのを待っていました。",
        narrativeCn:
          "走了一会儿，托比发现一只名叫Bling的小仙女，它的翅膀卡在松树丛里。Bling正无声地哭泣着，渴望得到帮助。",
        narrativeEs:
          "Después de caminar un rato, Tori encontró a un hada brillante llamada Bling, cuya ala estaba atrapada en un arbusto. Bling lloraba en silencio, esperando que alguien la ayudara.",
        emotion: "슬픔",
        visualPrompt:
          "Cute shiny pocket-sized fairy crying because her wing is stuck under pine branches, detailed cute watercolor illustration.",
        imageUrl: rabbitForestSvg,
      },
      {
        pageNum: 3,
        narrativeKo:
          "토리는 두근거렸지만 용기를 내었어요! 주위의 마른 솔가지들을 조금씩 치우고 조심스럽게 마법 가루 덤불을 들어 올렸지요. 마침내 자유롭게 풀려난 블링이는 너무 기뻐 하늘로 날아갔어요.",
        narrativeEn:
          "Tori's heart beat fast, but she gathered her courage! She slowly removed the dry pine twigs and lifted the magic bush. Finally freed, Bling flew high up into the clouds in raw joy.",
        narrativeJp:
          "トリはドキドキしましたが、勇気を出しました！周りの松の枝を一つずつ片づけ、静かに魔法の茂みを持ち上げました。ついに自由になったブリンイは嬉しさのあまり大空へ舞い上がりました。",
        narrativeCn:
          "托比的心怦怦直跳，但它鼓起了勇气！它一点点搬开干枯的松枝，小心翼翼地抬起魔法灌木。终于获得自由防Bling高兴得飞上了天空。",
        narrativeEs:
          "¡El corazón de Tori latía con fuerza, pero se armó de valor! Apartó las ramas secas y levantó el arbusto mágico. Finalmente libre, Bling voló felizmente por el cielo.",
        emotion: "용기",
        visualPrompt:
          "Very cute round rabbit carefully helping a tiny glowing fairy out of a pine bush, radiant colors, comforting sweet kids story style.",
        imageUrl: rabbitForestSvg,
      },
      {
        pageNum: 4,
        narrativeKo:
          '하늘 꽃을 그리며 둥글게 원형 비행을 하던 블링이가 웃으며 말했어요. "고마워 토리야! 영원한 우리의 우정의 징표로, 너에게 빛나는 꿈결 마법 리본을 보낼게!" 리본은 토리의 목에 사뿐 내려앉아 환한 미소 광채를 피웠어요.',
        narrativeEn:
          "Flying in circular patterns generating sparkles, Bling smiled and said: 'Thank you, Tori! As a token of our everlasting friendship, I give you a glowing dream-ribbon!' The ribbon landed softly around Tori's neck, illuminating her face.",
        narrativeJp:
          "空中を円を描くように飛び回りながらブリンイは笑って言いました。「ありがとう、トリ！私たちの永遠の友情の証に、光り輝く夢のリボンをあげるね！」リボンはトリの首元に優しく留まり、輝きました。",
        narrativeCn:
          "Bling在空中飞了一圈撒下光芒，笑着说：'谢谢你，托比！作为我们永恒友谊的见证，送给你这条闪烁的梦幻丝带！' 丝带轻柔地落在托比的脖子上，露出了灿烂的光芒。",
        narrativeEs:
          "Bling, volando en círculos mágicos, sonrió y dijo: '¡Gracias, Tori! Como muestra de nuestra amistad eterna, ¡te regalo una cinta mágica de ensueño!' La cinta se posó suavemente en el cuello de Tori.",
        emotion: "기쁨",
        visualPrompt:
          "Magic glowing pink ribbon being wrapped around a cute small fluffy white bunny's neck by a glowing tiny fairy, happy forest background.",
        imageUrl: rabbitForestSvg,
      },
      {
        pageNum: 5,
        narrativeKo:
          "집으로 훈훈하게 복귀한 토리는 따스한 담요 안에서 꿀맛 같은 꿀잠을 청했어요. 꿈속에서도 블링이와 밤하늘 너머 은하수 강을 신나게 달리며 영원히 마음속 우정을 지키자고 약속했답니다.",
        narrativeEn:
          "Returning to her cozy nest, Tori snuggled under her warm blanket and fell into a sweet, peaceful sleep. In her dreams, she ran along the Milky Way with Bling, promising to keep their friendship forever.",
        narrativeJp:
          "温かい我が家に帰ったトリは、ふわふわの毛布の中で気持ちいい眠りにつきました。夢の中でもブリンイと天の川の上を走り回りながら、永遠の友情を約束しました。",
        narrativeCn:
          "回到温暖小巢的托比钻在被窝里甜甜地睡着了。在梦里，它和Bling一起在银河中快乐地奔跑，并许下誓言，要永远珍惜彼此的温暖友谊。",
        narrativeEs:
          "Al regresar a su madriguera, Tori se acurrucó bajo su manta y se durmió plácidamente. En sus sueños, corría con Bling por la Vía Láctea, prometiendo ser siempre amigas.",
        emotion: "안도",
        visualPrompt:
          "Cozy warm bedroom of a little rabbit sleeping sweet in a tiny bed under soft pink blankets, stars outside the window, nostalgic childrens book watercolor.",
        imageUrl: rabbitForestSvg,
      },
    ],
    activities: {
      comprehension: {
        question:
          "토끼 토리가 별빛 가득한 모험의 첫 머리에서 나무 덤불 뒤에서 우연하게 발견한 곤경에 처한 친구는 누구인가요?",
        correctAnswer:
          "조그마하고 영롱한 날개가 마른 솔가지에 무겁게 끼어 울고 있던 날개 요정 블링이였습니다.",
      },
      emotion: {
        question:
          "토끼 토리가 가엽고 무섭지만 용기를 낼 때, 여러분은 마음속에 어떤 따스한 온도가 피어올랐나요?",
        options: [
          {
            emotion: "슬픔",
            description:
              "요정 파닥이가 혼자서 아파하며 떨었을 시간을 아끼며 살포시 슬퍼집니다.",
          },
          {
            emotion: "공감",
            description:
              "도움이 절실한 작은 가슴들을 외면하지 않고 손 구슬땀을 보탠 마음에 깊게 공감해요.",
          },
          {
            emotion: "두려움",
            description:
              "어두운 가시덩굴 덤불 숲이라 처음 솔가지를 헤칠 때는 살짝 두려움도 상상돼요.",
          },
          {
            emotion: "안도",
            description:
              "빛나는 목걸이 리본을 전해 받아 온 집을 아늑한 불꽃으로 밝힐 때 깊은 안도가 스며요.",
          },
          {
            emotion: "궁금함",
            description:
              "꿈속에서 지나 보낸 오로라 무지개 강가에서 무슨 소원의 놀이를 나눴는지 참 궁금해요.",
          },
        ],
      },
      creative: {
        baseTitle: "은하수 정원의 아기곰과 수수께끼",
        baseSummary:
          "요정 블링이가 살고 있는 별빛 섬에는 은하수를 매일 가꾸는 귀여운 밤빛 아기곰 부리가 살고 있어요. 주인공은 아기곰 돌보기 대장이 됩니다.",
        contextPrompt:
          "별빛 요정을 영웅처럼 지켜준 뒤, 다음 우주 정원에서 만날 마법의 씨앗에 얽힌 이야기를 상상하며 기발한 글을 남겨 주세요.",
      },
      vocabulary: {
        cards: [
          {
            word: "호기심",
            definition:
              "새롭고 신비한 세계를 가슴 깊이 신기하게 여기고 흥미를 가지는 맑은 마음.",
            example:
              "아기 호랑이는 처음 태어난 숲의 나비들을 신기하게도 호기심 있는 눈초리로 바라보며 구경합니다.",
          },
          {
            word: "덤불",
            definition:
              "작은 들풀과 가시나무 가지만 지저분하게 뒤엉켜 있는 우거진 풀숲더미.",
            example:
              "수풀 덤불 뒤에서 알록달록 무늬 가득한 장난 가득 아기 고양이가 빼꼼히 고개를 드러냈어요.",
          },
          {
            word: "용기",
            definition:
              "어둡거나 어려운 상황이 도사려도 주저앉지 않고 씩씩하게 일어스는 굳세고 당당한 마음.",
            example:
              "바람이 거세게 강가에 불어 닥쳐 무서웠지만, 어린 사슴은 용기를 다해 무지개 다리를 건넜어요.",
          },
          {
            word: "우정",
            definition:
              "누구보다 아끼며 함께 정을 나누고 든든한 등불이 되어주고 보살펴 주는 친구 사이의 돈독한 정.",
            example:
              "생쥐 보리와 소 보송이는 가을 사과를 단짝처럼 즐겨 나누며 아름답고 든든한 우정을 이어갑니다.",
          },
          {
            word: "안도",
            definition:
              "불안하고 조바심 치던 답답함이 다뜻하고 안전하게 해소되어 가슴속에 편안함이 가득 담기는 기분.",
            example:
              "어두운 소나기가 걷히고 지평선에 무지개가 부드럽게 펼쳐지자 양떼들은 안도의 기쁨에 우짖었답니다.",
          },
          {
            word: "광채",
            definition:
              "눈이 부시도록 밤낮 밝고 맑고 투명하게 사방으로 무지개처럼 고운 빛이 반짝이는 빛줄기.",
            example:
              "별똥별이 까만 밤하늘 한가운데를 비스듬히 가로지르자 찬란한 우주 광채가 사위에 흔들렸어요.",
          },
        ],
        quiz: [
          {
            sentenceWithBlank:
              "작은 고양이 레오가 낯선 보물 지도를 탐구할 때 두 눈에 ______이 넘실거렸어요.",
            blankWord: "호기심",
            clue: "새롭고 신기함을 가슴 깊이 사모하며 찾으려 하는 귀여운 마음",
          },
          {
            sentenceWithBlank:
              "사슴이 다쳐서 울고 있을 때 다가가는 씩씩하고 단란한 ______의 큰 가슴이 필요합니다.",
            blankWord: "용기",
            clue: "겁이 없고 어려움을 이겨내며 헤개해 가려 돌파하는 든든한 용력",
          },
          {
            sentenceWithBlank:
              "폭풍우가 무지개 햇덩이 뒤로 가라앉자 다람쥐는 소나무 품에서 커다란 ______의 한숨을 내쉬었어요.",
            blankWord: "안도",
            clue: "마음이 위태롭지 않고 조용히 조용하게 가라앉아 쉼을 타는 안신",
          },
        ],
      },
    },
  },
  {
    id: "classic-2",
    titleKo: "잠자는 숲속의 공주 (클래식)",
    titleEn: "The Sleeping Princess in the Woods",
    titleJp: "ねむれる森の美女",
    titleCn: "睡美人",
    titleEs: "La Bella Durmiente en el Bosque",
    protagonist: "장미공주",
    age: 5,
    theme: "가족",
    style: "동화풍 일러스트",
    createdAt: "2026-06-03",
    isCustom: false,
    scenes: [
      {
        pageNum: 1,
        narrativeKo:
          "깊은 장미 성에 눈부시도록 이쁜 공주님이 온 세상 가족들의 축복 속에 태어났어요. 온 나라의 요정들이 찾아와 저마다 행복과 명예의 은빛 선물을 축하 축제 속에 선사했어요.",
        narrativeEn:
          "In a beautiful rose castle, a radiant princess was born under the warm blessings of her family. Fairies from all over the kingdom gathered, bestowing gifts of silver hope.",
        narrativeJp:
          "深い薔薇の城に、眩しいほど美しいお姫様が、家族全員の祝福の中で誕生しました。国中の妖精たちが集まり、お祝いしました。",
        narrativeCn:
          "在玫瑰城堡的深处，一位耀眼的公主在所有家人的祝福中诞生了。全国的仙女们都赶来，在香气扑鼻的宴会中致以银色希望的礼物。",
        narrativeEs:
          "En un castillo rodeado de rosas, una princesa radiante nació entre las bendiciones de su familia. Las hadas del reino se reunieron para otorgarle dones de plata.",
        emotion: "기쁨",
        visualPrompt:
          "Grand bright castle interior banquet, baby girl crib surrounded by gorgeous colorful cute mini-fairies throwing sparkling silver dust, fantasy cartoon.",
        imageUrl: sleepingBeautySvg,
      },
    ],
    activities: {
      comprehension: {
        question: "공주님이 태어났을 때 온 요정들은 무엇을 선물하였나요?",
        correctAnswer:
          "행복과 따뜻한 명예 가치를 빛내는 은빛 마법 선물이었습니다.",
      },
      emotion: {
        question: "축복을 받는 아기를 볼 때 마음에 어떤 정서가 번졌나요?",
        options: [
          {
            emotion: "슬픔",
            description:
              "슬픈 그늘을 던지는 마녀가 올까봐 장미 가시를 보며 마음 약해져요.",
          },
          {
            emotion: "공감",
            description:
              "한 생명이 자라날 때 모든 가족들이 환하게 축원해 주는 마음에 함께 따뜻한 가족 정서를 공감해요.",
          },
          {
            emotion: "두려움",
            description:
              "혹시 나쁜 주문을 거는 심술 요정이 문 틈으로 엿볼까 봐 서스펜스 두려움이 일어요.",
          },
          {
            emotion: "안도",
            description:
              "평화로운 장미 기사들이 지키는 성 안이라서 포근히 안도의 쉼이 올라와요.",
          },
          {
            emotion: "궁금함",
            description:
              "앞으로 공주를 자라나게 할 다음 마법 세월의 리본이 무엇일지 다음 스토리가 참 궁금해요.",
          },
        ],
      },
      creative: {
        baseTitle: "장미 덩굴 속 고양이 기사단",
        baseSummary:
          "공주를 지키기 위해 무장한 9마리의 아기 고양이 기사단이 있어요. 이들은 성벽을 조용히 지키고 덩굴 곤충 무리들을 청소합니다.",
        contextPrompt:
          "장미 성벽에 마법 물을 주어 더 튼튼하고 달콤한 꽃잎을 키우는 방법을 장난기 서린 창의력을 더해 작성해 보세요.",
      },
      vocabulary: {
        cards: [
          {
            word: "축복",
            definition:
              "신비롭고 든든한 정성과 정성을 보태어 상대방의 한 해가 무탈하고 대박 나기를 기원해 주는 큰 마음.",
            example:
              "설날 할머니께서 우리 첫째에게 씩씩한 축복의 덕담 선물을 잔뜩 나눠주셨습니다.",
          },
        ],
        quiz: [
          {
            sentenceWithBlank:
              "새싹 동생이 세상에 처음 안겼을 때 성 안 가득 꽃가루 날림의 ______이 있었어요.",
            blankWord: "축복",
            clue: "남들에게 무수한 행운과 행복을 빌어주는 아름다운 도포",
          },
        ],
      },
    },
  },
  {
    id: "classic-3",
    titleKo: "신데렐라 (클래식)",
    titleEn: "Cinderella",
    titleJp: "シンデレラ",
    titleCn: "灰姑娘",
    titleEs: "Cenicienta",
    protagonist: "신데렐라",
    age: 6,
    theme: "정직",
    style: "파스텔 크레용",
    createdAt: "2026-06-05",
    isCustom: false,
    scenes: [
      {
        pageNum: 1,
        narrativeKo:
          "착하고 성실한 신데렐라는 매일 쓸고 닦으면서도 온화한 꿈을 품고 성실함을 지켜나갔어요. 어둠 속 마법 할머니가 호박 마차와 찬란한 유리구두를 선물하기 전에도, 신데렐라는 늘 정직의 등불을 켰답니다.",
        narrativeEn:
          "Gentle and hardworking Cinderella swept and cleaned every single day, keeping her kind dreams alive. Long before her fairy godmother brought the pumpkin carriage, she always kept a honest heart.",
        narrativeJp:
          "優しくて誠実なシンデレラは、毎日お掃除をしながらも、温かい夢を失わずに誠実に生きていました。",
        narrativeCn:
          "善良而勤奋的仙德瑞拉每天打扫，即便辛苦也始终怀揣着温和的梦想。在魔法老奶奶送给她南瓜马车与水晶鞋之前，她总是坚守着诚实守信的明灯。",
        narrativeEs:
          "La amable y trabajadora Cenicienta limpiaba todos los días, manteniendo vivos sus dulces sueños. Mucho antes de que su hada madrina trajera el carruaje de calabaza.",
        emotion: "호기심",
        visualPrompt:
          "Cute Cinderella sweeping with a small straw broom, smiling in a warm cottage as tiny yellow birds fly around, soft pastel crayon style.",
        imageUrl: cinderellaSvg,
      },
    ],
    activities: {
      comprehension: {
        question:
          "신데렐라는 평소 밤하늘을 보며 마음속에 어떤 정직한 등불을 지켰나요?",
        correctAnswer:
          "매일 힘들게 청소를 하면서도 꿈을 포기하지 않고 정성을 솔직하게 가꿔가는 어진 마음이었습니다.",
      },
      emotion: {
        question:
          "호박 마차를 마주한 신데렐라의 마음속 신기함을 생각할 때 여러분은 어떤 기분인가요?",
        options: [
          {
            emotion: "공감",
            description:
              "평소 착하게 땀 흘린 열매들을 가치 있게 거둬간 착한 신데렐라에게 깊이 공감합니다.",
          },
          {
            emotion: "안도",
            description:
              "나쁜 다그침에서 드디어 풀려나 화려한 무도회 궁전 길로 출발하여 이내 안도됩니다.",
          },
          {
            emotion: "궁금함",
            description:
              "시계가 밤 열두 시를 가리킬 때 마법의 색종이가 어떻게 흩날렸을지 참 궁금해집니다.",
          },
          {
            emotion: "슬픔",
            description:
              "허름한 옷을 입고 다락방 구석 구석 먼지를 헤치던 모습은 너무 슬퍼져요.",
          },
          {
            emotion: "두려움",
            description:
              "혹시 구두가 발에 무겁게 안 맞아서 호박 마차가 찌그러졌을까 봐 약간의 두려움이 번지기도 해요.",
          },
        ],
      },
      creative: {
        baseTitle: "생쥐 자크의 유리 구두 보초전",
        baseSummary:
          "자크와 미키 생쥐들은 유리 구두가 도둑 고양이에게 가 닿지 못하게 성 안의 비좁은 구석 통로들을 사슬 보초로 전담하고 지킵니다.",
        contextPrompt:
          "유리구두를 신고 왕궁 계단을 우아하게 내딛기 위한 정직하고 용맹한 마음의 신데렐라 행보를 기막힌 말로 이어보세요.",
      },
      vocabulary: {
        cards: [
          {
            word: "정직",
            definition:
              "아무런 속임 없이 꾸밈없고 깨끗해서 누구나 믿을 수 있게 올곧고 반듯하게 처신하는 마음.",
            example:
              "꽃병을 와장창 깬 강아지는 주인 손을 보며 꼬리를 정직하게 드러내 흔들었답니다.",
          },
        ],
        quiz: [
          {
            sentenceWithBlank:
              "거짓으로 변명하지 않고 잘못을 털어놓을 때 가슴에 고운 ______이 가득 샘솟아요.",
            blankWord: "정직",
            clue: "거짓이 없이 진실만을 선포하는 맑고 투명한 진수",
          },
        ],
      },
    },
  },
  {
    id: "classic-4",
    titleKo: "토끼와 거북이 (클래식)",
    titleEn: "The Tortoise and the Hare",
    titleJp: "うさぎとかめ",
    titleCn: "龟兔赛跑",
    titleEs: "La Tortuga y la Liebre",
    protagonist: "느림보 거북이",
    age: 5,
    theme: "지혜",
    style: "잉크 스케치",
    createdAt: "2026-06-10",
    isCustom: false,
    scenes: [
      {
        pageNum: 1,
        narrativeKo:
          "걸음이 무지 느린 꼬마 거북이 거북이는 매달 나뭇가지를 천천히 올랐어요. 건들대는 날쌘 토끼가 낮잠에 곯아떨어질 때도, 묵묵하게 정상을 가리키며 지혜의 등산길을 걸었답니다.",
        narrativeEn:
          "The slowly stepping little tortoise moved tree by tree with patience. Even when the rapid hare took a nap under the warm oak tree, he walked step-by-step toward the finish line with true wisdom.",
        narrativeJp:
          "歩くのがとても遅いカメさんは、一歩ずつゆっくり坂道を進みました。",
        narrativeCn:
          "步伐有些慢的小乌龟每前进一步都保持着专注。就算爱炫耀的好动小兔子在一旁的橡树底下呼呼大睡，它也默默地向着终点进发，坚守智慧的漫长行步。",
        narrativeEs:
          "La pequeña tortuga, que caminaba muy despacio, avanzaba paso a paso con paciencia. Incluso cuando la veloz liebre se quedó dormida bajo la sombra.",
        emotion: "용기",
        visualPrompt:
          "Cute tiny tortoise with colorful green shell walking with a smile upward on a grassy hill path, sunny day child watercolor sketch theme.",
        imageUrl: tortoiseRabbitSvg,
      },
    ],
    activities: {
      comprehension: {
        question:
          "토끼가 중간 소나무 밑 넓은 그늘에서 깊은 잠에 들었을 때 거북이는 어떠하였나요?",
        correctAnswer:
          "한 번도 쉬지 않고 땀을 훌훌 흘리며 마지막 언덕 골대까지 정성을 보태어 완주해 냈습니다.",
      },
      emotion: {
        question:
          "경주에 이긴 기쁜 거북이를 바라볼 때 가슴에 소중히 번지는 느낌은 어떤가요?",
        options: [
          {
            emotion: "공감",
            description:
              "성실하게 한 걸음씩 보탠 결실의 크기를 믿으며 거북이 편에서 뜨겁게 공감해요.",
          },
          {
            emotion: "안도",
            description:
              "한잠을 푹 잔 토끼가 깜짝 놀라 달려오기 전 완주를 완수한 모습에 안도가 퍼져요.",
          },
          {
            emotion: "궁금함",
            description:
              "거북이가 다음 금빛 경주 메달 리본을 받아서 어떤 바다 친구들과 영광을 나눌지 궁금해져요.",
          },
          {
            emotion: "슬픔",
            description:
              "느리다는 이유 하나로 친구들의 놀림을 고스란히 받던 어두운 전반전은 마음이 아파 슬퍼져요.",
          },
          {
            emotion: "두려움",
            description:
              "혹시 달리는 도중 뒤에서 거센 토끼 바람 소리가 불어와 숨지 못할까 봐 떨리는 두려움도 상상돼요.",
          },
        ],
      },
      creative: {
        baseTitle: "거북이의 남극 바다 아지트 건설",
        baseSummary:
          "바다 완주 메달을 획득한 거북이는 해초 무리들을 안전하고 신비롭게 영양가 흐르게 키우는 마법 우주 바다 아지트를 가꿉니다.",
        contextPrompt:
          "바른 노력이 이뤄낸 우승 뒤, 상대를 비웃던 토끼를 아량을 더해 너그럽게 품고 함께 우정의 마당을 걷는 소나무 축제를 상상해 적어 보세요.",
      },
      vocabulary: {
        cards: [
          {
            word: "지혜",
            definition:
              "겉만 보고 설익게 판단하지 않고 사물의 마음 본바탕을 환히 헤아려 올바로 슬기롭게 풀어가는 소중한 이치.",
            example:
              "할아버지 기사님은 길 잃은 사슴 떼들이 밤에도 빛을 쫓도록 등불을 켜 두는 지혜로운 아이디어를 냈어요.",
          },
        ],
        quiz: [
          {
            sentenceWithBlank:
              "빠르게만 무리하는 것보다 차곡차곡 인내와 정성을 더하는 것이 귀한 ______의 행동입니다.",
            blankWord: "지혜",
            clue: "어려운 벽을 슬기로운 계책과 인내로 풀고 해소하는 심력",
          },
        ],
      },
    },
  },
];

export const mockDashboardData = {
  weeklyCount: [
    { name: "6/10", count: 2, words: 14 },
    { name: "6/11", count: 3, words: 18 },
    { name: "6/12", count: 1, words: 8 },
    { name: "6/13", count: 4, words: 28 },
    { name: "6/14", count: 2, words: 16 },
    { name: "6/15", count: 5, words: 38 },
    { name: "6/16", count: 3, words: 24 },
  ],
  emotionStats: [
    { emotion: "기쁨", percent: 45, color: "#FF6B9D" },
    { emotion: "공감", percent: 25, color: "#7ECEC4" },
    { emotion: "호기심", percent: 15, color: "#FFD93D" },
    { emotion: "안도", percent: 10, color: "#C9B1FF" },
    { emotion: "슬픔/두려움", percent: 5, color: "#C4C4C4" },
  ],
  frequentThemes: [
    {
      keyword: "🦖 공룡 이야기를 자주 선택해요",
      description:
        "호기심이 왕성한 아이들은 힘차고 상상력 가득한 모험에 집중하는 경향을 보여요.",
    },
    {
      keyword: "🌙 밤 배경 이야기에서 집중 시간이 길어요",
      description:
        "밤하늘 은하수나 아기 동물들의 꿀맛 같은 잠자리를 그리는 서사를 부모와 읽을 때 눈 깜박임이 덜해요.",
    },
    {
      keyword: "🐺 무서운 장면은 빠르게 넘기는 경향이 있어요",
      description:
        "늑대나 어두운 동굴 등 무서운 캐릭터 컷은 부모 뒤에 숨으며 빠르게 스킵하는 경향을 나타냅니다.",
    },
  ],
  readingHistory: [
    {
      taleId: "classic-1",
      title: "토끼와 별빛 숲 (스태프 추천)",
      readAt: "2026-06-16 08:34",
      durationSeconds: 312,
      completed: true,
      percentageRead: 100,
      activitiesCompleted: {
        comprehension: true,
        emotion: true,
        creative: false,
        vocabulary: true,
      },
    },
    {
      taleId: "classic-4",
      title: "토끼와 거북이",
      readAt: "2026-06-15 19:12",
      durationSeconds: 240,
      completed: true,
      percentageRead: 100,
      activitiesCompleted: {
        comprehension: true,
        emotion: false,
        creative: false,
        vocabulary: false,
      },
    },
    {
      taleId: "classic-2",
      title: "잠자는 숲속의 공주",
      readAt: "2026-06-13 14:05",
      durationSeconds: 98,
      completed: false,
      percentageRead: 40,
      activitiesCompleted: {
        comprehension: false,
        emotion: false,
        creative: false,
        vocabulary: false,
      },
    },
  ],
};
