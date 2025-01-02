// constants/theme.ts
import { StyleSheet } from 'react-native';

export const theme = {
    colors: {
      primary: '#007AFF',
      background: '#F2F2F7',
      text: '#000000',
      secondaryText: '#6B6B6B',
      border: '#E5E5EA',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: 18,
        fontWeight: '600',
      },
      body: {
        fontSize: 16,
      },
    },
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    title: {
      ...theme.typography.title,
      marginVertical: theme.spacing.md,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.secondaryText,
      marginBottom: theme.spacing.md,
    },
    section: {
      marginVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.subtitle,
      marginBottom: theme.spacing.sm,
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    submitButton: {
      marginTop: theme.spacing.lg,
    },
  });