# TP #1 — Sala de Juegos — 2026

**UTN Avellaneda — Tecnicatura Universitaria en Programación**  
**Asignatura:** Programación IV  
**Docente:** Lic. Ricardo Gastón Plazas  

---

## 👤 Datos del Alumno
*   **Nombre y Apellido:** Joaquín Agüero
*   **Rol:** Integrante Único (Desarrollador Fullstack)
*   **Repositorio:** [https://github.com/ajoaco18](https://github.com/ajoaco18/TP-1-Sala-de-Juegos-2026)
*   **Deploy Activo (Vercel):** https://tp-1-sala-de-juegos-2026.vercel.app/

---

## 📅 Cronograma Oficial y Estado de Entregas

| Sprint | Fecha de Rendición | Contenido Evaluado | Rama (Branch) | Estado |
| :---: | :---: | :--- | :---: | :---: |
| **Sprint #1** | Mar 19/05/2026 | Estructura Base + API GitHub | `rama-sprint-1` | ✅ Realizado |
| **Sprint #2** | Mié 20/05/2026 | Auth + Guards + Home Condicional | `rama-sprint-2` | 🔲 Pendiente |
| **Sprint #3** | Mar 26/05/2026 | Ahorcado + Mayor/Menor + Chat Realtime | `rama-sprint-3` | 🔲 Pendiente |
| **Sprint #4** | Mar 26/05/2026 | Preguntados + Juego Propio + Tablas | `rama-sprint-4` | 🔲 Pendiente |
| **Sprint #5** | Mar 02/06/2026 | Recuperatorio (Encuesta + Admin) | `rama-sprint-5` | 🔲 Pendiente |

---

## 🔀 Distribución de Tareas y Funcionalidades por Sprint

### 📦 Sprint #1 — Infraestructura y Base (`rama-sprint-1` → PR)
| # | Funcionalidad | Descripción | Estado |
| :---: | :--- | :--- | :---: |
| 1.1 | **Deploy Inicial** | Configuración de hosting en Vercel activo y funcional. | ✅ Realizado |
| 1.2 | **Navegación Base** | Ruteo sin límites entre Login, Registro, Home y Quién Soy. | ✅ Realizado |
| 1.3 | **Componente Quién Soy** | Datos dinámicos desde la API de GitHub + Explicación del Juego Propio. | ✅ Realizado |
| 1.4 | **Favicon** | Identificador gráfico personalizado de la aplicación. | ✅ Realizado |

### 🔐 Sprint #2 — Autenticación y Control (`rama-sprint-2` → PR)
| # | Funcionalidad | Descripción | Estado |
| :---: | :--- | :--- | :---: |
| 2.1 | **Auth System** | Login y Registro con Email/Contraseña usando Firebase/Supabase (Contraseña no se guarda). | 🔲 Pendiente |
| 2.2 | **Home Condicional** | Muestra botones de Auth si está deslogueo, o Nombre + Logout si está logueado. | 🔲 Pendiente |
| 2.3 | **Acceso Rápido** | 3 botones de login veloz con usuarios de prueba pre-registrados. | 🔲 Pendiente |
| 2.4 | **Guards de Ruta** | Protección estricta de rutas privadas post-login. | 🔲 Pendiente |

### 🎮 Sprint #3 — Juegos I y Comunicación (`rama-sprint-3` → PR)
| # | Funcionalidad | Descripción | Estado |
| :---: | :--- | :--- | :---: |
| 3.1 | **Juego: Ahorcado** | Entrada de datos exclusiva por botones en pantalla. Guarda estadísticas en DB. | 🔲 Pendiente |
| 3.2 | **Juego: Mayor/Menor** | Lógica basada en baraja española. Almacena cartas acertadas en DB. | 🔲 Pendiente |
| 3.3 | **Chat Global Realtime** | Mensajes en tiempo real (Supabase). Muestra user, contenido, hora y destaca el propio. | 🔲 Pendiente |

### 📊 Sprint #4 — Juegos II y Rankings (`rama-sprint-4` → PR)
| # | Funcionalidad | Descripción | Estado |
| :---: | :--- | :--- | :---: |
| 4.1 | **Juego: Preguntados** | Consumo de API externa de preguntas/respuestas con opciones en botones. Guarda en DB. | 🔲 Pendiente |
| 4.2 | **Juego Propio** | Desarrollo de mecánica original (Mecánica descrita en "Quién Soy"). Guarda puntaje en DB. | 🔲 Pendiente |
| 4.3 | **Listado Resultados** | 4 tablas de posiciones independientes ordenadas de mejor a peor desempeño. | 🔲 Pendiente |

### 🛠️ Sprint #5 — Recuperatorio Opcional/Obligatorio (`rama-sprint-5` → PR)
| # | Funcionalidad | Descripción | Estado |
| :---: | :--- | :--- | :---: |
| 5.1 | **Encuestas** | Formulario con validaciones completas para los usuarios. | 🔲 Pendiente |
| 5.2 | **Panel Admin** | Vista protegida por Guards solo para administradores para ver resultados de encuestas. | 🔲 Pendiente |
| 5.3 | **Animaciones** | Incorporación de animaciones de transición entre pantallas (CSS/TypeScript). | 🔲 Pendiente |

---

## 🛠️ Tecnologías Utilizadas
*   **Frontend:** Angular & TypeScript
*   **Estilos:** Bootstrap / PrimeNG (Asegurando diseño uniforme)
*   **Backend / BaaS:** Firebase o Supabase (Auth, Realtime Database)
*   **Versionado:** Git con estrategia de ramas obligatorias por Sprint y Pull Requests independientes.

---

## ⚠️ Reglas Críticas de Desarrollo (Pautas de Cátedra)
> *   **PROHIBIDO ADELANTAR:** No se evalúa código de sprints superiores en fechas previas (causa desaprobación).
> *   **ALERTAS PROHIBIDAS:** Queda penalizado el uso de `alert()`. Se implementan Modales o Toasts para la UI/UX.
> *   **PERSISTENCIA:** Todos los juegos deben registrar obligatoriamente los resultados en la Base de Datos.
> *   **PULL REQUESTS:** Cada entrega debe contar con su correspondiente PR hacia `main` con un título descriptivo claro.
