---
title: Programación con objetos
description: >-
  Abstracción, cohesión y acoplamiento como motor del diseño orientado a
  objetos; herencia, polimorfismo y tipado, con ejemplos ejecutables en varios
  lenguajes.
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {Runnable} from '@site/src/components/CodeRunner';

# Programación con objetos

¿Cuál es la ventaja principal de la orientación a objetos? **Ocultar la
implementación.** El resto de este tema explica cómo la OO consigue esa
ocultación y qué principios hay detrás.

## Principios básicos de la construcción de software (OO)

- **Abstracción**: diferenciar el *qué* y el *cómo*.
- **Modularidad**: componentes, módulos (en OO, clases y objetos), interfaces, etc.
- Maximizar la **cohesión**: módulos auto-contenidos, independientes y con un único propósito.
- Minimizar el **acoplamiento**: reducir las dependencias entre módulos.

Estos cuatro principios son el hilo conductor de todo el tema: cada decisión
de diseño que veamos a continuación se puede leer en términos de cuánta
cohesión gana o cuánto acoplamiento introduce.

## Cohesión y acoplamiento: evolución de un TAD Lista

Para ver estos principios en acción, vamos a criticar y evolucionar cuatro
versiones sucesivas de un tipo abstracto de datos `List` en Java. El código de
cada versión es deliberadamente esquemático (los cuerpos de los métodos se
omiten con `{ ... }`) porque el objetivo no es ejecutarlo, sino discutir su
diseño antes de seguir a la siguiente versión.

### Versión inicial: Lista v0.1

```java static
public abstract class List<T> {
  public void addFirst(T value) { ... };
  public void removeFirst() { ... };
  public void addLast(T value) { ... };
  public void removeLast() { ... };
  public T first() { ... };
  public T last() { ... };
  public boolean isEmpty() { ... };
  public int length() { ... };
  public List<T> clone() { ... };
  public boolean isEqualTo(List<T>) { ... };
  public abstract void traverse();
  // etc...
}
```

La clase abstracta `List<T>` sí diferencia entre el *qué* y el *cómo* — qué
hace la lista frente a cómo se almacenan los elementos —, así que cumple con
la abstracción. Pero:

- `List<T>` aglutina más de una responsabilidad: **almacenar** y **recorrer**.
  La implementación no parece cohesionada.
- El método `traverse()` da una interfaz a quien implemente el recorrido de la
  lista, pero ¿para hacer qué exactamente con cada elemento?
- Si hay distintas implementaciones de `traverse()`, y llegamos a tener varias
  versiones de la lista, introducimos más dependencias (acoplamiento).

**Problemas de v0.1**: cohesión baja; variabilidad no bien tratada → poca
flexibilidad.

> Cohesion refers to the degree to which the elements inside a module belong together.
>
> — E. Yourdon & L. Constantine, *Structured Design: Fundamentals of a Discipline of Computer Program and Systems Design*. Prentice Hall, 2nd edition, 1986.

### Implementación alternativa: Lista v0.2

Si hace falta crear nuevos tipos de recorrido, una opción es ampliar la
interfaz:

```java static
public interface List<T> {
  public void addFirst(T value);
  public void removeFirst();
  public void addLast(T value);
  public void removeLast();
  public T first();
  public T last();
  public boolean isEmpty();
  public int length();
  public List<T> clone();
  public boolean isEqualTo(List<T>);

  public void traverseForward();
  public void traverseBackWard();
  public void traverseEvens(); // pares
  public void traverseOdds();  // impares
}
```

- Si hay que cambiar la operación básica que hace `traverse()` con cada
  elemento (imprimir, sumar, etc.), ¿cuántos métodos hay que cambiar? Hay
  muchas dependencias.
- Cuanta más variedad de recorridos tenga la interfaz, menos flexibilidad para
  los cambios.

**Problemas de v0.2**: acoplamiento excesivo (muchas dependencias, provocadas
por el exceso de herencia); flexibilidad escasa.

### Implementación alternativa: Lista v0.3

Otra opción es delegar la funcionalidad hacia las subclases, vía herencia:

```java static
class ListForward<T> extends List<T> {
  //...
  public void traverse() { // recorrer hacia adelante
  };
}
class ListBackward<T> extends List<T> {
  //...
  public void traverse() { // recorrer hacia atras
  };
}
```

- ¿Hay que especializar de nuevo para cada tipo de operación que hace
  `traverse()` con cada elemento individual (imprimir, sumar, etc.)?
- ¿Y si hay que especializar de nuevo el recorrido — solo los pares, solo los
  impares, etc.?

**Problemas de v0.3**: acoplamiento elevado (si hay que crear nuevos tipos de
recorrido, se abusará de la herencia para crear estructuras complejas);
variabilidad mal tratada → poca flexibilidad, baja reutilización.

¿Cómo se resuelve esto en las bibliotecas típicas que ya conocéis (C++ STL,
Java Collections, etc.)? Con **iteradores**.

### Implementación alternativa: Lista v0.4 — delegar hacia otra clase

<Tabs groupId="oop-lista-v04">
<TabItem value="list" label="List<T>">

```java static
public interface List<T> {
  void addFirst(T value);
  void removeFirst();
  void addLast(T value);
  void removeLast();
  T first();
  T last();
  boolean isEmpty();
  int length();
  List<T> clone();
  boolean isEqualTo(List<T>);
  Iterator<T> iterator();
}
```

</TabItem>
<TabItem value="iterator" label="Iterator<E>">

```java static
public interface Iterator<E> {
  boolean hasNext();
  E next();
  void remove();
}
```

</TabItem>
</Tabs>

Las ventajas de esta versión son claras:

- Mayor **cohesión**: las responsabilidades están ahora separadas — `List`
  almacena, `Iterator` recorre.
- Para hacer `List` más cohesionada hemos tenido que introducir una
  **dependencia** (acoplamiento) hacia `Iterator`.
- Se ha usado **delegación** (o composición) en lugar de herencia: la
  responsabilidad de recorrer se ha delegado hacia otro sitio.

### Resumen de problemas

| Problema | desde v0.1 ... | ... hasta v0.4 |
|:----------|:------|:------|
| **Cohesión** | Baja: `List<T>` aglutina almacenamiento y recorrido | Alta: `List<T>` solo almacena; `Iterator<T>` recorre |
| **Variabilidad** | No tratada: difícil cambiar la forma de recorrer | Fácil crear nuevos `Iterator` sin tocar `List` |
| **Flexibilidad** | Poca: cambios en recorrido afectan a `List` | Mayor: cambios aislados en `Iterator` |
| **Acoplamiento** | Alto: `List` depende de cómo se recorre | Bajo: separación clara de responsabilidades |

## Ocultar la implementación

Los principios aplicados en la evolución anterior han sido, en definitiva, los
cuatro principios básicos: **abstracción** (diferenciar el qué del cómo),
maximizar la **cohesión**, minimizar el **acoplamiento** y usar la
**modularidad** (clases, interfaces, componentes).

> Cuando los componentes están aislados, puedes cambiar uno sin preocuparte
> por el resto. Mientras no cambies las interfaces externas, no habrá
> problemas en el resto del sistema.
>
> — E. Yourdon & L. Constantine, *Structured Design*.

La **modularidad** consiste en reducir el acoplamiento usando módulos o
componentes con distintas responsabilidades, agrupados en bibliotecas.

### Técnicas de ocultación

- **Encapsular**: agrupar en módulos y clases.
- **Visibilidad**: `public`, `private`, `protected`, etc.
- **Delegación**: incrementar la cohesión extrayendo funcionalidad pensada
  para otros propósitos fuera de un módulo.
- **Herencia**: delegar *en vertical*.
- **Polimorfismo**: ocultar la implementación de un método, manteniendo la
  misma interfaz de la clase base.
- **Interfaces**: usar interfaces bien documentadas.

## Herencia

La herencia sirve, ante todo, para **reutilizar la interfaz**: la clase base
y la derivada son del mismo tipo, y todas las operaciones de la base están
también disponibles en la derivada.

También distingue entre **redefinir** y **reutilizar** el comportamiento:

- *Overriding* (redefinición o sobreescritura): cambio de comportamiento.
- *Overloading* (sobrecarga): cambio de interfaz.

Y entre dos formas de heredar:

- **Herencia pura**: mantiene la interfaz tal cual (relación *es-un*).
- **Extensión**: amplía la interfaz con nuevas funcionalidades (relación
  *es-como-un*). Puede causar problemas de *casting*, como veremos más
  adelante.

> When you inherit, you take an existing class and make a special version of
> it. In general, this means that you're taking a general-purpose class and
> specializing it for a particular need. [...] it would make no sense to
> compose a car using a vehicle object — a car doesn't contain a vehicle, it
> is a vehicle. The *is-a* relationship is expressed with inheritance, and
> the *has-a* relationship is expressed with composition.
>
> — Bruce Eckel

## Polimorfismo

El polimorfismo es el fenómeno por el que, al llamar a una operación de un
objeto del que no se sabe su tipo específico, se ejecuta el método adecuado
de acuerdo con su tipo real. Se basa en el **enlace dinámico** (*dynamic
binding*): el método a ejecutar se elige en tiempo de ejecución, en función del **tipo**  del objeto.

### Overriding

En general, en un lenguaje OO es posible sobreescribir o redefinir
(*override*) los métodos heredados de una superclase. En algunos lenguajes es
obligatorio (en otros, recomendado) especificar explícitamente cuándo un
método se redefine. Veámoslo en varios lenguajes.

#### Ejemplo 1: Override en Scala

```scala
class Complejo(real: Double, imaginaria: Double) {
  def re = real
  def im = imaginaria
  override def toString() =
    "" + re + (if (im < 0) "" else "+") + im + "i"
}

object Test {
  def main(args: Array[String]): Unit = {
    println(new Complejo(1.2, 3.4))
  }
}
```

Cuando se redefine un método *abstracto*, `override` no es necesario en
Scala. Pero si se quiere redefinir un método concreto (como `toString`, que ya
tiene implementación en `AnyRef`), `override` es obligatorio, precisamente
para evitar sobreescrituras accidentales. En Scala el riesgo de redefinición
accidental es mayor por el uso de mixins (`trait`).

Un **trait** separa las dos responsabilidades principales de una clase:
definir el **estado** de sus instancias y definir su **comportamiento**. Las
clases y objetos de Scala pueden extender un `trait` (similares a las
`interface` de Java); no pueden instanciarse por sí solos, no tienen estado
propio (usan el de la instancia a la que se aplican), y los métodos definidos
en una clase tienen precedencia sobre los de un `trait`.

#### Ejemplo 2: un iterador con Scala traits

```scala
trait Iterador[A] {
  def haySiguiente: Boolean
  def siguiente(): A
}

class IteradorEnteros(hasta: Int) extends Iterador[Int] {
  private var actual = 0
  override def haySiguiente: Boolean = actual < hasta
  override def siguiente(): Int = {
    if (haySiguiente) {
      val t = actual
      actual += 1
      t
    } else 0
  }
}

object Test {
  def main(args: Array[String]): Unit = {
    val iterador = new IteradorEnteros(10)
    println(iterador.siguiente()) // 0
    println(iterador.siguiente()) // 1
  }
}
```

¿Y en Java no hay *traits*? Desde Java 8, las interfaces pueden incorporar
[métodos por defecto](https://www.baeldung.com/java-static-default-methods)
que las acercan al comportamiento de un trait, y sirven para implementar
herencia múltiple.

#### Ejemplo 3: `@Override` en Java

El siguiente ejemplo es, en realidad, la implementación de un **diseño
incorrecto**: hay una doble dependencia entre `Real` y `Complejo`, y la
frontera entre diseño e implementación queda aquí un poco difusa. Aun así es
muy útil para entender qué aporta `@Override`:

```java
class Real {
  double re;
  public Real(double real) {
    re = real;
  }
  public double getRe() { return re; }
  // Prueba a comentar el siguiente método manteniendo el
  // @Override de Complejo.sum(Real other)
  public Real sum(Real other) {
    return new Real(re + other.getRe());
  }
  // Prueba a comentar el siguiente método manteniendo el
  // @Override de Complejo.sum(Complejo other)
  public Complejo sum(Complejo other) {
    return new Complejo(re + other.getRe(), other.getIm());
  }
  public String toString() {
    return String.format("%.1f", re);
  }
}

class Complejo extends Real {
  double im;
  public Complejo(double real, double imaginaria) {
    super(real);
    im = imaginaria;
  }
  @Override
  public Complejo sum(Real other) {
    return new Complejo(re + other.getRe(), im);
  }
  @Override
  public Complejo sum(Complejo other) {
    return new Complejo(re + other.getRe(), im + other.getIm());
  }
  public Double getIm() { return im; }
  public String toString() {
    return String.format("%.1f", re) + ((im < 0) ? "" : "+") +
        String.format("%.1f", im) + "i";
  }
}

public class Main {
  public static void main(String args[]) {
    Real r = new Real(7.6);
    Complejo c = new Complejo(1.2, 3.4);
    System.out.println("Número real: " + r);
    System.out.println("Número complejo: " + c);
    System.out.println("Número complejo: " + c.sum(r));
    System.out.println("Número complejo: " + r.sum(c));
  }
}
```

Prueba a comentar alguno de los métodos `sum` de `Real` (indicado en el
propio código) manteniendo el `@Override` correspondiente en `Complejo`: verás
un error de compilación, porque sin ese método en la clase base ya no hay
nada que redefinir. Y si quitas `@Override` de un método que en realidad no
redefine nada (por ejemplo, porque cambiaste su firma sin querer), Java
compilará igualmente — pero habrás hecho un *overload* accidental en lugar de
un *override*. Esa es la razón de ser de la anotación: convierte un error
silencioso de diseño en un error de compilación.

#### Ejemplo 4: Override en C#

`DescribeCar` muestra una descripción básica de un coche y llama a
`ShowDetails` para información adicional; cada clase define su propia versión
de `ShowDetails`, usando los modificadores `new` y `override`:

```csharp
class Car
{
  public void DescribeCar()
  {
    System.Console.WriteLine("Four wheels and an engine.");
    ShowDetails();
  }

  public virtual void ShowDetails()
  {
    System.Console.WriteLine("Standard transportation.");
  }
}

class ConvertibleCar : Car
{
  public new void ShowDetails()
  {
    System.Console.WriteLine("A roof that opens up.");
  }
}

class Minivan : Car
{
  public override void ShowDetails()
  {
    System.Console.WriteLine("Carries seven people.");
  }
}

class Program
{
  static void TestCars1()
  {
    System.Console.WriteLine("\nTestCars1\n----------");

    var cars = new System.Collections.Generic.List<Car> {
      new Car(),
      new ConvertibleCar(),
      new Minivan() };

    foreach (var car in cars)
    {
      car.DescribeCar();
      System.Console.WriteLine("----------");
    }
  }

  static void TestCars2()
  {
    System.Console.WriteLine("\nTestCars2\n----------");
    ConvertibleCar car2 = new ConvertibleCar();
    Minivan car3 = new Minivan();
    car2.ShowDetails();
    car3.ShowDetails();
  }

  static void TestCars3()
  {
    System.Console.WriteLine("\nTestCars3\n----------");
    Car car2 = new ConvertibleCar();
    Car car3 = new Minivan();
    car2.ShowDetails();
    car3.ShowDetails();
  }

  static void Main()
  {
    TestCars1();
    TestCars2();
    TestCars3();
  }
}
```

`TestCars1` produce esta salida:

```txt
TestCars1
----------
Four wheels and an engine.
Standard transportation.
----------
Four wheels and an engine.
Standard transportation.
----------
Four wheels and an engine.
Carries seven people.
----------
```

¿Son los resultados esperados? El tipo del segundo objeto de la lista es
`ConvertibleCar`, pero `DescribeCar` **no** accede a la versión de
`ShowDetails` definida en `ConvertibleCar`, precisamente por usar `new`. El
tipo del tercer objeto es `Minivan`, que sí redefine con `override` el método
declarado en la clase base — y por eso su salida cambia.

`TestCars2` y `TestCars3` lo confirman:

```txt
TestCars2
----------
A roof that opens up.
Carries seven people.

TestCars3
----------
Standard transportation.
Carries seven people.
```

En `TestCars2` el tipo de los objetos creados coincide con el tipo declarado.
En `TestCars3`, el tipo declarado es la clase base `Car`. La diferencia entre
[`new` y `override` en
C#](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/knowing-when-to-use-override-and-new-keywords)
es que `new` **oculta** la implementación de la clase base, mientras que
`override` la **extiende** de verdad (enlace dinámico).

## Tipado

- **Tipado estático vs. dinámico**: en el tipado estático, el tipo de cada
  variable se conoce en tiempo de compilación; en el dinámico (*duck
  typing*), se conoce en tiempo de ejecución.
- **Contrato nominal vs. estructural**: en el nominal hay que escribir un tipo
  explícito; en el estructural, el tipo se deduce de la estructura de
  métodos que tiene el objeto.

### Moldes o *casting* de tipos

- ***Upcasting***: interpretar un objeto de una clase derivada como del mismo
  tipo que la clase base.
- ***Downcasting***: interpretar un objeto de una clase base como del mismo
  tipo que una de sus clases derivadas.

### Ejemplo de casting: Aventura v0.1

```java
class PersonajeDeAccion {
  public void luchar() { System.out.println("Luchando..."); }
}

class Heroe extends PersonajeDeAccion {
  public void volar() { System.out.println("Volando..."); }
}

class Creador {
  PersonajeDeAccion[] personajes() {
    PersonajeDeAccion[] x = {
        new PersonajeDeAccion(),
        new PersonajeDeAccion(),
        new Heroe(), // Upcast implícito: se guarda como PersonajeDeAccion
        new PersonajeDeAccion()
    };
    return x;
  }
}

public class Main {
  public static void main(String[] args) {
    PersonajeDeAccion[] cuatroFantasticos = new Creador().personajes();
    cuatroFantasticos[1].luchar();
    cuatroFantasticos[2].luchar(); // Ya es un PersonajeDeAccion (upcast al crearlo)

    // En tiempo de compilación no existe el método volar() en PersonajeDeAccion:
    // cuatroFantasticos[2].volar();
    ((Heroe) cuatroFantasticos[2]).volar(); // Downcast correcto
    try {
      ((Heroe) cuatroFantasticos[1]).volar(); // Downcast incorrecto
    } catch (ClassCastException e) {
      System.out.println("ClassCastException al hacer downcast de " + cuatroFantasticos[1]);
    }
  }
}
```

¿De qué tipo son realmente los personajes del array? Solo se sabe en tiempo de
ejecución, y cualquier `downcasting` a `Heroe` puede fallar con
`ClassCastException` si el objeto real no lo es. Es un diseño inseguro que
conviene rediseñar.

### Aventura v0.2 (Java) frente a v0.3 (C++): el mismo problema, dos formas de tipado

Java resuelve el problema anterior separando responsabilidades en interfaces
(`SabeLuchar`, `SabeNadar`, `SabeVolar`) que `Heroe` declara explícitamente
implementar — **tipado nominal**. C++20 puede expresar exactamente la misma
idea con *concepts*, sin que `Heroe` tenga que declarar nada explícito — basta
con que tenga los métodos requeridos: **tipado estructural**.

<Tabs groupId="oop-aventura-tipado">
<TabItem value="java" label="Java (tipado nominal)">

```java
interface SabeLuchar {
  void luchar();
}
interface SabeNadar {
  void nadar();
}
interface SabeVolar {
  void volar();
}
class PersonajeDeAccion {
  public void luchar() { System.out.println("Luchando (PersonajeDeAccion)"); }
}
class Heroe extends PersonajeDeAccion
    implements SabeLuchar, SabeNadar, SabeVolar {
  public void nadar() { System.out.println("Nadando"); }
  public void volar() { System.out.println("Volando"); }
}

public class Main {
  static void t(SabeLuchar x) { x.luchar(); }
  static void u(SabeNadar x) { x.nadar(); }
  static void v(SabeVolar x) { x.volar(); }
  static void w(PersonajeDeAccion x) { x.luchar(); }

  public static void main(String[] args) {
    Heroe i = new Heroe();
    t(i); // Tratado como SabeLuchar
    u(i); // Tratado como SabeNadar
    v(i); // Tratado como SabeVolar
    w(i); // Tratado como PersonajeDeAccion
  }
}
```

</TabItem>
<TabItem value="cpp" label="C++ (tipado estructural)">

```cpp
#include <iostream>

template <typename T>
concept SabeLuchar = requires(T t) { t.luchar(); };

template <typename T>
concept SabeNadar = requires(T t) { t.nadar(); };

template <typename T>
concept SabeVolar = requires(T t) { t.volar(); };

// Clase base normal, sin "interfaces" que implementar
struct PersonajeDeAccion {
    void luchar() { std::cout << "Pum! (Luchando)\n"; }
};

struct Heroe : public PersonajeDeAccion {
    void nadar() { std::cout << "Splash! (Nadando)\n"; }
    void volar() { std::cout << "Whoosh! (Volando)\n"; }
};

// Usamos 'auto&' para pasar por referencia (evitar copias)
void t(SabeLuchar auto& x) { x.luchar(); }
void u(SabeNadar auto& x) { x.nadar(); }
void v(SabeVolar auto& x) { x.volar(); }
void w(PersonajeDeAccion& x) { x.luchar(); }

int main() {
    Heroe i;

    t(i); // Heroe hereda luchar(), cumple SabeLuchar
    u(i); // Heroe tiene nadar(), cumple SabeNadar
    v(i); // Heroe tiene volar(), cumple SabeVolar
    w(i); // Heroe es hijo de PersonajeDeAccion

    return 0;
}
```

</TabItem>
</Tabs>

En la versión Java, `t`, `u`, `v` y `w` aceptan solo los tipos que declaran
explícitamente implementar la interfaz correspondiente (o heredar de la
clase). En la versión C++, `t`, `u`, `v` usan *concepts* (tipado estructural):
aceptan cualquier tipo que satisfaga la forma requerida, se resuelva en
tiempo de compilación y sin necesidad de *casting* — mientras que `w` sigue
usando herencia clásica con tipado nominal, igual que en Java.

## Uso de la herencia

Conviene distinguir dos ejes distintos:

- **Herencia de interfaz** vs. **herencia de comportamiento** (o
  implementación): en Java, `implements` es herencia de interfaz y `extends`
  es herencia de interfaz *más* implementación. ¿Hay herencia solo de
  comportamiento? Pista: pensar en la herencia privada de C++.
- **Herencia como tipo** vs. **herencia como estructura**: en la herencia de
  tipos, cada subclase es un subtipo, y debe cumplirse el **principio de
  sustitución de Liskov** (LSP): toda operación que funciona para un objeto
  de la clase $C$ también debe funcionar para un objeto de una subclase de
  $C$. Usar la herencia solo para *estructurar* programas (sin que haya una
  auténtica relación *es-un*) es **erróneo**, porque no se satisface LSP —
  como veremos a continuación.

¿El polimorfismo está ligado siempre a la herencia? No: también existe el
**polimorfismo paramétrico**, mediante tipos genéricos (Ada, C++ *generics*,
Java *generics* desde JDK 1.5, Scala...). Eso sí, con diferencias entre
lenguajes: en C++ los genéricos permiten meta-programación en tiempo de
compilación, mientras que en Java los generics son sobre todo *wrappers*
que moldean objetos (*syntactic sugar*, por *type erasure*).

## Usos incorrectos de la herencia

### Mal ejemplo 1 (Java): herencia como estructura

```java
class Account {
  float balance;
  float getBalance() { return balance; }
  void transferIn(float amount) { balance += amount; }
}

class VerboseAccount extends Account {
  void verboseTransferIn(float amount) {
    super.transferIn(amount);
    System.out.println("Balance: " + balance);
  }
}

class AccountWithFee extends VerboseAccount {
  float fee = 1;
  void transferIn(float amount) { super.verboseTransferIn(amount - fee); }
}

public class Main {
  static void f(Account a) {
    float before = a.getBalance();
    a.transferIn(10);
    float after = a.getBalance();
    System.out.println("before=" + before + " after=" + after);
  }

  public static void main(String[] args) {
    System.out.println("Con Account:");
    f(new Account());
    System.out.println("Con AccountWithFee:");
    f(new AccountWithFee());
  }
}
```

Todos los objetos `a` de la clase `Account` deben cumplir que, si `b =
a.getBalance()` antes de ejecutar `a.transferIn(s)` y `b' = a.getBalance()`
después, entonces `b + s = b'`. Sin embargo, con la estructura
`AccountWithFee` < `VerboseAccount` < `Account`, un objeto `AccountWithFee` no
se comporta así cuando se trata como un `Account`: al ejecutar el ejemplo
verás que para `Account`, `before + 10 = after`, pero para `AccountWithFee`,
`before + 10 ≠ after` (en su lugar, `before + 10 - fee = after`). La cadena de
herencia se usó para *reutilizar código*, no para expresar una relación
*es-un* — y el resultado viola las expectativas de quien solo conoce la
interfaz de `Account`.

### Mal ejemplo 2 (Scala): herencia de implementación

```scala
abstract class Writer {
  def print(str: String): Unit
}

class ConsoleWriter extends Writer {
  override def print(str: String) = println(str)
}

class UppercaseWriter extends ConsoleWriter {
  override def print(str: String) =
    super.print(str.toUpperCase())
}

object Test {
  def main(args: Array[String]): Unit = {
    val writer = new UppercaseWriter
    writer.print("abc")
  }
}
```

Ahora queremos añadir un nuevo comportamiento — imprimir con espacios entre
letras:

```scala
class WithSpacesWriter extends ConsoleWriter {
  override def print(str: String) =
    super.print(str.split("").mkString(" "))
}
```

¿Y si queremos **combinar** ambas formas de imprimir (mayúsculas y con
espacios)? Con herencia de implementación no queda más remedio que crear una
subclase por cada combinación:

```scala
class UppercaseWithSpacesWriter extends UppercaseWriter {
  override def print(str: String) =
    super.print(str.split("").mkString(" "))
}

class WithSpacesUppercaseWriter extends WithSpacesWriter {
  override def print(str: String) =
    super.print(str.toUpperCase())
}
```

Nótese que, para `"abc"`, ambas clases producen el mismo resultado
(`"A B C"`): poner en mayúsculas y separar caracteres con espacios son
operaciones que conmutan en este caso concreto. El problema que ilustran
estas dos clases no es que el orden cambie el resultado, sino que hace falta
una subclase distinta por cada combinación — y ese número crece
combinatoriamente en cuanto aparece una forma de imprimir más.

Y si aparece una **nueva** forma de imprimir (por ejemplo, con un *checksum*
delante), hay que repetir la combinatoria para cada forma ya existente:

```scala
class ChecksumWriter extends ConsoleWriter {
  override def print(str: String) = {
    super.print(java.security.MessageDigest.getInstance("MD5")
      .digest(str.getBytes("UTF-8"))
      .map("%02x".format(_))
      .mkString("[", "", "] ") + str)
  }
}
```

El resultado de seguir combinando así es una jerarquía de herencia que crece
combinatoriamente y se vuelve inmanejable. El diagrama extrapola cómo
quedaría la jerarquía si se siguiera combinando `Uppercase`, `WithSpaces` y
`Checksum` entre sí — no se ha mostrado en código cada una de esas
combinaciones, solo las piezas sueltas (`UppercaseWriter`, `WithSpacesWriter`,
`ChecksumWriter`) y dos combinaciones a modo de ejemplo:

![Jerarquía de herencia fuera de control entre las variantes de Writer](/img/implementacion/oop/writer-hierarchy.svg)

**¡Mal uso de la herencia!** Cuantas más formas de imprimir se necesiten
combinar, más subclases hacen falta — el problema es *combinatorio*, y es un
síntoma claro de que la herencia se está usando para *reutilizar
implementación* en lugar de para modelar una relación *es-un*.

### Arreglo (Scala): herencia de interfaz con traits

La solución en Scala es usar *traits* apilables (*stackable traits*) en lugar
de una cadena de subclases:

```scala
abstract class Writer {
  def print(str: String): Unit
}

class ConsoleWriter extends Writer {
  override def print(str: String) = println(str)
}

trait Uppercase extends Writer {
  abstract override def print(str: String) =
    super.print(str.toUpperCase())
}

trait WithSpaces extends Writer {
  abstract override def print(str: String) =
    super.print(str.split("").mkString(" "))
}

object Test {
  def main(args: Array[String]): Unit = {
    val writer1 = new ConsoleWriter with Uppercase
    writer1.print("abc")
    val writer2 = new ConsoleWriter with Uppercase with WithSpaces
    writer2.print("abc")
  }
}
```

Esto genera la salida:

```txt
ABC
A B C
```

Con *stackable traits*, cada combinación se construye **componiendo** traits
en el momento de crear el objeto (`with Uppercase with WithSpaces`), en lugar
de declarar una subclase nueva por cada combinación. Un trait puede llamar a
`super.metodo()` con un `override` normal si ese método ya es concreto en la
cadena de supertipos *declarada* por el trait. Aquí no lo es: `Uppercase` y
`WithSpaces` extienden `Writer`, que declara `print` como abstracto — así que
hace falta `abstract override`, precisamente para poder compilar una llamada
a `super.print` confiando en que, en tiempo de ejecución, la [*linearization*
de clases](https://www.scala-lang.org/files/archive/spec/2.13/05-classes-and-objects.html#class-linearization)
(el orden en que Scala resuelve `super` cuando se mezclan varios traits)
habrá colocado antes una implementación concreta (la de `ConsoleWriter`,
mezclada al construir el objeto). `abstract` no sería necesario si el trait
extendiera directamente una clase con `print` ya concreto. En términos de
diseño, este patrón es una implementación del patrón *Decorator*, pero por
composición de **clases** en vez de composición de **objetos**.

## Implementación y diseño: rectángulos y cuadrados

Geométricamente, un cuadrado *es-un* rectángulo, así que la primera tentación
es usar herencia pura:

```csharp static
public class Rectangle
{
  private Point topLeft;
  private double width;
  private double height;

  public double Width
  {
    get { return width; }
    set { width = value; }
  }

  public double Height
  {
    get { return height; }
    set { height = value; }
  }
}

public class Square : Rectangle
{
  // ...
}
```

Pero en informática un objeto `Square` **no es-un** objeto `Rectangle`: un
`Square` no tiene propiedades independientes `width` y `height`. Si asumimos
que no importa el desperdicio de memoria, `Square` heredará los accesores de
`Rectangle` — así que probamos lo siguiente.

### Rectángulos v0.2: ocultar con `new`

```csharp static
public class Square : Rectangle
{
  public new double Width
  {
    set {
      base.Width = value;
      base.Height = value;
    }
  }
  public new double Height
  {
    set {
      base.Height = value;
      base.Width = value;
    }
  }
}
```

El comportamiento de un `Square` no es consistente con el de un `Rectangle`:

```csharp
Square s = new Square();
s.Width = 1;   // fija ambos, width y height
s.Height = 2;  // fija ambos, width y height

void f(Rectangle r)
{
  r.Width = 32; // llama a Rectangle.Width, no a Square.Width
}
```

¿Qué sucede si pasamos un `Square` a `f`? ¡No cambia `Height`! El modificador
`new` de C# oculta el miembro de la clase base con una nueva implementación,
pero solo se usa la versión de `Square` cuando el tipo *declarado* de la
variable ya es `Square` — si el tipo declarado es `Rectangle` (como en el
parámetro `r` de `f`), se llama siempre a la versión de `Rectangle`, sin
enlace dinámico. Podría argumentarse que el error fue no declarar `Width` y
`Height` como `virtual` en `Rectangle`.

### Rectángulos v0.3: `virtual`/`override` en vez de `new`

<Tabs groupId="oop-rectangulo-v03">
<TabItem value="rectangle" label="Rectangle">

```csharp static
public class Rectangle
{
  private Point topLeft;
  private double width;
  private double height;
  public virtual double Width
  {
    get { return width; }
    set { width = value; }
  }
  public virtual double Height
  {
    get { return height; }
    set { height = value; }
  }
}
```

</TabItem>
<TabItem value="square" label="Square">

```csharp static
public class Square : Rectangle
{
  public override double Width
  {
    set {
      base.Width = value;
      base.Height = value;
    }
  }
  public override double Height
  {
    set {
      base.Height = value;
      base.Width = value;
    }
  }
}
```

</TabItem>
</Tabs>

La [diferencia entre `new` y `override` en
C#](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/knowing-when-to-use-override-and-new-keywords)
es que `new` oculta la implementación de la clase base, y `override` la
extiende de verdad mediante enlace dinámico. Sin embargo, que crear una clase
derivada obligue a cambiar la clase base (aquí, añadir `virtual` a
`Rectangle`) ya es un síntoma de **mal diseño**: el principio LSP pone de
manifiesto que la relación *es-un* tiene que ver con el comportamiento
público extrínseco del que dependen los clientes.

Ahora parece que `Square` y `Rectangle` funcionan y quedan bien definidos
matemáticamente. Pero consideremos esto:

```csharp
void g(Rectangle r)
{
  r.Width = 5;    // el autor de g cree que r es un Rectangle
  r.Height = 4;   // y que Width y Height son independientes
  if (r.Area() != 20)
    throw new Exception("Bad area!");
}
```

¿Qué pasa si llamamos a `g(new Square(3))`? El autor de `g` asumió que cambiar
el ancho de un rectángulo deja intacto el alto — un invariante razonable
*para un `Rectangle`*. Si pasamos un `Square`, ese invariante no se cumple:
**violación de LSP**. Al pasar una instancia de una clase derivada (`Square`)
se altera el comportamiento definido por la clase base (`Rectangle`), de
forma que `g` deja de funcionar correctamente.

### ¿Quién tiene la culpa? ¿Diseño o implementación?

- ¿El autor de `g`, por asumir que "en un rectángulo, ancho y alto son
  independientes" (un invariante razonable)?
- ¿El autor de `Square`, por violar ese invariante?
- ¿De qué clase se ha violado realmente el invariante? — De `Rectangle`, no
  de `Square`.

Para evaluar si un diseño es apropiado no basta con mirar la solución por sí
sola: hay que juzgarla en términos de los *supuestos razonables* que hagan los
usuarios de ese diseño. La lección de este tema, en el fondo, es esa: la
frontera entre diseño e implementación es difusa, pero los principios de
abstracción, cohesión, acoplamiento y modularidad — y el respeto a LSP cuando
se usa herencia — son la vara de medir en ambos lados de esa frontera.
