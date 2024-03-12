import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
import { Separator } from "@/components/ui/separator";

interface AnnouncementsCardProps {
    lease: Lease;
}

export default function AnnouncementsCard({ lease }: AnnouncementsCardProps) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full mb-3">
                    <CardTitle className="text-lg font-medium">
                        Announcement Board
                    </CardTitle>
                    {/* View all link */}
                    <MainButton text="View All" variant="link" />
                </div>
                <Separator />
                <div>
                    <p className="text-lg leading-none mb-2">
                        Announcement title
                    </p>
                    <p>Announcement content</p>
                </div>
                <Separator />
            </CardHeader>
        </Card>
    );
}
