import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Camera, ImageOff, Trash2 } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import { cn, getInitials } from '../../utils/helpers'
import { getProductImageUrl } from '../../utils/formatters'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
})

const ProfileForm = ({ profile, onSave, isSaving = false }) => {
  const fileInputRef = useRef(null)

  const [avatar, setAvatar] = useState(() => getProductImageUrl(profile?.returnedImg))
  const [avatarTouched, setAvatarTouched] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: profile?.name ?? '' },
    mode: 'onTouched',
  })

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setAvatarError('Image must be 2MB or smaller.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(typeof reader.result === 'string' ? reader.result : null)
      setAvatarTouched(true)
      setAvatarError('')
    }
    reader.onerror = () => setAvatarError('Could not read that image. Try another.')
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarTouched(true)
    setAvatarError('')
  }

  const submit = async (values) => {
    try {
      await onSave({
        name: values.name,
        img: avatarTouched ? (avatar ?? '') : undefined,
      })
      setAvatarTouched(false)
    } catch {
      // The page surfaces a toast; keep local state so the user can retry.
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <span
            className={cn(
              'flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-brand-50 text-2xl font-semibold text-brand-700 ring-1 ring-brand-100',
            )}
          >
            {avatar ? (
              <img src={avatar} alt="Profile avatar" className="h-full w-full object-cover" />
            ) : (
              getInitials(profile?.name) || <ImageOff className="h-7 w-7 text-brand-400" />
            )}
          </span>

          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            whileTap={{ scale: 0.9 }}
            aria-label="Upload a profile photo"
            className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700"
          >
            <Camera className="h-4 w-4" />
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Profile photo</p>
          <p className="mt-1 text-xs text-muted">
            PNG or JPG, up to 2MB. A square image looks best.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload new
            </Button>
            {avatar ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={handleRemoveAvatar}
              >
                Remove
              </Button>
            ) : null}
          </div>
          {avatarError ? <p className="mt-2 text-xs font-medium text-rose-500">{avatarError}</p> : null}
        </div>
      </div>

      <Input
        label="Full name"
        placeholder="Your name"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <span className="mb-2 block text-sm font-medium text-ink">Email address</span>
        <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-muted">
          {profile?.email ?? '—'}
        </div>
        <p className="mt-2 text-xs text-muted">
          Your email is used to sign in and cannot be changed here.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" isLoading={isSaving}>
          Save changes
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
