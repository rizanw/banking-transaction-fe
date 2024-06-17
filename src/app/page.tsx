import ProtectedRoute from "@/components/containers/ProtectedRoute";

export default function Home() {
    return (
        <ProtectedRoute>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to your dashboard!</p>
                </div>
            </main>
        </ProtectedRoute>
    );
}
