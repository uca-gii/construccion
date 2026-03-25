---
marp: true
author:
- Juan Manuel Dodero
date: Enero 2026
subject: Implementación e Implantación de Sistemas Software, curso 2025/26
title: Construcción de Software con IA
description: Consecuencias de las herramientas de IA en la construcción de software
math: mathjax
---


<!-- size: 16:9 -->
<!-- theme: default -->

<!-- paginate: false -->

<style>
h1 {
  text-align: center;
}
h2 {
  color: darkblue;
  text-align: center;
}
h3 {
  color: #444;
}
emph {
  color: #E87B00;
}
.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>

# CONSTRUCCIÓN DE SOFTWARE CON IA

## El impacto de las herramientas de IA en la construcción de software

<!-- 
Vamos a hablar de cómo  las herramientas de IA (Copilot, Claude, Cursor, etc.) están cambiando la forma en que construimos  software. No es solo "escribir código más rápido", sino algo mucho más profundo y transformador.
-->

---

<!-- paginate: true -->

## Experimento de desarrollo con IA

<!-- 
Experimento de Eduardo Ferro. Se puso a programar con IA durante 11 semanas y midió TODO: cada commit, cada línea, cada cambio. No son proyectos de juguete, sino sistemas  reales de producción que usa la gente. Fíjate en el dato: el doble de  su velocidad normal de comits. Y lo mejor: eliminó el 40.9% del código que tocó. ¡Menos es más!
-->

<div class="cols">
<div>

### Contexto

- Experimento de Eduardo Ferro
- 424 commits en 11 semanas
- 6 repositorios de producción
- 100% del código con asistencia IA
- Sistemas reales en uso

</div>
<div>

### Métricas

- 9,6 commits/día (x2 velocidad normal)
- 135.485 líneas cambiadas
- 40,9% de código eliminado
- Ratio Funcionalidad:Sostenibilidad = **0.23:1**

</div>
</div>

---

## Cambio de paradigma

<!-- 
Aquí está el cambio mental clave. Antes pensábamos: "más código = más funcionalidades = más valor". Pero lo que realmente da valor es poder iterar rápido con confianza,
y para eso necesitas un código sostenible, con buenos tests, bien documentado.
La IA no inventó esto, pero sí hizo que fuera económicamente viable. Antes
era un lujo, ahora es accesible.
-->

### Antes

- Más código → Más _features_ → Más valor (?)

### Ahora: Velocidad = Sostenibilidad

- Mejor código → Feedback → Iteraciones rápidas → Más valor

<emph>La IA no cambió lo que es importante, sino lo que es económicamente viable.</emph>

---

## La Métrica Sorprendente

<!-- 
Esta es LA slide que te vuela la cabeza. Mira los números: por cada commit, solo un 22.7% es 
funcionalidad nueva (lo que el usuario ve), pero hay un 98.3% de "sostenibilidad". ¿Cómo suma más 
de 100%? Porque cuando haces un commit, normalmente incluyes varias cosas a la vez: código + tests + 
docs. Lo alucinante es ver dónde va el esfuerzo: 30.7% en tests (¡casi un tercio!), 19% en 
documentación... Esto no es perder el tiempo, es invertir en poder ir rápido SIEMPRE, no solo hoy.
-->

### Distribución del esfuerzo (por commit)

- **22.7%** Funcionalidad (features nuevas)
- **98.3%** Sostenibilidad (suma >100% porque no son excluyentes)

#### Desglose de Sostenibilidad:

- **30.7%** Tests
- **19.0%** Documentación  
- **13.8%** Cleanup (código muerto, simplificación)
- **12.0%** Infraestructura (CI/CD, tooling)
- **11.5%** Refactoring
- **8.1%** Configuración
- **3.2%** Seguridad

---

## ¿Overhead o Inversión?

<!-- 
Aquí respondemos la duda del millón: ¿no estamos perdiendo el tiempo con tanto test y documentación?
La respuesta rotunda es NO. Ese 98.3% no es sobrecarga (overhead), es el MOTOR que te permite ir 
rápido. Piénsalo: si tienes buenos tests, puedes cambiar código sin miedo a romper cosas. Si tienes 
buena documentación, no dependes de que Pepito (que se fue hace 3 meses) te explique cómo funciona 
aquello. Es como invertir en un buen coche vs ir en bici: al principio parece más caro, pero luego 
vas mucho más rápido y lejos.
-->

### La pregunta clave

> ¿Estamos perdiendo tiempo en tests/docs/refactoring o estamos invirtiendo en velocidad sostenible?

### La respuesta del experimento

**El 98.3% de sostenibilidad no es overhead. Es el motor que permite velocidad real.**

- Fast feedback loops = iteración confiante
- Tests comprensivos = cambios sin miedo
- Documentación = menos silos de conocimiento
- Refactoring continuo = menos deuda técnica

---

## Lo Que Cambió con IA

<!-- 
Esta es la comparativa del antes y después. Antes, todos teníamos las mismas excusas: "no hay tiempo 
para tests", "la documentación la haré después" (spoiler: nunca la hacíamos), "el refactoring es muy 
arriesgado sin tests" (pero no había tiempo para tests, ¿recuerdas?). Era un círculo vicioso. La IA 
rompió ese círculo eliminando las barreras económicas y de tiempo. Pero OJO: la disciplina sigue 
siendo tuya. La IA no te OBLIGA a escribir tests, solo hace que sea viable. Tú decides si los escribes 
o no. Ya no puedes echarle la culpa a "no hay tiempo".
-->

<div class="cols">
<div>

### ❌ Antes de IA

- Tests: "no hay tiempo"
- Documentación: "lo haré después"
- Refactoring: "demasiado arriesgado"
- Eliminar features: "muy costoso"
- Barreras: económicas y de tiempo

</div>
<div>

### ✅ Con IA

- Tests: viable económicamente
- Documentación: generación asistida
- Refactoring: feedback inmediato
- Eliminar features: trazabilidad rápida
- Barreras: eliminadas en gran medida

</div>
</div>

**La disciplina sigue siendo responsabilidad nuestra. IA solo eliminó las excusas.**

---

## Velocidad Negativa: Código que Desaparece

<!-- 
Prepárate porque esto es contraintuitivo: ¡eliminó más de 55 mil líneas de código! No porque el 
proyecto muriera, sino porque MEJORÓ. Por cada 3 líneas que escribió, eliminó 2. Hay incluso un repo 
que es más pequeño ahora que al principio. ¿Cómo es posible? Porque cada línea de código tiene un 
"coste basal": hay que entenderla, mantenerla, testearla, documentarla. El mejor código es el que NO 
existe. Antes, eliminar código era carísimo (¿romperá algo? ¿quién lo usa?). Con IA, puedes rastrear 
dependencias en minutos, tienes tests que te dicen si rompiste algo... eliminar código pasó de 
imposible a rutinario. Mind = blown 🤯
-->

### El Mejor Código es el que No Existe

**55,407 líneas eliminadas** de 135,485 totales = **40.9% deletion ratio**

- Por cada 3 líneas escritas, 2 eliminadas
- Repositorio `chatcommands`: **crecimiento neto negativo** (-1,809 líneas)
- No es estancamiento, es madurez

### Concepto: Basal Cost of Software

Cada línea de código tiene un coste de mantenimiento:
- Debe ser entendida, probada, depurada, actualizada
- Mejor forma de reducir coste: **tener menos código**

---

## ¿Por Qué Ahora Podemos Eliminar Código?

<!-- 
Esta slide explica el "cómo" de la anterior. Antes, añadir una feature era rápido (2 días), pero 
eliminarla sin romper nada era una pesadilla de 2 semanas o más. Resultado: las features eran 
INMORTALES. Una vez añadidas, ahí se quedaban para siempre, aunque nadie las usara. Con IA, rastrear 
dependencias lleva minutos (antes eran horas con grep y rezar), los tests te dicen al instante si 
rompiste algo, y puedes actualizar docs y configs en el mismo commit. Eliminar código pasó de ser un 
problema a ser una feature. "Negative Velocity" (hacer el código más pequeño) es ahora algo bueno y 
medible.
-->

### Antes: Features Inmortales

```
Añadir feature: 2 días
Eliminar feature sin romper nada: 2 semanas (?)
→ Las features nunca se eliminaban
```

### Con IA: Deletion Viable

- Trazar dependencias: minutos en vez de horas
- Tests comprensivos: detectan roturas inmediatamente
- Actualización de docs: simultánea con código
- Commit completo: código + tests + docs + config

**Resultado: Negative Velocity es una feature, no un problema**

---

## Software como Pasivo, No como Activo

<!-- 
Este es un cambio filosófico importante. Normalmente pensamos en el software como un "activo" de la 
empresa: cuanto más código tenemos, más valor hemos creado. Pero en realidad es al revés: el software 
es un PASIVO. Cada línea es una deuda que tienes que mantener. Más código = más bugs potenciales, más 
tiempo de compilación, más complejidad mental, más coste. El objetivo no es maximizar el código, sino 
minimizarlo. Escribir solo lo necesario para resolver el problema, nada más. La IA hace que esta 
filosofía minimalista sea viable en la práctica, porque reduce la fricción de eliminar código. Es el 
"Radical Detachment": desapego radical del código que escribimos.
-->

### Radical Detachment

> El software es un **pasivo que minimizar**, no un activo que maximizar.

### Implicaciones

- Más código = más superficie para bugs
- Más código = más tiempo de compilación
- Más código = modelo mental más complejo
- Más código = mayor coste basal

**La IA reduce la fricción para eliminar código, haciendo viable el minimalismo.**

---

## Diferentes Proyectos, Diferentes Ratios

<!-- 
Importante: NO hay un ratio mágico que sirva para todo. Mira la tabla: cada proyecto tiene un ratio 
diferente de Funcionalidad:Sostenibilidad, y eso está bien. Un proyecto greenfield nuevo (inventory) 
tiene más funcionalidad (0.42:1), porque estás construyendo cosas. Un sistema maduro (plt-mon) tiene 
menos funcionalidad nueva pero más énfasis en confiabilidad (0.25:1). Un proyecto en mantenimiento 
(chatcommands) tiene muy poca funcionalidad nueva (0.15:1) y mucho cleanup. El mensaje: adapta el 
ratio al contexto. No copies números a ciegas, entiende qué necesita TU proyecto en SU momento.
-->

| Proyecto | Ratio Func:Sust | Contexto |
|----------|-----------------|----------|
| **inventory** | 0.42:1 | Greenfield, desarrollo activo |
| **plt-mon** | 0.25:1 | Sistema maduro, énfasis en confiabilidad |
| **ctool-cli** | 0.16:1 | CLI, robustez y tests |
| **chatcommands** | 0.15:1 | Mantenimiento, código negativo |
| **ctool** | 0.09:1 | Infraestructura y cleanup |
| **cagent** | 0.13:1 | Proyecto nuevo, calidad desde día 1 |

**No hay un ratio único correcto. Depende del contexto del proyecto.**

---

## Conexión con DevOps y CI/CD

<!-- 
Ahora conectamos todo esto con el temario de la asignatura. ¿Recuerdas DevOps, CI/CD, feedback loops?
Pues este experimento valida todos esos principios. Los "fast feedback loops" (tests automáticos que 
te dicen al instante si rompiste algo) son la base de DevOps. Y la IA hace que todo sea más accesible:
generar pipelines de CI/CD, crear scripts de Terraform o Docker, escribir tests de integración... 
cosas que antes solo hacían equipos grandes con mucho tiempo, ahora las puede hacer un manager en sus 
ratos libres. La IA democratiza las buenas prácticas de DevOps.
-->

### Fast Feedback Loops

El experimento valida principios DevOps:

- **Integración continua**: tests automáticos en cada commit
- **Deployment continuo**: infraestructura como código
- **Monitorización**: sistemas de producción reales
- **Cultura de calidad**: sostenibilidad como prioridad

### La IA Acelera DevOps

- Generación de pipelines CI/CD
- Scripts de infraestructura (Terraform, Docker)
- Tests de integración comprensivos
- Documentación de operaciones

---

## Conexión con Prácticas de Implementación

<!-- 
Y también conecta con las prácticas de implementación del temario. Refactoring: antes era arriesgado,
ahora con tests automáticos puedes hacer pequeñas transformaciones frecuentes sin miedo. Ortogonalidad
y delegación: hacer un diseño limpio con inyección de dependencias es más barato ahora, así que no 
tienes excusa para no hacerlo. Programación defensiva: los tests comprensivos son como contratos que 
se validan solos, el manejo de errores robusto es más fácil de implementar y documentar... Todo lo 
que te hemos enseñado en la asignatura sigue siendo válido, pero ahora es más accesible gracias a la IA.
-->

### Refactoring Continuo

La IA hace viable el refactoring disciplinado:
- Pequeñas transformaciones frecuentes
- Sin cambiar comportamiento externo
- Con red de seguridad (tests)

### Ortogonalidad y Delegación

- Diseño más limpio por coste reducido
- Inyección de dependencias más sencilla
- Aspectos transversales mejor implementados

### Programación Defensiva

- Tests comprensivos = contratos validados
- Manejo de errores robusto
- Documentación de casos extremos

---

## Speed vs Velocity

<!-- 
Esta distinción es SÚPER importante. Speed (velocidad) es qué tan rápido te mueves. Velocity (velocidad
efectiva) es speed en la dirección CORRECTA. Puedes ir a 200 km/h en dirección a un precipicio (mucho
speed, velocity negativa), o a 80 km/h hacia tu destino (menos speed, velocity positiva). En software:
10 features por semana sin tests es mucho speed, pero velocity hacia una reescritura completa en 6 
meses porque el código es inmantenible. 3 features por semana con tests es menos speed, pero velocity 
sostenible. La IA amplifica lo que TÚ optimices: si optimizas features sin calidad, te estrellará más 
rápido. Si optimizas calidad, irás más rápido de forma sostenible.
-->

### Speed (Velocidad)
```
Qué tan rápido te mueves
```

### Velocity (Velocidad efectiva)
```
Speed en la dirección correcta
```

### Comparación

- **10 features/semana, 0 tests** → Speed alto, Velocity hacia reescritura
- **3 features/semana, tests completos** → Speed moderado, Velocity sostenible

<emph>La IA amplifica lo que optimizas. Si optimizas features, acumularás deuda técnica más rápido.</emph>

---

## Lecciones Aprendidas

<!-- 
Las tres lecciones clave del experimento, resumidas:

1) El problema nunca fue que no supiéramos qué hacer. Los buenos ingenieros SIEMPRE supieron que tests 
y docs eran importantes. El problema era que no teníamos tiempo ni recursos. La IA eliminó esa barrera.

2) Pero OJO: la IA no te va a obligar a hacer lo correcto. El comportamiento por defecto sigue siendo 
"ship features rápido". TÚ tienes que tomar la decisión consciente de invertir en sostenibilidad. La 
disciplina es tuya.

3) Y lo mejor: todas esas prácticas que parecían de "elite" (TDD, mutation testing, docs actualizadas)
ahora son casi gratis. Están al alcance de equipos pequeños y estudiantes. No hay excusa para no hacerlas.
-->

### 1. La barrera no era el conocimiento

- Los buenos ingenieros siempre supieron que tests/docs eran importantes
- La barrera era **económica y de tiempo**
- IA eliminó esa barrera

### 2. La disciplina sigue siendo nuestra

- IA no te obliga a escribir tests
- El comportamiento por defecto sigue siendo "ship features"
- La elección entre features y sostenibilidad es tuya

### 3. Las buenas prácticas ahora son casi gratis

- TDD/BDD: más viable que nunca
- Mutation testing: factible para equipos pequeños
- Documentation as code: mantenible

---

## Lo Que NO Cambió

<!-- 
Momento de bajar a tierra y ser realistas. La IA NO es magia. No va a entender el dominio de tu 
aplicación por ti (si no sabes qué problema estás resolviendo, la IA tampoco). No va a diseñar tu 
arquitectura (eso sigue siendo tu trabajo). No va a decidir qué features construir (eso es producto).
No va a hacer que seas disciplinado (eso es carácter). Y definitivamente no va a convertir código 
basura en buen código. Lo que SÍ hace es amplificar: si tomas buenas decisiones, te ayuda a 
implementarlas más rápido. Si tomas malas decisiones, te ayuda a cagarla más rápido también. Es un 
amplificador, no un piloto automático.
-->

### IA no es magia

- ✗ No elimina la necesidad de comprender el dominio
- ✗ No reemplaza el diseño arquitectónico
- ✗ No toma decisiones de producto por ti
- ✗ No elimina la necesidad de disciplina
- ✗ No hace que el mal código sea bueno

### Lo que sí amplifica

- ✓ Tus decisiones (buenas o malas)
- ✓ Tu capacidad de implementar buenas prácticas
- ✓ Tu velocidad (en la dirección que elijas)
- ✓ Tu capacidad de mantener feedback loops

---

## Implicaciones para la Construcción de Software

<!-- 
Aquí empezamos a ver las implicaciones prácticas. Primero: hay que redefinir qué significa "ser 
productivo". No es escribir muchas líneas de código (de hecho, recuerda que eliminar líneas puede ser 
más productivo). Es poder iterar rápido CON CONFIANZA. Es mantener una velocidad sostenible en el 
tiempo. Es escribir código que dentro de 6 meses puedas cambiar sin llorar. Segundo: hay que invertir 
en "infraestructura de feedback": tests, CI/CD, docs, métricas... antes esto era solo para equipos 
grandes con presupuesto. Ahora con IA, un equipo pequeño (incluso un estudiante) puede permitírselo.
-->

### 1. Redefinir "Productividad"

No es cuántas líneas escribes, sino:
- ¿Cuán rápido puedes iterar con confianza?
- ¿Cuán sostenible es tu velocidad?
- ¿Cuán fácil es cambiar el código en 6 meses?

### 2. Inversión en Infraestructura de Feedback

- Suite de tests comprensiva
- CI/CD robusto
- Documentación actualizada
- Métricas y monitorización

**Ahora es económicamente viable para equipos pequeños.**

---

## Implicaciones para la Construcción de Software (2)

<!-- 
Continuando con las implicaciones: Tercero, necesitamos una cultura de simplificación. Cuando alguien
elimina código, hay que felicitarlo, no preguntarle "¿y qué has hecho hoy?". Eliminar código (negative
velocity) debería ser una métrica de madurez del equipo. Cada feature que añadimos debe justificar su 
coste de mantenimiento. Cuarto, hay que ser consciente del balance. Mide tu ratio 
Funcionalidad:Sostenibilidad, no para copiarlo de otros, sino para saber conscientemente dónde estás 
invirtiendo tu tiempo y la velocidad que te da la IA. Y adapta ese ratio al contexto: no es lo mismo 
un prototipo que un sistema crítico en producción.
-->

### 3. Cultura de Simplificación

- Eliminar código debe ser celebrado
- "Negative velocity" es una métrica de madurez
- Cada feature debe justificar su coste basal

### 4. Balance Consciente

- Mide tu ratio Funcionalidad:Sostenibilidad
- Sé intencional sobre dónde va la velocidad de IA
- Adapta el ratio al contexto del proyecto

---

## Para Equipos de Desarrollo

<!-- 
Si trabajas en un equipo (o vas a trabajar pronto), estas son las preguntas que deberías estar 
haciéndote. ¿Usamos la IA para hacer sprints más cortos con más features, o para construir mejor con 
buenas prácticas? ¿Sabemos cuál es nuestro ratio? ¿Tenemos feedback loops que nos avisen cuando 
rompemos algo? ¿Nos atrevemos a eliminar esa feature que nadie usa hace 6 meses? ¿Qué cosas que antes 
decíamos "no hay tiempo" podemos hacer ahora? Y lo importante: la acción inmediata es medir. Trackea 
un mes de commits (puedes hacerlo manualmente al principio) y categorízalos: ¿cuánto fue features 
nuevas? ¿cuánto tests? ¿cuánto cleanup? No para compararte con otros, sino para ser CONSCIENTE de 
dónde vas.
-->

### Preguntas que hacer

1. **¿Estamos usando IA para ir más rápido o para construir mejor?**
2. **¿Cuál es nuestro ratio Funcionalidad:Sostenibilidad?**
3. **¿Estamos invirtiendo en feedback loops?**
4. **¿Podemos permitirnos eliminar features no usadas?**
5. **¿Qué buenas prácticas son ahora viables que antes no lo eran?**

### Acción inmediata

Trackea un mes de commits y categorízalos. Calcula tu ratio.
No para copiarlo, sino para ser consciente.

---

## Para Managers y Product Owners

<!-- 
Si eres (o vas a ser) manager o product owner, escucha bien. El juego cambió. Antes había un tira y 
afloja: los devs decían "no hay tiempo para tests", los PMs decían "necesito features YA", y el 
resultado era deuda técnica hasta que el sistema colapsaba. Ahora la IA eliminó "no hay tiempo" como 
excusa válida. Los devs SÍ pueden hacer tests y features al mismo tiempo. Así que la pregunta cambia: 
¿qué estándares de calidad EXIGIMOS? Porque ahora es posible. Y hay que entender el trade-off: no es 
"features rápidas vs features lentas", es "features rápidas HOY vs capacidad de seguir iterando rápido 
SIEMPRE". Invertir en sostenibilidad no es ir más lento, es asegurar que seguirás yendo rápido en el 
futuro.
-->

### El Nuevo Contrato

**Antes:**
- Desarrolladores: "No hay tiempo para tests/docs"
- PMs: "Necesitamos features más rápido"
- Resultado: Deuda técnica, velocidad insostenible

**Ahora:**
- IA eliminó "no hay tiempo" como excusa válida
- La pregunta es: **¿Qué estándares de calidad exigimos?**
- Inversión en sostenibilidad es inversión en velocidad futura

### Trade-off actualizado

Features rápidas hoy vs. capacidad de iterar rápido siempre

---

## Para Estudiantes

<!-- 
Y esto es especialmente para vosotros, estudiantes. Puede que penséis "si la IA escribe código, ¿para 
qué estudio?". ERROR. Las habilidades críticas ahora son MÁS importantes, no menos. Disciplina: la IA 
te da poder, pero no te hace disciplinado, eso es tu carácter. Diseño: la IA implementa, pero TÚ 
decides QUÉ construir y CÓMO arquitecturarlo. Dominio: entender el problema del usuario es más crítico 
que nunca, porque la IA no lo entiende por ti. Testing: mentalidad de feedback loops para poder iterar 
con confianza. Refactoring: mejora continua. Simplicidad: resistir la tentación de sobreingeniería 
(porque ahora puedes generar código complejo fácilmente, pero no deberías). Aprended a usar IA para 
construir MEJOR, no solo más rápido.
-->

### Habilidades Críticas en la Era IA

1. **Disciplina**: IA no te hace disciplinado, solo más capaz
2. **Diseño**: IA ayuda a implementar, tú decides qué construir
3. **Dominio**: Comprender el problema es más importante que nunca
4. **Testing**: Mentalidad de feedback loops
5. **Refactoring**: Mejora continua del diseño
6. **Simplicidad**: Resistir la tentación de sobreingeniería

**Aprender a usar IA para construir mejor, no solo más rápido.**

---

## Conexión con el Temario

<!-- 
Para cerrar el círculo con la asignatura: todo lo que hemos visto de DevOps (cultura, CI/CD, 
infraestructura como código) se hace más viable con IA. Todo lo que hemos visto de implementación 
(refactoring, ortogonalidad, contratos, programación funcional) se hace más accesible. Pero ojo: la 
IA NO REEMPLAZA estos conceptos. Los hace más viables y más URGENTES. Antes podías graduarte sin saber
de tests porque "total, no va a haber tiempo en mi trabajo". Ahora SÍ va a haber tiempo (o debería), 
así que más te vale saberlo. Los conceptos de la asignatura son más relevantes que nunca, no menos.
-->

### DevOps
- Cultura DevOps: sostenibilidad como valor
- CI/CD: tests automáticos viables
- Infraestructura como código: generación asistida

### Implementación
- Refactoring: más frecuente y seguro
- Ortogonalidad: diseño limpio más accesible
- Errores/Contratos: tests comprensivos
- Programación funcional: transformaciones asistidas

**La IA no reemplaza estos conceptos. Los hace más viables y urgentes.**

---

## El Experimento en Números

<!-- 
Aquí están todos los números clave del experimento en una tabla resumen. Esto es útil para que veas 
la magnitud: 424 commits en 44 días activos (casi 10 al día), más de 135 mil líneas cambiadas, 40.9% 
de código eliminado... Son números reales de un experimento real en sistemas de producción real. No es
teoría, no es un paper académico, es un tío midiendo TODO durante 11 semanas. Úsalo como referencia, 
no como objetivo a copiar. Tu contexto será diferente, pero al menos sabes qué es posible.
-->

### Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Commits totales | 424 |
| Días activos | 44 |
| Commits/día promedio | 9.6 (x2 normal) |
| Ratio Func:Sust | 0.23:1 |
| Funcionalidad por commit | 22.7% |
| Sostenibilidad por commit | 98.3% |
| Líneas cambiadas | 135,485 |
| Ratio de eliminación | 40.9% |
| Repositorios | 6 |
| Líneas de producción | ~107,000 |

---

## Advertencias y Limitaciones

<!-- 
Importante: pongamos los pies en la tierra. Este experimento tiene un contexto MUY específico: un 
manager con tiempo limitado, sistemas internos (no super críticos tipo banca o salud), actuando como 
PM y desarrollador al mismo tiempo (sin la fricción típica entre producto y desarrollo), y durante 
solo 11 semanas. No es universal. PERO lo que SÍ es extrapolable es: 1) que la IA reduce barreras 
económicas para hacer las cosas bien, 2) que la disciplina sigue siendo tu responsabilidad, 3) que 
el ratio debe adaptarse a tu contexto específico, y 4) que medir y ser consciente del balance tiene 
valor en sí mismo. Tu contexto será diferente. No copies números. Experimenta y mide TÚ.
-->

### Este no es un resultado universal

- Contexto: manager con tiempo limitado para código
- Sistemas internos, no alta criticidad
- Actuando como PM y desarrollador (sin fricción de comunicación)
- 11 semanas de experimento intensivo

### Lo que SÍ es extrapolable

- IA reduce barreras económicas para buenas prácticas
- La disciplina sigue siendo clave
- El ratio debe adaptarse al contexto
- Medir e ser consciente del balance es valioso

**Tu contexto es diferente. Experimenta y mide.**

---

## Riesgos y Trampas

<!-- 
No todo es color de rosa. Hay riesgos reales que hay que conocer. Sobreconfianza: la IA genera código 
que PARECE correcto pero tiene bugs sutiles. Complejidad accidental: como es "gratis" generar código, 
puedes caer en la trampa de generar más de lo necesario (¡y recuerda que más código = más coste basal!).
Deuda oculta: generas tests con IA pero luego no los mantienes y se quedan obsoletos. Dependencia: si 
solo programas con IA, pierdes la habilidad de programar sin ella (como depender de la calculadora y 
olvidar hacer cuentas). Y el peor: amplificación de malas prácticas, si ya eras malo optimizando, ahora
serás malo más rápido. Mitigación: tests como red de seguridad, code review humano obligatorio, 
principio de simplicidad, y cultivar habilidades fundamentales sin IA.
-->

### Lo que puede salir mal

1. **Sobreconfianza**: IA genera código incorrecto que parece correcto
2. **Complejidad accidental**: Generar código innecesario porque es "gratis"
3. **Deuda oculta**: Tests generados pero no mantenidos
4. **Dependencia**: Pérdida de habilidad de codificar sin IA
5. **Amplificación de malas prácticas**: Si optimizas mal, IA te hace ir mal más rápido

### Mitigación

- Tests como red de seguridad
- Code review humano sigue siendo crítico
- Principio de simplicidad (menos es más)
- Cultivar habilidades fundamentales

---

## Call to Action

<!-- 
Vale, después de todo esto, ¿qué haces TÚ ahora? Aquí está la llamada a la acción para tu próximo 
proyecto (o el actual): 1) Mide tu ratio, aunque sea aproximado, para saber dónde estás. 2) Define 
conscientemente dónde QUIERES estar (no lo dejes al azar). 3) Invierte en infraestructura de feedback,
que ahora es viable incluso para ti. 4) Elimina features no usadas, que ahora es barato hacerlo. 5) 
Itera rápido con confianza, porque la sostenibilidad te da esa confianza. Y la pregunta clave que 
deberías hacerte: ¿qué tipo de ingeniería hace viable la IA para MÍ que antes no lo era? Puede que 
sea TDD, puede que sea mutation testing, puede que sea documentar bien... pero algo hay. Encuéntralo.
-->

### Para tu próximo proyecto

1. **Mide** tu ratio actual Funcionalidad:Sostenibilidad
2. **Define** conscientemente tu balance objetivo
3. **Invierte** en infraestructura de feedback (ahora es viable)
4. **Elimina** features no usadas (ahora es económico)
5. **Itera** rápido con confianza (sostenibilidad lo permite)

### La pregunta clave

> <emph>¿Qué tipo de ingeniería hace viable la IA para ti que antes no lo era?</emph>

---

## Recursos y Referencias

<!-- 
Aquí están todos los recursos para que profundices. El artículo original de Eduardo Ferro tiene mucho
más detalle (gráficas, análisis por repo, etc.). Los conceptos relacionados (Basal Cost, Radical 
Detachment, Pseudo TDD with AI, Mutation Testing) tienen sus propios artículos en su blog, muy 
recomendables. Y las herramientas mencionadas: Cursor, Claude Code, GitHub Copilot, Claude Sonnet 4.5...
son las que usó en el experimento. Hay más opciones, pero estas son las mainstream ahora mismo. 
Investiga, prueba, experimenta. La clave es aprender a usarlas BIEN, no solo usarlas.
-->

### Artículo Original
Eduardo Ferro: "Fast Feedback, Fast Features: My AI Experiment"  
https://www.eferro.net/2026/01/fast-feedback-fast-features-my-ai.html

### Conceptos Relacionados
- **Basal Cost of Software**: Coste inherente de mantenimiento de cada línea
- **Radical Detachment**: Software como pasivo a minimizar
- **Pseudo TDD with AI**: TDD adaptado a desarrollo asistido por IA
- **Mutation Testing**: Validación de calidad de tests

### Herramientas Mencionadas
Cursor, Claude Code, GitHub Copilot, Claude Sonnet 4.5

---

## Conclusiones

<!-- 
Llegamos al final. La gran lección, en dos frases: la IA NO cambió lo que es importante (tests, docs, 
diseño limpio, siempre fueron importantes), pero SÍ cambió lo que es económicamente viable (ahora SÍ 
nos lo podemos permitir). Las consecuencias son enormes: 1) Las buenas prácticas son casi gratis, así 
que no hay excusas para no hacerlas. 2) La velocidad sostenible ya no es solo para Google o Facebook, 
equipos pequeños pueden tenerla. 3) Eliminar código es viable, podemos tener codebases más simples. 
4) La disciplina es MÁS importante que nunca, porque la IA amplifica tus decisiones (buenas o malas). 
5) El ratio exacto importa menos que ser consciente del balance que eliges. Y el cambio mental final: 
antes preguntábamos "¿podemos permitirnos hacer esto bien?", ahora preguntamos "¿QUÉ elegimos construir?"
-->

### La Gran Lección

**IA no cambió lo que es importante en ingeniería de software.**

**IA cambió lo que es económicamente viable.**

### Las Consecuencias

1. Las buenas prácticas ahora son casi gratis → no hay excusas
2. La velocidad sostenible es accesible para equipos pequeños
3. Eliminar código es viable → codebases más simples
4. La disciplina es más importante que nunca → IA amplifica decisiones
5. El ratio importa menos que la consciencia del balance

**La pregunta ya no es "¿podemos permitírnoslo?" sino "¿qué elegimos construir?"**

---

<!-- paginate: false -->

<style scoped>
h1 { font-size: 3em; margin-top: 200px; }
h3 { text-align: center; color: #666; margin-top: 50px; }
</style>

# ¿PREGUNTAS?

### Construcción de Software en la Era de la IA

<!-- 
Slide final. Momento de preguntas. Espero que haya quedado claro que la IA es una herramienta 
transformadora, pero no mágica. Cambia lo que es posible, pero no elimina la necesidad de entender, 
diseñar, y sobre todo, ser disciplinado. Si te llevas una sola idea de esta presentación, que sea 
esta: usa la IA para construir MEJOR, no solo más rápido. La velocidad sin dirección es solo 
movimiento. La velocidad con sostenibilidad es progreso real.
-->

---
