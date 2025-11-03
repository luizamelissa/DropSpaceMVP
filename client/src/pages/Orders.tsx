import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useRoute } from "wouter";

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  processing: { bg: "bg-blue-100", text: "text-blue-800" },
  shipped: { bg: "bg-purple-100", text: "text-purple-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
};

export default function Orders() {
  const { user } = useAuth();
  const [match, params] = useRoute("/store/:storeId/orders");
  const storeId = params?.storeId ? parseInt(params.storeId) : 0;

  const { data: orders, isLoading } = trpc.order.listByStore.useQuery({ storeId });

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
            <h1 className="text-2xl font-bold text-blue-600">Pedidos</h1>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pagamento</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-gray-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      R$ {parseFloat(order.totalPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge
                        className={`${statusColors[order.status as keyof typeof statusColors]?.bg || "bg-gray-100"} ${statusColors[order.status as keyof typeof statusColors]?.text || "text-gray-800"}`}
                      >
                        {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge
                        variant="outline"
                        className={order.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}
                      >
                        {paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels] || order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-12 text-center border-blue-100">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600">Seus pedidos aparecerão aqui quando você receber as primeiras vendas</p>
          </Card>
        )}
      </main>
    </div>
  );
}
