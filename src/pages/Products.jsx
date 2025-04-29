import ProductList from "../components/ProductList";
export default function Products() {
  return (
    <main className="pt-24 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Нашите свещи
      </h1>
      <ProductList />
    </main>
  );
}
