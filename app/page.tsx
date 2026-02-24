import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <TodoList />
      </div>
    </main>
  );
}
