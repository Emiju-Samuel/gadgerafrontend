import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail, User } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Please enter your full name')
      .max(60, 'That name is a little too long'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

const RegisterForm = ({ onSubmit, isSubmitting = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Full name"
        type="text"
        placeholder="Ada Lovelace"
        icon={User}
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          icon={Lock}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          icon={Lock}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
  )
}

export default RegisterForm
