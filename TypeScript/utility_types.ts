// Practising TypeScript built-in and custom utility types

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

type ProductPreview  = Pick<Product, "id" | "name" | "price">;
type CreateProduct   = Omit<Product, "id">;
type PartialProduct  = Partial<Product>;
type ReadonlyProduct = Readonly<Product>;

type Nullable<T>              = { [K in keyof T]: T[K] | null };
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

const preview: ProductPreview = { id: 1, name: "Book", price: 19.99 };
const draft: CreateProduct    = { name: "Pen", price: 1.99, description: "Blue pen", stock: 100 };

function updateProduct(id: number, updates: PartialProduct): void {
  console.log(`Updating product ${id}:`, updates);
}

updateProduct(1, { price: 14.99, stock: 50 });
console.log(preview, draft);
