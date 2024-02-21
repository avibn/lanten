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
import { Loader2, Trash } from "lucide-react";
import { MainButton, MainButtonProps } from "./main-button";

interface DeleteButtonProps {
    text: string;
    alertTitle?: string;
    alertDescription?: string | JSX.Element;
    isLoading?: boolean;
    onConfirm: () => void;
}

export function DeleteButton(props: DeleteButtonProps) {
    const { alertTitle, alertDescription, onConfirm, isLoading } = props;
    const newProps: MainButtonProps = {
        icon: <Trash size={16} />,
        variant: "secondary",
        ...props,
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <MainButton {...newProps} />
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
