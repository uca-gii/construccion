# Solucion del Ejercicio 2

Pipeline de referencia para generar un PDF con Marp a partir de un repositorio con diapositivas.

Contenido:

- `Jenkinsfile` declarativo
- `Dockerfile` para el agente con Node y Chromium

El job debe configurarse como **Pipeline script from SCM**, de modo que el checkout del repositorio lo realiza Jenkins antes de ejecutar el pipeline.

Fue necesario añadir .git al final de la URL del repositorio para que Jenkins lo detectara correctamente.

El pipeline:

1. instala `@marp-team/marp-cli`
2. genera un PDF en `pdf/slides.pdf`
3. archiva el PDF como artefacto
4. indica que el job se ejecute cada 5 minutos para detectar cambios en el repositorio (para probar cada 1 minuto usar `* * * * *`)

Por defecto usa `slides.md` como entrada. Si el fichero tiene otro nombre, puede pasarse mediante el parametro `SLIDES_FILE`.
