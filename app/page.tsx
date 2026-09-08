// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
              Online & Protegido
            </span>
            <span className="text-xs text-zinc-500 font-mono">v1.0.0</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-3">CJM API - Documentação</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            API segura construída com Next.js App Router, Prisma ORM e autenticação JWT baseada em cookies HttpOnly.
          </p>
        </div>

        {/* Status e Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500">Autenticação</h3>
            <p className="text-lg font-semibold mt-1">Bearer / Cookies HttpOnly</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500">Política de Acesso</h3>
            <p className="text-lg font-semibold mt-1 text-emerald-500">Default Deny</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500">Banco de Dados</h3>
            <p className="text-lg font-semibold mt-1">PostgreSQL + Prisma</p>
          </div>
        </div>

        {/* Lista de Endpoints */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Endpoints Disponíveis</h2>

          {/* Rota 1: Login */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded">POST</span>
                <code className="text-sm font-mono font-medium">/api/login</code>
              </div>
              <span className="text-xs text-zinc-500">Público</span>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p className="text-zinc-600 dark:text-zinc-400">Autentica o cliente com e-mail e senha, gravando um cookie de sessão HttpOnly seguro.</p>
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Body JSON Exemplo:</span>
                <pre className="mt-1 p-3 bg-zinc-950 text-zinc-50 rounded-lg font-mono text-xs overflow-x-auto">
{`{
  "email": "exemplo@email.com",
  "senha": "sua_senha"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Rota 2: Meu Cadastro */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded">GET</span>
                <code className="text-sm font-mono font-medium">/api/cliente/meu-cadastro</code>
              </div>
              <span className="text-xs font-amber-500 font-medium text-amber-500">Protegido (Requer Cookie)</span>
            </div>
            <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
              Retorna os dados cadastrais completos do usuário logado com base estritamente no token JWT da sessão.
            </div>
          </div>

          {/* Rota 3: Trocar Senha */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded">POST</span>
                <code className="text-sm font-mono font-medium">/api/cliente/trocar-senha</code>
              </div>
              <span className="text-xs text-amber-500 font-medium">Protegido (Requer Cookie)</span>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p className="text-zinc-600 dark:text-zinc-400">Valida a senha antiga informada, gera um novo hash seguro e atualiza no banco de dados.</p>
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Body JSON Exemplo:</span>
                <pre className="mt-1 p-3 bg-zinc-950 text-zinc-50 rounded-lg font-mono text-xs overflow-x-auto">
{`{
  "senhaAntiga": "senha_atual",
  "senhaNova": "nova_senha"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Rota 4: Minhas OS */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded">GET</span>
                <code className="text-sm font-mono font-medium">/api/cliente/minhas-os</code>
              </div>
              <span className="text-xs text-amber-500 font-medium">Protegido (Requer Cookie)</span>
            </div>
            <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
              Retorna todas as Ordens de Serviço (`tbos`) vinculadas exclusivamente ao ID do usuário autenticado na sessão.
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
          CJM Infocell &bull; Painel de Integração e Endpoints
        </div>

      </div>
    </main>
  );
}