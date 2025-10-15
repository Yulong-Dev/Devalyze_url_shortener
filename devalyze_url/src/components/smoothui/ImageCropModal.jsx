import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

const ImageCropModal = ({ open, onClose, imageSrc, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // ✅ Move this hook ABOVE the conditional return
    const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // ✅ Now safe to return early after all hooks
    if (!open) return null;

    const createCroppedImage = async () => {
        try {
            const canvas = document.createElement("canvas");
            const image = new Image();
            image.src = imageSrc;

            await new Promise((resolve) => {
                image.onload = resolve;
            });

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                croppedAreaPixels.x * scaleX,
                croppedAreaPixels.y * scaleY,
                croppedAreaPixels.width * scaleX,
                croppedAreaPixels.height * scaleY,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                }, "image/jpeg", 0.8);
            });
        } catch (error) {
            console.error("Error cropping image:", error);
            return null;
        }
    };

    const handleSave = async () => {
        const croppedImage = await createCroppedImage();
        if (croppedImage) onCropComplete(croppedImage);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Crop Your Image</h2>

                <div className="relative w-full h-96 bg-gray-100 rounded-lg mb-4">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropAreaChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Zoom</label>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save & Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
