type ReferenceRange = {
    prefix: string;
    start: number;
    end: number;
}

type GeneratorResponse = {
    success: boolean;
    references?: string[];
    error?: string;
}

export class BulkReferenceGenerator {
    private prefix: string;
    private start: number;
    private end: number;

    constructor(prefix: string, start: number, end: number) {
        this.prefix = prefix;
        this.start = start;
        this.end = end;
    }

    generateBulkReferences(): GeneratorResponse {
        try {
            // Validate range
            if (this.start > this.end) {
                return {
                    success: false,
                    error: 'Start number cannot be greater than end number'
                };
            }

            if (this.start < 1) {
                return {
                    success: false,
                    error: 'Start number must be greater than 0'
                };
            }

            // Generate sequence
            const references: string[] = [];
            for (let i = this.start; i <= this.end; i++) {
                // Pad numbers with zeros if needed (e.g., MEXDEL001)
                const paddedNumber = i.toString().padStart(3, '0');
                references.push(`${this.prefix}${paddedNumber}`);
            }

            return {
                success: true,
                references
            };
        } catch (error) {
            return {
                success: false,
                error: `Error generating references: ${error}`
            };
        }
    }

    // Validate if a reference number is in the valid range
    isValidReference(reference: string): boolean {
        if (!reference.startsWith(this.prefix)) {
            return false;
        }

        const numberPart = reference.slice(this.prefix.length);
        const number = parseInt(numberPart);

        return !isNaN(number) && number >= this.start && number <= this.end;
    }

    // Get the range details
    getRangeInfo(): ReferenceRange {
        return {
            prefix: this.prefix,
            start: this.start,
            end: this.end
        };
    }
}

// Example usage function
export const generateDeliveryReferences = (
    prefix: string = 'MEXDEL',
    start: number,
    end: number
): GeneratorResponse => {
    const generator = new BulkReferenceGenerator(prefix, start, end);
    return generator.generateBulkReferences();
};