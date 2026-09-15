import { useState } from 'react'
import { supabase } from './lib/supabase'

import './App.css'

import logoRius from './assets/logo-rius.png'

import LoginAdmin from './components/LoginAdmin'
import Dashboard from './components/Dashboard'


function App() {

  // =====================================================
  // NAVEGAÇÃO PRINCIPAL
  // =====================================================

  const [tela, setTela] = useState('pesquisa')

  const [adminLogado, setAdminLogado] = useState(false)


  // =====================================================
  // ETAPAS DA PESQUISA
  // =====================================================

  const [etapa, setEtapa] = useState(0)


  // =====================================================
  // RESPOSTAS
  // =====================================================

  const [csat, setCsat] = useState(null)

  const [ces, setCes] = useState(null)

  const [nps, setNps] = useState(null)

  const [motivoInsatisfacao, setMotivoInsatisfacao] =
    useState('')

  const [outroMotivo, setOutroMotivo] =
    useState('')

  const [comentario, setComentario] =
    useState('')


  // =====================================================
  // ENVIO
  // =====================================================

  const [enviando, setEnviando] = useState(false)

  const [erro, setErro] = useState('')


  // =====================================================
  // PROGRESSO
  // =====================================================

  const progresso = {
    1: 25,
    2: 50,
    3: 75,
    4: 90,
    5: 100
  }[etapa] || 0


  // =====================================================
  // INICIAR
  // =====================================================

  function iniciarPesquisa() {

    setEtapa(1)

  }


  // =====================================================
  // CSAT -> CES
  // =====================================================

  function avancarParaCes() {

    if (csat !== null) {

      setEtapa(2)

    }

  }


  // =====================================================
  // CES -> NPS
  // =====================================================

  function avancarParaNps() {

    if (ces !== null) {

      setEtapa(3)

    }

  }


  // =====================================================
  // NPS -> MOTIVO OU COMENTÁRIO
  // =====================================================

  function avancarDepoisDoNps() {

    if (nps === null) {

      return

    }


    const avaliacaoNegativa =
      csat <= 3 || nps <= 6


    if (avaliacaoNegativa) {

      setEtapa(4)

    } else {

      setEtapa(5)

    }

  }


  // =====================================================
  // MOTIVO -> COMENTÁRIO
  // =====================================================

  function avancarParaComentario() {

    if (motivoInsatisfacao === '') {

      return

    }


    if (
      motivoInsatisfacao === 'Outro' &&
      outroMotivo.trim() === ''
    ) {

      return

    }


    setEtapa(5)

  }


  // =====================================================
  // VOLTAR
  // =====================================================

  function voltarEtapa() {

    if (etapa === 2) {

      setEtapa(1)

      return

    }


    if (etapa === 3) {

      setEtapa(2)

      return

    }


    if (etapa === 4) {

      setEtapa(3)

      return

    }


    if (etapa === 5) {

      const avaliacaoNegativa =
        csat <= 3 || nps <= 6


      if (avaliacaoNegativa) {

        setEtapa(4)

      } else {

        setEtapa(3)

      }

    }

  }


  // =====================================================
  // ENVIAR PARA O SUPABASE
  // =====================================================

  async function enviarAvaliacao() {

    setEnviando(true)

    setErro('')


    const { error } = await supabase
      .from('avaliacoes')
      .insert([
        {

          csat: csat,

          ces: ces,

          nps: nps,

          motivo_insatisfacao:
            motivoInsatisfacao || null,

          outro_motivo:
            outroMotivo.trim() || null,

          comentario:
            comentario.trim() || null

        }
      ])


    if (error) {

      console.error(
        'Erro ao enviar avaliação:',
        error
      )


      setErro(
        'Não foi possível enviar sua avaliação. Tente novamente.'
      )


      setEnviando(false)

      return

    }


    setEnviando(false)

    setEtapa(6)

  }


  // =====================================================
  // NOVA AVALIAÇÃO
  // =====================================================

  function novaAvaliacao() {

    setCsat(null)

    setCes(null)

    setNps(null)

    setMotivoInsatisfacao('')

    setOutroMotivo('')

    setComentario('')

    setErro('')

    setEtapa(0)

  }


  // =====================================================
  // LOGIN ADMINISTRATIVO
  // =====================================================

  if (tela === 'login') {

    return (

      <LoginAdmin

        onLogin={() => {

          setAdminLogado(true)

          setTela('dashboard')

        }}

        onVoltar={() => {

          setTela('pesquisa')

        }}

      />

    )

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  if (
    tela === 'dashboard' &&
    adminLogado
  ) {

    return (

      <Dashboard

        onSair={() => {

          setAdminLogado(false)

          setTela('pesquisa')

        }}

      />

    )

  }


  // =====================================================
  // PESQUISA
  // =====================================================

  return (

    <main className="app">

      <div className="pesquisa-card">


        {/* =================================================
            ÍCONE ADMINISTRATIVO
        ================================================= */}

        {etapa === 0 && (

          <button

            type="button"

            className="botao-admin-icone"

            onClick={() =>
              setTela('login')
            }

            title="Área administrativa"

            aria-label="Acessar área administrativa"

          >

            <svg

              width="22"

              height="22"

              viewBox="0 0 24 24"

              fill="none"

              xmlns="http://www.w3.org/2000/svg"

            >

              <path

                d="
                  M12 12
                  C14.7614 12 17 9.76142 17 7
                  C17 4.23858 14.7614 2 12 2
                  C9.23858 2 7 4.23858 7 7
                  C7 9.76142 9.23858 12 12 12Z
                "

                stroke="currentColor"

                strokeWidth="2"

              />


              <path

                d="
                  M4 22
                  C4 17.5817 7.58172 14 12 14
                  C16.4183 14 20 17.5817 20 22
                "

                stroke="currentColor"

                strokeWidth="2"

                strokeLinecap="round"

              />

            </svg>

          </button>

        )}


        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="topo-marca">

          <img

            src={logoRius}

            alt="Logo Rius Soluções e Tecnologia"

            className="logo-rius"

          />


          <h1 className="titulo-empresa">

            Rius Soluções e Tecnologia

          </h1>


          <p className="subtitulo-empresa">

            Pesquisa de satisfação do atendimento

          </p>

        </div>


        {/* =================================================
            PROGRESSO
        ================================================= */}

        {etapa >= 1 && etapa <= 5 && (

          <div className="area-progresso">

            <div className="progresso-info">

              <span>

                Progresso

              </span>


              <span>

                {progresso}%

              </span>

            </div>


            <div className="barra-progresso">

              <div

                className="barra-progresso-preenchimento"

                style={{
                  width: `${progresso}%`
                }}

              />

            </div>

          </div>

        )}


        {/* =================================================
            TELA INICIAL
        ================================================= */}

        {etapa === 0 && (

          <div>

            <h2>

              Sua opinião é importante para nós

            </h2>


            <p>

              Queremos entender como foi sua experiência
              com nosso atendimento.

            </p>


            <p>

              A pesquisa leva menos de 1 minuto.

            </p>


            <button

              type="button"

              className="botao-principal"

              onClick={iniciarPesquisa}

            >

              Iniciar avaliação

            </button>

          </div>

        )}


        {/* =================================================
            CSAT
        ================================================= */}

        {etapa === 1 && (

          <div>

            <p className="numero-pergunta">

              Pergunta 1 de 3

            </p>


            <h2>

              Como você avalia o atendimento recebido?

            </h2>


            <p>

              1 = Muito insatisfeito |
              5 = Muito satisfeito

            </p>


            <div className="grupo-notas">

              {[1, 2, 3, 4, 5].map((nota) => (

                <button

                  type="button"

                  key={nota}

                  className={
                    csat === nota
                      ? 'botao-nota selecionado'
                      : 'botao-nota'
                  }

                  onClick={() =>
                    setCsat(nota)
                  }

                >

                  {nota}

                </button>

              ))}

            </div>


            {csat !== null && (

              <div>

                <p>

                  Nota selecionada:{' '}

                  <strong>

                    {csat}

                  </strong>

                </p>


                <button

                  type="button"

                  className="botao-principal"

                  onClick={avancarParaCes}

                >

                  Continuar

                </button>

              </div>

            )}

          </div>

        )}


        {/* =================================================
            CES
        ================================================= */}

        {etapa === 2 && (

          <div>

            <p className="numero-pergunta">

              Pergunta 2 de 3

            </p>


            <h2>

              Foi fácil resolver sua solicitação?

            </h2>


            <p>

              1 = Muito difícil |
              5 = Muito fácil

            </p>


            <div className="grupo-notas">

              {[1, 2, 3, 4, 5].map((nota) => (

                <button

                  type="button"

                  key={nota}

                  className={
                    ces === nota
                      ? 'botao-nota selecionado'
                      : 'botao-nota'
                  }

                  onClick={() =>
                    setCes(nota)
                  }

                >

                  {nota}

                </button>

              ))}

            </div>


            {ces !== null && (

              <p>

                Nota selecionada:{' '}

                <strong>

                  {ces}

                </strong>

              </p>

            )}


            <div className="acoes">

              <button

                type="button"

                className="botao-voltar"

                onClick={voltarEtapa}

              >

                ← Voltar

              </button>


              {ces !== null && (

                <button

                  type="button"

                  className="botao-principal"

                  onClick={avancarParaNps}

                >

                  Continuar

                </button>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            NPS
        ================================================= */}

        {etapa === 3 && (

          <div>

            <p className="numero-pergunta">

              Pergunta 3 de 3

            </p>


            <h2>

              De 0 a 10, o quanto você recomendaria
              a Rius Soluções e Tecnologia para outra empresa?

            </h2>


            <p>

              0 = Não recomendaria |
              10 = Recomendaria com certeza

            </p>


            <div className="grupo-notas grupo-nps">

              {[
                0, 1, 2, 3, 4, 5,
                6, 7, 8, 9, 10
              ].map((nota) => (

                <button

                  type="button"

                  key={nota}

                  className={
                    nps === nota
                      ? 'botao-nota selecionado'
                      : 'botao-nota'
                  }

                  onClick={() =>
                    setNps(nota)
                  }

                >

                  {nota}

                </button>

              ))}

            </div>


            {nps !== null && (

              <p>

                Nota selecionada:{' '}

                <strong>

                  {nps}

                </strong>

              </p>

            )}


            <div className="acoes">

              <button

                type="button"

                className="botao-voltar"

                onClick={voltarEtapa}

              >

                ← Voltar

              </button>


              {nps !== null && (

                <button

                  type="button"

                  className="botao-principal"

                  onClick={avancarDepoisDoNps}

                >

                  Continuar

                </button>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            MOTIVO DA INSATISFAÇÃO
        ================================================= */}

        {etapa === 4 && (

          <div>

            <h2>

              Queremos entender melhor sua experiência

            </h2>


            <p>

              Qual foi o principal motivo da sua
              insatisfação?

            </p>


            <div className="grupo-motivos">

              {[
                'Tempo de espera',
                'Problema não resolvido',
                'Dificuldade no sistema',
                'Atendimento recebido',
                'Falta de informação',
                'Processo complicado',
                'Outro'
              ].map((motivo) => (

                <button

                  type="button"

                  key={motivo}

                  className={
                    motivoInsatisfacao === motivo
                      ? 'botao-motivo selecionado'
                      : 'botao-motivo'
                  }

                  onClick={() =>
                    setMotivoInsatisfacao(motivo)
                  }

                >

                  {motivo}

                </button>

              ))}

            </div>


            {motivoInsatisfacao !== '' && (

              <p>

                Motivo selecionado:{' '}

                <strong>

                  {motivoInsatisfacao}

                </strong>

              </p>

            )}


            {motivoInsatisfacao === 'Outro' && (

              <input

                type="text"

                placeholder="Digite o motivo"

                value={outroMotivo}

                onChange={(event) =>
                  setOutroMotivo(
                    event.target.value
                  )
                }

              />

            )}


            <div className="acoes">

              <button

                type="button"

                className="botao-voltar"

                onClick={voltarEtapa}

              >

                ← Voltar

              </button>


              {motivoInsatisfacao !== '' && (

                <button

                  type="button"

                  className="botao-principal"

                  onClick={avancarParaComentario}

                >

                  Continuar

                </button>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            COMENTÁRIO
        ================================================= */}

        {etapa === 5 && (

          <div>

            <h2>

              Gostaria de deixar algum comentário?

            </h2>


            <p>

              Essa etapa é opcional.

            </p>


            <p>

              Sua opinião nos ajuda a melhorar
              continuamente nossos serviços.

            </p>


            <textarea

              placeholder="Digite seu comentário..."

              value={comentario}

              onChange={(event) =>
                setComentario(
                  event.target.value
                )
              }

            />


            <div className="acoes">

              <button

                type="button"

                className="botao-voltar"

                onClick={voltarEtapa}

              >

                ← Voltar

              </button>


              <button

                type="button"

                className="botao-principal"

                onClick={enviarAvaliacao}

                disabled={enviando}

              >

                {
                  enviando
                    ? 'Enviando...'
                    : 'Enviar avaliação'
                }

              </button>

            </div>


            {erro !== '' && (

              <p className="mensagem-erro">

                {erro}

              </p>

            )}

          </div>

        )}


        {/* =================================================
            SUCESSO
        ================================================= */}

        {etapa === 6 && (

          <div>

            <div className="icone-sucesso">

              ✓

            </div>


            <h2>

              Obrigado pela sua avaliação!

            </h2>


            <p>

              Sua resposta foi enviada com sucesso.

            </p>


            <p>

              Seu feedback é muito importante para
              a Rius Soluções e Tecnologia.

            </p>


            <button

              type="button"

              className="botao-principal"

              onClick={novaAvaliacao}

            >

              Nova avaliação

            </button>

          </div>

        )}

      </div>

    </main>

  )

}


export default App