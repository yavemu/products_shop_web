import { CreateOrderDto, PayOrderDto } from "@/lib/validation/order";
import { apiClient } from "@/lib/api/apiClient";

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

interface CustomerResponse {
  id: number;
  [key: string]: unknown;
}

interface DeliveryResponse {
  id: number;
  [key: string]: unknown;
}

interface OrderResponse {
  id: number;
  [key: string]: unknown;
}

interface PaymentResponse {
  id: string;
  [key: string]: unknown;
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

  private async crearCliente(customerData: unknown): Promise<CustomerResponse> {
    this.updateState({
      currentStep: "creating-customer",
      message: stepMessages["creating-customer"],
    });

    return await apiClient<CustomerResponse>("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    });
  }

  private async registrarDatosDeEntrega(deliveryData: unknown): Promise<DeliveryResponse> {
    this.updateState({
      currentStep: "creating-delivery",
      message: stepMessages["creating-delivery"],
    });

    return await apiClient<DeliveryResponse>("/deliveries", {
      method: "POST",
      body: JSON.stringify(deliveryData),
    });
  }

  private async crearOrden(orderData: unknown): Promise<OrderResponse> {
    this.updateState({
      currentStep: "creating-order",
      message: stepMessages["creating-order"],
    });

    return await apiClient<OrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  private async realizarPagoTC(orderId: number, paymentData: PayOrderDto): Promise<PaymentResponse> {
    this.updateState({
      currentStep: "processing-payment",
      message: stepMessages["processing-payment"],
    });

    return await apiClient<PaymentResponse>(`/payments/${orderId}`, {
      method: "POST",
      body: JSON.stringify(paymentData),
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

      // Step 1: Crear Cliente
      const customerResult = await this.crearCliente({
        // Extract customer data from orderData
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
      });
      const customerId = customerResult.id;

      // Step 2: Registrar Datos de Entrega
      const deliveryResult = await this.registrarDatosDeEntrega({
        customerId,
        address: orderData.deliveryAddress,
        // Add other delivery data as needed
      });
      const deliveryId = deliveryResult.id;

      // Step 3: Crear Orden
      const finalOrderData = {
        ...orderData,
        customerId,
        deliveryId,
      };
      const orderResult = await this.crearOrden(finalOrderData);
      const orderId = orderResult.id;

      // Step 4: Realizar Pago con Tarjeta de Crédito
      const paymentResult = await this.realizarPagoTC(orderId, paymentData);
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
