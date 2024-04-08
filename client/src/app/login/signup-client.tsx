"use client";

import { ConflictError } from "@/network/errors/httpErrors";
import { SignupForm } from "@/components/forms/signup-form";
import { SignupFormValues } from "@/schemas/signup";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRegisterMutation } from "@/network/client/users";
import { useRouter } from "next/navigation";

export function SignupClient() {
    const router = useRouter();
    const { data, mutate, isPending, error, isSuccess, isError } =
        useRegisterMutation();
    const setUser = useAuthStore((state) => state.setUser);

    const onSubmit = async (data: SignupFormValues) => {
        const loggedInUser = mutate(data);
        console.log(loggedInUser);
    };

    if (isError) {
        if (error instanceof ConflictError) {
            toast.error("User with that email already exists.");
        } else {
            toast.error("Something went wrong!");
        }
    }

    // Success
    if (isSuccess) {
        toast.success("Account created!");
        setUser(data);
        router.push("/home");
    }

    return <SignupForm onSubmit={onSubmit} loading={isPending} />;
}
