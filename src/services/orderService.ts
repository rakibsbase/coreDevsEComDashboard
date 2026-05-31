import { initialOrders } from "../data/orders";
import type { OrderItem } from "../types";
import { createMockService } from "./mockService";

export const orderService = createMockService<OrderItem>(initialOrders);
