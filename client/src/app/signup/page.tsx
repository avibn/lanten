"use client";

import { SignupForm, SignupFormValues } from "@/components/forms/signup-form";

import { ConflictError } from "@/network/errors/httpErrors";
import { toast } from "sonner";
import { useRegisterMutation } from "@/network/user";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { mutate, isPending, error, isSuccess, isError } =
        useRegisterMutation();

    const onSubmit = async (data: SignupFormValues) => {
        const loggedInUser = mutate(data);
        console.log(loggedInUser);
    };

    if (isError) {
        if (error instanceof ConflictError) {
            toast.error("User with that email already exists");
        } else {
            toast.error("Something went wrong!");
        }
    }

    // Success
    if (isSuccess) {
        toast.success("Account created!");
        router.push("/");
        router.refresh();
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
