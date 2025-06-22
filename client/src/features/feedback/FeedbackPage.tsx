import React, { useState } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeedbackPageProps {
    analysisId?: string; // Now optional
}

const API = import.meta.env.VITE_API_URL;

const FeedbackPage: React.FC<FeedbackPageProps> = ({ analysisId }) => {
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!analysisId) {
        return (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl">
                No analysis selected for feedback.
            </div>
        );
    }

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.post(`${API}/api/feedback`, {
                analysisId,
                feedback,
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Feedback submission failed:", err);
            setError("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl">
                Thank you for your feedback!
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Share Your Feedback</h2>
            <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Let us know your thoughts about this analysis..."
                rows={4}
                className="mb-4"
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <Button
                onClick={handleSubmit}
                disabled={loading || feedback.trim() === ""}
                className="bg-[#0c77f2] hover:bg-[#075cd1]"
            >
                {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
        </div>
    );
};

export default FeedbackPage;
