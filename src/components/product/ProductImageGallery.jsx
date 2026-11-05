import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageOff, ZoomIn } from 'lucide-react'
import { cn } from '../../utils/helpers'

const ProductImageGallery = ({ images = [], alt = 'Product image', className }) => {
  const gallery = (images ?? []).filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  if (!gallery.length) {
    return (
      <div
        className={cn(
          'flex aspect-square items-center justify-center rounded-3xl border border-slate-200/70 bg-slate-50 text-slate-300',
          className,
        )}
      >
        <ImageOff className="h-12 w-12" />
      </div>
    )
  }

  const safeIndex = Math.min(activeIndex, gallery.length - 1)
  const activeImage = gallery[safeIndex]

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        className="group relative aspect-square overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.img
          key={activeImage}
          src={activeImage}
          alt={alt}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full w-full object-cover"
          style={{
            transformOrigin: origin,
            transform: isZooming ? 'scale(1.6)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />

        {gallery.length > 1 ? (
          <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur">
            <ZoomIn className="h-3.5 w-3.5" />
            Hover to zoom
          </span>
        ) : null}
      </div>

      {gallery.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === safeIndex}
              className={cn(
                'h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition-colors',
                index === safeIndex
                  ? 'border-brand-500'
                  : 'border-transparent hover:border-slate-300',
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ProductImageGallery
