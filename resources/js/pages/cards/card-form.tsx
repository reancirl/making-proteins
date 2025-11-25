import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';

type MediaInfo = {
    url: string;
    name?: string | null;
    mime?: string | null;
} | null;

export interface CardPayload {
    id: number;
    type: string;
    question: string;
    answer: string;
    status: string;
    alt_video_url?: string | null;
    media: MediaInfo;
}

interface CardFormProps {
    typeOptions: string[];
    statusOptions: string[];
    card?: CardPayload;
}

type FormData = {
    type: string;
    question: string;
    answer: string;
    status: string;
    alt_video_url: string;
    media: File | null;
};

const fieldClasses =
    'w-full rounded-xl border border-[#d8e2f1] bg-white px-4 py-3 text-sm text-[#0d1f34] placeholder:text-[#9ab0cd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#184370]';

export default function CardForm({
    typeOptions,
    statusOptions,
    card,
}: CardFormProps) {
    const defaultType = card?.type ?? typeOptions[0] ?? 'lucky';
    const defaultStatus = card?.status ?? statusOptions[0] ?? 'draft';
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<FormData>({
        type: defaultType,
        status: defaultStatus,
        question: card?.question ?? '',
        answer: card?.answer ?? '',
        alt_video_url: card?.alt_video_url ?? '',
        media: null,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.setData('media', null);
                if (!card) {
                    form.reset();
                }
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onFinish: () => {
                form.transform((data) => data);
            },
        };

        if (card) {
            form.transform((data) => ({
                ...data,
                _method: 'put',
            }));

            form.post(`/cards/${card.id}`, options);
        } else {
            form.post('/cards', options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="type">Card type</Label>
                    <select
                        id="type"
                        className={fieldClasses}
                        value={form.data.type}
                        onChange={(event) =>
                            form.setData('type', event.target.value)
                        }
                    >
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        ))}
                    </select>
                    <InputError message={form.errors.type} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        className={fieldClasses}
                        value={form.data.status}
                        onChange={(event) =>
                            form.setData('status', event.target.value)
                        }
                    >
                        {statusOptions.map((option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        ))}
                    </select>
                    <InputError message={form.errors.status} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <textarea
                    id="question"
                    className={`${fieldClasses} min-h-[120px]`}
                    placeholder="Add the prompt or riddle shown on the card"
                    value={form.data.question}
                    onChange={(event) =>
                        form.setData('question', event.target.value)
                    }
                    required
                />
                <InputError message={form.errors.question} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="answer">Answer / Explanation</Label>
                <textarea
                    id="answer"
                    className={`${fieldClasses} min-h-[160px]`}
                    placeholder="Provide the answer or supporting context"
                    value={form.data.answer}
                    onChange={(event) =>
                        form.setData('answer', event.target.value)
                    }
                    required
                />
                <InputError message={form.errors.answer} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="media">Upload media (image or video)</Label>
                <Input
                    id="media"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        form.setData('media', file);
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    Max 200MB. Videos will be streamed from this upload unless
                    you provide an alternative link.
                </p>
                {card?.media && (
                    <p className="text-sm text-muted-foreground">
                        Current file:{' '}
                        <a
                            href={card.media.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1e7ad2] underline underline-offset-4 hover:text-[#184370]"
                        >
                            {card.media.name ?? 'View media'}
                        </a>
                    </p>
                )}
                <InputError message={form.errors.media} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="alt_video_url">Alternative video link</Label>
                <Input
                    id="alt_video_url"
                    type="url"
                    placeholder="https://youtu.be/..."
                    value={form.data.alt_video_url}
                    onChange={(event) =>
                        form.setData('alt_video_url', event.target.value)
                    }
                />
                <InputError message={form.errors.alt_video_url} />
                <p className="text-xs text-muted-foreground">
                    Optional YouTube or Drive link to use when the uploaded
                    video is too large.
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                    type="submit"
                    className="rounded-full bg-[#184370] px-6"
                    disabled={form.processing}
                >
                    {card ? 'Save changes' : 'Create card'}
                </Button>

                {form.progress && (
                    <span className="text-sm text-muted-foreground">
                        Uploading {form.progress.percentage}%
                    </span>
                )}
            </div>
        </form>
    );
}
