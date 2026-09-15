import { useState } from 'react'

import { supabase } from '../lib/supabase'


function LoginAdmin({ onLogin, onVoltar }) {

  const [email, setEmail] = useState('')

  const [senha, setSenha] = useState('')

  const [carregando, setCarregando] = useState(false)

  const [erro, setErro] = useState('')


  async function fazerLogin(event) {

    event.preventDefault()

    setCarregando(true)

    setErro('')


    const { data, error } =
      await supabase.auth.signInWithPassword({

        email: email,

        password: senha

      })


    if (error) {

      console.error(
        'Erro no login:',
        error
      )


      setErro(
        'E-mail ou senha incorretos.'
      )


      setCarregando(false)

      return

    }


    setCarregando(false)


    if (data.session) {

      onLogin()

    }

  }


  return (

    <main className="app">

      <div className="login-card">


        <button

          type="button"

          className="voltar-login"

          onClick={onVoltar}

        >

          ← Voltar

        </button>


        <div className="login-icone">

          👤

        </div>


        <h1 className="login-titulo">

          Área Administrativa

        </h1>


        <p className="login-subtitulo">

          Rius Soluções e Tecnologia

        </p>


        <form

          className="login-form"

          onSubmit={fazerLogin}

        >


          <div className="campo-login">

            <label htmlFor="email">

              E-mail

            </label>


            <input

              id="email"

              type="email"

              placeholder="Digite seu e-mail"

              value={email}

              onChange={(event) =>
                setEmail(event.target.value)
              }

              required

            />

          </div>


          <div className="campo-login">

            <label htmlFor="senha">

              Senha

            </label>


            <input

              id="senha"

              type="password"

              placeholder="Digite sua senha"

              value={senha}

              onChange={(event) =>
                setSenha(event.target.value)
              }

              required

            />

          </div>


          {erro && (

            <p className="mensagem-erro">

              {erro}

            </p>

          )}


          <button

            type="submit"

            className="botao-login"

            disabled={carregando}

          >

            {
              carregando
                ? 'Entrando...'
                : 'Entrar'
            }

          </button>

        </form>

      </div>

    </main>

  )

}


export default LoginAdmin