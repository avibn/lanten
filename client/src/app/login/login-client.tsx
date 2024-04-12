"use client";

import { LoginForm } from "@/components/forms/login-form";
import { LoginFormValues } from "@/schemas/login";
import { UnauthorizedError } from "@/network/errors/httpErrors";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useLoginMutation } from "@/network/client/users";
import { useRouter } from "next/navigation";

export function LoginClient() {
    const router = useRouter();
    const { data, mutate, isPending, error, isSuccess, isError } =
        useLoginMutation();
    const setUser = useAuthStore((state) => state.setUser);

    const onSubmit = async (data: LoginFormValues) => {
        const loggedInUser = mutate(data);
        console.log(loggedInUser);
    };

    if (isError) {
        if (error instanceof UnauthorizedError) {
            toast.error("Email or password is incorrect.");
        } else {
            toast.error("Something went wrong!");
        }
    }

    // Success
    if (isSuccess) {
        toast.success("Logged in successfully!");
        setUser(data);
        router.push("/home");
        router.refresh();
    }

    return <LoginForm onSubmit={onSubmit} loading={isPending} />;
}
