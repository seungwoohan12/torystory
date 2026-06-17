export interface ChildProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "none";
  interests: string[];
  readingTendency: {
    length: "very_short" | "short" | "medium" | "long";
    speed: "slow" | "medium" | "fast";
    style: "more_illustrations" | "balanced" | "more_text";
  };
}

export interface ParentSettings {
  filterEnabled: boolean;
  filterIntensity: "low" | "medium" | "high";
  ageRange: { min: number; max: number };
  approvalRequired: boolean;
  playtimeLimit: number; // in minutes
  playtimeLimitEnabled: boolean;
}

export interface BookScene {
  pageNum: number;
  narrativeKo: string;
  narrativeEn: string;
  narrativeJp: string;
  narrativeCn: string;
  narrativeEs: string;
  emotion: string;
  visualPrompt: string;
  imageUrl?: string; // base64 or placeholder url
}

export interface FairyTale {
  id: string;
  titleKo: string;
  titleEn: string;
  titleJp: string;
  titleCn: string;
  titleEs: string;
  protagonist: string;
  age: number;
  theme: string;
  style: string;
  createdAt: string;
  isCustom: boolean; // Created by current user in session
  scenes: BookScene[];
  activities: {
    comprehension: {
      question: string;
      correctAnswer: string;
    };
    emotion: {
      question: string;
      options: {
        emotion: "기쁨" | "슬픔" | "공감" | "두려움" | "안도" | "궁금함";
        description: string;
      }[];
    };
    creative: {
      baseTitle: string;
      baseSummary: string;
      contextPrompt: string;
    };
    vocabulary: {
      cards: {
        word: string;
        definition: string;
        example: string;
      }[];
      quiz: {
        sentenceWithBlank: string; // e.g. "하늘의 별들이 ______ 빛나고 있었어요."
        blankWord: string;
        clue: string;
      }[];
    };
  };
}

export interface ReadingHistory {
  taleId: string;
  title: string;
  readAt: string;
  durationSeconds: number;
  completed: boolean;
  percentageRead: number;
  activitiesCompleted: {
    comprehension: boolean;
    emotion: boolean;
    creative: boolean;
    vocabulary: boolean;
  };
  childAnswers?: {
    comprehensionText?: string;
    selectedEmotion?: string;
    creativeText?: string;
    creativeEmotion?: string;
    vocabularyQuizAnswers?: string[];
  };
}

export interface UserSession {
  isLoggedIn: boolean;
  parentName: string;
  parentEmail: string;
  subscriptionType: "free" | "premium";
  profiles: ChildProfile[];
  activeProfileIndex: number;
  history: ReadingHistory[];
  settings: ParentSettings;
}
