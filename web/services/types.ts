
export enum Screen {
  Instructions,
  Investor,
  Literacy,
  RiskTaking,
  Results,
}

export interface InvestorProfile {
  title: string;
  description: string;
}

export interface InvestorData {
  responses: Record<string, string>;
  score: number;
  profile: InvestorProfile;
}

export type LiteracyData = Record<string, string>;
export type DospertData = Record<string, number>;

export interface DospertDomainInfo {
    name: string;
    items: number[];
    color: string;
    textColor: string;
}

export interface DospertResult {
    domain: string;
    name: string;
    avg: number;
    classification: string;
    text: string;
    color: string;
    textColor: string;
}
