import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Lock, Eye, Save, X, User, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    language: "pt-BR",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    notifications: {
      newOrders: true,
      productUpdates: true,
      weeklyReport: true,
    },
    privacy: {
      publicProfile: false,
      showStores: false,
    },
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-blue-200 shadow-lg sticky top-0 h-screen overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-blue-600">DropSpace</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation("/dashboard")}
                className="p-2 hover:bg-blue-100 rounded-lg transition"
                title="Voltar"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Editar
              </Button>
            )}
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Preferências Gerais */}
          <Card className="p-6 sm:p-8 border-blue-200 shadow-lg bg-white">
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Preferências Gerais</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-semibold block mb-2">Idioma</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-blue-50 disabled:cursor-not-allowed"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold block mb-2">Moeda Padrão</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-blue-50 disabled:cursor-not-allowed"
                >
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold block mb-2">Fuso Horário</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-blue-50 disabled:cursor-not-allowed"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notificações */}
          <Card className="p-6 sm:p-8 border-blue-200 shadow-lg bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Notificações</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-900">Novos Pedidos</p>
                  <p className="text-sm text-gray-600">Receber notificações de novos pedidos</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.newOrders}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newOrders: e.target.checked },
                    })
                  }
                  disabled={!isEditing}
                  className="h-5 w-5 cursor-pointer disabled:cursor-not-allowed accent-blue-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-900">Atualizações de Produtos</p>
                  <p className="text-sm text-gray-600">Notificações sobre mudanças em produtos</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.productUpdates}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, productUpdates: e.target.checked },
                    })
                  }
                  disabled={!isEditing}
                  className="h-5 w-5 cursor-pointer disabled:cursor-not-allowed accent-blue-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-900">Relatórios Semanais</p>
                  <p className="text-sm text-gray-600">Receber relatório semanal de vendas</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReport}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReport: e.target.checked },
                    })
                  }
                  disabled={!isEditing}
                  className="h-5 w-5 cursor-pointer disabled:cursor-not-allowed accent-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Privacidade */}
          <Card className="p-6 sm:p-8 border-blue-200 shadow-lg bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Privacidade</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-900">Perfil Público</p>
                  <p className="text-sm text-gray-600">Permitir que outros vejam seu perfil</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.publicProfile}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, publicProfile: e.target.checked },
                    })
                  }
                  disabled={!isEditing}
                  className="h-5 w-5 cursor-pointer disabled:cursor-not-allowed accent-blue-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-900">Mostrar Lojas Públicas</p>
                  <p className="text-sm text-gray-600">Exibir suas lojas no diretório</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.showStores}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showStores: e.target.checked },
                    })
                  }
                  disabled={!isEditing}
                  className="h-5 w-5 cursor-pointer disabled:cursor-not-allowed accent-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Segurança */}
          <Card className="p-6 sm:p-8 border-blue-200 shadow-lg bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Segurança</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Sua senha é gerenciada pelo provedor de autenticação. Para alterá-la, acesse sua conta no provedor.
              </p>
            </div>
          </Card>

          {/* Sair da Conta */}
          <Card className="p-6 sm:p-8 border-red-200 bg-red-50 shadow-lg">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Sair da Conta</h2>
            <p className="text-red-800 mb-6">
              Você será desconectado de todas as suas sessões.
            </p>
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
            >
              Sair
            </Button>
          </Card>

          {/* Botões de Ação */}
          {isEditing && (
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 py-3"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
