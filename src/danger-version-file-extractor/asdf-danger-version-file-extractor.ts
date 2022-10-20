import * as fs from "fs";
import { DangerVersionFileExtractor } from "../danger-version-file-extractor";

export class AsdfDangerVersionFileExtractor implements DangerVersionFileExtractor {
    getDangerVersionFromFile(filePath: string): string | undefined {
        if (filePath.length == 0 || fs.existsSync(filePath) == false) {
            return undefined;
        }
        return this.getDangerVersionFromText(fs.readFileSync(filePath).toString());
    }

    getDangerVersionFromText(text: string): string | undefined {
        const lines = text.split(/[\r\n]/);

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("danger") == false) {
                continue;
            }
            return trimmedLine.substring("danger".length).trim();
        }

        return undefined;
    }
}
