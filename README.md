# DevVerse
Como rodar o projeto

Primeiro, clone o repositório:

```
git clone https://github.com/Dayvenn/devverse.git
```

Depois, instale as dependências na pasta principal:

```bash
npm install
```

## Backend

Entre na pasta do backend:

```
cd devverse-backend
```

Instale as dependências:

```bash
npm install
```
Configuração da API

Para que o frontend consiga se comunicar com o backend, é necessário alterar a URL da API para o IP no arquivo:

```
app/services/api.ts
```

Exemplo:


 baseURL: "http://SEUIP:3000";


### Como descobrir o IP

Abra o Prompt de Comando (CMD) e execute:

```bash
ipconfig
```

Procure pelo campo Endereço IPv4 e copie.

Depois, substitua na variável da API:

```
 baseURL: "http://SEUIP:3000";
```

> Obs.: O dispositivo que estiver executando o aplicativo deve estar conectado na mesma rede que a máquina onde o backend está rodando.


Inicie o servidor dentro da pasta backend:

```
npm run dev
```

## Frontend

Volte para a pasta principal do projeto e execute:

```
npx expo start
```
