export const CONTENT_TYPES = [
  { value: 'joke', label: 'Joke' },
  { value: 'recipe', label: 'Recipe' },
  { value: 'story', label: 'Story' },
  { value: 'wallpaper', label: 'Wallpaper' },
  { value: 'video', label: 'Video' },
  { value: 'general', label: 'General' },
];

export const WALLPAPER_ORIENTATIONS = ['Portrait', 'Landscape', 'Square'];

export const VIDEO_SOURCES = ['YouTube', 'Direct Upload', 'Vimeo', 'Other Link'];

export const POST_STATUS = ['draft', 'published'];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const STORY_TYPES = [
  'Love', 'Emotional', 'Motivational', 'Moral', 'Success',
  'Life', 'Friendship', 'Family', 'Inspirational', 'Horror',
];

export const AGE_RATINGS = ['All Ages', '13+', '18+'];

export const JOKE_TYPES = ['Pun', 'One-liner', 'Story', 'Q&A', 'Dark', 'Clean'];

export const LANGUAGES = ['Gujarati', 'Hindi', 'English'];

export const CATEGORY_TYPE_COLORS = {
  joke: 'accent',
  recipe: 'success',
  story: 'default',
  wallpaper: 'default',
  video: 'destructive',
  general: 'secondary',
};
