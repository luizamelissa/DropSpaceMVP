import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <header className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-600">
                {APP_TITLE}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" onClick={logout} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Bem-vindo de volta, <span className="text-blue-600">{user?.name}!</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sua plataforma está pronta. Acesse o dashboard para gerenciar suas lojas e produtos.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl">
                Ir para Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-white">{APP_TITLE}</h1>
          </div>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <span className="text-white font-semibold text-sm">✨ Bem-vindo ao DropSpace</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Gerencie suas lojas com estilo
          </h2>
          
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Crie lojas, adicione produtos, gerencie fornecedores e acompanhe suas vendas tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-xl"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Fazer Login
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-white mb-2">Crie Lojas</h3>
            <p className="text-blue-100">Configure suas lojas em segundos e comece a vender</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">Gerencie Produtos</h3>
            <p className="text-blue-100">Adicione, edite e remova produtos facilmente</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Acompanhe Vendas</h3>
            <p className="text-blue-100">Veja suas métricas e pedidos em tempo real</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">Por que escolher DropSpace?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold">Interface Intuitiva</p>
                <p className="text-blue-100 text-sm">Fácil de usar, mesmo para iniciantes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold">Funciona em Celular</p>
                <p className="text-blue-100 text-sm">Acesse de qualquer dispositivo</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold">Dados Seguros</p>
                <p className="text-blue-100 text-sm">Suas informações protegidas</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-blue-100">
          <p>&copy; 2024 {APP_TITLE}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
