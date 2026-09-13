export default function AppPage() {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-h1 font-semibold text-ink">
          What do you want to know?
        </h1>
        <p className="mt-2 text-body text-gray-600">
          Choose an AI provider and database connection to start a new chat.
        </p>
      </div>
    </main>
  );
}
