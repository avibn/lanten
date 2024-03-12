import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Lease } from "@/models/lease";

interface MaintenanceCardProps {
    lease: Lease;
}

export default function MaintenanceCard({ lease }: MaintenanceCardProps) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium">
                    Maintenance Requests
                </CardTitle>
                <p className="text-gray-500">Latest requests:</p>
                <p>Coming soon...</p>
            </CardHeader>
        </Card>
    );
}
