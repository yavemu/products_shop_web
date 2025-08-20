import type {
  CreateCustomerInput,
  CreateDeliveryInput,
  CreateOrderInput,
  ProcessPaymentInput,
  CreateCustomerResponse,
  CreateDeliveryResponse,
} from "@/lib/types/api-interfaces";

export class ApiValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ApiValidationError";
  }
}

export function validateCustomerInput(input: CreateCustomerInput): void {
  if (!input.name || input.name.trim() === "") {
    throw new ApiValidationError("Nombre es requerido", "name");
  }
  if (input.name.length > 100) {
    throw new ApiValidationError("Nombre no puede exceder 100 caracteres", "name");
  }

  if (!input.email || input.email.trim() === "") {
    throw new ApiValidationError("Email es requerido", "email");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    throw new ApiValidationError("Email debe tener formato válido", "email");
  }
  if (input.email.length > 100) {
    throw new ApiValidationError("Email no puede exceder 100 caracteres", "email");
  }

  if (!input.phone || input.phone.trim() === "") {
    throw new ApiValidationError("Teléfono es requerido", "phone");
  }
  if (input.phone.length > 20) {
    throw new ApiValidationError("Teléfono no puede exceder 20 caracteres", "phone");
  }

  console.log("Customer input validated:", input);
}

export function validateDeliveryInput(input: CreateDeliveryInput): void {
  if (!input.name || input.name.trim() === "") {
    throw new ApiValidationError("Nombre del destinatario es requerido", "name");
  }
  if (input.name.length > 100) {
    throw new ApiValidationError("Nombre del destinatario no puede exceder 100 caracteres", "name");
  }

  if (!input.trackingNumber || input.trackingNumber.trim() === "") {
    throw new ApiValidationError("Número de seguimiento es requerido", "trackingNumber");
  }
  if (input.trackingNumber.length > 100) {
    throw new ApiValidationError("Número de seguimiento no puede exceder 100 caracteres", "trackingNumber");
  }

  if (!input.shippingAddress || input.shippingAddress.trim() === "") {
    throw new ApiValidationError("Dirección de envío es requerida", "shippingAddress");
  }
  if (input.shippingAddress.length > 255) {
    throw new ApiValidationError("Dirección de envío no puede exceder 255 caracteres", "shippingAddress");
  }

  if (typeof input.fee !== "number" || input.fee <= 0) {
    throw new ApiValidationError("Costo de envío debe ser un número positivo", "fee");
  }

  const validStatuses = ["pending", "in_transit", "delivered", "failed"];
  if (!validStatuses.includes(input.status)) {
    throw new ApiValidationError("Estado debe ser: pending, in_transit, delivered o failed", "status");
  }
}

export function validateOrderInput(
  input: CreateOrderInput,
  customerResponse: CreateCustomerResponse,
  deliveryResponse: CreateDeliveryResponse,
): void {
  if (typeof input.customerId !== "number" || input.customerId <= 0) {
    throw new ApiValidationError("ID del cliente debe ser un número positivo", "customerId");
  }
  if (input.customerId !== customerResponse.id) {
    throw new ApiValidationError("ID del cliente no coincide con el cliente creado", "customerId");
  }

  if (typeof input.deliveryId !== "number" || input.deliveryId <= 0) {
    throw new ApiValidationError("ID del delivery debe ser un número positivo", "deliveryId");
  }
  if (input.deliveryId !== deliveryResponse.id) {
    throw new ApiValidationError("ID del delivery no coincide con el delivery creado", "deliveryId");
  }

  if (!input.customerName || input.customerName.trim() === "") {
    throw new ApiValidationError("Nombre del cliente es requerido", "customerName");
  }
  if (input.customerName !== customerResponse.name) {
    throw new ApiValidationError("Nombre del cliente debe coincidir con el cliente creado", "customerName");
  }
  if (input.customerName.length > 100) {
    throw new ApiValidationError("Nombre del cliente no puede exceder 100 caracteres", "customerName");
  }

  if (!input.customerEmail || input.customerEmail.trim() === "") {
    throw new ApiValidationError("Email del cliente es requerido", "customerEmail");
  }
  if (input.customerEmail !== customerResponse.email) {
    throw new ApiValidationError("Email del cliente debe coincidir con el cliente creado", "customerEmail");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.customerEmail)) {
    throw new ApiValidationError("Email del cliente debe tener formato válido", "customerEmail");
  }

  if (input.customerPhone && input.customerPhone.length > 20) {
    throw new ApiValidationError("Teléfono del cliente no puede exceder 20 caracteres", "customerPhone");
  }

  if (!input.shippingAddress || input.shippingAddress.trim() === "") {
    throw new ApiValidationError("Dirección de envío es requerida", "shippingAddress");
  }
  if (input.shippingAddress !== deliveryResponse.shippingAddress) {
    throw new ApiValidationError("Dirección de envío debe coincidir con el delivery creado", "shippingAddress");
  }

  if (!Array.isArray(input.products) || input.products.length === 0) {
    throw new ApiValidationError("Debe incluir al menos un producto", "products");
  }

  input.products.forEach((product, index) => {
    if (typeof product.id !== "number" || product.id <= 0) {
      throw new ApiValidationError(`ID del producto en posición ${index + 1} debe ser un número positivo`, "products");
    }
    if (typeof product.quantity !== "number" || product.quantity <= 0) {
      throw new ApiValidationError(`Cantidad del producto en posición ${index + 1} debe ser un número positivo`, "products");
    }
  });
}

export function validatePaymentInput(input: ProcessPaymentInput): void {
  if (typeof input.deliveryAmount !== "number" || input.deliveryAmount <= 0) {
    throw new ApiValidationError("Monto del delivery debe ser un número positivo", "deliveryAmount");
  }

  if (!input.deliveryName || input.deliveryName.trim() === "") {
    throw new ApiValidationError("Nombre del proveedor de delivery es requerido", "deliveryName");
  }

  if (!input.cardNumber || input.cardNumber.trim() === "") {
    throw new ApiValidationError("Número de tarjeta es requerido", "cardNumber");
  }
  // Normalize card number by removing spaces and non-digits
  const normalizedCardNumber = input.cardNumber.replaceAll(" ", "");

  if (!/^\d+$/.test(normalizedCardNumber)) {
    throw new ApiValidationError("Número de tarjeta debe contener solo dígitos", "cardNumber");
  }
  if (normalizedCardNumber.length < 13 || normalizedCardNumber.length > 19) {
    throw new ApiValidationError("Número de tarjeta debe tener entre 13 y 19 dígitos", "cardNumber");
  }

  if (!input.expMonth || input.expMonth.trim() === "") {
    throw new ApiValidationError("Mes de expiración es requerido", "expMonth");
  }
  if (!/^(0[1-9]|1[0-2])$/.test(input.expMonth)) {
    throw new ApiValidationError("Mes de expiración debe estar entre 01 y 12", "expMonth");
  }

  if (!input.expYear || input.expYear.trim() === "") {
    throw new ApiValidationError("Año de expiración es requerido", "expYear");
  }
  if (!/^\d+$/.test(input.expYear) || input.expYear.length < 2 || input.expYear.length > 4) {
    throw new ApiValidationError("Año de expiración debe tener entre 2 y 4 dígitos", "expYear");
  }

  if (!input.cvc || input.cvc.trim() === "") {
    throw new ApiValidationError("Código de seguridad es requerido", "cvc");
  }
  if (!/^\d{3}$/.test(input.cvc)) {
    throw new ApiValidationError("Código de seguridad debe tener exactamente 3 dígitos", "cvc");
  }

  if (typeof input.installments !== "number" || input.installments <= 0) {
    throw new ApiValidationError("Número de cuotas debe ser un número positivo", "installments");
  }

  if (!input.cardHolder || input.cardHolder.trim() === "") {
    throw new ApiValidationError("Nombre del titular es requerido", "cardHolder");
  }
}
