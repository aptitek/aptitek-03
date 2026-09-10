import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import '../styles/features.css';

export interface HeroActionsProps {
  docsLabel: string;
  sampleDocLabel: string;
}

export function HeroActions({ docsLabel, sampleDocLabel }: HeroActionsProps) {
  return (
    <Box className="hero-actions">
      <Button
        component="a"
        href="https://docs.astro.build"
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        startIcon={<AutoAwesomeRoundedIcon />}
        className="hero-action-btn hero-action-btn--primary"
      >
        {docsLabel}
      </Button>

      <Button
        component="a"
        href="/documents/sample-report"
        variant="outlined"
        startIcon={<DescriptionRoundedIcon />}
        className="hero-action-btn hero-action-btn--secondary"
      >
        {sampleDocLabel}
      </Button>
    </Box>
  );
}
