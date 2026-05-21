
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const __generator = (this && this.__generator) || function (thisArg, body) {
    let _ = { label: 0, sent() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }; let f; let y; let t; let g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g.throw = verb(1), g.return = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TraceabilitySeeder = /** @class */ (function () {
    function TraceabilitySeeder() {
        this.businessCases = [
            "Initial packaging of organic coffee beans for retail distribution",
            "Pharmaceutical batch encoding for temperature-sensitive vaccines",
            "Automotive parts serialization for recall traceability",
            "Electronics component tracking for supply chain visibility",
            "Fresh produce encoding for farm-to-table traceability",
            "Textile manufacturing batch identification for quality control",
            "Chemical product serialization for regulatory compliance",
            "Medical device encoding for patient safety tracking",
            "Luxury goods authentication for anti-counterfeiting",
            "Food packaging line encoding for expiration date management",
            "Industrial equipment part tracking for maintenance scheduling",
            "Cosmetic product batch encoding for ingredient transparency",
            "Agricultural seed lot identification for crop yield analysis",
            "Construction material tracking for building code compliance",
            "Battery pack serialization for recycling program tracking",
            "Petroleum product tank encoding for environmental monitoring",
            "Wine bottle encoding for vintage authenticity verification",
            "Toy manufacturing safety compliance tracking",
            "Sporting goods equipment serialization for warranty tracking",
            "Appliance component encoding for service history management",
            "Jewelry item authentication for insurance documentation",
            "Packaging material roll encoding for production line efficiency",
            "High-value artwork piece encoding for gallery insurance",
            "Laboratory sample container tracking for research integrity",
            "Optical lens manufacturing quality assurance encoding",
            "Frozen food product encoding for cold chain monitoring",
            "Solar panel module serialization for warranty and performance tracking",
            "Ceramic tile batch encoding for building material certification",
            "Musical instrument serialization for authenticity and resale value",
            "Paint can batch encoding for color consistency quality control",
            "Pharmaceutical vial encoding for dosage accuracy verification",
            "Furniture component tracking for assembly line optimization",
            "Book printing batch identification for copyright protection",
            "Steel beam encoding for structural integrity certification",
            "Glass container manufacturing defect prevention tracking",
            "Rubber gasket batch encoding for automotive seal quality",
            "Circuit board component traceability for electronic device repair",
            "Plastic resin pellet batch tracking for recycling compliance",
            "Adhesive tape roll encoding for manufacturing process control",
            "Metal fastener lot identification for aerospace quality standards",
            "Ceramic capacitor encoding for electronic component reliability",
            "Fabric bolt encoding for textile quality assurance tracking",
            "Semiconductor wafer tracking for chip manufacturing quality",
            "Food additive batch encoding for allergen management",
            "Tire manufacturing serialization for safety recall capability",
            "Optical fiber cable encoding for telecommunications infrastructure",
            "Concrete batch tracking for construction quality assurance",
            "Leather goods authentication for luxury brand protection",
            "Seed packet encoding for agricultural traceability programs",
            "Medical implant serialization for patient safety monitoring"
        ];
    }
    TraceabilitySeeder.prototype.generateRandomUUID = function () {
        return crypto.randomUUID();
    };
    TraceabilitySeeder.prototype.generateRandomDateTime = function () {
        const now = new Date();
        const randomHours = Math.floor(Math.random() * 48); // Random within last 48 hours
        const randomMinutes = Math.floor(Math.random() * 60);
        const randomSeconds = Math.floor(Math.random() * 60);
        const randomMs = Math.floor(Math.random() * 1000);
        const randomDate = new Date(now.getTime() - (randomHours * 60 * 60 * 1000) - (randomMinutes * 60 * 1000) - (randomSeconds * 1000) - randomMs);
        return randomDate.toISOString();
    };
    TraceabilitySeeder.prototype.generateRandomItemCount = function () {
        const ranges = [
            { min: 1, max: 10, weight: 0.2 },
            { min: 11, max: 50, weight: 0.3 },
            { min: 51, max: 150, weight: 0.3 },
            { min: 151, max: 300, weight: 0.2 }
        ];
        const random = Math.random();
        let cumulativeWeight = 0;
        for (let _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
            const range = ranges_1[_i];
            cumulativeWeight += range.weight;
            if (random <= cumulativeWeight) {
                return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            }
        }
        return Math.floor(Math.random() * 100) + 1;
    };
    TraceabilitySeeder.prototype.generateRandomGLN = function () {
        // Generate 13-digit GLN (Global Location Number)
        const digits = [];
        for (let i = 0; i < 13; i++) {
            digits.push(Math.floor(Math.random() * 10));
        }
        return digits.join('');
    };
    TraceabilitySeeder.prototype.generateRandomEventNote = function () {
        return this.businessCases[Math.floor(Math.random() * this.businessCases.length)];
    };
    TraceabilitySeeder.prototype.generateRandomCodeType = function () {
        return Math.random() < 0.5 ? 'sscc' : 'sgtin';
    };
    TraceabilitySeeder.prototype.generateRandomCommissionedStatus = function () {
        // 70% chance of being commissioned (true), 30% chance of not commissioned (false)
        return Math.random() < 0.7;
    };
    TraceabilitySeeder.prototype.generateRandomHashCode = function () {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    };
    TraceabilitySeeder.prototype.generateRandomEPCElementString = function (codeType) {
        if (codeType === 'sscc') {
            // SSCC format: urn:epc:id:sscc:CompanyPrefix.SerialReference
            var companyPrefix = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
            const serialReference = Math.floor(Math.random() * 900000000000) + 100000000000; // 12 digits
            return "urn:epc:id:sscc:".concat(companyPrefix, ".").concat(serialReference);
        }
        
            // SGTIN format: urn:epc:id:sgtin:CompanyPrefix.ItemReference.SerialNumber
            var companyPrefix = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
            const itemReference = Math.floor(Math.random() * 900000) + 100000; // 6 digits
            const serialNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // 10 digits
            return "urn:epc:id:sgtin:".concat(companyPrefix, ".").concat(itemReference, ".").concat(serialNumber);
        
    };
    TraceabilitySeeder.prototype.generateTraceabilityEvent = function () {
        const codeType = this.generateRandomCodeType();
        return {
            eventtag: this.generateRandomUUID(),
            createdon: this.generateRandomDateTime(),
            itemcount: this.generateRandomItemCount(),
            readpoint: this.generateRandomGLN(),
            eventnote: this.generateRandomEventNote(),
            codetype: codeType,
            eventstamp: this.generateRandomHashCode(),
            parentid: false,
            haschildren: false,
            iscommissioned: this.generateRandomCommissionedStatus(),
            epcelementstring: this.generateRandomEPCElementString(codeType)
        };
    };
    TraceabilitySeeder.prototype.generateEvents = function (count) {
        if (count === void 0) { count = 50; }
        const events = [];
        for (let i = 0; i < count; i++) {
            events.push(this.generateTraceabilityEvent());
        }
        return events;
    };
    TraceabilitySeeder.prototype.generateRandomFileName = function () {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const randomString = Math.random().toString(36).substring(2, 8);
        return "traceability-events-".concat(timestamp, "-").concat(randomString, ".json");
    };
    TraceabilitySeeder.prototype.saveToFile = function (events_1) {
        return __awaiter(this, arguments, void 0, function (events, outputDir) {
            let fileName; let filePath;
            if (outputDir === void 0) { outputDir = './output'; }
            return __generator(this, function (_a) {
                try {
                    // Create output directory if it doesn't exist
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, { recursive: true });
                    }
                    fileName = this.generateRandomFileName();
                    filePath = path.join(outputDir, fileName);
                    // Write JSON file with pretty formatting
                    fs.writeFileSync(filePath, JSON.stringify(events, null, 2), 'utf8');
                    console.log("\u2705 Successfully generated ".concat(events.length, " traceability events"));
                    console.log("\uD83D\uDCC1 File saved as: ".concat(filePath));
                    console.log("\uD83D\uDCCA File size: ".concat((fs.statSync(filePath).size / 1024).toFixed(2), " KB"));
                    return [2 /* return */, filePath];
                }
                catch (error) {
                    console.error('❌ Error saving file:', error);
                    throw error;
                }
                return [2 /* return */];
            });
        });
    };
    TraceabilitySeeder.prototype.run = function () {
        return __awaiter(this, arguments, void 0, function (count, outputDir) {
            let startTime; let events; let endTime; let ssgtnCount; let ssccCount; let commissionedCount; let totalItems; let error_1;
            if (count === void 0) { count = 50; }
            if (outputDir === void 0) { outputDir = './output'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDE80 Starting traceability events generation...");
                        console.log("\uD83D\uDCDD Generating ".concat(count, " events"));
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        events = this.generateEvents(count);
                        return [4 /* yield */, this.saveToFile(events, outputDir)];
                    case 2:
                        _a.sent();
                        endTime = Date.now();
                        console.log("\u23F1\uFE0F  Generation completed in ".concat(endTime - startTime, "ms"));
                        ssgtnCount = events.filter((e) => e.codetype === 'sgtin').length;
                        ssccCount = events.filter((e) => e.codetype === 'sscc').length;
                        commissionedCount = events.filter((e) => e.iscommissioned === true).length;
                        totalItems = events.reduce((sum, e) => sum + e.itemcount, 0);
                        console.log("\n\uD83D\uDCC8 Statistics:");
                        console.log("   - SGTIN events: ".concat(ssgtnCount));
                        console.log("   - SSCC events: ".concat(ssccCount));
                        console.log("   - Commissioned events: ".concat(commissionedCount));
                        console.log("   - Non-commissioned events: ".concat(count - commissionedCount));
                        console.log("   - Total item count: ".concat(totalItems));
                        console.log("   - Average items per event: ".concat((totalItems / count).toFixed(2)));
                        return [3 /* break */, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Generation failed:', error_1);
                        throw error_1;
                    case 4: return [2 /* return */];
                }
            });
        });
    };
    return TraceabilitySeeder;
}());
// Main execution
function main() {
    return __awaiter(this, void 0, void 0, function () {
        let seeder; let args; let countArg; let outputArg; let count; let outputDir; let error_2;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0:
                    seeder = new TraceabilitySeeder();
                    args = process.argv.slice(2);
                    countArg = args.find((arg) => arg.startsWith('--count='));
                    outputArg = args.find((arg) => arg.startsWith('--output='));
                    count = countArg ? parseInt(countArg.split('=')[1]) : 50;
                    outputDir = outputArg ? outputArg.split('=')[1] : './output';
                    if (isNaN(count) || count <= 0) {
                        console.error('❌ Invalid count parameter. Must be a positive number.');
                        process.exit(1);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /* yield */, seeder.run(count, outputDir)];
                case 2:
                    _a.sent();
                    return [3 /* break */, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Seeder execution failed:', error_2);
                    process.exit(1);
                    return [3 /* break */, 4];
                case 4: return [2 /* return */];
            }
        });
    });
}
// Export for use as module
module.exports = { TraceabilitySeeder };
// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
