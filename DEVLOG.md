# 토리동화 (Tory Tale) 개발일지

> **개발 기간**: 2026년 6월  
> **개발자**: seungwoohan12  
> **레포지토리**: https://github.com/seungwoohan12/torystory  
> **라이브**: https://seungwoohan12.github.io/torystory/

---

## 📌 프로젝트 개요

**토리동화**는 AI가 아이의 이름, 나이, 관심사, 주제에 맞춰 맞춤형 동화를 생성해주는 한국 아동용 인터랙티브 동화 앱입니다.  
단순히 이야기를 읽는 것을 넘어, 읽고 나서 독해 퀴즈·감정 선택·이야기 이어쓰기·어휘 학습까지 할 수 있는 통합 독서 경험을 제공합니다.

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 19, TypeScript 5.8, Vite 6.2 |
| 스타일링 | TailwindCSS v4 (`@tailwindcss/vite` 플러그인) |
| 백엔드 | Node.js, Express 4 |
| AI 모델 (서버) | Google Gemini (`@google/genai` v2.4 — `gemini-2.5-flash`) |
| AI 모델 (클라이언트) | OpenAI GPT-4o + DALL-E 3 (storyPipeline 서비스) |
| TTS | Web Speech API (`SpeechSynthesisUtterance`) |
| 환경 변수 | dotenv |
| 빌드 | Vite (프론트엔드) + esbuild (서버 번들) |
| 패키지 매니저 | npm |
| 버전 관리 | Git / GitHub |
| CI/CD | GitHub Actions → GitHub Pages 자동 배포 |

---

## 📁 프로젝트 구조

```
torystory/
├── src/
│   ├── main.tsx                  # 앱 엔트리포인트
│   ├── App.tsx                   # 루트 컴포넌트 (전역 상태 관리)
│   ├── types.ts                  # TypeScript 인터페이스 정의
│   ├── data.ts                   # 클래식 동화 데이터 (4편 내장)
│   ├── index.css                 # 전역 스타일
│   ├── services/
│   │   └── storyPipeline.ts      # OpenAI 기반 동화 생성 파이프라인
│   └── components/
│       ├── LandingPage.tsx       # 첫 화면 (로그인/시작)
│       ├── Header.tsx            # 상단 헤더
│       ├── Sidebar.tsx           # 좌측 네비게이션
│       ├── Dashboard.tsx         # 독서 현황 대시보드
│       ├── Bookshelf.tsx         # 동화책 서재
│       ├── FairyTaleBuilder.tsx  # AI 동화 생성기
│       ├── StoryViewer.tsx       # 동화 읽기 뷰어
│       ├── PlayRoom.tsx          # 독후 활동 (4개 탭)
│       ├── StoryProgress.tsx     # 생성 진행 애니메이션
│       ├── SafetySettings.tsx    # 부모 안전 설정
│       └── Paywall.tsx           # 프리미엄 업그레이드
├── server.ts                     # Express 서버 + Vite 미들웨어
├── vite.config.ts                # Vite 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions 자동 배포
└── DEVLOG.md                     # 개발일지 (현재 문서)
```

---

## ✨ 주요 기능

### 1. AI 맞춤형 동화 생성
- 아이의 이름, 나이, 관심사, 이야기 주제, 문체 스타일(수채화/만화/동화 등)을 입력하면 Gemini AI가 완전한 동화를 생성
- 5개 언어 동시 생성: 한국어, 영어, 일본어, 중국어, 스페인어
- 각 장면마다 감정 레이블과 일러스트 프롬프트 자동 생성
- Gemini API 실패 시 폴백 스토리 생성기가 즉시 대체

### 2. 다국어 지원 뷰어
- 읽기 화면에서 실시간 언어 전환 (한/영/일/중/스)
- Web Speech API를 활용한 TTS(읽어주기) — 언어별 최적 음성 자동 선택
- 페이지 단위 이동, 읽기 완료율 추적

### 3. 독후 활동 PlayRoom (4탭)
| 탭 | 활동 내용 |
|----|-----------|
| 독해력 | 객관식 이해 확인 문제 |
| 감정 공감 | 6가지 감정 중 선택 (기쁨/슬픔/두려움/안도/공감/궁금함) |
| 이야기 이어쓰기 | 아이가 직접 후속 이야기 작성 |
| 어휘 학습 | 단어 카드 + 빈칸 채우기 퀴즈 |

### 4. 아이 프로필 관리
- 이름, 나이, 성별, 관심사 설정
- 읽기 속도·선호 스타일(그림 위주 / 균형 / 텍스트 위주) 설정
- 다중 프로필 지원 (프리미엄)

### 5. 부모 통제 기능
- **부모 잠금**: 수학 퍼즐로 잠금 해제 (아이가 임의로 설정 변경 불가)
- **스크린타임 제한**: 분 단위 사용 시간 설정, 초과 시 차단
- **콘텐츠 필터**: 연령 범위 및 필터 강도 설정
- **승인 필요 모드**: 부모 승인 후 동화 이용 가능

### 6. 서재 (Bookshelf)
- 클래식 동화 4편 기본 내장 (토끼와 별빛 숲, 용감한 아기 용, 마법의 씨앗, 토끼와 거북이)
- AI가 생성한 커스텀 동화 저장 및 관리
- 프리 티어: 커스텀 동화 1편 제한

### 7. 대시보드
- 총 독서 시간, 완독한 동화 수, 독후 활동 완료 현황 통계
- 최근 읽은 동화 히스토리

### 8. 구독 모델 (Paywall)
- 무료(Free): 클래식 동화 + AI 동화 1편
- 프리미엄(Premium): 무제한 AI 동화 생성, 다중 프로필, 전 기능 개방

### 9. storyPipeline 서비스 (`src/services/storyPipeline.ts`)
OpenAI API를 활용한 고품질 동화 생성 6단계 파이프라인.  
기존 Gemini 기반 서버 생성과 별개로, 클라이언트에서 직접 호출 가능한 독립 서비스.

| 단계 | 내용 | 모델 |
|------|------|------|
| 1 | 세계관 설정 (배경·분위기·갈등 구성) | GPT-4o |
| 2 | 5장면 BookScene JSON 생성 (한국어 본문 + 영문 시각 프롬프트) | GPT-4o |
| 3 | 영어·일본어·중국어·스페인어 번역 | GPT-4o |
| 4 | artStyle → DALL-E 프롬프트 변환 + 캐릭터 시트 prefix 삽입 | — |
| 5 | 장면별 일러스트 순차 생성 (병렬 금지) | DALL-E 3 |
| 6 | 독후 활동 전체 생성 (독해·감정·이어쓰기·어휘) | GPT-4o |

**artStyle 매핑:**
- 물감 수채화 → `watercolor illustration, soft brush strokes, pastel tones`
- 파스텔 크레용 → `pastel crayon illustration, chalk texture, gentle colors`
- 동화풍 일러스트 → `digital cartoon illustration, bright vivid colors, clean lines`
- 클래식 잉크 → `ink and watercolor, classic storybook style, detailed linework`

---

## 🔌 API 엔드포인트

### `POST /api/generate-story`
- **역할**: Gemini AI로 맞춤 동화 전체 생성
- **입력**: `{ protagonist, age, theme, style, language, numScenes, extraKorean }`
- **출력**: `FairyTale` 객체 (제목 5개 언어, 장면 배열, 독후 활동 전체)
- **폴백**: Gemini 실패 시 내장 fallback 스토리 반환

### `POST /api/generate-image`
- **역할**: 동화 장면별 AI 일러스트 생성
- **입력**: `{ prompt, pageNum, style }`
- **출력**: `{ imageUrl: "data:image/png;base64,..." }`
- **폴백**: API 실패 시 아름다운 SVG 일러스트 자동 생성

---

## 🗂 핵심 타입 구조

```typescript
// 동화 전체 구조
interface FairyTale {
  id: string;
  titleKo/En/Jp/Cn/Es: string;   // 5개 언어 제목
  scenes: BookScene[];             // 장면 배열
  activities: {                    // 독후 활동 전체
    comprehension, emotion, creative, vocabulary
  };
}

// 아이 프로필
interface ChildProfile {
  name, age, gender, interests,
  readingTendency: { length, speed, style }
}

// 독서 기록
interface ReadingHistory {
  taleId, title, readAt, durationSeconds,
  completed, percentageRead,
  activitiesCompleted, childAnswers
}
```

---

## 🏗 아키텍처

```
브라우저 (React SPA)
    │
    ├─ HTTP (개발: Vite HMR / 프로덕션: Express 정적 서빙)
    │       ▼
    │   Express 서버 (server.ts)
    │       ├── /api/generate-story  →  Google Gemini 2.5 Flash
    │       ├── /api/generate-image  →  Gemini Image (폴백: SVG)
    │       └── /*                  →  dist/index.html
    │
    └─ 직접 호출 (VITE_OPENAI_API_KEY)
            ▼
        storyPipeline.ts
            ├── GPT-4o  (세계관·장면·번역·활동)
            └── DALL-E 3 (장면 일러스트, 순차)
```

**개발 모드**: `tsx server.ts` → Express + Vite 미들웨어 통합 (HMR 지원)  
**프로덕션 (로컬)**: `vite build` + `esbuild server.ts` → `node dist/server.cjs`  
**GitHub Pages**: GitHub Actions → `vite build --base /torystory/` → Pages 자동 배포

---

## 🐛 주요 수정 이력

| 파일 | 문제 | 수정 |
|------|------|------|
| `src/App.tsx` | `vocabularyQuizAnswers`에 객체 리터럴 할당 (타입은 `string[]`) | 배열로 변환 |
| `src/components/PlayRoom.tsx` | JSX에 stray `=` 문자가 렌더링됨 | 제거 |
| `server.ts` | 존재하지 않는 모델 `gemini-3.5-flash` 호출 | `gemini-2.5-flash`로 수정 |
| `src/components/FairyTaleBuilder.tsx` | `rows={2.5}` 비정수 속성 | `rows={3}`으로 수정 |
| `src/types.ts` | 감정 유니온 타입에 `"기쁨"` 누락 | 추가 |
| `server.ts` | `response.text`가 `undefined`일 수 있음 | null 병합 연산자(`??`) 적용 |
| 다수 컴포넌트 | `lucide-react` 미사용 임포트 | 정리 |
| `package.json` | `@types/react`, `@types/react-dom` 미설치 | React 19용 타입 패키지 설치 |
| `src/services/storyPipeline.ts` | `import.meta.env` 타입 미인식 | `/// <reference types="vite/client" />` 추가 |

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에 아래 키 입력:
#   GEMINI_API_KEY=...       (서버 사이드 Gemini API)
#   VITE_OPENAI_API_KEY=...  (클라이언트 storyPipeline)

# 3. 개발 서버 실행 (HMR 지원)
npm run dev
# → http://localhost:3000

# 4. 프로덕션 빌드 & 실행
npm run build
npm start
# → http://localhost:3000
```

## 🌐 GitHub Pages 배포

`main` 브랜치에 푸쉬하면 GitHub Actions가 자동으로 빌드·배포합니다.

```
main 푸쉬
  └→ .github/workflows/deploy.yml 실행
       └→ npm ci → vite build --base /torystory/
            └→ GitHub Pages 업로드
                 └→ https://seungwoohan12.github.io/torystory/
```

> GitHub Pages는 정적 서빙만 지원하므로 Express 백엔드 API는 동작하지 않습니다.  
> AI 기능은 `VITE_OPENAI_API_KEY`가 설정된 환경에서 storyPipeline 서비스로 동작합니다.

---

## 📦 주요 의존성

```json
{
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "@google/genai": "^2.4.0",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "tailwindcss": "^4.1.14",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "@vitejs/plugin-react": "^5.0.4",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.14.0",
    "@types/express": "^4.17.21",
    "tsx": "^4.21.0",
    "esbuild": "^0.25.0"
  }
}
```

---

## 🔄 주요 리팩토링

### App.tsx — handleProgressLoaderComplete 교체 (2026-06-17)

**기존**: Express 서버 2회 호출 방식
```
/api/generate-story  →  Gemini 2.5 Flash (스토리 텍스트)
/api/generate-image  →  Gemini Image / SVG 폴백 (장면별 병렬 호출)
```

**변경 후**: OpenAI storyPipeline 단일 호출
```typescript
const storyData = await generateStory(underConstructionConfig, (step, label) => {
  console.log(`[${step}/6] ${label}`);
});
```

- 54줄 → 15줄로 축소
- 서버 의존성 제거 (GitHub Pages에서도 AI 기능 동작 가능)
- 이미지 생성이 DALL-E 3 순차 생성으로 일관성 확보

---

## 📋 커밋 히스토리

| 커밋 | 내용 |
|------|------|
| `30e0f85` | Initial commit (GitHub 레포 생성) |
| `0731f16` | feat: 토리동화 React 앱 전체 소스 업로드 |
| `3b12a1b` | docs: DEVLOG.md 최초 작성 |
| `04e710b` | docs: README.md 상세 내용 업데이트 |
| `2d9436b` | ci: GitHub Actions 자동 배포 워크플로우 추가 |
| `a649186` | feat: storyPipeline 서비스 추가 (OpenAI GPT-4o + DALL-E 3) |
| `fdec971` | docs: DEVLOG storyPipeline·CI/CD·아키텍처 업데이트 |
| `8fbc8b2` | chore: .env.example VITE_OPENAI_API_KEY 플레이스홀더 추가 |
| `6ea6cfb` | refactor: App.tsx Gemini 호출 → storyPipeline으로 교체 |

---

*마지막 업데이트: 2026년 6월 17일*
