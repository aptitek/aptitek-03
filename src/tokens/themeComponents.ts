import { alpha, type Theme } from '@mui/material/styles';
import { M3_SHAPE_CORNERS } from './shapes';

/**
 * Material Design 3 Dynamic Component Overrides
 *
 * All styles consume theme tokens directly via style override callbacks, ensuring
 * that any registered theme (Dark, Light, Debug, or custom) is seamlessly and
 * consistently styled without redundant component code.
 */

export const m3TooltipOverrides = {
  popper: {
    zIndex: 1500,
  },
  tooltip: ({ theme }: { theme: Theme }) => ({
    backgroundColor:
      theme.palette.surfaceContainerHighest || theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: '1rem',
    borderRadius: 8,
    padding: '6px 10px',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 14px rgba(0, 0, 0, 0.45)'
        : '0 4px 14px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${theme.palette.divider}`,
    backgroundClip: 'padding-box',
    backdropFilter: 'blur(8px)',
  }),
  arrow: ({ theme }: { theme: Theme }) => ({
    color:
      theme.palette.surfaceContainerHighest || theme.palette.background.paper,
  }),
};

export const m3DatePickerComponents = {
  MuiPickersPopper: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: M3_SHAPE_CORNERS.largeIncreased,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        backgroundClip: 'padding-box',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0px 12px 32px rgba(0, 0, 0, 0.5)'
            : '0px 8px 32px rgba(0, 0, 0, 0.12)',
      }),
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 9999,
        fontWeight: 600,
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.15),
        },
        '&.Mui-selected': {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.primary.contrastText} !important`,
          fontWeight: 700,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.dark} !important`,
          },
        },
        '&.MuiPickersDay-today': {
          borderColor: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiDayCalendar: {
    styleOverrides: {
      weekDayLabel: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.text.secondary,
        fontWeight: 600,
      }),
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      label: ({ theme }: { theme: Theme }) => ({
        fontWeight: 700,
        color: theme.palette.text.primary,
      }),
      switchViewButton: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.primary.main,
      }),
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiPickersYear-yearButton': {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`,
            fontWeight: 700,
          },
        },
      }),
    },
  },
  MuiMonthCalendar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiPickersMonth-monthButton': {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`,
            fontWeight: 700,
          },
        },
      }),
    },
  },
};

export const m3DataGridComponents = {
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: M3_SHAPE_CORNERS.largeIncreased,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor:
            theme.palette.surfaceContainer || theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontWeight: 700,
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
        '& .MuiDataGrid-row.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.18),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.25),
          },
        },
        '& .MuiDataGrid-cell': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor:
            theme.palette.surfaceContainer || theme.palette.background.paper,
        },
      }),
    },
  },
};

export const m3SharedComponents = {
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
    styleOverrides: m3TooltipOverrides,
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
      },
      fontSizeSmall: {
        fontSize: '1.25rem',
      },
      fontSizeMedium: {
        fontSize: '1.5rem',
      },
      fontSizeLarge: {
        fontSize: '2rem',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: M3_SHAPE_CORNERS.full,
        textTransform: 'none',
        fontWeight: 600,
        minHeight: 40,
        '@media (pointer: coarse)': {
          minHeight: 48,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '@media (pointer: coarse)': {
          minWidth: 48,
          minHeight: 48,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: M3_SHAPE_CORNERS.full,
        fontWeight: 600,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor:
          theme.palette.surfaceContainerHigh || theme.palette.background.paper,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: M3_SHAPE_CORNERS.largeIncreased,
        backgroundColor:
          theme.palette.surfaceContainer || theme.palette.background.paper,
        backgroundImage: 'none',
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: M3_SHAPE_CORNERS.extraLargeIncreased,
        backgroundColor:
          theme.palette.surfaceContainerHigh || theme.palette.background.paper,
      }),
    },
  },
  MuiCssBaseline: {
    styleOverrides: (theme: Theme) => ({
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        scrollbarColor: `${theme.palette.text.secondary} ${theme.palette.background.default}`,
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          backgroundColor: theme.palette.text.secondary,
        },
        '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.background.default,
        },
      },
    }),
  },
  ...m3DatePickerComponents,
  ...m3DataGridComponents,
};
