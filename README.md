# CX Analytics - Rius Soluções e Tecnologia

Plataforma web desenvolvida para coleta e análise de indicadores de experiência do cliente, com foco em CSAT, CES e NPS.

O objetivo do projeto é permitir que clientes avaliem de forma rápida e anônima a experiência com o atendimento, a facilidade de resolução e a percepção geral sobre a Rius Soluções e Tecnologia.

## Objetivo do MVP

O MVP foi desenvolvido para validar o fluxo completo de coleta de avaliações, armazenamento dos dados e acesso administrativo.

A proposta inicial contempla:

- coleta de CSAT;
- coleta de CES;
- coleta de NPS;
- identificação automática de promotores, neutros e detratores;
- coleta de motivo da insatisfação;
- campo de comentário opcional;
- armazenamento das avaliações no Supabase;
- área administrativa protegida por autenticação;
- preparação para dashboard com indicadores e gráficos.

## Funcionalidades

### Pesquisa pública

A pesquisa pode ser respondida sem necessidade de login.

O fluxo atual é composto por:

1. Tela inicial de apresentação;
2. Pergunta de CSAT;
3. Pergunta de CES;
4. Pergunta de NPS;
5. Pergunta condicional sobre motivo da insatisfação;
6. Campo de comentário opcional;
7. Envio da avaliação;
8. Tela de confirmação.

## CSAT

O CSAT é utilizado para medir a satisfação do cliente com o atendimento recebido.

Escala utilizada:

- 1 - Muito insatisfeito
- 2 - Insatisfeito
- 3 - Neutro
- 4 - Satisfeito
- 5 - Muito satisfeito

No dashboard, as notas 4 e 5 poderão ser consideradas avaliações positivas para cálculo do índice de satisfação.

## CES

O CES mede o nível de esforço percebido pelo cliente para resolver sua solicitação.

Escala utilizada:

- 1 - Muito difícil
- 2 - Difícil
- 3 - Neutro
- 4 - Fácil
- 5 - Muito fácil

O indicador poderá ser apresentado por meio da média das respostas coletadas.

## NPS

O NPS mede a percepção geral do cliente sobre a empresa.

A pergunta utilizada é:

"De 0 a 10, o quanto você recomendaria a Rius Soluções e Tecnologia para outra empresa?"

Classificação utilizada:

- 0 a 6 - Detrator
- 7 e 8 - Neutro
- 9 e 10 - Promotor

A classificação é realizada automaticamente no banco de dados por meio de uma trigger no Supabase.

## Pergunta condicional

Quando o cliente apresenta uma avaliação negativa, o sistema solicita o principal motivo da insatisfação.

A pergunta é exibida quando:

- CSAT for menor ou igual a 3; ou
- NPS for menor ou igual a 6.

Motivos disponíveis:

- Tempo de espera
- Problema não resolvido
- Dificuldade no sistema
- Atendimento recebido
- Falta de informação
- Processo complicado
- Outro

Caso a opção "Outro" seja selecionada, um campo adicional é exibido para preenchimento.

## Comentário

Ao final da pesquisa, o cliente pode inserir um comentário livre.

Esse campo é opcional e tem como objetivo complementar os dados quantitativos com informações qualitativas.

## Armazenamento dos dados

Os dados são armazenados no Supabase utilizando PostgreSQL.

A tabela principal do MVP é:

`avaliacoes`

Principais campos:

- `id`
- `csat`
- `ces`
- `nps`
- `classificacao_nps`
- `motivo_insatisfacao`
- `outro_motivo`
- `comentario`
- `data_avaliacao`

## Segurança

O projeto utiliza Row Level Security no Supabase.

A configuração atual permite:

- usuários anônimos enviarem avaliações;
- usuários anônimos não consultarem avaliações;
- usuários autenticados consultarem os dados administrativos.

As credenciais do Supabase são configuradas por meio de variáveis de ambiente e não devem ser enviadas ao repositório.

## Área administrativa

A aplicação possui uma área administrativa separada da pesquisa pública.

O acesso é realizado por meio do Supabase Auth utilizando:

- e-mail;
- senha.

A área administrativa será utilizada para acesso aos indicadores e ao dashboard.

## Dashboard

O dashboard está previsto como próxima etapa do MVP.

Os primeiros indicadores serão:

- total de avaliações;
- CSAT;
- CES;
- NPS;
- quantidade de promotores;
- quantidade de neutros;
- quantidade de detratores;
- principais motivos de insatisfação.

Também está prevista a utilização de gráficos para acompanhamento da evolução dos indicadores.

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS
- Supabase
- PostgreSQL
- Supabase Auth
- ApexCharts
- React ApexCharts
- Git
- GitHub

## Estrutura atual

```text
src/
├── assets/
│   └── logo-rius.png
├── components/
│   ├── LoginAdmin.jsx
│   └── Dashboard.jsx
├── lib/
│   └── supabase.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx