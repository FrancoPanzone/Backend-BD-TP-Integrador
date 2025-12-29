#  Trabajo Final Integrador — Backend eCommerce (Node + TypeScript) PostgreSQL mas adelante

## Guia de instalacion

### 1. Agregar un .env al mismo nivel que este readme (al nivel del .yml)

Se pasara las .env al mail

### 2. Agregar un .env.test dentro de la carpeta backend

Se pasara las .env.test al mail

### 4. Levantar los Contenedores con Docker

Entrar en la carpeta con el .yml:
```bash
cd '.\TP Integrador\'
```
Primero, construir y levantar los contenedores:

```bash
docker-compose build
docker-compose up -d
```

Agregamos las dependencias en el backend:
vamos al backend con cd  y luego:
```bash
npm install
```

para ver si el backend funciona correctamente hacemos un log:
```bash
docker-compose logs backend
```

### 5. Preparar las bases de datos
Luego, ingresar al contenedor del backend para ejecutar las migraciones y los seeders:

```bash
docker-compose exec backend sh

# TODO: revisar si no se desincroniza la base de datos al hacer una orden (hacer un nuevo usuario, agregar items al carrito y hacer una orden con checkout)
# Dentro del contenedor:
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
exit
```

### 6. Revisar contenido de la base de datos
Si uno quiere ingresar para ver las tablas de la base de datos:
```bash
# para el de TP integrador

docker exec -it suplementos_db psql -U postgres -d ecommerce_suplementos


# Dentro de la bd:
#mostrar tablas
\dt  

#para ver contenido
select * from "nombre de la tabla"; 

#para salir
\q 
```

### Guia de Instalación Local: (Esto creo que no entraria mas)

1) Clonar repositorio
```bash
git clone < URL del repo >
```
Dentro de la carpeta del repo de backend

2) Crear archivo de variables de entorno .env con lo enviado al mail

3) Instalar dependencias
```bash
npm install
```

4) Compilar TypeScript
```bash
npm run build
```
5) Correr la app con el dist compilado
```bash
npm run start
```

Opcional - Ejecutar tests (en otra terminal)
```bash
npm run test
```

---

### Comandos
### test individuales ejemplo:
```
npx jest tests/unit/order.service.test.ts
```

### test integracion ejemplo:
```
npx jest tests/integration/product.integration.test.ts
```

### Para utilizar el deploy en render usar la direccion: (REHACER)
```
https://backend-suplementos.onrender.com/api/
```
Por ejemplo en postman:
```
GET https://backend-suplementos.onrender.com/api/products
```

### Coleccion en postman publicada: (REHACER)
```
https://documenter.getpostman.com/view/48339002/2sB3dJxrxx
```

## 📘 Entidades y Relaciones

### 🔹 **User**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `user_id` | number (PK) | Identificador único del usuario |
| `name` | string | Nombre completo |
| `email` | string | Correo electrónico |
| `password` | string | Contraseña hasheada |
| `address` | string | Dirección del usuario |
| `role` | enum("ADMIN", "USER") | Rol del usuario |

**Relaciones:**
- Tiene muchos `Order` (1:N)
- Tiene una `Cart` (1:1)
- Puede hacer muchas `Review` (1:N)

---

### 🔹 **Order**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `order_id` | number (PK) | Identificador único del pedido |
| `user_id` | User (FK) | Usuario que realizó la orden |
| `status` | enum("pending", "paid", "cancel") | Estado de la orden |
| `total` | number | Total de la orden |
| `order_date` | date | Fecha de creación |

**Relaciones:**
- Pertenece a un `User` (N:1)
- Tiene muchos `Order_Detail` (1:N)

---

### 🔹 **Order_Detail**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `id_detail` | number (PK) | Identificador del detalle |
| `id_order` | Order (FK) | Orden a la que pertenece |
| `id_product` | Product (FK) | Producto incluido |
| `quantity` | number | Cantidad |
| `unit_price` | number | Precio unitario |
| `subtotal` | number | Calculado: `unit_price * quantity` |

**Relaciones:**
- Pertenece a una `Order` (N:1)
- Contiene un `Product` (N:1)

---

### 🔹 **Product**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `product_id` | number (PK) | Identificador único del producto |
| `name` | string | Nombre del producto |
| `price` | number | Precio |
| `image` | string | Imagen del producto |
| `category` | Category (FK) | Categoría asociada |
| `stock` | number | Stock disponible |
| `rating` | number | Promedio de calificación (sincronizado automáticamente) |
| `brand` | string | Marca del producto |
| `description` | string | Descripción detallada |

**Relaciones:**
- Pertenece a una `Category` (N:1)
- Está en muchos `Order_Detail` (N:M)
- Está en muchos `Item_Cart` (N:M)
- Tiene muchas `Review` (1:N)

---

### 🔹 **Category**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `category_id` | number (PK) | Identificador de la categoría |
| `name` | string | Nombre |
| `description` | string | Descripción |

**Relaciones:**
- Tiene muchos `Product` (1:N)

---

### 🔹 **Cart**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `cart_id` | number (PK) | Identificador del carrito |
| `user_id` | User (FK) | Usuario dueño del carrito |

**Relaciones:**
- Pertenece a un `User` (1:1)
- Tiene muchos `Item_Cart` (1:N)

---

### 🔹 **Item_Cart**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `item_id` | number (PK) | Identificador del ítem |
| `cart_id` | Cart (FK) | Carrito al que pertenece |
| `product_id` | Product (FK) | Producto agregado |
| `quantity` | number | Cantidad seleccionada |

**Relaciones:**
- Pertenece a un `Cart` (N:1)
- Contiene un `Product` (N:1)

---

### 🔹 **Review**
| Campo | Tipo | Descripción |
|-------|------|--------------|
| `review_id` | number (PK) | Identificador de la reseña |
| `user_id` | User (FK) | Usuario que opinó |
| `product_id` | Product (FK) | Producto reseñado |
| `qualification` | number (1–5) | Calificación |
| `comment` | string | Comentario del usuario |
| `date` | date | Fecha de la reseña |

**Relaciones:**
- Pertenece a un `User` (N:1)
- Pertenece a un `Product` (N:1)

---

## 🧩 UML
![Diagrama UML](./images/UML-TP-Integrador.jpg)


---

## Dependencias

## 📦 Dependencias del Backend

- **axios**: Cliente HTTP para realizar peticiones a servicios externos.  
- **bcrypt**: Encripta contraseñas de forma segura para el registro y login.  
- **cors**: Permite que el frontend se comunique con el backend desde otro dominio (Cross-Origin Resource Sharing).  
- **jsonwebtoken**: Implementa autenticación mediante tokens JWT.   
- **zod**: Valida datos de entrada mediante esquemas tipados. 

## 🛠️ Dependencias de Desarrollo

- **husky**: Ejecuta hooks de Git como pre-commit y pre-push para asegurar calidad.  
- **eslint**: Linter que detecta errores y aplica buenas prácticas en el código.  
- **prettier**: Formateador automático que mantiene un estilo de código consistente.  
- **typescript**: Lenguaje de tipado estático que mejora la robustez del backend.  
- **jest**: Framework para realizar pruebas unitarias y de integración.

---

### Consideraciones finales o limitaciones (REHACER ahora tenemos la BD en local)

El backend y el frontend son prototipos, cada uno con su mock

---
## 📁 Estructura del Proyecto (REHACER)
```

TrabajoFinalIntegrador/
├── coverage/                          # Reportes de cobertura de tests
├── dist/                              # Archivos compilados de TypeScript
├── images/                            # Imágenes utilizadas (productos, etc.)
├── node_modules/

├── src/
│
│   ├── app.ts                         # Configuración principal de Express
│   ├── index.ts                       # Punto de entrada del servidor
│
│   ├── controllers/                   # Controladores (MVC)
│   │   ├── user.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── category.controller.ts
│   │   ├── review.controller.ts
│   │   ├── itemCart.controller.ts
│   │   └── orderDetail.controller.ts
│
│   ├── middlewares/                  # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│
│   ├── models/                        # Modelos de datos y conexión
│   │
│   │   ├── implementations/
│   │   │   ├── mock/                  # Implementación Mock (fase inicial)
│   │   │   │   ├── mockUser.ts
│   │   │   │   ├── mockProduct.ts
│   │   │   │   ├── mockOrder.ts
│   │   │   │   ├── mockOrderDetail.ts
│   │   │   │   ├── mockCart.ts
│   │   │   │   ├── mockItemCart.ts
│   │   │   │   ├── mockCategory.ts
│   │   │   │   └── mockReview.ts
│   │   │   └── postgres/              # Implementación futura con ORM
│   │   │       ├── user.model.ts
│   │   │       ├── product.model.ts
│   │   │       ├── order.model.ts
│   │   │       ├── orderDetail.model.ts
│   │   │       ├── cart.model.ts
│   │   │       ├── itemCart.model.ts
│   │   │       ├── category.model.ts
│   │   │       └── review.model.ts
│
│   │   ├── interface/                 # Interfaces TypeScript de entidades
│   │   │   ├── user.ts
│   │   │   ├── product.ts
│   │   │   ├── order.ts
│   │   │   ├── orderDetail.ts
│   │   │   ├── cart.ts
│   │   │   ├── itemCart.ts
│   │   │   ├── category.ts
│   │   │   └── review.ts
│
│   │   ├── crud/                      # Interfaces CRUD de cada entidad
│   │   │   ├── userCrud.interface.ts
│   │   │   ├── productCrud.interface.ts
│   │   │   ├── orderCrud.interface.ts
│   │   │   ├── orderDetailCrud.interface.ts
│   │   │   ├── cartCrud.interface.ts
│   │   │   ├── itemCartCrud.interface.ts
│   │   │   ├── categoryCrud.interface.ts
│   │   │   └── reviewCrud.interface.ts
│ 
│   ├── repositories/                      # Opcional: separar lógica acceso a BD
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   ├── order.repository.ts
│   │   ├── orderDetail.repository.ts
│		├── cart.repository.ts
│		├── itemCart.repository.ts
│		├── category.repository.ts
│		└── review.repository.ts
│
│   ├── routes/                        # Rutas de la API
│   │   ├── user.routes.ts
│   │   ├── product.routes.ts
│   │   ├── order.routes.ts
│   │   ├── orderDetail.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── itemCart.routes.ts
│   │   ├── category.routes.ts
│   │   └── review.routes.ts
│
│   ├── schemas/                       # Validaciones (Zod o Joi)
│   │   ├── user.schema.ts
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   ├── orderDetail.schema.ts
│   │   ├── cart.schema.ts
│   │   ├── itemCart.schema.ts
│   │   ├── category.schema.ts
│   │   └── review.schema.ts
│
│   ├── services/                      # Lógica de negocio (services)
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── orderDetail.service.ts
│   │   ├── cart.service.ts
│   │   ├── itemCart.service.ts
│   │   ├── category.service.ts
│   │   └── review.service.ts
│
│   ├── tests/                         # Testing
│   │   ├── unit/
│   │   │   ├── user.service.test.ts
│   │   │   ├── product.service.test.ts
│   │   │   ├── order.service.test.ts
│   │   │   ├── orderDetail.service.test.ts
│   │   │   ├── cart.service.test.ts
│   │   │   ├── itemCart.service.test.ts
│   │   │   ├── category.service.test.ts
│   │   │   └── review.service.test.ts
│   │   └── integration/
│   │       ├── user.integration.test.ts
│   │       ├── product.integration.test.ts
│   │       ├── order.integration.test.ts
│   │       ├── orderDetail.integration.test.ts
│   │       ├── cart.integration.test.ts
│   │       ├── itemCart.integration.test.ts
│   │       ├── category.integration.test.ts
│   │       └── review.integration.test.ts
│
│   ├── utils/                         # Utilidades generales
│   │   ├── jwt.ts
│   │   ├── hashPassword.ts
│   │   ├── price.calculator.ts
│   │   ├── rating.calculator.ts
│   │   └── idGenerator.ts
│
│   ├── config/                        # Configuración centralizada (opcional)
│   │   ├── db.config.ts
│   │   ├── jwt.config.ts
│   │   └── index.ts
│
│   └── dtos/                          # (opcional) DTOs para inputs/outputs
│       ├── user.dto.ts
│       ├── product.dto.ts
│       └── ...
│
├── .env                               # Variables de entorno
├── .gitignore
├── jest.config.js                     # Configuración de Jest
├── package.json
├── package-lock.json
├── readme.md
├── tsconfig.json                      # Configuración de TypeScript
├──eslint.config					   # Configuración de Eslint
├──.prettierrc						   # Configuración de prettier

```