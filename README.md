# Tienda de Productos Web

Este proyecto es una aplicación web de comercio electrónico construida con Next.js y TypeScript. Permite a los usuarios explorar productos, agregarlos a un carrito de compras y simular el proceso de pago a través de un formulario de orden.

## ✨ Características Principales

- **Visualización de Productos**: Muestra una lista de productos disponibles en la página principal.
- **Gestión de Carrito de Compras**: Los usuarios pueden agregar productos al carrito, ver un resumen y ajustar cantidades.
- **Formulario de Pedido**: Un formulario para que los usuarios ingresen su información y completen la compra.
- **Gestión de Estado Centralizada**: Utiliza Redux Toolkit para un manejo predecible y centralizado del estado del carrito y del proceso de compra.
- **Validación de Datos**: Emplea Zod para validar la información del formulario de pedido.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Librería de UI**: [React](https://react.dev/)
- **Gestión de Estado**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) (inferido de la configuración)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Validación de Esquemas**: [Zod](https://zod.dev/)
- **Testing**: [Jest](https://jestjs.io/) y [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 📂 Estructura del Proyecto

El proyecto sigue una estructura organizada para separar responsabilidades:

```
/src
├── app/                # Rutas y páginas de la aplicación (App Router)
│   ├── components/     # Componentes React reutilizables
│   ├── order/          # Página de formulario de pedido
│   └── products/       # Página de listado de productos
├── lib/                # Lógica de negocio, hooks y utilidades
│   ├── api/            # Cliente para consumir APIs externas
│   ├── hooks/          # Hooks personalizados (useApi, useOrderProcess)
│   ├── store/          # Configuración de Redux (store, slices, providers)
│   ├── types/          # Definiciones de tipos y interfaces
│   └── validation/     # Esquemas de validación (Zod)
└── public/             # Archivos estáticos (imágenes, SVGs)
```

## ⚙️ Variables de Entorno

Para que la aplicación funcione correctamente, es necesario configurar las variables de entorno. Crea un archivo `.env.local` en la raíz del proyecto y añade la siguiente variable:

```bash
# URL base del API de productos
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

La aplicación utiliza esta variable para saber a dónde dirigir las peticiones de datos de productos.

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el entorno de desarrollo local.

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Ejecutar el servidor de desarrollo**:
    El servidor se iniciará en `http://localhost:3001`.
    ```bash
    npm run dev
    ```

## 📜 Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes scripts:

- `npm run dev`: Inicia la aplicación en modo de desarrollo con Turbopack.
- `npm run build`: Compila la aplicación para el entorno de producción.
- `npm run start`: Inicia un servidor de producción.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores.
- `npm run test`: Ejecuta las pruebas unitarias y de integración con Jest.
- `npm run test:watch`: Ejecuta las pruebas en modo interactivo.
- `npm run test:coverage`: Genera un reporte de cobertura de las pruebas.