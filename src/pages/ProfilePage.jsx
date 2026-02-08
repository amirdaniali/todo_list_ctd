import {useState, useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function ProfilePage() {
    const {email, token} = useAuth();

    const [todoStats, setTodoStats] = useState({
        total: 0,
        completed: 0,
        active: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTodoStats() {
            if (!token) return;

            try {
                setLoading(true);
                setError("");

                const options = {
                    method: "GET",
                    headers: {"X-CSRF-TOKEN": token},
                    credentials: "include",
                };

                const response = await fetch(`${baseUrl}/tasks`, options);

                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch todos");
                }

                const todos = await response.json();

                const total = todos.length;
                const completed = todos.filter((todo) => todo.isCompleted).length;
                const active = total - completed;

                setTodoStats({total, completed, active});
            } catch (err) {
                setError(`Error loading statistics: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchTodoStats();
    }, [token]);

    const {total, completed, active} = todoStats;
    const completionPercent =
        total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <>
            <h2>Profile Page</h2>
            <p>You can only see this page if you are logged in</p>

            <section>
                <h3>Account</h3>
                <p>
                    <strong>Email:</strong> {email}
                </p>
                <p>
                    <strong>Status:</strong> {token ? "Authenticated" : "Not authenticated"}
                </p>
            </section>

            <section>
                <h3>Todo Statistics</h3>

                {loading && <p>Loading statistics...</p>}

                {error && <p style={{color: "red"}}>{error}</p>}

                {!loading && !error && (
                    <>
                        {total === 0 ? (
                            <p>You have no todos yet.</p>
                        ) : (
                            <>
                                <p>Total todos: {total}</p>
                                <p>Completed todos: {completed}</p>
                                <p>Active todos: {active}</p>
                                <p>Completion: {completionPercent}%</p>
                            </>
                        )}
                    </>
                )}
            </section>
        </>
    );
}
