---
author: Eduardo Ferro
url: https://www.eferro.net/2026/01/fast-feedback-fast-features-my-ai.html?m=1
title: "Fast Feedback, Fast Features: My AI Development Experiment"
titulo: "Retroalimentación Rápida, Funciones Rápidas: Mi Experimento de Desarrollo con IA"
resumen: 

El artículo **"My AI Development Experiment"** de Eduardo Ferro describe un experimento cuantitativo realizado durante 11 semanas, en las que el autor rastreó 424 *commits* asistidos por IA (usando herramientas como Cursor y Claude Code) para analizar cómo esta tecnología impacta no solo en la velocidad, sino en la **calidad y sostenibilidad** del desarrollo de software.

Aquí están los puntos clave del análisis:

### 1. El Ratio de Sostenibilidad (0.23:1)
El hallazgo más importante es que la IA no se utilizó principalmente para escribir nuevas funcionalidades más rápido, sino para construir una base técnica robusta.
*   Por cada hora dedicada a **funcionalidad** (22.7%), se dedicaron más de cuatro a la **sostenibilidad** (98.3%, dado que las categorías se solapan).
*   El desglose de la sostenibilidad incluye: **Tests (30.7%)**, Documentación (19.0%), Limpieza (13.8%) e Infraestructura (12.0%).

### 2. Cambio en la Viabilidad Económica
Ferro argumenta que las "buenas prácticas" (como una cobertura de tests exhaustiva o documentación actualizada) a menudo se sacrifican no por falta de conocimiento, sino por falta de tiempo y costes.
*   **Antes de la IA:** Construir infraestructura de feedback rápido era costoso para equipos pequeños o desarrolladores a tiempo parcial.
*   **Con la IA:** La barrera de entrada cae drásticamente. El mantenimiento de la calidad se vuelve económicamente viable, eliminando la excusa de "no hay tiempo". La IA permite a un solo desarrollador mantener estándares de ingeniería que antes requerían un equipo más grande.

### 3. "Velocidad Negativa" y el Costo Basal
Un concepto central del artículo es la **eliminación de código** como una característica positiva.
*   **El Dato:** El 40.9% de las líneas cambiadas fueron eliminaciones. Por cada 3 líneas escritas, se borraron 2.
*   **Costo Basal:** Ferro introduce la idea de que todo código tiene un costo de mantenimiento intrínseco. La mejor forma de reducir este costo es tener menos código (y menos funcionalidades que no aportan valor).
*   **Desapego Radical:** La IA facilita borrar código antiguo o funcionalidades muertas porque permite trazar dependencias y actualizar tests en minutos, algo que manualmente era arriesgado y tedioso. Esto permite reducir la "superficie de errores" del sistema.

### 4. Velocidad vs. Rapidez
El autor concluye diferenciando entre **rapidez** (moverse rápido) y **velocidad** (moverse rápido en la dirección correcta).
*   La verdadera velocidad proviene de los **ciclos de retroalimentación rápidos** (fast feedback loops) habilitados por los tests y la infraestructura, no de teclear código rápido.
*   **La IA es un amplificador:** Si optimizas para "features", la IA te permitirá generar deuda técnica más rápido. Si optimizas para sostenibilidad, te permitirá construir sistemas robustos más rápido.

En resumen, el experimento demuestra que la IA permite invertir la ecuación tradicional de desarrollo: en lugar de sacrificar calidad por velocidad, se puede utilizar la asistencia de la IA para mantener un alto estándar de ingeniería (tests, docs, refactoring) que a su vez habilita una velocidad sostenible a largo plazo.

---

author: Sigma's Blog
url: https://blog.sigma-star.io/2024/01/people-dont-understand-oop/
title: "People Don't Understand Object-Oriented Programming"
titulo: "La mayoría de la gente no entiende la Programación Orientada a Objetos"
date: 2024-01-15
resumen:

El blog de Sigma argumenta que la mayoría de los desarrolladores tiene una comprensión superficial o errónea de la Programación Orientada a Objetos (OOP), centrada en características sintácticas como clases y herencia, en lugar de los principios fundamentales de diseño definidos por su creador, Alan Kay.

Aquí resumo los puntos clave sobre este error de concepción:

### 1. La Definición Real vs. La Popular
Sigma señala que para Alan Kay, la OOP no se trata de "perros y coches", sino de tres pilares técnicos:
*   Paso de mensajes (Messaging).
*   Retención local, protección y ocultación del estado-proceso.
*   Enlace tardío extremo de todas las cosas (*extreme late-binding*).

El error común es definir los objetos simplemente como "colecciones de operaciones que comparten un estado" o entidades que combinan procedimientos y datos, perdiendo de vista la importancia del paso de mensajes y la opacidad del objeto.

### 2. El Mito de las Clases y la Herencia
El artículo explica que estos elementos no son estrictamente necesarios para la OOP, aunque son lo primero que se enseña:
*   **Clases:** No son obligatorias. Lenguajes como JavaScript (antes de ES6) o Lua utilizan **prototipos** para construir objetos, lo que reduce la complejidad y demuestra que la OOP puede existir sin clases.
*   **Herencia:** A menudo se abusa de ella para reutilizar código, lo cual se considera una mala práctica moderna (se prefiere la composición). Sigma argumenta que el verdadero valor de la herencia es el **subtipado** (polimorfismo), que permite intercambiar implementaciones (como cambiar un `ArrayList` por un `LinkedList`) sin afectar al resto del sistema, siempre que se respete el Principio de Sustitución de Liskov.

### 3. El Error de los Getters y Setters (Encapsulación)
Uno de los puntos más críticos de Sigma es la malinterpretación de la **encapsulación**.
*   **El Error:** Muchos programadores siguen el dogma de "no usar propiedades públicas" y las reemplazan automáticamente con getters y setters para cada variable. Sigma califica esto como "completamente incorrecto".
*   **La Realidad:** Los getters y setters exponen el estado interno tanto como las propiedades públicas, creando un alto **acoplamiento** entre objetos. Si un objeto solo tiene datos y getters/setters, es esencialmente un registro ("record"), no un objeto real con comportamiento. La verdadera encapsulación implica restringir el acceso al estado para permitir cambios internos sin romper módulos externos.

### 4. Complejidad innecesaria
Finalmente, Sigma critica que la visión distorsionada de la OOP lleva a una complejidad excesiva ("Abstract Nonsense"), donde se crean abstracciones genéricas para eventualidades futuras que nunca ocurren. También señala el abuso de patrones de diseño mal entendidos, como el patrón *Factory* o *Singleton* (que a menudo es solo una variable global glorificada), que resultan en arquitecturas "enterprise" que en realidad no son orientadas a objetos, sino procedimientos disfrazados de clases.

---