import { z } from "zod";

export const CreateOrderProductsSchema = z.object({
  id: z.number().int().min(1, "Product ID must be greater than 0"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const CreateOrderFormSchema = z.object({
  customerName: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede tener más de 100 caracteres"),
  customerEmail: z.string().min(1, "El email es requerido").email("El email no es válido"),
  customerPhone: z.string().max(20, "El teléfono no puede tener más de 20 caracteres").optional(),
  deliveryAddress: z.string().min(1, "La dirección de envío es requerida"),
  products: z.array(CreateOrderProductsSchema).min(1, "Se requiere al menos un producto"),
});

export const CreateOrderSchema = CreateOrderFormSchema.extend({
  customerId: z.number().int().min(1),
  deliveryId: z.number().int().min(1),
});

export const PayOrderSchema = z.object({
  deliveryAmount: z.number().min(0),
  deliveryName: z.string().min(1, "El proveedor de envío es requerido"),
  cardNumber: z
    .string()
    .min(1, "El número de tarjeta es requerido")
    .refine((val) => /^\d{13,19}$/.test(val.replace(/\s/g, "")), "Número de tarjeta inválido"),
  expMonth: z
    .string()
    .min(1, "El mes de expiración es requerido")
    .refine((val) => /^(0[1-9]|1[0-2])$/.test(val), "Mes inválido (01-12)"),
  expYear: z
    .string()
    .min(1, "El año de expiración es requerido")
    .refine((val) => /^\d{2,4}$/.test(val), "Año inválido"),
  cvc: z
    .string()
    .min(1, "El CVC es requerido")
    .refine((val) => /^\d{3,4}$/.test(val), "CVC inválido (3-4 dígitos)"),
  installments: z.number().int().min(1),
  cardHolder: z.string().min(1, "El nombre del titular es requerido"),
});

export type CreateOrderProductsDto = z.infer<typeof CreateOrderProductsSchema>;
export type CreateOrderFormDto = z.infer<typeof CreateOrderFormSchema>;
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type PayOrderDto = z.infer<typeof PayOrderSchema>;
