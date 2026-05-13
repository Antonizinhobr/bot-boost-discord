# 🩸 Arauto da Entidade - Bot de Boosts

![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue?logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js&logoColor=white)

O **Arauto da Entidade** é um bot para Discord focado em gerenciar e agradecer os **Server Boosters** da sua comunidade. Com uma temática imersiva (Névoa/Entidade), ele automatiza anúncios de agradecimento e a entrega de cargos exclusivos para quem impulsiona o servidor.

Sua arquitetura é construída para funcionar em **múltiplos servidores simultaneamente**, salvando as configurações de cada um localmente através de um banco de dados em JSON.

---

## ✨ Funcionalidades

* **🎉 Anúncios Automáticos:** Detecta instantaneamente quando um membro impulsiona o servidor e envia uma mensagem temática e personalizada no canal configurado.
* **🦇 Entrega de Cargo Automática:** Atribui o cargo de Booster escolhido (ou cria um novo) para o membro que impulsionou.
* **💾 Multi-Servidor:** Utiliza um arquivo `boost_config.json` para separar e guardar o canal e o cargo de cada servidor de forma independente.
* **🧪 Modo de Teste:** Permite que os administradores testem a mensagem de anúncio sem precisar gastar um Boost real.

---

## 📂 Estrutura de Arquivos

Esta é a estrutura padrão do projeto:

```text
bot-boost/
 ├── node_modules/       # Dependências do Node.js (gerado automaticamente)
 ├── .env                # Suas variáveis de ambiente e Token (🔒 NUNCA compartilhe)
 ├── .gitignore          # Arquivos ignorados pelo Git (.env, node_modules)
 ├── boost_config.json   # Banco de dados local (gerado automaticamente ao configurar)
 ├── discloud.config     # Arquivo de configuração para hospedagem na Discloud
 ├── index.js            # O código principal do bot
 ├── package-lock.json   # Trava das versões das dependências
 ├── package.json        # Informações e pacotes do projeto
 └── README.md           # Este arquivo de documentação
```

---

## 💻 Comandos (Slash Commands)

Todos os comandos são restritos apenas para usuários com a permissão de **Administrador**.

* **`/setup_booster`**
  * **O que faz:** Configura o bot no servidor atual.
  * **Parâmetros:**
    * `canal` (Obrigatório): O canal de texto onde o anúncio do Boost será enviado.
    * `cargo` (Opcional): O cargo que o Booster receberá. Se você deixar em branco, o bot **criará automaticamente** um cargo chamado "Server Booster".

* **`/testar_booster`**
  * **O que faz:** Simula um boost no servidor. O bot enviará a mensagem de anúncio mencionando você no canal configurado, ideal para ver como a mensagem e o GIF ficam na prática.

---

## 🛠️ Guia de Instalação (Local)

### 1. Pré-requisitos
* Ter o [Node.js](https://nodejs.org/) instalado na sua máquina.
* Ter criado uma aplicação no [Discord Developer Portal](https://discord.com/developers/applications) e ter o **Token do Bot**.
* No Developer Portal, ative as **Privileged Gateway Intents** (`Presence`, `Server Members`, e `Message Content`).

### 2. Configurando o Projeto
Clone o repositório ou baixe os arquivos e abra o terminal na pasta do projeto:

```bash
# Instale as dependências necessárias
npm install discord.js dotenv
```

### 3. Variáveis de Ambiente (.env)
Crie um arquivo chamado `.env` na raiz do projeto e adicione o Token do seu bot:

```env
TOKEN=SEU_TOKEN_DO_DISCORD_AQUI
```

### 4. Iniciando o Bot
No terminal, digite o comando abaixo para acordar a Entidade:

```bash
node index.js
```
Se tudo der certo, o console mostrará: `🩸 O Arauto da Entidade despertou como NomeDoSeuBot!` e `✅ Comandos slash registrados com sucesso!`.

---

## ☁️ Como Hospedar na Discloud (24/7)

Para manter o bot online sem depender do seu computador, você pode hospedá-lo na [Discloud](https://discloudbot.com/).

### 1. Prepare o arquivo `discloud.config`
Certifique-se de que o arquivo na raiz do seu projeto esteja configurado mais ou menos assim:

```ini
NAME=BotBooster
TYPE=bot
MAIN=index.js
RAM=100
AUTORESTART=true
VERSION=latest
APT=tools
```

### 2. Compactando os Arquivos
Selecione os seguintes arquivos e coloque-os dentro de um arquivo **.zip**:
* `index.js`
* `package.json`
* `discloud.config`
* `.env`

⚠️ **IMPORTANTE:** NUNCA inclua a pasta `node_modules` no arquivo `.zip`. O servidor da Discloud instalará as dependências automaticamente.

### 3. Upload
1. Acesse o painel da Discloud.
2. Clique em **Adicionar App** (Add App).
3. Envie o seu arquivo `.zip` e inicie a aplicação. Pronto, o Arauto da Entidade viverá para sempre na nuvem!

---
*A Névoa agradece sua oferenda.* 🩸