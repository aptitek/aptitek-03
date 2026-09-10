import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroActions } from './HeroActions';

const meta = {
  title: 'Components/HeroActions',
  component: HeroActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    docsLabel: 'Documentation Astro',
    sampleDocLabel: 'Exemple de Document A4',
  },
} satisfies Meta<typeof HeroActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
