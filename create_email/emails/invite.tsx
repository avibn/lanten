import {
    Body,
    Button,
    Container,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
} from "@react-email/components";

import React from "react";

interface InviteProps {
    propertyName: string;
    inviteCode: string;
    inviteLink: string;
    homeLink: string;
    authorName: string;
}

const Invite = ({
    propertyName = "{{ property_name }}",
    inviteCode = "{{ invite_code }}",
    inviteLink = "{{ invite_link }}",
    homeLink = "{{ home_link }}",
    authorName = "{{ author_name }}",
}: InviteProps) => {
    return (
        <Html>
            <Preview>You've been invited to join a property!</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#16a34a",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-300 rounded max-w-20 my-10 mx-auto p-10">
                        <Section className="text-center mb-[32px] w-full">
                            <Link href={homeLink} className="text-black">
                                <Img
                                    className="rounded-full inline-block align-middle"
                                    src="https://part3storage.blob.core.windows.net/static/logo.png"
                                    width={50}
                                    height={50}
                                    alt="Logo"
                                />
                                <h1 className="text-xl ml-4 inline-block align-middle font-bold">
                                    Lanten
                                </h1>
                            </Link>
                        </Section>
                        <h1 className="text-2xl font-bold mb-4">
                            You have been invited.
                        </h1>
                        <p className="text-base mb-4 text-gray-600">
                            Hi! You've been invited by <i>{authorName}</i> to
                            join property <strong>{propertyName}</strong>.
                        </p>
                        <Section className="text-center mt-[32px] mb-[32px] w-full">
                            <Button
                                href={inviteLink}
                                className="bg-brand w-full px-3 py-2 font-medium leading-4 text-white rounded-lg"
                            >
                                Join Property
                            </Button>
                            <p className="text-sm mt-2 text-gray-600">
                                Or use the invite code:{" "}
                                <strong>{inviteCode}</strong>.
                            </p>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

Invite.PreviewProps = {
    propertyName: "{{ property_name }}",
    inviteCode: "{{ invite_code }}",
    inviteLink: "{{ invite_link }}",
    authorName: "{{ author_name }}",
    homeLink: "{{ home_link }}",
};

export default Invite;
