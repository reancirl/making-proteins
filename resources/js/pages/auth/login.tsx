import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cacheUrls, getAssetUrlsFromDocument } from '@/lib/offline';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
    const [offlineStatus, setOfflineStatus] = useState<
        'idle' | 'working' | 'done' | 'error'
    >('idle');
    const [offlineMessage, setOfflineMessage] = useState<string | null>(null);

    const handleOfflineDownload = async () => {
        setOfflineStatus('working');
        setOfflineMessage(null);

        try {
            const origin = window.location.origin;
            const urls = new Set<string>();

            const addUrl = (value?: string | null) => {
                if (!value) {
                    return;
                }

                try {
                    const url = new URL(value, origin);
                    if (url.origin === origin) {
                        urls.add(url.toString());
                    }
                } catch (error) {
                    // ignore invalid URLs
                }
            };

            addUrl(window.location.href);
            getAssetUrlsFromDocument().forEach((url) => addUrl(url));

            const response = await fetch('/cards/public-feed', {
                headers: {
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(
                    'Unable to fetch cards for offline use. Please try again.',
                );
            }

            const payload = (await response.json()) as {
                cards?: Array<{ public_url?: string; media_url?: string | null }>;
            };

            payload.cards?.forEach((card) => {
                addUrl(card.public_url);
                addUrl(card.media_url ?? undefined);
            });

            const result = await cacheUrls(Array.from(urls));
            setOfflineStatus('done');
            setOfflineMessage(
                `Offline cache ready. Cached ${result.cached} item${result.cached === 1 ? '' : 's'}${result.failed ? `, ${result.failed} failed` : ''}.`,
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Offline cache failed. Please try again.';
            setOfflineStatus('error');
            setOfflineMessage(message);
        }
    };

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen bg-[#184370] text-white">
                <main className="mx-auto flex min-h-screen w-full items-center justify-center p-6">
                    <div className="w-full max-w-lg rounded-[32px] bg-white p-8 text-[#0d1f34] shadow-2xl">
                        <div className="space-y-2 text-center text-[#153861]">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#799bc7]">
                                Making Proteins
                            </p>
                            <h1 className="text-2xl font-semibold">
                                Log in to your account
                            </h1>
                            <p className="text-sm text-[#5c7aa2]">
                                Enter your credentials to continue
                            </p>
                        </div>

                        {status && (
                            <div className="mt-6 rounded-lg bg-[#e8f7ef] px-3 py-2 text-center text-sm font-medium text-[#1b6b3d]">
                                {status}
                            </div>
                        )}

                        <div className="mt-6 rounded-2xl border border-[#e1e9f7] bg-[#f7f9fd] px-4 py-4 text-sm text-[#153861]">
                            <p className="font-semibold">Offline access</p>
                            <p className="mt-1 text-xs text-[#5c7aa2]">
                                Download the public cards and media now, so they
                                can be viewed without internet.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleOfflineDownload}
                                    disabled={offlineStatus === 'working'}
                                    className="rounded-full border-[#d8e2f1]"
                                >
                                    {offlineStatus === 'working'
                                        ? 'Preparing offline…'
                                        : 'Download for offline'}
                                </Button>
                                {offlineMessage && (
                                    <span
                                        className={
                                            offlineStatus === 'error'
                                                ? 'text-rose-600'
                                                : 'text-[#1f6a9a]'
                                        }
                                    >
                                        {offlineMessage}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="mt-8 space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-[#153861]"
                                            >
                                                Email address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-12 rounded-xl border-[#d8e2f1] bg-white text-base text-[#0d1f34] placeholder:text-[#9ab0cd] focus-visible:ring-[#184370]"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-[#153861]"
                                                >
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm text-[#1e7ad2] underline-offset-4 hover:text-[#184370]"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="h-12 rounded-xl border-[#d8e2f1] bg-white text-base text-[#0d1f34] placeholder:text-[#9ab0cd] focus-visible:ring-[#184370]"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3 text-[#153861]">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-[#9ab0cd] data-[state=checked]:bg-[#184370] data-[state=checked]:text-white"
                                            />
                                            <Label htmlFor="remember">
                                                Remember me
                                            </Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-full bg-[#184370] text-base font-semibold text-white transition hover:bg-white hover:text-[#184370]"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log in
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </main>
            </div>
        </>
    );
}
