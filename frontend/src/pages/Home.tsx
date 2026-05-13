import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { COLORS } from "../constants/color";
import AppLayout from "../Layout/AppLayout";
import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { footerLinks, popularTopics } from "../components/Footer";
import { pathToHomeHashFragment } from "../config/env";

type AnchorSection = { id: string; title: string; body: string };

const PRIMARY_SECTIONS: AnchorSection[] = [
    {
        id: "why-endoscopic",
        title: "Why endoscopic spine surgery?",
        body: "Endoscopic approaches use small incisions and a camera to treat spine conditions with less tissue disruption than many open procedures. Recovery timelines vary by person and condition. Ask a qualified spine specialist whether endoscopic options may be appropriate for you.",
    },
    {
        id: "meet-esiny",
        title: "Meet ESINY",
        body: "The Endoscopic Spine Institute of New York focuses on minimally invasive and endoscopic spine care, clear communication, and shared decision-making with your care team.",
    },
    {
        id: "blog",
        title: "Blog & resources",
        body: "We share plain-language information about spine health and treatment concepts. This MRI explainer is educational only and does not replace an in-person evaluation.",
    },
    {
        id: "contact",
        title: "Contact us",
        body: "For appointments or clinical questions, use your usual office or referral channels. To turn MRI report wording into a simpler summary (not medical advice), use the form above.",
    },
];

const STUB_BODY =
    "This section is a placeholder on the explainer app. For full practice information, visit our main website or contact the office directly.";

function buildHomeAnchorSections(): AnchorSection[] {
    const seen = new Set(PRIMARY_SECTIONS.map((s) => s.id));
    const out: AnchorSection[] = [...PRIMARY_SECTIONS];

    for (const item of footerLinks) {
        const id = pathToHomeHashFragment(item.to);
        if (!seen.has(id)) {
            seen.add(id);
            out.push({ id, title: item.label, body: STUB_BODY });
        }
    }
    for (const topic of popularTopics) {
        const id = pathToHomeHashFragment(topic.to);
        if (!seen.has(id)) {
            seen.add(id);
            out.push({ id, title: topic.label, body: STUB_BODY });
        }
    }
    const termsExtra = pathToHomeHashFragment("/terms-of-service");
    if (!seen.has(termsExtra)) {
        out.push({
            id: termsExtra,
            title: "Terms & conditions",
            body: STUB_BODY,
        });
    }
    return out;
}

export default function Home() {
    const [reportText, setReportText] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    const anchorSections = useMemo(() => buildHomeAnchorSections(), []);

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
            alert("Please provide a report text or upload a file.");
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

                    {/* TEXT INPUT */}
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

                    {/* FILE INPUT */}
                    <div>
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

            <div className="max-w-2xl mx-auto px-4 pb-24 space-y-16">
                {anchorSections.map((s) => (
                    <section
                        key={s.id}
                        id={s.id}
                        className="scroll-mt-32 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-xl font-semibold text-zinc-800">{s.title}</h2>
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{s.body}</p>
                    </section>
                ))}
            </div>
        </AppLayout>
    );
}