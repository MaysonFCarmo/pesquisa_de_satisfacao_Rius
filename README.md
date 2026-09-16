# Pesquisa de Satisfação - Rius Soluções e Tecnologia

Sistema web desenvolvido para coletar e analisar a experiência dos clientes da Rius Soluções e Tecnologia por meio dos indicadores CSAT, CES e NPS.

O projeto possui uma pesquisa pública e anônima para os clientes e uma área administrativa protegida por autenticação para acompanhamento dos resultados.

---

## Objetivo do projeto

O objetivo da aplicação é transformar o feedback dos clientes em dados que possam ser utilizados para acompanhar a qualidade do atendimento e identificar oportunidades de melhoria.

A pesquisa avalia três pontos principais:

- satisfação com o atendimento;
- facilidade para resolução da solicitação;
- percepção do cliente em relação à empresa.

Os dados coletados são armazenados no Supabase e apresentados em um dashboard administrativo.

---

## Funcionalidades

### Pesquisa de satisfação

A pesquisa é pública e não exige identificação do cliente.

Principais funcionalidades:

- pesquisa anônima;
- interface simples e responsiva;
- fluxo dividido em etapas;
- barra de progresso;
- avaliação CSAT de 1 a 5;
- avaliação CES de 1 a 5;
- avaliação NPS de 0 a 10;
- identificação automática de avaliações negativas;
- solicitação de motivo de insatisfação quando necessário;
- opção de informar outro motivo;
- campo opcional para comentários;
- envio das respostas para o Supabase;
- tela de confirmação após o envio.

---

## CSAT

Customer Satisfaction Score.

O CSAT é utilizado para medir a satisfação do cliente com o atendimento recebido.

Na pesquisa, o cliente responde utilizando notas de 1 a 5.

- 1 = Muito insatisfeito
- 2 = Insatisfeito
- 3 = Neutro
- 4 = Satisfeito
- 5 = Muito satisfeito

No dashboard, são consideradas avaliações satisfeitas as notas 4 e 5.

O cálculo utilizado é:

```text
CSAT = (avaliações com nota 4 ou 5 / total de avaliações) × 100
CES

Customer Effort Score.

O CES mede o nível de esforço necessário para o cliente resolver sua solicitação.

A avaliação utiliza notas de 1 a 5.

1 = Muito difícil
2 = Difícil
3 = Neutro
4 = Fácil
5 = Muito fácil

No dashboard, o CES é apresentado através da média das respostas.

O cálculo utilizado é:

CES = soma das notas / total de avaliações
NPS

Net Promoter Score.

O NPS é utilizado para analisar a percepção do cliente sobre a empresa.

A pergunta utilizada é:

De 0 a 10, o quanto você recomendaria a
Rius Soluções e Tecnologia para outra empresa?

As respostas são classificadas da seguinte forma:

0 a 6 = Detratores
7 e 8 = Neutros
9 e 10 = Promotores

O cálculo utilizado é:

NPS = % de Promotores - % de Detratores

O resultado pode variar de:

-100 até +100
Motivos de insatisfação

Quando a avaliação indica uma experiência negativa, o sistema solicita o principal motivo da insatisfação.

Atualmente estão disponíveis:

Tempo de espera
Problema não resolvido
Dificuldade no sistema
Atendimento recebido
Falta de informação
Processo complicado
Outro

Caso a opção "Outro" seja selecionada, o cliente pode informar o motivo manualmente.

Tela inicial

A página inicial apresenta a pesquisa de forma objetiva, mantendo a identificação da Rius Soluções e Tecnologia sem retirar o foco da avaliação.

São apresentados os três principais pontos analisados:

Atendimento
Facilidade
Recomendação

Também é informado que a pesquisa é anônima e leva menos de um minuto.

Área administrativa

A aplicação possui uma área administrativa protegida por autenticação.

O acesso é realizado através do Supabase Auth utilizando e-mail e senha.

Somente usuários autenticados possuem acesso ao dashboard.

Dashboard

O dashboard apresenta os dados das avaliações armazenadas no Supabase.

Atualmente estão disponíveis os seguintes indicadores:

total de avaliações;
CSAT;
CES;
NPS;
quantidade de promotores;
quantidade de neutros;
quantidade de detratores;
percentual de promotores;
percentual de neutros;
percentual de detratores.
Gráficos

O dashboard utiliza ApexCharts para visualização dos dados.

Distribuição do NPS

Gráfico do tipo donut apresentando:

Promotores
Neutros
Detratores

O valor atual do NPS também é apresentado no centro do gráfico.

Distribuição do CSAT

Gráfico de barras apresentando a quantidade de avaliações recebidas para cada nota:

Nota 1
Nota 2
Nota 3
Nota 4
Nota 5
Motivos de insatisfação

Gráfico de barras horizontais mostrando os principais motivos informados pelos clientes.

Filtro de datas

O dashboard possui filtro por data inicial e data final.

O comportamento é:

Sem datas preenchidas
→ mostra as avaliações do mês atual

Somente data inicial
→ mostra as avaliações daquela data em diante

Somente data final
→ mostra as avaliações até aquela data

Data inicial + data final
→ mostra somente as avaliações dentro do intervalo

O filtro é aplicado simultaneamente a:

total de avaliações;
CSAT;
CES;
NPS;
distribuição do NPS;
distribuição do CSAT;
motivos de insatisfação;
resumo de promotores, neutros e detratores.
Banco de dados

O projeto utiliza Supabase com PostgreSQL.

A principal tabela utilizada é:

avaliacoes

Os principais campos são:

id
csat
ces
nps
classificacao_nps
motivo_insatisfacao
outro_motivo
comentario
data_avaliacao
Classificação automática do NPS

A classificação do NPS é realizada automaticamente no banco de dados.

As regras utilizadas são:

0 até 6
→ Detrator

7 ou 8
→ Neutro

9 ou 10
→ Promotor

Dessa forma, a aplicação não depende apenas do front-end para definir a classificação da resposta.

Segurança

O projeto utiliza Row Level Security (RLS) do Supabase.

A pesquisa pública possui permissão para inserir avaliações sem necessidade de autenticação.

Usuários autenticados possuem acesso aos dados necessários para utilização do dashboard administrativo.

As credenciais utilizadas pelo front-end são armazenadas através de variáveis de ambiente.

O arquivo:

.env

não deve ser enviado ao GitHub.

Variáveis de ambiente

Crie um arquivo .env na raiz do projeto.

Exemplo:

VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA

A URL deve conter somente o endereço principal do projeto Supabase.

Exemplo:

https://xxxxxxxxxxxxxxxx.supabase.co

Não utilize:

/rest/v1

na variável VITE_SUPABASE_URL.

Tecnologias utilizadas
Front-end
React
JavaScript
CSS
Vite
Banco de dados e autenticação
Supabase
PostgreSQL
Supabase Auth
Row Level Security
Visualização de dados
ApexCharts
React ApexCharts
Controle de versão
Git
GitHub
Estrutura do projeto
src/
│
├── assets/
│   └── logo-rius.png
│
├── components/
│   ├── Dashboard.jsx
│   └── LoginAdmin.jsx
│
├── lib/
│   └── supabase.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
Instalação

Clone o repositório:

git clone https://github.com/MaysonFCarmo/pesquisa_de_satisfacao_Rius.git

Entre na pasta do projeto:

cd pesquisa_de_satisfacao_Rius

Instale as dependências:

npm install

Caso necessário, instale também as bibliotecas utilizadas pelo projeto:

npm install @supabase/supabase-js apexcharts react-apexcharts

Crie o arquivo .env com as credenciais do Supabase.

Depois execute:

npm run dev

O Vite disponibilizará o endereço local da aplicação.

Normalmente:

http://localhost:5173
Scripts disponíveis

Executar o projeto em ambiente de desenvolvimento:

npm run dev

Gerar a versão de produção:

npm run build

Visualizar a versão de produção localmente:

npm run preview
Fluxo da pesquisa

O fluxo atual da aplicação é:

Tela inicial
      ↓
CSAT
      ↓
CES
      ↓
NPS
      ↓
Avaliação negativa?
      ↓
Sim → Motivo da insatisfação
      ↓
Comentário opcional
      ↓
Envio
      ↓
Confirmação

Caso a avaliação não seja considerada negativa, o cliente segue diretamente do NPS para o comentário opcional.

Status do projeto

Versão atual:

v0.2.0

O MVP já possui:

pesquisa funcional;
integração com Supabase;
armazenamento das avaliações;
CSAT;
CES;
NPS;
classificação automática do NPS;
motivos de insatisfação;
comentários;
autenticação administrativa;
dashboard;
gráficos;
filtro por datas;
interface responsiva.
Próximas melhorias

Algumas funcionalidades planejadas para as próximas versões:

gráfico de evolução histórica dos indicadores;
evolução de CSAT ao longo do tempo;
evolução de CES ao longo do tempo;
evolução de NPS ao longo do tempo;
tabela de avaliações recentes;
visualização individual dos comentários;
análise detalhada dos motivos classificados como "Outro";
exportação das avaliações para CSV;
melhorias na persistência da sessão administrativa;
tratamento automático de sessão expirada;
melhorias adicionais de responsividade;
deploy da aplicação em ambiente de produção.
Versionamento
v0.1.0

Primeira versão funcional do MVP.

Principais funcionalidades:

pesquisa CSAT;
pesquisa CES;
pesquisa NPS;
integração com Supabase;
armazenamento das avaliações.
v0.2.0

Evolução da pesquisa e criação da área administrativa.

Principais funcionalidades:

nova interface da pesquisa;
autenticação administrativa;
dashboard;
cálculo de CSAT;
cálculo de CES;
cálculo de NPS;
gráficos;
motivos de insatisfação;
filtro por data inicial e final;
visualização padrão do mês atual.
Autor

Desenvolvido por Mayson Farias do Carmo.

GitHub:

github.com/MaysonFCarmo

Projeto desenvolvido como aplicação prática de desenvolvimento web, análise de experiência do cliente e integração com banco de dados em nuvem.