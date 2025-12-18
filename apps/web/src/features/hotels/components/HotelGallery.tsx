    "use client";
    /**
     * HotelGallery Component
     * Displays a gallery of hotel and room images in a responsive grid and dialog.
     */

    import { useState, useMemo } from "react";
    import { GalleryImage } from "@/app/(public)/hotels/[hotel_id]/page";
    import Image from "next/image";
    import { Images } from "lucide-react";
    import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    export const HotelGallery = ({ images }: { images: GalleryImage[] }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("hotel");

    // Separate images by source
    const hotelImages = useMemo(() => images.filter(img => img.source === 'hotel'), [images]);
    const roomTypeImages = useMemo(() => images.filter(img => img.source === 'roomtype'), [images]);

    // Group room type images by room type
    const roomTypeGroups = useMemo(() => {
        const groups: Record<string, { name: string; images: GalleryImage[] }> = {};
        roomTypeImages.forEach(img => {
        if (img.roomTypeId && img.roomTypeName) {
            if (!groups[img.roomTypeId]) {
            groups[img.roomTypeId] = { name: img.roomTypeName, images: [] };
            }
            groups[img.roomTypeId].images.push(img);
        }
        });
        return groups;
    }, [roomTypeImages]);

    const openGallery = (tab: string = "hotel") => {
        setActiveTab(tab);
        setIsDialogOpen(true);
    };

    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[500px] p-2">
            {/* Left: Large Main Image */}
            <div 
            className="relative rounded-xl overflow-hidden group cursor-pointer h-full"
            onClick={() => openGallery("hotel")}
            >
            <Image 
                src={images[0]?.url || '/placeholder.jpg'} 
                alt={`Main`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Right: Two Stacked Images */}
            <div className="grid grid-rows-2 gap-2 h-full">
            {/* Top Right Image */}
            <div 
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openGallery("hotel")}
            >
                <Image 
                src={images[1]?.url || images[0]?.url || '/placeholder.jpg'} 
                alt={`Image 2`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Bottom Right Image */}
            <div 
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openGallery("hotel")}
            >
                <Image 
                src={images[2]?.url || images[0]?.url || '/placeholder.jpg'} 
                alt={`Image 3`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* "See More" Overlay if there are more than 3 images */}
                {images.length > 3 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                    <Images className="w-12 h-12 mb-2" />
                    <span className="text-2xl font-bold">+{images.length - 3}</span>
                    <span className="text-sm opacity-90">More Photos</span>
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Full Gallery Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="min-w-[80vw] h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
            <DialogTitle className="sr-only">Hotel Gallery</DialogTitle>
        

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white px-6 pt-6">
                <TabsList className="grid w-full grid-cols-auto gap-2" style={{ gridTemplateColumns: `repeat(${1 + Object.keys(roomTypeGroups).length}, minmax(0, 1fr))` }}>
                    <TabsTrigger value="hotel" className="text-sm">
                    Overview
                    </TabsTrigger>
                    {Object.entries(roomTypeGroups).map(([id, group]) => (
                    <TabsTrigger key={id} value={id} className="text-sm">
                        {group.name} ({group.images.length})
                    </TabsTrigger>
                    ))}
                </TabsList>
                </div>

                {/* Hotel Images Tab */}
                <TabsContent value="hotel" className="flex-1 overflow-hidden m-0">
                <ImageGalleryView 
                    images={hotelImages}
                />
                </TabsContent>

                {/* Room Type Tabs */}
                {Object.entries(roomTypeGroups).map(([id, group]) => (
                <TabsContent key={id} value={id} className="flex-1 overflow-hidden m-0">
                    <ImageGalleryView 
                    images={group.images}
                    title={group.name}
                    />
                </TabsContent>
                ))}
            </Tabs>
            </DialogContent>
        </Dialog>
        </>
    );
    };

    // Separate component for the image gallery view
    function ImageGalleryView({ 
    images, 
    title 
    }: { 
    images: GalleryImage[]; 
    title?: string;
    }) {
    if (images.length === 0) {
        return (
        <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
            <Images className="w-16 h-16 mx-auto mb-2" />
            <p>No images available</p>
            </div>
        </div>
        );
    }

    return (
        <div className="h-[80vh] w-full overflow-hidden" style={{ overflowY: 'scroll' }}>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
                <div
                key={index}
                className={`
                    relative overflow-hidden rounded-lg
                    ${index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
                `}
                >
                <Image
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                />
                </div>
            ))}
            </div>
        </div>
    );
    }
