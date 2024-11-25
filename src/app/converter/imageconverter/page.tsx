"use client";
import {ChangeEvent, DragEvent, useState} from "react";
import styles from "../../page.module.css";
import Navbar from "@/app/components/navbar/page";

interface Dimensions {
    width: number | null;
    height: number | null;
}

const MAX_DIMENSION = 5000;

const validateDimension = (value: number, fallback: number | null): number | null => {
    if (value >= 1 && value <= MAX_DIMENSION) return value;
    return fallback;
};

const calculateMarginLeft = (fileName: string): string => {
    const length = fileName.length;
    if (length === 0) return "30%";
    if (length < 10) return "30%";
    if (length < 15) return "15%";
    if (length < 17) return "10%";
    return "0%";
};

const getNewFileName = (baseName: string, width: number, height: number, format: string): string =>
    `${baseName}_${width}x${height}.${format}`;

const getCompatibleFormats = (fileType: string) => {
    const imageFormats = ["png", "jpg", "jpeg", "webp", "gif", "tiff", "bmp", "raw", "ico"];


    if (fileType.startsWith("image")) return imageFormats;

    return [];
};

const FileConverter = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("current");
    const [selectedFormat, setSelectedFormat] = useState<string>("png");
    const [customDimensions, setCustomDimensions] = useState<Dimensions>({width: null, height: null});
    const [originalDimensions, setOriginalDimensions] = useState<Dimensions>({width: null, height: null});
    const [fileType, setFileType] = useState<string>("");

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) return;

        const fileType = uploadedFile.type;
        const compatibleFormats = getCompatibleFormats(fileType);

        if (!compatibleFormats.length) {
            alert("Unsupported file type. Please upload a valid image.");
            return;
        }

        setFile(uploadedFile);
        setFileName(uploadedFile.name);
        setFileType(fileType);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let {width, height} = img;

            // Use baseName from fileName (the name of the file without its extension)
            const baseName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

            if (selectedSize === "current") {
                width = originalDimensions.width || img.width;
                height = originalDimensions.height || img.height;
            } else if (selectedSize !== "custom") {
                [width, height] = selectedSize.split("x").map(Number);
            } else {
                width = customDimensions.width || img.width;
                height = customDimensions.height || img.height;
            }

            canvas.width = width * 2; // High-resolution canvas
            canvas.height = height * 2;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.scale(2, 2); // Scale canvas to the target resolution
                ctx.drawImage(img, 0, 0, width, height);

                const newFileName = getNewFileName(baseName, width, height, selectedFormat);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = newFileName;
                            link.click();
                        }
                    },
                    `image/${selectedFormat}`,
                    0.95 // High quality for lossy formats
                );
            }
        };
    };


    const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedSize(value);

        if (value === "current") {
            setCustomDimensions(originalDimensions);
        } else if (value !== "custom") {
            setCustomDimensions({width: null, height: null});
        }
    };

    const handleCustomDimensionChange = (key: keyof Dimensions) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = validateDimension(Number(e.target.value), originalDimensions[key]);
        setCustomDimensions((prev) => ({...prev, [key]: value}));
    };

    const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedFormat(e.target.value);
    };

    const handleConvert = () => {
        if (!file || !fileName) return;

        const baseName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
        const compatibleFormats = getCompatibleFormats(fileType);
        if (!compatibleFormats.includes(selectedFormat)) {
            alert(`Invalid format for this file type. Please select a compatible format.`);
            return;
        }

        if (fileType.startsWith("image")) {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let {width, height} = img;

                if (selectedSize === "current") {
                    width = originalDimensions.width || img.width;
                    height = originalDimensions.height || img.height;
                } else if (selectedSize !== "custom") {
                    [width, height] = selectedSize.split("x").map(Number);
                } else {
                    width = customDimensions.width || img.width;
                    height = customDimensions.height || img.height;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);

                    const newFileName = getNewFileName(baseName, width, height, selectedFormat);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = newFileName;
                                link.click();
                            }
                        },
                        `image/${selectedFormat}`
                    );
                }
            };
        } else if (fileType.startsWith("audio")) {
            const newFileName = `${baseName}.${selectedFormat}`;

            // Handle conversion for audio (this is just a placeholder for actual audio conversion logic)
            alert(`Audio file converted to ${selectedFormat} format: ${newFileName}`);
        } else if (fileType.startsWith("video")) {
            const newFileName = `${baseName}.${selectedFormat}`;

            // Handle conversion for video (this is just a placeholder for actual video conversion logic)
            alert(`Video file converted to ${selectedFormat} format: ${newFileName}`);
        } else if (fileType.startsWith("application")) {
            const newFileName = `${baseName}.${selectedFormat}`;

            // Handle conversion for documents (this is just a placeholder for actual document conversion logic)
            alert(`Document file converted to ${selectedFormat} format: ${newFileName}`);
        }
    };

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        if (!uploadedFile) return;

        const fileType = uploadedFile.type;
        const compatibleFormats = getCompatibleFormats(fileType);

        if (!compatibleFormats.length) {
            alert("Unsupported file type.");
            return;
        }

        setFile(uploadedFile);
        setFileName(uploadedFile.name);
        setFileType(fileType);

        const url = URL.createObjectURL(uploadedFile);
        const img = new Image();

        if (fileType.startsWith("image")) {
            img.onload = () => {
                setOriginalDimensions({width: img.width, height: img.height});
                setCustomDimensions({width: img.width, height: img.height});
            };
            img.src = url;
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Navbar/>

                <div
                    className={styles.fileBox}
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    role="button"
                    tabIndex={0}
                    aria-label="Drop or upload a file"
                >
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/tiff,image/bmp,image/raw,image/ico"
                        className={styles.uploadInput}
                        onChange={handleFileUpload}
                        style={{marginLeft: calculateMarginLeft(fileName)}}
                    />
                    {!file && <span className={styles.uploadText}>or drop a file</span>}
                    {file && (
                        <div className={styles.filePreview}>
                            {fileType.startsWith("image") && <img src={URL.createObjectURL(file)} alt="Preview"/>}
                        </div>
                    )}
                </div>

                {file && fileName && (
                    <div className={styles.fileDetails}>
                        <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                            View File
                        </a>
                    </div>
                )}

                {fileType.startsWith("image") && (
                    <div className={styles.sizeSelector}>
                        <label htmlFor="imageSize">Choose a size:</label>
                        <select
                            id="fileSize"
                            className={styles.sizeDropdown}
                            value={selectedSize}
                            onChange={handleSizeChange}
                        >
                            <option value="current">Current Size</option>
                            <option value="150x150">Thumbnail (150x150)</option>
                            <option value="400x400">Profile Picture (400x400)</option>
                            <option value="1080x1080">Instagram Post (1080x1080)</option>
                            <option value="1200x630">Facebook Link Preview (1200x630)</option>
                            <option value="1200x675">Twitter Post (1200x675)</option>
                            <option value="800x600">Web Content (800x600)</option>
                            <option value="1920x1080">Website Header (1920x1080)</option>
                            <option value="3000x2400">A4 Print (3000x2400)</option>
                            <option value="3600x2400">Letter Print (3600x2400)</option>
                            <option value="4000x3000">High-Resolution (4000x3000)</option>
                            <option value="custom">Custom Size</option>
                        </select>
                    </div>
                )}

                {selectedSize === "custom" && (
                    <div className={styles.customSizeInputs}>
                        <label>
                            Custom Width:
                            <input
                                type="number"
                                value={customDimensions.width || ""}
                                onChange={handleCustomDimensionChange("width")}
                                className={styles.customInput}
                            />
                        </label>
                        <label>
                            Custom Height:
                            <input
                                type="number"
                                value={customDimensions.height || ""}
                                onChange={handleCustomDimensionChange("height")}
                                className={styles.customInput}
                            />
                        </label>
                    </div>
                )}

                {fileType.startsWith("image") && (
                    <div className={styles.formatSelector}>
                        <label htmlFor="fileFormat">Select Format: </label>
                        <select
                            id="fileFormat"
                            className={styles.formatDropdown}
                            value={selectedFormat}
                            onChange={handleFormatChange}
                        >
                            {getCompatibleFormats(fileType).map((format) => (
                                <option key={format} value={format}>
                                    {format.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    onClick={handleConvert}
                    className={styles.convertButton}
                    disabled={!file || (selectedSize === "custom" && (!customDimensions.width || !customDimensions.height))}
                >
                    Convert
                </button>
            </main>
        </div>
    );
};

export default FileConverter;
