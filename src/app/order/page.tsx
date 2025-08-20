"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { clearCart } from "@/lib/store/cartSlice";
import OrderForm, { CreateOrderDto, PayOrderDto } from "../components/forms/OrderForm";

export default function OrderPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBack = () => {
    router.push("/");
  };

  const handleOrderSubmit = (orderData: CreateOrderDto, paymentData: PayOrderDto) => {
    console.log("Order submitted:", { orderData, paymentData });
    dispatch(clearCart());

    if (typeof window !== "undefined") {
      localStorage.removeItem("carrito");
    }

    router.push("/");
  };

  return <OrderForm onBack={handleBack} onSubmit={handleOrderSubmit} />;
}
