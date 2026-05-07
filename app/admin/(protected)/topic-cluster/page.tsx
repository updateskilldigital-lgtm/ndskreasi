import { TopicClusterForm } from '@/components/admin/TopicClusterForm'

export default function TopicClusterPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Topic Cluster Generator</h1>
        <p className="text-gray-500 text-sm mt-1">Generate pillar page + supporting articles sekaligus untuk topical authority SEO</p>
      </div>
      <TopicClusterForm />
    </div>
  )
}
