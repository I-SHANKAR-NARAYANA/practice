interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

interface User {
  id: number;
  name: string;
  email: string;
}

class InMemoryUserRepo implements Repository<User, number> {
  private store = new Map<number, User>();

  async findById(id: number) { return this.store.get(id) ?? null; }
  async findAll()            { return [...this.store.values()]; }
  async save(user: User)     { this.store.set(user.id, user); return user; }
  async delete(id: number)   { this.store.delete(id); }
}

async function demo() {
  const repo = new InMemoryUserRepo();
  await repo.save({ id: 1, name: "Alice", email: "alice@example.com" });
  await repo.save({ id: 2, name: "Bob",   email: "bob@example.com" });
  console.log("All:", await repo.findAll());
  console.log("Find 1:", await repo.findById(1));
  await repo.delete(1);
  console.log("After delete:", await repo.findAll());
}

demo();
