# 토리동화 (Tory Tale) 🐰📖

> AI가 우리 아이만을 위한 동화를 만들어주는 한국 아동용 인터랙티브 동화 앱

---

## 🖥 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 19, TypeScript 5.8, Vite 6.2 |
| 스타일링 | TailwindCSS v4 |
| 백엔드 | Node.js, Express 4 |
| AI | Google Gemini 2.5 Flash (`@google/genai` v2.4) |
| TTS | Web Speech API |
| 빌드 | Vite (프론트) + esbuild (서버) |

---

## ✨ 주요 기능

- **AI 맞춤 동화 생성** — 아이 이름·나이·관심사·주제로 Gemini가 완성된 동화 생성
- **5개 언어 지원** — 한국어 / 영어 / 일본어 / 중국어 / 스페인어 실시간 전환
- **읽어주기 (TTS)** — 언어별 자동 음성 선택
- **독후 활동 PlayRoom** — 독해 퀴즈, 감정 선택, 이야기 이어쓰기, 어휘 학습
- **부모 통제** — 스크린타임 제한, 수학 퍼즐 잠금, 콘텐츠 필터
- **클래식 동화 4편 내장** — 토끼와 별빛 숲 외 3편

---

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 에 GEMINI_API_KEY 입력

# 개발 서버 (HMR)
npm run dev

# 프로덕션 빌드 & 실행
npm run build
npm start
```

서버 주소: `http://localhost:3000`

---

## 📁 프로젝트 구조

```
src/
├── App.tsx                  # 루트 컴포넌트 (전역 상태)
├── types.ts                 # TypeScript 인터페이스
├── data.ts                  # 클래식 동화 데이터
└── components/
    ├── LandingPage.tsx       # 시작 화면
    ├── Dashboard.tsx         # 독서 대시보드
    ├── Bookshelf.tsx         # 동화 서재
    ├── FairyTaleBuilder.tsx  # AI 동화 생성기
    ├── StoryViewer.tsx       # 동화 뷰어
    ├── PlayRoom.tsx          # 독후 활동
    ├── SafetySettings.tsx    # 부모 설정
    └── Paywall.tsx           # 구독 화면
server.ts                    # Express API 서버
```

---

## 📝 개발일지

자세한 개발 내용은 [DEVLOG.md](./DEVLOG.md)를 참고하세요.
