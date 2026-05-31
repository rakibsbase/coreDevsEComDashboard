import { initialProducts } from "../data/products";
import type { ProductItem } from "../types";
import { createMockService } from "./mockService";

export const productService = createMockService<ProductItem>(initialProducts);
