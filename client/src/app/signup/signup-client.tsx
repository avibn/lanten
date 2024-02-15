"use client";

import { SignupForm, SignupFormValues } from "@/components/forms/signup-form";

import { ConflictError } from "@/network/errors/httpErrors";
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

    return (
        // Center the form
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/3">
                <SignupForm onSubmit={onSubmit} loading={isPending} />
            </div>
        </div>
    );
}
