export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  quantity: number;
};

export type Cart = CartItem[];

export function parseCart(cookieValue: string | undefined): Cart {
  if (!cookieValue) return [];
  try {
    return JSON.parse(decodeURIComponent(cookieValue));
  } catch {
    return [];
  }
}

export function serializeCart(cart: Cart): string {
  return encodeURIComponent(JSON.stringify(cart));
}

export function addToCart(cart: Cart, item: Omit<CartItem, "quantity">): Cart {
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    return cart.map((c) =>
      c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
    );
  }
  return [...cart, { ...item, quantity: 1 }];
}

export function removeFromCart(cart: Cart, id: number): Cart {
  return cart.filter((c) => c.id !== id);
}

export function updateQuantity(cart: Cart, id: number, quantity: number): Cart {
  if (quantity <= 0) return removeFromCart(cart, id);
  return cart.map((c) => (c.id === id ? { ...c, quantity } : c));
}

export function cartTotal(cart: Cart): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
