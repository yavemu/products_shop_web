"use client";

import { useState, useCallback } from "react";
import { useApiPost } from "./useApiPost";
import type {
  CreateCustomerInput,
  CreateDeliveryInput,
  CreateOrderInput,
  ProcessPaymentInput,
  CreateCustomerResponse,
  CreateDeliveryResponse,
  CreateOrderResponse,
  ProcessPaymentResponse,
  OrderProcessConsolidatedResponse,
} from "@/lib/types/api-interfaces";
import {
  validateCustomerInput,
  validateDeliveryInput,
  validateOrderInput,
  validatePaymentInput,
  ApiValidationError,
} from "@/lib/utils/api-validators";
import type { CreateOrderDto, PayOrderDto } from "@/lib/validation/order";

export type OrderProcessStep = "creating-customer" | "creating-delivery" | "creating-order" | "processing-payment" | "completed" | "error";

export interface OrderProcessState {
  isProcessing: boolean;
  currentStep: OrderProcessStep;
  message: string;
  error?: string;
}

export interface OrderProcessResult {
  success: boolean;
  consolidatedResponse?: OrderProcessConsolidatedResponse;
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

export function useOrderProcess(updateCallback: (state: OrderProcessState) => void) {
  const customerApi = useApiPost<CreateCustomerResponse>();
  const deliveryApi = useApiPost<CreateDeliveryResponse>();
  const orderApi = useApiPost<CreateOrderResponse>();
  const paymentApi = useApiPost<ProcessPaymentResponse>();

  const [state, setState] = useState<OrderProcessState>({
    isProcessing: false,
    currentStep: "creating-customer",
    message: "",
  });

  const updateState = useCallback(
    (updates: Partial<OrderProcessState>) => {
      const newState = { ...state, ...updates };
      setState(newState);
      updateCallback(newState);
    },
    [state, updateCallback],
  );

  const generateTrackingNumber = useCallback((): string => {
    const prefix = "TRK";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }, []);

  const processOrder = useCallback(
    async (orderData: CreateOrderDto, paymentData: PayOrderDto): Promise<OrderProcessResult> => {
      try {
        console.log("🚀 Starting order process", orderData, paymentData);
        updateState({
          isProcessing: true,
          currentStep: "creating-customer",
          message: stepMessages["creating-customer"],
          error: undefined,
        });

        // Step 1: Crear Cliente
        const customerInput: CreateCustomerInput = {
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone || "",
        };

        console.log("🚀 Customer input:", customerInput);

        validateCustomerInput(customerInput);

        updateState({
          currentStep: "creating-customer",
          message: stepMessages["creating-customer"],
        });

        const customerResponse = await customerApi.execute("/customers", {
          method: "POST",
          body: JSON.stringify(customerInput),
        });

        console.log("🚀 customerResponse:", customerResponse);

        // Step 2: Registrar Datos de Entrega
        const deliveryInput: CreateDeliveryInput = {
          name: orderData.customerName,
          trackingNumber: generateTrackingNumber(),
          shippingAddress: orderData.deliveryAddress || "",
          fee: paymentData.deliveryAmount,
          status: "pending",
        };

        validateDeliveryInput(deliveryInput);

        updateState({
          currentStep: "creating-delivery",
          message: stepMessages["creating-delivery"],
        });

        const deliveryResponse = await deliveryApi.execute("/deliveries", {
          method: "POST",
          body: JSON.stringify(deliveryInput),
        });

        // Step 3: Crear Orden
        const orderInput: CreateOrderInput = {
          customerId: customerResponse.id,
          deliveryId: deliveryResponse.id,
          customerName: customerResponse.name,
          customerEmail: customerResponse.email,
          customerPhone: customerResponse.phone,
          shippingAddress: deliveryResponse.shippingAddress,
          products: orderData.products,
        };

        validateOrderInput(orderInput, customerResponse, deliveryResponse);

        updateState({
          currentStep: "creating-order",
          message: stepMessages["creating-order"],
        });

        const orderResponse = await orderApi.execute("/orders", {
          method: "POST",
          body: JSON.stringify(orderInput),
        });

        // Step 4: Realizar Pago con Tarjeta de Crédito
        const paymentInput: ProcessPaymentInput = {
          deliveryAmount: paymentData.deliveryAmount,
          deliveryName: paymentData.deliveryName,
          cardNumber: paymentData.cardNumber.replaceAll(" ", ""), // Remove spaces
          expMonth: paymentData.expMonth,
          expYear: paymentData.expYear,
          cvc: paymentData.cvc,
          installments: paymentData.installments,
          cardHolder: paymentData.cardHolder,
        };

        validatePaymentInput(paymentInput);

        updateState({
          currentStep: "processing-payment",
          message: stepMessages["processing-payment"],
        });

        const paymentResponse = await paymentApi.execute(`/payment/${orderResponse.id}/pay-with-credit-card`, {
          method: "POST",
          body: JSON.stringify(paymentInput),
        });

        // Consolidate all responses
        const consolidatedResponse: OrderProcessConsolidatedResponse = {
          customerResponse,
          deliveryResponse,
          orderResponse,
          paymentResponse,
        };

        updateState({
          currentStep: "completed",
          message: stepMessages["completed"],
        });

        setTimeout(() => {
          updateState({
            isProcessing: false,
          });
        }, 1500);

        return {
          success: true,
          consolidatedResponse,
        };
      } catch (error) {
        let errorMessage = "Error desconocido";

        if (error instanceof ApiValidationError) {
          errorMessage = `Validación fallida: ${error.message}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        updateState({
          currentStep: "error",
          message: stepMessages["error"],
          error: errorMessage,
          isProcessing: false,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [customerApi, deliveryApi, orderApi, paymentApi, generateTrackingNumber, updateState],
  );

  const reset = useCallback(() => {
    customerApi.reset();
    deliveryApi.reset();
    orderApi.reset();
    paymentApi.reset();

    setState({
      isProcessing: false,
      currentStep: "creating-customer",
      message: "",
    });
  }, [customerApi, deliveryApi, orderApi, paymentApi]);

  return {
    processOrder,
    reset,
    state,
    // Individual API states for debugging
    customerState: {
      loading: customerApi.loading,
      error: customerApi.error,
      data: customerApi.data,
    },
    deliveryState: {
      loading: deliveryApi.loading,
      error: deliveryApi.error,
      data: deliveryApi.data,
    },
    orderState: {
      loading: orderApi.loading,
      error: orderApi.error,
      data: orderApi.data,
    },
    paymentState: {
      loading: paymentApi.loading,
      error: paymentApi.error,
      data: paymentApi.data,
    },
  };
}
