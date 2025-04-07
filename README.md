# TV Maze by Vue

A Vue 3 application that displays TV shows data from the TVMaze API with optimized performance and responsive design.

## Features

- **TV Show Discovery**: Browse shows organized by genres
  - **Genre Organization**: Shows categorized by genres for easy browsing
  - **Trending Shows**: Highlights popular and trending content
- **Search Functionality**: Find shows by title
- **Show Details**: View comprehensive information about each show

## Key Technical Features

- **Responsive Design**: Adapts to different screen sizes
- **Virtual Scrolling**: Optimized performance for large lists
- **Image Optimization**: Lazy loading and responsive images
- **API Caching**: Efficient data fetching and storage
- **Composable Architecture**: Reusable Vue composables
- **Tailwind CSS**: Utility-first styling framework
- **TypeScript**: Type-safe development experience

### Virtual Scrolling

The application uses VueUse's `useVirtualList` composable to implement efficient horizontal scrolling for TV show lists. Key optimizations include:

- **Responsive Item Width**: Automatically adjusts item width based on screen size
- **Smooth Scrolling**: CSS properties for fluid scrolling experience
- **Efficient DOM Updates**: Only renders visible items for better performance
- **Media Query Integration**: Uses custom `useMediaQuery` composable to respond to screen size changes

### Composables

The application uses several custom composables:

- **useShowsData**: Manages fetching and organizing TV show data
- **useShowDetails**: Manages fetching and organizing show details data
- **useSearch**: Handles search functionality with debouncing
- **useMediaQuery**: Provides reactive media query state

### API Integration

The TVMaze API service includes:

- Efficient data fetching
- Response caching to reduce API calls
- Type-safe interfaces for API data

### UI Framework

The application uses Tailwind CSS for styling:

- Utility-first approach for rapid UI development
- Responsive classes for adapting to different screen sizes
- Consistent design language across components
- Custom utility classes for specific styling needs
- Dark and light theme variants with automatic switching based on system preferences

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

## Performance Considerations

### Virtual Scrolling

The virtual scrolling implementation ensures high performance even with large lists of TV shows by:

1. Only rendering items that are visible in the viewport
2. Implementing proper list recreation on media query changes
3. Setting appropriate overscan values to prevent blank areas during scrolling

### Image Loading

Images are optimized with:

1. Lazy loading to defer loading until needed
2. Responsive image selection based on device size
3. Smooth loading transitions with loading indicators

### API Caching

The application reduces API calls by:

1. Caching search results with appropriate expiration
2. Using browser caching for images
3. Efficiently organizing data to minimize duplicate fetches
