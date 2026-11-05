import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CircleAlert, PackageSearch, SlidersHorizontal, Sparkles } from 'lucide-react'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Pagination from '../../../components/common/Pagination'
import SearchBar from '../../../components/common/SearchBar'
import Select from '../../../components/common/Select'
import ProductFilters from '../../../components/product/ProductFilters'
import ProductGrid from '../../../components/product/ProductGrid'
import { useCatalogProducts } from '../../../hooks/useProduct'
import { useDebounce } from '../../../hooks/useDebounce'
import { useProductActions } from '../../../hooks/useProductActions'
import { cn } from '../../../utils/helpers'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
]

const priceOf = (product) => (product?.price == null ? 0 : Number(product.price))

const ProductList = () => {
  const { products, isLoading, error } = useCatalogProducts()
  const { wishlistIds, justAddedId, addToCart, toggleWishlist } = useProductActions()

  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('category') ?? ''
  const debouncedSearch = useDebounce(search, 300)

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const setParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  const categories = useMemo(() => {
    const map = new Map()
    products.forEach((product) => {
      if (product.categoryId == null) return
      const key = String(product.categoryId)
      const existing = map.get(key)
      if (existing) existing.count += 1
      else
        map.set(key, {
          id: product.categoryId,
          name: product.categoryName || 'Uncategorised',
          count: 1,
        })
    })
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)
    const selectedCategory = categoryId || null

    const result = products.filter((product) => {
      const price = priceOf(product)
      const stock = product.quantity == null ? null : Number(product.quantity)
      const matchesSearch =
        !term ||
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.categoryName?.toLowerCase().includes(term)
      const matchesCategory =
        !selectedCategory || String(product.categoryId) === selectedCategory
      const matchesMin = min == null || Number.isNaN(min) || price >= min
      const matchesMax = max == null || Number.isNaN(max) || price <= max
      const matchesStock = !inStockOnly || stock == null || stock > 0
      return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesStock
    })

    switch (sort) {
      case 'price-asc':
        return [...result].sort((a, b) => priceOf(a) - priceOf(b))
      case 'price-desc':
        return [...result].sort((a, b) => priceOf(b) - priceOf(a))
      case 'name-asc':
        return [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      case 'name-desc':
        return [...result].sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      default:
        return result
    }
  }, [products, debouncedSearch, categoryId, minPrice, maxPrice, inStockOnly, sort])

  const activeFilterCount =
    (categoryId ? 1 : 0) +
    (minPrice !== '' || maxPrice !== '' ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value) => {
    setParam('search', value)
    setPage(1)
  }

  const handleFilters = (patch) => {
    if ('categoryId' in patch) setParam('category', patch.categoryId)
    if ('minPrice' in patch) setMinPrice(patch.minPrice)
    if ('maxPrice' in patch) setMaxPrice(patch.maxPrice)
    if ('inStockOnly' in patch) setInStockOnly(patch.inStockOnly)
    setPage(1)
  }

  const handleReset = () => {
    setParam('category', '')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setPage(1)
  }

  const handlePageChange = (next) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            The catalogue
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Explore the catalogue
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Browse every gadget, filter by what matters and find your next upgrade.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search gadgets..."
            size="lg"
          />
        </div>
      </motion.header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className={cn('lg:block', filtersOpen ? 'block' : 'hidden')}>
          <div className="lg:sticky lg:top-24">
            <ProductFilters
              categories={categories}
              value={{ categoryId, minPrice, maxPrice, inStockOnly }}
              onChange={handleFilters}
              onReset={handleReset}
            />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen((prev) => !prev)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
              </Button>
              <p className="text-sm text-muted">
                {isLoading
                  ? 'Loading products…'
                  : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
              </p>
            </div>

            <div className="w-full sm:w-56">
              <Select
                aria-label="Sort products"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                options={SORT_OPTIONS}
              />
            </div>
          </div>

          {error ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <div className="mt-6">
            <ProductGrid
              products={visible}
              isLoading={isLoading}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlistIds={wishlistIds}
              justAddedId={justAddedId}
              emptyState={
                <EmptyState
                  icon={PackageSearch}
                  title="No products match your filters"
                  description="Try widening your price range, clearing the search or choosing another category."
                  action={
                    <Button variant="secondary" onClick={handleReset}>
                      Clear filters
                    </Button>
                  }
                />
              }
            />
          </div>

          {!isLoading && filtered.length > PAGE_SIZE ? (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showSummary
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProductList
