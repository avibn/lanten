import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { getDocument } from "@/network/server/documents";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        documentID: string;
    };
}

export const metadata: Metadata = {
    title: "Opening Document",
};

export default async function Page({ params: { documentID } }: PageProps) {
    let link: string | undefined = undefined;
    try {
        const response = await getDocument(documentID);
        link = response.url;
    } catch (error) {
        console.error(error);
    } finally {
        if (link) {
            redirect(link);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {link ? (
                <>
                    <p>Opening document...</p>
                    <div className="text-sm text-gray-500">
                        If the document does not open, click{" "}
                        <Button variant="link" className="p-0" asChild>
                            <Link href={link} prefetch={false}>here</Link>
                        </Button>
                        .
                    </div>
                </>
            ) : (
                <>
                    <p>Failed to open document!</p>
                    <div className="text-sm text-gray-500">
                        Click{" "}
                        <Button variant="link" className="p-0" asChild>
                            <Link href="/home" prefetch={false}>here</Link>
                        </Button>{" "}
                        to go back to the dashboard.
                    </div>
                </>
            )}
        </div>
    );
}
