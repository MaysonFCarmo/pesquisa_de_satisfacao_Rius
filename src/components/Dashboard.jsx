import { supabase } from '../lib/supabase'


function Dashboard({ onSair }) {


  async function sair() {

    await supabase.auth.signOut()

    onSair()

  }


  return (

    <main className="app">

      <div className="dashboard-teste">


        <h1>

          Dashboard

        </h1>


        <p>

          Login realizado com sucesso.

        </p>


        <p>

          Bem-vindo à área administrativa da
          Rius Soluções e Tecnologia.

        </p>


        <button

          type="button"

          className="botao-principal"

          onClick={sair}

        >

          Sair

        </button>

      </div>

    </main>

  )

}


export default Dashboard