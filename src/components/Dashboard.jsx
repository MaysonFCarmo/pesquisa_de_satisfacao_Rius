
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

import { supabase } from '../lib/supabase'
import logoRius from '../assets/logo-rius.png'


function Dashboard({ onSair }) {

  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')


  useEffect(() => {

    buscarAvaliacoes()

  }, [])


  // =====================================================
  // BUSCAR AVALIAÇÕES
  // =====================================================

  async function buscarAvaliacoes() {

    setCarregando(true)
    setErro('')


    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .order(
        'data_avaliacao',
        {
          ascending: false
        }
      )


    if (error) {

      console.error(
        'Erro ao buscar avaliações:',
        error
      )

      setErro(
        'Não foi possível carregar as avaliações.'
      )

      setCarregando(false)

      return

    }


    setAvaliacoes(data || [])

    setCarregando(false)

  }


  // =====================================================
  // CONVERTER DATA
  // =====================================================

  function obterDataLocal(dataIso) {

    const data = new Date(dataIso)

    const ano =
      data.getFullYear()

    const mes =
      String(
        data.getMonth() + 1
      ).padStart(2, '0')

    const dia =
      String(
        data.getDate()
      ).padStart(2, '0')


    return `${ano}-${mes}-${dia}`

  }


  // =====================================================
  // INTERVALO INVÁLIDO
  // =====================================================

  const intervaloInvalido =
    dataInicial &&
    dataFinal &&
    dataInicial > dataFinal


  // =====================================================
  // MÊS ATUAL
  // =====================================================

  const hoje = new Date()

  const anoAtual =
    hoje.getFullYear()

  const mesAtualNumero =
    hoje.getMonth()

  const mesAtual =
    String(
      mesAtualNumero + 1
    ).padStart(2, '0')


  const inicioMesAtual =
    `${anoAtual}-${mesAtual}-01`


  const ultimoDiaMesAtual =
    new Date(
      anoAtual,
      mesAtualNumero + 1,
      0
    ).getDate()


  const fimMesAtual =
    `${anoAtual}-${mesAtual}-${String(
      ultimoDiaMesAtual
    ).padStart(2, '0')}`


  // =====================================================
  // FILTRO
  // =====================================================

  const avaliacoesFiltradas =
    intervaloInvalido
      ? []
      : avaliacoes.filter(
          (avaliacao) => {

            const dataAvaliacao =
              obterDataLocal(
                avaliacao.data_avaliacao
              )


            // SEM DATAS -> MÊS ATUAL

            if (
              !dataInicial &&
              !dataFinal
            ) {

              return (
                dataAvaliacao >= inicioMesAtual &&
                dataAvaliacao <= fimMesAtual
              )

            }


            // SOMENTE DATA INICIAL

            if (
              dataInicial &&
              !dataFinal
            ) {

              return (
                dataAvaliacao >= dataInicial
              )

            }


            // SOMENTE DATA FINAL

            if (
              !dataInicial &&
              dataFinal
            ) {

              return (
                dataAvaliacao <= dataFinal
              )

            }


            // DATA INICIAL + FINAL

            if (
              dataInicial &&
              dataFinal
            ) {

              return (
                dataAvaliacao >= dataInicial &&
                dataAvaliacao <= dataFinal
              )

            }


            return true

          }
        )


  function limparFiltros() {

    setDataInicial('')
    setDataFinal('')

  }


  // =====================================================
  // TOTAL
  // =====================================================

  const totalAvaliacoes =
    avaliacoesFiltradas.length


  // =====================================================
  // CSAT
  // =====================================================

  const totalSatisfeitos =
    avaliacoesFiltradas.filter(
      (avaliacao) =>
        Number(avaliacao.csat) >= 4
    ).length


  const csat =
    totalAvaliacoes > 0
      ? (
          totalSatisfeitos /
          totalAvaliacoes
        ) * 100
      : 0


  // =====================================================
  // CES
  // =====================================================

  const somaCes =
    avaliacoesFiltradas.reduce(
      (total, avaliacao) => {

        return (
          total +
          Number(avaliacao.ces)
        )

      },
      0
    )


  const ces =
    totalAvaliacoes > 0
      ? somaCes / totalAvaliacoes
      : 0


  // =====================================================
  // NPS
  // =====================================================

  const promotores =
    avaliacoesFiltradas.filter(
      (avaliacao) =>
        Number(avaliacao.nps) >= 9
    ).length


  const neutros =
    avaliacoesFiltradas.filter(
      (avaliacao) =>
        Number(avaliacao.nps) >= 7 &&
        Number(avaliacao.nps) <= 8
    ).length


  const detratores =
    avaliacoesFiltradas.filter(
      (avaliacao) =>
        Number(avaliacao.nps) <= 6
    ).length


  const percentualPromotores =
    totalAvaliacoes > 0
      ? (
          promotores /
          totalAvaliacoes
        ) * 100
      : 0


  const percentualNeutros =
    totalAvaliacoes > 0
      ? (
          neutros /
          totalAvaliacoes
        ) * 100
      : 0


  const percentualDetratores =
    totalAvaliacoes > 0
      ? (
          detratores /
          totalAvaliacoes
        ) * 100
      : 0


  const nps =
    Math.round(
      percentualPromotores -
      percentualDetratores
    )


  function formatarNps(valor) {

    if (valor > 0) {

      return `+${valor}`

    }

    return valor

  }


  // =====================================================
  // DISTRIBUIÇÃO CSAT
  // =====================================================

  const distribuicaoCsat =
    [1, 2, 3, 4, 5].map(
      (nota) =>

        avaliacoesFiltradas.filter(
          (avaliacao) =>
            Number(avaliacao.csat) === nota
        ).length

    )


  // =====================================================
  // MOTIVOS
  // =====================================================

  const contadorMotivos = {}


  avaliacoesFiltradas.forEach(
    (avaliacao) => {

      if (
        avaliacao.motivo_insatisfacao
      ) {

        const motivo =
          avaliacao.motivo_insatisfacao


        contadorMotivos[motivo] =
          (
            contadorMotivos[motivo] || 0
          ) + 1

      }

    }
  )


  const motivosOrdenados =
    Object.entries(
      contadorMotivos
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )


  const motivosLabels =
    motivosOrdenados.map(
      ([motivo]) =>
        motivo
    )


  const motivosValores =
    motivosOrdenados.map(
      ([, quantidade]) =>
        quantidade
    )


  // =====================================================
  // GRÁFICO NPS
  // =====================================================

  const opcoesNps = {

    chart: {
      type: 'donut',

      toolbar: {
        show: false
      }
    },

    labels: [
      'Promotores',
      'Neutros',
      'Detratores'
    ],

    colors: [
      '#2ecdc4',
      '#f4b942',
      '#e05a5a'
    ],

    legend: {
      position: 'bottom'
    },

    dataLabels: {

      enabled: true,

      formatter: function (valor) {

        return `${valor.toFixed(1)}%`

      }

    },

    stroke: {

      width: 2,

      colors: [
        '#ffffff'
      ]

    },

    plotOptions: {

      pie: {

        donut: {

          size: '68%',

          labels: {

            show: true,

            total: {

              show: true,

              label: 'NPS',

              formatter: function () {

                return formatarNps(nps)

              }

            }

          }

        }

      }

    },

    tooltip: {

      y: {

        formatter: function (valor) {

          const percentual =
            totalAvaliacoes > 0
              ? (
                  valor /
                  totalAvaliacoes
                ) * 100
              : 0


          return (
            `${valor} avaliações ` +
            `(${percentual.toFixed(1)}%)`
          )

        }

      }

    }

  }


  const seriesNps =
    totalAvaliacoes > 0
      ? [
          promotores,
          neutros,
          detratores
        ]
      : []


  // =====================================================
  // GRÁFICO CSAT
  // =====================================================

  const opcoesCsat = {

    chart: {

      type: 'bar',

      toolbar: {
        show: false
      }

    },

    colors: [
      '#2ecdc4'
    ],

    plotOptions: {

      bar: {

        borderRadius: 6,

        columnWidth: '50%'

      }

    },

    dataLabels: {
      enabled: false
    },

    xaxis: {

      categories: [
        'Nota 1',
        'Nota 2',
        'Nota 3',
        'Nota 4',
        'Nota 5'
      ]

    },

    yaxis: {

      min: 0,

      forceNiceScale: true,

      title: {
        text: 'Avaliações'
      }

    },

    grid: {
      borderColor: '#edf0f2'
    },

    tooltip: {

      y: {

        formatter: function (valor) {

          return `${valor} avaliações`

        }

      }

    }

  }


  const seriesCsat = [

    {

      name: 'Avaliações',

      data: distribuicaoCsat

    }

  ]


  // =====================================================
  // GRÁFICO MOTIVOS
  // =====================================================

  const opcoesMotivos = {

    chart: {

      type: 'bar',

      toolbar: {
        show: false
      }

    },

    colors: [
      '#0e0554'
    ],

    plotOptions: {

      bar: {

        horizontal: true,

        borderRadius: 6,

        barHeight: '55%'

      }

    },

    dataLabels: {

      enabled: true,

      formatter: function (valor) {

        return valor

      },

      style: {

        colors: [
          '#ffffff'
        ]

      }

    },

    xaxis: {

      categories:
        motivosLabels,

      min: 0,

      forceNiceScale: true

    },

    grid: {
      borderColor: '#edf0f2'
    },

    tooltip: {

      y: {

        formatter: function (valor) {

          return `${valor} ocorrência(s)`

        }

      }

    }

  }


  const seriesMotivos = [

    {

      name: 'Ocorrências',

      data: motivosValores

    }

  ]


  // =====================================================
  // LOGOUT
  // =====================================================

  async function sair() {

    await supabase.auth.signOut()

    onSair()

  }


  // =====================================================
  // CARREGAMENTO
  // =====================================================

  if (carregando) {

    return (

      <main className="dashboard-page">

        <div className="dashboard-carregando">

          <p>
            Carregando indicadores...
          </p>

        </div>

      </main>

    )

  }


  return (

    <main className="dashboard-page">


      {/* CABEÇALHO */}

      <header className="dashboard-header">

        <div className="dashboard-marca">

          <img
            src={logoRius}
            alt="Rius Soluções e Tecnologia"
            className="dashboard-logo"
          />


          <div>

            <h1>
              Dashboard de Experiência do Cliente
            </h1>

            <p>
              Rius Soluções e Tecnologia
            </p>

          </div>

        </div>


        <div className="dashboard-acoes">

          <button
            type="button"
            className="botao-atualizar"
            onClick={buscarAvaliacoes}
          >

            Atualizar

          </button>


          <button
            type="button"
            className="botao-sair"
            onClick={sair}
          >

            Sair

          </button>

        </div>

      </header>


      <section className="dashboard-conteudo">


        <div className="dashboard-titulo-area">

          <h2>
            Visão geral
          </h2>

          <p>
            Indicadores consolidados das avaliações recebidas.
          </p>

        </div>


        {/* FILTRO */}

        <div className="filtro-datas">

          <div className="filtro-datas-cabecalho">

            <h3>
              Filtrar avaliações por período
            </h3>

            <p>
              Por padrão, o dashboard exibe as avaliações
              do mês atual. Se desejar, selecione uma data
              inicial, uma data final ou um intervalo.
            </p>

          </div>


          <div className="filtro-datas-campos">


            <div className="campo-data">

              <label htmlFor="dataInicial">
                Data inicial
              </label>

              <input
                id="dataInicial"
                type="date"
                value={dataInicial}

                onChange={(event) =>
                  setDataInicial(
                    event.target.value
                  )
                }
              />

            </div>


            <div className="campo-data">

              <label htmlFor="dataFinal">
                Data final
              </label>

              <input
                id="dataFinal"
                type="date"
                value={dataFinal}

                onChange={(event) =>
                  setDataFinal(
                    event.target.value
                  )
                }
              />

            </div>


            <button
              type="button"
              className="botao-limpar-filtro"
              onClick={limparFiltros}
            >

              Limpar filtro

            </button>

          </div>


          {intervaloInvalido && (

            <div className="filtro-data-erro">

              A data inicial não pode ser maior
              que a data final.

            </div>

          )}


          {!intervaloInvalido && (

            <div className="filtro-resultado">

              {
                dataInicial || dataFinal
                  ? (
                    <>
                      {totalAvaliacoes}
                      {' '}
                      avaliação(ões) encontrada(s)
                      no período selecionado.
                    </>
                  )
                  : (
                    <>
                      {totalAvaliacoes}
                      {' '}
                      avaliação(ões) encontrada(s)
                      no mês atual.
                    </>
                  )
              }

            </div>

          )}

        </div>


        {erro && (

          <div className="dashboard-erro">
            {erro}
          </div>

        )}


        {/* CARDS */}

        <div className="dashboard-cards">


          <article className="indicador-card">

            <div className="indicador-titulo">

              <span className="indicador-label">
                Avaliações
              </span>

              <span
                className="tooltip-info"
                data-tooltip="Total de respostas consideradas no período atual do dashboard."
              >
                i
              </span>

            </div>

            <strong className="indicador-valor">
              {totalAvaliacoes}
            </strong>

            <span className="indicador-descricao">
              Respostas recebidas
            </span>

          </article>


          <article className="indicador-card">

            <div className="indicador-titulo">

              <span className="indicador-label">
                CSAT
              </span>

              <span
                className="tooltip-info"
                data-tooltip="CSAT = (avaliações com nota 4 ou 5 ÷ total de avaliações) × 100"
              >
                i
              </span>

            </div>

            <strong className="indicador-valor">
              {Math.round(csat)}%
            </strong>

            <span className="indicador-descricao">
              Satisfação com o atendimento
            </span>

          </article>


          <article className="indicador-card">

            <div className="indicador-titulo">

              <span className="indicador-label">
                CES
              </span>

              <span
                className="tooltip-info"
                data-tooltip="CES = soma das notas de facilidade ÷ total de avaliações"
              >
                i
              </span>

            </div>

            <strong className="indicador-valor">
              {ces.toFixed(1)} / 5
            </strong>

            <span className="indicador-descricao">
              Facilidade para resolver
            </span>

          </article>


          <article className="indicador-card">

            <div className="indicador-titulo">

              <span className="indicador-label">
                NPS
              </span>


              <span className="tooltip-info tooltip-info-nps">

                i


                <span className="tooltip-nps-conteudo">

                  <strong>
                    Cálculo do NPS
                  </strong>

                  <span>
                    NPS = % Promotores − % Detratores
                  </span>

                  <span className="tooltip-separador" />

                  <strong>
                    Classificação
                  </strong>

                  <span>
                    Promotores: notas 9 e 10
                  </span>

                  <span>
                    Neutros: notas 7 e 8
                  </span>

                  <span>
                    Detratores: notas de 0 a 6
                  </span>

                </span>

              </span>

            </div>

            <strong className="indicador-valor">
              {formatarNps(nps)}
            </strong>

            <span className="indicador-descricao">
              Percepção sobre a Rius
            </span>

          </article>

        </div>


        {/* GRÁFICOS */}

        <div className="graficos-grid">


          <article className="grafico-card">

            <div className="grafico-cabecalho">

              <h2>
                Distribuição do NPS
              </h2>

              <p>
                Promotores, neutros e detratores
              </p>

            </div>


            {
              totalAvaliacoes > 0
                ? (

                  <Chart
                    options={opcoesNps}
                    series={seriesNps}
                    type="donut"
                    height={320}
                  />

                )
                : (

                  <div className="grafico-sem-dados">

                    Nenhuma avaliação encontrada
                    no período.

                  </div>

                )
            }

          </article>


          <article className="grafico-card">

            <div className="grafico-cabecalho">

              <h2>
                Distribuição do CSAT
              </h2>

              <p>
                Quantidade de respostas por nota
              </p>

            </div>


            {
              totalAvaliacoes > 0
                ? (

                  <Chart
                    options={opcoesCsat}
                    series={seriesCsat}
                    type="bar"
                    height={320}
                  />

                )
                : (

                  <div className="grafico-sem-dados">

                    Nenhuma avaliação encontrada
                    no período.

                  </div>

                )
            }

          </article>


          <article className="grafico-card grafico-card-largo">

            <div className="grafico-cabecalho">

              <h2>
                Motivos de insatisfação
              </h2>

              <p>
                Principais motivos informados pelos clientes
              </p>

            </div>


            {
              motivosValores.length > 0
                ? (

                  <Chart
                    options={opcoesMotivos}
                    series={seriesMotivos}
                    type="bar"
                    height={350}
                  />

                )
                : (

                  <div className="grafico-sem-dados">

                    Nenhum motivo de insatisfação
                    registrado no período.

                  </div>

                )
            }

          </article>

        </div>


        {/* RESUMO NPS */}

        <div className="distribuicao-container">

          <div className="distribuicao-cabecalho">

            <h2>
              Resumo do NPS
            </h2>

            <p>
              Quantidade e percentual por classificação
            </p>

          </div>


          <div className="distribuicao-cards">


            <div className="classificacao-card">

              <span>
                Promotores
              </span>

              <strong>
                {promotores}
              </strong>

              <small>
                {percentualPromotores.toFixed(1)}%
              </small>

            </div>


            <div className="classificacao-card">

              <span>
                Neutros
              </span>

              <strong>
                {neutros}
              </strong>

              <small>
                {percentualNeutros.toFixed(1)}%
              </small>

            </div>


            <div className="classificacao-card">

              <span>
                Detratores
              </span>

              <strong>
                {detratores}
              </strong>

              <small>
                {percentualDetratores.toFixed(1)}%
              </small>

            </div>

          </div>

        </div>


      </section>

    </main>

  )

}


export default Dashboard