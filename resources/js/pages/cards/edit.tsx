import CardForm, { type CardPayload } from '@/pages/cards/card-form';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { buildQrUrl } from '@/lib/qr';
import { Badge } from '@/components/ui/badge';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface EditCardProps {
    card: CardPayload & { public_url: string; status: string; type: string };
    typeOptions: string[];
    statusOptions: string[];
}

const breadcrumbs = (cardId: number) => [
    { title: 'Cards', href: '/cards' },
    { title: `Card #${cardId}`, href: `/cards/${cardId}/edit` },
];

export default function EditCard({
    card,
    typeOptions,
    statusOptions,
}: EditCardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(card.id)}>
            <Head title="Edit card" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0d1f34]">
                        Edit card
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update the content, media, or status. QR codes update
                        automatically.
                    </p>
                </div>

                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/cards">Back to list</Link>
                </Button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <CardForm
                        card={card}
                        typeOptions={typeOptions}
                        statusOptions={statusOptions}
                    />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Badge
                                className={cn(
                                    'capitalize',
                                    card.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : card.status === 'inactive'
                                          ? 'bg-rose-100 text-rose-700'
                                          : 'bg-slate-100 text-slate-800',
                                )}
                            >
                                {card.status}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 capitalize">
                                {card.type}
                            </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-[#0d1f34]">
                                QR code
                            </p>
                            <p>
                                Scan to open the live card experience. Only
                                active cards are shown publicly.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-6">
                            <img
                                src={buildQrUrl(card.id, 240)}
                                alt="Card QR code"
                                className="h-36 w-36 rounded bg-white p-2 shadow"
                            />
                            <a
                                href={card.public_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-[#1e7ad2] underline underline-offset-4 hover:text-[#184370]"
                            >
                                {card.public_url}
                            </a>
                            {card.status !== 'active' && (
                                <p className="text-center text-xs text-muted-foreground">
                                    This link returns a 404 until the status is
                                    set to <strong>active</strong>.
                                </p>
                            )}
                            <Button asChild className="rounded-full bg-[#184370] px-6 text-sm text-white">
                                <Link href={`/cards/${card.id}/qr`}>
                                    Open full QR view
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
