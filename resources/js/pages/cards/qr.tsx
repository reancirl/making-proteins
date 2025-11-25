import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

interface CardQrProps {
    card: {
        id: number;
        uuid: string;
        type: string;
        status: string;
        question: string;
        public_url: string;
    };
    qrImageUrl: string;
    downloadUrl: string;
}

const breadcrumbs = (cardId: number) => [
    { title: 'Cards', href: '/cards' },
    { title: `QR`, href: `/cards/${cardId}/qr` },
];

export default function CardQr({ card, qrImageUrl, downloadUrl }: CardQrProps) {
    const previewSrc = `${qrImageUrl}?size=1000`;
    const downloadHref = `${downloadUrl}${downloadUrl.includes('?') ? '&' : '?'}size=1000`;

    return (
        <AppLayout breadcrumbs={breadcrumbs(card.id)}>
            <Head title="Card QR" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                        QR code
                    </p>
                    <h1 className="text-3xl font-semibold text-[#0d1f34]">
                        {card.question}
                    </h1>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                        <Badge className="bg-blue-100 text-blue-800 capitalize">
                            {card.type}
                        </Badge>
                        <Badge
                            className={
                                card.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800 capitalize'
                                    : card.status === 'inactive'
                                      ? 'bg-rose-100 text-rose-700 capitalize'
                                      : 'bg-slate-100 text-slate-800 capitalize'
                            }
                        >
                            {card.status}
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href="/cards">Back to list</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-[#184370] px-6">
                        <a href={downloadHref} download>
                            Download QR
                        </a>
                    </Button>
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-lg">
                    <img
                        src={previewSrc}
                        alt="Card QR code"
                        className="h-[420px] w-[420px] max-w-full"
                    />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    <p>Scan to open: </p>
                    <a
                        href={card.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-[#1e7ad2] underline underline-offset-4 hover:text-[#184370]"
                    >
                        {card.public_url}
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
