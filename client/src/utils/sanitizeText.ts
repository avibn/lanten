import DOMPurify from "isomorphic-dompurify";

export function sanitizeText(dityText: string) {
    return { __html: DOMPurify.sanitize(dityText) };
}
