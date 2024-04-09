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

interface EmailProps {
    username: string;
    propertyName: string;
    announcement: string;
    homeLink: string;
}

const Email = ({
    username = "{{ username }}",
    propertyName = "{{ property_name }}",
    announcement = "{{ announcement }}",
    homeLink = "{{ home_link }}",
}: EmailProps) => {
    return (
        <Html>
            <Preview>New announcement from {propertyName}</Preview>
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
                            New Announcement
                        </h1>
                        <p className="text-base mb-4 text-gray-600">
                            Hi {username}! You have a new announcement from{" "}
                            <strong>{propertyName}</strong>:
                        </p>
                        <p className="text-base mb-4">{announcement}</p>
                        <Section className="text-center mt-[32px] mb-[32px] w-full">
                            <Button
                                href={homeLink}
                                className="bg-brand w-full px-3 py-2 font-medium leading-4 text-white rounded-lg"
                            >
                                Go to Lanten
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

Email.PreviewProps = {
    username: "{{ username }}",
    propertyName: "{{ property_name }}",
    announcement: "{{ announcement }}",
    homeLink: "{{ home_link }}",
};

// const html = render(<Email {...Email.PreviewProps} />, {
//     pretty: true,
// });

// console.log(html);

export default Email;
