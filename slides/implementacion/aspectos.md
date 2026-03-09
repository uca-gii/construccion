---
marp: true
author:
- Juan Manuel Dodero
date: Enero 2026
subject: Implementación e Implantación de Sistemas Software, curso 2025/26
title: Programación con aspectos
description: Apuntes de Implementación e Implantación de Sistemas Software
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
</style>

<style scoped>
p {
  text-align: center;
}
</style>

# PROGRAMACIÓN CON ASPECTOS

## Ortogonalidad con aspectos

---

<!-- paginate: true -->

<style scoped>
p {
  text-align: center;
}
</style>

## CASO PRÁCTICO: Editor de figuras

---

### Ejemplo: editor de figuras

<div class="cols">
<div>

```java
class Line implements FigureElement {
  private Point p1, p2;

  Point getP1() { return p1; }
  Point getP2() { return p2; }

  void setP1(Point p1) { this.p1 = p1; }
  void setP2(Point p2) { this.p2 = p2; }
}

class Point implements FigureElement {
  private int x = 0, y = 0;

  int getX() { return x; }
  int getY() { return y; }

  void setX(int x) { this.x = x; }
  void setY(int y) { this.y = y; }
}
```

</div>
<div>

Hay que actualizar la pantalla tras mover los objetos:

![figuras en pantalla](./img/aspectj-1.png)

Hay una colección de figuras que cambian periódicamente.

Se deben monitorizar los cambios para refrescar el display.

</div>
</div>

---

Implementamos una clase que monitoriza los cambios en las figuras:

```java
class MoveTracking {
  private static boolean flag = false;

  public static void setFlag() {
    flag = true;
  }

  public static boolean testAndClear() {
    boolean result = flag;
    flag = false;
    return result;
  }
}
```

¿Qué dependencias aparecen?

---

¿Qué dependencias aparecen?

- `Line` $\dashrightarrow$ `MoveTracking`
- `Point` $\dashrightarrow$ `MoveTracking`

### Implementaciones sin aspectos

Primero vemos algunas implementaciones con las dependencias anteriores, intentando resolver la no ortogonalizad, pero sin usar aspectos.

- Versión 1: solo detecta el cambio de los extremos de una línea
- Versión 2: también detecta el cambio de coordenadas de un punto
- Versión 3: monitoriza las figuras que cambian, evitando el refresco de todas

---

#### Versión 1 sin aspectos

Solo detecta el cambio de los extremos de una línea: `Line` $\dashrightarrow$ `MoveTracking`

<div class="cols">
<div>

```java hl_lines="9 13 31"
class Line implements FigureElement {
  private Point p1, p2;

  Point getP1() { return p1; }
  Point getP2() { return p2; }

  void setP1(Point p1) {
    this.p1 = p1;
    MoveTracking.setFlag();
  }
  void setP2(Point p2) {
    this.p2 = p2;
    MoveTracking.setFlag();
  }
}
```

</div>
<div>

```java
class Point implements FigureElement {
  private int x = 0, y= 0;

  int getX() { return x; }
  int getY() { return y; }

  void setX(int x) {
    this.x = x;
  }
  void setY(int y) {
    this.y = y;
  }
}
```

</div>
</div>

---

#### Versión 2 sin aspectos

También detecta el cambio de coordenadas de un punto

<div class="cols">
<div>

- `Line` $\dashrightarrow$ `MoveTracking`
- `Point` $\dashrightarrow$ `MoveTracking`

</div>
<div>

```java
class MoveTracking {
  private static boolean flag = false;

  public static void setFlag() {
    flag = true;
  }

  public static boolean testAndClear() {
    boolean result = flag;
    flag = false;
    return result;
  }
}
```

</div>
</div>

---

<div class="cols">
<div>

```java hl_lines="25 29"
class Line implements FigureElement {
  private Point p1, p2;

  Point getP1() { return p1; }
  Point getP2() { return p2; }

  void setP1(Point p1) {
    this.p1 = p1;
    MoveTracking.setFlag();
  }
  void setP2(Point p2) {
    this.p2 = p2;
    MoveTracking.setFlag();
  }
}
```

</div>
<div>

```java
class Point implements FigureElement {
  private int x = 0, y = 0;

  int getX() { return x; }
  int getY() { return y; }

  void setX(int x) {
    this.x = x;
    MoveTracking.setFlag(); //añadido
  }
  void setY(int y) {
    this.y = y;
    MoveTracking.setFlag(); //añadido
  }
}
```

</div>
</div>

---

#### Versión 3 sin aspectos

<div class="cols">
<div>

Las colecciones de figuras son complejas. Las estructuras de objetos son jerárquicas y se producen eventos asíncronos:

![colección de figuras](./img/aspectj-2.png)

Versión 2: un cambio en cualquier elemento provocará un refresco de todas las figuras

</div>
<div>

Mejor monitorizar las figuras que cambian...

Modificamos la versión 2 para cambiar el método `setFlag` por `collectOne`

```java
class MoveTracking {
  private static Set movees =
                       new HashSet();

  public static void collectOne(Object o) {
    movees.add(o);
  }

  public static Set getmovees() {
    Set result = movees;
    movees = new HashSet();
    return result;
  }
}
```

</div>
</div>

---

Indicamos la figura que se mueve:

<div class="cols">
<div>

```java hl_lines="9 13 25 29 34 36 40"
class Line implements FigureElement {
  private Point p1, p2;

  Point getP1() { return p1; }
  Point getP2() { return p2; }

  void setP1(Point p1) {
    this.p1 = p1;
    MoveTracking.collectOne(this);
  }
  void setP2(Point p2) {
    this.p2 = p2;
    MoveTracking.collectOne(this);
  }
}
```

</div>
<div>

```java
class Point implements FigureElement {
  private int x = 0, y = 0;

  int getX() { return x; }
  int getY() { return y; }

  void setX(int x) {
    this.x = x;
    MoveTracking.collectOne(this);
  }
  void setY(int y) {
    this.y = y;
    MoveTracking.collectOne(this);
  }
}
```

</div>
</div>

---

La no ortogonalidad de `MoveTracking` con respecto a `Line` y `Point` hace que la solicitud de un cambio de implementación (el seguimiento de los cambios en las figuras para el refresco en pantalla) provoque un cambio en los otros módulos (clases).

El cambio de implementación del seguimiento de los cambios para el refresco en pantalla ha dado lugar a modificaciones en todas las clases: `Line`, `Point` y `MoveTracking`

---

## Programación orientada a aspectos

La __programación orientada a aspectos__ (_AOP_) es un paradigma de programación cuyo objetivo es incrementar la modularidad (ortogonalidad) de las implementaciones mediante la separación de aspectos _transversales_ (_cross-cutting concerns_).

![terminología sobre AOP](./img/aspectj-terminology.png)

---

- __aspect__ = modularización de un aspecto de interés (_concern_) que afecta a varias clases o módulos
- __joinpoint__ = especificación declarativa de un punto en la ejecución de un programa (por ejemplo, la ejecución de un método, el manejo de una excepción, etc.)
- __advice__ = acción a tomar por la especificación de un aspecto dado en un determinado _joinpoint_.
  - Interceptan la ejecución de un _joinpoint_. Hay una cadena de interceptores alrededor de cada _joinpoint_.
  - Tipos de _advice_: _after_, _before_, _around_, etc.
- __pointcut__ = predicado que define cuándo se aplica un _advice_ de un aspecto en un _jointpoint_ determinado. Se asocia un _advice_ con la expresión de un _pointcut_ y se ejecuta el _advice_ en todos los _joinpoint_ que cumplan la expresión del _pointcut_.

---

### Implementación con aspectos

En el ejemplo anterior, las clases `Line` y `Point` no se ven afectadas:

<div class="cols">
<div>

```java
class Line implements FigureElement {
  private Point p1, p2;

  Point getP1() { return p1; }
  Point getP2() { return p2; }

  void setP1(Point p1) {
    this.p1 = p1;
  }
  void setP2(Point p2) {
    this.p2 = p2;
  }
}
```

</div>
<div>

```java
class Point implements FigureElement {
  private int x = 0, y = 0;

  int getX() { return x; }
  int getY() { return y; }

  void setX(int x) {
    this.x = x;
  }
  void setY(int y) {
    this.y = y;
  }
}
```

</div>
</div>

Vamos a eliminar las dependencias ($\Delta$ ortogonalidad) implementando aspectos...

---

#### Versión 1 con aspectos

Eliminar dependencia `Line` $\not\dashrightarrow$ `MoveTracking`

```java
aspect MoveTracking {
  private boolean flag = false;
  public boolean testAndClear() {
    boolean result = flag;
    flag = false;
    return result;
  }

  pointcut move():
    call(void Line.setP1(Point)) || call(void Line.setP2(Point));

  after(): move() {
    flag = true;
  }
}
```

---

#### Versión 2 con aspectos

Eliminar dependencias `Line` $\not\dashrightarrow$ `MoveTracking` y `Point` $\not\dashrightarrow$ `MoveTracking`

```java hl_lines="12 13"
aspect MoveTracking {
  private boolean flag = false;
  public boolean testAndClear() {
    boolean result = flag;
    flag = false;
    return result;
  }

  pointcut move():
    call(void Line.setP1(Point)) || call(void Line.setP2(Point)) ||
    call(void Point.setX(int))   || call(void Point.setY(int));

  after(): move() {
    flag = true;
  }
}
```

---

Ejemplos de pointcut:

```java
call(void Figure.set*(..))

call(public * Figure.* (..))
```

#### Versión 3 con aspectos

- `Line` $\perp$ `MoveTracking`
- `Point` $\perp$ `MoveTracking`

Versión más ortogonal. Todos los cambios están concentrados en un solo aspecto.

---

```java hl_lines="2 3 9 10 16 17"
aspect MoveTracking {
  private Set movees = new HashSet();
  public Set getmovees() {
    Set result = movees;
    movees = new HashSet();
    return result;
  }

  pointcut move(FigureElement figElt):
    target(figElt) &&
    (call(void Line.setP1(Point)) || call(void Line.setP2(Point)) ||
     call(void Point.setX(int))   || call(void Point.setY(int)));

  after(FigureElement fe): move(fe) {
    movees.add(fe);
  }
}
```

---

### Lecturas recomendadas de AspectJ

- [Lenguaje de AspectJ](https://www.eclipse.org/aspectj/doc/next/progguide/printable.html#language)
- [Introducción a AspectJ](https://www.eclipse.org/aspectj/doc/next/progguide/printable.html#starting-aspectj)

### Ejercicios: AspectJ y Spring AOP

- [Introducción a AspectJ](http://www.baeldung.com/aspectj)
- [Introducción a Spring AOP](http://www.baeldung.com/spring-aop)
