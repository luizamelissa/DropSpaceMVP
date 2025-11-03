import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, Edit, Trash2, Store, Home, ArrowLeft, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { toast } from "sonner";

export default function Products() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/store/:storeId");
  const storeId = params?.storeId ? parseInt(params.storeId) : 0;

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    stock: "",
    sku: "",
    category: "",
  });

  const { data: products, isLoading } = trpc.product.listByStore.useQuery({ storeId });
  const { data: stores } = trpc.store.list.useQuery();
  const store = stores?.find((s) => s.id === storeId);
  
  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      resetForm();
      setIsAddProductOpen(false);
      toast.success("Produto adicionado com sucesso!");
      trpc.useUtils().product.listByStore.invalidate({ storeId });
    },
    onError: () => {
      toast.error("Erro ao adicionar produto");
    },
  });

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      resetForm();
      setEditingProduct(null);
      toast.success("Produto atualizado com sucesso!");
      trpc.useUtils().product.listByStore.invalidate({ storeId });
    },
    onError: () => {
      toast.error("Erro ao atualizar produto");
    },
  });

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      trpc.useUtils().product.listByStore.invalidate({ storeId });
    },
    onError: () => {
      toast.error("Erro ao remover produto");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      costPrice: "",
      stock: "",
      sku: "",
      category: "",
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleAddProduct = () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    createMutation.mutate({
      storeId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      costPrice: formData.costPrice,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      sku: formData.sku,
      category: formData.category,
      image: imagePreview || undefined,
    });
  };

  const handleUpdateProduct = () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    updateMutation.mutate({
      id: editingProduct.id,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      costPrice: formData.costPrice,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      sku: formData.sku,
      category: formData.category,
      image: imagePreview || editingProduct.image,
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      costPrice: product.costPrice || "",
      stock: product.stock?.toString() || "",
      sku: product.sku || "",
      category: product.category || "",
    });
    setImagePreview(product.image || null);
    setImageFile(null);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Tem certeza que deseja remover este produto?")) {
      deleteMutation.mutate({ id: productId });
    }
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
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-blue-600">DropSpace</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/dashboard">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              <Home className="h-5 w-5 flex-shrink-0" />
              <span>Dashboard</span>
            </button>
          </Link>
        </nav>
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
                {store && <p className="text-sm text-gray-600 mt-1">Loja: {store.name}</p>}
              </div>
            </div>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-name">Nome do Produto</Label>
                    <Input
                      id="product-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Camiseta Azul"
                      className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-description">Descrição</Label>
                    <Textarea
                      id="product-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva o produto"
                      className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-price">Preço (R$)</Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-cost">Custo (R$)</Label>
                      <Input
                        id="product-cost"
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        placeholder="0.00"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-stock">Estoque</Label>
                      <Input
                        id="product-stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="0"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-sku">SKU</Label>
                      <Input
                        id="product-sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="Ex: SKU123"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="product-category">Categoria</Label>
                    <Input
                      id="product-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Camisetas"
                      className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-image">Imagem do Produto</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {imagePreview && (
                        <div className="w-20 h-20 rounded-lg border-2 border-blue-300 overflow-hidden">
                          <img src={imagePreview} alt="Produto preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label htmlFor="product-image" className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Selecionar imagem</span>
                          </div>
                          <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddProductOpen(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    disabled={
                      (createMutation.isPending || updateMutation.isPending) ||
                      !formData.name.trim() ||
                      !formData.price.trim()
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editingProduct ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-6 border-blue-200 shadow-lg hover:shadow-xl transition bg-white overflow-hidden">
                  {product.image && (
                    <div className="w-full h-40 rounded-lg border border-blue-200 overflow-hidden mb-4">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description || "Sem descrição"}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm border-t border-blue-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-bold text-gray-900">R$ {parseFloat(product.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estoque:</span>
                      <span className="font-semibold text-gray-900">{product.stock || 0}</span>
                    </div>
                    {product.sku && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">SKU:</span>
                        <span className="font-semibold text-gray-900">{product.sku}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-semibold text-gray-900">{product.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-blue-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        handleEditProduct(product);
                        setIsAddProductOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-blue-200 shadow-lg bg-white">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum produto adicionado</h3>
              <p className="text-gray-600 mb-6">Comece adicionando seu primeiro produto</p>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setEditingProduct(null);
                      resetForm();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Produto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Nome do Produto</Label>
                      <Input
                        id="product-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Camiseta Azul"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-description">Descrição</Label>
                      <Textarea
                        id="product-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descreva o produto"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-price">Preço (R$)</Label>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-cost">Custo (R$)</Label>
                        <Input
                          id="product-cost"
                          type="number"
                          step="0.01"
                          value={formData.costPrice}
                          onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                          placeholder="0.00"
                          className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-stock">Estoque</Label>
                        <Input
                          id="product-stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="0"
                          className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-sku">SKU</Label>
                        <Input
                          id="product-sku"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="Ex: SKU123"
                          className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="product-category">Categoria</Label>
                      <Input
                        id="product-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: Camisetas"
                        className="mt-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-image">Imagem do Produto</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {imagePreview && (
                          <div className="w-20 h-20 rounded-lg border-2 border-blue-300 overflow-hidden">
                            <img src={imagePreview} alt="Produto preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <label htmlFor="product-image" className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600 font-medium">Selecionar imagem</span>
                            </div>
                            <input
                              id="product-image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddProductOpen(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddProduct}
                      disabled={
                        createMutation.isPending ||
                        !formData.name.trim() ||
                        !formData.price.trim()
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Adicionar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
