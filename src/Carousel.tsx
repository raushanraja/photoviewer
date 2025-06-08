import { Component, createResource, createSignal, onMount, onCleanup } from "solid-js";
import toast from "solid-toast";
import imagePaths from "./image.json";

const IsDev = false;
const TempImages = [
    "https://picsum.photos/1920/1080?random=1",
    "https://picsum.photos/1920/1080?random=2",
    "https://picsum.photos/1920/1080?random=3",
    "https://picsum.photos/1920/1080?random=4",
    "https://picsum.photos/1920/1080?random=5",
    "https://picsum.photos/1920/1080?random=6",
    "https://picsum.photos/1920/1080?random=7",
];

const fetchSlides = async (): Promise<string[]> => {
    if (IsDev) {
        return TempImages;
    }
    try {
        return imagePaths.map((item: { filename: string; path: string }) => item.path); // Extract paths
    }
    catch (error) {
        console.error("Error fetching slides:", error);
        return [];
    }
};

const AddedNotification = () => toast.success('Image added');
const RemovedNotification = () => toast.error('Image removed');

const Carousel: Component = () => {
    const [images] = createResource<string[]>(fetchSlides) || [];
    const [currentIndex, setCurrentIndex] = createSignal(0);

    const nextSlide = () => {
        if (currentIndex() + 1 < (images()?.length ?? 1)) {
            setCurrentIndex(currentIndex() + 1);
        }
    };

    const prevSlide = () => {
        setCurrentIndex((currentIndex() - 1 + (images()?.length ?? 1)) % (images()?.length ?? 1));
    };

    const goToFirstSlide = () => {
        setCurrentIndex(0);
    };

    const toggleImageInLocalStorage = () => {
        const currentImage = images()?.[currentIndex()];
        if (!currentImage) return;

        const storedImages = JSON.parse(localStorage.getItem("selectedImages") || "[]");
        if (storedImages.includes(currentImage)) {
            const updatedImages = storedImages.filter((img: string) => img !== currentImage);
            localStorage.setItem("selectedImages", JSON.stringify(updatedImages));
            RemovedNotification(); 
        } else {
            storedImages.push(currentImage);
            localStorage.setItem("selectedImages", JSON.stringify(storedImages));
            AddedNotification(); 
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowRight") {
            nextSlide();
        } else if (event.key === "ArrowLeft") {
            prevSlide();
        } else if (event.key === "Enter") {
            toggleImageInLocalStorage();
        }
    };

    onMount(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    onCleanup(() => {
        window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div class="h-screen overflow-clip">
            <div class="carousel h-full w-full">
                {(images() ?? []).map((src, index) => (
                <div
                    id={`slide${index + 1}`}
                    class={`carousel-item relative w-full ${index === currentIndex() ? "block" : "hidden"}`}
                >
                    <img src={src} class="h-full w-full object-center object-contain" alt="PhotoViewer" />
                </div>
            ))}
        </div>
            <div class="absolute left-5 right-5 top-[540px] flex justify-between">
                <button onClick={prevSlide} class="btn btn-circle" aria-label="Previous Slide">❮</button>
                <button onClick={nextSlide} class="btn btn-circle" aria-label="Next Slide" disabled={currentIndex() + 1 === images()?.length}>❯</button>
            </div>
            <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white text-lg flex items-center gap-4">
                <span>{currentIndex() + 1}/{images()?.length ?? 0}</span>
                {currentIndex() + 1 === images()?.length && (
                    <button onClick={goToFirstSlide} class="btn btn-sm btn-primary" aria-label="Go to First Slide">Go to First</button>
                )}
            </div>
        </div>
    );
};

export default Carousel;
