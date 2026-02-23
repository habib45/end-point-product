import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import ContentHeader from '@/components/ui/ContentHeader'
import toast from 'react-hot-toast'

interface BlogForm {
  title: string
  category: string
  content: string
  tags: string
  status: 'Draft' | 'Published'
}

export default function BlogCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<BlogForm>({
    defaultValues: { status: 'Draft' }
  })

  const onSubmit = (data: BlogForm) => {
    console.log(data)
    toast.success(`Post "${data.title}" saved as ${data.status}!`)
    navigate('/blog/posts')
  }

  return (
    <>
      <ContentHeader title="Create Post" breadcrumbs={[{ label: 'Blog' }, { label: 'Posts', path: '/blog/posts' }, { label: 'New Post' }]} />

      <div className="row g-3">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Post Content</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Post Title *</label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter post title..."
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Content *</label>
                <div className="border rounded-2 mb-1 p-1 d-flex gap-1 flex-wrap">
                  {['B', 'I', 'U', 'H1', 'H2', '"', '≡', '—', 'Link', 'Img'].map(b => (
                    <button key={b} type="button" className="btn btn-sm btn-outline-secondary" style={{ minWidth: 36 }}>{b}</button>
                  ))}
                </div>
                <textarea
                  className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                  rows={12}
                  placeholder="Write your post content here..."
                  {...register('content', { required: 'Content is required' })}
                />
                {errors.content && <div className="invalid-feedback">{errors.content.message}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Publish Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Status</label>
                <select className="form-select" {...register('status')}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category *</label>
                <select className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                  {...register('category', { required: 'Category is required' })}>
                  <option value="">Select category...</option>
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Backend</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="React, TypeScript, Web Dev"
                  {...register('tags')}
                />
                <small className="text-muted">Comma-separated</small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Featured Image</label>
                <div className="border rounded-2 p-3 text-center bg-body-tertiary" style={{ cursor: 'pointer' }}>
                  <i className="bi bi-image fs-2 text-muted d-block mb-1"></i>
                  <small className="text-muted">Click to upload or drag & drop</small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary flex-grow-1"
                  onClick={handleSubmit(d => { d.status = 'Draft'; onSubmit(d) })}>
                  Save Draft
                </button>
                <button type="button" className="btn btn-primary flex-grow-1"
                  onClick={handleSubmit(d => { d.status = 'Published'; onSubmit(d) })}>
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
