import { initialInvoices } from "../data/invoices";
import type { InvoiceItem } from "../types";
import { createMockService } from "./mockService";

export const invoiceService = createMockService<InvoiceItem>(initialInvoices);
