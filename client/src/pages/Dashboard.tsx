import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, TrendingUp, ShoppingCart, Users, Settings, LogOut, Menu, X, Store, Home, ArrowLeft, Edit, Trash2, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: stores, isLoading: storesLoading } = trpc.store.list.useQuery();
  
  const createStoreMutation = trpc.store.create.useMutation({
    onSuccess: () => {
      resetForm();
      setIsCreateStoreOpen(false);
      toast.success("Loja criada com sucesso!");
      trpc.useUtils().store.list.invalidate();
    },
    onError: () => {
      toast.error("Erro ao criar loja");
    },
  });

  const updateStoreMutation = trpc.store.update.useMutation({
    onSuccess: () => {
      resetForm();
      setEditingStore(null);
      toast.success("Loja atualizada com sucesso!");
      trpc.useUtils().store.list.invalidate();
    },
    onError: () => {
      toast.error("Erro ao atualizar loja");
    },
  });

  const deleteStoreMutation = trpc.store.delete.useMutation({
    onSuccess: () => {
      toast.success("Loja removida com sucesso!");
      trpc.useUtils().store.list.invalidate();
    },
    onError: () => {
      toast.error("Erro ao remover loja");
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStore = () => {
    if (!storeName.trim()) {
      toast.error("Nome da loja é obrigatório");
      return;
    }
    createStoreMutation.mutate({
      name: storeName,
      description: storeDescription,
      logo: logoPreview || undefined,
    });
  };

  const handleUpdateStore = () => {
    if (!storeName.trim()) {
      toast.error("Nome da loja é obrigatório");
      return;
    }
    updateStoreMutation.mutate({
      id: editingStore.id,
      name: storeName,
      description: storeDescription,
      logo: logoPreview || editingStore.logo,
    });
  };

  const handleEditStore = (store: any) => {
    setEditingStore(store);
    setStoreName(store.name);
    setStoreDescription(store.description || "");
    setLogoPreview(store.logo || null);
    setLogoFile(null);
    setIsCreateStoreOpen(true);
  };

  const handleDeleteStore = (storeId: number) => {
    if (confirm("Tem certeza que deseja remover esta loja? Esta ação não pode ser desfeita.")) {
      deleteStoreMutation.mutate({ id: storeId });
    }
  };

  const resetForm = () => {
    setStoreName("");
    setStoreDescription("");
    setLogoPreview(null);
    setLogoFile(null);
    setEditingStore(null);
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
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-blue-200 shadow-lg transition-all duration-300 sticky top-0 h-screen overflow-y-auto`}>
        <div className="p-4 border-b border-blue-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-blue-600">DropSpace</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 transition">
            <Home className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <Link href="/profile">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              <Users className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Perfil</span>}
            </button>
          </Link>

          <Link href="/settings">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Configurações</span>}
            </button>
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-200">
          <h3 className={`text-xs font-bold text-gray-600 uppercase mb-3 ${!sidebarOpen && "text-center"}`}>
            {sidebarOpen ? "Suas Lojas" : "Lojas"}
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {stores && stores.length > 0 ? (
              stores.map((store) => (
                <Link key={store.id} href={`/store/${store.id}`}>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-100 transition truncate">
                    <Store className="h-4 w-4 flex-shrink-0 text-blue-600" />
                    {sidebarOpen && <span className="truncate">{store.name}</span>}
                  </button>
                </Link>
              ))
            ) : (
              <p className={`text-xs text-gray-500 ${sidebarOpen ? "px-3" : "text-center"}`}>
                {sidebarOpen ? "Nenhuma loja" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-blue-200">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Dialog open={isCreateStoreOpen} onOpenChange={setIsCreateStoreOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setEditingStore(null);
                    resetForm();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Loja
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingStore ? "Editar Loja" : "Criar Nova Loja"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="store-name">Nome da Loja</Label>
                    <Input
                      id="store-name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Ex: Minha Loja"
                      className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-description">Descrição</Label>
                    <Textarea
                      id="store-description"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      placeholder="Descreva sua loja"
                      className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-logo">Logo da Loja</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {logoPreview && (
                        <div className="w-20 h-20 rounded-lg border-2 border-blue-300 overflow-hidden">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label htmlFor="store-logo" className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Selecionar imagem</span>
                          </div>
                          <input
                            id="store-logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateStoreOpen(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={editingStore ? handleUpdateStore : handleCreateStore}
                      disabled={
                        (editingStore ? updateStoreMutation.isPending : createStoreMutation.isPending) ||
                        !storeName.trim()
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {editingStore ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo, {user.name}! 👋</h2>
            <p className="text-gray-600">Gerencie suas lojas e produtos de forma fácil e rápida</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-blue-200 shadow-lg hover:shadow-xl transition bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Lojas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stores?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-blue-200 shadow-lg hover:shadow-xl transition bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Produtos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-blue-200 shadow-lg hover:shadow-xl transition bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-blue-200 shadow-lg hover:shadow-xl transition bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Vendas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">R$ 0,00</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Stores Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Suas Lojas</h3>

            {storesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : stores && stores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                  <Card key={store.id} className="p-6 border-blue-200 shadow-lg hover:shadow-xl transition bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {store.logo && (
                          <div className="w-12 h-12 rounded-lg border border-blue-200 overflow-hidden mb-3">
                            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-gray-900">{store.name}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {store.description || "Sem descrição"}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Store className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-blue-200 space-y-2">
                      <p className="text-sm text-gray-600">
                        Criada em {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <div className="flex gap-2">
                        <Link href={`/store/${store.id}`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                            Gerenciar
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditStore(store)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteStore(store.id)}
                          disabled={deleteStoreMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-blue-200 shadow-lg bg-white">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma loja criada</h4>
                <p className="text-gray-600 mb-6">Crie sua primeira loja para começar a gerenciar produtos</p>
                <Dialog open={isCreateStoreOpen} onOpenChange={setIsCreateStoreOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setEditingStore(null);
                        resetForm();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Loja
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Loja</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="store-name">Nome da Loja</Label>
                        <Input
                          id="store-name"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Ex: Minha Loja"
                          className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="store-description">Descrição</Label>
                        <Textarea
                          id="store-description"
                          value={storeDescription}
                          onChange={(e) => setStoreDescription(e.target.value)}
                          placeholder="Descreva sua loja"
                          className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="store-logo">Logo da Loja</Label>
                        <div className="mt-2 flex items-center gap-4">
                          {logoPreview && (
                            <div className="w-20 h-20 rounded-lg border-2 border-blue-300 overflow-hidden">
                              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <label htmlFor="store-logo" className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                              <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-600 font-medium">Selecionar imagem</span>
                              </div>
                              <input
                                id="store-logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreateStoreOpen(false);
                            resetForm();
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreateStore}
                          disabled={createStoreMutation.isPending || !storeName.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Criar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
