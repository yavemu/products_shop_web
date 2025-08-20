import { CreateOrderDto, PayOrderDto } from "@/lib/validation/order";

export type OrderProcessStep = "creating-customer" | "creating-delivery" | "creating-order" | "processing-payment" | "completed" | "error";

export interface OrderProcessState {
  isProcessing: boolean;
  currentStep: OrderProcessStep;
  message: string;
  error?: string;
}

export interface OrderProcessResult {
  success: boolean;
  customerId?: number;
  deliveryId?: number;
  orderId?: number;
  paymentId?: string;
  error?: string;
}

const stepMessages: Record<OrderProcessStep, string> = {
  "creating-customer": "Creando cliente...",
  "creating-delivery": "Creando delivery...",
  "creating-order": "Creando orden...",
  "processing-payment": "Iniciando pago con tarjeta de crédito...",
  completed: "¡Proceso completado exitosamente!",
  error: "Error en el proceso",
};

export class OrderProcessHelper {
  private updateCallback: (state: OrderProcessState) => void;
  private state: OrderProcessState;

  constructor(updateCallback: (state: OrderProcessState) => void) {
    this.updateCallback = updateCallback;
    this.state = {
      isProcessing: false,
      currentStep: "creating-customer",
      message: "",
    };
  }

  private updateState(updates: Partial<OrderProcessState>) {
    this.state = { ...this.state, ...updates };
    this.updateCallback(this.state);
  }

  private async simulateEndpointCall(step: OrderProcessStep, duration: number = 2000): Promise<any> {
    this.updateState({
      currentStep: step,
      message: stepMessages[step],
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id: Math.floor(Math.random() * 1000) + 1 });
      }, duration);
    });
  }

  async processOrder(orderData: CreateOrderDto, paymentData: PayOrderDto): Promise<OrderProcessResult> {
    try {
      this.updateState({
        isProcessing: true,
        currentStep: "creating-customer",
        message: stepMessages["creating-customer"],
        error: undefined,
      });

      const customerResult = await this.simulateEndpointCall("creating-customer", 1500);
      const customerId = customerResult.id;

      const deliveryResult = await this.simulateEndpointCall("creating-delivery", 1200);
      const deliveryId = deliveryResult.id;

      const finalOrderData = {
        ...orderData,
        customerId,
        deliveryId,
      };

      const orderResult = await this.simulateEndpointCall("creating-order", 1800);
      const orderId = orderResult.id;

      const paymentResult = await this.simulateEndpointCall("processing-payment", 2200);
      const paymentId = paymentResult.id;

      this.updateState({
        currentStep: "completed",
        message: stepMessages["completed"],
      });

      setTimeout(() => {
        this.updateState({
          isProcessing: false,
        });
      }, 1500);

      return {
        success: true,
        customerId,
        deliveryId,
        orderId,
        paymentId,
      };
    } catch (error) {
      this.updateState({
        currentStep: "error",
        message: stepMessages["error"],
        error: error instanceof Error ? error.message : "Error desconocido",
        isProcessing: false,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  reset() {
    this.state = {
      isProcessing: false,
      currentStep: "creating-customer",
      message: "",
    };
  }
}
