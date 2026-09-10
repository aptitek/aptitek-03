import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import { AppThemeProvider } from './AppThemeProvider.tsx';

export interface PdfDownloadFabProps {
  /**
   * Optional URL to a pre-generated static PDF (e.g. /pdf/sample-document.pdf).
   * If provided, clicking initiates a download of this file.
   * If omitted, clicking defaults to invoking window.print().
   */
  pdfUrl?: string | undefined;

  /**
   * Tooltip and accessible aria-label (must be provided via i18n/localized string).
   */
  label: string;

  /**
   * MUI Fab color variant.
   * @default "primary"
   */
  color?:
    'primary' | 'secondary' | 'default' | 'inherit' | 'success' | 'error' | 'info' | 'warning';

  /**
   * MUI Fab size.
   * @default "large"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Download attribute filename when downloading static PDF.
   */
  downloadFileName?: string | undefined;

  /**
   * Optional custom MUI sx styling overrides.
   */
  sx?: SxProps<Theme> | undefined;

  /**
   * Custom CSS class name.
   */
  className?: string | undefined;
}

export function PdfDownloadFab({
  label,
  pdfUrl,
  color = 'primary',
  size = 'large',
  downloadFileName,
  sx,
  className = '',
}: PdfDownloadFabProps) {
  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (pdfUrl !== undefined && pdfUrl !== '') {
      const link = document.createElement('a');
      link.href = pdfUrl;
      if (downloadFileName !== undefined && downloadFileName !== '') {
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

  const baseFabSx = {
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
  };

  const fabSx = (
    sx !== undefined
      ? [baseFabSx, ...(Array.isArray(sx) ? (sx as readonly object[]) : [sx])]
      : baseFabSx
  ) as SxProps<Theme>;

  return (
    <AppThemeProvider>
      <Box
        className={`pdf-fab-container ${className}`.trim()}
        sx={{
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
            sx={fabSx}
          >
            <PictureAsPdfRoundedIcon />
          </Fab>
        </Tooltip>
      </Box>
    </AppThemeProvider>
  );
}
