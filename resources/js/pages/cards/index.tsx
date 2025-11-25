import { buildQrUrl } from '@/lib/qr';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MediaInfo = {
    url: string;
    name?: string | null;
    mime?: string | null;
} | null;

type CardListItem = {
    id: number;
    uuid: string;
    type: string;
    question: string;
    answer_preview: string;
    status: string;
    public_url: string;
    media: MediaInfo;
    updated_at?: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

interface CardsPageProps {
    cards: {
        data: CardListItem[];
        links: PaginationLink[];
    };
}

const statusStyles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    draft: 'bg-slate-100 text-slate-800',
    inactive: 'bg-rose-100 text-rose-800',
};

const typeColors: Record<string, string> = {
    lucky: 'bg-blue-100 text-blue-800',
    danger: 'bg-amber-100 text-amber-800',
    question: 'bg-fuchsia-100 text-fuchsia-800',
};

const breadcrumbs = [
    {
        title: 'Cards',
        href: '/cards',
    },
];

export default function CardsIndex({ cards }: CardsPageProps) {
    const { props } = usePage<{ flash?: { status?: string } }>();

    const destroy = (card: CardListItem) => {
        if (
            confirm(
                `Delete "${card.question.substring(0, 60)}"? This cannot be undone.`,
            )
        ) {
            router.delete(`/cards/${card.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cards" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0d1f34]">
                        Experience cards
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage Lucky, Danger, and Question cards, upload media,
                        and share public QR codes.
                    </p>
                </div>

                <Button asChild className="rounded-full bg-[#184370] px-6">
                    <Link href="/cards/create">New card</Link>
                </Button>
            </div>

            {props.flash?.status && (
                <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {props.flash.status}
                </div>
            )}

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[720px] table-fixed">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3 w-2/6">Question</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">QR code</th>
                            <th className="px-6 py-3">Updated</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {cards.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-muted-foreground"
                                >
                                    No cards yet. Create your first one to get
                                    started.
                                </td>
                            </tr>
                        )}
                        {cards.data.map((card) => (
                            <tr key={card.id} className="align-top">
                                <td className="px-6 py-4">
                                    <Badge
                                        className={cn(
                                            'capitalize',
                                            typeColors[card.type] ??
                                                'bg-slate-100 text-slate-800',
                                        )}
                                    >
                                        {card.type}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-[#0d1f34]">
                                        {card.question}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {card.answer_preview}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        className={cn(
                                            'capitalize',
                                            statusStyles[card.status] ??
                                                'bg-slate-100 text-slate-800',
                                        )}
                                    >
                                        {card.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <img
                                            src={buildQrUrl(card.id)}
                                            alt="Card QR"
                                            className="h-20 w-20 rounded bg-white p-1 shadow"
                                        />
                                        {card.status === 'active' ? (
                                            <a
                                                href={card.public_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-[#1e7ad2] underline underline-offset-4 hover:text-[#184370]"
                                            >
                                                View public page
                                            </a>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                Activate to publish
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {card.updated_at
                                        ? new Date(
                                              card.updated_at,
                                          ).toLocaleDateString()
                                        : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap justify-end gap-3 text-sm">
                                        <Link
                                            href={`/cards/${card.id}/qr`}
                                            className="text-[#184370] underline underline-offset-4 hover:text-[#0f2746]"
                                        >
                                            QR
                                        </Link>
                                        <Link
                                            href={`/cards/${card.id}/edit`}
                                            className="text-[#1e7ad2] underline underline-offset-4 hover:text-[#184370]"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => destroy(card)}
                                            className="text-rose-600 underline underline-offset-4 hover:text-rose-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {cards.links.length > 1 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                    {cards.links.map((link) => (
                        <button
                            key={`${link.label}-${link.url}`}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm transition',
                                link.active
                                    ? 'bg-[#184370] text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                                !link.url && 'opacity-40 cursor-not-allowed',
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
