import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    return (
        <>
            <div className="flex items-center justify-between w-full px-6 py-4">
                <Link href="/">
                    <div className="flex items-center space-x-4">
                        <Image
                            alt="Logo"
                            height={40}
                            src="/logo.png"
                            width={40}
                        />
                        <h1 className="text-xl font-bold tracking-tighter">
                            Lanten
                        </h1>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/login?tab=signup">Signup</Link>
                    </Button>
                </div>
            </div>
            <div className="container bg-gray-50 py-12 lg:py-16 px-4 md:px-6 lg:px-14">
                <div className="flex items-center justify-between max-lg:flex-col gap-10">
                    <div className="flex flex-col justify-center space-y-4 flex-grow-[1] flex-shrink-[1] basis-0">
                        <div className="space-y-2">
                            <h1 className="tracking-tighter sm:text-5xl text-3xl font-bold">
                                An efficient way to manage your tenants.
                            </h1>
                            <p className="max-w-[600px] text-gray-500 max-lg:text-base/relaxed lg:text-lg/relaxed">
                                Let your focus go to what is important, and let
                                the platform handle the rest.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/login?tab=signup">Get started</Link>
                        </Button>
                    </div>
                    <Image
                        alt="Image"
                        className="aspect-video overflow-hidden rounded-xl object-cover object-center flex-grow-[1.25] flex-shrink-[1.25] lg:basis-0"
                        height="393"
                        src="/homepage-placeholder.jpg"
                        width="700"
                    />
                </div>
            </div>
            <div className="py-14 container px-8 lg:px-14">
                <div className="flex max-lg:flex-col justify-between items-center space-y-8">
                    <div className="flex flex-col justify-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Focus on what matters.
                        </h2>
                        <p className="max-w-[600px] text-gray-500 max-lg:text-base/relaxed lg:text-lg/relaxed">
                            The platform is designed to help you with tedious
                            tasks, so you can focus on what is important. We
                            handle documents, maintenance requests,
                            communication, and more.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <CheckCircle2
                                size={20}
                                className="text-green-600"
                            />
                            <span className="text-gray-900">
                                Add properties and invite tenants with ease.
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <CheckCircle2
                                size={20}
                                className="text-green-600"
                            />
                            <span className="text-gray-900">
                                Handle maintenance requests and documents.
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <CheckCircle2
                                size={20}
                                className="text-green-600"
                            />
                            <span className="text-gray-900">
                                Communicate with tenants through messages and
                                announcements.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
