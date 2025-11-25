import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
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
