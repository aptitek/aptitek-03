import type { Meta, StoryObj } from '@storybook/react-vite';
import { PdfDownloadFab } from './PdfDownloadFab';

const meta: Meta<typeof PdfDownloadFab> = {
  title: 'Components/PdfDownloadFab',
  component: PdfDownloadFab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pdfUrl: '/pdf/sample-document.pdf',
    label: 'Télécharger le document en PDF',
    color: 'primary',
    size: 'large',
  },
};

export const SecondaryColor: Story = {
  args: {
    label: 'Exporter la facture en PDF',
    color: 'secondary',
    size: 'medium',
  },
};

export const PrintFallback: Story = {
  args: {
    label: 'Imprimer directement la page',
    color: 'info',
    size: 'large',
  },
};
