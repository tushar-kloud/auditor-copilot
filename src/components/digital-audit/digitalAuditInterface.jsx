import react, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAction } from "../../redux/actions/actionActions";
import { auditAccountVerificationAPI, auditActivityStatusVerificationAPI, auditCensoredDetectionAPI } from "../../redux/actions/auditActions";

const tasks = [
    {
        id: "account-verification",
        title: "Account Verification Status",
        description: "Check if an account is verified.",
        platforms: ["Facebook", "Youtube"],
    },
    {
        id: "activity-status",
        title: "Activity Status Verification",
        description: "Analyze recent activity for legitimacy.",
        platforms: ["Twitter"],
    },
    {
        id: "engagement-detector",
        title: "Detect controversial interactions",
        description: "Identify harmful or inappropriate interactions.",
        platforms: ["Twitter"],
    },
];

const brandHandles = [
    "Aashirvaad",
    "Sunfeast",
    "Bingo!",
    "Kitchens of India",
    "Sunfeast Yippee!",
    "B Natural",
    "Sunfeast Milkshake",
    "mint-o",
    "Candyman",
    "Jelimals",
    "GumOn",
    "Fabelle",
    "Sunbean",
    "ITC Master Chef",
    "Farmland",
    "Sunrise",
    "Right Shift",
    "Sunfeast Fantastik!",

    "EDW Essenza",
    "Dermafique",
    "Fiama",
    "Vivel",
    "Engage",
    "Superia",
    "Nimyle",
    "Nimeasy",
    "Nimwash",
    "SavlonShower to Shower",
    "Charmis",

    "Classmate",
    "Paperkraft",

    "AIM",
    "Homelites",
    "Dazzle",
    "Mangaldeep"];

//   const platforms = ["Facebook", "YouTube", "Instagram", "Twitter"];

const DigitalAuditInterface = ({ action }) => {
    const [step, setStep] = useState(1);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [handle, setHandle] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [report, setReport] = useState(null);

    const dispatch = useDispatch();

    const auditAccountVerification = useSelector((state) => state.auditAccountVerification);
    const { loading: loadingAccountVerification, error: errorAccountVerification, success: successAccountVerification, accountVerificationInfo } = auditAccountVerification;

    const auditActivityStatusVerification = useSelector((state) => state.auditActivityStatusVerification);
    const { loading: loadingActivityStatusVerification, error: errorActivityStatusVerification, success: successActivityStatusVerification, activityStatusVerificationInfo } = auditActivityStatusVerification;

    const auditCensoredDetection = useSelector((state) => state.auditCensoredDetection);
    const { loading: loadingCensoredDetection, error: errorCensoredDetection, success: successCensoredDetection, censoredDetectionInfo } = auditCensoredDetection;

    // console.log('platform: ',accountVerificationInfo.platform);

    //     console.log(`Platform: ${data.platform}\n`);
    // console.log("Detailed Report:\n");


    const startProcessing = () => {
        setLoading(true);
        let taskInterval = 300; // default interval

        if (selectedTask.id === "account-verification") {
            dispatch(auditAccountVerificationAPI(selectedPlatform, handle));
            taskInterval = 600; // faster progress for this task
        } else if (selectedTask.id === "activity-status") {
            dispatch(auditActivityStatusVerificationAPI(selectedPlatform, url));
            taskInterval = 300; // slower progress for this task
        } else if (selectedTask.id === "engagement-detector") {
            dispatch(auditCensoredDetectionAPI(selectedPlatform, url));
            taskInterval = 400; // even slower progress for this task
        }

        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    generateReport();
                    return 100;
                }
                return prev + 10;
            });
        }, taskInterval);
    };

    const generateReport = () => {
        setReport({
            status: "Success",
            details: selectedTask.id === "account-verification"
                ? `${handle} is verified ✅ on ${selectedPlatform}`
                : `URL ${url} analyzed successfully for ${selectedTask.id}. No major issues detected.`
        });
    };

    const reset = () => {
        setStep(1);
        setSelectedTask(null);
        setSelectedPlatform(null);
        setHandle("");
        setUrl("");
        setReport(null);
        setProgress(0);
        setLoading(false);
    };

    useEffect(() => {
        if (!loading && report && step === 4) {
            setStep(5);
        }
    }, [loading, report, step]);

    useEffect(() => {

        if (action) {
            dispatch(setAction(action))
        }

    }, [])

    return (
        <div className="max-w-2xl mx-auto space-y-6 py-10">
            {step >= 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select a Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {tasks.map((task) => (
                                <Card
                                    key={task.id}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setReport(null)
                                        setStep(2);
                                    }}
                                    className={`cursor-pointer transition-all hover:shadow-lg border ${selectedTask?.id === task.id ? "border-primary" : "border-muted"
                                        }`}
                                >
                                    <CardHeader className="flex flex-col h-full">
                                        <div className="flex-1">
                                            <CardTitle className="text-base min-h-[48px]">{task.title}</CardTitle>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{task.description}</p>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {step >= 2 && selectedTask && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select a Platform</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedTask && selectedTask.platforms.map((platform) => (
                            <Button
                                key={platform}
                                variant={selectedPlatform === platform ? "default" : "outline"}
                                className="w-full justify-start"
                                onClick={() => {
                                    setSelectedPlatform(platform);
                                    setReport(null)
                                    setStep(3);
                                }}
                            >
                                {platform}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            )}

            {step >= 3 && selectedPlatform && (
                <Card>
                    <CardHeader>
                        <CardTitle>{selectedTask.id === "account-verification" ? "Select a Handle" : "Enter a URL"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedTask.id === "account-verification" ? (
                            <div className="grid grid-cols-3 gap-4">
                                {brandHandles.map((hnd) => (
                                    <Button
                                        key={hnd}
                                        variant={handle === hnd ? "default" : "outline"}
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setHandle(hnd);
                                            setReport(null)
                                            setStep(4);
                                        }}
                                    >
                                        {hnd}
                                    </Button>
                                ))}
                            </div>

                        ) : (
                            <>
                                <Label htmlFor="url">Social Media Post/Content URL</Label>
                                <Input
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/post"
                                />
                                <Button
                                    className="w-full"
                                    onClick={() => url && setStep(4)}
                                    disabled={!url}
                                >
                                    Continue
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {step >= 4 && (handle || url) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Processing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <>
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-center text-sm text-muted-foreground">{progress}% completed</p>
                            </>
                        ) : (
                            <Button className="w-full" onClick={startProcessing}>
                                Start Analysis
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {step >= 5 && selectedTask && (
                <Card>
                    <CardHeader>
                        <CardTitle>Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {(() => {
                            let report;
                            switch (selectedTask.id) {
                                case "account-verification":
                                    report = accountVerificationInfo;
                                    break;
                                case "activity-status":
                                    report = activityStatusVerificationInfo;
                                    break;
                                case "engagement-detector":
                                    report = censoredDetectionInfo;
                                    break;
                                default:
                                    report = null;
                            }

                            if (!report) return <p>No report available.</p>;

                            return (
                                <>
                                    <div className="flex items-center space-x-2">
                                        {report ? (
                                            <CheckCircle className="text-green-500 w-6 h-6" />
                                        ) : (
                                            <AlertCircle className="text-red-500 w-6 h-6" />
                                        )}
                                    </div>
                                    {selectedTask.id == 'account-verification' ?
                                        <div className="text-sm whitespace-pre-line overflow-auto max-h-60 break-words p-4 rounded bg-gray-50 border border-gray-200 space-y-2">
                                            <p><strong>Platform:</strong> {accountVerificationInfo?.platform}</p>

                                            <p><strong>Total URLs Checked:</strong> {accountVerificationInfo?.urls_checked?.length}</p>

                                            <div>
                                                <p className="font-semibold">✅ Verified URLs ({accountVerificationInfo?.verified_urls?.length}):</p>
                                                <ul className="list-disc ml-5">
                                                    {accountVerificationInfo?.verified_urls?.map((url, idx) => (
                                                        <li key={`verified-${idx}`}>
                                                            <a href={url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{url}</a>
                                                        </li>
                                                    ))}
                                                    {accountVerificationInfo?.verified_urls?.length === 0 && (
                                                        <li className="italic text-gray-500">None</li>
                                                    )}
                                                </ul>
                                            </div>

                                            <div>
                                                <p className="font-semibold">❌ Unverified URLs ({accountVerificationInfo?.unverified_urls?.length}):</p>
                                                <ul className="list-disc ml-5">
                                                    {accountVerificationInfo?.unverified_urls?.map((url, idx) => (
                                                        <li key={`unverified-${idx}`}>
                                                            <a href={url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{url}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <p className="font-semibold">📋 Detailed Results:</p>
                                                <ul className="list-none ml-2">
                                                    {accountVerificationInfo?.detailed_results?.map((result, idx) => (
                                                        <li key={`detail-${idx}`} className="mb-1">
                                                            <a href={result.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                                                                {result.url}
                                                            </a> — <span className={result.verified ? "text-green-600" : "text-red-600"}>{result.message}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        : <div className="text-sm whitespace-pre-line overflow-auto max-h-60 break-words p-2 rounded bg-gray-50 border border-gray-200">
                                            {report}
                                        </div>
                                    }
                                </>
                            );
                        })()}
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button variant="outline" onClick={reset}>
                            Analyze Another
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Auto-advance to step 5 when loading finishes */}
            {/* {loading === false && (handle || url) && !report && step === 4 && setStep(5)} */}
        </div>
    );
}

export default DigitalAuditInterface