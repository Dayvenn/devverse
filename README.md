# DevVerse

## Sobre o Projeto

O DevVerse é uma rede social voltada para desenvolvedores, permitindo a interação entre usuários através de publicações, comentários, mensagens e perfis personalizados. O objetivo do projeto é proporcionar um ambiente para compartilhamento de conhecimento, experiências e networking na área de tecnologia.

## Tecnologias Utilizadas

### Frontend
- React Native
- Expo
- TypeScript

### Backend
- Node.js
- Express
- Prisma ORM
- SQLite

## Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Dayvenn/devverse.git
```

### 2. Instale as dependências do Frontend

Na pasta principal do projeto:

```bash
npm install
```

---

## Backend

### 3. Entre na pasta do backend

```bash
cd devverse-backend
```

### 4. Instale as dependências

```bash
npm install
```

### 5. Configuração da API

Para que o frontend consiga se comunicar com o backend, é necessário alterar a URL da API no arquivo:

```txt
services/api.ts
```

Exemplo:

```ts
baseURL: "http://SEU_IP:3000";
```

### Como descobrir o IP da máquina

Abra o Prompt de Comando (CMD) e execute:

```bash
ipconfig
```

Procure pelo campo **Endereço IPv4** e copie o valor.

Depois, substitua no arquivo da API:

```ts
baseURL: "http://SEU_IP:3000";
```

> Observação: o dispositivo que estiver executando o aplicativo deve estar conectado na mesma rede que a máquina onde o backend está rodando.

### 6. Inicie o servidor dentro da devverse-backend

```bash
npm run dev
```

> O backend deve permanecer em execução enquanto o aplicativo estiver sendo utilizado.

---

## Frontend

### 7. Abra um novo terminal e inicie o Expo

```bash
npx expo start
```

---

## Funcionalidades

- Cadastro de usuários
- Login
- Edição de perfil
- Criação de posts
- Busca de usuários
- Visualização de perfis
- Sistema de comentários
- Sistema de curtidas
- Chat entre usuários
- Gerenciamento de informações profissionais

---

## Participação dos Integrantes

### Davidson Lucas
- Desenvolvimento Backend
- Estruturação do banco de dados com Prisma e SQLite
- Criação e integração das APIs
- Integração entre frontend e backend

### Brunna
- Desenvolvimento Frontend
- Desenvolvimento do protótipo
- Construção de telas e componentes
- Auxílio na implementação das funcionalidades da interface

### Maylon
- Desenvolvimento Frontend
- Implementação de funcionalidades e ajustes visuais
- Testes de interface
- Integração entre frontend e backend

### João
- Desenvolvimento Backend
- Implementação de funcionalidades
- Testes e validações do sistema
- Desenvolvimento do protótipo

### Matheus
- Desenvolvimento Backend
- Implementação de funcionalidades
- Testes e validações do sistema
- Criação e integração das APIs

### Participação Coletiva
- Planejamento do projeto
- Levantamento de requisitos
- Testes e validação das funcionalidades

## Repositório e Protótipo

### Repositório

https://github.com/Dayvenn/devverse

### Protótipo

https://www.figma.com/design/VuAw6WCrYuOaIxyIetoYxv/Prot%C3%B3tipo-Social-Media-Programa%C3%A7%C3%A3o-App?node-id=0-1&t=zmVIkjK5rEb7sEhJ-1

