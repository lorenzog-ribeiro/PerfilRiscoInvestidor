import { AxiosInstance } from "./Axios";
import { FormData } from "@/lib/formBuilder";

/**
 * Service for submitting form data to the backend
 */
export class FormSubmissionService {
  /**
   * Submit complete form data (responses and tradeoffs) to the backend
   * 
   * @param formData - The complete form data object
   * @param userId - The user's unique identifier
   * @returns Promise with the server response
   */
  async submitForm(formData: FormData, userId: string) {
    try {
      const response = await AxiosInstance.post("/answers/submit", {
        formData,
        userId,
      });
      return response;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  }

  /**
   * Submit only responses (without tradeoffs) - for partial submissions
   * 
   * @param responses - Array of form responses
   * @param userId - The user's unique identifier
   * @returns Promise with the server response
   */
  async submitResponses(
    responses: FormData["responses"],
    userId: string
  ) {
    try {
      const response = await AxiosInstance.post("/answers/submit", {
        formData: {
          responses,
          tradeoffs: [],
        },
        userId,
      });
      return response;
    } catch (error) {
      console.error("Error submitting responses:", error);
      throw error;
    }
  }

  /**
   * Submit only tradeoffs (without regular responses) - for partial submissions
   * 
   * @param tradeoffs - Array of tradeoff responses
   * @param userId - The user's unique identifier
   * @returns Promise with the server response
   */
  async submitTradeoffs(
    tradeoffs: FormData["tradeoffs"],
    userId: string
  ) {
    try {
      const response = await AxiosInstance.post("/answers/submit", {
        formData: {
          responses: [],
          tradeoffs,
        },
        userId,
      });
      return response;
    } catch (error) {
      console.error("Error submitting tradeoffs:", error);
      throw error;
    }
  }
}
