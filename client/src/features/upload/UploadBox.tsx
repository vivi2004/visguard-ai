import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_API_URL;

export default function UploadBox() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [userImages, setUserImages] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const fetchUserImages = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user.id;

        if (!userId) return;

        const { data, error } = await supabase
            .from("images")
            .select("image_url")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (data) {
            setUserImages(data.map((img) => img.image_url));
        }
        if (error) {
            console.error("Error fetching images:", error.message);
        }
    };

    const uploadToBackend = async () => {
        if (!selectedFile) return setMessage("No file selected");

        setLoading(true);
        setMessage("");
        setUploadedImageUrl(null);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const accessToken = session?.access_token;
            if (!accessToken) {
                setMessage("Authentication required");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("image", selectedFile);

            const res = await axios.post(`${API}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setMessage("Upload successful");
            setUploadedImageUrl(res.data.url);
            setSelectedFile(null);
            fetchUserImages();
        } catch (err: any) {
            console.error(err);
            setMessage("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = () => {
        if (uploadedImageUrl) {
            navigate("/analyze", { state: { imageUrl: uploadedImageUrl } });
        }
    };

    const handleDelete = async (imageUrl: string) => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const userId = session?.user.id;
        if (!userId) return alert("Login required");

        const { error } = await supabase
            .from("images")
            .delete()
            .eq("image_url", imageUrl)
            .eq("user_id", userId);

        if (error) {
            console.error("Delete error:", error.message);
            alert("Failed to delete image");
        } else {
            fetchUserImages();
            if (uploadedImageUrl === imageUrl) setUploadedImageUrl(null);
        }
    };

    useEffect(() => {
        fetchUserImages();
    }, []);

    return (
        <div className="flex flex-col items-center lg:justify-center px-4 py-6 sm:py-10 lg:min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Header */}
            <div className="flex flex-col max-w-xl px-4 text-center mb-8">
                <h2 className="text-[#0d141c] text-[24px] sm:text-[28px] font-bold leading-tight pb-1">
                    Welcome to VisGuard AI
                </h2>
                <p className="text-[#0d141c] text-base font-normal leading-normal">
                    Upload an image to start the analysis. Our AI will provide a detailed caption and identify objects within the image.
                </p>
            </div>

            {/* Upload Box */}
            <motion.div
                className="flex flex-col items-center gap-6 rounded-2xl border-2 border-dashed border-[#cedae8] bg-white px-6 py-10 text-center w-full max-w-xl shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <p className="text-lg font-bold text-gray-800 dark:text-white">Upload an Image For Analysis</p>
                <p className="text-sm text-[#49709c] dark:text-slate-300">Drag and Drop or Browse Your Files</p>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <Button onClick={handleUploadClick} variant="outline" className="rounded-xl">
                    Select Image
                </Button>

                {selectedFile && (
                    <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-sm font-medium text-[#0c77f2]">{selectedFile.name}</p>
                        <Button
                            onClick={uploadToBackend}
                            disabled={loading}
                            className="bg-[#0c77f2] hover:bg-[#075cd1] text-white"
                        >
                            {loading ? "Uploading..." : "Upload Image"}
                        </Button>
                    </motion.div>
                )}

                {message && (
                    <p className="text-sm mt-2 text-[#0d141c] dark:text-white font-medium">{message}</p>
                )}

                {uploadedImageUrl && (
                    <motion.div
                        className="mt-4 flex flex-col items-center gap-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <p className="font-bold dark:text-white">Latest Uploaded Image</p>
                        <img
                            src={uploadedImageUrl}
                            alt="Latest upload"
                            className="max-w-xs rounded-xl border shadow"
                        />
                        <div className="flex gap-4">
                            <Button onClick={handleAnalyze} className="bg-green-600 hover:bg-green-700 text-white">
                                Analyze Image
                            </Button>
                            <Button
                                onClick={() => handleDelete(uploadedImageUrl)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </motion.div>
                )}

                {userImages.length > 0 && (
                    <div className="mt-8 w-full">
                        <p className="font-bold text-[#0d141c] dark:text-white mb-4 text-lg text-center">
                            Your Uploaded Images
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                            {userImages.map((url, index) => (
                                <motion.div
                                    key={index}
                                    className="relative group"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <img
                                        src={url}
                                        alt={`Uploaded #${index + 1}`}
                                        className="w-full max-w-[200px] rounded-lg border shadow"
                                    />
                                    <button
                                        onClick={() => handleDelete(url)}
                                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-90 group-hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
