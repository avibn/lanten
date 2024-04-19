import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

import { PrismaClient } from "@prisma/client";
import prisma from "../../src/utils/prismaClient";

jest.mock("../../src/utils/prismaClient", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
    mockReset(prismaMock);
});

export default prismaMock;
