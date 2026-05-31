import { initialReferrals } from "../data/referrals";
import type { ReferralUser } from "../types";
import { createMockService } from "./mockService";

export const referralService = createMockService<ReferralUser>(initialReferrals);
