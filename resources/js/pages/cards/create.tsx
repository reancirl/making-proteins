import CardForm from '@/pages/cards/card-form';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

interface CreateCardProps {
    typeOptions: string[];
    statusOptions: string[];
}

const breadcrumbs = [
    { title: 'Cards', href: '/cards' },
    { title: 'Create', href: '/cards/create' },
];

export default function CreateCard({
    typeOptions,
    statusOptions,
}: CreateCardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create card" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0d1f34]">
                        New card
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Capture the card content, attach media, and set the
                        publication status.
                    </p>
                </div>

                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/cards">Back to list</Link>
                </Button>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <CardForm
                    typeOptions={typeOptions}
                    statusOptions={statusOptions}
                />
            </div>
        </AppLayout>
    );
}
