import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays, Percent, Tag, Ticket } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'

const createSchema = (allowPast) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must be 80 characters or fewer'),
    code: z
      .string()
      .trim()
      .min(3, 'Code must be at least 3 characters')
      .max(30, 'Code must be 30 characters or fewer')
      .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers and dashes only'),
    discount: z.coerce
      .number()
      .int('Use a whole number')
      .min(1, 'Minimum discount is 1%')
      .max(100, 'Maximum discount is 100%'),
    expirationDate: z
      .string()
      .min(1, 'Expiration date is required')
      .superRefine((value, ctx) => {
        const parsed = new Date(value)
        if (Number.isNaN(parsed.getTime())) {
          ctx.addIssue({ code: 'custom', message: 'Enter a valid date' })
          return
        }
        if (!allowPast && parsed.getTime() <= Date.now()) {
          ctx.addIssue({ code: 'custom', message: 'Choose a future date' })
        }
      }),
  })

const CouponForm = ({
  defaultValues,
  allowPast = false,
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitLabel = 'Save coupon',
}) => {
  const schema = useMemo(() => createSchema(allowPast), [allowPast])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', code: '', discount: '', expirationDate: '', ...defaultValues },
    mode: 'onTouched',
  })

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Coupon name"
          placeholder="e.g. Summer Sale"
          icon={Tag}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Code"
          placeholder="e.g. SUMMER20"
          icon={Ticket}
          className="uppercase placeholder:normal-case"
          autoComplete="off"
          error={errors.code?.message}
          {...register('code')}
        />
        <Input
          label="Discount (%)"
          type="number"
          min="1"
          max="100"
          step="1"
          placeholder="10"
          icon={Percent}
          error={errors.discount?.message}
          {...register('discount')}
        />
        <Input
          label="Expiration date"
          type="date"
          icon={CalendarDays}
          min={allowPast ? undefined : today}
          error={errors.expirationDate?.message}
          {...register('expirationDate')}
        />
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

export default CouponForm
