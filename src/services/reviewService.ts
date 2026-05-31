import { initialReviews } from "../data/reviews";
import type { ReviewItem } from "../types";
import { createMockService } from "./mockService";

export const reviewService = createMockService<ReviewItem>(initialReviews);
