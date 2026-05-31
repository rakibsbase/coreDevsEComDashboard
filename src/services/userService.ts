import { initialUsers } from "../data/users";
import type { UserRow } from "../types";
import { createMockService } from "./mockService";

export const userService = createMockService<UserRow>(initialUsers);
