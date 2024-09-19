# Etapa de construção
FROM node:18-alpine 

# Instale o Git e outras dependências necessárias
RUN apk add --no-cache git

WORKDIR /app

# Copie os arquivos de configuração do npm
COPY package*.json ./

# Instale as dependências do projeto, incluindo as de desenvolvimento
RUN npm install

# Instale `ts-node-dev` globalmente para garantir que esteja disponível
RUN npm install -g ts-node-dev

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta 8080
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev:server"]
