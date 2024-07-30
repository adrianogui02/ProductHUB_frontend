# Dockerfile

# Use uma imagem base node
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e o yarn.lock para instalar as dependências
COPY package.json yarn.lock ./

# Instala as dependências do projeto
RUN yarn install

# Copia todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Expoe a porta onde a aplicação irá rodar
EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["yarn", "run", "dev", "--host"]
