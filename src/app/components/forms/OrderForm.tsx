"use client";

import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { updateItemQuantity, removeFromCart } from "@/lib/store/cartSlice";
import { formatCurrency } from "@/lib/currency-utils";
import { ArrowLeft, CreditCard, Truck, Trash2 } from "lucide-react";
import { CreateOrderFormSchema, PayOrderSchema, type CreateOrderFormDto, type PayOrderDto, type CreateOrderDto } from "@/lib/validation/order";
import { OrderProcessHelper, type OrderProcessState } from "@/lib/helpers/orderProcess";
import OrderProcessStatus from "../ui/OrderProcessStatus";

import FormContainer from "./FormContainer";
import FormSection from "./FormSection";
import FormActions from "./FormActions";
import TextInput from "./fields/TextInput";
import TextArea from "./fields/TextArea";
import Select from "./fields/Select";
import QuantityInput from "./fields/QuantityInput";

interface OrderFormProps {
  onBack: () => void;
  onSubmit: (orderData: CreateOrderDto, paymentData: PayOrderDto) => void;
}

const deliveryProviders = [
  { value: "Interrapidisimo", label: "Interrapidisimo", cost: "15000" },
  { value: "Servientrega", label: "Servientrega", cost: "18000" },
  { value: "Coordinadora", label: "Coordinadora", cost: "12000" },
  { value: "Envía", label: "Envía", cost: "16000" },
];

const installmentOptions = [1, 3, 6, 9, 12, 18, 24, 36, 48].map((months) => ({
  value: months,
  label: months === 1 ? "1 cuota" : `${months} cuotas`,
}));

function OrderForm({ onBack, onSubmit }: OrderFormProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [customerData, setCustomerData] = useState<CreateOrderFormDto>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    products: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
  });

  const [paymentData, setPaymentData] = useState<PayOrderDto>({
    deliveryAmount: 15000,
    deliveryName: "Interrapidisimo",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    installments: 1,
    cardHolder: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processState, setProcessState] = useState<OrderProcessState>({
    isProcessing: false,
    currentStep: "creating-customer",
    message: "",
  });

  const orderProcessHelper = useRef<OrderProcessHelper | null>(null);

  if (!orderProcessHelper.current) {
    orderProcessHelper.current = new OrderProcessHelper(setProcessState);
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + paymentData.deliveryAmount;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateItemQuantity({ id: productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleCustomerDataChange = (field: keyof CreateOrderFormDto, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentDataChange = (field: keyof PayOrderDto, value: string | number) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDeliveryChange = (providerName: string | number) => {
    const provider = deliveryProviders.find((p) => p.value === providerName);
    if (provider) {
      setPaymentData((prev) => ({
        ...prev,
        deliveryName: provider.value,
        deliveryAmount: parseInt(provider.cost),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const updatedCustomerData = {
      ...customerData,
      products: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
    };

    const customerValidation = CreateOrderFormSchema.safeParse(updatedCustomerData);
    if (!customerValidation.success) {
      customerValidation.error.issues.forEach((error) => {
        if (error.path.length > 0) {
          newErrors[error.path.join(".")] = error.message;
        }
      });
    }

    const paymentValidation = PayOrderSchema.safeParse(paymentData);
    if (!paymentValidation.success) {
      paymentValidation.error.issues.forEach((error) => {
        if (error.path.length > 0) {
          newErrors[error.path.join(".")] = error.message;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !processState.isProcessing) {
      const orderData: CreateOrderDto = {
        ...customerData,
        products: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
        customerId: 1,
        deliveryId: 1,
      };

      try {
        const result = await orderProcessHelper.current!.processOrder(orderData, paymentData);

        if (result.success) {
          setTimeout(() => {
            onSubmit(orderData, paymentData);
          }, 1500);
        } else {
          console.error("Order process failed:", result.error);
        }
      } catch (error) {
        console.error("Error processing order:", error);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="order-form-container">
        <div className="order-form-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Volver al carrito</span>
          </button>
          <h1 className="form-title">Carrito Vacío</h1>
        </div>
        <div className="empty-cart-message">
          <p>No tienes productos en tu carrito. Agrega algunos productos antes de continuar.</p>
        </div>
      </div>
    );
  }

  const formActions = [
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: processState.isProcessing ? "Procesando..." : `Crear orden y pagar ${formatCurrency(total)}`,
      icon: <CreditCard size={18} />,
      disabled: processState.isProcessing,
      loading: processState.isProcessing,
    },
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Volver al carrito",
      icon: <ArrowLeft size={18} />,
      onClick: onBack,
      disabled: processState.isProcessing,
    },
  ];

  const deliveryRadioOptions = deliveryProviders.map((provider) => ({
    value: provider.value,
    label: provider.label,
    cost: formatCurrency(parseInt(provider.cost)),
  }));

  return (
    <div className="order-form-container">
      <FormContainer title="Información de Pago y Entrega" onSubmit={handleSubmit}>
        <fieldset disabled={processState.isProcessing}>
          <div className="form-row">
            <FormSection title="Productos Seleccionados" className="flex-1">
              <div className="products-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="product-item">
                    <div className="product-info">
                      <span className="product-name">{item.name}</span>
                      <span className="product-price">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="product-actions">
                      <QuantityInput value={item.quantity} onChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)} min={1} max={99} />
                      <span className="item-total">{formatCurrency(item.price * item.quantity)}</span>
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="remove-btn" title="Eliminar producto">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>

            <FormSection title="Información Personal" className="flex-1">
              <TextInput
                id="customerName"
                label="Nombre completo"
                value={customerData.customerName}
                onChange={(value) => handleCustomerDataChange("customerName", value)}
                placeholder="Juan Pérez"
                required
                maxLength={100}
                error={errors.customerName}
              />

              <TextInput
                id="customerEmail"
                label="Correo electrónico"
                type="email"
                value={customerData.customerEmail}
                onChange={(value) => handleCustomerDataChange("customerEmail", value)}
                placeholder="juan.perez@email.com"
                required
                error={errors.customerEmail}
              />

              <TextInput
                id="customerPhone"
                label="Teléfono"
                type="tel"
                value={customerData.customerPhone || ""}
                onChange={(value) => handleCustomerDataChange("customerPhone", value)}
                placeholder="+57 300 123 4567"
                maxLength={20}
                error={errors.customerPhone}
              />

              <TextArea
                id="shippingAddress"
                label="Dirección de envío"
                value={customerData.deliveryAddress}
                onChange={(value) => handleCustomerDataChange("deliveryAddress", value)}
                placeholder="Calle 123, Medellín, Colombia"
                required
                rows={3}
                error={errors.deliveryAddress}
                className="form-group-full"
              />

              <div className="payment-section-header">
                <CreditCard size={20} />
                <span>Información de Pago</span>
              </div>

              <TextInput
                id="cardHolder"
                label="Nombre del titular"
                value={paymentData.cardHolder}
                onChange={(value) => handlePaymentDataChange("cardHolder", value)}
                placeholder="Juan Perez"
                required
                error={errors.cardHolder}
                className="form-group-full"
              />

              <TextInput
                id="cardNumber"
                label="Número de tarjeta"
                value={paymentData.cardNumber}
                onChange={(value) => {
                  const cleanValue = value.replace(/\D/g, "").slice(0, 19);
                  const formatted = cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ");
                  handlePaymentDataChange("cardNumber", formatted);
                }}
                placeholder="4242 4242 4242 4242"
                required
                error={errors.cardNumber}
                className="form-group-full"
              />

              <TextInput
                id="expMonth"
                label="Mes de expiración"
                value={paymentData.expMonth}
                onChange={(value) => {
                  const cleanValue = value.replace(/\D/g, "").slice(0, 2);
                  handlePaymentDataChange("expMonth", cleanValue);
                }}
                placeholder="12"
                required
                maxLength={2}
                error={errors.expMonth}
              />

              <TextInput
                id="expYear"
                label="Año de expiración"
                value={paymentData.expYear}
                onChange={(value) => {
                  const cleanValue = value.replace(/\D/g, "").slice(0, 2);
                  handlePaymentDataChange("expYear", cleanValue);
                }}
                placeholder="29"
                required
                maxLength={2}
                error={errors.expYear}
              />

              <TextInput
                id="cvc"
                label="CVC"
                value={paymentData.cvc}
                onChange={(value) => {
                  const cleanValue = value.replace(/\D/g, "").slice(0, 4);
                  handlePaymentDataChange("cvc", cleanValue);
                }}
                placeholder="123"
                required
                maxLength={4}
                error={errors.cvc}
              />

              <Select
                id="installments"
                label="Número de cuotas"
                value={paymentData.installments}
                onChange={(value) => handlePaymentDataChange("installments", parseInt(value as string))}
                options={installmentOptions.map((option) => ({
                  ...option,
                  label: option.value > 1 ? `${option.label} - ${formatCurrency(total / option.value)} c/u` : option.label,
                }))}
                required
                error={errors.installments}
              />
            </FormSection>
          </div>

          <div className="form-row">
            <FormSection title="" className="flex-1">
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal productos:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío ({paymentData.deliveryName}):</span>
                  <span>{formatCurrency(paymentData.deliveryAmount)}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {paymentData.installments > 1 && (
                  <div className="summary-row summary-installments">
                    <span>{paymentData.installments} cuotas de:</span>
                    <span>{formatCurrency(total / paymentData.installments)}</span>
                  </div>
                )}
              </div>

              <div className="delivery-section">
                <div className="delivery-header">
                  <Truck size={18} />
                  <span>Información de Entrega</span>
                </div>
                <Select
                  id="deliveryProvider"
                  label="Proveedor de envío"
                  value={paymentData.deliveryName}
                  onChange={handleDeliveryChange}
                  options={deliveryRadioOptions}
                  required
                />
              </div>
              <FormActions actions={formActions} />
            </FormSection>
          </div>
        </fieldset>
      </FormContainer>

      <OrderProcessStatus state={processState} />
    </div>
  );
}

export default OrderForm;
