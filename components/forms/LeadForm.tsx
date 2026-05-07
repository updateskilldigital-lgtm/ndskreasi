'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CheckCircle, Send, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const leadSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  business_name: z.string().min(2, 'Nama bisnis minimal 2 karakter'),
  whatsapp: z.string().regex(/^62[0-9]{9,13}$/, 'Nomor WhatsApp tidak valid (contoh: 6281234567890)'),
  has_website: z.enum(['yes', 'no']),
  timeline: z.enum(['<1 month', '1-3 months', '>3 months']),
  budget: z.string().optional(),
  need_description: z.string().min(20, 'Ceritakan kebutuhan Anda minimal 20 karakter'),
})

type LeadFormData = z.infer<typeof leadSchema>

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()

        const waMessage = `Halo, saya ${data.name} dari ${data.business_name}. Saya baru saja mengisi form konsultasi dan tertarik dengan layanan website agency.`
        setTimeout(() => {
          window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`, '_blank')
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Terima Kasih!</h3>
        <p className="text-text-secondary">
          Tim kami akan menghubungi Anda dalam <strong>5 menit</strong> melalui WhatsApp.
        </p>
      </motion.div>
    )
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="glass-card rounded-2xl p-6 md:p-8"
        id="lead-form"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Konsultasi Gratis
          </h2>
          <p className="text-text-secondary">
            Isi form di bawah, tim kami akan menghubungi Anda dalam 5 menit
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Nama Lengkap *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-white/70"
                placeholder="Budi Santoso"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Nama Bisnis *
              </label>
              <input
                {...register('business_name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-white/70"
                placeholder="Cafe Bahagia"
              />
              {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Nomor WhatsApp *
            </label>
            <input
              {...register('whatsapp')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-white/70"
              placeholder="6281234567890"
            />
            <p className="text-xs text-text-secondary mt-1">Gunakan format 62... (tanpa 0 di awal)</p>
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Status Website *
              </label>
              <select
                {...register('has_website')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-white/70"
              >
                <option value="no">Belum punya website</option>
                <option value="yes">Sudah punya, ingin upgrade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Target Selesai *
              </label>
              <select
                {...register('timeline')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-white/70"
              >
                <option value="<1 month">Kurang dari 1 bulan</option>
                <option value="1-3 months">1-3 bulan</option>
                <option value=">3 months">Lebih dari 3 bulan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Estimasi Budget (Opsional)
            </label>
            <input
              {...register('budget')}
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-white/70"
              placeholder="15000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Ceritakan Kebutuhan Anda *
            </label>
            <textarea
              {...register('need_description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-none bg-white/70"
              placeholder="Contoh: Saya punya bisnis kuliner yang ingin punya website untuk pemesanan online..."
            />
            {errors.need_description && <p className="text-red-500 text-xs mt-1">{errors.need_description.message}</p>}
          </div>

          <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
            <Send className="h-4 w-4 mr-2" />
            Kirim & Dapatkan Konsultasi Gratis
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
            <Shield className="h-3 w-3" />
            <span>Data Anda aman dan tidak akan disebarluaskan</span>
          </div>
        </form>
      </motion.div>
    </Container>
  )
}
