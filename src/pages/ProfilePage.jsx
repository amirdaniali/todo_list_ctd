import {useState, useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {componentStyle} from "../shared/Styles.jsx";

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
        <div style={componentStyle.page}>
            <div style={componentStyle.layout}>
                <div
                    style={componentStyle.mainContent}
                >
                    <header style={componentStyle.profileHeader}>
                        <h2 style={componentStyle.profileTitle}>Profile</h2>
                        <p style={componentStyle.profileSubtitle}>
                            You can only see this page if you are logged in.
                        </p>
                    </header>

                    <section style={componentStyle.profileSection}>
                        <h3 style={componentStyle.profileSectionTitle}>Account</h3>
                        <div style={componentStyle.profileCard}>
                            <p style={componentStyle.profileParagraph}>
                                <strong>Email:</strong> {email}
                            </p>
                            <p style={componentStyle.profileParagraphLast}>
                                <strong>Status:</strong>{" "}
                                {token ? "Authenticated" : "Not authenticated"}
                            </p>
                        </div>
                    </section>

                    <section style={componentStyle.profileSection}>
                        <h3 style={componentStyle.profileSectionTitle}>Todo Statistics</h3>

                        <div style={componentStyle.profileCard}>
                            {loading && (
                                <p style={componentStyle.profileLoading}>
                                    Loading statistics...
                                </p>
                            )}

                            {error && (
                                <p style={componentStyle.profileError}>{error}</p>
                            )}

                            {!loading && !error && (
                                <>
                                    {total === 0 ? (
                                        <p style={componentStyle.profileEmpty}>
                                            You have no todos yet.
                                        </p>
                                    ) : (
                                        <div style={componentStyle.profileStatsGrid}>
                                            <div>
                                                <p style={componentStyle.profileStatsLabel}>
                                                    Total todos
                                                </p>
                                                <p style={componentStyle.profileStatsValue}>
                                                    {total}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={componentStyle.profileStatsLabel}>
                                                    Completed
                                                </p>
                                                <p style={componentStyle.profileStatsValue}>
                                                    {completed}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={componentStyle.profileStatsLabel}>Active</p>
                                                <p style={componentStyle.profileStatsValue}>
                                                    {active}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={componentStyle.profileStatsLabel}>
                                                    Completion
                                                </p>
                                                <p style={componentStyle.profileStatsValue}>
                                                    {completionPercent}%
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
