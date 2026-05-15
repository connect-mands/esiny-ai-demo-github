import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { COLORS } from "../constants/color";
import AppLayout from "../Layout/AppLayout";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { toast } from "sonner";

export default function Home() {
    const [reportText, setReportText] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (!event.target.files || event.target.files.length === 0) {
            setFile(null);
            return;
        }

        const file = event.target.files[0]
        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
        ];
        const isValid = allowedTypes.includes(file.type) || file.name.match(/\.(pdf|png|jpg|jpeg)$/i);
        if (isValid) {
            setFile(file);
        } else {
            toast.error("Unsupported file type. Please upload a PDF or image file.")
        }
    }

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (reportText.trim() === "" && !file) {
            toast.error("Please provide a report text or upload a file.");
            return;
        }
        setLoading(true);
        const toastId = toast.loading("Generating report")
        try {
            const formData = new FormData();
            formData.append("reportText", reportText);
            formData.append("symptoms", symptoms);
            if (file) {
                formData.append("file", file);
            }

            const { data } = await apiClient.post("/report", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            toast.success("Report generated successfully")
            navigate(`/report/${data.data.reportId}`)
        } catch (error: any) {
            toast.error(error.response.data.message || "Error submitting form")
            console.error("Error submitting form:", error);
        } finally {
            toast.dismiss(toastId)
            setLoading(false);
        }
    }

    return (
        <AppLayout>
            <div className={`sm:w-[100%] max-w-2xl mx-auto py-12 bg-[${COLORS.background}] `}>

                <h1 className="text-3xl font-semibold text-center leading-tight">
                    What Your MRI Actually Means
                    — In Plain English
                </h1>

                <p className="text-sm text-gray-500 text-center mt-3">
                    Paste your MRI report or upload a file to get a simple explanation.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 border border-gray-200 rounded-lg p-6 space-y-6"
                >
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Paste your MRI report
                        </label>
                        <textarea
                            disabled={loading}
                            className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            rows={6}
                            placeholder="Paste findings or impression section..."
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Avoid including personal identifiers
                        </p>
                    </div>
                    {/* File upload , Currently this features is hidden*/}
                    <div className="hidden">
                        <label className="block text-sm font-medium mb-2">
                            Or upload MRI report
                        </label>
                        <input
                            disabled={loading}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            className="w-full border border-gray-200 text-gray-500 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Supported: PDF, JPG, PNG (Max 5MB)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Symptoms (optional)
                        </label>
                        <input
                            disabled={loading}
                            type="text"
                            className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="e.g. back pain, numbness..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>

                    {/* DISCLAIMER BOX */}
                    <div className="border border-gray-200 rounded-md p-3 text-xs text-gray-600 space-y-1">
                        <p>• Not medical advice</p>
                        <p>• For educational purposes only</p>
                        <p>• Do not include personal data</p>
                    </div>

                    {/* CHECKBOX */}
                    <div className="flex items-center gap-2 text-sm">
                        <input
                            required
                            type="checkbox"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            id="t&c"
                            className="cursor-pointer"
                        />
                        <label htmlFor="t&c" className="select-none cursor-pointer">
                            I understand and agree
                        </label>
                    </div>

                    {/* BUTTON */}
                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full cursor-pointer bg-black text-white py-3 rounded-md font-medium transition ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                        {loading ? "Processing..." : "Show Me What My MRI Means"}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}