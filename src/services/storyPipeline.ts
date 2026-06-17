/// <reference types="vite/client" />
import { FairyTale, BookScene } from "../types";

// ── artStyle → DALL-E prefix 매핑 ────────────────────────────────────────────

const ART_STYLE_PREFIX: Record<string, string> = {
  "수채화": "watercolor illustration, soft brush strokes, pastel tones, children's book",
  "파스텔 크레용": "pastel crayon illustration, chalk texture, gentle colors, children's book",
  "동화풍 일러스트": "digital cartoon illustration, bright vivid colors, clean lines",
  "잉크 스케치": "ink and watercolor, classic storybook style, detailed linework",
};

const DEFAULT_STYLE_PREFIX = "children's book illustration, soft colors";

function buildCharacterPrefix(artStylePrefix: string): string {
  return (
    `${artStylePrefix}, Korean children's book, consistent character design, ` +
    `same protagonist in every single scene, no text in image, no letters, ` +
    `no words, safe for children, wholesome`
  );
}

// ── OpenAI 헬퍼 ──────────────────────────────────────────────────────────────

async function callGPT(
  system: string,
  user: string,
  jsonMode: boolean,
): Promise<string | object> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GPT-4o error: ${res.status}`);
  const data = await res.json();
  const content = data.choices[0].message.content as string;
  return jsonMode ? JSON.parse(content) : content;
}

async function callDALLE(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt.slice(0, 4000),
      size: "1024x1024",
      quality: "standard",
      n: 1,
    }),
  });
  if (!res.ok) throw new Error(`DALL-E 3 error: ${res.status}`);
  const data = await res.json();
  return data.data[0].url as string;
}

// ── 메인 파이프라인 ───────────────────────────────────────────────────────────

export async function generateStory(
  config: {
    protagonist: string;
    age: number;
    theme: string;
    style: string;
    extraKorean: boolean;
  },
  onProgress: (step: number, label: string) => void,
): Promise<FairyTale> {
  const { protagonist, age, theme, style } = config;
  const artStylePrefix = ART_STYLE_PREFIX[style] ?? DEFAULT_STYLE_PREFIX;
  const characterPrefix = buildCharacterPrefix(artStylePrefix);

  // ── 1단계: 소재 분석 및 아이 성향 매핑 ────────────────────────────────────
  onProgress(1, "소재 분석 및 아이 성향 매핑");

  const worldSetting = (await callGPT(
    "한국 영유아 동화 전문 작가입니다",
    `주인공: ${protagonist}, 나이: ${age}세, 테마: ${theme}, 화풍: ${style}\n` +
      `이 동화의 세계관을 한국어로 3문장으로 설정해 주세요.`,
    false,
  )) as string;

  // ── 2단계: 기승전결 및 따스한 국문 운문 ────────────────────────────────────
  onProgress(2, "기승전결 및 따스한 국문 운문");

  const storyData = (await callGPT(
    "한국 영유아 동화 전문 작가입니다. 반드시 유효한 JSON만 반환하세요.",
    `세계관:\n${worldSetting}\n\n` +
      `주인공: ${protagonist}(${age}세), 테마: ${theme}\n\n` +
      `${age}세 어휘 수준으로 5장면 동화를 아래 JSON 형식으로 생성하세요:\n` +
      `{\n` +
      `  "titleKo": "제목",\n` +
      `  "scenes": [\n` +
      `    {\n` +
      `      "pageNum": 1,\n` +
      `      "narrativeKo": "한국어 본문 2~3문장",\n` +
      `      "emotion": "기쁨",\n` +
      `      "visualPrompt": "English scene description"\n` +
      `    }\n` +
      `  ]\n` +
      `}`,
    true,
  )) as {
    titleKo: string;
    scenes: {
      pageNum: number;
      narrativeKo: string;
      emotion: string;
      visualPrompt: string;
    }[];
  };

  let scenes: BookScene[] = storyData.scenes.map((s) => ({
    pageNum: s.pageNum,
    narrativeKo: s.narrativeKo,
    narrativeEn: "",
    narrativeJp: "",
    narrativeCn: "",
    narrativeEs: "",
    emotion: s.emotion,
    visualPrompt: s.visualPrompt,
  }));

  // ── 3단계: 씬 분할 및 5대 글로벌 다국어 고운 번역 ─────────────────────────
  onProgress(3, "씬 분할 및 5대 글로벌 다국어 고운 번역");

  const translationData = (await callGPT(
    "You are a professional literary translator. Return only valid JSON.",
    `Translate the following Korean fairy tale title and scene narratives into ` +
      `English, Japanese, Simplified Chinese, and Spanish.\n\n` +
      `Title: ${storyData.titleKo}\n` +
      `Scenes:\n${scenes.map((s) => `Page ${s.pageNum}: ${s.narrativeKo}`).join("\n")}\n\n` +
      `Return JSON:\n` +
      `{\n` +
      `  "titleEn": "", "titleJp": "", "titleCn": "", "titleEs": "",\n` +
      `  "narratives": [\n` +
      `    { "En": "", "Jp": "", "Cn": "", "Es": "" }\n` +
      `  ]\n` +
      `}`,
    true,
  )) as {
    titleEn: string;
    titleJp: string;
    titleCn: string;
    titleEs: string;
    narratives: { En: string; Jp: string; Cn: string; Es: string }[];
  };

  scenes = scenes.map((scene, i) => {
    const t = translationData.narratives[i];
    if (!t) return scene;
    return {
      ...scene,
      narrativeEn: t.En,
      narrativeJp: t.Jp,
      narrativeCn: t.Cn,
      narrativeEs: t.Es,
    };
  });

  // ── 4단계: 어린이 화풍 일러스트 프롬프트 정밀 보정 ────────────────────────
  onProgress(4, "어린이 화풍 일러스트 프롬프트 정밀 보정");

  scenes = scenes.map((scene) => ({
    ...scene,
    visualPrompt: `${characterPrefix}. ${scene.visualPrompt}`,
  }));

  // ── 5단계: 영유아 전용 동화책 삽화 렌더링 진행 ────────────────────────────
  for (let i = 0; i < scenes.length; i++) {
    onProgress(5, "영유아 전용 동화책 삽화 렌더링 진행");
    const imageUrl = await callDALLE(scenes[i].visualPrompt);
    scenes[i] = { ...scenes[i], imageUrl };
  }

  // ── 6단계: 이해·감정·창의·어휘 4종 교육 놀이마당 설계 ─────────────────────
  onProgress(6, "이해·감정·창의·어휘 4종 교육 놀이마당 설계");

  const activities = (await callGPT(
    "당신은 아동 교육 전문가입니다. 반드시 유효한 JSON만 반환하세요.",
    `동화 제목: ${storyData.titleKo}\n` +
      `주인공: ${protagonist}(${age}세)\n` +
      `요약: ${scenes.map((s) => s.narrativeKo).join(" ")}\n\n` +
      `아래 형식으로 독후 활동을 생성하세요.\n` +
      `emotion 값은 "기쁨","슬픔","공감","두려움","안도","궁금함" 중에서만 사용하세요.\n` +
      `{\n` +
      `  "comprehension": { "question": "", "correctAnswer": "" },\n` +
      `  "emotion": {\n` +
      `    "question": "",\n` +
      `    "options": [\n` +
      `      { "emotion": "기쁨",   "description": "" },\n` +
      `      { "emotion": "슬픔",   "description": "" },\n` +
      `      { "emotion": "공감",   "description": "" },\n` +
      `      { "emotion": "두려움", "description": "" },\n` +
      `      { "emotion": "안도",   "description": "" },\n` +
      `      { "emotion": "궁금함", "description": "" }\n` +
      `    ]\n` +
      `  },\n` +
      `  "creative": { "baseTitle": "", "baseSummary": "", "contextPrompt": "" },\n` +
      `  "vocabulary": {\n` +
      `    "cards": [\n` +
      `      { "word": "", "definition": "", "example": "" },\n` +
      `      { "word": "", "definition": "", "example": "" },\n` +
      `      { "word": "", "definition": "", "example": "" }\n` +
      `    ],\n` +
      `    "quiz": [\n` +
      `      { "sentenceWithBlank": "", "blankWord": "", "clue": "" },\n` +
      `      { "sentenceWithBlank": "", "blankWord": "", "clue": "" }\n` +
      `    ]\n` +
      `  }\n` +
      `}`,
    true,
  )) as FairyTale["activities"];

  return {
    id: crypto.randomUUID(),
    titleKo: storyData.titleKo,
    titleEn: translationData.titleEn,
    titleJp: translationData.titleJp,
    titleCn: translationData.titleCn,
    titleEs: translationData.titleEs,
    protagonist,
    age,
    theme,
    style,
    createdAt: new Date().toISOString(),
    isCustom: true,
    scenes,
    activities,
  };
}
