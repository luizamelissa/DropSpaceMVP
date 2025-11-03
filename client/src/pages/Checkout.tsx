import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ShoppingCart, Lock, CreditCard } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Checkout() {
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const cartItems = [
    { id: 1, name: "Produto Exemplo", price: 99.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  const handleNext = () => {
    if (step === "cart") setStep("shipping");
    else if (step === "shipping") setStep("payment");
    else if (step === "payment") setStep("confirmation");
  };

  const handleBack = () => {
    if (step === "shipping") setStep("cart");
    else if (step === "payment") setStep("shipping");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3 ${step === "cart" || step === "shipping" || step === "payment" || step === "confirmation" ? "text-blue-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === "cart" || step === "shipping" || step === "payment" || step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    1
                  </div>
                  <span className="font-medium">Carrinho</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
                <div className={`flex items-center gap-3 ${step === "shipping" || step === "payment" || step === "confirmation" ? "text-blue-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === "shipping" || step === "payment" || step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    2
                  </div>
                  <span className="font-medium">Entrega</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
                <div className={`flex items-center gap-3 ${step === "payment" || step === "confirmation" ? "text-blue-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === "payment" || step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    3
                  </div>
                  <span className="font-medium">Pagamento</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
                <div className={`flex items-center gap-3 ${step === "confirmation" ? "text-blue-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    4
                  </div>
                  <span className="font-medium">Confirmação</span>
                </div>
              </div>
            </div>

            {/* Cart Step */}
            {step === "cart" && (
              <Card className="p-6 border-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Seu Carrinho</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
                  Continuar para Entrega
                </Button>
              </Card>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <Card className="p-6 border-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações de Entrega</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="João Silva"
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        placeholder="joao@email.com"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço de Entrega</Label>
                    <Textarea
                      id="address"
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      placeholder="Rua, número, complemento, cidade, estado, CEP"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Continuar para Pagamento
                  </Button>
                </div>
              </Card>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <Card className="p-6 border-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informações de Pagamento
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Data de Validade</Label>
                      <Input
                        id="expiry"
                        value={formData.cardExpiry}
                        onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                        placeholder="MM/AA"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVV</Label>
                      <Input
                        id="cvc"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        placeholder="123"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-800">Seus dados de pagamento são criptografados e seguros</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Confirmar Pedido
                  </Button>
                </div>
              </Card>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && (
              <Card className="p-6 border-blue-100 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h2>
                  <p className="text-gray-600">Seu pedido foi recebido com sucesso</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-600 mb-2">Número do Pedido:</p>
                  <p className="text-lg font-semibold text-gray-900">#123456</p>
                </div>
                <p className="text-gray-600 mb-6">
                  Um email de confirmação foi enviado para {formData.customerEmail}
                </p>
                <Link href="/">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Voltar à Página Inicial
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 border-blue-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Resumo do Pedido
              </h3>
              <div className="space-y-3 mb-4 border-b border-gray-200 pb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-medium text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">R$ {shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
