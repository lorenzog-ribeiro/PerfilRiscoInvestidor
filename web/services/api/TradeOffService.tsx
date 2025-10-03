import { AxiosInstance } from "../Axios";

interface TradeOffRequest {
  scenario: number;
  optionSelected: string;
  valueVar: number;
  valueFixed: number;
  question?: number;
}

interface TradeOffResponse {
  forecast: {
    mediana: number;
    valor_fixo: number;
  };
}

export class TradeOffService {
  // Método para buscar os valores iniciais ou próximos valores
  async getTradeOffValues(
    scenario: number
  ): Promise<{ data: TradeOffResponse }> {
    // Calcula os valores iniciais baseado no cenário
    const forecast = this.calculateInitialValues(scenario);

    return {
      data: {
        forecast,
      },
    };
  }

  // Método para enviar a resposta do usuário
  async tradeOff(data: TradeOffRequest) {
    // Mapeia os dados do frontend para o formato esperado pelo backend
    const backendData = {
      scenario: data.scenario,
      side: data.optionSelected === "A" ? "left" : "right",
      valueVar: data.valueVar,
      question: data.question || 1,
      valueFixed: data.valueFixed,
    };

    return AxiosInstance.post("answers/tradeOff", backendData);
  }

  // Calcula os valores iniciais baseado no cenário
  private calculateInitialValues(scenario: number): {
    mediana: number;
    valor_fixo: number;
  } {
    switch (scenario) {
      case 0:
      case 1:
        return {
          mediana: 500,
          valor_fixo: 1000,
        };
      case 2:
        return {
          mediana: -1000,
          valor_fixo: 1000,
        };
      case 3:
        return {
          mediana: 250,
          valor_fixo: 500,
        };
      default:
        return {
          mediana: 500,
          valor_fixo: 1000,
        };
    }
  }
}
