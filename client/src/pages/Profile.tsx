import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Edit2, Save, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "",
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      company: "",
    });
    setIsEditing(false);
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
              <User className="h-5 w-5 text-white" />
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
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 border-blue-200 shadow-lg bg-white">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 mt-1">
                  Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="text-gray-700 font-semibold block mb-2">
                  Nome Completo
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                  />
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-900 font-medium">{formData.name || "Não informado"}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                  />
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-900 font-medium">{formData.email || "Não informado"}</p>
                  </div>
                )}
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-semibold block mb-2">
                  Telefone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                  />
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-900 font-medium">{formData.phone || "Não informado"}</p>
                  </div>
                )}
              </div>

              {/* Empresa */}
              <div>
                <Label htmlFor="company" className="text-gray-700 font-semibold block mb-2">
                  Empresa/Negócio
                </Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Seu negócio"
                    className="border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                  />
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-900 font-medium">{formData.company || "Não informado"}</p>
                  </div>
                )}
              </div>

              {/* Data de Cadastro */}
              <div>
                <Label className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Data de Cadastro
                </Label>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-blue-200">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
