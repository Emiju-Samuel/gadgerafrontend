import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import { cn } from '../../utils/helpers'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be 120 characters or fewer'),
  price: z.coerce
    .number()
    .positive('Enter a price greater than 0')
    .max(10000000, 'Price looks too high'),
  quantity: z.coerce
    .number()
    .int('Use a whole number')
    .min(0, 'Quantity cannot be negative')
    .max(1000000, 'Quantity looks too high'),
  categoryId: z.coerce.number().positive('Please select a category'),
  description: z
    .string()
    .trim()
    .min(10, 'Add a short description (at least 10 characters)')
    .max(2000, 'Description must be 2000 characters or fewer'),
})

const ProductForm = ({
  defaultValues,
  categories = [],
  existingImageUrl,
  requireImage = false,
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitLabel = 'Save product',
}) => {
  const fileInputRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      price: '',
      quantity: '',
      categoryId: '',
      description: '',
      ...defaultValues,
    },
    mode: 'onTouched',
  })

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile)
    return existingImageUrl || ''
  }, [imageFile, existingImageUrl])

  useEffect(
    () => () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    },
    [previewUrl],
  )

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Only image files are allowed.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image must be 5MB or smaller.')
      return
    }
    setImageError('')
    setImageFile(file)
  }

  const clearImage = () => {
    setImageFile(null)
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submit = (values) => {
    if (requireImage && !imageFile) {
      setImageError('A product image is required.')
      return
    }
    onSubmit({ ...values, image: imageFile })
  }

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Product name"
          placeholder="e.g. Aurora Wireless Headphones"
          error={errors.name?.message}
          {...register('name')}
        />
        <Select
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />
        <Input
          label="Price (USD)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
        <Input
          label="Stock quantity"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          error={errors.quantity?.message}
          {...register('quantity')}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Describe the product, its features and what makes it stand out"
        rows={5}
        error={errors.description?.message}
        {...register('description')}
      />

      <div>
        <span className="mb-2 block text-sm font-medium text-ink">
          Product image{requireImage ? '' : ' (optional)'}
        </span>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className={cn(
              'relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-dashed bg-slate-50',
              imageError ? 'border-rose-300' : 'border-slate-300',
            )}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Product preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-rose-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <ImagePlus className="h-8 w-8 text-slate-300" />
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<ImagePlus className="h-4 w-4" />}
            >
              {previewUrl ? 'Replace image' : 'Upload image'}
            </Button>
            <p className="mt-2 text-xs text-muted">JPG or PNG, up to 5MB.</p>

            <AnimatePresence initial={false} mode="wait">
              {imageError ? (
                <motion.p
                  key="image-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="mt-2 text-xs font-medium text-rose-500"
                >
                  {imageError}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
