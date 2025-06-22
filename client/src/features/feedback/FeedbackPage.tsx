import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import FeedbackPage from "@/features/feedback/FeedbackPage"; // ✅ Imported FeedbackPage

interface AnalysisResult {
    id?: string;
    caption?: string;
    objects?: { label: string; confidence: number }[];
}

const API = import.meta.env.VITE_API_URL;

export default function AnalyzePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const imageUrl: string | null = location.state?.imageUrl || null;

    useEffect(() => {
        if (!imageUrl) {
            setError("No image URL provided for analysis.");
            setLoading(false);
            return;
        }

        setImagePreviewUrl(imageUrl);

        const analyzeImage = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                const accessToken = session?.access_token;

                if (!accessToken) {
                    setError("You must be logged in to analyze images.");
                    setLoading(false);
                    return;
                }

                const res = await axios.post(
                    `${API}/api/analyze`,
                    { imageUrl },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setResult(res.data.data);
            } catch (err: any) {
                console.error("Analysis error:", err);
                setError("Failed to analyze image.");
            } finally {
                setLoading(false);
            }
        };

        analyzeImage();
    }, [imageUrl]);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Image Analysis Result", 10, 10);

        if (result?.caption) {
            doc.setFontSize(12);
            doc.text(`Caption: ${result.caption}`, 10, 20);
        }

        if (result?.objects?.length) {
            doc.setFontSize(12);
            doc.text("Detected Objects:", 10, 30);
            result.objects.forEach((obj, idx) => {
                doc.text(`- ${obj.label}: ${obj.confidence.toFixed(1)}%`, 10, 40 + idx * 10);
            });
        }

        doc.save("analysis_result.pdf");
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4 animate-pulse">
                    <div className="w-80 h-64 bg-gray-200 rounded-xl" />
                    <div className="w-1/2 h-6 bg-gray-200 rounded" />
                    <div className="w-1/3 h-4 bg-gray-200 rounded" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] gap-4">
                    <p className="text-lg font-medium text-red-600">{error}</p>
                    <Button onClick={() => navigate("/upload")} className="bg-[#0c77f2]">
                        Go Back
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <motion.div
                className="flex flex-col items-center gap-8 p-6 md:p-10 bg-gray-50 min-h-screen"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-extrabold text-[#0d141c] tracking-tight mb-4">
                    Image Analysis Result
                </h1>

                {imagePreviewUrl && (
                    <motion.div
                        className="overflow-hidden rounded-2xl border shadow-md bg-white p-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img
                            src={imagePreviewUrl}
                            alt="Analyzed"
                            className="w-full max-w-md rounded-xl object-cover"
                        />
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {result.caption && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">Most Accurate Caption</h2>
                                <p className="text-base text-blue-600 italic mt-2 bg-blue-50 px-4 py-2 rounded-xl">
                                    "{result.caption}"
                                </p>
                            </div>
                        )}

                        {result.objects && result.objects.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">Detected Objects</h2>
                                <div className="space-y-2">
                                    {result.objects.map((obj, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl"
                                        >
                                            <span className="text-gray-700 font-medium">{obj.label}</span>
                                            <span className="text-sm font-semibold text-blue-600">
                                                {obj.confidence.toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button
                        onClick={() => navigate("/upload")}
                        className="bg-[#0c77f2] hover:bg-[#075cd1]"
                    >
                        Analyze Another Image
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                        Export as PDF
                    </Button>
                </div>

                {/*  Inject Feedback component below the analysis result */}
                {result?.id && (
                    <div className="w-full max-w-3xl mt-10">
                        <FeedbackPage analysisId={result.id} />
                    </div>
                )}
            </motion.div>
        </>
    );
}
