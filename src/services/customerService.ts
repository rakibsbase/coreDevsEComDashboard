import { initialCustomers } from "../data/customers";
import type { Customer } from "../types";
import { createMockService } from "./mockService";

export const customerService = createMockService<Customer>(initialCustomers);
