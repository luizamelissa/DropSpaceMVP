import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Edit, Trash2, ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useRoute } from "wouter";

export default function Suppliers() {
  const { user } = useAuth();
  const [match, params] = useRoute("/store/:storeId/suppliers");
  const storeId = params?.storeId ? parseInt(params.storeId) : 0;

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
  });

  const { data: suppliers, isLoading } = trpc.supplier.listByStore.useQuery({ storeId });
  const createMutation = trpc.supplier.create.useMutation({
    onSuccess: () => {
      resetForm();
      setIsAddSupplierOpen(false);
      trpc.useUtils().supplier.listByStore.invalidate({ storeId });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      country: "",
    });
  };

  const handleAddSupplier = () => {
    if (!formData.name.trim()) return;
    createMutation.mutate({
      storeId,
      ...formData,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Fornecedores</h1>
          </div>
          <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => resetForm()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="supplier-name">Nome do Fornecedor</Label>
                  <Input
                    id="supplier-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Fornecedor ABC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier-email">Email</Label>
                    <Input
                      id="supplier-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contato@fornecedor.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier-phone">Telefone</Label>
                    <Input
                      id="supplier-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier-website">Website</Label>
                  <Input
                    id="supplier-website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://fornecedor.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-address">Endereço</Label>
                  <Textarea
                    id="supplier-address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, número, complemento"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier-city">Cidade</Label>
                    <Input
                      id="supplier-city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier-country">País</Label>
                    <Input
                      id="supplier-country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Brasil"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddSupplierOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddSupplier}
                  disabled={createMutation.isPending || !formData.name.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : suppliers && suppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-6 border-blue-100 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                    {supplier.city && supplier.country && (
                      <p className="text-sm text-gray-600 mt-1">
                        {supplier.city}, {supplier.country}
                      </p>
                    )}
                  </div>
                  <Users className="h-5 w-5 text-blue-600 opacity-50" />
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${supplier.email}`} className="hover:text-blue-600">
                        {supplier.email}
                      </a>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                        {supplier.phone}
                      </a>
                    </div>
                  )}
                  {supplier.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        Visitar Site
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-blue-100">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum fornecedor adicionado</h3>
            <p className="text-gray-600 mb-6">Comece adicionando seu primeiro fornecedor</p>
            <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => resetForm()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label htmlFor="supplier-name">Nome do Fornecedor</Label>
                    <Input
                      id="supplier-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Fornecedor ABC"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplier-email">Email</Label>
                      <Input
                        id="supplier-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contato@fornecedor.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier-phone">Telefone</Label>
                      <Input
                        id="supplier-phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="supplier-website">Website</Label>
                    <Input
                      id="supplier-website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://fornecedor.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier-address">Endereço</Label>
                    <Textarea
                      id="supplier-address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rua, número, complemento"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplier-city">Cidade</Label>
                      <Input
                        id="supplier-city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier-country">País</Label>
                      <Input
                        id="supplier-country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Brasil"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddSupplierOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddSupplier}
                    disabled={createMutation.isPending || !formData.name.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        )}
      </main>
    </div>
  );
}
