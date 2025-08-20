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
          isProcessing: true,
          currentStep: "creating-customer",
          message: stepMessages["creating-customer"],
        });

        const customerApiPromise = customerApi.execute("/customers", {
          method: "POST",
          body: JSON.stringify(customerInput),
        });

        while (customerApi.loading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const customerResponse = await customerApiPromise;

        console.log("🚀 customerResponse:", customerResponse);

        await new Promise((resolve) => setTimeout(resolve, 1000));

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
          isProcessing: true,
          currentStep: "creating-delivery",
          message: stepMessages["creating-delivery"],
        });

        const deliveryApiPromise = deliveryApi.execute("/deliveries", {
          method: "POST",
          body: JSON.stringify(deliveryInput),
        });

        while (deliveryApi.loading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const deliveryResponse = await deliveryApiPromise;

        await new Promise((resolve) => setTimeout(resolve, 1000));

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
          isProcessing: true,
          currentStep: "creating-order",
          message: stepMessages["creating-order"],
        });
        const orderApiPromise = orderApi.execute("/orders", {
          method: "POST",
          body: JSON.stringify(orderInput),
        });

        while (orderApi.loading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const orderResponse = await orderApiPromise;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 4: Realizar Pago con Tarjeta de Crédito
        const paymentInput: ProcessPaymentInput = {
          deliveryAmount: paymentData.deliveryAmount,
          deliveryName: paymentData.deliveryName,
          cardNumber: paymentData.cardNumber.replaceAll(" ", ""),
          expMonth: paymentData.expMonth,
          expYear: paymentData.expYear,
          cvc: paymentData.cvc,
          installments: paymentData.installments,
          cardHolder: paymentData.cardHolder,
        };

        validatePaymentInput(paymentInput);

        updateState({
          isProcessing: true,
          currentStep: "processing-payment",
          message: stepMessages["processing-payment"],
        });

        const paymentApiPromise = paymentApi.execute(`/payments/${orderResponse.id}/pay-with-credit-card`, {
          method: "POST",
          body: JSON.stringify(paymentInput),
        });

        while (paymentApi.loading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const paymentResponse = await paymentApiPromise;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const consolidatedResponse: OrderProcessConsolidatedResponse = {
          customerResponse,
          deliveryResponse,
          orderResponse,
          paymentResponse,
        };

        updateState({
          isProcessing: true,
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
        updateState({
          currentStep: "error",
          message: "Ocurrió un error durante el proceso de la orden",
          isProcessing: false,
        });

        return {
          success: false,
          error: "Ocurrió un error durante el proceso de la orden",
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
