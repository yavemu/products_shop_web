"use client";

const CartSummary = () => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Resumen del carrito</h2>
      <p>
        Cantidad de productos: <span className="font-bold">XXX</span>
      </p>
      <p>
        Total: <span className="font-bold">XXXXX</span>
      </p>
      <button
        className="bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
        //disabled={totalItems === 0}
        onClick={() => alert("Realizar compra")}
      >
        Realizar la compra
      </button>
      {/* <button className="bg-red-500 text-white py-2 rounded-xl hover:bg-red-600" onClick={clearCart}>
        Vaciar carrito
      </button> */}
    </div>
  );
};

export default CartSummary;
