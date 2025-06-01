import React from 'react';

interface GalleryProps {
  images: Array<{
    id: string;
    url: string;
    quote: string;
    createdAt: string;
  }>;
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black tracking-tight mb-4">Gallery</h2>
        <p className="text-lg text-black/50 font-light">Explore creations from our community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
            <div
              key={image.id}
            className="group relative aspect-[4/3] bg-black/5 rounded-2xl overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.quote}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xl font-bold mb-2">{image.quote}</p>
                <p className="text-white/70 text-sm">
                  Created {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}; 