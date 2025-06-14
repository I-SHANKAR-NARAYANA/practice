const { connect } = require("./connection");
const { ObjectId } = require("mongodb");
async function createProduct(product) {
  const db = await connect();
  const result = await db.collection("products").insertOne({
    ...product,
    createdAt: new Date()
  });
  return result.insertedId;
}

async function getProducts(filter = {}) {
  const db = await connect();
  return db.collection("products").find(filter).toArray();
}

async function updateProduct(id, updates) {
  const db = await connect();
  return db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}


async function deleteProduct(id) {
  const db = await connect();
  return db.collection("products").deleteOne({ _id: new ObjectId(id) });
}

async function demo() {
  const id = await createProduct({ name: "Laptop", price: 999, stock: 10 });
  console.log("Created:", id);
  const all = await getProducts();
  console.log("All products:", all);
  await updateProduct(id, { price: 899 });
  console.log("Price updated to 899");
}
demo().catch(console.error);

