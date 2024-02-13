"use client";

import { LoginForm, LoginFormValues } from "@/components/forms/login-form";

import { UnauthorizedError } from "@/network/errors/httpErrors";
import { toast } from "sonner";
import { useLoginMutation } from "@/network/user";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { mutate, isPending, error, isSuccess, isError } = useLoginMutation();

    const onSubmit = async (data: LoginFormValues) => {
        const loggedInUser = mutate(data);

        console.log(loggedInUser);
    };

    if (isError) {
        if (error instanceof UnauthorizedError) {
            toast.error("Email or password is incorrect");
        } else {
            toast.error("Something went wrong!");
        }
    }

    // Success
    if (isSuccess) {
        toast.success("Logged in successfully!");
        router.push("/");
        router.refresh();
    }

    return (
        // Center the form
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/3">
                <LoginForm onSubmit={onSubmit} loading={isPending} />
            </div>
        </div>
    );
}
