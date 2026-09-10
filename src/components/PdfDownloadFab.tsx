import { useCallback } from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import type { SxProps, Theme } from '@mui/material/styles';

export interface PdfDownloadFabProps {
  /**
   * Optional URL to a pre-generated static PDF (e.g. /pdf/sample-document.pdf).
   * If provided, clicking initiates a download of this file.
   * If omitted, clicking defaults to invoking window.print().
   */
  pdfUrl?: string;

  /**
   * Tooltip and accessible aria-label.
   * @default "Télécharger le document en PDF"
   */
  label?: string;

  /**
   * MUI Fab color variant.
   * @default "primary"
   */
  color?:
    | 'primary'
    | 'secondary'
    | 'default'
    | 'inherit'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';

  /**
   * MUI Fab size.
   * @default "large"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Download attribute filename when downloading static PDF.
   */
  downloadFileName?: string;

  /**
   * Optional custom MUI sx styling overrides.
   */
  sx?: SxProps<Theme>;

  /**
   * Custom CSS class name.
   */
  className?: string;
}

export function PdfDownloadFab({
  pdfUrl,
  label = 'Télécharger le document en PDF',
  color = 'primary',
  size = 'large',
  downloadFileName,
  sx,
  className = '',
}: PdfDownloadFabProps) {
  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      if (downloadFileName) {
        link.download = downloadFileName;
      }
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  }, [pdfUrl, downloadFileName]);

  return (
    <div
      className={`pdf-fab-container ${className}`.trim()}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 1300,
      }}
    >
      <Tooltip title={label} placement="left" arrow>
        <Fab
          color={color}
          size={size}
          aria-label={label}
          onClick={handleClick}
          data-testid="pdf-download-fab"
          sx={{
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.28)',
            transition:
              'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.06)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            },
            '@media print': {
              display: 'none !important',
            },
            ...sx,
          }}
        >
          <PictureAsPdfRoundedIcon />
        </Fab>
      </Tooltip>
      <style>{`
        @media print {
          .pdf-fab-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
