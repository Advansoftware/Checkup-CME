# Checkup-CME

O **Checkup-CME** é uma plataforma avançada de diagnóstico e avaliação para Centrais de Material e Esterilização (CME). O sistema permite que instituições de saúde realizem uma autoavaliação detalhada sobre seus processos, gestão, tecnologia e conformidade, gerando relatórios automáticos com scores específicos e análises de risco financeiro.

## 🚀 Tecnologias

Este projeto foi construído com as tecnologias mais modernas do ecossistema React/Next.js:

- **Next.js 16 (LTS)** - Framework React com App Router e suporte a Turbopack.
- **TypeScript** - Tipagem estática para maior segurança e produtividade.
- **Tailwind CSS 4** - Estilização moderna e performática.
- **Shadcn UI** - Componentes de interface premium e acessíveis.
- **Prisma ORM** - Modelagem de dados e integração com banco de dados MySQL.
- **Bun** - Runtime e gerenciador de pacotes ultra veloz.
- **Framer Motion** - Animações e transições fluidas.
- **NextAuth.js** - Sistema completo de autenticação.
- **Z AI Web Dev SDK** - Integração com ferramentas avançadas de desenvolvimento.

## 🛠️ Funcionalidades Principais

1. **Simulação de Checkup**: Formulário interativo onde o usuário responde perguntas sobre a rotina da CME.
2. **Cálculo de Score Multidimensional**:
   - **Gestão**: Eficiência administrativa.
   - **Processos**: Conformidade com normas técnicas.
   - **Tecnologia**: Nível de automação e equipamentos.
   - **Financeiro**: Análise de perdas e riscos econômicos.
   - **LGPD**: Segurança de dados e privacidade.
3. **Dashboard Administrativo**:
   - Visualização de todos os checkups realizados.
   - Edição de scores e observações técnicas.
   - Liberação de resultados para os clientes.
4. **Relatórios Detalhados**: Visualização gráfica dos resultados com recomendações personalizadas.

## 📂 Estrutura do Projeto

- `src/app`: Rotas da aplicação (App Router).
  - `/admin`: Painel de controle para administradores.
  - `/simulacao`: Interface de autoavaliação.
  - `/resultado/[id]`: Visualização do relatório final.
- `src/components`: Componentes reutilizáveis e UI (Shadcn).
- `src/lib`: Lógica de negócio, esquemas de validação e configurações de banco de dados.
- `prisma/`: Esquema do banco de dados e migrações.

## ⚙️ Instalação e Desenvolvimento

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   ```

2. **Instale as dependências:**
   ```bash
   bun install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz com:
   ```env
   DATABASE_URL="mysql://usuario:senha@host:3306/banco"
   NEXTAUTH_SECRET="seu-segredo"
   ```

4. **Prepare o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   bun dev
   ```

## 🚢 Deployment (Coolify)

Este projeto está configurado para deploy via Nixpacks no Coolify. 

**Importante:** Devido aos requisitos do Next.js 16 e dependências do ESLint, certifique-se de configurar a variável de ambiente no painel do Coolify:
- `NIXPACKS_NODE_VERSION=24` (ou `>=22.13.0`)

## 📄 Licença

Este projeto é de uso privado da Advansoftware.
