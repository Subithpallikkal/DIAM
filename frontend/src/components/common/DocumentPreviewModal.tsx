import { Modal } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { Button } from './Button'
import { Loader } from './Loader'
import type { DocumentPreview } from '../../api/documents.api'

interface DocumentPreviewModalProps {
  open: boolean
  preview: DocumentPreview | null
  loading?: boolean
  onClose: () => void
  onDownload?: () => void
  width?: number | string
}

function canEmbedPreview(mimeType: string): boolean {
  return (
    mimeType === 'application/pdf' ||
    mimeType.startsWith('image/') ||
    mimeType.startsWith('text/') ||
    mimeType === 'application/json'
  )
}

export function DocumentPreviewModal({
  open,
  preview,
  loading = false,
  onClose,
  onDownload,
  width = 'min(960px, calc(100vw - 32px))',
}: DocumentPreviewModalProps) {
  return (
    <Modal
      open={open}
      title={preview?.fileName ?? 'Document preview'}
      onCancel={onClose}
      footer={
        preview && onDownload ? (
          <Button icon={<DownloadOutlined />} onClick={onDownload}>
            Download
          </Button>
        ) : null
      }
      width={width}
      destroyOnClose
      styles={{ body: { padding: loading || !preview ? undefined : 0 } }}
    >
      {loading ? (
        <Loader />
      ) : preview && canEmbedPreview(preview.mimeType) ? (
        preview.mimeType.startsWith('image/') ? (
          <img
            src={preview.url}
            alt={preview.fileName}
            className="block max-h-[70vh] w-full object-contain"
          />
        ) : (
          <iframe
            src={preview.url}
            title={preview.fileName}
            className="h-[70vh] w-full border-0"
          />
        )
      ) : preview ? (
        <div className="p-6 text-sm text-slate-600">
          Preview is not available for this file type. Use Download to open the file on your
          device.
        </div>
      ) : null}
    </Modal>
  )
}
