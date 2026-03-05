import { useState } from 'react';
import { Head } from '@inertiajs/react';

type MediaInfo = {
    url: string;
    name?: string | null;
    mime?: string | null;
} | null;

interface PublicCardProps {
    card: {
        type: string;
        question: string;
        answer: string;
        media: MediaInfo;
        alt_video_url?: string | null;
    };
}

const typeAccent: Record<string, string> = {
    lucky: '#7ce2ff',
    danger: '#ffb347',
    question: '#c084fc',
};

export default function PublicCard({ card }: PublicCardProps) {
    const mediaIsVideo = card.media?.mime?.startsWith('video/');
    const accent =
        typeAccent[card.type] ??
        '#f6f6f6'; /* fallback for unknown card types */
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b1b2f] px-4 py-8 text-white sm:px-6 sm:py-12">
            <Head title="Making Proteins Card" />

            <div className="w-full max-w-4xl space-y-6 rounded-[24px] bg-[#102040] p-5 shadow-2xl sm:space-y-8 sm:rounded-[32px] sm:p-8 lg:p-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span
                        className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide sm:px-4 sm:text-sm"
                        style={{ backgroundColor: `${accent}33`, color: accent }}
                    >
                        {card.type} card
                    </span>
                    <p className="text-xs text-slate-300 sm:text-sm">
                        Scan provided QR to open this page anytime.
                    </p>
                </div>

                {card.media && (
                    <div className="max-h-[260px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 sm:max-h-[420px]">
                        {mediaIsVideo ? (
                            <video
                                controls
                                preload="metadata"
                                className="h-full w-full max-h-[260px] object-contain sm:max-h-[420px]"
                                src={card.media.url}
                                playsInline
                            />
                        ) : (
                            <img
                                src={card.media.url}
                                alt="Card media"
                                className="h-full w-full max-h-[260px] object-contain sm:max-h-[420px]"
                            />
                        )}
                    </div>
                )}

                {card.alt_video_url && (
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-xs text-slate-200 sm:text-sm">
                        <p className="font-medium text-white">
                            Alternative video link
                        </p>
                        <a
                            href={card.alt_video_url}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-[#7ce2ff] underline underline-offset-4"
                        >
                            {card.alt_video_url}
                        </a>
                    </div>
                )}

                <div className="space-y-5 rounded-3xl border border-white/20 bg-white/5 p-5 sm:space-y-6 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                Question
                            </p>
                            <p className="text-xs text-slate-300 sm:text-sm">
                                Reveal the challenge when you’re ready.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowQuestion(!showQuestion)}
                            className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#102040] transition hover:bg-slate-100 sm:w-auto"
                        >
                            {showQuestion ? 'Hide question' : 'Proceed to question'}
                        </button>
                    </div>

                    {showQuestion ? (
                        <>
                            <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
                                {card.question}
                            </h1>
{/* 
                            <div className="space-y-4 rounded-3xl border border-white/20 bg-white/5 p-5 sm:p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                            Answer
                                        </p>
                                        <p className="text-xs text-slate-300 sm:text-sm">
                                            Reveal only when you’re ready.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAnswer(!showAnswer)}
                                        className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#102040] transition hover:bg-slate-100 sm:w-auto"
                                    >
                                        {showAnswer ? 'Hide answer' : 'Show answer'}
                                    </button>
                                </div>
                                {showAnswer ? (
                                    <p className="text-base leading-relaxed text-slate-100 sm:text-lg">
                                        {card.answer}
                                    </p>
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-white/30 bg-white/5 px-4 py-6 text-center text-xs text-slate-400 sm:text-sm">
                                        Tap “Show answer” to reveal the solution.
                                    </p>
                                )}
                            </div> */}
                        </>
                    ) : (
                        <p className="rounded-2xl border border-dashed border-white/30 bg-white/5 px-4 py-6 text-center text-xs text-slate-400 sm:text-sm">
                            Tap “Proceed to question” to reveal the prompt.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
