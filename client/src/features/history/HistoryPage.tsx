import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const API = import.meta.env.VITE_API_URL;

interface HistoryItem {
    id: string;
    image_url: string;
    caption?: string;
    objects?: { label: string; confidence: number }[];
    created_at: string;
}

function HistoryCard({ item }: { item: HistoryItem }) {
    return (
        <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all">
            <CardContent className="p-4">
                <img
                    src={item.image_url}
                    alt="Analyzed"
                    className="w-full h-48 object-cover rounded-xl mb-3"
                    onError={(e) => ((e.target as HTMLImageElement).src = "/fallback.png")}
                />
                {item.caption && (
                    <p className="italic text-muted-foreground mb-2">"{item.caption}"</p>
                )}
                {item.objects?.map((obj, i) => (
                    <p key={i} className="text-sm text-foreground">
                        • {obj.label} ({obj.confidence.toFixed(1)}%)
                    </p>
                ))}
                <p className="text-xs text-muted-foreground mt-3">
                    {new Date(item.created_at).toLocaleString()}
                </p>
            </CardContent>
        </Card>
    );
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const token = session?.access_token;
            if (!token) throw new Error("Unauthorized");

            const res = await axios.get(`${API}/api/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHistory(res.data.data);
            setError("");
        } catch (err: any) {
            console.error("Failed to fetch history", err);
            setError("Failed to fetch history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <>
            <Header />
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Your Analysis History</h1>
                    {!loading && !error && history.length > 0 && (
                        <p className="text-muted-foreground text-sm">
                            Total images analyzed:{" "}
                            <span className="font-semibold">{history.length}</span>
                        </p>
                    )}
                </div>

                {/* History Grid */}
                {loading ? (
                    <p className="text-center text-muted-foreground">Loading history...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : history.length === 0 ? (
                    <p className="text-center text-muted-foreground">No history found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {history.map((item) => (
                            <HistoryCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
