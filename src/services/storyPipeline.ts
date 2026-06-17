/// <reference types="vite/client" />
import { FairyTale, BookScene } from "../types";

export interface StoryInputs {
  heroName: string;
  age: number;
  emotion: string;
  backgrounds: string[];
  koreanMotifs: string[];
  artStyle: string;
}

const ART_STYLE_MAP: Record<string, string> = {
  "물감 수채화": "watercolor illustration, soft brush strokes, pastel tones",
  "파스텔 크레용": "pastel crayon illustration, chalk texture, gentle colors",
  "동화풍 일러스트": "digital cartoon illustration, bright vivid colors, clean lines",
  "클래식 잉크": "ink and watercolor, classic storybook style, detailed linework",
};

const CHARACTER_SUFFIX =
  "consistent character design, same protagonist in every scene, " +
  "Korean children's book illustration, no text in image";

// ── OpenAI helpers ────────────────────────────────────────────────────────────

async function gpt4o(
  messages: { role: string; content: string }[],
  jsonMode = false,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GPT-4o API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content as string;
}

async function dalle3(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    }),
  });
  if (!res.ok) throw new Error(`DALL-E 3 API error: ${res.status}`);
  const data = await res.json();
  return data.data[0].url as string;
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

export async function generateStory(
  inputs: StoryInputs,
  onProgress: (step: number, label: string, percent: number) => void,
): Promise<FairyTale> {
  const { heroName, age, emotion, backgrounds, koreanMotifs, artStyle } = inputs;

  // ── 1단계: 세계관 설정 ────────────────────────────────────────────────────
  onProgress(1, "세계관 구성 중...", 5);

  const worldSetting = await gpt4o([
    {
      role: "system",
      content:
        "당신은 한국 전통 정서와 동화적 세계관을 창조하는 전문 작가입니다. 한국어로 답하세요.",
    },
    {
      role: "user",
      content: `
주인공 이름: ${heroName}, 나이: ${age}세
주요 감정/테마: ${emotion}
배경 요소: ${backgrounds.join(", ")}
한국적 모티프: ${koreanMotifs.join(", ")}

위 요소를 바탕으로 아이가 주인공인 동화의 세계관을 3~4문장으로 설정해주세요.
이야기 전체에서 일관되게 사용될 배경, 분위기, 핵심 갈등을 포함해주세요.
      `.trim(),
    },
  ]);

  // ── 2단계: 장면 JSON 생성 ────────────────────────────────────────────────
  onProgress(2, "이야기 장면 생성 중...", 20);

  const sceneRaw = await gpt4o(
    [
      {
        role: "system",
        content: "당신은 한국 아동 동화 작가입니다. 반드시 유효한 JSON만 반환하세요.",
      },
      {
        role: "user",
        content: `
세계관:
${worldSetting}

주인공: ${heroName}(${age}세), 테마: ${emotion}

총 5장면으로 구성된 동화를 다음 JSON 형식으로 생성하세요:
{
  "titleKo": "동화 제목",
  "scenes": [
    {
      "pageNum": 1,
      "narrativeKo": "2~3문장의 한국어 본문",
      "emotion": "이 장면의 핵심 감정 한 단어",
      "visualPrompt": "English visual description for illustration (2~3 sentences describing scene, characters, mood)"
    }
  ]
}

규칙:
- narrativeKo는 ${age}세 아이가 이해하기 쉬운 한국어 문장
- visualPrompt는 영어로, 인물의 외모와 배경을 구체적으로 묘사
- 5장면이 기승전결-결말 구조를 가질 것
        `.trim(),
      },
    ],
    true,
  );

  const sceneData = JSON.parse(sceneRaw) as {
    titleKo: string;
    scenes: {
      pageNum: number;
      narrativeKo: string;
      emotion: string;
      visualPrompt: string;
    }[];
  };

  let scenes: BookScene[] = sceneData.scenes.map((s) => ({
    pageNum: s.pageNum,
    narrativeKo: s.narrativeKo,
    narrativeEn: "",
    narrativeJp: "",
    narrativeCn: "",
    narrativeEs: "",
    emotion: s.emotion,
    visualPrompt: s.visualPrompt,
  }));

  // ── 3단계: 다국어 번역 ───────────────────────────────────────────────────
  onProgress(3, "다국어 번역 중...", 40);

  const translationRaw = await gpt4o(
    [
      {
        role: "system",
        content: "You are a professional translator. Return only valid JSON.",
      },
      {
        role: "user",
        content: `
Translate the following Korean fairy tale title and scene narratives into English, Japanese (日本語), Simplified Chinese (简体中文), and Spanish.
Return JSON in this exact format:
{
  "titleEn": "...",
  "titleJp": "...",
  "titleCn": "...",
  "titleEs": "...",
  "scenes": [
    { "pageNum": 1, "narrativeEn": "...", "narrativeJp": "...", "narrativeCn": "...", "narrativeEs": "..." }
  ]
}

Title: ${sceneData.titleKo}

Scenes:
${scenes.map((s) => `Page ${s.pageNum}: ${s.narrativeKo}`).join("\n")}
        `.trim(),
      },
    ],
    true,
  );

  const translationData = JSON.parse(translationRaw) as {
    titleEn: string;
    titleJp: string;
    titleCn: string;
    titleEs: string;
    scenes: {
      pageNum: number;
      narrativeEn: string;
      narrativeJp: string;
      narrativeCn: string;
      narrativeEs: string;
    }[];
  };

  scenes = scenes.map((scene) => {
    const t = translationData.scenes.find((s) => s.pageNum === scene.pageNum);
    if (!t) return scene;
    return {
      ...scene,
      narrativeEn: t.narrativeEn,
      narrativeJp: t.narrativeJp,
      narrativeCn: t.narrativeCn,
      narrativeEs: t.narrativeEs,
    };
  });

  // ── 4단계: 캐릭터 시트 prefix ────────────────────────────────────────────
  onProgress(4, "이미지 프롬프트 설정 중...", 45);

  const styleDesc = ART_STYLE_MAP[artStyle] ?? artStyle;
  const characterPrefix = `${styleDesc}, ${CHARACTER_SUFFIX}. `;

  scenes = scenes.map((scene) => ({
    ...scene,
    visualPrompt: characterPrefix + scene.visualPrompt,
  }));

  // ── 5단계: DALL-E 3 이미지 순차 생성 (병렬 금지) ─────────────────────────
  for (let i = 0; i < scenes.length; i++) {
    const percent = 45 + Math.round(((i + 1) / scenes.length) * 35);
    onProgress(5, `이미지 생성 중... (${i + 1}/${scenes.length})`, percent);
    const imageUrl = await dalle3(scenes[i].visualPrompt);
    scenes[i] = { ...scenes[i], imageUrl };
  }

  // ── 6단계: 독후 활동 생성 ────────────────────────────────────────────────
  onProgress(6, "독후 활동 생성 중...", 85);

  const activitiesRaw = await gpt4o(
    [
      {
        role: "system",
        content: "당신은 아동 교육 전문가입니다. 반드시 유효한 JSON만 반환하세요.",
      },
      {
        role: "user",
        content: `
다음 동화를 읽고 난 후 활동 자료를 JSON으로 생성해주세요.

동화 제목: ${sceneData.titleKo}
주인공: ${heroName}(${age}세)
이야기 요약: ${scenes.map((s) => s.narrativeKo).join(" ")}

다음 형식을 정확히 따르세요:
{
  "comprehension": {
    "question": "이야기 내용을 확인하는 질문 (한국어)",
    "correctAnswer": "정답"
  },
  "emotion": {
    "question": "이 이야기를 읽고 어떤 감정이 들었나요? (한국어)",
    "options": [
      { "emotion": "기쁨",   "description": "이 감정을 선택하는 이유 한 문장" },
      { "emotion": "슬픔",   "description": "..." },
      { "emotion": "공감",   "description": "..." },
      { "emotion": "두려움", "description": "..." },
      { "emotion": "안도",   "description": "..." },
      { "emotion": "궁금함", "description": "..." }
    ]
  },
  "creative": {
    "baseTitle": "이야기 이어쓰기 제목",
    "baseSummary": "이어쓰기 배경 요약 (1~2문장)",
    "contextPrompt": "아이에게 주는 이어쓰기 안내 문장"
  },
  "vocabulary": {
    "cards": [
      { "word": "단어1", "definition": "정의", "example": "예문" },
      { "word": "단어2", "definition": "정의", "example": "예문" },
      { "word": "단어3", "definition": "정의", "example": "예문" }
    ],
    "quiz": [
      { "sentenceWithBlank": "______이(가) 빛나는 밤이었어요.", "blankWord": "별", "clue": "하늘에 반짝이는 것" },
      { "sentenceWithBlank": "...", "blankWord": "...", "clue": "..." }
    ]
  }
}
        `.trim(),
      },
    ],
    true,
  );

  const activities = JSON.parse(activitiesRaw) as FairyTale["activities"];

  onProgress(6, "완료!", 100);

  return {
    id: crypto.randomUUID(),
    titleKo: sceneData.titleKo,
    titleEn: translationData.titleEn,
    titleJp: translationData.titleJp,
    titleCn: translationData.titleCn,
    titleEs: translationData.titleEs,
    protagonist: heroName,
    age,
    theme: emotion,
    style: artStyle,
    createdAt: new Date().toISOString(),
    isCustom: true,
    scenes,
    activities,
  };
}
