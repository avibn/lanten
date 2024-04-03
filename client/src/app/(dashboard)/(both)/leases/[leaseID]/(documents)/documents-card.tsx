import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Lease } from "@/models/lease";

interface DocumentsCardProps {
    lease: Lease;
}

export default function DocumentsCard({ lease }: DocumentsCardProps) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Documents</CardTitle>
                <p>Coming soon...</p>
            </CardHeader>
        </Card>
    );
}
