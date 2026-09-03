# Magnus MT – Enterprise Operations & Process Canvas Platform (Work in Progress) 

> Plataforma SaaS e IoT enfocada en la digitalización de flujos operacionales, trazabilidad de procesos e integración de datos industriales en tiempo real.

🌐 **Sitio Oficial / Plataforma en Vivo:** [https://magnusmt.com](https://magnusmt.com/)

---

## 📌 Sobre el Proyecto

**Magnus MT** es una solución tecnológica integral diseñada para optimizar procesos industriales y operacionales mediante metodologías Lean y la recolección automática de datos. Combina una aplicación web interactiva para el mapeo de lienzos de proceso (*canvases*) con módulos de hardware/telemetría IoT para la captura de métricas operacionales directamente desde la planta de trabajo.

| Vista de cliente | Vista de administrador |
| :---: | :---: |
|  <img width="1387" height="827" alt="Magnus_1" src="https://github.com/user-attachments/assets/bd3738b1-949c-4bf9-8b69-d6c71881b6b6" width="400"/> | <img width="1387" height="827" alt="Magnus_2" src="https://github.com/user-attachments/assets/587cd65d-16c4-4e13-bd35-b2e1e5e1a2da" width="400"/>
---

## 🏗️ Arquitectura del Sistema & Tech Stack

### 💻 Web Platform & SaaS Backend
* **Frontend:** React.js, Next.js, JavaScript (ES6+) / TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js (Arquitectura RESTful API & WebSockets / MQTT)
* **Bases de Datos:** MongoDB / PostgreSQL (Manejando persistencia de datos, usuarios y métricas de procesos)
* **Despliegue & Dominio:** Dominio personalizado e infraestructura en producción (`magnusmt.com`)

### 🛰️ Hardware & IoT Layer (MMT Core v1)
* **Microcontrolador:** ESP32 (Firmware en C/C++ / ESP-IDF)
* **Protocolos de Comunicación:** MQTT / HTTP REST APIs para envío de telemetría en tiempo real
* **Electrónica:** Diseño de circuitos para adquisición de señales y aislamiento lógico

---

