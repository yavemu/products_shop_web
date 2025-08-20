export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
}

export interface CreateDeliveryInput {
  name: string;
  trackingNumber: string;
  shippingAddress: string;
  fee: number;
  status: "pending" | "in_transit" | "delivered" | "failed";
}

export interface CreateOrderInput {
  customerId: number;
  deliveryId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface ProcessPaymentInput {
  deliveryAmount: number;
  deliveryName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  installments: number;
  cardHolder: string;
}

export interface CreateCustomerResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CreateDeliveryResponse {
  id: number;
  name: string;
  trackingNumber: string;
  shippingAddress: string;
  fee: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    id: number;
    name: string;
    trackingNumber: string;
    shippingAddress: string;
    fee: number;
    status: string;
  };
  products: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

export interface ProcessPaymentResponse {
  transaction_id: string;
  status: string;
  amount: number;
  order: {
    id: number;
    status: string;
    total: number;
  };
  message: string;
}

export interface OrderProcessConsolidatedResponse {
  customerResponse: CreateCustomerResponse;
  deliveryResponse: CreateDeliveryResponse;
  orderResponse: CreateOrderResponse;
  paymentResponse: ProcessPaymentResponse;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
