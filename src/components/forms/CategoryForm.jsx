import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tag } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import Textarea from '../common/Textarea'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be 80 characters or fewer'),
  description: z.string().trim().max(500, 'Description must be 500 characters or fewer').optional(),
})

const CategoryForm = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitLabel = 'Save category',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', ...defaultValues },
    mode: 'onTouched',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        label="Category name"
        placeholder="e.g. Smartphones"
        icon={Tag}
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Description"
        placeholder="A short description of what belongs in this category"
        rows={4}
        error={errors.description?.message}
        {...register('description')}
      />

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

export default CategoryForm
