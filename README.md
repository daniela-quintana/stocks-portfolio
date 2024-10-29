# 📈 Stocks Portfolio - React + TypeScript + Vite Application

Este proyecto es una aplicación de React desarrollada con TypeScript y Vite. Permite al usuario ver el rendimiento y las ganancias de un portafolio de acciones en un rango de fechas específico, usando datos de una API para obtener precios de acciones históricos.

## 🛠 Tecnologías utilizadas

- **React**: Para la construcción de la interfaz de usuario.
- **TypeScript**: Para una programación tipada y más robusta.
- **Vite**: Para una configuración rápida y eficiente del proyecto.
- **API de Alpaca**: Utilizada para obtener datos históricos de precios de acciones.
- **CSS**: Para el estilo y diseño de la interfaz.

## 🌟 Características principales

1. **Selección de acciones**: El usuario puede elegir entre varias acciones (AAPL, AMZN, IBM, GOOGL).
2. **Consulta de rendimiento y ganancia**:
   - **Profit**: Calcula la ganancia total de la acción entre dos fechas seleccionadas.
   - **Annualized Return**: Calcula el retorno anualizado entre las fechas seleccionadas.
3. **Actualización dinámica**: La aplicación obtiene y actualiza automáticamente los precios de las acciones y el rendimiento al seleccionar diferentes fechas y acciones.
4. **Carga dinámica de datos de usuario**: Integra un saludo personalizado basado en un nombre obtenido de la API de Random User.
5. **Manejo de errores**: Indica al usuario si hay errores al obtener datos de la API.
6. **Indicador de carga**: Muestra un spinner mientras se obtienen datos de la API.

## 📦 Configuración del proyecto

1. **Clona este repositorio**:
    ```bash
    git clone <url_del_repositorio>
    cd <nombre_del_proyecto>
    ```

2. **Instala las dependencias**:
    ```bash
    npm install
    ```

3. **Crea un archivo `.env` en la raíz del proyecto** y define tus credenciales de la API de Alpaca:
    ```bash
    VITE_API_KEY=your_api_key
    VITE_API_SECRET=your_api_secret
    ```

4. **Inicia el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

## 🗂 Estructura del código

- **`App.tsx`**: Componente principal que contiene la lógica de selección de acciones, obtención de datos, y cálculo de beneficios y retornos.
- **Componentes**:
   - `Stock` y `Portfolio`: Estructuras de datos para representar cada acción y el portafolio completo.
- **Estilos**:
   - `App.css`: Contiene el estilo general de la aplicación.

## 🌐 API usada

- [API de Alpaca](https://alpaca.markets/docs/api-references/market-data-api/) - Para obtener datos de precios históricos de acciones.
- [Random User API](https://randomuser.me/) - Para obtener un nombre de usuario aleatorio que se muestra en la bienvenida.

## 🚀 Uso de la Aplicación

1. Selecciona una acción desde el menú desplegable.
2. Especifica las fechas de inicio y fin para calcular la ganancia y el retorno anualizado.
3. Observa los valores calculados que se muestran en la sección **Profit** y **Annualized Return**.

## 🌐 GitHub Pages

Puedes ver la aplicación en vivo en [GitHub Pages](link).
