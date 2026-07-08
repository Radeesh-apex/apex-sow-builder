import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface ConfigureProps {
    configureId: number|null;
    onSelect: (id: number) => void;
}
export const Configure: React.FC<ConfigureProps> = ({ configureId, onSelect }) => {

    const theme = useTheme();
    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };



    return (
        <Grid container spacing={1.5}>
            {Array.from({ length: 9 }, (_, i) => {
                const number = i + 1; // Generates 1 to 9
                const isSelected = configureId === number;
return (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={number}>
                    <Box
                        onClick={() => onSelect(number)}
                        sx={{
                            cursor: 'pointer',
                            position: 'relative',
                            borderRadius: '12px',
                            border: '1.5px solid',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: isSelected
                                ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(59, 75, 97, 0.04)')
                                : 'background.paper',
                            p: 2,
                            display: 'flex', flexDirection: 'column', gap: 1,
                            transition: 'all 0.15s ease',
                            userSelect: 'none',
                            '&:hover': {
                                borderColor: isSelected ? 'primary.main' : theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : '#BFC9D8',
                                bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.06)') : 'action.hover',
                                transform: 'translateY(-1px)',
                                boxShadow: theme.palette.mode === 'dark' ? '0 3px 10px rgba(0,0,0,0.2)' : '0 3px 10px rgba(13,30,53,0.08)',
                            },
                        }}
                    >
                        {isSelected && (
                            <CheckCircleRoundedIcon sx={{ position: 'absolute', top: 8, right: 8, fontSize: 17, color: 'primary.main' }} />
                        )}
                        <Box sx={{
                            width: 38, height: 38, borderRadius: '8px',
                            bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.10)') : (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(100, 116, 139, 0.07)'),
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            {/* Fallback text since there's no dynamic icon for numbers */}
                            <Typography sx={{ fontWeight: 700, fontSize: 16, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                                #
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'text.primary' : 'text.secondary',
                            fontSize: '0.82rem', lineHeight: 1.3,
                        }}>
                            {number} 
                        </Typography>
                    </Box>
                </Grid>
            );})}
        </Grid>
    );
}