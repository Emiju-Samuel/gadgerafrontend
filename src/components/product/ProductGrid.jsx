import { PackageSearch } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import Skeleton from '../common/Skeleton'
import ProductCard from './ProductCard'
import { cn } from '../../utils/helpers'

const GRID_CLASSES = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft">
    <Skeleton className="aspect-square rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/3" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-11 w-24" />
      </div>
    </div>
  </div>
)

const ProductGrid = ({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  justAddedId,
  emptyState,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn(GRID_CLASSES, className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`product-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      emptyState ?? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try adjusting your filters or search term."
        />
      )
    )
  }

  return (
    <div className={cn(GRID_CLASSES, className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={Boolean(wishlistIds?.has?.(product.id))}
          justAdded={justAddedId === product.id}
        />
      ))}
    </div>
  )
}

export default ProductGrid
