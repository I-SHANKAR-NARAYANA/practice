import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ProductSchema = z.object({
  name:     z.string().min(2),
  price:    z.number().positive(),
  category: z.string(),
});

const products: any[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const data = category
    ? products.filter(p => p.category === category)
    : products;
  return NextResponse.json({ data, count: data.length });
}

export async function POST(request: NextRequest) {
  try {
    const body      = await request.json();
    const validated = ProductSchema.parse(body);
    const product   = { id: Date.now(), ...validated, createdAt: new Date().toISOString() };
    products.push(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


