import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const coverImageSrc = '/images/making-proteins-cover.webp';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-[#184370] text-white">
                <header className="absolute inset-x-0 top-0 flex justify-end p-6 text-sm">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-full border border-white px-5 py-2 font-medium transition hover:bg-white hover:text-[#184370]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="rounded-full border border-white px-5 py-2 font-medium transition hover:bg-white hover:text-[#184370]"
                        >
                            Log in
                        </Link>
                    )}
                </header>

                <main className="flex min-h-screen items-center justify-center p-4">
                    <img
                        src={coverImageSrc}
                        alt="Making Proteins Cover"
                        loading="lazy"
                        className="max-h-full w-full max-w-5xl object-contain"
                    />
                </main>
            </div>
        </>
    );
}
