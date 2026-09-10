import type { Meta, StoryObj } from '@storybook/react-vite';
import { PdfDownloadFab } from './PdfDownloadFab';

const meta = {
  title: 'Components/PdfDownloadFab',
  component: PdfDownloadFab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'default',
        'success',
        'error',
        'info',
        'warning',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    label: 'Télécharger le document en PDF',
    pdfUrl: '/pdf/sample.pdf',
    downloadFileName: 'sample-document.pdf',
  },
} satisfies Meta<typeof PdfDownloadFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: 'primary',
    size: 'large',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    size: 'medium',
  },
};

export const SmallPrint: Story = {
  args: {
    size: 'small',
    pdfUrl: undefined,
  },
};
