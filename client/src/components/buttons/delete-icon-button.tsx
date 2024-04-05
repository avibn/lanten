"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { cn } from "@/utils/tw-merge";

interface DeleteIconButtonProps {
    alertTitle?: string;
    alertDescription?: string | JSX.Element;
    isLoading?: boolean;
    onConfirm: () => void;
    className?: string;
    children?: React.ReactNode;
}

export function DeleteIconButton(props: DeleteIconButtonProps) {
    const { alertTitle, alertDescription, onConfirm, isLoading, className } =
        props;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {!props.children ? (
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "h-6 w-6 hover:bg-transparent hover:opacity-70 align-middle ml-2",
                            className
                        )}
                        disabled={isLoading}
                    >
                        {/* <X size={18} className="text-red-500" /> */}
                        <Trash2 size={18} className="text-red-500" />
                    </Button>
                ) : (
                    props.children
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {alertTitle && (
                        <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
                    )}
                    {alertDescription && (
                        <AlertDialogDescription>
                            {alertDescription}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
