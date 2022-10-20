export interface DangerVersionFileExtractor {
    getDangerVersionFromFile(filePath: string): string | undefined;
    getDangerVersionFromText(text: string): string | undefined;
}
