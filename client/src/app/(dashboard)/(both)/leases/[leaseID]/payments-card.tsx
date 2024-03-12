import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";

interface PaymentsCardProps {
    lease: Lease;
}

export default function PaymentsCard({ lease }: PaymentsCardProps) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Payments ({lease._count?.payments})
                    </CardTitle>
                    <MainButton text="Add Payment" />
                </div>
            </CardHeader>
        </Card>
    );
}
