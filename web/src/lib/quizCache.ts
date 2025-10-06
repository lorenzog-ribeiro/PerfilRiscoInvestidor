import {
  InvestorData,
  LiteracyData,
  DospertData,
  TradeOffData,
  EconomyData,
} from "@/services/types";

export interface QuizProgress {
  currentScreen: number; // 0: Investor, 1: Literacy, 2: RiskTaking, 3: Results
  investorData?: InvestorData;
  literacyData?: LiteracyData;
  dospertData?: DospertData;
  tradeOffData?: TradeOffData;
  economyData?: EconomyData;
  timestamp: number;
  expiresAt: number;
}

const CACHE_KEY = "quiz_progress";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export class QuizCache {
  static save(progress: Partial<QuizProgress>): void {
    try {
      const now = Date.now();
      const existing = this.load();

      const updatedProgress: QuizProgress = {
        currentScreen: 0,
        timestamp: now,
        expiresAt: now + CACHE_DURATION,
        ...existing,
        ...progress,
      };

      sessionStorage.setItem(CACHE_KEY, JSON.stringify(updatedProgress));
      localStorage.setItem(CACHE_KEY, JSON.stringify(updatedProgress)); // Backup in localStorage
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  }

  static load(): QuizProgress | null {
    try {
      // Try sessionStorage first, then localStorage as backup
      let cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) {
        cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          // Restore to sessionStorage
          sessionStorage.setItem(CACHE_KEY, cached);
        }
      }

      if (!cached) return null;

      const progress: QuizProgress = JSON.parse(cached);

      // Check if cache has expired
      if (Date.now() > progress.expiresAt) {
        this.clear();
        return null;
      }

      return progress;
    } catch (error) {
      console.error("Error loading quiz progress:", error);
      return null;
    }
  }

  static clear(): void {
    try {
      sessionStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_KEY);
      // Also clear individual tradeOff data
      sessionStorage.removeItem("tradeOffData");
    } catch (error) {
      console.error("Error clearing quiz cache:", error);
    }
  }

  static isExpired(): boolean {
    const progress = this.load();
    return !progress || Date.now() > progress.expiresAt;
  }

  static extendExpiration(): void {
    const progress = this.load();
    if (progress) {
      progress.expiresAt = Date.now() + CACHE_DURATION;
      this.save(progress);
    }
  }

  static hasCompleteData(): boolean {
    const progress = this.load();
    return !!(
      progress?.investorData &&
      progress?.literacyData &&
      progress?.dospertData
    );
  }

  static getTimeRemaining(): number {
    const progress = this.load();
    if (!progress) return 0;
    return Math.max(0, progress.expiresAt - Date.now());
  }
}
