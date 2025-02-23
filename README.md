# Superhero Angular App

Superhero Angular App es una aplicación en Angular 18 diseñada para gestionar información sobre superhéroes. Se ejecuta en un entorno Dockerizado para facilitar la configuración y despliegue.

## Características
- Aplicación frontend desarrollada con **Angular 18**.
- Contenedor **Docker** para ejecutar la app sin necesidad de configuraciones locales.
- **Live Reload** habilitado con volúmenes en Docker.
- Accesible en `localhost:4200` desde cualquier navegador.

---

## 📦 Instalación y Configuración

### 1️ **Requisitos previos**
Asegúrate de tener instalados:
- [Docker](https://www.docker.com/get-started) 
- [Docker Compose](https://docs.docker.com/compose/install/) 

### 2️ **Clonar el repositorio**
```sh
git clone https://github.com/tu-usuario/superhero-angular-app.git
cd superhero-angular-app
```
### 3 **Ejecución**
```sh
docker-compose up --build
```
### **Si quieres "apagar" el contenedor del frontend: **
```sh
docker-compose down
```