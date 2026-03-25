---
marp: true
author:
- Juan Manuel Dodero
date: Enero 2026
subject: Implementación e Implantación de Sistemas Software, curso 2025/26
title: Comprendiendo OOP
description: La Falta de Comprensión de la Programación Orientada a Objetos
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.cols > div {
  align-self: start;
}
section.quote {
  background: #f5f5f5;
}
</style>

# COMPRENDIENDO OOP

## La mayoría de la gente no entiende la Programación Orientada a Objetos

Basado en el artículo de [Sigma's Blog](https://blog.sigma-star.io/2024/01/people-dont-understand-oop/)

---

<!-- paginate: true -->

## El Problema

<!-- 
La mayoría de desarrolladores tiene una comprensión superficial de OOP, enfocada en características 
sintácticas (clases, herencia, getters/setters) en lugar de los principios fundamentales de diseño.
-->

### ¿Qué aprendemos en las universidades?

- **Clases** y objetos
- **Herencia** como mecanismo principal de reutilización
- **Encapsulación** = hacer todo privado + getters/setters
- Ejemplos con "Perros" y "Coches"

### ¿Es eso realmente OOP?

<emph>Según Alan Kay, el creador del término, NO.</emph>

---

## Alan Kay y la Verdadera OOP

<!-- 
Alan Kay, quien acuñó el término "Object-Oriented Programming", tenía una visión muy diferente a lo 
que se enseña comúnmente. Para él, la OOP no trataba sobre clases y herencia.
-->

### Los Tres Pilares Reales de OOP

1. **Paso de mensajes** (*Messaging*)
   - La comunicación entre objetos es lo fundamental
   
2. **Retención local, protección y ocultación del estado-proceso**
   - Los objetos ocultan su estado interno
   
3. **Enlace tardío extremo** (*Extreme late-binding*)
   - Decisiones en tiempo de ejecución, no compilación

> "I'm sorry that I long ago coined the term 'objects' for this topic because it gets many people to focus on the lesser idea. The big idea is 'messaging'." — Alan Kay

---

## El Error #1: Clases como Requisito

<!-- 
Muchos piensan que no hay OOP sin clases. Esto es falso. Hay lenguajes orientados a objetos que no 
usan clases, sino prototipos.
-->

### Las Clases NO son Obligatorias

<div class="cols">
<div>

**Lenguajes con Clases**
- Java
- C++
- Python
- Ruby

</div>
<div>

**Lenguajes sin Clases (Prototipos)**
- JavaScript (pre-ES6)
- Lua
- Self
- Io

</div>
</div>

### Conclusión

Las clases son **una forma** de implementar OOP, no **la única forma**.

La OOP puede existir sin clases usando **prototipos** u otros mecanismos.

---

## El Error #2: Herencia como Herramienta de Reutilización

<!-- 
La herencia se enseña como el mecanismo principal para reutilizar código. Pero los expertos modernos 
prefieren la composición. La verdadera utilidad de la herencia es el polimorfismo.
-->

### El Mito

> "Usa herencia para reutilizar código"

### La Realidad

- **Reutilización de código** → Usar **composición** (delegación)
- **Herencia** → Para **subtipado** y **polimorfismo**

### Principio de Sustitución de Liskov

Si `B` hereda de `A`, entonces cualquier código que espere `A` debe funcionar con `B` sin modificaciones.

**Ejemplo:** Cambiar `ArrayList` por `LinkedList` sin afectar al resto del sistema.

---

## El Error #3: Getters y Setters

<!-- 
Este es uno de los errores más comunes y dañinos. Muchos piensan que encapsulación significa hacer 
todo privado y crear getters/setters. Esto es completamente incorrecto.
-->

### El Dogma Incorrecto

```java
public class Person {
    private String name;
    private int age;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
```

### El Problema

<emph>Los getters y setters exponen el estado interno tanto como las propiedades públicas.</emph>

Crean alto **acoplamiento** entre objetos.

---

## Getters/Setters vs Comportamiento

<!-- 
La diferencia entre un objeto real y una simple estructura de datos es el comportamiento. Los 
objetos deben HACER cosas, no solo almacenar datos.
-->

<div class="cols">
<div>

### ❌ Pseudo-Objeto (Record)

```java
class BankAccount {
  private double balance;
  
  public double getBalance() {
    return balance;
  }
  
  public void setBalance(double b) {
    balance = b;
  }
}

// Uso:
account.setBalance(
  account.getBalance() - 100
);
```

</div>
<div>

### ✅ Objeto Real

```java
class BankAccount {
  private double balance;
  
  public void withdraw(double amount) {
    if (amount > balance) {
      throw new InsufficientFundsException();
    }
    balance -= amount;
  }
  
  public void deposit(double amount) {
    balance += amount;
  }
}

// Uso:
account.withdraw(100);
```

</div>
</div>

**La diferencia:** El objeto real tiene **comportamiento**, no solo datos.

---

## Verdadera Encapsulación

<!-- 
La encapsulación no es sobre hacer todo privado, es sobre ocultar DECISIONES DE IMPLEMENTACIÓN para 
que puedas cambiar la implementación sin afectar a los clientes del objeto.
-->

### No es...

- Hacer todo `private`
- Añadir getters/setters automáticamente
- "Proteger" las variables

### Es...

- **Ocultar decisiones de implementación**
- Permitir cambios internos sin romper código externo
- Exponer **comportamiento**, no estado

### Beneficio

Si cambias la implementación interna (ej: cambiar de `ArrayList` a `LinkedList`), el código cliente no se rompe.

---

## El Principio "Tell, Don't Ask"

<!-- 
Un principio fundamental que resume la OOP correcta: no le preguntes a un objeto por su estado para 
luego decidir qué hacer. DILE al objeto qué hacer, y que él decida basándose en su estado.
-->

<div class="cols">
<div>

### ❌ Ask (Preguntar)

```java
if (door.isOpen()) {
  door.setOpen(false);
}
```

**Problema:** El cliente necesita conocer el estado interno.

</div>
<div>

### ✅ Tell (Decir)

```java
door.close();
```

**Ventaja:** El objeto encapsula la lógica.

</div>
</div>

### Regla de Oro

> No preguntes a un objeto por su estado para tomar decisiones.
> Dile al objeto qué quieres que haga.

---

## El Error #4: "Perros y Coches"

<!-- 
Los ejemplos típicos de OOP en las universidades son "Perro extiende Animal" o "Coche tiene Ruedas". 
Estos ejemplos son pedagógicamente malos porque no muestran el valor real de la OOP.
-->

### Ejemplos Típicos de Universidad

```java
class Animal {
  void eat() { ... }
}

class Dog extends Animal {
  void bark() { ... }
}

class Car {
  private Engine engine;
  private Wheel[] wheels;
}
```

### ¿Por qué son Malos?

1. Se enfocan en **jerarquías taxonómicas**, no en **comportamiento**
2. No muestran el valor del **polimorfismo**
3. No enseñan **diseño real** de sistemas
4. Crean la falsa idea de que OOP = "modelar el mundo real"

---

## OOP No es Modelar el Mundo Real

<!-- 
Uno de los malentendidos más grandes: pensar que OOP es sobre "representar el mundo real con clases". 
No, es sobre diseñar software mantenible y flexible.
-->

### El Mito

> "OOP nos permite modelar el mundo real en nuestro código"

### La Realidad

OOP es sobre:
- **Gestionar la complejidad** del software
- **Controlar dependencias** entre módulos
- **Permitir cambios** sin efectos secundarios
- **Reutilizar comportamiento** de forma segura

<emph>No se trata de si un "Círculo" ES-UN "Shape" en la vida real, sino de si tiene sentido en tu DISEÑO.</emph>

---

## El Error #5: Complejidad Innecesaria

<!-- 
La visión distorsionada de OOP lleva a "Abstract Nonsense": abstracciones genéricas para 
eventualidades futuras que nunca ocurren. El resultado es código complicado sin beneficio real.
-->

### "Abstract Nonsense"

Crear abstracciones genéricas para eventualidades futuras que **nunca ocurren**.

```java
// Sobreingeniería
AbstractBeanFactoryProxyManagerAdapterFactory factory = 
  new DefaultBeanFactoryProxyManagerAdapterFactoryImpl();

// vs.

// Simplicidad
List<User> users = database.getUsers();
```

### El Problema

- **YAGNI** (You Aren't Gonna Need It) violado constantemente
- Complejidad que no resuelve problemas reales
- Arquitecturas "enterprise" que son procedimientos disfrazados de clases

---

## Patrones de Diseño Mal Entendidos

<!-- 
Los patrones de diseño son útiles, pero solo cuando se usan correctamente y en el contexto apropiado. 
Muchos se aplican mal o innecesariamente.
-->

### Singleton: ¿Patrón o Antipatrón?

```java
public class DatabaseConnection {
  private static DatabaseConnection instance;
  
  private DatabaseConnection() {}
  
  public static DatabaseConnection getInstance() {
    if (instance == null) {
      instance = new DatabaseConnection();
    }
    return instance;
  }
}
```

**Problema:** Es básicamente una **variable global** glorificada.

---

## Factory: ¿Cuándo Usarlo?

<!-- 
El patrón Factory es útil, pero a menudo se usa innecesariamente. No necesitas una Factory solo 
porque alguien dijo que no debes usar 'new'.
-->

<div class="cols">
<div>

### ❌ Factory Innecesario

```java
class UserFactory {
  public User createUser(
    String name, int age) {
    return new User(name, age);
  }
}

// Uso:
UserFactory factory = 
  new UserFactory();
User user = 
  factory.createUser("Juan", 25);
```

</div>
<div>

### ✅ Simplicidad

```java
// Directamente:
User user = new User("Juan", 25);





// Factory solo cuando hay 
// lógica compleja o 
// necesitas polimorfismo:
Animal animal = 
  AnimalFactory.create("dog");
```

</div>
</div>

**Regla:** Usa patrones cuando **resuelven un problema real**, no por dogma.

---

## Entonces, ¿Qué ES OOP?

<!-- 
Después de todo lo que NO es OOP, veamos qué SÍ es. La esencia de la OOP según Alan Kay.
-->

### La Esencia (según Alan Kay)

1. **Messaging** (Paso de mensajes)
   - Los objetos se comunican mediante mensajes
   - No necesitas conocer la implementación interna
   
2. **Encapsulation** (Encapsulación verdadera)
   - Ocultar decisiones de implementación
   - Cambios internos no afectan a clientes
   
3. **Late Binding** (Enlace tardío)
   - Decisiones en tiempo de ejecución
   - Polimorfismo real

<emph>Es sobre gestionar la complejidad mediante aislamiento y comunicación controlada.</emph>

---

## Messaging: El Concepto Olvidado

<!-- 
El paso de mensajes es el concepto más importante de OOP según Kay, pero también el más olvidado en 
la enseñanza tradicional.
-->

### ¿Qué es "Messaging"?

Cuando un objeto envía un mensaje a otro, **no sabe** (ni debe saber):
- Cómo se implementa el receptor
- Qué hace internamente
- Qué estructura de datos usa

Solo sabe:
- Qué mensaje enviar
- Qué respuesta esperar

### Analogía

Como llamar a una API REST: no sabes qué tecnología usa el servidor, solo el endpoint y el formato de respuesta.

---

## Late Binding: Polimorfismo Real

<!-- 
El enlace tardío permite que el comportamiento se decida en tiempo de ejecución, no de compilación. 
Esto es lo que hace a OOP flexible y extensible.
-->

### Ejemplo

```java
List<Animal> animals = Arrays.asList(
  new Dog(),
  new Cat(),
  new Bird()
);

for (Animal animal : animals) {
  animal.makeSound();  // ¿Qué sonido? Se decide en runtime
}
```

**Ventaja:** Puedes añadir nuevos tipos (`Fish`, `Lion`) sin modificar el código existente.

**Esto es polimorfismo:** El **tipo real** se conoce en tiempo de ejecución, no de compilación.

---

## Composición sobre Herencia

<!-- 
El principio moderno más importante: prefiere composición a herencia. La herencia crea acoplamiento 
fuerte, la composición es flexible.
-->

<div class="cols">
<div>

### ❌ Herencia Rígida

```java
class Bird {
  void fly() { ... }
}

class Penguin extends Bird {
  // Problema: ¡Los pingüinos 
  // no vuelan!
  @Override
  void fly() {
    throw new 
      UnsupportedOperationException();
  }
}
```

</div>
<div>

### ✅ Composición Flexible

```java
interface Movable {
  void move();
}

class Bird {
  private Movable movement;
  
  Bird(Movable m) {
    movement = m;
  }
  
  void move() {
    movement.move();
  }
}

Bird eagle = new Bird(new Flying());
Bird penguin = new Bird(new Swimming());
```

</div>
</div>

---

## Implicaciones Prácticas

<!-- 
Después de toda la teoría, veamos qué significa esto para tu código del día a día.
-->

### Lo Que Debes Hacer

1. **Diseñar por comportamiento**, no por jerarquías
2. **Minimizar dependencias** entre objetos
3. **Exponer comportamiento**, no estado (evitar getters/setters innecesarios)
4. **Usar composición** como default, herencia solo para polimorfismo
5. **Aplicar "Tell, Don't Ask"**
6. **Mantener simplicidad** (YAGNI, KISS)

### Lo Que Debes Evitar

1. ❌ Getters/setters automáticos para todo
2. ❌ Jerarquías de herencia profundas
3. ❌ Abstracciones prematuras
4. ❌ Patrones de diseño por dogma

---

## Ejemplo Comparativo: Sistema de Pagos

<!-- 
Un ejemplo realista que muestra la diferencia entre OOP mal entendida y bien aplicada.
-->

### ❌ Enfoque Incorrecto (Anémico)

```java
class Payment {
  private double amount;
  private String status;
  
  public double getAmount() { return amount; }
  public void setAmount(double amount) { this.amount = amount; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}

class PaymentService {
  public void processPayment(Payment payment) {
    if (payment.getStatus().equals("pending")) {
      // lógica de procesamiento
      payment.setStatus("completed");
    }
  }
}
```

---

## Ejemplo Comparativo: Sistema de Pagos (2)

### ✅ Enfoque Correcto (Rico en Comportamiento)

```java
class Payment {
  private Money amount;
  private PaymentStatus status;
  
  public void process() {
    if (!status.canBeProcessed()) {
      throw new IllegalStateException("Payment cannot be processed");
    }
    status = status.transitionToProcessing();
    // lógica de procesamiento
    status = status.transitionToCompleted();
  }
  
  public boolean isCompleted() {
    return status.isCompleted();
  }
}
```

**Diferencia clave:** El objeto `Payment` tiene comportamiento real, no es solo un contenedor de datos.

---

## El Código Anémico vs Rico

<!-- 
El antipatrón del "modelo de dominio anémico" es uno de los más comunes en aplicaciones "OOP".
-->

### Modelo de Dominio Anémico (Antipatrón)

- Objetos con solo getters/setters
- Toda la lógica en "Services"
- Básicamente programación procedural disfrazada

### Modelo de Dominio Rico (OOP Real)

- Objetos con comportamiento
- Lógica donde pertenece (en los objetos de dominio)
- "Tell, Don't Ask" aplicado

<emph>Si tus objetos solo tienen getters/setters y servicios que los manipulan, NO estás haciendo OOP.</emph>

---

## SOLID: Principios Correctos

<!-- 
Los principios SOLID son un buen guía para OOP correcta, pero deben entenderse correctamente.
-->

### Los 5 Principios

1. **S**ingle Responsibility: Una clase, una razón para cambiar
2. **O**pen/Closed: Abierto a extensión, cerrado a modificación
3. **L**iskov Substitution: Subtipos deben ser sustituibles
4. **I**nterface Segregation: Interfaces pequeñas y específicas
5. **D**ependency Inversion: Depender de abstracciones, no de concreciones

### Conexión con OOP Real

- **S, I** → Cohesión y encapsulación
- **O, L** → Polimorfismo correcto
- **D** → Messaging y late binding

---

## Testing y OOP

<!-- 
La testabilidad es un indicador de buen diseño OOP. Si tu código es difícil de testear, 
probablemente tiene problemas de diseño.
-->

### Código Testeable = Buen Diseño OOP

Si tu código es difícil de testear, probablemente:
- Tiene **acoplamiento alto**
- Tiene **responsabilidades mezcladas**
- Usa **Singletons** u otras dependencias ocultas
- No usa **inyección de dependencias**

### Dependency Injection

```java
// ❌ Difícil de testear
class OrderProcessor {
  private Database db = new Database();  // Acoplamiento fuerte
  public void process(Order order) { db.save(order); }
}

// ✅ Fácil de testear
class OrderProcessor {
  private Database db;
  OrderProcessor(Database db) { this.db = db; }  // Inyección
  public void process(Order order) { db.save(order); }
}
```

---

## Conexión con el Temario

<!-- 
Cómo se relaciona todo esto con lo que hemos visto en la asignatura.
-->

### Principios que Hemos Visto

- **Cohesión y Acoplamiento** → Encapsulación real
- **Delegación** → Composición sobre herencia
- **Inyección de Dependencias** → Permitir late binding
- **Ortogonalidad** → Módulos independientes
- **Refactoring** → Mejorar diseño continuamente

### La Conexión

<emph>Todo el temario apunta hacia el VERDADERO OOP, no al OOP superficial de "clases y herencia".</emph>

El buen diseño OOP es:
- Alto en cohesión, bajo en acoplamiento
- Basado en comportamiento, no en datos
- Flexible mediante composición y polimorfismo

---

## Para Reflexionar

<!-- 
Preguntas que deberías hacerte al diseñar con objetos.
-->

### Preguntas Clave al Diseñar

1. **¿Mis objetos tienen comportamiento real o son solo contenedores de datos?**
2. **¿Estoy exponiendo estado innecesariamente?**
3. **¿Uso herencia para reutilización de código o para polimorfismo?**
4. **¿Podría usar composición en lugar de herencia?**
5. **¿Estoy aplicando "Tell, Don't Ask"?**
6. **¿Mis abstracciones resuelven problemas reales o son especulativas?**
7. **¿Mi código es fácil de testear?**

### La Regla de Oro

> Si no puedes explicar por qué tu diseño es mejor que algo más simple, 
> probablemente NO es mejor.

---

## Recursos y Referencias

<!-- 
Dónde aprender más sobre OOP correcta.
-->

### Artículo Principal

**"People Don't Understand Object-Oriented Programming"**  
Sigma's Blog (2024)  
https://blog.sigma-star.io/2024/01/people-dont-understand-oop/

### Conceptos Relacionados

- **Tell, Don't Ask**: Principio de diseño OOP
- **Anemic Domain Model**: Antipatrón común
- **Composition over Inheritance**: Principio moderno
- **SOLID Principles**: Guía de buen diseño

### Lecturas Recomendadas

- Alan Kay sobre Messaging y OOP
- Martin Fowler: "Refactoring" y "Patterns of Enterprise Application Architecture"
- Robert C. Martin: "Clean Code" y "Clean Architecture"

---

## Conclusiones

<!-- 
Resumen final de todo lo visto.
-->

### Lo Que Aprendimos

1. **OOP ≠ Clases + Herencia + Getters/Setters**
2. **OOP = Messaging + Encapsulation + Late Binding**
3. **Getters/Setters automáticos son un antipatrón**
4. **Herencia es para polimorfismo, no reutilización de código**
5. **Los objetos deben tener COMPORTAMIENTO, no solo datos**
6. **Composición > Herencia**
7. **Simplicidad > Abstracciones prematuras**

### El Cambio Mental

<emph>Deja de pensar en "clases que representan cosas" y empieza a pensar en "objetos que colaboran mediante mensajes".</emph>

---

<!-- paginate: false -->

<style scoped>
h1 { font-size: 3em; margin-top: 200px; }
h3 { text-align: center; color: #666; margin-top: 50px; }
</style>

# ¿PREGUNTAS?

### Comprendiendo la Verdadera Programación Orientada a Objetos

---
