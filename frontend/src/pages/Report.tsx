import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import AppLayout from "../Layout/AppLayout";
import { appShareUrl } from "../config/env";

interface Ifindings {
    heading:string,
    explanation:string
}

interface data {
    "summary": string,
    "findings": Ifindings[]
    "what_matters_most": string,
    "how_it_relates_to_symptoms": string,
    "questions_for_doctor": string[]
}

const ReportPage = () => {
    const [data, setData] = useState<data>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<String>()
    const [isCopy, setIsCopy] = useState(false)

    const { id } = useParams()

    const handleCopy = (text: string) => {
        setIsCopy(true)
        navigator.clipboard.writeText(text)
        setTimeout(() => { setIsCopy(false) }, 1000)
    }

    const fetchReport = async () => {
        setLoading(true)
        setError("")
        try {
            const { data } = await apiClient.get(`/report/${id}`)
            setData(data.report)
        } catch (error: any) {
            console.log(error)
            setError(error.response?.data.message || "Somthing went wrong")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchReport()
    }, [])


    if (loading) {
        return <AppLayout>
            <div className="h-screen w-full flex justify-center items-center">
                <div className="h-12 w-12 border-t-2 border-blue-400 animate-spin rounded-full"></div>
            </div>
        </AppLayout>
    }

    if (error) {
        return <AppLayout>
            <div className="h-[200px] flex flex-col items-center ">
                <p className="text-red-400 text-center ">{error}</p>
                <button onClick={fetchReport} className="bg-red-400 text-sm text-white font-semibold px-4 py-1 rounded-md mt-2 cursor-pointer hover:bg-red-600">Try again</button>
            </div>
        </AppLayout>
    }

    return (
        <AppLayout>
            {
                !data ? <div className="h-[200px]">
                    <h1 className="text-center m-8 text-xl font-semibold text-zinc-600">Report not found !</h1>
                </div> : <div className="max-w-2xl mx-auto md:px-4 md:py-12">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-lg font-semibold">
                            Your MRI Explanation
                        </h1>

                        <div className="flex gap-2">


                            <button onClick={() => handleCopy(appShareUrl(`/report/${id}`))} className="text-sm hover:bg-black hover:text-white transition duration-300 border px-3 py-1 rounded-md cursor-pointer">
                                {isCopy ? "Copied!" : "Copy Share URL"}
                            </button>

                            <Link
                                to="/"
                                className="text-sm text-white bg-black hover:bg-white hover:text-black transition duration-300 border px-3 py-1 rounded-md"
                            >
                                Start new report
                            </Link>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg md:p-6 p-5 space-y-6">

                        <p className="text-sm text-gray-700">
                            You're taking an important step by trying to understand your MRI — and that matters.
                        </p>

                        <section>
                            <h2 className="font-medium mb-1">
                                Overview
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {data.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-medium mb-1">
                                What was found
                            </h2>
                            {
                                data.findings.map((item) => (
                                    <p className="text-sm text-gray-700 my-4 leading-relaxed">
                                        {item?.explanation}
                                    </p>
                                ))
                            }
                        </section>

                        <section>
                            <h2 className="font-medium mb-1">
                                What matters most
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {data.what_matters_most}
                            </p>
                        </section>

                        {/* <section>
                            <h2 className="font-medium mb-1">
                                How it may relate to symptoms
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {data.how_it_relates_to_symptoms}
                            </p>
                        </section> */}

                        <section>
                            <h2 className="font-medium mb-1">
                                Questions you might want to ask
                            </h2>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                {data.questions_for_doctor?.map((q: string, i: number) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        </section>

                        <div className="border-t pt-4 text-xs text-gray-500">
                            This is meant to help you understand — not replace a full medical evaluation.
                            If something doesn’t match how you feel, it may be worth discussing with your doctor.
                        </div>
                    </div>
                </div>
            }

        </AppLayout>
    );
}

export default ReportPage