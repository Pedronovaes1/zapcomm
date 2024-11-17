# Zapcomm - Squad 16

Respositório do projeto do Squad 16 feito para a empresa [Baasic](https://baasic.com.br), na aula de Residência de Software I.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Para instalar e rodar o software é necessário:

```
Node v14 para cima
Docker 
Docker Compose 
```
Dowload do Docker Desktop:
```
https://www.docker.com/products/docker-desktop/ 
```
Dowload do Node:
```
https://nodejs.org/pt/download/package-manager
```
### 🔧 Instalação

Uma série de exemplos passo-a-passo que informam o que você deve executar para ter um ambiente de desenvolvimento em execução.

Entrar na pasta de Backend:

```
cd backend
```

Instalar as depedências da pasta e transcrever o typescritp para JavaScript no **backend**:

```
npm install
npm run build
```

Voltar para o diretório e entrar na pasta **frontend**:

```
cd ..
cd frontend
```
Instalar as depedências da pasta **frontend**:

```
npm install
```
Após finalizar as instalações, construa as imagens do docker e rode o projeto usando o comando:

```
cd ..
docker-compose up --build
```

Após esses comando, a imagem do postgres já terá seus volumes formados e não precisa mais de migrações, remova as linhas 52 e 53 do arquivo docker-compose.yml, e deixe assim:


```
command: >
    sh -c "
    npm run dev:server
    "
```

Agora seu container está formado e para rodar basta usar o comando:

```
docker-compose up 
```

## 📄 Diretos 

Todos os direitos reservados a https://baasic.com.br
