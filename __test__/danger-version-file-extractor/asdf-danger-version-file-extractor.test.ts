import { AsdfDangerVersionFileExtractor } from "../../src/danger-version-file-extractor/asdf-danger-version-file-extractor";

const extractor = new AsdfDangerVersionFileExtractor();

test("empty", () => {
    expect(extractor.getDangerVersionFromText("")).toBeUndefined();
});

test("singleLine", () => {
    expect(extractor.getDangerVersionFromText("danger 9.0.0")).toBe("9.0.0");
});

test("multipleSpacer", () => {
    expect(extractor.getDangerVersionFromText("danger    9.0.0")).toBe("9.0.0");
});

test("otherDependency_1", () => {
    expect(extractor.getDangerVersionFromText("npm 12.0.0\ndanger 9.0.0")).toBe("9.0.0");
});

test("otherDependency_2", () => {
    expect(extractor.getDangerVersionFromText("npm 12.0.0")).toBeUndefined();
});

test("multipleLine_n", () => {
    expect(extractor.getDangerVersionFromText("npm 12.0.0\ndanger 9.0.0\n")).toBe("9.0.0");
});

test("multipleLine_rn", () => {
    expect(extractor.getDangerVersionFromText("npm 12.0.0\r\ndanger 9.0.0\r\n")).toBe("9.0.0");
});

test("multipleLine_r", () => {
    expect(extractor.getDangerVersionFromText("npm 12.0.0\rdanger 9.0.0\r")).toBe("9.0.0");
});

test("emptyFilePath", () => {
    expect(extractor.getDangerVersionFromFile("")).toBeUndefined();
});

test("invalidFilePath", () => {
    expect(extractor.getDangerVersionFromFile("______")).toBeUndefined();
});
