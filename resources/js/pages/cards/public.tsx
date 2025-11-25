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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b1b2f] px-6 py-12 text-white">
            <Head title="Making Proteins Card" />

            <div className="w-full max-w-4xl space-y-8 rounded-[32px] bg-[#102040] p-8 shadow-2xl lg:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <span
                        className="rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide"
                        style={{ backgroundColor: `${accent}33`, color: accent }}
                    >
                        {card.type} card
                    </span>
                    <p className="text-sm text-slate-300">
                        Scan provided QR to open this page anytime.
                    </p>
                </div>

                {card.media && (
                    <div className="max-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/40">
                        {mediaIsVideo ? (
                            <video
                                controls
                                preload="metadata"
                                className="h-full w-full max-h-[420px] object-contain"
                                src={card.media.url}
                                playsInline
                            />
                        ) : (
                            <img
                                src={card.media.url}
                                alt="Card media"
                                className="h-full w-full max-h-[420px] object-contain"
                            />
                        )}
                    </div>
                )}

                {card.alt_video_url && (
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-slate-200">
                        <p className="font-medium text-white">
                            Alternative video link
                        </p>
                        <a
                            href={card.alt_video_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#7ce2ff] underline underline-offset-4"
                        >
                            {card.alt_video_url}
                        </a>
                    </div>
                )}

                <div className="space-y-6 rounded-3xl border border-white/20 bg-white/5 p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                Question
                            </p>
                            <p className="text-sm text-slate-300">
                                Reveal the challenge when you’re ready.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowQuestion(!showQuestion)}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#102040] transition hover:bg-slate-100"
                        >
                            {showQuestion ? 'Hide question' : 'Proceed to question'}
                        </button>
                    </div>

                    {showQuestion ? (
                        <>
                            <h1 className="text-3xl font-semibold leading-tight text-white">
                                {card.question}
                            </h1>

                            <div className="space-y-4 rounded-3xl border border-white/20 bg-white/5 p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                            Answer
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            Reveal only when you’re ready.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAnswer(!showAnswer)}
                                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#102040] transition hover:bg-slate-100"
                                    >
                                        {showAnswer ? 'Hide answer' : 'Show answer'}
                                    </button>
                                </div>
                                {showAnswer ? (
                                    <p className="text-lg leading-relaxed text-slate-100">
                                        {card.answer}
                                    </p>
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-white/30 bg-white/5 px-4 py-6 text-center text-sm text-slate-400">
                                        Tap “Show answer” to reveal the solution.
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="rounded-2xl border border-dashed border-white/30 bg-white/5 px-4 py-6 text-center	text-sm text-slate-400">
                            Tap “Proceed to question” to reveal the prompt.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
