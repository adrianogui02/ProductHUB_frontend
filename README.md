# ProductHUB Frontend

Bem-vindo ao ProductHUB Frontend. Este projeto é a interface do usuário para gerenciar informações de produtos, conectando-se à ProductHUB API. A aplicação foi desenvolvida utilizando Vite e outras tecnologias de frontend modernas.

## Stack utilizada

**Front-end:** Vue 3, TypeScript

## Funcionalidades

- Interface amigável para operações CRUD (Criar, Ler, Atualizar e Deletar) sobre produtos e categorias.
- Integração com a ProductHUB API para autenticação e autorização de usuários.
- Formulários e validações para entrada de dados do usuário.
- Tema dark com background dinâmico para uma melhor experiência do usuário.
- Navegação entre diferentes seções da aplicação.
- Responsividade para dispositivos móveis.

## Instalação

Para configurar e rodar o **ProductHUB Frontend**, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/getting-started)

### Passo a Passo

1. **Clone o repositório**

   Clone o repositório do frontend para seu ambiente local:

   ```bash
   git clone https://github.com/adrianogui02/ProductHUB_frontend.git
   ```

1. **Navegue até o diretório do projeto**

   Entre no diretório do projeto clonado:

   ```bash
   cd ProductHUB_frontend
   cd frontend
   ```

1. **Usando Docker**

   Se preferir usar Docker, você pode seguir os passos abaixo para configurar e rodar o frontend usando Docker e Docker Compose:

   - Construa e Inicie os containers:

     ```bash
     docker-compose up -d --build
     ```

     Isso irá iniciar o serviço do frontend na porta 5173

   - Verifique os logs dos containers:

     ```bash
     docker-compose logs -f
     ```

     Verifique se não há erros na inicialização e que o frontend esta funcionando corretamente.


## Autores

[@adrianogui02](https://github.com/adrianogui02)

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
