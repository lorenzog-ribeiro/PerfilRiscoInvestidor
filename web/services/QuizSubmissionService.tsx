import { AxiosInstance } from "./Axios";
import {
  InvestorData,
  LiteracyData,
  DospertData,
  TradeOffData,
  EconomyData,
} from "@/services/types";
import { ISFBData } from "@/src/lib/isfb";

export interface CompleteQuizData {
  economyData?: EconomyData;
  investorData: InvestorData;
  literacyData: LiteracyData;
  isfbData?: ISFBData;
  dospertData?: DospertData;
  tradeOffData?: TradeOffData;
}

export interface FormResponse {
  choice: string | number | boolean;
  label: string;
}

export interface TradeoffResponse {
  scenario: string;
  side: string;
  valueVar: number;
  question: string;
  valueFixed: number;
}

export interface SubmissionPayload {
  formData: {
    responses: FormResponse[];
    tradeoffs: TradeoffResponse[];
  };
}

export class QuizSubmissionService {
  /**
   * Convert quiz data to the format expected by the backend
   */
  private formatQuizData(data: CompleteQuizData): SubmissionPayload {
    const responses: FormResponse[] = [];
    const tradeoffs: TradeoffResponse[] = [];

    // Convert Economy data if available
    if (data.economyData) {
      Object.entries(data.economyData).forEach(([questionId, response]) => {
        responses.push({
          choice: response,
          label: `economy_${questionId}`,
        });
      });
    }

    // Convert Investor data
    Object.entries(data.investorData.responses).forEach(
      ([questionId, response]) => {
        responses.push({
          choice: response,
          label: `investor_${questionId}`,
        });
      }
    );

    // Add investor score and profile
    responses.push({
      choice: data.investorData.score,
      label: "investor_score",
    });
    responses.push({
      choice: data.investorData.profile.title,
      label: "investor_profile_title",
    });
    responses.push({
      choice: data.investorData.profile.description,
      label: "investor_profile_description",
    });

    // Convert Literacy data
    Object.entries(data.literacyData).forEach(([questionId, response]) => {
      responses.push({
        choice: response,
        label: `literacy_${questionId}`,
      });
    });

    // Convert ISFB data if available
    if (data.isfbData) {
      Object.entries(data.isfbData).forEach(([questionId, response]) => {
        responses.push({
          choice: response,
          label: `isfb_${questionId}`,
        });
      });
    }

    // Convert Dospert data if available
    if (data.dospertData) {
      Object.entries(data.dospertData).forEach(([questionId, response]) => {
        responses.push({
          choice: response,
          label: `dospert_${questionId}`,
        });
      });
    }

    // Convert TradeOff data if available
    if (data.tradeOffData) {
      Object.entries(data.tradeOffData).forEach(
        ([scenarioKey, scenarioData]) => {
          // Add scenario summary
          responses.push({
            choice: scenarioData.finalValue,
            label: `tradeoff_scenario_${scenarioData.scenario}_final_value`,
          });
          responses.push({
            choice: scenarioData.selectionHistory.join(","),
            label: `tradeoff_scenario_${scenarioData.scenario}_history`,
          });

          // Add detailed tradeoff responses (if we have them)
          scenarioData.selectedValues.forEach((value, index) => {
            tradeoffs.push({
              scenario: scenarioData.scenario.toString(),
              side:
                scenarioData.selectionHistory[index] === "A" ? "left" : "right",
              valueVar: value,
              question: index.toString(),
              valueFixed: 0, // This would need to come from the actual trading data
            });
          });
        }
      );
    }

    return {
      formData: {
        responses,
        tradeoffs,
      },
    };
  }

  /**
   * Submit complete quiz data to the backend
   */
  async submitCompleteQuiz(data: CompleteQuizData): Promise<any> {
    try {
      const payload = this.formatQuizData(data);

      const response = await AxiosInstance.post("/answers/submit", payload, {
        withCredentials: true,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Falha ao enviar dados para o servidor"
      );
    }
  }

  /**
   * Submit quiz data and return formatted payload for debugging
   */
  async submitCompleteQuizWithDebug(data: CompleteQuizData): Promise<{
    response: any;
    payload: SubmissionPayload;
  }> {
    try {
      const payload = this.formatQuizData(data);
      const response = await AxiosInstance.post("/answers/submit", payload);

      return {
        response,
        payload,
      };
    } catch (error) {
      console.error("Error submitting complete quiz:", error);
      throw error;
    }
  }
}
