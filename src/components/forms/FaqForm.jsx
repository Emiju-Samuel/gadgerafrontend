import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'

const schema = z.object({
  productId: z.coerce.number().positive('Select a product'),
  question: z
    .string()
    .trim()
    .min(5, 'Question must be at least 5 characters')
    .max(500, 'Question must be 500 characters or fewer'),
  answer: z
    .string()
    .trim()
    .min(5, 'Answer must be at least 5 characters')
    .max(2000, 'Answer must be 2000 characters or fewer'),
})

const FaqForm = ({
  defaultValues,
  products = [],
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitLabel = 'Save FAQ',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { productId: '', question: '', answer: '', ...defaultValues },
    mode: 'onTouched',
  })

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Select
        label="Product"
        placeholder="Select a product"
        options={productOptions}
        error={errors.productId?.message}
        {...register('productId')}
      />

      <Input
        label="Question"
        placeholder="e.g. Does this support fast charging?"
        error={errors.question?.message}
        {...register('question')}
      />

      <Textarea
        label="Answer"
        placeholder="Write a clear, helpful answer"
        rows={5}
        error={errors.answer?.message}
        {...register('answer')}
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

export default FaqForm
